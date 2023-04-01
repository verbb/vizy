import { size } from 'lodash-es';
import { VueRenderer } from '@tiptap/vue-3';

import tippy from 'tippy.js';
import 'tippy.js/themes/light-border.css';

import { getId } from '@utils/string';

import CommandsList from './CommandsList.vue';

export default {
    items: (options) => {
        let items = Craft.Vizy.Config.getCommands();

        if (!options.editor.vizyField.richTextEnabled) {
            items = [];
        }

        options.editor.vizyField.settings.blockGroups.forEach((blockGroup) => {
            blockGroup.blockTypes.forEach((blockType) => {
                items.push({
                    name: blockType.handle,
                    svg: blockType.icon.svg,
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
