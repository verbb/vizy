import { Plugin, PluginKey } from 'prosemirror-state';
import Image from '@tiptap/extension-image';

import { mergeAttributes } from '@tiptap/core';
import { NodeSelection } from 'prosemirror-state';

export default Image.extend({
    addAttributes() {
        return {
            id: {
                default: null,
            },
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            url: {
                default: null,
            },
            target: {
                default: null,
            },
            transform: {
                default: null,
            },
        };
    },

    renderHTML({ HTMLAttributes }) {
        const figAttributes = {
            class: 'vui-editor-img-wrap',
            tabindex: '-1',
        };

        const imgAttributes = {
            src: HTMLAttributes.src,
            title: HTMLAttributes.title,
            alt: HTMLAttributes.alt,
        };

        const linkAttributes = {
            url: HTMLAttributes.url,
            target: HTMLAttributes.target,
        };

        if (HTMLAttributes.url) {
            return ['figure', figAttributes, ['a', linkAttributes, ['img', imgAttributes]]];
        }
        return ['figure', figAttributes, ['img', imgAttributes]];

    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('handleClick'),
                props: {
                    handleClick: (view, pos, event) => {
                        // Raise a custom event so we can action this elsewhere. Notably, opening
                        // up a menu bubble in a Vue component, for max convenience
                        if (event.target.classList.contains('vui-editor-img-wrap')) {
                            // Wait for a moment to ensure the node is selected before hitting the callback
                            setTimeout(() => {
                                this.editor.emit('vui:image-clicked', event);
                            }, 50);
                        }
                    },
                },
            }),
        ];
    },
});
