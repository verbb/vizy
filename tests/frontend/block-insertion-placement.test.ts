import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { addBlockAbove, addBlockAboveLabel } from '../../src/web/assets/field/src/ts/blocks/actions';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    vi.restoreAllMocks();
});

function testManifest(): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema-a',
        enabledNodes: ['paragraph', 'vizyBlock'],
        enabledMarks: [],
        internalNodes: ['doc', 'text', 'vizyBlock'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/node/vizyBlock',
        ],
        field: {
            fieldUid: 'field',
            rootContentType: 'rich',
            blockTypePickerGroups: [{ name: 'Main', blockTypeUids: ['type-a'], disabledBlockTypeUids: [] }],
            allowedBlockTypeUids: ['type-a'],
            insertableBlockTypeUids: ['type-a'],
            minBlocks: null,
            maxBlocks: null,
        },
        blockTypes: {
            'type-a': {
                uid: 'type-a',
                name: 'Alpha',
                handle: 'alpha',
            },
        },
        insertionItems: [
            {
                id: 'block:type-a',
                kind: 'block',
                blockTypeUid: 'type-a',
                label: 'Alpha',
                description: null,
                icon: null,
                group: 'Main',
                keywords: ['alpha'],
                aliases: [],
                order: 0,
                surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                requiresInput: false,
            },
        ],
    };
}

/** Leaf vizyBlock — Hosted nesting is fieldSlots, not TipTap children. */
function blockJson(blockUid: string): Record<string, unknown> {
    return {
        type: 'vizyBlock',
        attrs: { blockUid, blockTypeUid: 'type-a', enabled: true, fieldSlots: {} },
        content: [],
    };
}

function createHarness(initialBlockUids: string[] = []) {
    const manifest = testManifest();
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    let revision = 1;
    let uidSeq = 0;
    let editor!: Editor;
    let insertion!: ReturnType<typeof createInsertionRegistry>;

    editor = new Editor({
        extensions: createEditorExtensions(manifest, () => nodeViewServices({
            editor,
            manifest,
            ui,
            hosts,
            insertion,
        })),
        content: {
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: initialBlockUids.length > 0
                ? initialBlockUids.map((uid) => blockJson(uid))
                : [{ type: 'paragraph' }],
        },
        onTransaction: ({ transaction }) => {
            if (transaction.docChanged) revision += 1;
        },
    });
    editors.push(editor);

    insertion = createInsertionRegistry(
        {
            editor,
            manifest,
            documentRevision: () => revision,
            createUid: () => {
                uidSeq += 1;
                return `00000000-0000-4000-8000-00000000000${uidSeq}`;
            },
        },
        'editor-test',
        manifest.insertionItems,
    );

    return { editor, insertion, manifest };
}

function rootBlockUids(editor: Editor): string[] {
    const uids: string[] = [];
    editor.state.doc.forEach((node) => {
        if (node.type.name === 'vizyBlock') uids.push(String(node.attrs.blockUid));
    });
    return uids;
}

describe('block insertion placement', () => {
    it('does not scroll the stale editor selection before inserting at a remote position', async () => {
        const harness = createHarness();
        vi.spyOn(window, 'requestAnimationFrame')
            .mockImplementation((callback) => {
                callback(0);
                return 1;
            });
        const scrolledTransactions: boolean[] = [];
        harness.editor.on('transaction', ({ transaction }) => {
            scrolledTransactions.push(transaction.scrolledIntoView);
        });
        const context = harness.insertion.buildContext(
            'inline',
            harness.editor.state.doc.content.size,
        );
        expect(context).not.toBeNull();

        expect((await harness.insertion.execute({ id: 'block:type-a', context: context! })).status)
            .toBe('inserted');

        expect(scrolledTransactions).not.toContain(true);
    });

    it('inserts a leaf Block without TipTap children', async () => {
        const harness = createHarness();
        const context = harness.insertion.buildContext('slash');
        expect(context).not.toBeNull();
        expect((await harness.insertion.execute({ id: 'block:type-a', context: context! })).status)
            .toBe('inserted');

        const blocks = (harness.editor.getJSON().content ?? []).filter((n) => n.type === 'vizyBlock');
        expect(blocks).toHaveLength(1);
        expect(blocks[0]?.content ?? []).toEqual([]);
    });

    it('adds a block above the subject rather than appending', async () => {
        const first = 'block-first';
        const second = 'block-second';
        const harness = createHarness([first, second]);

        const result = await addBlockAbove(harness.editor, harness.insertion, second);
        expect(result).toBe('inserted');

        const order = rootBlockUids(harness.editor);
        expect(order).toHaveLength(3);
        expect(order[0]).toBe(first);
        expect(order[2]).toBe(second);
        expect([first, second]).not.toContain(order[1]);
    });

    it('personalizes the menu label when only one Block type can insert', () => {
        const harness = createHarness(['block-first']);
        expect(addBlockAboveLabel(harness.editor, harness.insertion, 'block-first'))
            .toBe('Add Alpha above');
    });

    it('reports failure for an unknown block uid rather than inserting anywhere', async () => {
        const harness = createHarness(['block-first']);
        const before = rootBlockUids(harness.editor);

        const result = await addBlockAbove(
            harness.editor,
            harness.insertion,
            'not-a-block-uid',
        );

        expect(result).toBe('cancelled');
        expect(rootBlockUids(harness.editor)).toEqual(before);
    });
});
