import { expect, test, type Locator, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync('.cache/verbb-tests/browser.json', 'utf8'));

async function login(page: Page, username = 'admin') {
    await page.goto('/index.php?p=admin/login');
    await page.getByRole('textbox', { name: 'Username or Email' }).fill(username);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
    // Authentication and the destination page can outlast a UI assertion's
    // polling window on a cold Craft app. Wait for the actual navigation.
    await Promise.all([
        page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login', { waitUntil: 'domcontentloaded' }),
        page.getByRole('button', { name: 'Sign in', exact: true }).click(),
    ]);
    await expect(page.getByRole('textbox', { name: 'Username or Email' })).toHaveCount(0);
}

async function openOwner(page: Page) {
    await page.goto(fixture.editPath);
    await expect(page.locator('vizy-editor').first().locator('.ProseMirror').first()).toBeVisible();
}

async function openConditionOwner(page: Page) {
    await page.goto(fixture.conditions.editPath);
    await expect(page.locator(`vizy-block[data-block-uid="${fixture.conditions.blockUid}"]`)).toBeVisible();
}

async function openJsonOwner(page: Page) {
    await page.goto(fixture.json.editPath);
    await expect(page.locator(`vizy-block[data-block-uid="${fixture.json.blockUid}"]`)).toBeVisible();
}

test('field settings expose one Block picker display policy and one shared search switch', async ({ page }) => {
    await login(page);
    await page.goto(`/index.php?p=admin/settings/fields/edit/${fixture.fieldId}`);

    const display = page.locator('select[name$="[blockPickerDisplay]"]');
    const defaultDisplay = page.locator('select[name$="[defaultBlockPickerView]"]');
    const search = page.locator('input[name$="[showBlockSearch]"][value="1"]');
    await expect(display).toHaveValue('both');
    await expect(defaultDisplay).toHaveValue('list');
    await expect(defaultDisplay).toBeVisible();
    await expect(search).toHaveCount(1);

    await display.selectOption('grid');
    await expect(defaultDisplay).toBeHidden();
    await display.selectOption('both');
    await expect(defaultDisplay).toBeVisible();
});

test('Editor Configs expose one shared icon override per control', async ({ page }) => {
    await login(page);
    await page.goto('/index.php?p=admin/vizy/settings/editor-configs/standard');

    await expect(page.getByRole('heading', { name: 'Toolbar icons' })).toBeVisible();
    const control = page.locator('select[data-icon-control]');
    await expect(control).toBeVisible();
    await expect(control.locator('option[value="bold"]')).toHaveCount(1);
    await expect(control.locator('option[value="separator"]')).toHaveCount(0);
    await control.selectOption('bold');

    await expect(page.locator('[data-icon-picker] pk-image-browser')).toBeVisible();
    await expect(page.locator('input[name="iconsJson"]')).toHaveValue('{}');
    await expect(page.locator('[data-builder-list="toolbar-active"] [data-toolbar-item="bold"] svg')).toBeVisible();
});

async function setJsonValue(textarea: Locator, value: unknown) {
    await textarea.evaluate((control, nextValue) => {
        const input = control as HTMLTextAreaElement & {
            CodeMirror?: { setValue?: (value: string) => void; save?: () => void };
        };
        const codeMirror = input.CodeMirror ?? (input.nextElementSibling as HTMLElement & {
            CodeMirror?: { setValue?: (value: string) => void; save?: () => void };
        } | null)?.CodeMirror;
        const encoded = JSON.stringify(nextValue, null, 2);
        codeMirror?.setValue?.(encoded);
        codeMirror?.save?.();
        if (!codeMirror) input.value = encoded;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }, value);
}

function persisted() {
    execFileSync('ddev', ['exec', 'php', 'tests/runtime/browser-state.php'], { stdio: 'pipe' });
    return JSON.parse(fs.readFileSync('.cache/verbb-tests/browser-state.json', 'utf8'));
}

async function save(page: Page, expectedText = 'Root after') {
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.keyboard.press('ControlOrMeta+S'),
    ]);
    await page.waitForLoadState('domcontentloaded');
    await expect.poll(() => persisted().document.content[0].content[0].text).toBe(expectedText);
}

async function saveCurrentOwner(page: Page) {
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.keyboard.press('ControlOrMeta+S'),
    ]);
    await page.waitForLoadState('domcontentloaded');
}

