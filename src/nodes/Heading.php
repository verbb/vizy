<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class Heading extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'heading';


    // Public Methods
    // =========================================================================

    public function getTag()
    {
        return "h{$this->node['attrs']['level']}";
    }

}
