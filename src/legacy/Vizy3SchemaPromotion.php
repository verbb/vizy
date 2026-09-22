<?php
namespace verbb\vizy\legacy;

use verbb\vizy\document\DeterministicUidFactory;
use verbb\vizy\fields\VizyField;

use craft\fieldlayoutelements\CustomField;
use craft\helpers\Json;

/**
 * Read-only Vizy 3 field-local schema analysis and deterministic planning.
 */
final class Vizy3SchemaPromotion
{
    // Public Methods
    // =========================================================================

    public function analyze(
        array $fieldConfigs,
        array $existingBlockTypes = [],
        array $targetHandles = [],
    ): array {
        ksort($fieldConfigs);
        $diagnostics = [];
        $plans = [];
        $claimedSchemaUids = array_fill_keys(array_keys($existingBlockTypes), 'globalBlockType');
        $claimedHandles = [];
        foreach ($existingBlockTypes as $uid => $config) {
            if (is_string($config['handle'] ?? null)) {
                $claimedHandles[strtolower($config['handle'])][] = "global:{$uid}";
            }
        }

        foreach ($fieldConfigs as $fieldUid => $fieldConfig) {
            if (($fieldConfig['type'] ?? null) !== VizyField::class) {
                continue;
            }
            $settings = is_array($fieldConfig['settings'] ?? null) ? $fieldConfig['settings'] : [];
            // Canonical Vizy 4 fields carry blockTypePickerGroups and no fieldData.
            if (!array_key_exists('fieldData', $settings) && array_key_exists('blockTypePickerGroups', $settings)) {
                // Already-canonical fields are outside the legacy promotion set.
                continue;
            }
            // Vizy 3 rich-text fields often omit fieldData entirely (Craft PC drops empty
            // arrays). Treat a missing key as an empty group list so prose-only fields promote.
            $fieldData = array_key_exists('fieldData', $settings) ? $settings['fieldData'] : [];
            if (!is_array($fieldData) || !array_is_list($fieldData)) {
                $this->_diagnostic($diagnostics, 'invalidFieldData', 'error', $fieldUid, 'Vizy 3 fieldData must be a group list.');
                continue;
            }

            $factory = new DeterministicUidFactory("vizy3-schema-promotion:{$fieldUid}");
            $editorPlan = (new ManualEditorConfigMigrator())->plan($settings, $fieldUid);
            foreach ($editorPlan['diagnostics'] as $diagnostic) {
                $diagnostics[] = $diagnostic;
            }
            $fieldPlan = [
                'fieldUid' => $fieldUid,
                'sourceFingerprint' => $this->_fingerprint($fieldData),
                'blockTypes' => [],
                'schemaMap' => [],
                'canonicalFieldSettings' => [
                    'rootContentType' => $this->_rootPolicy($settings, $fieldUid, $diagnostics),
                    'blockTypePickerGroups' => [],
                    'editorConfig' => $editorPlan['editorConfig'],
                    'minBlocks' => $this->_nullableInt($settings['minBlocks'] ?? null),
                    'maxBlocks' => $this->_nullableInt($settings['maxBlocks'] ?? null),
                ],
            ];
            if ($editorPlan['mint'] !== null) {
                $fieldPlan['editorConfigMint'] = $editorPlan['mint'];
            }
            if ($editorPlan['fingerprint'] !== null) {
                $fieldPlan['editorConfigFingerprint'] = $editorPlan['fingerprint'];
            }
            $legacyIds = [];

            foreach ($fieldData as $groupIndex => $group) {
                if (!is_array($group) || !is_array($group['blockTypes'] ?? null) || !array_is_list($group['blockTypes'])) {
                    $this->_diagnostic($diagnostics, 'invalidBlockGroup', 'error', "{$fieldUid}.groups.{$groupIndex}", 'Block groups require a blockTypes list.');
                    continue;
                }
                $allowed = [];
                $disabled = [];
                foreach ($group['blockTypes'] as $typeIndex => $legacyType) {
                    $location = "{$fieldUid}.groups.{$groupIndex}.blockTypes.{$typeIndex}";
                    if (!is_array($legacyType)) {
                        $this->_diagnostic($diagnostics, 'invalidBlockType', 'error', $location, 'Block Type data must be an object.');
                        continue;
                    }
                    $legacyId = $legacyType['id'] ?? null;
                    if (!is_string($legacyId) || $legacyId === '') {
                        $this->_diagnostic($diagnostics, 'missingLegacyTypeId', 'error', $location, 'A legacy Block Type ID is required.');
                        continue;
                    }
                    if (isset($legacyIds[$legacyId])) {
                        $this->_diagnostic($diagnostics, 'duplicateLegacyTypeId', 'error', $location, "Legacy Block Type ID {$legacyId} occurs more than once in the field.");
                        continue;
                    }
                    $legacyIds[$legacyId] = true;

                    $targetUid = $this->_claimUid(
                        $this->_validUuid($legacyId) ? $legacyId : null,
                        $factory,
                        "blockType:{$legacyId}",
                        $claimedSchemaUids,
                        $diagnostics,
                        $location,
                        'blockType',
                    );
                    $handleKey = "{$fieldUid}:{$legacyId}";
                    $sourceHandle = is_string($legacyType['handle'] ?? null) ? $legacyType['handle'] : '';
                    $targetHandle = $targetHandles[$handleKey] ?? $sourceHandle;
                    if (!$this->_validHandle($targetHandle)) {
                        $this->_diagnostic($diagnostics, 'invalidTargetHandle', 'error', $location, "Block Type {$legacyId} requires an explicit valid target handle.");
                    }
                    $claimedHandles[strtolower($targetHandle)][] = $handleKey;

                    [$layoutConfig, $placementMap] = $this->_promoteLayout(
                        $legacyType,
                        $fieldConfigs,
                        $factory,
                        $claimedSchemaUids,
                        $diagnostics,
                        $location,
                    );
                    if (($legacyType['minBlocks'] ?? null) !== null || ($legacyType['maxBlocks'] ?? null) !== null) {
                        $this->_diagnostic(
                            $diagnostics,
                            'legacyTypeCardinalityRequiresDecision',
                            'error',
                            $location,
                            'Per-Block-Type root cardinality has no canonical Vizy 4 equivalent.',
                        );
                    }

                    $fieldPlan['blockTypes'][$legacyId] = [
                        'uid' => $targetUid,
                        'config' => [
                            'name' => (string)($legacyType['name'] ?? ''),
                            'handle' => $targetHandle,
                            'icon' => $legacyType['icon'] ?? null,
                            'template' => $legacyType['template'] ?? null,
                            // No `contentAreas` key: Vizy 3 Block Types have no
                            // Content Areas, and in Vizy 4 they would live inside
                            // `fieldLayout` as layout elements anyway. Matrix and
                            // nested-Vizy promotion mint them into the layout.
                            'fieldLayout' => $layoutConfig,
                        ],
                    ];
                    $fieldPlan['schemaMap'][$legacyId] = [
                        'blockTypeUid' => $targetUid,
                        'placementUids' => $placementMap,
                    ];
                    if (($settings['editorMode'] ?? VizyField::MODE_COMBINED) !== VizyField::MODE_RICH_TEXT) {
                        // Disabled types still own existing content; only insertion is disabled.
                        $allowed[] = $targetUid;
                        if (($legacyType['enabled'] ?? true) !== true) {
                            $disabled[] = $targetUid;
                        }
                    }
                }

                if ($allowed !== []) {
                    $fieldPlan['canonicalFieldSettings']['blockTypePickerGroups'][] = [
                        'name' => (string)($group['name'] ?? ''),
                        'blockTypeUids' => $allowed,
                        ...($disabled !== [] ? ['disabledBlockTypeUids' => $disabled] : []),
                    ];
                }
            }

            $fieldPlan['uidMapping'] = $factory->mapping();
            $plans[$fieldUid] = $fieldPlan;
        }

        foreach ($claimedHandles as $handle => $owners) {
            if ($handle !== '' && count($owners) > 1) {
                sort($owners);
                foreach ($owners as $owner) {
                    if (!str_starts_with($owner, 'global:')) {
                        $this->_diagnostic(
                            $diagnostics,
                            'globalHandleCollision',
                            'error',
                            $owner,
                            "Target handle {$handle} is claimed by: " . implode(', ', $owners) . '. Supply explicit unique target handles.',
                        );
                    }
                }
            }
        }

        usort($diagnostics, static fn(array $a, array $b) => [$a['location'], $a['code'], $a['message']] <=> [$b['location'], $b['code'], $b['message']]);
        $blocked = false;
        foreach ($diagnostics as $diagnostic) {
            if ($diagnostic['severity'] === 'error') {
                $blocked = true;
                break;
            }
        }

        return [
            'status' => $blocked ? 'blocked' : 'ready',
            'dryRun' => true,
            'diagnostics' => $diagnostics,
            'fields' => $plans,
        ];
    }

