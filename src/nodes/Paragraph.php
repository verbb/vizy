<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

use craft\helpers\ArrayHelper;

class Paragraph extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'paragraph';
    public $tagName = 'p';
    

    // Public Methods
    // =========================================================================

    public function getTag()
    {
        // Don't include certain attributes in rendering
        $align = ArrayHelper::remove($this->attrs, 'textAlign');

        // Add instead as a class, `text-left`, `text-right`, etc.
        if ($align && $align !== 'start') {
            $this->attrs['class'] = trim(($this->attrs['class'] ?? '') . ' text-' . $align);
        }

        return parent::getTag();
    }

}
