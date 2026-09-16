import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import { Fragment, Slice } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { createBlockDragGhost, selectBlockForDrag, wireBlockDragHandle } from '../../src/web/assets/field/src/ts/blocks/drag';
import { armBlockDragHost, isBlockDragHostArmed } from '../../src/web/assets/field/src/ts/blocks/drag-arm';
import {
    commitSiblingBlockMove,
    getDraggedVizyBlock,
    isDropInsideDraggedBlock,
    isValidBlockMoveDrop,
    listSiblingBlockRanges,
} from '../../src/web/assets/field/src/ts/blocks/drop-rules';
import { findBlockPosition, moveBlockByOffset } from '../../src/web/assets/field/src/ts/blocks/actions';
import { regenerateAuthoredUids } from '../../src/web/assets/field/src/ts/identity';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { nodeViewServices } from './support/node-view-services';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

function testManifest(): EditorManifest {
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
            blockTypePickerGroups: [],
            allowedBlockTypeUids: ['card'],
            insertableBlockTypeUids: ['card'],
            minBlocks: null,
            maxBlocks: null,
        },
        blockTypes: {
            card: {
                uid: 'card',
                name: 'Card',
                handle: 'card',
                
            },
        },
        toolbar: { controls: [] },
        bubble: { controls: [] },
        insertionItems: [],
    };
}

function createHarness() {
    const manifest = testManifest();
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
        content: {
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [
                {
                    type: 'vizyBlock',
                    attrs: { blockUid: 'a', blockTypeUid: 'card', enabled: true, fieldSlots: {} },
                    content: [],
                },
                {
                    type: 'vizyBlock',
                    attrs: { blockUid: 'b', blockTypeUid: 'card', enabled: true, fieldSlots: {} },
                    content: [],
                },
            ],
        },
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
    return { editor };
}

