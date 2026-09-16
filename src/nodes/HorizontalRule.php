<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;

class HorizontalRule extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Horizontal rule';
    }

    public static function icon(): ?string
    {
        return 'horizontalRule';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function tag(): string|array|null
    {
        return 'hr';
    }

    public static function isSelfClosing(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'horizontalRule';
    public mixed $tagName = 'hr';

}
