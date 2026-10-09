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

    // Nested field values belong to the enclosing field's canonical store. A hook
    // may run after that field stripped its authoring inputs; do not put them back.
    const isPortalField = /(?:^|\[)(?:hyperData|vizyHost)\[|\[(?:hyperData|vizyHost)\]/.test(fieldName);
    if (!isPortalField) kept.push(encodeCraftQueryPair(fieldName, canonical));

    if (editorId && metadata) {
        const prefix = `vizyTransport[${editorId}]`;
        for (const [key, value] of Object.entries(metadata)) {
            kept.push(encodeCraftQueryPair(`${prefix}[${key}]`, value));
        }
    }

    return kept.join('&');
}

/** Visit documents even when an enclosing field stores their JSON as a string. */
function mapDocumentTransport(value: unknown, mapAttrs: (attrs: Record<string, unknown>) => Record<string, unknown>): unknown {
    if (typeof value === 'string') {
        if (!/^[\[{]/.test(value)) return value;
        try {
            const parsed: unknown = JSON.parse(value);
            const mapped = mapDocumentTransport(parsed, mapAttrs);
            return JSON.stringify(parsed) === JSON.stringify(mapped) ? value : JSON.stringify(mapped);
        } catch {
            return value;
        }
    }
    if (Array.isArray(value)) return value.map((item) => mapDocumentTransport(item, mapAttrs));
    if (!value || typeof value !== 'object') return value;
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.entries(record).map(([key, item]) => [
        key,
        key === 'attrs' && record.type === 'doc' && item && typeof item === 'object' && !Array.isArray(item)
            ? mapAttrs(item as Record<string, unknown>)
            : mapDocumentTransport(item, mapAttrs),
    ]));
}

/** A server acknowledgement changes transport credentials, not the author's revision. */
export function submissionContentKey(canonical: string): string {
    return String(mapDocumentTransport(canonical, ({ _storageToken, _editorId, ...attrs }) => attrs));
}

/** Advance only this editor's acknowledged token; preserve newer edits in every field. */
export function refreshCraftSerializedVizyToken(serialized: string, editorId: string, storageToken: string): string {
    return serialized.split('&').map((pair) => {
        const eq = pair.indexOf('=');
        if (eq === -1) return pair;
        try {
            const rawValue = decodeURIComponent(pair.slice(eq + 1));
            const value = mapDocumentTransport(rawValue, (attrs) => attrs._editorId === editorId
                ? { ...attrs, _storageToken: storageToken }
                : attrs);
            return value === rawValue ? pair : `${pair.slice(0, eq + 1)}${encodeURIComponent(String(value))}`;
        } catch {
            return pair;
        }
    }).join('&');
}
