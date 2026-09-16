import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'src/web/assets/field/dist/manifest.json'), 'utf8'));
const bundle = path.join(root, 'src/web/assets/field/dist', manifest['field/src/ts/vizy.ts'].file);

/** Leaf vizyBlock — nesting lives in Hosted fieldSlots, not TipTap children. */
const leafBlock = (blockUid: string, fieldSlots: Record<string, unknown> = {}) => ({
    type: 'vizyBlock',
    attrs: { blockUid, blockTypeUid: 'type', enabled: true, fieldSlots },
    content: [],
});

const editorManifest = {
    manifestVersion: 1,
    uid: 'request',
    revision: '1:test',
    hash: 'test',
    registryRevision: 'registry',
    schemaRevision: 'test',
    enabledNodes: ['doc', 'text', 'paragraph', 'vizyBlock'],
    enabledMarks: ['bold', 'italic'],
    internalNodes: ['doc', 'text', 'vizyBlock'],
    modules: [
        'vizy/core/node/doc',
        'vizy/core/node/text',
        'vizy/core/node/paragraph',
        'vizy/core/node/vizyBlock',
        'vizy/core/mark/bold',
        'vizy/core/mark/italic',
    ],
    field: {
        fieldUid: 'field',
        rootContentType: 'rich',
        blockTypePickerGroups: [],
        allowedBlockTypeUids: ['type'],
        insertableBlockTypeUids: ['type'],
        minBlocks: null,
        maxBlocks: null,
    },
    blockTypes: {
        type: {
            uid: 'type',
            name: 'Type',
            handle: 'type',
            fieldLayoutUid: 'layout',
            fieldLayoutHash: 'hash',
            fieldSlotKinds: { 'placement-nested': 'hosted' },
        },
    },
    insertionItems: [
        {
            id: 'block:type',
            kind: 'block',
            blockTypeUid: 'type',
            label: 'Type',
            description: null,
            icon: null,
            group: 'Blocks',
            keywords: ['type'],
            aliases: [],
            order: 0,
            surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
            requiresInput: false,
        },
        {
            id: 'node:vizy:paragraph',
            kind: 'node',
            nodeName: 'paragraph',
            label: 'Paragraph',
            description: null,
            icon: null,
            group: 'Text',
            keywords: ['paragraph'],
            aliases: [],
            order: 0,
            surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
            requiresInput: false,
        },
    ],
};

/** Fulfilled by a route rather than served, but an https origin all the same. */
const HARNESS_URL = 'https://vizy-harness.test/';

async function mount(
    page: import('@playwright/test').Page,
    document: unknown,
    options: {
        disableIntersectionObserver?: boolean;
        /** Default true — Blocks with FieldLayouts must not inject failure chrome into ProseMirror queries. */
        layoutSuccess?: boolean;
        initialFieldLayouts?: unknown[];
        manifest?: typeof editorManifest;
    } = {},
) {
    const layoutSuccess = options.layoutSuccess !== false;
    // Served from an https origin instead of page.setContent(), because
    // about:blank is not a secure context and therefore has no crypto.subtle.
    // The Block hash the FieldLayout loader computes before every request needs
    // it, so on about:blank every render silently threw before reaching the
    // network — which made "zero layout requests" pass no matter what the
    // editor did.
    await page.route(`${HARNESS_URL}**`, (route) => route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html><body><form><vizy-editor id="editor"><input data-vizy-document type="hidden" name="fields[body]"></vizy-editor></form></body></html>',
    }));
    await page.route(`${HARNESS_URL}assets/**`, (route) => {
        const filename = path.basename(new URL(route.request().url()).pathname);
        return route.fulfill({
            path: path.join(root, 'src/web/assets/field/dist/assets', filename),
        });
    });
    await page.goto(HARNESS_URL);
    await page.evaluate(({ disableIntersectionObserver, layoutSuccess }) => {
        (window as any).__layoutRequests = 0;
        // Requests are batched, so the count of HTTP calls no longer reflects
        // how many Blocks were rendered. Track both.
        (window as any).__layoutBlocks = 0;
        if (disableIntersectionObserver) {
            // Isolate policy-driven eager mounts from viewport-driven mounts.
            (window as any).IntersectionObserver = class {
                observe() {}
                unobserve() {}
                disconnect() {}
            };
        }
        (window as any).Craft = {
            t: (_category: string, message: string) => message,
            sendActionRequest: (_method: string, _action: string, config?: { data?: { items?: unknown[] } }) => {
                (window as any).__layoutRequests++;
                (window as any).__layoutBlocks += config?.data?.items?.length ?? 1;
                if (layoutSuccess) {
                    const items = (config?.data?.items ?? []) as any[];
                    return Promise.resolve({
                        data: {
                            results: items.map((item) => ({
                                ok: true,
                                html: '<div></div>',
                                fields: [],
                                fieldLayoutUid: 'layout',
                                fieldLayoutHash: 'hash',
                                hostNamespace: `vizyHost[${item.block.attrs.blockUid}]`,
                                headHtml: '',
                                bodyHtml: '',
                                blockUid: item.block.attrs.blockUid,
                                blockTypeUid: 'type',
                                blockHash: item.blockHash,
                                documentRevision: item.documentRevision,
                                requestId: item.requestId,
                                tabLabels: [],
                            })),
                        },
                    });
                }
                return Promise.reject(new Error('unexpected'));
            },
            appendHeadHtml() {},
            appendBodyHtml() {},
            initUiElements() {},
        };
    }, { ...options, layoutSuccess });
    await page.addScriptTag({
        url: `${HARNESS_URL}assets/${path.basename(bundle)}`,
        type: 'module',
    });
    await expect.poll(() => page.evaluate(() => Boolean((window as any).Craft?.Vizy?.bootstrapEditor))).toBe(true);
    // `vizy.ts` publishes the queue before its failure-isolated editor-runtime
    // import resolves. Wait for the real custom element, not just the queue API.
    await expect.poll(() => page.evaluate(() => Boolean(customElements.get('vizy-editor')))).toBe(true);
    await page.evaluate(({ document, manifest, initialFieldLayouts }) => {
        (window as any).Craft.Vizy.bootstrapEditor('editor', {
            document,
            manifest,
            editorContextToken: 'test',
            initialFieldLayouts,
        });
    }, {
        document,
        manifest: options.manifest ?? editorManifest,
        initialFieldLayouts: options.initialFieldLayouts,
    });
    await expect(page.locator('.ProseMirror')).toBeVisible();
}

