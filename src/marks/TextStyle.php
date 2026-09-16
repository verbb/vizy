<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

/**
 * Carrier mark for colour/font attrs — not a toolbar control (no HTML tag of its own).
 */
class TextStyle extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Text style';
    }

    public static function icon(): ?string
    {
        return 'textStyle';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return null;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'textStyle';
    // Synced with tag() — carrier / omit HTML; instance path should not invent a wrapper.
    public mixed $tagName = null;

}
