<?php
namespace Tests\Support\Types;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Node;

class Emoji extends Node
{
    public static ?string $type = 'emoji';

    public static function moduleId(): string
    {
        return 'acme/node/emoji';
    }

    public static function label(): string
    {
        return 'Emoji';
    }

    public static function icon(): ?string
    {
        return 'face-smile-solid';
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function group(): ?string
    {
        return EditorGroup::Media;
    }

    public static function tag(): string|array|null
    {
        return 'span';
    }
}
