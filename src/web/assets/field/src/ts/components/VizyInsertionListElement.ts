import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@verbb/plugin-kit-web/components/toggle/pk-toggle.js';
import '@verbb/plugin-kit-web/components/toggle-group/pk-toggle-group.js';
import { BLOCK_TYPE_FALLBACK_ICON } from '../../../../shared/block-type-icon';
import type { AvailableInsertion } from '../insertion/types';
import type { BlockInsertView } from '../insertion/insert-view-storage';

/** Plugin Kit icon names used when the manifest has no SVG yet (tests / missing block icons). */
const NODE_PK_ICON: Record<string, string> = {
    paragraph: 'paragraph',
    heading: 'heading',
    bulletList: 'list-ul',
    orderedList: 'list-ol',
    blockquote: 'quote-right',
    codeBlock: 'code',
    hardBreak: 'file-dashed-line',
    horizontalRule: 'minus',
    image: 'eye',
    table: 'table',
};

@customElement('vizy-insertion-list')
export class VizyInsertionListElement extends LitElement {
    @property({ attribute: false }) accessor items: readonly AvailableInsertion[] = [];
    @property({ attribute: 'active-id' }) accessor activeId: string | null = null;
    @property() accessor query = '';
    @property({ attribute: 'list-id' }) accessor listId = 'vizy-insertion-list';
    /** Gutter `+` / blank-line `/` / Add Block show in-panel Search…; autofocus. */
    @property({ type: Boolean }) accessor filterable = true;
    /**
     * Match pk-combobox `autoHighlight=false`: paint the active option only after
     * ArrowUp/Down (or pointer highlight). Enter ignores a latent id until this
     * is true.
     */
    @property({ type: Boolean, attribute: 'reveal-active' }) accessor revealActive = false;
    /** List/grid toggle (Add Block header). Default on — slash can jump to grid dialog. */
    @property({ type: Boolean, attribute: 'show-view-toggle' }) accessor showViewToggle = true;
    /** Current preferred view — list is this panel; grid opens `pk-dialog`. */
    @property() accessor view: BlockInsertView = 'list';
    /** Hover/keyboard preview image (docked card beside the list). */
    @state() accessor previewUrl: string | null = null;

