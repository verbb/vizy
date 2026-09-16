import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Editor } from '@tiptap/core';
import '@verbb/plugin-kit-web/components/popup';
import type { ToolbarControlManifest } from '../types';
import { isActionActive, runToolbarAction } from './actions';
import { controlAppearanceStyles, controlClass, controlIcon } from './control-appearance';
import { attachToolbarTooltip } from './toolbar-tooltip';

type PkPopupVirtualElement = {
    getBoundingClientRect: () => DOMRect;
    contextElement?: Element;
};

type PkPopupEl = HTMLElement & {
    active: boolean;
    placement: string;
    distance: number;
    flip: boolean;
    flipPadding: number;
    shift: boolean;
    shiftPadding: number;
    anchorTracking: boolean;
    positionMethod?: 'fixed' | 'absolute';
    anchor: Element | string | PkPopupVirtualElement;
    reposition: () => void;
};

/** Match insertion / dropdown viewport padding. */
const BUBBLE_VIEWPORT_PAD_PX = 10;
/** Prefer above the highlight; Floating UI flips when the Craft header / viewport wins. */
const BUBBLE_DISTANCE_PX = 8;

export type BubbleSelectionAnchor = {
    getClientRect: () => DOMRect;
    contextElement?: Element;
};

/**
 * Selection formatting strip. Placement is owned by Plugin Kit `pk-popup`
 * (Floating UI flip/shift + body/fixed portal) so the panel is not clipped by
 * the editor frame or parked off-screen above a near-top selection.
 */
@customElement('vizy-bubble')
export class VizyBubbleElement extends LitElement {
    @property({ attribute: false })
    accessor controls: ToolbarControlManifest[] = [];

    @property({ attribute: false })
    accessor editor: Editor | null = null;

    @property({ type: Boolean, reflect: true })
    accessor visible = false;

    #detachTooltip: (() => void) | null = null;
    #popup: PkPopupEl | null = null;
    /**
     * Stable virtual anchor for the popup session. TipTap/editor sync swaps
     * `getClientRect` / `contextElement` without replacing `popup.anchor` —
     * a new anchor object would hide/reopen the panel.
     */
    readonly #rectSource: {
        getClientRect: (() => DOMRect) | null;
        contextElement: Element | undefined;
    } = {
        getClientRect: null,
        contextElement: undefined,
    };

    static styles = [
        controlAppearanceStyles,
        css`
            :host {
                display: none;
            }
            :host([visible]) {
                display: block;
            }
            /*
             * Compact vs the field toolbar's 32×32 / 16px. Same panel tokens;
             * a floating selection strip should not match the standing toolbar.
             */
            .vizy-control {
                width: 26px;
                height: 28px;
                font-size: 14px;
            }
            .vizy-control.has-menu {
                min-width: 26px;
            }
            /*
             * Same zero-sized anchor as the main toolbar — see VizyToolbarElement.
             * Without it, pk-tooltip's inline-block host leaves a blank band in the panel.
             */
            pk-tooltip {
                position: absolute;
                inset: 0 auto auto 0;
                width: 0;
                height: 0;
                overflow: visible;
                pointer-events: none;
            }
            .panel {
                display: flex;
                align-items: center;
                gap: 2px;
                padding: 2px 4px;
                /* Fallback required: host is portaled under body, so field
                   --vizy-border from .vizy-editor-body does not inherit. */
                border: 1px solid var(--vizy-border, var(--pk-color-gray-200, #cdd8e4));
                border-radius: 6px;
                background: var(--pk-color-white, #fff);
                box-shadow: 0 4px 16px rgb(31 41 51 / 12%);
            }
        `,
    ];

    /**
     * Show / reposition against the live selection. Prefer calling this on
     * every selectionUpdate rather than setting `visible` alone.
     */
    syncToSelection(anchor: BubbleSelectionAnchor): void {
        if (!this.controls.length) {
            this.hide();
            return;
        }
        this.#rectSource.getClientRect = anchor.getClientRect;
        this.#rectSource.contextElement = anchor.contextElement;
        this.#ensurePopup();
        this.visible = true;
        if (!this.#popup) return;
        this.#popup.active = true;
        this.#popup.reposition();
    }

    hide(): void {
        this.visible = false;
        if (this.#popup) this.#popup.active = false;
    }

    protected firstUpdated(): void {
        this.#detachTooltip = attachToolbarTooltip(this);
    }

    disconnectedCallback(): void {
        this.#detachTooltip?.();
        this.#detachTooltip = null;
        // Host lives inside pk-popup once shown. Clearing `#popup` before remove
        // avoids re-entrant teardown if removing the popup disconnects us again.
        const popup = this.#popup;
        this.#popup = null;
        if (popup?.isConnected) {
            popup.active = false;
            popup.remove();
        }
        super.disconnectedCallback();
    }

    render() {
        if (!this.visible || !this.controls.length) return null;
        return html`
            <div
                class="panel"
                role="toolbar"
                aria-label="Selection formatting"
            >
                ${this.controls.map((control) => html`
                    <button
                        type="button"
                        class=${controlClass(control)}
                        aria-label=${control.label}
                        aria-pressed=${String(this.#isActive(control))}
                        @mousedown=${(event: MouseEvent) => event.preventDefault()}
                        @click=${() => this.#activate(control)}
                    >${controlIcon(control)}</button>
                `)}
            </div>
        `;
    }

    #ensurePopup(): void {
        if (this.#popup) return;
        const popup = document.createElement('pk-popup') as PkPopupEl;
        popup.className = 'vizy-bubble-popup';
        popup.placement = 'top';
        popup.distance = BUBBLE_DISTANCE_PX;
        popup.flip = true;
        popup.flipPadding = this.#flipPaddingPx();
        popup.shift = true;
        popup.shiftPadding = BUBBLE_VIEWPORT_PAD_PX;
        popup.anchorTracking = true;
        popup.positionMethod = 'fixed';
        // Capture the stable rect bag — a getter on the literal would bind `this`
        // to the virtual element, not the bubble host.
        const rectSource = this.#rectSource;
        popup.anchor = {
            getBoundingClientRect: () => rectSource.getClientRect?.() ?? new DOMRect(),
            get contextElement() {
                return rectSource.contextElement;
            },
        };
        // Host is the panel content; pk-popup owns body-level fixed placement.
        popup.append(this);
        document.body.append(popup);
        this.#popup = popup;
    }

    /**
     * Keep flip clear of Craft's fixed entry header when `--header-height` is
     * available; otherwise fall back to the shared viewport pad.
     */
    #flipPaddingPx(): number {
        const raw = getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height')
            .trim();
        const header = Number.parseFloat(raw);
        if (!Number.isFinite(header) || header <= 0) return BUBBLE_VIEWPORT_PAD_PX;
        return Math.max(BUBBLE_VIEWPORT_PAD_PX, Math.round(header) + 8);
    }

    #isActive(control: ToolbarControlManifest): boolean {
        return this.editor ? isActionActive(this.editor, control.action, control.id) : false;
    }

    #activate(control: ToolbarControlManifest): void {
        if (!this.editor || !control.action) return;
        runToolbarAction(this.editor, control.action, { controlId: control.id });
        this.requestUpdate();
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-bubble': VizyBubbleElement;
    }
}
