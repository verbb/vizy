<?php
namespace verbb\vizy\legacy;

use verbb\vizy\Vizy;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\legacy\LegacyDocumentConversionException;
use verbb\vizy\legacy\Vizy3DocumentAdapter;
use verbb\vizy\records\OwnerMigration;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\db\Query;
use craft\errors\InvalidElementException;
use craft\helpers\Db;
use craft\helpers\Json;
use craft\helpers\StringHelper;

use DateTime;
use RuntimeException;
use Throwable;

/**
 * Resumable owner-content boundary for Vizy 3 → 4 document conversion.
 *
 * Schema promotion is deliberately outside this service. Every call assumes the
 * additive schema, immutable provenance, and canonical field references already
 * exist; source retirement is never performed here.
 *
 * Leaf (default) mappings are map-only: `{ revision, schemaMap? }`. Nested Vizy
 * → Content Area and Matrix → Content Area transforms are retired; nested convert
 * and Matrix grandfather are separate adapter / mount paths, not CA keys on this
 * mapping.
 *
 * Persistence is checkpoint-first: state moves `ready` → `persisting` before the
 * Craft owner save, then `persisted` → `verified`. If a process dies in the
 * write window, `resume()` matches live owner content to the candidate hash and
 * continues without rewriting when already applied.
 */
final class OwnerContentMigrator extends Component
{
    // Properties
    // =========================================================================

    private array $saving = [];


    // Public Methods
    // =========================================================================

    /**
     * Analyze and checkpoint one exact owner/site/derivative value without
     * changing owner content, Matrix Entries, anchors, or source schema.
     */
    public function analyzeOwner(
        ElementInterface $owner,
        VizyField $field,
        array $mapping,
        ?string $runUid = null,
    ): array {
        $field = $this->_fieldForOwner($owner, $field);
        // Snapshot schemaMap into leaf mappings before hashing so provenance-driven
        // runs bind to the exact convert map. Retired CA keys skip this and fail
        // inside buildCandidate after the analyzed checkpoint exists.
        $mapping = $this->_normalizeLeafMapping($field, $mapping);
        $this->_assertTarget($owner, $field, $mapping);
        $runUid ??= StringHelper::UUID();
        $identity = $this->_identity($owner, $field, $runUid);
        $mappingHash = $this->_hashValue($this->_stable($mapping));
        $source = $this->_readRawValue($owner, $field);
        $sourceHash = $this->_hashSnapshot($source);

        $checkpoint = OwnerMigration::findOne($identity);
        if (!$checkpoint && FieldPlacements::field($owner, $field->uid, null)) {
            // Retain pre-placement checkpoints only while their target is unambiguous.
            $checkpoint = OwnerMigration::findOne([...$identity, 'ownerPlacementUid' => null]);
        }
        $checkpoint ??= new OwnerMigration($identity);
        if (!$checkpoint->getIsNewRecord()) {
            if ($checkpoint->mappingHash !== $mappingHash) {
                throw new RuntimeException('Migration run identity is already bound to a different mapping hash.');
            }
            if ($checkpoint->sourceSnapshotHash !== $sourceHash
                && !in_array($checkpoint->state, ['persisted', 'verified', 'persisting'], true)
            ) {
                return $this->_fail($checkpoint, 'staleSourceSnapshot', 'Owner content changed after this migration run was analyzed.');
            }
            if ($checkpoint->state === 'verified') {
                return $this->_result($checkpoint);
            }
        }

        $checkpoint->mappingRevision = (string)$mapping['revision'];
        $checkpoint->mappingHash = $mappingHash;
        $checkpoint->sourceSnapshotHash = $sourceHash;
        $checkpoint->sourceSnapshotJson = Json::encode(['value' => $source]);
        $checkpoint->uidMapJson = Json::encode([]);
        $checkpoint->errorsJson = Json::encode([]);
        $checkpoint->state = 'analyzed';
        $checkpoint->analyzedAt = $this->_now();
        $this->_saveCheckpoint($checkpoint);

        try {
            [$candidate, $uidMap, $transformVerification] = $this->_buildCandidate($owner, $field, $source, $mapping);
            $this->_validateCandidate($owner, $field, $candidate);
            $canonical = $this->_canonicalArray($candidate);
            $profile = $this->_profile($canonical);

            $checkpoint->candidateJson = Json::encode($canonical);
            $checkpoint->candidateHash = $this->_hashValue($canonical);
            $checkpoint->uidMapJson = Json::encode($uidMap);
            $checkpoint->verificationJson = Json::encode([
                'transform' => $transformVerification,
                'candidate' => $profile,
                'strictCanonicalParse' => true,
                'schemaValidated' => true,
                'sourceSnapshotRetained' => true,
                'sourceRetirementAuthorized' => false,
                'matrixAnchorUsedInCanonicalOutput' => true,
            ]);
            $checkpoint->errorsJson = Json::encode([]);
            $checkpoint->state = 'ready';
            $checkpoint->readyAt = $this->_now();
            $this->_saveCheckpoint($checkpoint);
        } catch (Throwable $exception) {
            return $this->_fail($checkpoint, 'analysisFailed', $exception->getMessage());
        }

        return $this->_result($checkpoint);
    }

