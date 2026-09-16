import { Node } from '@tiptap/core';
import { resolveMediaEmbed } from './media-providers';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        vizyMediaEmbed: {
            setVizyMediaEmbed: (options: { url: string }) => ReturnType;
        };
    }
}

/**
 * Vizy 3–compatible mediaEmbed atom.
 * Stores `url` + optional `data` (html for known providers / migrated oEmbed).
 */
export function createVizyMediaEmbed() {
    return Node.create({
        name: 'mediaEmbed',
        group: 'block',
        atom: true,
        draggable: true,
        selectable: true,

        addAttributes() {
            return {
                url: { default: null },
                data: { default: null },
            };
        },

        parseHTML() {
            return [{
                tag: 'div[data-vizy-media-embed]',
                getAttrs: (element) => {
                    const el = element as HTMLElement;
                    const url = el.getAttribute('data-url') || '';
                    const resolved = resolveMediaEmbed(url);
                    if (!resolved) return false;
                    return {
                        url: resolved.url,
                        data: resolved.html ? { html: resolved.html } : null,
                    };
                },
            }];
        },

        renderHTML({ node }) {
            const url = typeof node.attrs.url === 'string' ? node.attrs.url : '';
            return ['div', {
                'data-vizy-media-embed': '',
                'data-url': url,
                class: 'vizy-media-embed',
            }];
        },

        addNodeView() {
            return ({ node }) => {
                const dom = document.createElement('div');
                dom.className = 'vizy-media-embed';
                dom.contentEditable = 'false';
                let paintedKey = '';
                const paint = (current: typeof node) => {
                    const selected = dom.classList.contains('ProseMirror-selectednode');
                    const url = typeof current.attrs.url === 'string' ? current.attrs.url : '';
                    // Stored oEmbed HTML is untrusted document data. Only provider-generated
                    // markup may enter the CP DOM; unknown providers keep an inert URL card.
                    const html = resolveMediaEmbed(url)?.html ?? null;
                    const key = `${url}\0${html ?? ''}`;
                    if (key === paintedKey) {
                        dom.className = selected
                            ? 'vizy-media-embed ProseMirror-selectednode'
                            : 'vizy-media-embed';
                        return;
                    }
                    paintedKey = key;
                    dom.className = selected
                        ? 'vizy-media-embed ProseMirror-selectednode'
                        : 'vizy-media-embed';
                    dom.replaceChildren();
                    if (html) {
                        const wrap = document.createElement('div');
                        wrap.className = 'vizy-media-embed__preview';
                        wrap.innerHTML = html;
                        // Clicks select the atom — don't interact with the iframe.
                        wrap.querySelectorAll('iframe').forEach((frame) => {
                            frame.setAttribute('sandbox', 'allow-scripts');
                            (frame as HTMLIFrameElement).style.pointerEvents = 'none';
                        });
                        dom.append(wrap);
                        return;
                    }
                    const card = document.createElement('div');
                    card.className = 'vizy-media-embed__card';
                    card.textContent = url || 'Media embed requires a URL';
                    dom.append(card);
                };
                paint(node);
                return {
                    dom,
                    update: (updated) => {
                        if (updated.type.name !== 'mediaEmbed') return false;
                        paint(updated);
                        return true;
                    },
                    selectNode: () => { dom.classList.add('ProseMirror-selectednode'); },
                    deselectNode: () => { dom.classList.remove('ProseMirror-selectednode'); },
                };
            };
        },

        addCommands() {
            return {
                setVizyMediaEmbed: (options) => ({ chain, state }) => {
                    const resolved = resolveMediaEmbed(options.url);
                    if (!resolved) return false;
                    const attrs = {
                        url: resolved.url,
                        data: resolved.html ? { html: resolved.html } : null,
                    };
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
