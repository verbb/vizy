<?php
namespace verbb\vizy\migrations;

use verbb\vizy\Vizy;
use verbb\vizy\records\SchemaPromotion;
use verbb\vizy\services\EditorConfigs;

use Craft;
use craft\db\Migration;
use craft\helpers\Json;

/**
 * Restore the always-on Vizy 3 mark only where an upgrade still owns the config.
 */
final class m261105_000000_legacy_text_style_configs extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        $configs = Vizy::$plugin->getEditorConfigs();
        $projectConfig = Craft::$app->getProjectConfig();

        foreach (SchemaPromotion::find()->where(['status' => 'complete'])->each() as $promotion) {
            $plan = Json::decode($promotion->planJson);

            foreach ($plan['fields'] ?? [] as $fieldPlan) {
                $id = $fieldPlan['canonicalFieldSettings']['editorConfig'] ?? null;
                $fingerprint = $fieldPlan['editorConfigFingerprint'] ?? null;

                // An empty selection used the seeded Standard config. Freeze its
                // original payload here so future default changes cannot widen the repair.
                if ($id === '') {
                    $id = EditorConfigs::DEFAULT_ID;
                    $fingerprint = $configs->fingerprintAuthorable($this->_legacyStandardConfig());
                }

                if (!is_string($id) || !is_string($fingerprint)) {
                    continue;
                }

                $path = EditorConfigs::PROJECT_CONFIG_PATH . '.' . $id;
                $stored = $projectConfig->get($path);

                // File configs are converted on read. Never create a PC override,
                // recreate a deleted config, or infer ownership from an imported-* ID.
                if (!is_array($stored) || in_array('textStyle', $stored['capabilities']['marks'] ?? [], true)) {
                    continue;
                }

                if (!hash_equals($fingerprint, $configs->fingerprintAuthorable($stored))) {
                    continue;
                }

                // Change just the omitted capability; retain all other stored settings
                // and leave the immutable promotion plan/fingerprint untouched.
                $marks = $stored['capabilities']['marks'] ?? [];
                $marks[] = 'textStyle';
                $projectConfig->set($path . '.capabilities.marks', $marks);
                $configs->invalidate();
            }
        }

        return true;
    }

    public function safeDown(): bool
    {
        // Authors may have used the restored capability since this migration.
        return false;
    }


    // Private Methods
    // =========================================================================

    private function _legacyStandardConfig(): array
    {
        return [
            'label' => 'Standard',
            'capabilities' => [
                'nodes' => ['heading', 'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'horizontalRule', 'image', 'table'],
                'marks' => ['bold', 'italic', 'link'],
            ],
            'headings' => ['levels' => [2, 3, 4]],
            'toolbar' => ['addBlock', 'dropdown:formatting', 'bold', 'italic', 'link'],
            'bubble' => ['enabled' => true, 'items' => ['bold', 'italic', 'link']],
            'gutterInsert' => true,
            'slashInsert' => true,
        ];
    }
}
