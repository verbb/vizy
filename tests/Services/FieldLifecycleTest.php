<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\base\FieldLayoutComponent;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Addresses;
use craft\fields\Assets;
use craft\fields\ContentBlock;
use craft\fields\Date;
use craft\fields\Dropdown;
use craft\fields\Entries;
use craft\fields\Icon;
use craft\fields\Json;
use craft\fields\Lightswitch;
use craft\fields\Link;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldSlotValues;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\FieldLifecycle;
use verbb\vizy\services\HostedVizy;
use verbb\vizy\Vizy;
use yii\base\Event;

it('defaults unknown fields to pure and only blocklists nested Element owners', function() {
    $inventory = Vizy::$plugin->getFieldLifecycle();

    expect($inventory->classify(new PlainText())['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new Lightswitch())['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new Dropdown())['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new Date())['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new Icon())['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new Json())['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new Link())['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new Entries())['capability'])->toBe(FieldLifecycle::PURE)
        // Subclasses / third-party fields are allowed by default (blocklist, not allowlist).
        ->and($inventory->classify(new class extends Entries {})['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new class extends \craft\base\Field {
            public static function displayName(): string { return 'Unknown'; }
        })['capability'])->toBe(FieldLifecycle::PURE)
        ->and($inventory->classify(new Assets())['capability'])->toBe(FieldLifecycle::ASSETS)
        ->and($inventory->classify(new Matrix())['capability'])->toBe(FieldLifecycle::MATRIX_ANCHOR)
        ->and($inventory->classify(new ContentBlock())['capability'])->toBe(FieldLifecycle::MIGRATION_ONLY)
        ->and($inventory->classify(new Addresses())['capability'])->toBe(FieldLifecycle::MIGRATION_ONLY)
        ->and($inventory->canSerialize(new Matrix()))->toBeTrue()
        ->and($inventory->permitsNewPlacement(new Matrix()))->toBeFalse()
        ->and($inventory->permitsNewPlacementClass(Matrix::class))->toBeFalse()
        ->and($inventory->permitsNewPlacementClass(ContentBlock::class))->toBeFalse()
        ->and($inventory->permitsNewPlacementClass(PlainText::class))->toBeTrue()
        ->and($inventory->permitsNewPlacementClass(VizyField::class))->toBeTrue()
        // Neo / Super Table: string identity without requiring the plugins installed.
        ->and($inventory->permitsNewPlacementClass('benf\\neo\\Field'))->toBeFalse()
        ->and($inventory->permitsNewPlacementClass('verbb\\neo\\fields\\Neo'))->toBeFalse()
        ->and($inventory->permitsNewPlacementClass('verbb\\supertable\\fields\\SuperTableField'))->toBeFalse()
        ->and($inventory->isPersistedNestedOwnerClass('benf\\neo\\Field'))->toBeTrue()
        ->and($inventory->classify(new Matrix())['requiresPersistedBlockOwner'])->toBeTrue()
        ->and($inventory->classify(new Matrix())['canMountInBlock'])->toBeTrue()
        ->and($inventory->classify(new ContentBlock())['canMountInBlock'])->toBeFalse()
        ->and($inventory->classify(new ContentBlock())['requiresPersistedBlockOwner'])->toBeTrue()
        ->and($inventory->classify(new PlainText())['canMountInBlock'])->toBeTrue()
        ->and($inventory->classify(new PlainText())['requiresPersistedBlockOwner'])->toBeFalse();
});

it('runtime-characterizes built-in field values on an id-null Block without external writes', function() {
    $owner = VizyFixtureFactory::entry('Field inventory owner');
    $relation = VizyFixtureFactory::entry('Field inventory relation');
    $asset = AssetSpikeFixture::createTempAsset('field-inventory.txt', 'inventory');
    $block = new Block();
    $block->id = null;
    $block->siteId = $owner->siteId;
    $block->setOwner($owner);
    $before = [
        'relations' => (int)(new \craft\db\Query())->from('{{%relations}}')->count(),
        'elementsOwners' => (int)(new \craft\db\Query())->from('{{%elements_owners}}')->count(),
    ];

    $dropdown = new Dropdown([
        'handle' => 'inventoryDropdown',
        'options' => [
            ['label' => 'One', 'value' => 'one', 'default' => false],
            ['label' => 'Two', 'value' => 'two', 'default' => false],
        ],
    ]);
    $fixtures = [
        [new PlainText(['handle' => 'inventoryPlain']), '  plain  ', 'plain', FieldLifecycle::PURE],
        [new Lightswitch(['handle' => 'inventorySwitch']), true, true, FieldLifecycle::PURE],
        [$dropdown, 'one', 'one', FieldLifecycle::PURE],
        [new Date(['handle' => 'inventoryDate']), '2026-09-04', '2026-09-04T00:00:00+00:00', FieldLifecycle::PURE],
        [new Json(['handle' => 'inventoryJson']), ['a' => 1], ['a' => 1], FieldLifecycle::PURE],
        [new Entries(['handle' => 'inventoryEntries']), [$relation->id], [$relation->id], FieldLifecycle::PURE],
        [new Assets(['handle' => 'inventoryAssets']), [$asset->id], [$asset->id], FieldLifecycle::ASSETS],
        [new Matrix(['handle' => 'inventoryMatrix']), [], [], FieldLifecycle::MATRIX_ANCHOR],
        [new ContentBlock(['handle' => 'inventoryContentBlock']), [], null, FieldLifecycle::MIGRATION_ONLY],
    ];
    foreach ($fixtures as [$field, $raw, $expected, $capability]) {
        $normalized = $field->normalizeValue($raw, $block);
        $serialized = $field->serializeValue($normalized, $block);
        expect(Vizy::$plugin->getFieldLifecycle()->classify($field)['capability'])->toBe($capability)
            ->and($serialized)->toBe($expected, get_class($field) . ": " . json_encode($serialized))
            ->and($block->id)->toBeNull();
    }

    expect((int)(new \craft\db\Query())->from('{{%relations}}')->count())->toBe($before['relations'])
        ->and((int)(new \craft\db\Query())->from('{{%elements_owners}}')->count())->toBe($before['elementsOwners']);
});

it('overlays current pure values by placement UID while preserving absence null empty and orphans', function() {
    $suffix = StringHelper::randomString(6);
    $plain = new PlainText(['name' => 'Pure', 'handle' => 'pure' . $suffix]);
    expect(Craft::$app->getFields()->saveField($plain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$plain->handle] = true;

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [[
            'type' => CustomField::class,
            'fieldUid' => $plain->uid,
        ]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Pure values',
        'handle' => 'pureValues' . $suffix,
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $placementUid = $type->getFieldLayout()->getCustomFieldElements()[0]->uid;

    $field = new VizyField(['name' => 'Body', 'handle' => 'body' . $suffix]);
    $owner = new Entry(['title' => 'Pure owner']);
    $slotSets = [
        [$placementUid => 'before', 'orphan-placement' => ['opaque' => true]],
        [],
        [$placementUid => null],
        [$placementUid => ''],
    ];
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => array_map(static fn(array $slots, int $index) => [
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => "pure-{$index}",
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'fieldSlots' => $slots,
            ],
        ], $slotSets, array_keys($slotSets)),
    ], $owner, $field);
    $document->blockElement($document->blocks()[0])->setFieldValue($plain->handle, 'after');

    $serialized = json_decode(Vizy::$plugin->getDocuments()->serializeValue($document), true);
    $slots = array_column(array_column($serialized['content'], 'attrs'), 'fieldSlots');
    expect($slots[0][$placementUid])->toBe('after')
        ->and($slots[0]['orphan-placement'])->toBe(['opaque' => true])
        ->and($slots[1][$placementUid])->toBeNull()
        ->and(array_key_exists($placementUid, $slots[2]))->toBeTrue()
        ->and($slots[2][$placementUid])->toBeNull()
        ->and($slots[3][$placementUid])->toBe('');
});

