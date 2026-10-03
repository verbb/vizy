<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use craft\helpers\Html;

class Emoji extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Emoji';
    }

    public static function icon(): ?string
    {
        return 'face-smile-solid';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function tag(): string|array|null
    {
        return 'span';
    }

    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array
    {
        $name = trim((string)($attrs['name'] ?? ''));
        $emoji = trim((string)($attrs['emoji'] ?? ''));

        if ($name === '' || preg_match('/^[a-z0-9_+-]{1,80}$/', $name) !== 1) {
            return [];
        }

        return array_filter([
            'name' => $name,
            'emoji' => $emoji !== '' ? mb_substr($emoji, 0, 16) : null,
        ], static fn(mixed $value): bool => $value !== null);
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        return self::normalizeAttrs($attrs, $ctx);
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        $name = $resolvedAttrs['name'] ?? null;
        $emoji = $resolvedAttrs['emoji'] ?? null;

        if (!is_string($name) || $name === '') {
            return '';
        }

        return Html::tag('span', Html::encode(is_string($emoji) && $emoji !== '' ? $emoji : ":{$name}:"), [
            'data-type' => 'emoji',
            'data-name' => $name,
        ]);
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'emoji';
    public mixed $tagName = 'span';
}
