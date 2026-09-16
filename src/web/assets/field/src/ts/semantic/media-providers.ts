/**
 * Trusted media-provider helpers for Media Embed authoring + front render.
 *
 * Canonical JSON stores the source `url` (and optional oEmbed-shaped `data`).
 * Known providers get a sandboxed iframe preview without a client oEmbed fetch.
 */

export type MediaProviderId = 'youtube' | 'vimeo' | 'unknown';

export type ResolvedMediaEmbed = {
    provider: MediaProviderId;
    url: string;
    /** Safe iframe markup for CP preview / PHP render when provider is known. */
    html: string | null;
    resourceId: string | null;
};

const YOUTUBE_RE =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;
const VIMEO_RE = /(?:vimeo\.com\/(?:video\/)?)(\d+)/i;

export function normalizeHttpsUrl(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    try {
        const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const parsed = new URL(withScheme);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
        // Prefer https for embeds.
        if (parsed.protocol === 'http:') parsed.protocol = 'https:';
        return parsed.toString();
    } catch {
        return null;
    }
}

export function resolveMediaEmbed(rawUrl: string): ResolvedMediaEmbed | null {
    const url = normalizeHttpsUrl(rawUrl);
    if (!url) return null;

    const yt = url.match(YOUTUBE_RE);
    if (yt?.[1]) {
        const id = yt[1];
        return {
            provider: 'youtube',
            url,
            resourceId: id,
            html: iframeHtml(`https://www.youtube.com/embed/${encodeURIComponent(id)}`, 'YouTube video'),
        };
    }

    const vimeo = url.match(VIMEO_RE);
    if (vimeo?.[1]) {
        const id = vimeo[1];
        return {
            provider: 'vimeo',
            url,
            resourceId: id,
            html: iframeHtml(`https://player.vimeo.com/video/${encodeURIComponent(id)}`, 'Vimeo video'),
        };
    }

    return { provider: 'unknown', url, resourceId: null, html: null };
}

function iframeHtml(src: string, title: string): string {
    return (
        `<div class="vizy-media-embed__frame" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">`
        + `<iframe src="${src}" title="${escapeAttr(title)}" `
        + `style="position:absolute;inset:0;width:100%;height:100%;border:0;" `
        + `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" `
        + `allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>`
        + `</div>`
    );
}

function escapeAttr(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
