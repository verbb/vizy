/**
 * Persist list vs grid for the Blocks Add panel, keyed by Craft field handle.
 * Same Craft-{systemUid} prefix pattern as collapsed Block storage.
 */

export type BlockInsertView = 'list' | 'grid';
export type BlockPickerDisplay = 'both' | BlockInsertView;

const STORAGE_PREFIX = 'Vizy.blockInsertView';

function storageKey(fieldHandle: string): string {
    const systemUid = window.Craft?.systemUid;
    const prefix = typeof systemUid === 'string' && systemUid !== ''
        ? `Craft-${systemUid}`
        : 'Craft';
    return `${prefix}.${STORAGE_PREFIX}.${fieldHandle}`;
}

export function readBlockInsertView(
    fieldHandle: string | null | undefined,
    defaultView: BlockInsertView = 'list',
): BlockInsertView {
    if (!fieldHandle || typeof localStorage === 'undefined') return defaultView;
    try {
        const raw = localStorage.getItem(storageKey(fieldHandle));
        return raw === 'list' || raw === 'grid' ? raw : defaultView;
    } catch {
        return defaultView;
    }
}

/** Resolve field policy before consulting the per-user preference. */
export function resolveBlockInsertView(
    fieldHandle: string | null | undefined,
    display: BlockPickerDisplay = 'both',
    defaultView: BlockInsertView = 'list',
): BlockInsertView {
    if (display === 'list' || display === 'grid') return display;
    return readBlockInsertView(fieldHandle, defaultView);
}

export function writeBlockInsertView(
    fieldHandle: string | null | undefined,
    view: BlockInsertView,
): void {
    if (!fieldHandle || typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(storageKey(fieldHandle), view);
    } catch {
        // Private mode / quota — preference is best-effort.
    }
}
