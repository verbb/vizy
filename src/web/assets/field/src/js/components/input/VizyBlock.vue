<template>
    <node-view-wrapper 
        v-if="!isEmpty(blockType)"
        class="vizyblock"
        :class="{ 'has-focus': selected }"
        contenteditable="false"
        @copy.stop
        @paste.stop
        @cut.stop
    >
        <div class="vizyblock-header">
            <div class="titlebar">
                <div class="blocktype"><span v-if="$isDebug">{{ uid }} {{ node.attrs.id }} </span>{{ blockType.name }}</div>

                <div v-if="collapsed" class="preview" v-html="preview"></div>
            </div>

            <div class="actions-tabs">
                <div v-if="Object.keys(tabs).length > 1" class="titlebar-tabs">
                    <a v-for="(tab, index) in tabs" :key="index" class="tab" :class="{ 'active': index === activeTab }" @click.prevent="clickTab(index)">
                        {{ tab.label }}
                    </a>
                </div>

                <div class="actions">
                    <lightswitch-field v-model="enabled" :extra-small="true" />
                    <a
                        class="settings icon" title="Actions" aria-label="Actions" role="button" tabindex="0"
                        aria-haspopup="listbox" aria-expanded="false"
                    ></a>
                    <a
                        class="move icon" title="Reorder" aria-label="Reorder" data-drag-handle role="button"
                        @mousedown="clickMove"
                    ></a>
                </div>

                <div id="vizy-block-settings-template" class="vizy-menu" style="display: none;">
                    <ul class="padded" role="listbox" aria-hidden="true">
                        <li v-if="collapsed">
                            <a data-icon="expand" role="option" tabindex="-1" @click.prevent="expandBlock">Expand</a>
                        </li>

                        <li v-else>
                            <a data-icon="collapse" role="option" tabindex="-1" @click.prevent="collapseBlock">Collapse</a>
                        </li>

                        <hr>

                        <li>
                            <a class="error" data-icon="remove" role="option" tabindex="-1" @click.prevent="deleteBlock">Delete</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <slide-up-down :active="!collapsed" :duration="300">
            <vizy-block-fields v-if="fieldsHtml" ref="fields" :key="updateFieldsHtml" class="vizyblock-fields" :template="fieldsHtml" @update="onFieldUpdate" />
        </slide-up-down>
    </node-view-wrapper>
</template>

<script>
import get from 'lodash/get';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

import { NodeViewWrapper } from '@tiptap/vue-2';

import LightswitchField from '../settings/LightswitchField.vue';
import VizyBlockFields from './VizyBlockFields.vue';
import SlideUpDown from './SlideUpDown.vue';

import htmlize from '@utils/htmlize';
import { getClosest } from '@utils/dom';

