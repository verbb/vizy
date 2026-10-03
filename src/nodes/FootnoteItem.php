<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use craft\helpers\Html;

class FootnoteItem extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Footnote item';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return 'li';
    }

    public static function normalizeAttrs(array $attrs, RenderContext $ctx): array
    {
        return FootnoteReference::normalizeAttrs([
            'footnoteUid' => $attrs['footnoteUid'] ?? null,
        ], $ctx);
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
        // Avoid Html::a() here for the same reason as the reference: a fragment is part of the
        // rendered document contract, not a URL tied to the request that happened to render it.
        $backlink = Html::tag('a', '↩', [
            'href' => '#fnref-' . $uid,
            'class' => 'vizy-footnote-backref',
            'data-footnote-backref' => true,
            'role' => 'doc-backlink',
            'aria-label' => $number === null ? 'Back to content' : "Back to footnote reference {$number}",
        ]);

        return Html::tag('li', Html::tag('div', $children, [
            'data-footnote-content' => true,
        ]) . $backlink, [
            'id' => 'fn-' . $uid,
            'data-type' => 'footnoteItem',
            'data-footnote-uid' => $uid,
            'role' => 'doc-endnote',
        ]);
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'footnoteItem';
    public mixed $tagName = 'li';
}
