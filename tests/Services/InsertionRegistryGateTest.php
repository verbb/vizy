<?php

declare(strict_types=1);

use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

it('ships deterministic insertion items for blocks and enabled prose nodes', function() {
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Hero',
        'handle' => 'hero' . StringHelper::randomString(5),
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Insertion',
        'handle' => 'insertion' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [[
            'name' => 'Featured',
            'blockTypeUids' => [$type->uid],
        ]],
    ]);

    $service = Vizy::$plugin->getEditorManifests();
    $service->invalidate();
    $manifest = $service->build($field);

    expect($manifest)->toHaveKey('insertionItems')
        ->and(collect($manifest['insertionItems'])->pluck('id')->all())
        ->toContain("block:{$type->uid}", 'node:vizy:paragraph')
        ->and(collect($manifest['insertionItems'])->firstWhere('id', "block:{$type->uid}"))
        ->toMatchArray([
            'kind' => 'block',
            'label' => 'Hero',
            'group' => 'Featured',
        ]);
});

it('omits block insertion items for rich-text-only fields', function() {
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Rich only',
        'handle' => 'richOnly' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [],
    ]);

    $manifest = Vizy::$plugin->getEditorManifests()->build($field);
    expect(collect($manifest['insertionItems'])->contains(fn(array $item) => $item['kind'] === 'block'))->toBeFalse()
        ->and(collect($manifest['insertionItems'])->contains(fn(array $item) => $item['id'] === 'node:vizy:paragraph'))->toBeTrue();
});

it('lists only root-allowed block types in the insertion manifest', function() {
    $parent = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Parent',
        'handle' => 'parent' . StringHelper::randomString(5),
    ]);
    $parentLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $parentLayout->setTabs([]);
    $parent->setFieldLayout($parentLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($parent))->toBeTrue();

    $orphan = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Orphan',
        'handle' => 'orphan' . StringHelper::randomString(5),
    ]);
    $orphanLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $orphanLayout->setTabs([]);
    $orphan->setFieldLayout($orphanLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($orphan))->toBeTrue();

    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Root insertion',
        'handle' => 'rootInsertion' . StringHelper::randomString(5),
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS,
        'blockTypePickerGroups' => [[
            'name' => 'Root',
            'blockTypeUids' => [$parent->uid],
        ]],
    ]);

    $items = Vizy::$plugin->getEditorManifests()->build($field)['insertionItems'];
    expect(collect($items)->pluck('id')->all())
        ->toContain("block:{$parent->uid}")
        ->and(collect($items)->pluck('id')->all())
        ->not->toContain("block:{$orphan->uid}");
});

it('lists installed partner nodes in the insertion manifest when enabled', function() {
    $handler = function(\verbb\vizy\events\RegisterExtensionsEvent $event): void {
        $event->nodes[] = \Tests\Support\Types\Emoji::class;
    };
    \yii\base\Event::on(
        \verbb\vizy\services\Extensions::class,
        \verbb\vizy\services\Extensions::EVENT_REGISTER_EXTENSIONS,
        $handler,
    );
    Vizy::$plugin->getExtensions()->reset();

    try {
        $configs = Vizy::$plugin->getEditorConfigs();
        $id = 'emojiins' . strtolower(StringHelper::randomString(6));
        expect($configs->saveConfig($id, [
            'label' => 'Emoji insertion',
            'capabilities' => [
                'nodes' => ['paragraph', 'emoji'],
                'marks' => [],
            ],
            'toolbar' => ['paragraph'],
        ]))->toBeTrue();

        $field = new VizyField([
            'uid' => StringHelper::UUID(),
            'name' => 'Emoji field',
            'handle' => 'emojiField' . StringHelper::randomString(5),
            'editorConfig' => $id,
            'rootContentType' => VizyField::ROOT_CONTENT_RICH,
            'blockTypePickerGroups' => [],
        ]);

        Vizy::$plugin->getEditorManifests()->invalidate();
        $items = Vizy::$plugin->getEditorManifests()->build($field)['insertionItems'];
        $emoji = collect($items)->firstWhere('id', 'node:vizy:emoji');
        expect($emoji)->not->toBeNull()
            ->and($emoji)->toMatchArray([
                'kind' => 'node',
                'nodeName' => 'emoji',
                'label' => 'Emoji',
                'group' => 'Extensions',
            ]);

        $configs->removeConfig($id);
    } finally {
        \yii\base\Event::off(
            \verbb\vizy\services\Extensions::class,
            \verbb\vizy\services\Extensions::EVENT_REGISTER_EXTENSIONS,
            $handler,
        );
        Vizy::$plugin->getExtensions()->reset();
    }
});
