import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { equalColumnWidths, urlLinkAttrs } from '../../src/web/assets/field/src/ts/semantic/attrs';
import { sanitizeSemanticNodes } from '../../src/web/assets/field/src/ts/semantic/sanitize';
import { restoreCanonicalFromEditor } from '../../src/web/assets/field/src/ts/transport/opaque';
import '../../src/web/assets/field/src/ts/toolbar/VizyToolbarElement';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const ASSET_UID = '22222222-2222-4222-8222-222222222222';
const editors: Editor[] = [];

afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

function richManifest(): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema',
        enabledNodes: ['paragraph', 'image', 'table', 'tableRow', 'tableCell', 'tableHeader'],
        enabledMarks: ['link'],
        internalNodes: ['doc', 'text', 'tableRow', 'tableCell', 'tableHeader'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/node/image',
            'vizy/core/node/table',
            'vizy/core/node/tableRow',
            'vizy/core/node/tableCell',
            'vizy/core/node/tableHeader',
            'vizy/core/mark/link',
        ],
        toolbar: { controls: [{ id: 'link', kind: 'mark', label: 'Link', action: { command: 'setLink' } }] },
        bubble: { controls: [{ id: 'bubble:link', kind: 'mark', label: 'Link', action: { command: 'setLink' } }] },
        field: {
            fieldUid: 'field',
            rootContentType: 'rich',
            blockTypePickerGroups: [],
            allowedBlockTypeUids: [],
            insertableBlockTypeUids: [],
            minBlocks: null,
            maxBlocks: null,
        },
        blockTypes: {},
        insertionItems: [],
    };
}

function makeEditor(content?: object): Editor {
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    const manifest = richManifest();
    let editor!: Editor;
    let insertion!: ReturnType<typeof createInsertionRegistry>;
    editor = new Editor({
        element: document.createElement('div'),
        extensions: createEditorExtensions(manifest, () => nodeViewServices({
            editor,
            manifest,
            ui,
            hosts,
            insertion,
        })),
        content,
    });
    insertion = createInsertionRegistry({ editor, manifest, documentRevision: () => 0, createUid: () => crypto.randomUUID() }, 'test', []);
    editors.push(editor);
    return editor;
}

describe('semantic link mark', () => {
    it('persists canonical attrs without href', () => {
        const editor = makeEditor({
            type: 'doc',
            content: [{
                type: 'paragraph',
                content: [{
                    type: 'text',
                    text: 'Example',
                    marks: [{
                        type: 'link',
                        attrs: urlLinkAttrs('https://example.com'),
                    }],
                }],
            }],
        });
        const canonical = restoreCanonicalFromEditor(editor.getJSON() as never);
        const mark = canonical.content?.[0]?.content?.[0]?.marks?.[0];
        expect(mark?.type).toBe('link');
        expect(mark?.attrs).toMatchObject({
            type: 'url',
            value: 'https://example.com',
            siteMode: 'current',
            newWindow: false,
        });
        expect(mark?.attrs).not.toHaveProperty('href');
    });

    it('applies a url link from the command API', () => {
        const editor = makeEditor({
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Linked' }] }],
        });
        editor.commands.setTextSelection({ from: 1, to: 7 });
        expect(editor.commands.setSemanticLink(urlLinkAttrs('https://vizy.test'))).toBe(true);
        const mark = editor.getJSON().content?.[0]?.content?.[0]?.marks?.[0];
        expect(mark?.attrs?.value).toBe('https://vizy.test');
        expect(mark?.attrs?.href).toBeUndefined();
    });
});

describe('semantic image node', () => {
    it('requires assetUid for insertion', () => {
        const editor = makeEditor({ type: 'doc', content: [{ type: 'paragraph' }] });
        expect(editor.commands.setSemanticImage({ assetUid: 'not-a-uuid' })).toBe(false);
        expect(editor.commands.setSemanticImage({ assetUid: ASSET_UID })).toBe(true);
        const node = editor.getJSON().content?.find((item) => item.type === 'image');
        expect(node?.type).toBe('image');
        expect(node?.attrs?.assetUid).toBe(ASSET_UID);
        expect(node?.attrs?.src).toBeUndefined();
    });

    it('rejects canonical projection without assetUid', () => {
        expect(() => sanitizeSemanticNodes({
            type: 'doc',
            content: [{ type: 'image', attrs: { altMode: 'asset', size: 'default' } }],
        })).toThrow(/semanticImageMissingAssetUid/);
    });
});

describe('semantic table node', () => {
    it('stores columnWidths totaling 1000 on insert', () => {
        const editor = makeEditor({ type: 'doc', content: [{ type: 'paragraph' }] });
        editor.chain().focus().selectAll().insertTable({ rows: 2, cols: 3, withHeaderRow: false }).run();
        const table = editor.getJSON().content?.find((item) => item.type === 'table');
        expect(table?.type).toBe('table');
        expect(table?.attrs?.columnWidths).toEqual(equalColumnWidths(3));
        expect((table?.attrs?.columnWidths as number[]).reduce((a, b) => a + b, 0)).toBe(1000);
    });

    it('strips cell colwidth from canonical projection', () => {
        const editor = makeEditor({ type: 'doc', content: [{ type: 'paragraph' }] });
        editor.chain().focus().selectAll().insertTable({ rows: 2, cols: 2, withHeaderRow: false }).run();
        const canonical = restoreCanonicalFromEditor(editor.getJSON() as never);
        const table = canonical.content?.find((item) => item.type === 'table');
        const row = table?.content?.[0];
        const cell = row?.content?.[0];
        expect(cell?.attrs?.colwidth).toBeUndefined();
        expect(table?.attrs?.columnWidths).toEqual(equalColumnWidths(2));
    });

    it('validates column width totals during sanitize', () => {
        expect(() => sanitizeSemanticNodes({
            type: 'doc',
            content: [{ type: 'table', attrs: { columnWidths: [500, 400] }, content: [] }],
        })).toThrow(/semanticTableColumnWidthTotal/);
    });
});

describe('link toolbar UI', () => {
    it('renders a Link menu and opens the Insert Link dialog (not window.prompt)', async () => {
        const prompt = vi.spyOn(window, 'prompt').mockReturnValue('https://example.com/docs');
        const dialogMod = await import('../../src/web/assets/field/src/ts/semantic/link-dialog');
        const openSpy = vi.spyOn(dialogMod, 'openVizyLinkDialog').mockResolvedValue();

        const editor = makeEditor({
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Docs' }] }],
        });
        editor.commands.setTextSelection({ from: 1, to: 5 });
        const toolbar = document.createElement('vizy-toolbar');
        toolbar.editor = editor;
        toolbar.controls = richManifest().toolbar?.controls ?? [];
        document.body.append(toolbar);
        await toolbar.updateComplete;

        expect(toolbar.shadowRoot?.querySelector('pk-dropdown-menu')).toBeTruthy();
        const insertItem = [...(toolbar.shadowRoot?.querySelectorAll('pk-dropdown-item') ?? [])]
            .find((el) => el.textContent?.includes('Insert Link'));
        expect(insertItem).toBeTruthy();
        insertItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await Promise.resolve();

        expect(prompt).not.toHaveBeenCalled();
        expect(openSpy).toHaveBeenCalled();
        toolbar.remove();
        openSpy.mockRestore();
        prompt.mockRestore();
    });
});

describe('semantic attr helpers', () => {
    it('distributes equal column widths to 1000', () => {
        expect(equalColumnWidths(3)).toEqual([334, 333, 333]);
        expect(equalColumnWidths(3).reduce((a, b) => a + b, 0)).toBe(1000);
    });
});
