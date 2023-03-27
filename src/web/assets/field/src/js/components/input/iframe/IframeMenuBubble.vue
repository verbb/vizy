<template>
    <div class="vui-iframe-menu-bubble" style="display: none;">
        <a href="#" @click.prevent="edit">{{ t('vizy', 'Edit') }}</a>
        <a href="#" @click.prevent="unlink">{{ t('vizy', 'Delete') }}</a>

        <iframe-menu-modal
            v-model="model"
            :show="showEditModal"
            :editor="editor"
            :field="field"
            confirm-button="Update"
            modal-title="Edit iFrame"
            @close="closeModal"
        />
    </div>
</template>

<script>
import { size } from 'lodash-es';
import IframeMenuModal from './IframeMenuModal.vue';

import { findChildrenByType } from '@utils/tiptap/nodes';
import followCursor from '@utils/tippy/followCursor';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default {
    name: 'IframeMenuBubble',

    components: {
        IframeMenuModal,
    },

    props: {
        field: {
            type: Object,
            default: null,
        },

        editor: {
            type: Object,
            default: null,
        },
    },

    data() {
        return {
            tippy: null,
            showEditModal: false,

            model: {
                url: null,
            },
        };
    },

    watch: {
        editor: {
            immediate: true,
            handler(editor) {
                if (editor) {
                    this.$nextTick(() => {
                        // Attach a custom event to the editor whenever a iframe node is clicked
                        editor.on('vui:iframe-clicked', this.renderBubble);
                    });
                }
            },
        },
    },

    methods: {
        renderBubble(event) {
            const { view } = this.editor;

            // Prevent empty models from proceeding. Happens for nested Vizy fields.
            const model = this.editor.getAttributes('iframe');

            if (!size(model)) {
                return;
            }

            // Update our model
            this.model = model;

            this.$el.style.display = 'block';

            // Tooltip is created on each click, so destroy
            this.destroyBubble();

            // Attach it to the editor dom, rather than the iframe node
            this.tippy = tippy(view.dom, {
                content: this.$el,
                trigger: 'manual',
                showOnCreate: true,
                allowHTML: true,
                arrow: true,
                interactive: true,
                placement: 'top',
                followCursor: 'initial',
                plugins: [followCursor],
                theme: 'vui-menu-bubble',
                mouseEvent: event,
                duration: 200,
                zIndex: 1000,
                appendTo: () => { return document.body; },
            });
        },

        destroyBubble() {
            if (this.tippy) {
                this.tippy.destroy();
                this.tippy = null;
            }
        },

        edit() {
            this.showEditModal = true;

            this.editor.chain().blur().run();
        },

        closeModal() {
            this.showEditModal = false;
        },

        unlink() {
            this.editor.chain().focus().deleteSelection().run();

            this.destroyBubble();
        },
    },

};

</script>

<style lang="scss">

.tippy-box[data-theme~="vui-menu-bubble"] {
    background-color: #1c2e36;
    border-radius: 3px;

    .tippy-arrow {
        z-index: 1;
        pointer-events: none;
    }

    .tippy-content {
        padding: 6px 12px 8px;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    a {
        font-size: 12px;
        color: #fff;
        text-decoration: none;
        display: inline-block;
        padding: 0 0 0 7px;

        &:hover {
            color: #ddd;
        }

        &:before {
            content: '';
            padding-left: 10px;
            border-left: 1px solid rgba(255,255,255,.3);
        }

        &:first-child {
            padding-left: 0;

            &:before {
                padding-left: 0;
                border-left: none;
            }
        }
    }
}

</style>
