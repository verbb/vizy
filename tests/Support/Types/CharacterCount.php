<?php
namespace Tests\Support\Types;

use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Extension;

class CharacterCount extends Extension
{
    public static function id(): string
    {
        return 'partnerCounter';
    }

    public static function moduleId(): string
    {
        return 'acme/extension/partnerCounter';
    }

    public static function label(): string
    {
        return 'Partner counter';
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function icon(): ?string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/></svg>';
    }
}
