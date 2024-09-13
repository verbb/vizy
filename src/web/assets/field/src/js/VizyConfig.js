import * as core from '@tiptap/core';
import Buttons from './config/Buttons.js';
import Extensions from './config/Extensions.js';
import Commands from './config/Commands.js';

export default class VizyConfig {
    constructor(instance) {
        this.instance = instance;
        this.registeredTemplates = [];
        this.registeredExtensions = [];
        this.registeredButtons = [];
        this.registeredCommands = [];
    }

    registerTemplates(callback) {
        this.registeredTemplates.push(callback);
    }

    registerExtensions(callback) {
        this.registeredExtensions.push(callback);
    }

    registerButtons(callback) {
        this.registeredButtons.push(callback);
    }

    registerCommands(callback) {
        this.registeredCommands.push(callback);
    }

    getTemplates() {
        return this._getComponents('templates', this.registeredTemplates, [], null);
    }

    getExtensions(vizyInput) {
        return this._getComponents('extensions', this.registeredExtensions, Extensions, vizyInput);
    }

    getButtons(vizyInput) {
        return this._getComponents('buttons', this.registeredButtons, Buttons, vizyInput);
    }

    getCommands(vizyInput) {
        return this._getComponents('commands', this.registeredCommands, Commands, vizyInput);
    }

    _getComponents(type, registeredComponents, components, vizyInput) {
        registeredComponents.forEach((callback) => {
            const addedComponents = callback(components, vizyInput);

            if (!addedComponents) {
                return;
            }

            components = components.concat(Array.isArray(addedComponents) ? addedComponents : [addedComponents]);

            // Provide back-compatibility for older method of registering custom extensions
            // e.g. `[MyExtension]` to `[{ plugin: 'my-plugin-handle', extension: MyExtension }]`
            if (type === 'extensions') {
                components.forEach((component, i) => {
                    if (!component.extension) {
                        components[i] = { plugin: '_global', extension: component };
                    }
                });
            }
        });

        // Ensure we cleanup in case plugin have removed components
        return components.filter((extension) => { return !!extension; });
    }

    get tiptap() {
        return { core };
    }
}
