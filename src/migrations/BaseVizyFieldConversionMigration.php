<?php
namespace verbb\vizy\migrations;

use verbb\vizy\Vizy;

use Craft;
use craft\db\Migration;
use craft\helpers\Json;

/**
 * Base class for deployable conversions from Vizy to portable field types.
 */
abstract class BaseVizyFieldConversionMigration extends Migration
{
    // Properties
    // =========================================================================

    public string $sourceFieldUid;
    public string $destinationFieldUid;
    public string $sourceSettingsHash;
    public string $targetId;
    public string $targetType;
    public string $targetSettingsHash;
    public string $sourceLocationMapHash;
    public string $destinationLocationMapHash;
    public string $planHash;
    public array $sourceSettings;
    public array $targetSettings;
    public array $sourceLocationMap;
    public array $placementMap;
    public bool $strict = true;


    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        $result = Vizy::$plugin->getRichTextConversions()->applyFromVizy([
            'version' => 3,
            'sourceFieldUid' => $this->sourceFieldUid,
            'destinationFieldUid' => $this->destinationFieldUid,
            'sourceSettings' => $this->sourceSettings,
            'sourceSettingsHash' => $this->sourceSettingsHash,
            'targetId' => $this->targetId,
            'targetType' => $this->targetType,
            'targetSettings' => $this->targetSettings,
            'targetSettingsHash' => $this->targetSettingsHash,
            'sourceLocationMapHash' => $this->sourceLocationMapHash,
            'destinationLocationMapHash' => $this->destinationLocationMapHash,
            'sourceLocationMap' => $this->sourceLocationMap,
            'placementMap' => $this->placementMap,
            'planHash' => $this->planHash,
            'strict' => $this->strict,
        ]);

        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            echo Json::encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
        }

        return true;
    }

    public function safeDown(): bool
    {
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            echo "Outbound Vizy copies are not reversed automatically; the source Vizy field remains unchanged.\n";
        }

        return false;
    }
}
