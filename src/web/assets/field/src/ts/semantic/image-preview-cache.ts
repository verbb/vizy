/**
 * Session-only image preview URLs / Craft asset ids.
 *
 * Canonical JSON never stores `src` or numeric asset id. The authoring UI
 * still needs a thumbnail and Craft.AssetImageEditor needs an id, so we keep
 * a per-page cache keyed by assetUid.
 */

export type ImagePreviewRecord = {
    assetId: number;
    url: string;
    label: string;
    /** Craft transform handle used for the current preview URL (display only). */
    transform: string;
};

const cache = new Map<string, ImagePreviewRecord>();
const listeners = new Map<string, Set<() => void>>();

/** Preview changes are UI state, so they must not require a document transaction. */
export function subscribeImagePreview(assetUid: string, listener: () => void): () => void {
    const subscribers = listeners.get(assetUid) ?? new Set<() => void>();
    subscribers.add(listener);
    listeners.set(assetUid, subscribers);
    return () => {
        subscribers.delete(listener);
        if (subscribers.size === 0) listeners.delete(assetUid);
    };
}

export function rememberImagePreview(assetUid: string, record: ImagePreviewRecord): void {
    cache.set(assetUid, record);
    for (const listener of [...(listeners.get(assetUid) ?? [])]) listener();
}

export function getImagePreview(assetUid: string): ImagePreviewRecord | null {
    return cache.get(assetUid) ?? null;
}

/**
 * Seed the session cache from editor bootstrap so save/reload can paint
 * thumbnails (canonical JSON never stores `src`).
 */
export function hydrateImagePreviews(
    map: Record<string, {
        assetId: number;
        url: string;
        label: string;
        transform?: string;
    }> | null | undefined,
): void {
    if (!map) return;
    for (const [assetUid, record] of Object.entries(map)) {
        if (!assetUid || !record?.url) continue;
        rememberImagePreview(assetUid, {
            assetId: Number(record.assetId) || 0,
            url: record.url,
            label: record.label || 'Image',
            transform: record.transform ?? '',
        });
    }
}

export function bumpImagePreviewUrl(assetUid: string): string | null {
    const existing = cache.get(assetUid);
    if (!existing) return null;
    const hashIndex = existing.url.indexOf('#');
    const base = hashIndex < 0 ? existing.url : existing.url.slice(0, hashIndex);
    const fragment = hashIndex < 0 ? '' : existing.url.slice(hashIndex);
    // Provider query strings may be signed. Keep them byte-for-byte intact;
    // refreshImagePreview obtains a fresh provider URL before reaching this seam.
    const next = base.includes('?') ? existing.url : `${base}?v=${Date.now()}${fragment}`;
    rememberImagePreview(assetUid, { ...existing, url: next });
    return next;
}
