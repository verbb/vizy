<?php
namespace verbb\vizy\deprecations;

use Craft;
use craft\helpers\Json;

/**
 * Vizy 3 field settings retained only for schema promotion / migration tooling.
 *
 * Canonical fields use `editorConfig` + `blockTypePickerGroups`. These getters
 * and setters are intentionally absent from `getSettings()` export. Removed in
 * Vizy 5 once promotion no longer needs them.
 */
trait VizyFieldLegacySettingsDeprecations
{
    // Properties
    // =========================================================================

    private array $_legacyFieldData = [];
    private string $_legacyVizyConfig = '';
    private string $_legacyConfigSelectionMode = 'choose';
    private string $_legacyManualConfig = '';
    private static array $_legacySettingWarned = [];


    // Public Methods
    // =========================================================================

    public function getFieldData(): array
    {
        $this->_warnLegacySetting('getFieldData', 'VizyField::getFieldData() is deprecated. Vizy 3 migration tooling only; use global Block Types + blockTypePickerGroups. It will be removed in Vizy 5.');
        return $this->_legacyFieldData;
    }

    public function setFieldData(mixed $value): void
    {
        $this->_warnLegacySetting('setFieldData', 'VizyField::setFieldData() is deprecated. Vizy 3 migration tooling only. It will be removed in Vizy 5.');
        $decoded = Json::decodeIfJson($value);
        $this->_legacyFieldData = is_array($decoded) ? $decoded : [];
    }

    public function getVizyConfig(): string
    {
        $this->_warnLegacySetting('getVizyConfig', 'VizyField::getVizyConfig() is deprecated. Use editorConfig. It will be removed in Vizy 5.');
        return $this->_legacyVizyConfig;
    }

    public function setVizyConfig(string $value): void
    {
        $this->_warnLegacySetting('setVizyConfig', 'VizyField::setVizyConfig() is deprecated. Use editorConfig. It will be removed in Vizy 5.');
        $this->_legacyVizyConfig = $value;
    }

    public function getConfigSelectionMode(): string
    {
        $this->_warnLegacySetting('getConfigSelectionMode', 'VizyField::getConfigSelectionMode() is deprecated. Inline Editor Config is not canonical. It will be removed in Vizy 5.');
        return $this->_legacyConfigSelectionMode;
    }

    public function setConfigSelectionMode(string $value): void
    {
        $this->_warnLegacySetting('setConfigSelectionMode', 'VizyField::setConfigSelectionMode() is deprecated. Inline Editor Config is not canonical. It will be removed in Vizy 5.');
        $this->_legacyConfigSelectionMode = $value;
    }

    public function getManualConfig(): string
    {
        $this->_warnLegacySetting('getManualConfig', 'VizyField::getManualConfig() is deprecated. Inline Editor Config is not canonical. It will be removed in Vizy 5.');
        return $this->_legacyManualConfig;
    }

    public function setManualConfig(string $value): void
    {
        $this->_warnLegacySetting('setManualConfig', 'VizyField::setManualConfig() is deprecated. Inline Editor Config is not canonical. It will be removed in Vizy 5.');
        $this->_legacyManualConfig = $value;
    }


    // Private Methods
    // =========================================================================

    private function _warnLegacySetting(string $method, string $message): void
    {
        if (isset(self::$_legacySettingWarned[$method])) {
            return;
        }
        self::$_legacySettingWarned[$method] = true;
        Craft::$app->getDeprecator()->log("verbb\\vizy\\fields\\VizyField::{$method}", $message);
    }
}
