import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { VizyFieldSettingsElement } from '../../src/web/assets/fieldsettings/src/ts/VizyFieldSettingsElement';
import { installElementInternalsShim } from './support/element-internals';

// Must run before Plugin Kit's form-associated components are constructed.
installElementInternalsShim();

const TYPE_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const TYPE_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const TYPE_C = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

type SlideoutSubmitEvent = {
    data?: Record<string, unknown>;
    response?: { data?: Record<string, unknown> };
};

function summary(uid: string, name: string, handle: string) {
    return {
        uid,
        name,
        handle,
        icon: null,
        iconSvg: null,
        color: null,
        template: null,
    };
}

function initialState() {
    return {
        groups: [
            { id: 'group-1', name: 'Content', blockTypeUids: [TYPE_A, TYPE_B], disabledBlockTypeUids: [] },
            { id: 'group-2', name: 'Layout', blockTypeUids: [], disabledBlockTypeUids: [] },
        ],
        blockTypes: {
            [TYPE_A]: summary(TYPE_A, 'Alpha', 'alpha'),
            [TYPE_B]: summary(TYPE_B, 'Beta', 'beta'),
        },
        availableBlockTypes: [
            summary(TYPE_A, 'Alpha', 'alpha'),
            summary(TYPE_B, 'Beta', 'beta'),
            summary(TYPE_C, 'Gamma', 'gamma'),
        ],
    };
}

/** Serialized picker groups, as the surrounding Craft form would receive them. */
function postedGroups(element: VizyFieldSettingsElement): Array<{
    name: string;
    blockTypeUids: string[];
    disabledBlockTypeUids: string[];
}> {
    const groups: Record<string, { name: string; blockTypeUids: string[]; disabledBlockTypeUids: string[] }> = {};

    element.querySelectorAll<HTMLInputElement>('input[type="hidden"]').forEach((input) => {
        const match = input.name.match(/^blockTypePickerGroups\[(\d+)\]\[(\w+)\]/);
        if (!match) return;

        const [, index, key] = match;
        groups[index] ??= { name: '', blockTypeUids: [], disabledBlockTypeUids: [] };

        if (key === 'name') {
            groups[index].name = input.value;
        } else if (key === 'blockTypeUids') {
            groups[index].blockTypeUids.push(input.value);
        } else if (key === 'disabledBlockTypeUids') {
            groups[index].disabledBlockTypeUids.push(input.value);
        }
    });

    return Object.keys(groups).sort((a, b) => Number(a) - Number(b)).map((key) => groups[key]);
}

/** Mirrors how pk-dropdown-menu re-dispatches an item selection on itself. */
function selectMenu(menu: Element, value: string): void {
    menu.dispatchEvent(new CustomEvent('pk-select', {
        detail: { value },
        bubbles: true,
        composed: true,
    }));
}

function selectBlockMenu(element: VizyFieldSettingsElement, uid: string, value: string): void {
    const menu = element.querySelector(`[data-block-row="${uid}"] pk-dropdown-menu`);
    if (!menu) throw new Error(`No row menu for ${uid}`);
    selectMenu(menu, value);
}

function selectGroupMenu(element: VizyFieldSettingsElement, groupIndex: number, value: string): void {
    // Group menus are the direct header children, so skip the per-row menus.
    const menus = element.querySelectorAll('.vizy-block-group-header pk-dropdown-menu');
    selectMenu(menus[groupIndex], value);
}

async function mount(): Promise<VizyFieldSettingsElement> {
    document.body.innerHTML = '';

    const element = document.createElement('vizy-field-settings');
    element.setAttribute('data-initial', JSON.stringify(initialState()));
    element.setAttribute('data-picker-groups-name', 'blockTypePickerGroups');
    document.body.append(element);

    await (element as VizyFieldSettingsElement).updateComplete;

    return element as VizyFieldSettingsElement;
}

