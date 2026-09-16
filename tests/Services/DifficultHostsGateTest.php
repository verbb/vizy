<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Assets;
use craft\fields\ContentBlock;
use craft\fields\Date;
use craft\fields\Dropdown;
use craft\fields\Entries;
use craft\fields\Lightswitch;
use craft\fields\Link;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use ReflectionMethod;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\elements\Block;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

beforeEach(function() {
    AssetSpikeFixture::ensureAdminUser();
});

/**
 * Difficult-host proofs for editor foundation / FieldLayout hosting.
 *
 * Plain Text/Lightswitch FieldLayout HTML is proven in FieldLayoutEndpointSecurityTest. This file locks
 * adapter identities, generated widget namespaces and script buffering. Real
 * relation widgets are exercised by the separate Craft browser suite.
 */
it('maps typed adapters and defaults other serializable fields to craft.generic', function() {
    $forms = Vizy::$plugin->getFieldLayoutForms();
    $method = new ReflectionMethod($forms, '_adapterId');
    $method->setAccessible(true);
    expect($method->invoke($forms, new Entries()))->toBe('craft.entries')
        ->and($method->invoke($forms, new Assets()))->toBe('craft.assets')
        ->and($method->invoke($forms, new PlainText()))->toBe('craft.plainText')
        ->and($method->invoke($forms, new Lightswitch()))->toBe('craft.lightswitch')
        ->and($method->invoke($forms, new Dropdown()))->toBe('craft.generic')
        ->and($method->invoke($forms, new Date()))->toBe('craft.generic')
        ->and($method->invoke($forms, new Link()))->toBe('craft.link')
        ->and($method->invoke($forms, new \craft\fields\Json()))->toBe('craft.json')
        ->and($method->invoke($forms, new Matrix()))->toBe('craft.matrix')
        ->and($method->invoke($forms, new ContentBlock()))->toBeNull();
});

it('keeps Selectize script ids aligned when the Entry form already set a fields namespace', function() {
    // Regression: VizyField::inputHtml runs under CustomField's `fields` namespace.
    // Without clearing it, Selectize JS baked `fields-vizyHost-…` while HTML stayed
    // `vizyHost-…` → `$('#id')` empty → onChange throws reading `$wrapper`.
    $suffix = StringHelper::randomString(5);
    $dropdown = new Dropdown([
        'name' => 'Drop',
        'handle' => 'drop' . $suffix,
        'options' => [
            ['label' => 'One', 'value' => 'one', 'default' => true],
            ['label' => 'Two', 'value' => 'two', 'default' => false],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($dropdown))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$dropdown->handle] = true;

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Fields',
        'elements' => [['type' => CustomField::class, 'fieldUid' => $dropdown->uid]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'DropType',
        'handle' => 'droptype' . $suffix,
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);

    $field = VizyFixtureFactory::vizyField();
    $field->blockTypePickerGroups = [['name' => 'Root', 'blockTypeUids' => [$type->uid]]];
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    Craft::$app->getFields()->refreshFields();
    $field = Craft::$app->getFields()->getFieldByUid($field->uid);
    $owner = VizyFixtureFactory::entry('Drop ns owner');
    $context = Vizy::$plugin->getEditorContexts()->issue($owner, $field);
    $block = [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => StringHelper::UUID(),
            'blockTypeUid' => $type->uid,
            'enabled' => true,
            'fieldSlots' => [],
        ],
    ];

    $view = Craft::$app->getView();
    $previous = $view->getNamespace();
    $view->setNamespace('fields');
    try {
        $result = Vizy::$plugin->getFieldLayoutForms()->renderInitial(
            $context,
            $owner,
            $field,
            $block,
            ['kind' => 'root'],
        );
    } finally {
        $view->setNamespace($previous);
    }

    expect($result['ok'] ?? false)->toBeTrue(json_encode($result));
    $html = (string)$result['data']['html'];
    $body = (string)$result['data']['bodyHtml'];
    preg_match_all('/<select[^>]*\sid="([^"]+)"/', $html, $selectIds);
    preg_match_all('/const id = "([^"]+)"/', $body, $jsIds);
    expect($jsIds[1] ?? [])->not->toBeEmpty()
        ->and($selectIds[1] ?? [])->not->toBeEmpty();
    foreach ($jsIds[1] as $id) {
        expect($id)->not->toStartWith('fields-vizyHost-')
            ->and($html)->toContain('id="' . $id . '"');
    }
});

it('captures registerScript modules into initial FieldLayout bodyHtml', function() {
    // CKEditor uses View::registerScript(type=module), not registerJs. Initial
    // bootstrap must buffer those tags or they leak onto the entry page and run
    // before the Block textarea exists (editor-missing-sourceelement).
    $forms = Vizy::$plugin->getFieldLayoutForms();
    $method = new ReflectionMethod($forms, '_captureInitialBodyHtml');
    $method->setAccessible(true);

    $view = Craft::$app->getView();
    $view->startJsBuffer();
    $view->startScriptBuffer();
    $view->registerScript(
        'import {create} from "@craftcms/ckeditor"; create("vizy-ck-probe", {});',
        \craft\web\View::POS_END,
        ['type' => 'module'],
        'vizy-ckeditor-probe',
    );
    $view->registerJs('window.__vizyClassicProbe = true;');

    $body = (string)$method->invoke($forms, $view);

    expect($body)->toContain('type="module"')
        ->and($body)->toContain('@craftcms/ckeditor')
        ->and($body)->toContain('vizy-ck-probe')
        ->and($body)->toContain('__vizyClassicProbe');

    // Buffers drained — must not remain queued for the surrounding CP page.
    $leaked = $view->clearScriptBuffer();
    expect($leaked === false || $leaked === [])->toBeTrue();
});

it('rejects retired Content Area destinations as invalid', function() {
    $fixture = null;
    // Reuse the exhaustive security fixture's nested Content Area rejection path
    // without duplicating its PlainText/Lightswitch mount matrix.
    $owner = VizyFixtureFactory::entry('Difficult disallow owner');
    $field = VizyFixtureFactory::vizyField();
    $context = Vizy::$plugin->getEditorContexts()->issue($owner, $field);
    $block = [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => StringHelper::UUID(),
            'blockTypeUid' => StringHelper::UUID(),
            'enabled' => true,
            'fieldSlots' => [],
        ],
    ];
    expect(WebControllerHarness::renderFieldLayout([
        'editorContextToken' => $context['token'],
        'requestId' => StringHelper::UUID(),
        'documentRevision' => 1,
        'blockHash' => WebControllerHarness::stableBlockHash($block),
        'block' => $block,
        'destination' => [
            'kind' => 'contentArea',
            'parentBlockTypeUid' => StringHelper::UUID(),
            'contentAreaUid' => StringHelper::UUID(),
        ],
    ])->data['error'] ?? null)->toBe('invalidDestination');
});

