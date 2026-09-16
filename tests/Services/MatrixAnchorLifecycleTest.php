<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\elements\Category;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\ProjectConfig;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\CategoryGroup;
use craft\models\CategoryGroup_SiteSettings;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\elements\Block;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\Vizy;
use yii\base\ModelEvent;
use yii\base\Event;

function matrixAnchorLifecycleFixture(bool $categoryOwner = false): array
{
    $suffix = StringHelper::randomString(8);
    $plain = new PlainText(['name' => 'Row text', 'handle' => 'lifecycleText' . $suffix]);
    expect(Craft::$app->getFields()->saveField($plain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$plain->handle] = true;
    $rowType = new EntryType(['name' => 'Lifecycle row', 'handle' => 'lifecycleRow' . $suffix]);
    $rowLayout = new FieldLayout(['type' => Entry::class]);
    $rowLayout->setTabs([new FieldLayoutTab([
        'layout' => $rowLayout, 'name' => 'Content', 'elements' => [new CustomField($plain)],
    ])]);
    $rowType->setFieldLayout($rowLayout);
    expect(Craft::$app->getEntries()->saveEntryType($rowType))->toBeTrue();
    $matrix = new Matrix(['name' => 'Lifecycle rows', 'handle' => 'lifecycleRows' . $suffix]);
    $matrix->setEntryTypes([$rowType]);
    expect(Craft::$app->getFields()->saveField($matrix))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$matrix->handle] = true;
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $placement = new CustomField($matrix);
    $placement->uid = StringHelper::UUID();
    $layout->setTabs([new FieldLayoutTab(['layout' => $layout, 'name' => 'Content', 'elements' => [$placement]])]);
    $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Lifecycle block', 'handle' => 'lifecycleBlock' . $suffix]);
    $type->setFieldLayout($layout);
    // Grandfather a layout that was already present before the V3 upgrade.
    Craft::$app->getProjectConfig()->set(BlockTypes::PROJECT_CONFIG_PATH . '.' . $type->uid, ProjectConfig::packAssociativeArrays($type->toConfig()));
    $field = VizyFixtureFactory::vizyField();
    $field->blockTypePickerGroups = [['name' => 'Content', 'blockTypeUids' => [$type->uid]]];
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    Craft::$app->getFields()->refreshFields();
    if ($categoryOwner) {
        $ownerLayout = new FieldLayout(['type' => Category::class]);
        $ownerLayout->setTabs([new FieldLayoutTab([
            'layout' => $ownerLayout, 'name' => 'Content', 'elements' => [new CustomField($field)],
        ])]);
        $group = new CategoryGroup(['name' => 'Lifecycle categories ' . $suffix, 'handle' => 'lifecycleCategories' . $suffix]);
        $group->setFieldLayout($ownerLayout);
        $group->setSiteSettings([new CategoryGroup_SiteSettings([
            'siteId' => Craft::$app->getSites()->getPrimarySite()->id, 'hasUrls' => false,
        ])]);
        expect(Craft::$app->getCategories()->saveGroup($group))->toBeTrue();
        $owner = new Category(['groupId' => $group->id, 'title' => 'Anchor lifecycle ' . $suffix]);
        expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue();
    } else {
        $owner = VizyFixtureFactory::entry('Anchor lifecycle ' . $suffix);
    }
    foreach ($owner->getFieldLayout()->getCustomFieldElements() as $element) {
        if ($element->getField()->uid === $field->uid) {
            $element->getField()->blockTypePickerGroups = $field->blockTypePickerGroups;
        }
    }
    $blockUid = StringHelper::UUID();
    $anchor = Vizy::$plugin->getAnchors()->ensureAnchor($owner, $field, $blockUid, $layout);
    $row = new Entry(['siteId' => $owner->siteId, 'typeId' => $rowType->id, 'fieldId' => $matrix->id, 'title' => 'Keep this row']);
    $row->setOwner($anchor);
    $row->setFieldValue($plain->handle, 'Matrix survives restoration');
    expect(Craft::$app->getElements()->saveElement($row))->toBeTrue();
    $owner->setFieldValue($field->handle, [
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [[
            'type' => 'vizyBlock', 'attrs' => [
                'blockUid' => $blockUid, 'blockTypeUid' => $type->uid, 'enabled' => true,
                'matrixAnchorUid' => $anchor->uid, 'fieldSlots' => [],
            ],
        ]],
    ]);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue();
    return compact('owner', 'field', 'blockUid', 'anchor', 'row', 'plain', 'matrix', 'layout');
}

it('restores Matrix block rows with a trashed owner', function() {
    $fixture = matrixAnchorLifecycleFixture();
    extract($fixture);
    $elements = Craft::$app->getElements();
    expect($elements->deleteElement($owner))->toBeTrue();
    $rowVisibleInTrash = Entry::find()->id($row->id)->status(null)->exists();
    expect($elements->restoreElement($owner))->toBeTrue();
    $restored = Vizy::$plugin->getAnchors()->getAnchor($owner, $field, $blockUid, $anchor->uid);
    expect($restored)->toBeInstanceOf(MatrixAnchor::class);
    $restored->setFieldLayout($layout);
    $rows = $restored->getFieldValue($matrix->handle)->all();
    expect($rows)->toHaveCount(1)
        ->and($rowVisibleInTrash)->toBeFalse()
        ->and($rows[0]->id)->toBe($row->id)
        ->and($rows[0]->getFieldValue($plain->handle))->toBe('Matrix survives restoration');
});

