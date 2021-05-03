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

    public function setFieldValues(array $values)
    {
        // Filter out any field values for fields that no longer exist on the element
        foreach ($values as $fieldHandle => $value) {
            if (!property_exists($this->getBehavior('customFields'), $fieldHandle)) {
                unset($values[$fieldHandle]);
            }
        }

        return parent::setFieldValues($values);
    }

}
