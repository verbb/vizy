<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class HardBreak extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'hardBreak';
    public $tagName = 'br';

    // Public Methods
    // =========================================================================

    public function selfClosing()
    {
        return true;
    }

}