    /**
     * Current Project Config applies paths through side-effecting handlers without
     * a proven all-or-nothing boundary, so this slice must never partially apply.
     */
    public function apply(array $plan): array
    {
        return [
            'status' => 'resumable',
            'applied' => false,
            'atomic' => false,
            'code' => 'projectConfigPromotionRequiresOrderedStates',
            'message' => 'Craft Project Config handlers are not one atomic schema transaction. Apply must resume through verified additive states; source schema and content are never deleted here.',
            'states' => [
                ['name' => 'addGlobalBlockTypes', 'status' => 'pending', 'verification' => 'globalConfigAndRuntimeRoundTrip'],
                ['name' => 'writePromotionProvenance', 'status' => 'pending', 'verification' => 'immutableSourceFingerprintAndMaps'],
                ['name' => 'writeCanonicalFieldReferences', 'status' => 'pending', 'verification' => 'sourceFieldDataStillPresent'],
                ['name' => 'migrateOwnerContent', 'status' => 'pending', 'verification' => 'perOwnerCheckpointChecksumCountOrderEnabledSlots'],
                ['name' => 'verifyScopedOwners', 'status' => 'pending', 'verification' => 'allScopedOwnerCheckpointsComplete'],
                ['name' => 'retireSource', 'status' => 'blocked', 'verification' => 'separateExplicitCleanupOnly'],
            ],
            'sourceDeletionAuthorized' => false,
            'plan' => $plan,
        ];
    }


