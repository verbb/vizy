const mix = require('laravel-mix');
const path = require('path');

// Mix plugins
const autoprefixer = require('autoprefixer');
const eslint = require('laravel-mix-eslint-config');
const polyfill = require('laravel-mix-polyfill');
const imagemin = require('laravel-mix-imagemin');

const assetsPath = './src/web/assets';

// Set the public path
mix.setPublicPath(assetsPath);

//
// Vizy Field
//

// Setup and configure Sass
mix.sass(assetsPath + '/field/src/scss/style.scss', assetsPath + '/field/dist/css');

// Setup and configure JS
mix.js(assetsPath + '/field/src/js/main.js', assetsPath + '/field/dist/js');

// Vue 2
mix.vue({ version: 2 });

mix.override((config) => {
    delete config.watchOptions;
});

// Setup additional CSS-related options including Tailwind and any other PostCSS items
mix.options({
    // Disable processing css urls for speed
    processCssUrls: false,
    postCss: [
        // PostCSS plugins
        autoprefixer(),
    ],
});

// Setup some aliases
mix.webpackConfig({
    resolve: {
        alias: {
            '@utils': path.resolve(__dirname, assetsPath + '/field/src/js/utils'),
        }
    },
    externals: {
        vue: 'Vue',
    }
});

// Setup JS-linting
mix.eslint({
    exclude: [
        'node_modules',
    ],
    options: {
        fix: true,
        cache: false,
    },
});

// Always allow versioning of assets
mix.version();

// Add polyfills
// mix.polyfill({
//     enabled: true,
//     useBuiltIns: 'usage', // Only add a polyfill when a feature is used
//     targets: false, // "false" makes the config use .browserslistrc file
//     corejs: 3,
//     debug: false, // "true" to check which polyfills are being used
// });
