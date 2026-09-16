<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Strike extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Strikethrough';
    }

    public static function icon(): ?string
    {
        return 'strike';
    }

    public static function tag(): string|array|null
    {
        return 's';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'strike';
    public mixed $tagName = 's';

}
