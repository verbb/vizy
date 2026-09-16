<?php
namespace modules\vizyabbr;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Mark;

/**
 * Sample Abbreviation mark — register via RegisterExtensionsEvent::$marks.
 */
class Abbr extends Mark
{
    public static ?string $type = 'abbr';

    public static function moduleId(): string
    {
        return 'acme/mark/abbr';
    }

    public static function label(): string
    {
        return 'Abbreviation';
    }

    public static function icon(): ?string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"><text x="1" y="12" font-size="10" font-family="system-ui,sans-serif">Ab</text></svg>';
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar, EditorSurface::Bubble];
    }

    public static function group(): ?string
    {
        return EditorGroup::Marks;
    }

    public static function tag(): string|array|null
    {
        return 'abbr';
    }
}
