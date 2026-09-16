import type { Node as ProseMirrorNode, Slice } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import { dropPoint } from '@tiptap/pm/transform';
import type { EditorView } from '@tiptap/pm/view';
import type { EditorManifest } from '../types';
import { canPlaceBlockTypeAtDepth, sameBlockTypeMaxDepth } from './nesting-depth';

export type DraggedVizyBlock = {
    uid: string;
    blockTypeUid: string;
    from: number;
    to: number;
    node: ProseMirrorNode;
};

function blockUidFromNode(node: ProseMirrorNode): string | null {
    if (node.type.name !== 'vizyBlock') return null;
    const uid = node.attrs.blockUid;
    return uid == null ? null : String(uid);
}

function findBlockByUid(doc: ProseMirrorNode, uid: string): { node: ProseMirrorNode; from: number } | null {
    let found: { node: ProseMirrorNode; from: number } | null = null;
    doc.descendants((node, pos) => {
        if (node.type.name === 'vizyBlock' && String(node.attrs.blockUid) === uid) {
            found = { node, from: pos };
            return false;
        }
        return !found;
    });
    return found;
}

/**
 * Grip-drag session snapshot. WebKit can fire `dragend` (which nulls
 * `view.dragging`) before `drop`; keep enough state to still commit + settle.
 */
let armedDragged: DraggedVizyBlock | null = null;

export function armDraggedVizyBlock(dragged: DraggedVizyBlock): void {
    armedDragged = dragged;
}

export function clearArmedDraggedVizyBlock(): void {
    armedDragged = null;
}

function resolveArmedDragged(view: EditorView): DraggedVizyBlock | null {
    if (!armedDragged) return null;
    // Refresh `from`/`to` from the live doc — positions can shift if the
    // document changed between dragstart and drop (rare; still safer).
    const found = findBlockByUid(view.state.doc, armedDragged.uid);
    if (!found) return null;
    return {
        ...armedDragged,
        from: found.from,
        to: found.from + found.node.nodeSize,
        node: found.node,
    };
}

/** Active block reorder drag seeded in `blocks/drag.ts`. */
export function getDraggedVizyBlock(view: EditorView): DraggedVizyBlock | null {
    const dragging = view.dragging;
    if (dragging?.move) {
        const selection = (dragging as { node?: unknown }).node;
        if (selection instanceof NodeSelection) {
            const node = selection.node;
            const uid = blockUidFromNode(node);
            if (!uid) return null;
            return {
                uid,
                blockTypeUid: String(node.attrs.blockTypeUid),
                from: selection.from,
                to: selection.from + node.nodeSize,
                node,
            };
        }

        // Fallback when only the slice is populated (external drag paths).
        const sliceNode = dragging.slice?.content.firstChild;
        const uid = sliceNode ? blockUidFromNode(sliceNode) : null;
        if (!uid || !sliceNode) return null;
        const found = findBlockByUid(view.state.doc, uid);
        if (!found) return null;
        return {
            uid,
            blockTypeUid: String(sliceNode.attrs.blockTypeUid),
            from: found.from,
            to: found.from + found.node.nodeSize,
            node: sliceNode,
        };
    }

    return resolveArmedDragged(view);
}

/** Match prosemirror-dropcursor / handleDrop: coords pos → mapped insert pos. */
export function resolveBlockDropInsertPos(
    doc: ProseMirrorNode,
    coordsPos: number,
    draggingSlice: Slice | null | undefined,
): number {
    let target = coordsPos;
    if (draggingSlice) {
        const point = dropPoint(doc, target, draggingSlice);
        if (point != null) target = point;
    }
    return target;
}

/**
 * Direct children of the Block's list container (root doc or layout column).
 * Includes paragraphs and other non-Block nodes so mixed rich fields can drop
 * a Block above leading prose (e.g. before "Testing content").
 */