it('writes safe defaults only for applicable missing placements at save serialization', function() {
    $suffix = StringHelper::randomString(6);
    $lightswitch = new Lightswitch([
        'name' => 'Defaulted',
        'handle' => 'defaulted' . $suffix,
        'default' => true,
    ]);
    expect(Craft::$app->getFields()->saveField($lightswitch))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$lightswitch->handle] = true;

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Defaults',
        'elements' => [[
            'type' => CustomField::class,
            'fieldUid' => $lightswitch->uid,
        ]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Defaults',
        'handle' => 'defaults' . $suffix,
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $placementUid = $type->getFieldLayout()->getCustomFieldElements()[0]->uid;
    $field = new VizyField(['name' => 'Body', 'handle' => 'body' . $suffix]);
    $owner = new Entry(['title' => 'Default owner']);
    $raw = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'default-block',
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'fieldSlots' => [],
            ],
        ]],
    ];

    $document = (new DocumentParser())->parse($raw, $owner, $field);
    $serialized = json_decode(Vizy::$plugin->getDocuments()->serializeValue($document), true);
    expect($serialized['content'][0]['attrs']['fieldSlots'][$placementUid])->toBeTrue();

    $handler = static function(Event $event) use ($placementUid): void {
        if ($event->sender->uid === $placementUid) {
            $event->showInForm = false;
            $event->handled = true;
        }
    };
    Event::on(CustomField::class, FieldLayoutComponent::EVENT_DEFINE_SHOW_IN_FORM, $handler);
    try {
        $hidden = json_decode(Vizy::$plugin->getDocuments()->serializeValue(
            (new DocumentParser())->parse($raw, $owner, $field)
        ), true);
    } finally {
        Event::off(CustomField::class, FieldLayoutComponent::EVENT_DEFINE_SHOW_IN_FORM, $handler);
    }

    expect($hidden['content'][0]['attrs']['fieldSlots'])->toBe([]);
});

