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
        <template #title>{{ $attrs['modal-title'] | t('vizy') }}</template>

        <div class="vizy-modal-image-preview">
            <img :src="value.src">
        </div>

        <div class="vizy-modal-image-fields">
            <div id="alt-field" class="field">
                <div class="heading">
                    <label id="alt-label" for="alt">{{ 'Alt Text' | t('vizy') }}</label>
                </div>

                <div class="input ltr">
                    <input
                        id="alt"
                        v-model="value.alt"
                        type="text"
                        class="text fullwidth"
                        autofocus=""
                        autocomplete="off"
                    >
                </div>    
            </div>

            <div id="title-field" class="field">
                <div class="heading">
                    <label id="title-label" for="title">{{ 'Title' | t('vizy') }}</label>
                </div>

                <div class="input ltr">
                    <input
                        id="title"
                        v-model="value.title"
                        type="text"
                        class="text fullwidth"
                        autofocus=""
                        autocomplete="off"
                    >
                </div>    
            </div>

            <div id="url-field" class="field">
                <div class="heading">
                    <label id="url-label" for="url">{{ 'URL' | t('vizy') }}</label>
                </div>

                <div class="input ltr">
                    <input
                        id="url"
                        v-model="value.url"
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
                        v-model="value.target"
                        type="checkbox"
                        class="checkbox"
                    >
                    <label :for="targetId">
                        {{ 'Open link in new tab' | t('vizy') }}
                    </label>
                </div>    
            </div>

            <div id="transform-field" class="field first">
                <div class="heading">
                    <label id="transform-label" for="transform">{{ 'Transform' | t('vizy') }}</label>
                </div>

                <div class="input ltr">
                    <div class="select">
                        <select id="transform" v-model="value.transform">
                            <option value="">{{ 'No Transform' | t('vizy') }}</option>

                            <option v-for="(transform, i) in transforms" :key="i" :value="transform.handle">
                                {{ transform.name }}
                            </option>
                        </select>
                    </div>
                </div>    
            </div>
        </div>
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

        value: {
            type: Object,
            default: () => {
                return this.proxyValue;
            },
        },
    },

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
            this.$emit('input', newValue);
        },
    },

    methods: {
        _buildAssetUrl: (assetId, assetUrl, transform) => assetUrl + '#asset:' + assetId + ':' + (transform ? 'transform:' + transform : 'url'),

        _removeTransformFromUrl: (url) => url.replace(/(.*)(_[a-z0-9+].*\/)(.*)/, '$1$3'),

        _getTransformUrl(assetId, handle, callback) {
            var data = {
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
            this.errors = [];

            let url = this._removeTransformFromUrl(this.value.src.split('#')[0]);

            // Set the target value properly
            this.value.target = this.value.target ? '_blank' : '';

            if (this.value.transform) {
                this._getTransformUrl(this.value.id, this.value.transform, (url) => {
                    this.value.src = this._buildAssetUrl(this.value.id, url, this.value.transform);

                    this.editor.chain().focus().setImage(this.value).run();
                });
            } else {
                this.value.src = url;

                this.editor.chain().focus().setImage(this.value).run();
            }

            this.proxyShow = false;
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
    display: flex;
    margin: 0 -16px;
}

.vizy-modal-image-preview {
    padding: 0 16px;
    width: 200px;

    img {
        max-width: 100%;
        height: auto;
        display: block;
    }
}

.vizy-modal-image-fields {
    padding: 0 16px;
    flex: 1;
}

</style>
