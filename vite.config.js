import path from 'path';

// Vite Plugins
import VuePlugin from '@vitejs/plugin-vue';
import EslintPlugin from 'vite-plugin-eslint';

// Rollup Plugins
import { nodeResolve } from '@rollup/plugin-node-resolve';
import AnalyzePlugin from 'rollup-plugin-analyzer';

export default ({ command }) => ({
    // Set the root to our source folder
    root: './src/web/assets',

    // When building update the destination base
    base: command === 'serve' ? '' : '/dist/',

    build: {
        outDir: 'field/dist',
        emptyOutDir: true,
        manifest: true,
        sourcemap: true,
        rollupOptions: {
            input: {
                vizy: '/field/src/js/vizy.js',
            },
        },
    },

    server: {
        origin: 'http://localhost:4001',
    },

    plugins: [
        // Keep JS looking good with eslint
        // https://github.com/gxmari007/vite-plugin-eslint
        EslintPlugin({
            cache: false,
            fix: true,
            include: './src/web/assets/**/*.{js,vue}',
            exclude: './src/web/assets/field/src/js/vendor/**/*.{js,vue}',
        }),

        // Vue 3 support
        // https://github.com/vitejs/vite/tree/main/packages/plugin-vue
        VuePlugin({
            isProduction: true,
        }),

        // Analyze bundle size
        // https://github.com/doesdev/rollup-plugin-analyzer
        AnalyzePlugin({
            summaryOnly: true,
            limit: 15,
        }),

        // Ensure Vite can find the modules it needs
        // https://github.com/rollup/plugins/tree/master/packages/node-resolve
        nodeResolve({
            moduleDirectories: [
                path.resolve('./node_modules'),
            ],
        }),
    ],

    resolve: {
        alias: {
            // // Allow us to use `@/` in JS, CSS and Twig for ease of development.
            '@': path.resolve('./src/web/assets/field/src'),

            // Allow us to use `@utils/` in JS for misc utilities.
            '@utils': path.resolve('./src/web/assets/field/src/js/utils'),

            // Allow us to use `@components/` in Vue components.
            '@components': path.resolve('./src/web/assets/field/src/components'),

            // Vue 3 doesn't support the template compiler out of the box
            'vue': 'vue/dist/vue.esm-bundler.js',
        },
    },

    // Add in any components to optimise them early.
    optimizeDeps: {
        include: [
            'lodash-es',
            'vue',
        ],
    },
});
