<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\records\AssetUploadBatch;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
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


    // Public Methods
    // =========================================================================

    public function resetRequestStateForTesting(): void
    {
        $this->accepted = [];
    }

    public function initialFinalization(VizyDocument $document, string $editorId): array
    {
        return $this->_finalization(
            Vizy::$plugin->getAssetUploads()->resultForDocument($document) ?? ['status' => 'complete'],
            ['editorId' => $editorId, 'generation' => 0, 'clientRevision' => 0],
        );
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

        $results = [];
        foreach ($accepted as $item) {
            $metadata = $item['metadata'];
            $assetResult = Vizy::$plugin->getAssetUploads()->resultForOwner($item['owner'], $item['field'])
                ?? ['status' => 'complete', 'batchId' => null, 'errors' => [], 'deferredReason' => null];
            $results[] = [
                'editorId' => (string)($metadata['editorId'] ?? ''),
                'generation' => $metadata['generation'],
                'requestKind' => $metadata['requestKind'],
                'submittedClientRevision' => $metadata['clientRevision'],
                'canonicalDocument' => $item['document']->toArray(),
                'success' => true,
                ...$this->_finalization($assetResult, $metadata),
            ];
        }
        $response->data['vizy'] = ['results' => $results];
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
        foreach (['ownerType', 'ownerId', 'siteId', 'derivativeKey', 'fieldUid', 'snapshotHash', 'workFingerprint'] as $key) {
            if (!$batch || (string)$batch->{$key} !== (string)($payload[$key] ?? null)) {
                throw new RuntimeException('staleRetryToken');
            }
        }
        return $payload;
    }


    // Private Methods
    // =========================================================================

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
        return ($context['ownerClass'] ?? null) === $owner::class
            && (int)($context['siteId'] ?? 0) === (int)$owner->siteId
            && ($context['fieldUid'] ?? null) === $field->uid
            && (
                ((int)($context['ownerId'] ?? 0) > 0 && (int)$context['ownerId'] === (int)$owner->id)
                || (($context['ownerUid'] ?? null) && $context['ownerUid'] === $owner->uid)
                // Craft creates a provisional draft on the first autosave,
                // while the open editor retains its canonical owner's context.
                // The save controller authorizes the derivative; this only
                // associates its result with the original editor request.
                || (
                    empty($context['draftId'])
                    && empty($context['revisionId'])
                    && $owner->getIsDraft()
                    && (int)($context['ownerId'] ?? 0) > 0
                    && (int)$context['ownerId'] === (int)$owner->getCanonicalId()
                )
            );
    }
}
