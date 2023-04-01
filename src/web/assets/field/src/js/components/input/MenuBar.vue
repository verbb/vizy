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

    data() {
        return {
            allButtons: Craft.Vizy.Config.getButtons(),
        };
    },

    computed: {
        availableButtons() {
            const buttons = [];

            this.buttons.forEach((buttonName) => {
                const button = this.allButtons.find((x) => { return x.name === buttonName; });

                if (button) {
                    // Handle special-cases and sub-options. Maybe move to other components?
                    if (button.name === 'formatting') {
                        button.options = this.getEnabledOptions(button, this.field.getFormattingOptions());
                    }

                    if (button.name === 'table') {
                        button.options = this.getEnabledOptions(button, this.field.getTableOptions());
                    }

                    buttons.push(button);
                }
            });

            return buttons;
        },
    },

    methods: {
        getEnabledOptions(button, collection) {
            const options = [];

            collection.forEach((optionName) => {
                const option = button.options.find((x) => { return x.name === optionName; });

                if (option) {
                    options.push(option);
                }
            });

            return options;
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
