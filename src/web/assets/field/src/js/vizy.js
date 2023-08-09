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
import { onReady } from './utils/dom';

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

Craft.Vizy.Input = Garnish.Base.extend({
    init(idPrefix) {
        const selector = `#${idPrefix}-field .input`;

        // Use `IntersectionObserver` to wait for the selector to mount Vizy to be ready.
        // This handles when Vizy fields are created with Matrix/ST (which uses jQuery to create the DOM elements)
        // Also good for performance to only initializing fields as they become visible.
        onReady(document.querySelector(selector), () => {
            const app = createVueApp({
                components: {
                    VizyInput,
                },
            });

            // // Import globally, as these are included in nested field content to be compiled
            app.component('VizyInput', VizyInput);

            app.mount(selector);
        });
    },
});

Craft.Vizy.Settings = Garnish.Base.extend({
    init(idPrefix, fieldData, settings) {
        const selector = `.${idPrefix}-vizy-configurator`;

        // Use `IntersectionObserver` to wait for the selector to mount Vizy to be ready.
        // This handles when Vizy fields are created with Matrix/ST (which uses jQuery to create the DOM elements)
        // Also good for performance to only initializing fields as they become visible.
        onReady(document.querySelector(selector), () => {
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

            app.mount(selector);
        });
    },
});

// Trigger a custom event to let scripts know that `vizy.js` is ready. This can be an issue when
// the `Craft.Vizy.*` scripts are called before this script has loaded (element slideouts)
$(document).ready(() => {
    document.dispatchEvent(new CustomEvent('vizy-loaded'));
});