    /**
     * Persist and verify one previously analyzed value through Craft's real
     * owner lifecycle. Re-running the same run UID is idempotent.
     */
    public function migrateOwner(
        ElementInterface $owner,
        VizyField $field,
        array $mapping,
        bool $persist = false,
        ?string $runUid = null,
    ): array {
        $analysis = $this->analyzeOwner($owner, $field, $mapping, $runUid);
        if (!$persist || $analysis['state'] !== 'ready') {
            return $analysis;
        }

        $checkpoint = OwnerMigration::findOne($analysis['id']);
        if (!$checkpoint) {
            throw new RuntimeException('Owner migration checkpoint disappeared before persistence.');
        }

        return $this->_persistReadyCheckpoint($checkpoint);
    }

    public function resume(int $checkpointId): array
    {
        $checkpoint = OwnerMigration::findOne($checkpointId);
        if (!$checkpoint) {
            throw new RuntimeException("Unknown owner migration checkpoint {$checkpointId}.");
        }
        if ($checkpoint->state === 'verified') {
            return $this->_result($checkpoint);
        }

        // Crash window recovery: Craft may already hold the candidate while the
        // checkpoint still says ready/persisting. Match live content → mark persisted.
        if (in_array($checkpoint->state, ['ready', 'persisting', 'persisted'], true)
            || $checkpoint->persistedAt !== null
        ) {
            if ($this->_liveContentMatchesCandidate($checkpoint)) {
                if ($checkpoint->state !== 'persisted' || $checkpoint->persistedAt === null) {
                    $checkpoint->state = 'persisted';
                    $checkpoint->persistedAt = $this->_now();
                    $checkpoint->errorsJson = Json::encode([]);
                    $this->_saveCheckpoint($checkpoint);
                }
                return $this->_verifyCheckpoint($checkpoint);
            }
        }

        if ($checkpoint->state === 'persisting') {
            // Content never landed as the candidate — retry the Craft write.
            $checkpoint->state = 'ready';
            $this->_saveCheckpoint($checkpoint);
            return $this->_persistReadyCheckpoint($checkpoint);
        }

        if ($checkpoint->state !== 'persisted' && $checkpoint->persistedAt === null) {
            throw new RuntimeException('Resume requires the original approved mapping unless the checkpoint is already persisted.');
        }
        return $this->_verifyCheckpoint($checkpoint);
    }

    public function status(?string $runUid = null): array
    {
        $query = OwnerMigration::find()->orderBy(['id' => SORT_ASC]);
        if ($runUid !== null) {
            $query->andWhere(['runUid' => $runUid]);
        }
        return array_map(fn(OwnerMigration $record) => $this->_result($record), $query->all());
    }


    // Private Methods
    // =========================================================================

