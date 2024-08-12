<template>
    <div class="vui-editor-toolbar">
        <component
            :is="item.component || 'MenuBarItem'"
            v-for="(item, index) in availableButtons"
            :key="index"
            v-bind="item"
            :editor="editor"
            :field="field"
        />
    </div>
</template>

<script>
import { isObject } from 'lodash-es';

import MenuBarItem from './MenuBarItem.vue';
import LinkMenuBarItem from './link/LinkMenuBarItem.vue';
import ImageMenuBarItem from './image/ImageMenuBarItem.vue';
import IframeMenuBarItem from './iframe/IframeMenuBarItem.vue';
import MediaEmbedMenuBarItem from './media-embed/MediaEmbedMenuBarItem.vue';

export default {
    components: {
        MenuBarItem,
        LinkMenuBarItem,
        ImageMenuBarItem,
        IframeMenuBarItem,
        MediaEmbedMenuBarItem,
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

        buttons: {
            type: Array,
            default: () => { return []; },
        },
    },

    computed: {
        availableButtons() {
            const buttons = [];

            this.buttons.forEach((buttonName) => {
                if (isObject(buttonName)) {
                    buttons.push(this.dynamicButton(buttonName));
                }

                let button = this.allButtons.find((x) => { return x.name === buttonName; });

                if (button) {
                    // Ensure we don't modify the original button, but a clone of it for this instance
                    button = this.clone(button);

                    // Handle special-cases and sub-options. Maybe move to other components?
                    if (button.name === 'formatting') {
                        button.options = this.getEnabledOptions(button.options, this.getFormattingOptions());
                    }

                    if (button.name === 'table') {
                        button.options = this.getEnabledOptions(button.options, this.getTableOptions());
                    }

                    buttons.push(button);
                }
            });

            return buttons;
        },
    },

    created() {
        // Ensure this isn't reactive for nested Vizy fields (doesn't need to be anyway)
        this.allButtons = Craft.Vizy.Config.getButtons();
    },

    methods: {
        getFormattingOptions() {
            let options = ['paragraph', 'code-block', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

            if (this.field.settings.vizyConfig.formatting && this.field.settings.vizyConfig.formatting.length) {
                options = this.field.settings.vizyConfig.formatting;
            }

            return options;
        },

        getTableOptions() {
            let options = [
                'insert-table',
                'delete-table',
                'add-col-before',
                'add-col-after',
                'delete-col',
                'add-row-before',
                'add-row-after',
                'delete-row',
                'merge-cells',
                'split-cells',
                'toggle-header-column',
                'toggle-header-row',
                'toggle-header-cell',
            ];

            if (this.field.settings.vizyConfig.table && this.field.settings.vizyConfig.table.length) {
                options = this.field.settings.vizyConfig.table;
            }

            return options;
        },

        getEnabledOptions(buttonOptions, collection) {
            const options = [];

            collection.forEach((optionName) => {
                if (isObject(optionName)) {
                    options.push(this.dynamicButton(optionName));
                }

                const option = buttonOptions.find((x) => { return x.name === optionName; });

                if (option) {
                    options.push(option);
                }
            });

            return options;
        },

        dynamicButton(config) {
            return {
                name: config.type,
                svg: config.svg,
                title: config.title,
                action: (editor) => {
                    // Determine if this is a node or mark, no easy shortcut for this.
                    const isNode = editor.state.schema.nodes[config.type];
                    const isMark = editor.state.schema.marks[config.type];

                    if (isNode) {
                        return editor.chain().focus().toggleNode(config.type, 'paragraph', config.attrs).run();
                    } if (isMark) {
                        return editor.chain().focus().toggleMark(config.type, config.attrs).run();
                    }
                },
                isActive: (editor) => { return editor.isActive(config.type, config.attrs); },
            };
        },
    },
};

</script>

<style lang="scss">

.vui-editor-toolbar {
    position: relative;
    background: #fff;
    border-radius: 3px 3px 0 0;
    padding: 4px 8px;
    align-items: center;
    flex-wrap: wrap;
    display: flex;
    z-index: 5;
    border-bottom: 1px rgba(49, 49, 93, 0.15) solid;
    box-shadow: 0 2px 3px 0 rgba(49, 49, 93, 0.075);
}

</style>
