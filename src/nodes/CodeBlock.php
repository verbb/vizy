<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\Node;

class CodeBlock extends Node
{
    // Static Methods
    // =========================================================================

    public static function label(): string
    {
        return 'Code block';
    }

    public static function icon(): ?string
    {
        return 'codeBlock';
    }

    public static function group(): ?string
    {
        return EditorGroup::Text;
    }

    public static function tag(): string|array|null
    {
        return ['pre', 'code'];
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'codeBlock';
    public mixed $tagName = ['pre', 'code'];

}
