import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { executeBlockInsertion } from '../../src/web/assets/field/src/ts/insertion/executors';
import { refreshBlockSummaries } from '../../src/web/assets/field/src/ts/blocks/summary-sync';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
});

/** Block A-like type: multi-tab field layout (Hosted nesting; no Content Areas). */
function blockAManifest(): EditorManifest {
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
            blockTypePickerGroups: [{ name: 'Main', blockTypeUids: ['block-a'], disabledBlockTypeUids: [] }],
            allowedBlockTypeUids: ['block-a'],
            insertableBlockTypeUids: ['block-a'],
            minBlocks: null,
            maxBlocks: null,
        },
        blockTypes: {
            'block-a': {
                uid: 'block-a',
                name: 'Block A',
                handle: 'blockA',
                fieldLayoutUid: 'layout-a',
                fieldLayoutHash: 'hash-a',
                layoutTabLabels: ['Tab 1', 'Tab 2', 'Tab 3'],
                
                
            },
        },
        insertionItems: [
            {
                id: 'block:block-a',
                kind: 'block',
                blockTypeUid: 'block-a',
                label: 'Block A',
                description: null,
                icon: null,
                group: 'Main',
                keywords: ['block a'],
                aliases: [],
                order: 0,
                surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                requiresInput: false,
            },
        ],
    };
}

function blockAJson(blockUid: string): Record<string, unknown> {
    return {
        type: 'vizyBlock',
        attrs: { blockUid, blockTypeUid: 'block-a', enabled: true, fieldSlots: {} },
        content: [],
    };
}

function createHarness(blockCount: number) {
    const manifest = blockAManifest();
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    const blockRevisions = new Map<string, number>();
    let revision = 1;
    let uidSeq = 0;
    let editor!: Editor;
    let insertion!: ReturnType<typeof createInsertionRegistry>;
    let transactionCount = 0;

    editor = new Editor({
        extensions: createEditorExtensions(manifest, () => nodeViewServices({
            editor,
            manifest,
            ui,
            hosts,
            insertion,
            blockRevision: (uid) => blockRevisions.get(uid) ?? 0,
            refreshSummaries: () => refreshBlockSummaries(
                editor,
                manifest,
                ui,
                blockRevisions,
            ),
        })),
        content: {
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: Array.from({ length: blockCount }, (_, index) => blockAJson(`block-${index}`)),
        },
        onTransaction: ({ transaction }) => {
            transactionCount += 1;
            if (transaction.docChanged) revision += 1;
        },
    });
    editors.push(editor);

    editor.on('transaction', ({ transaction }) => {
        if (!transaction.docChanged) return;
        refreshBlockSummaries(editor, manifest, ui, blockRevisions);
    });

    insertion = createInsertionRegistry(
        {
            editor,
            manifest,
            documentRevision: () => revision,
            createUid: () => {
                uidSeq += 1;
                return `00000000-0000-4000-8000-00000000${String(uidSeq).padStart(4, '0')}`;
            },
        },
        'editor-stress',
        manifest.insertionItems,
    );

    return { editor, insertion, transactionCount: () => transactionCount };
}

describe('block insertion stress', () => {
    it('inserting Block A into a long document completes with bounded transactions', async () => {
        const harness = createHarness(14);
        const before = harness.transactionCount();
        const context = harness.insertion.buildContext(
            'inline',
            harness.editor.state.doc.content.size,
        );
        expect(context).not.toBeNull();

        const result = await executeBlockInsertion('block-a', context!, {
            editor: harness.editor,
            manifest: blockAManifest(),
            documentRevision: () => 1,
            createUid: () => '00000000-0000-4000-8000-000000000099',
        });

        expect(result.status).toBe('inserted');
        expect(harness.transactionCount() - before).toBeLessThan(20);
        expect(harness.editor.state.doc.childCount).toBe(15);
    });

    it('inserting Block A settles without a microtask storm', async () => {
        const harness = createHarness(3);
        let microtasks = 0;
        const native = queueMicrotask.bind(globalThis);
        globalThis.queueMicrotask = (cb) => {
            microtasks += 1;
            native(cb);
        };

        try {
            const context = harness.insertion.buildContext(
                'inline',
                harness.editor.state.doc.content.size,
            );
            expect(context).not.toBeNull();

            const result = await executeBlockInsertion('block-a', context!, {
                editor: harness.editor,
                manifest: blockAManifest(),
                documentRevision: () => 1,
                createUid: () => '00000000-0000-4000-8000-000000000100',
            });
            expect(result.status).toBe('inserted');

            // Drain the queue; a remount loop would schedule without bound.
            await new Promise<void>((resolve) => {
                let turns = 0;
                const pump = () => {
                    turns += 1;
                    if (turns > 50) {
                        resolve();
                        return;
                    }
                    native(() => native(pump));
                };
                native(pump);
                setTimeout(resolve, 50);
            });

            expect(microtasks).toBeLessThan(200);
            expect(harness.editor.state.doc.childCount).toBe(4);
        } finally {
            globalThis.queueMicrotask = native;
        }
    });

    it('does not re-walk every Block summary on a selection-only transaction', () => {
        let summaryPasses = 0;
        const manifest = blockAManifest();
        const ui = new BlockUiStateRegistry();
        const hosts = new FieldHostRegistry();
        const blockRevisions = new Map<string, number>();
        let editor!: Editor;
        let insertion!: ReturnType<typeof createInsertionRegistry>;

        editor = new Editor({
            extensions: createEditorExtensions(manifest, () => nodeViewServices({
                editor,
                manifest,
                ui,
                hosts,
                insertion,
                refreshSummaries: () => {
                    summaryPasses += 1;
                    refreshBlockSummaries(editor, manifest, ui, blockRevisions);
                },
            })),
            content: {
                type: 'doc',
                attrs: { schemaVersion: 2 },
                content: [blockAJson('block-0')],
            },
        });
        editors.push(editor);
        insertion = createInsertionRegistry(
            {
                editor,
                manifest,
                documentRevision: () => 1,
                createUid: () => '00000000-0000-4000-8000-000000000001',
            },
            'editor-selection',
            manifest.insertionItems,
        );
        editor.on('transaction', ({ transaction }) => {
            if (!transaction.docChanged) return;
            summaryPasses += 1;
            refreshBlockSummaries(editor, manifest, ui, blockRevisions);
        });

        const before = summaryPasses;
        editor.commands.setTextSelection(1);
        expect(summaryPasses - before).toBe(0);
    });
});
