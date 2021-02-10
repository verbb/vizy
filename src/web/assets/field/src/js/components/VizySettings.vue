<template>
    <div class="vui-workspace">
        <div>
            <textarea class="hidden fullwidth" rows="20" name="fieldData" :value="JSON.stringify(fieldData)"></textarea>
        </div>

        <div class="vui-popover">
            <div class="vui-popover-inner">
                <div v-for="(group, groupIndex) in fieldData" :key="groupIndex" class="vui-block-group">
                    <hr v-if="groupIndex > 0">

                    <div class="vui-block-items-header">
                        <span class="vui-block-items-header-text" contenteditable="true" @blur="group.name = $event.target.innerText" v-html="group.name"></span>
                        
                        <div class="vui-block-items-header-actions">
                            <button v-if="groupIndex > 0" class="vui-block-items-header-move" @click.prevent="moveGroupUp(group)">
                                <!-- eslint-disable-next-line -->
                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up" class="svg-inline--fa fa-arrow-up fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M6.101 261.899L25.9 281.698c4.686 4.686 12.284 4.686 16.971 0L198 126.568V468c0 6.627 5.373 12 12 12h28c6.627 0 12-5.373 12-12V126.568l155.13 155.13c4.686 4.686 12.284 4.686 16.971 0l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L232.485 35.515c-4.686-4.686-12.284-4.686-16.971 0L6.101 244.929c-4.687 4.686-4.687 12.284 0 16.97z" /></svg>
                            </button>
                            <button v-if="groupIndex < fieldData.length - 1" class="vui-block-items-header-move" @click.prevent="moveGroupDown(group)">
                                <!-- eslint-disable-next-line -->
                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-down" class="svg-inline--fa fa-arrow-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M441.9 250.1l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L250 385.4V44c0-6.6-5.4-12-12-12h-28c-6.6 0-12 5.4-12 12v341.4L42.9 230.3c-4.7-4.7-12.3-4.7-17 0L6.1 250.1c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z" /></svg>
                            </button>

                            <button class="vui-block-items-header-delete" @click.prevent="deleteGroup(group)">{{ 'Delete' | t('site') }}</button>
                        </div> 
                    </div> 

                    <div class="vui-block-items">
                        <div v-for="(blockType, blockTypeIndex) in group.blockTypes" :key="blockTypeIndex" class="vui-block-item" :class="{ 'active': selectedBlockType === blockType, 'has-error': hasErrors(blockType) }" @click.prevent="selectBlockType(blockType)">
                            <div class="dropzone-vertical-left">
                                <drop
                                    :data-group="groupIndex"
                                    :data-block="blockTypeIndex"
                                    class="dropzone-vertical"
                                    @drop="dragDrop"
                                    @dragenter="dragEnter"
                                    @dragleave="dragLeave"
                                />

                                <div class="dashed-dropzone dashed-dropzone-vertical"></div>
                            </div>

                            <drag :transfer-data="{ groupIndex: groupIndex, blockTypeIndex: blockTypeIndex }">
                                <div v-html="blockType.icon ? blockType.icon.svg : emptySvg"></div>
                                <span class="vui-block-item-heading">{{ blockType.name }}</span>
                                <span class="vui-block-item-status" :class="{ 'on': blockType.enabled }"></span>

                                <template v-if="!isSafari" slot="image" style="position: absolute">
                                    <div class="vui-block-item" style="width: 90px; height: 45px; background: white;">
                                        <div v-html="blockType.icon ? blockType.icon.svg : emptySvg"></div>
                                        <span class="vui-block-item-heading">{{ blockType.name }}</span>
                                        <span class="vui-block-item-status" :class="{ 'on': blockType.enabled }"></span>
                                    </div>
                                </template>
                            </drag>

                            <div v-if="blockTypeIndex == group.blockTypes.length - 1" class="dropzone-vertical-right">
                                <drop
                                    :data-group="groupIndex"
                                    :data-block="blockTypeIndex + 1"
                                    class="dropzone-vertical"
                                    @drop="dragDrop"
                                    @dragenter="dragEnter"
                                    @dragleave="dragLeave"
                                />

                                <div class="dashed-dropzone dashed-dropzone-vertical"></div>
                            </div>
                        </div>

                        <div class="vui-block-item vui-block-new-item" @click.prevent="addBlockType(group)">
                            <!-- eslint-disable-next-line -->
                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-plus fa-w-12"><path fill="currentColor" d="M368 224H224V80c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v144H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h144v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V288h144c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" /></svg>
                            <span class="vui-block-item-heading">{{ 'Add Block' | t('vizy') }}</span>
                        </div>
                    </div>
                </div>

                <hr v-if="fieldData.length">

                <div class="vui-block-item vui-block-new-item vui-block-new-group" @click.prevent="addGroup">
                    <!-- eslint-disable-next-line -->
                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-plus fa-w-12"><path fill="currentColor" d="M368 224H224V80c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v144H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h144v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V288h144c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" /></svg>
                    <span class="vui-block-item-heading">{{ 'Add Group' | t('vizy') }}</span>
                </div>
            </div>
        </div>

        <div v-if="selectedBlockType" class="vui-block-editor">
            <div class="vui-block-titlebar">
                <div class="blocktype">
                    {{ selectedBlockType.name }}
                </div>

                <div class="vui-block-titlebar-actions">
                    <button class="vui-block-titlebar-delete" @click.prevent="deleteBlockType">{{ 'Delete' | t('vizy') }}</button>

                    <lightswitch-field v-model="selectedBlockType.enabled" :small="true" />
                </div>
            </div>

            <div class="field">
                <div class="heading">
                    <label id="name-field-label" class="required" for="name">{{ 'Name' | t('vizy') }}</label>
                </div>

                <div id="name-field-instructions" class="instructions">
                    <p>{{ 'What this block type will be called in the control panel.' | t('vizy') }}</p>
                </div>

                <div class="input ltr">
                    <input
                        id="name"
                        ref="name-field"
                        v-model="selectedBlockType.name"
                        type="text"
                        class="text fullwidth"
                        autocomplete="off"
                        autocorrect="off"
                        autocapitalize="off"
                        :class="{ 'error': hasErrors(selectedBlockType, 'name')}"
                    >
                </div>

                <ul v-if="getErrors(selectedBlockType, 'name')" class="errors">
                    <li v-for="(error, index) in getErrors(selectedBlockType, 'name')" :key="index">{{ error }}</li>
                </ul>
            </div>

            <div class="field">
                <div class="heading">
                    <label id="handle-field-label" class="required" for="handle">{{ 'Handle' | t('vizy') }}</label>
                </div>

                <div id="handle-field-instructions" class="instructions">
                    <p>{{ 'How you’ll refer to this block type in the templates.' | t('vizy') }}</p>
                </div>

                <div class="input ltr">
                    <handle-input
                        id="handle"
                        ref="handle-field"
                        v-model="selectedBlockType.handle"
                        :source-value="selectedBlockType.name"
                        :collection="handleCollection"
                        :class="{ 'error': hasErrors(selectedBlockType, 'handle')}"
                    />
                </div>

                <ul v-if="getErrors(selectedBlockType, 'handle')" class="errors">
                    <li v-for="(error, index) in getErrors(selectedBlockType, 'handle')" :key="index">{{ error }}</li>
                </ul>
            </div>

            <div class="field">
                <div class="heading">
                    <label id="icon-field-label" class="required" for="icon">{{ 'Icon' | t('vizy') }}</label>
                </div>

                <div id="icon-field-instructions" class="instructions">
                    <p>{{ 'Select an appropriate icon for the block type. Start typing to search via keywords.' | t('vizy') }}</p>
                </div>

                <div class="input ltr">
                    <vizy-icon-picker v-model="selectedBlockType.icon" :input-classes="{ 'error': hasErrors(selectedBlockType, 'icon')}" />
                </div>

                <ul v-if="getErrors(selectedBlockType, 'icon')" class="errors">
                    <li v-for="(error, index) in getErrors(selectedBlockType, 'icon')" :key="index">{{ error }}</li>
                </ul>
            </div>

            <div class="field">
                <div class="heading">
                    <label id="template-field-label" for="template">{{ 'Template' | t('vizy') }}</label>
                </div>

                <div id="template-field-instructions" class="instructions">
                    <p>{{ 'Provide the path for a template partial for rendering this block type.' | t('vizy') }}</p>
                </div>

                <div class="input ltr">
                    <auto-suggest id="template" v-model="selectedBlockType.template" :suggestions="settings.suggestions" />
                </div>

                <ul v-if="getErrors(selectedBlockType, 'template')" class="errors">
                    <li v-for="(error, index) in getErrors(selectedBlockType, 'template')" :key="index">{{ error }}</li>
                </ul>
            </div>

            <div class="field">
                <div class="heading">
                    <label id="layout-field-label" class="required" for="layout">{{ 'Layout' | t('vizy') }}</label>
                </div>

                <div id="layout-field-instructions" class="instructions">
                    <p>{{ 'Define the field layout for this block type.' | t('vizy') }}</p>
                </div>

                <div class="input ltr">
                    <field-layout-designer v-model="selectedBlockType.layout" :layout-uid="selectedBlockType.layoutUid" :field-id="settings.fieldId" />
                </div>
            </div>
        </div>

        <div v-else class="vui-block-editor-empty">
            <p v-if="fieldData.length">{{ 'Select a block to edit.' | t('vizy') }}</p>
            <p v-else>{{ 'Add a new group to begin.' | t('vizy') }}</p>

            <!-- eslint-disable-next-line -->
            <svg xmlns="http://www.w3.org/2000/svg" width="68px" height="32.9px" viewBox="0 0 68 32.9"><path fill="currentColor" d="M8.2,32.9c-0.3,0-0.6-0.2-0.7-0.5c-0.7-2.2-2.3-3.6-3.9-5.1c-1.3-1.2-2.6-2.5-3.6-4.1c-0.1-0.2-0.1-0.5,0-0.7s0.3-0.4,0.6-0.4c2.1-0.2,9.2-1,11.8-3.2c0.3-0.3,0.8-0.2,1.1,0.1c0.3,0.3,0.2,0.8-0.1,1.1c-2.5,2.1-8.1,3-11.4,3.4c0.8,1,1.7,1.9,2.6,2.8C6.4,27.8,8.1,29.4,9,32c0.1,0.4-0.1,0.8-0.5,0.9C8.4,32.9,8.3,32.9,8.2,32.9z M30,30.8c-8.1,0-16.5-1.8-24-5.4c-0.4-0.2-0.5-0.6-0.4-1s0.6-0.5,1-0.4c14.3,6.9,32.1,7,44.2,0.4c9-4.9,14.4-13.1,15.7-23.8C66.6,0.2,67,0,67.4,0c0.4,0.1,0.7,0.4,0.7,0.8C66.7,12,61,20.6,51.5,25.7C45.4,29.1,37.8,30.8,30,30.8z"/></svg>
        </div>
    </div>
