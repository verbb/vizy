/**
 * Persist list vs grid for the Blocks Add panel, keyed by Craft field handle.
 * Same Craft-{systemUid} prefix pattern as collapsed Block storage.
 */

export type BlockInsertView = 'list' | 'grid';

const STORAGE_PREFIX = 'Vizy.blockInsertView';

function storageKey(fieldHandle: string): string {
    const systemUid = window.Craft?.systemUid;
    const prefix = typeof systemUid === 'string' && systemUid !== ''
        ? `Craft-${systemUid}`
        : 'Craft';
    return `${prefix}.${STORAGE_PREFIX}.${fieldHandle}`;
}

export function readBlockInsertView(fieldHandle: string | null | undefined): BlockInsertView {
    if (!fieldHandle || typeof localStorage === 'undefined') return 'list';
    try {
        const raw = localStorage.getItem(storageKey(fieldHandle));
        return raw === 'grid' ? 'grid' : 'list';
    } catch {
        return 'list';
    }
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
