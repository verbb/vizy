<?php
namespace verbb\vizy\migrations;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\ArrayHelper;

use Craft;
use craft\base\FieldInterface;
use craft\db\Migration;
use craft\db\Query;
use craft\fieldlayoutelements\BaseField;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Db;
use craft\helpers\Json;

use yii\base\InvalidArgumentException;

class m250312_000000_craft5 extends Migration
{
    // Properties
    // =========================================================================

    public array $superTableFields = [];
    public array $superTableFieldBlockMap = [];
    public array $vizyFields = [];


    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        // Super Table content needs to be converted to Matrix
        foreach (Craft::$app->getFields()->getAllLayouts() as $layout) {
            foreach ($layout->getCustomFieldElements() as $layoutElement) {
                $field = $layoutElement->getField();

                if (get_class($field) === 'verbb\\supertable\\fields\\SuperTableField') {
                    $this->superTableFields[] = $field;
                }
            }
        }

        // If no Super Table fields, end early
        if (!$this->superTableFields) {
            return true;
        }

        // We also need a blockType vs entryType ID map, saved in Super Table's migration before its migration occurs.
        $superTableFieldBlockMap = Craft::$app->getCache()->get('superTableBlockTypeMap') ?? [];

        if (is_array($superTableFieldBlockMap)) {
            foreach ($superTableFieldBlockMap as $blockId => $entryTypeId) {
                if ($entryType = Craft::$app->getEntries()->getEntryTypeById($entryTypeId)) {
                    $this->superTableFieldBlockMap[$blockId] = $entryType->handle;
                }
            }
        }

        // Without the entry type map, we can't proceed
        if (!$this->superTableFieldBlockMap) {
            return true;
        }

        // Check if any content in any Vizy field needs to be updated
        $this->vizyFields = (new Query())
            ->from('{{%fields}}')
            ->where(['type' => VizyField::class])
            ->all();

        $matchedData = [];

        foreach ($this->vizyFields as $vizyField) {
            $settings = Json::decode($vizyField['settings']);

            foreach (($settings['fieldData'] ?? []) as $data) {
                foreach (($data['blockTypes'] ?? []) as $blockType) {
                    foreach (($blockType['layoutConfig']['tabs'] ?? []) as $tab) {
                        foreach (($tab['elements'] ?? []) as $element) {
                            $elementFieldUid = $element['fieldUid'] ?? null;

                            foreach ($this->superTableFields as $superTableField) {
                                if ($elementFieldUid === $superTableField->uid) {
                                    if ($vizyFieldField = Craft::$app->getFields()->getFieldByUid($vizyField['uid'])) {
                                        $this->processVizyContent($vizyFieldField, $blockType, $superTableField);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return true;
    }

    public function safeDown(): bool
    {
        echo "m250312_000000_craft5 cannot be reverted.\n";

        return false;
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

    protected function processVizyContent(VizyField $vizyField, array $blockType, $superTableField): void
    {
        // We have to use field instances, not just the field
        foreach ($this->findFieldUsages($vizyField) as $fieldLayoutUid) {
            // Find content rows for each field instance
            $sql = Craft::$app->getDb()->getQueryBuilder()->jsonExtract('content', [$fieldLayoutUid]);

            $rows = (new Query())
                ->select(['content', 'id', 'elementId'])
                ->from('{{%elements_sites}}')
                ->where([
                    'and',
                    ['not', ['content' => null]],
                    $sql . ' IS NOT NULL',
                ])
                ->all();

            foreach ($rows as $row) {
                $elementContent = Json::decode($row['content']) ?? [];
                $fieldContent = Json::decode($elementContent[$fieldLayoutUid] ?? '') ?? [];

                $modifiedContent = false;
                $blockPaths = [];

                // Find the field and block that matches our content for the field. We use flatten to handle
                // nested Vizy content with ease with dot-notation get/set.
                foreach (ArrayHelper::flatten($fieldContent) as $flatKey => $flatContent) {
                    $searchKey = 'content.fields.' . $superTableField->handle;

                    if (str_contains($flatKey, $searchKey)) {
                        // Only fetch the preceding data, so `0.attrs.values` or `1.attrs.values.content.fields.vizy.0.attrs.values`
                        $blockPaths[] = substr($flatKey, 0, (strrpos($flatKey, 'content.fields') - 1));
                    }
                }

                // Some fields might not store their data as JSON-encoded, so filter out and duplicates
                $blockPaths = array_unique($blockPaths);

                foreach ($blockPaths as $blockPath) {
                    $values = ArrayHelper::getValue($fieldContent, $blockPath, []);
                    $blockTypeId = $values['type'] ?? null;

                    if ($blockTypeId === $blockType['id']) {
                        $superTableBlocks = $values['content']['fields'][$superTableField->handle] ?? [];

                        foreach ($superTableBlocks as $superTableBlockKey => $superTableBlock) {
                            $superTableBlockTypeId = $superTableBlock['type'] ?? null;

                            // If the `type` is stored in the Craft 4 way (ID) swap it with the handle
                            if (is_int($superTableBlockTypeId)) {
                                $modifiedContent = true;

                                $superTableBlocks[$superTableBlockKey]['type'] = $this->superTableFieldBlockMap[$superTableBlockTypeId] ?? null;
                                $superTableBlocks[$superTableBlockKey]['enabled'] = true;
                                $superTableBlocks[$superTableBlockKey]['collapsed'] = false;
                            }
                        }

                        $values['content']['fields'][$superTableField->handle] = $superTableBlocks;

                        ArrayHelper::setValue($fieldContent, $blockPath, $values);
                    }
                }

                if ($modifiedContent) {
                    $elementContent[$fieldLayoutUid] = Json::encode($fieldContent);

                    $this->update('{{%elements_sites}}', ['content' => $elementContent], ['id' => $row['id']]);
                }
            }
        }
    }
}
