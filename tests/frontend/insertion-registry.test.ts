import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { buildInsertionContext, createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import {
    registerInsertion,
    resetPartnerInsertionsForTests,
} from '../../src/web/assets/field/src/ts/insertion/partner-registry';
import type { EditorManifest, InsertionItemManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    resetPartnerInsertionsForTests();
});

function testManifest(overrides: Partial<EditorManifest> = {}): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema-a',
        enabledNodes: ['paragraph', 'heading', 'vizyBlock'],
        enabledMarks: [],
        internalNodes: ['doc', 'text', 'vizyBlock'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/node/heading',
            'vizy/core/node/vizyBlock',
                    ],
        field: {
            fieldUid: 'field',
            rootContentType: 'rich',
            blockTypePickerGroups: [{ name: 'Main', blockTypeUids: ['type-a'], disabledBlockTypeUids: [] }],
            allowedBlockTypeUids: ['type-a'],
            insertableBlockTypeUids: ['type-a'],
            minBlocks: null,
            maxBlocks: 2,
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
            {
                id: 'node:vizy:heading',
                kind: 'node',
                nodeName: 'heading',
                label: 'Heading',
                description: null,
                icon: null,
                group: 'Text',
                keywords: ['heading'],
                aliases: [],
                order: 1,
                surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                requiresInput: false,
            },
        ],
        ...overrides,
    };
}

function createHarness(manifest = testManifest()) {
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    let revision = 1;
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
        content: { type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph' }] },
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
            createUid: () => '00000000-0000-4000-8000-000000000002',
        },
        'editor-test',
        manifest.insertionItems,
    );
    return { editor, insertion, manifest, hosts, revision: () => revision };
}

