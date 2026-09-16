import { expect, test, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync('.cache/verbb-tests/browser.json', 'utf8'));

async function login(page: Page, username = 'editor') {
    await page.goto('/index.php?p=admin/login');
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(username);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Username or Email' })).toHaveCount(0);
}

async function csrf(page: Page) {
    return page.evaluate(() => ({ name: (window as any).Craft.csrfTokenName, value: (window as any).Craft.csrfTokenValue }));
}

async function control(page: Page, operation: string, extra = {}) {
    const token = await csrf(page);
    const response = await page.request.post('/editor-context.php?p=admin', {
        headers: { Accept: 'application/json' }, data: { [token.name]: token.value, operation, ...extra },
    });
    expect(response.status()).toBe(200);
    return response.json();
}

function persisted() {
    execFileSync('ddev', ['exec', 'php', 'tests/runtime/browser-state.php'], { stdio: 'pipe' });
    return JSON.parse(fs.readFileSync('.cache/verbb-tests/browser-state.json', 'utf8'));
}

test('aged editor contexts survive session rotation and Craft re-login through autosave, save and reopen', async ({ page, browser }) => {
    await login(page);
    // Age the actual server-generated root and hosted contexts before the
    // frontend boots. All subsequent editor requests use ordinary product code.
    let agedTokens: Record<string, string> = {};
    let bootstrap: any;
    const navigationCsrf = await csrf(page);
    await page.route('**/index.php?**', async (route) => {
        if (!route.request().isNavigationRequest() || !route.request().url().includes('admin%2Fentries') && !route.request().url().includes('admin/entries')) {
            return route.continue();
        }
        const response = await route.fetch();
        let html = await response.text();
        const tokens = [...new Set([...html.matchAll(/editorContextToken\\*":\\*"([A-Za-z0-9_-]+)/g)].map((match) => match[1]))];
        expect(tokens.length).toBeGreaterThanOrEqual(2);
        // Read CSRF before navigation: page.evaluate() cannot run while this
        // document response is paused by the route handler.
        const agedResponse = await page.request.post('/editor-context.php?p=admin', {
            headers: { Accept: 'application/json' },
            data: { [navigationCsrf.name]: navigationCsrf.value, operation: 'age', tokens },
        });
        expect(agedResponse.status()).toBe(200);
        agedTokens = (await agedResponse.json()).tokens;
        for (const [original, aged] of Object.entries(agedTokens)) html = html.replaceAll(original, aged);
        const templates = [...html.matchAll(/<template\b[^>]*data-vizy-bootstrap[^>]*>([\s\S]*?)<\/template>/g)];
        bootstrap = templates.map((match) => JSON.parse(match[1])).find((value) => !value.hosted);
        expect(bootstrap).toBeTruthy();
        await route.fulfill({ response, body: html });
    }, { times: 1 });
    await page.goto(fixture.editPath);
    const root = page.locator('vizy-editor').first();
    const rootText = root.locator('.ProseMirror').first().locator(':scope > p').first();
    await expect(rootText).toBeVisible();
    expect(Object.keys(agedTokens).length).toBeGreaterThanOrEqual(2);
    expect(Object.values(agedTokens)).toContain(bootstrap.editorContextToken);
    const block = bootstrap.document.content.find((node: any) => node.attrs?.blockUid === fixture.blockUid);
    const payload = { editorContextToken: bootstrap.editorContextToken, items: [{
        requestId: 'lifetime-browser', documentRevision: 1, block,
        blockHash: bootstrap.initialFieldLayouts.find((layout: any) => layout.blockUid === fixture.blockUid).blockHash,
        destination: { kind: 'root' },
    }] };
    async function render(target = page, withCsrf = true, token = bootstrap.editorContextToken) {
        const key = await csrf(target);
        return target.request.post('/index.php?p=admin&action=vizy/field-layout/render-batch', {
            headers: { Accept: 'application/json' },
            data: { ...payload, editorContextToken: token, ...(withCsrf ? { [key.name]: key.value } : {}) },
        });
    }
    expect((await render(page, false)).status()).toBe(400);
    expect((await render(page, true, bootstrap.editorContextToken + '.')).status()).toBe(409);
    const session = await control(page, 'session');
    console.log('Editor-context browser runtime:', { php: session.php, craft: session.craft });
    expect((await control(page, 'regenerate')).login).toBe(session.login);
    const loads = await Promise.all([render(), render(), render()]);
    for (const response of loads) {
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.results[0].ok).toBe(true);
        expect(data.results[0].html).toContain('craft.plainText');
    }

    // Hold unsaved edits while deliberately expiring the session. Otherwise an
    // overlapping autosave can rotate guest CSRF state during Craft's login flow.
    await page.evaluate(async () => {
        const $ = (window as any).jQuery;
        const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
        if (!owner) throw new Error('Craft ElementEditor missing');
        await owner.pause();
    });
    await rootText.fill('Long session edit retained');
    const nested = page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"] vizy-editor .ProseMirror`).first();
    await nested.fill('Long session hosted edit');
    await control(page, 'expire');
    await page.evaluate(() => (window as any).Craft.cp.authManager.checkRemainingSessionTime());
    const modal = page.locator('.modal').filter({ has: page.getByRole('textbox', { name: 'Password', exact: true }) }).last();
    await expect(modal).toBeVisible();
    // Craft attaches the submit handler after its fade-in callback.
    await expect(modal.locator('craft-spinner').first()).toBeAttached();
    expect([401, 403]).toContain((await render()).status());
    await modal.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
    await modal.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(modal).toBeHidden();
    await page.evaluate(() => (window as any).Craft.cp.authManager.checkRemainingSessionTime());
    expect((await control(page, 'session')).login).not.toBe(session.login);
    await expect(rootText).toHaveText('Long session edit retained');
    await expect(nested).toHaveText('Long session hosted edit');
    const resumed = await render();
    expect(resumed.status()).toBe(200);
    expect((await resumed.json()).results[0].ok).toBe(true);

    const other = await browser.newContext({ baseURL: fixture.url, ignoreHTTPSErrors: true });
    try {
        const otherPage = await other.newPage();
        await login(otherPage, 'admin');
        expect((await render(otherPage)).status()).toBe(409);
    } finally {
        await other.close();
    }

    const acknowledgement = page.waitForResponse((response) => response.request().method() === 'POST' && decodeURIComponent(response.url()).includes('elements/save-draft'));
    // Resume Craft's normal dirty-check/autosave after re-login.
    await rootText.fill('Long session edit saved after re-login');
    const draftId = await page.evaluate(async () => {
        const $ = (window as any).jQuery;
        const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
        if (!owner) throw new Error('Craft ElementEditor missing');
        owner.resume();
        await owner.checkForm(false, true);
        return owner.settings.draftId;
    });
    expect(draftId).toBeGreaterThan(0);
    const data = await (await acknowledgement).json();
    expect(data.vizy.results).toHaveLength(1);
    expect(data.vizy.results[0]).toMatchObject({ success: true, requestKind: 'autosave' });
    expect(data.vizy.results[0].canonicalDocument.content[0].content[0].text).toBe('Long session edit saved after re-login');
    await expect(rootText).toHaveText('Long session edit saved after re-login');
    await expect(nested).toHaveText('Long session hosted edit');
    await expect.poll(() => root.evaluate((element) => (element as any).isDirty)).toBe(false);
    // Draft asset finalization intentionally remains pending until publication.
    expect(await root.evaluate((element) => (element as any).finalizationState.status)).toBe(data.vizy.results[0].finalizationStatus);
    let extraAutosaves = 0;
    page.on('request', (request) => {
        if (request.method() === 'POST' && decodeURIComponent(request.url()).includes('elements/save-draft')) extraAutosaves++;
    });
    await page.evaluate(async () => {
        const $ = (window as any).jQuery;
        const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
        for (let i = 0; i < 4; i++) await owner.checkForm(false, true);
    });
    // Craft may reconcile the accepted draft identities once, then must settle.
    expect(extraAutosaves).toBeLessThanOrEqual(1);
    await expect.poll(() => root.evaluate((element) => (element as any).isDirty)).toBe(false);
    await expect.poll(() => persisted().drafts.find((draft: any) => draft.draftId === draftId)?.document.content[0].content[0].text).toBe('Long session edit saved after re-login');
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.keyboard.press('ControlOrMeta+S'),
    ]);
    await expect.poll(() => persisted().document.content[0].content[0].text).toBe('Long session edit saved after re-login');
    const saved = persisted().document.content.find((node: any) => node.attrs?.blockUid === fixture.blockUid);
    expect(saved.attrs.fieldSlots[fixture.nestedPlacement].content[0].content[0].text).toBe('Long session hosted edit');
    await page.goto(fixture.editPath);
    await expect(rootText).toHaveText('Long session edit saved after re-login');
    await expect(nested).toHaveText('Long session hosted edit');
    await expect.poll(() => root.evaluate((element) => (element as any).fullySaved)).toBe(true);
});

