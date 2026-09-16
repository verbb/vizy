import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getMarkRange, type Editor } from '@tiptap/core';
import '@verbb/plugin-kit-web/components/popup';
import {
    defaultLinkAttrs,
    linkDisplayHref,
    type SemanticLinkAttrs,
} from './attrs';
import { getSemanticLinkEditState, unsetSemanticLinkFromEditor } from './link-apply';
import { openVizyLinkDialog } from './link-dialog';

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
    arrow: boolean;
    arrowPlacement: 'start' | 'end' | 'center' | 'anchor';
    anchorTracking: boolean;
    positionMethod?: 'fixed' | 'absolute';
    anchor: Element | string | PkPopupVirtualElement;
    reposition: () => void;
};

const VIEWPORT_PAD_PX = 10;
const DISTANCE_PX = 8;

export type LinkBubbleAnchor = {
    getClientRect: () => DOMRect;
    contextElement?: Element;
};

/**
 * Formie / Plugin Kit TipTap link chip: URL preview · Edit · Unlink.
 * Placement via `pk-popup` (same portal/flip contract as the formatting bubble).
 * Shown when the caret/selection is inside a link mark — not a substitute for
 * the formatting strip.
 */
@customElement('vizy-link-bubble')
export class VizyLinkBubbleElement extends LitElement {
    @property({ attribute: false })
    accessor editor: Editor | null = null;

    @property({ type: Boolean, reflect: true })
    accessor visible = false;

    @property()
    accessor preview = '';

    @property()
    accessor previewTitle = '';

    @property({ type: Boolean })
    accessor previewIsUrl = false;

