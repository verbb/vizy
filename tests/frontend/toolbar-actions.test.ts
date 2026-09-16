import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { isActionActive, isActionable, runToolbarAction } from '../../src/web/assets/field/src/ts/toolbar/actions';
import type { EditorManifest, TableOperation, ToolbarActionManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];

afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

/**
 * The real schema, not a hand-assembled one.
 *
 * These actions are all about what `createEditorExtensions` puts in the schema — history
 * and alignment are loaded there rather than named by the manifest — so a harness listing
 * its own extensions would prove nothing about the editor an author actually gets.
 */
function proseManifest(): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema',
        // Hard break rides along because it is always enabled: it has no capability to be
        // switched off, so every real manifest carries it.
        enabledNodes: ['paragraph', 'heading', 'hardBreak'],
        enabledMarks: ['bold'],
        internalNodes: ['doc', 'text'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/node/heading',
            'vizy/core/node/hardBreak',
            'vizy/core/mark/bold',
        ],
        toolbar: { controls: [] },
        bubble: { controls: [] },
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

function makeEditor(text = 'Hello'): Editor {
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    const manifest = proseManifest();
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
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] },
    });
    insertion = createInsertionRegistry({ editor, manifest, documentRevision: () => 0, createUid: () => crypto.randomUUID() }, 'test', []);
    editors.push(editor);
    return editor;
}

/** The first block's attributes, which is where alignment is written. */
function firstBlock(editor: Editor): Record<string, unknown> {
    const json = editor.getJSON() as { content?: { attrs?: Record<string, unknown> }[] };

    return json.content?.[0]?.attrs ?? {};
}

/**
 * An editor with tables on, for the operations whose commands arrive with that extension.
 *
 * A separate manifest rather than tables added to `proseManifest`, because the point of the
 * table buttons is that they are gated: the prose editor has to stay one that does not have
 * them, so the declining path is exercised too.
 */
function makeTableEditor(): Editor {
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    const manifest: EditorManifest = {
        ...proseManifest(),
        enabledNodes: ['paragraph', 'table', 'tableRow', 'tableCell', 'tableHeader'],
        // Nothing but tables, so the module list below is the whole of it.
        enabledMarks: [],
        internalNodes: ['doc', 'text', 'tableRow', 'tableCell', 'tableHeader'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/node/table',
            'vizy/core/node/tableRow',
            'vizy/core/node/tableCell',
            'vizy/core/node/tableHeader',
        ],
    };
    let editor!: Editor;
    let insertion!: ReturnType<typeof createInsertionRegistry>;
    editor = new Editor({
        element: document.createElement('div'),
        extensions: createEditorExtensions(manifest, () => nodeViewServices({ editor, manifest, ui, hosts, insertion })),
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
    });
    insertion = createInsertionRegistry({ editor, manifest, documentRevision: () => 0, createUid: () => crypto.randomUUID() }, 'test', []);
    editors.push(editor);
    return editor;
}

function run(editor: Editor, action: ToolbarActionManifest): boolean {
    editor.commands.selectAll();

    return runToolbarAction(editor, action);
}

