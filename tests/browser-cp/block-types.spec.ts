import { expect, test, type Page, type Request, type Response } from '@playwright/test';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function login(page: Page) {
    await page.goto('/index.php?p=admin/login');
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
    await Promise.all([
        page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login', { waitUntil: 'domcontentloaded' }),
        page.getByRole('button', { name: 'Sign in', exact: true }).click(),
    ]);
}

async function saveAndContinue(page: Page) {
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.keyboard.press('ControlOrMeta+S'),
    ]);
    await page.waitForLoadState('domcontentloaded');
}

function isActionResponse(response: Response) {
    const url = new URL(response.url());
    return url.pathname.includes('/actions/') || url.searchParams.has('action');
}

function legacyFieldLayoutRequest(request: Request) {
    const requestText = decodeURIComponent(`${request.url()} ${request.postData() ?? ''}`);
    return requestText.includes('elements/update-field-layout');
}

async function layoutConfig(page: Page) {
    const designer = page.locator('.layoutdesigner').first();
    await expect(designer).toBeVisible();
    return JSON.parse(await designer.locator('input[data-config-input]').inputValue());
}

test('global Block Types create and edit without legacy FieldLayout requests or 400s', async ({ page }) => {
    await login(page);

    const pageErrors: string[] = [];
    const legacyRequests: string[] = [];
    const failedActionResponses: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('request', (request) => {
        if (legacyFieldLayoutRequest(request)) legacyRequests.push(request.url());
    });
    page.on('response', (response) => {
        if (response.status() >= 400 && isActionResponse(response)) {
            failedActionResponses.push(`${response.status()} ${response.url()}`);
        }
    });

    await page.goto('/index.php?p=admin/vizy/settings/block-types/new');
    await expect(page.getByRole('heading', { name: 'New Block Type' })).toBeVisible();

    const blockTypeUid = await page.locator('input[name="uid"]').inputValue();
    const initialLayout = await layoutConfig(page);
    expect(blockTypeUid).toMatch(uuidPattern);
    expect(initialLayout.uid).toMatch(uuidPattern);
    expect(initialLayout.tabs).toHaveLength(1);
    expect(initialLayout.tabs[0].uid).toMatch(uuidPattern);
    expect(JSON.stringify(initialLayout)).not.toContain('new1');

    const suffix = Date.now().toString(36);
    const originalName = `FieldLayout request ${suffix}`;
    const updatedName = `FieldLayout request updated ${suffix}`;
    await page.locator('input[name="name"]').fill(originalName);
    await page.locator('input[name="handle"]').fill(`fieldLayoutRequest${suffix}`);
    await saveAndContinue(page);

    expect(decodeURIComponent(page.url())).toContain(`/vizy/settings/block-types/${blockTypeUid}`);
    await expect(page.locator('input[name="name"]')).toHaveValue(originalName);
    await expect(page.locator('input[name="uid"]')).toHaveValue(blockTypeUid);
    const savedLayout = await layoutConfig(page);
    expect(savedLayout.uid).toBe(initialLayout.uid);
    expect(savedLayout.tabs[0].uid).toBe(initialLayout.tabs[0].uid);

    await page.locator('input[name="name"]').fill(updatedName);
    await saveAndContinue(page);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('input[name="name"]')).toHaveValue(updatedName);
    await expect(page.locator('input[name="uid"]')).toHaveValue(blockTypeUid);
    expect((await layoutConfig(page)).uid).toBe(initialLayout.uid);

    expect(pageErrors).toEqual([]);
    expect(legacyRequests).toEqual([]);
    expect(failedActionResponses).toEqual([]);
});
