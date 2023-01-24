<?php
namespace verbb\vizy\elements;

use verbb\vizy\helpers\Matrix;

use craft\base\Element;
use craft\models\FieldLayout;
use verbb\vizy\models\BlockType;
use verbb\vizy\fields\VizyField;

class Block extends Element
{
    // Static Methods
    // =========================================================================

    public static function hasContent(): bool
    {
        return true;
    }

    public static function isLocalized(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    private ?FieldLayout $_fieldLayout = null;
    private mixed $_owner = null;
    private ?BlockType $_type = null;


    // Public Methods
    // =========================================================================

    public function getFieldLayout(): ?FieldLayout
    {
        return $this->_fieldLayout;
    }

    public function setFieldLayout(?FieldLayout $fieldLayout): void
    {
        $this->_fieldLayout = $fieldLayout;
    }

    public function getType(): ?BlockType
    {
        return $this->_type;
    }

    public function setType(?BlockType $type): void
    {
        $this->_type = $type;
    }

    public function getField(): ?VizyField
    {
        return $this->_field;
    }

    public function setField(?VizyField $field): void
    {
        $this->_field = $field;
    }

    public function setFieldValues(array $values): void
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

        parent::setFieldValues($values);
    }

    public function getOwner()
    {
        return $this->_owner;
    }

    public function setOwner($owner): void
    {
        $this->_owner = $owner;

        // Set the appropriate siteId for the block, inherited from the owner
        if ($owner) {
            $this->siteId = $owner->siteId;
        }
    }

    public function isFieldDirty(string $fieldHandle): bool
    {
        // Keep an eye on the ramifications of setting this. We override this because for assets fields,
        // the BaseRelationField class will try and create a relation, which we don't want. 
        // This is the only feasible way  to flag the `afterElementSave` BaseRelationField not to proceed.
        return false;
    }

}
