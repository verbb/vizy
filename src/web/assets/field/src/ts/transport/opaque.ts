import { Extension, Node } from '@tiptap/core';
import { Slice, type Schema } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { regenerateAuthoredUids, type IdentitySchema } from '../identity';
import { sanitizeSemanticNodes } from '../semantic/sanitize';
import type { CanonicalNode } from '../types';

export const TRANSPORT_VERSION = 1;
export const OPAQUE_CLIPBOARD_MIME = 'application/x-vizy-opaque-slice+json';
export const RESERVED_TYPES = new Set(['unsupportedNode', 'unsupportedInlineNode']);
/** Resource budgets for untrusted private clipboard payloads. */
export const DEFAULT_LIMITS = Object.freeze({
    maxDocumentBytes: 256_000,
    maxRawBytes: 64_000,
    maxNodes: 2_000,
    maxDepth: 32,
    // Hosted fields wrap each nested document in several JSON containers.
    maxObjectDepth: 128,
    // 500-Block documents are a locked workload; breadth is bounded above
    // that fixture while attrs/raw payload bytes retain tighter limits.
    maxObjectWidth: 1_024,
    maxPlaceholders: 256,
    maxPlacementAttempts: 2_048,
});
type Limits = { [Key in keyof typeof DEFAULT_LIMITS]: number };

// Clipboard budgets must not prevent existing documents from opening or being saved.
// Keep structural and opaque-placeholder safeguards, but do not impose arbitrary
// byte, node-count, or collection-width caps on normal document content.
const DOCUMENT_LIMITS: Limits = Object.freeze({
    ...DEFAULT_LIMITS,
    maxDocumentBytes: Infinity,
    maxNodes: Infinity,
    maxObjectWidth: Infinity,
    // A Hosted envelope adds several JSON containers per editor level. Match
    // PHP's JSON depth boundary rather than the private clipboard's small budget.
    maxObjectDepth: 512,
});

export class TransportIntegrityError extends Error {
    constructor(readonly code: string, readonly path: string) {
        super(`${code} at ${path}`);
    }
}

const clone = <T>(value: T): T => structuredClone(value);
const bytes = (value: unknown): number => new TextEncoder().encode(JSON.stringify(value)).length;
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);

function assertJson(value: unknown, path: string, limits: Limits, depth = 0): void {
    if (depth > limits.maxObjectDepth) throw new TransportIntegrityError('objectDepthExceeded', path);
    if (Array.isArray(value)) {
        if (value.length > limits.maxObjectWidth) throw new TransportIntegrityError('objectWidthExceeded', path);
        value.forEach((item, index) => assertJson(item, `${path}[${index}]`, limits, depth + 1));
    } else if (record(value)) {
        if (Object.keys(value).length > limits.maxObjectWidth) throw new TransportIntegrityError('objectWidthExceeded', path);
        Object.entries(value).forEach(([key, item]) => assertJson(item, `${path}.${key}`, limits, depth + 1));
    } else if (value !== null && !['string', 'number', 'boolean'].includes(typeof value)) {
        throw new TransportIntegrityError('nonJsonValue', path);
    } else if (typeof value === 'number' && !Number.isFinite(value)) {
        throw new TransportIntegrityError('nonJsonValue', path);
    }
}

