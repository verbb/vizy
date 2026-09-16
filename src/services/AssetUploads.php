<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\db\Table;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\records\AssetUploadBatch;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\events\ElementEvent;
use craft\fields\Assets;
use craft\helpers\Assets as AssetsHelper;
use craft\helpers\DateTimeHelper;
use craft\helpers\Db;
use craft\helpers\Json;
use craft\helpers\StringHelper;

use yii\base\Event;

use RuntimeException;
use Throwable;

/**
 * Focused, durable post-owner-save Asset work.
 */
final class AssetUploads extends Component
{
    // Properties
    // =========================================================================

    private array $registrations = [];
    private array $results = [];
    private bool $flushing = false;
    private mixed $moveAssetHandler = null;


    // Public Methods
    // =========================================================================

    public function setMoveAssetHandlerForTesting(?callable $handler): void
    {
        $this->moveAssetHandler = $handler;
    }

    public function resetRequestStateForTesting(): void
    {
        $this->registrations = [];
        $this->results = [];
        $this->flushing = false;
        $this->moveAssetHandler = null;
    }

    public function defer(ElementInterface $owner, VizyField $field, VizyDocument $document): void
    {
        $key = $this->_scopeKey($owner, $field);
        $this->registrations[$key] = compact('owner', 'field', 'document');
        $this->results[$key] = $this->_result('pending', null, 0, [], 'awaitingOwnerTransactionCommit');
    }

    public function handleAfterSave(ElementEvent $event): void
    {
        $keys = $this->_registrationKeysForOwner($event->element);
        if ($keys === [] || $this->_hasActiveTransaction()) {
            return;
        }

        $this->_flush($keys);
    }

    /**
     * Yii exposes these events specifically for the public outermost
     * transaction boundary; nested savepoint commits never trigger them.
     */
    public function handleTransactionCommit(Event $event): void
    {
        if (!$this->flushing) {
            $this->_flush(array_keys($this->registrations));
        }
    }

    public function handleTransactionRollback(Event $event): void
    {
        if ($this->flushing) {
            return;
        }
        foreach (array_keys($this->registrations) as $key) {
            unset($this->results[$key]);
        }
        $this->registrations = [];
    }

    public function finalizeDocument(VizyDocument $persistedSnapshot): array
    {
        $owner = $persistedSnapshot->owner();
        $field = $persistedSnapshot->field();
        if (!$owner || !$owner->id || !$owner->siteId || !$field?->uid) {
            throw new RuntimeException('Asset finalization requires a persisted owner/site and Vizy field UID.');
        }

        if ($this->_hasActiveTransaction()) {
            $this->defer($owner, $field, $persistedSnapshot);
            return $this->results[$this->_scopeKey($owner, $field)];
        }

        $result = $this->_finalizeSnapshot($persistedSnapshot);
        $this->results[$this->_scopeKey($owner, $field)] = $result;
        return $result;
    }

    public function retryBatch(int $batchId): array
    {
        $batch = AssetUploadBatch::findOne($batchId);
        if (!$batch) {
            throw new RuntimeException("Unknown Vizy Asset upload batch {$batchId}.");
        }
        if (str_starts_with((string)$batch->derivativeKey, 'draft:') || $batch->derivativeKey === 'livePreview') {
            return $this->_result('pending', (int)$batch->id, (int)$batch->attempts, [], (string)$batch->lastError);
        }
        return $this->_execute($batch);
    }

    public function resultForOwner(ElementInterface $owner, VizyField $field): ?array
    {
        return $this->results[$this->_scopeKey($owner, $field)] ?? null;
    }

    public function statusForOwner(ElementInterface $owner, VizyField $field): array
    {
        if (!$owner->id || !$owner->siteId || !$field->uid) {
            return [];
        }
        return array_map(static fn(AssetUploadBatch $batch) => [
            'batchId' => (int)$batch->id,
            'status' => (string)$batch->status,
            'attempts' => (int)$batch->attempts,
            'lastError' => $batch->lastError,
            'deferredReason' => $batch->status === 'pending' ? $batch->lastError : null,
        ], AssetUploadBatch::find()->where([
            'ownerType' => $owner::class,
            'ownerId' => $owner->id,
            'siteId' => $owner->siteId,
            'fieldUid' => $field->uid,
        ])->orderBy(['id' => SORT_DESC])->all());
    }


    // Private Methods
    // =========================================================================

