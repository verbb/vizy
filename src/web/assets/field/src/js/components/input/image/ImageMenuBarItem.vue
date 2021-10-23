<template>
    <div>
        <button v-tooltip="title" class="btn vui-toolbar-btn" :class="{ 'active': active }" @click.prevent="runAction" @mousedown="onMouseDown">
            <svg-icon :content="{ icon, svg }" />
        </button>

        <image-menu-bubble :editor="editor" :field="field" />

        <image-menu-modal
            v-model="model"
            :show="showEditModal"
            :editor="editor"
            :field="field"
            confirm-button="Insert"
            modal-title="Insert Image"
            @close="closeModal"
        />
    </div>
</template>

<script>
import tippy from 'tippy.js';

import SvgIcon from '../SvgIcon.vue';
import ImageMenuBubble from './ImageMenuBubble.vue';
import ImageMenuModal from './ImageMenuModal.vue';

export default {
    name: 'ImageMenuBarItem',

    components: {
        SvgIcon,
        ImageMenuBubble,
        ImageMenuModal,
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
        
        volumes() {
            return this.field.settings.volumes;
        },
        
        transforms() {
            return this.field.settings.transforms;
        },
        
        elementSiteId() {
            return this.field.settings.elementSiteId;
        },

        defaultTransform() {
            return this.field.settings.defaultTransform;
        },

        allowAllUploaders() {
            return this.field.settings.allowAllUploaders;
        },
    },

    created() {
        this.resetModel();
    },

    methods: {
        _buildAssetUrl: (assetId, assetUrl, transform) => assetUrl + '#asset:' + assetId + ':' + (transform ? 'transform:' + transform : 'url'),

        _isTransformUrl: (url) => /(.*)(_[a-z0-9+].*\/)(.*)/.test(url),

        _getTransformUrl(assetId, handle, callback) {
            var data = {
                assetId,
                handle,
            };

            Craft.postActionRequest('assets/generate-transform', data, (response, textStatus) => {
                if (textStatus === 'success') {
                    if (response.url) {
                        callback(response.url);
                    } else {
                        alert('There was an error generating the transform URL.');
                    }
                }
            });
        },

        runAction() {
            const criteria = {
                siteId: this.elementSiteId,
                kind: 'image',
            };

            if (this.allowAllUploaders) {
                criteria.uploaderId = null;
            }

            this.assetSelectionModal = Craft.createElementSelectorModal('craft\\elements\\Asset', {
                storageKey: 'VizyInput.ChooseImage',
                multiSelect: true,
                sources: this.volumes,
                criteria,
                onSelect: function(assets, transform) {
                    if (assets.length) {
                        const data = {};
                        const isMulti = assets.length > 1;

                        const processAssetUrls = function(assets, callback) {
                            const asset = assets.pop();
                            const isTransform = this._isTransformUrl(asset.url);

                            // If transform was selected or we don't have a default, no _real_ processing.
                            if (isTransform || this.defaultTransform.length == 0) {
                                data['asset' + asset.id] = {
                                    id: asset.id,
                                    src: this._buildAssetUrl(asset.id, asset.url, isTransform ? transform : this.defaultTransform),
                                    alt: asset.label,
                                    title: asset.label,
                                    transform: isTransform ? transform : this.defaultTransform,
                                };

                                if (assets.length) {
                                    processAssetUrls(assets, callback);
                                } else {
                                    callback();
                                }
                            // Otherwise, get the transform url for the default transform.
                            } else {
                                let url = this._getTransformUrl(asset.id, this.defaultTransform, (url) => {
                                    data['asset' + asset.id] = {
                                        id: asset.id,
                                        src: this._buildAssetUrl(asset.id, url, this.defaultTransform),
                                        alt: asset.label,
                                        title: asset.label,
                                        transform: this.defaultTransform,
                                    };

                                    if (assets.length) {
                                        processAssetUrls(assets, callback);
                                    } else {
                                        callback();
                                    }
                                });
                            }
                        }.bind(this);

                        processAssetUrls(assets, () => {
                            Object.keys(data).forEach(key => {
                                this.model = { ...this.model, ...data[key] };

                                this.showEditModal = true;
                            });
                        });
                    }
                }.bind(this),
                transforms: this.transforms,
                closeOtherModals: false,
            });
        },

        resetModel() {
            this.model = {
                id: null,
                src: null,
                alt: null,
                title: null,
                url: null,
                target: null,
                transform: this.defaultTransform,
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
