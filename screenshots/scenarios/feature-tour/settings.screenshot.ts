import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedVizyFeatureFixture } from '../../support/fixtures';

let editorConfigRoute = '/admin/vizy/settings/editor-configs/editorial';

export default defineScreenshotScenario({
    id: 'vizy-feature-tour-settings',
    output: 'feature-tour/vizy-settings.png',
    route: () => editorConfigRoute,
    viewport: { width: 1600, height: 1400, deviceScaleFactor: 2 },
    expectedOutput: { width: 2100, height: 960 },
    async setup(context) {
        editorConfigRoute = (await seedVizyFeatureFixture(context)).editorConfigRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'selector', selector: 'vizy-editor-config-settings .vizy-editor-config-builder[data-builder="toolbar"]', state: 'visible', timeout: 30000 },
        { type: 'text', text: 'Available items' },
        { type: 'text', text: 'Toolbar preview' },
    ],
    preSteps: [
        {
            type: 'evaluate',
            expression: `
                (() => {
                    document.querySelector('.vizy-editor-config-builder[data-builder="toolbar"]')?.scrollIntoView({ block: 'center' });
                })();
            `,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ],
    target: {
        type: 'anchoredClip',
        selector: '.vizy-editor-config-builder[data-builder="toolbar"]',
        x: -24,
        y: -82,
        width: 1050,
        height: 480,
    },
    caption: 'A named Vizy Editor Config with reusable toolbar and content controls.',
    intent: 'Show Vizy 4’s global Editor Config builder rather than Vizy 3’s inline field configuration.',
});
