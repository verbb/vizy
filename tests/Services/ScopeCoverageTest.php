<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\Vizy;

it('retains a schema-referenced Block Type until its reference is removed', function() {
    $service = Vizy::$plugin->getBlockTypes();
    $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Protected', 'handle' => 'protected' . StringHelper::randomString(6)]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([]);
    $type->setFieldLayout($layout);
    expect($service->saveBlockType($type))->toBeTrue();
    $field = new VizyField([
        'name' => 'Schema reference', 'handle' => 'schemaRef' . StringHelper::randomString(6),
        'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$type->uid]]],
    ]);
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $config = Craft::$app->getProjectConfig();
    $typePath = BlockTypes::PROJECT_CONFIG_PATH . '.' . $type->uid;
    $fieldPath = 'fields.' . $field->uid;
    $beforeType = $config->get($typePath);
    $beforeField = $config->get($fieldPath);
    expect(craft\helpers\ProjectConfig::unpackAssociativeArrays($beforeField)['settings']['blockTypePickerGroups'][0]['blockTypeUids'])->toBe([$type->uid]);
    expect($service->deleteBlockType($type))->toBeFalse()
        ->and($type->getErrors('uid'))->not->toBeEmpty()
        ->and($config->get($typePath))->toBe($beforeType)
        ->and($config->get($fieldPath))->toBe($beforeField)
        ->and($service->getBlockTypeByUid($type->uid)?->id)->toBe($type->id);
    $field->blockTypePickerGroups = [];
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue()
        ->and($service->deleteBlockType($type))->toBeTrue()
        ->and($config->get($typePath))->toBeNull()
        ->and($service->getBlockTypeByUid($type->uid))->toBeNull();
});

it('filters and orders saved Blocks by layout field values through the template query API', function() {
    $label = new PlainText(['name' => 'Query label', 'handle' => 'queryLabel' . StringHelper::randomString(6)]);
    expect(Craft::$app->getFields()->saveField($label))->toBeTrue();
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $placement = new CustomField($label);
    $placement->uid = StringHelper::UUID();
    $tab = new FieldLayoutTab(['layout' => $layout, 'name' => 'Content']);
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Query card', 'handle' => 'queryCard' . StringHelper::randomString(6)]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    // Unsorted values, a nonmatch and another type with a matching value make
    // each field filter, type filter and ordering clause affect the result.
    $uids = array_map(fn() => StringHelper::UUID(), range(1, 3));
    $data = json_decode(VizyFixtureFactory::paragraphDocument(), true);
    foreach (['Zulu', 'Excluded', 'Alpha'] as $index => $value) {
        $data['content'][] = ['type' => 'vizyBlock', 'attrs' => [
            'blockUid' => $uids[$index], 'blockTypeUid' => $type->uid, 'enabled' => true,
            'fieldSlots' => [$placement->uid => $value],
        ]];
    }
    $otherType = Vizy::$plugin->getBlockTypes()->duplicateBlockType($type);
    $otherPlacement = $otherType->getFieldLayout()->getCustomFieldElements()[0]->uid;
    $data['content'][] = ['type' => 'vizyBlock', 'attrs' => [
        'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $otherType->uid, 'enabled' => true,
        'fieldSlots' => [$otherPlacement => 'Alpha'],
    ]];
    $field = VizyFixtureFactory::vizyField();
    $previousGroups = $field->blockTypePickerGroups;
    $field->blockTypePickerGroups = [['name' => 'Query', 'blockTypeUids' => [$type->uid, $otherType->uid]]];
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $owner = VizyFixtureFactory::entry('Query owner');
    // Earlier integration fixtures may have cached a layout-local field instance.
    $placedField = $owner->getFieldLayout()->getFieldByHandle($field->handle);
    $previousPlacedGroups = $placedField->blockTypePickerGroups;
    $placedField->blockTypePickerGroups = $field->blockTypePickerGroups;
    try {
        $owner->setFieldValue($field->handle, json_encode($data));
        expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue();
        $saved = Entry::find()->id($owner->id)->status(null)->one();
        $document = $saved->getFieldValue(VizyFixtureFactory::vizyField()->handle);
        $result = $document->query()->where(['handle' => $type->handle])
            ->andWhere(['in', $label->handle, ['Alpha', 'Zulu']])
            ->orderBy([$label->handle => SORT_ASC])->all();
        expect(array_map(fn($block) => $block->uid, $result))->toBe([$uids[2], $uids[0]]);
    } finally {
        $placedField->blockTypePickerGroups = $previousPlacedGroups;
        $field->blockTypePickerGroups = $previousGroups;
        expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    }
});
