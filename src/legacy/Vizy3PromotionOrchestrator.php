<?php
namespace verbb\vizy\legacy;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\models\BlockType;
use verbb\vizy\records\BlockType as BlockTypeRecord;
use verbb\vizy\records\SchemaPromotion;
use verbb\vizy\services\BlockTypes;

use Craft;
use craft\base\Component;
use craft\helpers\Json;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use craft\helpers\StringHelper;

use RuntimeException;
use Throwable;

/**
 * Ordered, resumable Project Config promotion.
 *
 * Project Config handlers and owner saves cannot share one transaction. The
 * durable pointer therefore advances only after each idempotent stage verifies
 * its externally visible result.
 */
final class Vizy3PromotionOrchestrator extends Component
{
    // Constants
    // =========================================================================

    public const CONFIRMATION = 'PROMOTE VIZY 3';

    private const STAGES = [
        'planned',
        'globalSchema',
        'provenance',
        'editorConfigs',
        'canonicalFields',
        'owners',
        'verified',
    ];


    // Properties
    // =========================================================================

    private mixed $stageProbe = null;


    // Public Methods
    // =========================================================================

    public function setStageProbeForTesting(?callable $probe): void
    {
        $this->stageProbe = $probe;
    }

    /**
     * Analyze the complete current field/schema snapshot without writes.
     */
    public function analyze(array $targetHandles = []): array
    {
        $projectConfig = Craft::$app->getProjectConfig();
        $fields = $this->_unpackMap($projectConfig->get('fields') ?? []);
        foreach (array_keys($fields) as $fieldUid) {
            if ($projectConfig->get(LegacySchemaMaps::PROJECT_CONFIG_PATH . '.' . $fieldUid) !== null) {
                unset($fields[$fieldUid]);
            }
        }
        foreach (SchemaPromotion::find()->all() as $promotion) {
            $boundPlan = Json::decode((string)$promotion->planJson);
            foreach ($boundPlan['fields'] ?? [] as $fieldUid => $fieldPlan) {
                $fieldData = $fields[$fieldUid]['settings']['fieldData'] ?? null;
                if (is_array($fieldData) && ($fieldPlan['sourceFingerprint'] ?? null) === $this->_hash($fieldData)) {
                    // A durable run already owns this exact source snapshot.
                    // Operators resume that run rather than planning duplicate schema.
                    unset($fields[$fieldUid]);
                }
            }
        }
        $blockTypes = $this->_unpackMap($projectConfig->get(BlockTypes::PROJECT_CONFIG_PATH) ?? []);
        $plan = (new Vizy3SchemaPromotion())->analyze($fields, $blockTypes, $targetHandles);
        $plan['planHash'] = $this->_hash($this->_stable($plan));
        return $plan;
    }

    public function dryRun(array $plan, array $ownerScope = []): array
    {
        $this->_assertPlan($plan);
        $this->_preflight($plan);
        return [
            'status' => 'ready',
            'dryRun' => true,
            'planHash' => $plan['planHash'],
            'ownerScopeComplete' => ($ownerScope['complete'] ?? false) === true,
            'ownerJobs' => count($ownerScope['jobs'] ?? []),
            'stages' => array_map(
                static fn(string $stage) => ['name' => $stage, 'status' => $stage === 'planned' ? 'verified' : 'pending'],
                self::STAGES,
            ),
            'sourceDeletionAuthorized' => false,
        ];
    }

    public function apply(array $plan, array $ownerScope, string $confirmation): array
    {
        $this->_assertConfirmation($confirmation);
        $this->_assertPlan($plan);
        $this->_preflight($plan);

        $existing = SchemaPromotion::findOne(['planHash' => $plan['planHash']]);
        if ($existing) {
            if (Json::decode((string)$existing->ownerScopeJson) !== $ownerScope) {
                throw new RuntimeException('This immutable promotion plan is already bound to a different owner scope.');
            }
            return $this->_run($existing);
        }

        $record = new SchemaPromotion([
            'runUid' => StringHelper::UUID(),
            'planHash' => $plan['planHash'],
            'planJson' => Json::encode($plan),
            'ownerScopeJson' => Json::encode($ownerScope),
            'stage' => 'planned',
            'status' => 'pending',
        ]);
        $this->_save($record);
        return $this->_run($record);
    }

    public function resume(string $runUid, string $confirmation): array
    {
        $this->_assertConfirmation($confirmation);
        $record = SchemaPromotion::findOne(['runUid' => $runUid]);
        if (!$record) {
            throw new RuntimeException("Unknown Vizy schema promotion {$runUid}.");
        }
        return $this->_run($record);
    }

