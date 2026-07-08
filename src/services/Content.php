<?php
namespace verbb\vizy\services;

use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\ArrayHelper;

use Craft;
use craft\base\Component;
use craft\base\FieldInterface;
use craft\db\Query;
use craft\events\FieldEvent;
use craft\fields\Matrix;
use craft\fieldlayoutelements\BaseField;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Db;
use craft\helpers\ElementHelper;
use craft\helpers\Json;

use yii\base\InvalidArgumentException;

class Content extends Component
{
    // Properties
    // =========================================================================

    protected array $vizyFields = []; 


    // Public Methods
    // =========================================================================

    public function modifyFieldContent(string $fieldUid, string $fieldHandle, $callback, $db = null): void
    {
        $db = $db ?: Craft::$app->getDb();

        if (!$this->vizyFields) {
            $this->vizyFields = (new Query())
                ->from('{{%fields}}')
                ->where(['type' => VizyField::class])
                ->all($db);
        }

        $matchedData = [];

        foreach ($this->vizyFields as $vizyField) {
            $settings = Json::decode($vizyField['settings']);

            foreach (($settings['fieldData'] ?? []) as $data) {
                foreach (($data['blockTypes'] ?? []) as $blockType) {
                    foreach (($blockType['layoutConfig']['tabs'] ?? []) as $tab) {
                        foreach (($tab['elements'] ?? []) as $element) {
                            $elementFieldUid = $element['fieldUid'] ?? null;

                            if ($elementFieldUid === $fieldUid) {
                                // Craft 5 stores block field content keyed by the field-layout element UID.
                                // Older content may still be keyed by the field handle or the field UID, so
                                // collect every possible key to match against when locating the block content.
                                $searchKeys = array_values(array_unique(array_filter([
                                    $element['uid'] ?? null,
                                    $fieldUid,
                                    $fieldHandle,
                                ])));

                                $matchedData[] = [
                                    'vizyFieldUid' => $vizyField['uid'],
                                    'blockTypeId' => $blockType['id'],
                                    'searchKeys' => $searchKeys,
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
                    // We have to use field instances, not just the field
                    foreach ($this->findFieldUsages($vizyField) as $fieldLayoutUid) {
                        // Find content rows for each field instance
                        $sql = $db->getQueryBuilder()->jsonExtract('content', [$fieldLayoutUid]);

                        $rows = (new Query())
                            ->select(['content', 'id', 'elementId'])
                            ->from('{{%elements_sites}}')
                            ->where([
                                'and',
                                ['not', ['content' => null]],
                                $sql . ' IS NOT NULL',
                            ])
                            ->all($db);

                        foreach ($rows as $row) {
                            $elementContent = Json::decode($row['content']) ?? [];
                            $fieldContent = Json::decode($elementContent[$fieldLayoutUid] ?? '') ?? [];

                            $modifiedContent = false;
                            $blockPaths = [];

                            // Find the field and block that matches our content for the field. We use flatten to handle
                            // nested Vizy content with ease with dot-notation get/set.
                            foreach (ArrayHelper::flatten($fieldContent) as $flatKey => $flatContent) {
                                foreach ($data['searchKeys'] as $searchKey) {
                                    if (str_ends_with($flatKey, 'fields.' . $searchKey)) {
                                        // Only fetch the preceding data, so `0.attrs.values` or `1.attrs.values.content.fields.vizy.0.attrs.values`
                                        $blockPaths[] = substr($flatKey, 0, (strrpos($flatKey, 'content.fields') - 1));

                                        break;
                                    }
                                }
                            }

                            // Some fields might not store their data as JSON-encoded, so filter out and duplicates
                            $blockPaths = array_unique($blockPaths);

                            foreach ($blockPaths as $blockPath) {
                                $values = ArrayHelper::getValue($fieldContent, $blockPath, []);
                                $blockTypeId = $values['type'] ?? null;

                                if ($blockTypeId === $data['blockTypeId']) {
                                    $newData = $callback($fieldHandle, $values);

                                    if ($newData) {
                                        $modifiedContent = true;

                                        ArrayHelper::setValue($fieldContent, $blockPath, $newData);
                                    }
                                }
                            }

                            if ($modifiedContent) {
                                // The inner Vizy field content is stored as a JSON-encoded string, but the outer
                                // `content` column is a JSON column. Pass the decoded array (not a pre-encoded
                                // string) so Craft encodes it once, otherwise the value is double-encoded.
                                $elementContent[$fieldLayoutUid] = Json::encode($fieldContent);

                                Db::update('{{%elements_sites}}', ['content' => $elementContent], ['id' => $row['id']], db: $db);
                            }
                        }
                    }
                }
            }
        }
    }


    // Protected Methods
    // =========================================================================

    protected function findFieldUsages(FieldInterface $field): array
    {
        $uids = [];

        foreach (Craft::$app->getFields()->getAllLayouts() as $layout) {
            try {
                $fieldLayoutField = $layout->getField(fn(BaseField $layoutField) => (
                    $layoutField instanceof CustomField && $layoutField->getFieldUid() === $field->uid
                ));

                if ($fieldLayoutField) {
                    $uids[] = $fieldLayoutField->uid;
                }
            } catch (InvalidArgumentException) {

            }
        }

        return $uids;
    }

}
