import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedVizyFeatureFixture } from '../../support/fixtures';

let entryEditRoute = '/admin/entries/vizyFeatureStories';

export default defineScreenshotScenario({
    id: 'vizy-feature-tour-commands',
    output: 'feature-tour/vizy-commands.png',
    route: () => entryEditRoute,
    viewport: { width: 1180, height: 760, deviceScaleFactor: 2 },
    expectedOutput: { width: 1196, height: 268 },
    async setup(context) {
        entryEditRoute = (await seedVizyFeatureFixture(context)).entryEditRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: '.vizy-input-component .ProseMirror', state: 'visible', timeout: 30000 },
    ],
    preSteps: [
        {
            type: 'fill',
            selector: ':nth-match(.vizyblock[data-type="callout"] input[type="text"], 2)',
            value: 'Add structured content exactly where it belongs.',
        },
        { type: 'press', selector: '.vizy-input-component .ProseMirror', key: 'Control+End' },
        { type: 'press', selector: '.vizy-input-component .ProseMirror', key: 'Enter' },
        { type: 'press', selector: '.vizy-input-component .ProseMirror', key: '/' },
        { type: 'wait', waitFor: { type: 'selector', selector: '.items[data-tippy-root], .tippy-box', state: 'visible', timeout: 10000 } },
    ],
    target: {
        type: 'anchoredClip',
        selector: '.tippy-box',
        x: 1,
        y: 1,
        width: 598,
        height: 134,
    },
    caption: 'Vizy’s command palette offering formatting, media and structured block choices inline.',
    intent: 'Show the real command palette in the current Craft 5 editor rather than the old promotional composition.',
});
