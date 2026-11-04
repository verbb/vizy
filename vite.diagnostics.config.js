import { defineConfig } from 'vite';

// Capture must run in the head before module initialization, without editor dependencies.
export default defineConfig({
    build: {
        outDir: 'src/web/assets/diagnostics/dist',
        emptyOutDir: true,
        lib: {
            entry: 'src/web/assets/diagnostics/src/capture.ts',
            name: 'VizyBrowserCapture',
            formats: ['iife'],
            fileName: () => 'capture.js',
        },
    },
});
