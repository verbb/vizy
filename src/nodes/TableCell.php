<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

class TableCell extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Table cell';
    }

    public static function surfaces(): array
    {
        return [];
    }

    public static function tag(): string|array|null
    {
        return 'td';
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        $resolved = [];

        if (isset($attrs['colspan'])) {
            $resolved['colspan'] = $attrs['colspan'];
        }

        if (isset($attrs['colwidth']) && $widths = $attrs['colwidth']) {
            if (is_array($widths) && isset($resolved['colspan']) && count($widths) === $resolved['colspan']) {
                $resolved['data-colwidth'] = implode(',', $widths);
            }
        }

        if (isset($attrs['rowspan'])) {
            $resolved['rowspan'] = $attrs['rowspan'];
        }

        return $resolved;
    }

    public static function isInternal(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'tableCell';
    public mixed $tagName = 'td';

}
