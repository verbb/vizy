// CSS needs to be imported here as it's treated as a module
import '@/scss/style.scss';

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
    import.meta.hot.accept();
}

//
// Start Vue Apps
//

if (typeof Craft.Vizy === typeof undefined) {
    Craft.Vizy = {};
}

import { createVueApp } from './config';

import VizyConfig from './VizyConfig.js';
import VizyInput from './components/VizyInput.vue';
import VizySettings from './components/VizySettings.vue';

// Register a config object to act as an API layer to register buttons, extensions, etc.
// Should be done before the Vue app is registered to ensure extensions are available.
Craft.Vizy.Config = new VizyConfig();

// Fire an event so plugins can reliably hook in
document.dispatchEvent(new CustomEvent('onVizyConfigReady', {
    bubbles: true,
}));

const VIZY_INPUT_SELECTOR = '[data-vizy-auto-mount="input"], .vizy-input-component';
const VIZY_SETTINGS_SELECTOR = '[data-vizy-auto-mount="settings"], .vizy-configurator';
const mountedRoots = new WeakSet();

const parseJsonDataAttr = (root, attrName, fallback = null) => {
    const raw = root?.getAttribute(attrName);

    if (!raw) {
        return fallback;
    }

    try {
        return JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
};

const mountInputRoot = (root) => {
    if (!root || mountedRoots.has(root)) {
        return;
    }

    const app = createVueApp({
        components: {
            VizyInput,
        },
    });

    // Import globally, as these are included in nested field content to be compiled.
    app.component('VizyInput', VizyInput);

    app.mount(root);
    mountedRoots.add(root);
};

const mountSettingsRoot = (root) => {
    if (!root || mountedRoots.has(root)) {
        return;
    }

    const fieldData = parseJsonDataAttr(root, 'data-field-data', []);
    const settings = parseJsonDataAttr(root, 'data-settings', {});

    const app = createVueApp({
        components: {
            VizySettings,
        },

        data() {
            return {
                fieldData,
                settings,
            };
        },
    });

    app.mount(root);
    mountedRoots.add(root);
};

const rootsForSelector = (scope, selector) => {
    if (!scope) {
        return [];
    }

    const roots = [];

    if (scope.matches && scope.matches(selector)) {
        roots.push(scope);
    }

    roots.push(...scope.querySelectorAll(selector));

    return roots;
};

Craft.Vizy.mountAll = (scope = document) => {
    rootsForSelector(scope, VIZY_INPUT_SELECTOR).forEach((root) => {
        mountInputRoot(root);
    });

    rootsForSelector(scope, VIZY_SETTINGS_SELECTOR).forEach((root) => {
        mountSettingsRoot(root);
    });
};

Craft.Vizy.startAutoMountObserver = () => {
    if (Craft.Vizy.__autoMountObserverStarted) {
        return;
    }

    Craft.Vizy.__autoMountObserverStarted = true;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }

                Craft.Vizy.mountAll(node);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

Craft.Vizy.Input = Garnish.Base.extend({
    init(idPrefix) {
        const root = document.querySelector(`#${idPrefix}-field ${VIZY_INPUT_SELECTOR}`);
        mountInputRoot(root);
    },
});

Craft.Vizy.Settings = Garnish.Base.extend({
    init(inputNamePrefix) {
        this.inputNamePrefix = inputNamePrefix;
        this.inputIdPrefix = Craft.formatInputId(this.inputNamePrefix);

        const root = document.querySelector(`.${this.inputIdPrefix}-vizy-configurator`);
        mountSettingsRoot(root);
    },
});
$(document).ready(() => {
    Craft.Vizy.mountAll(document);
    Craft.Vizy.startAutoMountObserver();

    // We don't want to send the Vizy block data to the server, as the content is serialized ourselves with the field.
    // We do this by changing the namespace of field content to `vizyData`, which is used in our Vizy field data JSON.
    // This method hooks into the ElementEditor.js serialization
    const $mainForm = $('form#main-form');

    if ($mainForm.length) {
        const elementEditor = $mainForm.data('elementEditor');

        if (elementEditor) {
            elementEditor.on('serializeForm', (e) => {
                e.data.serialized = e.data.serialized.replace(/&vizyData[^&]*/g, '');
            });
        }
    }
});
