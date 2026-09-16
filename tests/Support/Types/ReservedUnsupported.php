<?php
namespace Tests\Support\Types;

use verbb\vizy\base\Node;

/** Reserved transport type name. */
class ReservedUnsupported extends Node
{
    public static ?string $type = 'unsupportedNode';

    public static function moduleId(): string
    {
        return 'project/example';
    }

    public static function tag(): string|array|null
    {
        return null;
    }
}