test('real Block fields survive cut and undo, and autosave retains rich-text selection and history', async ({ page }) => {
    await login(page);
    await page.goto(fixture.editPath);
    const root = page.locator('vizy-editor').first();
    const heading = page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"] input[name$="[cardHeading]"]`);
    await expect(heading).toBeVisible();
    await page.evaluate(async () => {
        const $ = (window as any).jQuery;
        const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
        await owner.pause();
    });
    await heading.fill('Live heading retained by cut');
    expect(await root.evaluate((element) => (element as any).isDirty)).toBe(true);
    for (const delayed of [false, true]) {
        const copied = await root.evaluate((element, { blockUid, delayed }) => {
            const editor = (element as any).editor;
            let position = -1;
            editor.state.doc.descendants((node: any, pos: number) => {
                if (node.attrs?.blockUid === blockUid) position = pos;
            });
            if (position < 0) throw new Error('Block missing before cut');
            editor.commands.setNodeSelection(position);
            const clipboard = new DataTransfer();
            const event = new Event('cut', { bubbles: true, cancelable: true });
            Object.defineProperty(event, 'clipboardData', { value: clipboard });
            editor.view.dom.dispatchEvent(event);
            const removed = !editor.getJSON().content.some((node: any) => node.attrs?.blockUid === blockUid);
            const undone = delayed ? null : editor.commands.undo();
            return { removed, undone, data: JSON.parse(clipboard.getData('application/x-vizy-opaque-slice+json')) };
        }, { blockUid: fixture.blockUid, delayed });
        expect(copied.removed).toBe(true);
        if (delayed) {
            expect(await root.evaluate((element) => (element as any).editor.commands.undo())).toBe(true);
        } else {
            expect(copied.undone).toBe(true);
        }
        expect(copied.data.content[0].attrs.fieldSlots[fixture.headingPlacement]).toBe('Live heading retained by cut');
        await expect(heading).toHaveValue('Live heading retained by cut');
    }
    const initialText = await root.evaluate((element) => {
        const editor = (element as any).editor;
        const text = editor.state.doc.firstChild.textContent;
        editor.commands.insertContentAt(editor.state.doc.firstChild.nodeSize - 1, ' with history');
        editor.commands.setTextSelection(3);
        return text;
    });
    const acknowledgement = page.waitForResponse((response) => {
        if (response.request().method() !== 'POST' || !decodeURIComponent(response.url()).includes('elements/save-draft')) return false;
        return [...new URLSearchParams(response.request().postData() ?? '').values()].some((value) => value.includes(' with history'));
    });
    const draftId = await page.evaluate(async () => {
        const $ = (window as any).jQuery;
        const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
        owner.resume();
        await owner.checkForm(false, true);
        await owner.pause();
        return owner.settings.draftId;
    });
    const data = await (await acknowledgement).json();
    expect(data.vizy.results[0]).toMatchObject({ success: true, requestKind: 'autosave' });
    // Earlier suite cases can leave assets awaiting publication. Content is
    // saved in this draft even while their finalization correctly stays pending.
    await expect.poll(() => root.evaluate((element) => (element as any).isDirty)).toBe(false);
    expect(await root.evaluate((element) => (element as any).finalizationState.status)).toBe(data.vizy.results[0].finalizationStatus);
    const history = await root.evaluate((element) => {
        const editor = (element as any).editor;
        const selection = editor.state.selection.from;
        const undone = editor.commands.undo();
        const afterUndo = editor.state.doc.firstChild.textContent;
        const redone = editor.commands.redo();
        return { selection, undone, afterUndo, redone, afterRedo: editor.state.doc.firstChild.textContent };
    });
    expect(history).toEqual({ selection: 3, undone: true, afterUndo: initialText, redone: true, afterRedo: initialText + ' with history' });
    await expect(heading).toHaveValue('Live heading retained by cut');
    const draft = persisted().drafts.find((entry: any) => entry.draftId === draftId);
    expect(draft.document.content.find((node: any) => node.attrs?.blockUid === fixture.blockUid).attrs.fieldSlots[fixture.headingPlacement]).toBe('Live heading retained by cut');
});
