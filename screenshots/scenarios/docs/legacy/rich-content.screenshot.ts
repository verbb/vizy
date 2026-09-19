import { defineScreenshotScenario } from '@verbb/craft-screenshots/api';

import { seedVizyFeatureFixture } from '../../../support/fixtures';

let entryEditRoute = '/admin/entries/vizyFeatureStories';

export default defineScreenshotScenario({
    id: 'vizy-docs-legacy-rich-content',
    output: 'docs/legacy/rich-content.png',
    route: () => entryEditRoute,
    viewport: { width: 1280, height: 960, deviceScaleFactor: 2 },
    async setup(context) {
        entryEditRoute = (await seedVizyFeatureFixture(context)).entryEditRoute;
    },
    waitFor: [
        { type: 'loadState', state: 'networkidle' },
        { type: 'text', text: 'Seasonal guide at a glance', timeout: 30000 },
        { type: 'selector', selector: '.vizy-input-component .vui-rich-text table', state: 'visible', timeout: 30000 },
    ],
    steps: [
        {
            type: 'evaluate',
            expression: `(() => {
                const heading = Array.from(document.querySelectorAll('.vizy-input-component .vui-rich-text h3')).find((element) => element.textContent?.includes('Seasonal guide at a glance'));
                const editor = heading?.closest('.vui-rich-text');
                if (heading instanceof HTMLElement && editor instanceof HTMLElement) {
                    editor.style.transform = \`translateY(\${120 - heading.getBoundingClientRect().top}px)\`;
                }
            })();`,
        },
        { type: 'wait', waitFor: { type: 'timeout', ms: 300 } },
    ],
    target: {
        type: 'anchoredClip',
        selector: '.vizy-input-component .vui-rich-text h3',
        x: -24,
        y: -20,
        width: 640,
        height: 390,
    },
    caption: 'A real table embedded directly in Vizy’s rich-content editor.',
    intent: 'Retain the legacy rich-content feature subject with a deterministic current-editor example.',
});
