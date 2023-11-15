import { Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
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

    addStorage() {
        return {
            isNew: false,
        };
    },

    parseHTML() {
        return [
            {
                tag: 'vizy-block',
                getAttrs: (dom) => { return JSON.parse(dom.innerHTML); },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['vizy-block', JSON.stringify(HTMLAttributes)];
    },

    addCommands() {
        return {
            setVizyBlock: (options) => {
                return ({
                    tr, dispatch, view, state,
                }) => {
                    const { selection } = tr;
                    const node = this.type.create(options);

                    if (dispatch) {
                        tr.insert(selection.from, state.schema.nodes.paragraph.create());
                        tr.replaceRangeWith(selection.from, selection.to, node);
                    }

                    this.storage.isNew = true;

                    return true;
                };
            },
        };
    },

    addNodeView() {
        return VueNodeViewRenderer(VizyBlockView, {
            // Roll our own drag check to better deal with a few issues with Tiptap. There's a whole lot of advanced
            // stuff they do, when it really (for our needs) just needs a check for if the drag handle is clicked
            // as that's the only thing that can drag a block.
            //
            // See https://github.com/verbb/vizy/issues/267 and https://github.com/ueberdosis/tiptap/issues/1133
            // Refer to https://github.com/ueberdosis/tiptap/blob/42039c05f0894a2730a7b8f1b943ddb22d52a824/packages/core/src/NodeView.ts#L100
            stopEvent: ({ event }) => {
                if (event.target.hasAttribute('data-drag-handle')) {
                    this.isDragging = true;

                    document.addEventListener('dragend', () => {
                        this.isDragging = false;
                    }, { once: true });

                    document.addEventListener('drop', () => {
                        this.isDragging = false;
                    }, { once: true });

                    document.addEventListener('mouseup', () => {
                        this.isDragging = false;
                    }, { once: true });

                    return false;
                }

                if (this.isDragging) {
                    return false;
                }

                return true;
            },
        });
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
                            const from = view.state.selection.$from.pos;
                            const to = view.state.selection.$to.pos;
                            const beforeNode = ((from - 1) < 0) ? 0 : from - 1;

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

                        const { supportedBlockTypes } = this.editor.vizyField;

                        // Check if the content contains a Vizy block that's not supported for this field
                        slice.content.content.forEach((node, index) => {
                            if (node.type.name == 'vizyBlock') {
                                if (!supportedBlockTypes.includes(node.attrs.values.type)) {
                                    slice.content.content.splice(index, 1);
                                }
                            }
                        });
                    },

                    handleClickOn: (view, pos, node, nodePos, event, direct) => {
                        // Check for the number of child vizyblocks for the root of the field that
                        // we're clicking on. We only care about the deepest
                        const $clickedBlock = event.target.closest('.vizyblock');

                        // Not clicking on a Vizy Block, so skip
                        if (!$clickedBlock) {
                            return false;
                        }

                        // Is the Vizy field that's closest to clicked the same as this one?
                        // If not, return `true` to prevent default behaviour. This prevents nested Vizy fields from
                        // having all their parent blocks also selected.
                        const $parentField = $clickedBlock.closest('.ProseMirror');

                        if ($parentField !== view.dom) {
                            return true;
                        }

                        // Only allow clicking on the Vizy Block header to select the block
                        // Also check if we're clicking on the tabs or actions
                        const $blockHeader = event.target.closest('.vizyblock-header');
                        const $blockHeaderActions = event.target.closest('.vizyblock-header .actions-tabs');

                        if (!$blockHeader || $blockHeaderActions) {
                            return true;
                        }
                    },
                },

                filterTransaction: (transaction, state) => {
                    let result = true;

                    // Check if our flags are set, and if the selected node is a vizy block
                    if (state.typing || state.pasting) {
                        transaction.mapping.maps.forEach((map) => {
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
