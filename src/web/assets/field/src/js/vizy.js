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

import VizyInput from './components/VizyInput.vue';
import VizySettings from './components/VizySettings.vue';

Craft.Vizy.Input = Garnish.Base.extend({
    init(idPrefix) {
        const app = createVueApp({
            components: {
                VizyInput,
            },
        });

        // Import globally, as these are included in nested field content to be compiled
        app.component('VizyInput', VizyInput);

        app.mount(`#${idPrefix}-field`);
    },
});

Craft.Vizy.Settings = Garnish.Base.extend({
    init(idPrefix, fieldData, settings) {
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

        app.mount(`.${idPrefix}-vizy-configurator`);
    },
});

// Re-broadcast the custom `vite-script-loaded` event so that we know that this module has loaded
// Needed because when <script> tags are appended to the DOM, the `onload` handlers
// are not executed, which happens in the field Settings page, and in slideouts
// Do this after the document is ready to ensure proper execution order
$(document).ready(() => {
    // Create a global-loaded flag when switching entry types. This won't be fired multiple times.
    Craft.VizyReady = true;

    document.dispatchEvent(new CustomEvent('vite-script-loaded', { detail: { path: 'field/src/js/vizy.js' } }));
});
