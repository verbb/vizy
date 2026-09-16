import { DragDropManager, Draggable, Feedback, PointerActivationConstraints, PointerSensor } from '@dnd-kit/dom';

/**
 * Which of a builder's lists an item currently sits in.
 *
 * `available` is the palette — buttons and dropdowns in one row — and is a drag source only: it
 * accepts no drop, which is what makes dropping outside a list mean "put it back" rather than
 * "move it here". `active` is the toolbar and `members` is the selected dropdown's contents; both
 * take a drop, but only from themselves. See `#dropZones`.
 *
 * There were two palettes for a while, `available` and `dropdowns`, which is why the palette is
 * still asked about as a category rather than assumed to be the one list.
 *
 * `members` is a reorder-only zone, which is what is left of a much larger idea. Dragging
 * between it and the strip was tried, and it brought a rule with it for every pairing — what
 * happens to the last member, whether a dropdown can go inside a dropdown, where a member
 * dragged out ends up. All of it went when a dropdown's contents became a fixed roster a config
 * subtracts from: there is nothing to drag in, taking one out is a click, and reordering is the
 * only gesture left that means anything.
 */
export type ToolbarListName = 'available' | 'active' | 'members';

/** Whether a list is a palette, and so a source that items are copied out of. */
export function isPaletteList(name: ToolbarListName): boolean {
    return name === 'available';
}

export type ToolbarDrop = {
    itemId: string;
    /** The list the item was picked up from. */
    from: ToolbarListName;
    /** The list it was dropped into. */
    to: ToolbarListName;
    /** Position the item was picked up from, within `from`. */
    fromIndex: number;
    /** Position within the destination list. Meaningless when `to` is `available`. */
    index: number;
};

export type ToolbarDragListOptions = {
    /**
     * The builder panel. Resolved lazily because the consumer re-renders by replacing
     * innerHTML, which would leave an eagerly captured element detached.
     */
    container: () => HTMLElement | null;
    /**
     * Distinguishes one builder from another, so a bubble item can never be dropped
     * into the main toolbar.
     */
    type: string;
    availableList: () => HTMLElement | null;
    activeList: () => HTMLElement | null;
    /**
     * The open dropdown's member row, when one is open. Resolves to null the rest of the time,
     * and for the Bubble Menu builder always — it holds marks in a flat row and has no menus.
     */
    memberList?: () => HTMLElement | null;
    onDrop: (drop: ToolbarDrop) => void;
    /**
     * Called when a drag resolves to no change, so the host can rebuild both lists
     * from state.
     *
     * Not optional bookkeeping: the reserved slot is the real button, moved through
     * the toolbar as you drag. If the drop is then rejected, nothing puts it back, so
     * an abandoned add would leave a button sitting in the toolbar that no longer
     * matches the submitted value.
     */
    onRevert: () => void;
};

/**
 * Which way a list runs, and so which axis decides where an item lands.
 *
 * `inline` is a toolbar: a wrapping row, where the answer is a line and then a position along it.
 * `block` is the member menu: rows stacked downwards, so the roles of the two axes swap and the
 * "lines" degenerate to one per row. Both go through the same placement rule — a list is bands
 * along one axis and midpoints along the other, and only which axis is which changes.
 */
type ZoneAxis = 'inline' | 'block';

/**
 * One droppable list, measured as it rests, in coordinates relative to the list itself.
 *
 * Relative rather than viewport coordinates so that scrolling mid-drag cannot skew them:
 * the list's own origin is re-read whenever these are consulted.
 */
type ZoneGeometry = {
    element: HTMLElement;
    axis: ZoneAxis;
    peers: Array<{
        /** Which line of a wrapped strip it is on — or, in a menu, which row. */
        band: number;
        /**
         * Its centre along the axis the list runs, which is the boundary the pointer is judged
         * against: the horizontal centre in a toolbar, the vertical one in a menu.
         */
        middle: number;
        /** Its position in the list itself, which is not its position in this array. */
        index: number;
    }>;
    /**
     * The extent of each line of items across the axis the list *doesn't* run, so a pointer
     * position can be resolved to a line before it is resolved to a position within one.
     */
    bands: Array<{ start: number; end: number }>;
};

/** What a draggable button knows about itself. */
type ItemData = {
    itemId: string;
    list: ToolbarListName;
    /** Its position in the list it was registered from. */
    index: number;
    /**
     * Whether a toolbar may hold any number of this item — true only of the separator.
     * Such an item is inexhaustible, so picking one out of the palette does not use it
     * up and its button stays put for the whole drag.
     */
    repeatable: boolean;
};

