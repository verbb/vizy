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
    defining: true,
    selectable: true,
    // allowGapCursor: true,

    // Disabled due to blockquote removal issue
    // https://github.com/verbb/vizy/issues/69
    // isolating: true,

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

                        // Remove selected state on a Vizy Block when pressing escape
                        if (event.key === 'Escape') {
                            var from = view.state.selection.$from.pos;
                            var to = view.state.selection.$to.pos;
                            var beforeNode = ((from - 1) < 0) ? 0 : from - 1; 

                            this.editor
                                .chain()
                                .setTextSelection({ from: beforeNode, to: beforeNode })
                                .blur()
                                .run();

                            return true;
                        }
                    },
                    
                    handlePaste: (view, event, slice) => {
                        // Prevent pasting overwriting block
                        view.state.pasting = true;
                    },

                    handleClickOn: (view, pos, node, nodePos, event, direct) => {
                        // Check for the number of child vizyblocks for the root of the field that
                        // we're clicking on. We only care about the deepest
                        var $clickedBlock = event.target.closest('.vizyblock');

                        // Not clicking on a Vizy Block, so skip
                        if (!$clickedBlock) {
                            return false;
                        }

                        // Is the Vizy field that's closest to clicked the same as this one?
                        // If not, return `true` to prevent default behaviour. This prevents nested Vizy fields from
                        // having all their parent blocks also selected.
                        var $parentField = $clickedBlock.closest('.ProseMirror');

                        if ($parentField !== view.dom) {
                            return true;
                        }

                        // Only allow clicking on the Vizy Block header to select the block
                        // Also check if we're clicking on the tabs or actions
                        var $blockHeader = event.target.closest('.vizyblock-header');
                        var $blockHeaderActions = event.target.closest('.vizyblock-header .actions-tabs');

                        if (!$blockHeader || $blockHeaderActions) {
                            return true;
                        }
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
