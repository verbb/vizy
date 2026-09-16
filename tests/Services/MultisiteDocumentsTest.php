<?php

declare(strict_types=1);

use craft\base\Field;
use craft\behaviors\CustomFieldBehavior;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

it('merges shared outer structure with target-local inner values by Block and placement UID', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $suffix = StringHelper::randomString(6);
    $inner = new PlainText([
        'name' => 'Localized inner',
        'handle' => 'localized' . $suffix,
        'translationMethod' => Field::TRANSLATION_METHOD_SITE,
    ]);
    expect(Craft::$app->getFields()->saveField($inner))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$inner->handle] = true;
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [['type' => CustomField::class, 'fieldUid' => $inner->uid]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Localized',
        'handle' => 'localizedType' . $suffix,
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $placementUid = $type->getFieldLayout()->getCustomFieldElements()[0]->uid;
    $outer = new VizyField([
        'name' => 'Shared',
        'handle' => 'shared' . $suffix,
        'translationMethod' => Field::TRANSLATION_METHOD_NONE,
    ]);
    $sourceOwner = new Entry(['title' => 'A', 'siteId' => $siteA->id]);
    $targetOwner = new Entry(['title' => 'B', 'siteId' => $siteB->id]);
    $make = static fn(Entry $owner, array $content) => (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => $content,
    ], $owner, $outer);
    $block = static fn(string $uid, array $slots) => [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => $uid,
            'blockTypeUid' => $type->uid,
            'enabled' => true,
            'fieldSlots' => $slots,
        ],
    ];
    $source = $make($sourceOwner, [
        $block('survives', [$placementUid => 'source']),
        $block('inserted', [$placementUid => 'fallback']),
    ]);
    $target = $make($targetOwner, [
        $block('target-only-deleted', [$placementUid => 'deleted']),
        $block('survives', [$placementUid => 'localized target', 'orphan' => 'target orphan']),
    ]);

    $merged = Vizy::$plugin->getMultisiteDocuments()->mergeForPropagation($source, $target);
    expect(array_map(static fn($item) => $item->uid(), $merged->blocks()))->toBe(['survives', 'inserted'])
        ->and($merged->findBlock('survives')->rawFieldValue($placementUid))->toBe('localized target')
        ->and($merged->findBlock('survives')->rawFieldValue('orphan'))->toBe('target orphan')
        ->and($merged->findBlock('inserted')->rawFieldValue($placementUid))->toBe('fallback')
        ->and($merged->owner())->toBe($targetOwner);
});

it('recurses into nontranslated Hosted envelopes so inner site-translated slots merge', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $suffix = StringHelper::randomString(6);

    $innerPlain = new PlainText([
        'name' => 'Inner localized',
        'handle' => 'innerLoc' . $suffix,
        'translationMethod' => Field::TRANSLATION_METHOD_SITE,
    ]);
    expect(Craft::$app->getFields()->saveField($innerPlain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$innerPlain->handle] = true;

    $innerType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Inner',
        'handle' => 'innerHosted' . $suffix,
    ]);
    $innerLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $innerLayout->setTabs([new FieldLayoutTab([
        'layout' => $innerLayout,
        'name' => 'Content',
        'elements' => [['type' => CustomField::class, 'fieldUid' => $innerPlain->uid]],
    ])]);
    $innerType->setFieldLayout($innerLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($innerType))->toBeTrue();
    $innerType = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($innerType->uid);
    $innerPlacementUid = $innerType->getFieldLayout()->getCustomFieldElements()[0]->uid;

    $hostedField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Hosted',
        'handle' => 'hostedMerge' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        // Outer Hosted placement is not translated — keys match across sites.
        'translationMethod' => Field::TRANSLATION_METHOD_NONE,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$innerType->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($hostedField))->toBeTrue();

    $outerType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Outer',
        'handle' => 'outerHosted' . $suffix,
    ]);
    $outerLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $outerLayout->setTabs([new FieldLayoutTab([
        'layout' => $outerLayout,
        'name' => 'Content',
        'elements' => [['type' => CustomField::class, 'fieldUid' => $hostedField->uid]],
    ])]);
    $outerType->setFieldLayout($outerLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($outerType))->toBeTrue();
    $outerType = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($outerType->uid);
    $hostedPlacementUid = $outerType->getFieldLayout()->getCustomFieldElements()[0]->uid;

    $rootField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Root',
        'handle' => 'rootMerge' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'translationMethod' => Field::TRANSLATION_METHOD_NONE,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$outerType->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($rootField))->toBeTrue();

    $sourceOwner = new Entry(['title' => 'A', 'siteId' => $siteA->id]);
    $targetOwner = new Entry(['title' => 'B', 'siteId' => $siteB->id]);
    $innerUid = StringHelper::UUID();
    $outerUid = StringHelper::UUID();

    $hostedDoc = static fn(string $label) => [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $innerUid,
                'blockTypeUid' => $innerType->uid,
                'enabled' => true,
                'fieldSlots' => [$innerPlacementUid => $label],
            ],
        ]],
    ];

    $make = static fn(Entry $owner, string $label) => (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $outerUid,
                'blockTypeUid' => $outerType->uid,
                'enabled' => true,
                'fieldSlots' => [$hostedPlacementUid => $hostedDoc($label)],
            ],
        ]],
    ], $owner, $rootField);

    $merged = Vizy::$plugin->getMultisiteDocuments()->mergeForPropagation(
        $make($sourceOwner, 'source-inner'),
        $make($targetOwner, 'target-inner'),
    );

    $hosted = $merged->findBlock($outerUid)->rawFieldValue($hostedPlacementUid);
    expect($hosted)->toBeArray()
        ->and($hosted['content'][0]['attrs']['fieldSlots'][$innerPlacementUid])->toBe('target-inner');
});