describe('block drag helpers', () => {
    it('creates a type-name ghost pill for setDragImage', () => {
        const ghost = createBlockDragGhost('Card');
        expect(ghost.className).toBe('vizy-block-drag-ghost');
        expect(ghost.textContent).toBe('Card');
        ghost.remove();
    });

    it('does not cancel dragstart that originates on a nested Block host', () => {
        // Parent capture-phase dragstart must ignore nested hosts — otherwise
        // Content Area children can never reorder (parent preventDefaults).
        const parent = document.createElement('div');
        const child = document.createElement('div');
        parent.append(child);
        document.body.append(parent);

        const disposeParent = wireBlockDragHandle(parent, {
            getPos: () => 0,
            getLabel: () => 'Outer',
            getView: () => {
                throw new Error('parent must not begin a nested child drag');
            },
            onDragChange: () => undefined,
        });

        const event = new DragEvent('dragstart', {
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        child.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);

        disposeParent();
        parent.remove();
    });

    it('selects the block node for ProseMirror drag and can reorder siblings', () => {
        const { editor } = createHarness();
        const pos = findBlockPosition(editor, 'b');
        expect(pos).not.toBeNull();
        selectBlockForDrag(editor.view, pos!);
        expect(editor.state.selection).toBeInstanceOf(NodeSelection);
        expect((editor.state.selection as NodeSelection).node.attrs.blockUid).toBe('b');

        expect(moveBlockByOffset(editor, 'b', -1)).toBe(true);
        expect(findBlockPosition(editor, 'b')).toBeLessThan(findBlockPosition(editor, 'a')!);
    });

    it('moves a block down past its next sibling and back up without changing either payload', () => {
        const { editor } = createHarness();
        const original = editor.getJSON().content!;
        expect(moveBlockByOffset(editor, 'a', 1)).toBe(true);
        expect(editor.getJSON().content).toEqual([original[1], original[0]]);
        expect(moveBlockByOffset(editor, 'a', 1)).toBe(false);
        expect(moveBlockByOffset(editor, 'a', -1)).toBe(true);
        expect(editor.getJSON().content).toEqual(original);
    });

    it('moves down past the full size of a following prose node', () => {
        const { editor } = createHarness();
        const block = editor.getJSON().content![0];
        const prose = { type: 'paragraph', content: [{ type: 'text', text: 'Following paragraph' }] };
        editor.commands.setContent({ type: 'doc', content: [block, prose] });
        const original = editor.getJSON().content!;
        expect(moveBlockByOffset(editor, 'a', 1)).toBe(true);
        expect(editor.getJSON().content).toEqual([original[1], original[0]]);
    });

    it('header activate selects that Block node (not nested text)', () => {
        const { editor } = createHarness();
        const pos = findBlockPosition(editor, 'a');
        expect(pos).not.toBeNull();
        const host = editor.view.nodeDOM(pos!);
        expect(host).toBeInstanceOf(HTMLElement);

        // Park caret in nested prose so a buggy header click would leave it there.
        let textPos = 0;
        editor.state.doc.descendants((node, pos) => {
            if (node.isText && node.text === 'One') {
                textPos = pos;
                return false;
            }
            return undefined;
        });
        editor.commands.setTextSelection(textPos + 1);
        expect(editor.state.selection).not.toBeInstanceOf(NodeSelection);

        host!.dispatchEvent(new CustomEvent('vizy-block-header-activate', {
            bubbles: true,
            composed: true,
        }));

        expect(editor.state.selection).toBeInstanceOf(NodeSelection);
        expect((editor.state.selection as NodeSelection).node.attrs.blockUid).toBe('a');
    });

    it('header activate claims editor focus so Enter does not submit the form', async () => {
        const { editor } = createHarness();
        // Detached editors cannot take document.activeElement — mount like the CP field.
        const mount = document.createElement('div');
        mount.className = 'vizy-editor-body';
        mount.append(editor.view.dom);
        document.body.append(mount);

        const pos = findBlockPosition(editor, 'a');
        expect(pos).not.toBeNull();
        const host = editor.view.nodeDOM(pos!);
        expect(host).toBeInstanceOf(HTMLElement);

        // Simulate Craft title (or anything outside the field) holding DOM focus.
        const foreign = document.createElement('input');
        document.body.append(foreign);
        foreign.focus();
        expect(document.activeElement).toBe(foreign);

        host!.dispatchEvent(new CustomEvent('vizy-block-header-activate', {
            bubbles: true,
            composed: true,
        }));

        // Selection paints from field activity + [selected], not mid-press focus.
        expect(editor.state.selection).toBeInstanceOf(NodeSelection);
        expect(mount.hasAttribute('data-has-focus')).toBe(true);
        // DOM focus waits until pointerup (avoid CE focus flicker / select-all).
        expect(document.activeElement).toBe(foreign);

        window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }));
        await Promise.resolve();
        expect(document.activeElement).toBe(editor.view.dom);
        await Promise.resolve();
        expect(mount.hasAttribute('data-has-focus')).toBe(false);

        foreign.remove();
        mount.remove();
    });

            it('does not clear host.draggable while the grip drag is armed', async () => {
        // Grip mousedown arms the host then selects the Block; selectNode used to
        // clear draggable on a microtask and force a second gesture.
        const { editor } = createHarness();
        const pos = findBlockPosition(editor, 'a');
        expect(pos).not.toBeNull();
        const host = editor.view.nodeDOM(pos!) as HTMLElement;
        expect(host).toBeInstanceOf(HTMLElement);

        // Let NodeView's deferred drag wire settle so its init disarm does not
        // race the arm below.
        await Promise.resolve();
        await Promise.resolve();

        armBlockDragHost(host);
        selectBlockForDrag(editor.view, pos!);
        await Promise.resolve();

        expect(isBlockDragHostArmed(host)).toBe(true);
        expect(host.draggable).toBe(true);
    });

            it('preserves blockUid when committing a sibling move', () => {
        // Stock PM drop runs transformPasted (UID regen) then inserts the slice —
        // that disposed FieldLayout hosts. commitSiblingBlockMove keeps the node.
        const { editor } = createHarness();
        const from = findBlockPosition(editor, 'b');
        expect(from).not.toBeNull();
        const beforeA = findBlockPosition(editor, 'a')!;
        const node = editor.state.doc.nodeAt(from!)!;
        const selection = NodeSelection.create(editor.state.doc, from!);
        editor.view.dragging = {
            slice: new Slice(Fragment.from(node), 0, 0),
            move: true,
            node: selection,
        } as typeof editor.view.dragging;
        const dragged = getDraggedVizyBlock(editor.view)!;
        expect(dragged.uid).toBe('b');

        expect(commitSiblingBlockMove(editor.view, dragged, beforeA)).toBe(true);
        expect(findBlockPosition(editor, 'b')).toBeLessThan(findBlockPosition(editor, 'a')!);
        expect(findBlockPosition(editor, 'b')).not.toBeNull();
        // Regenerating would have replaced 'b' with a new uuid.
        expect(editor.state.doc.toJSON()).not.toEqual(
            regenerateAuthoredUids(editor.state.doc.toJSON()),
        );
        editor.view.dragging = null;
    });

    it('lists only same-container siblings for snap targets', () => {
        const { editor } = createHarness();
        const from = findBlockPosition(editor, 'a')!;
        const node = editor.state.doc.nodeAt(from)!;
        const dragged = {
            uid: 'a',
            blockTypeUid: 'card',
            from,
            to: from + node.nodeSize,
            node,
        };
        const ranges = listSiblingBlockRanges(editor.state.doc, dragged);
        expect(ranges.map((range) => range.uid)).toEqual(['a', 'b']);
    });

    it('can move a block above leading root prose', () => {
        // Mixed rich root: paragraph then Block. Snap used to ignore prose, so
        // there was no insert target before "Testing content".
        const manifest = testManifest();
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
            content: {
                type: 'doc',
                attrs: { schemaVersion: 2 },
                content: [
                    { type: 'paragraph', content: [{ type: 'text', text: 'Testing content' }] },
                    {
                        type: 'vizyBlock',
                        attrs: { blockUid: 'b', blockTypeUid: 'card', enabled: true, fieldSlots: {} },
                        content: [],
                    },
                ],
            },
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

        const from = findBlockPosition(editor, 'b')!;
        const node = editor.state.doc.nodeAt(from)!;
        const selection = NodeSelection.create(editor.state.doc, from);
        editor.view.dragging = {
            slice: new Slice(Fragment.from(node), 0, 0),
            move: true,
            node: selection,
        } as typeof editor.view.dragging;
        const dragged = getDraggedVizyBlock(editor.view)!;

        // Position 0 — before the leading paragraph.
        expect(isValidBlockMoveDrop(editor.view, 0, manifest)).toBe(true);
        expect(commitSiblingBlockMove(editor.view, dragged, 0)).toBe(true);

        const first = editor.state.doc.firstChild;
        expect(first?.type.name).toBe('vizyBlock');
        expect(first?.attrs.blockUid).toBe('b');
        expect(editor.state.doc.child(1).type.name).toBe('paragraph');

        editor.view.dragging = null;
    });
});
