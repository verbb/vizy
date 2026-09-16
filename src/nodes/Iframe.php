<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;
use verbb\vizy\helpers\SafeHtml;

use craft\helpers\ArrayHelper;

class Iframe extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Iframe';
    }

    public static function icon(): ?string
    {
        return 'iframe';
    }

    public static function group(): ?string
    {
        return EditorGroup::Media;
    }

    public static function tag(): string|array|null
    {
        return 'iframe';
    }

    public static function tagForAttrs(array $attrs): string|array|null
    {
        $src = $attrs['src'] ?? null;
        if (!is_string($src) || $src === '') {
            return null;
        }

        return parent::tagForAttrs($attrs);
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        // Authoring stores `url`; HTML needs `src`.
        $src = ArrayHelper::remove($attrs, 'url') ?? ($attrs['src'] ?? null);
        ArrayHelper::remove($attrs, 'src');

        $safe = is_string($src) && $src !== ''
            ? SafeHtml::sanitizeUri($src, SafeHtml::RESOURCE_SCHEMES)
            : null;

        // Allowlist iframe HTML attrs only — drop anything else from storage.
        $out = [];
        if ($safe !== null) {
            $out['src'] = $safe;
        }

        foreach (['width', 'height', 'title', 'loading', 'referrerpolicy', 'allow', 'class'] as $key) {
            if (isset($attrs[$key]) && (is_string($attrs[$key]) || is_numeric($attrs[$key]))) {
                $out[$key] = $attrs[$key];
            }
        }

        if (array_key_exists('frameborder', $attrs)) {
            $out['frameborder'] = $attrs['frameborder'];
        }
        if (!empty($attrs['allowfullscreen'])) {
            $out['allowfullscreen'] = true;
        }

        // Sensible defaults when authors omitted them.
        $out['loading'] ??= 'lazy';
        $out['referrerpolicy'] ??= 'strict-origin-when-cross-origin';

        return $out;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'iframe';
    public mixed $tagName = 'iframe';

}
