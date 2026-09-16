<?php

declare(strict_types=1);

/**
 * Astra Wave 3 — Hosted traversal, identity, Matrix persistence purity (A07–A08, A10).
 */

use craft\behaviors\CustomFieldBehavior;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DeterministicUidFactory;
use verbb\vizy\document\DocumentWalk;
use verbb\vizy\document\InternalDocumentBuilder;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Matrix as MatrixHelper;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

it('walks Hosted Vizy Blocks without entering opaque fieldSlots payloads', function() {
    $suffix = StringHelper::randomString(6);

    $nestedField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Nested',
        'handle' => 'nestedWalk' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $innerType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Inner',
        'handle' => 'innerWalk' . $suffix,
    ]);
    $innerLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $innerLayout->setTabs([]);
    $innerType->setFieldLayout($innerLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($innerType))->toBeTrue();

    $nestedField->blockTypePickerGroups = [
        ['name' => 'Content', 'blockTypeUids' => [$innerType->uid]],
    ];
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $outerType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Outer',
        'handle' => 'outerWalk' . $suffix,
    ]);
    $outerLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $outerLayout]);
    $plain = new PlainText([
        'name' => 'Note',
        'handle' => 'noteWalk' . $suffix,
    ]);
    expect(Craft::$app->getFields()->saveField($plain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$plain->handle] = true;

    $plainPlacement = new CustomField($plain);
    $plainPlacement->uid = StringHelper::UUID();
    $hostedPlacement = new CustomField($nestedField);
    $hostedPlacement->uid = StringHelper::UUID();
    $tab->setElements([$plainPlacement, $hostedPlacement]);
    $outerLayout->setTabs([$tab]);
    $outerType->setFieldLayout($outerLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($outerType))->toBeTrue();

    $rootField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Body',
        'handle' => 'bodyWalk' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$outerType->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($rootField))->toBeTrue();

    $owner = VizyFixtureFactory::entry("Walk {$suffix}");
    $outerUid = StringHelper::UUID();
    $innerUid = StringHelper::UUID();

    $document = Vizy::$plugin->getDocuments()->normalizeValue([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $outerUid,
                'blockTypeUid' => $outerType->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $plainPlacement->uid => 'opaque-not-a-doc',
                    $hostedPlacement->uid => [
                        'type' => 'doc',
                        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
                        'content' => [[
                            'type' => 'vizyBlock',
                            'attrs' => [
                                'blockUid' => $innerUid,
                                'blockTypeUid' => $innerType->uid,
                                'enabled' => true,
                                'fieldSlots' => [],
                            ],
                        ]],
                    ],
                ],
            ],
        ]],
    ], $owner, $rootField);

    $uids = [];
    foreach (DocumentWalk::blocks($document, true) as $block) {
        $uids[] = $block->uid();
    }

    expect($uids)->toBe([$outerUid, $innerUid])
        ->and(DocumentWalk::isHostedEnvelope('opaque-not-a-doc'))->toBeFalse()
        ->and(DocumentWalk::isHostedEnvelope([
            'type' => 'doc',
            'attrs' => [],
            'content' => [],
        ]))->toBeTrue();
});

