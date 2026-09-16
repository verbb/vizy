import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Editor } from '@tiptap/core';
import '@verbb/plugin-kit-web/components/dropdown-menu';
import '@verbb/plugin-kit-web/components/icon';
import {
    preserveEditorSelection,
    resolveEditorBody,
    restoreEditorFocus,
    setEditorFieldHasFocus,
    editorViewHasFocus,
} from '../editor-field-focus';
import type { ToolbarControlManifest } from '../types';
import { isActionable, isActionActive, runToolbarAction } from './actions';
import { controlAppearanceStyles, controlClass, controlIcon, menuChevronIcon } from './control-appearance';
import { attachToolbarTooltip } from './toolbar-tooltip';
import {
    craftLinkOptionsFromConfig,
    openCraftElementLink,
    openLinkDialogForEditor,
    unlinkFromEditor,
    type VizyLinkAuthoringConfig,
} from '../semantic/link-ui';
import type { VizyImageAuthoringConfig } from '../semantic/image-ui';
import type { LayoutPreset } from '../layout/presets';
import '../semantic/link-dialog';
import '../semantic/image-dialog';

/** Toolbar actions that are not Editor Config roster tokens. */
export type ToolbarUiActionDetail = {
    action: 'insert-block';
    invoker: HTMLElement;
    /**
     * Whether ProseMirror had focus at toolbar mousedown. Cold Add Block must
     * not autofocus Search or restore editor focus (same contract as Formatting).
     */
    hadEditorFocus: boolean;
};

/**
 * Live toolbar. Group menus use Plugin Kit `pk-dropdown-menu`. Editor Config
 * builder previews the same `size="sm"` panel UI in light DOM (editable
 * roster) — see `editor-config-settings.css`.
 *
 * Add Block is a placeable Editor Config action (`openAddBlock`) — position it
 * like Bold / Undo. It is not a roster-editable dropdown; Block Types come from
 * the field allowlist.
 */
@customElement('vizy-toolbar')
export class VizyToolbarElement extends LitElement {
    @property({ attribute: false })
    accessor controls: ToolbarControlManifest[] = [];

    @property({ attribute: false })
    accessor editor: Editor | null = null;

    /**
     * When false, hide placed Add Block controls (field has no insertable Block Types).
     */
    @property({ type: Boolean, attribute: false })
    accessor canAddBlock = false;

    /**
     * When true, Add Block paints as a menu trigger (+/chevron, aria-expanded).
     * False when exactly one Block Type is insertable — click inserts immediately
     * (same Matrix-style one-choice path as Block ⋯ / gutter), so a chevron would
     * be a false affordance.
     */
    @property({ type: Boolean, attribute: false })
    accessor addBlockNeedsMenu = true;

    /**
     * Accessible name when `addBlockNeedsMenu` is false (`Add {Block Type}`).
     * Falls back to the control’s roster label.
     */
    @property({ type: String, attribute: false })
    accessor addBlockDirectLabel: string | null = null;

    /**
     * Whether the Add Block insertion palette is open — drives `aria-expanded`
     * so the trigger paints like an open `pk-dropdown-menu` (menu mode only).
     */
    @property({ type: Boolean, attribute: false })
    accessor addBlockOpen = false;

    /**
     * Craft element link options + site id from editor bootstrap (not the
     * cached manifest). Empty ⇒ Link menu is Insert/Edit + Unlink only.
     */
    @property({ attribute: false })
    accessor linkAuthoring: VizyLinkAuthoringConfig = {};

    /** Volumes / transforms for Image insert (bootstrap). */
    @property({ attribute: false })
    accessor imageAuthoring: VizyImageAuthoringConfig = {};

    /** Resolved layout column presets from Editor Config (toolbar Layout chooser). */
    @property({ attribute: false })
    accessor layoutPresets: readonly LayoutPreset[] = [];

    #detachTooltip: (() => void) | null = null;
    /** Unsubscribe selection listener that refreshes contextual Table menu items. */
    #detachEditorSelection: (() => void) | null = null;
    /** Ref-count hold on field focus ring while a toolbar menu is open (portaled focus). */
    #menuFocusHeld = false;
    /** Only menus that emitted a real open may restore editor focus on close. */
    #openMenus = new Set<HTMLElement>();
    /**
     * When true, the next menu close must not restore ProseMirror focus.
     * Set for outside CP clicks and toolbar presses (trigger toggle) — both
     * would otherwise flash field focus for a frame while the author is still
     * on the field. Escape and in-panel item select leave this false.
     */
    #skipFocusRestore = false;
    /**
     * Whether ProseMirror had DOM focus at the start of the current toolbar
     * pointer gesture. Captured on mousedown before preventDefault — by click /
     * menu-select time, focus may already be on the button or a portaled panel.
     */
    #gestureHadEditorFocus = false;
    /**
     * Whether this open menu session should paint field focus ring and restore
     * ProseMirror on close. False when the menu was opened while the editor
     * was unfocused — browsing Formatting must not steal the Craft title.
     */
    #menuSessionHadEditorFocus = false;