it('serializes relation IDs without creating Block-owned relation rows', function() {
    $inventory = Vizy::$plugin->getFieldLifecycle();
    $field = new Entries(['name' => 'Related', 'handle' => 'related' . StringHelper::randomString(6)]);
    $block = new Block();
    $block->id = null;
    $block->setOwner(new Entry(['title' => 'Owner']));
    $value = $field->normalizeValue([], $block);
    $before = (int)(new \craft\db\Query())->from('{{%relations}}')->count();
    $serialized = $field->serializeValue($value, $block);
    $after = (int)(new \craft\db\Query())->from('{{%relations}}')->count();

    expect($inventory->canSerialize($field))->toBeTrue()
        ->and($serialized)->toBe([])
        ->and($block->id)->toBeNull()
        ->and($after)->toBe($before);
});

it('allows new Block Type placements for inventoried pure Craft fields', function() {
    $date = new Date(['name' => 'Pure date', 'handle' => 'pureDate' . StringHelper::randomString(5)]);
    expect(Craft::$app->getFields()->saveField($date))->toBeTrue();
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [['type' => CustomField::class, 'fieldUid' => $date->uid]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Safe date',
        'handle' => 'safeDate' . StringHelper::randomString(5),
    ]);
    $type->setFieldLayout($layout);

    $saved = Vizy::$plugin->getBlockTypes()->saveBlockType($type);
    Craft::$app->getFields()->deleteField($date);

    expect($saved)->toBeTrue();
});

