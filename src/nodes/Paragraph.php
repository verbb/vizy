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
        ArrayHelper::remove($this->attrs, 'textAlign');

        return parent::getTag();
    }

}