it('keeps Matrix blocks intact when owner deletion is cancelled', function(bool $hardDelete) {
    $fixture = matrixAnchorLifecycleFixture();
    extract($fixture);
    $cancel = static function(ModelEvent $event): void {
        $event->isValid = false;
    };
    $owner->on(Entry::EVENT_BEFORE_DELETE, $cancel);
    expect(Craft::$app->getElements()->deleteElement($owner, $hardDelete))->toBeFalse();
    expect(Vizy::$plugin->getAnchors()->getAnchor($owner, $field, $blockUid, $anchor->uid))->not->toBeNull()
        ->and(Entry::find()->id($row->id)->status(null)->one()?->getFieldValue($plain->handle))->toBe('Matrix survives restoration');
    $owner->off(Entry::EVENT_BEFORE_DELETE, $cancel);
    expect(Craft::$app->getElements()->deleteElement($owner))->toBeTrue()
        ->and(Craft::$app->getElements()->restoreElement($owner))->toBeTrue()
        ->and(Vizy::$plugin->getAnchors()->getAnchor($owner, $field, $blockUid, $anchor->uid))->not->toBeNull();
})->with([false, true]);

it('removes Matrix anchors and rows when an owner is permanently deleted', function(bool $trashFirst) {
    $fixture = matrixAnchorLifecycleFixture();
    extract($fixture);
    $elements = Craft::$app->getElements();
    if ($trashFirst) {
        expect($elements->deleteElement($owner))->toBeTrue();
    }
    expect($elements->deleteElement($owner, true))->toBeTrue();
    $remaining = (new \craft\db\Query())->from('{{%elements}}')->where(['id' => [$anchor->id, $row->id]])->count();
    expect((int)$remaining)->toBe(0);
})->with([false, true]);

it('rolls Matrix deletion back when the owner deletion fails', function() {
    $fixture = matrixAnchorLifecycleFixture();
    extract($fixture);
    // Class handlers run after the deferred anchor cleanup on the owner.
    $fail = static function(Event $event) use ($owner): void {
        if ($event->sender->id === $owner->id) {
            throw new RuntimeException('Fail after deleting owned anchors');
        }
    };
    Event::on(Entry::class, Entry::EVENT_AFTER_DELETE, $fail);
    try {
        expect(fn() => Craft::$app->getElements()->deleteElement($owner))->toThrow(RuntimeException::class, 'Fail after deleting owned anchors');
    } finally {
        Event::off(Entry::class, Entry::EVENT_AFTER_DELETE, $fail);
    }
    expect(Entry::find()->id($owner->id)->status(null)->exists())->toBeTrue()
        ->and(Vizy::$plugin->getAnchors()->getAnchor($owner, $field, $blockUid, $anchor->uid))->not->toBeNull()
        ->and(Entry::find()->id($row->id)->status(null)->one()?->getFieldValue($plain->handle))->toBe('Matrix survives restoration');
});

it('does not restore Matrix rows that were independently trashed', function() {
    $fixture = matrixAnchorLifecycleFixture();
    extract($fixture);
    $elements = Craft::$app->getElements();
    expect($elements->deleteElement($row))->toBeTrue()
        ->and($elements->deleteElement($owner))->toBeTrue()
        ->and($elements->restoreElement($owner))->toBeTrue();
    expect(Vizy::$plugin->getAnchors()->getAnchor($owner, $field, $blockUid, $anchor->uid))->not->toBeNull()
        ->and(Entry::find()->id($row->id)->status(null)->exists())->toBeFalse()
        ->and(Entry::find()->id($row->id)->status(null)->trashed(true)->exists())->toBeTrue();
});

it('trashes and restores Matrix rows with a category owner', function() {
    extract(matrixAnchorLifecycleFixture(true));
    $elements = Craft::$app->getElements();
    expect($elements->deleteElement($owner))->toBeTrue();
    $rowVisibleInTrash = Entry::find()->id($row->id)->status(null)->exists();
    expect($elements->restoreElement($owner))->toBeTrue();
    $restored = Vizy::$plugin->getAnchors()->getAnchor($owner, $field, $blockUid, $anchor->uid);
    expect($restored)->toBeInstanceOf(MatrixAnchor::class);
    $restored->setFieldLayout($layout);
    $rows = $restored->getFieldValue($matrix->handle)->all();
    expect($rowVisibleInTrash)->toBeFalse()
        ->and($rows)->toHaveCount(1)
        ->and($rows[0]->id)->toBe($row->id)
        ->and($rows[0]->getFieldValue($plain->handle))->toBe('Matrix survives restoration');
});

it('removes Matrix anchors and rows when a category is permanently deleted', function(bool $trashFirst) {
    extract(matrixAnchorLifecycleFixture(true));
    $elements = Craft::$app->getElements();
    if ($trashFirst) {
        expect($elements->deleteElement($owner))->toBeTrue();
    }
    expect($elements->deleteElement($owner, true))->toBeTrue();
    $remaining = (new \craft\db\Query())->from('{{%elements}}')->where(['id' => [$anchor->id, $row->id]])->count();
    expect((int)$remaining)->toBe(0);
})->with([false, true]);
