<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\RenderContext;

/**
 * Semantic mark for Vizy-owned text colour and typography controls.
 */
class TextStyle extends Mark
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Text style';
    }

    public static function icon(): ?string
    {
        return 'textStyle';
    }

    public static function surfaces(): array
    {
        // TextStyle is one schema capability with four value menus. Those
        // menus belong in the standing toolbar; the compact Bubble Menu only
        // supports immediate actions, not nested value pickers.
        return [EditorSurface::Toolbar];
    }

    public static function tag(): string|array|null
    {
        return 'span';
    }

    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array
    {
        $normalized = [];

        foreach (self::ATTRIBUTE_PROPERTIES as $attribute => $property) {
            $value = self::normalizeValue($attribute, $attrs[$attribute] ?? null);

            if ($value !== null) {
                $normalized[$attribute] = $value;
            }
        }

        return $normalized;
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        $attrs = self::normalizeAttrs($attrs, $ctx);
        $style = [];

        foreach (self::ATTRIBUTE_PROPERTIES as $attribute => $property) {
            if (isset($attrs[$attribute])) {
                $style[] = "{$property}: {$attrs[$attribute]}";
            }
        }

        return $style === [] ? [] : ['style' => implode('; ', $style)];
    }

    /**
     * Convert the safe subset of an inline style declaration into canonical mark attrs.
     */
    public static function attrsFromStyle(string $style): array
    {
        $byProperty = array_flip(self::ATTRIBUTE_PROPERTIES);
        $attrs = [];

        foreach (explode(';', $style) as $declaration) {
            if (!str_contains($declaration, ':')) {
                continue;
            }
            [$property, $value] = array_map('trim', explode(':', $declaration, 2));
            $attribute = $byProperty[strtolower($property)] ?? null;

            if ($attribute === null) {
                continue;
            }
            $normalized = self::normalizeValue($attribute, $value);

            if ($normalized !== null) {
                $attrs[$attribute] = $normalized;
            }
        }

        return $attrs;
    }

    public static function hasUnsupportedStyle(string $style): bool
    {
        $byProperty = array_flip(self::ATTRIBUTE_PROPERTIES);

        foreach (explode(';', $style) as $declaration) {
            $declaration = trim($declaration);

            if ($declaration === '') {
                continue;
            }

            if (!str_contains($declaration, ':')) {
                return true;
            }
            [$property, $value] = array_map('trim', explode(':', $declaration, 2));
            $attribute = $byProperty[strtolower($property)] ?? null;

            if ($attribute === null || self::normalizeValue($attribute, $value) === null) {
                return true;
            }
        }

        return false;
    }

    public static function normalizeValue(string $attribute, mixed $value): ?string
    {
        if (!is_string($value)) {
            return null;
        }
        $value = trim($value);

        if ($value === '') {
            return null;
        }

        return match ($attribute) {
            'color', 'backgroundColor' => preg_match('/^#[0-9a-f]{6}$/i', $value) === 1 ? strtolower($value) : null,
            'fontFamily' => in_array($value, self::FONT_FAMILIES, true) ? $value : null,
            'fontSize' => in_array($value, self::FONT_SIZES, true) ? $value : null,
            'lineHeight' => in_array($value, self::LINE_HEIGHTS, true) ? $value : null,
            default => null,
        };
    }


    // Constants
    // =========================================================================

    public const FONT_FAMILIES = [
        'Arial, sans-serif',
        'Georgia, serif',
        '"Times New Roman", serif',
        '"Courier New", monospace',
    ];

    public const FONT_SIZES = [
        '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px',
        '24px', '30px', '36px', '48px', '60px', '72px', '96px',
    ];
    public const LINE_HEIGHTS = ['1', '1.15', '1.5', '2'];

    private const ATTRIBUTE_PROPERTIES = [
        'color' => 'color',
        'backgroundColor' => 'background-color',
        'fontFamily' => 'font-family',
        'fontSize' => 'font-size',
        'lineHeight' => 'line-height',
    ];


    // Properties
    // =========================================================================

    public static ?string $type = 'textStyle';
    public mixed $tagName = 'span';

}
