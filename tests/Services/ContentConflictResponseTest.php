<?php

use craft\elements\Entry;
use Tests\Support\WebControllerHarness;
use verbb\vizy\exceptions\ContentConflictException;
use verbb\vizy\helpers\ConflictResponse;
use yii\base\Event;

it('returns an identifiable 409 without partial acknowledgements or debug details', function(bool $wrapped) {
    WebControllerHarness::beginWebRequest();
    $handler = Craft::$app->getErrorHandler();
    $previous = $handler->exception;
    try {
        $handler->exception = new ContentConflictException(new Entry(['id' => -1, 'siteId' => 1]));
        if ($wrapped) $handler->exception = new \yii\web\ServerErrorHttpException('Duplicate failed', 0, $handler->exception);
        $response = Craft::$app->getResponse();
        $response->setStatusCode(500);
        $response->data = ['trace' => 'private', 'vizy' => ['results' => [['success' => true]]]];
        ConflictResponse::beforeSend(new Event(['sender' => $response]));
        expect($response->statusCode)->toBe(409);
        expect($response->data['vizy'])->toBe(['conflict' => ['code' => 'contentChanged', 'reviewUrl' => null]]);
        expect($response->data)->not->toHaveKey('trace');
        expect($response->data['message'])->toContain('not been saved');
    } finally {
        $handler->exception = $previous;
        WebControllerHarness::endWebRequest();
    }
})->with([false, true]);

it('leaves unrelated exceptions and invalid tokens with Craft error handling', function() {
    WebControllerHarness::beginWebRequest();
    $handler = Craft::$app->getErrorHandler();
    $previous = $handler->exception;
    try {
        $handler->exception = new RuntimeException('Invalid token');
        $response = Craft::$app->getResponse();
        $response->setStatusCode(500);
        $response->data = ['message' => 'Invalid token'];
        ConflictResponse::beforeSend(new Event(['sender' => $response]));
        expect($response->statusCode)->toBe(500);
        expect($response->data)->toBe(['message' => 'Invalid token']);
    } finally {
        $handler->exception = $previous;
        WebControllerHarness::endWebRequest();
    }
});
