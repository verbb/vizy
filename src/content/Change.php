<?php
namespace verbb\vizy\content;

/** Explicit raw field mutation results, interoperable across container adapters. */
final class Change
{
    // Static Methods
    // =========================================================================

    public static function unchanged(): array
    {
        return ['action' => 'unchanged'];
    }

    public static function replace(mixed $value): array
    {
        return ['action' => 'replace', 'value' => $value];
    }

    public static function remove(): array
    {
        return ['action' => 'remove'];
    }
}