test('opening Matrix and Hosted Vizy does not create an unsolicited autosave draft', async ({ page }) => {
    await login(page, 'editor');
    const before = persisted();
    await openOwner(page);
    await expect(page.locator(`vizy-block[data-block-uid="${fixture.matrix.blockUid}"] input[name$="[${fixture.matrix.labelHandle}]"]`)).toHaveValue('Matrix before');
    await expect(page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"] vizy-editor .ProseMirror`)).toContainText('Nested before');
    await checkAutosave(page);
    expect(persisted().drafts).toEqual(before.drafts);
    expect(persisted().document).toEqual(before.document);
    expect(persisted().matrixRows).toEqual(before.matrixRows);
});

test('real Craft fields flush root, hosted text and a required block field through save and reopen', async ({ page }) => {
    await login(page, 'editor');
    await openOwner(page);
    const root = page.locator('vizy-editor').first();
    const block = page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"]`);
    const heading = block.locator('input[name$="[cardHeading]"]');
    await expect(heading).toHaveValue('Heading before');
    const hosted = block.locator('vizy-editor .ProseMirror');
    await expect(hosted).toContainText('Nested before');
    await root.locator('.ProseMirror').first().locator(':scope > p').first().fill('Root after');
    await heading.fill('Heading after');
    await hosted.fill('Nested after');
    await save(page);
    const state = persisted();
    const slots = state.document.content.find((node: any) => node.type === 'vizyBlock').attrs.fieldSlots;
    expect(slots[fixture.headingPlacement]).toBe('Heading after');
    expect(slots[fixture.nestedPlacement].content[0].content[0].text).toBe('Nested after');
    expect(slots[fixture.relatedPlacement]).toEqual([fixture.relatedId]);
    expect(state.html).toContain('<p>Root after</p>');
    await openOwner(page);
    await expect(heading).toHaveValue('Heading after');
    await expect(hosted).toContainText('Nested after');
});

test('a dismissible Craft Tip inside a Block dismisses and stays dismissed after save and reopen', async ({ page }) => {
    const pageErrors: string[] = [];
    const failedActionResponses: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('response', (response) => {
        if (response.status() >= 400 && response.url().includes('action=')) {
            failedActionResponses.push(`${response.status()} ${response.url()}`);
        }
    });

    await login(page, 'editor');
    await openOwner(page);
    const block = page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"]`);
    const tip = block.locator(`[data-vizy-tip-uid="${fixture.dismissibleTip.uid}"]`);
    await expect(tip).toContainText(fixture.dismissibleTip.text);
    await tip.getByRole('button', { name: 'Dismiss', exact: true }).click();
    await expect(tip).toHaveCount(0);
    await expect.poll(() => page.evaluate((uid) => (
        (window as any).Craft.getLocalStorage('dismissedTips', []).includes(uid)
    ), fixture.dismissibleTip.uid)).toBe(true);

    await saveCurrentOwner(page);
    await openOwner(page);
    await expect(tip).toHaveCount(0);
    expect(pageErrors).toEqual([]);
    expect(failedActionResponses).toEqual([]);
});

test('Craft-native Block conditions reveal, hide, preserve and reopen sibling field values', async ({ page }) => {
    await login(page, 'editor');
    await openConditionOwner(page);
    const block = page.locator(`vizy-block[data-block-uid="${fixture.conditions.blockUid}"]`);
    const toggle = block.locator(`[data-vizy-field-handle="${fixture.conditions.toggleHandle}"] .lightswitch`);
    const details = block.locator(`input[name$="[${fixture.conditions.detailsHandle}]"]`);

    await expect(toggle).toBeVisible();
    await expect(details).toHaveCount(0);
    await toggle.click();
    await expect(details).toBeVisible();
    await details.fill('Condition value survives');
    await toggle.click();
    await expect(details).toHaveCount(0);
    // Let Craft finish its normal draft reconciliation before publishing. A
    // Ctrl+S while checkForm() is still rotating the draft version can submit
    // the previous content version and correctly trigger Craft's stale guard.
    await checkAutosave(page);
    await saveCurrentOwner(page);

    await openConditionOwner(page);
    await expect(details).toHaveCount(0);
    await toggle.click();
    await expect(details).toHaveValue('Condition value survives');
    await toggle.click();
    await expect(details).toHaveCount(0);
});

test('root and Block JSON fields load beside Vizy, save, reopen and autosave independently', async ({ page }) => {
    await login(page, 'editor');
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await openJsonOwner(page);
    expect(pageErrors.filter((message) => /defineSimpleMode|CodeMirror/i.test(message))).toEqual([]);
    await expect(page.locator('vizy-editor').first().locator('.ProseMirror').first()).toBeVisible();

    const block = page.locator(`vizy-block[data-block-uid="${fixture.json.blockUid}"]`);
    const json = block.locator(`textarea[name$="[${fixture.json.fieldHandle}]"]`);
    const rootJson = page.locator(`textarea[name="fields[${fixture.json.rootFieldHandle}]"]`);
    const jsonText = block.locator(`textarea[name$="[${fixture.json.textHandle}]"]`);
    expect(JSON.parse(await json.inputValue())).toEqual(fixture.json.value);
    expect(JSON.parse(await rootJson.inputValue())).toEqual(fixture.json.rootValue);
    await expect(jsonText).toHaveValue(fixture.json.textValue);

    const savedJson = { enabled: false, count: 3, nested: { colors: ['green'], literal: '{"still":"data"}' } };
    const savedRootJson = { scope: 'entry', enabled: false, items: [{ id: 1 }, { id: 2 }] };
    const savedText = '[{"kept":"as text"},{"count":3}]';
    await setJsonValue(json, savedJson);
    await setJsonValue(rootJson, savedRootJson);
    await jsonText.fill(savedText);
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.keyboard.press('ControlOrMeta+S'),
    ]);
    await page.waitForLoadState('domcontentloaded');
    const canonicalSlots = () => persisted().jsonOwner.document.content
        .find((node: any) => node.attrs?.blockUid === fixture.json.blockUid).attrs.fieldSlots;
    await expect.poll(() => canonicalSlots()[fixture.json.placement]).toEqual(savedJson);
    expect(persisted().jsonOwner.rootJson).toEqual(savedRootJson);
    expect(canonicalSlots()[fixture.json.textPlacement]).toBe(savedText);

    await openJsonOwner(page);
    expect(JSON.parse(await json.inputValue())).toEqual(savedJson);
    expect(JSON.parse(await rootJson.inputValue())).toEqual(savedRootJson);
    await expect(jsonText).toHaveValue(savedText);
    const canonical = persisted().jsonOwner.document;
    const draftJson = { draft: true, items: [{ id: 1 }, { id: 2 }] };
    const draftRootJson = { scope: 'draft', settings: { enabled: true } };
    const draftText = '{"draft":true,"still":"plain text"}';
    await setJsonValue(json, draftJson);
    await setJsonValue(rootJson, draftRootJson);
    await jsonText.fill(draftText);
    const draftId = await checkAutosave(page);
    expect(draftId).toBeGreaterThan(0);
    const draftSlots = () => persisted().jsonOwner.drafts
        .find((draft: any) => draft.draftId === draftId)?.document.content
        .find((node: any) => node.attrs?.blockUid === fixture.json.blockUid)?.attrs.fieldSlots;
    const draftRoot = () => persisted().jsonOwner.drafts
        .find((draft: any) => draft.draftId === draftId)?.rootJson;
    await expect.poll(() => draftSlots()?.[fixture.json.placement]).toEqual(draftJson);
    expect(draftRoot()).toEqual(draftRootJson);
    expect(draftSlots()[fixture.json.textPlacement]).toBe(draftText);
    expect(persisted().jsonOwner.document).toEqual(canonical);
    expect(persisted().jsonOwner.rootJson).toEqual(savedRootJson);
    expect(pageErrors).toEqual([]);
});