test('owns one EditorView and direct light-DOM NodeViews', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
            leafBlock('block'),
        ],
    });
    await expect(page.locator('.ProseMirror')).toHaveCount(1);
    await expect(page.locator('vizy-block[data-block-uid="block"]')).toHaveCount(1);
    await expect(page.locator('vizy-slot')).toHaveCount(0);
    await page.locator('.ProseMirror p').click();
    await page.keyboard.press('End');
    await page.keyboard.type(' world');
    await expect(page.locator('.ProseMirror')).toContainText('Hello world');
});

test('adopts an initial FieldLayout before paint without a request or dirty state', async ({ page }) => {
    const block = leafBlock('preloaded');
    await mount(
        page,
        { type: 'doc', attrs: { schemaVersion: 2 }, content: [block] },
        {
            disableIntersectionObserver: true,
            initialFieldLayouts: [{
                requestId: '',
                documentRevision: 0,
                blockHash: 'server-trusted',
                blockUid: 'preloaded',
                blockTypeUid: 'type',
                fieldLayoutUid: 'layout',
                fieldLayoutHash: 'hash',
                hostNamespace: 'vizyHost[preloaded]',
                html: '<div class="flex-fields" data-preloaded-layout></div>',
                headHtml: '',
                bodyHtml: '',
                fields: [],
                tabLabels: [],
            }],
        },
    );

    const preloaded = page.locator('vizy-block[data-block-uid="preloaded"]');
    await expect(preloaded).toHaveAttribute('field-layout', 'mounted');
    await expect(preloaded.locator('[data-preloaded-layout]')).toHaveCount(1);
    expect(await page.evaluate(() => (window as any).__layoutBlocks)).toBe(0);
    expect(await page.evaluate(() => (document.querySelector('vizy-editor') as any).isDirty)).toBe(false);
});

for (const secondFails of [false, true]) {
    test(`isolates same-UID Block tabs and ${secondFails ? 'failure' : 'mount'} state between editors`, async ({ page }) => {
        const document = { type: 'doc', attrs: { schemaVersion: 2 }, content: [leafBlock('shared')] };
        const layout = {
            requestId: '', documentRevision: 0, blockHash: 'server-trusted',
            blockUid: 'shared', blockTypeUid: 'type', fieldLayoutUid: 'layout', fieldLayoutHash: 'hash',
            hostNamespace: 'vizyHost[first]', headHtml: '', bodyHtml: '', fields: [],
            html: '<div class="flex-fields">First pane</div><div class="flex-fields">Second pane</div>',
            tabLabels: ['Content', 'Details'],
        };
        await mount(page, document, { initialFieldLayouts: [layout] });
        await page.evaluate(({ content, manifest, layout, secondFails }) => {
            const second = window.document.createElement('vizy-editor');
            second.id = 'second';
            second.innerHTML = '<input data-vizy-document type="hidden" name="fields[second]">';
            window.document.querySelector('form')!.append(second);
            (window as any).Craft.Vizy.bootstrapEditor('second', {
                document: content, manifest, editorContextToken: 'second',
                initialFieldLayouts: [secondFails
                    ? { ok: false, blockUid: 'shared', error: 'renderFailed', message: 'Second editor layout failed.' }
                    : { ...layout, hostNamespace: 'vizyHost[second]', tabLabels: ['Summary', 'Settings'] }],
            });
        }, { content: document, manifest: editorManifest, layout, secondFails });
        const first = page.locator('#editor vizy-block');
        const second = page.locator('#second vizy-block');
        await expect(second).toHaveAttribute('field-layout', secondFails ? 'error' : 'mounted');
        await expect(first).toHaveAttribute('field-layout', 'mounted');
        await expect(first.getByRole('tab', { name: 'Details', exact: true })).toBeVisible();
        if (secondFails) {
            await expect(second).toContainText('Second editor layout failed.');
        } else {
            await second.getByRole('tab', { name: 'Settings', exact: true }).click();
            await expect(second.locator('.flex-fields').nth(1)).toBeVisible();
            await expect(first.locator('.flex-fields').nth(0)).toBeVisible();
            await expect(first.locator('.flex-fields').nth(1)).toBeHidden();
        }
    });
}

