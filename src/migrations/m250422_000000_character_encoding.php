<?php
namespace verbb\vizy\migrations;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Plugin;

use Craft;
use craft\db\Migration;
use craft\db\Query;
use craft\fields\Matrix;
use craft\helpers\ArrayHelper;
use craft\helpers\Db;
use craft\helpers\ElementHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;

use verbb\supertable\fields\SuperTableField;

use voku\helper\AntiXSS;

class m250422_000000_character_encoding extends Migration
{
    public function safeUp()
    {
        $data = [];

        foreach (Craft::$app->getFields()->getAllFields() as $field) {
            if ($field instanceof VizyField) {
                $data[] = [
                    'contentTable' => '{{%content}}',
                    'column' => ElementHelper::fieldColumn($field->columnPrefix, $field->handle, $field->columnSuffix),
                    'field' => $field,
                ];
            }

            if ($field instanceof Matrix) {
                foreach ($field->getBlockTypes() as $blockType) {
                    foreach ($blockType->getCustomFields() as $innerField) {
                        if ($innerField instanceof VizyField) {
                            $data[] = [
                                'contentTable' => $field->contentTable,
                                'column' => ElementHelper::fieldColumn($innerField->columnPrefix, $blockType->handle, $innerField->columnSuffix, $innerField->handle),
                                'field' => $innerField,
                            ];
                        }
                    }
                }
            }

            if (Plugin::isPluginInstalledAndEnabled('super-table')) {
                if ($field instanceof SuperTableField) {
                    foreach ($field->getBlockTypes() as $blockType) {
                        foreach ($blockType->getCustomFields() as $innerField) {
                            if ($innerField instanceof VizyField) {
                                $data[] = [
                                    'contentTable' => $field->contentTable,
                                    'column' => ElementHelper::fieldColumn($innerField->columnPrefix, $innerField->handle, $innerField->columnSuffix),
                                    'field' => $innerField,
                                ];
                            }
                        }
                    }
                }
            }
        }

        foreach ($data as $d) {
            $contentRows = (new Query())
                ->select(['id', $d['column'] . ' AS value'])
                ->from($d['contentTable'])
                ->all();

            foreach ($contentRows as $contentRow) {
                $currentValue = $contentRow['value'];

                if (!($currentValue)) {
                    continue;
                }

                if (!Json::isJsonObject($currentValue)) {
                    continue;
                }

                // Ensure that HTML entities are decoded for saving, and cleaned - this reflects Vizy 2 handling.
                $newValue = html_entity_decode($currentValue);

                $antiXss = new AntiXSS();
                $newValue = $antiXss->xss_clean((string)$newValue);

                if ($currentValue === $newValue) {
                    continue;
                }

                // Only update content if it's changed
                $this->update($d['contentTable'], [$d['column'] => $newValue], ['id' => $contentRow['id']]);
            }
        }

        return true;

    }

    public function safeDown()
    {
        echo "m250422_000000_character_encoding cannot be reverted.\n";
        return false;
    }
}
