<?php

declare(strict_types=1);

use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\fieldlayoutelements\CustomField;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\FieldLifecycle;
use verbb\vizy\Vizy;
use craft\elements\Entry;
use craft\fields\PlainText;

it('classifies Vizy as hostedVizy for Block fieldSlots serialization', function() {
    expect(Vizy::$plugin->getFieldLifecycle()->classify(new VizyField())['capability'])
        ->toBe(FieldLifecycle::HOSTED_VIZY)
        ->and(Vizy::$plugin->getFieldLifecycle()->canSerialize(new VizyField()))->toBeTrue();
});

it('stores hosted Vizy fieldSlots as document objects, not JSON strings', function() {
    $nestedField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Nested Body',
        'handle' => 'nestedBody' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $plain = new PlainText([
        'uid' => StringHelper::UUID(),
        'name' => 'Title',
        'handle' => 'cardTitle' . StringHelper::randomString(5),
    ]);
    expect(Craft::$app->getFields()->saveField($plain))->toBeTrue();

    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Card',
        'handle' => 'card' . StringHelper::randomString(5),
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $titlePlacement = new CustomField($plain);
    $titlePlacement->uid = StringHelper::UUID();
    $nestedPlacement = new CustomField($nestedField);
    $nestedPlacement->uid = StringHelper::UUID();
    $tab->setElements([$titlePlacement, $nestedPlacement]);
    $layout->setTabs([$tab]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();

    $owner = new Entry();
    $owner->id = 1;
    $owner->siteId = Craft::$app->getSites()->getPrimarySite()->id;
    $rootField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Body',
        'handle' => 'body' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$type->uid]],
        ],
    ]);

    $nestedDoc = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Inner']]],
        ],
    ];
    $outer = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'values' => new \stdClass(),
                'fieldSlots' => [
                    $titlePlacement->uid => 'Hello',
                    $nestedPlacement->uid => $nestedDoc,
                ],
            ],
            'content' => [],
        ]],
    ];

    $document = Vizy::$plugin->getDocuments()->normalizeValue($outer, $owner, $rootField);
    $serialized = (new DocumentSerializer())->serialize($document);
    $slot = $serialized['content'][0]['attrs']['fieldSlots'][$nestedPlacement->uid] ?? null;

    expect($slot)->toBeArray()
        ->and($slot['type'] ?? null)->toBe('doc')
        ->and(is_string($slot))->toBeFalse();
});

it('upgrades string-encoded hosted Vizy fieldSlots to document objects on serialize', function() {
    $nestedField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Nested Body',
        'handle' => 'nestedBody' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Card',
        'handle' => 'card' . StringHelper::randomString(5),
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $nestedPlacement = new CustomField($nestedField);
    $nestedPlacement->uid = StringHelper::UUID();
    $tab->setElements([$nestedPlacement]);
    $layout->setTabs([$tab]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();

    $owner = new Entry();
    $owner->id = 1;
    $owner->siteId = Craft::$app->getSites()->getPrimarySite()->id;
    $rootField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Body',
        'handle' => 'body' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$type->uid]],
        ],
    ]);

    $nestedDoc = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Legacy']]],
        ],
    ];
    $outer = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'values' => new \stdClass(),
                // Vizy 3 wound: nested document as JSON string — must not survive serialize.
                'fieldSlots' => [
                    $nestedPlacement->uid => json_encode($nestedDoc),
                ],
            ],
            'content' => [],
        ]],
    ];

    $document = Vizy::$plugin->getDocuments()->normalizeValue($outer, $owner, $rootField);
    $serialized = (new DocumentSerializer())->serialize($document);
    $slot = $serialized['content'][0]['attrs']['fieldSlots'][$nestedPlacement->uid] ?? null;

    expect($slot)->toBeArray()
        ->and($slot['type'] ?? null)->toBe('doc')
        ->and(json_encode($slot))->not->toBe($slot);
});