export default {
    name: 'VizyBlock',

    components: {
        NodeViewWrapper,
        LightswitchField,
        VizyBlockFields,
        SlideUpDown,
    },

    props: {
        editor: {
            type: Object,
            default: () => {},
        },

        node: {
            type: Object,
            default: () => {},
        },

        decorations: {
            type: Array,
            default: () => [],
        },

        selected: {
            type: Boolean,
            default: false,
        },

        extension: {
            type: Object,
            default: () => {},
        },

        getPos: {
            type: Function,
            default: () => {},
        },

        updateAttributes: {
            type: Function,
            default: () => {},
        },
    },

    data() {
        return {
            activeTab: null,
            tippy: null,
            fieldsHtml: '',
            mounted: false,
            updateFieldsHtml: 0,
        };
    },

    computed: {
        options() {
            return this.extension.options;
        },

        vizyField() {
            return this.editor.vizyField;
        },

        values() {
            return this.node.attrs.values;
        },

        blockGroups() {
            return this.vizyField.settings.blockGroups;
        },

        blockType() {
            var blockType = {};

            if (!isEmpty(this.blockGroups)) {
                this.blockGroups.forEach((blockGroup) => {
                    var foundBlockType = find(blockGroup.blockTypes, { id: this.values.type });

                    if (foundBlockType) {
                        blockType = foundBlockType;
                    }
                });
            }

            return blockType;
        },

        tabs() {
            return this.blockType.tabs || {};
        },

        enabled: {
            get() {
                return this.node.attrs.enabled && this.blockType.enabled;
            },
            set(enabled) {
                return this.updateAttributes({ enabled });
            },
        },

        collapsed: {
            get() {
                return this.node.attrs.collapsed;
            },
            set(collapsed) {
                return this.updateAttributes({ collapsed });
            },
        },

        preview() {
            var previewHtml = '';

            if (this.mounted) {
                var $fields = $(this.$refs.fields.$el).children().children();

                for (var i = 0; i < $fields.length; i++) {
                    var $field = $($fields[i]),
                        $inputs = $field.children('.input').find('select,input[type!="hidden"],textarea,.label'),
                        inputPreviewText = '';

                    for (var j = 0; j < $inputs.length; j++) {
                        var $input = $($inputs[j]),
                            value;

                        if ($input.hasClass('vui-json-content')) {
                            continue;
                        }

                        if ($input.hasClass('label')) {
                            var $maybeLightswitchContainer = $input.parent().parent();

                            if ($maybeLightswitchContainer.hasClass('lightswitch') && (
                                ($maybeLightswitchContainer.hasClass('on') && $input.hasClass('off')) ||
                                (!$maybeLightswitchContainer.hasClass('on') && $input.hasClass('on'))
                            )) {
                                continue;
                            }

                            value = $input.text();
                        }
                        else {
                            value = Craft.getText(Garnish.getInputPostVal($input));
                        }

                        if (value instanceof Array) {
                            value = value.join(', ');
                        }

                        if (value) {
                            value = Craft.trim(value);

                            if (value) {
                                if (inputPreviewText) {
                                    inputPreviewText += ', ';
                                }

                                inputPreviewText += value;
                            }
                        }
                    }

                    if (inputPreviewText) {
                        previewHtml += (previewHtml ? ' <span>|</span> ' : '') + inputPreviewText;
                    }
                }
            }

            return previewHtml;
        },
    },

    watch: {
        'node.attrs.enabled'(newValue, oldValue) {
            this.collapsed = !newValue;
        },
        'node.attrs.id'(newValue, oldValue) {
            // When blocks are moved, they'll be re-ordered and re-rendered in their new order, But this really messes
            // up our DOM handling for fields. So keep track of when the ID changes to detect when blocks have been
            // updated by moving. We then need to fetch the cached HTML, and re-init any JS.
            this.fieldsHtml = this.vizyField.getCachedFieldHtml(newValue);

            // Trigger the fields to update, manually by changing the update variable (which is keyed to the component)
            this.updateFieldsHtml += 1;

            this.$nextTick(() => {
                this.appendJs();

                this.setFirstActiveTab();
            });
        },
    },

    created() {
        // Listen to an even raised (when moving a block) to serialize the DOM content of this block.
        // This is because Vue will re-render all blocks from scratch, and we'll loose our block content.
        // So save it before we re-render, after which, it'll render the saved HTML on-render.
        this.$events.$on('vizy-blocks:updateDOM', this.onUpdateDOM);

        // Set the HTML for the block's fields
        this.fieldsHtml = this.vizyField.getCachedFieldHtml(this.node.attrs.id);
    },

    mounted() {
        this.$nextTick(() => {
            this.appendJs();

            this.setFirstActiveTab();

            this.mounted = true;

            const $template = this.$el.querySelector('#vizy-block-settings-template');

            if ($template) {
                $template.style.display = 'block';

                this.tippy = tippy(this.$el.querySelector('.vizyblock-header .settings'), {
                    content: $template,
                    trigger: 'click',
                    allowHTML: true,
                    arrow: true,
                    interactive: true,
                    appendTo: document.body,
                    placement: 'bottom',
                    theme: 'light-border vizy-tippy-menu',
                    maxWidth: '300px',
                    zIndex: 1000,
                    hideOnClick: true,
                });
            }

            // This is a dirty hack to fix Firefox's inability to select inputs/textareas when the 
            // parent element is set to draggable. Note the direct DOM update instead of a prop.
            this.$el.setAttribute('draggable', false);
        });
    },

    beforeDestroy() {
        // Destroy event listeners for this block
        this.$events.$off('vizy-blocks:updateDOM', this.onUpdateDOM);
    },

    methods: {
        isEmpty(value) {
            return isEmpty(value);
        },

        onUpdateDOM() {
            this.$nextTick(() => {
                if (this.$refs.fields) {
                    var $fieldsHtml = $(this.$refs.fields.$el.childNodes).clone();

                    // Special-case for Redactor. We need to reset it to its un-initialized form
                    // because it doesn't have better double-binding checks.
                    if ($fieldsHtml.find('.redactor-box').length) {
                        // Rip out the `textarea` which is all we need
                        var $textarea = $fieldsHtml.find('.redactor-box textarea').htmlize();
                        $fieldsHtml.find('.redactor-box').replaceWith($textarea);
                    }

                    var fieldsHtml = $fieldsHtml.htmlize();

                    this.vizyField.setCachedFieldHtml(this.node.attrs.id, fieldsHtml);
                }
            });
        },

        clickTab(index) {
            this.activeTab = index;

            var $tabs = this.$refs.fields.$el.querySelectorAll('.vizyblock-fields > div');

            $tabs.forEach($tab => {
                if ($tab.getAttribute('id').includes(this.activeTab)) {
                    $tab.classList.remove('hidden');
                } else {
                    $tab.classList.add('hidden');
                }
            });
        },

        setFirstActiveTab() {
            if (this.tabs) {
                [this.activeTab] = Object.keys(this.tabs);
            }
        },

        appendJs() {
            // Add any JS required by fields
            var footHtml = this.vizyField.getCachedFieldJs(this.node.attrs.id);
            var $script = document.querySelector('#script-' + this.node.attrs.id);

            if (footHtml) {
                // But first check if already output. Otherwise, multiple bindings!
                if ($script) {
                    $script.parentElement.removeChild($script);
                }

                Craft.appendFootHtml(footHtml);
            }
        },

        deleteBlock() {
            // Hide, don't destory, because of how Tiptap re-renders blocks
            this.tippy.hide();

            // Give it a second to hide tippy first
            setTimeout(() => {
                const pos = this.getPos();
                const range = { from: pos, to: pos + this.node.nodeSize };

                this.editor.chain().focus().deleteRange(range).run();
            }, 200);
        },

        collapseBlock() {
            this.collapsed = true;

            this.tippy.hide();
        },

        expandBlock() {
            this.collapsed = false;

            this.tippy.hide();
        },

        clickMove() {
            // Before we move blocks, save the dom state. Use an event to notify all blocks, because Vue will
            // re-render all blocks, due to how tiptap/prosemirror renders.
            this.$events.$emit('vizy-blocks:updateDOM');
        },

        onFieldUpdate() {
            this.serializeFieldContent();
        },

        findContentBlocksForBlock(content) {
            var foundContent = {};

            if (!isEmpty(content)) {
                // Special-handling when in the element slideout
                const slideout = document.querySelector('.slideout.element-editor .ee-body');

                if (slideout) {
                    // eslint-disable-next-line
                    content = Object.values(content)[0];
                }
                
                Object.entries(content.fields).forEach(([fieldHandle, fieldBlocks]) => {
                    if (!isEmpty(fieldBlocks.blocks)) {
                        Object.entries(fieldBlocks.blocks).forEach(([blockId, blockFields]) => {
                            if (blockId === this.node.attrs.id) {
                                foundContent = blockFields;
                            } else {
                                foundContent = this.findContentBlocksForBlock(blockFields);
                            }
                        });
                    }
                });
            }

            return foundContent;
        },

        serializeFieldContent() {
            var postData = Garnish.getPostData(this.$refs.fields.$el);
            var content = Craft.expandPostArray(postData);
            var fieldContent = this.findContentBlocksForBlock(content);

            // Generate a POST data object, and save it
            let values = Object.assign({}, this.values);

            values.content = fieldContent;
            
            this.updateAttributes({ values });
        },
    },
};

