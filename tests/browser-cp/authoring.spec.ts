import { expect, test, type Page } from '@playwright/test';
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

test('grandfathered Matrix row edits survive the real widget flush and reopen with their identity intact', async ({ page }) => {
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
    expect(created.elementId).toBeTruthy();
    try {
        expect(blockHtml).toContain(fixture.matrix.labelHandle);
        expect(persisted().nestedElementCount).toBe(before.nestedElementCount + 1);
        expect(persisted().document).toEqual(before.document);
    } finally {
        // The endpoint creates a durable draft even without an owner form save.
        // Remove this test's draft so later authoring journeys start unchanged.
        const cleanup = await page.request.post('/index.php?p=admin&action=elements/delete-draft', {
            headers: { Accept: 'application/json' },
            form: {
                [csrf.name]: csrf.value,
                elementId: created.elementId!, draftId: created.draftId!,
                siteId: String(fixture.siteId),
                ownerId: String(fixture.matrix.anchorId), fieldId: String(fixture.matrix.fieldId),
            },
        });
        expect(cleanup.status(), (await cleanup.text()).slice(0, 500)).toBe(200);
        expect(persisted().nestedElementCount).toBe(before.nestedElementCount);
    }
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
