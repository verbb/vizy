<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class HardBreak extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'hardBreak';
    protected $tagName = 'br';

    // Public Methods
    // =========================================================================

    public function selfClosing()
    {
        return true;
    }

}
