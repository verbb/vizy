<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class HorizontalRule extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'horizontal_rule';
    protected $tagName = 'hr';


    // Public Methods
    // =========================================================================

    public function selfClosing()
    {
        return true;
    }
}
