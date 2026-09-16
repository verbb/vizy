/**
 * Craft ElementEditor serializeForm rewrite helpers.
 *
 * Craft's jQuery.param / $.serialize encode spaces as `%20`. Craft later round-trips
 * that string through `groupParams` / `createForm`, which use `decodeURIComponent`
 * without treating `+` as space. `URLSearchParams.toString()` emits spaces as `+`,
 * so rewriting the whole payload through it turns every space into a literal `+`
 * once Craft posts (Content Area text "Testing something" → "Testing+something").
 *
 * Keep untouched pairs byte-stable and append Vizy values with encodeURIComponent.
 */

export function encodeCraftQueryPair(name: string, value: string): string {
    return `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
}

function decodeCraftQueryKey(rawKey: string): string {
    try {
        // form-urlencoded keys may still use + for space in some producers
        return decodeURIComponent(rawKey.replace(/\+/g, ' '));
    } catch {
        return rawKey;
    }
}

export type CraftSerializedRewrite = {
    fieldName: string;
    canonical: string;
    /** When set, existing `vizyTransport[{editorId}]…` pairs are replaced. */
    editorId?: string;
    /** Short keys; stored under `vizyTransport[{editorId}][{key}]`. */
    metadata?: Readonly<Record<string, string>>;
};

/**
 * Drop vizyHost noise and the stale field value, inject canonical JSON (+ optional
 * transport metadata), without re-encoding the rest of Craft's query string.
 */
export function rewriteCraftSerializedForm(
    serialized: string,
    options: CraftSerializedRewrite,
): string {
    const { fieldName, canonical, editorId, metadata } = options;
    const transportPrefix = editorId ? `vizyTransport[${editorId}]` : null;
    const pairs = serialized === '' ? [] : serialized.split('&').filter((pair) => pair !== '');
    const kept: string[] = [];

    for (const pair of pairs) {
        const eq = pair.indexOf('=');
        const rawKey = eq === -1 ? pair : pair.slice(0, eq);
        const key = decodeCraftQueryKey(rawKey);
        if (key === fieldName) continue;
        if (key.startsWith('vizyHost[') || key.includes('[vizyHost]')) continue;
        if (
            transportPrefix
            && (key === transportPrefix || key.startsWith(`${transportPrefix}[`))
        ) {
            continue;
        }
        kept.push(pair);
    }

    kept.push(encodeCraftQueryPair(fieldName, canonical));

    if (editorId && metadata) {
        const prefix = `vizyTransport[${editorId}]`;
        for (const [key, value] of Object.entries(metadata)) {
            kept.push(encodeCraftQueryPair(`${prefix}[${key}]`, value));
        }
    }

    return kept.join('&');
}
