<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\elements\Block as BlockElement;

use Craft;
use craft\behaviors\CustomFieldBehavior;
use craft\helpers\Html;

class VizyBlock extends Node
{
    // Properties
    // =========================================================================

    public static $type = 'vizyBlock';
    protected $handle;

    private $_fieldLayout;
    private $_blockType;
    private $_fieldsByHandle;


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
        $block = new BlockElement();
        $block->setFieldLayout($fieldLayout);

        // Set the field values based on stored content
        $fieldValues = $this->attrs['values']['content']['fields'] ?? [];
        $block->setFieldValues($fieldValues);

        foreach ($fieldLayout->getTabs() as $tab) {
            foreach ($tab->elements as $tabElement) {
                $html .= $tabElement->formHtml($block, true);
            }
        }

        return Html::tag('div', $html, [
            'class' => 'vizyblock',
        ]);
    }


    // Private Methods
    // =========================================================================

    private function _getRawFieldContent($handle)
    {
        return $this->attrs['values']['content']['fields'][$handle] ?? null;
    }

}
