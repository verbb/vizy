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
    toolbar: {
        controls: [
            { id: 'bold', kind: 'mark', label: 'Bold', icon: null, action: { command: 'toggleMark', markName: 'bold' } },
            { id: 'italic', kind: 'mark', label: 'Italic', icon: null, action: { command: 'toggleMark', markName: 'italic' } },
        ],
    },
    // These cases exercise the fixed toolbar; bubble behavior has its own tests.
    bubble: {
        enabled: false,
        controls: [
            { id: 'bubble:bold', kind: 'mark', label: 'Bold', icon: null, action: { command: 'toggleMark', markName: 'bold' } },
        ],
    },
    field: {
        fieldUid: 'field',
        rootContentType: 'rich',
        blockTypePickerGroups: [],
        allowedBlockTypeUids: ['type'],
        minBlocks: null,
        maxBlocks: null,
    },
    blockTypes: {
        type: {
            uid: 'type',
            name: 'Example Block',
            handle: 'example',
            fieldLayoutUid: 'layout',
            fieldLayoutHash: 'hash',
            summaryInference: { titlePlacementUids: [], subtitlePlacementUids: [], mediaPlacementUids: [] },
        },
    },
    insertionItems: [],
};

async function mount(page: import('@playwright/test').Page, document: unknown) {
    const origin = 'https://vizy-authoring.test/';
    await page.route(`${origin}**`, (route) => route.fulfill({
        contentType: 'text/html',
        body: '<form><vizy-editor id="editor"><input data-vizy-document type="hidden" name="fields[body]"></vizy-editor></form>',
    }));
    await page.route(`${origin}assets/**`, (route) => route.fulfill({
        path: path.join(root, 'src/web/assets/field/dist/assets', path.basename(new URL(route.request().url()).pathname)),
    }));
    await page.goto(origin);
    await page.evaluate(() => {
        (window as any).__layoutRequests = 0;
        (window as any).Craft = { sendActionRequest: () => Promise.reject(new Error('unexpected')) };
    });
    await page.addScriptTag({ url: `${origin}assets/${path.basename(bundle)}`, type: 'module' });
    await expect.poll(() => page.evaluate(() => Boolean(customElements.get('vizy-editor')))).toBe(true);
    await page.evaluate(({ document, manifest }) => {
        (window as any).Craft.Vizy.bootstrapEditor('editor', {
            document,
            manifest,
            editorContextToken: 'test',
        });
    }, { document, manifest: editorManifest });
    await expect(page.locator('.ProseMirror')).toBeVisible();
}

test('renders toolbar', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [leafBlock('block-a')],
    });
    await expect(page.locator('vizy-toolbar')).toBeVisible();
    await expect(page.locator('vizy-structure-panel')).toHaveCount(0);
    await expect(page.locator('vizy-slot')).toHaveCount(0);
});

test('block collapse toggles body without losing fieldSlots', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [leafBlock('block-a', { title: 'Persist' })],
    });
    const block = page.locator('vizy-block[data-block-uid="block-a"]');
    await expect(block).not.toHaveAttribute('collapsed');
    await block.getByRole('button', { name: 'Block actions' }).click();
    await block.getByRole('menuitem', { name: 'Collapse', exact: true }).click();
    await expect(block).toHaveAttribute('collapsed');
    const slots = await page.evaluate(() => {
        const editor = (document.querySelector('vizy-editor') as any).editor;
        let found: Record<string, unknown> | null = null;
        editor.state.doc.descendants((node: any) => {
            if (node.type.name === 'vizyBlock' && node.attrs.blockUid === 'block-a') {
                found = node.attrs.fieldSlots as Record<string, unknown>;
            }
        });
        return found;
    });
    expect(slots).toMatchObject({ title: 'Persist' });
    await block.getByRole('button', { name: 'Block actions' }).click();
    await block.getByRole('menuitem', { name: 'Expand', exact: true }).click();
    await expect(block).not.toHaveAttribute('collapsed');
});

test('toolbar bold toggles selected text', async ({ page }) => {
    await mount(page, {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Format me' }] }],
    });
    await page.locator('.ProseMirror p').click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.locator('vizy-toolbar').getByRole('button', { name: 'Bold', exact: true }).click();
    const active = await page.evaluate(() => (document.querySelector('vizy-editor') as any).editor.isActive('bold'));
    expect(active).toBe(true);
});