test('unchanged widgets preserve accepted canonical values while edits, reversions and capture retries persist', async ({ page }) => {
    await mount(page, {
        type: 'doc', attrs: { schemaVersion: 2 }, content: [leafBlock('normalized', { relation: [1], text: 'Original' })],
    }, {
        initialFieldLayouts: [{
            requestId: '', documentRevision: 0, blockHash: 'server-trusted',
            blockUid: 'normalized', blockTypeUid: 'type', fieldLayoutUid: 'layout', fieldLayoutHash: 'hash',
            hostNamespace: 'vizyHost[normalized]', headHtml: '', bodyHtml: '', tabLabels: [],
            html: '<div id="relation"><input type="hidden" name="vizyHost[normalized][relation][]" value="1"></div>'
                + '<div id="text"><input name="vizyHost[normalized][text]" value="Original"></div>'
                + '<div id="matrix"></div>',
            fields: [
                { fieldLayoutElementUid: 'relation', fieldUid: 'relation-field', fieldHandle: 'relation', fieldType: 'Entries', adapterId: 'craft.entries', wrapperId: 'relation' },
                { fieldLayoutElementUid: 'text', fieldUid: 'text-field', fieldHandle: 'text', fieldType: 'PlainText', adapterId: 'craft.plainText', wrapperId: 'text' },
                { fieldLayoutElementUid: 'matrix', fieldUid: 'matrix-field', fieldHandle: 'matrix', fieldType: 'Matrix', adapterId: 'craft.matrix', wrapperId: 'matrix', matrixAnchorUid: 'canonical-anchor' },
            ],
        }],
    });
    await expect(page.locator('vizy-block')).toHaveAttribute('field-layout', 'mounted');
    const result = await page.evaluate(() => {
        const element = document.querySelector('vizy-editor') as any;
        const relation = document.querySelector('#relation input') as HTMLInputElement;
        const text = document.querySelector('#text input') as HTMLInputElement;
        const flush = () => JSON.parse(element.flush('serialize'));
        const block = (document: any) => document.content.find((node: any) => node.type === 'vizyBlock').attrs;
        const edit = (input: HTMLInputElement, value: string) => {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        };
        const initial = block(flush());
        edit(relation, '2');
        const submitted = flush();
        const submission = element.beginSubmission();
        block(submitted).fieldSlots.relation = [2];
        block(submitted).matrixAnchorUid = 'draft-anchor';
        element.acceptServerResult({
            requestKind: 'autosave', submittedClientRevision: submission.clientRevision,
            canonicalDocument: submitted, success: true, finalizationStatus: 'pending',
        }, submission.generation);
        const unchanged = Array.from({ length: 3 }, () => ({ document: flush(), dirty: element.isDirty }));
        edit(relation, '3');
        const edited = block(flush());
        edit(relation, '1');
        const reverted = block(flush());
        edit(relation, '4');
        text.remove();
        let failed = false;
        try { flush(); } catch { failed = true; }
        document.querySelector('#text')!.append(text);
        const retried = block(flush());
        edit(text, 'Changed');
        const textEdited = block(flush());
        edit(text, 'Original');
        return { initial, submitted, unchanged, edited, reverted, failed, retried, textEdited, textReverted: block(flush()) };
    });
    expect(result.initial.fieldSlots.relation).toEqual([1]);
    for (const state of result.unchanged) {
        expect(state.document).toEqual(result.submitted);
        expect(state.dirty).toBe(false);
    }
    expect(result.edited.fieldSlots.relation).toEqual(['3']);
    expect(result.reverted.fieldSlots.relation).toEqual(['1']);
    expect(result.reverted.matrixAnchorUid).toBe('draft-anchor');
    expect(result.failed).toBe(true);
    expect(result.retried.fieldSlots.relation).toEqual(['4']);
    expect(result.textEdited.fieldSlots.text).toBe('Changed');
    expect(result.textReverted.fieldSlots.text).toBe('Original');
});

test('large documents batch-mount every FieldLayout when bootstrap is empty', async ({ page }) => {
    const content = Array.from({ length: 500 }, (_, index) => leafBlock(`block-${index}`));
    await mount(
        page,
        { type: 'doc', attrs: { schemaVersion: 2 }, content },
        { layoutSuccess: true },
    );
    await expect(page.locator('vizy-block')).toHaveCount(500);
    // Full SSR is the production path; empty-bootstrap harness falls back to
    // eager batched opens (BATCH_LIMIT 25 → 20 requests for 500 Blocks).
    await expect.poll(() => page.evaluate(() => (window as any).__layoutBlocks)).toBe(500);
    expect(await page.evaluate(() => (window as any).__layoutRequests)).toBe(20);
});

test('renders unsupported content as payload-free fixed UI', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [{ type: 'futureNode', attrs: { secret: 'RAW_SENTINEL', html: '<script>bad()</script>' } }],
    });
    const placeholder = page.locator('.vizy-unsupported-block');
    await expect(placeholder).toHaveText('Unsupported content');
    await expect(placeholder).not.toHaveAttribute('data-raw');
    await expect(page.locator('.ProseMirror')).not.toContainText('RAW_SENTINEL');
    expect(await page.evaluate(() => (window as any).bad)).toBeUndefined();
});

test('tracks persisted content separately from finalization and ignores stale generations', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Before' }] }],
    });
    const state = await page.evaluate(() => {
        const element = document.querySelector('vizy-editor') as any;
        element.editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Canonical' }] }],
        });
        const first = element.beginSubmission();
        const stale = element.beginSubmission();
        element.acceptServerResult({
            requestKind: 'autosave',
            submittedClientRevision: first.clientRevision,
            canonicalDocument: { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
            success: true,
            finalizationStatus: 'complete',
        }, first.generation);
        element.acceptServerResult({
            requestKind: 'autosave',
            submittedClientRevision: stale.clientRevision,
            canonicalDocument: element.editor.getJSON(),
            success: true,
            finalizationStatus: 'pending',
            finalizationErrors: [{ code: 'assetFinalization', message: 'retry' }],
            retryToken: 'signed',
        }, stale.generation);
        const pending = {
            dirty: element.isDirty,
            fullySaved: element.fullySaved,
            finalization: element.finalizationState,
            text: element.editor.getText(),
        };
        element.acceptServerResult({
            requestKind: 'autosave',
            submittedClientRevision: stale.clientRevision,
            canonicalDocument: element.editor.getJSON(),
            success: true,
            finalizationStatus: 'complete',
            retryToken: null,
        }, stale.generation);
        return { pending, complete: element.fullySaved };
    });
    expect(state.pending).toMatchObject({
        dirty: false,
        fullySaved: false,
        finalization: { status: 'pending', retryToken: 'signed' },
        text: 'Canonical',
    });
    expect(state.complete).toBe(true);
});

