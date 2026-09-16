import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { AutoScroller, DragDropManager, Feedback } from '@dnd-kit/dom';
import { RestrictToElement } from '@dnd-kit/dom/modifiers';
import { Sortable, isSortable } from '@dnd-kit/dom/sortable';

/** Shared `type`/`accept` pair, so a row can only ever drop into a group list. */
const BLOCK_TYPE = 'vizy-block-type';

export type BlockTypeSortableListOptions = {
    /** Drag is constrained to this element, so a row cannot be flung across the CP. */
    container: HTMLElement;
    /** Resolves the group lists currently in the DOM, in render order. */
    groupLists: () => HTMLElement[];
    rowSelector: string;
    handleSelector: string;
    containerDraggingClass?: string;
    rowDraggingClass?: string;
    /** Copy for drop zones injected while a group's last row is mid-drag. */
    emptyGroupLabel: string;
    /** Called once per committed drop that actually changes position. */
    onReorder: (uid: string, groupId: string, index: number) => void;
};

/**
 * Multi-group sortable list for the block type configurator, built on dnd-kit.
 *
 * Two things differ from a single-list sortable, and both are why this wrapper
 * exists rather than being inlined:
 *
 * 1. Rows move *between* groups, so every row shares one `group`-aware manager
 *    and we read the resolved `group` off the source on drop, not the group it
 *    started in.
 * 2. Empty groups have no rows to collide with. They keep a visual drop zone in
 *    the DOM, but that zone is **not** registered as a Sortable — a stand-in
 *    Sortable made OptimisticSortingPlugin treat it as a real above/below peer
 *    and also stole collisions from within-group reorders. Empty-group drops are
 *    committed from our own pointer hit test instead (same lesson as the Editor
 *    Config toolbar builder).
 *
 * dnd-kit's `OptimisticSortingPlugin` reorders the DOM during the drag, which is
 * what produces the shift-out-of-the-way animation. Callers rendering with a
 * keyed template must therefore rebuild the list after `onReorder` rather than
 * diffing against it — see `VizyFieldSettingsElement`.
 */
export class BlockTypeSortableList {
    #manager: DragDropManager;
    #sortables: Sortable[] = [];
    #cleanup: Array<() => void> = [];
    #options: BlockTypeSortableListOptions;
    /** Drop zone highlighted while a row hovers an empty group. */
    #activeDropzone: HTMLElement | null = null;
    /** True between dragstart and dragend — callers must not refresh mid-drag. */
    #dragging = false;
    /** Groups that had exactly one row when the current drag started. */
    #singleRowDragGroups = new Set<string>();
    /** Latest pointer position while dragging — empty-group drops use this. */
    #pointer = { x: 0, y: 0 };
    /**
     * Empty group under the pointer. Decided by geometry, not dnd-kit's
     * operation.target — that signal is unreliable for empty lists.
     */
    #emptyGroupDrop: { groupId: string } | null = null;

