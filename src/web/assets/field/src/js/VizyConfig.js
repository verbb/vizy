import * as core from '@tiptap/core';
import Buttons from './config/Buttons.js';
import Extensions from './config/Extensions.js';
import Commands from './config/Commands.js';

export default class VizyConfig {
    constructor(instance) {
        this.instance = instance;
        this.registeredExtensions = [];
        this.registeredButtons = [];
        this.registeredCommands = [];
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

    getExtensions() {
        return this._getComponents(this.registeredExtensions, Extensions);
    }

    getButtons() {
        return this._getComponents(this.registeredButtons, Buttons);
    }

    getCommands() {
        return this._getComponents(this.registeredCommands, Commands);
    }

    _getComponents(registeredComponents, components) {
        registeredComponents.forEach((callback) => {
            const addedComponents = callback(components);

            if (!addedComponents) {
                return;
            }

            components = components.concat(Array.isArray(addedComponents) ? addedComponents : [addedComponents]);
        });

        // Ensure we cleanup in case plugin have removed components
        return components.filter((extension) => { return !!extension; });
    }

    get tiptap() {
        return { core };
    }
}