    private function _finalizeSnapshot(VizyDocument $persistedSnapshot, array $preflightErrors = []): array
    {
        $owner = $persistedSnapshot->owner();
        $field = $persistedSnapshot->field();
        if ($owner->getIsRevision()) {
            return $this->_result('nonFinalizable', null, 0, [], 'revisionAssetsNeverFinalize');
        }

        $snapshot = Vizy::$plugin->getDocuments()->serializeValue($persistedSnapshot);
        $work = $this->_discoverWork($persistedSnapshot);
        if ($work === []) {
            return $this->_result('complete');
        }

        $snapshotHash = hash('sha256', $snapshot);
        $workJson = Json::encode($work);
        $workFingerprint = hash('sha256', $workJson);
        $identity = [
            'snapshotHash' => $snapshotHash,
            'workFingerprint' => $workFingerprint,
            'ownerType' => $owner::class,
            'ownerId' => $owner->id,
            'siteId' => $owner->siteId,
            'derivativeKey' => $this->_derivativeKey($owner),
            'fieldUid' => $field->uid,
        ];
        $now = Db::prepareDateForDb(DateTimeHelper::now());
        Db::upsert(Table::ASSET_UPLOAD_BATCHES, [
            ...$identity,
            'workJson' => $workJson,
            'status' => 'pending',
            'attempts' => 0,
            'lastError' => null,
            'dateCreated' => $now,
            'dateUpdated' => $now,
            'uid' => StringHelper::UUID(),
        ], false, updateTimestamp: false);
        $batch = AssetUploadBatch::findOne($identity);
        if (!$batch) {
            throw new RuntimeException('Unable to register the Vizy Asset upload batch.');
        }

        if ($owner->getIsDraft() || $this->_isLivePreview()) {
            $reason = $owner->getIsDraft() ? 'draftDeferredUntilCanonicalPublish' : 'livePreviewDeferred';
            $batch->status = 'pending';
            $batch->lastError = $reason;
            $batch->save(false);
            return $this->_result('pending', (int)$batch->id, (int)$batch->attempts, [], $reason);
        }
        if ($preflightErrors !== []) {
            $batch->attempts = (int)$batch->attempts + 1;
            $batch->status = 'failed';
            $batch->lastError = implode("\n", $preflightErrors);
            $batch->save(false);
            return $this->_result('failed', (int)$batch->id, (int)$batch->attempts, $preflightErrors);
        }

        return $this->_execute($batch);
    }

    private function _discoverWork(VizyDocument $document): array
    {
        $work = [];
        // TipTap + Hosted Blocks — DocumentWalk enters Hosted Vizy placements.
        foreach (\verbb\vizy\document\DocumentWalk::blocks($document, true) as $block) {
            $layout = $block->blockType()?->getFieldLayout();
            if (!$layout) {
                continue;
            }
            $doc = $block->document();
            foreach ($layout->getCustomFieldElements() as $placement) {
                $assetField = $placement->getField();
                if (!$assetField instanceof Assets || !$block->hasRawFieldValue($placement->uid)) {
                    continue;
                }
                $serialized = $assetField->serializeValue(
                    $doc->blockElement($block)->getFieldValue($assetField->handle),
                    $doc->blockElement($block),
                );
                foreach (is_array($serialized) ? $serialized : [] as $assetId) {
                    if (is_numeric($assetId)) {
                        $this->_addWork($work, (int)$assetId, null, $this->_fieldPolicy($assetField), [
                            'kind' => 'fieldPlacement',
                            'blockUid' => $block->uid(),
                            'placementUid' => $placement->uid,
                            'path' => $block->path(),
                        ]);
                    }
                }
            }
        }

        foreach (\verbb\vizy\document\DocumentWalk::tipTapNodes($document, true) as $visit) {
            $node = $visit['node'];
            if (($node['type'] ?? null) !== 'image' || !is_string($node['attrs']['assetUid'] ?? null)) {
                continue;
            }
            $asset = Craft::$app->getElements()->getElementByUid(
                $node['attrs']['assetUid'],
                Asset::class,
                $visit['document']->siteId(),
            );
            if ($asset instanceof Asset) {
                $isTemporary = Craft::$app->getAssets()->createTempAssetQuery()->id($asset->id)->exists();
                if (!$isTemporary) {
                    continue;
                }
                $this->_addWork($work, (int)$asset->id, $asset->uid, [
                    'kind' => 'semanticPending',
                ], ['kind' => 'semanticImage', 'path' => $visit['path']]);
            }
        }

        ksort($work);
        return array_values($work);
    }

    private function _addWork(array &$work, int $assetId, ?string $assetUid, array $policy, array $source): void
    {
        $fingerprint = hash('sha256', Json::encode($policy));
        $key = (string)$assetId;
        if (!isset($work[$key])) {
            $work[$key] = compact('assetId', 'assetUid', 'policy', 'fingerprint') + ['sources' => []];
        } elseif ($work[$key]['fingerprint'] !== $fingerprint) {
            $work[$key]['conflictingFingerprint'] = $fingerprint;
        }
        $work[$key]['sources'][] = $source;
    }

