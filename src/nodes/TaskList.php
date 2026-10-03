<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

class TaskList extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Task list';
    }

    public static function icon(): ?string
    {
        return 'list-check-solid';
    }

    public static function group(): ?string
    {
        return EditorGroup::Lists;
    }

    public static function tag(): string|array|null
    {
        return 'ul';
    }

    public static function dependencies(): array
    {
        return ['node:taskItem'];
    }

    public static function resolveAttrs(array $attrs, RenderContext $ctx): array
    {
        return ['data-type' => 'taskList'];
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'taskList';
    public mixed $tagName = 'ul';
}
