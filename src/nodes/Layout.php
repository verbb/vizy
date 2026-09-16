<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

/**
 * Multi-column layout wrapper — deps pull in Column.
 */
class Layout extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Layout';
    }

    public static function icon(): ?string
    {
        return 'layout';
    }

    public static function group(): ?string
    {
        return EditorGroup::Layout;
    }

    public static function tag(): string|array|null
    {
        return 'div';
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        $stack = (string)($attrs['stack'] ?? 'small');

        return [
            'class' => 'vizy-layout',
            'data-stack' => $stack,
            'style' => '--vizy-cols:12',
        ];
    }

    public static function dependencies(): array
    {
        return ['node:column'];
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'layout';
    public mixed $tagName = 'div';

}
