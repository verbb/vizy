import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const fixture = JSON.parse(fs.readFileSync('.cache/verbb-tests/browser.json', 'utf8'));

for (const mode of ['cards', 'cards-grid', 'index']) {
    test(`Matrix ${mode} uses inline editing with isolated autosave and publication`, async ({ page }) => {
        const matrix = fixture.matrixModes[mode];
        const failures: string[] = [];
        page.on('pageerror', (error) => failures.push(error.message));
        page.on('response', (response) => {
            if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
        });
        await page.goto('/index.php?p=admin/login');
        await page.getByRole('textbox', { name: 'Username or Email' }).fill('editor');
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
        await Promise.all([
            page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login'),
            page.getByRole('button', { name: 'Sign in', exact: true }).click(),
        ]);
        await page.goto(matrix.editPath);
        const block = page.locator(`vizy-block[data-block-uid="${matrix.blockUid}"]`);
        await expect(block).toBeVisible();
        const label = block.locator(`input[name$="[${matrix.labelHandle}]"]`);
        await expect(label).toHaveValue('Matrix before');
        const state = () => {
            execFileSync('ddev', ['exec', 'php', 'tests/runtime/matrix-mode-state.php', mode]);
            return JSON.parse(fs.readFileSync('.cache/verbb-tests/matrix-mode-state.json', 'utf8'));
        };
        const before = state();
        await label.fill(`Updated ${mode}`);
        await page.evaluate(async () => {
            const $ = (window as any).jQuery;
            const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
            await owner.checkForm(false, true);
        });
        expect(state().labels).toEqual(before.labels);
        expect(Number(state().drafts)).toBeGreaterThan(0);
        await Promise.all([
            page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
            page.keyboard.press('ControlOrMeta+S'),
        ]);
        await expect.poll(() => state().labels).toEqual([`Updated ${mode}`]);
        await page.goto(matrix.editPath);
        await expect(label).toHaveValue(`Updated ${mode}`);
        expect(failures).toEqual([]);
    });
}
