<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;

class Table extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Table';
    }

    public static function icon(): ?string
    {
        return 'table';
    }

    public static function group(): ?string
    {
        return EditorGroup::Layout;
    }

    public static function tag(): string|array|null
    {
        // Nested tags: outer table + tbody wrapper (attrs apply to both today).
        return ['table', 'tbody'];
    }

    public static function dependencies(): array
    {
        return ['node:tableRow', 'node:tableCell', 'node:tableHeader'];
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'table';
    public mixed $tagName = ['table', 'tbody'];

}
