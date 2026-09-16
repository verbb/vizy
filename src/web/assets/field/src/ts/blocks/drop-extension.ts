import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import type { EditorManifest } from '../types';
import { vizyBlockDropCursor } from './drop-cursor';
import {
    clearArmedDraggedVizyBlock,
    commitSiblingBlockMove,
    getDraggedVizyBlock,
    isValidBlockMoveDropAtInsertPos,
    resolveBlockMoveDropPos,
} from './drop-rules';
import { playBlockDropSettle } from './block-drop-settle';

function tryCommitBlockMoveDrop(
    view: EditorView,
    event: DragEvent,
    manifest: EditorManifest,
): boolean {
    const dragged = getDraggedVizyBlock(view);
    if (!dragged) return false;

    const insertPos = resolveBlockMoveDropPos(
        view,
        event.clientX,
        event.clientY,
        dragged,
    );
    if (
        insertPos == null
        || !isValidBlockMoveDropAtInsertPos(view, insertPos, manifest)
    ) {
        clearArmedDraggedVizyBlock();
        return true; // consume invalid grip drops
    }
    if (commitSiblingBlockMove(view, dragged, insertPos)) {
        clearArmedDraggedVizyBlock();
        playBlockDropSettle();
    } else {
        clearArmedDraggedVizyBlock();
    }
    return true;
}

/** Block reorder: validated drop line + commit with preserved blockUid. */
export function createBlockMoveDropExtension(manifest: EditorManifest) {
    return Extension.create({
        name: 'vizyBlockMoveDrop',
        addProseMirrorPlugins() {
            return [
                vizyBlockDropCursor({
                    color: '#0284c7',
                    width: 2,
                    class: 'vizy-block-dropcursor',
                    manifest,
                }),
                new Plugin({
                    view(editorView) {
                        // Capture so Craft field widgets (inputs) cannot steal the
                        // drop — bubble-only handleDrop never runs when the release
                        // target is a nested control.
                        const onDropCapture = (event: DragEvent): void => {
                            if (!getDraggedVizyBlock(editorView)) return;
                            if (!tryCommitBlockMoveDrop(editorView, event, manifest)) return;
                            event.preventDefault();
                            event.stopPropagation();
                            try {
                                editorView.dragging = null;
                            } catch {
                                // Editor may already be destroyed.
                            }
                        };
                        const onDragOverCapture = (event: DragEvent): void => {
                            // Allow drop over Craft controls: without preventDefault,
                            // the browser treats the field as a non-target and drop
                            // never fires.
                            if (!getDraggedVizyBlock(editorView)) return;
                            event.preventDefault();
                            if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
                        };
                        editorView.dom.addEventListener('drop', onDropCapture, true);
                        editorView.dom.addEventListener('dragover', onDragOverCapture, true);
                        return {
                            destroy() {
                                editorView.dom.removeEventListener('drop', onDropCapture, true);
                                editorView.dom.removeEventListener('dragover', onDragOverCapture, true);
                            },
                        };
                    },
                    props: {
                        handleDrop(view, event, _slice, moved) {
                            const dragged = getDraggedVizyBlock(view);
                            if (!moved || !dragged) return false;
                            // Fallback when capture did not run (tests / odd targets).
                            return tryCommitBlockMoveDrop(view, event, manifest);
                        },
                    },
                }),
            ];
        },
    });
}
