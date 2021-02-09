<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;

use Craft;
use craft\behaviors\CustomFieldBehavior;

class VizyBlock extends Node
{
    // Properties
    // =========================================================================

    protected $type = 'vizyBlock';
    protected $handle;

    private $_fieldLayout;
    private $_blockType;
    private $_fieldsByHandle;


    // Public Methods
    // =========================================================================

    public function __construct($field, $node)
    {
        parent::__construct($field, $node);

        $blockTypeId = $this->node['attrs']['values']['type'] ?? '';

        if ($blockTypeId) {
            $this->_blockType = $this->field->getBlockTypeById($blockTypeId);
            
            if ($this->_blockType) {
                $this->_fieldLayout = $this->_blockType->getFieldLayout();

                // Save as shortcut to the blocktype handle, for templating ease
                $this->handle = $this->_blockType->handle;

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
        if (isset($this->_fieldsByHandle[$name])) {
            return true;
        }

        return parent::__isset($name);
    }

    public function __get($name)
    {
        if (isset($this->_fieldsByHandle[$name])) {
            $content = $this->_getRawFieldContent($name);

            return $this->_fieldsByHandle[$name]->normalizeValue($content) ?? null;
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

    public function renderNode()
    {
        // If a template has been defined on the block, use that to render
        if (!$this->_blockType->template) {
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


    // Private Methods
    // =========================================================================

    private function _getRawFieldContent($handle)
    {
        return $this->node['attrs']['values']['content']['fields'][$handle] ?? null;
    }

}
