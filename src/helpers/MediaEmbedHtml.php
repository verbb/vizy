<?php
namespace verbb\vizy\helpers;

/**
 * Build trusted Media Embed markup from a source URL (YouTube / Vimeo).
 *
 * Mirrors the client `media-providers.ts` helpers so CP preview and front
 * render stay aligned without storing arbitrary oEmbed HTML for new inserts.
 */
final class MediaEmbedHtml
{
    // Static Methods
    // =========================================================================

    public static function resolve(string $rawUrl): ?array
    {
        $url = self::normalizeHttpsUrl($rawUrl);
        if ($url === null) {
            return null;
        }

        if (preg_match('#(?:youtube\.com/(?:watch\?v=|embed/|shorts/)|youtu\.be/)([A-Za-z0-9_-]{6,})#i', $url, $m)) {
            $id = $m[1];
            return [
                'provider' => 'youtube',
                'resourceId' => $id,
                'html' => self::_iframeHtml(
                    'https://www.youtube.com/embed/' . rawurlencode($id),
                    'YouTube video',
                ),
            ];
        }

        if (preg_match('#(?:vimeo\.com/(?:video/)?)(\d+)#i', $url, $m)) {
            $id = $m[1];
            return [
                'provider' => 'vimeo',
                'resourceId' => $id,
                'html' => self::_iframeHtml(
                    'https://player.vimeo.com/video/' . rawurlencode($id),
                    'Vimeo video',
                ),
            ];
        }

        return [
            'provider' => 'unknown',
            'resourceId' => null,
            'html' => null,
        ];
    }

    public static function normalizeHttpsUrl(string $raw): ?string
    {
        $trimmed = trim($raw);
        if ($trimmed === '') {
            return null;
        }
        if (!preg_match('#^https?://#i', $trimmed)) {
            $trimmed = 'https://' . $trimmed;
        }
        $parts = parse_url($trimmed);
        if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return null;
        }
        if (!in_array(strtolower((string)$parts['scheme']), ['http', 'https'], true)) {
            return null;
        }
        $parts['scheme'] = 'https';
        return self::_buildUrl($parts);
    }

    private static function _iframeHtml(string $src, string $title): string
    {
        $src = htmlspecialchars($src, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $title = htmlspecialchars($title, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return '<div class="vizy-media-embed__frame" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">'
            . '<iframe src="' . $src . '" title="' . $title . '" '
            . 'style="position:absolute;inset:0;width:100%;height:100%;border:0;" '
            . 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" '
            . 'allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>'
            . '</div>';
    }

    private static function _buildUrl(array $parts): string
    {
        $url = ($parts['scheme'] ?? 'https') . '://' . ($parts['host'] ?? '');
        if (!empty($parts['port'])) {
            $url .= ':' . $parts['port'];
        }
        $url .= $parts['path'] ?? '';
        if (!empty($parts['query'])) {
            $url .= '?' . $parts['query'];
        }
        if (!empty($parts['fragment'])) {
            $url .= '#' . $parts['fragment'];
        }
        return $url;
    }
}
