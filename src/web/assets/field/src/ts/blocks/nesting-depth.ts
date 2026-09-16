import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorManifest } from '../types';

/**
 * Consecutive same-type nesting helpers for this TipTap document (root / layout).
 *
 * Hosted Vizy nesting is sole composition nesting — depth there uses
 * `HostedVizyContext.depth`, not TipTap ancestors. `vizyBlock` is a leaf, so
 * these counters mainly guard sibling reorder / insert at the field root.
 */
export const DEFAULT_SAME_BLOCK_TYPE_MAX_DEPTH = 3;

export function sameBlockTypeMaxDepth(manifest: EditorManifest): number {
    const configured = manifest.field.sameBlockTypeMaxDepth;
    return typeof configured === 'number' && configured > 0
        ? configured
        : DEFAULT_SAME_BLOCK_TYPE_MAX_DEPTH;
}

/**
 * Count consecutive `vizyBlock` ancestors of `blockTypeUid` above `pos`.
 * A different Block Type resets the counter. Does not include a block *at* `pos`.
 */
export function consecutiveSameTypeAncestorCount(
    doc: ProseMirrorNode,
    pos: number,
    blockTypeUid: string,
): number {
    const $pos = doc.resolve(Math.max(0, Math.min(pos, doc.content.size)));
    let count = 0;
    for (let depth = $pos.depth; depth > 0; depth -= 1) {
        const node = $pos.node(depth);
        if (node.type.name !== 'vizyBlock') continue;
        if (String(node.attrs.blockTypeUid) === blockTypeUid) {
            count += 1;
        } else {
            // Different type between us and outer same-types resets this type's depth.
            break;
        }
    }
    return count;
}

/** True when placing `blockTypeUid` at `insertPos` would stay within the max depth. */
export function canPlaceBlockTypeAtDepth(
    doc: ProseMirrorNode,
    insertPos: number,
    blockTypeUid: string,
    maxDepth: number = DEFAULT_SAME_BLOCK_TYPE_MAX_DEPTH,
): boolean {
    return consecutiveSameTypeAncestorCount(doc, insertPos, blockTypeUid) < maxDepth;
}

/**
 * Depth of an existing block at `blockPos` (ancestors of the same type + itself).
 * `blockPos` is the document position of the block node (before it).
 */
export function sameTypeDepthForBlockAt(
    doc: ProseMirrorNode,
    blockPos: number,
    blockTypeUid: string,
): number {
    return consecutiveSameTypeAncestorCount(doc, blockPos, blockTypeUid) + 1;
}
