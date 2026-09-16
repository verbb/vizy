import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import '@verbb/plugin-kit-web/components/popup';
import {
    holdEditorFieldFocusForPointerGesture,
    resolveEditorBody,
    restoreEditorFocus,
} from '../editor-field-focus';
import {
    deleteSelectedUrlNode,
    openVizyUrlNodeDialog,
    seedUrlNodeFromSelection,
    type UrlNodeKind,
} from './url-node-dialog';

type PkPopupEl = HTMLElement & {
    active: boolean;
    placement: string;
    distance: number;
    flip: boolean;
    flipPadding: number;
    shift: boolean;
    shiftPadding: number;
    arrow: boolean;
    arrowPlacement: 'start' | 'end' | 'center' | 'anchor';
    anchorTracking: boolean;
    positionMethod?: 'fixed' | 'absolute';
    anchor: Element | string | { getBoundingClientRect: () => DOMRect; contextElement?: Element };
    reposition: () => void;
};

const VIEWPORT_PAD_PX = 10;
const DISTANCE_PX = 8;
/**
 * Keep a click anchor when the selection hops to a *different* embed without a
 * fresh pointerdown. First select always keeps the pointerdown coords.
 */
const CLICK_ANCHOR_MAX_AGE_MS = 500;

const EMBED_SELECTOR = '.vizy-iframe, .vizy-media-embed';

/**
 * Edit · Delete chip for iframe / mediaEmbed atoms.
 *
 * Same click-relative anchoring as the image chip: on tall embeds the menu
 * sits near the pointer, not only at the top/bottom of the full node box.
 */
@customElement('vizy-embed-bubble')
export class VizyEmbedBubbleElement extends LitElement {
    @property({ attribute: false })
    accessor editor: Editor | null = null;

    @property({ type: Boolean, reflect: true })
    accessor visible = false;

    #popup: PkPopupEl | null = null;
    #kind: UrlNodeKind = 'mediaEmbed';
    #boundDom: HTMLElement | null = null;
    #selectedPos: number | null = null;
    /** 0–1 position inside the embed shell where the user last clicked. */
    #clickRel: { x: number; y: number } | null = null;
    /** Absolute client point for this gesture — survives shell layout shifts. */
    #clickClient: { x: number; y: number } | null = null;
    #clickAt = 0;

