import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        include: ['tests/frontend/**/*.test.ts'],
        setupFiles: ['tests/frontend/support/happy-dom-polyfills.ts'],
        coverage: { reporter: ['text'] },
    },
});