describe('vizy field settings configurator', () => {
    beforeAll(async () => {
        // Importing registers the custom element (and the Plugin Kit components
        // it composes) as a side effect.
        await import('../../src/web/assets/fieldsettings/src/ts/VizyFieldSettingsElement');
    });

    let element: VizyFieldSettingsElement;

    beforeEach(async () => {
        element = await mount();
    });

    it('renders into light DOM so picker inputs post with the field settings form', () => {
        expect(element.shadowRoot).toBeNull();
        expect(element.querySelectorAll('input[type="hidden"]').length).toBeGreaterThan(0);
    });

    it('serializes groups, membership and field-local availability', () => {
        expect(postedGroups(element)).toEqual([
            { name: 'Content', blockTypeUids: [TYPE_A, TYPE_B], disabledBlockTypeUids: [] },
            { name: 'Layout', blockTypeUids: [], disabledBlockTypeUids: [] },
        ]);
    });

    it('orders row controls as availability, identity, then grip and overflow menu', () => {
        const row = element.querySelector(`[data-block-row="${TYPE_A}"]`);
        const tags = [...(row?.children ?? [])].map((child) => child.tagName.toLowerCase());

        expect(tags).toEqual(['pk-lightswitch', 'button', 'span', 'pk-dropdown-menu']);
    });

    it('offers edit, reorder and delete for each block type', () => {
        const menu = element.querySelector(`[data-block-row="${TYPE_A}"] pk-dropdown-menu`);
        const items = [...(menu?.querySelectorAll('pk-dropdown-item') ?? [])];

        expect(items.map((item) => item.getAttribute('value')))
            .toEqual(['edit', 'move-up', 'move-down', 'delete']);
        // First row in its group cannot move up; delete is marked destructive.
        expect(items[1].hasAttribute('disabled')).toBe(true);
        expect(items[2].hasAttribute('disabled')).toBe(false);
        expect(items[3].hasAttribute('destructive')).toBe(true);
    });

    it('nudges a block type down through its row menu', async () => {
        selectBlockMenu(element, TYPE_A, 'move-down');
        await element.updateComplete;

        expect(postedGroups(element)[0].blockTypeUids).toEqual([TYPE_B, TYPE_A]);
    });

    it('deletes a block type through its row menu', async () => {
        selectBlockMenu(element, TYPE_B, 'delete');
        await element.updateComplete;

        expect(postedGroups(element)[0].blockTypeUids).toEqual([TYPE_A]);
    });

    it('never nudges a block type out of its own group', async () => {
        // TYPE_A is already first in group-1; group-2 must stay empty.
        selectBlockMenu(element, TYPE_A, 'move-up');
        await element.updateComplete;

        const groups = postedGroups(element);
        expect(groups[0].blockTypeUids).toEqual([TYPE_A, TYPE_B]);
        expect(groups[1].blockTypeUids).toEqual([]);
    });

    it('disabling a block type keeps its membership and position', async () => {
        element.setBlockAvailability(TYPE_A, false);
        await element.updateComplete;

        expect(postedGroups(element)[0]).toEqual({
            name: 'Content',
            blockTypeUids: [TYPE_A, TYPE_B],
            disabledBlockTypeUids: [TYPE_A],
        });
    });

    it('removing a block type drops it from membership and availability', async () => {
        element.setBlockAvailability(TYPE_A, false);
        element.removeBlock(TYPE_A);
        await element.updateComplete;

        expect(postedGroups(element)[0]).toEqual({
            name: 'Content',
            blockTypeUids: [TYPE_B],
            disabledBlockTypeUids: [],
        });
    });

    it('carries availability with a block type moved between groups', async () => {
        element.setBlockAvailability(TYPE_B, false);
        element.moveBlock(TYPE_B, 'group-2', 0);
        await element.updateComplete;

        const groups = postedGroups(element);
        expect(groups[0]).toEqual({ name: 'Content', blockTypeUids: [TYPE_A], disabledBlockTypeUids: [] });
        expect(groups[1]).toEqual({ name: 'Layout', blockTypeUids: [TYPE_B], disabledBlockTypeUids: [TYPE_B] });
    });

    it('reorders within a group without duplicating membership', async () => {
        element.moveBlock(TYPE_A, 'group-1', 2);
        await element.updateComplete;

        expect(postedGroups(element)[0].blockTypeUids).toEqual([TYPE_B, TYPE_A]);
    });

    it('reorders groups, which reorders the posted indexes', async () => {
        element.moveGroup('group-2', -1);
        await element.updateComplete;

        expect(postedGroups(element).map((group) => group.name)).toEqual(['Layout', 'Content']);
    });

    it('falls back to a default name when a group is renamed to blank', async () => {
        element.renameGroup('group-1', '   ');
        await element.updateComplete;

        expect(postedGroups(element)[0].name).toBe('Blocks');
    });

    it('prompts for a name when adding a group', async () => {
        const prompt = vi.spyOn(window, 'prompt').mockReturnValue('Media');

        element.addGroup();
        await element.updateComplete;

        expect(postedGroups(element).map((group) => group.name)).toEqual(['Content', 'Layout', 'Media']);

        prompt.mockRestore();
    });

    it('does not add a group when the add prompt is cancelled', async () => {
        const prompt = vi.spyOn(window, 'prompt').mockReturnValue(null);

        element.addGroup();
        await element.updateComplete;

        expect(postedGroups(element).map((group) => group.name)).toEqual(['Content', 'Layout']);

        prompt.mockRestore();
    });

    it('patches the picker after a new block type slideout save', async () => {
        const TYPE_D = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
        const submitHandlers: Array<(event: SlideoutSubmitEvent) => void> = [];

        (window as typeof window & { Craft?: unknown }).Craft = {
            t: (_category: string, message: string) => message,
            CpScreenSlideout: class {
                on(event: string, handler: (event: SlideoutSubmitEvent) => void): void {
                    if (event === 'submit') submitHandlers.push(handler);
                }
            },
        };

        const combobox = element.querySelector('pk-combobox')!;
        Object.assign(combobox, { value: '__vizy_new__' });
        combobox.dispatchEvent(new CustomEvent('pk-change', {
            bubbles: true,
            composed: true,
        }));

        expect(submitHandlers.length).toBe(1);

        const summary = {
            uid: TYPE_D,
            name: 'Delta',
            handle: 'delta',
            icon: null,
            iconSvg: null,
            color: null,
            template: null,
        };

        submitHandlers[0]({
            response: { data: { blockType: summary } },
            data: {},
        });

        await element.updateComplete;

        expect(postedGroups(element)[0].blockTypeUids).toContain(TYPE_D);
        expect(element.querySelector(`[data-block-row="${TYPE_D}"]`)).not.toBeNull();

        const values = [...combobox.querySelectorAll('pk-option')]
            .map((option) => option.getAttribute('value'));
        // Delta was added to the first group, so it should not remain in the picker.
        expect(values).toEqual(['__vizy_new__', TYPE_C]);
    });

    it('offers only block types this field is not already using', () => {
        const combobox = element.querySelector('pk-combobox');
        const values = [...(combobox?.querySelectorAll('pk-option') ?? [])]
            .map((option) => option.getAttribute('value'));

        // The create sentinel leads, then only the unused global type.
        expect(values).toEqual(['__vizy_new__', TYPE_C]);
    });

    it('adds an existing block type once and never twice', async () => {
        element.addExistingBlock('group-2', TYPE_C);
        element.addExistingBlock('group-1', TYPE_C);
        await element.updateComplete;

        const groups = postedGroups(element);
        expect(groups[1].blockTypeUids).toEqual([TYPE_C]);
        expect(groups[0].blockTypeUids).not.toContain(TYPE_C);
    });

    it('escapes block type and group names rather than interpolating markup', async () => {
        element.renameGroup('group-1', '<img src=x onerror=alert(1)>');
        await element.updateComplete;

        expect(element.querySelector('img')).toBeNull();
        expect(postedGroups(element)[0].name).toBe('<img src=x onerror=alert(1)>');
    });

    it('drives group reordering from the overflow menu selection', async () => {
        selectGroupMenu(element, 1, 'move-up');
        await element.updateComplete;

        expect(postedGroups(element).map((group) => group.name)).toEqual(['Layout', 'Content']);
    });

    it('offers rename, reorder and delete for each group', () => {
        const menus = element.querySelectorAll('.vizy-block-group-header pk-dropdown-menu');
        const items = [...menus[0].querySelectorAll('pk-dropdown-item')];

        expect(items.map((item) => item.getAttribute('value')))
            .toEqual(['rename', 'move-up', 'move-down', 'delete']);
        // First group cannot move up; delete is marked destructive.
        expect(items[1].hasAttribute('disabled')).toBe(true);
        expect(items[3].hasAttribute('destructive')).toBe(true);
    });

    it('gives the group and block type menus the same shape and iconography', () => {
        // Both menus are the same kind of overflow control, so they read as one
        // pattern: primary action, reorder pair, then delete, split by separators.
        const shape = (menu: Element) => [...menu.children]
            .filter((child) => child.tagName.startsWith('PK-DROPDOWN-'))
            .map((child) => (child.tagName === 'PK-DROPDOWN-SEPARATOR'
                ? '---'
                : `${child.getAttribute('value')}:${child.querySelector('pk-icon')?.getAttribute('icon')}`));

        const group = element.querySelector('.vizy-block-group-header pk-dropdown-menu')!;
        const row = element.querySelector(`[data-block-row="${TYPE_A}"] pk-dropdown-menu`)!;

        expect(shape(group)).toEqual([
            'rename:pen-to-square',
            '---',
            'move-up:arrow-up',
            'move-down:arrow-down',
            '---',
            'delete:xmark',
        ]);

        // Identical but for the primary action's own label.
        expect(shape(row)).toEqual(shape(group).map((entry) => entry.replace('rename:', 'edit:')));
    });

    it('renames a group through the menu, from a plain label', async () => {
        // The group name is presentational until renamed, matching Matrix.
        expect(element.querySelector('.vizy-block-group-name')?.textContent?.trim()).toBe('Content');
        expect(element.querySelector('pk-input')).toBeNull();

        const prompt = vi.spyOn(window, 'prompt').mockReturnValue('Editorial');

        selectGroupMenu(element, 0, 'rename');
        await element.updateComplete;

        expect(prompt).toHaveBeenCalledWith('Group name', 'Content');
        expect(postedGroups(element)[0].name).toBe('Editorial');

        prompt.mockRestore();
    });

    it('leaves the group name untouched when a rename is cancelled', async () => {
        const prompt = vi.spyOn(window, 'prompt').mockReturnValue(null);

        selectGroupMenu(element, 0, 'rename');
        await element.updateComplete;

        expect(postedGroups(element)[0].name).toBe('Content');

        prompt.mockRestore();
    });

    it('drops a group and everything it offered', async () => {
        element.deleteGroup('group-2');
        await element.updateComplete;

        expect(postedGroups(element).map((group) => group.name)).toEqual(['Content']);
    });

    it('exposes the hooks dnd-kit registers against, including for an empty group', () => {
        const lists = [...element.querySelectorAll<HTMLElement>('[data-group-list]')];

        // Every group is addressable, so an emptied group stays a drop target.
        expect(lists.map((list) => list.dataset.groupList)).toEqual(['group-1', 'group-2']);

        const handles = element.querySelectorAll('[data-block-row] [data-drag-handle]');
        expect(handles.length).toBe(2);
    });

    it('renders an empty group as a drop zone rather than a block row', () => {
        const emptyList = element.querySelector('[data-group-list="group-2"]')!;

        expect(emptyList.querySelector('.vizy-block-group-dropzone[data-empty-placeholder="group-2"]')).not.toBeNull();
        expect(emptyList.querySelector('[data-block-row]')).toBeNull();
    });

    it('leaves the gesture entirely to dnd-kit rather than native HTML5 drag', () => {
        expect(element.querySelectorAll('[draggable="true"]').length).toBe(0);
    });

    it('rebuilds the rendered order from state after a drop that reordered the DOM', async () => {
        const list = element.querySelector<HTMLElement>('[data-group-list="group-1"]')!;
        const rows = [...list.querySelectorAll<HTMLElement>('[data-block-row]')];

        // Stand in for dnd-kit's optimistic sort, which moves the row in the DOM
        // before we ever hear about the drop.
        list.insertBefore(rows[1], rows[0]);

        element.applySortResult(TYPE_B, 'group-1', 0);
        await element.updateComplete;

        const rendered = [...element.querySelectorAll<HTMLElement>('[data-group-list="group-1"] [data-block-row]')]
            .map((row) => row.dataset.blockRow);

        // Rendered order and posted order must agree; a stale keyed diff would
        // put these two out of step.
        expect(rendered).toEqual([TYPE_B, TYPE_A]);
        expect(postedGroups(element)[0].blockTypeUids).toEqual([TYPE_B, TYPE_A]);
    });

    it('rebuilds both lists after a drop that moved a row across groups', async () => {
        const source = element.querySelector<HTMLElement>('[data-group-list="group-1"]')!;
        const target = element.querySelector<HTMLElement>('[data-group-list="group-2"]')!;
        target.append(source.querySelector<HTMLElement>(`[data-block-row="${TYPE_A}"]`)!);

        element.applySortResult(TYPE_A, 'group-2', 0);
        await element.updateComplete;

        const rendered = (groupId: string) => [
            ...element.querySelectorAll<HTMLElement>(`[data-group-list="${groupId}"] [data-block-row]`),
        ].map((row) => row.dataset.blockRow);

        expect(rendered('group-1')).toEqual([TYPE_B]);
        expect(rendered('group-2')).toEqual([TYPE_A]);
        expect(postedGroups(element).map((group) => group.blockTypeUids)).toEqual([[TYPE_B], [TYPE_A]]);
    });
});
