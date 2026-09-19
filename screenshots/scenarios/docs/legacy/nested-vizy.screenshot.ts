import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedVizyFeatureFixture } from '../../../support/fixtures';

let entryEditRoute = '/admin/entries/vizyFeatureStories';

export default defineScreenshotScenario({
    id: 'vizy-docs-legacy-nested-vizy',
    output: 'docs/legacy/nested-vizy.png',
    route: () => entryEditRoute,
    viewport: { width: 1280, height: 1050, deviceScaleFactor: 2 },
    async setup(context) {
        entryEditRoute = (await seedVizyFeatureFixture(context)).entryEditRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '.vizyblock[data-type="latestNews"]', state: 'visible', timeout: 30000 },
    ],
    steps: [
        {
            type: 'evaluate',
            expression: `document.querySelector('.vizyblock[data-type="latestNews"]')?.scrollIntoView({ block: 'center' });`,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ],
    target: { type: 'selector', selector: '.vizyblock[data-type="latestNews"]' },
    caption: 'A genuine nested Vizy field inside a structured Latest News block.',
    intent: 'Retain the legacy nested-field subject using Vizy’s current Craft 5 block model.',
});
