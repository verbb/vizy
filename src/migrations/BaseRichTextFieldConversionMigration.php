<?php
namespace verbb\vizy\migrations;

use verbb\vizy\Vizy;

use craft\db\Migration;
use craft\helpers\Json;

/**
 * Base class for deployable CKEditor and Redactor field conversion migrations.
 */
abstract class BaseRichTextFieldConversionMigration extends Migration
{
    // Properties
    // =========================================================================

    public string $fieldUid;
    public string $sourceType;
    public string $editorConfig;
    public string $editorConfigHash;
    public string $locationMapHash;
    public string $planHash;
    public array $locationMap;
    public bool $strict = true;


    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        $result = Vizy::$plugin->getRichTextConversions()->apply([
            'version' => 1,
            'fieldUid' => $this->fieldUid,
            'sourceType' => $this->sourceType,
            'editorConfig' => $this->editorConfig,
            'editorConfigHash' => $this->editorConfigHash,
            'locationMapHash' => $this->locationMapHash,
            'locationMap' => $this->locationMap,
            'planHash' => $this->planHash,
            'strict' => $this->strict,
        ]);
        echo Json::encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";

        return true;
    }

    public function safeDown(): bool
    {
        echo "Vizy rich-text field conversions must be restored from their recovery checkpoints.\n";
        return false;
    }
}
