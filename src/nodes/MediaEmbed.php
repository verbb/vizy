<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;
use verbb\vizy\helpers\MediaEmbedHtml;
use verbb\vizy\helpers\SafeHtml;

use craft\helpers\Html;

class MediaEmbed extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Media embed';
    }

    public static function icon(): ?string
    {
        return 'mediaEmbed';
    }

    public static function group(): ?string
    {
        return EditorGroup::Media;
    }

    public static function tag(): string|array|null
    {
        return null;
    }

    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array
    {
        // Decode HTML entities that may arrive from older oEmbed payloads.
        $html = $attrs['data']['html'] ?? null;
        if (is_string($html) && $html !== '') {
            $attrs['data']['html'] = Html::decode($html);
        }

        return $attrs;
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        $url = $resolvedAttrs['url'] ?? null;
        $storedHtml = $resolvedAttrs['data']['html'] ?? null;
        $storedHtml = is_string($storedHtml) && $storedHtml !== '' ? $storedHtml : null;

        // Known providers: rebuild trusted shells from URL (ignore stored oEmbed HTML).
        if (is_string($url) && $url !== '') {
            $resolved = MediaEmbedHtml::resolve($url);
            if ($resolved !== null && is_string($resolved['html'] ?? null) && $resolved['html'] !== '') {
                return $resolved['html'];
            }
        }

        // Migrated / unknown-provider oEmbed HTML — Craft HtmlPurifier (SafeIframe), never raw.
        if ($storedHtml !== null) {
            $clean = SafeHtml::purifyEmbedHtml($storedHtml);
            if ($clean !== '') {
                return $clean;
            }
        }

        // Last resort: encoded link when we have a safe http(s) URL.
        if (is_string($url) && $url !== '') {
            $safeHref = SafeHtml::sanitizeUri($url, SafeHtml::RESOURCE_SCHEMES);
            if ($safeHref !== null) {
                return Html::tag('p', Html::a($safeHref, $safeHref, [
                    'rel' => 'noopener noreferrer',
                ]), ['class' => 'vizy-media-embed-link']);
            }
        }

        return '';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'mediaEmbed';

}
