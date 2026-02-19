<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\ArrayHelper;

use Craft;
use craft\base\FieldInterface;
use craft\console\Controller;
use craft\db\Migration;
use craft\db\Query;
use craft\fields\ContentBlock as ContentBlockField;
use craft\fields\Matrix as MatrixField;
use craft\fieldlayoutelements\BaseField;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Console;
use craft\helpers\Db;
use craft\helpers\FileHelper;
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

        $missingUids = [];

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

                            if (is_string($fieldContent) && Json::isJsonObject($fieldContent)) {
                                $fieldContent = Json::decode($fieldContent);
                            }

                            if ($fieldContent && is_array($fieldContent)) {
                                foreach (ArrayHelper::flatten($fieldContent) as $flatKey => $flatContent) {
                                    $searchKey = 'content.fields.';

                                    if (str_contains($flatKey, $searchKey)) {
                                        // Extract either a handle or UID from the key
                                        preg_match('/content\.fields\.([^.]+)$/', $flatKey, $matches);
                                        $handleOrUid = $matches[1] ?? null;

                                        // Not a UID, so all good - skip
                                        if (!str_contains($handleOrUid, '-')) {
                                            continue;
                                        }

                                        // Find an existing field based on the UID
                                        $matchedHandle = $this->_fieldUidHandleMap[$handleOrUid] ?? null;

                                        // If we found a field, then we're all good. UID or handle, it'll resolve correctly.
                                        // We don't want to change UID to handle mappings, due to some fields like Content Blocks and Matrix
                                        // actually needing them there, so it's all valid.
                                        if ($matchedHandle) {
                                            continue;
                                        }

                                        $newFieldKey = null;

                                        // If the UID in content is missing from our map, we need to prompt the user for the correct handle
                                        if ($flatContent) {
                                            // If we've already processed this field, we already know the correct handle
                                            if (isset($this->_foundFieldUidHandleMap[$handleOrUid])) {
                                                $newFieldKey = str_replace($handleOrUid, $this->_foundFieldUidHandleMap[$handleOrUid], $flatKey);
                                            } else {
                                                // Find the block type based off the content, to get a list of possible fields
                                                $blockTypeIdPath = substr($flatKey, 0, (strrpos($flatKey, 'content.fields') - 1)) . '.type';

                                                if ($blockTypeId = ArrayHelper::getValue($fieldContent, $blockTypeIdPath)) { 
                                                    if ($blockType = $vizyField->getBlockTypeByIdOrHandle($blockTypeId)) {
                                                        $selectedHandles = [];

                                                        // Get all possible fields for the block type
                                                        foreach ($blockType->getFieldLayout()->getCustomFields() as $field) {
                                                            $selectedHandles[$field->handle] = $field->handle;
                                                        }

                                                        // Prompt the user for the correct handle
                                                        if ($selectedHandles) {
                                                            $this->stdout('Unable to find field for content: ' . $flatKey . PHP_EOL, Console::FG_RED);
                                                            $this->stdout('Content preview: ' . $flatContent . PHP_EOL, Console::FG_RED);
                                                            $selectedHandle = $this->select('Select field handle:', $selectedHandles);

                                                            // Update our map with the chosen handle so next time we don't have to prompt the user
                                                            $this->_foundFieldUidHandleMap[$handleOrUid] = $selectedHandle;

                                                            $newFieldKey = str_replace($handleOrUid, $this->_foundFieldUidHandleMap[$handleOrUid], $flatKey);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if ($newFieldKey) {
                                            // Craft::dd([$fieldContent, $newFieldKey]);
                                            $this->stdout('Updating field content for Element #' . $row['elementId'] . ':' . $row['siteId'] . PHP_EOL, Console::FG_GREEN);
                                            $this->stdout('Field content: ' . $flatContent . PHP_EOL, Console::FG_GREEN);

                                            $contentModified = true;

                                            ArrayHelper::setValue($fieldContent, $newFieldKey, $flatContent);
                                        }
                                    }
                                }
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
