<?php
namespace verbb\vizy\elements;

use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;

use Craft;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\elements\User;
use craft\models\FieldLayout;

class Block extends Element
{
    // Static Methods
    // =========================================================================

    public static function isLocalized(): bool
    {
        return true;
    }


    // Properties
    // =========================================================================

    private ?FieldLayout $_fieldLayout = null;
    private ?ElementInterface $_owner = null;
    private ?BlockType $_type = null;
    private ?VizyField $_field = null;
    private string $_blockUid = '';
    private ?MatrixAnchor $_matrixAnchor = null;


    // Public Methods
    // =========================================================================

    public function getMatrixAnchor(): ?MatrixAnchor
    {
        return $this->_matrixAnchor;
    }

    public function setMatrixAnchor(?MatrixAnchor $anchor): void
    {
        $this->_matrixAnchor = $anchor;
    }

    public function getFieldLayout(): ?FieldLayout
    {
        return $this->_fieldLayout;
    }

    public function setFieldLayout(?FieldLayout $fieldLayout): void
    {
        $this->_fieldLayout = $fieldLayout;
    }

    public function getType(): BlockType
    {
        if (!$this->_type) {
            throw new \LogicException('Vizy Block Element has no Block Type context.');
        }
        return $this->_type;
    }

    public function setType(BlockType $type): void
    {
        $this->_type = $type;
    }

    public function getField(): VizyField
    {
        if (!$this->_field) {
            throw new \LogicException('Vizy Block Element has no Vizy field context.');
        }
        return $this->_field;
    }

    public function setField(VizyField $field): void
    {
        $this->_field = $field;
    }

    public function getBlockUid(): string
    {
        return $this->_blockUid;
    }

    public function setBlockUid(string $uid): void
    {
        $this->_blockUid = $uid;
    }

    public function getOwner(): ElementInterface
    {
        if (!$this->_owner) {
            throw new \LogicException('Vizy Block Element has no owner context.');
        }
        return $this->_owner;
    }

    public function setOwner(ElementInterface $owner): void
    {
        $this->_owner = $owner;
        $this->siteId = $owner->siteId;
    }

    public function canSave(User $user): bool
    {
        $owner = $this->getOwner();

        if ($owner instanceof ElementInterface) {
            return Craft::$app->getElements()->canSave($owner, $user);
        }

        return false;
    }

}