    // Private Methods
    // =========================================================================

    private function _promoteLayout(
        array $legacyType,
        array $fieldConfigs,
        DeterministicUidFactory $factory,
        array &$claimedSchemaUids,
        array &$diagnostics,
        string $location,
    ): array {
        $layout = $legacyType['layoutConfig'] ?? null;
        if (!is_array($layout)) {
            $this->_diagnostic($diagnostics, 'missingLayoutConfig', 'error', $location, 'Block Type layoutConfig is required for the Vizy 3 upgrade.');
            $layout = ['tabs' => []];
        }

        $outsideUid = $legacyType['layoutUid'] ?? null;
        $insideUid = $layout['uid'] ?? null;
        if (is_string($outsideUid) && is_string($insideUid) && $outsideUid !== $insideUid) {
            $this->_diagnostic($diagnostics, 'ambiguousLayoutUid', 'error', $location, 'layoutUid disagrees with layoutConfig.uid.');
        }
        $candidate = is_string($outsideUid) ? $outsideUid : (is_string($insideUid) ? $insideUid : null);
        $layout['uid'] = $this->_claimUid(
            $this->_validUuid($candidate) ? $candidate : null,
            $factory,
            "layout:" . ($legacyType['id'] ?? $location),
            $claimedSchemaUids,
            $diagnostics,
            "{$location}.layout",
            'layout',
        );
        if (!$this->_validUuid($candidate)) {
            $this->_diagnostic($diagnostics, 'generatedLayoutUid', 'warning', "{$location}.layout", 'Missing or invalid layout identity was deterministically mapped.');
        }

        $placementMap = [];
        $this->_promoteLayoutNodes(
            $layout,
            $fieldConfigs,
            $factory,
            $claimedSchemaUids,
            $placementMap,
            $diagnostics,
            "{$location}.layout",
        );
        return [$layout, $placementMap];
    }

