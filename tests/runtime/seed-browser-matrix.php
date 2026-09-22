<?php

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

function seedBrowserMatrix(VizyField $field, Entry $owner, callable $save, string $mode = 'blocks'): array
{
    $suffix = $mode === 'blocks' ? '' : str_replace('-', '', ucfirst($mode));
    $label = new PlainText(['name' => 'Row label', 'handle' => 'browserRowLabel' . $suffix]);
    $save($label, Craft::$app->getFields()->saveField(...));
    $rowType = new EntryType(['name' => 'Browser row', 'handle' => 'browserRow' . $suffix]);
    $rowLayout = new FieldLayout(['type' => Entry::class]);
    $rowTab = new FieldLayoutTab(['name' => 'Content', 'layout' => $rowLayout]);
    $rowTab->setElements([new CustomField($label)]);
    $rowLayout->setTabs([$rowTab]);
    $rowType->setFieldLayout($rowLayout);
    $save($rowType, Craft::$app->getEntries()->saveEntryType(...));
    $matrix = new Matrix(['name' => 'Existing rows', 'handle' => 'browserRows' . $suffix, 'viewMode' => $mode]);
    $matrix->setEntryTypes([$rowType]);
    $save($matrix, Craft::$app->getFields()->saveField(...));
    $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Existing Matrix', 'handle' => 'existingMatrix' . $suffix]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['name' => 'Content', 'layout' => $layout]);
    $placement = new CustomField($matrix);
    $placement->uid = StringHelper::UUID();
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $type->setFieldLayout($layout);
    // Use normal configuration saves so the CP journeys cover new placements.
    $save($type, Vizy::$plugin->getBlockTypes()->saveBlockType(...));
    $field->blockTypePickerGroups[0]['blockTypeUids'][] = $type->uid;
    $save($field, Craft::$app->getFields()->saveField(...));
    Craft::$app->getFields()->refreshFields();
    $owner = Entry::find()->id($owner->id)->status(null)->one();
    foreach ($owner->getFieldLayout()->getCustomFieldElements() as $element) {
        $layoutField = $element->getField();
        if ($layoutField instanceof VizyField && $layoutField->uid === $field->uid) {
            $layoutField->blockTypePickerGroups = $field->blockTypePickerGroups;
        }
    }
    $blockUid = StringHelper::UUID();
    $anchor = Vizy::$plugin->getAnchors()->ensureAnchor($owner, $field, $blockUid, $layout, null);
    $row = new Entry(['siteId' => $owner->siteId, 'typeId' => $rowType->id, 'fieldId' => $matrix->id, 'title' => 'Existing row']);
    $row->setOwner($anchor);
    $row->setFieldValue($label->handle, 'Matrix before');
    $save($row, Craft::$app->getElements()->saveElement(...));
    $document = $owner->getFieldValue($field->handle)->toArray();
    $document['content'][] = ['type' => 'vizyBlock', 'attrs' => [
        'blockUid' => $blockUid, 'blockTypeUid' => $type->uid, 'enabled' => true,
        'matrixAnchorUid' => $anchor->uid, 'fieldSlots' => [],
    ]];
    $owner->setFieldValue($field->handle, $document);
    $save($owner, Craft::$app->getElements()->saveElement(...));
    $unplaced = new Matrix(['name' => 'Unplaced rows', 'handle' => 'browserUnplacedRows' . $suffix]);
    $unplaced->setEntryTypes([$rowType]);
    $save($unplaced, Craft::$app->getFields()->saveField(...));
    return ['fieldId' => $matrix->id, 'entryTypeId' => $rowType->id, 'anchorId' => $anchor->id, 'vizyFieldId' => $field->id, 'unplacedFieldId' => $unplaced->id, 'foreignEntryTypeId' => $owner->typeId, 'blockUid' => $blockUid, 'rowId' => $row->id, 'anchorUid' => $anchor->uid, 'fieldHandle' => $matrix->handle, 'labelHandle' => $label->handle];
}