    /**
     * Persist a checkpoint that is already `ready` (or recovered to ready).
     */
    private function _persistReadyCheckpoint(OwnerMigration $checkpoint): array
    {
        if ($checkpoint->state !== 'ready') {
            throw new RuntimeException('Only ready migration checkpoints can be persisted.');
        }

        $owner = Craft::$app->getElements()->getElementById(
            (int)$checkpoint->ownerId,
            (string)$checkpoint->ownerType,
            (int)$checkpoint->siteId,
        );
        if (!$owner || $owner->getIsDraft() || $owner->getIsRevision()) {
            throw new RuntimeException('Exact canonical owner could not be reloaded for persistence.');
        }
        $field = FieldPlacements::field($owner, (string)$checkpoint->fieldUid, $checkpoint->ownerPlacementUid);
        if (!$field instanceof VizyField) {
            throw new RuntimeException('Exact Vizy field could not be reloaded for persistence.');
        }

        $currentSource = $this->_readRawValue($owner, $field);
        if ($this->_hashSnapshot($currentSource) !== $checkpoint->sourceSnapshotHash) {
            // Already migrated by a crashed prior attempt?
            if ($this->_liveContentMatchesCandidate($checkpoint)) {
                $checkpoint->state = 'persisted';
                $checkpoint->persistedAt = $this->_now();
                $this->_saveCheckpoint($checkpoint);
                return $this->_verifyCheckpoint($checkpoint);
            }
            return $this->_fail($checkpoint, 'staleSourceSnapshot', 'Owner content changed before persistence.');
        }

        $key = implode(':', [$owner::class, $owner->id, $owner->siteId, $field->uid, FieldPlacements::uid($owner, $field)]);
        if (isset($this->saving[$key])) {
            return $this->_fail($checkpoint, 'recursiveOwnerMigration', 'Recursive owner migration was prevented.');
        }

        $checkpoint->attempts = (int)$checkpoint->attempts + 1;
        // Checkpoint-first: operators can see `persisting` if the process dies
        // between Craft's content write and the persisted marker.
        $checkpoint->state = 'persisting';
        $this->_saveCheckpoint($checkpoint);
        $this->saving[$key] = true;
        try {
            $candidateArray = Json::decode((string)$checkpoint->candidateJson);
            $candidate = (new DocumentParser())->parse($candidateArray, $owner, $field);
            Vizy::$plugin->getContentBaselines()->trust($owner, $field, $candidate);
            $owner->setFieldValue($field->handle, $candidate);
            // ContentBaselines trust lets Editor Config preserve unknown/disabled capabilities
            // on this save; VizyField no longer validates on SCENARIO_ESSENTIALS so Craft
            // revision duplication cannot reject those same preserved nodes.
            if (!Craft::$app->getElements()->saveElement($owner, true, false)) {
                $errors = Json::encode($owner->getErrors());
                return $this->_fail($checkpoint, 'ownerSaveFailed', "Owner save failed validation: {$errors}");
            }
            $checkpoint->state = 'persisted';
            $checkpoint->persistedAt = $this->_now();
            $this->_saveCheckpoint($checkpoint);
        } catch (InvalidElementException $exception) {
            return $this->_fail(
                $checkpoint,
                'ownerSaveFailed',
                $exception->getMessage() . ' :: ' . Json::encode($exception->element->getErrors()),
            );
        } catch (Throwable $exception) {
            return $this->_fail($checkpoint, 'ownerSaveFailed', $exception->getMessage());
        } finally {
            Vizy::$plugin->getContentBaselines()->forget($owner, $field);
            unset($this->saving[$key]);
        }

        return $this->_verifyCheckpoint($checkpoint);
    }

    /**
     * True when the live owner value already matches the checkpoint candidate
     * (content committed, checkpoint marker lagging).
     */
    private function _liveContentMatchesCandidate(OwnerMigration $checkpoint): bool
    {
        if (!$checkpoint->candidateJson || !$checkpoint->candidateHash) {
            return false;
        }

        try {
            $owner = Craft::$app->getElements()->getElementById(
                (int)$checkpoint->ownerId,
                (string)$checkpoint->ownerType,
                (int)$checkpoint->siteId,
            );
            $field = $owner ? FieldPlacements::field($owner, (string)$checkpoint->fieldUid, $checkpoint->ownerPlacementUid) : null;
            if (!$owner || !$field instanceof VizyField) {
                return false;
            }
            $raw = $this->_readRawValue($owner, $field);
            $document = $this->_persistedDocument($raw, $owner, $field);
            return $this->_hashValue($this->_canonicalArray($document)) === $checkpoint->candidateHash;
        } catch (Throwable) {
            return false;
        }
    }