function validateNode(
    value: unknown,
    path: string,
    limits: Limits,
    state: { nodes: number },
    depth = 0,
    allowReserved = false,
): asserts value is CanonicalNode {
    if (!record(value) || typeof value.type !== 'string' || !value.type) throw new TransportIntegrityError('invalidNode', path);
    if (!allowReserved && RESERVED_TYPES.has(value.type)) throw new TransportIntegrityError('reservedCanonicalType', path);
    if (++state.nodes > limits.maxNodes) throw new TransportIntegrityError('nodeCountExceeded', path);
    if (depth > limits.maxDepth) throw new TransportIntegrityError('nodeDepthExceeded', path);
    if ('attrs' in value && !record(value.attrs)) throw new TransportIntegrityError('invalidNodeAttrs', `${path}.attrs`);
    if ('marks' in value) {
        if (!Array.isArray(value.marks)) throw new TransportIntegrityError('invalidMarks', `${path}.marks`);
        value.marks.forEach((mark, index) => {
            const markPath = `${path}.marks[${index}]`;
            if (!record(mark) || typeof mark.type !== 'string' || !mark.type) {
                throw new TransportIntegrityError('invalidMark', markPath);
            }
            if ('attrs' in mark && !record(mark.attrs)) {
                throw new TransportIntegrityError('invalidMarkAttrs', `${markPath}.attrs`);
            }
        });
    }
    if (value.type === 'text' && (typeof value.text !== 'string' || !value.text)) throw new TransportIntegrityError('missingText', path);
    if (value.type !== 'text' && 'text' in value) throw new TransportIntegrityError('nonTextNodeText', path);
    if ('content' in value) {
        if (!Array.isArray(value.content)) throw new TransportIntegrityError('invalidContent', `${path}.content`);
        value.content.forEach((child, index) => validateNode(child, `${path}.content[${index}]`, limits, state, depth + 1, allowReserved));
    }
}

function validateDocument(value: unknown, limits: Limits, allowReserved: boolean): asserts value is CanonicalNode {
    if (Number.isFinite(limits.maxDocumentBytes) && bytes(value) > limits.maxDocumentBytes) {
        throw new TransportIntegrityError('documentBytesExceeded', '$');
    }
    // Validate JSON once, rather than rescanning every descendant at each node.
    assertJson(value, '$', limits);
    validateNode(value, '$', limits, { nodes: 0 }, 0, allowReserved);
    if (value.type !== 'doc') throw new TransportIntegrityError('invalidDocumentRoot', '$');
}

type OpaqueRequest = { opaque: true; rawNode: CanonicalNode; reason: 'unknownNode' | 'unknownMark' };
const request = (rawNode: CanonicalNode, reason: OpaqueRequest['reason']): OpaqueRequest => ({ opaque: true, rawNode: clone(rawNode), reason });
const isRequest = (value: CanonicalNode | OpaqueRequest): value is OpaqueRequest => 'opaque' in value;
const placeholder = (type: string, item: OpaqueRequest): CanonicalNode => ({
    type,
    attrs: {
        transportVersion: TRANSPORT_VERSION,
        reason: item.reason,
        originalType: item.rawNode.type,
        rawNode: clone(item.rawNode) as never,
    },
});
const accepts = (schema: Schema, value: CanonicalNode): boolean => {
    try {
        schema.nodeFromJSON(value).check();
        return true;
    } catch {
        return false;
    }
};

function place(schema: Schema, parent: CanonicalNode, children: Array<CanonicalNode | OpaqueRequest>, limits: Limits): CanonicalNode[] | null {
    const indexes = children.flatMap((child, index) => isRequest(child) ? [index] : []);
    const resolved = [...children] as CanonicalNode[];
    let attempts = 0;
    const search = (cursor: number): boolean => {
        if (++attempts > limits.maxPlacementAttempts) throw new TransportIntegrityError('placementAttemptsExceeded', '$');
        if (cursor === indexes.length) return accepts(schema, { ...parent, content: resolved });
        const index = indexes[cursor];
        const item = children[index] as OpaqueRequest;
        for (const type of ['unsupportedInlineNode', 'unsupportedNode']) {
            resolved[index] = placeholder(type, item);
            if (search(cursor + 1)) return true;
        }
        return false;
    };
    return search(0) ? resolved : null;
}

