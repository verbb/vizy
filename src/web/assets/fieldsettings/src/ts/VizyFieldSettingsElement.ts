import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { repeat } from 'lit/directives/repeat.js';

import { BlockTypeSortableList } from './BlockTypeSortableList';

// Plugin Kit tokens must land on `:root` — component shadow styles read `var(--pk-*)`.
import '@verbb/plugin-kit-web/tokens.css';
import '@verbb/plugin-kit-web/components/button';
import '@verbb/plugin-kit-web/components/combobox';
import '@verbb/plugin-kit-web/components/dropdown-menu';
import '@verbb/plugin-kit-web/components/icon';
import '@verbb/plugin-kit-web/components/lightswitch';
import '@verbb/plugin-kit-web/components/select';
import '@verbb/plugin-kit-web/components/tooltip';

import { registerIcons } from '@verbb/plugin-kit-icons';
import {
    arrowDown,
    arrowUp,
    ellipsis,
    gripMove,
    penToSquare,
    plus,
    xmark,
} from '@verbb/plugin-kit-icons';

import { BLOCK_TYPE_FALLBACK_ICON, registerBlockTypeFallbackIcon } from '../../../shared/block-type-icon';
import './field-settings.css';

// The registry starts empty; register only what this screen renders rather than
// pulling in the whole icon set.
registerBlockTypeFallbackIcon();
registerIcons({
    'arrow-down': arrowDown,
    'arrow-up': arrowUp,
    'ellipsis': ellipsis,
    'grip-move': gripMove,
    'pen-to-square': penToSquare,
    'plus': plus,
    'xmark': xmark,
});

/** Sentinel option value for the combobox's "create a new block type" row. */
const CREATE_OPTION = '__vizy_new__';

type BlockTypeSummary = {
    uid: string;
    name: string;
    handle: string;
    icon: string | null;
    iconSvg: string | null;
    color: string | null;
    template: string | null;
    missing?: boolean;
};

type PickerGroup = {
    id: string;
    name: string;
    blockTypeUids: string[];
    disabledBlockTypeUids: string[];
};

type ConfiguratorState = {
    groups: PickerGroup[];
    blockTypes: Record<string, BlockTypeSummary>;
    availableBlockTypes: BlockTypeSummary[];
};

type CraftGlobals = typeof window & {
    Craft?: {
        t: (category: string, message: string, params?: Record<string, unknown>) => string;
        CpScreenSlideout?: new (action: string, settings?: Record<string, unknown>) => {
            on: (event: string, handler: (ev: SlideoutSubmitEvent) => void) => void;
        };
    };
};

type SlideoutSubmitEvent = {
    data?: Record<string, unknown>;
    response?: { data?: Record<string, unknown> };
};

function t(message: string, params: Record<string, unknown> = {}): string {
    return (window as CraftGlobals).Craft?.t('vizy', message, params) ?? message;
}

class VizyFieldSettingsElement extends LitElement {
    /**
     * Light DOM on purpose. The hidden picker inputs have to belong to the
     * surrounding Craft field settings form, and inputs inside a shadow root are
     * not submitted with it. Plugin Kit components keep their own shadow roots,
     * so they stay encapsulated regardless.
     */
    protected createRenderRoot(): HTMLElement {
        return this;
    }

    #state: ConfiguratorState = { groups: [], blockTypes: {}, availableBlockTypes: [] };
    #pickerGroupsInputName = 'blockTypePickerGroups';

    connectedCallback(): void {
        super.connectedCallback();

        this.#pickerGroupsInputName = this.getAttribute('data-picker-groups-name') ?? this.#pickerGroupsInputName;

        const initial = this.getAttribute('data-initial');
        if (initial) {
            this.#state = JSON.parse(initial) as ConfiguratorState;
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.#sortable?.destroy();
        this.#sortable = null;
    }

    firstUpdated(): void {
        this.#initSortable();
    }

    /**
     * Rows are recreated on most renders, so registrations are rebuilt against
     * the current DOM rather than tracked incrementally. Never during a drag —
     * refresh mid-gesture unregisters the source sortable and locks the row.
     */
    updated(): void {
        if (this.#sortable?.isDragging()) return;

        this.#sortable?.refresh();
    }

    // Mutations
    // =========================================================================

    #group(groupId: string): PickerGroup | undefined {
        return this.#state.groups.find((group) => group.id === groupId);
    }

    #changed(): void {
        this.requestUpdate();
    }