    private function _verifyCheckpoint(OwnerMigration $checkpoint): array
    {
        try {
            $owner = Craft::$app->getElements()->getElementById(
                (int)$checkpoint->ownerId,
                (string)$checkpoint->ownerType,
                (int)$checkpoint->siteId,
            );
            $field = $owner ? FieldPlacements::field($owner, (string)$checkpoint->fieldUid, $checkpoint->ownerPlacementUid) : null;
            if (!$owner || !$field instanceof VizyField) {
                throw new RuntimeException('Exact persisted owner or Vizy field could not be reloaded.');
            }
            $raw = $this->_readRawValue($owner, $field);
            $persisted = $this->_persistedDocument($raw, $owner, $field);
            $canonical = $this->_canonicalArray($persisted);
            $persistedHash = $this->_hashValue($canonical);
            $expectedProfile = $this->_profile(Json::decode((string)$checkpoint->candidateJson));
            $actualProfile = $this->_profile($canonical);
            if ($persistedHash !== $checkpoint->candidateHash || $actualProfile !== $expectedProfile) {
                throw new RuntimeException('Persisted canonical checksum/profile does not match the analyzed candidate.');
            }

            $verification = Json::decode((string)$checkpoint->verificationJson);
            $verification['persisted'] = $actualProfile;
            $verification['persistedHash'] = $persistedHash;
            $verification['verified'] = true;
            $checkpoint->verificationJson = Json::encode($verification);
            $checkpoint->state = 'verified';
            $checkpoint->verifiedAt = $this->_now();
            $checkpoint->errorsJson = Json::encode([]);
            $this->_saveCheckpoint($checkpoint);
        } catch (Throwable $exception) {
            return $this->_fail($checkpoint, 'verificationFailed', $exception->getMessage());
        }

        return $this->_result($checkpoint);
    }

    private function _buildCandidate(
        ElementInterface $owner,
        VizyField $field,
        mixed $source,
        array $mapping,
    ): array {
        $this->_rejectRetiredTransforms($mapping);

        $decoded = $this->_decodeSource($source);
        $uidMap = [];
        $verification = [
            'path' => 'leaf',
            'sourceShape' => null,
            'schemaMapSize' => count($mapping['schemaMap'] ?? []),
        ];

        if (!is_array($decoded)) {
            throw new RuntimeException('Persisted Vizy source must decode to an array.');
        }

        // Already-canonical docs (re-run / partial fleet) parse without re-convert.
        if (($decoded['type'] ?? null) === 'doc') {
            $verification['sourceShape'] = 'canonicalDoc';
            $document = (new DocumentParser())->parse($decoded, $owner, $field);

            return [$document, $uidMap, $verification];
        }

        // Vizy 3 storage is a bare root node list; convert with the leaf schemaMap.
        if (!array_is_list($decoded)) {
            throw new RuntimeException('Unrecognized persisted Vizy representation for owner migration.');
        }

        $schemaMap = $mapping['schemaMap'] ?? null;
        if (!is_array($schemaMap)) {
            throw new RuntimeException('A bare Vizy 3 source requires an approved leaf schemaMap (mapping or field provenance).');
        }

        $verification['sourceShape'] = 'bareList';
        try {
            $canonical = (new Vizy3DocumentAdapter())->convert($decoded, $schemaMap);
        } catch (LegacyDocumentConversionException $exception) {
            throw new RuntimeException($exception->getMessage(), 0, $exception);
        }
        $document = (new DocumentParser())->parse($canonical, $owner, $field);

        return [$document, $uidMap, $verification];
    }

    /**
     * Bind every leaf run to an explicit schemaMap for checkpoint hashing.
     * Retired Nested/Matrix→CA keys are left untouched so buildCandidate can
     * fail-closed after the analyzed checkpoint is written.
     */
    private function _normalizeLeafMapping(VizyField $field, array $mapping): array
    {
        if (isset($mapping['nested']) || !empty($mapping['matrices'])) {
            return $mapping;
        }

        if (!array_key_exists('schemaMap', $mapping) || $mapping['schemaMap'] === null) {
            $fromField = $field->getLegacySchemaMap();
            if ($fromField === null) {
                throw new RuntimeException(
                    'Cannot migrate this owner’s Vizy content: field “'
                    . ($field->handle ?: $field->name)
                    . '” has not been upgraded to Vizy 4 yet (no schema map on the job or from the field upgrade).'
                );
            }
            $mapping['schemaMap'] = $fromField;
        }

        if (!is_array($mapping['schemaMap'])) {
            throw new RuntimeException('Leaf owner migration schemaMap must be an object/map.');
        }

        return $mapping;
    }

    private function _rejectRetiredTransforms(array $mapping): void
    {
        if (isset($mapping['nested'])) {
            throw new RuntimeException('Nested Vizy → Content Area migration is retired; Hosted Vizy is the sole nesting model.');
        }
        if (!empty($mapping['matrices'])) {
            throw new RuntimeException('Matrix → Content Area migration is retired; Hosted Vizy is the sole nesting model.');
        }
    }