test('real HTTP middleware refuses a CP action without CSRF', async ({ page }) => {
    await login(page);
    const response = await page.request.post('/index.php?p=admin&action=vizy/assets/info', {
        headers: { Accept: 'application/json' }, data: { assetId: 1 },
    });
    expect(response.status()).toBe(400);
    expect(await response.text()).toMatch(/verify|CSRF/i);
});

test('a required hosted field blocks saving without discarding edits or changing canonical content', async ({ page }) => {
    await login(page, 'editor');
    await openOwner(page);
    const before = persisted().document;
    const heading = page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"] input[name$="[cardHeading]"]`);
    const rootText = page.locator('vizy-editor').first().locator('.ProseMirror').first().locator(':scope > p').first();
    await heading.fill('');
    await rootText.fill('Unsaved validation edit');
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.keyboard.press('ControlOrMeta+S'),
    ]);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('link', { name: 'Card heading cannot be blank.', exact: true })).toBeVisible();
    await expect(heading).toHaveValue('');
    await expect(rootText).toHaveText('Unsaved validation edit');
    expect(persisted().document).toEqual(before);
    await heading.fill('Recovered heading');
    await save(page, 'Unsaved validation edit');
    const recovered = persisted().document;
    expect(recovered.content.find((node: any) => node.type === 'vizyBlock').attrs.fieldSlots[fixture.headingPlacement]).toBe('Recovered heading');
    await openOwner(page);
    await expect(heading).toHaveValue('Recovered heading');
    await expect(rootText).toHaveText('Unsaved validation edit');
});

