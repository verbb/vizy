<?php

declare(strict_types=1);

use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use verbb\vizy\db\Table;
use verbb\vizy\elements\Block;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\Vizy;

function schemaType(string $name, string $handle): BlockType
{
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => $name,
        'handle' => $handle,
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([]);
    $type->setFieldLayout($layout);
    return $type;
}

it('normalises Block Type accent colours to #rrggbb', function() {
    expect(BlockType::normalizeColor('#3B8'))->toBe('#33bb88')
        ->and(BlockType::normalizeColor('#3b82f6'))->toBe('#3b82f6')
        ->and(BlockType::normalizeColor(''))->toBeNull()
        ->and(BlockType::normalizeColor('red'))->toBeNull();
});

it('installs the global Block Type runtime table', function() {
    expect(Craft::$app->getDb()->tableExists(Table::BLOCK_TYPES))->toBeTrue();
});

it('round-trips global Block Types through Project Config and DB identity', function() {
    $type = schemaType('Hero', 'hero' . StringHelper::randomString(5));

    $service = Vizy::$plugin->getBlockTypes();
    expect($service->saveBlockType($type))->toBeTrue();
    $loaded = $service->getBlockTypeByUid($type->uid);

    expect($loaded)->not->toBeNull()
        ->and($loaded)->toBe($service->getBlockTypeByHandle($type->handle))
        ->and($loaded->id)->toBeInt()
        ->and($loaded->getFieldLayout()->type)->toBe(Block::class)
        ->and($loaded->getFieldLayout()->uid)->toBe($type->getFieldLayout()->uid);
});

it('rejects duplicate global handles', function() {
    $service = Vizy::$plugin->getBlockTypes();
    $a = schemaType('A', 'dupHandle' . StringHelper::randomString(5));
    $duplicate = schemaType('Duplicate', $a->handle);

    expect(fn() => $service->preflightExternalSchema([
        $a->uid => $a->toConfig(),
        $duplicate->uid => $duplicate->toConfig(),
    ]))->toThrow(RuntimeException::class);
});

it('rejects Project Config map-key and payload UID disagreement before synchronization', function() {
    $type = schemaType('Mismatch', 'mismatch' . StringHelper::randomString(5));
    $config = $type->toConfig();
    $config['uid'] = StringHelper::UUID();

    expect(fn() => Vizy::$plugin->getBlockTypes()->preflightExternalSchema([
        $type->uid => $config,
    ]))->toThrow(RuntimeException::class, 'does not match payload UID');
});

it('counts consecutive same-type nesting depth with resets across other types', function() {
    expect(BlockTypes::consecutiveSameTypeDepth([], 'a'))->toBe(1)
        ->and(BlockTypes::consecutiveSameTypeDepth(['a', 'a'], 'a'))->toBe(3)
        ->and(BlockTypes::consecutiveSameTypeDepth(['a', 'a', 'a'], 'a'))->toBe(4)
        ->and(BlockTypes::consecutiveSameTypeDepth(['a', 'b'], 'a'))->toBe(1)
        ->and(BlockTypes::SAME_BLOCK_TYPE_MAX_DEPTH)->toBe(3);
});

it('stores Vizy field root policy as grouped global UID references only', function() {
    $uidA = StringHelper::UUID();
    $uidB = StringHelper::UUID();
    $field = new \verbb\vizy\fields\VizyField([
        'name' => 'Body',
        'handle' => 'body' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
        'rootContentType' => \verbb\vizy\fields\VizyField::ROOT_CONTENT_BLOCKS,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$uidA, $uidB]],
        ],
    ]);

    expect($field->getAllowedBlockTypeUids())->toBe([$uidA, $uidB])
        ->and($field->allowsBlockTypeUid($uidA))->toBeTrue()
        ->and($field->getSettings())->not->toHaveKeys(['fieldData', 'manualConfig', 'configSelectionMode', 'editorMode', 'vizyConfig'])
        ->and($field->validate())->toBeTrue();

    $field->blockTypePickerGroups[] = ['name' => 'Again', 'blockTypeUids' => [$uidA]];
    expect($field->validate())->toBeFalse();
});

it('uses session-safe block type flash payloads', function() {
    $type = schemaType('Card', 'card' . StringHelper::randomString(5));
    $type->addError('name', 'Already taken.');

    $payload = [
        'uid' => (string)$type->uid,
        'config' => $type->toConfig(),
        'errors' => $type->getErrors(),
    ];

    expect(serialize($payload))->toBeString();

    $restored = BlockType::fromConfig($payload['uid'], $payload['config']);
    foreach ($payload['errors'] as $attribute => $messages) {
        foreach ($messages as $message) {
            $restored->addError($attribute, $message);
        }
    }

    expect($restored->getErrors('name'))->toContain('Already taken.');
});

it('ignores Project Config keys the Block Type model no longer owns', function() {
    // Stale Content Area keys from older Project Config must not fatal the model.
    $config = schemaType('Legacy', 'legacy' . StringHelper::randomString(5))->toConfig();
    $config['contentAreas'] = [
        ['uid' => StringHelper::UUID(), 'name' => 'Content', 'handle' => 'content'],
    ];
    $config['someKeyWeNeverHad'] = true;

    $uid = StringHelper::UUID();
    $blockType = BlockType::fromConfig($uid, $config);

    expect($blockType->uid)->toBe($uid)
        ->and($blockType->name)->toBe('Legacy');
});

it('reads back exactly what toConfig writes', function() {
    $type = schemaType('Hero', 'hero' . StringHelper::randomString(5));
    $type->icon = 'fa:star';
    $type->template = '_blocks/hero';

    $restored = BlockType::fromConfig((string)$type->uid, $type->toConfig());

    expect($restored->toConfig())->toBe($type->toConfig());
});

it('starts new block types with an empty layout tab', function() {
    $controller = new verbb\vizy\controllers\BlockTypesController('block-types', Vizy::$plugin);
    $method = new ReflectionMethod($controller, '_newBlockTypeWithUid');
    $blockType = $method->invoke($controller, StringHelper::UUID());

    expect($blockType->getFieldLayout()?->getTabs())->toHaveCount(1)
        ->and($blockType->getFieldLayout()?->getTabs()[0]->getElements())->toBe([]);
});

it('uses the block fallback icon metadata when a block type has no icon', function() {
    $icons = Vizy::$plugin->getIcons();

    expect($icons->blockTypeIconSvg(null))->toBeNull();

    $insertion = $icons->blockTypeInsertionIcon(null);
    expect($insertion['name'])->toBe(\verbb\vizy\services\Icons::BLOCK_TYPE_FALLBACK_ICON)
        ->and($insertion['svg'])->toBeNull();
});