    private function _promoteLayoutNodes(
        array &$value,
        array $fieldConfigs,
        DeterministicUidFactory $factory,
        array &$claimedSchemaUids,
        array &$placementMap,
        array &$diagnostics,
        string $location,
    ): void {
        foreach ($value as $key => &$child) {
            if (!is_array($child)) {
                continue;
            }
            $childLocation = "{$location}.{$key}";
            if (isset($child['elements']) && is_array($child['elements'])) {
                $candidate = is_string($child['uid'] ?? null) ? $child['uid'] : null;
                $child['uid'] = $this->_claimUid(
                    $this->_validUuid($candidate) ? $candidate : null,
                    $factory,
                    "tab:{$childLocation}",
                    $claimedSchemaUids,
                    $diagnostics,
                    $childLocation,
                    'tab',
                );
                if (!$this->_validUuid($candidate)) {
                    $this->_diagnostic($diagnostics, 'generatedTabUid', 'warning', $childLocation, 'Missing or invalid tab identity was deterministically mapped.');
                }
            }
            if (($child['type'] ?? null) === CustomField::class || isset($child['fieldUid'])) {
                $this->_promotePlacement(
                    $child,
                    $fieldConfigs,
                    $factory,
                    $claimedSchemaUids,
                    $placementMap,
                    $diagnostics,
                    $childLocation,
                );
            }
            $this->_promoteLayoutNodes($child, $fieldConfigs, $factory, $claimedSchemaUids, $placementMap, $diagnostics, $childLocation);
        }
        unset($child);
    }

    private function _promotePlacement(
        array &$placement,
        array $fieldConfigs,
        DeterministicUidFactory $factory,
        array &$claimedSchemaUids,
        array &$placementMap,
        array &$diagnostics,
        string $location,
    ): void {
        $legacyPlacement = is_string($placement['uid'] ?? null) ? $placement['uid'] : null;
        $canonical = $this->_claimUid(
            $this->_validUuid($legacyPlacement) ? $legacyPlacement : null,
            $factory,
            "placement:{$location}",
            $claimedSchemaUids,
            $diagnostics,
            $location,
            'placement',
        );
        $placement['uid'] = $canonical;
        if (!$this->_validUuid($legacyPlacement)) {
            $this->_diagnostic($diagnostics, 'generatedPlacementUid', 'warning', $location, 'Missing or invalid placement identity was deterministically mapped.');
        }

        $fieldUid = $placement['fieldUid'] ?? null;
        $fieldConfig = is_string($fieldUid) ? ($fieldConfigs[$fieldUid] ?? null) : null;
        if (!is_array($fieldConfig)) {
            $this->_diagnostic($diagnostics, 'missingPlacedField', 'error', $location, 'The placed global Craft field is missing.');
        } else {
            $fieldType = $fieldConfig['type'] ?? null;
            if (is_string($fieldType) && ($fieldType === 'craft\\fields\\Matrix' || str_ends_with($fieldType, '\\fields\\Matrix'))) {
                // Matrix placements retain their persisted anchors through promotion.
                $this->_diagnostic(
                    $diagnostics,
                    'matrixAnchorGrandfathered',
                    'info',
                    $location,
                    'Matrix placements remain supported. Nested Vizy is recommended for new nested content to reduce storage and processing overhead.',
                );
            } elseif (!is_string($fieldType) || $fieldType === '') {
                $this->_diagnostic($diagnostics, 'unsupportedField', 'error', $location, 'The placed field type cannot be interpreted.');
            }
            // Nested Vizy CustomField placements are allowed — Hosted is runtime; nested
            // fieldData promotes as a normal Vizy field; nested payloads convert on load.
        }

        $acceptedKeys = array_filter([
            $legacyPlacement,
            is_string($placement['handle'] ?? null) ? $placement['handle'] : null,
            is_array($fieldConfig) && is_string($fieldConfig['handle'] ?? null) ? $fieldConfig['handle'] : null,
        ], static fn(mixed $key) => is_string($key) && $key !== '');
        foreach (array_unique($acceptedKeys) as $key) {
            if (isset($placementMap[$key]) && $placementMap[$key] !== $canonical) {
                $this->_diagnostic($diagnostics, 'ambiguousLegacyPlacementKey', 'error', $location, "Legacy placement key {$key} identifies multiple placements.");
                continue;
            }
            $placementMap[$key] = $canonical;
        }
    }

