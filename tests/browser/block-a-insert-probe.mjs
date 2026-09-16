/**
 * Hard-timeout probe for Block A insert on the live CP entry.
 * Never uses Cursor browser MCP — always exits within WALL_MS.
 *
 * Inserts a leaf vizyBlock (Hosted nesting via fieldSlots only — no vizySlot).
 *
 * Usage: node tests/browser/block-a-insert-probe.mjs
 */
import { chromium } from '@playwright/test';

const URL = process.env.VIZY_PROBE_URL
    ?? 'https://vizy-react.test/admin/content/entries/vizy/4-vizy-value';
const WALL_MS = Number(process.env.VIZY_PROBE_WALL_MS ?? 45000);
const INSERT_MS = Number(process.env.VIZY_PROBE_INSERT_MS ?? 5000);
const BLOCK_A = 'a7a0e808-1a82-47e4-8499-ce602e51c40f';

const log = (...args) => console.log(`[probe ${new Date().toISOString().slice(11, 19)}]`, ...args);

function raceTimeout(promise, ms, label) {
    let timer;
    return Promise.race([
        promise.finally(() => clearTimeout(timer)),
        new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(`TIMEOUT:${label}:${ms}ms`)), ms);
        }),
    ]);
}

async function main() {
    const wall = setTimeout(() => {
        console.error('[probe] WALL CLOCK exceeded — force exit');
        process.exit(2);
    }, WALL_MS);
    wall.unref?.();

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(8000);
    page.setDefaultNavigationTimeout(15000);

    try {
        log('goto', URL);
        await page.goto(URL, { waitUntil: 'domcontentloaded' });
        await raceTimeout(
            page.waitForFunction(() => {
                const el = document.querySelector('vizy-editor');
                return Boolean(el?.editor && !el.editor.isDestroyed);
            }, { timeout: 15000 }),
            16000,
            'editor-ready',
        );

        const before = await page.evaluate(() => {
            const editor = document.querySelector('vizy-editor').editor;
            let blocks = 0;
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'vizyBlock') blocks += 1;
            });
            const bundle = [...document.scripts]
                .map((s) => s.src)
                .find((src) => /vizy-[A-Za-z0-9_-]+\.js/.test(src));
            return { blocks, docSize: editor.state.doc.content.size, bundle };
        });
        log('before', JSON.stringify(before));

        log(`inserting leaf Block A (budget ${INSERT_MS}ms)`);
        const insertResult = await raceTimeout(
            page.evaluate(({ blockA }) => {
                const editor = document.querySelector('vizy-editor').editor;
                const uid = crypto.randomUUID();
                // TipTap leaf — Hosted nesting (if any) mounts inside FieldLayout, not slot children.
                const nodeJson = {
                    type: 'vizyBlock',
                    attrs: {
                        blockUid: uid,
                        blockTypeUid: blockA,
                        enabled: true,
                        fieldSlots: {},
                    },
                    content: [],
                };
                const ok = editor
                    .chain()
                    .focus(undefined, { scrollIntoView: false })
                    .insertContentAt(editor.state.doc.content.size, nodeJson, { updateSelection: true })
                    .run();
                // Macrotask sentinel: an infinite microtask remount never reaches this.
                window.__vizyProbeMacro = false;
                setTimeout(() => { window.__vizyProbeMacro = true; }, 0);
                let blocks = 0;
                editor.state.doc.descendants((node) => {
                    if (node.type.name === 'vizyBlock') blocks += 1;
                });
                return { ok, blocks, uid };
            }, { blockA: BLOCK_A }),
            INSERT_MS,
            'insert',
        );
        log('insert', JSON.stringify(insertResult));

        let macro = false;
        for (let i = 0; i < 20; i += 1) {
            const state = await raceTimeout(
                page.evaluate((uid) => {
                    const el = document.querySelector(`vizy-block[data-block-uid="${CSS.escape(uid)}"]`);
                    const sr = el?.shadowRoot;
                    return {
                        macro: window.__vizyProbeMacro === true,
                        hasSpinner: Boolean(sr?.querySelector('pk-spinner')),
                        height: el ? Math.round(el.getBoundingClientRect().height) : null,
                    };
                }, insertResult.uid),
                1000,
                `poll-${i}`,
            );
            log('poll', JSON.stringify(state));
            if (state.macro) {
                macro = true;
                if (!state.hasSpinner) log('WARN spinner missing');
                if (state.height != null && state.height > 48) log('WARN loading height large', state.height);
                break;
            }
            await new Promise((r) => setTimeout(r, 50));
        }

        if (!macro) throw new Error('macrotask never reached — microtask loop still present');
        log('PASS');
        process.exitCode = 0;
    } catch (error) {
        log('FAIL', String(error));
        process.exitCode = 1;
    } finally {
        await Promise.race([
            browser.close(),
            new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);
        clearTimeout(wall);
    }
}

main().then(() => process.exit(process.exitCode ?? 0));