export function listSiblingContainerChildRanges(
    doc: ProseMirrorNode,
    dragged: DraggedVizyBlock,
): { from: number; to: number }[] {
    const $pos = doc.resolve(dragged.from);
    let depth = $pos.depth;
    if ($pos.parent.type.name !== 'doc' && $pos.parent.type.name !== 'column') {
        depth = 0;
        for (let d = $pos.depth; d > 0; d -= 1) {
            if ($pos.node(d).type.name === 'column') {
                depth = d;
                break;
            }
        }
    }
    const container = $pos.node(depth);
    const contentStart = $pos.start(depth);
    const ranges: { from: number; to: number }[] = [];
    container.forEach((child, offset) => {
        const from = contentStart + offset;
        ranges.push({ from, to: from + child.nodeSize });
    });
    return ranges;
}

/**
 * Sibling Block boundaries in the same list as `dragged` (Blocks only).
 */
export function listSiblingBlockRanges(
    doc: ProseMirrorNode,
    dragged: DraggedVizyBlock,
): { uid: string; from: number; to: number }[] {
    const containerKey = blockListContainerKey(doc, dragged.from);
    if (containerKey == null) return [];
    const ranges: { uid: string; from: number; to: number }[] = [];
    doc.descendants((node, pos) => {
        if (node.type.name !== 'vizyBlock') return true;
        if (blockListContainerKey(doc, pos) !== containerKey) return true;
        ranges.push({
            uid: String(node.attrs.blockUid),
            from: pos,
            to: pos + node.nodeSize,
        });
        return false;
    });
    return ranges;
}

/**
 * Map pointer Y to a sibling insert position across *all* container children
 * (Blocks and prose). Above a child's midpoint → before it; below the last →
 * after it. That lets a Block drop above leading root prose. Returns null when
 * DOM boxes are unavailable (jsdom) so callers can fall back to dropPoint.
 */
export function snapSiblingBlockDropPos(
    view: EditorView,
    clientY: number,
    dragged: DraggedVizyBlock,
): number | null {
    const ranges = listSiblingContainerChildRanges(view.state.doc, dragged);
    if (ranges.length === 0) return null;

    const measured: { from: number; to: number; midY: number; height: number }[] = [];
    for (const range of ranges) {
        const dom = view.nodeDOM(range.from);
        if (!(dom instanceof HTMLElement)) continue;
        const rect = dom.getBoundingClientRect();
        const height = rect.bottom - rect.top;
        measured.push({
            from: range.from,
            to: range.to,
            midY: (rect.top + rect.bottom) / 2,
            height,
        });
    }
    // jsdom and detached editors report empty boxes — do not invent a snap.
    if (measured.length === 0 || measured.every((item) => item.height <= 0)) return null;

    for (const item of measured) {
        if (clientY < item.midY) return item.from;
    }
    return measured[measured.length - 1]!.to;
}

/** Prefer midpoint snap; fall back to stock coords → dropPoint mapping. */
export function resolveBlockMoveDropPos(
    view: EditorView,
    clientX: number,
    clientY: number,
    dragged: DraggedVizyBlock,
): number | null {
    const snapped = snapSiblingBlockDropPos(view, clientY, dragged);
    if (snapped != null) return snapped;

    const coords = view.posAtCoords({ left: clientX, top: clientY });
    if (!coords) return null;
    return resolveBlockDropInsertPos(
        view.state.doc,
        coords.pos,
        view.dragging?.slice ?? null,
    );
}

/**
 * Move a Block to `insertPos` while keeping its authored node (and blockUid).
 * Must not go through transformPasted / clipboard slice — those regenerate UIDs.
 */
export function commitSiblingBlockMove(
    view: EditorView,
    dragged: DraggedVizyBlock,
    insertPos: number,
): boolean {
    if (insertPos === dragged.from || insertPos === dragged.to) return false;

    const size = dragged.to - dragged.from;
    const tr = view.state.tr;
    tr.delete(dragged.from, dragged.to);
    const mapped = insertPos <= dragged.from ? insertPos : insertPos - size;
    tr.insert(mapped, dragged.node);
    try {
        tr.setSelection(NodeSelection.create(tr.doc, mapped));
    } catch {
        // Selection may be invalid if schema rejects — still keep the move.
    }
    view.dispatch(tr.scrollIntoView());
    return true;
}

/**
 * Identity of the Block list that owns `pos` (the block itself or an insert point).
 * Root list → `root`. Layout column → `column:{columnUid}`.
 * Grip reorder is sibling-only: source and target keys must match.
 */