</template>

<script>
import { Drag, Drop } from 'vue-drag-drop';
import debounce from 'lodash/debounce';

import VizyIconPicker from './settings/VizyIconPicker.vue';
import FieldLayoutDesigner from './settings/FieldLayoutDesigner.vue';
import AutoSuggest from './settings/AutoSuggest.vue';
import LightswitchField from './settings/LightswitchField.vue';
import HandleInput from './settings/HandleInput.vue';

import { getId } from '@utils/string';
import { isSafari } from '@utils/browser';

export default {
    name: 'VizySettings',

    components: {
        VizyIconPicker,
        LightswitchField,
        FieldLayoutDesigner,
        AutoSuggest,
        HandleInput,
        Drag,
        Drop,
    },

    props: {
        errors: {
            type: [Object, Array],
            default: () => {},
        },
    },

    data() {
        return {
            selectedBlockType: null,
            isSafari: isSafari(),
            emptySvg: '<svg height="100" viewBox="0 0 50 50" width="100"></svg>',
            fieldData: [],
            settings: {},
        };
    },

    computed: {
        handleCollection() {
            var collection = [];

            if (Array.isArray(this.fieldData)) {
                this.fieldData.forEach((group) => {
                    group.blockTypes.forEach((blockType) => {
                        if (blockType !== this.selectedBlockType) {
                            collection.push(blockType.handle);
                        }
                    });
                });
            }

            return collection;
        },
    },

    created() {
        this.fieldData = this.$root.fieldData;
        this.settings = this.$root.settings;
    },

    mounted() {

        // eslint-disable-next-line
        // this.updateSelectedBlockType(this.fieldData[0].blockTypes[0]);
    },

    methods: {
        updateSelectedBlockType(blockType, isNew = false) {
            // Important to reset data for models
            this.selectedBlockType = null;

            // Combined with the above, kicks re-render into gear
            this.$nextTick(() => {
                this.selectedBlockType = blockType;

                // Focus on first field for new blockTypes
                this.$nextTick(() => {
                    if (!this.$refs['name-field'].value) {
                        this.$refs['name-field'].focus();
                    }
                });
            });
        },

        selectBlockType(blockType) {
            // Hide the selected block if clicking again (toggling) 
            if (this.selectedBlockType === blockType) {
                this.selectedBlockType = null;
            } else {
                this.updateSelectedBlockType(blockType);
            }
        },

        getErrors(blockType, prop = '') {
            var errors = [];

            // Yii seems to have some stupid issues with deeply nested errors...
            var errorKey = blockType.id + ':' + prop;

            if (this.errors) {
                errors = Object.keys(this.errors).filter(key => {
                    return key.includes(errorKey);
                }).map(key => {
                    return this.errors[key][0];
                });
            }

            return errors;
        },

        hasErrors(blockType, prop = '') {
            return this.getErrors(blockType, prop).length;
        },

        addBlockType(group) {
            if (!group.blockTypes) {
                group.blockTypes = [];
            }

            group.blockTypes.push({
                id: getId('type-'),
                enabled: true,
            });

            this.updateSelectedBlockType(group.blockTypes[group.blockTypes.length - 1], true);
        },

        addGroup() {
            let name = prompt(Craft.t('vizy', 'Give your group a name.'));

            if (name) {
                this.fieldData.push({
                    id: getId('group-'),
                    name,
                    blockTypes: [],
                });
            }
        },

        deleteBlockType() {
            const confirmationMessage = Craft.t('vizy', 'Are you sure you want to delete “{name}”? This will permanently delete all content created with this block type.', { name: this.selectedBlockType.name });

            if (confirm(confirmationMessage)) {
                for (var i = 0; this.fieldData.length; i++) {
                    var index = this.fieldData[i].blockTypes.indexOf(this.selectedBlockType);

                    if (index !== -1) {
                        this.fieldData[i].blockTypes.splice(index, 1);
                        this.selectedBlockType = null;

                        break;
                    }
                }
            }
        },

        deleteGroup(group) {
            const confirmationMessage = Craft.t('vizy', 'Are you sure you want to delete “{name}”? This will permanently delete all content created with any of these block types.', { name: group.name });

            if (confirm(confirmationMessage)) {
                var index = this.fieldData.indexOf(group);

                if (index !== -1) {
                    this.fieldData.splice(index, 1);
                    this.selectedBlockType = null;
                }
            }
        },

        moveGroupUp(group) {
            const sourceGroupIndex = this.fieldData.indexOf(group);
            const groupIndex = sourceGroupIndex - 1;
            const [ groupData ] = this.fieldData.splice(sourceGroupIndex, 1);

            this.fieldData.splice(groupIndex, 0, groupData);
        },

        moveGroupDown(group) {
            const sourceGroupIndex = this.fieldData.indexOf(group);
            const groupIndex = sourceGroupIndex + 1;
            const [ groupData ] = this.fieldData.splice(sourceGroupIndex, 1);

            this.fieldData.splice(groupIndex, 0, groupData);
        },

        dragEnter(data, event) {
            event.target.parentNode.classList.add('is-active');
        },

        dragLeave(data, event) {
            event.target.parentNode.classList.remove('is-active');
        },

        dragDrop(data, event) {
            event.target.parentNode.classList.remove('is-active');

            const sourceGroupIndex = parseInt(data.groupIndex);
            const sourceBlockTypeIndex = parseInt(data.blockTypeIndex);

            let groupIndex = parseInt(event.target.getAttribute('data-group'));
            let blockTypeIndex = parseInt(event.target.getAttribute('data-block'));

            // Just guard against not actually moving columns
            if (sourceGroupIndex === groupIndex && sourceBlockTypeIndex === blockTypeIndex) {
                return;
            }

            // Just guard against not actually moving columns
            if (sourceGroupIndex === groupIndex && sourceBlockTypeIndex === (blockTypeIndex - 1)) {
                return;
            }

            // Need to cater for when moving the block type ahead of another one. Technically inserting before
            // because the array will have shifted back one element (the one just removed)
            if (sourceGroupIndex === groupIndex && sourceBlockTypeIndex < blockTypeIndex) {
                blockTypeIndex = blockTypeIndex - 1;
            }

            // Remove the old column
            const [ blockTypeData ] = this.fieldData[sourceGroupIndex].blockTypes.splice(sourceBlockTypeIndex, 1);

            // Add the new row
            this.fieldData[groupIndex].blockTypes.splice(blockTypeIndex, 0, blockTypeData);
        },
    },
};

