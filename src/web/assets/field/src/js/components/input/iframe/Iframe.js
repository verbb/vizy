import { Plugin, PluginKey, NodeSelection } from 'prosemirror-state';
import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import IframeView from './IframeView.vue';

export default Node.create({
    name: 'iframe',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            url: {
                default: null,
            },

            frameborder: {
                default: 0,
            },

            allowfullscreen: {
                default: this.options.allowFullscreen,
                parseHTML: () => { return this.options.allowFullscreen; },
            },
        };
    },

    parseHTML() {
        return [{
            tag: 'iframe',
        }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['iframe', HTMLAttributes];
    },

    addNodeView() {
        return VueNodeViewRenderer(IframeView);
    },

    addCommands() {
        return {
            setIframe: (options) => {
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
                        if (event.target.classList.contains('vui-iframe')) {
                            // Wait for a moment to ensure the node is selected before hitting the callback
                            setTimeout(() => {
                                this.editor.emit('vui:iframe-clicked', event);
                            }, 50);
                        }
                    },
                },
            }),
        ];
    },
});
