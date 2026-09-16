<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

/**
 * TipTap document root — always on, never a toolbar control.
 */
class Doc extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Document';
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

    public static ?string $type = 'doc';

}
