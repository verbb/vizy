<?php
namespace verbb\vizy\nodes;

use verbb\vizy\Vizy;
use verbb\vizy\base\Node;
use verbb\vizy\elements\Block as BlockElement;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Matrix;

use Craft;
use craft\base\ElementInterface;
use craft\elements\ContentBlock;
use craft\errors\InvalidFieldException;
use craft\events\ElementEvent;
use craft\fields\BaseRelationField;
use craft\fields\Matrix as MatrixField;
use craft\fields\ContentBlock as ContentBlockField;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\helpers\Template;
use craft\models\FieldLayout;
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
            // We might be trying to get the block type via ID or handle (GQL uses handles)
            $this->_blockType = $this->getField()->getBlockTypeByIdOrHandle($blockTypeId);

            if ($this->_blockType) {
                $this->_fieldLayout = $this->_blockType->getFieldLayout();

                // Save as shortcut to the blocktype handle, for templating ease
                $this->handle = $this->_blockType->handle;

                // Also update the blockTypeId, in case the handle was supplied
                $this->attrs['values']['type'] = $this->_blockType->id;
                $this->rawNode['attrs']['values']['type'] = $this->_blockType->id;

                // Add in the blocktype enabled/disabled state, independent on the block enabled/disabled
                $this->attrs['values']['typeEnabled'] = $this->_blockType->enabled;

                if ($this->_fieldLayout) {
                    foreach ($this->_fieldLayout->getCustomFields() as $field) {
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

    public function getMatrixAnchorUid(): ?string
    {
        return $this->attrs['values']['matrixAnchorUid'] ?? null;
    }

    public function setMatrixAnchorUid(?string $uid): void
    {
        if (!$uid) {
            return;
        }

        $this->attrs['values']['matrixAnchorUid'] = $uid;
        $this->rawNode['attrs']['values']['matrixAnchorUid'] = $uid;
    }

    public function hasMatrixFields(): bool
    {
        return Vizy::$plugin->getAnchors()->blockHasMatrixFields($this->getFieldLayout());
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

    public function isEmpty(): bool
    {
        $content = $this->attrs['values']['content']['fields'] ?? [];

        return !array_filter(array_values($content));
    }

    public function renderNode(array $config = []): ?string
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
        $block = $this->getBlockElement($this->getElement());
        $field = $this->getField();

        $variables = array_merge($this->toArray(), $block->getFieldValues());
        $variables[$field->handle] = $field;

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
        $block = $this->getBlockElement($this->getElement());

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
        return Craft::$app->getFields()->fieldContext;
    }

    public function getFieldValue(string $fieldHandle)
    {
        // Make sure the value has been normalized
        return $this->normalizeFieldValue($fieldHandle);
    }

    public function serializeValue(ElementInterface $element = null): ?array
    {
        $value = parent::serializeValue($element);

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

                if ($field instanceof MatrixField) {
                    $anchor = $this->_resolveMatrixAnchor($element, $fieldLayout);

                    if (!$anchor) {
                        continue;
                    }

                    $this->setMatrixAnchorUid($anchor->uid);
                    $value['attrs']['values']['matrixAnchorUid'] = $anchor->uid;

                    unset(
                        $value['attrs']['values']['content']['fields'][$field->layoutElement->uid],
                        $value['attrs']['values']['content']['fields'][$field->handle],
                    );

                    $content = $this->_getMatrixFieldContent($field->handle);

                    if ($content === null || $content === '') {
                        // Avoid wiping nested Matrix entries when client-side portal data
                        // wasn't synced into the Vizy JSON before the request was sent.
                        continue;
                    }

                    if (Matrix::isCraft5MatrixContent($content)) {
                        $content = Matrix::ensureSortOrder($content);
                        $fieldValue = $field->normalizeValueFromRequest($content, $anchor);
                    } else {
                        if (is_string($content) && Json::isJsonObject($content)) {
                            $content = Json::decode($content);
                        }

                        $content = Matrix::sanitizeMatrixContent($field, $content);
                        $fieldValue = $field->normalizeValue($content, $anchor);
                    }

                    Vizy::$plugin->getAnchors()->saveMatrixField($field, $anchor, $fieldValue, false);

                    foreach ($fieldValue->all() as $matrixBlock) {
                        if ($matrixFieldLayout = $matrixBlock->getFieldLayout()) {
                            foreach ($matrixFieldLayout->getCustomFields() as $matrixBlockField) {
                                try {
                                    $matrixBlockField->afterElementSave($matrixBlock, true);
                                } catch (Throwable $e) {
                                }
                            }
                        }
                    }

                    continue;
                }

                // Ensure each field's content is serialized properly. Use the `layoutElementUid`
                $serializedFieldValues = $field->serializeValue($fieldValue, $block);

                // Content Blocks are special in that they require an ID, which they'll never had
                if ($field instanceof ContentBlockField && $fieldValue instanceof ContentBlock) {
                    $serializedFieldValues['fields'] = $fieldValue->getSerializedFieldValues();
                }

                // Ensure any array values are serialized as JSON, to match their value in Vue serialization
                if (is_array($serializedFieldValues)) {
                    $serializedFieldValues = Json::encode($serializedFieldValues);
                }

                $value['attrs']['values']['content']['fields'][$field->layoutElement->uid] = $serializedFieldValues;

                // Remove deprecated content that uses the handle. Can be removed at the next breakpoint
                unset($value['attrs']['values']['content']['fields'][$field->handle]);

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
                if ($field instanceof SuperTable) {
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

                // Process all Content Block fields
                if ($field instanceof ContentBlockField) {
                    if ($fieldValue = $fieldValue->getFieldLayout()) {
                        foreach ($fieldValue->getCustomFields() as $contentBlockField) {
                            try {
                                $contentBlockField->afterElementSave($fieldValue, true);
                            } catch (Throwable $e) {

                            }
                        }
                    }
                }
            }
        }

        if (!$block->getMatrixAnchor()) {
            $block->id = null;
        }

        return $value;
    }

    public function normalizeValue(?ElementInterface $element = null): ?array
    {
        $value = parent::normalizeValue($element);

        // Convert any custom field values from their `layoutElementUid` to their handle.
        if ($fieldLayout = $this->getFieldLayout()) {
            $fieldContent = [];
            $fields = $value['attrs']['values']['content']['fields'] ?? [];

            foreach ($fields as $handleOrUid => $fieldValue) {
                // Normalize empty content for JSON
                if ($fieldValue === null) {
                    $fieldValue = '';
                }

                foreach ($fieldLayout->getCustomFields() as $field) {
                    // Check if this is the right field, using either the UID or the handle
                    $matchesField = ($field->layoutElement?->uid === $handleOrUid || $field->layoutElement?->handle === $handleOrUid || $field->handle === $handleOrUid);

                    if (!$matchesField) {
                        continue;
                    }

                    $fieldContent[$field->handle] = $fieldValue;

                    try {
                        if ($field instanceof MatrixField) {
                            Vizy::$plugin->setNestedMatrixFields($field->handle);

                            if ($this->getMatrixAnchorUid()) {
                                // Persisted Vizy JSON omits matrix blobs once an anchor exists, but incoming
                                // save requests still carry matrix POST data in attrs. Preserve it here so
                                // serializeValue() can hand it off to the anchor. Output JSON is stripped there.
                                if (is_string($fieldValue) && Json::isJsonObject($fieldValue)) {
                                    $fieldContent[$field->handle] = Json::decode($fieldValue);
                                } elseif (is_array($fieldValue) && $fieldValue !== []) {
                                    $fieldContent[$field->handle] = $fieldValue;
                                } else {
                                    unset($fieldContent[$field->handle]);
                                }

                                continue;
                            }
                        }

                        // Normalize nested Vizy field data
                        if ($field instanceof VizyField) {
                            $fieldContent[$field->handle] = Json::encode($field->normalizeValue($fieldValue, $element)->getRawNodes());
                        } else {
                            // Otherwise, anything that _looks_ like encoded JSON should be decoded
                            // This includes Matrix, Relation fields and Link fields
                            if (is_string($fieldValue) && Json::isJsonObject($fieldValue)) {
                                $fieldContent[$field->handle] = Json::decode($fieldValue);
                            }
                        }
                    } catch (Throwable $e) {
                        // Ignore any errors, they'll typically be JSON issues.
                    }
                }
            }

            $value['attrs']['values']['content']['fields'] = $fieldContent;
        }

        return $value;
    }

    public function getBlockElement(?ElementInterface $element = null): BlockElement
    {
        if ($this->_blockElement) {
            // Keep owner/site context in sync for cached synthetic block elements.
            if ($element) {
                $this->_blockElement->setOwner($element);
                $this->_syncBlockElementAnchor($element);
            }

            return $this->_blockElement;
        }

        $block = new BlockElement();
        $parent = $element ?: $this->getElement();
        $block->setOwner($parent);

        if ($fieldLayout = $this->getFieldLayout()) {
            $block->setFieldLayout($fieldLayout);

            // Set the field values based on stored content
            $fieldValues = $this->attrs['values']['content']['fields'] ?? [];
            $block->setFieldValues($fieldValues);
        }

        $this->_syncBlockElementAnchor($parent, $block);

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
            $anchor = $this->_resolveMatrixAnchor($this->getElement(), $this->getFieldLayout());

            if ($anchor) {
                if ($content) {
                    Matrix::migrateJsonToAnchor($field, $anchor, $content);
                    unset($this->attrs['values']['content']['fields'][$fieldHandle]);
                    $this->setMatrixAnchorUid($anchor->uid);
                }

                return $this->_normalizedFieldValues[$fieldHandle] = Matrix::nestedEntryQuery($field, $anchor);
            }

            $content = Matrix::sanitizeMatrixContent($field, $content);
        }

        return $this->_normalizedFieldValues[$fieldHandle] = $field->normalizeValue($content, $this->getBlockElement($this->getElement()));
    }

    protected function fieldByHandle(string $handle)
    {
        if ($this->_fieldsByHandle !== null && array_key_exists($handle, $this->_fieldsByHandle)) {
            return $this->_fieldsByHandle[$handle];
        }

        $fieldsService = Craft::$app->getFields();
        $originalFieldContext = $fieldsService->fieldContext;
        $fieldsService->fieldContext = $this->getFieldContext();
        $fieldLayout = $this->getFieldLayout();
        $this->_fieldsByHandle[$handle] = $fieldLayout ? $fieldLayout->getFieldByHandle($handle) : null;
        $fieldsService->fieldContext = $originalFieldContext;

        return $this->_fieldsByHandle[$handle];
    }


    // Private Methods
    // =========================================================================

    private function _getRawFieldContent($handle)
    {
        $fields = $this->attrs['values']['content']['fields'] ?? [];

        if (array_key_exists($handle, $fields)) {
            return $fields[$handle];
        }

        $field = $this->fieldByHandle($handle);

        if ($field?->layoutElement?->uid && array_key_exists($field->layoutElement->uid, $fields)) {
            return $fields[$field->layoutElement->uid];
        }

        return null;
    }

    private function _getMatrixFieldContent(string $handle): mixed
    {
        $content = $this->_getRawFieldContent($handle);

        if ($content !== null && $content !== '') {
            return $content;
        }

        $request = Craft::$app->getRequest();

        if ($request->getIsConsoleRequest()) {
            return null;
        }

        $vizyData = $request->getBodyParam('vizyData');

        if (!is_array($vizyData) || !($blockId = $this->getId()) || !isset($vizyData[$blockId])) {
            return null;
        }

        $blockData = $vizyData[$blockId];

        if (!is_array($blockData)) {
            return null;
        }

        $namespaceKey = array_key_first($blockData);
        $fields = $blockData[$namespaceKey]['fields'] ?? null;

        if (!is_array($fields)) {
            return null;
        }

        if (array_key_exists($handle, $fields)) {
            return $fields[$handle];
        }

        $field = $this->fieldByHandle($handle);

        if ($field?->layoutElement?->uid && array_key_exists($field->layoutElement->uid, $fields)) {
            return $fields[$field->layoutElement->uid];
        }

        return null;
    }

    private function _resolveMatrixAnchor(?ElementInterface $parent, ?FieldLayout $fieldLayout = null): ?\verbb\vizy\elements\MatrixAnchor
    {
        if (!$parent || !$parent->id || !$this->getId() || !$this->hasMatrixFields()) {
            return null;
        }

        $fieldLayout ??= $this->getFieldLayout();

        return Vizy::$plugin->getAnchors()->ensureAnchor(
            $parent,
            $this->getField(),
            $this->getId(),
            $fieldLayout,
            $this->getMatrixAnchorUid(),
        );
    }

    private function _syncBlockElementAnchor(?ElementInterface $parent, ?BlockElement $block = null): void
    {
        $block ??= $this->_blockElement;

        if (!$block) {
            return;
        }

        $anchor = $this->_resolveMatrixAnchor($parent);

        if ($anchor) {
            $block->setMatrixAnchor($anchor);
            $block->id = $anchor->id;
            $this->setMatrixAnchorUid($anchor->uid);

            return;
        }

        $block->id = rand();
    }

}
