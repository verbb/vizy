<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

class Table extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Table';
    }

    public static function icon(): ?string
    {
        return 'table';
    }

    public static function group(): ?string
    {
        return EditorGroup::Layout;
    }

    public static function tag(): string|array|null
    {
        // Nested tags: outer table + tbody wrapper. Attrs apply to the table only.
        return ['table', 'tbody'];
    }

    public static function modifyTagStructure(string|array|null $tag, array $attrs, RenderContext $ctx, bool $opening): array
    {
        $structure = parent::modifyTagStructure($tag, $attrs, $ctx, $opening);

        // Listeners receive the table and its tbody as one row. Render it as two rows so
        // the row's attrs are only added to the table.
        $rows = [];

        foreach ($structure as $row) {
            if (is_array($row) && ($row['tag'] ?? null) === ['table', 'tbody']) {
                $rows[] = ['tag' => 'table', 'attrs' => $row['attrs'] ?? []];
                $rows[] = ['tag' => 'tbody', 'attrs' => []];

                continue;
            }

            $rows[] = $row;
        }

        return $rows;
    }

    public static function dependencies(): array
    {
        return ['node:tableRow', 'node:tableCell', 'node:tableHeader'];
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'table';
    public mixed $tagName = ['table', 'tbody'];

}