</script>

<style lang="scss">

.vizyblock {
    position: relative;
    margin: 10px 0;
    padding: 0 12px 12px;
    border-radius: 5px;
    outline: none;

    white-space: normal;
    background-color: #fff;
    border: 1px solid #cdd9e4;

    &.has-focus {
        box-shadow: 0 0 0 1px #127fbf, 0 0 0 3px rgb(18 127 191 / 50%);
    }

    .vizy-static & {
        padding-top: 12px;
    }
}

// Provide a bigger gap for two Vizy blocks directly after one another
// and be sure to check if the gapcursor has been inserted, as that's the same behavior
.vizyblock + .vizyblock,
.vizyblock + .ProseMirror-gapcursor + .vizyblock {
    margin-top: 20px;
}

.vizyblock-header {
    height: 31px;
    padding: 0 12px;
    margin: 0 -12px;
    width: calc(100% + 24px);
    box-sizing: border-box;
    border-radius: 5px 5px 0 0;
    color: #606d7b;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-wrap: normal;
    cursor: default;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f3f7fc;
    border-bottom: 1px solid #cdd9e4;
}

.vizyblock-header .titlebar {
    display: flex;
    align-items: center;
    overflow: hidden;
}

.vizyblock-header .blocktype {
    display: inline;
    color: #667c92;
    font-size: 12px;
    font-weight: 500;
}

