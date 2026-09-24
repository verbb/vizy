import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorManifest } from '../types';

export function directBlocks(node: ProseMirrorNode): ProseMirrorNode[] {
    const blocks: ProseMirrorNode[] = [];
    node.forEach((child) => {
        if (child.type.name === 'vizyBlock') blocks.push(child);
    });
    return blocks;
}

export type ResolvedContainer = {
    kind: 'root' | 'nested';
    node: ProseMirrorNode;
    contentType: 'rich' | 'blocks';
    allowedBlockTypeUids: string[];
    minBlocks: number | null;
    maxBlocks: number | null;
};

/** Root field policy only — Hosted nesting has its own editor/manifest. */
export function resolveContainer(
    doc: ProseMirrorNode,
    pos: number,
    manifest: EditorManifest,
): ResolvedContainer {
    const $pos = doc.resolve(Math.max(0, Math.min(pos, doc.content.size)));
    const containerDepth = $pos.parent.isTextblock ? Math.max(0, $pos.depth - 1) : $pos.depth;
    const node = $pos.node(containerDepth);
    const root = node === doc;
    return {
        kind: root ? 'root' : 'nested',
        node,
        contentType: root ? manifest.field.rootContentType : 'rich',
        allowedBlockTypeUids: manifest.field.allowedBlockTypeUids,
        minBlocks: root ? manifest.field.minBlocks : null,
        maxBlocks: root ? manifest.field.maxBlocks : null,
    };
}

export function blockDepth(doc: ProseMirrorNode, pos: number): number {
    const $pos = doc.resolve(Math.max(0, Math.min(pos, doc.content.size)));
    let depth = 0;
    for (let level = $pos.depth; level >= 0; level -= 1) {
        if ($pos.node(level).type.name === 'vizyBlock') depth += 1;
    }
    return depth;
}
