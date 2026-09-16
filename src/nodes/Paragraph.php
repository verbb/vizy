<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use craft\helpers\ArrayHelper;

class Paragraph extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Paragraph';
    }

    public static function icon(): ?string
    {
        return 'paragraph';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function tag(): string|array|null
    {
        return 'p';
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        $align = ArrayHelper::remove($attrs, 'textAlign');

        // TipTap textAlign → utility class (text-left, text-center, …); skip default "start".
        if ($align && $align !== 'start') {
            $attrs['class'] = trim(($attrs['class'] ?? '') . ' text-' . $align);
        }

        return $attrs;
    }

    public static function alwaysEnabled(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'paragraph';
    public mixed $tagName = 'p';

}
