<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

/**
 * Layout column — internal schema dependency of Layout.
 */
class Column extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Column';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return 'div';
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        $span = (int)($attrs['span'] ?? 12);
        $span = max(1, min(12, $span));

        return [
            'class' => 'vizy-column',
            'data-span' => (string)$span,
            'style' => "--vizy-col:{$span}",
        ];
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'column';
    public mixed $tagName = 'div';

}
