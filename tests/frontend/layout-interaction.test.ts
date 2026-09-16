import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { registerLayoutInsertion, LAYOUT_INSERTION_ID } from '../../src/web/assets/field/src/ts/layout/insertion';
import {
    canWrapSelection,
    insertLayout,
    moveColumn,
    resizeLayoutGutter,
    unwrapLayout,
    wrapInLayout,
} from '../../src/web/assets/field/src/ts/layout/commands';
import { activateLayoutControl } from '../../src/web/assets/field/src/ts/layout/layout-ui';
import { findLayoutByUid } from '../../src/web/assets/field/src/ts/layout/lookup';
import { DEFAULT_LAYOUT_PRESETS, gutterCandidates, resolveLayoutPresets } from '../../src/web/assets/field/src/ts/layout/presets';
import { resizeLayoutColumns } from '../../src/web/assets/field/src/ts/layout/resize';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    document.querySelectorAll('vizy-layout-preset-chooser, pk-popup.vizy-layout-preset-popup').forEach((node) => node.remove());
    document.body.querySelectorAll(':scope > div').forEach((node) => {
        if (node.querySelector('.vizy-editor-surface')) node.remove();
    });
});

let uidCounter = 0;
function nextUid(): string {
    uidCounter += 1;
    return `00000000-0000-4000-8000-${String(uidCounter).padStart(12, '0')}`;
}

function manifest(overrides: Partial<EditorManifest> = {}): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema',
        enabledNodes: ['paragraph', 'layout', 'column', 'vizyBlock'],
        enabledMarks: [],
        internalNodes: ['doc', 'text', 'vizyBlock', 'layout', 'column'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/node/vizyBlock',
                        'vizy/core/node/layout',
            'vizy/core/node/column',
        ],
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
        ...overrides,
    };
}

function makeEditor(content?: object, overrides: Partial<EditorManifest> = {}): Editor {
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    const m = manifest(overrides);
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
    insertion = createInsertionRegistry(
        { editor, manifest: m, documentRevision: () => 0, createUid: nextUid },
        'test',
        [],
    );
    registerLayoutInsertion(insertion, m);
    editors.push(editor);
    return editor;
}

function layoutDocument(
    layoutUid: string,
    columns: Array<{ columnUid: string; span: number; content?: unknown[] }>,
) {
    return {
        type: 'doc',
        attrs: { schemaVersion: 2 },
        content: [{
            type: 'layout',
            attrs: { layoutUid, stack: 'small' },
            content: columns.map((column) => ({
                type: 'column',
                attrs: { columnUid: column.columnUid, span: column.span },
                content: column.content ?? [{ type: 'paragraph' }],
            })),
        }],
    };
}

describe('layout presets', () => {
    it('exposes the five default column-named presets', () => {
        expect(resolveLayoutPresets(manifest()).map((preset) => preset.id)).toEqual([
            'two-columns',
            'three-columns',
            'four-columns',
            '60-40',
            '40-60',
        ]);
        expect(resolveLayoutPresets(manifest()).map((preset) => preset.label)).toEqual([
            'Two columns',
            'Three columns',
            'Four columns',
            '60/40',
            '40/60',
        ]);
    });

    it('lists snapped gutter candidates for an adjacent pair', () => {
        expect(gutterCandidates(6, 6)).toEqual([[1, 11], [2, 10], [3, 9], [4, 8], [5, 7], [6, 6], [7, 5], [8, 4], [9, 3], [10, 2], [11, 1]]);
    });
});