for (const username of ['admin', 'editor']) {
    test(`asset metadata HTTP endpoint ${username === 'admin' ? 'returns the uploader’s asset' : 'denies another editor without disclosure'}`, async ({ page }) => {
        await login(page, username);
        const csrf = await page.evaluate(() => ({
            name: (window as any).Craft.csrfTokenName,
            value: (window as any).Craft.csrfTokenValue,
        }));
        expect(csrf.name).toBeTruthy();
        expect(csrf.value).toBeTruthy();
        const response = await page.request.post('/index.php?p=admin&action=vizy/assets/info', {
            headers: { Accept: 'application/json' },
            form: { assetId: String(fixture.privateAsset.id), [csrf.name]: csrf.value },
        });
        if (username === 'admin') {
            expect(response.status()).toBe(200);
            expect(await response.json()).toMatchObject(fixture.privateAsset);
        } else {
            expect(response.status()).toBe(403);
            const body = await response.text();
            expect(body).not.toContain(fixture.privateAsset.uid);
            expect(body).not.toContain(fixture.privateAsset.filename);
        }
    });
}

test('Matrix row edits survive the real widget flush and reopen with their identity intact', async ({ page }) => {
    await login(page, 'editor');
    await openOwner(page);
    const before = persisted();
    const label = page.locator(`vizy-block[data-block-uid="${fixture.matrix.blockUid}"] input[name$="[${fixture.matrix.labelHandle}]"]`);
    await expect(label).toHaveValue('Matrix before');
    await label.fill('Matrix after');
    await save(page, before.document.content[0].content[0].text);
    await expect.poll(() => persisted().matrixRows).toEqual([{ id: fixture.matrix.rowId, label: 'Matrix after' }]);
    const block = persisted().document.content.find((node: any) => node.attrs?.blockUid === fixture.matrix.blockUid);
    expect(block.attrs.matrixAnchorUid).toBe(fixture.matrix.anchorUid);
    expect(Object.keys(block.attrs.fieldSlots)).toEqual([]);
    await openOwner(page);
    await expect(label).toHaveValue('Matrix after');
});

test('failed owner validation retains pending Matrix edits and leaves saved rows untouched', async ({ page }) => {
    await login(page, 'editor');
    await openOwner(page);
    const before = persisted();
    const label = page.locator(`vizy-block[data-block-uid="${fixture.matrix.blockUid}"] input[name$="[${fixture.matrix.labelHandle}]"]`);
    const heading = page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"] input[name$="[cardHeading]"]`);
    const originalHeading = await heading.inputValue();
    await label.fill('Matrix validation recovery');
    await heading.fill('');
    await Promise.all([
        page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }),
        page.keyboard.press('ControlOrMeta+S'),
    ]);
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('link', { name: 'Card heading cannot be blank.', exact: true })).toBeVisible();
    await expect(label).toHaveValue('Matrix validation recovery');
    expect(persisted().matrixRows).toEqual(before.matrixRows);
    await heading.fill(originalHeading);
    await save(page, before.document.content[0].content[0].text);
    expect(persisted().matrixRows.map((row: any) => row.label)).toEqual(['Matrix validation recovery']);
    await openOwner(page);
    await expect(label).toHaveValue('Matrix validation recovery');
});

