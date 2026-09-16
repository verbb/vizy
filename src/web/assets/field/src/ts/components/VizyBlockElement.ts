import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '@verbb/plugin-kit-web/components/dropdown-menu';
import '@verbb/plugin-kit-web/components/popup';
import '@verbb/plugin-kit-web/components/status';
import type { BlockSummaryData, BlockViewState } from '../blocks/types';
import { nodeViewShellStyles } from './node-view-shell';
import { preserveEditorSelection } from '../editor-field-focus';
import { prefersReducedMotion } from '../blocks/block-insert-animation';
import {
    craftVelocityAvailable,
    MATRIX_VELOCITY_DURATION,
    velocityAnimate,
    velocityStop,
} from '../blocks/craft-velocity';

export type BlockActionEvent = CustomEvent<{ action: string; invoker?: HTMLElement }>;
export type LayoutTabChangeEvent = CustomEvent<{ index: number }>;
export type CollapseChangeEvent = CustomEvent<{ collapsed: boolean; persist: boolean }>;
/** Header control pressed — NodeView selects the Block without focusing prose. */
export type BlockHeaderActivateEvent = CustomEvent<Record<string, never>>;

@customElement('vizy-block')
export class VizyBlockElement extends LitElement {
    @property({ attribute: 'data-block-uid', reflect: true }) accessor blockUid = '';
    @property({ type: Boolean, reflect: true }) accessor selected = false;
    @property({ type: Boolean, reflect: true }) accessor enabled = true;
    /** Optional Block Type accent (`#rrggbb`) — tints the header like Matrix entry types. */
    @property({ attribute: 'accent-color', reflect: true }) accessor accentColor: string | null = null;
    /** Configured Block Type icon SVG — shown beside the type label when set (Matrix parity). */
    @property({ attribute: false }) accessor typeIconSvg: string | null = null;
    @property({ type: Boolean, reflect: true }) accessor unresolved = false;
    @property({ type: Boolean, reflect: true }) accessor disabled = false;
    @property({ type: Boolean, reflect: true }) accessor dragging = false;
    @property({ type: Number }) accessor errorCount = 0;
    @property({ type: Number }) accessor descendantErrorCount = 0;
    /** Projected content summary — collapsed header only (Vizy 3). */
    @property({ type: String }) accessor title = '';
    @property({ type: String }) accessor subtitle: string | null = null;
    /** Block Type label — always the header primary when expanded. */
    @property({ type: String }) accessor typeName = '';
    /**
     * Matrix-style ⋯ item. Personalized when only one Block type can insert
     * above this Block (`Add Card above`); otherwise `Add Block above`.
     */
    @property({ type: String }) accessor addAboveLabel = 'Add Block above';
    /** False when the schema forbids any Block insert above this position. */
    @property({ type: Boolean }) accessor canAddAbove = true;
    /** Block Type carries Craft fields — header paints; fields fill in quietly. */
    @property({ type: Boolean, reflect: true, attribute: 'expects-field-layout' })
    accessor expectsFieldLayout = false;
    /** Mirrors the host record so the header can show progress and offer retry. */
    @property({ attribute: 'field-layout', reflect: true })
    accessor fieldLayoutState: BlockViewState['fieldLayout'] = 'unmounted';
    /** Author-facing FieldLayout failure copy when `fieldLayoutState` is `error`. */
    @property({ attribute: false }) accessor fieldLayoutError: string | null = null;
    /** True while Retry is in flight — shows loading instead of a blank card. */
    @state() accessor fieldLayoutRetrying = false;
    /**
     * Craft layout tab names from the field-layout render. Shown only when there
     * are two or more — matching Hyper / Matrix nested field layouts.
     */
    @property({ attribute: false }) accessor layoutTabLabels: string[] = [];
    @state() accessor collapsed = false;
    @state() accessor menuOpen = false;
    @state() accessor menuClosing = false;
    @state() accessor activeLayoutTab = 0;

    /** Cancels an in-flight Matrix-style height fold when the user toggles mid-way. */
    #collapseMotion: AbortController | null = null;