.vizyblock-header .preview {
    margin-left: 7px;
    max-width: 50%;
    text-overflow: ellipsis;
    overflow: hidden;
}

.vizyblock-header .actions-tabs {
    display: flex;
    align-items: center;
}

.vizyblock-header .actions {
    float: none !important;
    display: flex;
    align-items: center;

    a {
        text-decoration: none;
    }
}

.vizyblock-header .actions .lightswitch {
    margin-right: 10px;
}

.vizyblock-header .actions .settings {
    margin-right: 10px;
    font-size: 16px;
    display: flex;
    color: rgba(123, 135, 147, 0.5);
    outline: 0;

    &:hover {
        color: #0B69A3;
    }
}

.vizyblock-header .actions .move {
    display: flex;
}

.vizyblock-header .titlebar-tabs {
    margin-right: 10px;
}

.vizyblock-header .tab {
    display: inline-block;
    padding: 5px 10px;
    color: #576575;
    font-size: 12px;
    text-decoration: none;
    margin-bottom: -1px;
    margin-right: -1px;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    border-bottom: 1px solid transparent;

    &:hover {
        text-decoration: none;
    }

    &.active {
        cursor: default;
        border-left-color: #e3e5e8;
        border-right-color: #e3e5e8;
        border-bottom-color: #fff;
        background-color: #fff;
    }
}

.vizyblock-fields {
    padding-top: 14px;
}

// Fix overflow issues from Craft's field layout, causing cursor issues in the editor
// Selectors also need to be very specific to override Craft.
#content .vizyblock-fields :not(.meta) > .flex-fields {
    margin-left: 0 !important;
    margin-right: 0 !important;
    width: 100% !important;

    > :not(h2):not(hr),
    > :not(h2):not(hr):last-child {
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100% !important;

        @media only screen and (min-width: 1536px) {
            &.width-25 {
                width: 25% !important;
            }

            &.width-50 {
                width: 50% !important;
            }

            &.width-75 {
                width: 75% !important;
            }
        }

        @media only screen and (min-width: 500px) and (max-width: 1535px) {
            &.width-25,
            &.width-50 {
                width: 50% !important;
            }
        }
    }
}

.vizyblock-fields .field > .heading > label {
    font-weight: 600;
    color: #596673;
    font-size: 13px;
}

.tippy-box[data-theme~='vizy-tippy-menu'] > .tippy-content {
    padding: 0;
    min-height: auto;
    min-width: 100px;
}

.vizy-menu {
    ul li a {
        padding: 10px 14px;
        color: #3f4d5a;
        text-decoration: none;
        white-space: nowrap;
        font-size: 14px;
        outline: 0;
    }

    a:hover {
        color: #3f4d5a;
        background-color: #f3f7fc;
    }

    ul.padded li a {
        padding-left: 24px;
    }

    ul li a:not(.flex) {
        display: block !important;
    }

    hr.padded {
        margin-left: 10px;
    }

    hr {
        margin: 5px -14px;
    }

    ul.padded li a[data-icon]:before,
    ul.padded li a.icon:before,
    ul.padded li a.sel:before {
        margin: 3px 0 0 -17px;
    }

    ul.padded li a[data-icon]:before,
    ul.padded li a.icon:before,
    ul.padded li a.sel:before {
        float: left;
    }

    ul.padded li a[data-icon]:before,
    ul.padded li a.icon:before,
    ul.padded li a.sel:before {
        font-size: 14px;
        color: #606d7b;
    }

    ul.padded li a[data-icon].error:before,
    ul.padded li a.icon.error:before,
    ul.padded li a.sel.error:before {
        color: #CF1124;
    }
}


</style>
