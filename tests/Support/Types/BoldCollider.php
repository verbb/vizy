<?php
namespace Tests\Support\Types;

use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Mark;

/** Same id as core bold — duplicate capability key. */
class BoldCollider extends Mark
{
    public static ?string $type = 'bold';

    public static function moduleId(): string
    {
        return 'acme/mark/boldCollider';
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function tag(): string|array|null
    {
        return 'strong';
    }
}