</script>

<style lang="scss">

// ==========================================================================
// Configurator
// ==========================================================================

// Add x-axis scroll support for when in Matrix
#main-content {
    overflow-x: auto;
}

.vizy-configurator {
    display: flex;
    align-items: stretch;
    position: relative;
    border-radius: 3px;
    border: 1px solid rgba(96, 125, 159, 0.25);
    background-color: #fbfcfe;
    background-clip: padding-box;
    overflow: hidden;
    min-height: 500px;
}

.vui-workspace {
    padding: 24px;
    border-radius: 3px;
    display: flex;
    flex: 1;
    background-color: #f3f7fc;
    background-image: linear-gradient(to right, #ecf2f9 1px, transparent 0px), linear-gradient(to bottom, #ecf2f9 1px, transparent 1px);
    background-size: 24px 24px;
    background-position: -1px -1px;
    box-shadow: inset 0 1px 3px -1px #acbed2;
}


// ==========================================================================
// Left-Hand Preview
// ==========================================================================

.vizy-configurator .vui-popover {
    width: 310px;
    z-index: 1;
}

.vizy-configurator .vui-popover .vui-popover-inner {
    background: #fff;
    color: #000;
    padding: 12px;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(96, 125, 159,.05),0 0 0 1px rgba(96, 125, 159,.05),0 2px 10px 1px rgba(96, 125, 159,.12);
}

.vizy-configurator .vui-block-items {
    margin: 0 -5px -5px;
}

.vizy-configurator .vui-popover hr {
    margin: 16px 0 !important;
}

.vizy-configurator .vui-block-item {
    position: relative;
    border: 1px transparent dashed;
    width: 30%;
    margin: 0 1% 5px;

    &.active {
        border-color: #0d99f2;
        border-style: solid;
        background-color: lighten(#0d99f2, 47%);
    }

    &.has-error {
        border-color: #CF1124;
        border-style: solid;
        color: #CF1124;
    }

    .vui-block-item-status {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 5px;
        height: 5px;
        border: 1px solid transparent;
        border-radius: 100%;
        border-color: rgba(96, 125, 159, 0.8);

        &.on {
            border-color: transparent;
            background-color: #27AB83;
        }
    }
}

.vizy-configurator .vui-block-new-item {
    border-color: darken(#d8dee7, 10%);
    transition: all 0.3s ease;
    color: darken(#d8dee7, 20%);
    background-color: #fff;

    &:hover {
        background-color: lighten(#0d99f2, 47%);
        border-color: #0d99f2;
        border-style: solid;
        color: #0d99f2;
    }

    .vui-block-item-heading {
        color: inherit;
    }
}

.vizy-configurator .vui-block-new-group {
    width: 100%;
    margin: 0;
}

.vizy-configurator .vui-block-items-header {
    display: flex;
    justify-content: space-between;
}

.vui-block-items-header-actions {
    display: flex;
    align-items: center;
}

.vizy-configurator .vui-block-items-header-delete {
    color: #CF1124;
    text-transform: none;
    font-weight: 500;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    border: 0;
    margin: 0;
    padding: 0;
    background: transparent;
    appearance: none;
    cursor: pointer;
    outline: none;
}

.vizy-configurator .vui-block-group:hover .vui-block-items-header-delete,
.vizy-configurator .vui-block-group:hover .vui-block-items-header-move {
    opacity: 1;
    visibility: visible;
}

.vui-block-items-header-move {
    width: 13px;
    height: 13px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    border: 0;
    margin: 0 8px 0 0;
    padding: 0;
    background: transparent;
    appearance: none;
    cursor: pointer;
    outline: none;

    svg {
        width: 100%;
        height: 100%;
        display: block;
    }
}

.vui-block-items-header-text {
    min-width: 50px;
    padding: 0 5px;
    margin-left: -5px;
    border-radius: 4px;
    border: 1px transparent dashed;
    transition: all 0.3s ease;

    &:hover {
        border-color: #0d99f2;
    }
}


// ==========================================================================
// Dropzones
// ==========================================================================

.dropzone-vertical-left {
    position: absolute;
    top: 0;
    left: -5px;
}

.dropzone-vertical-right {
    position: absolute;
    top: 0;
    right: -5px;
}

.dropzone-vertical {
    position: absolute;
    z-index: 2;
    top: -10px;
    left: -15px;
    width: 30px;
    height: 80px;
}

.dashed-dropzone-vertical {
    width: 2px;
    height: 60px;
}

.dashed-dropzone {
    border-radius: 1px;
    background-color: #0d99f2;
    opacity: 0;
    visibility: hidden;
    transition: all .2s ease;

    .is-active & {
        opacity: 1;
        visibility: visible;
    }
}


// ==========================================================================
// Right-Hand Block Editor
// ==========================================================================

.vui-block-editor {
    overflow: auto;
    background: #fff;
    color: #000;
    padding: 20px;
    border-radius: 4px;
    flex: 1;
    margin-left: 24px;
    box-shadow: 0 0 0 1px rgba(96, 125, 159, 0.05), 0 0 0 1px rgba(96, 125, 159, 0.05), 0 2px 10px 1px rgba(96, 125, 159, 0.12);
}

.vui-block-titlebar {
    color: #596673;
    margin: -20px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px #c8dbea solid;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    background-color: #f3f7fc;
    background-image: linear-gradient(rgba(51, 64, 77, 0), rgba(51, 64, 77, 0.05));
}

.vui-block-titlebar-actions {
    display: flex;
    align-items: center;
}

.vui-block-titlebar-delete {
    color: #CF1124;
    text-transform: none;
    font-weight: 500;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    margin-right: 10px;
    border: 0;
    background: transparent;
    appearance: none;
    cursor: pointer;
    outline: none;
}

.vui-block-editor:hover .vui-block-titlebar-delete {
    opacity: 1;
    visibility: visible;
}

.vui-loading-pane,
.vui-error-pane {
    margin: auto;
}

.vui-block-editor-empty {
    overflow: auto;
    color: #000;
    padding: 20px;
    flex: 1;
    margin-left: 24px;
    display: flex;
    justify-content: center;
    font-size: 2em;
    font-weight: 400;
    opacity: 0.4;
    color: #265275;
    margin-top: 3rem;
    position: relative;
}

.vui-block-editor-empty svg {
    position: absolute;
    top: 4rem;
    left: 50%;
    width: 170px;
    height: auto;
    margin-left: -85px;
    transform: rotate(7deg) translateX(-50%);
}


</style>
