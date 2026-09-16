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
    kind: 'root';
    node: ProseMirrorNode;
    contentType: 'rich' | 'blocks';
    allowedBlockTypeUids: string[];
    minBlocks: number | null;
    maxBlocks: number | null;
};

/** Root field policy only — Hosted nesting has its own editor/manifest. */
export function resolveContainer(
    doc: ProseMirrorNode,
    _pos: number,
    manifest: EditorManifest,
): ResolvedContainer {
    return {
        kind: 'root',
        node: doc,
        contentType: manifest.field.rootContentType,
        allowedBlockTypeUids: manifest.field.allowedBlockTypeUids,
        minBlocks: manifest.field.minBlocks,
        maxBlocks: manifest.field.maxBlocks,
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
