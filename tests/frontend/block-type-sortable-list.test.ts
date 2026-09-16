import { beforeEach, describe, expect, it } from 'vitest';

import { BlockTypeSortableList } from '../../src/web/assets/fieldsettings/src/ts/BlockTypeSortableList';

function mountSortableFixture(): {
    container: HTMLElement;
    listA: HTMLElement;
    listB: HTMLElement;
    sortable: BlockTypeSortableList;
} {
    document.body.innerHTML = `
        <div class="vizy-configurator">
            <section class="vizy-block-group">
                <ul class="vizy-block-rows" data-group-list="group-a">
                    <li class="vizy-block-row" data-block-row="row-a">
                        <span data-drag-handle></span>
                    </li>
                </ul>
            </section>
            <section class="vizy-block-group">
                <ul class="vizy-block-rows" data-group-list="group-b">
                    <li class="vizy-block-group-dropzone" data-empty-placeholder="group-b">
                        <span class="vizy-block-group-dropzone-label">No block types yet.</span>
                        <span data-no-drag hidden></span>
                    </li>
                </ul>
            </section>
        </div>
    `;

    const container = document.querySelector<HTMLElement>('.vizy-configurator')!;
    const listA = container.querySelector<HTMLElement>('[data-group-list="group-a"]')!;
    const listB = container.querySelector<HTMLElement>('[data-group-list="group-b"]')!;

    const sortable = new BlockTypeSortableList({
        container,
        groupLists: () => [...container.querySelectorAll<HTMLElement>('[data-group-list]')],
        rowSelector: '[data-block-row]',
        handleSelector: '[data-drag-handle]',
        emptyGroupLabel: 'No block types yet.',
        onReorder: () => {},
    });

    sortable.refresh();

    return { container, listA, listB, sortable };
}

describe('BlockTypeSortableList reserved empty-group drop zones', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('injects a pending reserved drop zone while the sole row is still in the list', () => {
        const { listA, sortable } = mountSortableFixture();

        sortable.__testTrackSingleRowGroup('group-a');
        sortable.__testSyncReservedDropzones();

        const dropzone = listA.querySelector<HTMLElement>('[data-drag-reserved]');
        expect(dropzone).not.toBeNull();
        expect(dropzone?.classList.contains('is-pending')).toBe(true);
    });

    it('ignores dnd-kit lift placeholders when deciding the list is empty', () => {
        const { listA, sortable } = mountSortableFixture();

        sortable.__testTrackSingleRowGroup('group-a');
        listA.querySelector('[data-block-row="row-a"]')!.remove();

        const liftPlaceholder = document.createElement('li');
        liftPlaceholder.className = 'vizy-block-row';
        liftPlaceholder.dataset.blockRow = 'row-a';
        liftPlaceholder.setAttribute('data-dnd-placeholder', 'hidden');
        listA.appendChild(liftPlaceholder);

        sortable.__testSyncReservedDropzones();

        const dropzone = listA.querySelector<HTMLElement>('[data-drag-reserved]');
        expect(dropzone?.classList.contains('is-pending')).toBe(false);
    });

    it('reveals the reserved drop zone once the last real row leaves the list', () => {
        const { listA, sortable } = mountSortableFixture();

        sortable.__testTrackSingleRowGroup('group-a');
        listA.querySelector('[data-block-row="row-a"]')!.remove();
        sortable.__testSyncReservedDropzones();

        expect(listA.querySelector('.vizy-block-group-dropzone.is-reserved[data-empty-placeholder="group-a"]')).not.toBeNull();
        expect(listA.querySelector('[data-drag-reserved]')?.classList.contains('is-pending')).toBe(false);
    });

    it('hit-tests empty groups by the whole card, not dnd-kit target', () => {
        const { listB, sortable } = mountSortableFixture();
        const card = listB.closest('.vizy-block-group') as HTMLElement;

        // happy-dom has no layout; stub the card geometry the hit test reads.
        card.getBoundingClientRect = () => ({
            x: 100, y: 200, width: 400, height: 80,
            top: 200, right: 500, bottom: 280, left: 100,
            toJSON() { return this; },
        });

        expect(sortable.__testHitTestEmptyGroup(120, 220)).toBe('group-b');
        expect(sortable.__testHitTestEmptyGroup(80, 220)).toBeNull();
    });
});
