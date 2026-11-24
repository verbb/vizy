<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\elements\Category;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\Json;
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
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\Vizy;
use yii\base\ModelEvent;
use yii\base\Event;

function matrixAnchorLifecycleFixture(bool $categoryOwner = false, bool $searchable = false, bool $searchableMatrix = false): array
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
    $matrix = new Matrix(['name' => 'Lifecycle rows', 'handle' => 'lifecycleRows' . $suffix, 'searchable' => $searchableMatrix]);
    $matrix->setEntryTypes([$rowType]);
    expect(Craft::$app->getFields()->saveField($matrix))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$matrix->handle] = true;
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $placement = new CustomField($matrix);
    $placement->uid = StringHelper::UUID();
    $placements = [$placement];
    $fieldSlots = [];
    if ($searchable) {
        // Craft indexes the Block's searchable fields while it restores the owner.
        $blockText = new PlainText(['name' => 'Block text', 'handle' => 'lifecycleBlockText' . $suffix, 'searchable' => true]);
        expect(Craft::$app->getFields()->saveField($blockText))->toBeTrue();
        CustomFieldBehavior::$fieldHandles[$blockText->handle] = true;
        $textPlacement = new CustomField($blockText);
        $textPlacement->uid = StringHelper::UUID();
        $placements[] = $textPlacement;
        $fieldSlots[$textPlacement->uid] = 'Lifecyclesearchtext';
    }
    $layout->setTabs([new FieldLayoutTab(['layout' => $layout, 'name' => 'Content', 'elements' => $placements])]);
    $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Lifecycle block', 'handle' => 'lifecycleBlock' . $suffix]);
    $type->setFieldLayout($layout);
    // Grandfather a layout that was already present before the V3 upgrade.
    Craft::$app->getProjectConfig()->set(BlockTypes::PROJECT_CONFIG_PATH . '.' . $type->uid, ProjectConfig::packAssociativeArrays($type->toConfig()));
    $field = VizyFixtureFactory::vizyField();
    $field->richTextOnly = false;
    if ($searchable || $searchableMatrix) {
        // The shared fixture field; the test that asks for this turns it off again.
        $field->searchable = true;
    }
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
        $group->setSiteSettings(array_map(
            static fn($site) => new CategoryGroup_SiteSettings([
                'siteId' => $site->id, 'hasUrls' => false,
            ]),
            Craft::$app->getSites()->getAllSites(),
        ));
        expect(Craft::$app->getCategories()->saveGroup($group))->toBeTrue();
        $owner = new Category(['groupId' => $group->id, 'title' => 'Anchor lifecycle ' . $suffix]);
        expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue(json_encode($owner->getErrors()));
    } else {
        $owner = VizyFixtureFactory::entry('Anchor lifecycle ' . $suffix);
    }
    foreach ($owner->getFieldLayout()->getCustomFieldElements() as $element) {
        if ($element->getField()->uid === $field->uid) {
            $element->getField()->richTextOnly = $field->richTextOnly;
            $element->getField()->blockTypePickerGroups = $field->blockTypePickerGroups;
            $element->getField()->searchable = $field->searchable;
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
                'matrixAnchorUid' => $anchor->uid, 'fieldSlots' => $fieldSlots,
            ],
        ]],
    ]);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue(json_encode($owner->getErrors()));
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

