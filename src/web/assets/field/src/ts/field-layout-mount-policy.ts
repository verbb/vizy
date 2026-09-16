import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorManifest } from './types';

/**
 * Every mountable Block is server-rendered into `EditorBootstrap.initialFieldLayouts`.
 * Client policy only opens layouts that were missing from that bootstrap (failed SSR)
 * or that arrived via pre-insert prefetch.
 */
export function countMountableBlocks(
    doc: ProseMirrorNode,
    blockTypes: EditorManifest['blockTypes'],
): number {
    let count = 0;
    doc.descendants((node) => {
        if (node.type.name !== 'vizyBlock') return;
        const type = blockTypes[String(node.attrs.blockTypeUid)];
        if (type?.fieldLayoutUid) count += 1;
    });
    return count;
}

/**
 * UIDs that should mount when not already adopted from bootstrap. Returns every
 * mountable Block — the loader skips `mounted`/`loading`, so full SSR means
 * zero AJAX on open.
 */
export function eagerFieldLayoutBlockUids(
    doc: ProseMirrorNode,
    blockTypes: EditorManifest['blockTypes'],
): string[] {
    const mountableUids: string[] = [];
    doc.descendants((node) => {
        if (node.type.name !== 'vizyBlock') return;
        const type = blockTypes[String(node.attrs.blockTypeUid)];
        if (type?.fieldLayoutUid) mountableUids.push(String(node.attrs.blockUid));
    });

    return mountableUids;
}
