import { describe, expect, it, vi } from 'vitest';
import type { Editor } from '@tiptap/core';
import { openImageAssetSelector } from '../../src/web/assets/field/src/ts/semantic/image-ui';
import { attrsFromImageDialog, IMAGE_SIZE_OPTIONS, seedImageDialogFromSelection } from '../../src/web/assets/field/src/ts/semantic/image-apply';
import {
    rememberImagePreview,
    getImagePreview,
    hydrateImagePreviews,
} from '../../src/web/assets/field/src/ts/semantic/image-preview-cache';

const ASSET_UID = 'bda97141-65e6-48f6-84df-bf39f66034da';

describe('image authoring apply', () => {
    it.each([false, true])('applies peer-file visibility only when configured: %s', (showUnpermittedFiles) => {
        const previous = window.Craft;
        const createElementSelectorModal = vi.fn();
        window.Craft = { ...previous, createElementSelectorModal };
        try {
            openImageAssetSelector({} as Editor, { showUnpermittedFiles });
            const criteria = createElementSelectorModal.mock.calls[0]![1].criteria;
            expect(criteria.kind).toBe('image');
            if (showUnpermittedFiles) expect(criteria).toHaveProperty('uploaderId', null);
            else expect(criteria).not.toHaveProperty('uploaderId');
        } finally {
            window.Craft = previous;
        }
    });

    it.each([
        { label: 'empty', volumes: [] },
        { label: 'restricted', volumes: ['volume:allowed'] },
        { label: 'default', volumes: undefined },
    ])('preserves the configured Craft image sources: $label', ({ volumes }) => {
        const previous = window.Craft;
        const createElementSelectorModal = vi.fn();
        window.Craft = { ...previous, createElementSelectorModal };
        try {
            openImageAssetSelector({} as Editor, { volumes });
            expect(createElementSelectorModal).toHaveBeenCalledWith('craft\\elements\\Asset', expect.objectContaining({ sources: volumes }));
        } finally {
            window.Craft = previous;
        }
    });

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

    it('retains private asset metadata when bootstrap has no public preview URL', () => {
        const uid = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
        hydrateImagePreviews({ [uid]: { assetId: 43, url: '', label: 'Private image' } });
        const editor = {
            isActive: () => true,
            getAttributes: () => ({ assetUid: uid }),
        } as unknown as Editor;
        expect(seedImageDialogFromSelection(editor)).toMatchObject({
            assetId: 43, previewUrl: '', transform: '',
        });
        expect(getImagePreview(uid)?.label).toBe('Private image');
    });

});