/**
 * Drag-and-drop for the toolbar and Bubble Menu builders, on dnd-kit's `Draggable`.
 *
 * Four things differ from the block type list and are why this is separate:
 *
 * 1. The lists are horizontal and wrap — bar the member menu, which is a column — so neither
 *    axis can be restricted. See `ZoneAxis`.
 * 2. The `available` list is *derived* from state rather than ordered by the author,
 *    so a drop into it means "remove from the toolbar" and its index is ignored.
 * 3. A toolbar may hold several separators, so element IDs are positional and the real
 *    item ID travels in `data`.
 * 4. A drag can end in a click on the button it started from, which would then be acted on
 *    as an add or a remove. See `#draggedRecently`.
 *
 * ## Why this owns placement rather than using dnd-kit's sortable
 *
 * This began as two `Sortable` lists, leaning on `OptimisticSortingPlugin` to reorder
 * the DOM live so a gap opens where the item will land. That gap is the whole point of
 * the interaction, but sortable decides *where* to open it from which droppable the
 * drag currently collides with — and that is unstable here, because the gap is a real
 * 36px button. Opening one shifts every button after it, which changes which button the
 * pointer is over, which moves the gap again.
 *
 * Measured: with buttons resting at 36–72, 76–104, 108–144, 148–184 and 188–224, the
 * index changed at 36, 76, 116, 148, 188 and 228 — boundaries that line up with nothing
 * in particular, and at the left-hand end the slot flipped between two positions across
 * five pixels of travel. That is the "sporadic" placement.
 *
 * So placement is computed here instead, as the number of *other* buttons the pointer
 * has passed the midpoint of. That rule is a fixed point, which is what makes it
 * stable: inserting the slot at index `k` moves only the buttons from `k` onwards, and
 * moving them *away* from the pointer cannot bring an earlier midpoint back across it.
 * Feeding the answer back in therefore returns the same answer. It is also the rule
 * every toolbar builder uses — which side of this button am I on — so the boundaries
 * land exactly halfway between buttons, where the eye expects them.
 *
 * dnd-kit still owns the parts it is good at: pointer sensing, the drag lifecycle, and
 * positioning the button carried under the cursor. It registers no droppables at all
 * now, because nothing here asks it where the pointer is.
 */
export class ToolbarDragList {
    #manager: DragDropManager;
    #draggables: Draggable[] = [];
    #cleanup: Array<() => void> = [];
    #options: ToolbarDragListOptions;
    /**
     * Last pointer position seen on a move, tracked ourselves rather than read off the
     * drag operation. `operation.target` proved unusable: it lags the pointer and is
     * frequently `null` — or names an element in the *other* list — even when the item
     * has correctly resolved into the toolbar, which silently swallowed most drops.
     * The pointer's own coordinates are the one thing that cannot be stale.
     */
    #pointer = { x: 0, y: 0 };
    /** The button drawn under the cursor while dragging. See `#mountOverlay`. */
    #overlay: HTMLElement | null = null;
    /**
     * The real button being dragged. It never moves for the length of the drag — see
     * `#reserveSlot` for why the slot is a separate element rather than this one.
     */
    #sourceElement: HTMLElement | null = null;
    /** What the dragged button is, read once at `dragstart`. */
    #source: ItemData | null = null;
    /**
     * The dashed outline showing where the item will land: a copy of the source button,
     * in the toolbar only while the item would actually land there.
     */
    #slot: HTMLElement | null = null;
    /**
     * The index the slot is currently offering. Read at `dragend` rather than
     * recomputed, so the release lands exactly where the dashed outline was drawn.
     */
    #landingIndex = 0;
    /**
     * Which list the slot is currently in, read at `dragend` alongside the index. The two
     * together are the promise the outline made, and the release keeps it.
     */
    #landingZone: ToolbarListName = 'active';
    /**
     * Whether a drag has just finished, so the click it ends in can be swallowed.
     *
     * A press and release on the same button is a click even when the pointer went for a walk
     * in between, which it does whenever a drag ends back over its own source — dragging a
     * separator out and dropping it on the palette, most easily. Clicking a palette item adds
     * it, so that click added a second separator immediately after the drag placed the first.
     *
     * Only clicks on a builder button are swallowed, and the flag is cleared by any click, so
     * nothing else on the page can be affected by a drag that happened earlier.
     */
    #draggedRecently = false;
    /**
     * Where the pointer went down, kept because the carried copy is positioned
     * relative to it. Separate from `#pointer`, which has already moved on by the time
     * a drag begins — the sensor needs a few pixels of travel to tell a drag from a
     * click.
     */
    #grabPoint = { x: 0, y: 0 };

    /**
     * How far clear of the cursor the carried button sits, on both axes. Enough to see
     * the glyph past the pointer without the button feeling detached from it.
     */
    static #carryGap = 10;