    public function status(?string $runUid = null): array
    {
        $query = SchemaPromotion::find()->orderBy(['id' => SORT_ASC]);
        if ($runUid !== null) {
            $query->andWhere(['runUid' => $runUid]);
        }
        return array_map(fn(SchemaPromotion $record) => $this->_result($record), $query->all());
    }


    // Private Methods
    // =========================================================================

    private function _run(SchemaPromotion $record): array
    {
        if ($record->stage === 'verified' && $record->status === 'complete') {
            return $this->_result($record);
        }

        $plan = Json::decode((string)$record->planJson);
        $ownerScope = Json::decode((string)$record->ownerScopeJson);
        $this->_assertPlan($plan);
        if (!hash_equals((string)$record->planHash, (string)$plan['planHash'])) {
            throw new RuntimeException('Persisted promotion plan hash is stale or corrupt.');
        }

        $record->status = 'running';
        $record->lastError = null;
        $this->_save($record);
        try {
            $stageIndex = array_search((string)$record->stage, self::STAGES, true);
            if ($stageIndex === false) {
                throw new RuntimeException("Unknown promotion stage {$record->stage}.");
            }
            for ($index = $stageIndex + 1; $index < count(self::STAGES); $index++) {
                $stage = self::STAGES[$index];
                $this->_executeStage($stage, $plan, $ownerScope, (string)$record->runUid);
                // Never advance before the stage-specific verification above.
                $record->stage = $stage;
                $this->_save($record);
            }
            $record->status = 'complete';
            $this->_save($record);
        } catch (Throwable $exception) {
            $record->status = 'failed';
            $record->lastError = $exception->getMessage();
            $this->_save($record);
        }
        return $this->_result($record);
    }

    private function _executeStage(
        string $stage,
        array $plan,
        array $ownerScope,
        string $runUid,
    ): void {
        if ($this->stageProbe) {
            ($this->stageProbe)($stage);
        }
        match ($stage) {
            'globalSchema' => $this->_applyGlobalSchema($plan),
            'provenance' => $this->_applyProvenance($plan),
            'editorConfigs' => $this->_applyEditorConfigs($plan),
            'canonicalFields' => $this->_applyCanonicalFields($plan),
            'owners' => $this->_applyOwners($plan, $ownerScope, $runUid),
            'verified' => $this->_verifyAll($plan, $ownerScope, $runUid),
            default => throw new RuntimeException("Unsupported promotion stage {$stage}."),
        };
    }

    private function _applyEditorConfigs(array $plan): void
    {
        (new ManualEditorConfigMigrator())->applyMints($plan['fields'] ?? []);
        foreach ($plan['fields'] as $fieldUid => $fieldPlan) {
            $id = $fieldPlan['canonicalFieldSettings']['editorConfig'] ?? '';
            if (!is_string($id) || $id === '') {
                continue;
            }
            if (Vizy::$plugin->getEditorConfigs()->getConfig($id) === null) {
                throw new RuntimeException("Promoted Editor Config {$id} for field {$fieldUid} is missing after the editorConfigs stage.");
            }
        }
    }

    private function _preflight(array $plan): void
    {
        $this->_assertSourceFingerprints($plan);
        $projectConfig = Craft::$app->getProjectConfig();
        $candidate = $projectConfig->get(BlockTypes::PROJECT_CONFIG_PATH) ?? [];
        foreach ($plan['fields'] as $fieldPlan) {
            foreach ($fieldPlan['blockTypes'] as $target) {
                $uid = $target['uid'];
                $packed = ProjectConfigHelper::packAssociativeArrays($target['config']);
                if (isset($candidate[$uid]) && $this->_normalizedBlockTypeConfig($uid, $candidate[$uid]) !== $this->_normalizedBlockTypeConfig($uid, $target['config'])) {
                    throw new RuntimeException("Target Block Type {$uid} changed outside this promotion plan.");
                }
                $candidate[$uid] = $packed;
            }
        }
        // Complete graph validation happens before the first handler/DB write.
        // Matrix-in-Block is grandfathered on first import (empty global baseline).
        Vizy::$plugin->getBlockTypes()->preflightExternalSchema($candidate, allowMatrixGrandfatherImport: true);
    }

