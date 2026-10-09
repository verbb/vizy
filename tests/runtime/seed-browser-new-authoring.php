<?php

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Matrix;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;

// Start without seeded Blocks or JSON assets, as a newly configured site does.
$coldRowLayout = new FieldLayout(['type' => Entry::class]);
$coldRowLayout->setTabs([new FieldLayoutTab([
    'name' => 'Content', 'layout' => $coldRowLayout,
    'elements' => [new CustomField($rootField)],
])]);
$coldRowType = new EntryType(['name' => 'Fresh authoring row', 'handle' => 'freshAuthoringRow']);
$coldRowType->setFieldLayout($coldRowLayout);
$save($coldRowType, Craft::$app->getEntries()->saveEntryType(...));
$coldMatrix = new Matrix(['name' => 'Fresh chapters', 'handle' => 'freshChapters', 'viewMode' => Matrix::VIEW_MODE_BLOCKS]);
$coldMatrix->setEntryTypes([$coldRowType]);
$save($coldMatrix, Craft::$app->getFields()->saveField(...));
$coldLayout = new FieldLayout(['type' => Entry::class]);
$coldLayout->setTabs([new FieldLayoutTab([
    'name' => 'Content', 'layout' => $coldLayout,
    'elements' => [new \craft\fieldlayoutelements\entries\EntryTitleField(), new CustomField($rootField), new CustomField($coldMatrix)],
])]);
$coldType = new EntryType(['name' => 'Fresh authoring', 'handle' => 'freshAuthoring']);
$coldType->setFieldLayout($coldLayout);
$save($coldType, Craft::$app->getEntries()->saveEntryType(...));
$section = Craft::$app->getEntries()->getSectionById($section->id);
$section->setEntryTypes([...$section->getEntryTypes(), $coldType]);
$save($section, Craft::$app->getEntries()->saveSection(...));
$coldOwner = new Entry([
    'sectionId' => $section->id, 'typeId' => $coldType->id, 'siteId' => 1,
    'title' => 'Fresh authoring owner', 'slug' => 'fresh-authoring-owner',
]);
$coldOwner->setAuthorIds([$admin->id]);
$save($coldOwner, Craft::$app->getElements()->saveElement(...));
