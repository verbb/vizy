import { Extension } from '@tiptap/core';
import { isObject } from 'lodash-es';

export default (vizyField) => {
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
                }
            });
        }
    });

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