    updated(changed: Map<string, unknown>): void {
        if (changed.has('menuOpen')) {
            this.toggleAttribute('menu-open', this.menuOpen);
        }
        if (changed.has('collapsed')) {
            this.toggleAttribute('collapsed', this.collapsed);
        }
        // New field layout → reset to the first Craft pane.
        if (changed.has('layoutTabLabels') && this.activeLayoutTab !== 0) {
            this.activeLayoutTab = 0;
        }
        if (changed.has('enabled')) {
            // Disable ≡ collapse, Enable ≡ expand (animated). Persist the fold
            // result so reload matches; enabled itself remains the document attr.
            const wasEnabled = Boolean(changed.get('enabled'));
            if (wasEnabled && !this.enabled) {
                this.#setCollapsed(true, { animate: true, persist: true });
            } else if (!wasEnabled && this.enabled) {
                this.#setCollapsed(false, { animate: true, persist: true });
            }
        }
        if (changed.has('accentColor')) {
            // Drive tint via a CSS variable so color-mix works without attr().
            // Craft FieldLayouts inside the Block read --custom-* the same way Matrix does.
            if (this.accentColor) {
                this.style.setProperty('--vizy-block-accent-color', this.accentColor);
            } else {
                this.style.removeProperty('--vizy-block-accent-color');
                for (const name of [
                    '--custom-bg-color',
                    '--custom-titlebar-bg-color',
                    '--custom-border-color',
                    '--custom-text-color',
                    '--vizy-block-label-color',
                ]) {
                    this.style.removeProperty(name);
                }
            }
        }
    }

