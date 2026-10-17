<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\records\AssetUploadBatch;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\base\NestedElementInterface;
use craft\events\DraftEvent;
use craft\helpers\Json;

use yii\base\Event;
use yii\web\Response;

use RuntimeException;

/**
 * Request-local bridge from Craft's owner save to the matching editor request.
 *
 * It never changes owner persistence. It only annotates an elements/* JSON
 * response after the transaction/finalization boundary has settled.
 */
final class EditorAcknowledgements extends Component
{
    // Constants
    // =========================================================================

    private const RETRY_PURPOSE = 'vizy-finalization-retry';
    private const RETRY_TTL = 3600;


    // Properties
    // =========================================================================

    private array $accepted = [];
    private array $embedded = [];
    private array $pendingDraftIds = [];
    private array $pendingDraftUids = [];
    private array $committedDraftIds = [];
    private array $committedDraftUids = [];


    // Public Methods
    // =========================================================================

    public function resetRequestStateForTesting(): void
    {
        $this->accepted = [];
        $this->embedded = [];
        $this->pendingDraftIds = $this->pendingDraftUids = [];
        $this->committedDraftIds = $this->committedDraftUids = [];
    }

    public function initialFinalization(VizyDocument $document, string $editorId): array
    {
        return $this->_finalization(
            Vizy::$plugin->getAssetUploads()->resultForDocument($document) ?? ['status' => 'complete'],
            ['editorId' => $editorId, 'generation' => 0, 'clientRevision' => 0],
        );
    }

    /** Keep transport identity until the real owner confirms persistence. */
    public function stageEmbedded(ElementInterface $owner, VizyField $field, VizyDocument $document): void
    {
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            return;
        }
        $root = \verbb\vizy\helpers\EmbeddedOwners::scope($owner)['owner'] ?? null;

