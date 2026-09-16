<?php
namespace Tests\Support\Types;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Mark;

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
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1 1h14v14H1z"/></svg>';
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
