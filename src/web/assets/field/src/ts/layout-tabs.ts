import type { FieldHostRecord } from './registries';

/** Craft's FieldLayoutForm wraps each layout tab in a sibling `.flex-fields` pane. */
const PANE_SELECTOR = ':scope > .flex-fields';

/**
 * Stamp each Craft layout pane with a stable tab index for Vizy Block header.
 * Single-tab layouts leave the UI empty (Hyper-style).
 */
export function stampLayoutTabIndexes(root: HTMLElement): number {
    const panes = [...root.querySelectorAll(PANE_SELECTOR)];
    panes.forEach((pane, index) => {
        if (pane instanceof HTMLElement) {
            pane.dataset.vizyLayoutTabIndex = String(index);
        }
    });
    return panes.length;
}

/** Show one layout tab's Craft panes inside the Block's FieldLayout host. */
export function selectLayoutTab(
    record: FieldHostRecord,
    index: number,
    _blockHost?: ParentNode | null,
): void {
    for (const pane of record.root.querySelectorAll(PANE_SELECTOR)) {
        if (!(pane instanceof HTMLElement)) continue;
        const tabIndex = Number(pane.dataset.vizyLayoutTabIndex ?? '0');
        pane.classList.toggle('hidden', tabIndex !== index);
    }
}
