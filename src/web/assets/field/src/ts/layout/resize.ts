import type { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import {
    commitGutterDrag,
    moveColumn,
    resizeLayoutGutter,
    resizeLayoutGutterByDelta,
} from './commands';
import { gutterCandidates, nearestCandidateIndex } from './presets';

export function findLayoutAtPos(editor: Editor, pos: number): { layoutPos: number; node: ProseMirrorNode } | null {
    const $pos = editor.state.doc.resolve(pos);
    for (let depth = $pos.depth; depth >= 1; depth--) {
        const node = $pos.node(depth);
        if (node.type.name === 'layout') {
            return { layoutPos: $pos.before(depth), node };
        }
    }
    return null;
}

/** Shift one span from `fromIndex` to `toIndex`, keeping total 12. */
export function resizeLayoutColumns(
    editor: Editor,
    layoutPos: number,
    fromIndex: number,
    toIndex: number,
    delta: number,
): boolean {
    if (fromIndex + 1 !== toIndex) return false;
    return resizeLayoutGutterByDelta(editor, layoutPos, fromIndex, delta);
}

export function moveLayoutColumn(editor: Editor, layoutPos: number, index: number, direction: -1 | 1): boolean {
    const layout = editor.state.doc.nodeAt(layoutPos);
    if (!layout || layout.type.name !== 'layout') return false;
    const column = layout.child(index);
    if (!column) return false;
    return moveColumn(editor, String(column.attrs.columnUid), direction);
}

export {
    commitGutterDrag,
    gutterCandidates,
    nearestCandidateIndex,
    resizeLayoutGutter,
    resizeLayoutGutterByDelta,
};

export type GutterDragPreview = {
    readonly gutterIndex: number;
    readonly leadingSpan: number;
    readonly trailingSpan: number;
};

/** Preview spans for gutter drag without mutating the document. */
export function previewGutterDrag(
    leadingSpan: number,
    trailingSpan: number,
    targetLeadingSpan: number,
): GutterDragPreview | null {
    const candidates = gutterCandidates(leadingSpan, trailingSpan);
    const index = nearestCandidateIndex(candidates, leadingSpan, targetLeadingSpan);
    const pair = candidates[index];
    if (!pair) return null;
    return { gutterIndex: 0, leadingSpan: pair[0], trailingSpan: pair[1] };
}
