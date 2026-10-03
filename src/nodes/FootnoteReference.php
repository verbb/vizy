<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use craft\helpers\Html;

class FootnoteReference extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Footnote';
    }

    public static function icon(): ?string
    {
        return 'asterisk-solid';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function tag(): string|array|null
    {
        return 'sup';
    }

    public static function dependencies(): array
    {
        return ['node:footnoteItem', 'node:footnoteList'];
    }

    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array
    {
        $uid = strtolower(trim((string)($attrs['footnoteUid'] ?? '')));
        $fallbackText = trim((string)($attrs['fallbackText'] ?? ''));

        if (preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/', $uid) !== 1) {
            return [];
        }

        return array_filter([
            'footnoteUid' => $uid,
            'fallbackText' => $fallbackText !== '' ? mb_substr($fallbackText, 0, 5000) : null,
        ], static fn(mixed $value): bool => $value !== null);
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        return self::normalizeAttrs($attrs, $ctx);
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        $uid = $resolvedAttrs['footnoteUid'] ?? null;

        if (!is_string($uid) || $uid === '') {
            return '';
        }
        $number = $ctx->footnoteNumber($uid);

        if ($number === null) {
            return '';
        }

        // Craft's Html::a() resolves fragment-only URLs against the current request URL. Keep
        // footnote links document-relative so rendered content remains portable between routes.
        return Html::tag('sup', Html::tag('a', (string)$number, [
            'href' => '#fn-' . $uid,
            'id' => 'fnref-' . $uid,
            'role' => 'doc-noteref',
            'aria-label' => "Footnote {$number}",
        ]), [
            'class' => 'vizy-footnote-reference',
            'data-type' => 'footnoteReference',
            'data-footnote-uid' => $uid,
            'data-footnote-text' => $resolvedAttrs['fallbackText'] ?? null,
        ]);
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'footnoteReference';
    public mixed $tagName = 'sup';
}
