/**
 * Persist Block collapse like Matrix entries: browser localStorage of UIDs,
 * not the canonical document. Collapse stays UI-only; this is the
 * Matrix-parity authoring preference across reloads.
 */

const STORAGE_SUFFIX = 'Vizy.collapsedBlocks';

function storageKey(): string {
    const systemUid = window.Craft?.systemUid;
    const prefix = typeof systemUid === 'string' && systemUid !== ''
        ? `Craft-${systemUid}`
        : 'Craft';
    return `${prefix}.${STORAGE_SUFFIX}`;
}

function readIds(): string[] {
    if (typeof localStorage === 'undefined') return [];
    try {
        const raw = localStorage.getItem(storageKey());
        if (!raw) return [];
        return raw.split(',').map((id) => id.trim()).filter(Boolean);
    } catch {
        return [];
    }
}

function writeIds(ids: string[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(storageKey(), ids.join(','));
    } catch {
        // Private mode / quota — preference is best-effort.
    }
}

export function isBlockCollapsedRemembered(blockUid: string): boolean {
    if (!blockUid) return false;
    return readIds().includes(blockUid);
}

export function rememberCollapsedBlock(blockUid: string): void {
    if (!blockUid) return;
    const ids = readIds();
    if (ids.includes(blockUid)) return;
    ids.push(blockUid);
    writeIds(ids);
}

export function forgetCollapsedBlock(blockUid: string): void {
    if (!blockUid) return;
    const ids = readIds();
    const next = ids.filter((id) => id !== blockUid);
    if (next.length === ids.length) return;
    writeIds(next);
}
