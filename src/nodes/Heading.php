<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

use craft\helpers\ArrayHelper;

class Heading extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'heading';


    // Public Methods
    // =========================================================================

    public function getTag()
    {
        // Don't include certain attributes in rendering
        $level = ArrayHelper::remove($this->attrs, 'level');
        $align = ArrayHelper::remove($this->attrs, 'textAlign');

        // Don't overwrite it for the closing tag
        if (!$this->tagName) {
            $this->tagName = "h{$level}";
        }

        // Add instead as a class, `text-left`, `text-right`, etc.
        if ($align && $align !== 'start') {
            $this->attrs['class'] = trim(($this->attrs['class'] ?? '') . ' text-' . $align);
        }

        return parent::getTag();
    }

}
