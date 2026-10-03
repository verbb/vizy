<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

class DetailsContent extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Details content';
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
        return ['data-type' => 'detailsContent'];
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'detailsContent';
    public mixed $tagName = 'div';
}