    static styles = [
        controlAppearanceStyles,
        css`
            /* Outer field border lives on .vizy-editor-body (vizy.css). Host is the
               raised white strip + sticky pin; top radii fill the body's rounded frame. */
            :host {
                display: block;
                position: relative;
                border-radius: var(--vizy-radius, var(--pk-input-border-radius, 3px))
                    var(--vizy-radius, var(--pk-input-border-radius, 3px)) 0 0;
                background: var(--pk-color-white, #fff);
            }
            [role='toolbar'] {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 4px;
                padding: 4px 6px;
            }
            pk-tooltip {
                position: absolute;
                inset: 0 auto auto 0;
                width: 0;
                height: 0;
                overflow: visible;
                pointer-events: none;
            }
            pk-dropdown-menu {
                display: inline-flex;
                align-self: center;
            }
            /* Formatting row previews — Vizy 3 weight/colour; compact sizes for the menu. */
            .preview-label[data-preview^='heading'] {
                font-weight: 400;
                color: #212529;
                line-height: 1.2;
                text-transform: none;
            }
            .preview-label[data-preview='heading1'] { font-size: 22px; letter-spacing: -0.02em; }
            .preview-label[data-preview='heading2'] { font-size: 20px; }
            .preview-label[data-preview='heading3'] { font-size: 18px; }
            .preview-label[data-preview='heading4'] { font-size: 16px; }
            .preview-label[data-preview='heading5'] { font-size: 14px; }
            .preview-label[data-preview='heading6'] { font-size: 13px; }
            .preview-label[data-preview='blockquote'] {
                font-style: italic;
                color: #596673;
                border-left: 3px solid #cdd8e4;
                padding-left: 8px;
            }
            .preview-label[data-preview='codeBlock'] {
                font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
                font-size: 13px;
            }
            .menu-icon {
                display: inline-flex;
                width: 1em;
                justify-content: center;
                color: inherit;
            }
            .menu-icon svg {
                width: 1em;
                height: 1em;
                fill: currentColor;
            }
            .toolbar-leading pk-icon,
            .vizy-control pk-icon {
                width: 1em;
                height: 1em;
                display: block;
                pointer-events: none;
            }
        `,
    ];

    connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('keydown', this.#onKeyDown);
        document.addEventListener('pointerdown', this.#onDocumentPointerDown, true);
    }

    protected firstUpdated(): void {
        this.#detachTooltip = attachToolbarTooltip(this);
    }

    protected updated(changed: PropertyValues): void {
        if (changed.has('editor')) this.#bindEditorSelection();
    }

    disconnectedCallback(): void {
        document.removeEventListener('keydown', this.#onKeyDown);
        document.removeEventListener('pointerdown', this.#onDocumentPointerDown, true);
        this.#detachTooltip?.();
        this.#detachTooltip = null;
        this.#detachEditorSelection?.();
        this.#detachEditorSelection = null;
        this.#openMenus.clear();
        this.#skipFocusRestore = false;
        this.#releaseMenuFocus();
        super.disconnectedCallback();
    }

    render() {
        const controls = this.#visibleControls();
        if (!controls.length) return null;
        return html`
            <div role="toolbar" aria-label="Formatting">
                ${controls.map((control) => this.#renderControl(control))}
            </div>
        `;
    }

    #emitUi(action: ToolbarUiActionDetail['action'], event: Event): void {
        const invoker = event.currentTarget;
        if (!(invoker instanceof HTMLElement)) return;
        this.dispatchEvent(new CustomEvent<ToolbarUiActionDetail>('vizy-toolbar-ui', {
            detail: {
                action,
                invoker,
                // Prefer mousedown capture; keyboard activation falls back to now.
                hadEditorFocus: this.#gestureHadEditorFocus
                    || editorViewHasFocus(this.editor),
            },
            bubbles: true,
            composed: true,
        }));
    }

    /** Drop controls that render to nothing and separators left dangling by that. */
    #visibleControls(): ToolbarControlManifest[] {
        const visible = this.controls.filter((control) => this.#willRender(control));
        const collapsed: ToolbarControlManifest[] = [];

        for (const control of visible) {
            if (control.presentation === 'separator') {
                if (!collapsed.length) continue;
                if (collapsed[collapsed.length - 1]?.presentation === 'separator') continue;
                collapsed.push(control);
                continue;
            }
            collapsed.push(control);
        }

        if (collapsed.at(-1)?.presentation === 'separator') {
            collapsed.pop();
        }

        return collapsed;
    }

    #willRender(control: ToolbarControlManifest): boolean {
        if (control.presentation === 'separator') return true;
        if (control.action?.command === 'openAddBlock') return this.canAddBlock;
        if (control.kind === 'group') {
            return (control.items ?? []).some((item) => this.#willRender(item));
        }
        return isActionable(control);
    }

    #renderControl(control: ToolbarControlManifest) {
        if (control.presentation === 'separator') {
            return html`<span class="vizy-separator" role="separator"></span>`;
        }
        if (control.kind === 'group') {
            const items = (control.items ?? []).filter((item) => this.#willRender(item));
            return items.length ? this.#renderGroup(control, items) : nothing;
        }
        if (!this.#willRender(control)) {
            return nothing;
        }
        // Link is always a PK-style menu (element options + Insert + Unlink),
        // matching Formie / plugin-kit-tiptap — never a plain toggle button.
        if (control.action?.command === 'setLink') {
            return this.#renderLinkMenu(control);
        }
        // Add Block: chevron only when several types need a picker. One type inserts
        // immediately (same as Block ⋯ / gutter) — a menu affordance would lie.
        const isAddBlock = control.action?.command === 'openAddBlock';
        const addBlockMenu = isAddBlock && this.addBlockNeedsMenu;
        const addBlockLabel = isAddBlock && this.addBlockDirectLabel
            ? this.addBlockDirectLabel
            : control.label;
        return html`
            <button
                type="button"
                class=${controlClass(control, addBlockMenu ? 'has-menu' : '')}
                aria-label=${addBlockLabel}
                aria-pressed=${isAddBlock ? nothing : String(this.#isActive(control))}
                aria-expanded=${addBlockMenu ? String(this.addBlockOpen) : nothing}
                data-vizy-toolbar-add-block=${isAddBlock ? '' : nothing}
                data-vizy-invoker-key=${isAddBlock ? 'toolbar-plus' : nothing}
                @mousedown=${this.#onToolbarMouseDown}
                @click=${(event: Event) => this.#activate(control, event)}
                >${isAddBlock
                    ? html`<pk-icon icon="plus" label=""></pk-icon>`
                    : controlIcon(control)}${addBlockMenu ? menuChevronIcon() : nothing}</button>
        `;
    }

    /**
     * Link toolbar control — Plugin Kit TipTap shape: Craft element options,
     * Insert/Edit Link → `pk-dialog`, Unlink. Applies Vizy semantic marks.
     */
    #renderLinkMenu(control: ToolbarControlManifest) {
        const craftOptions = craftLinkOptionsFromConfig(this.linkAuthoring);
        const active = this.#isActive(control);
        const focus = () => this.#gestureHadEditorFocus || this.#menuSessionHadEditorFocus;

        // After a menu item fires, wait for the dropdown to fully close before
        // opening Craft’s modal or our pk-dialog (same as pk-tiptap-editor).
        const afterMenu = async (event: Event, run: () => void): Promise<void> => {
            const item = event.currentTarget;
            const menu = item instanceof HTMLElement
                ? item.closest('pk-dropdown-menu') as (HTMLElement & { whenClosed?: () => Promise<void> }) | null
                : null;
            await menu?.whenClosed?.();
            run();
        };

        return html`
            <pk-dropdown-menu
                size="sm"
                placement="bottom-start"
                @pk-open-change=${this.#onMenuOpenChange}
            >
                <button
                    type="button"
                    slot="trigger"
                    class=${controlClass(control, 'has-menu')}
                    aria-label=${control.label}
                    aria-pressed=${String(active)}
                    @mousedown=${this.#onToolbarMouseDown}
                >${controlIcon(control)}${menuChevronIcon()}</button>
                ${craftOptions.map((option, index) => html`
                    <pk-dropdown-item
                        value=${`craft-link:${index}`}
                        @click=${(event: Event) => {
                            void afterMenu(event, () => {
                                if (!this.editor) return;
                                openCraftElementLink(this.editor, option, this.linkAuthoring, {
                                    focus: focus(),
                                });
                            });
                        }}
                    >${option.optionTitle}</pk-dropdown-item>
                `)}
                ${craftOptions.length > 0 ? html`<pk-dropdown-separator></pk-dropdown-separator>` : nothing}
                <pk-dropdown-item
                    value="insert-link"
                    @click=${(event: Event) => {
                        void afterMenu(event, () => {
                            if (!this.editor) return;
                            void openLinkDialogForEditor(this.editor, { focus: focus() });
                        });
                    }}
                >${active ? 'Edit Link' : 'Insert Link'}</pk-dropdown-item>
                <pk-dropdown-item
                    value="unlink"
                    ?disabled=${!active}
                    @click=${() => {
                        if (!this.editor || !active) return;
                        unlinkFromEditor(this.editor, { focus: focus() });
                        this.requestUpdate();
                    }}
                >Unlink</pk-dropdown-item>
            </pk-dropdown-menu>
        `;
    }

    #renderGroup(control: ToolbarControlManifest, items: ToolbarControlManifest[]) {
        // Mutually exclusive families (Formatting / Alignment) use radio items so
        // the active format paints as checked. Table ops stay normal actions.
        const radio = this.#usesRadioItems(control);
        const menuItems = this.#contextualGroupItems(control, items);
        return html`
            <pk-dropdown-menu
                size="sm"
                placement="bottom-start"
                @pk-open-change=${this.#onMenuOpenChange}
                @pk-select=${(event: CustomEvent<{ value?: string }>) => {
                    const id = event.detail?.value;
                    const item = menuItems.find((entry) => entry.id === id);
                    if (item) this.#activate(item);
                }}
            >
                <button
                    type="button"
                    slot="trigger"
                    class=${controlClass(control, 'has-menu')}
                    aria-label=${control.label}
                    @mousedown=${this.#onToolbarMouseDown}
                >${controlIcon(control)}${menuChevronIcon()}</button>
                ${menuItems.map((item) => html`
                    <pk-dropdown-item
                        value=${item.id}
                        type=${radio ? 'radio' : 'normal'}
                        radio-group=${radio ? control.id : nothing}
                        ?checked=${radio && this.#isActive(item)}
                        ?disabled=${this.#isGroupItemDisabled(control, item)}
                    >
                        ${item.icon ? html`<span slot="start" class="menu-icon">${controlIcon(item)}</span>` : nothing}
                        <span class="preview-label" data-preview=${item.preview ?? nothing}>${item.label}</span>
                    </pk-dropdown-item>
                `)}
            </pk-dropdown-menu>
        `;
    }

    /**
     * Table dropdown is contextual (Vizy 3 labels + clearer job split):
     * outside a table → Insert table only; inside → structure ops only.
     * Fall back to the full roster when the author's trim leaves one side empty.
     */
    #contextualGroupItems(
        control: ToolbarControlManifest,
        items: ToolbarControlManifest[],
    ): ToolbarControlManifest[] {
        if (!this.#isTableDropdown(control)) return items;
        const insert = items.filter((item) => item.id === 'table');
        const ops = items.filter((item) => item.id !== 'table');
        if (this.editor?.isActive('table')) {
            return ops.length > 0 ? ops : items;
        }
        return insert.length > 0 ? insert : ops;
    }

    /** Structure ops are inert outside a table when Insert was trimmed from the roster. */
    #isGroupItemDisabled(control: ToolbarControlManifest, item: ToolbarControlManifest): boolean {
        if (!this.#isTableDropdown(control)) return false;
        if (item.id === 'table') return false;
        return !this.editor?.isActive('table');
    }

    #isTableDropdown(control: ToolbarControlManifest): boolean {
        return control.id === 'dropdown:table' || control.id.endsWith(':table');
    }

    #bindEditorSelection(): void {
        this.#detachEditorSelection?.();
        this.#detachEditorSelection = null;
        const editor = this.editor;
        if (!editor) return;
        const onSelection = (): void => {
            this.requestUpdate();
        };
        editor.on('selectionUpdate', onSelection);
        this.#detachEditorSelection = () => {
            editor.off('selectionUpdate', onSelection);
        };
    }

    #usesRadioItems(control: ToolbarControlManifest): boolean {
        const id = control.id.toLowerCase();
        return id.includes('formatting') || id.includes('alignment') || id.includes('align');
    }

    #isActive(control: ToolbarControlManifest): boolean {
        return this.editor ? isActionActive(this.editor, control.action, control.id) : false;
    }

    /**
     * Capture whether the editor was focused before preventDefault — by click /
     * open-change time focus may already have moved.
     */
    #onToolbarMouseDown = (event: Event): void => {
        this.#gestureHadEditorFocus = editorViewHasFocus(this.editor);
        preserveEditorSelection(event);
    };

    #activate(control: ToolbarControlManifest, event?: Event): void {
        if (!control.action) return;
        // Add Block opens InsertionOverlay — not a TipTap chain command.
        if (control.action.command === 'openAddBlock') {
            const invoker = event?.currentTarget;
            if (invoker instanceof HTMLElement) {
                this.#emitUi('insert-block', event!);
            }
            return;
        }
        if (!this.editor) return;
        // Menu select: use the session flag (panel usually has DOM focus now).
        // Plain button: use the gesture capture from mousedown.
        const focus = this.#openMenus.size > 0
            ? this.#menuSessionHadEditorFocus
            : this.#gestureHadEditorFocus;
        const invoker = event?.currentTarget instanceof HTMLElement
            ? event.currentTarget
            : null;
        runToolbarAction(this.editor, control.action, {
            focus,
            imageAuthoring: this.imageAuthoring,
            layoutPresets: this.layoutPresets,
            invoker,
            controlId: control.id,
        });
        this.requestUpdate();
    }

    /**
     * Menu open → hold field focus ring only when the editor was already focused
     * (panel focus is portaled). Menu close → release; restore ProseMirror only
     * for Escape / item-select when the session was warm — never on trigger
     * toggle or outside click (those flash field focus for a frame).
     */
    #onMenuOpenChange = (event: CustomEvent<{ open?: boolean }>): void => {
        const menu = event.currentTarget;
        if (!(menu instanceof HTMLElement)) return;

        if (event.detail?.open) {
            this.#openMenus.add(menu);
            this.#skipFocusRestore = false;
            // Prefer mousedown capture; keyboard open falls back to current focus.
            this.#menuSessionHadEditorFocus = this.#gestureHadEditorFocus
                || editorViewHasFocus(this.editor);
            if (this.#menuSessionHadEditorFocus) {
                this.#holdMenuFocus();
            }
            return;
        }

        // PK can report a closed state during upgrade or unrelated outside
        // presses. That is state synchronization, not the end of a Vizy menu
        // session, and must never turn a blank page click into editor focus.
        if (!this.#openMenus.delete(menu)) return;
        if (this.#openMenus.size > 0) return;

        const restore = !this.#skipFocusRestore && this.#menuSessionHadEditorFocus;
        this.#skipFocusRestore = false;
        this.#menuSessionHadEditorFocus = false;
        this.#releaseMenuFocus();
        if (restore) restoreEditorFocus(this.editor);
    };

    #onDocumentPointerDown = (event: PointerEvent): void => {
        if (this.#openMenus.size === 0) return;
        const path = event.composedPath();
        // In-panel item select: leave skipFocusRestore false so a warm session
        // can restore after the action (commands also pass focus explicitly).
        if ([...this.#openMenus].some((menu) => path.includes(menu))) {
            const onTrigger = path.some((node) => (
                node instanceof HTMLElement && node.getAttribute('slot') === 'trigger'
            ));
            // Trigger toggle — author is still on the toolbar; do not bounce
            // focus into the editor (visible field-focus flash on rapid toggle).
            if (onTrigger) this.#skipFocusRestore = true;
            return;
        }
        // Other toolbar or anywhere else in the CP: leave focus there.
        this.#skipFocusRestore = true;
    };

    #holdMenuFocus(): void {
        if (this.#menuFocusHeld || !this.editor) return;
        const body = resolveEditorBody(this.editor.view.dom);
        if (!body) return;
        setEditorFieldHasFocus(body, true);
        this.#menuFocusHeld = true;
    }

    #releaseMenuFocus(): void {
        if (!this.#menuFocusHeld || !this.editor) {
            this.#menuFocusHeld = false;
            return;
        }
        const body = resolveEditorBody(this.editor.view.dom);
        setEditorFieldHasFocus(body, false);
        this.#menuFocusHeld = false;
    }

    #onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== 'Escape') return;
        // PK menus handle their own Escape; restore runs via pk-open-change.
        const open = this.shadowRoot?.querySelector('pk-dropdown-menu[open], pk-dropdown-menu[aria-expanded="true"]');
        if (!open || !this.#menuSessionHadEditorFocus) return;
        // Belt: if open-change is slow, still schedule a safe restore.
        restoreEditorFocus(this.editor);
    };
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-toolbar': VizyToolbarElement;
    }
}
