<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\FieldInterface;
use craft\console\Controller;
use craft\db\Query;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Console;
use craft\helpers\Db;
use craft\helpers\Json;

use yii\console\ExitCode;

use Exception;
use Throwable;

/**
 * Manages Vizy content.
 */
class ContentController extends Controller
{
    // Properties
    // =========================================================================

    private array $_fieldUidHandleMap = [];
    private array $_foundFieldUidHandleMap = [];


    // Public Methods
    // =========================================================================

    /**
     * Fixes any Vizy Block data where fields had their settings saved with UIDs instead of handles
     */
    public function actionFixVizyBlockFieldUids(): int
    {
        // Check if any content in any Vizy field needs to be updated
        $vizyFields = (new Query())
            ->from('{{%fields}}')
            ->where(['type' => VizyField::class])
            ->all();

        foreach ($vizyFields as $vizyFieldData) {
            $vizyField = Craft::$app->getFields()->getFieldByUid($vizyFieldData['uid']);

            if ($vizyField) {
                // We have to use field instances, not just the field
                foreach ($this->findFieldUsages($vizyField) as $fieldLayoutUid) {
                    // Find content rows for each field instance
                    $sql = Craft::$app->getDb()->getQueryBuilder()->jsonExtract('content', [$fieldLayoutUid]);

                    $rows = (new Query())
                        ->select(['content', 'id', 'elementId', 'siteId'])
                        ->from('{{%elements_sites}}')
                        ->where([
                            'and',
                            ['not', ['content' => null]],
                            $sql . ' IS NOT NULL',
                        ])
                        ->all();

                    foreach ($rows as $row) {
                        $elementContent = Json::decode($row['content']) ?? [];

                        if ($elementContent) {
                            $contentModified = false;
                            $fieldContent = $elementContent[$fieldLayoutUid] ?? null;

                            if (is_string($fieldContent) && $fieldContent !== '') {
                                try {
                                    $decodedFieldContent = Json::decode($fieldContent);

                                    if (is_array($decodedFieldContent)) {
                                        $fieldContent = $decodedFieldContent;
                                    }
                                } catch (Throwable) {
                                    $fieldContent = null;
                                }
                            }

                            if ($fieldContent && is_array($fieldContent)) {
                                $contentModified = $this->_fixVizyContentFieldUids($fieldContent, $vizyField, 'content') || $contentModified;
                            }

                            if ($contentModified) {
                                $elementContent[$fieldLayoutUid] = Json::encode($fieldContent);

                                Db::update('{{%elements_sites}}', ['content' => $elementContent], ['id' => $row['id']]);

                                $this->stdout('[UPDATED] Element #' . $row['elementId'] . ':' . $row['siteId'] . ' Vizy content for ' . $vizyField->handle . PHP_EOL, Console::FG_GREEN);
                            }
                        }
                    }
                }
            }
        }

        return ExitCode::OK;
    }


    // Private Methods
    // =========================================================================

    private function _fixVizyContentFieldUids(array &$nodes, VizyField $vizyField, string $path): bool
    {
        $modified = false;

        foreach ($nodes as $nodeKey => &$node) {
            if (!is_array($node)) {
                continue;
            }

            $nodePath = $path . '.' . $nodeKey;

            if (($node['type'] ?? null) === 'vizyBlock') {
                $modified = $this->_fixVizyBlockFieldUids($node, $vizyField, $nodePath) || $modified;
            }

            if (isset($node['content']) && is_array($node['content'])) {
                $modified = $this->_fixVizyContentFieldUids($node['content'], $vizyField, $nodePath . '.content') || $modified;
            }
        }

        return $modified;
    }

