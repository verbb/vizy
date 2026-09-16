<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Bold extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Bold';
    }

    public static function icon(): ?string
    {
        return 'bold';
    }

    public static function tag(): string|array|null
    {
        return 'strong';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'bold';
    public mixed $tagName = 'strong';

}
