<?php
namespace Tests\Support\Types;

use verbb\vizy\base\Extension;

/** Behaviour extension with no chrome. */
class SilentHelper extends Extension
{
    public static function id(): string
    {
        return 'silentHelper';
    }

    public static function moduleId(): string
    {
        return 'acme/extension/silentHelper';
    }

    public static function label(): string
    {
        return 'Silent helper';
    }
}