    addGroup(): void {
        const name = window.prompt(t('Group name'), '');
        if (name === null) return;

        const id = crypto.randomUUID();
        this.#state.groups.push({
            id,
            name: t('Blocks'),
            blockTypeUids: [],
            disabledBlockTypeUids: [],
        });
        this.renameGroup(id, name);
    }

    deleteGroup(groupId: string): void {
        const group = this.#group(groupId);
        if (!group) return;

        if (group.blockTypeUids.length > 0
            && !confirm(t('Remove the “{name}” group? Its block types will no longer be available in this field, but the global block types are not deleted.', { name: group.name }))) {
            return;
        }

        this.#state.groups = this.#state.groups.filter((entry) => entry.id !== groupId);
        this.#changed();
    }

    renameGroup(groupId: string, name: string): void {
        const group = this.#group(groupId);
        if (!group) return;
        group.name = name.trim() === '' ? t('Blocks') : name.trim();
        this.#changed();
    }

    moveGroup(groupId: string, delta: number): void {
        const index = this.#state.groups.findIndex((group) => group.id === groupId);
        const target = index + delta;
        if (index === -1 || target < 0 || target >= this.#state.groups.length) return;

        const [group] = this.#state.groups.splice(index, 1);
        this.#state.groups.splice(target, 0, group);
        this.#changed();
    }

    addExistingBlock(groupId: string, uid: string): void {
        const group = this.#group(groupId);
        if (!group || this.#usedBlockTypeUids().has(uid)) return;

        const summary = this.#state.availableBlockTypes.find((entry) => entry.uid === uid)
            ?? this.#state.blockTypes[uid];
        if (!summary) return;

        this.#state.blockTypes[uid] = { ...summary };
        if (!group.blockTypeUids.includes(uid)) {
            group.blockTypeUids.push(uid);
        }
        this.#changed();
    }

    removeBlock(uid: string): void {
        const group = this.#state.groups.find((entry) => entry.blockTypeUids.includes(uid));
        if (!group) return;

        group.blockTypeUids = group.blockTypeUids.filter((entry) => entry !== uid);
        group.disabledBlockTypeUids = group.disabledBlockTypeUids.filter((entry) => entry !== uid);
        this.#changed();
    }

    /**
     * Field-local availability. Membership is deliberately untouched so the block
     * type keeps its group and position, and existing authored content of this
     * type continues to resolve and validate.
     */
    setBlockAvailability(uid: string, available: boolean): void {
        const group = this.#state.groups.find((entry) => entry.blockTypeUids.includes(uid));
        if (!group) return;

        const disabled = new Set(group.disabledBlockTypeUids);
        if (available) {
            disabled.delete(uid);
        } else {
            disabled.add(uid);
        }
        group.disabledBlockTypeUids = [...disabled];
        this.#changed();
    }

    /**
     * Steps a block one position within its own group. Deliberately does not
     * cross into an adjacent group at the boundary — that would make the same
     * menu item mean two different things depending on position. Moving between
     * groups is the drag handle's job.
     */
    nudgeBlock(uid: string, delta: number): void {
        const group = this.#state.groups.find((entry) => entry.blockTypeUids.includes(uid));
        if (!group) return;

        const index = group.blockTypeUids.indexOf(uid);
        const target = index + delta;
        if (target < 0 || target >= group.blockTypeUids.length) return;

        const [moved] = group.blockTypeUids.splice(index, 1);
        group.blockTypeUids.splice(target, 0, moved);
        this.#changed();
    }

    /** Moves a block within, or between, groups. */
    moveBlock(uid: string, targetGroupId: string, targetIndex: number): void {
        const source = this.#state.groups.find((group) => group.blockTypeUids.includes(uid));
        const target = this.#group(targetGroupId);
        if (!source || !target) return;

        const from = source.blockTypeUids.indexOf(uid);
        source.blockTypeUids.splice(from, 1);

        // Removing first shifts later positions in the same group down by one.
        let index = targetIndex;
        if (source === target && from < targetIndex) {
            index -= 1;
        }
        target.blockTypeUids.splice(Math.max(0, Math.min(index, target.blockTypeUids.length)), 0, uid);

        // Availability travels with the block type across groups.
        if (source !== target && source.disabledBlockTypeUids.includes(uid)) {
            source.disabledBlockTypeUids = source.disabledBlockTypeUids.filter((entry) => entry !== uid);
            target.disabledBlockTypeUids.push(uid);
        }

        this.#changed();
    }

    // Slideouts
    // =========================================================================

    /**
     * Global Block Types are edited in a Craft slideout, never inline, so it is
     * visually obvious the change is not scoped to this field. On save we patch
     * the picker from the response instead of reloading, which would discard the
     * rest of the unsaved field settings.
     */
    #openBlockTypeSlideout(uid: string | null, addToGroupId: string | null, name?: string): void {
        const Craft = (window as CraftGlobals).Craft;
        if (!Craft?.CpScreenSlideout) return;

        const params: Record<string, string> = {};
        if (uid) {
            params.uid = uid;
        } else if (name) {
            // Seeds the new Block Type form with the name typed into the combobox.
            params.name = name;
        }

        // Remember which group launched a create flow so submit can auto-add the
        // saved type without another combobox pick.
        const createForGroupId = uid ? null : addToGroupId;

        const slideout = new Craft.CpScreenSlideout('vizy/block-types/edit', { params });

        slideout.on('submit', (event) => {
            const saved = this.#blockTypeFromSlideoutSubmit(event);
            if (!saved?.uid) return;

            this.#patchBlockTypeSummary(saved);

            if (createForGroupId) {
                this.addExistingBlock(createForGroupId, saved.uid);
            } else {
                this.#changed();
            }
        });
    }

    #patchBlockTypeSummary(saved: BlockTypeSummary): void {
        this.#state.blockTypes[saved.uid] = saved;

        const existing = this.#state.availableBlockTypes.findIndex((entry) => entry.uid === saved.uid);
        if (existing === -1) {
            this.#state.availableBlockTypes.push(saved);
        } else {
            this.#state.availableBlockTypes[existing] = saved;
        }
    }

    /**
     * Craft's slideout puts the saved model on `event.data`, but also keep
     * `response.data.blockType` as a fallback for the explicit summary payload.
     */
    #blockTypeFromSlideoutSubmit(event: SlideoutSubmitEvent): BlockTypeSummary | undefined {
        const candidates: unknown[] = [
            event.data,
            event.response?.data?.blockType,
            event.data?.blockType,
        ];

        for (const candidate of candidates) {
            if (!candidate || typeof candidate !== 'object') continue;
            const record = candidate as Record<string, unknown>;
            const uid = record.uid;
            if (typeof uid !== 'string' || uid === '') continue;

            return {
                uid,
                name: typeof record.name === 'string' ? record.name : uid,
                handle: typeof record.handle === 'string' ? record.handle : '',
                icon: typeof record.icon === 'string' ? record.icon : null,
                iconSvg: typeof record.iconSvg === 'string' ? record.iconSvg : null,
                color: typeof record.color === 'string' ? record.color : null,
                template: typeof record.template === 'string' ? record.template : null,
                missing: record.missing === true ? true : undefined,
            };
        }

        return undefined;
    }

    // Derived state
    // =========================================================================

    #usedBlockTypeUids(): Set<string> {
        return new Set(this.#state.groups.flatMap((group) => group.blockTypeUids));
    }

    #unusedBlockTypes(): BlockTypeSummary[] {
        const used = this.#usedBlockTypeUids();
        return this.#state.availableBlockTypes.filter((entry) => !used.has(entry.uid));
    }

    #isDisabled(uid: string): boolean {
        return this.#state.groups.some((group) => group.disabledBlockTypeUids.includes(uid));
    }

    // Drag and drop
    // =========================================================================

    /**
     * dnd-kit reorders the DOM optimistically during a drag, so after a drop the
     * DOM no longer matches the order Lit last rendered. `repeat()` diffs against
     * its own cached order and would compute moves from that stale baseline, so
     * bumping this revision discards the affected list and rebuilds it from
     * state instead. The rebuilt markup is identical to what dnd-kit left on
     * screen, so there is nothing to see.
     */
    #sortRevision = 0;

    #sortable: BlockTypeSortableList | null = null;

    /**
     * Commits a completed drag. Separate from `moveBlock` because only a drop
     * needs the rebuild — menu-driven moves leave the DOM in the order Lit last
     * rendered, so they can diff normally.
     */
    applySortResult(uid: string, groupId: string, index: number): void {
        this.#sortRevision += 1;
        this.moveBlock(uid, groupId, index);
    }

    #initSortable(): void {
        const container = this.querySelector<HTMLElement>('.vizy-configurator');
        if (!container) return;

        this.#sortable = new BlockTypeSortableList({
            container,
            groupLists: () => [...this.querySelectorAll<HTMLElement>('[data-group-list]')],
            rowSelector: '[data-block-row]',
            handleSelector: '[data-drag-handle]',
            emptyGroupLabel: t('No block types yet.'),
            onReorder: (uid, groupId, index) => this.applySortResult(uid, groupId, index),
        });

        this.#sortable.refresh();
    }

    // Rendering
    // =========================================================================

    /**
     * Availability first, then identity, then the drag handle and overflow menu
     * together at the trailing edge.
     */
    #blockRow(group: PickerGroup, uid: string, index: number): TemplateResult {
        const summary = this.#state.blockTypes[uid];
        const name = summary?.name ?? uid;
        const disabled = this.#isDisabled(uid);
        const missing = summary?.missing === true;

        const classes = [
            'vizy-block-row',
            disabled ? 'is-disabled' : '',
            missing ? 'is-missing' : '',
            summary?.color ? 'has-color' : '',
        ].filter(Boolean).join(' ');

        const accentStyle = summary?.color
            ? `--vizy-block-accent-color: ${summary.color}`
            : '';

        return html`
            <li
                class=${classes}
                data-block-row=${uid}
                style=${accentStyle}
            >
                <pk-lightswitch
                    class="vizy-block-row-switch"
                    size="sm"
                    ?checked=${!disabled}
                    label=${t('Available in this field')}
                    @pk-change=${(event: Event) => {
                const lightswitch = event.target as HTMLElement & { checked: boolean };
                this.setBlockAvailability(uid, lightswitch.checked);
            }}
                ></pk-lightswitch>

                <button
                    type="button"
                    class="vizy-block-row-main"
                    aria-label=${t('Edit block type')}
                    @click=${() => this.#openBlockTypeSlideout(uid, null)}
                >
                    ${summary?.iconSvg
                ? html`<span class="vizy-block-row-icon" .innerHTML=${summary.iconSvg}></span>`
                : html`<span class="vizy-block-row-icon"><pk-icon icon=${BLOCK_TYPE_FALLBACK_ICON} label=""></pk-icon></span>`}

                    <span class="vizy-block-row-text">
                        <span class="vizy-block-row-name">${name}</span>
                        <span class="vizy-block-row-meta code">${summary?.handle ?? ''}</span>
                    </span>

                    ${missing ? html`<span class="vizy-block-row-warning">${t('Missing')}</span>` : nothing}
                </button>

                <span class="vizy-block-row-grip" data-drag-handle>
                    <pk-icon icon="grip-move" label=${t('Drag to reorder')}></pk-icon>
                </span>

                <pk-dropdown-menu
                    size="sm"
                    @pk-select=${(event: CustomEvent<{ value?: string }>) => {
                this.#onBlockMenuSelect(uid, event.detail?.value);
            }}
                >
                    <pk-button
                        slot="trigger"
                        type="button"
                        variant="transparent"
                        size="sm"
                    >
                        <pk-icon slot="start" icon="ellipsis" label=${t('Block type actions')}></pk-icon>
                    </pk-button>

                    <pk-dropdown-item value="edit">
                        <pk-icon slot="start" icon="pen-to-square"></pk-icon>
                        ${t('Edit')}
                    </pk-dropdown-item>
                    <pk-dropdown-separator></pk-dropdown-separator>
                    <pk-dropdown-item value="move-up" ?disabled=${index === 0}>
                        <pk-icon slot="start" icon="arrow-up"></pk-icon>
                        ${t('Move up')}
                    </pk-dropdown-item>
                    <pk-dropdown-item value="move-down" ?disabled=${index === group.blockTypeUids.length - 1}>
                        <pk-icon slot="start" icon="arrow-down"></pk-icon>
                        ${t('Move down')}
                    </pk-dropdown-item>
                    <pk-dropdown-separator></pk-dropdown-separator>
                    <pk-dropdown-item value="delete" destructive>
                        <pk-icon slot="start" icon="xmark"></pk-icon>
                        ${t('Delete')}
                    </pk-dropdown-item>
                </pk-dropdown-menu>
            </li>
        `;
    }

    #onBlockMenuSelect(uid: string, value?: string): void {
        if (value === 'edit') this.#openBlockTypeSlideout(uid, null);
        if (value === 'move-up') this.nudgeBlock(uid, -1);
        if (value === 'move-down') this.nudgeBlock(uid, 1);
        if (value === 'delete') this.removeBlock(uid);
    }

    /** Group controls: rename inline, reorder and delete from one overflow menu. */
    #groupSection(group: PickerGroup, groupIndex: number): TemplateResult {
        const isFirst = groupIndex === 0;
        const isLast = groupIndex === this.#state.groups.length - 1;

        return html`
            <section class="vizy-block-group">
                <header class="vizy-block-group-header">
                    <h3 class="vizy-block-group-name">${group.name}</h3>

                    <pk-dropdown-menu
                        size="sm"
                        @pk-select=${(event: CustomEvent<{ value?: string }>) => {
                // The menu re-dispatches the item's selection on itself,
                // carrying the chosen item's value in `detail`.
                this.#onGroupMenuSelect(group.id, event.detail?.value);
            }}
                    >
                        <pk-button
                            slot="trigger"
                            type="button"
                            variant="transparent"
                            size="sm"
                        >
                            <pk-icon slot="start" icon="ellipsis" label=${t('Group actions')}></pk-icon>
                        </pk-button>

                        <pk-dropdown-item value="rename">
                            <pk-icon slot="start" icon="pen-to-square"></pk-icon>
                            ${t('Rename')}
                        </pk-dropdown-item>
                        <pk-dropdown-separator></pk-dropdown-separator>
                        <pk-dropdown-item value="move-up" ?disabled=${isFirst}>
                            <pk-icon slot="start" icon="arrow-up"></pk-icon>
                            ${t('Move up')}
                        </pk-dropdown-item>
                        <pk-dropdown-item value="move-down" ?disabled=${isLast}>
                            <pk-icon slot="start" icon="arrow-down"></pk-icon>
                            ${t('Move down')}
                        </pk-dropdown-item>
                        <pk-dropdown-separator></pk-dropdown-separator>
                        <pk-dropdown-item value="delete" destructive>
                            <pk-icon slot="start" icon="xmark"></pk-icon>
                            ${t('Delete')}
                        </pk-dropdown-item>
                    </pk-dropdown-menu>
                </header>

                ${keyed(`${group.id}:${this.#sortRevision}`, html`
                    <ul class="vizy-block-rows" data-group-list=${group.id}>
                        ${repeat(
                group.blockTypeUids,
                (uid) => uid,
                (uid, index) => this.#blockRow(group, uid, index),
            )}

                        ${group.blockTypeUids.length === 0
                    ? html`
                                <li
                                    class="vizy-block-group-dropzone"
                                    data-empty-placeholder=${group.id}
                                >
                                    <span class="vizy-block-group-dropzone-label">
                                        ${t('No block types yet.')}
                                    </span>
                                    <span data-no-drag hidden></span>
                                </li>
                            `
                    : nothing}
                    </ul>
                `)}

                <div class="vizy-block-group-footer">
                    ${this.#blockTypeCombobox(group)}
                </div>
            </section>
        `;
    }

    #onGroupMenuSelect(groupId: string, value?: string): void {
        if (value === 'rename') this.#promptRename(groupId);
        if (value === 'move-up') this.moveGroup(groupId, -1);
        if (value === 'move-down') this.moveGroup(groupId, 1);
        if (value === 'delete') this.deleteGroup(groupId);
    }

    /**
     * Deliberately a native prompt. A group name is a single string with no
     * validation, so a bespoke dialog would be more UI than the interaction
     * warrants.
     */
    #promptRename(groupId: string): void {
        const group = this.#group(groupId);
        if (!group) return;

        const name = window.prompt(t('Group name'), group.name);
        if (name === null) return;

        this.renameGroup(groupId, name);
    }

    /**
     * One control for both paths, because adding a block type is the common
     * action: create a new global type, or pick an existing one that this field
     * is not already offering.
     */
    #blockTypeCombobox(group: PickerGroup): TemplateResult {
        const unused = this.#unusedBlockTypes();

        return html`
            <pk-combobox
                class="vizy-block-picker"
                popup-mode
                allow-create
                search-placeholder=${t('Search block types…')}
                placeholder=${t('Add a block type')}
                empty-message=${t('No other block types available.')}
                .value=${''}
                @pk-change=${(event: Event) => {
                const combobox = event.target as HTMLElement & { value: string };
                const value = combobox.value;
                if (value === '') return;

                // Reset immediately: this is an action picker, not a bound value.
                combobox.value = '';

                if (value === CREATE_OPTION) {
                    this.#openBlockTypeSlideout(null, group.id);
                } else {
                    this.addExistingBlock(group.id, value);
                }
            }}
                @pk-create=${(event: Event) => {
                // Typing a name that matches nothing creates a global Block
                // Type, seeded with what was typed.
                event.preventDefault();
                const typed = (event as unknown as { inputValue: string }).inputValue ?? '';
                (event.target as HTMLElement & { value: string }).value = '';
                this.#openBlockTypeSlideout(null, group.id, typed.trim() || undefined);
            }}
            >
                <pk-option value=${CREATE_OPTION} label=${t('New block type')}>
                    ${t('+ New block type')}
                </pk-option>

                ${repeat(
                unused,
                (entry) => entry.uid,
                (entry) => html`
                        <pk-option value=${entry.uid} label=${entry.name}>
                            ${entry.name}
                        </pk-option>
                    `,
            )}
            </pk-combobox>
        `;
    }

    render(): TemplateResult {
        return html`
            <div class="vizy-configurator">
                ${repeat(
            this.#state.groups,
            (group) => group.id,
            (group, index) => this.#groupSection(group, index),
        )}

                <pk-button
                    type="button"
                    variant="dashed"
                    class="vizy-add-group"
                    @click=${() => this.addGroup()}
                >
                    <pk-icon slot="start" icon="plus"></pk-icon>
                    ${t('Add Group')}
                </pk-button>
            </div>

            ${this.#pickerInputs()}
        `;
    }

    /**
     * Groups are posted as hidden inputs rather than one JSON blob so Craft's
     * normal namespaced field-settings POST handling applies unchanged.
     */
    #pickerInputs(): TemplateResult {
        const name = this.#pickerGroupsInputName;

        return html`
            <div class="vizy-picker-sync" hidden>
                ${this.#state.groups.map((group, groupIndex) => html`
                    <input type="hidden" name="${name}[${groupIndex}][name]" .value=${group.name}>
                    ${group.blockTypeUids.map((uid) => html`
                        <input type="hidden" name="${name}[${groupIndex}][blockTypeUids][]" value=${uid}>
                    `)}
                    ${group.disabledBlockTypeUids.map((uid) => html`
                        <input type="hidden" name="${name}[${groupIndex}][disabledBlockTypeUids][]" value=${uid}>
                    `)}
                `)}
            </div>
        `;
    }
}

if (!customElements.get('vizy-field-settings')) {
    customElements.define('vizy-field-settings', VizyFieldSettingsElement);
}

export { VizyFieldSettingsElement };

declare global {
    interface HTMLElementTagNameMap {
        'vizy-field-settings': VizyFieldSettingsElement;
    }
}
