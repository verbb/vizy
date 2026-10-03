<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;

class Details extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Details';
    }

    public static function icon(): ?string
    {
        return 'rectangle-list-solid';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function tag(): string|array|null
    {
        return 'details';
    }

    public static function dependencies(): array
    {
        return ['node:detailsSummary', 'node:detailsContent'];
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'details';
    public mixed $tagName = 'details';
}