    #popup: PkPopupEl | null = null;
    readonly #rectSource: {
        getClientRect: (() => DOMRect) | null;
        contextElement: Element | undefined;
    } = {
        getClientRect: null,
        contextElement: undefined,
    };

    static styles = css`
        :host {
            display: none;
        }
        :host([visible]) {
            display: block;
        }
        .panel {
            display: flex;
            align-items: center;
            gap: 0;
            width: max-content;
            max-width: min(320px, calc(100vw - 2rem));
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
        .url,
        .action {
            box-sizing: border-box;
            padding: 6px 8px;
            font-size: 12px;
            line-height: 1.5;
            color: inherit;
            font-family: inherit;
        }
        .url {
            display: inline-flex;
            align-items: center;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
            color: #fff;
        }
        .url[href]:hover {
            text-decoration: underline;
        }
        .divider {
            flex-shrink: 0;
            align-self: center;
            width: 1px;
            height: 12px;
            background: #616d73;
        }
        .action {
            margin: 0;
            border: 0;
            border-radius: var(--pk-radius-sm, 3px);
            background: transparent;
            color: #fff;
            cursor: pointer;
            outline: none;
            transition: color 0.15s ease;
        }
        /* Match pk-tiptap-editor link-bubble__action — fade text, not fill bg. */
        .action:hover {
            color: rgb(255 255 255 / 0.7);
        }
    `;

    /**
     * Show / reposition against the active link mark range.
     * Prefer calling from selectionUpdate when `editor.isActive('link')`.
     */
    syncToLink(anchor: LinkBubbleAnchor, attrs: SemanticLinkAttrs): void {
        const label = linkBubblePreview(attrs);
        this.preview = label.text;
        this.previewTitle = label.title;
        this.previewIsUrl = label.openable;
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

    disconnectedCallback(): void {
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
            <div class="panel" role="toolbar" aria-label="Link actions">
                ${this.previewIsUrl
                    ? html`<a
                        class="url"
                        href=${this.previewTitle || this.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        title=${this.previewTitle || this.preview}
                        @mousedown=${(event: MouseEvent) => event.preventDefault()}
                    >${this.preview}</a>`
                    : html`<span class="url" title=${this.previewTitle || this.preview}>${this.preview}</span>`}
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
                    @click=${this.#onUnlink}
                >Unlink</button>
            </div>
        `;
    }

    #onEdit = (): void => {
        const editor = this.editor;
        if (!editor) return;
        const seed = getSemanticLinkEditState(editor);
        this.hide();
        void openVizyLinkDialog(editor, seed, { focus: true });
    };

    #onUnlink = (): void => {
        const editor = this.editor;
        if (!editor) return;
        unsetSemanticLinkFromEditor(editor, { focus: true });
        this.hide();
    };

    #ensurePopup(): void {
        if (this.#popup) return;
        const popup = document.createElement('pk-popup') as PkPopupEl;
        popup.className = 'vizy-link-bubble-popup';
        popup.placement = 'top';
        popup.distance = DISTANCE_PX;
        popup.flip = true;
        popup.flipPadding = this.#flipPaddingPx();
        popup.shift = true;
        popup.shiftPadding = VIEWPORT_PAD_PX;
        // Speech-bubble caret (Formie/Vizy 3); color via --pk-popup-arrow-color in vizy.css.
        popup.arrow = true;
        popup.arrowPlacement = 'center';
        popup.anchorTracking = true;
        popup.positionMethod = 'fixed';
        const rectSource = this.#rectSource;
        popup.anchor = {
            getBoundingClientRect: () => rectSource.getClientRect?.() ?? new DOMRect(),
            get contextElement() {
                return rectSource.contextElement;
            },
        };
        popup.append(this);
        document.body.append(popup);
        this.#popup = popup;
    }

    #flipPaddingPx(): number {
        const raw = getComputedStyle(document.documentElement)
            .getPropertyValue('--header-height')
            .trim();
        const header = Number.parseFloat(raw);
        if (!Number.isFinite(header) || header <= 0) return VIEWPORT_PAD_PX;
        return Math.max(VIEWPORT_PAD_PX, Math.round(header) + 8);
    }
}

/** Human preview for the chip — element links have no public URL until resolve. */
export function linkBubblePreview(attrs: SemanticLinkAttrs): {
    text: string;
    title: string;
    openable: boolean;
} {
    switch (attrs.type) {
        case 'entry':
            return { text: 'Entry', title: 'Linked entry', openable: false };
        case 'asset':
            return { text: 'Asset', title: 'Linked asset', openable: false };
        case 'category':
            return { text: 'Category', title: 'Linked category', openable: false };
        case 'email':
        case 'tel':
        case 'sms': {
            const href = linkDisplayHref(attrs);
            return { text: truncatePreview(href), title: href, openable: true };
        }
        case 'url':
        default: {
            const href = linkDisplayHref(attrs);
            return { text: truncatePreview(href), title: href, openable: href.startsWith('http') };
        }
    }
}

export function truncatePreview(value: string, max = 30): string {
    if (value.length <= max) return value;
    return `${value.slice(0, max - 1)}…`;
}

/** Active link attrs from the editor, or null when the caret is not in a link. */
export function activeLinkAttrs(editor: Editor): SemanticLinkAttrs | null {
    if (!editor.isFocused || !editor.isActive('link')) return null;
    const linkType = editor.state.schema.marks.link;
    if (!linkType) return null;
    const range = getMarkRange(editor.state.selection.$from, linkType);
    if (!range) return null;
    const raw = editor.getAttributes('link') as Record<string, unknown>;
    return defaultLinkAttrs({
        type: (raw.type as SemanticLinkAttrs['type']) ?? 'url',
        targetUid: typeof raw.targetUid === 'string' ? raw.targetUid : null,
        siteMode: raw.siteMode === 'fixed' ? 'fixed' : 'current',
        siteUid: typeof raw.siteUid === 'string' ? raw.siteUid : null,
        value: typeof raw.value === 'string' ? raw.value : null,
        suffix: typeof raw.suffix === 'string' ? raw.suffix : null,
        newWindow: raw.newWindow === true,
        title: typeof raw.title === 'string' ? raw.title : null,
        ariaLabel: typeof raw.ariaLabel === 'string' ? raw.ariaLabel : null,
        rel: Array.isArray(raw.rel) ? raw.rel.filter((item): item is string => typeof item === 'string') : [],
        class: typeof raw.class === 'string' ? raw.class : null,
        id: typeof raw.id === 'string' ? raw.id : null,
        download: raw.download === true || typeof raw.download === 'string' ? raw.download : null,
        linkUid: typeof raw.linkUid === 'string' ? raw.linkUid : null,
    });
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-link-bubble': VizyLinkBubbleElement;
    }
}
