<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;
use verbb\vizy\web\assets\field\VizyAsset;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\controllers\FieldLayoutController;

it('signs editor context and rejects tampering', function() {
    $owner = new Entry([
        'uid' => StringHelper::UUID(),
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
    ]);
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Runtime',
        'handle' => 'runtime',
    ]);
    $context = Vizy::$plugin->getEditorContexts()->issue($owner, $field);

    expect(Vizy::$plugin->getEditorContexts()->verify($context['token']))
        ->toMatchArray([
            'purpose' => 'vizy-editor-context',
            'ownerClass' => Entry::class,
            'ownerUid' => $owner->uid,
            'fieldUid' => $field->uid,
        ])
        ->and(fn() => Vizy::$plugin->getEditorContexts()->verify($context['token'] . 'x'))
        ->toThrow(RuntimeException::class, 'invalidContext');
});

it('renders exactly one canonical editor control without synthetic persisted Block elements', function() {
    $owner = new Entry([
        'uid' => StringHelper::UUID(),
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
    ]);
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Runtime',
        'handle' => 'runtime',
    ]);
    $nodes = [];
    for ($index = 0; $index < 100; $index++) {
        $nodes[] = [
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => StringHelper::UUID(),
                'enabled' => true,
                'fieldSlots' => [],
            ],
            'content' => [],
        ];
    }
    $value = $field->normalizeValue(Json::encode([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => $nodes,
    ]), $owner);

    $html = $field->getInputHtml($value, $owner);
    expect(substr_count($html, '<vizy-editor'))->toBe(1)
        ->and(substr_count($html, 'data-vizy-document'))->toBe(1)
        ->and($html)->not->toContain('<textarea')
        ->and($value->blockElementCreationCount())->toBe(0);
});

it('publishes the built production entry and css when the real field input renders', function() {
    $owner = new Entry([
        'uid' => StringHelper::UUID(),
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
    ]);
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Production asset',
        'handle' => 'productionAsset',
    ]);
    $value = $field->normalizeValue(Json::encode([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [],
    ]), $owner);
    $view = Craft::$app->getView();
    $html = $field->getInputHtml($value, $owner);
    $bundle = $view->assetBundles[VizyAsset::class] ?? null;
    $bundle?->registerAssetFiles($view);

    expect($bundle)->toBeInstanceOf(VizyAsset::class)
        ->and($bundle->js)->toHaveCount(1)
        ->and($bundle->js[0])->toMatch('/^assets\/vizy-.*\.js$/')
        ->and($bundle->css)->toHaveCount(1)
        ->and($bundle->css[0])->toMatch('/^assets\/vizy-.*\.css$/')
        ->and(is_file($bundle->sourcePath . DIRECTORY_SEPARATOR . $bundle->js[0]))->toBeTrue()
        ->and(is_file($bundle->sourcePath . DIRECTORY_SEPARATOR . $bundle->css[0]))->toBeTrue()
        ->and(Json::encode($view->jsFiles))->toContain('vizy-')
        ->and(Json::encode($view->cssFiles))->toContain('vizy-')
        // Bootstrap rides on the host via <template data-vizy-bootstrap> (not registerJs).
        ->and($html)->toContain('data-vizy-bootstrap')
        ->and($html)->toContain('data-vizy-document');
});

it('recreates an unsaved Entry with its signed section and type layout', function() {
    $section = VizyFixtureFactory::section();
    $entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
    $field = VizyFixtureFactory::vizyField();
    $owner = new Entry([
        'uid' => StringHelper::UUID(),
        'sectionId' => $section->id,
        'typeId' => $entryType->id,
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
        'scenario' => Entry::SCENARIO_LIVE,
    ]);
    $context = Vizy::$plugin->getEditorContexts()->issue($owner, $field);
    $verified = Vizy::$plugin->getEditorContexts()->verify($context['token']);
    $controller = new FieldLayoutController('field-layout', Vizy::$plugin);
    $resolve = new ReflectionMethod($controller, '_resolveOwner');
    $recreated = $resolve->invoke($controller, $verified);

    expect($verified['definingAttributes'])->toMatchArray([
        'sectionId' => $section->id,
        'typeId' => $entryType->id,
    ])->and($recreated)->toBeInstanceOf(Entry::class)
        ->and($recreated->sectionId)->toBe($section->id)
        ->and($recreated->getTypeId())->toBe($entryType->id)
        ->and($recreated->getFieldLayout()->uid)->toBe($owner->getFieldLayout()->uid);
});
