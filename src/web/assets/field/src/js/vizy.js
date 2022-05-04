// CSS needs to be imported here as it's treated as a module
import '@/scss/style.scss';

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
    init(idPrefix, namePrefix) {
        const app = createVueApp({
            components: {
                VizyInput,
            },

            methods: {
                onInputInit() {
                    // Not used here at root level, only for nested fields.
                    // Omitting would produce an error as it's referenced in template calls.
                },
            },
        });

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

// Due to current issues with the element slide-out, we need to initialize in here, due to some
// depenancy resolution not working. We'll figure it out!
document.querySelectorAll('.vizy-input-component').forEach((element) => {
    new Craft.Vizy.Input(element.getAttribute('id'), element.getAttribute('name'));
});
