import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedVizyFeatureFixture } from '../../support/fixtures';

let entryEditRoute = '/admin/entries/vizyFeatureStories';

export default defineScreenshotScenario({
    id: 'vizy-feature-tour-editor',
    output: 'feature-tour/vizy-editor.png',
    route: () => entryEditRoute,
    viewport: { width: 1280, height: 960, deviceScaleFactor: 2 },
    expectedOutput: { width: 1164, height: 916 },
    async setup(context) {
        entryEditRoute = (await seedVizyFeatureFixture(context)).entryEditRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '.vizy-input-component .vui-rich-text', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'A guide built around the reader' },
    ],
    preSteps: [
        {
            type: 'fill',
            selector: ':nth-match(.vizyblock[data-type="callout"] input[type="text"], 2)',
            value: 'Add structured content exactly where it belongs.',
        },
        {
            type: 'evaluate',
            expression: `
                (() => {
                    document.activeElement?.blur();
                    document.querySelector('.vizy-input-component')?.scrollIntoView({ block: 'start' });
                })();
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 500 } },
    ],
    target: {
        type: 'anchoredClip',
        selector: '.vizy-input-component',
        x: 1,
        y: 1,
        width: 582,
        height: 458,
    },
    caption: 'A populated Vizy field combining formatted copy with reusable structured blocks.',
    intent: 'Show the genuine Craft 5 Vizy editor as the single surface where authors write and arrange blocks.',
});