it('restores a trashed owner whose Block has searchable fields', function() {
    $fixture = matrixAnchorLifecycleFixture(searchable: true);
    extract($fixture);
    $elements = Craft::$app->getElements();
    try {
        expect($elements->deleteElement($owner))->toBeTrue();

        // The owner's anchor stays in the trash until Craft's after-restore event, after indexing.
        $trashed = Entry::find()->id($owner->id)->trashed()->status(null)->one();
        $document = $trashed->getFieldValue($field->handle);
        expect($document->blockElement($document->findBlock($blockUid))->id)->toBe($anchor->id)
            ->and($elements->restoreElement($trashed))->toBeTrue();

        $keywords = (new \craft\db\Query())
            ->select(['keywords'])
            ->from(\craft\db\Table::SEARCHINDEX)
            ->where(['elementId' => $owner->id, 'siteId' => $owner->siteId, 'fieldId' => $field->id])
            ->scalar();
        $restored = Vizy::$plugin->getAnchors()->getAnchor($owner, $field, $blockUid, $anchor->uid);
        expect($keywords)->toContain('lifecyclesearchtext')
            ->and($restored)->toBeInstanceOf(MatrixAnchor::class);
        $restored->setFieldLayout($layout);
        expect(array_map(static fn(Entry $row) => $row->id, $restored->getFieldValue($matrix->handle)->all()))->toBe([$row->id]);

        // A live owner still refuses an anchor that is only in the trash.
        \craft\helpers\Db::update(\craft\db\Table::ELEMENTS, [
            'dateDeleted' => \craft\helpers\Db::prepareDateForDb(new DateTime()),
        ], ['id' => $anchor->id]);
        $live = Entry::find()->id($owner->id)->status(null)->one();
        $liveDocument = $live->getFieldValue($field->handle);
        expect(fn() => $liveDocument->blockElement($liveDocument->findBlock($blockUid)))
            ->toThrow(LogicException::class, 'could not be resolved');
    } finally {
        $field->searchable = false;
        Craft::$app->getFields()->saveField($field);

        // The fixture also turned it on for the owner layout's copies of the shared field.
        foreach ($owner->getFieldLayout()->getCustomFieldElements() as $element) {
            if ($element->getField()->uid === $field->uid) {
                $element->getField()->searchable = false;
            }
        }
    }
});

it('restores a trashed owner whose Block’s only searchable field is a Matrix field', function() {
    $fixture = matrixAnchorLifecycleFixture(searchableMatrix: true);
    extract($fixture);
    $elements = Craft::$app->getElements();
    try {
        expect($elements->deleteElement($owner))->toBeTrue();

        // Indexing the Matrix field during the restore resolves the Block's still-trashed anchor.
        $trashed = Entry::find()->id($owner->id)->trashed()->status(null)->one();
        expect($elements->restoreElement($trashed))->toBeTrue();

        $restored = Vizy::$plugin->getAnchors()->getAnchor($owner, $field, $blockUid, $anchor->uid);
        expect($restored)->toBeInstanceOf(MatrixAnchor::class);
        $restored->setFieldLayout($layout);
        expect(array_map(static fn(Entry $row) => $row->id, $restored->getFieldValue($matrix->handle)->all()))->toBe([$row->id]);
    } finally {
        $field->searchable = false;
        Craft::$app->getFields()->saveField($field);

        foreach ($owner->getFieldLayout()->getCustomFieldElements() as $element) {
            if ($element->getField()->uid === $field->uid) {
                $element->getField()->searchable = false;
            }
        }
    }
});

