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

    it('automatically projects bounded Hosted Vizy text without descending into its Blocks', () => {
        const type: BlockTypeManifest = {
            uid: 'type-hosted',
            name: 'Rich card',
            handle: 'richCard',
            fieldSlotKinds: { 'placement-hosted': 'hosted' },
            summaryInference: {
                titlePlacementUids: ['placement-hosted'],
                subtitlePlacementUids: [],
                mediaPlacementUids: [],
            },
        };
        const summary = projectBlockSummary({
            blockUid: 'block-hosted',
            blockTypeUid: type.uid,
            enabled: true,
            fieldSlots: {
                'placement-hosted': {
                    type: 'doc',
                    attrs: { schemaVersion: 2 },
                    content: [
                        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Nested heading' }] },
                        { type: 'paragraph', content: [{ type: 'text', text: 'and supporting copy' }] },
                        {
                            type: 'vizyBlock',
                            attrs: {
                                blockUid: 'deeper-block',
                                blockTypeUid: 'deeper-type',
                                enabled: true,
                                fieldSlots: {},
                            },
                            content: [{ type: 'text', text: 'must not leak from a nested Block' }],
                        },
                    ],
                },
            },
            type,
            inference: type.summaryInference,
            revision: 2,
        });

        expect(summary.title).toBe('Nested heading and supporting copy');
        expect(summary.title).not.toContain('must not leak');
    });
});