it('regenerates Hosted identities and clears Matrix ownership on copy', function() {
    $suffix = StringHelper::randomString(6);

    $nestedField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Nested',
        'handle' => 'nestedId' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $innerType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Inner',
        'handle' => 'innerId' . $suffix,
    ]);
    $innerLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $innerLayout->setTabs([]);
    $innerType->setFieldLayout($innerLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($innerType))->toBeTrue();

    $nestedField->blockTypePickerGroups = [
        ['name' => 'Content', 'blockTypeUids' => [$innerType->uid]],
    ];
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $outerType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Outer',
        'handle' => 'outerId' . $suffix,
    ]);
    $outerLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $outerLayout]);
    $hostedPlacement = new CustomField($nestedField);
    $hostedPlacement->uid = StringHelper::UUID();
    $tab->setElements([$hostedPlacement]);
    $outerLayout->setTabs([$tab]);
    $outerType->setFieldLayout($outerLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($outerType))->toBeTrue();

    $rootField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Body',
        'handle' => 'bodyId' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$outerType->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($rootField))->toBeTrue();

    $owner = VizyFixtureFactory::entry("Identity {$suffix}");
    $outerUid = StringHelper::UUID();
    $innerUid = StringHelper::UUID();
    $anchorUid = StringHelper::UUID();
    $opaqueUid = StringHelper::UUID();
    $opaquePayload = [
        'type' => 'doc', 'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock', 'attrs' => [
                'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $innerType->uid,
                'enabled' => true, 'fieldSlots' => [],
            ],
        ]],
    ];

    $source = Vizy::$plugin->getDocuments()->normalizeValue([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $outerUid,
                'blockTypeUid' => $outerType->uid,
                'enabled' => true,
                'matrixAnchorUid' => $anchorUid,
                'fieldSlots' => [
                    $opaqueUid => $opaquePayload,
                    $hostedPlacement->uid => [
                        'type' => 'doc',
                        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
                        'content' => [[
                            'type' => 'vizyBlock',
                            'attrs' => [
                                'blockUid' => $innerUid,
                                'blockTypeUid' => $innerType->uid,
                                'enabled' => true,
                                'fieldSlots' => [],
                            ],
                        ]],
                    ],
                ],
            ],
        ]],
    ], $owner, $rootField);

    $detached = Vizy::$plugin->getDocuments()->normalizeDetached($source->toArray());
    $walked = iterator_to_array(DocumentWalk::blocks($detached), false);
    expect(array_map(static fn($block) => $block->uid(), $walked))->toBe([$outerUid, $innerUid]);

    $map = [];
    $copy = (new InternalDocumentBuilder(
        $source,
        static fn() => true,
        new DeterministicUidFactory('wave3-identity'),
    ))->regenerateOwnerDuplicateIdentities($map)->commit();

    $copiedOuter = $copy->content()->nodes()[0];
    $copiedHosted = $copiedOuter['attrs']['fieldSlots'][$hostedPlacement->uid];
    $copiedInner = $copiedHosted['content'][0];

    expect($copiedOuter['attrs']['blockUid'])->not->toBe($outerUid)
        ->and($copiedOuter['attrs']['matrixAnchorUid'] ?? null)->toBeNull()
        ->and($copiedOuter['attrs']['fieldSlots'][$opaqueUid])->toBe($opaquePayload)
        ->and($copiedInner['attrs']['blockUid'])->not->toBe($innerUid)
        ->and($map[$outerUid] ?? null)->toBe($copiedOuter['attrs']['blockUid'])
        ->and($map[$innerUid] ?? null)->toBe($copiedInner['attrs']['blockUid']);
});

it('keeps fingerprint serialize pure while owner-save serialize can persist Matrix', function() {
    $suffix = StringHelper::randomString(6);
    $plain = new PlainText([
        'name' => 'Label',
        'handle' => 'labelPure' . $suffix,
    ]);
    expect(Craft::$app->getFields()->saveField($plain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$plain->handle] = true;

    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Card',
        'handle' => 'cardPure' . $suffix,
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $placement = new CustomField($plain);
    $placement->uid = StringHelper::UUID();
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Body',
        'handle' => 'bodyPure' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$type->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();

    $owner = VizyFixtureFactory::entry("Pure {$suffix}");
    $document = Vizy::$plugin->getDocuments()->normalizeValue([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $placement->uid => 'hello',
                ],
            ],
        ]],
    ], $owner, $field);

    $fingerprint = json_decode(Vizy::$plugin->getDocuments()->serializeValue($document), true);
    $persist = json_decode(Vizy::$plugin->getDocuments()->serializeForPersistence($document), true);

    expect($fingerprint['content'][0]['attrs']['fieldSlots'][$placement->uid])->toBe('hello')
        ->and($persist['content'][0]['attrs']['fieldSlots'][$placement->uid])->toBe('hello');
});

it('remaps Craft 5 Matrix payloads for independent copy', function() {
    $sourceUid = StringHelper::UUID();
    $payload = MatrixHelper::payloadForIndependentCopy([
        'entries' => [
            "uid:{$sourceUid}" => [
                'id' => 99,
                'ownerId' => 12,
                'uid' => $sourceUid,
                'fields' => ['label' => 'Row'],
            ],
        ],
        'sortOrder' => [$sourceUid],
    ]);

    expect($payload)->toBeArray()
        ->and($payload['entries'])->toHaveCount(1)
        ->and(array_key_first($payload['entries']))->not->toBe($sourceUid)
        ->and(array_key_first($payload['entries']))->not->toBe("uid:{$sourceUid}")
        ->and($payload['entries'][array_key_first($payload['entries'])]['id'] ?? null)->toBeNull()
        ->and($payload['sortOrder'][0])->toBe(array_key_first($payload['entries']));
});
