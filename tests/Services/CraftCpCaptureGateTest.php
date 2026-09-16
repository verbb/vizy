<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;
use verbb\vizy\web\assets\field\VizyAsset;

beforeEach(function() {
    AssetSpikeFixture::ensureAdminUser();
    Vizy::$plugin->getEditorAcknowledgements()->resetRequestStateForTesting();
    Vizy::$plugin->getAssetUploads()->resetRequestStateForTesting();
});

it('proves production asset registration defines vizy-editor on real field input HTML', function() {
    $owner = VizyFixtureFactory::entry('CP capture owner');
    $field = VizyFixtureFactory::vizyField();
    $value = $owner->getFieldValue($field->handle);
    $view = Craft::$app->getView();
    $html = $field->getInputHtml($value, $owner);
    $bundle = $view->assetBundles[VizyAsset::class] ?? null;
    expect($bundle)->toBeInstanceOf(VizyAsset::class);
    $bundle->registerAssetFiles($view);

    $jsPath = $bundle->sourcePath . DIRECTORY_SEPARATOR . $bundle->js[0];
    $js = file_get_contents($jsPath);
    expect($html)->toContain('<vizy-editor')
        ->and(substr_count($html, 'data-vizy-document'))->toBe(1)
        ->and($html)->toContain('data-vizy-bootstrap')
        ->and($html)->not->toContain('bootstrapEditor(')
        ->and($html)->not->toContain('vizyHost[')
        ->and($js)->toMatch("/customElements\\.define\\([`'\"]vizy-editor[`'\"]/")
        ->and($js)->toContain('bootstrapEditor')
        ->and(Json::encode($view->jsFiles))->toContain(basename($bundle->js[0]));
});

it('tags preview and validation acknowledgements and excludes non-element responses', function() {
    $owner = VizyFixtureFactory::entry('Capture preview owner');
    $field = VizyFixtureFactory::vizyField();
    $document = $owner->getFieldValue($field->handle);
    $token = Vizy::$plugin->getEditorContexts()->issue($owner, $field)['token'];

    // elements/* JSON routes may carry acknowledgements; Live Preview isolation is
    // enforced by VizyEditorElement.acceptServerResult ignoring requestKind=livePreview.
    $preview = \Tests\Support\WebControllerHarness::withWebRequest([
        'vizyTransport' => \Tests\Support\WebControllerHarness::transportMetadata(
            'preview-editor',
            $field->uid,
            $token,
            1,
            1,
            'livePreview',
        ),
    ], 'elements/preview', function() use ($owner, $field, $document) {
        Vizy::$plugin->getEditorAcknowledgements()->collect($owner, $field, $document);
        $response = new \craft\web\Response();
        $response->data = ['preview' => true];
        Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new \yii\base\Event(['sender' => $response]));
        return $response->data;
    });
    expect($preview['vizy']['results'][0])->toMatchArray([
        'editorId' => 'preview-editor',
        'requestKind' => 'livePreview',
        'finalizationStatus' => 'complete',
    ]);

    $nonElement = \Tests\Support\WebControllerHarness::withWebRequest([
        'vizyTransport' => \Tests\Support\WebControllerHarness::transportMetadata(
            'preview-editor',
            $field->uid,
            $token,
            2,
            2,
            'livePreview',
        ),
    ], 'dashboard/index', function() use ($owner, $field, $document) {
        // Fresh collector state: previous augmentResponse cleared accepted results.
        Vizy::$plugin->getEditorAcknowledgements()->collect($owner, $field, $document);
        $response = new \craft\web\Response();
        $response->data = ['ok' => true];
        Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new \yii\base\Event(['sender' => $response]));
        return $response->data;
    });
    expect($nonElement)->toBe(['ok' => true]);

    $validationToken = Vizy::$plugin->getEditorContexts()->issue($owner, $field)['token'];
    $validation = \Tests\Support\WebControllerHarness::withWebRequest([
        'vizyTransport' => \Tests\Support\WebControllerHarness::transportMetadata(
            'validation-editor',
            $field->uid,
            $validationToken,
            5,
            8,
            'validation',
        ),
    ], 'elements/validate', function() use ($owner, $field, $document) {
        Vizy::$plugin->getEditorAcknowledgements()->collect($owner, $field, $document);
        $response = new \craft\web\Response();
        $response->data = ['success' => false];
        Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new \yii\base\Event(['sender' => $response]));
        return $response->data;
    });
    expect($validation['vizy']['results'][0])->toMatchArray([
        'editorId' => 'validation-editor',
        'generation' => 5,
        'requestKind' => 'validation',
        'submittedClientRevision' => 8,
        'finalizationStatus' => 'complete',
    ]);
});
