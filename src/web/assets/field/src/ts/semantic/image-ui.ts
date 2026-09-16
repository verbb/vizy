import type { Editor } from '@tiptap/core';
import { isUuid } from './attrs';
import { openVizyImageDialog } from './image-dialog';
import { seedImageDialogFromSelection, type ImageDialogSeed } from './image-apply';
import { rememberImagePreview } from './image-preview-cache';

export type VizyImageAuthoringConfig = {
    volumes?: string[];
    /** Craft AssetSelectorModal expects `{ handle, name }[]`, not bare handles. */
    transforms?: Array<{ handle: string; name: string }>;
    defaultTransform?: string;
    defaultSource?: string | null;
    elementSiteId?: number;
    linkSelectorStorageKeyPrefix?: string;
};

type CraftAssetElement = {
    id?: number;
    siteId?: number;
    label?: string;
    url?: string;
    uid?: string;
    $element?: {
        data?: (key: string) => unknown;
        attr?: (key: string) => string | undefined;
    };
};

/**
 * Toolbar Image: open Craft asset selector (images + optional transforms),
 * then the Insert Image dialog. Edit path uses the selection bubble.
 */
export function activateImageControl(
    editor: Editor,
    config: VizyImageAuthoringConfig,
    options?: { focus?: boolean },
): void {
    if (editor.isActive('image')) {
        const seed = seedImageDialogFromSelection(editor);
        if (seed) {
            void openVizyImageDialog(editor, seed, {
                focus: options?.focus,
                transforms: config.transforms ?? [],
            });
            return;
        }
    }
    openImageAssetSelector(editor, config, options);
}

export function openImageAssetSelector(
    editor: Editor,
    config: VizyImageAuthoringConfig,
    options?: { focus?: boolean },
): void {
    const craft = window.Craft;
    if (!craft?.createElementSelectorModal) {
        throw new Error('Craft element selector is not available in this environment.');
    }

    const volumes = config.volumes ?? [];
    // Pass full transform objects — Craft builds `data-transform="{handle}"` + label.
    const transforms = (config.transforms ?? []).filter((t) => t.handle && t.name);
    const defaultTransform = config.defaultTransform ?? '';

    craft.createElementSelectorModal('craft\\elements\\Asset', {
        storageKey: `${config.linkSelectorStorageKeyPrefix ?? 'VizyInput'}.ChooseImage`,
        multiSelect: false,
        sources: volumes.length ? volumes : undefined,
        defaultSource: config.defaultSource ?? undefined,
        criteria: {
            siteId: config.elementSiteId,
            kind: 'image',
        },
        // Non-empty → Craft.AssetSelectorModal shows “Select transform” in the footer.
        transforms,
        closeOtherModals: false,
        onSelect: (elements, transform) => {
            void handleAssetSelect(editor, config, elements as CraftAssetElement[], transform, options);
        },
    });
}

async function handleAssetSelect(
    editor: Editor,
    config: VizyImageAuthoringConfig,
    assets: CraftAssetElement[],
    transform: string | undefined,
    options?: { focus?: boolean },
): Promise<void> {
    if (!assets?.length) return;
    const [asset] = assets;
    if (!asset.id) {
        console.warn('[vizy] Image select: asset has no id');
        return;
    }

    // Craft.getElementInfo does not include uid — resolve assetUid for canonical attrs.
    let uid = craftAssetUid(asset);
    let previewUrl = asset.url || '';
    let alt = asset.label || '';
    let title = asset.label || '';

    if (!uid || !isUuid(uid)) {
        const resolved = await resolveAssetInfo(asset.id, asset.siteId ?? config.elementSiteId);
        if (!resolved?.uid || !isUuid(resolved.uid)) {
            console.warn('[vizy] Image select: could not resolve asset uid', asset.id);
            return;
        }
        uid = resolved.uid;
        previewUrl = previewUrl || resolved.url || '';
        alt = alt || resolved.alt || resolved.title || '';
        title = title || resolved.title || '';
    }

    const chosenTransform = (typeof transform === 'string' && transform)
        ? transform
        : (config.defaultTransform ?? '');

    // If a transform was chosen via “Select transform”, Craft already swapped url.
    // For a default transform on plain Select, mint a preview URL when needed.
    if (chosenTransform && (!transform || typeof transform !== 'string')) {
        const minted = await generateTransformPreview(asset.id, chosenTransform);
        if (minted) previewUrl = minted;
    }

    rememberImagePreview(uid, {
        assetId: asset.id,
        url: previewUrl,
        label: title || alt || 'Image',
        transform: chosenTransform,
    });

    const seed: ImageDialogSeed = {
        assetUid: uid,
        assetId: asset.id,
        previewUrl,
        alt,
        title,
        linkUrl: '',
        openInNewTab: false,
        size: 'default',
        transform: chosenTransform,
        updating: false,
    };

    await openVizyImageDialog(editor, seed, {
        focus: options?.focus,
        transforms: config.transforms ?? [],
    });
}

function craftAssetUid(element: CraftAssetElement): string | null {
    if (typeof element.uid === 'string' && isUuid(element.uid)) return element.uid;
    const fromData = element.$element?.data?.('uid');
    if (typeof fromData === 'string' && isUuid(fromData)) return fromData;
    const fromAttr = element.$element?.attr?.('data-uid');
    if (typeof fromAttr === 'string' && isUuid(fromAttr)) return fromAttr;
    return null;
}

async function resolveAssetInfo(
    assetId: number,
    siteId?: number,
): Promise<{ uid: string; url: string | null; title: string; alt: string } | null> {
    const craft = window.Craft;
    if (typeof craft?.sendActionRequest !== 'function') return null;
    try {
        const response = await craft.sendActionRequest<{
            uid?: string;
            url?: string | null;
            title?: string;
            alt?: string;
        }>('POST', 'vizy/assets/info', {
            data: { assetId, siteId },
        });
        if (!response.data?.uid) return null;
        return {
            uid: response.data.uid,
            url: response.data.url ?? null,
            title: response.data.title ?? '',
            alt: response.data.alt ?? '',
        };
    } catch (error) {
        console.warn('[vizy] Image select: asset info request failed', error);
        return null;
    }
}

async function generateTransformPreview(assetId: number, handle: string): Promise<string | null> {
    const craft = window.Craft;
    if (!handle || typeof craft?.sendActionRequest !== 'function') return null;
    try {
        const response = await craft.sendActionRequest<{ url?: string }>('POST', 'assets/generate-transform', {
            data: { assetId, handle },
        });
        return response.data.url ?? null;
    } catch {
        return null;
    }
}