describe('toolbar actions with no capability behind them', () => {
    it('does not claim editor focus when the surface was unfocused', () => {
        const editor = makeEditor('Hello');
        document.body.focus();
        expect(editor.view.hasFocus()).toBe(false);

        expect(runToolbarAction(editor, { command: 'toggleMark', markName: 'bold' })).toBe(true);
        expect(editor.view.hasFocus()).toBe(false);
        expect(editor.isActive('bold')).toBe(true);
    });

    it('undoes and redoes, which the editor could not do at all before', () => {
        // History was simply absent: the extension list is explicit rather than
        // StarterKit's, and nothing in it was a history plugin, so Cmd+Z did nothing
        // either. Undo is the proof the extension is now loaded.
        const editor = makeEditor('Hello');
        editor.commands.focus('end');
        editor.commands.insertContent(' there');
        expect(editor.getText()).toBe('Hello there');

        expect(runToolbarAction(editor, { command: 'undo' })).toBe(true);
        expect(editor.getText()).toBe('Hello');

        expect(runToolbarAction(editor, { command: 'redo' })).toBe(true);
        expect(editor.getText()).toBe('Hello there');
    });

    it('aligns a block, and clears the alignment when the same button is pressed again', () => {
        const editor = makeEditor();

        // An unaligned block carries nothing, rather than an explicit `null`. Loading the
        // extension must not rewrite every paragraph in every document the first time it
        // is saved, which a default of `left` would have done.
        expect(firstBlock(editor)).not.toHaveProperty('textAlign', 'left');

        run(editor, { command: 'setTextAlign', align: 'center' });
        expect(firstBlock(editor).textAlign).toBe('center');
        expect(isActionActive(editor, { command: 'setTextAlign', align: 'center' })).toBe(true);
        expect(isActionActive(editor, { command: 'setTextAlign', align: 'right' })).toBe(false);

        // Pressing the alignment in force clears it, so the button reads as the toggle its
        // pressed state says it is rather than as a one-way apply.
        run(editor, { command: 'setTextAlign', align: 'center' });
        expect(firstBlock(editor).textAlign ?? null).toBeNull();
    });

    it('aligns headings too, since those are what the front end renders alignment on', () => {
        // `Paragraph::getTag` and `Heading::getTag` turn a `textAlign` attribute into a
        // `text-center` class, and only those two. The schema is configured to match, so
        // an alignment an author can apply is one the site can render.
        const editor = makeEditor();
        run(editor, { command: 'setHeading', level: 2 });
        run(editor, { command: 'setTextAlign', align: 'right' });

        const block = firstBlock(editor);
        expect(block.level).toBe(2);
        expect(block.textAlign).toBe('right');
    });

    it('clears marks and block wrappers together', () => {
        const editor = makeEditor();
        run(editor, { command: 'setHeading', level: 2 });
        run(editor, { command: 'toggleMark', markName: 'bold' });
        expect(editor.isActive('bold')).toBe(true);

        run(editor, { command: 'clearFormatting' });

        // A "clear formatting" that left a heading a heading would surprise, so the
        // selection returns to plain paragraphs as well as losing its marks.
        expect(editor.isActive('bold')).toBe(false);
        expect(editor.isActive('heading')).toBe(false);
        expect(editor.isActive('paragraph')).toBe(true);
    });

    it('treats every new command as one it can honour, and unknown ones as dead', () => {
        // The guard that stops an older field bundle rendering a button it cannot run.
        for (const command of ['undo', 'redo', 'clearFormatting', 'wrapInLayout'] as const) {
            expect(isActionable({ id: command, kind: 'action', label: command, action: { command } })).toBe(true);
        }
        expect(isActionable({
            id: 'alignLeft',
            kind: 'action',
            label: 'Align left',
            action: { command: 'setTextAlign', align: 'left' },
        })).toBe(true);
        expect(isActionable({
            id: 'nonsense',
            kind: 'action',
            label: 'Nonsense',
            action: { command: 'somethingElse' } as never,
        })).toBe(false);
    });

    it('calls each table operation by the name TipTap knows it as', () => {
        // These are the one set of actions whose manifest carries the command's own name, so a
        // typo would produce a button that silently did nothing rather than a compile error.
        const editor = makeTableEditor();
        const operations: TableOperation[] = [
            'addColumnBefore', 'addColumnAfter', 'deleteColumn',
            'addRowBefore', 'addRowAfter', 'deleteRow',
            'mergeCells', 'splitCell',
            'toggleHeaderRow', 'toggleHeaderColumn', 'toggleHeaderCell',
            'deleteTable',
        ];
        const chain = editor.chain() as unknown as Record<string, unknown>;

        for (const operation of operations) {
            expect(typeof chain[operation], `${operation} is not a table command`).toBe('function');
        }

        // And one of them end to end, so the wiring is proven rather than just the names.
        runToolbarAction(editor, { command: 'insertNode', nodeName: 'table' });
        const rows = () => (editor.getJSON().content ?? []).find((node) => node.type === 'table')?.content?.length ?? 0;
        const before = rows();
        expect(runToolbarAction(editor, { command: 'tableOperation', operation: 'addRowAfter' })).toBe(true);
        expect(rows()).toBe(before + 1);
    });

    it('edits the table around the cursor, and declines when there is no table extension', () => {
        // Vizy 3's Table dropdown members. They are actions, but unlike the rest their commands
        // come with the Table extension — which this editor does not load, since the manifest
        // does not enable the capability. A stored config can still name the buttons, so the
        // runner has to decline rather than throw on a missing command.
        const editor = makeEditor();

        expect(runToolbarAction(editor, { command: 'tableOperation', operation: 'addRowAfter' })).toBe(false);
        expect(runToolbarAction(editor, { command: 'tableOperation', operation: 'deleteTable' })).toBe(false);

        // And it is still a command the button may render for, or an editor with tables on
        // would drop the whole dropdown.
        expect(isActionable({
            id: 'tableMergeCells',
            kind: 'action',
            label: 'Merge cells',
            action: { command: 'tableOperation', operation: 'mergeCells' },
        })).toBe(true);
    });

    it('breaks the line at the cursor rather than beside it', () => {
        // The generic insert builds the node and drops it in, which for a hard break landed it
        // next to the text instead of splitting it — so the break has its own command.
        const editor = makeEditor('Hello');
        editor.commands.focus('end');
        runToolbarAction(editor, { command: 'insertNode', nodeName: 'hardBreak' });
        editor.commands.insertContent('there');

        const paragraph = editor.getJSON().content?.[0];
        expect(paragraph?.content?.map((node) => node.type)).toEqual(['text', 'hardBreak', 'text']);
    });

    it('declines to wrap in columns when the capability is off, rather than throwing', () => {
        // `wrapInLayout` belongs to an extension that is only loaded while Layout is
        // enabled, and a stored config can still name the button, so the runner asks for
        // the command before calling it.
        const editor = makeEditor();

        expect(run(editor, { command: 'wrapInLayout' })).toBe(false);
    });
});
