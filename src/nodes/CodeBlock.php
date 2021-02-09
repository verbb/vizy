<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class CodeBlock extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'codeBlock';
    protected $tagName = ['pre', 'code'];

}
