// CSS needs to be imported here as it's treated as a module
import '@/scss/style.scss';

//
// Start Vue Apps
//

import { createVueApp } from './config';

import VizyInput from './components/VizyInput.vue';
import VizySettings from './components/VizySettings.vue';

// Due to current issues with the element slide-out, we need to initialize in here, due to some
// depenancy resolution not working. We'll figure it out!
document.querySelectorAll('.vizy-input-component').forEach((element) => {
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

    app.mount(element);
});

document.querySelectorAll('.vizy-configurator').forEach((element) => {
    const fieldData = JSON.parse(element.getAttribute('data-field-data'));
    const settings = JSON.parse(element.getAttribute('data-settings'));

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

    app.mount(element);
});