    readonly #rectSource: {
        getClientRect: () => DOMRect;
        contextElement: Element | undefined;
    } = {
        getClientRect: () => this.#anchorRect(),
        contextElement: undefined,
    };

    static styles = css`
        :host { display: none; }
        :host([visible]) { display: block; }
        .panel {
            display: flex;
            align-items: center;
            gap: 0;
            width: max-content;
            padding: 0;
            /* Vizy 3 / Formie: soft ring, not opaque white stroke. */
            border: 0;
            border-radius: var(--pk-radius-md, 4px);
            background: #1c2e36;
            color: #fff;
            font-size: 12px;
            line-height: 1.5;
            white-space: nowrap;
            box-shadow:
                0 0 0 1px rgb(255 255 255 / 0.2),
                0 4px 16px rgb(0 0 0 / 18%);
        }
        .action {
            box-sizing: border-box;
            margin: 0;
            padding: 6px 8px;
            border: 0;
            border-radius: var(--pk-radius-sm, 3px);
            background: transparent;
            color: #fff;
            font: inherit;
            font-size: 12px;
            cursor: pointer;
            outline: none;
            transition: color 0.15s ease;
        }
        .action:hover { color: rgb(255 255 255 / 0.7); }
        .divider {
            flex-shrink: 0;
            align-self: center;
            width: 1px;
            height: 12px;
            background: #616d73;
        }
    `;

    updated(changed: PropertyValues): void {
        if (changed.has('editor')) this.#bindEditorDom();
    }

    /** Show the chip for the current iframe / mediaEmbed NodeSelection. */
    syncToEmbed(kind: UrlNodeKind): void {
        const editor = this.editor;
        if (!editor) return;
        this.#kind = kind;
        this.#bindEditorDom();

        const pos = selectedEmbedPos(editor);
        if (pos !== this.#selectedPos) {
            const prev = this.#selectedPos;
            this.#selectedPos = pos;
            if (prev !== null && Date.now() - this.#clickAt > CLICK_ANCHOR_MAX_AGE_MS) {
                this.#clickRel = null;
            }
        }

        this.#rectSource.contextElement = editor.view.dom;
        this.#ensurePopup();
        const wasActive = Boolean(this.#popup?.active);
        const hasClickAnchor = this.#clickRel !== null || this.#clickClient !== null;
        this.visible = true;
        void this.updateComplete.then(() => {
            if (!this.#popup || !this.visible) return;
            this.#popup.active = true;
            if (wasActive || hasClickAnchor) this.#popup.reposition();
        });
    }

    /**
     * Hide the chip. Pass `{ clearAnchor: true }` when the embed is no longer
     * selected — blur mid-select must keep the pointer for the follow-up sync.
     */
    hide(options?: { clearAnchor?: boolean }): void {
        this.visible = false;
        this.#selectedPos = null;
        if (options?.clearAnchor) {
            this.#clickRel = null;
            this.#clickClient = null;
            this.#clickAt = 0;
        }
        if (this.#popup) this.#popup.active = false;
    }

    disconnectedCallback(): void {
        this.#unbindEditorDom();
        const popup = this.#popup;
        this.#popup = null;
        if (popup?.isConnected) {
            popup.active = false;
            popup.remove();
        }
        super.disconnectedCallback();
    }

    render() {
        if (!this.visible) return nothing;
        return html`
            <div class="panel" role="toolbar" aria-label="Embed actions">
                <button
                    type="button"
                    class="action"
                    @mousedown=${(event: MouseEvent) => event.preventDefault()}
                    @click=${this.#onEdit}
                >Edit</button>
                <span class="divider" aria-hidden="true"></span>
                <button
                    type="button"
                    class="action"
                    @mousedown=${(event: MouseEvent) => event.preventDefault()}
                    @click=${this.#onDelete}
                >Delete</button>
            </div>
        `;
    }

    #onEdit = (): void => {
        const editor = this.editor;
        if (!editor) return;
        const seed = seedUrlNodeFromSelection(editor, this.#kind);
        if (!seed) return;
        this.hide({ clearAnchor: true });
        void openVizyUrlNodeDialog(editor, seed, { focus: true });
    };

    #onDelete = (): void => {
        const editor = this.editor;
        if (!editor) return;
        deleteSelectedUrlNode(editor, this.#kind, { focus: true });
        this.hide({ clearAnchor: true });
    };

    #bindEditorDom(): void {
        const dom = this.editor?.view.dom ?? null;
        if (dom === this.#boundDom) return;
        this.#unbindEditorDom();
        if (!dom) return;
        this.#boundDom = dom;
        dom.addEventListener('pointerdown', this.#onEditorPointerDown, true);
    }

    #unbindEditorDom(): void {
        this.#boundDom?.removeEventListener('pointerdown', this.#onEditorPointerDown, true);
        this.#boundDom = null;
    }

    /**
     * Capture click location inside the embed shell so the bubble can sit near
     * the pointer on tall iframes / media previews (not mid-box of the whole atom).
     */
    #onEditorPointerDown = (event: PointerEvent): void => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const shell = target.closest(EMBED_SELECTOR);
        if (!shell || !this.#boundDom?.contains(shell)) return;

        const rect = shell.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        this.#clickRel = {
            x: clamp01((event.clientX - rect.left) / rect.width),
            y: clamp01((event.clientY - rect.top) / rect.height),
        };
        this.#clickClient = { x: event.clientX, y: event.clientY };
        this.#clickAt = Date.now();

        const editor = this.editor;
        const body = resolveEditorBody(editor?.view.dom ?? null);
        holdEditorFieldFocusForPointerGesture(body, () => {
            if (editor && !editor.isDestroyed) restoreEditorFocus(editor);
        });

        requestAnimationFrame(() => {
            if (!editor || editor.isDestroyed) return;
            const kind = activeEmbedKind(editor);
            if (kind) this.syncToEmbed(kind);
        });
    };

    /**
     * Small box at the click (or top-center fallback) — avoid a 0×0 point so
     * Floating UI flip/shift has a stable reference on first measure.
     */
    #anchorRect(): DOMRect {
        const size = 24;

        if (this.#clickClient && Date.now() - this.#clickAt <= CLICK_ANCHOR_MAX_AGE_MS) {
            return new DOMRect(
                this.#clickClient.x - size / 2,
                this.#clickClient.y - size / 2,
                size,
                size,
            );
        }

        const bounds = selectedEmbedShellRect(this.editor);
        if (!bounds) return new DOMRect();

        if (this.#clickRel) {
            const cx = bounds.left + this.#clickRel.x * bounds.width;
            const cy = bounds.top + this.#clickRel.y * bounds.height;
            return new DOMRect(cx - size / 2, cy - size / 2, size, size);
        }

        // No click yet (keyboard select) — top-center of the shell.
        return new DOMRect(bounds.left + bounds.width / 2 - size / 2, bounds.top, size, size);
    }

    #ensurePopup(): void {
        if (this.#popup) return;
        const popup = document.createElement('pk-popup') as PkPopupEl;
        popup.className = 'vizy-embed-bubble-popup';
        popup.placement = 'top';
        popup.distance = DISTANCE_PX;
        popup.flip = true;
        popup.flipPadding = VIEWPORT_PAD_PX;
        popup.shift = true;
        popup.shiftPadding = VIEWPORT_PAD_PX;
        // Speech-bubble caret (Formie/Vizy 3); color via --pk-popup-arrow-color in vizy.css.
        popup.arrow = true;
        popup.arrowPlacement = 'center';
        popup.anchorTracking = true;
        popup.positionMethod = 'fixed';
        const rectSource = this.#rectSource;
        popup.anchor = {
            getBoundingClientRect: () => rectSource.getClientRect(),
            get contextElement() {
                return rectSource.contextElement;
            },
        };
        popup.append(this);
        document.body.append(popup);
        this.#popup = popup;
    }
}

