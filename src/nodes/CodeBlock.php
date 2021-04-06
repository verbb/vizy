<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class CodeBlock extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'codeBlock';
    public $tagName = ['pre', 'code'];

}
