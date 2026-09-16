import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Editor } from '@tiptap/core';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { resolveActiveItemId, stepActiveItemId } from '../../src/web/assets/field/src/ts/insertion/list-state';
import { VizySlashPluginKey } from '../../src/web/assets/field/src/ts/insertion/slash-extension';
import {
    findInlineAnchors,
    oneChoiceDirect,
} from '../../src/web/assets/field/src/ts/insertion/surface-helpers';
import { InsertionOverlay } from '../../src/web/assets/field/src/ts/insertion/overlay';
import { InsertionPopover, computeInsertionListMaxHeight } from '../../src/web/assets/field/src/ts/insertion/popover';
import { VizyInsertionListElement } from '../../src/web/assets/field/src/ts/components/VizyInsertionListElement';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

import type { AvailableInsertion, InsertionContext } from '../../src/web/assets/field/src/ts/insertion/types';

const editors: Editor[] = [];
afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    document.querySelectorAll('pk-popup.vizy-insertion-popup, vizy-insertion-list, pk-dialog, vizy-block-browse-dialog').forEach((el) => {
        el.remove();
    });
});

const stubContext = { editorId: 'test', surface: 'slash' } as InsertionContext;

function stubResults(ids: string[]): readonly AvailableInsertion[] {
    return ids.map((id) => ({
        item: {
            id,
            kind: 'node',
            label: id,
            description: null,
            icon: null,
            group: 'Text',
            keywords: [],
            aliases: [],
            order: 0,
            surfaces: ['slash'],
            requiresInput: false,
        },
        context: stubContext,
        score: 1,
    }));
}

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
            fieldHandle: 'body',
            rootContentType: 'rich',
            blockTypePickerGroups: [],
            allowedBlockTypeUids: [],
            insertableBlockTypeUids: [],
            minBlocks: null,
            maxBlocks: null,
        },
        blockTypes: {},
        insertionItems: [
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
    insertion = createInsertionRegistry(
        {
            editor,
            manifest,
            documentRevision: () => revision,
            createUid: () => crypto.randomUUID(),
        },
        'editor-test',
        manifest.insertionItems ?? [],
    );
    editors.push(editor);
    return { editor, insertion, revision: () => revision };
}

describe('insertion list state', () => {
    const results = stubResults(['a', 'b', 'c']);

    it('preserves active id when search results still include it', () => {
        expect(resolveActiveItemId('b', results)).toBe('b');
    });

    it('clears highlight when active id disappears (autoHighlight=false)', () => {
        expect(resolveActiveItemId('missing', results)).toBeNull();
        expect(resolveActiveItemId(null, results)).toBeNull();
    });

    it('steps active results with wraparound', () => {
        expect(stepActiveItemId('a', results, 1)).toBe('b');
        expect(stepActiveItemId('c', results, 1)).toBe('a');
        expect(stepActiveItemId('a', results, -1)).toBe('c');
    });

    it('ArrowDown from no highlight selects the first item (pk-combobox)', () => {
        expect(stepActiveItemId(null, results, 1)).toBe('a');
        expect(stepActiveItemId(null, results, -1)).toBe('c');
    });
});