function clamp01(n: number): number {
    return Math.min(1, Math.max(0, n));
}

/** Doc position of the selected iframe / mediaEmbed node, or null. */
export function selectedEmbedPos(editor: Editor | null): number | null {
    if (!editor) return null;
    const { selection } = editor.state;
    if (selection instanceof NodeSelection) {
        const name = selection.node.type.name;
        if (name === 'iframe' || name === 'mediaEmbed') return selection.from;
    }
    const kind = activeEmbedKind(editor);
    if (!kind) return null;
    const $from = selection.$from;
    for (let depth = $from.depth; depth >= 0; depth--) {
        if ($from.node(depth).type.name === kind) {
            return depth === 0 ? 0 : $from.before(depth);
        }
    }
    return null;
}

/** Client rect of the selected embed shell (`.vizy-iframe` / `.vizy-media-embed`). */
export function selectedEmbedShellRect(editor: Editor | null): DOMRect | null {
    const pos = selectedEmbedPos(editor);
    if (pos == null || !editor) return null;
    const dom = editor.view.nodeDOM(pos);
    if (!(dom instanceof HTMLElement)) return null;
    const shell = dom.matches(EMBED_SELECTOR) ? dom : (dom.querySelector(EMBED_SELECTOR) ?? dom);
    return shell.getBoundingClientRect();
}

export function activeEmbedKind(editor: Editor): UrlNodeKind | null {
    const { selection } = editor.state;
    if (selection instanceof NodeSelection) {
        const name = selection.node.type.name;
        if (name === 'iframe' || name === 'mediaEmbed') return name;
    }
    if (editor.isActive('iframe')) return 'iframe';
    if (editor.isActive('mediaEmbed')) return 'mediaEmbed';
    return null;
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-embed-bubble': VizyEmbedBubbleElement;
    }
}
