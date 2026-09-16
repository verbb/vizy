import type { Editor } from '@tiptap/core';
import {
    openVizyUrlNodeDialog,
    seedUrlNodeFromSelection,
    type UrlNodeKind,
} from './url-node-dialog';

/** Toolbar Media Embed / Iframe — open URL dialog (edit when node selected). */
export function activateUrlNodeControl(
    editor: Editor,
    kind: UrlNodeKind,
    options?: { focus?: boolean },
): void {
    if (editor.isActive(kind)) {
        const seed = seedUrlNodeFromSelection(editor, kind);
        if (seed) {
            void openVizyUrlNodeDialog(editor, seed, { focus: options?.focus });
            return;
        }
    }
    void openVizyUrlNodeDialog(editor, {
        kind,
        url: '',
        updating: false,
    }, { focus: options?.focus });
}
