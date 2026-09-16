<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Italic extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Italic';
    }

    public static function icon(): ?string
    {
        return 'italic';
    }

    public static function tag(): string|array|null
    {
        return 'em';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'italic';
    public mixed $tagName = 'em';

}
