<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Link extends Mark
{
    // Properties
    // =========================================================================

    protected $type = 'link';
    protected $tagName = 'a';


    // Public Methods
    // =========================================================================

    public function getTag()
    {
        $attrs = [];

        if (isset($this->mark['attrs']['target'])) {
            $attrs['target'] = $this->mark['attrs']['target'];
        }

        if (isset($this->mark['attrs']['rel'])) {
            $attrs['rel'] = $this->mark['attrs']['rel'];
        }

        $attrs['href'] = $this->mark['attrs']['href'];

        return [
            [
                'tag' => $this->tagName,
                'attrs' => $attrs,
            ],
        ];
    }
}
