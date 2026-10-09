<?php
namespace verbb\vizy\helpers;

use verbb\vizy\exceptions\ContentConflictException;

use Craft;

use yii\base\Event;
use yii\web\Response;

/** Format an expected conflict only after Craft has unwound the failed save. */
final class ConflictResponse
{
    // Static Methods
    // =========================================================================

    public static function beforeSend(Event $event): void
    {
        $request = Craft::$app->getRequest();

        if ($request->getIsConsoleRequest() || !$request->getAcceptsJson()) {
            return;
        }
        $exception = Craft::$app->getErrorHandler()->exception;

        // Craft wraps duplication failures in a ServerErrorHttpException. Keep
        // the typed cause, without turning unrelated server errors into conflicts.
        while ($exception && !$exception instanceof ContentConflictException) {
            $exception = $exception->getPrevious();
        }

        if (!$exception instanceof ContentConflictException || !$event->sender instanceof Response) {
            return;
        }

        // Never report successful field acknowledgements from a rolled-back save,
        // or expose a debug stack in the expected conflict response.
        $response = $event->sender;
        $response->setStatusCode(409);
        $response->format = Response::FORMAT_JSON;
        // Re-read after rollback: the owner involved in the rejected transaction
        // can still contain submitted values and an older repeatable-read snapshot.
        $source = $exception->owner;
        $owner = $source::find()->id($source->id)->siteId($source->siteId)
            ->status(null)->drafts(null)->provisionalDrafts(null)->one();
        $reviewUrl = null;

        if ($owner && Craft::$app->getElements()->canView($owner)) {
            $reviewUrl = ($owner->getIsDraft() ? $owner : ($owner->getCurrentRevision() ?? $owner))->getCpEditUrl();
        }
        $response->data = [
            'message' => Craft::t('vizy', $exception->getMessage()),
            'vizy' => ['conflict' => ['code' => 'contentChanged', 'reviewUrl' => $reviewUrl]],
        ];
    }
}