    private function _applyGlobalSchema(array $plan): void
    {
        $this->_preflight($plan);
        $projectConfig = Craft::$app->getProjectConfig();
        foreach ($plan['fields'] as $fieldPlan) {
            foreach ($fieldPlan['blockTypes'] as $target) {
                $uid = $target['uid'];
                $path = BlockTypes::PROJECT_CONFIG_PATH . '.' . $uid;
                $expected = $this->_normalizedBlockTypeConfig($uid, $target['config']);
                $current = $projectConfig->get($path);
                if ($current === null) {
                    $projectConfig->set($path, ProjectConfigHelper::packAssociativeArrays($target['config']));
                    $current = $projectConfig->get($path);
                }
                if ($this->_normalizedBlockTypeConfig($uid, $current) !== $expected) {
                    throw new RuntimeException("Global Block Type {$uid} did not round-trip through Project Config.");
                }
                $record = BlockTypeRecord::findOne(['uid' => $uid]);
                if (!$record || !$record->fieldLayoutId || !Craft::$app->getFields()->getLayoutById((int)$record->fieldLayoutId)) {
                    throw new RuntimeException("Global Block Type {$uid} did not synchronize its runtime record and FieldLayout.");
                }
            }
        }
    }

    private function _applyProvenance(array $plan): void
    {
        $this->_assertSourceFingerprints($plan);
        foreach ($plan['fields'] as $fieldUid => $fieldPlan) {
            Vizy::$plugin->getLegacySchemaMaps()->saveProvenance($fieldUid, $fieldPlan);
            $loaded = Vizy::$plugin->getLegacySchemaMaps()->getProvenance($fieldUid);
            if (($loaded['sourceFingerprint'] ?? null) !== $fieldPlan['sourceFingerprint']) {
                throw new RuntimeException("Promotion provenance {$fieldUid} did not reload immutably.");
            }
        }
    }

    private function _applyCanonicalFields(array $plan): void
    {
        $this->_assertSourceFingerprints($plan);
        $projectConfig = Craft::$app->getProjectConfig();
        foreach ($plan['fields'] as $fieldUid => $fieldPlan) {
            $path = "fields.{$fieldUid}";
            $config = ProjectConfigHelper::unpackAssociativeArrays($projectConfig->get($path));
            if (!is_array($config) || ($config['type'] ?? null) !== VizyField::class) {
                throw new RuntimeException("Vizy field {$fieldUid} is no longer available for canonical reference update.");
            }
            $settings = is_array($config['settings'] ?? null) ? $config['settings'] : [];
            // Keep fieldData as migration input; VizyField::getSettings() remains
            // canonical and never treats it as live Vizy 4 schema.
            $config['settings'] = [...$settings, ...$fieldPlan['canonicalFieldSettings']];
            // Rich-text V3 fields often omitted fieldData; persist an empty list so
            // provenance/fingerprint checks and retirement tooling still see a key.
            if (!array_key_exists('fieldData', $config['settings'])) {
                $config['settings']['fieldData'] = [];
            }
            $projectConfig->set($path, $config);

            $reloaded = ProjectConfigHelper::unpackAssociativeArrays($projectConfig->get($path));
            foreach ($fieldPlan['canonicalFieldSettings'] as $key => $value) {
                $actual = $reloaded['settings'][$key] ?? null;
                if (!$this->_canonicalSettingEquals($actual, $value)) {
                    throw new RuntimeException(
                        "Canonical Vizy field {$fieldUid} setting {$key} did not round-trip: "
                        . Json::encode(['expected' => $value, 'actual' => $actual])
                    );
                }
            }
            $reloadedFieldData = array_key_exists('fieldData', $reloaded['settings'] ?? [])
                ? $reloaded['settings']['fieldData']
                : [];
            // Craft may drop empty fieldData arrays from Project Config; treat omit as [].
            if (!is_array($reloadedFieldData)) {
                throw new RuntimeException("Canonical Vizy field {$fieldUid} lost its retained legacy migration input.");
            }
        }
        Craft::$app->getFields()->refreshFields();
    }

    private function _canonicalSettingEquals(mixed $actual, mixed $expected): bool
    {
        if ($this->_stable($actual) === $this->_stable($expected)) {
            return true;
        }
        if (($expected === [] || $expected === null) && ($actual === [] || $actual === null)) {
            return true;
        }
        return false;
    }