describe('InsertionRegistry', () => {
    it('returns shared query results for slash and keyboard surfaces', () => {
        const { editor, insertion } = createHarness();
        const context = buildInsertionContext(
            { editor, manifest: testManifest(), documentRevision: () => 1, createUid: () => 'uid' },
            'slash',
            'editor-test',
            editor.state.selection.from,
        );
        expect(context).not.toBeNull();
        const slash = insertion.query({ context: context! });
        const keyboard = insertion.query({ context: { ...context!, surface: 'keyboard' } });
        expect(slash.map((item) => item.item.id)).toEqual(keyboard.map((item) => item.item.id));
        expect(slash.some((item) => item.item.id === 'block:type-a')).toBe(true);
        expect(slash.some((item) => item.item.id === 'node:vizy:paragraph')).toBe(true);
    });

    it('hides node items whose node the editor config does not allow', () => {
        // An insertion item can outlive the capability it inserts — e.g. a field
        // switched to an editor config that no longer enables tables. The item
        // must not be offered, or the picker advertises content the schema and
        // the executor will both refuse.
        const manifest = testManifest({
            insertionItems: [
                ...testManifest().insertionItems,
                {
                    id: 'node:vizy:table',
                    kind: 'node',
                    nodeName: 'table',
                    label: 'Table',
                    description: null,
                    icon: null,
                    group: 'Layout',
                    keywords: ['table'],
                    aliases: [],
                    order: 2,
                    surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                    requiresInput: false,
                } satisfies InsertionItemManifest,
            ],
        });
        const { editor, insertion } = createHarness(manifest);
        for (const surface of ['empty', 'browse', 'slash'] as const) {
            const context = buildInsertionContext(
                { editor, manifest, documentRevision: () => 1, createUid: () => 'uid' },
                surface,
                'editor-test',
                editor.state.selection.from,
            )!;
            const ids = insertion.query({ context }).map((entry) => entry.item.id);
            expect(ids).not.toContain('node:vizy:table');
            expect(ids).toContain('node:vizy:paragraph');
        }
    });

    it('enforces direct max block counts using enabled and disabled blocks', () => {
        const manifest = testManifest();
        const { editor, insertion } = createHarness(manifest);
        editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                {
                    type: 'vizyBlock',
                    attrs: { blockUid: 'b1', blockTypeUid: 'type-a', enabled: true, fieldSlots: {} },
                    content: [],
                },
                {
                    type: 'vizyBlock',
                    attrs: { blockUid: 'b2', blockTypeUid: 'type-a', enabled: false, fieldSlots: {} },
                    content: [],
                },
            ],
        });
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: () => 1, createUid: () => 'uid' },
            'slash',
            'editor-test',
            1,
        );
        const results = insertion.query({ context: context! });
        expect(results.some((item) => item.item.kind === 'block')).toBe(false);
        expect(results.some((item) => item.item.id === 'node:vizy:paragraph')).toBe(true);
    });

    it('rejects stale execution when the document revision changes', async () => {
        const { editor, insertion, manifest } = createHarness();
        const runtime = { editor, manifest, documentRevision: () => 1, createUid: () => 'uid-new' };
        const context = buildInsertionContext(runtime, 'slash', 'editor-test', editor.state.selection.from)!;
        editor.commands.insertContent({ type: 'paragraph', content: [{ type: 'text', text: 'changed' }] });
        const stale = buildInsertionContext(
            { editor, manifest, documentRevision: () => 2, createUid: () => 'uid-new' },
            'slash',
            'editor-test',
            context.from,
        )!;
        const result = await insertion.execute({ id: 'node:vizy:paragraph', context: { ...context, documentRevision: '1' } });
        expect(result.status).toBe('cancelled');
        expect(stale.documentRevision).not.toBe(context.documentRevision);
    });

    it('inserts a leaf block with a fresh UID without mounting FieldLayouts', async () => {
        const blockUid = '00000000-0000-4000-8000-000000000099';
        const { editor, insertion, manifest, hosts } = createHarness();
        const runtime = {
            editor,
            manifest,
            documentRevision: () => 1,
            createUid: () => blockUid,
        };
        // Rebind runtime UID factory for this execution-only proof.
        const localRegistry = createInsertionRegistry(runtime, 'editor-test', manifest.insertionItems);
        const context = buildInsertionContext(runtime, 'slash', 'editor-test', editor.state.selection.from)!;
        const result = await localRegistry.execute({ id: 'block:type-a', context });
        expect(result.status).toBe('inserted');
        if (result.status === 'inserted') {
            expect(result.blockUid).toBe(blockUid);
        }
        expect(hosts.get(blockUid)?.status).toBe('idle');
        expect(hosts.get(blockUid)?.response).toBeNull();
        void insertion;
        const json = editor.getJSON();
        const blocks = (json.content ?? []).filter((node) => node.type === 'vizyBlock');
        expect(blocks).toHaveLength(1);
        expect(blocks[0]?.attrs?.blockUid).toBe('00000000-0000-4000-8000-000000000099');
        expect(blocks[0]?.content ?? []).toEqual([]);
        // Starting doc was a sole empty paragraph — replace it, don't leave a blank line.
        expect((json.content ?? []).some((node) => node.type === 'paragraph')).toBe(false);
    });

    it('does not move the caret into a newly inserted leaf Block', async () => {
        const { editor, insertion, manifest, revision } = createHarness();
        editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'stay' }] },
            ],
        });
        editor.commands.setTextSelection(2);
        const selectionBefore = editor.state.selection.from;
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: revision, createUid: () => 'uid-nofocus' },
            'inline',
            'editor-test',
            editor.state.doc.content.size,
        )!;
        const result = await insertion.execute({ id: 'block:type-a', context });
        expect(result.status).toBe('inserted');

        const { $from } = editor.state.selection;
        let insideNewBlock = false;
        for (let depth = $from.depth; depth >= 0; depth -= 1) {
            const node = $from.node(depth);
            if (node.type.name === 'vizyBlock' && String(node.attrs.blockUid) === 'uid-nofocus') {
                insideNewBlock = true;
                break;
            }
        }
        expect(insideNewBlock).toBe(false);
        expect(editor.state.selection.from).toBe(selectionBefore);
        expect(editor.state.selection.empty).toBe(true);
    });

    it('replaces an empty paragraph when inserting a block after it (gutter-style gap)', async () => {
        const { editor, insertion, manifest, revision } = createHarness();
        editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'before' }] },
                { type: 'paragraph' },
                { type: 'paragraph', content: [{ type: 'text', text: 'after' }] },
            ],
        });
        // Gap after the empty middle paragraph (same as gutter insert-after-row).
        const afterEmpty = editor.state.doc.child(0).nodeSize + editor.state.doc.child(1).nodeSize;
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: revision, createUid: () => 'uid' },
            'inline',
            'editor-test',
            afterEmpty,
        )!;
        const result = await insertion.execute({ id: 'block:type-a', context });
        expect(result.status).toBe('inserted');
        const types = (editor.getJSON().content ?? []).map((node) => node.type);
        expect(types).toEqual(['paragraph', 'vizyBlock', 'paragraph']);
        expect(editor.state.doc.textContent).toBe('beforeafter');
    });

    it('keeps a content paragraph when inserting a block after it', async () => {
        const { editor, insertion, manifest, revision } = createHarness();
        editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'keep me' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'tail' }] },
            ],
        });
        const afterFirst = editor.state.doc.child(0).nodeSize;
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: revision, createUid: () => 'uid' },
            'inline',
            'editor-test',
            afterFirst,
        )!;
        const result = await insertion.execute({ id: 'block:type-a', context });
        expect(result.status).toBe('inserted');
        const types = (editor.getJSON().content ?? []).map((node) => node.type);
        expect(types).toEqual(['paragraph', 'vizyBlock', 'paragraph']);
        expect(editor.state.doc.textContent).toBe('keep metail');
    });

    it('fills wrapper nodes that are invalid while empty instead of throwing', async () => {
        // blockquote is `block+`, so inserting a bare `{ type: 'blockquote' }`
        // made ProseMirror throw and the insertion silently never landed.
        const manifest = testManifest({
            enabledNodes: ['paragraph', 'heading', 'blockquote', 'vizyBlock'],
            modules: [
                'vizy/core/node/doc',
                'vizy/core/node/text',
                'vizy/core/node/paragraph',
                'vizy/core/node/heading',
                'vizy/core/node/blockquote',
                'vizy/core/node/vizyBlock',
                            ],
            insertionItems: [
                {
                    id: 'node:vizy:blockquote',
                    kind: 'node',
                    nodeName: 'blockquote',
                    label: 'Quote',
                    description: null,
                    icon: null,
                    group: 'Text',
                    keywords: ['quote'],
                    aliases: [],
                    order: 0,
                    surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                    requiresInput: false,
                },
            ],
        });
        const { editor, insertion } = createHarness(manifest);
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: () => 1, createUid: () => 'uid' },
            'browse',
            'editor-test',
            editor.state.selection.from,
        )!;
        const result = await insertion.execute({ id: 'node:vizy:blockquote', context });
        expect(result.status).toBe('inserted');
        const quote = (editor.getJSON().content ?? []).find((node) => node.type === 'blockquote');
        expect(quote?.content?.[0]?.type).toBe('paragraph');
    });

    it('builds the heading schema from the config levels and inserts an allowed one', async () => {
        // The levels are schema, not menu contents: TipTap builds Heading's parse rules from
        // them, so an `<h1>` pasted into a config that disallows H1 lands as a paragraph rather
        // than as a heading no button can reach and validation will reject on save.
        const manifest = testManifest({ headingLevels: [3, 4] });
        const { editor, insertion, revision } = createHarness(manifest);

        editor.commands.setContent('<h1>Too big</h1><h3>Allowed</h3>');
        expect((editor.getJSON().content ?? []).map((node) => [node.type, node.attrs?.level]))
            .toEqual([['paragraph', undefined], ['heading', 3]]);

        // Heading's `level` attribute defaults to 1 whatever the schema was built from, so a
        // generic insert would store a level this config disallows while rendering another.
        editor.commands.setContent({ type: 'doc', attrs: { schemaVersion: 2 }, content: [{ type: 'paragraph' }] });
        // Read from the harness rather than pinned to 1: the setContent calls above are document
        // changes, and a context stamped with a stale revision is cancelled by design.
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: revision, createUid: () => 'uid' },
            'browse',
            'editor-test',
            editor.state.selection.from,
        )!;
        const result = await insertion.execute({ id: 'node:vizy:heading', context });
        expect(result.status).toBe('inserted');
        const heading = (editor.getJSON().content ?? []).find((node) => node.type === 'heading');
        expect(heading?.attrs?.level).toBe(3);
    });

    it('ranks prefix matches ahead of fuzzy description matches deterministically', () => {
        const items: InsertionItemManifest[] = [
            {
                id: 'node:vizy:paragraph',
                kind: 'node',
                nodeName: 'paragraph',
                label: 'Paragraph',
                description: 'alpha note',
                icon: null,
                group: 'Text',
                keywords: [],
                aliases: [],
                order: 1,
                surfaces: ['slash'],
                requiresInput: false,
            },
            {
                id: 'block:type-a',
                kind: 'block',
                blockTypeUid: 'type-a',
                label: 'Alpha',
                description: null,
                icon: null,
                group: 'Main',
                keywords: [],
                aliases: [],
                order: 0,
                surfaces: ['slash'],
                requiresInput: false,
            },
        ];
        const { editor, insertion } = createHarness(testManifest({ insertionItems: items }));
        const context = buildInsertionContext(
            { editor, manifest: testManifest({ insertionItems: items }), documentRevision: () => 1, createUid: () => 'uid' },
            'slash',
            'editor-test',
            editor.state.selection.from,
        )!;
        const results = insertion.query({ context, search: 'alp' });
        expect(results[0]?.item.id).toBe('block:type-a');
    });

    it('throws when duplicate registration is attempted at startup', () => {
        expect(() => createInsertionRegistry(
            { editor: null as unknown as Editor, manifest: testManifest(), documentRevision: () => 0, createUid: () => 'x' },
            'editor',
            [
                testManifest().insertionItems[0],
                testManifest().insertionItems[0],
            ],
        )).toThrow(/duplicateInsertionItem/);
    });

    it('merges Craft.Vizy.registerInsertion partners into slash queries', async () => {
        registerInsertion({
            item: {
                id: 'transform:acme:primary-color',
                kind: 'transform',
                label: 'Primary colour',
                description: 'Brand purple text',
                icon: { name: 'palette' },
                group: 'Extensions',
                keywords: ['color', 'primary'],
                aliases: [],
                order: 0,
                surfaces: ['slash', 'browse'],
                requiresInput: false,
            },
            execute: (context, runtime) => {
                runtime.editor.chain().focus().setTextSelection({ from: context.from, to: context.to }).run();
                return { status: 'inserted' };
            },
        });

        const { editor, insertion, manifest } = createHarness();
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: () => 1, createUid: () => 'uid' },
            'slash',
            'editor-test',
            editor.state.selection.from,
        )!;
        const results = insertion.query({ context, search: 'primary' });
        expect(results.some((row) => row.item.id === 'transform:acme:primary-color')).toBe(true);

        const result = await insertion.execute({
            id: 'transform:acme:primary-color',
            context,
        });
        expect(result.status).toBe('inserted');
    });

    it('lets a partner override execute for a PHP-shipped insertion id', async () => {
        let ran = false;
        const paragraph = testManifest().insertionItems.find((item) => item.id === 'node:vizy:paragraph')!;
        registerInsertion({
            item: {
                ...paragraph,
                label: 'Paragraph (partner)',
            },
            execute: async () => {
                ran = true;
                return { status: 'inserted' };
            },
        });

        const { editor, insertion, manifest } = createHarness();
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: () => 1, createUid: () => 'uid' },
            'slash',
            'editor-test',
            editor.state.selection.from,
        )!;
        const result = await insertion.execute({
            id: 'node:vizy:paragraph',
            context,
        });
        expect(ran).toBe(true);
        expect(result.status).toBe('inserted');
    });

    it('queries five hundred items without network or FieldLayout work', () => {
        const items: InsertionItemManifest[] = Array.from({ length: 500 }, (_, index) => ({
            id: `block:type-${index}`,
            kind: 'block',
            blockTypeUid: 'type-a',
            label: `Block ${index}`,
            description: null,
            icon: null,
            group: 'Load',
            keywords: [`block-${index}`],
            aliases: [],
            order: index,
            surfaces: ['slash'],
            requiresInput: false,
        }));
        const manifest = testManifest({ insertionItems: items, field: { ...testManifest().field, maxBlocks: 999 } });
        const { editor, insertion, hosts } = createHarness(manifest);
        const context = buildInsertionContext(
            { editor, manifest, documentRevision: () => 1, createUid: () => 'uid' },
            'slash',
            'editor-test',
            editor.state.selection.from,
        )!;
        const results = insertion.query({ context });
        expect(results).toHaveLength(500);
        expect(hosts.get('anything')).toBeUndefined();
    });
});