describe('empty containers and inline insertion UI', () => {
    function blocksHarness(blockCount = 0) {
        const manifest = testManifest({
            field: {
                ...testManifest().field,
                rootContentType: 'blocks',
                allowedBlockTypeUids: ['type-a', 'type-b'],
                insertableBlockTypeUids: ['type-a', 'type-b'],
                blockTypePickerGroups: [{ name: 'Main', blockTypeUids: ['type-a', 'type-b'], disabledBlockTypeUids: [] }],
            },
            blockTypes: {
                'type-a': { uid: 'type-a', name: 'Alpha', handle: 'alpha', },
                'type-b': { uid: 'type-b', name: 'Beta', handle: 'beta', },
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
                    keywords: [],
                    aliases: [],
                    order: 0,
                    surfaces: ['inline', 'empty', 'browse'],
                    requiresInput: false,
                },
                {
                    id: 'block:type-b',
                    kind: 'block',
                    blockTypeUid: 'type-b',
                    label: 'Beta',
                    description: null,
                    icon: null,
                    group: 'Main',
                    keywords: [],
                    aliases: [],
                    order: 1,
                    surfaces: ['inline', 'empty', 'browse'],
                    requiresInput: false,
                },
            ],
        });
        const harness = createHarness(manifest);
        if (blockCount === 0) {
            harness.editor.commands.setContent({ type: 'doc', attrs: { schemaVersion: 2 }, content: [] });
        }
        const host = document.createElement('div');
        host.className = 'vizy-editor-surface';
        host.style.position = 'relative';
        host.style.minHeight = '8rem';
        document.body.append(host);
        host.append(harness.editor.view.dom);
        const overlay = new InsertionOverlay(host, () => nodeViewServices({
            editor: harness.editor,
            manifest,
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion: harness.insertion,
        }));
        overlay.sync();
        return { ...harness, host, overlay, manifest };
    }

    afterEach(() => {
        document.querySelectorAll('.vizy-editor-surface').forEach((node) => node.remove());
    });

    it('does not paint empty-state or Browse All UI', () => {
        const { host, overlay } = blocksHarness();
        expect(host.querySelector('vizy-empty-state')).toBeNull();
        expect(host.querySelector('vizy-browse-all')).toBeNull();
        overlay.destroy();
    });

    it('anchors a sole gutter boundary in an empty blocks-only field', () => {
        const { editor, insertion, manifest, overlay } = blocksHarness();
        const anchors = findInlineAnchors(nodeViewServices({
            editor,
            manifest,
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion,
        }));
        expect(anchors).toHaveLength(1);
        expect(anchors[0].measureSide).toBe('top');
        overlay.destroy();
    });

    it('keeps block queries available for empty registry surfaces', () => {
        // Manifest still advertises empty/browse surfaces for items; UI no longer
        // mounts those overlay hosts — gutter `+` uses the inline surface.
        const { insertion } = blocksHarness();
        const context = insertion.buildContext('empty', 0)!;
        const results = insertion.query({ context, kinds: ['block'] });
        expect(results.length).toBeGreaterThan(0);
        expect(results.every((entry) => entry.item.kind === 'block')).toBe(true);
    });

    it('uses one-choice direct insertion for single-type blocks-only areas', () => {
        const manifest = testManifest({
            field: {
                ...testManifest().field,
                rootContentType: 'blocks',
                allowedBlockTypeUids: ['type-a'],
                insertableBlockTypeUids: ['type-a'],
            },
            blockTypes: {
                'type-a': { uid: 'type-a', name: 'Alpha', handle: 'alpha', },
            },
            insertionItems: [{
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
                surfaces: ['inline', 'empty'],
                requiresInput: false,
            }],
        });
        const { editor, insertion } = createHarness(manifest);
        editor.commands.setContent({ type: 'doc', attrs: { schemaVersion: 2 }, content: [] });
        const context = insertion.buildContext('inline', 0)!;
        const results = insertion.query({ context });
        expect(oneChoiceDirect(results)?.item.id).toBe('block:type-a');
    });

    it('renders inline add affordances once blocks exist in blocks-only containers', () => {
        const setup = blocksHarness();
        setup.editor.commands.insertContent({
            type: 'vizyBlock',
            attrs: {
                blockUid: 'block-1',
                blockTypeUid: 'type-a',
                enabled: true,
                fieldSlots: {},
            },
            content: [],
        });
        // Gutter chips are pointer-driven; sync alone must not paint them.
        setup.overlay.sync();
        expect(setup.host.querySelectorAll('.vizy-inline-add').length).toBe(0);
        setup.host.dispatchEvent(new PointerEvent('pointermove', {
            clientX: 8,
            clientY: 0,
            bubbles: true,
        }));
        expect(setup.host.querySelectorAll('.vizy-inline-add').length).toBeGreaterThan(0);
        setup.overlay.destroy();
    });

    it('restores editor focus after gutter insertion without scrolling a stale selection', async () => {
        const setup = blocksHarness();
        setup.editor.commands.insertContent({
            type: 'vizyBlock',
            attrs: {
                blockUid: 'block-1',
                blockTypeUid: 'type-a',
                enabled: true,
                fieldSlots: {},
            },
            content: [],
        });
        const scrolledTransactions: boolean[] = [];
        setup.editor.on('transaction', ({ transaction }) => {
            scrolledTransactions.push(transaction.scrolledIntoView);
        });
        setup.host.dispatchEvent(new PointerEvent('pointermove', {
            clientX: 8,
            clientY: 0,
            bubbles: true,
        }));
        const button = setup.host.querySelector<HTMLButtonElement>('.vizy-inline-add');
        expect(button).not.toBeNull();
        button!.click();
        await Promise.resolve();

        const list = document.querySelector('vizy-insertion-list');
        expect(list).not.toBeNull();
        list!.dispatchEvent(new CustomEvent('vizy-insertion-select', {
            bubbles: true,
            composed: true,
            detail: { id: 'block:type-b' },
        }));
        await Promise.resolve();
        await Promise.resolve();

        expect(setup.editor.state.doc.childCount).toBe(2);
        expect(scrolledTransactions).not.toContain(true);
        setup.overlay.destroy();
    });

    /**
     * A rich root with Block Types used to get no `+` at all: anchors were only
     * generated for blocks-only containers. That left the slash menu as the only
     * route, which the insertion contract explicitly forbids — pointer and touch must
     * always reach an equivalent control.
     */
    it('anchors inline add at every top-level boundary of a rich root', () => {
        const base = testManifest();
        const manifest = testManifest({
            field: {
                ...base.field,
                rootContentType: 'rich',
                allowedBlockTypeUids: ['type-a'],
                insertableBlockTypeUids: ['type-a'],
                blockTypePickerGroups: [{ name: 'Main', blockTypeUids: ['type-a'], disabledBlockTypeUids: [] }],
            },
            blockTypes: {
                'type-a': { uid: 'type-a', name: 'Alpha', handle: 'alpha', },
            },
            insertionItems: [
                ...base.insertionItems,
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
                    order: 2,
                    surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                    requiresInput: false,
                },
            ],
        });
        const harness = createHarness(manifest);
        harness.editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Above' }] },
                {
                    type: 'vizyBlock',
                    attrs: { blockUid: 'block-1', blockTypeUid: 'type-a', enabled: true, fieldSlots: {} },
                    content: [],
                },
                { type: 'paragraph', content: [{ type: 'text', text: 'Below' }] },
            ],
        });

        const services = nodeViewServices({
            editor: harness.editor,
            manifest,
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion: harness.insertion,
        });
        const anchors = findInlineAnchors(services);

        // Before the first paragraph, and after each of the three children.
        expect(anchors).toHaveLength(4);
        expect(anchors.map((anchor) => anchor.position)).toStrictEqual(
            [...anchors].sort((a, b) => a.position - b.position).map((anchor) => anchor.position),
        );
        // The leading boundary measures the first child's top; every other one
        // measures the bottom of the child it follows, so no two share an edge.
        expect(anchors[0].measureSide).toBe('top');
        expect(anchors.slice(1).every((anchor) => anchor.measureSide === 'bottom')).toBe(true);
        expect(new Set(anchors.map((a) => `${a.measurePos}:${a.measureSide}`)).size).toBe(4);
    });

    /**
     * A document holding one Block and nothing else. Both boundaries used to
     * measure through `coordsAtPos()`, which reports the same degenerate rect
     * either side of a Block with no Content Areas, so the two buttons rendered
     * 2px apart — visually one button, with the "insert after" target unreachable.
     */
    it('measures the two boundaries of a lone block against different edges', () => {
        const setup = blocksHarness();
        setup.editor.commands.insertContent({
            type: 'vizyBlock',
            attrs: { blockUid: 'block-1', blockTypeUid: 'type-a', enabled: true, fieldSlots: {} },
            content: [],
        });
        const anchors = findInlineAnchors(nodeViewServices({
            editor: setup.editor,
            manifest: setup.manifest,
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion: setup.insertion,
        }));

        expect(anchors).toHaveLength(2);
        expect(anchors[0].measureSide).toBe('top');
        expect(anchors[1].measureSide).toBe('bottom');
        // Same node, opposite edges — that is what pulls them apart on screen.
        expect(anchors[0].measurePos).toBe(anchors[1].measurePos);
        expect(anchors[0].position).not.toBe(anchors[1].position);
        setup.overlay.destroy();
    });

    it('leaves a plain rich text field with no block types free of inline add', () => {
        // Keep the control subtle, and only where it improves insertion
        // here. There is nothing structural to add, and typing is the empty state.
        const harness = createHarness();
        harness.editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Just prose' }] }],
        });
        const anchors = findInlineAnchors(nodeViewServices({
            editor: harness.editor,
            manifest: testManifest(),
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion: harness.insertion,
        }));
        expect(anchors).toStrictEqual([]);
    });

    it('hides gutter anchors for Rich Text Only even when Block Types stay configured', () => {
        // richTextOnly zeros insertableBlockTypeUids but keeps allowedBlockTypeUids
        // for lossless mode switching — gutter must follow insertable (toolbar does).
        const base = testManifest();
        const manifest = testManifest({
            field: {
                ...base.field,
                rootContentType: 'rich',
                allowedBlockTypeUids: ['type-a'],
                insertableBlockTypeUids: [],
                blockTypePickerGroups: [{ name: 'Main', blockTypeUids: ['type-a'], disabledBlockTypeUids: [] }],
            },
            blockTypes: {
                'type-a': { uid: 'type-a', name: 'Alpha', handle: 'alpha' },
            },
        });
        const harness = createHarness(manifest);
        harness.editor.commands.setContent({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                { type: 'paragraph', content: [{ type: 'text', text: 'Lorem' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'Ipsum' }] },
            ],
        });
        const services = nodeViewServices({
            editor: harness.editor,
            manifest,
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion: harness.insertion,
        });
        expect(findInlineAnchors(services)).toStrictEqual([]);

        const host = document.createElement('div');
        host.style.position = 'relative';
        host.style.height = '200px';
        document.body.append(host);
        const surface = document.createElement('div');
        surface.className = 'vizy-editor-surface';
        surface.append(harness.editor.view.dom);
        host.append(surface);
        const overlay = new InsertionOverlay(host, () => services);
        host.dispatchEvent(new PointerEvent('pointermove', {
            clientX: 40,
            clientY: host.getBoundingClientRect().top + 40,
            bubbles: true,
        }));
        expect(host.querySelectorAll('.vizy-inline-add').length).toBe(0);
        overlay.destroy();
        host.remove();
    });
});

