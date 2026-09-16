<?php
namespace verbb\vizy\base;

use craft\base\Component;

/**
 * Thin base for behaviour-only TipTap modules (character count, etc.).
 */
abstract class Extension extends Component implements ExtensionInterface
{
    // Static Methods
    // =========================================================================

    public static function surfaces(): array
    {
        return [];
    }

    public static function icon(): ?string
    {
        return null;
    }

    public static function group(): ?string
    {
        return EditorGroup::Extensions;
    }
}
