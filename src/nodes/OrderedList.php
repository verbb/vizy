<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;

class OrderedList extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Numbered list';
    }

    public static function icon(): ?string
    {
        return 'orderedList';
    }

    public static function group(): ?string
    {
        return EditorGroup::Lists;
    }

    public static function tag(): string|array|null
    {
        return 'ol';
    }

    public static function dependencies(): array
    {
        return ['node:listItem'];
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'orderedList';
    public mixed $tagName = 'ol';

}
