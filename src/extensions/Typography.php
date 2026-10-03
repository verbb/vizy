<?php
namespace verbb\vizy\extensions;

use verbb\vizy\base\Extension;

class Typography extends Extension
{
    // Static Methods
    // =========================================================================

    public static function id(): string
    {
        return 'typography';
    }

    public static function moduleId(): string
    {
        return 'vizy/core/extension/typography';
    }

    public static function label(): string
    {
        return 'Typography';
    }
}