export function blockListContainerKey(doc: ProseMirrorNode, pos: number): string | null {
    const $pos = doc.resolve(pos);
    if ($pos.parent.type.name === 'doc') return 'root';
    if ($pos.parent.type.name === 'column') {
        return `column:${String($pos.parent.attrs.columnUid ?? $pos.depth)}`;
    }
    for (let depth = $pos.depth; depth > 0; depth -= 1) {
        const node = $pos.node(depth);
        if (node.type.name !== 'column') continue;
        return `column:${String(node.attrs.columnUid ?? depth)}`;
    }
    return 'root';
}

/** True when grip-move would stay inside the same root list or layout column. */
export function isSiblingContainerDrop(
    doc: ProseMirrorNode,
    dragged: DraggedVizyBlock,
    insertPos: number,
): boolean {
    const fromKey = blockListContainerKey(doc, dragged.from);
    const toKey = blockListContainerKey(doc, insertPos);
    return fromKey != null && toKey != null && fromKey === toKey;
}

/**
 * Block cannot be dropped into its own subtree (Hosted nesting is outside PM).
 */
export function isDropInsideDraggedBlock(
    doc: ProseMirrorNode,
    dragged: DraggedVizyBlock,
    insertPos: number,
): boolean {
    if (insertPos > dragged.from && insertPos < dragged.to) return true;

    const $pos = doc.resolve(insertPos);
    for (let depth = $pos.depth; depth > 0; depth -= 1) {
        const node = $pos.node(depth);
        if (node.type.name === 'vizyBlock' && String(node.attrs.blockUid) === dragged.uid) {
            return true;
        }
    }
    return false;
}

function isBlockContainerInsert(doc: ProseMirrorNode, insertPos: number): boolean {
    const parent = doc.resolve(insertPos).parent;
    return parent.type.name === 'doc' || parent.type.name === 'column';
}

function isBlockTypeAllowedAt(
    manifest: EditorManifest,
    doc: ProseMirrorNode,
    insertPos: number,
    blockTypeUid: string,
): boolean {
    if (!isBlockContainerInsert(doc, insertPos)) return false;

    if (manifest.field.rootContentType === 'blocks') {
        return manifest.field.allowedBlockTypeUids.includes(blockTypeUid);
    }

    return manifest.field.allowedBlockTypeUids.includes(blockTypeUid)
        || manifest.field.insertableBlockTypeUids.includes(blockTypeUid);
}

/** Validate a resolved document insert position for block reorder. */
export function isValidBlockMoveDropAtInsertPos(
    view: EditorView,
    insertPos: number,
    manifest: EditorManifest,
): boolean {
    const dragged = getDraggedVizyBlock(view);
    if (!dragged) return true;
    if (isDropInsideDraggedBlock(view.state.doc, dragged, insertPos)) return false;
    // Grip = sibling reorder only. Cross-container Move is a later explicit action.
    if (!isSiblingContainerDrop(view.state.doc, dragged, insertPos)) return false;
    if (!isBlockTypeAllowedAt(manifest, view.state.doc, insertPos, dragged.blockTypeUid)) return false;
    // Sibling reorder usually keeps depth; still refuse if a future path would deepen past the cap.
    if (!canPlaceBlockTypeAtDepth(
        view.state.doc,
        insertPos,
        dragged.blockTypeUid,
        sameBlockTypeMaxDepth(manifest),
    )) {
        return false;
    }
    return true;
}

/** True when a block reorder drop at pointer coords is allowed. */
export function isValidBlockMoveDrop(
    view: EditorView,
    coordsPos: number,
    manifest: EditorManifest,
): boolean {
    const insertPos = resolveBlockDropInsertPos(
        view.state.doc,
        coordsPos,
        view.dragging?.slice ?? null,
    );
    return isValidBlockMoveDropAtInsertPos(view, insertPos, manifest);
}

/** @deprecated Prefer isValidBlockMoveDropAtInsertPos after resolving insert pos. */
export function shouldDisableBlockDropCursor(
    view: EditorView,
    coordsPos: number,
    manifest: EditorManifest,
): boolean {
    const dragged = getDraggedVizyBlock(view);
    if (!dragged) return false;
    return !isValidBlockMoveDrop(view, coordsPos, manifest);
}
