<?php
namespace verbb\vizy\elements;

use Craft;
use craft\base\Element;

class Block extends Element
{
    // Properties
    // =========================================================================

    private $_fieldLayout;


    // Public Methods
    // =========================================================================

    public function getFieldLayout()
    {
        return $this->_fieldLayout;
    }

    public function setFieldLayout($fieldLayout)
    {
        $this->_fieldLayout = $fieldLayout;;
    }
}