    private function _validateCandidate(ElementInterface $owner, VizyField $field, VizyDocument $candidate): void
    {
        $candidate = (new DocumentParser())->parse($this->_canonicalArray($candidate), $owner, $field);
        foreach ($candidate->blocks(null) as $block) {
            $type = $block->blockType();
            if (!$type || !$type->getFieldLayout()) {
                throw new RuntimeException("Candidate Block {$block->uid()} has unresolved Block Type {$block->blockTypeUid()}.");
            }
        }

        // Validate on a clone so dry-run never mutates the caller's owner state.
        $validationOwner = clone $owner;
        $validationOwner->clearErrors();
        $validationOwner->setFieldValue($field->handle, $candidate->recontextualize($validationOwner, $field));
        // The candidate is an immutable transform of the exact persisted
        // checkpoint source, so it is the trusted preservation baseline for
        // this migration-only validation call.
        $field->validateBlocks($validationOwner, $candidate);
        if ($validationOwner->hasErrors()) {
            throw new RuntimeException('Candidate failed Vizy/Craft field validation: ' . Json::encode($validationOwner->getErrors()));
        }
    }

    private function _canonicalArray(VizyDocument $document): array
    {
        $serialized = Vizy::$plugin->getDocuments()->serializeValue($document);
        $canonical = Json::decode($serialized);
        (new DocumentParser())->parse($canonical, $document->owner(), $document->field());
        return $canonical;
    }

    private function _persistedDocument(mixed $raw, ElementInterface $owner, VizyField $field): VizyDocument
    {
        $value = $this->_decodeSource($raw);
        if (!is_array($value)) {
            throw new RuntimeException('Persisted owner content is not a canonical Vizy document.');
        }

        // Read-time legacy conversion is not evidence that the Craft write landed.
        return (new DocumentParser())->parse($value, $owner, $field);
    }

    private function _profile(array $canonical): array
    {
        $profile = [
            'blockCount' => 0,
            'blockOrder' => [],
            'enabled' => [],
            'rawSlotCount' => 0,
            'rawSlotsHash' => '',
            'unknownNodeCount' => 0,
        ];
        $slots = [];
        $known = array_fill_keys(['doc', 'paragraph', 'text', 'vizyBlock', 'layout', 'column'], true);
        $walk = function(array $nodes) use (&$walk, &$profile, &$slots, $known): void {
            foreach ($nodes as $node) {
                $type = (string)($node['type'] ?? '');
                if (!isset($known[$type])) {
                    $profile['unknownNodeCount']++;
                }
                if ($type === 'vizyBlock') {
                    $attrs = $node['attrs'];
                    $profile['blockCount']++;
                    $profile['blockOrder'][] = $attrs['blockUid'];
                    $profile['enabled'][] = $attrs['enabled'];
                    foreach ($attrs['fieldSlots'] as $placementUid => $value) {
                        $slots[] = [$attrs['blockUid'], $placementUid, $value];
                        $profile['rawSlotCount']++;
                    }
                }
                if (is_array($node['content'] ?? null)) {
                    $walk($node['content']);
                }
            }
        };
        $walk($canonical['content'] ?? []);
        $profile['rawSlotsHash'] = $this->_hashValue($slots);
        return $profile;
    }

