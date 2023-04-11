import { Extension } from '@tiptap/core';
import { isObject, kebabCase } from 'lodash-es';

export default (vizyField) => {
    const editorStyles = [];
    const customAttributes = {};
    const extensions = [];

    // Look at any objects defined in the config file for buttons or formatting
    Object.entries(vizyField.settings.vizyConfig).forEach(([configKey, config]) => {
        if (configKey === 'buttons' || configKey === 'formatting') {
            config.forEach((buttonName) => {
                if (isObject(buttonName)) {
                    if (!Array.isArray(customAttributes[buttonName.type])) {
                        customAttributes[buttonName.type] = [];
                    }

                    Object.keys(buttonName.attrs).forEach((item) => {
                        if (!customAttributes[buttonName.type].includes(item)) {
                            customAttributes[buttonName.type].push(item);
                        }
                    });

                    if (buttonName.editorStyle) {
                        editorStyles.push(buttonName);
                    }
                }
            });
        }
    });

    // Apply any custom styles for nodes just for the editor in the CP
    editorStyles.forEach((config) => {
        // Create a key to only insert the CSS once, as this is at the body level.
        const key = kebabCase(`${config.type} ${config.title}`);

        if (!document.querySelector(`style#${key}`)) {
            const style = document.createElement('style');
            style.id = key;
            style.innerHTML = `.vui-editor ${config.editorStyle}`;
            document.head.appendChild(style);
        }
    });

    // For every custom attribute supplied in config files, ensure the node's schema accepts them
    Object.entries(customAttributes).forEach(([type, attrs]) => {
        const attributes = {};

        attrs.forEach((item) => {
            attributes[item] = { default: null };
        });

        extensions.push(Extension.create({
            name: `${type}CustomAttributes`,

            addGlobalAttributes() {
                return [
                    {
                        types: [
                            type,
                        ],

                        attributes,
                    },
                ];
            },
        }));
    });

    return extensions;
};
