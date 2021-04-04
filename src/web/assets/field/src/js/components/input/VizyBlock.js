import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2';
import { Plugin, PluginKey, NodeSelection } from 'prosemirror-state';

import VizyBlockView from './VizyBlock.vue';

export default Node.create({
    name: 'vizyBlock',
    isBlock: true,
    inline: false,
    group: 'block',
    draggable: true,
    isolating: true,
    defining: true,
    selectable: true,
    // allowGapCursor: true,

    defaultOptions: {
        field: {},
    },

    addAttributes() {
        return {
            id: { default: null },
            enabled: { default: true },
            collapsed: { default: false },
            values: { default: null },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'vizy-block',
                getAttrs: dom => JSON.parse(dom.innerHTML),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['vizy-block', JSON.stringify(HTMLAttributes)];
    },

    addCommands() {
        return {
            setVizyBlock: (options) => ({ tr, dispatch, view, state }) => {
                const { selection } = tr;
                const node = this.type.create(options);

                if (dispatch) {
                    tr.insert(selection.from, state.schema.nodes.paragraph.create());
                    tr.replaceRangeWith(selection.from, selection.to, node);
                }

                return true;
            },
        };
    },

    addNodeView() {
        return VueNodeViewRenderer(VizyBlockView);
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleKeyDown: (view, event) => {
                        // Prevent _any_ key from clearing block. As soon as you start typing, 
                        // and a block is focused, it'll blast the block away.
                        view.state.typing = true;
                    },
                    
                    handlePaste: (view, event, slice) => {
                        // Prevent pasting overwriting block
                        view.state.pasting = true;
                    },
                },

                filterTransaction: (transaction, state) => {
                    var result = true;

                    // Check if our flags are set, and if the selected node is a vizy block
                    if (state.typing || state.pasting) {
                        transaction.mapping.maps.forEach(map => {
                            map.forEach((oldStart, oldEnd, newStart, newEnd) => {
                                state.doc.nodesBetween(oldStart, oldEnd, (node, number, pos, parent, index) => {
                                    if (node.type.name === 'vizyBlock') {
                                        result = false;
                                    }
                                });
                            });
                        });
                    }

                    return result;
                },
            }),
        ];
    },
});
