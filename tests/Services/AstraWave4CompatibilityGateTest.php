<?php

declare(strict_types=1);

/**
 * Astra Wave 4 — compatibility surface (A15) + release-proof follow-ups that
 * do not need product decisions.
 */

use craft\fieldlayoutelements\CustomField;
use craft\fields\Addresses;
use craft\fields\ContentBlock;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\events\ClassifyFieldEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\FieldLifecycle;
use verbb\vizy\services\HostedVizy;
use verbb\vizy\Vizy;
use yii\base\Event;

it('classifies nested-owner families and keeps mount ≠ persisted-owner axes separate', function() {
    $lifecycle = Vizy::$plugin->getFieldLifecycle();

    expect($lifecycle->classify(new Matrix())['capability'])->toBe(FieldLifecycle::MATRIX_ANCHOR)
        ->and($lifecycle->classify(new ContentBlock())['capability'])->toBe(FieldLifecycle::MIGRATION_ONLY)
        ->and($lifecycle->classify(new Addresses())['capability'])->toBe(FieldLifecycle::MIGRATION_ONLY)
        ->and($lifecycle->permitsNewPlacementClass('benf\\neo\\Field'))->toBeFalse()
        ->and($lifecycle->permitsNewPlacementClass('verbb\\supertable\\fields\\SuperTableField'))->toBeFalse()
        ->and($lifecycle->canMountInBlock(new Matrix()))->toBeTrue()
        ->and($lifecycle->requiresPersistedBlockOwner(new Matrix()))->toBeTrue()
        ->and($lifecycle->canMountInBlock(new ContentBlock()))->toBeFalse()
        ->and($lifecycle->requiresPersistedBlockOwner(new ContentBlock()))->toBeTrue()
        ->and($lifecycle->canSerialize(new ContentBlock()))->toBeFalse();
});

it('lets plugins override capability via EVENT_CLASSIFY_FIELD and register nested owners', function() {
    $lifecycle = Vizy::$plugin->getFieldLifecycle();
    $handler = static function(ClassifyFieldEvent $event): void {
        if ($event->field instanceof PlainText && $event->field->handle === 'wave4Override') {
            $event->capability = FieldLifecycle::UNSUPPORTED;
            $event->reason = 'pluginAdapterRefuse';
        }
    };
    Event::on(FieldLifecycle::class, FieldLifecycle::EVENT_CLASSIFY_FIELD, $handler);

    try {
        $field = new PlainText(['handle' => 'wave4Override']);
        $classified = $lifecycle->classify($field);
        expect($classified['capability'])->toBe(FieldLifecycle::UNSUPPORTED)
            ->and($classified['reason'])->toBe('pluginAdapterRefuse')
            ->and($classified['permitsNewPlacement'])->toBeFalse()
            ->and($lifecycle->canMountInBlock($field))->toBeFalse();

        $customClass = 'Vendor\\Example\\NestedOwnerField';
        $lifecycle->registerPersistedNestedOwnerClass($customClass);
        expect($lifecycle->isPersistedNestedOwnerClass($customClass))->toBeTrue()
            ->and($lifecycle->permitsNewPlacementClass($customClass))->toBeFalse();
    } finally {
        Event::off(FieldLifecycle::class, FieldLifecycle::EVENT_CLASSIFY_FIELD, $handler);
    }
});

it('parses and serializes Hosted depth beyond render MAX_DEPTH while render refuses', function() {
    // Locked: depth is render-enforced. Saved deep trees must remain parseable.
    $suffix = StringHelper::randomString(6);
    $depth = HostedVizy::MAX_DEPTH + 1;

    $innermost = new VizyField([
        'name' => 'Leaf',
        'handle' => 'leafDepth' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
    ]);
    expect(Craft::$app->getFields()->saveField($innermost))->toBeTrue();

    $currentField = $innermost;
    $types = [];
    for ($i = 0; $i < $depth; $i++) {
        $type = new BlockType([
            'uid' => StringHelper::UUID(),
            'name' => "D{$i}",
            'handle' => "d{$i}{$suffix}",
        ]);
        $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
        $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
        $placement = new CustomField($currentField);
        $placement->uid = StringHelper::UUID();
        $tab->setElements([$placement]);
        $layout->setTabs([$tab]);
        $type->setFieldLayout($layout);
        expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
        $types[] = ['type' => $type, 'placement' => $placement, 'field' => $currentField];

        $parent = new VizyField([
            'name' => "H{$i}",
            'handle' => "h{$i}{$suffix}",
            'editorConfig' => 'standard',
            'rootContentType' => VizyField::ROOT_CONTENT_RICH,
            'blockTypePickerGroups' => [
                ['name' => 'Content', 'blockTypeUids' => [$type->uid]],
            ],
        ]);
        expect(Craft::$app->getFields()->saveField($parent))->toBeTrue();
        $currentField = $parent;
    }

    $rootField = $currentField;
    $owner = VizyFixtureFactory::entry("Depth {$suffix}");

    // Build nested Hosted envelopes from the inside out.
    $envelope = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'deep']]],
        ],
    ];
    foreach ($types as $layer) {
        $envelope = [
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'vizyBlock',
                'attrs' => [
                    'blockUid' => StringHelper::UUID(),
                    'blockTypeUid' => $layer['type']->uid,
                    'enabled' => true,
                    'fieldSlots' => [
                        $layer['placement']->uid => $envelope,
                    ],
                ],
            ]],
        ];
    }

    $document = (new DocumentParser())->parse($envelope, $owner, $rootField);
    $serialized = (new DocumentSerializer())->serialize($document, false);

    expect($serialized['type'])->toBe('doc')
        ->and(HostedVizy::allowsDepth($depth))->toBeFalse()
        ->and(HostedVizy::allowsDepth(HostedVizy::MAX_DEPTH))->toBeTrue();
})->group('slow');