    static styles = [nodeViewShellStyles, css`
        /*
         * Block header: cool-gray header, plain type label on the left, white body,
         * Matrix-style tab cutout, 24×24 icon actions on the right (drag last). Host
         * border lives in vizy.css.
         */
        :host {
            display: flex;
            flex-direction: column;
            position: relative;
            margin: 0.5rem 0;
            border-radius: 5px;
            background: var(--pk-color-white, #fff);
            /* Clip collapsed preview to the host radius only. Expanded Blocks
               must not clip later Content Areas / nested Cards — overflow:hidden
               was eating the bottom of multi-area layouts. */
            overflow: visible;
            container-type: inline-size;
            container-name: vizy-block;
            color: var(--pk-color-gray-700, #3f4d5a);
        }
        /* Matrix-parity accent ladder (Craft Color shades 50/100/200/900), derived
           from free hex via oklab so pastels read like Matrix rather than a gray wash.
           Outer border-color is applied in vizy.css — host borders cannot win from here. */
        :host([accent-color]) {
            --custom-bg-color: color-mix(in oklab, var(--vizy-block-accent-color) 9%, #fff);
            --custom-titlebar-bg-color: color-mix(in oklab, var(--vizy-block-accent-color) 16%, #fff);
            --custom-border-color: color-mix(in oklab, var(--vizy-block-accent-color) 28%, #fff);
            --custom-text-color: color-mix(in oklab, var(--vizy-block-accent-color) 62%, #000);
            --vizy-block-label-color: var(--custom-text-color);
            background: var(--custom-bg-color);
            color: var(--custom-text-color);
        }
        :host([collapsed]) {
            overflow: hidden;
        }
        :host([menu-open]) {
            /* Raise the Block while its ⋯ menu is open so the gutter chip
               suppression / stacking stay predictable. */
            z-index: 6;
        }
        /* Selected focus ring is painted from vizy.css (--pk-input-focus-shadow)
           while the field is active (focus-within / data-has-focus). */
        :host([dragging]) {
            opacity: 0.45;
        }

        header {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            gap: 0.5rem;
            /* Tighter right edge so the drag handle sits closer to the frame,
               matching Hyper’s far-right placement. */
            padding: 0 0.35rem 0 0.75rem;
            min-height: 31px;
            background: var(--vizy-panel, #f3f7fc);
            border-bottom: 1px solid var(--vizy-border);
            border-radius: 5px 5px 0 0;
            /* The header is an affordance surface, not selectable copy. */
            user-select: none;
            cursor: default;
        }
        :host([accent-color]) header {
            background: var(--custom-titlebar-bg-color);
            border-bottom-color: var(--custom-border-color);
        }
        /* Folded card is header-only — drop the header/body seam so it does not
           stack on the host bottom border (double line). */
        :host([collapsed]) header {
            border-bottom: none;
            border-radius: 5px;
        }

        /* Block type name — Hyper-style left title, not a fixed label column. */
        .type {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            align-self: center;
            box-sizing: border-box;
            flex: 0 1 auto;
            min-width: 0;
            max-width: 40%;
            margin: 0;
            padding: 0;
            border: none;
            background: transparent;
            color: var(--vizy-block-label-color, #667c92);
            font-size: 12px;
            font-weight: 500;
            line-height: 1.3;
            cursor: default;
        }
        :host([accent-color]) .type {
            color: var(--custom-text-color);
        }
        .type-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        /* Matrix entry-type glyph beside the type name — only when configured. */
        .type-icon {
            display: inline-flex;
            width: 14px;
            height: 14px;
            flex-shrink: 0;
            color: inherit;
        }
        .type-icon svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
        }
        /* Collapsed-only content summary beside the type name (Vizy 3).
           Always in the DOM when text exists; clip/fade so expand/collapse
           does not pop header width in one frame. Timing matches BLOCK_HEIGHT_MOTION. */
        .summary-preview {
            display: inline-block;
            max-width: 0;
            margin-inline-start: 0;
            opacity: 0;
            font-weight: 400;
            color: var(--vizy-muted, #596673);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
            transition:
                max-width 220ms cubic-bezier(0.2, 0.85, 0.25, 1),
                opacity 160ms ease,
                margin-inline-start 220ms cubic-bezier(0.2, 0.85, 0.25, 1);
        }
        :host([collapsed]) .summary-preview {
            max-width: 16rem;
            margin-inline-start: 0.35rem;
            opacity: 1;
        }
        :host([data-collapse-instant]) .summary-preview {
            transition: none;
        }

        .badges {
            display: flex;
            gap: 0.25rem;
            align-items: center;
            align-self: center;
            padding-inline-start: 0.25rem;
        }
        .badge {
            font-size: 0.6875rem;
            padding: 0.125rem 0.375rem;
            border-radius: 999px;
            background: var(--pk-color-gray-100, #e4edf6);
            color: var(--pk-color-gray-700, #3f4d5a);
        }
        .badge.error { background: #fde8e8; color: #b42318; }

        .header-end {
            display: flex;
            align-items: stretch;
            justify-content: flex-end;
            flex: 1 1 auto;
            min-width: 0;
            margin-left: auto;
            gap: 0.15rem;
        }

        .field-status {
            align-self: center;
            font-size: 0.75rem;
            color: var(--vizy-muted, #596673);
            padding-inline: 0.25rem;
        }

        /* Hyper-style layout tabs: cut out the header/body seam. */
        .layout-tabs {
            display: flex;
            align-items: stretch;
            align-self: stretch;
            min-width: 0;
            margin-right: 0.25rem;
            margin-bottom: -1px;
        }
        .layout-tab {
            appearance: none;
            position: relative;
            z-index: 0;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 0;
            margin: 0;
            padding: 5px 10px;
            font-size: 12px;
            line-height: 1.2;
            color: var(--pk-color-gray-700, #3f4d5a);
            display: inline-flex;
            align-items: center;
            min-width: 0;
            max-width: 10rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
        }
        .layout-tab:hover { color: var(--pk-color-gray-900, #1f2933); background: transparent; }
        .layout-tab.is-active {
            z-index: 1;
            background: var(--pk-color-white, #fff);
            border-left-color: #e3e5e8;
            border-right-color: #e3e5e8;
            border-bottom-color: var(--pk-color-white, #fff);
            color: var(--pk-color-gray-900, #1f2933);
        }
        /* Active tab cutout is for the expanded body seam — neutralize when folded. */
        :host([collapsed]) .layout-tabs {
            margin-bottom: 0;
        }
        :host([collapsed]) .layout-tab.is-active {
            border-color: transparent;
            background: color-mix(in srgb, #596673 10%, transparent);
        }
        .layout-tab-select {
            display: none;
            align-self: center;
            max-width: 10rem;
            margin-right: 0.25rem;
            font-size: 12px;
            border: 1px solid #e3e5e8;
            border-radius: 3px;
            background: var(--pk-color-white, #fff);
            padding: 0.2rem 0.4rem;
            color: var(--pk-color-gray-700, #3f4d5a);
        }
        @container vizy-block (max-width: 28rem) {
            .layout-tabs { display: none; }
            .layout-tab-select { display: inline-block; }
        }

        .actions {
            display: flex;
            align-items: center;
            align-self: center;
            gap: 0.15rem;
        }
        .actions button {
            appearance: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            flex: 0 0 auto;
            width: 24px;
            height: 24px;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 3px;
            background: transparent;
            color: var(--vizy-muted, #596673);
            cursor: pointer;
            line-height: 0;
            font-size: 14px;
        }
        .actions button:hover,
        .actions button:focus-visible {
            background: color-mix(in srgb, #596673 12%, transparent);
        }
        /* Hyper: ⋯ keeps the wash; drag handle stays bare with move cursor. */
        .actions button[part='drag-handle']:hover,
        .actions button[part='drag-handle']:focus-visible {
            background: transparent;
        }
        .actions button:focus-visible { outline: 2px solid var(--vizy-focus); outline-offset: 1px; }
        /* Higher specificity than .actions button cursor:pointer. */
        .actions button[part='drag-handle'] { cursor: move; user-select: none; }
        .actions button[part='drag-handle']:active { cursor: grabbing; }
        .action-icon {
            display: block;
            width: 12px;
            height: 12px;
        }
        [part='drag-handle'] .action-icon {
            width: 14px;
            height: 14px;
        }
        [part='drag-handle'] pk-icon.action-icon,
        [part='menu-trigger'] pk-icon.action-icon {
            display: block;
            color: inherit;
        }
        /* PK host defaults to flex-start — keep ⋯ optically centred with Hyper. */
        pk-dropdown-menu {
            display: inline-flex;
            align-self: center;
        }
        pk-dropdown-menu::part(trigger),
        button[slot='trigger'] {
            appearance: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: 24px;
            height: 24px;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 3px;
            background: transparent;
            color: var(--vizy-muted, #596673);
            cursor: pointer;
            line-height: 0;
        }
        button[slot='trigger']:hover,
        button[slot='trigger']:focus-visible {
            background: color-mix(in srgb, #596673 12%, transparent);
        }
        button[slot='trigger']:focus-visible {
            outline: 2px solid var(--vizy-focus);
            outline-offset: 1px;
        }

        /* Flex column so template whitespace around slots is dropped under
           ProseMirror's inherited break-spaces. Resting fold is display:none
           (Matrix hides $fieldsContainer). Motion uses Craft Velocity on the
           host height + body fade — not CSS grid 0fr↔1fr. */
        [part=body] {
            position: relative;
            z-index: 0;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            /* No flex gap — the fields and content slots are always both present,
               so gap would stack on top of body padding even when fields is empty. */
            padding: 0.75rem 0 0.3rem;
            background: var(--pk-color-white, #fff);
            border-radius: 0 0 5px 5px;
            /* Do not inherit ProseMirror break-spaces — Lit template whitespace
               between slots would otherwise add ~1 extra line per gap on mount. */
            white-space: normal;
        }
        :host([collapsed]:not([data-collapse-animating])) [part=body] {
            display: none;
        }
        /* Mid-fold: keep the body in flow so height animation can run. */
        :host([data-collapse-animating]) {
            overflow: hidden;
        }
        :host([data-collapse-animating]) [part=body] {
            display: flex;
            overflow: hidden;
        }
        /* Let the Matrix-style host wash show through; Craft inputs keep their own white. */
        :host([accent-color]) [part=body] {
            background: transparent;
        }
        .block-contents {
            display: flex;
            flex-direction: column;
            white-space: normal;
        }
        .field-layout-failure {
            box-sizing: border-box;
            margin: 0 0.5rem 0.5rem;
            padding: 0.85rem 1rem;
            border: 1px solid var(--error-color, #ef4444);
            border-radius: var(--vizy-radius, 4px);
            background: var(--pk-color-red-50, #fef2f2);
            color: var(--pk-color-gray-800, #33404d);
        }
        .field-layout-loading {
            box-sizing: border-box;
            margin: 0 0.5rem 0.5rem;
            padding: 0.85rem 1rem;
            border: 1px solid var(--vizy-border-subtle, #cdd8e4);
            border-radius: var(--vizy-radius, 4px);
            background: var(--pk-color-gray-50, #f3f7fc);
            color: var(--pk-color-gray-600, #515f6c);
            font-size: 12.5px;
        }
        .field-layout-failure__title {
            margin: 0 0 0.35rem;
            color: var(--error-color, #b91c1c);
            font-size: 13px;
            font-weight: 600;
        }
        .field-layout-failure__body {
            margin: 0 0 0.75rem;
            font-size: 12.5px;
            line-height: 1.4;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .field-layout-failure__retry {
            appearance: none;
            margin: 0;
            padding: 0.35rem 0.65rem;
            border: 1px solid var(--vizy-border-subtle, #cdd8e4);
            border-radius: var(--vizy-radius, 4px);
            background: var(--white, #fff);
            color: var(--pk-color-gray-800, #33404d);
            font: inherit;
            font-size: 12px;
            cursor: pointer;
        }
        .field-layout-failure__retry:hover {
            border-color: var(--pk-color-gray-400, #7b8793);
        }
    `];

