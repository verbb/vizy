<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;

class BulletList extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Bulleted list';
    }

    public static function icon(): ?string
    {
        return 'bulletList';
    }

    public static function group(): ?string
    {
        return EditorGroup::Lists;
    }

    public static function tag(): string|array|null
    {
        return 'ul';
    }

    public static function dependencies(): array
    {
        return ['node:listItem'];
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'bulletList';
    public mixed $tagName = 'ul';

}
