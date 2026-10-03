<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use craft\helpers\Html;

class CodeBlock extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Code block';
    }

    public static function icon(): ?string
    {
        return 'codeBlock';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function tag(): string|array|null
    {
        return ['pre', 'code'];
    }

    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array
    {
        $language = strtolower(trim((string)($attrs['language'] ?? '')));

        return preg_match('/^[a-z0-9][a-z0-9_+-]{0,31}$/', $language) === 1
            ? ['language' => $language]
            : [];
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        return self::normalizeAttrs($attrs, $ctx);
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        $language = $resolvedAttrs['language'] ?? null;
        $codeAttrs = is_string($language) && $language !== '' ? ['class' => 'language-' . $language] : [];

        return Html::tag('pre', Html::tag('code', $children, $codeAttrs));
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'codeBlock';
    public mixed $tagName = ['pre', 'code'];

}
