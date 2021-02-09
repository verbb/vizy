<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class Iframe extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'iframe';
    protected $tagName = 'iframe';


    // Public Methods
    // =========================================================================

    public function getTag()
    {
        $attrs = [];

        if (isset($this->node['attrs'])) {
            $attrs = $this->node['attrs'];
        }

        return [
            [
                'tag' => $this->tagName,
                'attrs' => $attrs,
            ],
        ];
    }

}
