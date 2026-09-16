<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Code extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Inline code';
    }

    public static function icon(): ?string
    {
        return 'code';
    }

    public static function tag(): string|array|null
    {
        return 'code';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'code';
    public mixed $tagName = 'code';

}
