import Vue from 'vue';
import Axios from 'axios';
import { stringify } from 'qs';

import * as Plugins from './plugins';
import * as Filters from './filters';

const globals = require('./utils/globals');

//
// Create a config object to pass back to Vue.js when setting up for the first time
//

const Config = {
    install(Vue) {
        // Global events can be accessed via `this.$events`
        Vue.prototype.$events = new Vue();

        //
        // Setup Globals
        //

        // Attach Axios instance to Vue, so we can use `this.$axios.get('/')`
        Vue.prototype.$axios = Axios.create({
            transformRequest: [
                function(data, headers) {
                    const craftHeaders = Craft._actionHeaders();
                    headers['X-Requested-With'] = 'XMLHttpRequest';
                    for (const k in craftHeaders) {
                        if (Object.prototype.hasOwnProperty.call(craftHeaders, k)) {
                            headers[k] = craftHeaders[k];
                        }
                    }

                    // If this is FormData, no need to serialize
                    if (data instanceof FormData) {
                        return data;
                    }

                    return stringify(data);
                },
            ],
        });

        // TODO: Try and figure out .env variables that aren't compiled
        Vue.prototype.$isDebug = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

        //
        // Setup Plugins
        //

        Object.values(Plugins).forEach((Plugin) => {
            Vue.use(Plugin);
        });

        //
        // Setup Filters
        //

        Object.values(Filters).forEach((Filter) => {
            Vue.use(Filter);
        });
    },
};

export default Config;
