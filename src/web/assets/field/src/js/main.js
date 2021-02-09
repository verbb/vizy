import Vue from 'vue';
import config from './config.js';

// Apply our config settings, which do most of the grunt work
Vue.use(config);

//
// Start Vue Apps
//

if (typeof Craft.Vizy === typeof undefined) {
    Craft.Vizy = {};
}

//
// Components
//

import VizyInput from './components/VizyInput.vue';
import VizySettings from './components/VizySettings.vue';

Craft.Vizy.Input = Garnish.Base.extend({
    init(idPrefix, namePrefix) {
        new Vue({
            el: '#' + idPrefix + '-field',
            delimiters: ['${', '}'],

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
    },
});

Craft.Vizy.Settings = Garnish.Base.extend({
    init(fieldData, settings) {
        new Vue({
            el: '.vizy-configurator',
            delimiters: ['${', '}'],

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
    },
});

