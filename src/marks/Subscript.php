<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Subscript extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Subscript';
    }

    public static function icon(): ?string
    {
        return 'subscript';
    }

    public static function tag(): string|array|null
    {
        return 'sub';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'subscript';
    public mixed $tagName = 'sub';

}
