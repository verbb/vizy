import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ScreenshotSetupContext } from '@verbb/craft-screenshots/types';

export type VizyFeatureFixture = {
    fieldId: number;
    fieldHandle: string;
    settingsRoute: string;
    editorConfigRoute: string;
    blockTypesRoute: string;
    entryEditRoute: string;
};

const fixtureDir = dirname(fileURLToPath(import.meta.url));
const seedScript = readFileSync(join(fixtureDir, 'seed', 'seed-feature-tour.php'), 'utf8');

/**
 * Seed the Vizy field and editorial entry used by the feature-page screenshots.
 */
export async function seedVizyFeatureFixture(context: ScreenshotSetupContext): Promise<VizyFeatureFixture> {
    const output = await context.runCraftScript(seedScript, { label: 'seed-vizy-feature-tour' });
    const fixture = JSON.parse(output.trim()) as VizyFeatureFixture;

    if (!fixture.fieldId || !fixture.settingsRoute || !fixture.editorConfigRoute || !fixture.blockTypesRoute || !fixture.entryEditRoute) {
        throw new Error(`Invalid Vizy feature fixture payload: ${output}`);
    }

    return fixture;
}
