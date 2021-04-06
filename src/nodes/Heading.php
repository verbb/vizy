<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class Heading extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'heading';


    // Public Methods
    // =========================================================================

    public function getTag()
    {
        return "h{$this->attrs['level']}";
    }

}
