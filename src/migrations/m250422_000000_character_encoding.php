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
    // Public Methods
    // =========================================================================

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

        $antiXss = new AntiXSS();

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

                // Iterate through each string in the data structure to switch HTML entities to Vizy handling and clean.
                $newValue = $this->_sanitizeArrayRecursive(Json::decode($currentValue), $antiXss);
                $newValue = Json::encode($newValue);

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


    // Private Methods
    // =========================================================================

    private function _sanitizeArrayRecursive(array $data, AntiXSS $antiXss): array
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = $this->_sanitizeArrayRecursive($value, $antiXss);
            } else if (is_string($value)) {
                // Ensure that HTML entities are decoded for saving
                $value = $this->_safeHtmlEntityDecode($value);

                // Clean up each string, must be done recursively, otherwise a JSON-encoded string won't be cleaned properly.
                $data[$key] = $antiXss->xss_clean($value);
            }
        }

        return $data;
    }

    private function _safeHtmlEntityDecode(string $value): string
    {
        return preg_replace_callback('/&#(\d+);|&#x([a-fA-F0-9]+);|&[a-zA-Z0-9#]+;/', function ($matches) {
            // Determine numeric code point
            if (!empty($matches[1])) {
                $codePoint = (int) $matches[1];
            } elseif (!empty($matches[2])) {
                $codePoint = hexdec($matches[2]);
            } else {
                // Named entity - decode and get first character
                $decoded = html_entity_decode($matches[0], ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $codePoint = mb_ord($decoded, 'UTF-8');
            }

            // If code point is safe (U+0000 to U+FFFF), decode it
            if ($codePoint <= 0xFFFF) {
                return html_entity_decode($matches[0], ENT_QUOTES | ENT_HTML5, 'UTF-8');
            }

            // Otherwise, return the original encoded entity
            return $matches[0];
        }, $value);
    }
}
