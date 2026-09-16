<?php
namespace verbb\vizy\base;

/**
 * Behaviour-only TipTap module (no persisted document type, no HTML contract).
 */
interface ExtensionInterface
{
    // Static Methods
    // =========================================================================

    public static function id(): string;
    public static function moduleId(): string;
    public static function label(): string;
    public static function surfaces(): array;
    public static function icon(): ?string;
    public static function group(): ?string;
}
