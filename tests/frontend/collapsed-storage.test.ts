import { afterEach, describe, expect, it } from 'vitest';
import {
    forgetCollapsedBlock,
    isBlockCollapsedRemembered,
    rememberCollapsedBlock,
} from '../../src/web/assets/field/src/ts/blocks/collapsed-storage';

describe('collapsed-storage', () => {
    afterEach(() => {
        localStorage.clear();
        delete (window as { Craft?: unknown }).Craft;
    });

    it('remembers and forgets Block UIDs under the Craft system key', () => {
        window.Craft = { systemUid: 'test-system' };
        const uid = 'block-uid-1';

        expect(isBlockCollapsedRemembered(uid)).toBe(false);
        rememberCollapsedBlock(uid);
        expect(isBlockCollapsedRemembered(uid)).toBe(true);
        expect(localStorage.getItem('Craft-test-system.Vizy.collapsedBlocks')).toBe(uid);

        rememberCollapsedBlock(uid); // idempotent
        expect(localStorage.getItem('Craft-test-system.Vizy.collapsedBlocks')).toBe(uid);

        forgetCollapsedBlock(uid);
        expect(isBlockCollapsedRemembered(uid)).toBe(false);
    });
});
