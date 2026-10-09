import { expect, test } from '@playwright/test';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync('.cache/verbb-tests/browser.json', 'utf8'));

for (const shortcut of [false, true]) {
    test(`${shortcut ? 'Save shortcut with newer edits' : 'Save button'} waits for an autosave that has already committed`, async ({ page }) => {
        await page.goto('/index.php?p=admin/login');
        await page.getByRole('textbox', { name: 'Username or Email' }).fill('admin');
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
        await Promise.all([
            page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login'),
            page.getByRole('button', { name: 'Sign in', exact: true }).click(),
        ]);
        await page.goto(process.env.VIZY_SAVE_RACE_EDIT_PATH ?? fixture.freshAuthoring.editPath);
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        const prose = page.locator('vizy-editor').first().locator('.ProseMirror').first();
        await expect(prose).toBeVisible();
        // Let PHP commit the draft while delaying only its acknowledgement.
        let release!: () => void;
        const held = new Promise<void>((resolve) => { release = resolve; });
        let committed!: () => void;
        const saved = new Promise<void>((resolve) => { committed = resolve; });
        await page.route('**/*', async (route) => {
            const request = route.request();
            if (!decodeURIComponent(request.url()).includes('elements/save-draft')) return route.continue();
            const response = await route.fetch();
            expect(response.status()).toBe(200);
            committed();
            await held;
            await route.fulfill({ response });
        });
        const marker = `Save race ${Date.now()}`;
        await prose.locator('p').last().click();
        await page.keyboard.press('End');
        await page.keyboard.type(marker);
        await Promise.race([saved, new Promise((_, reject) => setTimeout(() => reject(new Error('No autosave committed')), 15000))]);
        const published = page.waitForResponse((response) => /elements\/(save|apply-draft)/.test(decodeURIComponent(response.url())) && !response.url().includes('save-draft') && response.request().method() === 'POST');
        const navigated = page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() });
        const later = ' — typed while autosave was pending';
        try {
            if (shortcut) {
                await page.keyboard.type(later);
                await page.keyboard.press('ControlOrMeta+s');
            } else {
                await page.getByRole('button', { name: 'Save', exact: true }).click({ noWaitAfter: true });
            }
        } finally {
            release();
        }
        expect((await published).status()).toBeLessThan(400);
        await navigated;
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('body')).not.toContainText('This Vizy content changed after it was opened');
        await page.goto(process.env.VIZY_SAVE_RACE_EDIT_PATH ?? fixture.freshAuthoring.editPath);
        await expect(prose).toContainText(shortcut ? marker + later : marker);
        expect(errors).toEqual([]);
    });
}
