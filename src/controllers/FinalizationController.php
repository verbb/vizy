<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;

use Craft;
use craft\web\Controller;

use yii\web\ForbiddenHttpException;
use yii\web\Response;

final class FinalizationController extends Controller
{
    // Properties
    // =========================================================================

    protected array|bool|int $allowAnonymous = false;


    // Public Methods
    // =========================================================================

    public function actionRetry(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();
        $payload = Vizy::$plugin->getEditorAcknowledgements()->verifyRetryToken(
            (string)$this->request->getRequiredBodyParam('retryToken'),
        );
        $owner = Craft::$app->getElements()->getElementById(
            (int)$payload['ownerId'],
            (string)$payload['ownerType'],
            (int)$payload['siteId'],
        );
        $user = static::currentUser();
        if (!$owner || !$user || !Craft::$app->getElements()->canSave($owner, $user)) {
            throw new ForbiddenHttpException('forbidden');
        }
        $field = FieldPlacements::field($owner, (string)$payload['fieldUid'], $payload['ownerPlacementUid'] ?? null);
        if (!$field instanceof VizyField) {
            throw new ForbiddenHttpException('staleField');
        }

        // retryBatch rechecks the immutable snapshot and trusted work
        // fingerprint. It never invokes saveElement() on the owner.
        $result = Vizy::$plugin->getAssetUploads()->retryBatch((int)$payload['batchId']);
        $document = $owner->getFieldValue($field->handle);
        if (!$document instanceof \verbb\vizy\document\VizyDocument) {
            $document = $field->normalizeValue($document, $owner);
        }
        return $this->asJson([
            'editorId' => $payload['editorId'],
            'generation' => $payload['generation'],
            'requestKind' => 'autosave',
            'submittedClientRevision' => $payload['clientRevision'],
            'canonicalDocument' => $document->toArray(),
            'success' => true,
            'finalizationStatus' => $result['status'],
            'finalizationDeferredReason' => $result['deferredReason'] ?? null,
            'finalizationErrors' => array_map(
                static fn(string $message): array => ['code' => 'assetFinalization', 'message' => $message],
                $result['errors'] ?? [],
            ),
            'retryToken' => $result['status'] === 'complete'
                ? null
                : (string)$this->request->getRequiredBodyParam('retryToken'),
        ]);
    }
}