it('issues hosted editor contexts that auth via the parent Entry Vizy placement', function() {
    $parentField = \Tests\Support\Fixtures\VizyFixtureFactory::vizyField();
    $owner = \Tests\Support\Fixtures\VizyFixtureFactory::entry('Hosted context owner');
    $nestedField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Nested',
        'handle' => 'nested' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $context = Vizy::$plugin->getEditorContexts()->issueHosted($owner, $parentField, $nestedField, [
        'depth' => 1,
        'blockUid' => StringHelper::UUID(),
        'placementUid' => StringHelper::UUID(),
        'parentFieldUid' => $parentField->uid,
        'path' => [],
    ]);

    expect($context['fieldUid'])->toBe($nestedField->uid)
        ->and($context['entryFieldUid'])->toBe($parentField->uid)
        ->and($context['parentFieldUid'])->toBe($parentField->uid)
        ->and($context['ownerPlacementUid'])->not->toBeNull()
        ->and($context['hostedDepth'])->toBe(1);

    $verified = Vizy::$plugin->getEditorContexts()->verify($context['token']);
    expect($verified['fieldUid'])->toBe($nestedField->uid)
        ->and($verified['entryFieldUid'])->toBe($parentField->uid)
        ->and($verified['parentFieldUid'])->toBe($parentField->uid);

    $layout = $owner->getFieldLayout();
    $placed = false;
    foreach ($layout?->getCustomFieldElements() ?? [] as $placement) {
        if (
            $placement->uid === $verified['ownerPlacementUid']
            && $placement->getField()->uid === $verified['entryFieldUid']
        ) {
            $placed = true;
            break;
        }
    }
    expect($placed)->toBeTrue();
});

it('issues depth-2 hosted contexts that still auth against the Entry Vizy field', function() {
    $entryField = \Tests\Support\Fixtures\VizyFixtureFactory::vizyField();
    $owner = \Tests\Support\Fixtures\VizyFixtureFactory::entry('Hosted depth-2 owner');
    $midField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Mid',
        'handle' => 'mid' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
    ]);
    $deepField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Deep',
        'handle' => 'deep' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
    ]);
    expect(Craft::$app->getFields()->saveField($midField))->toBeTrue();
    expect(Craft::$app->getFields()->saveField($deepField))->toBeTrue();

    // Mid is Block-hosted — not on the Entry layout. Auth must still use Entry.
    $context = Vizy::$plugin->getEditorContexts()->issueHosted($owner, $entryField, $deepField, [
        'depth' => 2,
        'blockUid' => StringHelper::UUID(),
        'placementUid' => StringHelper::UUID(),
        'parentFieldUid' => $midField->uid,
        'path' => [],
    ]);

    expect($context['fieldUid'])->toBe($deepField->uid)
        ->and($context['entryFieldUid'])->toBe($entryField->uid)
        ->and($context['parentFieldUid'])->toBe($midField->uid)
        ->and($context['ownerPlacementUid'])->not->toBeNull()
        ->and($context['hostedDepth'])->toBe(2);

    $layout = $owner->getFieldLayout();
    $placed = false;
    foreach ($layout?->getCustomFieldElements() ?? [] as $placement) {
        if (
            $placement->uid === $context['ownerPlacementUid']
            && $placement->getField()->uid === $entryField->uid
        ) {
            $placed = true;
            break;
        }
    }
    expect($placed)->toBeTrue();
});

it('ships one inline hosted bootstrap without duplicating it into instance JS', function() {
    $entryField = \Tests\Support\Fixtures\VizyFixtureFactory::vizyField();
    $owner = \Tests\Support\Fixtures\VizyFixtureFactory::entry('Hosted bootstrap owner');
    $nestedField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Nested bootstrap',
        'handle' => 'nestedBootstrap' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $placement = new CustomField($nestedField);
    $placement->uid = StringHelper::UUID();
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);

    $block = new Block();
    $block->setOwner($owner);
    $block->setField($entryField);
    $block->setFieldLayout($layout);
    $block->setType(new BlockType(['uid' => StringHelper::UUID()]));
    $block->setBlockUid(StringHelper::UUID());

    $value = $nestedField->normalizeValue([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [],
    ], $block);
    $render = new ReflectionMethod($nestedField, '_hostedInputHtml');
    $html = $render->invoke($nestedField, $value, $block);

    expect(substr_count($html, 'data-vizy-bootstrap'))->toBe(1)
        ->and(substr_count($html, 'data-vizy-document'))->toBe(1)
        ->and($html)->not->toContain('bootstrapEditor(');

    expect(preg_match('/id="([^"]*vizy-editor-hosted-[^"]+)"/', $html, $matches))->toBe(1);
    $instanceId = html_entity_decode($matches[1], ENT_QUOTES | ENT_HTML5);
    expect(Json::encode(Craft::$app->getView()->js))->not->toContain($instanceId);
});
