import { size } from 'lodash-es';
import { VueRenderer } from '@tiptap/vue-3';

import tippy from 'tippy.js';
import 'tippy.js/themes/light-border.css';

import { getId } from '@utils/string';

import CommandsList from './CommandsList.vue';

export default {
    items: (options) => {
        const { vizyField } = options.editor;
        const vizySettings = vizyField.settings;
        const allCommands = Craft.Vizy.Config.getCommands();
        let commands = [];

        let includedCommands = [
            'h1',
            'h2',
            'h3',
            'unordered-list',
            'ordered-list',
            'media-embed',
            'link',
            'image',
            'code-block',
            'blockquote',
            'hr',
        ];

        // Allow commands to be set in the config
        if (vizySettings.vizyConfig.commands) {
            includedCommands = vizySettings.vizyConfig.commands;
        }

        // Only include the commands that are allowed
        includedCommands.forEach((commandName) => {
            const command = allCommands.find((x) => { return x.name === commandName; });

            if (command) {
                commands.push(command);
            }
        });

        // Also filter out any commands that don't have a button, even if included in the config. This is because the extension
        // isn't initialised unless it's a button.
        let availableButtons = ['paragraph', 'code-block', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        if (vizySettings.vizyConfig.formatting && vizySettings.vizyConfig.formatting.length) {
            availableButtons = vizySettings.vizyConfig.formatting;
        }

        availableButtons = [...availableButtons, ...vizyField.buttons];

        commands.forEach((command, index) => {
            if (!availableButtons.includes(command.name)) {
                commands.splice(index, 1);
            }
        });

        // Disable all commands until now if no rich text editor
        if (!vizyField.richTextEnabled) {
            commands = [];
        }

        // Include any Vizy blocks as commands
        vizySettings.blockGroups.forEach((blockGroup) => {
            blockGroup.blockTypes.forEach((blockType) => {
                commands.push({
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

        // Filter based on typing
        return commands.filter((command) => {
            return command.title.toLowerCase().startsWith(options.query.toLowerCase());
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
