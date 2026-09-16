<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Highlight extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Highlight';
    }

    public static function icon(): ?string
    {
        return 'highlight';
    }

    public static function tag(): string|array|null
    {
        return 'mark';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'highlight';
    public mixed $tagName = 'mark';

}
