<template>
    <div>
        <button v-tooltip="{ content: title, theme: 'vui-tooltip' }" class="btn vui-toolbar-btn" :class="{ 'active': active }" @click.prevent="runAction" @mousedown="onMouseDown">
            <svg-icon :content="{ icon, svg }" />
        </button>

        <media-embed-menu-bubble :editor="editor" :field="field" />

        <media-embed-menu-modal
            v-model="model"
            :show="showEditModal"
            :editor="editor"
            :field="field"
            confirm-button="Insert"
            modal-title="Insert Media Embed"
            @close="closeModal"
        />
    </div>
</template>

<script>
import tippy from 'tippy.js';

import SvgIcon from '../SvgIcon.vue';
import MediaEmbedMenuBubble from './MediaEmbedMenuBubble.vue';
import MediaEmbedMenuModal from './MediaEmbedMenuModal.vue';

export default {
    name: 'MediaEmbedMenuBarItem',

    components: {
        SvgIcon,
        MediaEmbedMenuBubble,
        MediaEmbedMenuModal,
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

        icon: {
            type: String,
            default: null,
        },

        svg: {
            type: String,
            default: null,
        },

        name: {
            type: String,
            default: null,
        },

        title: {
            type: String,
            default: null,
        },

        action: {
            type: Function,
            default: () => {},
        },

        isActive: {
            type: Function,
            default: () => {},
        },
    },

    data() {
        return {
            showEditModal: false,
            model: {},
        };
    },

    computed: {
        active() {
            return this.isActive && this.isActive();
        },
    },

    created() {
        this.resetModel();

        this.editor.on('vui:media-embed-modal-open', () => {
            this.runAction();
        });
    },

    mounted() {
        // Create keyboard shortcuts
        this._keyListener = function(e) {
            if (e.key === 'Escape') {
                e.preventDefault();

                this.closeDropdown();
            }
        };

        document.addEventListener('keydown', this._keyListener.bind(this));
    },

    beforeUnmount() {
        document.removeEventListener('keydown', this._keyListener);
    },

    methods: {
        runAction() {
            this.showEditModal = true;
        },

        resetModel() {
            this.model = {
                url: null,
                data: null,
            };
        },

        closeModal() {
            this.showEditModal = false;
        },

        onMouseDown(e) {
            e.preventDefault();
        },

        closeDropdown() {
            if (this.tippy) {
                this.tippy.hide();
            }
        },
    },
};

</script>
