<?php
namespace verbb\vizy\elements;

use verbb\vizy\helpers\Matrix;

use Craft;
use craft\base\Element;

class Block extends Element
{
    // Properties
    // =========================================================================

    private $_owner;
    private $_fieldLayout;


    // Public Methods
    // =========================================================================

    public static function hasContent(): bool
    {
        return true;
    }

    public function getFieldLayout()
    {
        return $this->_fieldLayout;
    }

    public function setFieldLayout($fieldLayout)
    {
        $this->_fieldLayout = $fieldLayout;
    }

    public function setFieldValues(array $values)
    {
        // Filter out any field values for fields that no longer exist on the element
        foreach ($values as $fieldHandle => $value) {
            $field = $this->fieldByHandle($fieldHandle);

            if (Matrix::isMatrix($field)) {
                $values[$fieldHandle] = Matrix::sanitizeMatrixContent($field, $value);
            }

            if (!property_exists($this->getBehavior('customFields'), $fieldHandle)) {
                unset($values[$fieldHandle]);
            }
        }

        return parent::setFieldValues($values);
    }

    public function getOwner()
    {
        return $this->_owner;
    }

    public function setOwner($owner)
    {
        $this->_owner = $owner;
    }

    public function isFieldDirty(string $fieldHandle): bool
    {
        // Keep an eye on the ramifications of setting this. We override this because for assets fields,
        // the BaseRelationField class will try and create a relation, which we don't want. 
        // This is the only feasible way  to flag the `afterElementSave` BaseRelationField not to proceed.
        return false;
    }

}
