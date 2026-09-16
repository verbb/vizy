import { Plugin } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import type { EditorManifest } from '../types';
import {
    getDraggedVizyBlock,
    isValidBlockMoveDropAtInsertPos,
    resolveBlockMoveDropPos,
} from './drop-rules';

type DropCursorOptions = {
    color?: string | false;
    width?: number;
    class?: string;
    manifest: EditorManifest;
};

/**
 * Dropcursor with Vizy block-move validation on the resolved insert pos.
 *
 * Stock prosemirror-dropcursor only consults `disableDropCursor` on the
 * innermost node under the pointer (e.g. paragraph). Hovering inside a Block
 * card never hits the Block node itself, so invalid nest lines could show.
 *
 * Block grip moves snap to sibling midpoints so the line tracks the same
 * target commitSiblingBlockMove will use — including over Craft widgets
 * that do not emit continuous dragover to the editor.
 */
export function vizyBlockDropCursor(options: DropCursorOptions): Plugin {
    return new Plugin({
        view(editorView) {
            return new VizyBlockDropCursorView(editorView, options);
        },
    });
}

class VizyBlockDropCursorView {
    readonly #manifest: EditorManifest;
    cursorPos: number | null = null;
    element: HTMLElement | null = null;
    timeout = -1;
    lastDragEvent: DragEvent | null = null;
    width: number;
    color: string | undefined;
    className: string | undefined;
    handlers: { name: string; handler: (event: Event) => void }[];

    constructor(
        readonly editorView: EditorView,
        options: DropCursorOptions,
    ) {
        this.#manifest = options.manifest;
        this.width = options.width ?? 1;
        this.color = options.color === false ? undefined : (options.color || 'black');
        this.className = options.class;
        this.handlers = ['dragover', 'dragend', 'drop', 'dragleave'].map((name) => {
            const handler = (event: Event): void => {
                (this as unknown as Record<string, (e: DragEvent) => void>)[name](event as DragEvent);
            };
            // Capture: Craft widget controls otherwise swallow dragover and the
            // blue line only updates in gaps between Blocks.
            editorView.dom.addEventListener(name, handler, true);
            return { name, handler };
        });
    }

    destroy(): void {
        this.handlers.forEach(({ name, handler }) => {
            this.editorView.dom.removeEventListener(name, handler, true);
        });
    }

    update(editorView: EditorView, prevState: { doc: EditorView['state']['doc'] }): void {
        if (this.cursorPos != null && prevState.doc !== editorView.state.doc) {
            if (this.lastDragEvent) {
                const target = this.computeTarget(this.lastDragEvent);
                if (target === this.cursorPos) this.updateOverlay();
                else this.setCursor(target);
            } else {
                this.updateOverlay();
            }
        }
    }

    setCursor(pos: number | null): void {
        if (pos === this.cursorPos) return;
        this.cursorPos = pos;
        if (pos == null) {
            this.element?.parentNode?.removeChild(this.element);
            this.element = null;
        } else {
            this.updateOverlay();
        }
    }

    updateOverlay(): void {
        const $pos = this.editorView.state.doc.resolve(this.cursorPos!);
        const isBlock = !$pos.parent.inlineContent;
        let rect: { left: number; right: number; top: number; bottom: number } | undefined;

        const editorDOM = this.editorView.dom;
        const editorRect = editorDOM.getBoundingClientRect();
        const scaleX = editorRect.width / editorDOM.offsetWidth;
        const scaleY = editorRect.height / editorDOM.offsetHeight;

        if (isBlock) {
            const before = $pos.nodeBefore;
            const after = $pos.nodeAfter;
            if (before || after) {
                const node = this.editorView.nodeDOM(
                    this.cursorPos! - (before ? before.nodeSize : 0),
                );
                if (node instanceof HTMLElement) {
                    const nodeRect = node.getBoundingClientRect();
                    let top = before ? nodeRect.bottom : nodeRect.top;
                    if (before && after) {
                        const afterEl = this.editorView.nodeDOM(this.cursorPos!);
                        if (afterEl instanceof HTMLElement) {
                            top = (top + afterEl.getBoundingClientRect().top) / 2;
                        }
                    }
                    const halfWidth = (this.width / 2) * scaleY;
                    rect = {
                        left: nodeRect.left,
                        right: nodeRect.right,
                        top: top - halfWidth,
                        bottom: top + halfWidth,
                    };
                }
            }
        }

        if (!rect) {
            const coords = this.editorView.coordsAtPos(this.cursorPos!);
            const halfWidth = (this.width / 2) * scaleX;
            rect = {
                left: coords.left - halfWidth,
                right: coords.left + halfWidth,
                top: coords.top,
                bottom: coords.bottom,
            };
        }

        const parent = this.editorView.dom.offsetParent as HTMLElement | null;
        if (!this.element) {
            this.element = parent!.appendChild(document.createElement('div'));
            if (this.className) this.element.className = this.className;
            this.element.style.cssText = 'position: absolute; z-index: 50; pointer-events: none;';
            if (this.color) this.element.style.backgroundColor = this.color;
        }
        this.element.classList.toggle('prosemirror-dropcursor-block', isBlock);
        this.element.classList.toggle('prosemirror-dropcursor-inline', !isBlock);

        let parentLeft: number;
        let parentTop: number;
        if (!parent || (parent === document.body && getComputedStyle(parent).position === 'static')) {
            parentLeft = -window.pageXOffset;
            parentTop = -window.pageYOffset;
        } else {
            const parentRect = parent.getBoundingClientRect();
            const parentScaleX = parentRect.width / parent.offsetWidth;
            const parentScaleY = parentRect.height / parent.offsetHeight;
            parentLeft = parentRect.left - parent.scrollLeft * parentScaleX;
            parentTop = parentRect.top - parent.scrollTop * parentScaleY;
        }

        this.element.style.left = `${(rect.left - parentLeft) / scaleX}px`;
        this.element.style.top = `${(rect.top - parentTop) / scaleY}px`;
        this.element.style.width = `${(rect.right - rect.left) / scaleX}px`;
        this.element.style.height = `${(rect.bottom - rect.top) / scaleY}px`;
    }

    scheduleRemoval(timeout: number): void {
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => this.setCursor(null), timeout);
    }

    computeTarget(event: DragEvent): number | null {
        const dragged = getDraggedVizyBlock(this.editorView);
        if (!dragged) return null;

        const target = resolveBlockMoveDropPos(
            this.editorView,
            event.clientX,
            event.clientY,
            dragged,
        );
        if (target == null) return null;
        if (!isValidBlockMoveDropAtInsertPos(this.editorView, target, this.#manifest)) {
            return null;
        }
        return target;
    }

    dragover(event: DragEvent): void {
        if (!this.editorView.editable) return;
        this.lastDragEvent = event;
        const target = this.computeTarget(event);
        if (target != null) {
            this.setCursor(target);
            // Short linger only — a long timeout left a stale line while the
            // pointer was over Craft widgets that do not re-fire dragover.
            this.scheduleRemoval(150);
        } else {
            this.setCursor(null);
        }
    }

    dragend(): void {
        this.scheduleRemoval(20);
    }

    drop(): void {
        this.scheduleRemoval(20);
    }

    dragleave(event: DragEvent): void {
        const related = event.relatedTarget;
        if (!(related instanceof Node) || !this.editorView.dom.contains(related)) {
            this.setCursor(null);
        }
    }
}
