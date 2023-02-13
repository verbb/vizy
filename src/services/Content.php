<?php
namespace verbb\vizy\services;

use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\Component;
use craft\db\Query;
use craft\helpers\ArrayHelper;
use craft\helpers\Db;
use craft\helpers\ElementHelper;
use craft\helpers\Json;

class Content extends Component
{
    // Properties
    // =========================================================================

    protected array $vizyFields = []; 


    // Public Methods
    // =========================================================================

    public function modifyFieldContent($fieldUid, $callback, $db = null): void
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

        $matchedData = [];

        foreach ($vizyFields as $vizyField) {
            $settings = Json::decode($vizyField['settings']);

            foreach (($settings['fieldData'] ?? []) as $data) {
                foreach (($data['blockTypes'] ?? []) as $blockType) {
                    foreach (($blockType['layoutConfig']['tabs'] ?? []) as $tab) {
                        foreach (($tab['elements'] ?? []) as $element) {
                            $elementFieldUid = $element['fieldUid'] ?? null;

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
            if ($targetField = Craft::$app->getFields()->getFieldByUid($fieldUid)) {
                foreach ($matchedData as $key => $data) {
                    if ($vizyField = Craft::$app->getFields()->getFieldByUid($data['vizyFieldUid'])) {
                        $contentTable = '{{%content}}';
                        $column = ElementHelper::fieldColumn($vizyField->columnPrefix, $vizyField->handle, $vizyField->columnSuffix);

                        // Check if this field is in a Matrix field
                        if (strstr($vizyField->context, 'matrixBlockType')) {
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

                                $matrixField = Craft::$app->getFields()->getFieldById($matrixFieldId, false);

                                if ($matrixField) {
                                    $contentTable = $matrixField->contentTable;

                                    $column = ElementHelper::fieldColumn($vizyField->columnPrefix, $matrixBlockTypeHandle . '_' . $vizyField->handle, $vizyField->columnSuffix);
                                }
                            }
                        }

                        // Check if this field is in a Super Table field
                        if (strstr($vizyField->context, 'superTableBlockType')) {
                            // Get the Super Table field, and the content table
                            $blockTypeUid = explode(':', $vizyField->context)[1];

                            $superTableFieldId = (new Query())
                                ->select(['fieldId'])
                                ->from('{{%supertableblocktypes}}')
                                ->where(['uid' => $blockTypeUid])
                                ->scalar();

                            $superTableField = Craft::$app->getFields()->getFieldById($superTableFieldId, false);

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
                            foreach (self::flatten($content) as $flatKey => $flatContent) {
                                $searchKey = 'content.fields.' . $targetField->handle;

                                if (strstr($flatKey, $searchKey)) {
                                    // Only fetch the preceeding data, so `0.attrs.values` or `1.attrs.values.content.fields.vizy.0.attrs.values`
                                    $blockPaths[] = substr($flatKey, 0, (strpos($flatKey, $searchKey) - 1));
                                }
                            }

                            // Some fields might not store their data as JSON-encoded, so filter out and duplicates
                            $blockPaths = array_unique($blockPaths);

                            foreach ($blockPaths as $blockPath) {
                                $values = ArrayHelper::getValue($content, $blockPath, []);
                                $blockTypeId = $values['type'] ?? null;

                                if ($blockTypeId === $data['blockTypeId']) {
                                    $newData = $callback($targetField->handle, $values);

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

    public static function flatten(array $data, string $separator = '.'): array
    {
        $result = [];
        $stack = [];
        $path = '';

        reset($data);
        while (!empty($data)) {
            $key = key($data);
            $element = $data[$key];
            unset($data[$key]);

            if (is_array($element) && !empty($element)) {
                if (!empty($data)) {
                    $stack[] = [$data, $path];
                }
                $data = $element;
                reset($data);
                $path .= $key . $separator;
            } else {
                $result[$path . $key] = $element;
            }

            if (empty($data) && !empty($stack)) {
                [$data, $path] = array_pop($stack);
                reset($data);
            }
        }

        return $result;
    }

}