    private function _fieldPolicy(Assets $field): array
    {
        return [
            'kind' => 'field',
            'fieldUid' => $field->uid,
            'volumeSource' => $field->restrictLocation ? $field->restrictedLocationSource : $field->defaultUploadLocationSource,
            'subpath' => $field->restrictLocation
                ? implode('/', array_filter([$field->restrictedLocationSubpath, $field->allowSubfolders ? $field->restrictedDefaultUploadSubpath : null]))
                : $field->defaultUploadLocationSubpath,
            'restrictedBaseSubpath' => $field->restrictedLocationSubpath,
            'restrictLocation' => $field->restrictLocation,
            'allowSubfolders' => $field->allowSubfolders,
        ];
    }

    private function _execute(AssetUploadBatch $batch): array
    {
        if ($batch->status === 'complete') {
            return $this->_result('complete', (int)$batch->id, (int)$batch->attempts);
        }

        $work = Json::decode((string)$batch->workJson);
        $errors = [];
        $owner = null;
        try {
            [$owner, $currentDocument] = $this->_loadCurrentSnapshot($batch);
            $currentSnapshot = Vizy::$plugin->getDocuments()->serializeValue($currentDocument);
            $currentWork = $this->_discoverWork($currentDocument);
            if (
                !hash_equals((string)$batch->snapshotHash, hash('sha256', $currentSnapshot))
                || !hash_equals((string)$batch->workFingerprint, hash('sha256', Json::encode($currentWork)))
            ) {
                $errors[] = 'staleSnapshot: the owner, field value, or trusted destination policy changed after registration.';
            }
        } catch (Throwable $exception) {
            $errors[] = 'snapshotUnavailable: ' . $exception->getMessage();
        }

        foreach ($work as $item) {
            if (isset($item['conflictingFingerprint'])) {
                $errors[] = "Asset {$item['assetId']} has conflicting destination policies.";
            }
        }
        if ($errors === [] && $owner) {
            foreach ($work as $item) {
                try {
                    $this->_executeItem($item, $owner);
                } catch (Throwable $exception) {
                    $errors[] = "Asset {$item['assetId']}: {$exception->getMessage()}";
                }
            }
        }

        $batch->attempts = (int)$batch->attempts + 1;
        $batch->status = $errors === [] ? 'complete' : 'failed';
        $batch->lastError = $errors === [] ? null : implode("\n", $errors);
        $batch->save(false);
        return [
            'status' => (string)$batch->status,
            'batchId' => (int)$batch->id,
            'attempts' => (int)$batch->attempts,
            'errors' => $errors,
            'deferredReason' => null,
        ];
    }