describe('layout insertion', () => {
    it('opens preset chooser flow when multiple presets are enabled', async () => {
        const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph' }] });
        const registry = createInsertionRegistry(
            { editor, manifest: manifest(), documentRevision: () => 0, createUid: nextUid },
            'test',
            [],
        );
        registerLayoutInsertion(registry, manifest());
        const context = registry.buildContext('slash', 1);
        expect(context).toBeTruthy();
        const opened = await registry.execute({ id: LAYOUT_INSERTION_ID, context: context! });
        expect(opened.status).toBe('opened');
    });

    it('inserts directly when exactly one preset is configured', async () => {
        const singlePresetManifest = manifest({
            layoutPresets: [{ id: 'two-columns', label: 'Two columns', spans: [6, 6] }],
        });
        const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph' }] }, singlePresetManifest);
        const registry = createInsertionRegistry(
            { editor, manifest: singlePresetManifest, documentRevision: () => 0, createUid: nextUid },
            'test',
            [],
        );
        registerLayoutInsertion(registry, singlePresetManifest);
        const context = registry.buildContext('slash', 1);
        const result = await registry.execute({ id: LAYOUT_INSERTION_ID, context: context! });
        expect(result.status).toBe('inserted');
        expect(editor.state.doc.childCount).toBe(1);
        expect(editor.state.doc.firstChild?.type.name).toBe('layout');
    });

    it('settles after insert without remount-looping layout hosts', async () => {
        const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph' }] });
        const inserted = insertLayout(
            editor,
            DEFAULT_LAYOUT_PRESETS[0],
            0,
            nextUid,
        );
        expect(inserted).toBe(true);

        // Lit reflected attrs + UI paint land in microtasks. A remount loop
        // would keep spawning hosts; a healthy insert leaves one layout + two columns.
        await Promise.resolve();
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));

        const layouts = editor.view.dom.querySelectorAll('vizy-layout');
        const columns = editor.view.dom.querySelectorAll('vizy-column');
        expect(layouts).toHaveLength(1);
        expect(columns).toHaveLength(2);
        expect(editor.state.doc.firstChild?.type.name).toBe('layout');
        expect(columns[0].style.gridColumn).toContain('span');

        // Grid must live on the ProseMirror contentDOM that owns both columns —
        // not on a shadow wrapper (that parked the wrapper in track 1 of 12).
        const columnsGrid = layouts[0].querySelector('.vizy-layout-columns');
        expect(columnsGrid).toBeTruthy();
        expect((columnsGrid as HTMLElement).style.display).toBe('grid');
        expect((columnsGrid as HTMLElement).style.gridTemplateColumns).toContain('repeat(12');
        expect(columnsGrid?.contains(columns[0])).toBe(true);
        expect(columnsGrid?.contains(columns[1])).toBe(true);
        expect(columns[0].parentElement).toBe(columnsGrid);
        expect(columns[1].parentElement).toBe(columnsGrid);
    });
});

describe('layout resize and reorder', () => {
    it('keeps total span at twelve when resizing adjacent columns', () => {
        const editor = makeEditor(layoutDocument('layout-a', [
            { columnUid: 'col-a', span: 6, content: [] },
            { columnUid: 'col-b', span: 6, content: [] },
        ]));
        let layoutPos = 0;
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'layout') layoutPos = pos;
        });
        expect(resizeLayoutColumns(editor, layoutPos, 0, 1, 1)).toBe(true);
        const spans: number[] = [];
        editor.state.doc.descendants((node) => {
            if (node.type.name === 'column') spans.push(Number(node.attrs.span));
        });
        expect(spans).toEqual([7, 5]);
    });

    it('commits identical spans for keyboard and semantic gutter commands', () => {
        const editor = makeEditor(layoutDocument('layout-b', [
            { columnUid: 'col-a', span: 6, content: [] },
            { columnUid: 'col-b', span: 6, content: [] },
        ]));
        expect(resizeLayoutGutter(editor, 'layout-b', 'col-a', gutterCandidates(6, 6).findIndex(([left]) => left === 7))).toBe(true);
        let spans: number[] = [];
        editor.state.doc.descendants((node) => {
            if (node.type.name === 'column') spans.push(Number(node.attrs.span));
        });
        expect(spans).toEqual([7, 5]);
    });

    it('reorders columns while preserving UIDs', () => {
        const editor = makeEditor(layoutDocument('layout-c', [
            { columnUid: 'col-a', span: 6, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A' }] }] },
            { columnUid: 'col-b', span: 6, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'B' }] }] },
        ]));
        expect(moveColumn(editor, 'col-b', -1)).toBe(true);
        const uids: string[] = [];
        editor.state.doc.descendants((node) => {
            if (node.type.name === 'column') uids.push(String(node.attrs.columnUid));
        });
        expect(uids).toEqual(['col-b', 'col-a']);
    });
});

