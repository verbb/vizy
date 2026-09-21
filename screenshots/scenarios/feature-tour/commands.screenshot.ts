import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedVizyFeatureFixture } from '../../support/fixtures';

let entryEditRoute = '/admin/entries/vizyFeatureStories';

export default defineScreenshotScenario({
    id: 'vizy-feature-tour-commands',
    output: 'feature-tour/vizy-commands.png',
    route: () => entryEditRoute,
    viewport: { width: 1180, height: 760, deviceScaleFactor: 2 },
    expectedOutput: { width: 560, height: 468 },
    async setup(context) {
        entryEditRoute = (await seedVizyFeatureFixture(context)).entryEditRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: 'vizy-editor .ProseMirror', state: 'visible', timeout: 30000 },
    ],
    preSteps: [
        { type: 'press', selector: ':nth-match(vizy-editor .ProseMirror, 1)', key: 'Control+End' },
        { type: 'press', selector: ':nth-match(vizy-editor .ProseMirror, 1)', key: 'Enter' },
        { type: 'press', selector: ':nth-match(vizy-editor .ProseMirror, 1)', key: '/' },
        { type: 'wait', waitFor: { type: 'selector', selector: '.vizy-insertion-popup vizy-insertion-list', state: 'visible', timeout: 10000 } },
    ],
    target: {
        type: 'anchoredClip',
        selector: '.vizy-insertion-popup vizy-insertion-list',
        x: 1,
        y: 1,
        width: 280,
        height: 234,
    },
    caption: 'Vizy’s insertion palette offering rich content and structured Block Types inline.',
    intent: 'Show the real Vizy 4 slash insertion palette, including the field’s grouped global Block Types.',
});