    private function _executeItem(array $item, ElementInterface $owner): void
    {
        $asset = Craft::$app->getAssets()->getAssetById((int)$item['assetId']);
        if (!$asset) {
            throw new RuntimeException('Referenced Asset is unavailable.');
        }

        $policy = $item['policy'];
        $isTemporary = Craft::$app->getAssets()->createTempAssetQuery()->id($asset->id)->exists();
        if (($policy['kind'] ?? null) === 'semanticPending') {
            // Defense in depth: older batches may still list volume-resident
            // semantic Images; those are already finalized.
            if (!$isTemporary) {
                return;
            }
            throw new RuntimeException('semanticImagePolicyPending: semantic Image finalization requires a server-owned Image policy.');
        }

        // Keeping a file in a permitted location is read-only, including a
        // restricted field whose destination is already satisfied.
        if (!$isTemporary && $policy['kind'] === 'field' && $this->_canRetainLocation($asset, $policy, $owner)) {
            return;
        }

        $actor = Craft::$app->getUser()->getIdentity();
        // Temporary uploads belong to their uploader. Destination permission
        // alone never authorizes taking another user's pending file.
        if ($isTemporary && $actor && !Craft::$app->getElements()->canView($asset, $actor)) {
            throw new RuntimeException('The current actor cannot access this temporary Asset.');
        }

        $folder = null;
        if ($policy['kind'] === 'field') {
            $field = Craft::$app->getFields()->getFieldByUid($policy['fieldUid']);
            if (!$field instanceof Assets) {
                throw new RuntimeException('Assets field policy is no longer resolvable.');
            }
            $this->_assertActorCanSaveToSource((string)$policy['volumeSource']);
            $folder = Craft::$app->getAssets()->getFolderById($field->resolveDynamicPathToFolderId($owner));
        } else {
            $volume = Craft::$app->getVolumes()->getVolumeByUid($policy['volumeUid']);
            if (!$volume) {
                throw new RuntimeException('Destination volume is unavailable.');
            }
            [$subpath, $folder] = AssetsHelper::resolveSubpath($volume, $policy['subpath'], $owner);
            $folder ??= Craft::$app->getAssets()->ensureFolderByFullPathAndVolume($subpath, $volume, false);
        }
        if (!$folder) {
            throw new RuntimeException('Destination folder is unavailable.');
        }
        $volume = $folder->getVolume();
        if ($actor && !$actor->can("saveAssets:{$volume->uid}")) {
            throw new RuntimeException('The current actor cannot save Assets to the trusted destination volume.');
        }

        $restrictionFolder = $folder;
        if ($policy['kind'] === 'field' && $policy['restrictLocation'] && $policy['allowSubfolders']) {
            $source = (string)$policy['volumeSource'];
            $parts = explode(':', $source, 2);
            $volume = count($parts) === 2 ? Craft::$app->getVolumes()->getVolumeByUid($parts[1]) : null;
            if (!$volume) {
                throw new RuntimeException('Restricted Asset volume is unavailable.');
            }
            [$basePath, $restrictionFolder] = AssetsHelper::resolveSubpath(
                $volume,
                $policy['restrictedBaseSubpath'] ?? '',
                $owner,
            );
            $restrictionFolder ??= Craft::$app->getAssets()->ensureFolderByFullPathAndVolume($basePath, $volume, false);
        }
        $mustEnforceRestricted = (bool)$policy['restrictLocation'] && (
            $asset->volumeId !== $restrictionFolder->volumeId
            || (!$policy['allowSubfolders'] && $asset->folderId !== $restrictionFolder->id)
            || ($policy['allowSubfolders'] && !str_starts_with($asset->folderPath, $restrictionFolder->path))
        );
        if (!$isTemporary && !$mustEnforceRestricted) {
            return;
        }

        if (!$isTemporary && $actor && !Craft::$app->getElements()->canSave($asset, $actor)) {
            throw new RuntimeException('The current actor cannot move this Asset from its source volume.');
        }

        $asset->avoidFilenameConflicts = true;
        $moved = $this->moveAssetHandler
            ? ($this->moveAssetHandler)($asset, $folder)
            : Craft::$app->getAssets()->moveAsset($asset, $folder);
        if (!$moved) {
            throw new RuntimeException('Craft could not move the Asset.');
        }
    }

    private function _assertActorCanSaveToSource(string $source): void
    {
        [$kind, $uid] = array_pad(explode(':', $source, 2), 2, null);
        if ($kind !== 'volume' || !$uid) {
            throw new RuntimeException('Trusted Asset destination volume is invalid.');
        }
        $volume = Craft::$app->getVolumes()->getVolumeByUid($uid);
        if (!$volume) {
            throw new RuntimeException('Trusted Asset destination volume is unavailable.');
        }
        $actor = Craft::$app->getUser()->getIdentity();
        if ($actor && !$actor->can("saveAssets:{$volume->uid}")) {
            throw new RuntimeException('The current actor cannot save Assets to the trusted destination volume.');
        }
    }

    private function _canRetainLocation(Asset $asset, array $policy, ElementInterface $owner): bool
    {
        if (!$policy['restrictLocation']) {
            return true;
        }
        [$kind, $uid] = array_pad(explode(':', (string)$policy['volumeSource'], 2), 2, null);
        $volume = $kind === 'volume' && $uid ? Craft::$app->getVolumes()->getVolumeByUid($uid) : null;
        if (!$volume || $asset->volumeId !== $volume->id) {
            return false;
        }
        // This only resolves/looks up the path; it never creates folders before
        // authorization. Upload subfolders do not narrow an allowed base tree.
        [, $folder] = AssetsHelper::resolveSubpath(
            $volume,
            $policy['allowSubfolders'] ? $policy['restrictedBaseSubpath'] : $policy['subpath'],
            $owner,
        );
        return $folder && ($policy['allowSubfolders']
            ? str_starts_with($asset->folderPath, $folder->path)
            : $asset->folderId === $folder->id);
    }

    private function _isLivePreview(): bool
    {
        $request = Craft::$app->getRequest();
        return method_exists($request, 'getIsLivePreview') && $request->getIsLivePreview();
    }

