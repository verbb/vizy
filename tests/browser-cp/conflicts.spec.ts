import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync(process.env.VIZY_CONFLICT_FIXTURE ?? '.cache/verbb-tests/browser.json', 'utf8'));
async function login(page: Page, username: string) {
    await page.goto('/index.php?p=admin/login');
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(username);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login');
}

for (const autosave of [true, false]) {
    test(`${autosave ? 'Autosave' : 'Final Save'} conflicts retain nested edits and stop repeated writes`, async ({ page, browser }) => {
        const entry = fixture.conflicts[autosave ? 1 : 0];
        const staleContext = await browser.newContext({ ignoreHTTPSErrors: true, baseURL: fixture.url });
        const stale = await staleContext.newPage();
        try {
            await login(page, 'admin');
            await page.goto(entry.editPath);
            await expect(page.getByRole('button', { name: 'Add Conflict feature', exact: true })).toBeVisible();
            if (await page.getByRole('group', { name: 'Conflict feature', exact: true }).count() === 0) {
                await page.getByRole('button', { name: 'Add Conflict feature', exact: true }).click();
                await page.getByRole('button', { name: 'New entry', exact: true }).click();
            }
            await page.getByRole('textbox', { name: 'Row label', exact: true }).fill('Original row');
            await page.getByRole('button', { name: 'Save', exact: true }).click();
            await page.waitForURL((url) => url.searchParams.get('p')?.endsWith('content/entries') ?? false);
            await page.goto(entry.editPath);
            await login(stale, 'conflictEditor');
            await stale.goto(entry.editPath);
            await expect(stale.getByRole('textbox', { name: 'Row label', exact: true })).toHaveValue('Original row');
            const prose = page.locator('vizy-editor .ProseMirror').first();
            await prose.locator('p').first().click();
            await page.keyboard.press('End');
            await page.keyboard.type(' Published by the first editor.');
            await page.getByRole('button', { name: 'Save', exact: true }).click();
            await page.waitForURL((url) => url.searchParams.get('p')?.endsWith('content/entries') ?? false);

            // A failed network autosave leaves the next ordinary Save responsible
            // for discovering the conflict. No editor internals are mutated.
            if (!autosave) await stale.route('**/*', (route) => decodeURIComponent(route.request().url()).includes('elements/save-draft') ? route.abort() : route.continue());
            const conflictResponse = stale.waitForResponse((r) => r.status() === 409);
            const failedAutosave = !autosave ? stale.waitForEvent('requestfailed', { predicate: (r) => decodeURIComponent(r.url()).includes('elements/save-draft') }) : null;
            await stale.getByRole('textbox', { name: 'Row label', exact: true }).fill('My unsaved nested row');
            if (!autosave) {
                await failedAutosave;
                await stale.unrouteAll();
                // Wait for Craft to finish reporting the deliberately failed request.
                await expect(stale.locator('.revision-status.alert-icon')).toBeVisible();
                await stale.getByRole('button', { name: 'Save', exact: true }).click();
            }
            const result = await (await conflictResponse).json();
            expect(result.vizy.conflict.code).toBe('contentChanged');
            expect(result).not.toHaveProperty('trace');
            const alert = stale.locator('[data-vizy-save-notice]');
            await expect(alert).toBeVisible();
            await test.info().attach('conflict-recovery', { body: await stale.screenshot(), contentType: 'image/png' });
            await expect(stale.getByRole('textbox', { name: 'Row label', exact: true })).toHaveValue('My unsaved nested row');
            let writes = 0;
            stale.on('request', (r) => { if (r.method() === 'POST' && /elements\/(save|apply)/.test(decodeURIComponent(r.url()))) writes++; });
            await stale.getByRole('button', { name: 'Save', exact: true }).click();
            await stale.keyboard.press('ControlOrMeta+s');
            await stale.getByRole('textbox', { name: 'Row label', exact: true }).fill('Still retained after conflict');
            await stale.waitForTimeout(1500);
            expect(writes).toBe(0);
            const downloadEvent = stale.waitForEvent('download');
            await stale.getByRole('button', { name: 'Download unsaved content', exact: true }).click();
            const download = await downloadEvent;
            const exported = fs.readFileSync((await download.path())!, 'utf8');
            expect(exported).toContain('Still retained after conflict');
            expect(exported).not.toContain('_storageToken');
            const latestEvent = stale.waitForEvent('popup');
            await stale.getByRole('button', { name: 'View latest saved version', exact: true }).click();
            const latest = await latestEvent;
            await expect(latest.locator('body')).toContainText('Published by the first editor.');
            await latest.close();
            stale.once('dialog', (dialog) => dialog.dismiss());
            await stale.getByRole('button', { name: 'Discard changes and reload', exact: true }).click();
            await expect(stale.getByRole('textbox', { name: 'Row label', exact: true })).toHaveValue('Still retained after conflict');
            await page.goto(entry.editPath);
            await expect(page.locator('vizy-editor .ProseMirror').first()).toContainText('Published by the first editor.');
            await expect(page.getByRole('textbox', { name: 'Row label', exact: true })).toHaveValue('Original row');
            stale.once('dialog', (dialog) => dialog.accept());
            const reloaded = stale.waitForEvent('framenavigated', { predicate: (frame) => frame === stale.mainFrame() });
            await stale.getByRole('button', { name: 'Discard changes and reload', exact: true }).click();
            await reloaded;
            await expect(stale.locator('[data-vizy-save-notice]')).toHaveCount(0);
            await expect(stale.getByRole('textbox', { name: 'Row label', exact: true })).toHaveValue('Original row');
        } finally { await staleContext.close(); }
    });
}

test('normal saves, validation recovery and duplication retain Craft action routing', async ({ page }) => {
    await login(page, 'admin');
    await page.goto(fixture.conflicts[2].editPath);
    const title = page.getByRole('textbox', { name: /^Title Required/ });
    const prose = page.locator('vizy-editor .ProseMirror').first();
    await prose.locator('p').first().click();
    await page.keyboard.press('End');
    await page.keyboard.type(' Retain this after validation.');
    await title.fill('');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.locator('[data-vizy-save-notice]')).toContainText('Title');
    await expect(prose).toContainText('Retain this after validation.');
    await title.fill('Normal save checks');
    const continued = page.waitForEvent('framenavigated', { predicate: (f) => f === page.mainFrame() });
    await page.keyboard.press('ControlOrMeta+s');
    await continued;
    await expect(prose).toContainText('Retain this after validation.');
    await page.getByRole('button', { name: 'More actions', exact: true }).click();
    const duplicated = page.waitForURL((url) => url.searchParams.has('draftId'));
    await page.getByRole('button', { name: 'Save as a new entry', exact: true }).click();
    await duplicated;
    await expect(page.getByRole('button', { name: 'Create entry', exact: true })).toBeVisible();
    await expect(prose).toContainText('Retain this after validation.');
    await title.fill('Conflict recovery copy');
    await page.getByRole('textbox', { name: /^Slug/ }).fill(`conflict-copy-${Date.now()}`);
    await page.getByRole('button', { name: 'Create entry', exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get('p')?.endsWith('content/entries') ?? false);
});
