import { describe, expect, it } from 'vitest';
import {
    linkBubblePreview,
    truncatePreview,
} from '../../src/web/assets/field/src/ts/semantic/link-bubble';
import { defaultLinkAttrs, urlLinkAttrs } from '../../src/web/assets/field/src/ts/semantic/attrs';

describe('link bubble preview', () => {
    it('truncates long URLs and marks http links openable', () => {
        const long = 'https://example.com/admin/forms/very/long/path';
        const preview = linkBubblePreview(urlLinkAttrs(long));
        expect(preview.openable).toBe(true);
        expect(preview.title).toBe(long);
        expect(preview.text).toBe(truncatePreview(long));
        expect(preview.text.length).toBeLessThanOrEqual(30);
    });

    it('uses type labels for element links (no resolved public URL yet)', () => {
        expect(linkBubblePreview(defaultLinkAttrs({
            type: 'entry',
            targetUid: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        }))).toMatchObject({ text: 'Entry', openable: false });
        expect(linkBubblePreview(defaultLinkAttrs({
            type: 'asset',
            targetUid: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
        })).text).toBe('Asset');
    });
});
