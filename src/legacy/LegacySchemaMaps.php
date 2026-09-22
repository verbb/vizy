<?php
namespace verbb\vizy\legacy;

use Craft;
use craft\base\Component;
use craft\helpers\ProjectConfig as ProjectConfigHelper;

/**
 * Focused loader for immutable Vizy 3 promotion provenance.
 */
final class LegacySchemaMaps extends Component
{
    // Constants
    // =========================================================================

    public const PROJECT_CONFIG_PATH = 'plugins.vizy.legacy.schemaPromotions';


    // Properties
    // =========================================================================

    private array $cache = [];


    // Public Methods
    // =========================================================================

    public function getSchemaMap(string $fieldUid): ?array
    {
        $provenance = $this->getProvenance($fieldUid);
        if ($provenance === []) {
            return null;
        }

        // Rich-text-only promotions store schemaMap:[]. Craft Project Config often omits
        // empty arrays on write — treat a missing key as [] when provenance exists.
        $schemaMap = $provenance['schemaMap'] ?? [];

        return is_array($schemaMap) ? $schemaMap : null;
    }

    public function getProvenance(string $fieldUid): array
    {
        if (!array_key_exists($fieldUid, $this->cache)) {
            $value = Craft::$app->getProjectConfig()->get(self::PROJECT_CONFIG_PATH . '.' . $fieldUid);
            if (is_array($value)) {
                $value = ProjectConfigHelper::unpackAssociativeArrays($value);
                // Keep in-memory / compare shape aligned with saveProvenance payloads.
                if (!array_key_exists('schemaMap', $value) || !is_array($value['schemaMap'])) {
                    $value['schemaMap'] = [];
                }
                $this->cache[$fieldUid] = $value;
            } else {
                $this->cache[$fieldUid] = null;
            }
        }

        return $this->cache[$fieldUid] ?? [];
    }

    /**
     * Persists one approved immutable field plan. A retry may repeat the exact
     * payload, but changing provenance requires an explicit removal/re-plan.
     */
    public function saveProvenance(string $fieldUid, array $fieldPlan): void
    {
        if (($fieldPlan['fieldUid'] ?? null) !== $fieldUid) {
            throw new \InvalidArgumentException('Vizy 3 upgrade mapping field UID does not match its Project Config key.');
        }
        $schemaMap = $fieldPlan['schemaMap'] ?? null;
        if (!is_array($schemaMap)) {
            throw new \InvalidArgumentException('Vizy 3 upgrade mapping requires a complete schemaMap.');
        }
        $this->_assertSchemaMap($schemaMap);

        $payload = [
            'version' => 1,
            'sourceFingerprint' => (string)($fieldPlan['sourceFingerprint'] ?? ''),
            'schemaMap' => $schemaMap,
            'rootPolicy' => $fieldPlan['canonicalFieldSettings']['rootContentType'] ?? null,
            'blockTypePickerGroups' => $fieldPlan['canonicalFieldSettings']['blockTypePickerGroups'] ?? [],
            'uidMapping' => $fieldPlan['uidMapping'] ?? [],
        ];
        $existing = $this->getProvenance($fieldUid);
        if ($existing !== [] && $existing !== $payload) {
            throw new \RuntimeException("Vizy 3 upgrade mapping for Vizy field {$fieldUid} is immutable.");
        }
        if ($existing === []) {
            Craft::$app->getProjectConfig()->set(
                self::PROJECT_CONFIG_PATH . '.' . $fieldUid,
                ProjectConfigHelper::packAssociativeArrays($payload),
            );
        }
        $this->cache[$fieldUid] = $payload;
    }


    // Private Methods
    // =========================================================================

    private function _assertSchemaMap(array $schemaMap): void
    {
        foreach ($schemaMap as $legacyTypeId => $mapping) {
            if (
                !is_string($legacyTypeId)
                || $legacyTypeId === ''
                || !is_array($mapping)
                || !is_string($mapping['blockTypeUid'] ?? null)
                || $mapping['blockTypeUid'] === ''
                || !is_array($mapping['placementUids'] ?? null)
            ) {
                throw new \InvalidArgumentException('Vizy 3 upgrade schemaMap contains an incomplete Block Type mapping.');
            }
            foreach ($mapping['placementUids'] as $legacyKey => $placementUid) {
                if (!is_string($legacyKey) || $legacyKey === '' || !is_string($placementUid) || $placementUid === '') {
                    throw new \InvalidArgumentException('Vizy 3 upgrade schemaMap contains an incomplete placement mapping.');
                }
            }
        }
    }
}