export function adaptCanonicalForEditor(
    input: CanonicalNode,
    schema: Schema,
    manifest: { nodes: string[]; marks: string[] },
    overrides: Partial<Limits> = {},
): CanonicalNode {
    const limits = { ...DOCUMENT_LIMITS, ...overrides };
    validateDocument(input, limits, false);
    const nodes = new Set(manifest.nodes);
    const marks = new Set(manifest.marks);
    if ([...RESERVED_TYPES].some((type) => nodes.has(type))) throw new TransportIntegrityError('reservedManifestType', '$');
    let placeholders = 0;

    const walk = (node: CanonicalNode): CanonicalNode | OpaqueRequest => {
        if (!nodes.has(node.type)) return request(node, 'unknownNode');
        if (node.marks?.some((mark) => !marks.has(mark.type))) return request(node, 'unknownMark');
        if (!node.content) return clone(node);
        const children = node.content.map(walk);
        const placed = place(schema, node, children, limits);
        if (!placed) return request(node, children.find(isRequest)?.reason ?? 'unknownNode');
        placeholders += children.filter(isRequest).length;
        if (placeholders > limits.maxPlaceholders) throw new TransportIntegrityError('placeholderCountExceeded', '$');
        const { content: _content, ...own } = node;
        return { ...clone(own), content: placed };
    };
    const output = walk(input);
    if (isRequest(output)) throw new TransportIntegrityError('noSafePlaceholderPlacement', '$');
    if (!accepts(schema, output)) throw new TransportIntegrityError('transportSchemaMismatch', '$');
    return output;
}

function restorePlaceholder(node: CanonicalNode, path: string, limits: Limits): CanonicalNode {
    if (Object.keys(node).sort().join(',') !== 'attrs,type' || !record(node.attrs)) {
        throw new TransportIntegrityError('invalidPlaceholderShape', path);
    }
    const attrs = node.attrs as Record<string, unknown>;
    if (Object.keys(attrs).sort().join(',') !== 'originalType,rawNode,reason,transportVersion') {
        throw new TransportIntegrityError('invalidPlaceholderAttrs', `${path}.attrs`);
    }
    if (attrs.transportVersion !== TRANSPORT_VERSION) throw new TransportIntegrityError('unsupportedTransportVersion', path);
    if (!['unknownNode', 'unknownMark'].includes(String(attrs.reason))) throw new TransportIntegrityError('invalidPlaceholderReason', path);
    if (!record(attrs.rawNode) || attrs.originalType !== attrs.rawNode.type) throw new TransportIntegrityError('placeholderTypeMismatch', path);
    if (bytes(attrs.rawNode) > limits.maxRawBytes) throw new TransportIntegrityError('rawBytesExceeded', path);
    assertJson(attrs.rawNode, `${path}.attrs.rawNode`, limits);
    validateNode(attrs.rawNode, `${path}.attrs.rawNode`, limits, { nodes: 0 });
    return clone(attrs.rawNode);
}

export function restoreCanonicalFromEditor(input: CanonicalNode, overrides: Partial<Limits> = {}): CanonicalNode {
    const limits = { ...DOCUMENT_LIMITS, ...overrides };
    validateDocument(input, limits, true);
    let count = 0;
    const walk = (node: CanonicalNode, path: string): CanonicalNode => {
        if (RESERVED_TYPES.has(node.type)) {
            if (++count > limits.maxPlaceholders) throw new TransportIntegrityError('placeholderCountExceeded', path);
            return restorePlaceholder(node, path, limits);
        }
        const { content, ...own } = node;
        const output = clone(own) as CanonicalNode;
        if (content) output.content = content.map((child, index) => walk(child, `${path}.content[${index}]`));
        return output;
    };
    const output = walk(input, '$');
    // ProseMirror omits empty `content` from toJSON(); an emptied editor therefore
    // yields `{type:'doc', attrs}` with no list. Canonical envelopes always carry one
    // so DocumentParser (and empty clears) round-trip cleanly.
    if (!('content' in output) || output.content === undefined) {
        output.content = [];
    }
    validateDocument(output, limits, false);
    try {
        // Sanitizing first, so it still sees the shape the editor produced, and dropping
        // empty attributes only on the way out.
        return dropNullAttrs(sanitizeSemanticNodes(output));
    } catch (error) {
        const code = error instanceof Error ? error.message.split(' ')[0] : 'semanticSanitizeFailed';
        throw new TransportIntegrityError(code, '$');
    }
}