    private function _applyOwners(array $plan, array $ownerScope, string $runUid): void
    {
        if (($ownerScope['complete'] ?? false) !== true) {
            throw new RuntimeException('Owner migration scope must be explicitly marked complete before writes.');
        }
        foreach ($ownerScope['jobs'] ?? [] as $index => $job) {
            $fieldUid = $job['fieldUid'] ?? null;
            if (!is_string($fieldUid) || !isset($plan['fields'][$fieldUid])) {
                throw new RuntimeException("Owner job {$index} references a field outside the immutable plan.");
            }
            $owner = Craft::$app->getElements()->getElementById(
                (int)($job['elementId'] ?? 0),
                (string)($job['elementType'] ?? ''),
                (int)($job['siteId'] ?? 0),
            );
            $field = $owner ? FieldPlacements::field($owner, $fieldUid, $job['ownerPlacementUid'] ?? null) : null;
            if (!$owner || !$field instanceof VizyField || !is_array($job['mapping'] ?? null)) {
                throw new RuntimeException("Owner job {$index} cannot resolve its exact owner, field, or mapping.");
            }
            $jobRunUid = (new \verbb\vizy\document\DeterministicUidFactory("promotion:{$runUid}"))
                ->uid('owner-job:' . $index);
            $result = Vizy::$plugin->getOwnerContentMigrator()->migrateOwner(
                $owner,
                $field,
                $job['mapping'],
                true,
                $jobRunUid,
            );
            if ($result['state'] !== 'verified') {
                throw new RuntimeException("Owner job {$index} stopped in {$result['state']}: " . Json::encode($result['errors']));
            }
        }
    }

    private function _verifyAll(array $plan, array $ownerScope, string $runUid): void
    {
        $this->_applyGlobalSchema($plan);
        $this->_applyProvenance($plan);
        $this->_applyEditorConfigs($plan);
        $this->_applyCanonicalFields($plan);
        $this->_applyOwners($plan, $ownerScope, $runUid);
    }

    private function _assertSourceFingerprints(array $plan): void
    {
        $fields = $this->_unpackMap(Craft::$app->getProjectConfig()->get('fields') ?? []);
        foreach ($plan['fields'] as $fieldUid => $fieldPlan) {
            $settings = is_array($fields[$fieldUid]['settings'] ?? null) ? $fields[$fieldUid]['settings'] : [];
            // Match Vizy3SchemaPromotion: omitted fieldData (common for V3 rich-text) ≡ [].
            $fieldData = array_key_exists('fieldData', $settings) ? $settings['fieldData'] : [];
            if (!is_array($fieldData) || !hash_equals((string)$fieldPlan['sourceFingerprint'], $this->_hash($fieldData))) {
                throw new RuntimeException("Vizy field {$fieldUid} source Project Config changed after analysis.");
            }
        }
    }

    private function _assertPlan(array $plan): void
    {
        $hash = $plan['planHash'] ?? null;
        $copy = $plan;
        unset($copy['planHash']);
        if (
            ($plan['status'] ?? null) !== 'ready'
            || !is_string($hash)
            || !hash_equals($hash, $this->_hash($this->_stable($copy)))
        ) {
            throw new RuntimeException('Promotion requires a complete ready plan with a current immutable plan hash.');
        }
    }

    private function _assertConfirmation(string $confirmation): void
    {
        if ($confirmation !== self::CONFIRMATION) {
            throw new RuntimeException(PromotionOperatorMessages::confirmationMismatchMessage());
        }
    }

    private function _result(SchemaPromotion $record): array
    {
        return PromotionOperatorMessages::enrichPromotionResult([
            'runUid' => $record->runUid,
            'planHash' => $record->planHash,
            'stage' => $record->stage,
            'status' => $record->status,
            'lastError' => $record->lastError,
            'sourceDeletionAuthorized' => false,
        ]);
    }

    private function _save(SchemaPromotion $record): void
    {
        if (!$record->save(false)) {
            throw new RuntimeException('Unable to persist Vizy schema promotion state.');
        }
    }

    private function _unpackMap(mixed $map): array
    {
        $result = [];
        foreach (is_array($map) ? $map : [] as $uid => $config) {
            if (is_string($uid) && is_array($config)) {
                $result[$uid] = ProjectConfigHelper::unpackAssociativeArrays($config);
            }
        }
        return $result;
    }

    private function _hash(mixed $value): string
    {
        // Project Config pack/unpack and YAML rewrites reorder object keys;
        // fingerprints must ignore that churn.
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

    private function _normalizedBlockTypeConfig(string $uid, array $config): array
    {
        $model = BlockType::fromConfig($uid, ProjectConfigHelper::unpackAssociativeArrays($config));
        return $this->_stable($model->toConfig());
    }
}
