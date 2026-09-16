import { describe, expect, it } from 'vitest';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import {
    countMountableBlocks,
    eagerFieldLayoutBlockUids,
} from '../../src/web/assets/field/src/ts/field-layout-mount-policy';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const blockTypes: EditorManifest['blockTypes'] = {
    withLayout: {
        uid: 'withLayout',
        name: 'With layout',
        handle: 'withLayout',
        fieldLayoutUid: 'layout-a',
        
    },
    bare: {
        uid: 'bare',
        name: 'Bare',
        handle: 'bare',
        
    },
};

function mockDoc(blocks: Array<{ uid: string; typeUid: string }>): ProseMirrorNode {
    return {
        descendants(callback: (node: { type: { name: string }; attrs: Record<string, unknown> }) => void | false) {
            for (const block of blocks) {
                callback({
                    type: { name: 'vizyBlock' },
                    attrs: { blockUid: block.uid, blockTypeUid: block.typeUid },
                });
            }
        },
    } as ProseMirrorNode;
}

describe('field layout mount policy', () => {
    it('counts only blocks whose type has a field layout', () => {
        const doc = mockDoc([
            { uid: 'a', typeUid: 'withLayout' },
            { uid: 'b', typeUid: 'bare' },
            { uid: 'c', typeUid: 'withLayout' },
        ]);
        expect(countMountableBlocks(doc, blockTypes)).toBe(2);
    });

    it('lists every mountable Block for post-bootstrap safety mounts', () => {
        const blocks = Array.from(
            { length: 20 },
            (_, index) => ({
                uid: `block-${index}`,
                typeUid: index === 1 ? 'bare' : 'withLayout',
            }),
        );

        const uids = eagerFieldLayoutBlockUids(mockDoc(blocks), blockTypes);
        expect(uids).toHaveLength(19);
        expect(uids[0]).toBe('block-0');
        expect(uids).not.toContain('block-1');
        expect(uids.at(-1)).toBe('block-19');
    });
});
