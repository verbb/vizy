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
                        <a v-for="(tab, index) in tabs" :key="index" class="tab" :class="{ 'active': index === activeTab, 'error': tabError(tab) }" @click.prevent="clickTab(index)">
                            {{ tab.label }}
                        </a>
                    </div>

                    <div class="actions">
                        <lightswitch-field v-model="enabled" :extra-small="true" />

                        <a
                            class="ellipsis icon"
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
                        <ul>
                            <li v-if="collapsed">
                                <a class="menu-item" role="option" tabindex="-1" @click.prevent="expandBlock">
                                    <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512H24c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z" /></svg></span>
                                    <span class="menu-item-label">{{ t('vizy', 'Expand') }}</span>
                                </a>
                            </li>

                            <li v-else>
                                <a class="menu-item" role="option" tabindex="-1" @click.prevent="collapseBlock">
                                    <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H296c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272H216c13.3 0 24 10.7 24 24V440c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z" /></svg></span>
                                    <span class="menu-item-label">{{ t('vizy', 'Collapse') }}</span>
                                </a>
                            </li>

                            <li v-if="canCollapseAll">
                                <a class="menu-item" role="option" tabindex="-1" @click.prevent="collapseAll">
                                    <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H296c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272H216c13.3 0 24 10.7 24 24V440c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z" /></svg></span>
                                    <span class="menu-item-label">{{ t('vizy', 'Collapse All') }}</span>
                                </a>
                            </li>

                            <li v-if="canExpandAll">
                                <a class="menu-item" role="option" tabindex="-1" @click.prevent="expandAll">
                                    <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512H24c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z" /></svg></span>
                                    <span class="menu-item-label">{{ t('vizy', 'Expand All') }}</span>
                                </a>
                            </li>
                        </ul>

                        <hr class="padded">

                        <ul>
                            <li>
                                <a class="menu-item error" role="option" tabindex="-1" @click.prevent="deleteBlock">
                                    <span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg></span>
                                    <span class="menu-item-label">{{ t('vizy', 'Delete') }}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <collapse-transition>
                <div v-show="!collapsed">
                    <div ref="portalMount" class="vizyblock-fields"></div>
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
    get, find, debounce, isEmpty, isObject, isArray, merge,
} from 'lodash-es';
import { GapCursor } from 'prosemirror-gapcursor';
import { TextSelection, NodeSelection } from 'prosemirror-state';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

import { NodeViewWrapper } from '@tiptap/vue-3';
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue';

import LightswitchField from '../settings/LightswitchField.vue';

import htmlize from '@utils/htmlize';
import { getClosest } from '@utils/dom';

