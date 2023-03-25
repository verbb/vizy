<template>
    <div>
        <button v-tooltip="{ content: title, theme: 'vui-tooltip' }" class="btn vui-toolbar-btn" :class="{ 'active': active }" @click.prevent="() => {}" @mousedown="onMouseDown">
            <svg-icon :content="{ icon, svg }" />
        </button>

        <div class="vui-toolbar-dropdown-container vui-toolbar-dropdown-link" style="display: none;">
            <div v-if="!active">
                <button
                    v-for="(option, i) in linkOptions" :key="i" class="vui-toolbar-dropdown" :class="'vui-toolbar-dropdown-item-link-' + option.refHandle" @click.prevent="openElementModal(option)"
                >
                    {{ option.optionTitle }}
                </button>

                <button class="vui-toolbar-dropdown vui-toolbar-dropdown-item-link" @click.prevent="openNewModal">
                    {{ t('vizy', 'Insert Link') }}
                </button>
            </div>

            <div v-else>
                <button class="vui-toolbar-dropdown vui-toolbar-dropdown-item-link" @click.prevent="openEditModal">
                    {{ t('vizy', 'Edit Link') }}
                </button>
            </div>

            <button class="vui-toolbar-dropdown vui-toolbar-dropdown-item-unlink" @click.prevent="unlinkAction">
                {{ t('vizy', 'Unlink') }}
            </button>
        </div>

        <link-menu-bubble :editor="editor" :field="field" />

        <link-menu-modal
            v-model="model"
            :show="showEditModal"
            :editor="editor"
            :field="field"
            confirm-button="Insert"
            modal-title="Insert Link"
            @close="closeModal"
        />
    </div>
</template>

<script>
import tippy from 'tippy.js';
import 'tippy.js/themes/light-border.css';

import SvgIcon from '../SvgIcon.vue';
import LinkMenuBubble from './LinkMenuBubble.vue';
import LinkMenuModal from './LinkMenuModal.vue';

export default {
    name: 'MenuBarItem',

    components: {
        SvgIcon,
        LinkMenuModal,
        LinkMenuBubble,
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

        title: {
            type: String,
            default: null,
        },

        isActive: {
            type: Function,
            default: () => {},
        },
    },

    data() {
        return {
            tippy: null,
            showEditModal: false,

            model: {},
        };
    },

    computed: {
        active() {
            return this.isActive && this.isActive();
        },

        linkOptions() {
            return this.field.settings.linkOptions;
        },
    },

    created() {
        this.resetModel();
    },

    mounted() {
        this.$nextTick(() => {
            const $template = this.$el.querySelector('.vui-toolbar-dropdown-link');
            const $button = this.$el;

            if ($template && $button) {
                $template.style.display = 'block';

                this.tippy = tippy($button, {
                    content: $template,
                    trigger: 'click',
                    allowHTML: true,
                    arrow: false,
                    interactive: true,
                    placement: 'bottom-start',
                    theme: 'light-border toolbar-dropdown',
                    zIndex: 1000,
                    hideOnClick: true,
                    offset: [0, 1],
                });
            }
        });

        // Create keyboard shortcuts
        this._keyListener = function(e) {
            // Only watch events for the currently-focused input
            if (!this.editor.vizyField.isFocused()) {
                return;
            }

            if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();

                this.openNewModal();
            }
        };

        document.addEventListener('keydown', this._keyListener.bind(this));
    },

    beforeUnmount() {
        document.removeEventListener('keydown', this._keyListener);
    },

    methods: {
        resetModel() {
            this.model = {
                url: null,
                text: null,
                target: null,
                class: null,
            };
        },

        openNewModal() {
            this.tippy.hide();
            this.resetModel();

            // Check if we've selected a text node already and use that
            const selectedText = this.getSelectedText();

            if (selectedText) {
                this.model.text = selectedText;
            }

            this.showEditModal = true;
        },

        openEditModal() {
            this.tippy.hide();

            const { from, to } = this.editor.view.state.selection;
            const $node = this.editor.view.docView.domFromPos(from).node;
            const attrs = this.editor.getAttributes('link');

            this.model.text = $node.textContent;
            this.model.url = attrs.href;
            this.model.target = attrs.target;
            this.model.class = attrs.class;

            this.showEditModal = true;
        },

        closeModal() {
            this.showEditModal = false;
        },

        openElementModal(selectedElement) {
            this.tippy.hide();
            this.resetModel();

            Craft.createElementSelectorModal(selectedElement.elementType, {
                storageKey: `VizyInput.LinkTo.${selectedElement.elementType}`,
                sources: selectedElement.sources,
                criteria: selectedElement.criteria,
                defaultSiteId: this.elementSiteId,
                autoFocusSearchBox: false,
                onSelect: $.proxy((elements) => {
                    if (elements.length) {
                        const [element] = elements;

                        this.model.url = `${element.url}#${selectedElement.refHandle}:${element.id}@${element.siteId}`,
                        this.model.text = this.getSelectedText() || element.label;

                        this.tippy.hide();

                        this.showEditModal = true;
                    }
                }, this),
                closeOtherModals: false,
            });
        },

        getSelectedText() {
            const { from, to } = this.editor.state.selection;
            const selectedText = this.editor.state.doc.textBetween(from, to, ' ');

            if (selectedText) {
                return selectedText;
            }

            return false;
        },

        unlinkAction() {
            this.tippy.hide();

            this.editor.chain().focus().unsetLink().run();
        },

        onMouseDown(e) {
            e.preventDefault();
        },
    },
};

</script>
