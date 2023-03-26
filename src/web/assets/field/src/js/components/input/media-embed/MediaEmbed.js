import { Plugin, PluginKey, NodeSelection } from 'prosemirror-state';
import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import MediaEmbedView from './MediaEmbedView.vue';

export default Node.create({
    name: 'mediaEmbed',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            url: {
                default: null,
            },

            data: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'media-embed',
                getAttrs: (dom) => { return JSON.parse(dom.innerHTML); },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['media-embed', JSON.stringify(HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(MediaEmbedView);
    },

    addCommands() {
        return {
            setEmbed: (options) => {
                return ({ tr, dispatch }) => {
                    const { selection } = tr;
                    const node = this.type.create(options);

                    if (dispatch) {
                        tr.replaceRangeWith(selection.from, selection.to, node);
                    }

                    return true;
                };
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('handleClick'),
                props: {
                    handleClick: (view, pos, event) => {
                        // Raise a custom event so we can action this elsewhere. Notably, opening
                        // up a menu bubble in a Vue component, for max convenience
                        if (event.target.classList.contains('vui-media-embed')) {
                            // Wait for a moment to ensure the node is selected before hitting the callback
                            setTimeout(() => {
                                this.editor.emit('vui:media-embed-clicked', event);
                            }, 50);
                        }
                    },
                },
            }),
        ];
    },
});
