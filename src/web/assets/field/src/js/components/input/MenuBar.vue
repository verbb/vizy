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
            allButtons: [
                {
                    name: 'bold',
                    svg: 'bold',
                    title: Craft.t('vizy', 'Bold'),
                    action: () => { return this.editor.chain().focus().toggleBold().run(); },
                    isActive: () => { return this.editor.isActive('bold'); },
                },
                {
                    name: 'italic',
                    svg: 'italic',
                    title: Craft.t('vizy', 'Italic'),
                    action: () => { return this.editor.chain().focus().toggleItalic().run(); },
                    isActive: () => { return this.editor.isActive('italic'); },
                },
                {
                    name: 'strikethrough',
                    svg: 'strikethrough',
                    title: Craft.t('vizy', 'Strike'),
                    action: () => { return this.editor.chain().focus().toggleStrike().run(); },
                    isActive: () => { return this.editor.isActive('strike'); },
                },
                {
                    name: 'subscript',
                    svg: 'subscript',
                    title: Craft.t('vizy', 'Subscript'),
                    action: () => { return this.editor.chain().focus().toggleSubscript().run(); },
                    isActive: () => { return this.editor.isActive('subscript'); },
                },
                {
                    name: 'superscript',
                    svg: 'superscript',
                    title: Craft.t('vizy', 'Superscript'),
                    action: () => { return this.editor.chain().focus().toggleSuperscript().run(); },
                    isActive: () => { return this.editor.isActive('superscript'); },
                },
                {
                    name: 'underline',
                    svg: 'underline',
                    title: Craft.t('vizy', 'Underline'),
                    action: () => { return this.editor.chain().focus().toggleUnderline().run(); },
                    isActive: () => { return this.editor.isActive('underline'); },
                },
                {
                    name: 'code',
                    svg: 'brackets-curly',
                    title: Craft.t('vizy', 'Inline Code'),
                    action: () => { return this.editor.chain().focus().toggleCode().run(); },
                    isActive: () => { return this.editor.isActive('code'); },
                },
                {
                    name: 'highlight',
                    icon: 'highlighter',
                    title: Craft.t('vizy', 'Highlight'),
                    action: () => { return this.editor.chain().focus().toggleHighlight().run(); },
                    isActive: () => { return this.editor.isActive('highlight'); },
                },
                {
                    name: 'paragraph',
                    icon: 'paragraph',
                    title: Craft.t('vizy', 'Paragraph'),
                    action: () => { return this.editor.chain().focus().setParagraph().run(); },
                },
                {
                    name: 'unordered-list',
                    svg: 'list-ul',
                    title: Craft.t('vizy', 'Bullet List'),
                    action: () => { return this.editor.chain().focus().toggleBulletList().run(); },
                    isActive: () => { return this.editor.isActive('bulletList'); },
                },
                {
                    name: 'ordered-list',
                    svg: 'list-ol',
                    title: Craft.t('vizy', 'Ordered List'),
                    action: () => { return this.editor.chain().focus().toggleOrderedList().run(); },
                    isActive: () => { return this.editor.isActive('orderedList'); },
                },
                {
                    name: 'code-block',
                    svg: 'code',
                    title: Craft.t('vizy', 'Code Block'),
                    action: () => { return this.editor.chain().focus().toggleCodeBlock().run(); },
                    isActive: () => { return this.editor.isActive('codeBlock'); },
                },
                {
                    name: 'blockquote',
                    svg: 'quote-right',
                    title: Craft.t('vizy', 'Blockquote'),
                    action: () => { return this.editor.chain().focus().toggleBlockquote().run(); },
                    isActive: () => { return this.editor.isActive('blockquote'); },
                },
                {
                    name: 'h1',
                    svg: 'h1',
                    title: Craft.t('vizy', 'Heading 1'),
                    action: () => { return this.editor.chain().focus().toggleHeading({ level: 1 }).run(); },
                    isActive: () => { return this.editor.isActive('heading', { level: 1 }); },
                },
                {
                    name: 'h2',
                    svg: 'h2',
                    title: Craft.t('vizy', 'Heading 2'),
                    action: () => { return this.editor.chain().focus().toggleHeading({ level: 2 }).run(); },
                    isActive: () => { return this.editor.isActive('heading', { level: 2 }); },
                },
                {
                    name: 'h3',
                    svg: 'h3',
                    title: Craft.t('vizy', 'Heading 3'),
                    action: () => { return this.editor.chain().focus().toggleHeading({ level: 3 }).run(); },
                    isActive: () => { return this.editor.isActive('heading', { level: 3 }); },
                },
                {
                    name: 'h4',
                    svg: 'h4',
                    title: Craft.t('vizy', 'Heading 4'),
                    action: () => { return this.editor.chain().focus().toggleHeading({ level: 4 }).run(); },
                    isActive: () => { return this.editor.isActive('heading', { level: 4 }); },
                },
                {
                    name: 'h5',
                    svg: 'h5',
                    title: Craft.t('vizy', 'Heading 5'),
                    action: () => { return this.editor.chain().focus().toggleHeading({ level: 5 }).run(); },
                    isActive: () => { return this.editor.isActive('heading', { level: 5 }); },
                },
                {
                    name: 'h6',
                    svg: 'h6',
                    title: Craft.t('vizy', 'Heading 6'),
                    action: () => { return this.editor.chain().focus().toggleHeading({ level: 6 }).run(); },
                    isActive: () => { return this.editor.isActive('heading', { level: 6 }); },
                },
                {
                    name: 'hr',
                    svg: 'horizontal-rule',
                    title: Craft.t('vizy', 'Horizontal Rule'),
                    action: () => { return this.editor.chain().focus().setHorizontalRule().run(); },
                },
                {
                    name: 'line-break',
                    svg: 'page-break',
                    title: Craft.t('vizy', 'Line Break'),
                    action: () => { return this.editor.chain().focus().setHardBreak().run(); },
                },
                {
                    name: 'clear-format',
                    svg: 'remove-format',
                    title: Craft.t('vizy', 'Clear Format'),
                    action: () => { return this.editor.chain().focus().clearNodes().unsetAllMarks().run(); },
                },
                {
                    name: 'undo',
                    svg: 'undo',
                    title: Craft.t('vizy', 'Undo'),
                    action: () => { return this.editor.chain().focus().undo().run(); },
                },
                {
                    name: 'redo',
                    svg: 'redo',
                    title: Craft.t('vizy', 'Redo'),
                    action: () => { return this.editor.chain().focus().redo().run(); },
                },
                {
                    name: 'align-left',
                    icon: 'align-left',
                    title: Craft.t('vizy', 'Align Left'),
                    action: () => { return this.editor.chain().focus().setTextAlign('left').run(); },
                },
                {
                    name: 'align-center',
                    icon: 'align-center',
                    title: Craft.t('vizy', 'Align Center'),
                    action: () => { return this.editor.chain().focus().setTextAlign('center').run(); },
                },
                {
                    name: 'align-right',
                    icon: 'align-right',
                    title: Craft.t('vizy', 'Align Right'),
                    action: () => { return this.editor.chain().focus().setTextAlign('right').run(); },
                },
                {
                    name: 'align-justify',
                    icon: 'align-justify',
                    title: Craft.t('vizy', 'Align Justify'),
                    action: () => { return this.editor.chain().focus().setTextAlign('justify').run(); },
                },
                {
                    name: 'formatting',
                    icon: 'paragraph',
                    title: Craft.t('vizy', 'Formatting'),
                    options: [
                        {
                            name: 'paragraph',
                            title: Craft.t('vizy', 'Paragraph'),
                        },
                        {
                            name: 'code-block',
                            title: Craft.t('vizy', 'Code Block'),
                            action: () => { return this.editor.chain().focus().toggleCodeBlock().run(); },
                        },
                        {
                            name: 'blockquote',
                            title: Craft.t('vizy', 'Blockquote'),
                            action: () => { return this.editor.chain().focus().toggleBlockquote().run(); },
                        },
                        {
                            name: 'h1',
                            title: Craft.t('vizy', 'Heading 1'),
                            action: () => { return this.editor.chain().focus().toggleHeading({ level: 1 }).run(); },
                        },
                        {
                            name: 'h2',
                            title: Craft.t('vizy', 'Heading 2'),
                            action: () => { return this.editor.chain().focus().toggleHeading({ level: 2 }).run(); },
                        },
                        {
                            name: 'h3',
                            title: Craft.t('vizy', 'Heading 3'),
                            action: () => { return this.editor.chain().focus().toggleHeading({ level: 3 }).run(); },
                        },
                        {
                            name: 'h4',
                            title: Craft.t('vizy', 'Heading 4'),
                            action: () => { return this.editor.chain().focus().toggleHeading({ level: 4 }).run(); },
                        },
                        {
                            name: 'h5',
                            title: Craft.t('vizy', 'Heading 5'),
                            action: () => { return this.editor.chain().focus().toggleHeading({ level: 5 }).run(); },
                        },
                        {
                            name: 'h6',
                            title: Craft.t('vizy', 'Heading 6'),
                            action: () => { return this.editor.chain().focus().toggleHeading({ level: 6 }).run(); },
                        },
                    ],
                },
                {
                    name: 'table',
                    svg: 'table',
                    title: Craft.t('vizy', 'Table'),
                    options: [
                        {
                            name: 'insert-table',
                            title: Craft.t('vizy', 'Insert Table'),
                            action: () => { return this.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); },
                        },
                        {
                            name: 'delete-table',
                            title: Craft.t('vizy', 'Delete Table'),
                            action: () => { return this.editor.chain().focus().deleteTable().run(); },
                        },
                        {
                            name: 'add-col-before',
                            title: Craft.t('vizy', 'Add Column Before'),
                            action: () => { return this.editor.chain().focus().addColumnBefore().run(); },
                        },
                        {
                            name: 'add-col-after',
                            title: Craft.t('vizy', 'Add Column After'),
                            action: () => { return this.editor.chain().focus().addColumnAfter().run(); },
                        },
                        {
                            name: 'delete-col',
                            title: Craft.t('vizy', 'Delete Column'),
                            action: () => { return this.editor.chain().focus().deleteColumn().run(); },
                        },
                        {
                            name: 'add-row-before',
                            title: Craft.t('vizy', 'Add Row Before'),
                            action: () => { return this.editor.chain().focus().addRowBefore().run(); },
                        },
                        {
                            name: 'add-row-after',
                            title: Craft.t('vizy', 'Add Row After'),
                            action: () => { return this.editor.chain().focus().addRowAfter().run(); },
                        },
                        {
                            name: 'delete-row',
                            title: Craft.t('vizy', 'Delete Row'),
                            action: () => { return this.editor.chain().focus().deleteRow().run(); },
                        },
                        {
                            name: 'merge-cells',
                            title: Craft.t('vizy', 'Merge Cells'),
                            action: () => { return this.editor.chain().focus().mergeCells().run(); },
                        },
                        {
                            name: 'split-cells',
                            title: Craft.t('vizy', 'Split Cells'),
                            action: () => { return this.editor.chain().focus().splitCell().run(); },
                        },
                        {
                            name: 'toggle-header-column',
                            title: Craft.t('vizy', 'Toggle Header Column'),
                            action: () => { return this.editor.chain().focus().toggleHeaderColumn().run(); },
                        },
                        {
                            name: 'toggle-header-row',
                            title: Craft.t('vizy', 'Toggle Header Row'),
                            action: () => { return this.editor.chain().focus().toggleHeaderRow().run(); },
                        },
                        {
                            name: 'toggle-header-cell',
                            title: Craft.t('vizy', 'Toggle Header Cell'),
                            action: () => { return this.editor.chain().focus().toggleHeaderCell().run(); },
                        },
                    ],
                },
                {
                    name: 'link',
                    svg: 'link',
                    title: Craft.t('vizy', 'Link'),
                    component: 'LinkMenuBarItem',
                    isActive: () => { return this.editor.isActive('link'); },
                },
                {
                    name: 'image',
                    icon: 'image',
                    title: Craft.t('vizy', 'Image'),
                    component: 'ImageMenuBarItem',
                    isActive: () => { return this.editor.isActive('image'); },
                },
                {
                    name: 'html',
                    svg: 'file-code',
                    title: Craft.t('vizy', 'HTML'),
                    action: () => { return this.editor.emit('vui:code-editor-toggle'); },
                },
                {
                    name: 'iframe',
                    svg: 'rectangle-code',
                    title: Craft.t('vizy', 'iFrame'),
                    component: 'IframeMenuBarItem',
                    isActive: () => { return this.editor.isActive('iframe'); },
                },
                {
                    name: 'media-embed',
                    svg: 'photo-film',
                    title: Craft.t('vizy', 'Media Embed'),
                    component: 'MediaEmbedMenuBarItem',
                    isActive: () => { return this.editor.isActive('mediaEmbed'); },
                },
            ],
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