/**
 * Drops attributes that are explicitly null on the way into storage.
 *
 * ProseMirror serialises every attribute a node's type declares, default included, so an
 * extension that adds one to a common node writes it into every document — loading
 * TextAlign for alignment buttons put `"textAlign": null` on every paragraph and heading
 * that had never been aligned. A null attribute says nothing that its absence does not:
 * the schema puts the default back on the way in.
 *
 * It also keeps the canonical parser's own rules satisfied. Several read a default with
 * `$attrs['siteMode'] ?? 'current'`, which an absent key satisfies and an explicit null
 * does not — a null there is rejected as an invalid value rather than read as unset.
 */
function dropNullAttrs(node: CanonicalNode): CanonicalNode {
    const output = node as CanonicalNode & { attrs?: Record<string, unknown>; marks?: CanonicalNode[] };

    if (record(output.attrs)) {
        const kept = Object.entries(output.attrs).filter(([, value]) => value !== null);
        if (kept.length !== Object.keys(output.attrs).length) {
            // An attrs object emptied entirely is dropped, since `{}` is not a shape the
            // editor would have produced for a node that has no attributes.
            if (kept.length === 0) delete output.attrs;
            else output.attrs = Object.fromEntries(kept);
        }
    }

    output.marks?.forEach((mark) => dropNullAttrs(mark));
    output.content?.forEach((child) => dropNullAttrs(child));

    return output;
}

export interface OpaqueSliceJson {
    content: CanonicalNode[];
    openStart: number;
    openEnd: number;
}

/**
 * Private clipboard data is still untrusted. Validate the complete slice and
 * every placeholder before ProseMirror is allowed to construct or insert it.
 */
export function validateOpaqueSlice(input: unknown, overrides: Partial<Limits> = {}): OpaqueSliceJson {
    const limits = { ...DEFAULT_LIMITS, ...overrides };
    if (!record(input) || Object.keys(input).some((key) => !['content', 'openStart', 'openEnd'].includes(key))) {
        throw new TransportIntegrityError('invalidSliceShape', '$clipboard');
    }
    if (
        !Array.isArray(input.content)
        || ('openStart' in input && !Number.isInteger(input.openStart))
        || ('openEnd' in input && !Number.isInteger(input.openEnd))
        || Number(input.openStart ?? 0) < 0
        || Number(input.openEnd ?? 0) < 0
    ) throw new TransportIntegrityError('invalidSliceShape', '$clipboard');
    if (bytes(input) > limits.maxDocumentBytes) {
        throw new TransportIntegrityError('documentBytesExceeded', '$clipboard');
    }

    const state = { nodes: 0 };
    let placeholders = 0;
    input.content.forEach((node, index) => {
        assertJson(node, `$clipboard.content[${index}]`, limits);
        validateNode(node, `$clipboard.content[${index}]`, limits, state, 0, true);
    });
    const inspect = (node: CanonicalNode, path: string): void => {
        const canonical = node as CanonicalNode;
        if (RESERVED_TYPES.has(canonical.type)) {
            if (++placeholders > limits.maxPlaceholders) {
                throw new TransportIntegrityError('placeholderCountExceeded', path);
            }
            restorePlaceholder(canonical, path, limits);
            return;
        }
        canonical.content?.forEach((child, index) => inspect(child, `${path}.content[${index}]`));
    };
    (input.content as CanonicalNode[]).forEach((node, index) => inspect(node, `$clipboard.content[${index}]`));
    return {
        ...clone(input),
        content: clone(input.content) as CanonicalNode[],
        openStart: Number(input.openStart ?? 0),
        openEnd: Number(input.openEnd ?? 0),
    };
}

