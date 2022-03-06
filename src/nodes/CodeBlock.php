<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class CodeBlock extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'codeBlock';
    public mixed $tagName = ['pre', 'code'];

}
