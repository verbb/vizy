import { expect, test } from '@playwright/test';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync('.cache/verbb-tests/browser.json', 'utf8'));

test('first JSON block and blocks inside newly created Matrix rows initialize and survive publication', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/index.php?p=admin/login');
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
    await Promise.all([
        page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login'),
        page.getByRole('button', { name: 'Sign in', exact: true }).click(),
    ]);
    await page.goto(fixture.freshAuthoring.editPath);
    expect(await page.evaluate(() => typeof (window as any).CodeMirror)).toBe('undefined');
    await page.getByRole('button', { name: 'Add Block', exact: true }).click();
    await page.getByRole('option', { name: 'Card', exact: true }).click();
    const rootBlock = page.locator('vizy-block').first();
    await rootBlock.getByRole('textbox', { name: /^Card heading/ }).fill('First block on a new site');
    await rootBlock.getByText('Structured JSON', { exact: true }).scrollIntoViewIfNeeded();
    const codeMirror = rootBlock.locator('.CodeMirror');
    await expect(codeMirror).toBeVisible();
    await codeMirror.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.type('{"cold":true,"stops":["Coast","Forest"]}');
    const matrix = page.locator('#fields-freshChapters-field');
    await matrix.getByRole('button', { name: 'New entry', exact: true }).click();
    const rowEditor = matrix.locator('vizy-editor').first();
    await rowEditor.getByRole('button', { name: 'Add Block', exact: true }).click();
    await page.getByRole('option', { name: 'Card', exact: true }).click();
    await matrix.getByRole('textbox', { name: /^Card heading/ }).fill('First block in a new Matrix row');
    await expect(page.getByText('Block fields could not load', { exact: true })).toHaveCount(0);
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.getByRole('button', { name: 'Save', exact: true }).click(),
    ]);
    await page.goto(fixture.freshAuthoring.editPath);
    await expect(rootBlock.getByRole('textbox', { name: /^Card heading/ })).toHaveValue('First block on a new site');
    await expect(matrix.getByRole('textbox', { name: /^Card heading/ })).toHaveValue('First block in a new Matrix row');
    const json = await rootBlock.locator('textarea[name$="[structuredJson]"]').inputValue();
    expect(JSON.parse(json)).toEqual({ cold: true, stops: ['Coast', 'Forest'] });
    await test.info().attach('browser-errors', { body: JSON.stringify(errors, null, 2), contentType: 'application/json' });
    // Keep Craft's existing submission diagnostic visible, as in the Matrix
    // integration cases; content, dependency and field-mount failures still fail.
    expect(errors.filter((message) => message !== 'Form already being submitted.')).toEqual([]);
});
