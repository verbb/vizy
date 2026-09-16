import { Node } from '@tiptap/core';
import { normalizeHttpsUrl } from './media-providers';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        vizyIframe: {
            setVizyIframe: (options: { url: string }) => ReturnType;
        };
    }
}

// Validate at emission too: restored/imported attrs do not pass through commands.
function previewUrl(raw: unknown): string | null {
    if (typeof raw !== 'string' || !/^https?:\/\//i.test(raw.trim())) return null;
    return normalizeHttpsUrl(raw);
}

/** Vizy 3–compatible iframe atom — stores `url` (PHP maps to `src` on render). */
export function createVizyIframe() {
    return Node.create({
        name: 'iframe',
        group: 'block',
        atom: true,
        draggable: true,
        selectable: true,

        addAttributes() {
            return {
                url: { default: null },
                frameborder: { default: 0 },
                allowfullscreen: { default: true },
            };
        },

        parseHTML() {
            return [{
                tag: 'iframe[src]',
                getAttrs: (element) => {
                    const el = element as HTMLElement;
                    const src = el.getAttribute('src') || '';
                    const url = normalizeHttpsUrl(src);
                    if (!url) return false;
                    return { url, frameborder: 0, allowfullscreen: true };
                },
            }];
        },

        renderHTML({ node }) {
            const url = previewUrl(node.attrs.url);
            if (!url) return ['span', { class: 'vizy-iframe__empty' }, 'Iframe requires a valid URL'];
            return ['iframe', {
                src: url,
                frameborder: '0',
                allowfullscreen: 'true',
                class: 'vizy-iframe',
            }];
        },

        addNodeView() {
            return ({ node }) => {
                const dom = document.createElement('div');
                dom.className = 'vizy-iframe';
                dom.contentEditable = 'false';
                let paintedUrl: string | null | undefined;
                const paint = (current: typeof node) => {
                    const selected = dom.classList.contains('ProseMirror-selectednode');
                    const url = previewUrl(current.attrs.url);
                    dom.className = selected ? 'vizy-iframe ProseMirror-selectednode' : 'vizy-iframe';
                    if (paintedUrl === url) return;
                    paintedUrl = url;
                    dom.replaceChildren();
                    if (!url) {
                        const empty = document.createElement('p');
                        empty.className = 'vizy-iframe__empty';
                        empty.textContent = 'Iframe requires a URL';
                        dom.append(empty);
                        return;
                    }
                    const frame = document.createElement('iframe');
                    // Opaque origin prevents embedded same-origin pages accessing the CP.
                    frame.setAttribute('sandbox', 'allow-scripts');
                    frame.src = url;
                    frame.title = 'Embedded content';
                    frame.setAttribute('frameborder', '0');
                    frame.allowFullscreen = true;
                    frame.loading = 'lazy';
                    frame.referrerPolicy = 'strict-origin-when-cross-origin';
                    // Block pointer events so clicks select the atom, not the frame.
                    frame.style.pointerEvents = 'none';
                    dom.append(frame);
                };
                paint(node);
                return {
                    dom,
                    update: (updated) => {
                        if (updated.type.name !== 'iframe') return false;
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
                setVizyIframe: (options) => ({ chain, state }) => {
                    const url = normalizeHttpsUrl(options.url);
                    if (!url) return false;
                    const attrs = { url, frameborder: 0, allowfullscreen: true };
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
