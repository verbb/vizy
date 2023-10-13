<?php
namespace verbb\vizy\services;

use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\ArrayHelper;

use Craft;
use craft\base\Component;
use craft\db\Query;
use craft\events\FieldEvent;
use craft\fields\Matrix;
use craft\helpers\Db;
use craft\helpers\ElementHelper;
use craft\helpers\Json;

use verbb\supertable\fields\SuperTableField;

class Content extends Component
{
    // Properties
    // =========================================================================

    protected array $vizyFields = []; 
    protected array $matrixFields = []; 
    protected array $superTableFields = []; 


    // Public Methods
    // =========================================================================

    public function onSaveField(FieldEvent $event): void
    {
        // Skip this when updating Craft is currently in progress
        if (Craft::$app->getIsInMaintenanceMode()) {
            return;
        }

        // Only want existing fields
        if ($event->isNew) {
            return;
        }

        $field = $event->field;

        // Only proceed if the field handle changed
        if ($field->handle === $field->oldHandle) {
            return;
        }

        $this->modifyFieldContent($field->uid, $field->oldHandle, function($handle, $data) use ($field) {
            $flatData = ArrayHelper::flatten($data);

            // We need to flatten the data to deal with deeply-nested content like when in Matrix/Super Table.
            foreach ($flatData as $flatKey => $flatContent) {
                $searchKey = 'fields.' . $handle;

                // Find from the end of the block path `fields.myLinkField`
                if (str_ends_with($flatKey, $searchKey)) {
                    // Sometimes stored as a JSON string
                    $newKey = str_replace('.' . $field->oldHandle, '.' . $field->handle, $flatKey);

                    ArrayHelper::rename($flatData, $flatKey, $newKey);
                }
            }

            return ArrayHelper::expand($flatData);
        });
    }

    public function onDeleteField(FieldEvent $event): void
    {

    }

