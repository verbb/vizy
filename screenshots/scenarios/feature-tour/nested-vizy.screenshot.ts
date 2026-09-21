import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedVizyFeatureFixture } from '../../support/fixtures';

let entryEditRoute = '/admin/entries/vizyFeatureStories';

export default defineScreenshotScenario({
    id: 'vizy-feature-tour-nested-vizy',
    output: 'feature-tour/vizy-nested.png',
    route: () => entryEditRoute,
    viewport: { width: 1280, height: 1050, deviceScaleFactor: 2 },
    expectedOutput: { width: 1100, height: 608 },
    async setup(context) {
        entryEditRoute = (await seedVizyFeatureFixture(context)).entryEditRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: 'vizy-block[data-block-uid="cccccccc-cccc-4ccc-8ccc-cccccccccccc"] vizy-editor[data-vizy-hosted]', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'A nested editor keeps supporting copy structured' },
    ],
    steps: [
        {
            type: 'evaluate',
            expression: `document.querySelector('vizy-block[data-block-uid="cccccccc-cccc-4ccc-8ccc-cccccccccccc"]')?.scrollIntoView({ block: 'center' });`,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ],
    target: {
        type: 'selector',
        selector: 'vizy-block[data-block-uid="cccccccc-cccc-4ccc-8ccc-cccccccccccc"]',
    },
    caption: 'A Hosted Vizy editor nested inside a structured Latest News Block Type.',
    intent: 'Carry the old nested-Vizy scenario forward using Vizy 4’s canonical Hosted Vizy model and current Block UI.',
});
