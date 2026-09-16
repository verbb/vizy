import path from 'path';

export default ({ command }) => ({
    // Set the root to our source folder
    root: './src/web/assets',

    // Relative for builds, because Craft republishes `dist/` into a hashed
    // `cpresources/<hash>/` directory whose URL is not known at build time. Entry files
    // are registered by the asset bundle through the manifest and so were unaffected, but
    // anything the browser resolves at runtime — a dynamic `import()`, a `url()` in CSS —
    // was pointed at `/dist/...` and 404'd. With `./`, Vite resolves those against
    // `import.meta.url` instead, which is correct wherever the folder ends up.
    base: command === 'serve' ? '' : './',

    build: {
        outDir: 'field/dist',
        emptyOutDir: true,
        manifest: 'manifest.json',
        sourcemap: true,
        rollupOptions: {
            input: {
                vizy: '/field/src/ts/vizy.ts',
                'field-settings': '/fieldsettings/src/ts/field-settings.ts',
                'editor-config-settings': '/editorconfigsettings/src/ts/editor-config-settings.ts',
                'icon-picker': '/iconpicker/src/ts/icon-picker.ts',
            },
            output: {
                sourcemapExcludeSources: true,
            },
        },
    },

    server: {
        origin: 'http://localhost:4001',

        hmr: {
            // Using the default `wss` doesn't work on https
            protocol: 'ws',
        },
    },

    plugins: [],

    resolve: {
        alias: {
            // // Allow us to use `@/` in JS, CSS and Twig for ease of development.
            '@': path.resolve('./src/web/assets/field/src'),

            // Allow us to use `@utils/` in JS for misc utilities.
            '@utils': path.resolve('./src/web/assets/field/src/js/utils'),

            '@components': path.resolve('./src/web/assets/field/src/ts/components'),
        },
    },

    // Add in any components to optimise them early.
    optimizeDeps: {
        include: ['@tiptap/core', '@tiptap/starter-kit', 'lit'],
    },
});
