<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

class TableCell extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'tableCell';
    public $tagName = 'td';
    

    // Public Methods
    // =========================================================================

    public function getTag()
    {
        $attrs = [];

        if (isset($this->attrs)) {
            if (isset($this->attrs['colspan'])) {
                $attrs['colspan'] = $this->attrs['colspan'];
            }

            if (isset($this->attrs['colwidth'])) {
                if ($widths = $this->attrs['colwidth']) {
                    if (count($widths) === $attrs['colspan']) {
                        $attrs['data-colwidth'] = implode(',', $widths);
                    }
                }
            }

            if (isset($this->attrs['rowspan'])) {
                $attrs['rowspan'] = $this->attrs['rowspan'];
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
