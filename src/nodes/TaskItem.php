<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

use craft\helpers\Html;

class TaskItem extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Task item';
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
        return ['checked' => filter_var($attrs['checked'] ?? false, FILTER_VALIDATE_BOOL)];
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        return self::normalizeAttrs($attrs, $ctx);
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        $checked = (bool)($resolvedAttrs['checked'] ?? false);
        $input = Html::tag('input', '', array_filter([
            'type' => 'checkbox',
            'checked' => $checked,
            'disabled' => true,
            'aria-label' => $checked ? 'Completed task' : 'Incomplete task',
        ], static fn(mixed $value): bool => $value !== false));

        return Html::beginTag('li', [
            'data-type' => 'taskItem',
            'data-checked' => $checked ? 'true' : 'false',
        ]) . Html::tag('label', $input) . Html::tag('div', $children) . Html::endTag('li');
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'taskItem';
    public mixed $tagName = 'li';
}