test('autosave normalization preserves text selection and undo history', async ({ page }) => {
    await mount(page, {
        type: 'doc', attrs: { schemaVersion: 2 }, content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Before' }] },
            leafBlock('history-block', { relation: ['1'] }),
        ],
    });
    const outcome = await page.evaluate(() => {
        const element = document.querySelector('vizy-editor') as any;
        const editor = element.editor;
        editor.commands.insertContentAt(7, ' edited');
        editor.commands.setTextSelection(10);
        const canonical = JSON.parse(element.flush('serialize'));
        const submission = element.beginSubmission();
        canonical.content.find((node: any) => node.type === 'vizyBlock').attrs.fieldSlots.relation = [1];
        element.acceptServerResult({
            requestKind: 'autosave', submittedClientRevision: submission.clientRevision,
            canonicalDocument: canonical, success: true, finalizationStatus: 'complete',
        }, submission.generation);
        const selection = editor.state.selection.from;
        const undone = editor.commands.undo();
        const afterUndo = editor.getText();
        const redone = editor.commands.redo();
        return { selection, undone, afterUndo, redone, afterRedo: editor.getText() };
    });
    expect.soft(outcome.selection).toBe(10);
    expect.soft(outcome.undone).toBe(true);
    expect.soft(outcome.afterUndo.trim()).toBe('Before');
    expect.soft(outcome.redone).toBe(true);
    expect(outcome.afterRedo.trim()).toBe('Before edited');
});

test('private cross-editor paste regenerates nested authored identities', async ({ page }) => {
    // Nested Block lives in Hosted fieldSlots (object doc), not TipTap children.
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [leafBlock('source', {
            'placement-nested': {
                type: 'doc',
                attrs: { schemaVersion: 2 },
                content: [leafBlock('nested')],
            },
        })],
    });
    const result = await page.evaluate(() => {
        const editor = (document.querySelector('vizy-editor') as any).editor;
        editor.commands.setNodeSelection(0);
        editor.view.focus();
        const data = new DataTransfer();
        let rejection: unknown = null;
        editor.view.dom.addEventListener('vizy-clipboard-rejected', (event: Event) => {
            rejection = (event as CustomEvent).detail;
        }, { once: true });
        const copy = new Event('copy', { bubbles: true, cancelable: true });
        Object.defineProperty(copy, 'clipboardData', { value: data });
        editor.view.dom.dispatchEvent(copy);
        editor.commands.setContent({ type: 'doc', attrs: { schemaVersion: 2 }, content: [] });
        const paste = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(paste, 'clipboardData', { value: data });
        editor.view.dom.dispatchEvent(paste);
        // Walk TipTap + Hosted fieldSlots — regenerateAuthoredUids covers both.
        const uids: string[] = [];
        const walk = (value: unknown) => {
            if (Array.isArray(value)) {
                value.forEach(walk);
                return;
            }
            if (!value || typeof value !== 'object') return;
            const record = value as Record<string, unknown>;
            if (typeof record.blockUid === 'string') uids.push(record.blockUid);
            Object.values(record).forEach(walk);
        };
        walk(editor.getJSON());
        return {
            uids,
            privateData: data.getData('application/x-vizy-opaque-slice+json'),
            copyPrevented: copy.defaultPrevented,
            pastePrevented: paste.defaultPrevented,
            document: editor.getJSON(),
            rejection,
        };
    });
    expect(result).toMatchObject({
        copyPrevented: true,
        pastePrevented: true,
    });
    expect(result.rejection).toBeNull();
    expect(result.privateData).not.toBe('');
    expect(result.uids).toHaveLength(2);
    expect(result.uids).not.toContain('source');
    expect(result.uids).not.toContain('nested');
    expect(new Set(result.uids).size).toBe(2);
});

