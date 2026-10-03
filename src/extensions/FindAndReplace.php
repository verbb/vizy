<?php
namespace verbb\vizy\extensions;

use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Extension;

class FindAndReplace extends Extension
{
    // Static Methods
    // =========================================================================

    public static function id(): string
    {
        return 'findAndReplace';
    }

    public static function moduleId(): string
    {
        return 'vizy/core/extension/findAndReplace';
    }

    public static function label(): string
    {
        return 'Find and replace';
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function icon(): ?string
    {
        return 'magnifying-glass-solid';
    }
}
