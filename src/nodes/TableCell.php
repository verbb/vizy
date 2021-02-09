<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class TableCell extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'tableCell';
    protected $tagName = 'td';
    

    // Public Methods
    // =========================================================================

    public function getTag()
    {
        $attrs = [];

        if (isset($this->node['attrs'])) {
            if (isset($this->node['attrs']['colspan'])) {
                $attrs['colspan'] = $this->node['attrs']['colspan'];
            }

            if (isset($this->node['attrs']['colwidth'])) {
                if ($widths = $this->node['attrs']['colwidth']) {
                    if (count($widths) === $attrs['colspan']) {
                        $attrs['data-colwidth'] = implode(',', $widths);
                    }
                }
            }

            if (isset($this->node['attrs']['rowspan'])) {
                $attrs['rowspan'] = $this->node['attrs']['rowspan'];
            }
        }

        return [
            [
                'tag' => $this->tagName,
                'attrs' => $attrs,
            ],
        ];
    }

}