    private function _claimUid(
        ?string $candidate,
        DeterministicUidFactory $factory,
        string $key,
        array &$claimed,
        array &$diagnostics,
        string $location,
        string $kind,
    ): string {
        if ($candidate !== null && !isset($claimed[$candidate])) {
            $claimed[$candidate] = "{$kind}:{$location}";
            return $candidate;
        }
        if ($candidate !== null) {
            $this->_diagnostic($diagnostics, 'schemaUidCollisionRemapped', 'warning', $location, "Unsafe {$kind} UID {$candidate} was deterministically remapped.");
        }
        $uid = $factory->uid("{$key}:uid");
        if (isset($claimed[$uid])) {
            throw new \LogicException("Deterministic UID collision for {$key}.");
        }
        $claimed[$uid] = "{$kind}:{$location}";
        return $uid;
    }

    private function _rootPolicy(array $settings, string $fieldUid, array &$diagnostics): string
    {
        return match ($settings['editorMode'] ?? VizyField::MODE_COMBINED) {
            VizyField::MODE_RICH_TEXT, VizyField::MODE_COMBINED => VizyField::ROOT_CONTENT_RICH,
            VizyField::MODE_BLOCKS => VizyField::ROOT_CONTENT_BLOCKS,
            default => $this->_invalidRootPolicy($fieldUid, $diagnostics),
        };
    }

    private function _invalidRootPolicy(string $fieldUid, array &$diagnostics): string
    {
        $this->_diagnostic($diagnostics, 'unsupportedRootPolicy', 'error', $fieldUid, 'The legacy editorMode is unsupported.');
        return VizyField::ROOT_CONTENT_RICH;
    }

    private function _nullableInt(mixed $value): ?int
    {
        return $value === null || $value === '' ? null : (is_numeric($value) ? (int)$value : null);
    }

    private function _validUuid(mixed $value): bool
    {
        return is_string($value)
            && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value) === 1;
    }

    private function _validHandle(string $handle): bool
    {
        return preg_match('/^[a-zA-Z][a-zA-Z0-9_]*$/', $handle) === 1;
    }

    private function _fingerprint(array $value): string
    {
        // Match Vizy3PromotionOrchestrator::hash — PC rewrites reorder keys.
        return hash('sha256', Json::encode($this->_stable($value)));
    }

    private function _stable(mixed $value): mixed
    {
        if (!is_array($value)) {
            return $value;
        }
        if (!array_is_list($value)) {
            ksort($value);
        }
        foreach ($value as $key => $child) {
            $value[$key] = $this->_stable($child);
        }
        return $value;
    }

    private function _diagnostic(array &$diagnostics, string $code, string $severity, string $location, string $message): void
    {
        $diagnostics[] = compact('code', 'severity', 'location', 'message');
    }
}
