<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use craft\helpers\Html;

class FootnoteList extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Footnote list';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return 'section';
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        return Html::tag('section', Html::tag('ol', $children), [
            'class' => 'vizy-footnotes',
            'data-type' => 'footnoteList',
            'role' => 'doc-endnotes',
            'aria-label' => 'Footnotes',
        ]);
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'footnoteList';
    public mixed $tagName = 'section';
}