for (const action of ['copy', 'cut', 'deleteUndo', 'moveUndo'] as const) {
    test(`${action} preserves live Block field edits`, async ({ page }) => {
        await mount(page, {
            type: 'doc', attrs: { schemaVersion: 2 }, content: [leafBlock('copy-live', { text: 'Stored' }), leafBlock('other')],
        }, {
            initialFieldLayouts: [{
                requestId: '', documentRevision: 0, blockHash: 'trusted', blockUid: 'copy-live',
                blockTypeUid: 'type', fieldLayoutUid: 'layout', fieldLayoutHash: 'hash',
                hostNamespace: 'vizyHost[copy-live]', headHtml: '', bodyHtml: '', tabLabels: [],
                html: '<div id="copy-text"><input name="vizyHost[copy-live][text]" value="Stored"></div>',
                fields: [{ fieldLayoutElementUid: 'text', fieldUid: 'text-field', fieldHandle: 'text', fieldType: 'PlainText', adapterId: 'craft.plainText', wrapperId: 'copy-text' }],
            }],
        });
        await expect(page.locator('vizy-block[data-block-uid="copy-live"]')).toHaveAttribute('field-layout', 'mounted');
        await page.locator('#copy-text input').fill('Unsaved edit');
        const outcome = await page.evaluate((action) => {
            const element = document.querySelector('vizy-editor') as any;
            const editor = element.editor;
            const dirtyBefore = element.isDirty;
            editor.commands.setNodeSelection(0);
            let copied = null;
            let removed = false;
            if (action === 'copy' || action === 'cut') {
                const data = new DataTransfer();
                const event = new Event(action, { bubbles: true, cancelable: true });
                Object.defineProperty(event, 'clipboardData', { value: data });
                editor.view.dom.dispatchEvent(event);
                const encoded = data.getData('application/x-vizy-opaque-slice+json');
                copied = encoded ? JSON.parse(encoded) : null;
                if (action === 'cut') {
                    removed = !editor.getJSON().content.some((node: any) => node.attrs?.blockUid === 'copy-live');
                    editor.commands.undo();
                }
            } else {
                document.querySelector('vizy-block[data-block-uid="copy-live"]')!.dispatchEvent(new CustomEvent('vizy-block-action', {
                    bubbles: true, detail: { action: action === 'deleteUndo' ? 'delete' : 'moveDown' },
                }));
                if (action === 'moveUndo') {
                    const input = document.querySelector('#copy-text input') as HTMLInputElement;
                    input.value = 'Edited after moving';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    element.flush('serialize');
                } else {
                    removed = !editor.getJSON().content.some((node: any) => node.attrs?.blockUid === 'copy-live');
                }
                editor.commands.undo();
            }
            const content = JSON.parse(element.flush('serialize')).content;
            return { dirtyBefore, copied, removed, content };
        }, action);
        expect.soft(outcome.dirtyBefore).toBe(true);
        if (action === 'copy' || action === 'cut') expect.soft(outcome.copied?.content[0].attrs.fieldSlots.text).toBe('Unsaved edit');
        if (action === 'cut' || action === 'deleteUndo') expect.soft(outcome.removed).toBe(true);
        const restored = outcome.content.find((node: any) => node.attrs?.blockUid === 'copy-live');
        expect(restored.attrs.fieldSlots.text).toBe(action === 'moveUndo' ? 'Edited after moving' : 'Unsaved edit');
        if (action === 'moveUndo') expect(outcome.content[0].attrs.blockUid).toBe('copy-live');
        // Deferred disposal must not detach the restored Block's live widgets.
        await expect(page.locator('#copy-text input')).toHaveValue(action === 'moveUndo' ? 'Edited after moving' : 'Unsaved edit');
    });
}

test('stored content at the supported five-level Hosted depth opens, saves and pastes', async ({ page }) => {
    let document: any = { type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Deep content' }] }] };
    for (let depth = 5; depth > 0; depth--) {
        document = { type: 'doc', attrs: { schemaVersion: 2 }, content: [leafBlock(`depth-${depth}`, { 'placement-nested': document })] };
    }
    await mount(page, document);
    const saved = await page.evaluate(() => JSON.parse((window.document.querySelector('vizy-editor') as any).flush('serialize')));
    let deepest = saved;
    for (let depth = 1; depth <= 5; depth++) {
        const block = deepest.content.find((node: any) => node.type === 'vizyBlock');
        expect(block.attrs.blockUid).toBe(`depth-${depth}`);
        deepest = block.attrs.fieldSlots['placement-nested'];
    }
    expect(deepest.content[0].content[0].text).toBe('Deep content');
    const pasted = await page.evaluate(() => {
        const element = window.document.querySelector('vizy-editor') as any;
        const editor = element.editor;
        editor.commands.setNodeSelection(0);
        const data = new DataTransfer();
        for (const action of ['copy', 'paste']) {
            const event = new Event(action, { bubbles: true, cancelable: true });
            Object.defineProperty(event, 'clipboardData', { value: data });
            editor.view.dom.dispatchEvent(event);
        }
        return JSON.parse(element.flush('serialize'));
    });
    deepest = pasted;
    for (let depth = 1; depth <= 5; depth++) {
        const block = deepest.content.find((node: any) => node.type === 'vizyBlock');
        expect(block.attrs.blockUid).not.toBe(`depth-${depth}`);
        deepest = block.attrs.fieldSlots['placement-nested'];
    }
    expect(deepest.content[0].content[0].text).toBe('Deep content');
});

for (const reason of ['oversized', 'readonly'] as const) {
    test(`${reason} private cut retains the source content`, async ({ page }) => {
        await mount(page, { type: 'doc', attrs: { schemaVersion: 2 }, content: [
            leafBlock('cut-guard', { text: reason === 'oversized' ? 'x'.repeat(300_000) : 'Keep me' }),
        ] });
        const outcome = await page.evaluate((reason) => {
            const element = document.querySelector('vizy-editor') as any;
            const editor = element.editor;
            if (reason === 'readonly') editor.setEditable(false);
            editor.commands.setNodeSelection(0);
            let rejected: string | null = null;
            editor.view.dom.addEventListener('vizy-clipboard-rejected', (event: Event) => {
                rejected = (event as CustomEvent).detail.code;
            }, { once: true });
            const clipboard = new DataTransfer();
            const event = new Event('cut', { bubbles: true, cancelable: true });
            Object.defineProperty(event, 'clipboardData', { value: clipboard });
            editor.view.dom.dispatchEvent(event);
            return { rejected, retained: editor.getJSON().content[0].attrs.blockUid };
        }, reason);
        expect(outcome.retained).toBe('cut-guard');
        expect(outcome.rejected).toBe(reason === 'oversized' ? 'documentBytesExceeded' : null);
    });
}

test('selection, keyboard Escape, and opaque malformed rejection stay harness-safe', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Select me' }] },
            leafBlock('block'),
        ],
    });
    await page.locator('.ProseMirror p').click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Escape');
    const outcome = await page.evaluate(() => {
        const editor = (document.querySelector('vizy-editor') as any).editor;
        const data = new DataTransfer();
        data.setData('application/x-vizy-opaque-slice+json', JSON.stringify({
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x', marks: [{ type: '', attrs: [] }] }] }],
            openStart: 0,
            openEnd: 0,
        }));
        let rejection: unknown = null;
        editor.view.dom.addEventListener('vizy-clipboard-rejected', (event: Event) => {
            rejection = (event as CustomEvent).detail;
        }, { once: true });
        const paste = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(paste, 'clipboardData', { value: data });
        editor.view.dom.dispatchEvent(paste);
        return {
            text: editor.getText(),
            emptySelection: editor.state.selection.empty,
            rejection,
        };
    });
    expect(outcome.text).toContain('Select me');
    expect(outcome.rejection).toMatchObject({ code: expect.any(String) });
});

