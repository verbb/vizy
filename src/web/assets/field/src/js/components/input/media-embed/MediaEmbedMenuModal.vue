<template>
    <menu-bar-modal
        v-model="proxyShow"
        class="vui-modal-media-embed-edit"
        attach="body"
        :esc-to-close="true"
        :focus-trap="true"
        :confirm-button="$attrs['confirm-button']"
        @confirm="confirmModal"
        @cancel="cancelModal"
    >
        <template #title>{{ t('vizy', $attrs['modal-title']) }}</template>

        <!-- eslint-disable vue/no-mutating-props -->
        <div id="url-field" class="field" :class="{ 'has-errors': errors.includes('url') }">
            <div class="heading">
                <label id="url-label" class="required" for="url">{{ t('vizy', 'URL') }}</label>
            </div>

            <div class="input ltr" :class="{ 'errors': errors.includes('url') }">
                <input
                    id="url"
                    v-model="modelValue.url"
                    type="text"
                    class="text fullwidth"
                    autofocus=""
                    autocomplete="off"
                    required
                >
            </div>

            <ul v-if="errors.includes('url')" class="errors">
                <li>{{ t('vizy', 'URL cannot be blank.') }}</li>
            </ul>
        </div>

        <!-- eslint-enable vue/no-mutating-props -->
    </menu-bar-modal>
</template>

<script>
import { TextSelection } from 'prosemirror-state';

import { getMarkRange } from '@utils/tiptap/marks';
import MenuBarModal from '../MenuBarModal.vue';

export default {
    name: 'MediaEmbedMenuModal',

    components: {
        MenuBarModal,
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

        show: {
            type: Boolean,
            default: false,
        },

        modelValue: {
            type: Object,
            default: () => {
                return this.proxyValue;
            },
        },
    },

    emits: ['update:modelValue', 'close'],

    data() {
        return {
            targetId: `target-${Craft.randomString(10)}`,
            proxyShow: false,
            proxyValue: {
                url: null,
                data: null,
            },
            errors: [],
        };
    },

    watch: {
        show(newValue) {
            this.proxyShow = newValue;
        },

        proxyShow(newValue) {
            if (newValue === false) {
                this.$emit('close');
            }
        },

        proxyValue(newValue) {
            this.$emit('update:modelValue', newValue);
        },
    },

    methods: {
        cancelModal() {
            this.proxyShow = false;
        },

        confirmModal() {
            /* eslint-disable vue/no-mutating-props */
            this.errors = [];

            this.editor.chain().focus().setEmbed(this.modelValue).run();

            this.proxyShow = false;
            /* eslint-enable vue/no-mutating-props */
        },
    },
};

</script>

<style lang="scss">

.vui-modal-media-embed-edit .vui-modal-content {
    max-width: 600px;
    max-height: 220px;
}

</style>
