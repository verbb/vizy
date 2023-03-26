<template>
    <div>
        <button v-tooltip="{ content: title, theme: 'vui-tooltip' }" class="btn vui-toolbar-btn" :class="{ 'active': active }" @click.prevent="runAction" @mousedown="onMouseDown">
            <svg-icon :content="{ icon, svg }" />
        </button>

        <iframe-menu-bubble :editor="editor" :field="field" />

        <iframe-menu-modal
            v-model="model"
            :show="showEditModal"
            :editor="editor"
            :field="field"
            confirm-button="Insert"
            modal-title="Insert iFrame"
            @close="closeModal"
        />
    </div>
</template>

<script>
import tippy from 'tippy.js';

import SvgIcon from '../SvgIcon.vue';
import IframeMenuBubble from './IframeMenuBubble.vue';
import IframeMenuModal from './IframeMenuModal.vue';

export default {
    name: 'IframeMenuBarItem',

    components: {
        SvgIcon,
        IframeMenuBubble,
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
    },
};

</script>
