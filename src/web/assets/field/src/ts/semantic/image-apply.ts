import type { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import {
    linkDisplayHref,
    type ImageSize,
    type SemanticImageAttrs,
    type SemanticLinkAttrs,
    normalizeSemanticLinkAttrs,
} from './attrs';
import { attrsFromUrlDialog } from './link-apply';
import { bumpImagePreviewUrl, getImagePreview, rememberImagePreview } from './image-preview-cache';

export type ImageDialogSeed = {
    assetUid: string;
    assetId: number;
    previewUrl: string;
    alt: string;
    title: string;
    linkUrl: string;
    openInNewTab: boolean;
    size: ImageSize;
    /** Craft transform handle for preview URL generation only — not canonical. */
    transform: string;
    updating: boolean;
    /** Original semantic values survive edits to unrelated visible controls. */
    originalAttrs?: SemanticImageAttrs;
};

export const IMAGE_SIZE_OPTIONS: Array<{ value: ImageSize; label: string }> = [
    { value: 'default', label: 'Default' },
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'full', label: 'Full' },
];

export function selectedImageAttrs(editor: Editor): SemanticImageAttrs | null {
    if (!editor.isActive('image')) return null;
    const raw = editor.getAttributes('image') as Record<string, unknown>;
    return normalizeImageDialogAttrs(raw);
}

export function seedImageDialogFromSelection(editor: Editor): ImageDialogSeed | null {
    const attrs = selectedImageAttrs(editor);
    if (!attrs) return null;
    const preview = getImagePreview(attrs.assetUid);
    const link = attrs.link;
    return {
        assetUid: attrs.assetUid,
        assetId: preview?.assetId ?? 0,
        previewUrl: preview?.url ?? '',
        alt: attrs.alt ?? '',
        title: attrs.title ?? '',
        linkUrl: link ? linkDisplayHref(link) : '',
        openInNewTab: link?.newWindow ?? false,
        size: attrs.size,
        transform: preview?.transform ?? '',
        updating: true,
        originalAttrs: attrs,
    };
}

export function applySemanticImageToEditor(
    editor: Editor,
    params: {
        attrs: SemanticImageAttrs;
        preview: { assetId: number; url: string; label: string; transform: string };
        focus?: boolean;
        replaceSelection?: boolean;
    },
): boolean {
    rememberImagePreview(params.attrs.assetUid, {
        assetId: params.preview.assetId,
        url: params.preview.url,
        label: params.preview.label,
        transform: params.preview.transform,
    });

    const focus = params.focus ?? true;
    const chain = focus ? editor.chain().focus() : editor.chain();

    if (params.replaceSelection && editor.isActive('image')) {
        return chain.updateAttributes('image', params.attrs).run();
    }
    return chain.setSemanticImage(params.attrs).run();
}

export function deleteSelectedImage(editor: Editor, options?: { focus?: boolean }): void {
    const focus = options?.focus ?? true;
    const chain = focus ? editor.chain().focus() : editor.chain();
    if (editor.state.selection instanceof NodeSelection
        && editor.state.selection.node.type.name === 'image') {
        chain.deleteSelection().run();
        return;
    }
    if (editor.isActive('image')) {
        // Expand to the node then delete.
        const pos = editor.state.selection.$from.before(editor.state.selection.$from.depth);
        const node = editor.state.doc.nodeAt(pos);
        if (node?.type.name === 'image') {
            chain.setNodeSelection(pos).deleteSelection().run();
        }
    }
}

export function attrsFromImageDialog(seed: ImageDialogSeed): SemanticImageAttrs {
    const alt = seed.alt.trim();
    const title = seed.title.trim();
    const linkUrl = seed.linkUrl.trim();
    const original = seed.originalAttrs;
    const originalLink = original?.link;
    const originalUrl = originalLink ? linkDisplayHref(originalLink) : '';
    const link = originalLink && linkUrl === originalUrl
        ? { ...originalLink, newWindow: seed.openInNewTab }
        : (linkUrl ? attrsFromUrlDialog(linkUrl, seed.openInNewTab) : null);
    const altUnchanged = original && seed.alt === (original.alt ?? '');

    return {
        assetUid: seed.assetUid,
        siteMode: original?.siteMode ?? 'current',
        siteUid: original?.siteUid ?? null,
        altMode: altUnchanged ? original.altMode : (alt ? 'custom' : 'asset'),
        alt: altUnchanged ? original.alt : (alt || null),
        title: title || null,
        size: seed.size,
        link,
        imageUid: original?.imageUid ?? null,
    };
}

export function normalizeImageDialogAttrs(raw: Record<string, unknown>): SemanticImageAttrs | null {
    const assetUid = typeof raw.assetUid === 'string' ? raw.assetUid : '';
    if (!assetUid) return null;
    const size = ['default', 'small', 'medium', 'large', 'full'].includes(String(raw.size))
        ? raw.size as ImageSize
        : 'default';
    const altMode = ['asset', 'custom', 'decorative', 'missing'].includes(String(raw.altMode))
        ? raw.altMode as SemanticImageAttrs['altMode']
        : 'asset';
    let link: SemanticLinkAttrs | null = null;
    if (raw.link && typeof raw.link === 'object') {
        const L = raw.link as Record<string, unknown>;
        link = normalizeSemanticLinkAttrs(L);
    }
    return {
        assetUid,
        siteMode: raw.siteMode === 'fixed' ? 'fixed' : 'current',
        siteUid: typeof raw.siteUid === 'string' ? raw.siteUid : null,
        altMode,
        alt: typeof raw.alt === 'string' ? raw.alt : null,
        title: typeof raw.title === 'string' ? raw.title : null,
        size,
        link,
        imageUid: typeof raw.imageUid === 'string' ? raw.imageUid : null,
    };
}

/** Ask Craft for a current original or transformed preview URL. */
export function generateTransformUrl(
    assetId: number,
    handle: string,
): Promise<string | null> {
    if (!assetId) return Promise.resolve(null);
    const craft = window.Craft;
    if (typeof craft?.sendActionRequest !== 'function') return Promise.resolve(null);
    return craft.sendActionRequest<{ url?: string }>('POST', handle ? 'assets/generate-transform' : 'vizy/assets/info', {
        data: { assetId, handle },
    }).then((response) => response.data.url ?? null).catch(() => null);
}


/** Obtain a fresh provider URL before refreshing an image edited in Craft. */
export async function refreshImagePreview(assetUid: string): Promise<string | null> {
    const preview = getImagePreview(assetUid);
    if (!preview) return null;
    const url = await generateTransformUrl(preview.assetId, preview.transform);
    // Another editor may have refreshed this asset while the request was pending.
    if (!url || getImagePreview(assetUid) !== preview) return null;
    rememberImagePreview(assetUid, { ...preview, url });
    return bumpImagePreviewUrl(assetUid);
}
