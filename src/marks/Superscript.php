<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Superscript extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Superscript';
    }

    public static function icon(): ?string
    {
        return 'superscript';
    }

    public static function tag(): string|array|null
    {
        return 'sup';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'superscript';
    public mixed $tagName = 'sup';

}
