<?php

declare(strict_types=1);

use Craft;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\WebControllerHarness;
use verbb\vizy\controllers\IconsController;
use verbb\vizy\Vizy;
use yii\web\BadRequestHttpException;

beforeEach(function() {
    AssetSpikeFixture::ensureAdminUser();
});

afterEach(function() {
    WebControllerHarness::endWebRequest();
});

it('serves the icon catalog on CP requests', function() {
    WebControllerHarness::beginWebRequest();
    Craft::$app->getRequest()->setIsCpRequest(true);

    $controller = new IconsController('icons', Vizy::$plugin);
    $controller->request = Craft::$app->getRequest();
    $controller->response = Craft::$app->getResponse();

    $response = $controller->runAction('index');

    expect($response->data)->toBeArray();
});

it('rejects the icon catalog outside the CP', function() {
    WebControllerHarness::beginWebRequest();
    Craft::$app->getRequest()->setIsCpRequest(false);

    $controller = new IconsController('icons', Vizy::$plugin);
    $controller->request = Craft::$app->getRequest();
    $controller->response = Craft::$app->getResponse();

    expect(fn() => $controller->runAction('index'))
        ->toThrow(BadRequestHttpException::class);
});
