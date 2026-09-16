<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class TableRow extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Table row';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return 'tr';
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'tableRow';
    public mixed $tagName = 'tr';

}
