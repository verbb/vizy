import { describe, expect, it } from 'vitest';
import { attrsFromImageDialog, IMAGE_SIZE_OPTIONS } from '../../src/web/assets/field/src/ts/semantic/image-apply';
import {
    rememberImagePreview,
    getImagePreview,
    hydrateImagePreviews,
} from '../../src/web/assets/field/src/ts/semantic/image-preview-cache';

const ASSET_UID = 'bda97141-65e6-48f6-84df-bf39f66034da';

describe('image authoring apply', () => {
    it('maps dialog fields to semantic image attrs with optional link', () => {
        const attrs = attrsFromImageDialog({
            assetUid: ASSET_UID,
            assetId: 12,
            previewUrl: 'https://example.test/img.jpg',
            alt: 'Wave',
            title: 'Surf',
            linkUrl: 'https://example.test',
            openInNewTab: true,
            size: 'large',
            transform: 'thumb',
            updating: false,
        });
        expect(attrs).toMatchObject({
            assetUid: ASSET_UID,
            altMode: 'custom',
            alt: 'Wave',
            title: 'Surf',
            size: 'large',
            link: {
                type: 'url',
                value: 'https://example.test',
                newWindow: true,
            },
        });
        expect(attrs).not.toHaveProperty('src');
        expect(IMAGE_SIZE_OPTIONS.map((o) => o.value)).toContain('full');
    });

    it('keeps preview URLs out of canonical attrs via session cache', () => {
        rememberImagePreview(ASSET_UID, {
            assetId: 9,
            url: 'https://cdn.test/a.jpg',
            label: 'A',
            transform: '',
        });
        expect(getImagePreview(ASSET_UID)?.url).toContain('cdn.test');
    });

    it('hydrates bootstrap imagePreviews into the session cache', () => {
        const uid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
        hydrateImagePreviews({
            [uid]: {
                assetId: 42,
                url: 'https://cdn.test/reload.jpg',
                label: 'Reload',
            },
        });
        expect(getImagePreview(uid)).toMatchObject({
            assetId: 42,
            url: 'https://cdn.test/reload.jpg',
            label: 'Reload',
            transform: '',
        });
    });
});
