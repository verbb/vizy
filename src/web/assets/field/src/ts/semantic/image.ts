import { mergeAttributes, Node } from '@tiptap/core';
import {
    isUuid,
    type AltMode,
    type ImageSize,
    type SemanticImageAttrs,
    type SemanticLinkAttrs,
    normalizeSemanticLinkAttrs,
    type SiteMode,
} from './attrs';
import { getImagePreview, subscribeImagePreview } from './image-preview-cache';

export interface SetSemanticImageOptions {
    assetUid: string;
    siteMode?: SiteMode;
    siteUid?: string | null;
    altMode?: AltMode;
    alt?: string | null;
    title?: string | null;
    size?: ImageSize;
    link?: SemanticLinkAttrs | null;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        semanticImage: {
            setSemanticImage: (options: SetSemanticImageOptions) => ReturnType;
        };
    }
}

function normalizeImageAttrs(raw: Record<string, unknown>): SemanticImageAttrs | null {
    const assetUid = typeof raw.assetUid === 'string' ? raw.assetUid : '';
    if (!isUuid(assetUid)) return null;
    const altMode = ['asset', 'custom', 'decorative', 'missing'].includes(String(raw.altMode))
        ? raw.altMode as AltMode
        : 'asset';
    const size = ['default', 'small', 'medium', 'large', 'full'].includes(String(raw.size))
        ? raw.size as ImageSize
        : 'default';
    let link: SemanticLinkAttrs | null = null;
    if (raw.link && typeof raw.link === 'object') {
        const L = raw.link as Record<string, unknown>;
        link = normalizeSemanticLinkAttrs(L);
    }
    return {
        assetUid,
        siteMode: raw.siteMode === 'fixed' ? 'fixed' : 'current',
        siteUid: typeof raw.siteUid === 'string' ? raw.siteUid : null,
        altMode,
        alt: typeof raw.alt === 'string' ? raw.alt : null,
        title: typeof raw.title === 'string' ? raw.title : null,
        size,
        link,
        imageUid: typeof raw.imageUid === 'string' ? raw.imageUid : null,
    };
}

