import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedVizyFeatureFixture } from '../../support/fixtures';

let settingsRoute = '/admin/settings/fields';

export default defineScreenshotScenario({
    id: 'vizy-feature-tour-settings',
    output: 'feature-tour/vizy-settings.png',
    route: () => settingsRoute,
    viewport: { width: 1600, height: 1400, deviceScaleFactor: 2 },
    expectedOutput: { width: 1804, height: 1440 },
    async setup(context) {
        settingsRoute = (await seedVizyFeatureFixture(context)).settingsRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '.vizy-configurator', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'Callout' },
        { type: 'text', text: 'Pull Quote' },
    ],
    preSteps: [
        { type: 'click', selector: ':nth-match(.vui-block-item:has-text("Callout"), 1)' },
        {
            type: 'evaluate',
            expression: `
                (() => {
                    const heading = [...document.querySelectorAll('label')]
                        .find((element) => element.textContent?.trim() === 'Block Configuration');
                    heading?.closest('.field')?.scrollIntoView({ block: 'start' });
                })();
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ],
    target: {
        type: 'clip',
        x: 275,
        y: 60,
        width: 902,
        height: 720,
    },
    caption: 'A Vizy field configured with reusable Callout and Pull Quote blocks in Craft 5.',
    intent: 'Show the current block configurator with the field’s available structured blocks.',
});
