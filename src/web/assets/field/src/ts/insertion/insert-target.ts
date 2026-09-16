import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

export type InsertTarget = number | { from: number; to: number };

/**
 * Where a block-level insert should land.
 *
 * Empty textblocks are *replaced* rather than left behind:
 * - caret inside an empty paragraph (slash / keyboard) → replace that node
 * - insert gap after an empty paragraph (gutter `+` after the hovered row) →
 *   replace the preceding empty node
 *
 * A textblock with content keeps insert-after / split behaviour — the blank
 * line the author typed into is intentional scaffolding until they insert
 * something into it.
 */
export function blockLevelInsertTarget(doc: ProseMirrorNode, pos: number): InsertTarget {
    const clamped = Math.max(0, Math.min(pos, doc.content.size));
    const $pos = doc.resolve(clamped);

    if ($pos.parent.isTextblock && $pos.parent.content.size === 0) {
        return { from: $pos.before(), to: $pos.after() };
    }

    const before = $pos.nodeBefore;
    if (before?.isTextblock && before.content.size === 0) {
        return { from: clamped - before.nodeSize, to: clamped };
    }

    return clamped;
}