    /**
     * How far the pointer must travel before a press counts as a drag.
     *
     * Without it a press *was* a drag: the button was torn out of the list, a slot opened and
     * the carried copy appeared, all before the pointer had moved a pixel. So clicking a
     * dropdown to edit it looked like the beginning of a move, and a click-and-hold on a
     * toolbar button showed the item being taken out from under the cursor.
     *
     * Small enough that a real drag still feels immediate, and large enough that a click with
     * the usual hand-tremor of a few pixels is still a click.
     */
    static #dragThreshold = 5;

    constructor(options: ToolbarDragListOptions) {
        this.#options = options;
        this.#manager = new DragDropManager({
            plugins: (defaults) => [...defaults, Feedback.configure({
                // No `feedback` mode is set, because `#mountOverlay` supplies an overlay
                // and dnd-kit's own lifting and placeholder are both bypassed when one
                // is present. The reserved slot comes from the source button staying in
                // the flow instead.
                //
                // No drop animation either: every outcome ends in the host rebuilding
                // both lists from state, so the element the animation wants to fly is
                // already gone.
                dropAnimation: null,
            })],
            // Deliberately unconstrained. Pinning the item inside the builder made it
            // fight the pointer at the edges, and it is no longer doing any work:
            // releasing outside the toolbar reverts, so leaving the container is a
            // legible way to abandon the drag rather than something to prevent.
            sensors: [
                PointerSensor.configure({
                    activationConstraints: [
                        new PointerActivationConstraints.Distance({
                            value: ToolbarDragList.#dragThreshold,
                        }),
                    ],
                }),
            ],
        });

        this.#bindEvents();
    }

    /** Rebuilds registrations against the current DOM. Safe to call every render. */
    refresh(): void {
        this.#unregister();
        this.#register(this.#options.availableList(), 'available');
        this.#register(this.#options.activeList(), 'active');
        this.#register(this.#memberList(), 'members');
    }

    #memberList(): HTMLElement | null {
        return this.#options.memberList?.() ?? null;
    }

    /** The palette, when there is one. A builder is not obliged to draw one. */
    #paletteLists(): HTMLElement[] {
        return [this.#options.availableList()].filter((list): list is HTMLElement => !!list);
    }

    /**
     * The lists this drag may be dropped into: the strip, or the open dropdown's members.
     *
     * Neither palette is among them, both being ordered by the catalog rather than by the
     * author — so a release over one means "take this out of use" rather than "put it here",
     * which is handled by there being no landing place at all.
     *
     * One or the other, never both, and which one depends on where the drag started. A member
     * drag can only reorder its own row and a strip drag can only reach the strip, because a
     * dropdown holds a fixed roster: nothing can be dragged into a menu, and dragging a member
     * out would have to mean "trim it", which is a click on the member instead.
     *
     * Scoped here rather than by rejecting the drop afterwards so the dashed slot never appears
     * somewhere the release will not honour. An outline that promises a landing place and then
     * declines it is indistinguishable from a bug.
     */
    #dropZones(): Array<{ name: ToolbarListName; element: HTMLElement }> {
        const zones: Array<{ name: ToolbarListName; element: HTMLElement }> = [];
        const members = this.#memberList();
        const fromMembers = this.#source?.list === 'members';

        if (fromMembers) {
            if (members) zones.push({ name: 'members', element: members });
            return zones;
        }

        const active = this.#options.activeList();
        if (active) zones.push({ name: 'active', element: active });

        return zones;
    }

    destroy(): void {
        this.#cleanup.forEach((cleanup) => cleanup());
        this.#cleanup = [];
        // The overlay lives on `<body>`, so it would outlive the component if a drag
        // were somehow in flight when this is torn down.
        this.#unmountOverlay();
        this.#unregister();
        this.#manager.destroy();
    }

    /**
     * Every button is a drag source and nothing is a drop target.
     *
     * The toolbar is the only place an item can land, and where in it is worked out
     * from the pointer rather than from a collision, so there is nothing for dnd-kit to
     * register a droppable against.
     */
    #register(list: HTMLElement | null, group: ToolbarListName): void {
        if (!list) return;

        this.#items(list).forEach((element, index) => {
            const itemId = element.dataset.toolbarItem;
            if (!itemId) return;

            this.#draggables.push(new Draggable<ItemData>({
                // Positional, because separators repeat and IDs must be unique.
                id: `${this.#options.type}-${group}-${index}-${itemId}`,
                element,
                type: this.#options.type,
                data: {
                    itemId,
                    list: group,
                    index,
                    repeatable: element.hasAttribute('data-toolbar-repeatable'),
                },
            }, this.#manager));
        });
    }

    /** A list's buttons, in the order they appear. */
    #items(list: HTMLElement): HTMLElement[] {
        return [...list.querySelectorAll<HTMLElement>('[data-toolbar-item]')];
    }

    /**
     * Where each droppable list's buttons sit with the dragged one taken out, taken once
     * at `dragstart`. See `#measureZones`.
     */
    #geometry = new Map<ToolbarListName, ZoneGeometry>();

    /**
     * Records where every droppable list's buttons sit with the dragged one out of the way.
     *
     * Placement has to be judged against a layout that does not itself depend on the
     * answer. The reserved slot is a real 36px button, so wherever it goes it pushes
     * every button from that point on 40px further from the pointer — and measuring the
     * disturbed row means each button's midpoint has already moved away by the time it
     * is compared against. The rule stays self-consistent, so it does not oscillate, but
     * it turns sticky: two adjacent positions are both valid across a 40px band, and
     * which one you get depends on the direction you came from. You would have to drag a
     * whole button's width past a gap before the slot agreed to move into it.
     *
     * Measured once because nothing in the toolbar moves during a drag except the slot,
     * and this is taken while the slot is collapsed, so these are the undisturbed
     * positions. Stored relative to the strip so that scrolling mid-drag cannot skew
     * them.
     */
    #measureZones(): void {
        this.#geometry.clear();

        for (const zone of this.#dropZones()) {
            this.#geometry.set(zone.name, this.#measureZone(zone.element, ToolbarDragList.#axisOf(zone.name)));
        }
    }

    /**
     * Which way a list runs. A menu of members is a column; every other list is a toolbar.
     *
     * Read from the list's name rather than its computed `flex-direction`, because it is a fact
     * about what the list *is* — the member menu is a preview of the editor's own dropdown, and
     * that is a column in both places — rather than about how it happens to be laid out. A
     * stylesheet change should not silently move which axis a drop is judged on.
     */
    static #axisOf(name: ToolbarListName): ZoneAxis {
        return name === 'members' ? 'block' : 'inline';
    }

    #measureZone(list: HTMLElement, axis: ZoneAxis): ZoneGeometry {
        const element = this.#sourceElement;
        const origin = list.getBoundingClientRect();
        const bands: Array<{ start: number; end: number }> = [];

        const peers = this.#items(list)
            // Mapped before filtering, so each peer keeps the index it has in the list
            // itself, which is one longer than this array whenever the drag started here.
            .map((peer, index) => ({ peer, index }))
            .filter(({ peer }) => peer !== element)
            .map(({ peer, index }) => {
                const rect = peer.getBoundingClientRect();
                // Across the axis the list runs for the band, along it for the midpoint. In a
                // toolbar that is top/bottom and the horizontal centre; in a menu the two swap,
                // and since every row shares a `left` they all collapse into a single band —
                // which is right, a menu having only one column to be a position within.
                const start = axis === 'inline' ? rect.top - origin.top : rect.left - origin.left;
                const end = axis === 'inline' ? rect.bottom - origin.top : rect.right - origin.left;
                const middle = axis === 'inline'
                    ? rect.left + rect.width / 2 - origin.left
                    : rect.top + rect.height / 2 - origin.top;

                // Buttons on one line share a `top` exactly, so anything more than a
                // hair's difference has wrapped onto the next. Compared against the
                // current band rather than collected and sorted, because DOM order is
                // layout order: lines arrive in order and never interleave.
                const current = bands.at(-1);
                if (!current || Math.abs(current.start - start) > 1) {
                    bands.push({ start, end });
                } else {
                    current.end = Math.max(current.end, end);
                }

                return { band: bands.length - 1, middle, index };
            });

        return { element: list, axis, peers, bands };
    }

    /**
     * Which row of buttons the pointer is aiming at.
     *
     * The nearest row, rather than the row whose box strictly contains `y`. Most of the
     * drop zone is not inside a button: the strip is padded, so there is a band a few
     * pixels deep along its top and bottom edge that is over no button at all — and the
     * carried copy sits down-right of the cursor, which puts the cursor near the top edge
     * for much of a normal drag.
     *
     * Testing `y` against each button's own box meant that in those bands the pointer
     * counted as being on a different line from *every* button. Above them all, nothing
     * had been passed and the slot snapped to the front of the strip; below them all,
     * everything had, and it snapped to the end. That is the "slightly off when moving
     * across the top and bottom" — the whole answer thrown away by a few pixels of
     * vertical travel. Resolving to the nearest row instead means a single-row toolbar
     * has exactly one answer whatever `y` does, which is what it should have.
     */
    #pointerBand(zone: ZoneGeometry, cross: number): number {
        let nearest = 0;
        let shortest = Infinity;

        zone.bands.forEach((band, index) => {
            const distance = cross < band.start ? band.start - cross : Math.max(0, cross - band.end);
            if (distance < shortest) {
                shortest = distance;
                nearest = index;
            }
        });

        return nearest;
    }

    /**
     * How many of the toolbar's other buttons the pointer has passed.
     *
     * The midpoint is the boundary, so the answer is "which side of this button am I
     * on" — which puts the boundaries exactly halfway between buttons, where the eye
     * expects them. Rows are checked before columns, because the toolbar wraps and
     * comparing `x` alone would place an item by its horizontal position on the wrong
     * line.
     *
     * Stops at the first button the pointer has not passed: DOM order is layout order,
     * so everything after it is further away still, and stopping makes the result a
     * single crossing point rather than a count that could disagree with itself.
     */
    #insertionIndex(zone: ZoneGeometry): number {
        // Back into the frame the resting positions were recorded in.
        const origin = zone.element.getBoundingClientRect();
        const offset = { x: this.#pointer.x - origin.left, y: this.#pointer.y - origin.top };
        // Along the axis the list runs, and across it. Swapped for a menu, where "further along"
        // is downwards — comparing `x` there would place a row by how far right the pointer sat.
        const along = zone.axis === 'inline' ? offset.x : offset.y;
        const band = this.#pointerBand(zone, zone.axis === 'inline' ? offset.y : offset.x);
        let index = 0;

        for (const peer of zone.peers) {
            // Whole lines before positions within one: everything on a line above has been
            // passed and everything on a line below has not, whatever the other axis says.
            const passed = peer.band < band ? true : peer.band > band ? false : along > peer.middle;

            if (!passed) break;
            index += 1;
        }

        return index;
    }

    /**
     * The dashed outline standing in for the item, created on demand.
     *
     * A copy of the source button rather than the button itself, which is the one
     * structural decision the rest of this class rests on. Using the real button meant it
     * had to be in two places at once as soon as an item was inexhaustible: a separator
     * may be added to a toolbar any number of times, so picking one up must leave its
     * palette button exactly where it was *and* still open a slot in the strip.
     *
     * Two things fall out of separating them, both worth having on their own:
     *
     * - The source button never moves for the whole drag, and dnd-kit positions the
     *   carried copy by measuring the source. Nothing it measures changes, so the carry
     *   offset cannot drift.
     * - The slot is added and removed rather than shown and hidden, so there is no state
     *   to keep in step — it either exists, at one index, or it does not.
     */
    #reserveSlot(): HTMLElement {
        if (this.#slot) return this.#slot;

        const source = this.#sourceElement as HTMLElement;
        const slot = source.cloneNode(true) as HTMLElement;
        // Decoration, and nothing a screen reader or another part of this class should
        // find: stripping `data-toolbar-item` also keeps it out of `#items`, so it can
        // never be mistaken for one of the buttons it is making room among.
        slot.removeAttribute('id');
        slot.removeAttribute('data-toolbar-item');
        slot.removeAttribute('aria-label');
        slot.removeAttribute('aria-describedby');
        slot.setAttribute('aria-hidden', 'true');
        // The source has already been lifted by the time this first runs, and a clone of a
        // lifted button is a hidden button of no width — an invisible slot reserving no
        // space, which is the whole gesture gone. Undone here rather than by cloning earlier,
        // so the slot does not depend on where in `dragstart` the lift happens to sit.
        slot.classList.remove('is-lifted');
        slot.style.marginInlineEnd = '';
        slot.classList.add('is-slot');

        this.#slot = slot;
        return slot;
    }

    /**
     * Puts the slot where the item would land, and records that index.
     *
     * The index is worth remembering because the release reads it back rather than
     * recomputing: what the outline promised is what happens.
     */
    #placeSlot(name: ToolbarListName, zone: ZoneGeometry): void {
        if (!this.#sourceElement) return;

        const list = zone.element;
        const index = this.#insertionIndex(zone);
        this.#landingZone = name;
        this.#landingIndex = index;

        // Past the last button, the tail is what the slot goes before. Appending to the
        // list itself would put it after the tail, which is stretched to fill the row,
        // and the slot would jump to the far right edge. A menu has no tail — there is no
        // leftover space in a column of full-width rows — so there it simply appends.
        const peers = this.#items(list).filter((item) => item !== this.#sourceElement);
        const anchor = peers[index] ?? list.querySelector<HTMLElement>('[data-builder-tail]');
        const slot = this.#reserveSlot();

        // Already in place. Worth checking because this runs on every pointer move, and
        // re-inserting an element the browser has to lay out again is needless churn.
        if (slot.parentElement === list && slot.nextElementSibling === anchor) return;

        list.insertBefore(slot, anchor ?? null);
    }

    /** Takes the slot away, without discarding it — the same drag may need it again. */
    #clearSlot(): void {
        if (!this.#slot?.isConnected) return;

        this.#slot.remove();
    }

    /**
     * Offers exactly one landing place, in exactly one list.
     *
     * A slot means "the item lands here", so there must not be one when the pointer is
     * over nothing that accepts a drop. That single rule covers two cases that look
     * separate: an item carried over a palette offers nothing, because those rows are
     * catalog-ordered and cannot be rearranged, and an item dragged off the strip to bin it
     * stops advertising a landing place at all.
     */
    #updateSlot(): void {
        if (!this.#sourceElement) return;

        const target = this.#zoneUnderPointer();
        if (!target) {
            this.#clearSlot();
            return;
        }

        this.#placeSlot(target.name, target.zone);
    }

    /**
     * The list the pointer is currently over, if it will take this item.
     *
     * Each zone is exactly the list's own box and nothing more. The strip's was briefly
     * widened to take in the slice of editor body drawn beneath it, on the theory that a
     * release landing just low should still add rather than silently discard — but that
     * body reads as the editor's content, not its toolbar, so offering to drop a button
     * into it was simply wrong.
     */
    #zoneUnderPointer(): { name: ToolbarListName; zone: ZoneGeometry } | null {
        for (const { name, element } of this.#dropZones()) {
            const rect = element.getBoundingClientRect();
            const inside = this.#pointer.x >= rect.left && this.#pointer.x <= rect.right
                && this.#pointer.y >= rect.top && this.#pointer.y <= rect.bottom;
            if (!inside) continue;

            const zone = this.#geometry.get(name);
            return zone ? { name, zone } : null;
        }

        return null;
    }

    /** Whether the slot is currently offering a landing place. */
    #landed(): boolean {
        return !!this.#slot?.isConnected;
    }

    /**
     * Takes the source button out of the row it was picked up from, so the row closes as
     * though the item had already left.
     *
     * Skipped for an inexhaustible item in the palette. A separator is always on offer
     * however many are in use, so taking its button away for the duration of a drag
     * would say the opposite — that you had just spent the only one.
     *
     * Collapsed by being made invisible and having its neighbours pulled over it, rather
     * than by being removed. It has to stay measurable at its real size and in its real
     * place: dnd-kit sizes the carried copy from measuring this element *and* derives the
     * copy's offset from the pointer from that same measurement, so anything that changes
     * what it measures moves the copy. See the stylesheet for the two obvious approaches
     * that both do exactly that.
     *
     * The margin is computed rather than hardcoded so separators, which are narrower,
     * collapse by their own width — and it is taken on whichever axis the list runs, so a menu
     * row closes the gap above the row below it rather than shrinking sideways into nothing.
     */
    #liftSource(): void {
        const element = this.#sourceElement;
        if (!element || this.#isInexhaustible()) return;

        element.classList.add('is-lifted');

        // Its own size along the list's axis, plus the gap that followed it, so the row closes
        // up exactly.
        const list = element.parentElement;
        const axis = ToolbarDragList.#axisOf(this.#source?.list ?? 'active');
        const styles = list ? getComputedStyle(list) : null;
        const gap = parseFloat((axis === 'inline' ? styles?.columnGap : styles?.rowGap) || '') || 0;
        const rect = element.getBoundingClientRect();
        const extent = axis === 'inline' ? rect.width : rect.height;

        element.style[axis === 'inline' ? 'marginInlineEnd' : 'marginBlockEnd'] = `-${extent + gap}px`;
    }

    /** Whether this drag is of an item the palette never runs out of. */
    #isInexhaustible(): boolean {
        return !!this.#source?.repeatable && isPaletteList(this.#source.list);
    }

    /**
     * Hands dnd-kit our own element to draw under the cursor, instead of letting it
     * lift the real button.
     *
     * This is what keeps the button's offset from the pointer constant. Left to itself,
     * dnd-kit lifts the real button into the top layer and positions it by re-measuring
     * it every frame, nudging it by `(firstFrameSize - currentSize) * grabPoint` so the
     * grab point stays under the pointer. But the element it measures is the one it has
     * just taken out of the flow, and for a drag out of the available list it measures
     * `0x0` for the first frames — so the nudge came to half a button, and cancelled
     * itself only once the element was relocated and forced an honest re-measure. That
     * was the button sliding out from under the cursor exactly as it reached the
     * toolbar, which is the worst possible moment for it.
     *
     * With an overlay the arithmetic is the same but the inputs are sound: dnd-kit
     * positions the overlay and measures the *source* button, which stays in the flow
     * at its natural size for the whole drag. The correction is therefore always zero,
     * and the grab point holds. It also means the source button is free to be moved
     * around the toolbar as the reserved slot without disturbing what the cursor
     * carries, because dnd-kit already compensates for the source moving.
     */
    #mountOverlay(sourceElement: HTMLElement): void {
        const feedback = this.#feedback();
        if (!feedback) return;

        // A copy, so the real button is left untouched in the list. Identifiers and the
        // drag library's own bookkeeping are stripped: this is a picture of a button,
        // and a second element answering to the same `id` or being announced to a
        // screen reader is not wanted.
        const overlay = sourceElement.cloneNode(true) as HTMLElement;
        overlay.removeAttribute('id');
        overlay.removeAttribute('aria-describedby');
        overlay.removeAttribute('aria-roledescription');
        overlay.setAttribute('aria-hidden', 'true');
        overlay.classList.add('is-drag-helper');

        // Carried down-right of the cursor, as Craft's CKEditor toolbar builder does,
        // so the pointer is not parked on top of the glyph you are trying to read.
        //
        // dnd-kit keeps whatever point of the button you grabbed under the pointer,
        // which means a fixed nudge would land differently depending on where you
        // happened to press — grab the right-hand edge and the button still ends up
        // under the cursor. So the grab point is cancelled out first, leaving a constant
        // gap from the pointer to the button's top-left corner however it was picked up.
        //
        // Applied through `transform` specifically: dnd-kit rewrites `top`, `left` and
        // `translate` every frame, but only ever sets an overlay's `transform` to
        // `none`, and `transform` composes with `translate` rather than replacing it.
        // Shifting this element is safe because where the item lands is decided from the
        // cursor, not from this element's box.
        const rect = sourceElement.getBoundingClientRect();
        const offsetX = this.#grabPoint.x - rect.left + ToolbarDragList.#carryGap;
        const offsetY = this.#grabPoint.y - rect.top + ToolbarDragList.#carryGap;
        overlay.style.setProperty('transform', `translate(${offsetX}px, ${offsetY}px)`, 'important');

        document.body.appendChild(overlay);
        this.#overlay = overlay;
        feedback.overlay = overlay;
    }

    /** The Feedback plugin instance, which owns the overlay. */
    #feedback(): Feedback | undefined {
        return this.#manager.plugins.find((plugin): plugin is Feedback => plugin instanceof Feedback);
    }

    #unmountOverlay(): void {
        const feedback = this.#feedback();
        if (feedback) feedback.overlay = undefined;

        this.#overlay?.remove();
        this.#overlay = null;
    }

    #bindEvents(): void {
        // Capture phase and `document`, so the position is current no matter what the
        // drag library does with the event afterwards.
        const trackPointer = (event: PointerEvent): void => {
            this.#pointer = { x: event.clientX, y: event.clientY };
            this.#updateSlot();
        };
        const trackGrab = (event: PointerEvent): void => {
            this.#grabPoint = { x: event.clientX, y: event.clientY };
            this.#pointer = { x: event.clientX, y: event.clientY };
        };

        // Deliberately no `pointerup`. The release honours the slot the last move put on
        // offer, so tracking the release position would only add a second, racier answer:
        // whether we or the drag library saw the event first would decide where — or
        // whether — the item landed.
        //
        // The click a drag leaves behind is swallowed, though. See `#draggedRecently`: capture
        // phase, because the click has to be stopped before the button's own handler runs.
        const swallowClick = (event: MouseEvent): void => {
            const onItem = event.target instanceof Element
                && event.target.closest('[data-toolbar-item]') !== null;

            if (this.#draggedRecently && onItem) {
                event.preventDefault();
                event.stopPropagation();
            }

            this.#draggedRecently = false;
        };

        document.addEventListener('pointerdown', trackGrab, true);
        document.addEventListener('pointermove', trackPointer, true);
        document.addEventListener('click', swallowClick, true);
        this.#cleanup.push(() => {
            document.removeEventListener('pointerdown', trackGrab, true);
            document.removeEventListener('pointermove', trackPointer, true);
            document.removeEventListener('click', swallowClick, true);
        });

        this.#cleanup.push(
            // Before `dragstart`, because dnd-kit decides whether to lift the real
            // button as soon as the operation begins; handing it the overlay after that
            // would mean a frame of the element being torn out of the list.
            this.#manager.monitor.addEventListener('beforedragstart', (event) => {
                const { source } = event.operation;
                if (source?.element instanceof HTMLElement) this.#mountOverlay(source.element);
            }),

            this.#manager.monitor.addEventListener('dragstart', (event) => {
                this.#options.container()?.classList.add('is-sorting');

                const { source } = event.operation;
                if (!(source?.element instanceof HTMLElement)) return;

                this.#sourceElement = source.element;
                this.#source = source.data as ItemData;
                this.#lockAvailableHeight();

                // Measured before lifting, and the order matters.
                //
                // These are the positions the placement rule compares against, and it excludes
                // the dragged button from them itself — so what is wanted is where its
                // neighbours sit while it is still there, not where they slide to once it is
                // gone. Measuring after the lift read every button after the source 40px closer
                // to the pointer than it appeared, which put the boundary for "have I passed
                // this one" inside the source's own box: grabbing a button anywhere past its
                // midpoint offered to move it one place along, before the pointer had moved at
                // all. Grabbing the same button at its leading edge behaved correctly, which is
                // what made the fault look positional rather than ordinal.
                this.#measureZones();
                this.#liftSource();

                // Settle the slot before the first move, so picking an item up out of the
                // palette takes it out immediately rather than a frame later.
                this.#updateSlot();
            }),

            this.#manager.monitor.addEventListener('dragend', (event) => {
                const source = this.#source;
                // Read before the reset below: these are what the panel was promising,
                // and the release is not allowed to promise anything else.
                const landed = this.#landed();
                const index = this.#landingIndex;
                const zone = this.#landingZone;

                this.#reset();
                // Set however the drag ended, including cancelled: the click follows the press,
                // not the outcome.
                this.#draggedRecently = true;

                if (!source?.itemId || event.canceled) {
                    this.#settle(this.#options.onRevert);
                    return;
                }

                // Landing somewhere is an add, a move or a reorder; landing nowhere takes
                // an item out of use and abandons a new one. That asymmetry is the point: a
                // half-finished add should leave no trace, while dragging a button off the
                // strip — or out of a dropdown — is how you get rid of it.
                if (!landed) {
                    if (isPaletteList(source.list)) {
                        this.#settle(this.#options.onRevert);
                        return;
                    }

                    this.#settle(() => this.#options.onDrop({
                        itemId: source.itemId,
                        from: source.list,
                        to: 'available',
                        fromIndex: source.index,
                        index: source.index,
                    }));
                    return;
                }

                // A reorder that ended where it started is not a change. Everything else
                // is, including a move between the strip and a dropdown.
                if (source.list === zone && index === source.index) {
                    this.#settle(this.#options.onRevert);
                    return;
                }

                this.#settle(() => this.#options.onDrop({
                    itemId: source.itemId,
                    from: source.list,
                    to: zone,
                    fromIndex: source.index,
                    index,
                }));
            }),
        );
    }

    /** Returns the panel to its resting state, whatever the drag's outcome. */
    #reset(): void {
        const container = this.#options.container();
        container?.classList.remove('is-sorting');
        // Queried rather than taken from `#sourceElement`, so a button left lifted by an
        // earlier drag that ended unusually is put right too.
        container?.querySelectorAll<HTMLElement>('.is-lifted').forEach((element) => {
            element.classList.remove('is-lifted');
            // The collapsing margin is an inline style, so it would survive a re-render that
            // reused this element rather than rebuilding it. Both axes, without asking which one
            // this drag used: whichever it was, neither should outlive it.
            element.style.marginInlineEnd = '';
            element.style.marginBlockEnd = '';
        });

        this.#clearSlot();
        this.#slot = null;
        this.#sourceElement = null;
        this.#source = null;
        this.#landingZone = 'active';
        this.#geometry.clear();
        this.#unlockAvailableHeight();
        this.#unmountOverlay();
    }

    /**
     * Runs a drag's outcome after the drag library has finished unwinding.
     *
     * Every outcome ends in the host rebuilding both lists from state, which replaces
     * the very elements dnd-kit still holds references to and unregisters the draggable
     * whose `dragend` we are inside. Tearing down a library's subscriptions from inside
     * its own event is a hazard whatever it happens to tolerate today, and a frame's
     * delay costs nothing next to the drop itself.
     */
    #settle(outcome: () => void): void {
        requestAnimationFrame(() => outcome());
    }

    /**
     * Pins both palettes' heights for the duration of a drag.
     *
     * Taking an item out of it closes the gap, which can un-wrap a row and pull everything
     * below it upwards — including the toolbar you are dragging towards. The drop target then
     * slides out from under the pointer mid-gesture, and a drop that looked aimed at the
     * toolbar lands on nothing. Freezing the height keeps the geometry still; the items inside
     * still reflow.
     */
    #lockAvailableHeight(): void {
        this.#paletteLists().forEach((list) => {
            list.style.minHeight = `${list.getBoundingClientRect().height}px`;
        });
    }

    #unlockAvailableHeight(): void {
        this.#paletteLists().forEach((list) => {
            list.style.minHeight = '';
        });
    }

    #unregister(): void {
        this.#draggables.forEach((draggable) => {
            draggable.unregister();
            draggable.destroy();
        });
        this.#draggables = [];
    }
}