test('Block menu Move down changes sibling order and Move up restores it', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [leafBlock('a'), leafBlock('b')],
    });
    const block = page.locator('vizy-block[data-block-uid="a"]');
    const order = () => page.locator('.ProseMirror > vizy-block').evaluateAll((blocks) =>
        blocks.map((node) => node.getAttribute('data-block-uid')));
    await block.locator('[part="menu-trigger"]').click();
    await block.locator('pk-dropdown-item[value="moveDown"]').click();
    await expect.poll(order).toEqual(['b', 'a']);
    await block.locator('[part="menu-trigger"]').click();
    await block.locator('pk-dropdown-item[value="moveUp"]').click();
    await expect.poll(order).toEqual(['a', 'b']);
});

test('collapse reopen and reorder preserve the same field-host DOM until removal disposes once', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [leafBlock('a'), leafBlock('b')],
    });
    const result = await page.evaluate(async () => {
        const element = document.querySelector('vizy-editor') as any;
        const hostA = document.querySelector('vizy-block[data-block-uid="a"] [data-vizy-field-host]') as HTMLElement | null;
        if (!hostA) return { before: false, afterReorder: false, disposed: 0, stillConnected: false, reason: 'missing-host' };
        const marker = document.createElement('input');
        marker.value = 'mounted-widget';
        hostA.append(marker);
        const block = document.querySelector('vizy-block[data-block-uid="a"]') as HTMLElement;
        const collapse = block.shadowRoot?.querySelector('[part="collapse"]') as HTMLButtonElement | null;
        collapse?.click();
        collapse?.click();
        const before = hostA.isConnected && hostA.querySelector('input')?.value === 'mounted-widget';
        element.editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                {
                    type: 'vizyBlock',
                    attrs: { blockUid: 'b', blockTypeUid: 'type', enabled: true, fieldSlots: {} },
                    content: [],
                },
                {
                    type: 'vizyBlock',
                    attrs: { blockUid: 'a', blockTypeUid: 'type', enabled: true, fieldSlots: {} },
                    content: [],
                },
            ],
        });
        await new Promise((resolve) => queueMicrotask(resolve));
        const afterReorder = hostA.isConnected && hostA.querySelector('input')?.value === 'mounted-widget';
        let disposed = 0;
        const observer = new MutationObserver(() => {
            if (!hostA.isConnected) disposed += 1;
        });
        observer.observe(document.body, { childList: true, subtree: true });
        element.editor.commands.setContent({ type: 'doc', attrs: { schemaVersion: 2 }, content: [] });
        await new Promise((resolve) => queueMicrotask(resolve));
        observer.disconnect();
        return { before, afterReorder, disposed, stillConnected: hostA.isConnected };
    });
    expect(result.before).toBe(true);
    expect(result.afterReorder).toBe(true);
    expect(result.stillConnected).toBe(false);
    expect(result.disposed).toBeGreaterThanOrEqual(1);
});

test('composition and request-kind metadata stay isolated across out-of-order generations', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Compose' }] }],
    });
    const state = await page.evaluate(() => {
        const element = document.querySelector('vizy-editor') as any;
        const editor = element.editor;
        // This tests submission metadata; avoid browser-specific mouse/End selection.
        editor.commands.setTextSelection(editor.state.doc.content.size - 1);
        editor.view.dispatch(editor.state.tr.setMeta('composition', true));
        editor.commands.insertContent('d');
        const first = element.beginSubmission();
        const second = element.beginSubmission();
        element.acceptServerResult({
            requestKind: 'livePreview',
            submittedClientRevision: second.clientRevision,
            canonicalDocument: { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
            success: true,
            finalizationStatus: 'complete',
        }, second.generation);
        const afterPreview = element.editor.getText();
        element.acceptServerResult({
            requestKind: 'autosave',
            submittedClientRevision: second.clientRevision,
            canonicalDocument: element.editor.getJSON(),
            success: true,
            finalizationStatus: 'complete',
        }, second.generation);
        return {
            afterPreview,
            fullySaved: element.fullySaved,
            ignoredFirst: first.generation !== second.generation,
        };
    });
    expect(state.afterPreview).toBe('Composed');
    expect(state.fullySaved).toBe(true);
    expect(state.ignoredFirst).toBe(true);
});

test('documents without bootstrap layouts eagerly request every FieldLayout in batched opens', async ({ page }) => {
    const content = Array.from({ length: 100 }, (_, index) => leafBlock(`lazy-${index}`));
    await mount(
        page,
        { type: 'doc', attrs: { schemaVersion: 2 }, content },
        { disableIntersectionObserver: true, layoutSuccess: true },
    );
    await expect(page.locator('vizy-block')).toHaveCount(100);
    await expect.poll(() => page.evaluate(() => (window as any).__layoutBlocks)).toBe(100);
    // Coalesced into one (or very few) batch requests — not one HTTP call per Block.
    expect(await page.evaluate(() => (window as any).__layoutRequests)).toBeLessThan(5);
    expect(await page.evaluate(() => (document.querySelector('vizy-editor') as any).isDirty)).toBe(false);
});

