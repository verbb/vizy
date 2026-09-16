<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

/**
 * TipTap vizyBlock type — catalogue only; Block hydrate/render lives on document models.
 */
class VizyBlock extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Block';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        // Render handled by Renderer block path — no HTML tag of its own.
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

    public static ?string $type = 'vizyBlock';

}