test('removing a relation through Craft’s real widget saves an empty selection without changing its target', async ({ page }) => {
    await login(page, 'editor');
    await openOwner(page);
    const before = persisted();
    const related = page.getByRole('group', { name: 'Related pages', exact: true });
    await expect(related.locator('.element[data-id]')).toHaveCount(1);
    await related.getByRole('button', { name: 'Actions', exact: true }).click();
    await page.getByRole('button', { name: 'Remove', exact: true }).click();
    await expect(related.locator('.element[data-id]')).toHaveCount(0);
    await save(page, before.document.content[0].content[0].text);
    const slots = persisted().document.content.find((node: any) => node.attrs?.blockUid === fixture.blockUid).attrs.fieldSlots;
    expect(slots[fixture.relatedPlacement]).toEqual([]);
    expect(persisted().relatedExists).toBe(true);
    await openOwner(page);
    await expect(related.locator('.element[data-id]')).toHaveCount(0);
});

async function checkAutosave(page: Page): Promise<number> {
    return page.evaluate(async () => {
        const $ = (window as any).jQuery;
        const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
        if (!owner) throw new Error('Craft ElementEditor was not attached to the entry form');
        // Run Craft's normal dirty-check/autosave path and await its real request.
        await owner.checkForm(false, true);
        return owner.settings.draftId;
    });
}

test('real autosave persists edits and reverts in a draft before publication changes canonical content', async ({ page }) => {
    await login(page, 'editor');
    await openOwner(page);
    const before = persisted();
    const rootText = page.locator('vizy-editor').first().locator('.ProseMirror').first().locator(':scope > p').first();
    await rootText.fill('Autosaved edit');
    const draftId = await checkAutosave(page);
    expect(draftId).toBeGreaterThan(0);
    const draftText = () => persisted().drafts.find((draft: any) => draft.draftId === draftId)?.document.content[0].content[0].text;
    await expect.poll(draftText).toBe('Autosaved edit');
    expect(persisted().document).toEqual(before.document);
    await rootText.fill(before.document.content[0].content[0].text);
    await checkAutosave(page);
    await expect.poll(draftText).toBe(before.document.content[0].content[0].text);
    expect(persisted().document).toEqual(before.document);
    await rootText.fill('Published draft edit');
    await checkAutosave(page);
    await expect.poll(draftText).toBe('Published draft edit');
    await save(page, 'Published draft edit');
    expect(persisted().matrixRows.map((row: any) => row.label)).toEqual(before.matrixRows.map((row: any) => row.label));
    await openOwner(page);
    await expect(rootText).toHaveText('Published draft edit');
});


for (const attack of ['unplacedField', 'foreignEntryType', 'mismatchedBlock', 'mismatchedAnchor', 'peerOwner'] as const) {
    test(`Matrix creation rejects ${attack} without creating nested elements`, async ({ page }) => {
        await login(page, 'editor');
        const csrf = await page.evaluate(() => ({ name: (window as any).Craft.csrfTokenName, value: (window as any).Craft.csrfTokenValue }));
        const before = persisted();
        const response = await page.request.post('/index.php?p=admin&action=vizy/field/create-matrix-entry', {
            headers: { Accept: 'application/json' },
            form: {
                [csrf.name]: csrf.value,
                ownerId: String(attack === 'peerOwner' ? 0 : fixture.matrix.anchorId), siteId: String(fixture.siteId),
                fieldId: String(attack === 'unplacedField' ? fixture.matrix.unplacedFieldId : fixture.matrix.fieldId),
                entryTypeId: String(attack === 'foreignEntryType' ? fixture.matrix.foreignEntryTypeId : fixture.matrix.entryTypeId),
                namespace: `vizyHost[test][${fixture.matrix.blockUid}][fields]`,
                ...(attack === 'mismatchedBlock' ? { blockInstanceId: fixture.blockUid } : {}),
                ...(attack === 'mismatchedAnchor' ? { matrixAnchorUid: fixture.blockUid } : {}),
                ...(attack === 'peerOwner' ? {
                    parentOwnerId: String(fixture.peerId), vizyFieldId: String(fixture.matrix.vizyFieldId),
                    blockInstanceId: fixture.matrix.blockUid,
                } : {}),
            },
        });
        expect(response.status(), (await response.text()).slice(0, 500)).toBe(attack === 'peerOwner' ? 403 : 400);
        const after = persisted();
        expect(after.nestedElementCount).toBe(before.nestedElementCount);
        expect(after.document).toEqual(before.document);
    });
}

