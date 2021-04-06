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
        if (isset($this->attrs['target'])) {
            if ($this->attrs['target'] === '_blank') {
                $this->attrs['rel'] = 'noopener noreferrer nofollow';
            }
        }
        return parent::getTag();
    }
}
