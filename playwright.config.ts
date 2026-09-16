import { defineConfig, devices } from '@playwright/test';

const performanceTests = /@performance/;

export default defineConfig({
    testDir: './tests/browser',
    fullyParallel: true,
    reporter: 'line',
    outputDir: 'test-results/harness',
    projects: [
        { name: 'chromium', grepInvert: performanceTests, use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', grepInvert: performanceTests, use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', grepInvert: performanceTests, use: { ...devices['Desktop Safari'] } },
        // Wall-clock budgets need an idle browser lane. Finish functional work
        // first, then serialize the engines without changing their assertions.
        {
            name: 'chromium-performance',
            grep: performanceTests,
            workers: 1,
            dependencies: ['chromium', 'firefox', 'webkit'],
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox-performance',
            grep: performanceTests,
            workers: 1,
            dependencies: ['chromium-performance'],
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit-performance',
            grep: performanceTests,
            workers: 1,
            dependencies: ['firefox-performance'],
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