    private function _readRawValue(ElementInterface $owner, VizyField $field): mixed
    {
        $placementUid = FieldPlacements::uid($owner, $field);
        if ($placementUid === null) {
            throw new RuntimeException('Owner migration requires an exact Vizy field placement.');
        }
        $content = (new Query())
            ->select(['content'])
            ->from('{{%elements_sites}}')
            ->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])
            ->scalar();
        if ($content === false || $content === null) {
            throw new RuntimeException('Exact owner/site content row is missing.');
        }
        $content = is_string($content) ? Json::decode($content) : $content;
        if (!is_array($content) || !array_key_exists($placementUid, $content)) {
            throw new RuntimeException(
                'Exact persisted Vizy source value is missing from owner content. Available keys: '
                . implode(', ', is_array($content) ? array_keys($content) : []),
            );
        }
        return $content[$placementUid];
    }

    private function _fieldForOwner(ElementInterface $owner, VizyField $field): VizyField
    {
        $placementUid = FieldPlacements::uid($owner, $field);
        $placed = $placementUid ? FieldPlacements::field($owner, $field->uid, $placementUid) : null;
        if (!$placed) {
            throw new RuntimeException('Owner migration requires an exact Vizy field instance.');
        }
        return $placed;
    }

    private function _decodeSource(mixed $source): mixed
    {
        if (!is_string($source)) {
            return $source;
        }
        try {
            return Json::decode($source);
        } catch (Throwable $exception) {
            throw new RuntimeException('Persisted Vizy source is malformed JSON.', 0, $exception);
        }
    }

    private function _assertTarget(ElementInterface $owner, VizyField $field, array $mapping): void
    {
        if (!$owner->id || !$owner->siteId) {
            throw new RuntimeException('Owner migration requires an exact persisted owner and site.');
        }
        if (!$field->uid || !is_string($mapping['revision'] ?? null) || $mapping['revision'] === '') {
            throw new RuntimeException('Owner migration requires a field UID and non-empty mapping revision.');
        }
        // Retired CA transforms still reach buildCandidate; leaf runs need schemaMap.
        if (isset($mapping['nested']) || !empty($mapping['matrices'])) {
            return;
        }
        if (!array_key_exists('schemaMap', $mapping) || !is_array($mapping['schemaMap'])) {
            throw new RuntimeException('Owner migration requires a leaf schemaMap (explicit or from field provenance).');
        }
    }

    private function _identity(ElementInterface $owner, VizyField $field, string $runUid): array
    {
        return [
            'runUid' => $runUid,
            'fieldUid' => $field->uid,
            'ownerPlacementUid' => FieldPlacements::uid($owner, $field),
            'ownerType' => $owner::class,
            'ownerId' => $owner->id,
            'siteId' => $owner->siteId,
            'derivativeKey' => $this->_derivativeKey($owner),
        ];
    }

    private function _derivativeKey(ElementInterface $owner): string
    {
        if (($owner->revisionId ?? null) !== null) {
            return 'revision:' . $owner->revisionId;
        }
        if (($owner->draftId ?? null) !== null) {
            return 'draft:' . $owner->draftId;
        }
        return 'canonical';
    }

    private function _fail(OwnerMigration $checkpoint, string $code, string $message): array
    {
        $errors = Json::decode((string)$checkpoint->errorsJson) ?: [];
        $errors[] = compact('code', 'message');
        $checkpoint->errorsJson = Json::encode($errors);
        $checkpoint->state = 'failed';
        $checkpoint->failedAt = $this->_now();
        $this->_saveCheckpoint($checkpoint);
        return $this->_result($checkpoint);
    }

    private function _result(OwnerMigration $checkpoint): array
    {
        return [
            'id' => (int)$checkpoint->id,
            'runUid' => $checkpoint->runUid,
            'mappingRevision' => $checkpoint->mappingRevision,
            'mappingHash' => $checkpoint->mappingHash,
            'fieldUid' => $checkpoint->fieldUid,
            'ownerPlacementUid' => $checkpoint->ownerPlacementUid,
            'owner' => [
                'type' => $checkpoint->ownerType,
                'id' => (int)$checkpoint->ownerId,
                'siteId' => (int)$checkpoint->siteId,
                'derivativeKey' => $checkpoint->derivativeKey,
            ],
            'sourceSnapshotHash' => $checkpoint->sourceSnapshotHash,
            'candidateHash' => $checkpoint->candidateHash,
            'uidMap' => Json::decode((string)$checkpoint->uidMapJson) ?: [],
            'state' => $checkpoint->state,
            'attempts' => (int)$checkpoint->attempts,
            'errors' => Json::decode((string)$checkpoint->errorsJson) ?: [],
            'verification' => $checkpoint->verificationJson ? Json::decode((string)$checkpoint->verificationJson) : null,
            'sourceSnapshotRetained' => true,
            'rollbackStatus' => [
                'available' => $checkpoint->sourceSnapshotJson !== null,
                'automaticRollbackPerformed' => false,
                'sourceRetirementAuthorized' => false,
            ],
            'timestamps' => [
                'analyzed' => $checkpoint->analyzedAt,
                'ready' => $checkpoint->readyAt,
                'persisted' => $checkpoint->persistedAt,
                'verified' => $checkpoint->verifiedAt,
                'failed' => $checkpoint->failedAt,
            ],
        ];
    }

    private function _saveCheckpoint(OwnerMigration $checkpoint): void
    {
        if (!$checkpoint->save(false)) {
            throw new RuntimeException('Unable to save owner migration checkpoint.');
        }
    }

    private function _hashSnapshot(mixed $value): string
    {
        return hash('sha256', is_string($value) ? $value : Json::encode($value));
    }

    private function _hashValue(mixed $value): string
    {
        return hash('sha256', Json::encode($value));
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

    private function _now(): string
    {
        return Db::prepareDateForDb(new DateTime());
    }
}