test('bootstrapped FieldLayouts skip client render-batch on open', async ({ page }) => {
    const content = Array.from({ length: 5 }, (_, index) => leafBlock(`ssr-${index}`));
    await mount(
        page,
        { type: 'doc', attrs: { schemaVersion: 2 }, content },
        {
            disableIntersectionObserver: true,
            layoutSuccess: true,
            initialFieldLayouts: content.map((block) => ({
                requestId: `req-${block.attrs.blockUid}`,
                documentRevision: 0,
                blockHash: 'hash',
                blockUid: block.attrs.blockUid,
                blockTypeUid: 'type',
                fieldLayoutUid: 'layout',
                fieldLayoutHash: 'hash',
                hostNamespace: `vizyHost[${block.attrs.blockUid}]`,
                html: '<div></div>',
                headHtml: '',
                bodyHtml: '',
                fields: [],
                tabLabels: [],
            })),
        },
    );
    await expect(page.locator('vizy-block')).toHaveCount(5);
    // Adopted from bootstrap — safety policy should not refetch.
    expect(await page.evaluate(() => (window as any).__layoutBlocks)).toBe(0);
});

test('ten inline hosted editors boot without FieldLayout requests', async ({ page }) => {
    const minimalDocument = {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [{ type: 'paragraph', content: [] }],
    };
    await mount(page, minimalDocument, {
        disableIntersectionObserver: true,
        layoutSuccess: true,
    });

    await page.evaluate(({ document, manifest }) => {
        const form = window.document.querySelector('form');
        if (!form) throw new Error('formMissing');
        (window as any).__hostedBootStarted = performance.now();

        for (let index = 0; index < 10; index++) {
            const editor = window.document.createElement('vizy-editor');
            editor.id = `hosted-${index}`;
            editor.dataset.vizyHosted = '';
            editor.dataset.vizyHostedDepth = '1';

            const input = window.document.createElement('input');
            input.type = 'hidden';
            input.dataset.vizyDocument = '';
            input.value = JSON.stringify(document);

            const bootstrap = window.document.createElement('template');
            bootstrap.dataset.vizyBootstrap = '';
            bootstrap.content.textContent = JSON.stringify({
                document,
                manifest,
                editorContextToken: 'hosted-test',
                hosted: {
                    depth: 1,
                    entryFieldUid: 'field',
                    parentFieldUid: 'field',
                    blockUid: `parent-${index}`,
                    placementUid: `placement-${index}`,
                    nestedFieldUid: 'field',
                },
                initialFieldLayouts: [],
            });
            editor.append(input, bootstrap);
            form.append(editor);
        }
    }, { document: minimalDocument, manifest: editorManifest });

    await expect(page.locator('.ProseMirror')).toHaveCount(11);
    const profile = await page.evaluate(() => ({
        hostedEditors: document.querySelectorAll('vizy-editor[data-vizy-hosted]').length,
        layoutRequests: (window as any).__layoutRequests,
        bootMs: performance.now() - (window as any).__hostedBootStarted,
    }));
    expect(profile.hostedEditors).toBe(10);
    expect(profile.layoutRequests).toBe(0);
    // Timing is reported for calibration only; cross-browser CI gets no ms gate.
    console.info('Hosted Vizy browser profile', profile);
});

test('hosted nested edit flushes into data-vizy-document and notifies parent via input', async ({ page }) => {
    const minimalDocument = {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Inner' }] }],
    };
    await mount(page, minimalDocument, {
        disableIntersectionObserver: true,
        layoutSuccess: true,
    });

    await page.evaluate(({ document: nestedDoc, manifest }) => {
        const form = window.document.querySelector('form');
        if (!form) throw new Error('formMissing');

        const host = window.document.createElement('div');
        host.className = 'field';
        host.dataset.adapter = 'vizy.hosted';

        const editor = window.document.createElement('vizy-editor');
        editor.id = 'hosted-fold';
        editor.dataset.vizyHosted = '';
        editor.dataset.vizyHostedDepth = '1';

        const input = window.document.createElement('input');
        input.type = 'hidden';
        input.dataset.vizyDocument = '';
        input.value = JSON.stringify(nestedDoc);

        const bootstrap = window.document.createElement('template');
        bootstrap.dataset.vizyBootstrap = '';
        bootstrap.content.textContent = JSON.stringify({
            document: nestedDoc,
            manifest,
            editorContextToken: 'hosted-fold',
            hosted: {
                depth: 1,
                entryFieldUid: 'field',
                parentFieldUid: 'field',
                blockUid: 'parent-fold',
                placementUid: 'placement-fold',
                nestedFieldUid: 'field',
            },
            initialFieldLayouts: [],
        });
        editor.append(input, bootstrap);
        host.append(editor);
        form.append(host);
    }, { document: minimalDocument, manifest: editorManifest });

    await expect(page.locator('#hosted-fold .ProseMirror')).toHaveCount(1);

    const fold = await page.evaluate(() => {
        const editor = document.querySelector('#hosted-fold') as any;
        const input = editor.querySelector('input[data-vizy-document]') as HTMLInputElement;
        let notified = 0;
        editor.addEventListener('input', () => {
            notified += 1;
        });
        editor.editor.commands.insertContent(' fold');
        const json = JSON.parse(editor.flush('serialize'));
        input.value = JSON.stringify(json);
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        return {
            text: editor.editor.getText(),
            inputHasFold: input.value.includes('fold'),
            notified,
        };
    });

    expect(fold.text).toContain('fold');
    expect(fold.inputHasFold).toBe(true);
    expect(fold.notified).toBeGreaterThan(0);
});

