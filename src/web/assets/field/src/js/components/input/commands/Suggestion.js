import { size } from 'lodash-es';
import { VueRenderer } from '@tiptap/vue-3';

import tippy from 'tippy.js';
import 'tippy.js/themes/light-border.css';

import { getId } from '@utils/string';

import CommandsList from './CommandsList.vue';

export default {
    items: (options) => {
        let items = [
            {
                svg: 'h1',
                title: Craft.t('vizy', 'Heading 1'),
                commandInfo: { shortcut: 'Mod-Alt-1' },
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
                },
            },
            {
                svg: 'h2',
                title: Craft.t('vizy', 'Heading 2'),
                commandInfo: { shortcut: 'Mod-Alt-2' },
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
                },
            },
            {
                svg: 'h3',
                title: Craft.t('vizy', 'Heading 3'),
                commandInfo: { shortcut: 'Mod-Alt-3' },
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
                },
            },
            {
                svg: 'list-ul',
                title: Craft.t('vizy', 'Bullet List'),
                commandInfo: { shortcut: 'Mod-Shift-8' },
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBulletList().run();
                },
            },
            {
                svg: 'list-ol',
                title: Craft.t('vizy', 'Ordered List'),
                commandInfo: { shortcut: 'Mod-Shift-7' },
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                },
            },
            {
                svg: 'photo-film',
                title: Craft.t('vizy', 'Media Embed'),
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).run();

                    editor.emit('vui:media-embed-modal-open');
                },
            },
            {
                svg: 'link',
                title: Craft.t('vizy', 'Link'),
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).run();

                    editor.emit('vui:link-modal-open');
                },
            },
            {
                icon: 'image',
                title: Craft.t('vizy', 'Image'),
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).run();

                    editor.emit('vui:image-modal-open');
                },
            },
            {
                svg: 'code',
                title: Craft.t('vizy', 'Code Block'),
                commandInfo: { shortcut: 'Mod-Alt-c' },
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
                },
            },
            {
                svg: 'quote-right',
                title: Craft.t('vizy', 'Blockquote'),
                commandInfo: { shortcut: 'Mod-Shift-b' },
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                },
            },
            {
                svg: 'horizontal-rule',
                title: Craft.t('vizy', 'Horizontal Rule'),
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
                },
            },
        ];

        if (!options.editor.vizyField.richTextEnabled) {
            items = [];
        }

        options.editor.vizyField.settings.blockGroups.forEach((blockGroup) => {
            blockGroup.blockTypes.forEach((blockType) => {
                items.push({
                    rawSvg: blockType.icon.svg,
                    title: blockType.name,
                    command: ({ editor, range }) => {
                        const id = getId('vizy-block-');
                        const values = { type: blockType.id };
                        const { fieldsHtml, footHtml } = blockType;

                        editor.vizyField.setCachedFieldHtml(id, fieldsHtml);
                        editor.vizyField.setCachedFieldJs(id, footHtml);

                        editor.chain().focus().deleteRange(range).setVizyBlock({ id, values }).run();

                        // Wait for a tick to get the DOM updated
                        setTimeout(() => {
                            editor.vizyField.$events.emit('vizy-blocks:addedBlock');
                        }, 50);
                    },
                });
            });
        });

        return items.filter((item) => {
            return item.title.toLowerCase().startsWith(options.query.toLowerCase());
        });
    },

    render: () => {
        let component;
        let popup;

        return {
            onStart: (props) => {
                component = new VueRenderer(CommandsList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => { return document.body; },
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'top-start',
                    theme: 'light-border vui-command-dropdown',
                    maxWidth: '600px',
                    duration: 200,
                });
            },

            onUpdate(props) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    popup[0].hide();

                    return true;
                }

                return component.ref?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};
