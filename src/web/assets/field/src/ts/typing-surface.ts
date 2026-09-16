import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { TextSelection } from '@tiptap/pm/state';
import type { CanonicalNode, EditorManifest } from './types';

function isEmptyParagraphNode(node: CanonicalNode): boolean {
    if (node.type !== 'paragraph') return false;
    const content = node.content;
    if (!content?.length) return true;
    return content.every((child) => child.type === 'text' && !(child.text ?? '').length);
}

/** Rich root fields need a paragraph to host the text caret — not a gap cursor. */
export function ensureRootTypingSurface(
    document: CanonicalNode,
    manifest: EditorManifest,
): CanonicalNode {
    if (manifest.field.rootContentType !== 'rich' || document.type !== 'doc') return document;
    const content = document.content ?? [];
    if (content.length > 0) return document;
    return { ...document, content: [{ type: 'paragraph' }] };
}

/**
 * The editor keeps a phantom empty paragraph while authoring; canonical storage
 * for a cleared rich field stays `{ content: [] }`.
 */
export function collapseEphemeralRootParagraph(
    document: CanonicalNode,
    manifest: EditorManifest,
): CanonicalNode {
    if (manifest.field.rootContentType !== 'rich' || document.type !== 'doc') return document;
    const content = document.content ?? [];
    if (content.length !== 1 || !isEmptyParagraphNode(content[0])) return document;
    return { type: 'doc', attrs: document.attrs, content: [] };
}

/** Re-seed the paragraph if a rich root doc is cleared while editing. */
export function createRootTypingSurfaceExtension(manifest: EditorManifest) {
    return Extension.create({
        name: 'vizyRootTypingSurface',
        addProseMirrorPlugins() {
            if (manifest.field.rootContentType !== 'rich') return [];
            const { paragraph } = this.editor.schema.nodes;
            if (!paragraph) return [];
            return [
                new Plugin({
                    appendTransaction(_transactions, _oldState, newState) {
                        if (newState.doc.content.size > 0) return null;
                        const tr = newState.tr.insert(0, paragraph.create());
                        tr.setSelection(TextSelection.create(tr.doc, 1));
                        return tr;
                    },
                }),
            ];
        },
    });
}
