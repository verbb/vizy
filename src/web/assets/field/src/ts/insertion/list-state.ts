import type { AvailableInsertion } from './types';

/**
 * Keep the highlighted option across result refreshes when it still exists.
 * Otherwise clear — matches pk-combobox `autoHighlight=false` (index stays -1
 * until ArrowDown/Up), not “always fall back to first”.
 */
export function resolveActiveItemId(
    previousActiveId: string | null,
    results: readonly AvailableInsertion[],
): string | null {
    if (previousActiveId && results.some((entry) => entry.item.id === previousActiveId)) {
        return previousActiveId;
    }
    return null;
}

/**
 * Arrow navigation with no current highlight (null / -1): Down → first,
 * Up → last — same as pk-combobox `onListboxKeyDown` when `highlightedIndex < 0`.
 */
export function stepActiveItemId(
    activeId: string | null,
    results: readonly AvailableInsertion[],
    direction: 1 | -1,
): string | null {
    if (!results.length) return null;
    const index = activeId ? results.findIndex((entry) => entry.item.id === activeId) : -1;
    if (index < 0) {
        return direction === 1
            ? (results[0]?.item.id ?? null)
            : (results[results.length - 1]?.item.id ?? null);
    }
    const next = (index + direction + results.length) % results.length;
    return results[next]?.item.id ?? null;
}
