import { describe, expect, it } from 'vitest';
import { projectBlockSummary } from '../../src/web/assets/field/src/ts/blocks/summary-projection';
import type { BlockTypeManifest } from '../../src/web/assets/field/src/ts/types';

describe('block summary projection', () => {
    it('uses explicit placement and falls back to block type name', () => {
        const type: BlockTypeManifest = {
            uid: 'type-a',
            name: 'Hero',
            handle: 'hero',
            
            summaryInference: {
                titlePlacementUids: ['placement-title'],
                subtitlePlacementUids: ['placement-sub'],
                mediaPlacementUids: [],
            },
        };
        const summary = projectBlockSummary({
            blockUid: 'block-a',
            blockTypeUid: 'type-a',
            enabled: true,
            fieldSlots: {
                'placement-title': 'Hello',
                'placement-sub': 'World',
            },
            type,
            inference: type.summaryInference,
            revision: 1,
            explicitTitlePlacementUid: 'placement-title',
            explicitSubtitlePlacementUid: 'placement-sub',
        });
        expect(summary.typeName).toBe('Hero');
        expect(summary.title).toBe('Hello');
        expect(summary.subtitle).toBe('World');
        expect(summary.resolved).toBe(true);
    });

    it('returns safe title for unresolved block types', () => {
        const summary = projectBlockSummary({
            blockUid: 'block-a',
            blockTypeUid: 'missing',
            enabled: true,
            fieldSlots: {},
            type: undefined,
            inference: undefined,
            revision: 1,
        });
        expect(summary.typeName).toBe('Missing Block Type');
        expect(summary.title).toBe('Missing Block Type');
        expect(summary.resolved).toBe(false);
    });
});
