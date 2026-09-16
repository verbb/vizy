<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class Text extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Text';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return null;
    }

    public static function alwaysEnabled(): bool
    {
        return true;
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'text';

}
