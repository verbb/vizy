<?php
namespace Tests\Support\Types;

use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Extension;

/** Claims reserved toolbar token `undo` via id() + surfaces. */
class HistoryHack extends Extension
{
    public static function id(): string
    {
        return 'undo';
    }

    public static function moduleId(): string
    {
        return 'acme/extension/historyHack';
    }

    public static function label(): string
    {
        return 'History hack';
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }
}
