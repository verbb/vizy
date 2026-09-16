import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@verbb/plugin-kit-web/components/input/pk-input.js';
import '@verbb/plugin-kit-web/components/tabs/pk-tabs.js';
import '@verbb/plugin-kit-web/components/tabs/pk-tab.js';
import '@verbb/plugin-kit-web/components/tabs/pk-tab-panel.js';
import '@verbb/plugin-kit-web/components/toggle/pk-toggle.js';
import '@verbb/plugin-kit-web/components/toggle-group/pk-toggle-group.js';
import { BLOCK_TYPE_FALLBACK_ICON } from '../../../../shared/block-type-icon';
import type { AvailableInsertion } from '../insertion/types';
import type { BlockInsertView } from '../insertion/insert-view-storage';
import { ensurePkDialog } from '../pk-dialog';

type PkDialogEl = HTMLElement & {
    open: boolean;
    label: string;
    size?: string;
    withoutBodyPadding?: boolean;
};

/**
 * Blocks-only Add Block grid — Plugin Kit `pk-dialog` with All + group tabs.
 * List mode stays on `vizy-insertion-list` / `pk-popup`; this is the browse surface.
 */
@customElement('vizy-block-browse-dialog')
export class VizyBlockBrowseDialogElement extends LitElement {
    @property({ attribute: false }) accessor items: readonly AvailableInsertion[] = [];
    @property() accessor query = '';
    @property() accessor view: BlockInsertView = 'grid';
    @property({ attribute: 'active-tab' }) accessor activeTab = 'all';
    @state() accessor activeId: string | null = null;

    static styles = css`
        :host {
            display: contents;
            font: inherit;
            color: var(--pk-color-gray-700, #3f4d5a);
        }
        /* Own insets: dialog uses without-body-padding so tabs can go edge-flush. */
        .dialog-bar {
            display: flex;
            flex-direction: column;
            gap: 0;
            min-height: 0;
        }
        .toolbar {
            display: flex;
            flex-shrink: 0;
            gap: 0.5rem;
            align-items: stretch;
            padding: 0.75rem 1rem 0.2rem;
        }
        .toolbar pk-input {
            flex: 1 1 auto;
            min-width: 0;
        }
        .toolbar pk-input::part(start) {
            color: var(--pk-color-gray-400, #9aa5b1);
        }
        .view-toggle {
            flex: 0 0 auto;
            align-self: stretch;
            display: inline-flex;
            align-items: stretch;
        }
        /* Match stock pk-input height (sm toggles sit shorter than the field). */
        .view-toggle pk-toggle::part(base) {
            box-sizing: border-box;
            height: var(--pk-btn-height-default, 2.125rem);
            min-height: var(--pk-btn-height-default, 2.125rem);
            min-width: var(--pk-btn-height-default, 2.125rem);
        }
        .view-toggle pk-icon {
            width: 0.9rem;
            height: 0.9rem;
            font-size: 0.9rem;
        }
        /*
         * Modal tabs flush under the search strip: no root gap, no panel inset,
         * full-bleed list. Grid scrolls; toolbar + tab list stay put.
         */
        pk-tabs.browse-tabs {
            flex: 1 1 auto;
            min-height: 0;
            height: auto;
            --pk-tabs-root-height: auto;
            --pk-tabs-root-gap: 0;
            --pk-tabs-root-overflow: visible;
            --pk-tabs-panel-flex: none;
            --pk-tabs-panel-min-height: 0;
            --pk-tabs-panel-padding: 0;
            --pk-tabs-panel-bg: transparent;
            --pk-tabs-panel-radius: 0;
            --pk-tabs-list-shadow: 0 0 #0000;
        }
        /* Four-up cards — large enough for preview images, equal column share. */
        .grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.5rem;
            max-height: min(28rem, 55vh);
            overflow: auto;
            padding: 0.75rem 0.75rem 1rem;
            box-sizing: border-box;
        }
        .card {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            align-items: stretch;
            min-width: 0;
            border: 0;
            border-radius: 4px;
            background: transparent;
            padding: 0.5rem;
            cursor: pointer;
            font: inherit;
            text-align: center;
            color: inherit;
        }
        .card:hover,
        .card:focus-visible,
        .card[data-active='true'] {
            background: var(--pk-color-slate-100, rgba(96, 125, 159, 0.1));
            outline: none;
        }
        /* Shared preview well — icons and images share the same footprint. */
        .card .thumb {
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 4 / 3;
            width: 100%;
            border-radius: 3px;
            background: transparent;
            border: 0;
            overflow: hidden;
            color: var(--vizy-block-accent-color, var(--pk-color-gray-550, #596673));
        }
        .card .thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .card .thumb pk-icon,
        .card .thumb svg {
            width: 2rem;
            height: 2rem;
            font-size: 2rem;
            fill: currentColor;
        }
        .card .label {
            font-size: 0.8125rem;
            font-weight: 500;
            line-height: 1.3;
            text-align: center;
            overflow-wrap: anywhere;
        }
        .empty {
            padding: 1.5rem 1rem;
            color: var(--pk-color-gray-550, #596673);
            font-size: 0.875rem;
            text-align: center;
        }
    `;