/** Semantic image node — assetUid required; src URLs are never canonical. */
export function createSemanticImage() {
    return Node.create({
        name: 'image',
        group: 'block',
        atom: true,
        draggable: true,
        selectable: true,

        addAttributes() {
            return {
                assetUid: { default: null },
                siteMode: { default: 'current' },
                siteUid: { default: null },
                altMode: { default: 'asset' },
                alt: { default: null },
                title: { default: null },
                size: { default: 'default' },
                link: { default: null },
                imageUid: { default: null, rendered: false },
            };
        },

        parseHTML() {
            return [{
                tag: 'img[data-asset-uid]',
                getAttrs: (element) => {
                    const assetUid = (element as HTMLElement).getAttribute('data-asset-uid');
                    if (!assetUid || !isUuid(assetUid)) return false;
                    return normalizeImageAttrs({ assetUid });
                },
            }];
        },

        renderHTML({ node }) {
            const attrs = normalizeImageAttrs(node.attrs as Record<string, unknown>);
            if (!attrs) {
                return ['span', {
                    class: 'vizy-image-invalid',
                    'data-vizy-image': 'invalid',
                    contenteditable: 'false',
                }, 'Image requires asset'];
            }
            const preview = getImagePreview(attrs.assetUid);
            const label = attrs.altMode === 'decorative'
                ? ''
                : attrs.alt ?? `Asset ${attrs.assetUid.slice(0, 8)}`;
            if (preview?.url) {
                return ['figure', {
                    class: 'vizy-image',
                    'data-asset-uid': attrs.assetUid,
                    'data-size': attrs.size,
                    contenteditable: 'false',
                }, ['img', mergeAttributes({
                    src: preview.url,
                    alt: label,
                    title: attrs.title ?? undefined,
                    draggable: 'false',
                })]];
            }
            return ['figure', {
                class: 'vizy-image vizy-image--pending',
                'data-asset-uid': attrs.assetUid,
                'data-size': attrs.size,
                contenteditable: 'false',
            }, [
                'span',
                mergeAttributes({
                    class: 'vizy-image-placeholder',
                    role: 'img',
                    'aria-label': label || 'Image',
                }),
                label || 'Image',
            ]];
        },

        addNodeView() {
            return ({ node }) => {
                const attrs = normalizeImageAttrs(node.attrs as Record<string, unknown>);
                const dom = document.createElement('figure');
                dom.className = 'vizy-image';
                dom.contentEditable = 'false';
                if (attrs) {
                    dom.dataset.assetUid = attrs.assetUid;
                    dom.dataset.size = attrs.size;
                }
                let paintedKey = '';
                const paint = (current: typeof node) => {
                    const next = normalizeImageAttrs(current.attrs as Record<string, unknown>);
                    const selected = dom.classList.contains('ProseMirror-selectednode');
                    if (!next) {
                        paintedKey = '';
                        dom.replaceChildren();
                        dom.className = 'vizy-image vizy-image-invalid';
                        dom.textContent = 'Image requires asset';
                        return;
                    }
                    const preview = getImagePreview(next.assetUid);
                    const label = next.altMode === 'decorative'
                        ? ''
                        : next.alt ?? `Asset ${next.assetUid.slice(0, 8)}`;
                    // Skip DOM rebuild when attrs/preview are unchanged — recreating
                    // <img> on every update reloads the bitmap (visible flash).
                    const key = [
                        next.assetUid,
                        next.size,
                        next.altMode,
                        next.alt ?? '',
                        next.title ?? '',
                        preview?.url ?? '',
                    ].join('\0');
                    if (key === paintedKey) {
                        dom.className = selected ? 'vizy-image ProseMirror-selectednode' : 'vizy-image';
                        return;
                    }
                    paintedKey = key;
                    dom.replaceChildren();
                    dom.className = selected ? 'vizy-image ProseMirror-selectednode' : 'vizy-image';
                    dom.dataset.assetUid = next.assetUid;
                    dom.dataset.size = next.size;
                    if (preview?.url) {
                        const img = document.createElement('img');
                        img.src = preview.url;
                        img.alt = label;
                        if (next.title) img.title = next.title;
                        img.draggable = false;
                        dom.append(img);
                    } else {
                        dom.classList.add('vizy-image--pending');
                        const span = document.createElement('span');
                        span.className = 'vizy-image-placeholder';
                        span.setAttribute('role', 'img');
                        span.setAttribute('aria-label', label || 'Image');
                        span.textContent = label || 'Image';
                        dom.append(span);
                    }
                };
                let currentNode = node;
                let subscribedUid = attrs?.assetUid ?? '';
                let unsubscribe = subscribeImagePreview(subscribedUid, () => paint(currentNode));
                paint(node);
                return {
                    dom,
                    // This leaf's DOM is owned entirely by the NodeView, including previews.
                    ignoreMutation: (mutation) => mutation.type !== 'selection',
                    destroy: () => unsubscribe(),
                    update: (updated) => {
                        if (updated.type.name !== 'image') return false;
                        currentNode = updated;
                        const uid = String(updated.attrs.assetUid ?? '');
                        if (uid !== subscribedUid) {
                            unsubscribe();
                            subscribedUid = uid;
                            unsubscribe = subscribeImagePreview(uid, () => paint(currentNode));
                        }
                        paint(updated);
                        return true;
                    },
                    selectNode: () => {
                        dom.classList.add('ProseMirror-selectednode');
                    },
                    deselectNode: () => {
                        dom.classList.remove('ProseMirror-selectednode');
                    },
                };
            };
        },

        addCommands() {
            return {
                setSemanticImage: (options) => ({ chain, state }) => {
                    const attrs = normalizeImageAttrs(options as unknown as Record<string, unknown>);
                    if (!attrs) return false;
                    const { $from } = state.selection;
                    const paragraph = $from.parent;
                    if (paragraph.type.name === 'paragraph' && paragraph.content.size === 0) {
                        return chain()
                            .insertContentAt(
                                { from: $from.before(), to: $from.after() },
                                { type: this.name, attrs },
                            )
                            .run();
                    }
                    return chain().insertContent({ type: this.name, attrs }).run();
                },
            };
        },
    });
}