    private function _fixVizyBlockFieldUids(array &$node, VizyField $vizyField, string $path): bool
    {
        $modified = false;
        $blockTypeId = $node['attrs']['values']['type'] ?? null;

        if (!$blockTypeId) {
            return false;
        }

        $blockType = $vizyField->getBlockTypeByIdOrHandle($blockTypeId);
        $fieldLayout = $blockType?->getFieldLayout();

        if (!$fieldLayout) {
            return false;
        }

        if (!isset($node['attrs']['values']['content']['fields']) || !is_array($node['attrs']['values']['content']['fields'])) {
            return false;
        }

        $fields = &$node['attrs']['values']['content']['fields'];

        foreach (array_keys($fields) as $handleOrUid) {
            $fieldValue = &$fields[$handleOrUid];
            $fieldPath = $path . '.attrs.values.content.fields.' . $handleOrUid;
            $field = $this->_fieldForContentKey($fieldLayout, $handleOrUid);

            if (!$field && str_contains($handleOrUid, '-') && !isset($this->_fieldUidHandleMap[$handleOrUid]) && $fieldValue) {
                $selectedHandle = $this->_promptForFieldHandle($handleOrUid, $fieldValue, $fieldLayout, $fieldPath);

                if ($selectedHandle) {
                    $field = $fieldLayout->getFieldByHandle($selectedHandle);
                    $fields[$selectedHandle] = $fieldValue;
                    unset($fields[$handleOrUid]);

                    $this->stdout('Updating field content for ' . $fieldPath . PHP_EOL, Console::FG_GREEN);
                    $this->stdout('Field content: ' . $this->_previewFieldContent($fieldValue) . PHP_EOL, Console::FG_GREEN);

                    $handleOrUid = $selectedHandle;
                    $fieldPath = $path . '.attrs.values.content.fields.' . $handleOrUid;
                    $fieldValue = &$fields[$handleOrUid];
                    $modified = true;
                }
            }

            if ($field instanceof VizyField) {
                $modified = $this->_fixNestedVizyFieldValue($fieldValue, $field, $fieldPath) || $modified;
            }

            unset($fieldValue);
        }

        return $modified;
    }

    private function _fixNestedVizyFieldValue(mixed &$fieldValue, VizyField $vizyField, string $path): bool
    {
        $wasJson = false;
        $value = $fieldValue;

        if (is_string($value) && $value !== '') {
            try {
                $decodedValue = Json::decode($value);

                if (is_array($decodedValue)) {
                    $value = $decodedValue;
                    $wasJson = true;
                }
            } catch (Throwable) {
                return false;
            }
        }

        if (!is_array($value)) {
            return false;
        }

        $modified = $this->_fixVizyContentFieldUids($value, $vizyField, $path);

        if ($modified) {
            $fieldValue = $wasJson ? Json::encode($value) : $value;
        }

        return $modified;
    }

    private function _fieldForContentKey($fieldLayout, string $handleOrUid): ?FieldInterface
    {
        foreach ($fieldLayout->getCustomFields() as $field) {
            if (
                $field->handle === $handleOrUid ||
                $field->uid === $handleOrUid ||
                $field->layoutElement?->handle === $handleOrUid ||
                $field->layoutElement?->uid === $handleOrUid ||
                $field->layoutElement?->getFieldUid() === $handleOrUid
            ) {
                return $field;
            }
        }

        return null;
    }

    private function _promptForFieldHandle(string $uid, mixed $fieldValue, $fieldLayout, string $path): ?string
    {
        if (isset($this->_foundFieldUidHandleMap[$uid])) {
            return $this->_foundFieldUidHandleMap[$uid];
        }

        $selectedHandles = [];

        foreach ($fieldLayout->getCustomFields() as $field) {
            $selectedHandles[$field->handle] = $field->handle;
        }

        if (!$selectedHandles) {
            return null;
        }

        $this->stdout('Unable to find field for content: ' . $path . PHP_EOL, Console::FG_RED);
        $this->stdout('Content preview: ' . $this->_previewFieldContent($fieldValue) . PHP_EOL, Console::FG_RED);

        $selectedHandle = $this->select('Select field handle:', $selectedHandles);

        return $this->_foundFieldUidHandleMap[$uid] = $selectedHandle;
    }

    private function _previewFieldContent(mixed $fieldValue): string
    {
        if (is_scalar($fieldValue) || $fieldValue === null) {
            return (string)$fieldValue;
        }

        return Json::encode($fieldValue);
    }


    // Protected Methods
    // =========================================================================

    protected function findFieldUsages(FieldInterface $field): array
    {
        $uids = [];

        foreach (Craft::$app->getFields()->getAllLayouts() as $layout) {
            foreach ($layout->getAllElements() as $layoutElement) {
                try {
                    if (!$layoutElement instanceof CustomField) {
                        continue;
                    }

                    // Save every field layout instance to a map for later. For extra safety, record the field
                    // layout UID and the field UID to resolve correctly.
                    $this->_fieldUidHandleMap[$layoutElement->uid] = $layoutElement->handle ?? $layoutElement->getField()->handle;
                    $this->_fieldUidHandleMap[$layoutElement->getFieldUid()] = $layoutElement->handle ?? $layoutElement->getField()->handle;

                    if ($layoutElement->getFieldUid() === $field->uid) {
                        $uids[] = $layoutElement->uid;
                    }
                } catch (Exception) {

                }
            }
        }

        return $uids;
    }
}
