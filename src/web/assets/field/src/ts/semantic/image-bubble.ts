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
import { seedImageDialogFromSelection, deleteSelectedImage, refreshImagePreview } from './image-apply';
import { openVizyImageDialog } from './image-dialog';
import { getImagePreview } from './image-preview-cache';
import type { VizyImageAuthoringConfig } from './image-ui';

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
 * Keep a click anchor when the selection hops to a *different* image without a
 * fresh pointerdown (keyboard / programmatic). First select always keeps the
 * pointerdown coords — NodeView work can easily exceed a tight window.
 */
const CLICK_ANCHOR_MAX_AGE_MS = 500;

/**
 * Formie/Vizy 3 image chip: Image Editor · Edit · Delete.
 *
 * Anchor follows the click on large images (relative coords inside the media),
 * not the geometric center of the full node box.
 */
@customElement('vizy-image-bubble')
export class VizyImageBubbleElement extends LitElement {
    @property({ attribute: false })
    accessor editor: Editor | null = null;

    @property({ attribute: false })
    accessor imageAuthoring: VizyImageAuthoringConfig = {};

    @property({ type: Boolean, reflect: true })
    accessor visible = false;

    #popup: PkPopupEl | null = null;
    #boundDom: HTMLElement | null = null;
    #selectedPos: number | null = null;
    /** 0–1 position inside the image media where the user last clicked. */
    #clickRel: { x: number; y: number } | null = null;
    /** Absolute client point for this gesture — survives media layout shifts. */
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
        /* Match pk-tiptap-editor link-bubble__action — fade text, not fill bg. */
        .action:hover { color: rgb(255 255 255 / 0.7); }
        .action:disabled { opacity: 0.45; cursor: default; }
        .action:disabled:hover { color: #fff; }
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

    /** Show the chip for the current image NodeSelection. */
    syncToImage(): void {
        const editor = this.editor;
        if (!editor) return;
        this.#bindEditorDom();

        const pos = selectedImagePos(editor);
        if (pos !== this.#selectedPos) {
            const prev = this.#selectedPos;
            this.#selectedPos = pos;
            // Drop click only when hopping images without a fresh pointerdown.
            // First select (prev null) must keep #clickRel even if NodeViews lag.
            if (prev !== null && Date.now() - this.#clickAt > CLICK_ANCHOR_MAX_AGE_MS) {
                this.#clickRel = null;
            }
        }

        this.#rectSource.contextElement = editor.view.dom;
        this.#ensurePopup();
        const wasActive = Boolean(this.#popup?.active);
        const hasClickAnchor = this.#clickRel !== null || this.#clickClient !== null;
        this.visible = true;
        // Wait for Lit to paint the panel before activating pk-popup. Always
        // reposition when we have a click anchor so settle cannot stick on the
        // top-center fallback from an earlier measure.
        void this.updateComplete.then(() => {
            if (!this.#popup || !this.visible) return;
            this.#popup.active = true;
            if (wasActive || hasClickAnchor) this.#popup.reposition();
        });
    }

    /**
     * Hide the chip. Pass `{ clearAnchor: true }` when the image is no longer
     * selected — blur mid-select must *not* clear the pointer, or the follow-up
     * sync lands at top-center.
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
        const preview = this.#currentPreview();
        return html`
            <div class="panel" role="toolbar" aria-label="Image actions">
                <button
                    type="button"
                    class="action"
                    ?disabled=${!preview?.assetId}
                    @mousedown=${(event: MouseEvent) => event.preventDefault()}
                    @click=${this.#onImageEditor}
                >Image Editor</button>
                <span class="divider" aria-hidden="true"></span>
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

    #currentPreview() {
        const editor = this.editor;
        if (!editor?.isActive('image')) return null;
        const assetUid = String(editor.getAttributes('image').assetUid ?? '');
        return assetUid ? getImagePreview(assetUid) : null;
    }

    #onEdit = (): void => {
        const editor = this.editor;
        if (!editor) return;
        const seed = seedImageDialogFromSelection(editor);
        if (!seed) return;
        this.hide({ clearAnchor: true });
        void openVizyImageDialog(editor, seed, {
            focus: true,
            transforms: this.imageAuthoring.transforms ?? [],
        });
    };

    #onDelete = (): void => {
        const editor = this.editor;
        if (!editor) return;
        deleteSelectedImage(editor, { focus: true });
        this.hide({ clearAnchor: true });
    };

    #onImageEditor = (): void => {
        const editor = this.editor;
        const preview = this.#currentPreview();
        if (!editor || !preview?.assetId) return;

        const Craft = window.Craft as Window['Craft'] & {
            AssetImageEditor?: new (assetId: number, settings: Record<string, unknown>) => unknown;
            isImagick?: boolean;
        };
        if (typeof Craft?.AssetImageEditor !== 'function') return;

        const assetUid = String(editor.getAttributes('image').assetUid ?? '');
        new Craft.AssetImageEditor(preview.assetId, {
            allowSavingAsNew: false,
            allowDegreeFractions: Craft.isImagick,
            onSave: async () => {
                if (!assetUid) return;
                await refreshImagePreview(assetUid);
            },
        });
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
     * Capture click location inside the image media so the bubble can sit near
     * the pointer on tall/wide assets (not mid-box of the whole figure).
     *
     * Also hold synthetic field focus through the gesture: Chromium often blurs
     * the contenteditable on mouseup when the target is a non-editable atom,
     * which flickered the Craft field ring + selection outline (large flash).
     */
    #onEditorPointerDown = (event: PointerEvent): void => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const figure = target.closest('.vizy-image');
        if (!figure || !this.#boundDom?.contains(figure)) return;

        const media = figure.querySelector('img') ?? figure;
        const rect = media.getBoundingClientRect();
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

        // After PM processes this gesture (mousedown selects the atom). Covers
        // first select and re-click when selectionUpdate does not re-fire.
        requestAnimationFrame(() => {
            if (!editor || editor.isDestroyed) return;
            if (!isImageNodeSelected(editor)) return;
            this.syncToImage();
        });
    };

    /**
     * Small box at the click (or top-center fallback) — avoid a 0×0 point so
     * Floating UI flip/shift has a stable reference on first measure.
     */
    #anchorRect(): DOMRect {
        const size = 24;

        // Prefer the live client point from this gesture — matches the cursor
        // even when blur briefly dismissed the chip before re-sync.
        if (this.#clickClient && Date.now() - this.#clickAt <= CLICK_ANCHOR_MAX_AGE_MS) {
            return new DOMRect(
                this.#clickClient.x - size / 2,
                this.#clickClient.y - size / 2,
                size,
                size,
            );
        }

        const bounds = selectedImageMediaRect(this.editor);
        if (!bounds) return new DOMRect();

        if (this.#clickRel) {
            const cx = bounds.left + this.#clickRel.x * bounds.width;
            const cy = bounds.top + this.#clickRel.y * bounds.height;
            return new DOMRect(cx - size / 2, cy - size / 2, size, size);
        }

        // No click yet (keyboard select) — top-center of the media.
        return new DOMRect(bounds.left + bounds.width / 2 - size / 2, bounds.top, size, size);
    }

    #ensurePopup(): void {
        if (this.#popup) return;
        const popup = document.createElement('pk-popup') as PkPopupEl;
        popup.className = 'vizy-image-bubble-popup';
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

/** Doc position of the selected image node, or null. */
export function selectedImagePos(editor: Editor | null): number | null {
    if (!editor) return null;
    const { selection } = editor.state;
    if (selection instanceof NodeSelection && selection.node.type.name === 'image') {
        return selection.from;
    }
    if (!editor.isActive('image')) return null;
    const $from = selection.$from;
    for (let depth = $from.depth; depth >= 0; depth--) {
        if ($from.node(depth).type.name === 'image') {
            return depth === 0 ? 0 : $from.before(depth);
        }
    }
    return null;
}

/** Client rect of the image media (`img` preferred over the figure wrapper). */
export function selectedImageMediaRect(editor: Editor | null): DOMRect | null {
    const pos = selectedImagePos(editor);
    if (pos == null || !editor) return null;
    const dom = editor.view.nodeDOM(pos);
    if (!(dom instanceof HTMLElement)) return null;
    const media = dom.matches('img') ? dom : (dom.querySelector('img') ?? dom);
    return media.getBoundingClientRect();
}

/** True when the current selection is an image node (NodeSelection or active). */
export function isImageNodeSelected(editor: Editor): boolean {
    const { selection } = editor.state;
    if (selection instanceof NodeSelection && selection.node.type.name === 'image') {
        return true;
    }
    return editor.isActive('image');
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-image-bubble': VizyImageBubbleElement;
    }
}
