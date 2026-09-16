<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class TableHeader extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Table header';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return 'th';
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'tableHeader';
    public mixed $tagName = 'th';

}
