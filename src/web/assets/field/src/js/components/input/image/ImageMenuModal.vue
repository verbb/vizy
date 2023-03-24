<template>
    <menu-bar-modal
        v-model="proxyShow"
        class="vui-modal-image-edit"
        attach="body"
        :esc-to-close="true"
        :focus-trap="true"
        :confirm-button="$attrs['confirm-button']"
        @confirm="confirmModal"
        @cancel="cancelModal"
    >
        <template #title>{{ t('vizy', $attrs['modal-title']) }}</template>

        <div class="vui-modal-body-wrap">
            <!-- eslint-disable vue/no-mutating-props -->
            <div class="vizy-modal-image-preview">
                <img :src="modelValue.src">
            </div>

            <div class="vizy-modal-image-fields">
                <div id="alt-field" class="field">
                    <div class="heading">
                        <label id="alt-label" for="alt">{{ t('vizy', 'Alt Text') }}</label>
                    </div>

                    <div class="input ltr">
                        <input
                            id="alt"
                            v-model="modelValue.alt"
                            type="text"
                            class="text fullwidth"
                            autofocus=""
                            autocomplete="off"
                        >
                    </div>
                </div>

                <div id="title-field" class="field">
                    <div class="heading">
                        <label id="title-label" for="title">{{ t('vizy', 'Title') }}</label>
                    </div>

                    <div class="input ltr">
                        <input
                            id="title"
                            v-model="modelValue.title"
                            type="text"
                            class="text fullwidth"
                            autofocus=""
                            autocomplete="off"
                        >
                    </div>
                </div>

                <div id="url-field" class="field">
                    <div class="heading">
                        <label id="url-label" for="url">{{ t('vizy', 'URL') }}</label>
                    </div>

                    <div class="input ltr">
                        <input
                            id="url"
                            v-model="modelValue.url"
                            type="text"
                            class="text fullwidth"
                            autofocus=""
                            autocomplete="off"
                        >
                    </div>
                </div>

                <div id="target-field" class="checkboxfield field">
                    <div class="input ltr">
                        <input
                            :id="targetId"
                            v-model="modelValue.target"
                            type="checkbox"
                            class="checkbox"
                        >
                        <label :for="targetId">
                            {{ t('vizy', 'Open link in new tab') }}
                        </label>
                    </div>
                </div>

                <div id="transform-field" class="field first">
                    <div class="heading">
                        <label id="transform-label" for="transform">{{ t('vizy', 'Transform') }}</label>
                    </div>

                    <div class="input ltr">
                        <div class="select">
                            <select id="transform" v-model="modelValue.transform">
                                <option value="">{{ t('vizy', 'No Transform') }}</option>

                                <option v-for="(transform, i) in transforms" :key="i" :value="transform.handle">
                                    {{ transform.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- eslint-enable vue/no-mutating-props -->
    </menu-bar-modal>
</template>

<script>
import { TextSelection } from 'prosemirror-state';

import { getMarkRange } from '@utils/tiptap/marks';
import MenuBarModal from '../MenuBarModal.vue';

export default {
    name: 'ImageMenuModal',

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
                id: null,
                src: null,
                alt: null,
                title: null,
                url: null,
                target: null,
                transform: null,
            },
            errors: [],
        };
    },

    computed: {
        elementSiteId() {
            return this.field.settings.elementSiteId;
        },

        transforms() {
            return this.field.settings.transforms;
        },
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
        _buildAssetUrl: (assetId, assetUrl, transform) => { return `${assetUrl}#asset:${assetId}:${transform ? `transform:${transform}` : 'url'}`; },

        _removeTransformFromUrl: (url) => { return url.replace(/(.*)(_[a-z0-9+].*\/)(.*)/, '$1$3'); },

        _getTransformUrl(assetId, handle, callback) {
            const data = {
                assetId,
                handle,
            };

            Craft.sendActionRequest('POST', 'assets/generate-transform', { data })
                .then((response) => {
                    callback(response.data.url);
                })
                .catch(({ response }) => {
                    alert('There was an error generating the transform URL.');
                });
        },

        cancelModal() {
            this.proxyShow = false;
        },

        confirmModal() {
            /* eslint-disable vue/no-mutating-props */
            this.errors = [];

            const url = this._removeTransformFromUrl(this.modelValue.src.split('#')[0]);

            // Set the target value properly
            this.modelValue.target = this.modelValue.target ? '_blank' : '';

            if (this.modelValue.transform) {
                this._getTransformUrl(this.modelValue.id, this.modelValue.transform, (url) => {
                    this.modelValue.src = this._buildAssetUrl(this.modelValue.id, url, this.modelValue.transform);

                    this.editor.chain().focus().setImage(this.modelValue).run();
                });
            } else {
                this.modelValue.src = url;

                this.editor.chain().focus().setImage(this.modelValue).run();
            }

            this.proxyShow = false;
            /* eslint-enable vue/no-mutating-props */
        },
    },
};

</script>

<style lang="scss">

.vui-modal-image-edit .vui-modal-content {
    max-width: 800px;
    max-height: 600px;
}

.vui-modal-image-edit .vui-modal-body {
    padding: 0;
    // margin: 0 -16px;
}

.vui-modal-body-wrap {
    display: flex;
}

.vizy-modal-image-preview {
    padding: 16px;
    width: 200px;

    img {
        max-width: 100%;
        height: auto;
        display: block;
    }
}

.vizy-modal-image-fields {
    padding: 16px;
    flex: 1;
}

</style>
