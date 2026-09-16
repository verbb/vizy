import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import type { Content } from '@tiptap/core';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { refreshBlockSummaries } from '../../src/web/assets/field/src/ts/blocks/summary-sync';
import { resizeLayoutColumns } from '../../src/web/assets/field/src/ts/layout/resize';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

function manifest(): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema',
        enabledNodes: ['paragraph', 'layout', 'column', 'vizyBlock'],
        enabledMarks: ['bold'],
        internalNodes: ['doc', 'text', 'vizyBlock', 'layout', 'column'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/node/vizyBlock',
                        'vizy/core/node/layout',
            'vizy/core/node/column',
            'vizy/core/mark/bold',
        ],
        toolbar: { controls: [{ id: 'bold', kind: 'mark', label: 'Bold', action: { command: 'toggleMark', markName: 'bold' } }] },
        bubble: { controls: [{ id: 'bubble:bold', kind: 'mark', label: 'Bold', action: { command: 'toggleMark', markName: 'bold' } }] },
        field: {
            fieldUid: 'field',
            rootContentType: 'blocks',
            blockTypePickerGroups: [],
            allowedBlockTypeUids: ['type'],
            insertableBlockTypeUids: ['type'],
            minBlocks: null,
            maxBlocks: null,
        },
        blockTypes: {
            type: {
                uid: 'type',
                name: 'Example',
                handle: 'example',
                
                summaryInference: { titlePlacementUids: [], subtitlePlacementUids: [], mediaPlacementUids: [] },
            },
        },
        insertionItems: [],
    };
}

function makeEditor(content: Content): Editor {
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    const m = manifest();
    let editor!: Editor;
    let insertion!: ReturnType<typeof createInsertionRegistry>;
    editor = new Editor({
        element: document.createElement('div'),
        extensions: createEditorExtensions(m, () => nodeViewServices({
            editor,
            manifest: m,
            ui,
            hosts,
            insertion,
        })),
        content,
    });
    insertion = createInsertionRegistry({ editor, manifest: m, documentRevision: () => 0, createUid: () => crypto.randomUUID() }, 'test', []);
    editors.push(editor);
    return editor;
}

describe('structure summary projection performance', () => {
    it('projects summaries for 500 blocks within a deterministic work budget', () => {
        const ui = new BlockUiStateRegistry();
        const m = manifest();
        const content = Array.from({ length: 500 }, (_, index) => ({
            type: 'vizyBlock',
            attrs: {
                blockUid: `block-${index}`,
                blockTypeUid: 'type',
                enabled: true,
                fieldSlots: { title: `Block ${index}` },
            },
            content: [],
        }));
        const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content });
        const revisions = new Map(content.map((node, index) => [String(node.attrs.blockUid), index]));
        const started = performance.now();
        refreshBlockSummaries(editor, m, ui, revisions);
        const elapsed = performance.now() - started;
        expect(ui.get('block-0').summary?.title).toBeTruthy();
        expect(ui.get('block-499').summary?.title).toBeTruthy();
        expect(elapsed).toBeLessThan(250);
    });
});

describe('layout resize commands', () => {
    it('keeps total span at twelve when resizing adjacent columns', () => {
        const editor = makeEditor({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [{
                type: 'layout',
                attrs: { layoutUid: 'layout-a', stack: 'small' },
                content: [
                    { type: 'column', attrs: { columnUid: 'col-a', span: 6 }, content: [] },
                    { type: 'column', attrs: { columnUid: 'col-b', span: 6 }, content: [] },
                ],
            }],
        });
        let layoutPos = 0;
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'layout') layoutPos = pos;
        });
        expect(resizeLayoutColumns(editor, layoutPos, 0, 1, 1)).toBe(true);
        let spans: number[] = [];
        editor.state.doc.descendants((node) => {
            if (node.type.name === 'column') spans.push(Number(node.attrs.span));
        });
        expect(spans).toEqual([7, 5]);
    });
});
