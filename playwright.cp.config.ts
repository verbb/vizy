import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

const fixture = JSON.parse(fs.readFileSync('.cache/verbb-tests/browser.json', 'utf8'));
export default defineConfig({
    testDir: './tests/browser-cp',
    testIgnore: Object.keys(fixture.matrixIntegrations ?? {}).length ? [] : ['**/matrix-integrations.spec.ts'],
    fullyParallel: false,
    workers: 1,
    timeout: 60_000,
    reporter: 'line',
    outputDir: 'test-results/craft-cp',
    use: { baseURL: fixture.url, ignoreHTTPSErrors: true, trace: 'retain-on-failure' },
    projects: [{ name: 'craft-chromium', use: { ...devices['Desktop Chrome'] } }],
});
