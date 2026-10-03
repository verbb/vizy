<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class DetailsSummary extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Details summary';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return 'summary';
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'detailsSummary';
    public mixed $tagName = 'summary';
}