export default {
    name: 'VizyBlock',

    components: {
        NodeViewWrapper,
        LightswitchField,
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
            mounted: false,
            currentPortalId: null,
            portalEventName: null,
            portalUpdateHandler: null,
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

            const portalRoot = this.getPortalRoot();

            if (portalRoot) {
                const $fields = $(portalRoot).children().children();

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
        'node.attrs.id': function(newId, oldId) {
            // Instance got rebound to a different blockId
            if (oldId) {
                this.unbindPortalUpdate();
                this.vizyField.detachPortal(oldId);
            }

            this.currentPortalId = newId;

            this.$nextTick(() => {
                this.vizyField.attachPortal(newId, this.$refs.portalMount);
                this.bindPortalUpdate(newId);

                this.setFirstActiveTab();
            });
        },
    },

    created() {
        this.$events.on('vizy-blocks:collapseAll', this.collapseBlock);
        this.$events.on('vizy-blocks:expandAll', this.expandBlock);
    },

    mounted() {
        this.$nextTick(() => {
            this.setFirstActiveTab();

            this.currentPortalId = this.node.attrs.id;
            this.vizyField.attachPortal(this.currentPortalId, this.$refs.portalMount);

            // Listen for portal update events for *this* id
            this.bindPortalUpdate(this.currentPortalId);

            const $template = this.$el.querySelector('#vizy-block-settings-template');

            if ($template) {
                $template.style.display = 'block';

                this.tippy = tippy(this.$el.querySelector('.vizyblock-header .ellipsis'), {
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
        // Destroy event listeners for this block
        this.$events.off('vizy-blocks:collapseAll', this.collapseBlock);
        this.$events.off('vizy-blocks:expandAll', this.expandBlock);

        if (this.currentPortalId) {
            this.unbindPortalUpdate();
            this.vizyField.detachPortal(this.currentPortalId);
        }
    },

    methods: {
        bindPortalUpdate(blockId) {
            this.unbindPortalUpdate();

            this.portalEventName = this.vizyField.portalEventName(blockId);

            this.portalUpdateHandler = () => {
                this.handlePortalUpdate();
            };

            this.$events.on(this.portalEventName, this.portalUpdateHandler);
        },

        unbindPortalUpdate() {
            if (this.portalEventName && this.portalUpdateHandler) {
                this.$events.off(this.portalEventName, this.portalUpdateHandler);
            }

            this.portalEventName = null;
            this.portalUpdateHandler = null;
        },

        handlePortalUpdate() {
            const portalEntry = this.vizyField.portals?.get?.(this.node.attrs.id);
            const portalEl = portalEntry?.el;

            if (!portalEl) {
                return;
            }

            const postData = Garnish.getPostData(portalEl);
            const content = Craft.expandPostArray(postData);

            const fieldContent = content?.vizyData?.[this.node.attrs.id] || null;

            if (!fieldContent) {
                return;
            }

            const namespaceKey = Object.keys(fieldContent)[0];
            const values = { ...(this.values || {}) };

            values.content = fieldContent[namespaceKey];

            // eslint-disable-next-line vue/no-mutating-props
            this.node.attrs.values = values;
        },

        getPortalRoot() {
            const mount = this.$refs.portalMount;

            if (!mount) {
                return null;
            }

            // Portal root is the persistent DOM you move around
            return mount.querySelector('[data-vizy-portal]') || null;
        },

        isEmpty(value) {
            return isEmpty(value);
        },

        tabError(tab) {
            const tabErrors = this.vizyField.getBlockSettings(this.node.attrs.id).tabErrors || [];

            return tabErrors.includes(tab.tabId);
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

            const portalRoot = this.getPortalRoot();

            if (!portalRoot) {
                return;
            }

            // Only select immediate children of `.vizyblock-fields` to not affect nested Vizy fields
            const $tabs = portalRoot.querySelectorAll(':scope > div');

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
            // Record which block type is clicked on to help us add checks for allowing between inputs
            this.vizyField.selectedBlockType = this.blockType.id;
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

.vizyblock-header .actions .ellipsis,
.vizyblock-header .actions .move {
    display: inline-flex;
    font-size: 17px;
    margin-left: 0.75rem;
    color: #78838e;
    cursor: pointer;

    svg {
        width: 100%;
        height: 100%;
    }
}

.vizyblock-header .actions .ellipsis::before {
    content: "ellipsis";
}

.vizyblock-header .actions .move {
    cursor: move;
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
    margin-left: -0.5rem !important;
    margin-right: -0.5rem !important;
    margin-bottom: 0 !important;
    width: calc(100% + 1rem) !important;

    > :not(h2):not(hr):last-child {
        margin-bottom: 0 !important;
    }

    > :not(h2):not(hr),
    > :not(h2):not(hr):last-child {
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
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
    ul li .menu-item {
        font-size: 14px;
        padding: 10px 10px;
        white-space: nowrap;
        color: #3f4d5a;
        cursor: pointer;
        text-decoration: none;
        display: flex;
        align-items: center;

        &:hover {
            background-color: #f3f7fc;
            color: #3f4d5a;
        }
    }

    ul li:first-child a {
        border-radius: 4px 4px 0 0;
    }

    ul li:last-child a {
        border-radius: 0 0 4px 4px;
    }

    hr {
        margin: 0;

        &.padded {
            margin: 4px 0;
        }
    }

    li > a span.icon {
        display: block;
        height: 13px;
        width: 13px;
        margin-right: 7px;

        svg {
            width: 100%;
            height: 100%;
            display: block;
        }

        svg * {
            fill: currentColor;
        }
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
