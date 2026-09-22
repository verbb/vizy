import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync('.cache/verbb-tests/browser.json', 'utf8'));

for (const timing of ['settled', 'overlapping']) test(`thirty Matrix blocks retain all ninety rows through ${timing} autosave and publication`, async ({ page }) => {
    const matrix = fixture.matrixModes.scale;
    const errors: Array<{ message: string; stack?: string }> = [];
    page.on('pageerror', (error) => errors.push({ message: error.message, stack: error.stack }));
    await page.goto('/index.php?p=admin/login');
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('editor');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
    await Promise.all([
        page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login'),
        page.getByRole('button', { name: 'Sign in', exact: true }).click(),
    ]);
    const started = Date.now();
    await page.goto(matrix.editPath);
    const labels = page.locator(`vizy-block input[name$="[${matrix.labelHandle}]"]`);
    await expect(labels).toHaveCount(90);
    await expect(labels.last()).not.toHaveValue('');
    console.log(`Matrix 30-block/90-row browser ready: ${Date.now() - started}ms`);
    const expected = await labels.evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value));
    for (const index of [0, 44, 89]) {
        expected[index] = `Changed ${timing} ${index}`;
        await labels.nth(index).fill(expected[index]);
    }
    await page.evaluate(async (timing) => {
        const $ = (window as any).jQuery;
        const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
        const save = owner.checkForm(false, true);
        if (timing === 'settled') await save;
    }, timing);
    if (timing === 'settled') await page.waitForFunction(() => {
        const $ = (window as any).jQuery;
        const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
        return !owner.queue.running && owner.queue.length === 0;
    });
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.keyboard.press('ControlOrMeta+S'),
    ]);
    execFileSync('ddev', ['exec', 'php', 'tests/runtime/matrix-mode-state.php', 'scale']);
    const saved = JSON.parse(fs.readFileSync('.cache/verbb-tests/matrix-mode-state.json', 'utf8'));
    expect(saved.labels).toEqual(expected);
    await page.goto(matrix.editPath);
    await expect(labels).toHaveCount(90);
    await expect(labels.last()).toHaveValue(`Changed ${timing} 89`);
    expect(await labels.evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value))).toEqual(expected);
    // Native Matrix also rejects pending layout work during submission. Keep
    // that diagnostic visible without conflating it with content preservation.
    const errorPath = test.info().outputPath('browser-errors.json');
    fs.writeFileSync(errorPath, JSON.stringify(errors, null, 2));
    await test.info().attach('browser-errors', {
        path: errorPath,
        contentType: 'application/json',
    });
});
