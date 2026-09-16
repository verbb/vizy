<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;

class Blockquote extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Quote';
    }

    public static function icon(): ?string
    {
        return 'blockquote';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function tag(): string|array|null
    {
        return 'blockquote';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'blockquote';
    public mixed $tagName = 'blockquote';

}
