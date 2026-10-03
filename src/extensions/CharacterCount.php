<?php
namespace verbb\vizy\extensions;

use verbb\vizy\base\Extension;

class CharacterCount extends Extension
{
    // Static Methods
    // =========================================================================

    public static function id(): string
    {
        return 'characterCount';
    }

    public static function moduleId(): string
    {
        return 'vizy/core/extension/characterCount';
    }

    public static function label(): string
    {
        return 'Character count';
    }
}
