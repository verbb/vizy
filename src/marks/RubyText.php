<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;
use verbb\vizy\base\RenderContext;

use craft\helpers\Html;

class RubyText extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Ruby text';
    }

    public static function icon(): ?string
    {
        return 'language-solid';
    }

    public static function tag(): string|array|null
    {
        return 'ruby';
    }

    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array
    {
        $annotation = trim((string)($attrs['rt'] ?? ''));

        if ($annotation === '') {
            return [];
        }

        return ['rt' => mb_substr($annotation, 0, 200)];
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        return self::normalizeAttrs($attrs, $ctx);
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        $annotation = $resolvedAttrs['rt'] ?? null;

        if (!is_string($annotation) || $annotation === '') {
            return $children;
        }

        return '<ruby><rb>' . $children . '</rb><rt>' . Html::encode($annotation) . '</rt></ruby>';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'rubyText';
    public mixed $tagName = 'ruby';
}