    private function _loadCurrentSnapshot(AssetUploadBatch $batch): array
    {
        $owner = Craft::$app->getElements()->getElementById(
            (int)$batch->ownerId,
            (string)$batch->ownerType,
            (int)$batch->siteId,
        );
        if (!$owner) {
            throw new RuntimeException("Asset upload batch {$batch->id} owner is unavailable.");
        }
        $field = Craft::$app->getFields()->getFieldByUid((string)$batch->fieldUid);
        if (!$field instanceof VizyField) {
            throw new RuntimeException("Asset upload batch {$batch->id} Vizy field is unavailable.");
        }
        $document = $owner->getFieldValue($field->handle);
        if (!$document instanceof VizyDocument) {
            $document = $field->normalizeValue($document, $owner);
        }
        return [$owner, $document];
    }

    private function _flush(array $keys): void
    {
        if ($keys === [] || $this->flushing) {
            return;
        }

        $this->flushing = true;
        $failed = [];
        try {
            $preflightErrors = $this->_registrationDestinationConflicts($keys);
            foreach ($keys as $key) {
                $registration = $this->registrations[$key] ?? null;
                unset($this->registrations[$key]);
                if (!$registration) {
                    continue;
                }
                $result = $this->_finalizeSnapshot($registration['document'], $preflightErrors[$key] ?? []);
                $this->results[$key] = $result;
                if ($result['status'] === 'failed') {
                    $failed[] = $result;
                }
            }
        } finally {
            $this->flushing = false;
        }

        if ($failed !== [] && Craft::$app->getRequest()->getIsConsoleRequest()) {
            throw new AssetFinalizationException($failed);
        }
    }

    private function _registrationDestinationConflicts(array $keys): array
    {
        $claims = [];
        foreach ($keys as $key) {
            $registration = $this->registrations[$key] ?? null;
            if (!$registration) {
                continue;
            }
            if ($registration['owner']->getIsDraft() || $registration['owner']->getIsRevision()) {
                // Derivatives never move Assets. In a publish transaction Craft
                // may save the source draft beside the canonical owner; only
                // finalizable canonical registrations can claim a destination.
                continue;
            }
            foreach ($this->_discoverWork($registration['document']) as $item) {
                if (($item['policy']['kind'] ?? null) !== 'field') {
                    continue;
                }
                $field = Craft::$app->getFields()->getFieldByUid($item['policy']['fieldUid']);
                if (!$field instanceof Assets) {
                    continue;
                }
                try {
                    $this->_assertActorCanSaveToSource((string)$item['policy']['volumeSource']);
                    $folderId = $field->resolveDynamicPathToFolderId($registration['owner']);
                } catch (Throwable) {
                    // Normal per-batch execution persists destination/permission
                    // failures. Cross-registration preflight only detects
                    // conflicts between otherwise resolvable destinations.
                    continue;
                }
                $claims[(int)$item['assetId']][] = [
                    'key' => $key,
                    'destination' => (int)$folderId,
                ];
            }
        }

        $errors = [];
        foreach ($claims as $assetId => $assetClaims) {
            $destinations = array_unique(array_column($assetClaims, 'destination'));
            if (count($destinations) < 2) {
                continue;
            }
            foreach ($assetClaims as $claim) {
                $errors[$claim['key']][] = "Asset {$assetId} has conflicting multisite destination contexts.";
            }
        }
        return $errors;
    }

    private function _registrationKeysForOwner(ElementInterface $owner): array
    {
        $prefix = implode('|', [
            $owner::class,
            (string)$owner->id,
            (string)$owner->siteId,
            $this->_derivativeKey($owner),
        ]) . '|';
        return array_values(array_filter(
            array_keys($this->registrations),
            static fn(string $key): bool => str_starts_with($key, $prefix),
        ));
    }

    private function _scopeKey(ElementInterface $owner, VizyField $field): string
    {
        return implode('|', [
            $owner::class,
            (string)$owner->id,
            (string)$owner->siteId,
            $this->_derivativeKey($owner),
            (string)$field->uid,
        ]);
    }

    private function _derivativeKey(ElementInterface $owner): string
    {
        if ($owner->getIsRevision()) {
            return 'revision:' . (string)$owner->revisionId;
        }
        if ($owner->getIsDraft()) {
            return 'draft:' . (string)$owner->draftId;
        }
        return $this->_isLivePreview() ? 'livePreview' : 'canonical';
    }

    private function _hasActiveTransaction(): bool
    {
        return Craft::$app->getDb()->getTransaction()?->getIsActive() ?? false;
    }

    private function _result(
        string $status,
        ?int $batchId = null,
        int $attempts = 0,
        array $errors = [],
        ?string $deferredReason = null,
    ): array {
        return compact('status', 'batchId', 'attempts', 'errors', 'deferredReason');
    }
}