test('Matrix creation permits the configured field and type for an authorized editor', async ({ page }) => {
    await login(page, 'editor');
    const csrf = await page.evaluate(() => ({ name: (window as any).Craft.csrfTokenName, value: (window as any).Craft.csrfTokenValue }));
    const before = persisted();
    const response = await page.request.post('/index.php?p=admin&action=vizy/field/create-matrix-entry', {
        headers: { Accept: 'application/json' },
        form: {
            [csrf.name]: csrf.value,
            ownerId: String(fixture.matrix.anchorId), siteId: String(fixture.siteId),
            fieldId: String(fixture.matrix.fieldId), entryTypeId: String(fixture.matrix.entryTypeId),
            namespace: `vizyHost[test][${fixture.matrix.blockUid}][fields]`,
        },
    });
    expect(response.status(), (await response.text()).slice(0, 500)).toBe(200);
    const { blockHtml } = await response.json();
    const created = await page.evaluate((html) => {
        const block = new DOMParser().parseFromString(html, 'text/html').querySelector('.matrixblock');
        return { elementId: block?.getAttribute('data-id'), draftId: block?.getAttribute('data-draft-id') };
    }, blockHtml);
    expect(created.elementId).toBeNull();
    expect(created.draftId).toBeNull();
    expect(blockHtml).toContain(fixture.matrix.labelHandle);
    expect(persisted().nestedElementCount).toBe(before.nestedElementCount);
    expect(persisted().document).toEqual(before.document);
});


test('a real Assets widget upload survives capture, finalization and reopen with intact file bytes', async ({ page }) => {
    await login(page);
    await openOwner(page);
    const before = persisted();
    const uploads = page.getByRole('group', { name: 'Uploaded files', exact: true });
    const filename = 'browser-upload.txt';
    const contents = 'Vizy upload boundary: café & <content>\n';
    await uploads.locator('input[type="file"]').setInputFiles({ name: filename, mimeType: 'text/plain', buffer: Buffer.from(contents) });
    await expect(uploads.locator('.element[data-id]')).toHaveCount(1);
    const id = Number(await uploads.locator('.element[data-id]').getAttribute('data-id'));
    expect(id).toBeGreaterThan(0);
    await save(page, before.document.content[0].content[0].text);
    const state = persisted();
    const slots = state.document.content.find((node: any) => node.attrs?.blockUid === fixture.blockUid).attrs.fieldSlots;
    expect(slots[fixture.uploadPlacement]).toEqual([id]);
    expect(state.uploads).toEqual([{ id, filename, volumeId: fixture.uploadVolumeId, folderPath: 'browser-uploads/', contents }]);
    await openOwner(page);
    await expect(uploads.locator(`.element[data-id="${id}"]`)).toHaveCount(1);
});

test('the real Matrix add button creates a row that survives save and reopen', async ({ page }) => {
    await login(page, 'editor');
    await openOwner(page);
    const before = persisted();
    const matrix = page.locator(`vizy-block[data-block-uid="${fixture.matrix.blockUid}"] .matrix-field`);
    const labels = matrix.locator(`input[name$="[${fixture.matrix.labelHandle}]"]`);
    await expect(labels).toHaveCount(1);
    await matrix.locator(':scope > .buttons button.add').click();
    await expect(labels).toHaveCount(2);
    await labels.last().fill('Created through Craft');
    expect(persisted().matrixRows).toEqual(before.matrixRows);
    await save(page, before.document.content[0].content[0].text);
    const rows = persisted().matrixRows;
    expect(rows).toHaveLength(2);
    // Creating a row can fork a provisional owner draft. Publishing copies its
    // independent Matrix snapshot; row IDs need not equal the old canonical IDs.
    expect(rows[0].label).toBe(before.matrixRows[0].label);
    expect(rows[1].label).toBe('Created through Craft');
    await openOwner(page);
    await expect(labels).toHaveCount(2);
    await expect(labels.last()).toHaveValue('Created through Craft');
    expect(persisted().matrixRows).toEqual(rows);
});
