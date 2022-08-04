<template>
    <floating-menu v-show="blockGroups.length" v-slot="{ menu }" ref="menu" :editor="editor">
        <div
            class="vui-editor-insert"
            :class="{ 'is-active': menu.isActive }"
            :style="`top: ${menu.top}px`"
        >
            <button type="button" aria-label="Add block" aria-haspopup="true" aria-expanded="false" class="vui-editor-insert-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M368 224H224V80c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v144H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h144v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V288h144c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" /></svg>
            </button>

            <div id="vizy-blocks-template" style="display: none;">
                <div>
                    <input v-model="search" type="text" class="text fullwidth" placeholder="Search for blocks">
                </div>

                <div v-if="filteredBlockGroups.length">
                    <div v-for="(group, groupIndex) in filteredBlockGroups" :key="groupIndex" class="vui-block-group">
                        <hr>

                        <div class="vui-block-items-header">{{ group.name }}</div>

                        <div class="vui-block-items">
                            <div v-for="(blockType, blockIndex) in group.blockTypes" :key="blockIndex" class="vui-block-item" @click="addBlock(blockType)">
                                <div v-html="blockType.icon.svg"></div>
                                <span class="vui-block-item-heading">{{ blockType.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="vui-block-items-none">
                    <hr>
                    {{ t('vizy', 'No blocks found for “{search}”.', { search: search }) }}
                </div>
            </div>
        </div>
    </floating-menu>
</template>

<script>
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

import { getId } from '@utils/string';

import FloatingMenu from './FloatingMenu.vue';

export default {
    name: 'BlockPicker',

    components: {
        FloatingMenu,
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

        blockGroups: {
            type: Array,
            default: () => { return []; },
        },
    },

    data() {
        return {
            tippy: null,
            search: '',
        };
    },

    computed: {
        filteredBlockGroups() {
            return this.blockGroups.reduce((acc, blockGroup) => {
                const blockTypes = blockGroup.blockTypes.filter((blockType) => {
                    return blockType.name.toLowerCase().includes(this.search.toLowerCase());
                });

                return !blockTypes.length ? acc : acc.concat({ ...blockGroup, blockTypes });
            }, []);
        },
    },

    mounted() {
        const $template = this.$el.querySelector('#vizy-blocks-template');

        if ($template) {
            $template.style.display = 'block';

            this.tippy = tippy(this.$el.querySelector('.vui-editor-insert-btn'), {
                content: $template,
                trigger: 'click',
                allowHTML: true,
                arrow: true,
                interactive: true,
                placement: 'right',
                theme: 'vui-block-picker light-border',
                maxWidth: '300px',
                zIndex: 100, // Needs a higher z-index for Live Preview
                appendTo: () => { return document.body; },
                hideOnClick: true,
            });
        }
    },

    methods: {
        addBlock(blockType) {
            const id = getId('vizy-block-');
            const values = { type: blockType.id };
            const { fieldsHtml, footHtml } = blockType;

            this.field.setCachedFieldHtml(id, fieldsHtml);
            this.field.setCachedFieldJs(id, footHtml);

            this.editor.chain().focus().setVizyBlock({ id, values }).run();

            // Wait for a tick to get the DOM updated
            setTimeout(() => {
                this.$events.emit('vizy-blocks:addedBlock');
            }, 50);

            // Close the popover
            this.tippy.hide();
        },
    },

};

</script>


<style lang="scss">
@import 'craftcms-sass/mixins';

// ==========================================================================
// Block Menu
// ==========================================================================

.vui-editor-insert {
    position: absolute;
    z-index: 5;
    visibility: hidden;
    opacity: 0;
    background: #fff;
    border-radius: 50%;
    background: #c3d2e0;
    transform: translate(-50%, -6px);
    transition: opacity 0.2s, visibility 0.2s, color 0.2s, background 0.2s;
    margin-top: 1px;

    &.is-active {
        opacity: 1;
        visibility: visible;
    }

    &:hover {
        background: #596673;

        .vui-editor-insert-btn {
            color: #fff;
        }
    }
}

.vui-editor-insert-btn {
    position: relative;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #596673;
    cursor: pointer;
    outline: none;
    padding: 0;
    margin: 0;
    border-radius: 50%;
    transition: opacity .2s, color .2s;

    &:after {
        content: '';
        background: transparent;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 2px;
        transform: translate(-2px, -2px);
        z-index: -1;
    }

    svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
        outline: none;
    }
}

.vui-block-items {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -10px;
}

.vui-block-items-header {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 11px;
    color: #bcc9dc;
    display: block;
    margin: -4px 0 8px;
}

.vui-block-item {
    width: 33.33%;
    text-align: center;
    border-radius: 5px;
    padding: 10px 0;
    cursor: pointer;
    transition: background-color 0.3s ease;
    user-select: none;

    &:hover {
        background-color: #f3f7fb;
    }

    svg {
        display: inline-block;
        vertical-align: initial;
        width: 20px !important;
        height: 20px !important;
    }
}

.vui-block-item-heading {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #5a6975;
    padding: 0 5px;
    line-height: 15px;
}

.vui-block-items-none {
    color: #596673;
}


// ==========================================================================
// Tooltips/Popover
// ==========================================================================

[data-theme*="vui-block-picker"].tippy-box {
    width: 335px;
    max-height: 90vh;

    .tippy-content {
        padding: 12px 12px 26px;
        max-height: 480px;
        overflow-y: auto;
    }

    hr {
        margin: 12px 0 !important;
    }
}

</style>
