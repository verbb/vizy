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





// // Directly copy over some folders
// mix.copy(assetsPath + '/forms/src/fonts', assetsPath + '/forms/dist/fonts');


// // Optimise images and SVGs
// mix.imagemin([
//     { from: assetsPath + '/forms/src/img', to: 'forms/dist/img' },
// ], {}, {
//     gifsicle: { interlaced: true },
//     mozjpeg: { progressive: true, arithmetic: false },
//     optipng: { optimizationLevel: 3 }, // Lower number = speedier/reduced compression
//     svgo: {
//         plugins: [
//             { convertColors: { currentColor: false } },
//             { removeDimensions: false },
//             { removeViewBox: false },
//             { cleanupIDs: false },
//         ],
//     },
// });


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

// if (mix.inProduction()) {
//     // Add polyfills
//     mix.polyfill({
//         enabled: true,
//         useBuiltIns: 'usage', // Only add a polyfill when a feature is used
//         targets: false, // "false" makes the config use .browserslistrc file
//         corejs: 3,
//         debug: false, // "true" to check which polyfills are being used
//     });
// }