describe('wrap and unwrap', () => {
    it('wraps a selected block into the first column and leaves the second empty', () => {
        const editor = makeEditor({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'One' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'Two' }] },
            ],
        });
        let firstPos: number | null = null;
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'paragraph' && firstPos === null) firstPos = pos;
        });
        editor.view.dispatch(editor.state.tr.setSelection(NodeSelection.create(editor.state.doc, firstPos!)));
        const { from, to } = editor.state.selection;
        expect(wrapInLayout(editor, from, to, DEFAULT_LAYOUT_PRESETS[0], nextUid)).toBe(true);
        expect(editor.state.doc.childCount).toBe(2);
        expect(editor.state.doc.firstChild?.type.name).toBe('layout');
        expect(editor.state.doc.firstChild?.child(0).textContent).toContain('One');
        expect(editor.state.doc.firstChild?.child(1).textContent).toBe('');
        expect(editor.state.doc.lastChild?.textContent).toBe('Two');
    });

    it('wraps a single selected block into a two-column layout', () => {
        const editor = makeEditor({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'One' }] }],
        });
        let firstPos: number | null = null;
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'paragraph' && firstPos === null) firstPos = pos;
        });
        editor.view.dispatch(editor.state.tr.setSelection(NodeSelection.create(editor.state.doc, firstPos!)));
        const { from, to } = editor.state.selection;
        expect(wrapInLayout(editor, from, to, DEFAULT_LAYOUT_PRESETS[0], nextUid)).toBe(true);
        expect(editor.state.doc.childCount).toBe(1);
        expect(editor.state.doc.firstChild?.type.name).toBe('layout');
        expect(editor.state.doc.firstChild?.childCount).toBe(2);
        expect(editor.state.doc.firstChild?.textContent).toContain('One');
    });

    it('unwraps layout columns in visual order', () => {
        const editor = makeEditor(layoutDocument('layout-d', [
            { columnUid: 'col-a', span: 6, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A' }] }] },
            { columnUid: 'col-b', span: 6, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'B' }] }] },
        ]));
        expect(unwrapLayout(editor, 'layout-d')).toBe(true);
        expect(editor.state.doc.childCount).toBe(2);
        expect(editor.state.doc.child(0).textContent).toBe('A');
        expect(editor.state.doc.child(1).textContent).toBe('B');
    });

    it('rejects wrap when selection is inside a column', () => {
        const editor = makeEditor(layoutDocument('layout-e', [
            { columnUid: 'col-a', span: 6 },
            { columnUid: 'col-b', span: 6 },
        ]));
        let innerPos = 0;
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'paragraph') innerPos = pos + 1;
        });
        expect(canWrapSelection(editor, innerPos, innerPos)).toBe(false);
    });

});

describe('insertLayout command', () => {
    it('creates a layout with empty columns from a preset', () => {
        const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [] });
        const preset = DEFAULT_LAYOUT_PRESETS.find((entry) => entry.id === 'three-columns')!;
        expect(insertLayout(editor, preset, 0, nextUid)).toBe(true);
        const located = findLayoutByUid(editor.state.doc, String(editor.state.doc.firstChild?.attrs.layoutUid));
        expect(located?.node.childCount).toBe(3);
        const spans: number[] = [];
        located?.node.forEach((column) => spans.push(Number(column.attrs.span)));
        expect(spans).toEqual([4, 4, 4]);
    });
});

