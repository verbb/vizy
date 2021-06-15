<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\elements\Block as BlockElement;

use Craft;
use craft\base\ElementInterface;
use craft\behaviors\CustomFieldBehavior;
use craft\errors\InvalidFieldException;
use craft\fields\BaseRelationField;
use craft\helpers\Html;
use craft\helpers\Json;

class VizyBlock extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'vizyBlock';
    protected $handle;

    private $_fieldLayout;
    private $_blockType;
    private $_fieldsByHandle;
    private $_normalizedFieldValues;
    private $_blockElement;


    // Public Methods
    // =========================================================================

    public function __construct($config = [])
    {
        parent::__construct($config);

        $blockTypeId = $this->attrs['values']['type'] ?? '';

        if ($blockTypeId) {
            $this->_blockType = $this->field->getBlockTypeById($blockTypeId);
            
            if ($this->_blockType) {
                $this->_fieldLayout = $this->_blockType->getFieldLayout();

                // Save as shortcut to the blocktype handle, for templating ease
                $this->handle = $this->_blockType->handle;

                // Add in the blocktype enabled/disabled state, independant on the block enabled/disabled
                $this->attrs['values']['typeEnabled'] = $this->_blockType->enabled;

                if ($this->_fieldLayout) {
                    foreach ($this->_fieldLayout->getFields() as $key => $field) {
                        $this->_fieldsByHandle[$field->handle] = $this->_fieldLayout->getFieldByHandle($field->handle);
                    }
                }
            }
        }
    }

    public function __isset($name)
    {
        if ($this->fieldByHandle($name)) {
            return true;
        }

        return parent::__isset($name);
    }

    public function __get($name)
    {
        if ($this->fieldByHandle($name) !== null) {
            return $this->getFieldValue($name);
        }

        return parent::__get($name);
    }

    public function getHandle()
    {
        return $this->handle;
    }

    public function getBlockType()
    {
        return $this->_blockType;
    }

    public function getFieldLayout()
    {
        return $this->_fieldLayout;
    }

    public function getEnabled()
    {
        return $this->attrs['enabled'] ?? true;
    }

    public function getBlockTypeEnabled()
    {
        return $this->attrs['values']['typeEnabled'] ?? true;
    }

    public function isDeleted()
    {
        // BlockType has likely been deleted, bail
        if (!$this->_blockType) {
            return true;
        }

        return parent::isDeleted();
    }

    public function renderNode()
    {
        // If a template has been defined on the block, use that to render
        if (!$this->_blockType->template) {
            return null;
        }

        // Is the blocktype, or this block itself disabled?
        if (!$this->getBlockTypeEnabled() || !$this->getEnabled()) {
            return null;
        }

        $view = Craft::$app->getView();

        if (!$view->doesTemplateExist($this->_blockType->template)) {
            return null;
        }

        $fieldValues = [];

        // Fetch all the custom field content, and supply with variables
        if ($this->_fieldLayout) {
            foreach ($this->_fieldLayout->getFields() as $field) {
                $fieldValues[$field->handle] = $this->{$field->handle} ?? null;
            }
        }

        $variables = array_merge($this->toArray(), $fieldValues);

        return $view->renderTemplate($this->_blockType->template, $variables);
    }

    public function renderStaticHtml()
    {
        $html = '';

        $fieldLayout = $this->getFieldLayout();

        if (!$fieldLayout) {
            return $html;
        }

        // Create a fake element with the same fieldtype as our block
        $block = $this->getBlockElement();

        foreach ($block->getFieldLayout()->getTabs() as $tab) {
            foreach ($tab->elements as $tabElement) {
                $html .= $tabElement->formHtml($block, true);
            }
        }

        return Html::tag('div', $html, [
            'class' => 'vizyblock',
        ]);
    }

    public function getFieldContext(): string
    {
        return Craft::$app->getContent()->fieldContext;
    }

    public function getFieldValue(string $fieldHandle)
    {
        // Make sure the value has been normalized
        return $this->normalizeFieldValue($fieldHandle);
    }

    public function getGqlTypeName()
    {
        return $this->getField()->handle . '_' . $this->handle . '_BlockType';
    }

    public function serializeValue(ElementInterface $element = null)
    {
        $value = parent::serializeValue($element);

        // For any nested Vizy fields, we want to deserialie the JSON from the front-end and expand
        // it to a normal array. This helps with particularly character encoding and htmlentities.
        $fields = $value['attrs']['values']['content']['fields'] ?? [];

        foreach ($fields as $fieldKey => $field) {
            if (is_string($field)) {
                if (substr($field, 0, 2) === '[{') {
                    $field = Json::decodeIfJson($field);
                }

                $value['attrs']['values']['content']['fields'][$fieldKey] = $field;
            }
        }

        // Create a fake element with the same fieldtype as our block
        $block = $this->getBlockElement($element);
        
        foreach ($block->getFieldLayout()->getFields() as $field) {
            // Ensure we call each field's `afterElementSave` method. This would be auto-done
            // if a VizyBlock node was an element, and we were saving that.
            $field->afterElementSave($block, true);
        }

        return $value;
    }

    public function getBlockElement($element = null)
    {
        if ($this->_blockElement) {
            return $this->_blockElement;
        }

        $block = new BlockElement();

        if ($fieldLayout = $this->getFieldLayout()) {
            $block->setOwner($element);
            $block->setFieldLayout($fieldLayout);

            // Set the field values based on stored content
            $fieldValues = $this->attrs['values']['content']['fields'] ?? [];
            $block->setFieldValues($fieldValues);
        }

        return $this->_blockElement = $block;
    }


    // Protected Methods
    // =========================================================================

    protected function normalizeFieldValue(string $fieldHandle)
    {
        // Have we already normalized this value?
        if (isset($this->_normalizedFieldValues[$fieldHandle])) {
            return;
        }

        $field = $this->fieldByHandle($fieldHandle);

        if (!$field) {
            throw new InvalidFieldException($fieldHandle);
        }

        $this->_normalizedFieldValues[$fieldHandle] = true;
        $content = $this->_getRawFieldContent($fieldHandle);

        return $field->normalizeValue($content, $this->element);
    }

    protected function fieldByHandle(string $handle)
    {
        if ($this->_fieldsByHandle !== null && array_key_exists($handle, $this->_fieldsByHandle)) {
            return $this->_fieldsByHandle[$handle];
        }

        $contentService = Craft::$app->getContent();
        $originalFieldContext = $contentService->fieldContext;
        $contentService->fieldContext = $this->getFieldContext();
        $fieldLayout = $this->getFieldLayout();
        $this->_fieldsByHandle[$handle] = $fieldLayout ? $fieldLayout->getFieldByHandle($handle) : null;
        $contentService->fieldContext = $originalFieldContext;

        return $this->_fieldsByHandle[$handle];
    }


    // Private Methods
    // =========================================================================

    private function _getRawFieldContent($handle)
    {
        return $this->attrs['values']['content']['fields'][$handle] ?? null;
    }

}
