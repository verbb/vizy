<template>
    <node-view-wrapper
        class="vizyblock"
        contenteditable="false"
        :data-vizy-block="true"
        :data-type="blockType.handle"
        @copy.stop
        @paste.stop
        @cut.stop
        @click="clickBlock"
    >
        <div v-if="!isEmpty(blockType)" class="vizyblock-wrap">
            <div class="vizyblock-header" @dblclick.prevent="toggleTitle">
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
                            class="settings icon"
                            :title="t('vizy', 'Actions')"
                            :aria-title="t('vizy', 'Actions')"
                            role="button"
                            tabindex="0"
                            aria-haspopup="listbox"
                            aria-expanded="false"
                        ></a>
                        <a
                            class="move icon"
                            :title="t('vizy', 'Reorder')"
                            :aria-title="t('vizy', 'Reorder')"
                            data-drag-handle
                            role="button"
                            @mousedown="clickMove"
                        ></a>
                    </div>

                    <div id="vizy-block-settings-template" class="vizy-menu" style="display: none;">
                        <ul class="padded" role="listbox" aria-hidden="true">
                            <li v-if="collapsed">
                                <a data-icon="expand" role="option" tabindex="-1" @click.prevent="expandBlock">{{ t('vizy', 'Expand') }}</a>
                            </li>

                            <li v-else>
                                <a data-icon="collapse" role="option" tabindex="-1" @click.prevent="collapseBlock">{{ t('vizy', 'Collapse') }}</a>
                            </li>

                            <li v-if="canCollapseAll">
                                <a data-icon="collapse" role="option" tabindex="-1" @click.prevent="collapseAll">{{ t('vizy', 'Collapse All') }}</a>
                            </li>

                            <li v-if="canExpandAll">
                                <a data-icon="expand" role="option" tabindex="-1" @click.prevent="expandAll">{{ t('vizy', 'Expand All') }}</a>
                            </li>

                            <hr>

                            <li>
                                <a class="error" data-icon="remove" role="option" tabindex="-1" @click.prevent="deleteBlock">{{ t('vizy', 'Delete') }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <collapse-transition>
                <div v-show="!collapsed">
                    <vizy-block-fields v-if="fieldsHtml" ref="fields" :key="updateFieldsHtml" class="vizyblock-fields" :template="fieldsHtml" @update="onFieldUpdate" />
                </div>
            </collapse-transition>
        </div>

        <div v-else class="vizyblock-wrap">
            <div class="vizyblock-invalid">
                <p class="error">{{ t('vizy', 'Unable to parse block definition.') }}</p>

                <a class="error" data-icon="remove" role="option" tabindex="-1" @click.prevent="deleteBlock"></a>
            </div>
        </div>
    </node-view-wrapper>
</template>

<script>
import {
    get, find, debounce, isEmpty,
} from 'lodash-es';
import { GapCursor } from 'prosemirror-gapcursor';
import { TextSelection, NodeSelection } from 'prosemirror-state';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

import { NodeViewWrapper } from '@tiptap/vue-3';
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue';

import LightswitchField from '../settings/LightswitchField.vue';
import VizyBlockFields from './VizyBlockFields.vue';

import htmlize from '@utils/htmlize';
import { getClosest } from '@utils/dom';

export default {
    name: 'VizyBlock',

    components: {
        NodeViewWrapper,
        LightswitchField,
        VizyBlockFields,
        CollapseTransition,
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
            default: () => { return []; },
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
            let blockType = {};

            if (!isEmpty(this.blockGroups)) {
                this.blockGroups.forEach((blockGroup) => {
                    const foundBlockType = find(blockGroup.blockTypes, { id: this.values.type });

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
                // We can't use `updateAttributes()` here due to it not working correctly when re-ordering blocks.
                // eslint-disable-next-line vue/no-mutating-props
                this.node.attrs.enabled = enabled;
            },
        },

        collapsed: {
            get() {
                return this.node.attrs.collapsed;
            },
            set(collapsed) {
                // We can't use `updateAttributes()` here due to it not working correctly when re-ordering blocks.
                // eslint-disable-next-line vue/no-mutating-props
                this.node.attrs.collapsed = collapsed;
            },
        },

        canCollapseAll() {
            let anyExpanded = false;

            this.editor.state.doc?.content?.content.forEach((node) => {
                if (node.type.name === 'vizyBlock') {
                    if (!node.attrs.collapsed) {
                        anyExpanded = true;
                    }
                }
            });

            return anyExpanded;
        },

        canExpandAll() {
            let anyCollapsed = false;

            this.editor.state.doc?.content?.content.forEach((node) => {
                if (node.type.name === 'vizyBlock') {
                    if (node.attrs.collapsed) {
                        anyCollapsed = true;
                    }
                }
            });

            return anyCollapsed;
        },

        preview() {
            let previewHtml = '';

            if (this.mounted) {
                const $fields = $(this.$refs.fields.$el).children().children();

                for (let i = 0; i < $fields.length; i++) {
                    const $field = $($fields[i]);
                    const $inputs = $field.children('.input').find('select,input[type!="hidden"],textarea,.label');

                    let inputPreviewText = '';

                    for (let j = 0; j < $inputs.length; j++) {
                        const $input = $($inputs[j]);
                        let value;

                        if ($input.hasClass('vui-json-content')) {
                            continue;
                        }

                        if ($input.hasClass('label')) {
                            const $maybeLightswitchContainer = $input.parent().parent();

                            if ($maybeLightswitchContainer.hasClass('lightswitch') && (
                                ($maybeLightswitchContainer.hasClass('on') && $input.hasClass('off')) ||
                                (!$maybeLightswitchContainer.hasClass('on') && $input.hasClass('on'))
                            )) {
                                continue;
                            }

                            value = $input.text();
                        } else {
                            value = Craft.getText(this._inputPreviewText($input));
                        }

                        if (value instanceof Array) {
                            value = value.join(', ');
                        }

                        if (value) {
                            value = Craft.trim(Craft.escapeHtml(value));

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
        'node.attrs.enabled': function(newValue, oldValue) {
            this.collapsed = !newValue;
        },
        'node.attrs.id': function(newValue, oldValue) {
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
        this.$nextTick(() => {
            this.$events.on('vizy-blocks:updateDOM', this.onUpdateDOM);
        });

        // Set the HTML for the block's fields
        this.fieldsHtml = this.vizyField.getCachedFieldHtml(this.node.attrs.id);

        this.$events.on('vizy-blocks:collapseAll', this.collapseBlock);
        this.$events.on('vizy-blocks:expandAll', this.expandBlock);
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
                    duration: 200,
                    zIndex: 1000,
                    hideOnClick: true,
                });
            }

            // This is a dirty hack to fix Firefox's inability to select inputs/textareas when the
            // parent element is set to draggable. Note the direct DOM update instead of a prop.
            this.$el.setAttribute('draggable', false);

            // Remove the ghost when moving a block. Most of the time, it's in the way
            this.$el.addEventListener('dragstart', (event) => {
                if (event.srcElement instanceof Element || event.srcElement instanceof HTMLDocument) {
                    let $ghost = null;
                    if (event.srcElement.classList.contains('vizyblock')) {
                        $ghost = event.srcElement.querySelector('.vizyblock-header');
                    } else {
                        $ghost = event.srcElement.closest('.vizyblock-header');
                    }

                    if ($ghost) {
                        const id = `vui-${this.uid}-ghost`;

                        const ghost = (document.querySelector(`#${id}`)) ? document.querySelector(`#${id}`) : document.createElement('div');
                        ghost.id = id;
                        ghost.classList = 'vui-block-ghost';
                        ghost.innerHTML = $ghost.outerHTML;
                        document.body.appendChild(ghost);

                        event.dataTransfer.setDragImage(ghost, 0, 0);
                    }
                }
            }, false);
        });
    },

    beforeUnmount() {
        // If we insert a new node before this Vizy node, it'll cause a re-render. But due to how
        // Tiptap works, it will wipe out all non-saved content. Because we're not fully data-driven
        // in our components, we need to cache the HTML now, before the component gets re-rendered as a
        // new Vue component instance. Test this by adding a Vizy block, then a paragraph directly before
        this.onUpdateDOM();

        // Destroy event listeners for this block
        this.$events.off('vizy-blocks:updateDOM', this.onUpdateDOM);
        this.$events.off('vizy-blocks:collapseAll', this.collapseBlock);
        this.$events.off('vizy-blocks:expandAll', this.expandBlock);
    },

    methods: {
        isEmpty(value) {
            return isEmpty(value);
        },

        _inputPreviewText($input) {
            if ($input.is('select,multiselect')) {
                const labels = [];
                const $options = $input.find('option:selected');

                for (let k = 0; k < $options.length; k++) {
                    labels.push($options.eq(k).text());
                }

                return labels;
            }

            if ($input.is('input[type="checkbox"]:checked,input[type="radio"]:checked')) {
                const id = $input.attr('id');
                const $label = $(`label[for="${id}"]`);

                if ($label.length) {
                    return $label.text();
                }
            }

            return Garnish.getInputPostVal($input);
        },

        onUpdateDOM() {
            if (this.$refs.fields) {
                const $fieldsHtml = $(this.$refs.fields.$el.childNodes).clone();

                // Special-case for Redactor. We need to reset it to its un-initialized form
                // because it doesn't have better double-binding checks.
                if ($fieldsHtml.find('.redactor-box').length) {
                    $fieldsHtml.find('.redactor-box').each((index, element) => {
                        // Skip any Redactor fields in nested Vizy fields within the block. They handle themselves.
                        if ($(element).parents('.vui-editor').length) {
                            return;
                        }

                        // Rip out the `textarea` which is all we need
                        const $textarea = $(element).find('textarea').htmlize();
                        $(element).replaceWith($textarea);
                    });
                }

                // Special-case for Selectize. We need to reset it to its un-initialized form
                // because it doesn't have better double-binding checks.
                if ($fieldsHtml.find('.selectize').length) {
                    $fieldsHtml.find('.selectize').each((index, element) => {
                        // This is absolutely ridiculous. Selectize strips out `<option>` elements, so we can't
                        // fetch the original data from the DOM. Instead, find it in the original block type template.

                        // Get the original field HTML from it's `data-layout-element` which contains the UID
                        const fieldUid = $(element).parents('[data-type]').data('layout-element');

                        if (fieldUid) {
                            // Get the original HTML
                            const $newHtml = $(this.blockType.fieldsHtml).find(`[data-layout-element="${fieldUid}"] .selectize`);

                            if ($newHtml.length) {
                                // Restore any selected elements
                                $newHtml.find('select').val($(element).find('select').val());

                                // Replace the HTML with the altered original template
                                element.innerHTML = $newHtml.htmlize();
                            }
                        }
                    });
                }

                const fieldsHtml = $fieldsHtml.htmlize();

                this.vizyField.setCachedFieldHtml(this.node.attrs.id, fieldsHtml);
            }
        },

        clickBlock(e) {
            // Manually trigger the gapcursor when clicking on the padding around a block. We need to use padding to get the
            // dropcursor to not flicker back and forth between blocks, but that doesn't work with gapcursor. So, we're going manual!

            // Detect if we're clicking on the outer block, which includes the padding (which is what we want)
            if (!e.target.hasAttribute('data-node-view-wrapper')) {
                return;
            }

            const clickPos = this.editor.view.posAtCoords({ left: e.clientX, top: e.clientY });

            if (clickPos && clickPos.inside > -1 && !NodeSelection.isSelectable(this.editor.view.state.doc.nodeAt(clickPos.inside))) {
                return false;
            }

            const $pos = this.editor.view.state.doc.resolve(clickPos.pos);
            this.editor.view.dispatch(this.editor.view.state.tr.setSelection(new GapCursor($pos)));
        },

        clickTab(index) {
            this.activeTab = index;

            // Only select immediate children of `.vizyblock-fields` to not affect nested Vizy fields
            const $tabs = this.$refs.fields.$el.querySelectorAll(':scope > div');

            $tabs.forEach(($tab) => {
                if ($tab.getAttribute('id').includes(this.activeTab)) {
                    $tab.classList.remove('hidden');
                } else {
                    $tab.classList.add('hidden');
                }
            });
        },

        toggleTitle(e) {
            const $actions = this.$el.querySelector('.actions-tabs');

            if ($actions.contains(e.target)) {
                return;
            }

            if (this.collapsed) {
                this.expandBlock();
            } else {
                this.collapseBlock();
            }
        },

        setFirstActiveTab() {
            if (this.tabs) {
                [this.activeTab] = Object.keys(this.tabs);
            }
        },

        appendJs() {
            // Add any JS required by fields
            const footHtml = this.vizyField.getCachedFieldJs(this.node.attrs.id);
            const $script = document.querySelector(`#script-${this.node.attrs.id}`);

            if (footHtml) {
                // But first check if already output. Otherwise, multiple bindings!
                if ($script) {
                    $script.parentElement.removeChild($script);
                }

                Craft.appendBodyHtml(footHtml);
            }
        },

        deleteBlock() {
            // Hide, don't destory, because of how Tiptap re-renders blocks
            if (this.tippy) {
                this.tippy.hide();
            }

            // Give it a second to hide tippy first
            setTimeout(() => {
                const pos = this.getPos();
                const range = { from: pos, to: pos + (this.node.nodeSize - 1) };

                this.editor.chain().focus().deleteRange(range).run();
            }, 200);
        },

        collapseBlock() {
            this.collapsed = true;

            if (this.tippy) {
                this.tippy.hide();
            }
        },

        expandBlock() {
            this.collapsed = false;

            if (this.tippy) {
                this.tippy.hide();
            }
        },

        collapseAll() {
            this.$events.emit('vizy-blocks:collapseAll');
        },

        expandAll() {
            this.$events.emit('vizy-blocks:expandAll');
        },

        clickMove() {
            // Before we move blocks, save the dom state. Use an event to notify all blocks, because Vue will
            // re-render all blocks, due to how tiptap/prosemirror renders.
            this.$events.emit('vizy-blocks:updateDOM');

            // Record which block type is clicked on to help us add checks for allowing between inputs
            this.vizyField.selectedBlockType = this.blockType.id;
        },

        onFieldUpdate() {
            this.serializeFieldContent();
        },

        findContentBlocksForBlock(content) {
            let foundContent = {};

            if (!isEmpty(content)) {
                // Special-handling when this field is in the element slideout
                const slideout = this.$el.closest('.slideout[data-element-editor] .so-body');

                if (slideout) {
                    // eslint-disable-next-line
                    content = Object.values(content)[0];

                    // Extra handling for nested Vizy fields
                    if (isEmpty(content.fields)) {
                        content = { fields: content };
                    }
                }

                // We change the root `fields` to `vizyBlockFields` but not for nested items.
                let contentRoot = content.vizyBlockFields;

                if (isEmpty(contentRoot)) {
                    contentRoot = content.fields;
                }

                if (!isEmpty(contentRoot)) {
                    Object.entries(contentRoot).forEach(([fieldHandle, fieldBlocks]) => {
                        // In some instances (when using a recusive field) we've actually already got the block content here
                        if (fieldBlocks.blocks === undefined) {
                            foundContent = { fields: contentRoot };
                        }

                        if (!isEmpty(fieldBlocks.blocks)) {
                            Object.entries(fieldBlocks.blocks).forEach(([blockId, blockFields]) => {
                                if (blockId === this.node.attrs.id) {
                                    foundContent = blockFields;
                                } else if (isEmpty(foundContent)) {
                                    // Because we recurively iterate down many children to find the _first_
                                    // instance where our block data exists, we want to check if it's already set.
                                    // It's more critical for nested Vizy fields which have the serialized content
                                    // and the POST content from fields (which we don't want). Otherwise, we just
                                    // end up overwriting the data we want!
                                    foundContent = this.findContentBlocksForBlock(blockFields);
                                }
                            });
                        }
                    });
                }
            }

            return foundContent;
        },

        fixArrayIndexes(obj) {
            if (Array.isArray(obj)) {
                // Check if the array has any missing indexes
                const indexes = Object.keys(obj).map(Number).sort();
                const expectedIndexes = Array.from({ length: obj.length }, (_, i) => { return i; });
                const hasMissingIndexes = !expectedIndexes.every((i) => { return indexes.includes(i); });

                // If the array has missing indexes, re-index it
                if (hasMissingIndexes) {
                    obj = obj.filter((item) => { return item !== undefined; });
                }
            } else if (typeof obj === 'object' && obj !== null) {
                // Recursively check any nested objects or arrays
                for (const key in obj) {
                    obj[key] = this.fixArrayIndexes(obj[key]);
                }
            }
            return obj;
        },

        serializeFieldContent() {
            const postData = Garnish.getPostData(this.$refs.fields.$el);
            let content = Craft.expandPostArray(postData);

            // Fix Craft's lack of handling for expanding a POST array where arrays contain null items.
            // This causes issues with Table fields when deleting rows.
            content = this.fixArrayIndexes(content);

            const fieldContent = this.findContentBlocksForBlock(content);

            // Generate a POST data object, and save it
            const values = { ...this.values };

            values.content = fieldContent;

            // We can't use `updateAttributes()` here, because that will only operate on the selected node. This function
            // will often be called for all nodes in a collection, such as when re-ordering blocks which affect more
            // than just the block being moved due to Tiptap/Vue rendering. As such, it's not best-practice, but we update
            // the node attributes directly. See https://share.cleanshot.com/8dkt1vQY for this in action with `updateAttributes()`
            // eslint-disable-next-line vue/no-mutating-props
            this.node.attrs.values = values;
        },
    },
};

</script>

<style lang="scss">

.vizyblock {
    // Splitting the outer wrapper and inner visual styles provides better support for dropcursor
    padding: 10px 0;
    cursor: text;
}

.vizyblock-wrap {
    position: relative;
    padding: 0 12px 12px;
    border-radius: 5px;
    outline: none;
    cursor: auto;
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

.vizyblock-invalid {
    padding: 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
        margin: 0;
    }
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
    user-select: none;
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
    font-size: 12px;
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
    color: #78838e;
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
    height: 31px;
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
#content .vui-editor :not(.meta) > .vizyblock-fields > .flex-fields {
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 0 !important;
    width: 100% !important;

    > :not(h2):not(hr):last-child {
        margin-bottom: 0 !important;
    }

    > :not(h2):not(hr),
    > :not(h2):not(hr):last-child {
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
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

.vui-block-ghost {
    width: 200px;
    height: 50px;
    border-radius: 6px;
    border: 1px #cdd9e4 solid;
    overflow: hidden;
    background: #fff;
    opacity: 1;
    position: absolute;
    top: -99999px;

    .vizyblock-header {
        width: 100%;
        margin: 0;

        .actions-tabs {
            display: none;
        }
    }
}


</style>
