<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class ListItem extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'List item';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return 'li';
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'listItem';
    public mixed $tagName = 'li';

}