    applySummary(summary: BlockSummaryData | null): void {
        if (!summary) return;
        this.typeName = summary.typeName;
        this.title = summary.title;
        this.subtitle = summary.subtitle;
        this.enabled = summary.enabled;
        this.unresolved = !summary.resolved;
        this.errorCount = summary.errorCount;
        this.descendantErrorCount = summary.descendantErrorCount;
    }

    /** Content summary for folded header — omitted when it would repeat the type name. */
    #collapsedSummaryLine(): string | null {
        const typeLabel = this.typeName || 'Block';
        if (this.title && this.title !== typeLabel) return this.title;
        if (this.subtitle) return this.subtitle;
        return null;
    }

    #headerAriaLabel(): string {
        const typeLabel = this.typeName || 'Block';
        if (!this.collapsed) return typeLabel;
        const summary = this.#collapsedSummaryLine();
        return summary ? `${typeLabel}, ${summary}` : typeLabel;
    }

    #awaitingFieldLayout(): boolean {
        return this.expectsFieldLayout
            && this.fieldLayoutState !== 'mounted'
            && this.fieldLayoutState !== 'error';
    }

    render() {
        // Always paint Block header. Content Areas live in the layout slot and
        // stay editable while Craft fields load into widgets — no spinner.
        // Body fold: Craft Velocity on the host (Matrix parity); see #setCollapsed.
        const summary = this.#collapsedSummaryLine();
        return html`
            <header
                part="header"
                contenteditable="false"
                role="group"
                aria-label=${this.#headerAriaLabel()}
                @pointerdown=${this.#onHeaderPointerDown}
                @dblclick=${this.#onHeaderDblClick}
            >
                <div class="type" part="summary">
                    ${!this.enabled
                        ? html`<pk-status status="off" aria-label="Disabled"></pk-status>`
                        : nothing}
                    ${this.typeIconSvg
                        ? html`<span class="type-icon" part="type-icon" aria-hidden="true">${unsafeHTML(this.typeIconSvg)}</span>`
                        : nothing}
                    <span class="type-label" part="type">${this.typeName || 'Block'}</span>
                    ${summary
                        ? html`<span class="summary-preview" part="summary-preview">${summary}</span>`
                        : nothing}
                </div>
                <div class="badges" part="badges">
                    ${this.errorCount ? html`<span class="badge error" aria-label="${this.errorCount} errors">${this.errorCount}</span>` : nothing}
                    ${this.descendantErrorCount ? html`<span class="badge error" aria-label="${this.descendantErrorCount} nested errors">+${this.descendantErrorCount}</span>` : nothing}
                    ${this.unresolved ? html`<span class="badge" aria-label="Unresolved block type">?</span>` : nothing}
                </div>
                <div class="header-end">
                    ${this.#layoutTabs()}
                    ${this.#fieldLayoutAffordance()}
                    <div class="actions">
                        <pk-dropdown-menu
                            size="sm"
                            placement="bottom-end"
                            @pk-open-change=${this.#onMenuOpenChange}
                            @pk-hide=${this.#onMenuHide}
                            @pk-after-hide=${this.#onMenuAfterHide}
                            @pk-select=${this.#onMenuSelect}
                        >
                            <button
                                type="button"
                                slot="trigger"
                                part="menu-trigger"
                                aria-label="Block actions"
                                ?disabled=${this.menuClosing}
                            >
                                <pk-icon class="action-icon" icon="ellipsis" label=""></pk-icon>
                            </button>
                            ${this.enabled ? html`
                                <pk-dropdown-item value="toggleCollapse">
                                    <pk-icon
                                        slot="start"
                                        icon=${this.collapsed ? 'up-right-and-down-left-from-center' : 'down-left-and-up-right-to-center'}
                                        label=""
                                    ></pk-icon>
                                    ${this.collapsed ? 'Expand' : 'Collapse'}
                                </pk-dropdown-item>
                            ` : nothing}
                            <pk-dropdown-item value="duplicate">
                                <pk-icon slot="start" icon="clone" label=""></pk-icon>
                                Duplicate
                            </pk-dropdown-item>
                            <pk-dropdown-separator></pk-dropdown-separator>
                            <pk-dropdown-item value="moveUp">
                                <pk-icon slot="start" icon="arrow-up" label=""></pk-icon>
                                Move up
                            </pk-dropdown-item>
                            <pk-dropdown-item value="moveDown">
                                <pk-icon slot="start" icon="arrow-down" label=""></pk-icon>
                                Move down
                            </pk-dropdown-item>
                            <pk-dropdown-separator></pk-dropdown-separator>
                            <pk-dropdown-item value="toggleEnabled">
                                <pk-icon slot="start" icon=${this.enabled ? 'ban' : 'check'} label=""></pk-icon>
                                ${this.enabled ? 'Disable' : 'Enable'}
                            </pk-dropdown-item>
                            ${this.canAddAbove ? html`
                                <pk-dropdown-separator></pk-dropdown-separator>
                                <pk-dropdown-item value="addAbove">
                                    <pk-icon slot="start" icon="plus" label=""></pk-icon>
                                    ${this.addAboveLabel}
                                </pk-dropdown-item>
                            ` : nothing}
                            <pk-dropdown-separator></pk-dropdown-separator>
                            <pk-dropdown-item value="delete" destructive>
                                <pk-icon slot="start" icon="xmark" label=""></pk-icon>
                                Delete
                            </pk-dropdown-item>
                        </pk-dropdown-menu>
                        <button
                            type="button"
                            part="drag-handle"
                            data-vizy-drag-handle
                            aria-label="Move block"
                            @click=${(event: Event) => event.stopPropagation()}
                        >
                            <pk-icon class="action-icon" icon="grip-move"></pk-icon>
                        </button>
                    </div>
                </div>
            </header>
            <section
                part="body"
                ?inert=${this.collapsed}
                aria-busy=${this.#awaitingFieldLayout() ? 'true' : nothing}
            >
                ${this.#fieldLayoutStatus()}
                <div class="block-contents" ?hidden=${this.fieldLayoutState === 'error' || this.fieldLayoutRetrying}>
                    <slot name="layout"></slot>
                </div>
            </section>
        `;
    }

    /**
     * Empty white Block bodies are not acceptable. PHP/JS FieldLayout failures
     * paint here (role=alert) with Retry — same bar as field boot failures.
     * Retry shows a brief loading state so the card is not blank mid-request.
     */
    #fieldLayoutStatus() {
        if (this.fieldLayoutRetrying && this.fieldLayoutState === 'loading') {
            return html`
                <div class="field-layout-loading" part="field-layout-loading" aria-live="polite">
                    Loading fields…
                </div>
            `;
        }
        if (this.fieldLayoutState !== 'error') return nothing;
        return html`
            <div class="field-layout-failure" role="alert" part="field-layout-failure">
                <div class="field-layout-failure__title">Block fields could not load</div>
                <div class="field-layout-failure__body">${this.fieldLayoutError
                    || 'This Block’s fields failed to render. Check the browser console for details.'}</div>
                <button
                    type="button"
                    class="field-layout-failure__retry"
                    @click=${this.#retryFieldLayout}
                    @pointerdown=${preserveEditorSelection}
                >Retry</button>
            </div>
        `;
    }

    #retryFieldLayout = (event: Event): void => {
        event.preventDefault();
        event.stopPropagation();
        this.fieldLayoutRetrying = true;
        this.fieldLayoutState = 'loading';
        this.fieldLayoutError = null;
        // Dedicated event — not vizy-edit-fields (that guards event.target === host
        // and was easy to miss from this click path). Editor retries the mount.
        this.dispatchEvent(new CustomEvent('vizy-retry-field-layout', {
            bubbles: true,
            composed: true,
            detail: { blockUid: this.blockUid },
        }));
    };

    #layoutTabs() {
        if (this.layoutTabLabels.length < 2) return nothing;
        return html`
            <div class="layout-tabs" role="tablist" part="layout-tabs" aria-label="Layout tabs">
                ${this.layoutTabLabels.map((label, index) => html`
                    <button
                        type="button"
                        class="layout-tab ${index === this.activeLayoutTab ? 'is-active' : ''}"
                        role="tab"
                        aria-selected=${String(index === this.activeLayoutTab)}
                        data-vizy-layout-tab-index=${index}
                        @click=${() => this.#selectLayoutTab(index)}
                    >${label}</button>
                `)}
            </div>
            <select
                class="layout-tab-select"
                part="layout-tab-select"
                aria-label="Layout tab"
                .value=${String(this.activeLayoutTab)}
                @change=${(event: Event) => {
                    const value = Number((event.target as HTMLSelectElement).value);
                    this.#selectLayoutTab(Number.isFinite(value) ? value : 0);
                }}
            >
                ${this.layoutTabLabels.map((label, index) => html`
                    <option value=${index}>${label}</option>
                `)}
            </select>
        `;
    }

    /**
     * Field layouts mount eagerly with the Block. Failures paint in the body
     * (`#fieldLayoutStatus`); there is no header loading copy.
     */
    #fieldLayoutAffordance() {
        return nothing;
    }

    #selectLayoutTab(index: number): void {
        if (index === this.activeLayoutTab) return;
        this.activeLayoutTab = index;
        this.dispatchEvent(new CustomEvent('vizy-layout-tab-change', {
            bubbles: true,
            composed: true,
            detail: { index },
        }));
    }

    #toggleCollapse(): void {
        if (!this.enabled && this.collapsed) return;
        this.#setCollapsed(!this.collapsed, { animate: true, persist: true });
    }

    /**
     * Fold/unfold like Matrix entries via Craft's Velocity (CpAsset → Garnish).
     * Animates the host height header↔full and fades the body — not CSS grid.
     * Falls back to instant when Velocity is missing or reduced-motion is on.
     *
     * `persist` writes the Matrix-style localStorage preference. Disable/enable
     * forced folds pass false so author collapse preference is preserved.
     */
    #setCollapsed(
        collapsed: boolean,
        options: { animate: boolean; persist?: boolean },
    ): void {
        if (collapsed === this.collapsed) return;

        const persist = options.persist !== false;

        this.#collapseMotion?.abort();
        this.#collapseMotion = null;
        this.#stopCollapseVelocity();
        this.#clearHostMotionStyles();

        const instant = !options.animate
            || prefersReducedMotion()
            || !craftVelocityAvailable();
        if (instant) {
            this.setAttribute('data-collapse-instant', '');
            this.collapsed = collapsed;
            this.toggleAttribute('collapsed', collapsed);
            this.removeAttribute('data-collapse-animating');
            this.#emitCollapseChange(collapsed, persist);
            requestAnimationFrame(() => {
                this.removeAttribute('data-collapse-instant');
            });
            return;
        }

        const motion = new AbortController();
        this.#collapseMotion = motion;
        motion.signal.addEventListener('abort', () => this.#stopCollapseVelocity(), { once: true });
        void this.#animateCollapseWithVelocity(collapsed, motion.signal, persist);
    }

    async #animateCollapseWithVelocity(
        collapsed: boolean,
        signal: AbortSignal,
        persist: boolean,
    ): Promise<void> {
        const body = this.renderRoot.querySelector<HTMLElement>('[part=body]');
        const header = this.renderRoot.querySelector<HTMLElement>('header');
        if (!body || !header) {
            this.collapsed = collapsed;
            this.toggleAttribute('collapsed', collapsed);
            this.#emitCollapseChange(collapsed, persist);
            return;
        }

        if (collapsed) {
            // Measure while body is still fully laid out, then lock + animate shut.
            const fromH = this.getBoundingClientRect().height;
            this.style.height = `${fromH}px`;
            this.style.overflow = 'hidden';
            this.setAttribute('data-collapse-animating', '');

            this.collapsed = true;
            this.toggleAttribute('collapsed', true);
            this.#emitCollapseChange(true, persist);
            await this.updateComplete;
            if (signal.aborted) return;

            // Header may grow slightly once the summary preview appears.
            const headerH = header.getBoundingClientRect().height;
            await Promise.all([
                velocityAnimate(this, { height: headerH }, {
                    duration: MATRIX_VELOCITY_DURATION,
                }),
                // Opacity only — Velocity fadeOut sets display:none and fights our CSS.
                velocityAnimate(body, { opacity: 0 }, {
                    duration: MATRIX_VELOCITY_DURATION,
                }),
            ]);
        } else {
            // Measure header-only height *before* revealing the body. Setting
            // data-collapse-animating first used to force display:flex on the
            // body, so fromH≈toH and only the fade was visible.
            const fromH = this.getBoundingClientRect().height;
            this.style.height = `${fromH}px`;
            this.style.overflow = 'hidden';
            this.setAttribute('data-collapse-animating', '');

            this.collapsed = false;
            this.toggleAttribute('collapsed', false);
            this.#emitCollapseChange(false, persist);
            await this.updateComplete;
            if (signal.aborted) return;

            body.style.opacity = '0';
            this.style.height = 'auto';
            const toH = this.getBoundingClientRect().height;
            this.style.height = `${fromH}px`;
            void this.offsetHeight;

            await Promise.all([
                velocityAnimate(this, { height: toH }, {
                    duration: MATRIX_VELOCITY_DURATION,
                }),
                velocityAnimate(body, { opacity: 1 }, {
                    duration: MATRIX_VELOCITY_DURATION,
                }),
            ]);
        }

        if (signal.aborted) return;
        this.#clearHostMotionStyles();
        this.removeAttribute('data-collapse-animating');
        if (this.#collapseMotion?.signal === signal) {
            this.#collapseMotion = null;
        }
    }

    #stopCollapseVelocity(): void {
        velocityStop(this);
        const body = this.renderRoot.querySelector<HTMLElement>('[part=body]');
        if (body) velocityStop(body);
    }

    #clearHostMotionStyles(): void {
        this.style.height = '';
        this.style.overflow = '';
        const body = this.renderRoot.querySelector<HTMLElement>('[part=body]');
        if (!body) return;
        body.style.height = '';
        body.style.overflow = '';
        body.style.opacity = '';
        body.style.display = '';
    }

    #emitCollapseChange(collapsed: boolean, persist: boolean): void {
        this.dispatchEvent(new CustomEvent('vizy-collapse-change', {
            bubbles: true,
            composed: true,
            detail: { collapsed, persist },
        }));
    }

    /**
     * Header controls sits inside ProseMirror's contenteditable. Without
     * preventDefault, a press focuses the surface and Chromium select-alls (or
     * parks the caret in the nearest Content Area). Skip the drag grip — its
     * mousedown must not be cancelled or HTML5 drag never starts.
     * Skip buttons / menus — they own the gesture (⋯, tabs, …); activating the
     * Block here would fight menu focus on mouseup.
     */
    #onHeaderPointerDown(event: PointerEvent): void {
        if (event.button !== 0) return;
        const path = event.composedPath();
        const fromHandle = path.some((node) => (
            node instanceof HTMLElement && (
                node.matches('[data-vizy-drag-handle]')
                || node.closest('[data-vizy-drag-handle]') != null
            )
        ));
        if (fromHandle) return;
        const fromControl = path.some((node) => (
            node instanceof HTMLElement && node.matches(
                'button, select, a, input, textarea, pk-dropdown-menu, pk-dropdown-item, pk-button',
            )
        ));
        if (fromControl) return;
        preserveEditorSelection(event);
        this.dispatchEvent(new CustomEvent('vizy-block-header-activate', {
            bubbles: true,
            composed: true,
        }));
    }

    /** Double-click empty header controls to fold/unfold — skip controls with their own action. */
    #onHeaderDblClick(event: MouseEvent): void {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest('button, select, a, input, textarea, pk-dropdown-menu, pk-dropdown-item')) {
            return;
        }
        event.preventDefault();
        this.#toggleCollapse();
    }

    // Plugin Kit closes its popup after the exit animation. Prevent reopening
    // during that interval, which lets the old close hide the newly opened menu.
    #onMenuHide = (event: Event): void => {
        if (event.target === event.currentTarget) this.menuClosing = true;
    };

    #onMenuAfterHide = (event: Event): void => {
        if (event.target === event.currentTarget) this.menuClosing = false;
    };

    #onMenuOpenChange = (event: CustomEvent<{ open?: boolean }>): void => {
        const open = Boolean(event.detail?.open);
        if (open === this.menuOpen) return;
        this.menuOpen = open;
        this.dispatchEvent(new CustomEvent('vizy-menu-change', {
            bubbles: true,
            composed: true,
            detail: { open },
        }));
    };

    #onMenuSelect = (event: CustomEvent<{ value?: string }>): void => {
        const action = event.detail?.value;
        if (!action) return;
        // Collapse/Expand stays on the element — same path as header double-click.
        if (action === 'toggleCollapse') {
            this.#toggleCollapse();
            return;
        }
        const invoker = this.shadowRoot?.querySelector<HTMLElement>('[part="menu-trigger"]')
            ?? undefined;
        this.dispatchEvent(new CustomEvent('vizy-block-action', {
            bubbles: true,
            composed: true,
            detail: { action, invoker },
        }));
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-block': VizyBlockElement;
    }
}
