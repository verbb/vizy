import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const runtime = path.join(root, '.cache/verbb-tests');
const runId = randomUUID();
const done = path.join(runtime, `browser-done-${runId}`);
const args = process.argv.slice(2);
const runtimeArgs = args.filter((arg) => arg.startsWith('--profile=') || arg.startsWith('--database='));
const browserArgs = args.filter((arg) => !runtimeArgs.includes(arg));
const provision = spawn('ddev', ['test', '--task=browser', ...runtimeArgs, `--browser-run=${runId}`], { cwd: root, stdio: 'inherit' });
let provisionExit;
const provisionDone = new Promise((resolve) => provision.on('exit', (code) => { provisionExit = code ?? 1; resolve(provisionExit); }));
let result = 1;
try {
    const deadline = Date.now() + 300_000;
    for (;;) {
        if (provisionExit !== undefined) throw new Error(`Browser provisioning exited ${provisionExit}`);
        let metadata;
        try { metadata = JSON.parse(fs.readFileSync(path.join(runtime, 'browser.json'), 'utf8')); } catch {}
        if (metadata?.runId === runId) break;
        if (Date.now() > deadline) throw new Error('Browser provisioning timed out');
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
    const browser = spawn(path.join(root, 'node_modules/.bin/playwright'), ['test', '--config=playwright.cp.config.ts', ...browserArgs], { cwd: root, stdio: 'inherit' });
    result = await new Promise((resolve) => browser.on('exit', (code) => resolve(code ?? 1)));
} finally {
    fs.mkdirSync(runtime, { recursive: true });
    fs.writeFileSync(done, 'finished');
    await provisionDone;
    fs.rmSync(done, { force: true });
}
process.exit(result);