    static styles = css`
        /*
         * Panel UI matches Plugin Kit pk-dropdown-menu (size sm triggers in
         * the field toolbar): no CSS border — the 1px ring is inside
         * --pk-shadow-popup — and the same scale+fade enter/exit. Keeps the
         * filterable insertion palette visually identical to Formatting /
         * Alignment while staying on pk-popup + this list (role map).
         */
        :host {
            display: flex;
            flex-direction: column;
            position: relative;
            /* ~set-picker width: ~288px reference → slightly tighter at 280px. */
            width: 17.5rem;
            min-width: 17.5rem;
            max-width: 17.5rem;
            max-height: 20rem;
            /* Clip here; options scroll in .scroll-body so the bar never uses sticky
             * (momentum on trackpad/phone can detach sticky mid-inertia). */
            overflow: hidden;
            margin: 0;
            padding: 4px 0;
            border: 0;
            border-radius: var(--pk-radius-md, 4px);
            background: var(--pk-color-white, #fff);
            box-shadow: var(
                --pk-shadow-popup,
                0 0 0 1px rgba(31, 41, 51, 0.1),
                0 5px 20px rgba(31, 41, 51, 0.25)
            );
            font: inherit;
            color: var(--text-color, var(--pk-color-gray-700, #3f4d5a));
            z-index: 100;
            transform-origin: var(--pk-transform-origin, top);
        }
        /*
         * Hold opacity at 0 until data-open — pk-popup flips visibility as soon
         * as .positioned lands, one frame before we can start enter motion.
         * Without this gate the panel flashes solid then re-animates from 0.
         * Exit uses named hide keyframes (not reverse) so cancelling enter does
         * not fire the same animationend close() treats as hide-complete.
         */
        :host(:not([data-open]):not(.closing)) {
            opacity: 0;
            pointer-events: none;
        }
        :host([data-open]:not(.closing)) {
            opacity: 1;
            pointer-events: auto;
            animation: vizy-insertion-menu-show 100ms ease;
        }
        /* Hard line-switch: show at rest, no enter replay. */
        :host([data-open][data-instant]:not(.closing)) {
            animation: none;
        }
        :host(.closing) {
            animation: vizy-insertion-menu-hide 100ms ease forwards;
        }
        @keyframes vizy-insertion-menu-show {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        @keyframes vizy-insertion-menu-hide {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.9);
            }
        }
        .search-row {
            flex: 0 0 auto;
            display: flex;
            gap: 0.35rem;
            align-items: center;
            padding: 0 4px 4px;
            background: var(--pk-color-white, #fff);
            border-bottom: 1px solid var(--pk-color-gray-100, #e4edf6);
        }
        .scroll-body {
            flex: 1 1 auto;
            min-height: 0;
            overflow: auto;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
        }
        .search-row .filter {
            flex: 1 1 auto;
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 0.2rem;
            padding: 0 0.3rem;
            border: 1px solid transparent;
            border-radius: var(--pk-input-border-radius, 4px);
            background: transparent;
            transition: border-color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }
        .search-row .filter pk-icon {
            flex: 0 0 auto;
            display: block;
            width: 0.875rem;
            height: 0.875rem;
            font-size: 0.875rem;
            color: var(--pk-color-gray-400, #9aa5b1);
            pointer-events: none;
        }
        /* Borderless resting field — outline only paints on focus. */
        .search-row .filter input[type='search'] {
            display: block;
            box-sizing: border-box;
            flex: 1 1 auto;
            width: 100%;
            min-width: 0;
            margin: 0;
            padding: 5px 2px;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: var(--pk-color-gray-700, #3f4d5a);
            font: inherit;
            font-size: 0.8125rem;
            line-height: 1.4;
            outline: none;
            appearance: none;
        }
        .search-row .filter input[type='search']::-webkit-search-decoration,
        .search-row .filter input[type='search']::-webkit-search-cancel-button {
            appearance: none;
        }
        .search-row .filter input[type='search']::placeholder {
            color: var(--pk-color-gray-400, #9aa5b1);
        }
        .search-row .filter:focus-within {
            border-color: var(--pk-color-sky-600, #0284c7);
            box-shadow: var(--pk-input-focus-shadow, 0 0 0 1px var(--pk-color-sky-600, #0284c7));
            background: var(--pk-color-white, #fff);
        }
        .view-toggle {
            flex: 0 0 auto;
            align-self: stretch;
            display: inline-flex;
            align-items: stretch;
        }
        /* Same height as the Search field beside it. */
        .view-toggle pk-toggle::part(base) {
            box-sizing: border-box;
            height: var(--pk-btn-height-default, 2.125rem);
            min-height: var(--pk-btn-height-default, 2.125rem);
            min-width: var(--pk-btn-height-default, 2.125rem);
        }
        .view-toggle pk-icon {
            display: block;
            width: 0.875rem;
            height: 0.875rem;
            font-size: 0.875rem;
        }
        [part=status] {
            padding: 0.5rem 0.625rem;
            color: var(--pk-color-gray-550, #596673);
            font-size: 0.8125rem;
        }
        .group-label {
            padding: 0 0.5rem;
            font-size: 0.6rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: var(--pk-color-gray-550, #596673);
        }
        ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        li { margin: 0; }
        button.option {
            display: flex;
            width: 100%;
            gap: 0.5rem;
            align-items: center;
            border: 0;
            background: transparent;
            color: inherit;
            text-align: left;
            padding: 0.35rem 0.5rem;
            cursor: pointer;
            font: inherit;
            font-size: 0.8125rem;
            line-height: 1.35;
        }
        /* pk-combobox option highlight token — not Vizy panel blue wash. */
        button.option:hover,
        button.option:focus-visible,
        button.option[data-active='true'] {
            background: var(--pk-color-slate-100, rgba(96, 125, 159, 0.1));
            outline: none;
        }
        .glyph {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.125rem;
            height: 1.125rem;
            color: var(--vizy-block-accent-color, var(--pk-color-gray-550, #596673));
            font-size: 0.875rem;
            font-weight: 600;
            line-height: 1;
        }
        .glyph pk-icon,
        .glyph svg {
            display: block;
            width: 1em;
            height: 1em;
            font-size: 1em;
            fill: currentColor;
        }
        .label { font-weight: 500; min-width: 0; }
        .hover-preview {
            position: fixed;
            z-index: 1000;
            width: min(16rem, 40vw);
            max-height: 12rem;
            padding: 0.35rem;
            border-radius: var(--pk-radius-md, 4px);
            background: var(--pk-color-white, #fff);
            box-shadow: var(
                --pk-shadow-popup,
                0 0 0 1px rgba(31, 41, 51, 0.1),
                0 5px 20px rgba(31, 41, 51, 0.25)
            );
            pointer-events: none;
        }
        .hover-preview img {
            display: block;
            width: 100%;
            max-height: 11rem;
            object-fit: contain;
            border-radius: 2px;
        }
        .visually-hidden {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;

    /**
     * Focus the search field once Lit has painted it.
     * Combobox popup-mode uses `focus({ preventScroll: true })` the same way.
     */
    focusFilter(): boolean {
        const input = this.shadowRoot?.querySelector<HTMLInputElement>('input[type="search"]');
        if (!input) return false;
        // Browsers refuse focus while visibility:hidden (pk-popup pre-position).
        if (getComputedStyle(input).visibility === 'hidden') return false;
        input.focus({ preventScroll: true });
        return this.shadowRoot?.activeElement === input || document.activeElement === this;
    }

    /**
     * Wait until the panel is actually showable, then focus search.
     * `pk-popup` keeps slotted content `visibility: hidden` until Floating UI
     * adds `.positioned` — focusing before that is a no-op.
     */
    async focusFilterWhenReady(): Promise<void> {
        await this.updateComplete;
        await this.#waitUntilSearchVisible(2000);
        if (this.focusFilter()) return;
        // One more frame after position settles.
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        this.focusFilter();
    }

    #waitUntilSearchVisible(timeoutMs: number): Promise<void> {
        return new Promise((resolve) => {
            const started = performance.now();
            const tick = (): void => {
                const input = this.shadowRoot?.querySelector<HTMLInputElement>('input[type="search"]');
                if (input && getComputedStyle(input).visibility !== 'hidden') {
                    resolve();
                    return;
                }
                if (performance.now() - started >= timeoutMs) {
                    resolve();
                    return;
                }
                requestAnimationFrame(tick);
            };
            tick();
        });
    }

    render() {
        const groups = this.#grouped();
        const showSearchRow = this.filterable || this.showViewToggle;
        return html`
            ${showSearchRow ? html`
                <div class="search-row">
                    ${this.filterable ? html`
                        <div class="filter">
                            <pk-icon icon="magnifying-glass" label=""></pk-icon>
                            <input
                                type="search"
                                placeholder="Search…"
                                .value=${this.query}
                                aria-label="Search Blocks"
                                @input=${this.#onFilter}
                                @keydown=${this.#onFilterKey}
                            />
                        </div>
                    ` : nothing}
                    ${this.showViewToggle ? html`
                        <pk-toggle-group
                            class="view-toggle"
                            variant="outline"
                            spacing="0"
                            aria-label="View"
                            .value=${[this.view]}
                            @mousedown=${(event: Event) => event.preventDefault()}
                            @pk-value-change=${this.#onViewToggle}
                        >
                            <pk-toggle data-value="list" aria-label="List view">
                                <pk-icon icon="list" label=""></pk-icon>
                            </pk-toggle>
                            <pk-toggle data-value="grid" aria-label="Grid view">
                                <pk-icon icon="grid-2" label=""></pk-icon>
                            </pk-toggle>
                        </pk-toggle-group>
                    ` : nothing}
                </div>
            ` : nothing}
            <div class="scroll-body">
                ${!this.items.length ? html`
                    <div part="status" role="status" aria-live="polite">
                        ${this.query ? `No results for “${this.query}”` : 'No insertions available'}
                    </div>
                ` : html`
                    <div part="status" class="visually-hidden" aria-live="polite">
                        ${this.items.length} result${this.items.length === 1 ? '' : 's'}
                    </div>
                    ${groups.map(([group, entries]) => html`
                        <div class="group-label">${group}</div>
                        <ul part="list" role="listbox" id=${this.listId} aria-label=${group}>
                            ${entries.map((entry) => html`
                                <li role="presentation">
                                    <button
                                        type="button"
                                        class="option"
                                        role="option"
                                        id=${`${this.listId}-${entry.item.id}`}
                                        aria-selected=${String(this.revealActive && entry.item.id === this.activeId)}
                                        data-active=${this.revealActive && entry.item.id === this.activeId ? 'true' : 'false'}
                                        @mousedown=${(event: Event) => event.preventDefault()}
                                        @mouseenter=${() => this.#preview(entry)}
                                        @focus=${() => this.#preview(entry)}
                                        @mouseleave=${() => { this.previewUrl = null; }}
                                        @click=${() => this.#select(entry.item.id)}
                                    >
                                        <span
                                            class="glyph"
                                            aria-hidden="true"
                                            style=${entry.item.icon?.color
                                                ? `--vizy-block-accent-color: ${entry.item.icon.color}`
                                                : ''}
                                        >${this.#glyph(entry)}</span>
                                        <span class="label">${entry.item.label}</span>
                                    </button>
                                </li>
                            `)}
                        </ul>
                    `)}
                `}
            </div>
            ${this.previewUrl ? html`
                <div class="hover-preview" style=${this.#previewStyle()} aria-hidden="true">
                    <img src=${this.previewUrl} alt="" />
                </div>
            ` : nothing}
        `;
    }

    #grouped(): Array<[string, AvailableInsertion[]]> {
        const map = new Map<string, AvailableInsertion[]>();
        for (const entry of this.items) {
            const group = entry.item.group || 'Other';
            const list = map.get(group) ?? [];
            list.push(entry);
            map.set(group, list);
        }
        return [...map.entries()];
    }

    #glyph(entry: AvailableInsertion) {
        if (entry.item.kind === 'block') {
            return this.#blockGlyph(entry);
        }

        const svg = entry.item.icon?.svg?.trim();
        if (svg) {
            return unsafeHTML(svg);
        }
        const pk = this.#pkIconName(entry);
        if (pk) {
            return html`<pk-icon icon=${pk} label=""></pk-icon>`;
        }
        const label = entry.item.label.trim();
        if (!label) return '?';
        if (entry.item.nodeName === 'heading') return 'H';
        if (entry.item.nodeName === 'bulletList') return '•';
        if (entry.item.nodeName === 'orderedList') return '1';
        return label.slice(0, 1).toUpperCase();
    }

    #blockGlyph(entry: AvailableInsertion) {
        const svg = entry.item.icon?.svg?.trim();
        const name = entry.item.icon?.name?.trim();
        if (svg && name !== BLOCK_TYPE_FALLBACK_ICON) {
            return unsafeHTML(svg);
        }
        return html`<pk-icon icon=${BLOCK_TYPE_FALLBACK_ICON} label=""></pk-icon>`;
    }

    #pkIconName(entry: AvailableInsertion): string | null {
        if (entry.item.nodeName && NODE_PK_ICON[entry.item.nodeName]) {
            return NODE_PK_ICON[entry.item.nodeName];
        }
        const name = entry.item.icon?.name?.trim();
        return name || null;
    }

    #preview(entry: AvailableInsertion): void {
        const url = entry.item.previewImageUrl?.trim();
        this.previewUrl = url || null;
    }

    #previewStyle(): string {
        const rect = this.getBoundingClientRect();
        const left = Math.min(rect.right + 8, window.innerWidth - 16 - 256);
        const top = Math.max(8, Math.min(rect.top, window.innerHeight - 200));
        return `left:${Math.max(8, left)}px;top:${top}px;`;
    }

    #setView(view: BlockInsertView): void {
        if (view === this.view && view === 'list') return;
        this.view = view;
        this.dispatchEvent(new CustomEvent('vizy-insertion-view', {
            bubbles: true,
            composed: true,
            detail: { view },
        }));
    }

    /** Exclusive list/grid — ignore empty (toggle-group allows clearing single). */
    #onViewToggle = (event: CustomEvent<{ value?: string[] }>): void => {
        const next = event.detail?.value?.[0];
        if (next === 'list' || next === 'grid') {
            this.#setView(next);
            return;
        }
        const group = event.currentTarget as HTMLElement & { value: string[] };
        group.value = [this.view];
    };

    #onFilter = (event: Event): void => {
        const value = (event.target as HTMLInputElement).value;
        this.query = value;
        this.dispatchEvent(new CustomEvent('vizy-insertion-filter', {
            bubbles: true,
            composed: true,
            detail: { query: value },
        }));
    };

    #onFilterKey = (event: KeyboardEvent): void => {
        // Keep arrow/enter handling on the document listener in the popover.
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
            event.stopPropagation();
        }
    };

    #select(id: string): void {
        this.dispatchEvent(new CustomEvent('vizy-insertion-select', {
            bubbles: true,
            composed: true,
            detail: { id },
        }));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-insertion-list': VizyInsertionListElement;
    }
}