    public function modifyFieldContent(string $fieldUid, string $fieldHandle, $callback, $db = null): void
    {
        if ($db) {
            $db = Craft::$app->getDb();
        }

        if (!$this->vizyFields) {
            $this->vizyFields = (new Query())
                ->from('{{%fields}}')
                ->where(['type' => VizyField::class])
                ->all();
        }

        if (!$this->matrixFields) {
            $matrixFields = (new Query())
                ->select(['uid'])
                ->from('{{%fields}}')
                ->where(['type' => Matrix::class])
                ->column();

            foreach ($matrixFields as $uid) {
                if ($matrixField = Craft::$app->getFields()->getFieldByUid($uid)) {
                    foreach ($matrixField->getBlockTypes() as $blockType) {
                        foreach ($blockType->getCustomFields() as $innerField) {
                            $this->matrixFields[] = $uid . ':' . $innerField->uid;
                        }
                    }
                }
            }
        }

        if (!$this->superTableFields && class_exists(SuperTableField::class)) {
            $superTableFields = (new Query())
                ->select(['uid'])
                ->from('{{%fields}}')
                ->where(['type' => SuperTableField::class])
                ->column();

            foreach ($superTableFields as $uid) {
                if ($superTableField = Craft::$app->getFields()->getFieldByUid($uid)) {
                    foreach ($superTableField->getBlockTypes() as $blockType) {
                        foreach ($blockType->getCustomFields() as $innerField) {
                            $this->superTableFields[] = $uid . ':' . $innerField->uid;
                        }
                    }
                }
            }
        }

        $matchedData = [];

        foreach ($this->vizyFields as $vizyField) {
            $settings = Json::decode($vizyField['settings']);

            foreach (($settings['fieldData'] ?? []) as $data) {
                foreach (($data['blockTypes'] ?? []) as $blockType) {
                    foreach (($blockType['layoutConfig']['tabs'] ?? []) as $tab) {
                        foreach (($tab['elements'] ?? []) as $element) {
                            $elementFieldUid = $element['fieldUid'] ?? null;

                            if (in_array($elementFieldUid . ':' . $fieldUid, $this->superTableFields) || in_array($elementFieldUid . ':' . $fieldUid, $this->matrixFields)) {
                                $matchedData[] = [
                                    'vizyFieldUid' => $vizyField['uid'],
                                    'blockTypeId' => $blockType['id'],
                                ];
                            }

                            if ($elementFieldUid === $fieldUid) {
                                $matchedData[] = [
                                    'vizyFieldUid' => $vizyField['uid'],
                                    'blockTypeId' => $blockType['id'],
                                ];
                            }
                        }
                    }
                }
            }
        }
        
        if ($matchedData) {
            foreach ($matchedData as $data) {
                if ($vizyField = Craft::$app->getFields()->getFieldByUid($data['vizyFieldUid'])) {
                    $contentTable = '{{%content}}';
                    $column = ElementHelper::fieldColumn($vizyField->columnPrefix, $vizyField->handle, $vizyField->columnSuffix);

                    // Check if this field is in a Matrix field
                    if (str_contains($vizyField->context, 'matrixBlockType')) {
                        // Get the Matrix field, and the content table
                        $blockTypeUid = explode(':', $vizyField->context)[1];

                        $matrixInfo = (new Query())
                            ->select(['fieldId', 'handle'])
                            ->from('{{%matrixblocktypes}}')
                            ->where(['uid' => $blockTypeUid])
                            ->one();

                        if ($matrixInfo) {
                            $matrixFieldId = $matrixInfo['fieldId'];
                            $matrixBlockTypeHandle = $matrixInfo['handle'];

                            $matrixField = Craft::$app->getFields()->getFieldById($matrixFieldId);

                            if ($matrixField) {
                                $contentTable = $matrixField->contentTable;

                                $column = ElementHelper::fieldColumn($vizyField->columnPrefix, $matrixBlockTypeHandle . '_' . $vizyField->handle, $vizyField->columnSuffix);
                            }
                        }
                    }

                    // Check if this field is in a Super Table field
                    if (str_contains($vizyField->context, 'superTableBlockType')) {
                        // Get the Super Table field, and the content table
                        $blockTypeUid = explode(':', $vizyField->context)[1];

                        $superTableFieldId = (new Query())
                            ->select(['fieldId'])
                            ->from('{{%supertableblocktypes}}')
                            ->where(['uid' => $blockTypeUid])
                            ->scalar();

                        $superTableField = Craft::$app->getFields()->getFieldById($superTableFieldId);

                        if ($superTableField) {
                            $contentTable = $superTableField->contentTable;
                        }
                    }

                    $vizyFieldContent = (new Query())
                        ->select([$column, 'id', 'elementId'])
                        ->from($contentTable)
                        ->where(['not', [$column => null]])
                        ->andWhere(['not', [$column => '']])
                        ->all();

                    foreach ($vizyFieldContent as $row) {
                        $modifiedContent = false;
                        $content = Json::decode($row[$column]);

                        $blockPaths = [];

                        // Find the field and block that matches our content for the field. We use flatten to handle
                        // nested Vizy content with ease with dot-notation get/set.
                        foreach (ArrayHelper::flatten($content) as $flatKey => $flatContent) {
                            $searchKey = 'fields.' . $fieldHandle;

                            if (str_ends_with($flatKey, $searchKey)) {
                                // Only fetch the preceding data, so `0.attrs.values` or `1.attrs.values.content.fields.vizy.0.attrs.values`
                                $blockPaths[] = substr($flatKey, 0, (strrpos($flatKey, 'content.fields') - 1));
                            }
                        }

                        // Some fields might not store their data as JSON-encoded, so filter out and duplicates
                        $blockPaths = array_unique($blockPaths);

                        foreach ($blockPaths as $blockPath) {
                            $values = ArrayHelper::getValue($content, $blockPath, []);
                            $blockTypeId = $values['type'] ?? null;

                            if ($blockTypeId === $data['blockTypeId']) {
                                $newData = $callback($fieldHandle, $values);

                                if ($newData) {
                                    $modifiedContent = true;

                                    ArrayHelper::setValue($content, $blockPath, $newData);
                                }
                            }
                        }

                        if ($modifiedContent) {
                            Db::update($contentTable, [$column => Json::encode($content)], ['id' => $row['id']], [], true, $db);
                        }
                    }
                }
            }
        }
    }

}