    constructor(options: BlockTypeSortableListOptions) {
        this.#options = options;
        this.#manager = new DragDropManager({
            // Drop animation off — see DECISIONS. AutoScroller off: this
            // configurator is short and fits the CP form; mid-drag page scroll
            // desyncs clientY from getBoundingClientRect and empty-group hit
            // tests miss. Feedback kept for the during-drag lift.
            plugins: (defaults) => [
                ...defaults.filter((plugin) => plugin !== AutoScroller),
                Feedback.configure({ dropAnimation: null }),
            ],
            modifiers: (defaults) => [
                ...defaults,
                // Rows are full width and stacked, so horizontal movement is noise.
                RestrictToVerticalAxis,
                RestrictToElement.configure({
                    element: () => this.#options.container,
                }),
            ],
        });

        this.#bindEvents();
    }

    /** Whether a row drag is in progress. Lit must not refresh() during this. */
    isDragging(): boolean {
        return this.#dragging;
    }

    /** @internal Reserved-dropzone sync for unit tests — do not call in production. */
    __testSyncReservedDropzones(): void {
        this.#syncReservedDropzones();
    }

    /** @internal Marks a group as single-row for unit tests — do not call in production. */
    __testTrackSingleRowGroup(groupId: string): void {
        this.#singleRowDragGroups.add(groupId);
    }

    /** @internal Sets the tracked empty-group drop for unit tests — do not call in production. */
    __testSetEmptyGroupDrop(groupId: string): void {
        this.#emptyGroupDrop = { groupId };
    }

    /** @internal Runs empty-group hit testing for unit tests — do not call in production. */
    __testHitTestEmptyGroup(x: number, y: number): string | null {
        this.#pointer = { x, y };
        return this.#hitTestEmptyGroup()?.groupId ?? null;
    }

    /** Rebuilds registrations against the current DOM. Safe to call every render. */
    refresh(): void {
        if (this.#dragging) return;

        this.#unregister();

        this.#options.groupLists().forEach((list) => {
            const groupId = list.dataset.groupList;
            if (!groupId) return;

            // Empty-group drop zones stay in the DOM for hit-testing and affordance,
            // but are deliberately not Sortables — see class docblock.
            this.#rows(list).forEach((row, index) => {
                const uid = row.dataset.blockRow;
                if (!uid) return;

                const handle = row.querySelector(this.#options.handleSelector);

                this.#sortables.push(new Sortable({
                    id: uid,
                    element: row,
                    index,
                    group: groupId,
                    type: BLOCK_TYPE,
                    accept: BLOCK_TYPE,
                    handle: handle instanceof HTMLElement ? handle : undefined,
                    data: { uid, groupId },
                }, this.#manager));
            });
        });
    }

    destroy(): void {
        this.#cleanup.forEach((cleanup) => cleanup());
        this.#cleanup = [];
        this.#removeInjectedDropzones();
        this.#unregister();
        this.#manager.destroy();
    }

    #rows(list: HTMLElement): HTMLElement[] {
        return [...list.querySelectorAll<HTMLElement>(this.#options.rowSelector)]
            .filter((row) => !row.hasAttribute('data-dnd-placeholder'));
    }

    #listForGroup(groupId: string): HTMLElement | null {
        return this.#options.container.querySelector<HTMLElement>(`[data-group-list="${groupId}"]`);
    }

    /**
     * Injects a reserved empty-group drop zone without a Lit re-render. When
     * `pending`, the zone stays in the DOM but hidden until the last real row
     * leaves the list — so the panel never collapses mid-drag. Visual only;
     * drops are decided by `#hitTestEmptyGroup`.
     */
    #injectReservedDropzone(groupId: string, pending: boolean): void {
        const list = this.#listForGroup(groupId);
        if (!list) return;

        // Lit-rendered empty groups already carry a stand-in.
        if (list.querySelector('[data-empty-placeholder]:not([data-drag-reserved])')) return;

        let dropzone = list.querySelector<HTMLElement>('[data-drag-reserved]');
        if (!dropzone) {
            dropzone = document.createElement('li');
            dropzone.className = 'vizy-block-group-dropzone is-reserved';
            dropzone.dataset.emptyPlaceholder = groupId;
            dropzone.dataset.dragReserved = 'true';
            dropzone.innerHTML = `
                <span class="vizy-block-group-dropzone-label"></span>
            `;
            dropzone.querySelector('.vizy-block-group-dropzone-label')!.textContent = this.#options.emptyGroupLabel;
            list.appendChild(dropzone);
        }

        dropzone.classList.toggle('is-pending', pending);
    }

    #syncReservedDropzones(): void {
        for (const groupId of this.#singleRowDragGroups) {
            const list = this.#listForGroup(groupId);
            const pending = !list || this.#rows(list).length > 0;
            this.#injectReservedDropzone(groupId, pending);
        }
    }

    #removeInjectedDropzones(): void {
        this.#options.container
            .querySelectorAll('[data-drag-reserved]')
            .forEach((dropzone) => dropzone.remove());
    }

    /**
     * Pointer-over empty group, using the whole group card as the target so
     * dropping on the header/footer still lands. A visible
     * `[data-empty-placeholder]` marks the group (including reserved zones
     * revealed after the last row leaves).
     */
    #hitTestEmptyGroup(): { groupId: string; dropzone: HTMLElement } | null {
        for (const list of this.#options.groupLists()) {
            const groupId = list.dataset.groupList;
            if (!groupId) continue;

            const dropzone = list.querySelector<HTMLElement>(
                '[data-empty-placeholder]:not(.is-pending)',
            );
            if (!dropzone) continue;

            // Whole card, not just the 44px strip — matches where authors aim.
            const hitTarget = list.closest('.vizy-block-group') ?? list;
            const rect = hitTarget.getBoundingClientRect();
            if (
                this.#pointer.x >= rect.left
                && this.#pointer.x <= rect.right
                && this.#pointer.y >= rect.top
                && this.#pointer.y <= rect.bottom
            ) {
                return { groupId, dropzone };
            }
        }

        return null;
    }

    /** Highlights the empty-zone under the pointer; clears when the pointer leaves. */
    #syncEmptyGroupHighlight(hit: { groupId: string; dropzone: HTMLElement } | null): void {
        this.#emptyGroupDrop = hit ? { groupId: hit.groupId } : null;

        const dropzone = hit?.dropzone ?? null;
        if (this.#activeDropzone !== dropzone) {
            this.#activeDropzone?.classList.remove('is-drop-target');
            dropzone?.classList.add('is-drop-target');
            this.#activeDropzone = dropzone;
        }
    }

    #bindEvents(): void {
        const containerClass = this.#options.containerDraggingClass ?? 'is-sorting';
        const rowClass = this.#options.rowDraggingClass ?? 'is-dragging';

        // Document capture, same model as ToolbarDragList. Client coordinates only —
        // do not read operation.position (not reliably client space; it was clearing
        // empty-group hits while the real pointer sat over the card).
        const trackPointer = (event: PointerEvent | MouseEvent): void => {
            this.#pointer = { x: event.clientX, y: event.clientY };
            if (!this.#dragging) return;

            this.#syncReservedDropzones();
            this.#syncEmptyGroupHighlight(this.#hitTestEmptyGroup());
        };

        document.addEventListener('pointermove', trackPointer, true);
        document.addEventListener('mousemove', trackPointer, true);
        this.#cleanup.push(() => {
            document.removeEventListener('pointermove', trackPointer, true);
            document.removeEventListener('mousemove', trackPointer, true);
        });

        this.#cleanup.push(
            this.#manager.monitor.addEventListener('dragstart', (event) => {
                this.#dragging = true;
                this.#emptyGroupDrop = null;
                this.#options.container.classList.add(containerClass);

                const native = event.nativeEvent;
                if (native && 'clientX' in native) {
                    this.#pointer = {
                        x: (native as PointerEvent).clientX,
                        y: (native as PointerEvent).clientY,
                    };
                }

                const { source } = event.operation;
                if (isSortable(source) && source.element instanceof HTMLElement) {
                    source.element.classList.add(rowClass);

                    const groupId = source.data?.groupId;
                    if (typeof groupId === 'string') {
                        const list = this.#listForGroup(groupId);
                        const rows = list ? this.#rows(list) : [];
                        if (rows.length === 1 && rows[0] === source.element) {
                            this.#singleRowDragGroups.add(groupId);
                        }
                    }
                }

                // Register the reserved zone immediately (hidden while the row is
                // still present) so the list never hits 0px between DOM moves.
                queueMicrotask(() => {
                    if (this.#dragging) {
                        this.#syncReservedDropzones();
                    }
                });
            }),

            this.#manager.monitor.addEventListener('dragend', (event) => {
                // Honour the last hit test — release may not fire another move.
                const emptyDrop = this.#emptyGroupDrop ?? this.#hitTestEmptyGroup();
                this.#emptyGroupDrop = null;
                this.#dragging = false;
                this.#singleRowDragGroups.clear();
                this.#removeInjectedDropzones();
                this.#options.container.classList.remove(containerClass);
                this.#clearDropzones();
                this.#options.container
                    .querySelectorAll(this.#options.rowSelector)
                    .forEach((row) => row.classList.remove(rowClass));

                const { source } = event.operation;
                if (event.canceled || !isSortable(source)) return;

                if (emptyDrop) {
                    this.#options.onReorder(String(source.id), emptyDrop.groupId, 0);
                    return;
                }

                const { initialIndex, index, initialGroup, group } = source.sortable;
                if (initialIndex === index && initialGroup === group) return;

                const uid = String(source.id);
                if (typeof group === 'string') {
                    this.#options.onReorder(uid, group, index);
                }
            }),
        );
    }

    #clearDropzones(): void {
        this.#activeDropzone?.classList.remove('is-drop-target');
        this.#activeDropzone = null;
        this.#options.container
            .querySelectorAll('[data-empty-placeholder].is-drop-target')
            .forEach((zone) => zone.classList.remove('is-drop-target'));
    }

    #unregister(): void {
        this.#sortables.forEach((sortable) => {
            sortable.unregister();
            sortable.destroy();
        });
        this.#sortables = [];
    }
}