test('keyboard arrows, Backspace, and malformed opaque paste stay harness-safe', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Race' }] },
            leafBlock('block'),
        ],
    });
    await page.evaluate(() => {
        const editor = (document.querySelector('vizy-editor') as any).editor;
        editor.commands.setTextSelection(5);
        editor.view.focus();
    });
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('X');
    await page.keyboard.press('Backspace');
    const raced = await page.evaluate(() => {
        const editor = (document.querySelector('vizy-editor') as any).editor;
        const before = editor.getJSON();
        const bad = new DataTransfer();
        bad.setData('application/x-vizy-opaque-slice+json', '{not-json');
        const rejections: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-rejected', (event: Event) => {
            rejections.push((event as CustomEvent).detail);
        });
        const pasteBad = new Event('paste', { bubbles: true, cancelable: true });
        Object.defineProperty(pasteBad, 'clipboardData', { value: bad });
        editor.view.dom.dispatchEvent(pasteBad);
        return {
            before,
            after: editor.getJSON(),
            rejections,
        };
    });
    expect(raced.before.content[0].content).toEqual([{ type: 'text', text: 'Race' }]);
    expect(raced.after).toEqual(raced.before);
    expect(raced.rejections.length).toBeGreaterThanOrEqual(1);
});

test('edit then revert restores the accepted persisted baseline without dirty state', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Baseline' }] }],
    });
    const outcome = await page.evaluate(() => {
        const element = document.querySelector('vizy-editor') as any;
        element.editor.commands.insertContent(' dirty');
        const dirty = element.isDirty === true || element.editor.getText().includes('dirty');
        const baseline = {
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Baseline' }] }],
        };
        const submission = element.beginSubmission();
        element.acceptServerResult({
            requestKind: 'autosave',
            submittedClientRevision: submission.clientRevision,
            canonicalDocument: baseline,
            success: true,
            finalizationStatus: 'complete',
            retryToken: null,
        }, submission.generation);
        return {
            dirty,
            afterRevertDirty: element.isDirty,
            fullySaved: element.fullySaved,
            text: element.editor.getText(),
        };
    });
    expect(outcome.dirty).toBe(true);
    expect(outcome.afterRevertDirty).toBe(false);
    expect(outcome.fullySaved).toBe(true);
    expect(outcome.text).toContain('Baseline');
    expect(outcome.text).not.toContain('dirty');
});


test('stored embed content cannot create executable CP markup', async ({ page }) => {
    await mount(page, {
        type: 'doc', attrs: { schemaVersion: 2 }, content: [
            { type: 'mediaEmbed', attrs: {
                url: 'https://example.com/legacy',
                data: { html: '<img src="invalid" onerror="window.__vizyXss = true"><iframe srcdoc="unsafe"></iframe>' },
            } },
            { type: 'iframe', attrs: { url: 'javascript:window.parent.__vizyXss = true' } },
            { type: 'iframe', attrs: { url: 'https://example.com/frame' } },
            { type: 'paragraph', content: [{ type: 'text', text: 'Unsafe link', marks: [{ type: 'link', attrs: { type: 'url', value: 'javascript:alert(1)' } }] }] },
        ],
    }, { manifest: {
        ...editorManifest,
        enabledNodes: [...editorManifest.enabledNodes, 'iframe', 'mediaEmbed'],
        enabledMarks: [...editorManifest.enabledMarks, 'link'],
        modules: [...editorManifest.modules, 'vizy/core/node/iframe', 'vizy/core/node/mediaEmbed', 'vizy/core/mark/link'],
    } });
    await expect(page.locator('.ProseMirror [onerror], .ProseMirror [srcdoc]')).toHaveCount(0);
    await expect(page.locator('.ProseMirror iframe')).toHaveCount(1);
    await expect(page.locator('.ProseMirror iframe')).toHaveAttribute('sandbox', 'allow-scripts');
    await expect(page.locator('.ProseMirror a')).toHaveAttribute('href', '#');
    expect(await page.evaluate(() => (window as any).__vizyXss)).toBeUndefined();
});

// Exercise normal documents beyond private clipboard byte, node, and width limits.
test('large rich-text document edits stay within a responsive transaction budget', { tag: '@performance' }, async ({ page }, testInfo) => {
    await mount(page, {
        type: 'doc', attrs: { schemaVersion: 2 }, content: Array.from({ length: 4000 }, (_, index) => ({
            type: 'paragraph', content: [{ type: 'text', text: `Paragraph ${index} with rich text.` }],
        })),
    });
    const timings = await page.evaluate(() => {
        const editor = (document.querySelector('vizy-editor') as any).editor;
        editor.commands.setTextSelection(1);
        const durations: number[] = [];
        for (let index = 0; index < 20; index++) {
            const start = performance.now();
            editor.commands.insertContent('x');
            durations.push(performance.now() - start);
        }
        return durations.sort((a, b) => a - b);
    });
    await testInfo.attach('large-document-edit-timings', { body: JSON.stringify({ paragraphs: 4000, timings }), contentType: 'application/json' });
    // Generous cross-browser ceiling; actual timings are retained for review.
    expect(timings[18]).toBeLessThan(200);
    await expect(page.locator('.ProseMirror p')).toHaveCount(4000);
    await expect(page.locator('.ProseMirror p').first()).toHaveText('x'.repeat(20) + 'Paragraph 0 with rich text.');
    await expect(page.locator('.ProseMirror p').last()).toHaveText('Paragraph 3999 with rich text.');
    const saved = await page.evaluate(() => JSON.parse((document.querySelector('vizy-editor') as any).flush('submit')));
    expect(JSON.stringify(saved).length).toBeGreaterThan(256_000);
    await mount(page, saved);
    await expect(page.locator('.ProseMirror p')).toHaveCount(4000);
    await expect(page.locator('.ProseMirror p').first()).toHaveText('x'.repeat(20) + 'Paragraph 0 with rich text.');
    await expect(page.locator('.ProseMirror p').last()).toHaveText('Paragraph 3999 with rich text.');

});
