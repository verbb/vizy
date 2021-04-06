<?php
namespace verbb\vizy\marks;

use verbb\vizy\base\Mark;

class Link extends Mark
{
    // Properties
    // =========================================================================

    public static $type = 'link';
    public $tagName = 'a';


    // Public Methods
    // =========================================================================

    public function getTag()
    {
        $attrs = [];

        if (isset($this->attrs['target'])) {
            $attrs['target'] = $this->attrs['target'];
        }

        if (isset($this->attrs['rel'])) {
            $attrs['rel'] = $this->attrs['rel'];
        }

        $attrs['href'] = $this->attrs['href'];

        return [
            [
                'tag' => $this->tagName,
                'attrs' => $attrs,
            ],
        ];
    }
}