it('restores a trashed owner whose Hosted Vizy Block has searchable fields', function() {
    $suffix = StringHelper::randomString(8);
    $fields = Craft::$app->getFields();
    $blockLayout = static function(array $elements): FieldLayout {
        $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
        $layout->setTabs([new FieldLayoutTab(['layout' => $layout, 'name' => 'Content', 'elements' => $elements])]);

        return $layout;
    };
    $plain = new PlainText(['name' => 'Row text', 'handle' => 'hostedRowText' . $suffix]);
    // Craft indexes the nested Block's searchable fields while it restores the owner.
    $text = new PlainText(['name' => 'Block text', 'handle' => 'hostedBlockText' . $suffix, 'searchable' => true]);
    expect($fields->saveField($plain))->toBeTrue()
        ->and($fields->saveField($text))->toBeTrue();
    $rowType = new EntryType(['name' => 'Hosted row', 'handle' => 'hostedRow' . $suffix]);
    $rowLayout = new FieldLayout(['type' => Entry::class]);
    $rowLayout->setTabs([new FieldLayoutTab(['layout' => $rowLayout, 'name' => 'Content', 'elements' => [new CustomField($plain)]])]);
    $rowType->setFieldLayout($rowLayout);
    expect(Craft::$app->getEntries()->saveEntryType($rowType))->toBeTrue();
    $matrix = new Matrix(['name' => 'Hosted rows', 'handle' => 'hostedRows' . $suffix]);
    $matrix->setEntryTypes([$rowType]);
    expect($fields->saveField($matrix))->toBeTrue();
    $matrixPlacement = new CustomField($matrix);
    $matrixPlacement->uid = StringHelper::UUID();
    $textPlacement = new CustomField($text);
    $textPlacement->uid = StringHelper::UUID();
    $innerType = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Hosted card', 'handle' => 'hostedCard' . $suffix]);
    $innerType->setFieldLayout($blockLayout([$matrixPlacement, $textPlacement]));
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($innerType))->toBeTrue();
    $hosted = new VizyField([
        'name' => 'Hosted body', 'handle' => 'hostedBody' . $suffix, 'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS, 'searchable' => true,
        'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$innerType->uid]]],
    ]);
    expect($fields->saveField($hosted))->toBeTrue();
    $hostedPlacement = new CustomField($hosted);
    $hostedPlacement->uid = StringHelper::UUID();
    $hostType = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Host', 'handle' => 'hostedHost' . $suffix]);
    $hostType->setFieldLayout($blockLayout([$hostedPlacement]));
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($hostType))->toBeTrue();
    $field = new VizyField([
        'name' => 'Hosted article', 'handle' => 'hostedArticle' . $suffix, 'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS, 'searchable' => true,
        'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$hostType->uid]]],
    ]);
    expect($fields->saveField($field))->toBeTrue();
    $fields->refreshFields();

    $site = Craft::$app->getSites()->getPrimarySite();
    $rowKey = StringHelper::UUID();
    $owner = VizyFixtureFactory::entryOnSite(VizyFixtureFactory::multisiteSection($field, 1, [$site]), $field, $site, 'Hosted restore ' . $suffix, Json::encode([
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [[
            'type' => 'vizyBlock', 'attrs' => [
                'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $hostType->uid, 'enabled' => true,
                'fieldSlots' => [$hostedPlacement->uid => ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [[
                    'type' => 'vizyBlock', 'attrs' => [
                        'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $innerType->uid, 'enabled' => true,
                        'fieldSlots' => [
                            $matrixPlacement->uid => [
                                'entries' => [$rowKey => ['type' => $rowType->handle, 'fields' => [$plain->handle => 'Hosted row survives']]],
                                'sortOrder' => [$rowKey],
                            ],
                            $textPlacement->uid => 'Hostedsearchtext',
                        ],
                    ],
                ]]]],
            ],
        ]],
    ]));
    $nestedRows = static function(Entry $owner) use ($field, $hosted, $matrix, $plain): array {
        $nested = $owner->getFieldValue($field->handle)->blocks()[0]->fieldValue($hosted->handle);
        $block = $nested->blocks()[0];

        return [
            $nested->blockElement($block)->id,
            array_map(static fn(Entry $row) => $row->getFieldValue($plain->handle), $block->fieldValue($matrix->handle)->all()),
        ];
    };
    [$anchorId, $rows] = $nestedRows(Entry::find()->id($owner->id)->status(null)->one());
    expect($anchorId)->toBeInt()
        ->and($rows)->toBe(['Hosted row survives']);

    $elements = Craft::$app->getElements();
    expect($elements->deleteElement($owner))->toBeTrue()
        ->and(MatrixAnchor::find()->id($anchorId)->status(null)->exists())->toBeFalse();

    // Restore an owner loaded from the Trash, as the CP does.
    expect($elements->restoreElement(Entry::find()->id($owner->id)->trashed()->status(null)->one()))->toBeTrue();

    $keywords = (new \craft\db\Query())
        ->select(['keywords'])
        ->from(\craft\db\Table::SEARCHINDEX)
        ->where(['elementId' => $owner->id, 'siteId' => $owner->siteId, 'fieldId' => $field->id])
        ->scalar();
    expect($keywords)->toContain('hostedsearchtext')
        ->and($nestedRows(Entry::find()->id($owner->id)->status(null)->one()))->toBe([$anchorId, ['Hosted row survives']]);
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
