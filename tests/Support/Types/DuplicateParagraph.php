<?php
namespace Tests\Support\Types;

use verbb\vizy\base\Node;

/** Duplicate of core paragraph id — fails closed. */
class DuplicateParagraph extends Node
{
    public static ?string $type = 'paragraph';

    public static function moduleId(): string
    {
        return 'project/example';
    }

    public static function tag(): string|array|null
    {
        return 'p';
    }
}