    #dialog: PkDialogEl | null = null;
    #onSelect: ((id: string) => void) | null = null;
    #onView: ((view: BlockInsertView) => void) | null = null;
    #onClose: (() => void) | null = null;

    open(options: {
        items: readonly AvailableInsertion[];
        query?: string;
        onSelect: (id: string) => void;
        onView: (view: BlockInsertView) => void;
        onClose?: () => void;
    }): void {
        this.items = options.items;
        this.query = options.query ?? '';
        this.view = 'grid';
        this.activeTab = 'all';
        this.activeId = null;
        this.#onSelect = options.onSelect;
        this.#onView = options.onView;
        this.#onClose = options.onClose ?? null;
        void this.#mountOpen();
    }

    async #mountOpen(): Promise<void> {
        await ensurePkDialog();
        // pk-dialog focuses light-DOM [autofocus], then a shadow input/textarea/select/button.
        this.setAttribute('autofocus', '');
        this.#ensureDialog();
        // Paint the search field before showModal’s rAF focus pass.
        await this.updateComplete;
        if (this.#dialog) {
            this.#dialog.open = true;
        }
        // Belt-and-suspenders if the dialog focus pass ran before the input existed.
        await this.updateComplete;
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        this.focusFilter();
    }

    /** Focus the in-dialog Search field (Add Block grid). */
    focusFilter(): boolean {
        const field = this.shadowRoot?.querySelector('pk-input');
        const input = field?.shadowRoot?.querySelector<HTMLInputElement>('input')
            ?? this.shadowRoot?.querySelector<HTMLInputElement>('input[type="search"]');
        if (!input) return false;
        input.focus({ preventScroll: true });
        return Boolean(field?.shadowRoot?.activeElement === input
            || this.shadowRoot?.activeElement === field
            || document.activeElement === field
            || document.activeElement === this);
    }

    close(): void {
        // `pk-open-change` clears handlers once the dialog reports closed.
        if (this.#dialog) {
            this.#dialog.open = false;
        }
    }

    get isOpen(): boolean {
        return Boolean(this.#dialog?.open);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#dialog?.remove();
        this.#dialog = null;
    }

    #ensureDialog(): void {
        if (this.#dialog) return;
        const dialog = document.createElement('pk-dialog') as PkDialogEl;
        dialog.label = 'Add Block';
        dialog.size = 'wide';
        // Flush body so tabs sit edge-to-edge; search strip owns its own padding.
        dialog.withoutBodyPadding = true;
        dialog.append(this);
        dialog.addEventListener('pk-open-change', ((event: CustomEvent<{ open?: boolean }>) => {
            if (event.detail?.open === false) {
                this.#onClose?.();
                this.#onClose = null;
                this.#onSelect = null;
                this.#onView = null;
            }
        }) as EventListener);
        document.body.append(dialog);
        this.#dialog = dialog;
    }

    render() {
        const tabs = this.#tabs();
        const showTabs = tabs.length > 1;
        return html`
            <div class="dialog-bar">
                <div class="toolbar">
                    <pk-input
                        type="search"
                        placeholder="Search Blocks…"
                        .value=${this.query}
                        aria-label="Search Blocks"
                        @input=${this.#onFilter}
                    >
                        <pk-icon slot="start" icon="magnifying-glass" label=""></pk-icon>
                    </pk-input>
                    <pk-toggle-group
                        class="view-toggle"
                        variant="outline"
                        spacing="0"
                        aria-label="View"
                        .value=${[this.view]}
                        @pk-value-change=${this.#onViewToggle}
                    >
                        <pk-toggle data-value="list" aria-label="List view">
                            <pk-icon icon="list" label=""></pk-icon>
                        </pk-toggle>
                        <pk-toggle data-value="grid" aria-label="Grid view">
                            <pk-icon icon="grid-2" label=""></pk-icon>
                        </pk-toggle>
                    </pk-toggle-group>
                </div>
                ${showTabs ? html`
                    <pk-tabs
                        class="browse-tabs"
                        variant="modal"
                        .value=${this.activeTab}
                        aria-label="Block groups"
                        @pk-change=${this.#onTabChange}
                    >
                        ${tabs.map((tab) => html`
                            <pk-tab slot="nav" value=${tab.id}>${tab.label}</pk-tab>
                        `)}
                        ${tabs.map((tab) => html`
                            <pk-tab-panel value=${tab.id}>
                                ${this.#panelBody(tab.id)}
                            </pk-tab-panel>
                        `)}
                    </pk-tabs>
                ` : this.#panelBody('all')}
            </div>
        `;
    }

    #panelBody(tabId: string) {
        const filtered = this.#filtered(tabId);
        if (!filtered.length) {
            return html`<div class="empty">${this.query ? 'No matching Blocks.' : 'No Blocks available.'}</div>`;
        }
        return html`
            <div
                class="grid"
                role="listbox"
                aria-label="Blocks"
                @mouseleave=${() => { this.activeId = null; }}
            >
                ${filtered.map((entry) => this.#card(entry))}
            </div>
        `;
    }

    #tabs(): Array<{ id: string; label: string }> {
        const groups = new Set<string>();
        for (const entry of this.items) {
            if (entry.item.group) groups.add(entry.item.group);
        }
        const tabs = [{ id: 'all', label: 'All' }];
        for (const name of [...groups].sort((a, b) => a.localeCompare(b))) {
            tabs.push({ id: name, label: name });
        }
        return tabs;
    }

    #filtered(tabId: string = this.activeTab): AvailableInsertion[] {
        const q = this.query.trim().toLowerCase();
        return this.items.filter((entry) => {
            if (tabId !== 'all' && entry.item.group !== tabId) {
                return false;
            }
            if (!q) return true;
            const hay = [
                entry.item.label,
                entry.item.group,
                ...entry.item.keywords,
                ...entry.item.aliases,
            ].join(' ').toLowerCase();
            return hay.includes(q);
        });
    }

    #card(entry: AvailableInsertion) {
        const id = entry.item.id;
        const url = entry.item.previewImageUrl?.trim();
        return html`
            <button
                type="button"
                class="card"
                role="option"
                data-active=${this.activeId === id ? 'true' : 'false'}
                aria-selected=${String(this.activeId === id)}
                @mouseenter=${() => { this.activeId = id; }}
                @focus=${() => { this.activeId = id; }}
                @blur=${() => {
                    if (this.activeId === id) this.activeId = null;
                }}
                @click=${() => this.#select(id)}
            >
                <div
                    class="thumb"
                    style=${entry.item.icon?.color
                        ? `--vizy-block-accent-color: ${entry.item.icon.color}`
                        : ''}
                >${url
                    ? html`<img src=${url} alt="" />`
                    : this.#glyph(entry)}</div>
                <span class="label">${entry.item.label}</span>
            </button>
        `;
    }

    #glyph(entry: AvailableInsertion) {
        const svg = entry.item.icon?.svg?.trim();
        const name = entry.item.icon?.name?.trim();
        if (svg && name !== BLOCK_TYPE_FALLBACK_ICON) {
            return unsafeHTML(svg);
        }
        return html`<pk-icon icon=${BLOCK_TYPE_FALLBACK_ICON} label=""></pk-icon>`;
    }

    #onFilter = (event: Event): void => {
        const target = event.currentTarget as HTMLElement & { value?: string };
        this.query = target.value ?? '';
    };

    #onTabChange = (event: CustomEvent<{ value?: string }>): void => {
        const next = event.detail?.value?.trim();
        if (next) this.activeTab = next;
    };

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

    #setView(view: BlockInsertView): void {
        this.view = view;
        this.#onView?.(view);
    }

    #select(id: string): void {
        this.#onSelect?.(id);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-block-browse-dialog': VizyBlockBrowseDialogElement;
    }
}