describe('toolbar Layout control', () => {
    it('opens the preset chooser when multiple presets are available', () => {
        const surface = document.createElement('div');
        surface.className = 'vizy-editor-surface';
        const mount = document.createElement('div');
        mount.append(surface);
        document.body.append(mount);

        const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph' }] });
        surface.append(editor.view.dom);

        expect(activateLayoutControl(editor, { focus: false })).toBe(true);
        expect(document.querySelector('vizy-layout-preset-chooser')).toBeTruthy();
        expect(document.querySelector('pk-popup.vizy-layout-preset-popup')).toBeTruthy();
        // Close so later cases do not see a leftover chooser in document.body.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    it('inserts immediately when only one preset is configured', () => {
        document.querySelectorAll('vizy-layout-preset-chooser, pk-popup.vizy-layout-preset-popup').forEach((node) => node.remove());

        const surface = document.createElement('div');
        surface.className = 'vizy-editor-surface';
        const mount = document.createElement('div');
        mount.append(surface);
        document.body.append(mount);

        const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph' }] });
        surface.append(editor.view.dom);

        const single = DEFAULT_LAYOUT_PRESETS.find((entry) => entry.id === 'two-columns')!;
        expect(activateLayoutControl(editor, { focus: false, presets: [single] })).toBe(true);
        expect(editor.state.doc.firstChild?.type.name).toBe('layout');
        expect(document.querySelector('pk-popup.vizy-layout-preset-popup')).toBeNull();
    });

    it('unwraps via the TipTap unwrapLayout command when already inside a layout', () => {
        const editor = makeEditor(layoutDocument('layout-toolbar', [
            { columnUid: 'col-a', span: 6 },
            { columnUid: 'col-b', span: 6 },
        ]));
        let innerPos = 0;
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'paragraph' && innerPos === 0) innerPos = pos + 1;
        });
        editor.commands.setTextSelection(innerPos);
        expect(editor.isActive('layout')).toBe(true);

        // Stub the chain the toolbar uses — full unwrap transforms are covered by
        // unwrapLayout() cases above; this proves activateLayoutControl's branch.
        const run = vi.fn().mockReturnValue(true);
        const unwrap = vi.fn().mockReturnValue({ run });
        vi.spyOn(editor, 'chain').mockReturnValue({
            focus: () => ({ unwrapLayout: unwrap }),
            unwrapLayout: unwrap,
        } as never);

        expect(activateLayoutControl(editor, { focus: false })).toBe(true);
        expect(unwrap).toHaveBeenCalled();
        expect(run).toHaveBeenCalled();
    });
});

it('wraps a text selection as complete blocks without invalid inline column content', () => {
    const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Selected paragraph' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Keep outside' }] },
    ] });
    editor.commands.setTextSelection({ from: 2, to: 8 });
    expect(canWrapSelection(editor, 2, 8)).toBe(true);
    expect(wrapInLayout(editor, 2, 8, DEFAULT_LAYOUT_PRESETS[0], nextUid)).toBe(true);
    editor.state.doc.check();
    expect(editor.state.doc.firstChild?.firstChild?.firstChild?.type.name).toBe('paragraph');
    expect(editor.state.doc.firstChild?.textContent).toBe('Selected paragraph');
    expect(editor.state.doc.lastChild?.textContent).toBe('Keep outside');
});

it('wraps a selection spanning sibling paragraphs into one layout', () => {
    const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'One' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Two' }] },
    ] });
    editor.commands.setTextSelection({ from: 1, to: 9 });
    expect(canWrapSelection(editor, 1, 9)).toBe(true);
    expect(wrapInLayout(editor, 1, 9, DEFAULT_LAYOUT_PRESETS[0], nextUid)).toBe(true);
    editor.state.doc.check();
    expect(editor.state.doc.childCount).toBe(1);
    expect(editor.state.doc.firstChild?.firstChild?.childCount).toBe(2);
    expect(editor.state.doc.textContent).toBe('OneTwo');
});


it('keeps formatting when wrapping a selection and supports undo', () => {
    const editor = makeEditor({ type: 'doc', attrs: { schemaVersion: 2 }, content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Bold', marks: [{ type: 'bold' }] }] },
    ] }, { enabledMarks: ['bold'], modules: [...manifest().modules, 'vizy/core/mark/bold'] });
    const before = editor.getJSON();
    editor.commands.setTextSelection({ from: 1, to: 5 });
    expect(wrapInLayout(editor, 1, 5, DEFAULT_LAYOUT_PRESETS[0], nextUid)).toBe(true);
    editor.state.doc.check();
    expect(editor.state.doc.firstChild?.firstChild?.firstChild?.firstChild?.marks[0].type.name).toBe('bold');
    editor.commands.undo();
    expect(editor.getJSON()).toEqual(before);
});