function transportNode(name: string, inline: boolean) {
    return Node.create({
        name, inline, group: inline ? 'inline' : 'block', atom: true, selectable: true, draggable: !inline,
        addAttributes: () => ({
            transportVersion: { default: null, rendered: false },
            reason: { default: null, rendered: false },
            originalType: { default: null, rendered: false },
            rawNode: { default: null, rendered: false },
        }),
        parseHTML: () => [],
        renderHTML: () => [inline ? 'span' : 'div', {
            class: inline ? 'vizy-unsupported-inline' : 'vizy-unsupported-block',
            contenteditable: 'false',
            'aria-label': inline ? 'Unsupported formatting' : 'Unsupported content',
        }, inline ? 'Unsupported formatting' : 'Unsupported content'],
    });
}

export const UnsupportedNode = transportNode('unsupportedNode', false);
export const UnsupportedInlineNode = transportNode('unsupportedInlineNode', true);

export const OpaqueClipboard = Extension.create<{ schemaIdentity: IdentitySchema; beforeCopy?: () => void }>({
    name: 'opaqueClipboard',
    addOptions: () => ({ schemaIdentity: {} }),
    addProseMirrorPlugins() {
        const schemaIdentity = this.options.schemaIdentity;
        const beforeCopy = this.options.beforeCopy;
        const copySelection = (view: EditorView, event: ClipboardEvent, cut: boolean): boolean => {
            const clipboard = event.clipboardData;
            let encoded = JSON.stringify(view.state.selection.content().toJSON());
            if (
                !clipboard
                || (!encoded.includes('"unsupported') && !encoded.includes('"blockUid"'))
            ) return false;
            try {
                beforeCopy?.();
                encoded = JSON.stringify(view.state.selection.content().toJSON());
                // A cut must remain pasteable before its source is removed.
                if (cut) validateOpaqueSlice(JSON.parse(encoded));
            } catch (error) {
                // An unreadable live field must not silently copy its
                // older stored value through the native fallback.
                event.preventDefault();
                view.dom.dispatchEvent(new CustomEvent('vizy-clipboard-rejected', {
                    bubbles: true,
                    detail: { code: error instanceof TransportIntegrityError ? error.code : 'fieldCaptureFailed' },
                }));
                return true;
            }
            const hasOpaque = encoded.includes('"unsupported');
            const label = hasOpaque ? 'Unsupported content' : 'Vizy content';
            clipboard.setData(OPAQUE_CLIPBOARD_MIME, encoded);
            clipboard.setData('text/plain', label);
            clipboard.setData('text/html', `<span class="vizy-private-clipboard">${label}</span>`);
            event.preventDefault();
            if (cut && view.editable) {
                view.dispatch(view.state.tr.deleteSelection().setMeta('uiEvent', 'cut').scrollIntoView());
            }
            return true;
        };
        return [new Plugin({
            props: {
                handleDOMEvents: {
                    copy: (view, event) => copySelection(view, event, false),
                    cut: (view, event) => copySelection(view, event, true),
                    paste(view, event) {
                        const encoded = event.clipboardData?.getData(OPAQUE_CLIPBOARD_MIME);
                        if (!encoded) return false;
                        event.preventDefault();
                        try {
                            const json = regenerateAuthoredUids(validateOpaqueSlice(JSON.parse(encoded)), undefined, schemaIdentity);
                            const slice = Slice.fromJSON(view.state.schema, json);
                            view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
                        } catch (error) {
                            // A malformed private payload is consumed without mutation.
                            view.dom.dispatchEvent(new CustomEvent('vizy-clipboard-rejected', {
                                bubbles: true,
                                detail: {
                                    code: error instanceof TransportIntegrityError
                                        ? error.code
                                        : 'invalidPrivateSlice',
                                },
                            }));
                        }
                        return true;
                    },
                },
            },
        })];
    },
});
