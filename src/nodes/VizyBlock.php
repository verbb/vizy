<?php
namespace verbb\vizy\nodes;

use verbb\vizy\base\Node;
use verbb\vizy\elements\Block as BlockElement;
use verbb\vizy\helpers\Matrix;

use Craft;
use craft\base\ElementInterface;
use craft\errors\InvalidFieldException;
use craft\events\ElementEvent;
use craft\fields\BaseRelationField;
use craft\fields\Matrix as MatrixField;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\Template;
use craft\services\Elements;
use craft\web\View;

use Twig\Markup;

use Throwable;

use verbb\supertable\fields\SuperTableField as SuperTable;

class VizyBlock extends Node
{
    // Static Methods
    // =========================================================================

    public static function gqlTypeNameByContext(mixed $context): string
    {
        return $context->getField()->handle . '_' . $context->handle . '_BlockType';
    }


    // Properties
    // =========================================================================

    public static ?string $type = 'vizyBlock';
    protected ?string $handle = null;

    private mixed $_fieldLayout = null;
    private mixed $_blockType = null;
    private ?array $_fieldsByHandle = null;
    private ?array $_normalizedFieldValues = null;
    private ?BlockElement $_blockElement = null;


    // Public Methods
    // =========================================================================

    public function __construct($config = [])
    {
        parent::__construct($config);

        $blockTypeId = $this->attrs['values']['type'] ?? '';

        if ($blockTypeId) {
            $this->_blockType = $this->getField()->getBlockTypeById($blockTypeId);

            if ($this->_blockType) {
                $this->_fieldLayout = $this->_blockType->getFieldLayout();

                // Save as shortcut to the blocktype handle, for templating ease
                $this->handle = $this->_blockType->handle;

                // Add in the blocktype enabled/disabled state, independant on the block enabled/disabled
                $this->attrs['values']['typeEnabled'] = $this->_blockType->enabled;

                if ($this->_fieldLayout) {
                    foreach ($this->_fieldLayout->getCustomFields() as $key => $field) {
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

    public function getHandle(): ?string
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

    public function getId()
    {
        return $this->attrs['id'] ?? '';
    }

    public function getEnabled(): bool
    {
        return $this->attrs['enabled'] ?? true;
    }

    public function getCollapsed()
    {
        return $this->attrs['collapsed'] ?? true;
    }

    public function getBlockTypeEnabled()
    {
        return $this->attrs['values']['typeEnabled'] ?? true;
    }

    public function isDeleted(): bool
    {
        // BlockType has likely been deleted, bail
        if (!$this->_blockType) {
            return true;
        }

        return parent::isDeleted();
    }

    public function isEmpty()
    {
        $content = $this->attrs['values']['content']['fields'] ?? [];

        return !array_filter(array_values($content));
    }

    public function renderNode(): ?string
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

        if (!$view->doesTemplateExist($this->_blockType->template, View::TEMPLATE_MODE_SITE)) {
            return null;
        }

        // Create a fake element with the same fieldtype as our block
        $block = $this->getBlockElement();

        $variables = array_merge($this->toArray(), $block->getFieldValues());

        return $view->renderTemplate($this->_blockType->template, $variables, View::TEMPLATE_MODE_SITE);
    }

    public function renderStaticHtml(): ?Markup
    {
        $html = '';

        $fieldLayout = $this->getFieldLayout();

        if (!$fieldLayout) {
            return Template::raw($html);
        }

        // Create a fake element with the same fieldtype as our block
        $block = $this->getBlockElement();

        foreach ($block->getFieldLayout()->getTabs() as $tab) {
            foreach ($tab->elements as $tabElement) {
                $html .= $tabElement->formHtml($block, true);
            }
        }

        return Template::raw(Html::tag('div', $html, [
            'class' => 'vizyblock',
        ]));
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

    public function serializeValue(ElementInterface $element = null): ?array
    {
        $value = parent::serializeValue($element);

        // For any nested Vizy fields, we want to deserialize the JSON from the front-end and expand
        // it to a normal array. This helps with particularly character encoding and htmlentities.
        $fields = $value['attrs']['values']['content']['fields'] ?? [];

        foreach ($fields as $fieldKey => $field) {
            if (is_string($field)) {
                if (str_starts_with($field, '[{')) {
                    $field = Json::decodeIfJson($field);
                }

                $value['attrs']['values']['content']['fields'][$fieldKey] = $field;
            }
        }

        // Create a fake element with the same fieldtype as our block
        $block = $this->getBlockElement($element);

        // Trigger the before-save event (on the element service) to prep the element. Preparse requires this to work.
        Craft::$app->getElements()->trigger(Elements::EVENT_BEFORE_SAVE_ELEMENT, new ElementEvent([
            'element' => $block,
            'isNew' => true,
        ]));

        if ($fieldLayout = $block->getFieldLayout()) {
            foreach ($fieldLayout->getCustomFields() as $field) {
                $fieldValue = $block->getFieldValue($field->handle);

                // Ensure each field's content is serialized properly
                $serializedFieldValues = $field->serializeValue($fieldValue, $block);
                $value['attrs']['values']['content']['fields'][$field->handle] = $serializedFieldValues;

                // Fix relation fields in their `afterElementSave` function trying to create relations
                // We still want relation fields to run `afterElementSave` however (see Asset fields)
                if ($field instanceof BaseRelationField) {
                    $field->maintainHierarchy = false;
                    $field->localizeRelations = false;
                }

                // Ensure we call each field's `afterElementSave` method. This would be auto-done
                // if a VizyBlock node was an element, and we were saving that.
                $field->afterElementSave($block, true);

                // Process all Matrix/Super Table fields and their blocks in the same manner.
                if ($field instanceof MatrixField || $field instanceof SuperTable) {
                    foreach ($fieldValue->all() as $matrixBlock) {
                        if ($matrixFieldLayout = $matrixBlock->getFieldLayout()) {
                            foreach ($matrixFieldLayout->getCustomFields() as $matrixBlockField) {
                                try {
                                    $matrixBlockField->afterElementSave($matrixBlock, true);
                                } catch (Throwable $e) {
                                    // Assets (and other relational fields) will likely throw an error here, because
                                    // when saving a Matrix block, it'll try and create an entry in the relations table
                                    // but without a real element to relate to as the source, this will fail.
                                    // This is okay for our needs, as all we care about are fields running their `afterElementSave()`
                                    // anyway, which for assets is moving from the temp folder to their correct directory.
                                }
                            }
                        }
                    }
                }
            }
        }

        return $value;
    }

    public function getBlockElement($element = null): BlockElement
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
            return $this->_normalizedFieldValues[$fieldHandle];
        }

        $field = $this->fieldByHandle($fieldHandle);

        if (!$field) {
            throw new InvalidFieldException($fieldHandle);
        }

        $content = $this->_getRawFieldContent($fieldHandle);

        if (Matrix::isMatrix($field)) {
            $content = Matrix::sanitizeMatrixContent($field, $content);
        }

        return $this->_normalizedFieldValues[$fieldHandle] = $field->normalizeValue($content, $this->getElement());
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
