import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

export interface LocatedNode {
    readonly pos: number;
    readonly node: ProseMirrorNode;
    readonly index: number;
    readonly parent: ProseMirrorNode;
    readonly parentPos: number;
}

export function findLayoutByUid(doc: ProseMirrorNode, layoutUid: string): LocatedNode | null {
    let found: LocatedNode | null = null;
    doc.descendants((node, pos) => {
        if (found) return false;
        if (node.type.name !== 'layout' || String(node.attrs.layoutUid) !== layoutUid) {
            return undefined;
        }
        const $pos = doc.resolve(pos);
        const depth = $pos.depth;
        found = {
            pos,
            node,
            index: $pos.index(depth),
            parent: $pos.parent,
            // Top-level doc children resolve at depth 0; before(0) is invalid.
            parentPos: depth > 0 ? $pos.before(depth) : 0,
        };
        return false;
    });
    return found;
}

export function findColumnByUid(doc: ProseMirrorNode, columnUid: string): LocatedNode | null {
    let found: LocatedNode | null = null;
    doc.descendants((node, pos) => {
        if (found) return false;
        if (node.type.name !== 'column' || String(node.attrs.columnUid) !== columnUid) {
            return undefined;
        }
        const $pos = doc.resolve(pos);
        const depth = $pos.depth;
        found = {
            pos,
            node,
            index: $pos.index(depth),
            parent: $pos.parent,
            // Top-level doc children resolve at depth 0; before(0) is invalid.
            parentPos: depth > 0 ? $pos.before(depth) : 0,
        };
        return false;
    });
    return found;
}

export function columnIndexInLayout(layout: ProseMirrorNode, columnUid: string): number {
    for (let index = 0; index < layout.childCount; index += 1) {
        if (String(layout.child(index).attrs.columnUid) === columnUid) return index;
    }
    return -1;
}

export function layoutChildOffset(layoutPos: number, layout: ProseMirrorNode, childIndex: number): number {
    let offset = layoutPos + 1;
    for (let index = 0; index < childIndex; index += 1) {
        offset += layout.child(index).nodeSize;
    }
    return offset;
}

export function childPos(parentPos: number, parent: ProseMirrorNode, childIndex: number): number {
    let offset = parentPos + 1;
    for (let index = 0; index < childIndex; index += 1) {
        offset += parent.child(index).nodeSize;
    }
    return offset;
}

/** True when the insertion point sits inside a column (layout nesting forbidden). */
export function isInsideColumn(doc: ProseMirrorNode, pos: number): boolean {
    const $pos = doc.resolve(Math.max(0, Math.min(pos, doc.content.size)));
    for (let depth = $pos.depth; depth >= 0; depth -= 1) {
        if ($pos.node(depth).type.name === 'column') return true;
    }
    return false;
}

/** True when the range crosses a layout or column boundary. */
export function selectionTouchesLayout(doc: ProseMirrorNode, from: number, to: number): boolean {
    let touches = false;
    doc.nodesBetween(from, to, (node) => {
        if (node.type.name === 'layout' || node.type.name === 'column') {
            touches = true;
            return false;
        }
        return undefined;
    });
    return touches;
}