describe('insertion list viewport clamp', () => {
    it('computes bottom placement from anchor and viewport', () => {
        const anchor = new DOMRect(100, 500, 20, 20);
        expect(computeInsertionListMaxHeight(anchor, 'bottom-start', {
            viewportHeight: 600,
            distance: 4,
            pad: 10,
        })).toBe(120);
        expect(computeInsertionListMaxHeight(anchor, 'bottom-start', {
            viewportHeight: 900,
            distance: 4,
            pad: 10,
        })).toBe(320);
    });

    it('computes top placement from space above anchor', () => {
        expect(computeInsertionListMaxHeight(new DOMRect(100, 400, 20, 20), 'top-start', {
            viewportHeight: 800,
            distance: 4,
            pad: 10,
        })).toBe(320);
        expect(computeInsertionListMaxHeight(new DOMRect(100, 150, 20, 20), 'top-start', {
            viewportHeight: 800,
            distance: 4,
            pad: 10,
        })).toBe(136);
    });

    it('caps at the list design maximum', () => {
        expect(computeInsertionListMaxHeight(new DOMRect(100, 10, 20, 20), 'bottom-start', {
            viewportHeight: 2000,
            distance: 4,
            pad: 10,
        })).toBe(320);
    });
});

describe('slash insertion UI', () => {
    it('dismisses the gutter palette on editor pointerdown without reopening via returnFocus', async () => {
        const { editor, insertion } = createHarness();
        const services = nodeViewServices({
            editor,
            manifest: testManifest(),
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion,
        });
        const invoker = document.createElement('button');
        invoker.className = 'vizy-inline-add';
        invoker.dataset.vizyInvokerKey = 'gutter:root:1';
        document.body.append(invoker);
        const prose = document.createElement('p');
        prose.textContent = 'click me';
        document.body.append(prose);

        const popover = new InsertionPopover();
        const context = insertion.buildContext('inline', 1);
        expect(context).not.toBeNull();

        // Mirror production: ProseMirror sits inside `.vizy-editor-body`.
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);

        popover.open(services, context!, new DOMRect(0, 0, 20, 20), {
            returnFocus: invoker,
            invokerKey: 'gutter:root:1',
        });
        expect(popover.isOpen).toBe(true);
        expect(popover.isInvoker(invoker)).toBe(true);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(true);

        // Outside click on prose must dismiss and must not focus the invoker
        // (focus-during-pointerdown retargets the click and reopens).
        prose.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
        expect(popover.isOpen).toBe(false);
        expect(document.activeElement).not.toBe(invoker);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(false);

        let restored = 0;
        popover.open(services, context!, new DOMRect(0, 0, 20, 20), {
            invokerKey: 'gutter:root:1',
            onRestoreFocus: () => {
                restored += 1;
                editor.commands.focus();
            },
        });
        expect(popover.isOpen).toBe(true);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(true);

        // Chip pointerdown must NOT dismiss — click owns toggle/switch (avoids
        // close-then-reopen stutter from capture pointerdown + click).
        invoker.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
        expect(popover.isOpen).toBe(true);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(true);

        // Toggle-close restores the editor (not the chip).
        popover.close({ restoreFocus: true, animate: false });
        expect(popover.isOpen).toBe(false);
        expect(restored).toBe(1);
        expect(document.activeElement).not.toBe(invoker);

        invoker.remove();
        prose.remove();
        fieldBody.remove();
    });

    it('cold panel open skips Search autofocus and field focus ring hold', async () => {
        const { editor, insertion } = createHarness();
        const services = nodeViewServices({
            editor,
            manifest: testManifest(),
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion,
        });
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);

        // Simulate Craft title (or anything outside the field) owning focus.
        const outside = document.createElement('input');
        document.body.append(outside);
        outside.focus();
        expect(editor.view.hasFocus()).toBe(false);

        const popover = new InsertionPopover();
        const context = insertion.buildContext('inline', 1);
        expect(context).not.toBeNull();

        let restored = 0;
        popover.open(services, context!, new DOMRect(0, 0, 20, 20), {
            invokerKey: 'toolbar-plus',
            autofocusFilter: false,
            holdFieldFocus: false,
            onRestoreFocus: () => {
                restored += 1;
                editor.commands.focus();
            },
        });
        const popup = document.querySelector('pk-popup.vizy-insertion-popup');
        popup?.dispatchEvent(new Event('pk-reposition'));
        await Promise.resolve();
        await Promise.resolve();

        expect(popover.isOpen).toBe(true);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(false);
        expect(document.activeElement).toBe(outside);

        // Escape with restoreFocus must still honour onRestoreFocus when set —
        // cold toolbar passes null instead; pin that UI hold stayed off.
        popover.close({ restoreFocus: false, animate: false });
        expect(restored).toBe(0);
        expect(editor.isFocused).toBe(false);
        expect(document.activeElement).toBe(outside);

        outside.remove();
        fieldBody.remove();
    });

    it('toggles the same gutter chip closed and hard-switches without orphan panels', async () => {
        const { editor, insertion } = createHarness();
        const services = nodeViewServices({
            editor,
            manifest: testManifest(),
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion,
        });
        const a = document.createElement('button');
        a.className = 'vizy-inline-add';
        a.dataset.vizyInvokerKey = 'gutter:a';
        const b = document.createElement('button');
        b.className = 'vizy-inline-add';
        b.dataset.vizyInvokerKey = 'gutter:b';
        document.body.append(a, b);

        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);

        const popover = new InsertionPopover();
        const context = insertion.buildContext('inline', 1);
        expect(context).not.toBeNull();

        // skipEnterMotion still waits for settle; fire PK's reposition to reveal.
        popover.open(services, context!, new DOMRect(0, 0, 20, 20), {
            returnFocus: a,
            invokerKey: 'gutter:a',
            skipEnterMotion: true,
        });
        expect(popover.isOpen).toBe(true);
        const popupA = document.querySelector('pk-popup.vizy-insertion-popup');
        popupA?.dispatchEvent(new Event('pk-reposition'));
        await Promise.resolve();
        expect(document.querySelector('vizy-insertion-list')?.hasAttribute('data-open')).toBe(true);
        expect(document.querySelector('vizy-insertion-list')?.hasAttribute('data-instant')).toBe(true);

        popover.close({ restoreFocus: false, animate: true });
        expect(popover.isOpen).toBe(false);
        expect(popover.isClosing).toBe(true);
        expect(popover.isClosingInvoker('gutter:a')).toBe(true);
        expect(document.querySelectorAll('vizy-insertion-list').length).toBe(1);
        // Hide motion keeps data-open until finish — opacity must not snap off.
        expect(document.querySelector('vizy-insertion-list')?.classList.contains('closing')).toBe(true);
        expect(document.querySelector('vizy-insertion-list')?.hasAttribute('data-open')).toBe(true);

        // Soft duplicate close must not abort the in-flight hide animation.
        popover.close({ restoreFocus: false, animate: true });
        expect(popover.isClosing).toBe(true);
        expect(document.querySelectorAll('vizy-insertion-list').length).toBe(1);

        // Different chip: hard-open replaces the exiting panel (no orphan).
        popover.open(services, context!, new DOMRect(40, 0, 20, 20), {
            returnFocus: b,
            invokerKey: 'gutter:b',
            skipEnterMotion: true,
        });
        const popupB = document.querySelector('pk-popup.vizy-insertion-popup');
        popupB?.dispatchEvent(new Event('pk-reposition'));
        await Promise.resolve();
        expect(popover.isOpen).toBe(true);
        expect(popover.isClosing).toBe(false);
        expect(popover.invokerKey).toBe('gutter:b');
        expect(document.querySelectorAll('vizy-insertion-list').length).toBe(1);
        expect(document.querySelector('vizy-insertion-list')?.hasAttribute('data-open')).toBe(true);

        popover.close({ restoreFocus: false, animate: false });
        a.remove();
        b.remove();
        fieldBody.remove();
    });

    it('clamps list max-height to viewport space on pk-reposition', async () => {
        const { editor, insertion } = createHarness();
        const services = nodeViewServices({
            editor,
            manifest: testManifest(),
            ui: new BlockUiStateRegistry(),
            hosts: new FieldHostRegistry(),
            insertion,
        });
        const popover = new InsertionPopover();
        const context = insertion.buildContext('inline', 1);
        expect(context).not.toBeNull();

        popover.open(services, context!, new DOMRect(100, 500, 20, 20), {
            skipEnterMotion: true,
        });
        const popup = document.querySelector('pk-popup.vizy-insertion-popup') as HTMLElement | null;
        popup?.setAttribute('data-current-placement', 'bottom-start');
        popup?.dispatchEvent(new Event('pk-reposition'));
        await Promise.resolve();

        const anchor = new DOMRect(100, 500, 20, 20);
        const expected = `${computeInsertionListMaxHeight(anchor, 'bottom-start')}px`;
        const list = document.querySelector('vizy-insertion-list');
        expect(list?.style.maxHeight).toBe(expected);

        popover.close({ restoreFocus: false, animate: false });
        await Promise.resolve();
    });

    it('opens Add Block Search on blank-line slash and removes the trigger', async () => {
        // Slash is Blocks-only (same palette as gutter / toolbar Add Block).
        const manifest = testManifest({
            field: {
                ...testManifest().field,
                rootContentType: 'rich',
                allowedBlockTypeUids: ['type-a', 'type-b'],
                insertableBlockTypeUids: ['type-a', 'type-b'],
                blockTypePickerGroups: [{
                    name: 'Main',
                    blockTypeUids: ['type-a', 'type-b'],
                    disabledBlockTypeUids: [],
                }],
            },
            blockTypes: {
                'type-a': { uid: 'type-a', name: 'Alpha', handle: 'alpha', },
                'type-b': { uid: 'type-b', name: 'Beta', handle: 'beta', },
            },
            insertionItems: [
                {
                    id: 'block:type-a',
                    kind: 'block',
                    blockTypeUid: 'type-a',
                    label: 'Alpha',
                    description: null,
                    icon: null,
                    group: 'Blocks',
                    keywords: ['alpha'],
                    aliases: [],
                    order: 0,
                    surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                    requiresInput: false,
                },
                {
                    id: 'block:type-b',
                    kind: 'block',
                    blockTypeUid: 'type-b',
                    label: 'Beta',
                    description: null,
                    icon: null,
                    group: 'Blocks',
                    keywords: ['beta'],
                    aliases: [],
                    order: 1,
                    surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                    requiresInput: false,
                },
                // Nodes remain in the registry for toolbar / schema — slash must not list them.
                ...testManifest().insertionItems ?? [],
            ],
        });
        const { editor } = createHarness(manifest);
        editor.commands.focus('end');
        editor.commands.insertContent('/');
        await Promise.resolve();
        await Promise.resolve();

        // TipTap Suggestion hands off immediately — `/` is consumed.
        const slashState = VizySlashPluginKey.getState(editor.state) as { active?: boolean };
        expect(slashState?.active).not.toBe(true);
        expect(editor.state.doc.textContent).not.toContain('/');

        const popup = document.querySelector('vizy-insertion-list') as VizyInsertionListElement | null;
        expect(popup).not.toBeNull();
        expect(popup!.filterable).toBe(true);
        expect(popup!.items.length).toBeGreaterThan(0);
        expect(popup!.items.every((entry) => entry.item.kind === 'block')).toBe(true);
        await popup!.updateComplete;
        expect(popup!.shadowRoot?.querySelector('input[type="search"]')).not.toBeNull();

        const alpha = [...(popup!.shadowRoot?.querySelectorAll('button') ?? [])]
            .find((button) => button.textContent?.includes('Alpha'));
        expect(alpha).toBeTruthy();
        alpha!.click();
        await Promise.resolve();
        await Promise.resolve();

        expect(document.querySelector('vizy-insertion-list')).toBeNull();
    });

    it('does not activate slash mid-sentence', async () => {
        const manifest = testManifest({
            field: {
                ...testManifest().field,
                rootContentType: 'rich',
                allowedBlockTypeUids: ['type-a'],
                insertableBlockTypeUids: ['type-a'],
                blockTypePickerGroups: [{
                    name: 'Main',
                    blockTypeUids: ['type-a'],
                    disabledBlockTypeUids: [],
                }],
            },
            blockTypes: {
                'type-a': { uid: 'type-a', name: 'Alpha', handle: 'alpha', },
            },
            insertionItems: [
                {
                    id: 'block:type-a',
                    kind: 'block',
                    blockTypeUid: 'type-a',
                    label: 'Alpha',
                    description: null,
                    icon: null,
                    group: 'Blocks',
                    keywords: ['alpha'],
                    aliases: [],
                    order: 0,
                    surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                    requiresInput: false,
                },
            ],
        });
        const { editor } = createHarness(manifest);
        editor.commands.focus('end');
        editor.commands.insertContent('hello/');
        await Promise.resolve();
        await Promise.resolve();

        expect(document.querySelector('vizy-insertion-list')).toBeNull();
        expect(editor.state.doc.textContent).toContain('hello/');
    });

    it('does not activate slash before existing text on a line', async () => {
        const manifest = testManifest({
            field: {
                ...testManifest().field,
                rootContentType: 'rich',
                allowedBlockTypeUids: ['type-a'],
                insertableBlockTypeUids: ['type-a'],
                blockTypePickerGroups: [{
                    name: 'Main',
                    blockTypeUids: ['type-a'],
                    disabledBlockTypeUids: [],
                }],
            },
            blockTypes: {
                'type-a': { uid: 'type-a', name: 'Alpha', handle: 'alpha', },
            },
            insertionItems: [
                {
                    id: 'block:type-a',
                    kind: 'block',
                    blockTypeUid: 'type-a',
                    label: 'Alpha',
                    description: null,
                    icon: null,
                    group: 'Blocks',
                    keywords: ['alpha'],
                    aliases: [],
                    order: 0,
                    surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                    requiresInput: false,
                },
            ],
        });
        const { editor } = createHarness(manifest);
        editor.commands.setContent('<p>hello</p>');
        editor.commands.focus('start');
        editor.commands.insertContent('/');
        await Promise.resolve();
        await Promise.resolve();

        expect(document.querySelector('vizy-insertion-list')).toBeNull();
        expect(editor.state.doc.textContent).toContain('/hello');
    });

    it('does not activate slash in blocks-only root content', () => {
        const manifest = testManifest({
            field: {
                ...testManifest().field,
                rootContentType: 'blocks',
                allowedBlockTypeUids: ['type-a'],
                insertableBlockTypeUids: ['type-a'],
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
                    group: 'Blocks',
                    keywords: [],
                    aliases: [],
                    order: 0,
                    surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
                    requiresInput: false,
                },
            ],
        });
        const { editor } = createHarness(manifest);
        editor.commands.focus('end');
        editor.commands.insertContent('/');

        const slashState = VizySlashPluginKey.getState(editor.state) as { active?: boolean };
        expect(slashState?.active).not.toBe(true);
        expect(document.querySelector('vizy-insertion-list')).toBeNull();
    });

    it('hides gutter controls on keydown until the pointer moves again', () => {
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/insertion/overlay.ts'),
            'utf8',
        );
        expect(source).toMatch(/#typingHidden/);
        expect(source).toMatch(/addEventListener\('keydown', this\.#onKeyDown, true\)/);
        expect(source).toMatch(/this\.#typingHidden = true/);
        expect(source).toMatch(/this\.#typingHidden = false/);
    });

    it('clears gutter controls on pointerleave instead of re-syncing stale coords', () => {
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/insertion/overlay.ts'),
            'utf8',
        );
        expect(source).toMatch(/#pointerInside/);
        expect(source).toMatch(/#onPointerLeave = \(\): void => \{[\s\S]*?#clearButtons\(\);/);
        // Stale coords must not resurrect chips after leave — typing hide,
        // block-menu hit, or pointer-outside all clear.
        expect(source).toMatch(
            /if \(this\.#typingHidden \|\| this\.#pointerBlocksGutter\(\) \|\| !this\.#pointerInside\)/,
        );
    });

    it('suppresses gutter controls over block menus and header actions', () => {
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/insertion/overlay.ts'),
            'utf8',
        );
        expect(source).toMatch(/#pointerBlocksGutter/);
        expect(source).toMatch(/vizy-block\[menu-open\]/);
        expect(source).toMatch(/\.menu\[role="menu"\]/);
    });

    it('hit-tests gutter rows across heading margins without Content Area hosts', () => {
        const source = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/insertion/overlay.ts'),
            'utf8',
        );
        expect(source).toMatch(/#firstRowHitTop/);
        expect(source).toMatch(/marginTop/);
        // Nested chip hover must not flip to root (elementsFromPoint hits overlay).
        expect(source).toMatch(/#contentElementUnderPointer/);
        expect(source).not.toMatch(/#closestCrossingShadow/);
        expect(source).not.toMatch(/#slotHostNearNestedGutter/);
        expect(source).not.toMatch(/dataset\.vizySlotContent/);
    });
});