        if ($root) {
            $this->embedded[spl_object_id($owner) . ':' . $field->handle] = compact('root', 'owner', 'field', 'document');
        }
    }

    public function collectEmbedded(ElementInterface $root): void
    {
        foreach ($this->embedded as $key => $item) {
            if ($item['root'] === $root) {
                $this->collect($item['owner'], $item['field'], $item['document']);
                unset($this->embedded[$key]);
            }
        }
    }

    public function collect(ElementInterface $owner, VizyField $field, VizyDocument $document): void
    {
        $request = Craft::$app->getRequest();

        if ($request->getIsConsoleRequest()) {
            return;
        }
        $all = $request->getBodyParam('vizyTransport', []);

        if (!is_array($all)) {
            return;
        }

        foreach ($all as $metadata) {
            if (!is_array($metadata) || ($metadata['fieldUid'] ?? null) !== $field->uid) {
                continue;
            }

            try {
                $context = Vizy::$plugin->getEditorContexts()->verify((string)($metadata['editorContextToken'] ?? ''));
            } catch (\Throwable) {
                continue;
            }

            if (
                !$this->_contextMatches($context, $owner, $field)
                || !is_numeric($metadata['generation'] ?? null)
                || !is_numeric($metadata['clientRevision'] ?? null)
                || !in_array($metadata['requestKind'] ?? null, ['save', 'autosave', 'livePreview', 'validation'], true)
            ) {
                continue;
            }

            if (isset($context['embeddedPath']) && ($document->toArray()['attrs']['_editorId'] ?? null) !== ($metadata['editorId'] ?? null)) {
                continue;
            }
            $metadata['generation'] = (int)$metadata['generation'];
            $metadata['clientRevision'] = (int)$metadata['clientRevision'];
            // First autosave serializes the initial draft copy before applying
            // the submitted edits. Acknowledge only the latest persisted
            // snapshot for this editor, never that intermediate copy.
            $this->accepted[(string)($metadata['editorId'] ?? '')] = compact('owner', 'field', 'document', 'metadata');
        }
    }

    public function augmentResponse(Event $event): void
    {
        $this->embedded = [];
        $draftIds = $this->committedDraftIds;
        $draftUids = $this->committedDraftUids;
        $this->pendingDraftIds = $this->pendingDraftUids = [];
        $this->committedDraftIds = $this->committedDraftUids = [];

        if ($this->accepted === []) {
            return;
        }

        // BEFORE_SEND is the end of this web request. Always drain the
        // collector so a non-elements route cannot leak into the next one.
        $accepted = $this->accepted;
        $this->accepted = [];

        $route = (string)(Craft::$app->requestedRoute ?? '');
        $response = $event->sender;

        if (!$response instanceof Response || !str_starts_with($route, 'elements/') || !is_array($response->data)) {
            return;
        }

        // Craft deliberately commits an invalid draft before returning its
        // publish validation error. Only that committed snapshot may advance
        // the editor's version; other failures must never acknowledge a save.
        $draftValidation = $route === 'elements/apply-draft' && $response->getStatusCode() === 400;

        if (!$response->getIsSuccessful() && !$draftValidation) {
            return;
        }

        $results = [];

        foreach ($accepted as $item) {
            if ($draftValidation && !isset($item['committedDraft'])) {
                continue;
            }
            $metadata = $item['metadata'];
            $assetResult = Vizy::$plugin->getAssetUploads()->resultForOwner($item['owner'], $item['field'])
                ?? ['status' => 'complete', 'batchId' => null, 'errors' => [], 'deferredReason' => null];
            $results[] = [
                'editorId' => (string)($metadata['editorId'] ?? ''),
                'generation' => $metadata['generation'],
                'requestKind' => $metadata['requestKind'],
                'submittedClientRevision' => $metadata['clientRevision'],
                'canonicalDocument' => $draftValidation ? $item['committedDraft']['canonicalDocument'] : Json::decode(Vizy::$plugin->getDocuments()->serializeValue($item['document'])),
                'storageToken' => $draftValidation ? $item['committedDraft']['storageToken'] : Vizy::$plugin->getContentVersions()->issue($item['owner'], $item['field']),
                'success' => true,
                ...$this->_finalization($assetResult, $metadata),
            ];
        }

        if ($results !== []) {
            $response->data['vizy'] = ['results' => $results];

            if ($draftValidation) {
                // The retained native widgets need the identities created by
                // Craft's failed publish, just as after a normal draft save.
                $response->data['draftElementIds'] = $draftIds;
                $response->data['draftElementUids'] = $draftUids;
            }
        }
    }

    public function collectDraftIdentity(DraftEvent $event): void
    {
        if (Craft::$app->requestedRoute === 'elements/apply-draft') {
            $this->pendingDraftIds[$event->canonical->id] = $event->draft->id;
            $this->pendingDraftUids[$event->canonical->uid] = $event->draft->uid;
        }
    }

    public function handleTransactionCommit(Event $event): void
    {
        if (Craft::$app->requestedRoute !== 'elements/apply-draft') {
            return;
        }
        $this->committedDraftIds = array_replace($this->committedDraftIds, $this->pendingDraftIds);
        $this->committedDraftUids = array_replace($this->committedDraftUids, $this->pendingDraftUids);
        $this->pendingDraftIds = $this->pendingDraftUids = [];

        foreach ($this->accepted as &$item) {
            $root = \verbb\vizy\helpers\EmbeddedOwners::scope($item['owner'])['owner'] ?? $item['owner'];

            if (isset($item['committedDraft']) || !$this->_isDraftOwner($root)) {
                continue;
            }
            // Capture at the outer commit, not at response time: another writer
            // must not supply the version for this request's saved document.
            $item['committedDraft'] = [
                'canonicalDocument' => Json::decode(Vizy::$plugin->getDocuments()->serializeValue($item['document'])),
                'storageToken' => Vizy::$plugin->getContentVersions()->issue($item['owner'], $item['field']),
            ];
        }
    }

    public function handleTransactionRollback(Event $event): void
    {
        $this->accepted = array_filter($this->accepted, static fn(array $item): bool => isset($item['committedDraft']));
        $this->embedded = [];
        $this->pendingDraftIds = $this->pendingDraftUids = [];
    }

    public function verifyRetryToken(string $token): array
    {
        $encoded = strtr($token, '-_', '+/');
        $encoded .= str_repeat('=', (4 - strlen($encoded) % 4) % 4);
        $signed = base64_decode($encoded, true);
        $json = $signed === false ? false : Craft::$app->getSecurity()->validateData($signed);
        $payload = is_string($json) ? Json::decode($json) : null;

        if (
            !is_array($payload)
            || ($payload['purpose'] ?? null) !== self::RETRY_PURPOSE
            || !is_int($payload['expiresAt'] ?? null)
            || $payload['expiresAt'] < time()
            || (int)($payload['userId'] ?? 0) !== (int)Craft::$app->getUser()->getId()
        ) {
            throw new RuntimeException('invalidRetryToken');
        }
        $batch = AssetUploadBatch::findOne((int)($payload['batchId'] ?? 0));

        foreach (['ownerType', 'ownerId', 'siteId', 'derivativeKey', 'fieldUid', 'ownerPlacementUid', 'snapshotHash', 'workFingerprint'] as $key) {
            if (!$batch || (string)$batch->{$key} !== (string)($payload[$key] ?? null)) {
                throw new RuntimeException('staleRetryToken');
            }
        }
        return $payload;
    }


    // Private Methods
    // =========================================================================

    private function _isDraftOwner(ElementInterface $owner): bool
    {
        // Neo and other nested elements can persist their own content without
        // being drafts themselves. Their containing entry owns publication.
        $seen = [];

        while (!isset($seen[spl_object_id($owner)])) {
            $seen[spl_object_id($owner)] = true;

            if ($owner->getIsDraft()) {
                return true;
            }

            if (!$owner instanceof NestedElementInterface || !($parent = $owner->getOwner())) {
                return false;
            }
            $owner = $parent;
        }
        return false;
    }

    private function _finalization(array $result, array $metadata): array
    {
        $status = in_array($result['status'] ?? null, ['complete', 'pending', 'failed'], true)
            ? $result['status']
            : 'complete';
        $deferredReason = $result['deferredReason'] ?? null;
        $retryable = in_array($status, ['pending', 'failed'], true)
            && !in_array($deferredReason, ['draftDeferredUntilCanonicalPublish', 'livePreviewDeferred'], true);

        return [
            'finalizationStatus' => $status,
            'finalizationErrors' => array_map(
                static fn(string $message): array => ['code' => 'assetFinalization', 'message' => $message],
                $result['errors'] ?? [],
            ),
            'finalizationDeferredReason' => $deferredReason,
            'retryToken' => $retryable && !empty($result['batchId'])
                ? $this->_issueRetryToken((int)$result['batchId'], $metadata)
                : null,
        ];
    }

    private function _issueRetryToken(int $batchId, array $metadata): string
    {
        $batch = AssetUploadBatch::findOne($batchId);

        if (!$batch) {
            throw new RuntimeException('missingRetryBatch');
        }
        $payload = [
            'purpose' => self::RETRY_PURPOSE,
            'userId' => Craft::$app->getUser()->getId(),
            'batchId' => $batchId,
            'ownerType' => $batch->ownerType,
            'ownerId' => (int)$batch->ownerId,
            'siteId' => (int)$batch->siteId,
            'derivativeKey' => $batch->derivativeKey,
            'fieldUid' => $batch->fieldUid,
            'ownerPlacementUid' => $batch->ownerPlacementUid,
            'snapshotHash' => $batch->snapshotHash,
            'workFingerprint' => $batch->workFingerprint,
            'editorId' => (string)($metadata['editorId'] ?? ''),
            'generation' => (int)$metadata['generation'],
            'clientRevision' => (int)$metadata['clientRevision'],
            'issuedAt' => time(),
            'expiresAt' => time() + self::RETRY_TTL,
        ];
        return rtrim(strtr(
            base64_encode(Craft::$app->getSecurity()->hashData(Json::encode($payload))),
            '+/',
            '-_',
        ), '=');
    }

    private function _contextMatches(array $context, ElementInterface $owner, VizyField $field): bool
    {
        $embedded = \verbb\vizy\helpers\EmbeddedOwners::scope($owner);
        $placement = $embedded ? $embedded['path'][0]['placementUid'] : FieldPlacements::uid($owner, $field);
        $owner = $embedded['owner'] ?? $owner;
        return ($context['ownerClass'] ?? null) === $owner::class
            && (int)($context['siteId'] ?? 0) === (int)$owner->siteId
            && ($context['fieldUid'] ?? null) === $field->uid
            && ($context['ownerLayoutUid'] ?? null) === $owner->getFieldLayout()?->uid
            && ($context['ownerPlacementUid'] ?? null) === $placement
            && (
                ((int)($context['ownerId'] ?? 0) > 0 && (int)$context['ownerId'] === (int)$owner->id)
                || (($context['ownerUid'] ?? null) && $context['ownerUid'] === $owner->uid)
                // Craft also copies nested rows into a provisional draft without
                // marking the rows themselves as drafts. Their open editors
                // retain the canonical owner's context on subsequent autosaves.
                // The save controller authorizes the derivative; this only
                // associates its result with the original editor request.
                || (
                    empty($context['draftId'])
                    && empty($context['revisionId'])
                    && $this->_isDraftOwner($owner)
                    && (int)($context['ownerId'] ?? 0) > 0
                    && (int)$context['ownerId'] === (int)$owner->getCanonicalId()
                )
            );
    }
}
