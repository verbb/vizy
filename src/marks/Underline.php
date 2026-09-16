<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Underline extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Underline';
    }

    public static function icon(): ?string
    {
        return 'underline';
    }

    public static function tag(): string|array|null
    {
        return 'u';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'underline';
    public mixed $tagName = 'u';

}