it('fails closed when a new Block Type placement is migration-only', function() {
    $contentBlock = new ContentBlock([
        'name' => 'Nested owner',
        'handle' => 'nestedOwner' . StringHelper::randomString(5),
    ]);
    expect(Craft::$app->getFields()->saveField($contentBlock))->toBeTrue();
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [['type' => CustomField::class, 'fieldUid' => $contentBlock->uid]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Unsafe',
        'handle' => 'unsafe' . StringHelper::randomString(5),
    ]);
    $type->setFieldLayout($layout);

    $saved = Vizy::$plugin->getBlockTypes()->saveBlockType($type);
    $errors = implode(' ', $type->getFirstErrors());
    Craft::$app->getFields()->deleteField($contentBlock);

    expect($saved)->toBeFalse()
        ->and($errors)->toContain('can’t be used on Vizy Block Types')
        ->and($errors)->toContain('nested Craft elements');
});

it('offers Vizy fields for Hosted Vizy Editors on Block Type layouts', function() {
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $available = $layout->getAvailableCustomFields();
    $fields = [];
    foreach ($available as $group) {
        foreach ($group as $element) {
            if ($element instanceof CustomField) {
                $fields[] = $element->getField()::class;
            }
        }
    }

    $lifecycle = Vizy::$plugin->getFieldLifecycle();
    expect($lifecycle->classify(new VizyField())['capability'])->toBe(FieldLifecycle::HOSTED_VIZY)
        ->and($lifecycle->permitsNewPlacement(new VizyField()))->toBeTrue()
        ->and($lifecycle->permitsNewPlacement(new Date()))->toBeTrue()
        ->and($lifecycle->permitsNewPlacement(new Dropdown()))->toBeTrue()
        ->and($lifecycle->permitsNewPlacement(new Link()))->toBeTrue()
        ->and($fields)->toContain(PlainText::class)
        ->and($fields)->toContain(VizyField::class)
        ->and($fields)->not->toContain(Matrix::class)
        ->and($fields)->not->toContain(ContentBlock::class)
        ->and($fields)->not->toContain(Addresses::class);
});

it('caps hosted Vizy nesting depth at five levels', function() {
    expect(HostedVizy::MAX_DEPTH)->toBe(5)
        ->and(HostedVizy::allowsDepth(1))->toBeTrue()
        ->and(HostedVizy::allowsDepth(5))->toBeTrue()
        ->and(HostedVizy::allowsDepth(6))->toBeFalse();

    HostedVizy::setRenderingDepth(0);
    expect(HostedVizy::nextDepth())->toBe(1);
    HostedVizy::setRenderingDepth(5);
    expect(HostedVizy::nextDepth())->toBe(6)
        ->and(HostedVizy::allowsDepth(HostedVizy::nextDepth()))->toBeFalse();
    HostedVizy::setRenderingDepth(0);
});

it('collapses poisoned Date+Time locale arrays before normalizeValue', function() {
    $collapsed = FieldSlotValues::collapseDateRequestScalars([
        'date' => '9/4/2026',
        'time' => '3:00 PM',
        'locale' => ['en', 'en'],
        'timezone' => ['America/Los_Angeles', 'America/Los_Angeles'],
    ]);
    expect($collapsed['locale'])->toBe('en')
        ->and($collapsed['timezone'])->toBe('America/Los_Angeles')
        ->and($collapsed['date'])->toBe('9/4/2026');

    $date = new Date([
        'handle' => 'poisonDate' . StringHelper::randomString(5),
        'showDate' => true,
        'showTime' => true,
    ]);
    $block = new Block();
    $block->id = null;
    $prepared = FieldSlotValues::forSetFieldValue($date, [
        'date' => '9/4/2026',
        'time' => '3:00 PM',
        'locale' => ['en', 'en'],
        'timezone' => 'America/Los_Angeles',
    ], $block);

    // Without collapse, DateTimeHelper::getLocaleById(array) TypeErrors.
    $normalized = $date->normalizeValue($prepared, $block);
    expect($normalized)->toBeInstanceOf(DateTimeInterface::class);
});