it('leaves a different outer translation partition byte-structurally unchanged', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $field = new VizyField([
        'name' => 'Independent',
        'handle' => 'independent' . StringHelper::randomString(5),
        'translationMethod' => Field::TRANSLATION_METHOD_SITE,
    ]);
    $source = (new DocumentParser())->parse(json_decode(VizyFixtureFactory::paragraphDocument('A'), true), new Entry(['siteId' => $siteA->id]), $field);
    $target = (new DocumentParser())->parse(json_decode(VizyFixtureFactory::paragraphDocument('B'), true), new Entry(['siteId' => $siteB->id]), $field);

    expect(Vizy::$plugin->getMultisiteDocuments()->mergeForPropagation($source, $target))->toBe($target);
});

it('regenerates owner-duplicate identities once and reuses the recursive UID map', function() {
    $field = new VizyField(['name' => 'Duplicate', 'handle' => 'duplicate' . StringHelper::randomString(5)]);
    $source = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => ['blockUid' => 'old-block', 'blockTypeUid' => 'unresolved-type', 'enabled' => true, 'fieldSlots' => []],
        ]],
    ], new Entry(['siteId' => 1]), $field);
    $map = [];
    $ownerA = new Entry(['uid' => StringHelper::UUID(), 'siteId' => 1]);
    $ownerB = new Entry(['uid' => $ownerA->uid, 'siteId' => 2]);
    $copyA = Vizy::$plugin->getMultisiteDocuments()->duplicateForOwner($source, $ownerA, $map);
    $copyB = Vizy::$plugin->getMultisiteDocuments()->duplicateForOwner($source, $ownerB, $map);

    expect($copyA->blocks()[0]->uid())->not->toBe('old-block')
        ->and($copyB->blocks()[0]->uid())->toBe($copyA->blocks()[0]->uid())
        ->and($map['old-block'])->toBe($copyA->blocks()[0]->uid());
});

it('rejects recursive Craft propagation and releases the guard for retry', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Guarded',
        'handle' => 'guarded' . StringHelper::randomString(5),
        'translationMethod' => Field::TRANSLATION_METHOD_NONE,
    ]);
    $sourceOwner = new Entry(['id' => 101, 'siteId' => $siteA->id]);
    $targetOwner = new Entry(['id' => 101, 'siteId' => $siteB->id]);
    $source = (new DocumentParser())->parse(
        json_decode(VizyFixtureFactory::paragraphDocument('source'), true),
        $sourceOwner,
        $field,
    );
    $target = (new DocumentParser())->parse(
        json_decode(VizyFixtureFactory::paragraphDocument('target'), true),
        $targetOwner,
        $field,
    );
    $service = Vizy::$plugin->getMultisiteDocuments();
    $service->setPropagationProbeForTesting(
        static fn($againSource, $againTarget) => $service->mergeForCraftPropagation($againSource, $againTarget),
    );
    try {
        expect(fn() => $service->mergeForCraftPropagation($source, $target))
            ->toThrow(RuntimeException::class, 'Recursive Vizy propagation was prevented');
    } finally {
        $service->setPropagationProbeForTesting(null);
    }

    expect($service->mergeForCraftPropagation($source, $target)->owner())->toBe($targetOwner);
});
