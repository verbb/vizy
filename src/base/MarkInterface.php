<?php
namespace verbb\vizy\base;

/**
 * TipTap mark type — registered on RegisterExtensionsEvent::$marks.
 */
interface MarkInterface
{
    // Static Methods
    // =========================================================================

    public static function id(): string;
    public static function moduleId(): string;
    public static function label(): string;
    public static function surfaces(): array;
    public static function icon(): ?string;
    public static function group(): ?string;
    public static function tag(): string|array|null;
    public static function tagForAttrs(array $attrs): string|array|null;
    public static function isSelfClosing(): bool;
    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array;
    public static function resolveAttrs(array $attrs, RenderContext $ctx): array;
    public static function dependencies(): array;
    public static function implies(): array;
    public static function alwaysEnabled(): bool;
    public static function isInternal(): bool;
}
