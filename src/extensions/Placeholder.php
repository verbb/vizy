<?php
namespace verbb\vizy\extensions;

use verbb\vizy\base\Extension;

class Placeholder extends Extension
{
    // Static Methods
    // =========================================================================

    public static function id(): string
    {
        return 'placeholder';
    }

    public static function moduleId(): string
    {
        return 'vizy/core/extension/placeholder';
    }

    public static function label(): string
    {
        return 'Placeholder';
    }
}
