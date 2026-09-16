import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import {
    createEditorExtensions,
    recursiveRegenerateAuthoredUids,
} from '../../src/web/assets/field/src/ts/editor-schema';
import { TRUSTED_MODULES, resolveTrustedModules } from '../../src/web/assets/field/src/ts/modules';
import { FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import {
    OPAQUE_CLIPBOARD_MIME,
    validateOpaqueSlice,
} from '../../src/web/assets/field/src/ts/transport/opaque';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { nodeViewServices } from './support/node-view-services';
import type { CanonicalNode, EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

const manifest = (nodes: string[], marks: string[] = []): EditorManifest => ({
    manifestVersion: 1,
    uid: 'request',
    revision: '1:test',
    hash: 'test',
    registryRevision: 'registry',
    schemaRevision: 'schema',
    enabledNodes: nodes,
    enabledMarks: marks,
    internalNodes: ['doc', 'text', 'vizyBlock'],
    modules: [
        'vizy/core/node/doc',
        'vizy/core/node/text',
        'vizy/core/node/vizyBlock',
        ...nodes.map((name) => `vizy/core/node/${name}`),
        ...marks.map((name) => `vizy/core/mark/${name}`),
    ],
    field: {
        fieldUid: 'field',
        rootContentType: 'rich',
        blockTypePickerGroups: [],
        allowedBlockTypeUids: ['root-type'],
        insertableBlockTypeUids: ['root-type'],
        minBlocks: null,
        maxBlocks: null,
    },
    blockTypes: {},
    insertionItems: [],
});

describe('manifest-owned schema', () => {
    it('maps every trusted production module to a concrete extension', () => {
        for (const [id, factory] of Object.entries(TRUSTED_MODULES)) {
            const produced = factory();
            const extensions = Array.isArray(produced) ? produced : [produced];
            expect(extensions.length, id).toBeGreaterThan(0);
        }
        expect(resolveTrustedModules(['vizy/core/node/paragraph']).map((extension) => extension.name))
            .toContain('paragraph');
    });

    it('disables every StarterKit capability omitted by the manifest', () => {
        const editor = new Editor({
            extensions: createEditorExtensions(manifest([]), () => {
                throw new Error('unused');
            }),
        });
        editors.push(editor);
        expect(Object.keys(editor.schema.nodes)).toEqual(expect.arrayContaining([
            'doc', 'text', 'vizyBlock', 'unsupportedNode', 'unsupportedInlineNode',
        ]));
        expect(editor.schema.nodes.paragraph).toBeUndefined();
        expect(editor.schema.nodes.hardBreak).toBeUndefined();
        expect(editor.schema.marks.bold).toBeUndefined();
    });
});

describe('copy identity and host ownership', () => {
    it('keeps copied Hosted text JSON-valid without adding undefined leaf properties', () => {
        const input: CanonicalNode = { type: 'doc', attrs: { schemaVersion: 2 }, content: [{
            type: 'vizyBlock', attrs: {
                blockUid: 'source', blockTypeUid: 'type', fieldSlots: {
                    hosted: { type: 'doc', attrs: { schemaVersion: 2 }, content: [{
                        type: 'paragraph', content: [{ type: 'text', text: 'Hosted text' }],
                    }] },
                },
            },
        }] };
        const copied = recursiveRegenerateAuthoredUids(input, () => 'copy', { type: { fieldSlotKinds: { hosted: 'hosted' } } });
        expect(copied).toStrictEqual(JSON.parse(JSON.stringify(copied)));
        expect(copied.content?.[0].attrs?.fieldSlots).toEqual(input.content?.[0].attrs?.fieldSlots);
        expect(input.content?.[0].attrs?.blockUid).toBe('source');
    });

    it('regenerates every authored UID recursively while move input remains untouched', () => {
        // Leaf blocks + layout/column siblings (no vizySlot nesting).
        const input: CanonicalNode = {
            type: 'doc',
            content: [
                {
                    type: 'vizyBlock',
                    attrs: { blockUid: 'outer', blockTypeUid: 'type', enabled: true, fieldSlots: {} },
                    content: [],
                },
                {
                    type: 'layout',
                    attrs: { layoutUid: 'layout' },
                    content: [{ type: 'column', attrs: { columnUid: 'column' } }],
                },
            ],
        };
        const ids = ['copy-outer', 'copy-layout', 'copy-column'];
        const copied = recursiveRegenerateAuthoredUids(input, () => ids.shift()!);
        expect(copied.content?.[0].attrs?.blockUid).toBe('copy-outer');
        expect(copied.content?.[1].attrs?.layoutUid).toBe('copy-layout');
        expect(copied.content?.[1].content?.[0].attrs?.columnUid).toBe('copy-column');
        expect(input.content?.[0].attrs?.blockUid).toBe('outer');
    });

    it('regenerates Hosted Block UIDs, clears Matrix anchors, and remaps Matrix blobs', () => {
        const input: CanonicalNode = {
            type: 'doc',
            content: [{
                type: 'vizyBlock',
                attrs: {
                    blockUid: 'outer',
                    blockTypeUid: 'type',
                    enabled: true,
                    matrixAnchorUid: 'anchor-1',
                    fieldSlots: {
                        opaque: { keep: true },
                        hosted: {
                            type: 'doc',
                            attrs: { schemaVersion: 1 },
                            content: [{
                                type: 'vizyBlock',
                                attrs: {
                                    blockUid: 'inner',
                                    blockTypeUid: 'inner-type',
                                    enabled: true,
                                    fieldSlots: {},
                                },
                            }],
                        },
                        matrix: {
                            entries: {
                                'uid:entry-a': { id: 7, uid: 'entry-a', fields: { label: 'A' } },
                            },
                            sortOrder: ['entry-a'],
                        },
                    },
                },
            }],
        };
        const ids = ['copy-outer', 'copy-inner', 'copy-entry'];
        const copied = recursiveRegenerateAuthoredUids(input, () => ids.shift()!, {
            type: { fieldSlotKinds: { hosted: 'hosted', matrix: 'matrix' } },
        });
        const outer = copied.content?.[0];
        const slots = outer?.attrs?.fieldSlots as Record<string, any>;
        expect(outer?.attrs?.blockUid).toBe('copy-outer');
        expect(outer?.attrs?.matrixAnchorUid).toBeNull();
        expect(slots.opaque).toEqual({ keep: true });
        expect(slots.hosted.content[0].attrs.blockUid).toBe('copy-inner');
        expect(slots.matrix.entries['copy-entry']).toMatchObject({ uid: 'copy-entry', fields: { label: 'A' } });
        expect(slots.matrix.entries['copy-entry'].id).toBeUndefined();
        expect(slots.matrix.sortOrder).toEqual(['copy-entry']);
        expect(input.content?.[0].attrs?.blockUid).toBe('outer');
    });

    it('preserves opaque fields even when they look like Hosted or Matrix data', () => {
        const hostedShape = { type: 'doc', attrs: { schemaVersion: 1 }, content: [
            { type: 'vizyBlock', attrs: { blockUid: 'opaque-block' } },
        ] };
        const matrixShape = { entries: { row: { id: 7, uid: 'opaque-row' } }, sortOrder: ['row'] };
        const input: CanonicalNode = { type: 'vizyBlock', attrs: {
            blockUid: 'source', blockTypeUid: 'type',
            fieldSlots: { hostedShape, matrixShape },
        } };
        const copy = recursiveRegenerateAuthoredUids(input, () => 'copy', {
            type: { fieldSlotKinds: {} },
        });
        expect(copy.attrs?.blockUid).toBe('copy');
        expect(copy.attrs?.fieldSlots).toEqual({ hostedShape, matrixShape });
    });

    it('versions hosts by block and layout identity and disposes once', () => {
        const registry = new FieldHostRegistry();
        const first = registry.acquire('block', 'type-a', 'layout-a', 'hash-a');
        const dispose = vi.fn();
        first.disposals.push(dispose);
        const replacement = registry.acquire('block', 'type-b', 'layout-b', 'hash-b');
        expect(replacement).not.toBe(first);
        expect(dispose).toHaveBeenCalledOnce();
        registry.destroy();
        registry.destroy();
        expect(dispose).toHaveBeenCalledOnce();
    });
});

describe('opaque private transport validation', () => {
    it('rejects malformed marks and whole-slice overflows before insertion', () => {
        expect(OPAQUE_CLIPBOARD_MIME).toContain('vizy-opaque-slice');
        expect(() => validateOpaqueSlice({
            content: [{
                type: 'paragraph',
                content: [{
                    type: 'text',
                    text: 'x',
                    marks: [{ type: '', attrs: [] }],
                }],
            }],
            openStart: 0,
            openEnd: 0,
        })).toThrow();
        expect(() => validateOpaqueSlice({
            content: Array.from({ length: 2_001 }, () => ({ type: 'paragraph' })),
            openStart: 0,
            openEnd: 0,
        })).toThrow();
    });
});

describe('root block cardinality and allowances', () => {
    it('flags maxBlocks and disallowed root block types', async () => {
        const { isPolicyValid } = await import('../../src/web/assets/field/src/ts/policy');
        const { BlockUiStateRegistry, FieldHostRegistry } = await import('../../src/web/assets/field/src/ts/registries');
        const policyManifest: EditorManifest = {
            ...manifest(['paragraph']),
            field: {
                fieldUid: 'field',
                rootContentType: 'rich',
                blockTypePickerGroups: [],
                allowedBlockTypeUids: ['parent'],
        insertableBlockTypeUids: ['parent'],
                minBlocks: null,
                maxBlocks: null,
            },
            blockTypes: {
                parent: {
                    uid: 'parent',
                    name: 'Parent',
                    handle: 'parent',
                    fieldLayoutUid: 'layout',
                    fieldLayoutHash: 'hash',
                    
                },
                child: {
                    uid: 'child',
                    name: 'Child',
                    handle: 'child',
                    fieldLayoutUid: 'layout',
                    fieldLayoutHash: 'hash',
                    
                },
            },
        };
        const hosts = new FieldHostRegistry();
        const ui = new BlockUiStateRegistry();
        const make = (content: CanonicalNode): Editor => {
            let insertion!: ReturnType<typeof createInsertionRegistry>;
            let editor!: Editor;
            editor = new Editor({
                element: document.createElement('div'),
                extensions: createEditorExtensions(policyManifest, () => nodeViewServices({
                    editor,
                    manifest: policyManifest,
                    ui,
                    hosts,
                    insertion,
                })),
                content,
            });
            insertion = createInsertionRegistry(
                {
                    editor,
                    manifest: policyManifest,
                    documentRevision: () => 0,
                    createUid: () => 'uid',
                },
                'test',
                policyManifest.insertionItems ?? [],
            );
            return editor;
        };
        // Root maxBlocks / allowlist — Content Area nesting retired.
        const overMax = make({
            type: 'doc',
            content: [
                { type: 'vizyBlock', attrs: { blockUid: 'c1', blockTypeUid: 'parent', enabled: true, fieldSlots: {} }, content: [] },
                { type: 'vizyBlock', attrs: { blockUid: 'c2', blockTypeUid: 'parent', enabled: true, fieldSlots: {} }, content: [] },
                { type: 'vizyBlock', attrs: { blockUid: 'c3', blockTypeUid: 'parent', enabled: true, fieldSlots: {} }, content: [] },
            ],
        });
        editors.push(overMax);
        expect(isPolicyValid(overMax.state.doc, { ...policyManifest, field: { ...policyManifest.field, maxBlocks: 2 } })).toBe(false);

        const disallowed = make({
            type: 'doc',
            content: [
                { type: 'vizyBlock', attrs: { blockUid: 'bad', blockTypeUid: 'child', enabled: true, fieldSlots: {} }, content: [] },
            ],
        });
        editors.push(disallowed);
        expect(isPolicyValid(disallowed.state.doc, policyManifest)).toBe(false);
    });
});

describe('lazy FieldLayout request ownership', () => {
    it('adopts a trusted initial layout before running its instance scripts', async () => {
        vi.resetModules();
        const craftHtml = await import('../../src/web/assets/field/src/ts/craft-field-html');
        const applySpy = vi.spyOn(craftHtml, 'applyCraftFieldHtml').mockImplementation((html) => {
            // jsdom does not execute appended <script> tags; assert the sync
            // runner is invoked while the mounted field node is queryable.
            if (String(html).includes('selectize-probe')) {
                (window as any).__vizyFieldScriptSawField = document.getElementById('initial-field') !== null;
            }
        });
        const { FieldLayoutLoader } = await import('../../src/web/assets/field/src/ts/FieldLayoutLoader');
        const hosts = new FieldHostRegistry();
        const record = hosts.acquire('preloaded', 'type', 'layout', 'hash');
        // Host must be connected — Selectize-style scripts use document.getElementById.
        document.body.append(record.root);
        const node = {
            type: { name: 'vizyBlock' },
            attrs: { blockUid: 'preloaded', blockTypeUid: 'type', enabled: true, fieldSlots: {} },
        };
        let mounted = 0;
        let appendBodyHtmlCalls = 0;
        (window as any).Craft = {
            appendHeadHtml() {},
            appendBodyHtml() {
                appendBodyHtmlCalls += 1;
            },
            initUiElements() {},
        };
        const loader = new FieldLayoutLoader(
            hosts,
            {
                ...manifest(['paragraph']),
                blockTypes: {
                    type: {
                        uid: 'type',
                        name: 'Type',
                        handle: 'type',
                        fieldLayoutUid: 'layout',
                        fieldLayoutHash: 'hash',
                        
                    },
                },
            },
            'token',
            () => ({
                node: node as any,
                revision: 1,
                destination: { kind: 'root' },
            }),
            () => mounted++,
        );

        const adopted = loader.adoptInitial({
            requestId: '',
            documentRevision: 0,
            blockHash: 'server-trusted',
            blockUid: 'preloaded',
            blockTypeUid: 'type',
            fieldLayoutUid: 'layout',
            fieldLayoutHash: 'hash',
            hostNamespace: 'vizyHost[preloaded]',
            html: '<div id="initial-field"></div>',
            headHtml: '',
            bodyHtml: '<script>/* selectize-probe */</script>',
            fields: [],
            tabLabels: [],
        });

        expect(adopted).toBe(record);
        expect(record.status).toBe('mounted');
        expect((window as any).__vizyFieldScriptSawField).toBe(true);
        expect(appendBodyHtmlCalls).toBe(0);
        expect(applySpy).toHaveBeenCalled();
        expect(mounted).toBe(1);
        record.root.remove();
        applySpy.mockRestore();
    });

    async function prefetchThenOpen(
        blockUid: string,
        html: string,
        options: { connectOnMicrotask?: boolean } = {},
    ) {
        const { FieldLayoutLoader } = await import('../../src/web/assets/field/src/ts/FieldLayoutLoader');
        const hosts = new FieldHostRegistry();
        const record = hosts.acquire(blockUid, 'type', 'layout', 'hash');
        const block = {
            type: 'vizyBlock',
            attrs: { blockUid, blockTypeUid: 'type', enabled: true, fieldSlots: {} },
        };
        const node = {
            type: { name: 'vizyBlock' },
            attrs: block.attrs,
            toJSON: () => block,
        };
        (window as any).Craft = {
            sendActionRequest: async (_method: string, _action: string, config: { data: any }) => ({
                data: {
                    results: config.data.items.map((item: any) => ({
                        ok: true,
                        requestId: item.requestId,
                        documentRevision: item.documentRevision,
                        blockHash: item.blockHash,
                        blockUid,
                        blockTypeUid: 'type',
                        fieldLayoutUid: 'layout',
                        fieldLayoutHash: 'hash',
                        hostNamespace: `vizyHost[${blockUid}]`,
                        html,
                        headHtml: '',
                        bodyHtml: '',
                        fields: [],
                        tabLabels: [],
                    })),
                },
            }),
            appendHeadHtml() {},
            appendBodyHtml() {},
            initUiElements() {},
        };
        const loader = new FieldLayoutLoader(
            hosts,
            {
                ...manifest(['paragraph']),
                blockTypes: {
                    type: {
                        uid: 'type',
                        name: 'Type',
                        handle: 'type',
                        fieldLayoutUid: 'layout',
                        fieldLayoutHash: 'hash',
                    },
                },
            },
            'token',
            () => ({
                node: node as any,
                revision: 1,
                destination: { kind: 'root' },
            }),
            () => {},
        );

        await loader.prefetchNewBlock({
            blockUid,
            blockTypeUid: 'type',
            block,
            destination: { kind: 'root' },
            documentRevision: 1,
        });

        const opening = loader.open(blockUid);
        expect(record.status).toBe('loading');
        if (options.connectOnMicrotask) {
            // Simulate ProseMirror inserting the NodeView after constructor open().
            queueMicrotask(() => document.body.append(record.root));
        }
        await opening;
        return record;
    }

    it('defers mount until the field host connects, then fails if it never does', async () => {
        const record = await prefetchThenOpen('detached', '<div id="orphan-field"></div>');
        expect(record.status).toBe('failed');
        expect(record.errorMessage).toMatch(/not in the document|could not initialize/i);
    });

    it('mounts a prefetched FieldLayout once the host connects after open', async () => {
        const record = await prefetchThenOpen('insert', '<div id="insert-field"></div>', {
            connectOnMicrotask: true,
        });
        expect(record.status).toBe('mounted');
        expect(record.root.querySelector('#insert-field')).toBeTruthy();
        record.root.remove();
    });

    it.each(['revision', 'restoredHost'] as const)('isolates same-UID requests after a changed %s', async (change) => {
        const { FieldLayoutLoader } = await import('../../src/web/assets/field/src/ts/FieldLayoutLoader');
        const hosts = new FieldHostRegistry();
        let record = hosts.acquire('block', 'type', 'layout', 'hash');
        document.body.append(record.root);
        const node = {
            type: { name: 'vizyBlock' },
            attrs: { blockUid: 'block', blockTypeUid: 'type', enabled: true, fieldSlots: {} },
            toJSON: () => ({
                type: 'vizyBlock',
                attrs: { blockUid: 'block', blockTypeUid: 'type', enabled: true, fieldSlots: {} },
            }),
        };
        let revision = 1;
        const deferred: Array<{ resolve: (value: any) => void; data: any }> = [];
        (window as any).Craft = {
            sendActionRequest: (_method: string, _action: string, config: { data: any }) => new Promise((resolve) => {
                deferred.push({ resolve, data: config.data });
            }),
            appendHeadHtml() {},
            appendBodyHtml() {},
            initUiElements() {},
        };
        const loader = new FieldLayoutLoader(
            hosts,
            {
                ...manifest(['paragraph']),
                blockTypes: {
                    type: {
                        uid: 'type',
                        name: 'Type',
                        handle: 'type',
                        fieldLayoutUid: 'layout',
                        fieldLayoutHash: 'hash',
                        
                    },
                },
            },
            'token',
            () => ({
                node: node as any,
                revision,
                destination: { kind: 'root' },
            }),
            () => undefined,
        );
        // Each open() flushes as its own batch of one, so `deferred` still holds
        // one entry per request; the payload is now wrapped in `items`/`results`.
        const settle = (index: number, html: string, documentRevision: number) => {
            const sent = deferred[index].data.items[0];
            deferred[index].resolve({
                data: {
                    results: [{
                        ok: true,
                        html,
                        fields: [],
                        fieldLayoutUid: 'layout',
                        fieldLayoutHash: 'hash',
                        hostNamespace: 'vizyHost[x]',
                        headHtml: '',
                        bodyHtml: '',
                        blockUid: 'block',
                        blockTypeUid: 'type',
                        blockHash: sent.blockHash,
                        documentRevision,
                        requestId: sent.requestId,
                    }],
                },
            });
        };

        const first = loader.open('block');
        await vi.waitFor(() => expect(deferred).toHaveLength(1));
        if (change === 'revision') {
            revision = 2;
        } else {
            // Undo can restore the same UID/revision while the disposed host's
            // HTTP response is still in flight. It needs a new mount request.
            hosts.dispose('block');
            record = hosts.acquire('block', 'type', 'layout', 'hash');
            document.body.append(record.root);
        }
        const second = loader.open('block');
        await vi.waitFor(() => expect(deferred).toHaveLength(2));

        settle(1, '<div id="fresh"></div>', revision);
        await second;
        expect(record.root.querySelector('#fresh')).not.toBeNull();

        settle(0, '<div id="stale"></div>', 1);
        await expect(first).rejects.toThrow(/staleFieldLayoutResponse|AbortError|Aborted/);
        expect(record.root.querySelector('#stale')).toBeNull();
        expect(record.root.querySelector('#fresh')).not.toBeNull();
    });

    it('coalesces hosts opened in the same tick into one request and isolates a rejected item', async () => {
        const { FieldLayoutLoader } = await import('../../src/web/assets/field/src/ts/FieldLayoutLoader');
        const hosts = new FieldHostRegistry();
        const uids = ['a', 'b', 'c'];
        for (const uid of uids) {
            const record = hosts.acquire(uid, 'type', 'layout', 'hash');
            document.body.append(record.root);
        }

        const sent: any[] = [];
        (window as any).Craft = {
            sendActionRequest: (_method: string, action: string, config: { data: any }) => {
                sent.push({ action, data: config.data });
                return Promise.resolve({
                    data: {
                        results: config.data.items.map((item: any) => (
                            // Middle Block fails; the other two must still mount.
                            item.block.attrs.blockUid === 'b'
                                ? { ok: false, blockUid: 'b', error: 'staleBlockHash' }
                                : {
                                    ok: true,
                                    html: `<div id="host-${item.block.attrs.blockUid}"></div>`,
                                    fields: [],
                                    fieldLayoutUid: 'layout',
                                    fieldLayoutHash: 'hash',
                                    hostNamespace: 'vizyHost[x]',
                                    headHtml: '',
                                    bodyHtml: '',
                                    blockUid: item.block.attrs.blockUid,
                                    blockTypeUid: 'type',
                                    blockHash: item.blockHash,
                                    documentRevision: 1,
                                    requestId: item.requestId,
                                }
                        )),
                    },
                });
            },
            appendHeadHtml() {},
            appendBodyHtml() {},
            initUiElements() {},
        };

        const loader = new FieldLayoutLoader(
            hosts,
            {
                ...manifest(['paragraph']),
                blockTypes: {
                    type: {
                        uid: 'type',
                        name: 'Type',
                        handle: 'type',
                        fieldLayoutUid: 'layout',
                        fieldLayoutHash: 'hash',
                        
                    },
                },
            },
            'token',
            (blockUid: string) => ({
                node: {
                    type: { name: 'vizyBlock' },
                    attrs: { blockUid, blockTypeUid: 'type', enabled: true, fieldSlots: {} },
                    toJSON: () => ({
                        type: 'vizyBlock',
                        attrs: { blockUid, blockTypeUid: 'type', enabled: true, fieldSlots: {} },
                    }),
                } as any,
                revision: 1,
                destination: { kind: 'root' as const },
            }),
            () => undefined,
        );

        // Deliberately finish sibling hashes on separate turns: native crypto
        // scheduling must not decide whether one opening burst is batched.
        const digest = crypto.subtle.digest.bind(crypto.subtle);
        let calls = 0;
        const hashSpy = vi.spyOn(crypto.subtle, 'digest').mockImplementation(async (algorithm, data) => {
            const delay = calls++ === 0 ? 0 : 30;
            await new Promise((resolve) => setTimeout(resolve, delay));
            return digest(algorithm, data);
        });
        let results: PromiseSettledResult<unknown>[];
        try {
            results = await Promise.allSettled(uids.map((uid) => loader.open(uid)));
        } finally {
            hashSpy.mockRestore();
        }

        expect(sent).toHaveLength(1);
        expect(sent[0].action).toBe('vizy/field-layout/render-batch');
        expect(sent[0].data.items).toHaveLength(3);
        expect(results.map((result) => result.status)).toEqual(['fulfilled', 'rejected', 'fulfilled']);
        expect(hosts.get('a')?.root.querySelector('#host-a')).not.toBeNull();
        expect(hosts.get('c')?.root.querySelector('#host-c')).not.toBeNull();
        expect(hosts.get('b')?.status).toBe('failed');
    });
});
