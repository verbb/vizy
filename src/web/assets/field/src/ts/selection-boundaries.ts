import { Extension, type Editor } from '@tiptap/core';
import type { ResolvedPos } from '@tiptap/pm/model';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';

const RUN_CONTAINERS = new Set(['doc', 'column']);

function runContainerDepth($pos: ResolvedPos): number {
    for (let depth = $pos.depth; depth >= 0; depth -= 1) {
        if (RUN_CONTAINERS.has($pos.node(depth).type.name)) return depth;
    }
    return 0;
}

/**
 * Select the contiguous authored-text run containing the caret. Vizy Blocks are
 * hard boundaries: select-all never crosses into their NodeViews, Craft fields,
 * or Hosted nested editors. Layout columns establish local scopes too.
 */
export function selectCurrentTextRun(editor: Editor): boolean {
    const { doc, selection } = editor.state;
    if (selection instanceof NodeSelection && selection.node.type.name === 'vizyBlock') {
        return true;
    }

    const depth = runContainerDepth(selection.$from);
    const container = selection.$from.node(depth);
    if (container.childCount === 0) return true;

    const currentIndex = Math.min(selection.$from.index(depth), container.childCount - 1);
    if (container.child(currentIndex).type.name === 'vizyBlock') return true;

    let first = currentIndex;
    while (first > 0 && container.child(first - 1).type.name !== 'vizyBlock') first -= 1;

    let last = currentIndex;
    while (last + 1 < container.childCount
        && container.child(last + 1).type.name !== 'vizyBlock') {
        last += 1;
    }

    const contentStart = selection.$from.start(depth);
    let from = contentStart;
    for (let index = 0; index < first; index += 1) {
        from += container.child(index).nodeSize;
    }
    let to = from;
    for (let index = first; index <= last; index += 1) {
        to += container.child(index).nodeSize;
    }

    // Stay one token inside the run at each edge. Resolving exactly on the seam
    // before an isolating Block lets TextSelection collapse to the wrong side.
    const innerFrom = Math.min(from + 1, to);
    const innerTo = Math.max(innerFrom, to - 1);
    const scoped = TextSelection.between(doc.resolve(innerFrom), doc.resolve(innerTo));
    editor.view.dispatch(editor.state.tr.setSelection(scoped).scrollIntoView());
    return true;
}

/**
 * Keyboard deletion must not become a second, unconfirmed Block delete path.
 * Text editing inside a Block remains ordinary; only selections that own the
 * Block node itself (directly or as a complete ranged child) are protected.
 */
export function selectionContainsVizyBlock(editor: Editor): boolean {
    const { doc, selection } = editor.state;
    if (selection instanceof NodeSelection) {
        return selection.node.type.name === 'vizyBlock';
    }
    if (selection.empty) return false;

    let contains = false;
    doc.descendants((node, pos) => {
        if (contains) return false;
        if (node.type.name !== 'vizyBlock') return undefined;
        if (selection.from <= pos && selection.to >= pos + node.nodeSize) {
            contains = true;
            return false;
        }
        return undefined;
    });
    return contains;
}

export const VizySelectionBoundaries = Extension.create({
    name: 'vizySelectionBoundaries',
    // Run before ProseMirror's base select-all and delete keymaps.
    priority: 1100,
    addKeyboardShortcuts() {
        const protectBlockSelection = () => selectionContainsVizyBlock(this.editor);
        return {
            'Mod-a': () => selectCurrentTextRun(this.editor),
            Backspace: protectBlockSelection,
            Delete: protectBlockSelection,
            'Mod-Backspace': protectBlockSelection,
            'Mod-Delete': protectBlockSelection,
        };
    },
});
