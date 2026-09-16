import type { BlockTypeManifest, CanonicalNode } from './types';

export type IdentitySchema = Record<string, Pick<BlockTypeManifest, 'fieldSlotKinds'>>;

const AUTHORED_UID_ATTRS = new Set([
    'blockUid',
    'layoutUid',
    'columnUid',
    'linkUid',
    'imageUid',
    'tableUid',
    'rowUid',
    'cellUid',
]);

function isHostedEnvelope(value: unknown): value is CanonicalNode {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const doc = value as Record<string, unknown>;
    return doc.type === 'doc'
        && !!doc.attrs
        && typeof doc.attrs === 'object'
        && Array.isArray(doc.content);
}

function isMatrixCraft5Payload(value: unknown): value is { entries: Record<string, unknown>; sortOrder?: unknown[] } {
    return !!value
        && typeof value === 'object'
        && !Array.isArray(value)
        && 'entries' in value
        && typeof (value as { entries: unknown }).entries === 'object'
        && (value as { entries: unknown }).entries !== null
        && !Array.isArray((value as { entries: unknown }).entries);
}

function remapMatrixPayload(
    payload: { entries: Record<string, unknown>; sortOrder?: unknown[] },
    createUid: () => string,
): { entries: Record<string, unknown>; sortOrder: string[] } {
    const uidMap = new Map<string, string>();
    const nextEntries: Record<string, unknown> = {};
    for (const [entryKey, entry] of Object.entries(payload.entries)) {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue;
        const newUid = createUid();
        uidMap.set(entryKey, newUid);
        if (entryKey.startsWith('uid:')) uidMap.set(entryKey.slice(4), newUid);
        const next: Record<string, unknown> = { ...(entry as Record<string, unknown>), uid: newUid };
        delete next.id;
        delete next.ownerId;
        delete next.canonicalId;
        nextEntries[newUid] = next;
    }
    const sortOrder: string[] = [];
    for (const item of Array.isArray(payload.sortOrder) ? payload.sortOrder : []) {
        const key = String(item);
        sortOrder.push(uidMap.get(key) ?? uidMap.get(`uid:${key}`) ?? createUid());
    }
    if (!sortOrder.length) sortOrder.push(...Object.keys(nextEntries));
    return { entries: nextEntries, sortOrder };
}

/**
 * Schema-aware identity copy for TipTap + Hosted Vizy envelopes.
 *
 * Regenerates authored UIDs on known TipTap attr keys and Hosted document
 * trees. Opaque Craft fieldSlots payloads are left untouched. Matrix anchors
 * are cleared so copies do not share nested Matrix ownership.
 */
export function regenerateAuthoredUids<T>(
    input: T,
    createUid: () => string = createUuid,
    schema: IdentitySchema = {},
): T {
    const uidMap = new Map<string, string>();
    const mapUid = (value: string): string => {
        let replacement = uidMap.get(value);
        if (!replacement) {
            replacement = createUid();
            uidMap.set(value, replacement);
        }
        return replacement;
    };

    const walkNode = (node: CanonicalNode): CanonicalNode => {
        const attrs: Record<string, unknown> = {
            ...((node.attrs as Record<string, unknown> | undefined) ?? {}),
        };

        for (const key of AUTHORED_UID_ATTRS) {
            if (typeof attrs[key] === 'string' && attrs[key] !== '') {
                attrs[key] = mapUid(attrs[key] as string);
            }
        }

        if (node.type === 'vizyBlock') {
            // Independence: never retain the source MatrixAnchor UID.
            if ('matrixAnchorUid' in attrs) {
                attrs.matrixAnchorUid = null;
            }
            const slots = attrs.fieldSlots;
            if (slots && typeof slots === 'object' && !Array.isArray(slots)) {
                const nextSlots: Record<string, unknown> = {};
                for (const [placementUid, raw] of Object.entries(slots as Record<string, unknown>)) {
                    const kind = schema[String(attrs.blockTypeUid)]?.fieldSlotKinds?.[placementUid];
                    if (kind === 'hosted' && isHostedEnvelope(raw)) {
                        nextSlots[placementUid] = walkDoc(raw);
                    } else if (kind === 'matrix' && isMatrixCraft5Payload(raw)) {
                        // Flushed Matrix blobs keep nested content but must not
                        // reuse source entry UIDs/ids on the next persist.
                        nextSlots[placementUid] = remapMatrixPayload(raw, createUid);
                    } else {
                        nextSlots[placementUid] = raw;
                    }
                }
                attrs.fieldSlots = nextSlots;
            }
        }

        const content = Array.isArray(node.content)
            ? node.content.map((child) => (
                child && typeof child === 'object'
                    ? walkNode(child as CanonicalNode)
                    : child
            ))
            : node.content;

        // Hosted documents remain raw JSON inside a Block attribute, so they
        // do not pass through ProseMirror's JSON cleanup. Keep absent leaf
        // properties absent instead of adding a non-JSON `content: undefined`.
        return {
            ...node,
            ...(node.attrs || Object.keys(attrs).length ? { attrs } : {}),
            ...(content !== undefined ? { content } : {}),
        } as CanonicalNode;
    };

    const walkDoc = (doc: CanonicalNode): CanonicalNode => ({
        ...doc,
        content: Array.isArray(doc.content)
            ? doc.content.map((child) => (
                child && typeof child === 'object'
                    ? walkNode(child as CanonicalNode)
                    : child
            ))
            : doc.content,
    });

    if (input && typeof input === 'object' && !Array.isArray(input)) {
        const node = input as unknown as CanonicalNode;
        if (node.type === 'doc') return walkDoc(node) as T;
        return walkNode(node) as T;
    }
    return input;
}

function createUuid(): string {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}

export function recursiveRegenerateAuthoredUids(
    input: CanonicalNode,
    createUid?: () => string,
    schema?: IdentitySchema,
): CanonicalNode {
    return regenerateAuthoredUids(input, createUid, schema);
}
