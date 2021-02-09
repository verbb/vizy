<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class OrderedList extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'orderedList';
    protected $tagName = 'ol';


    // Public Methods
    // =========================================================================

    public function getTag()
    {
        $attrs = [];

        if (isset($this->node['attrs']['order'])) {
            $attrs['start'] = $this->node['attrs']['order'];
        }

        return [
            [
                'tag' => $this->tagName,
                'attrs' => $attrs,
            ],
        ];
    }
}
