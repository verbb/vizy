<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Node;

class HardBreak extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Line break';
    }

    public static function icon(): ?string
    {
        return 'hardBreak';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function tag(): string|array|null
    {
        return 'br';
    }

    public static function isSelfClosing(): bool
    {
        return true;
    }

    public static function alwaysEnabled(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'hardBreak';
    public mixed $tagName = 'br';

}
