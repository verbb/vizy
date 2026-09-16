<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use ReflectionMethod;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\legacy\Vizy3DocumentAdapter;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\FieldLifecycle;
use verbb\vizy\Vizy;

/**
 * Matrix-in-Block Option 1 grandfather: existing Matrix mounts + round-trips via
 * MatrixAnchor; new Matrix placements stay forbidden.
 */
it('splits Matrix serialize from new placement', function() {
    $lifecycle = Vizy::$plugin->getFieldLifecycle();
    $matrix = new Matrix(['handle' => 'gfMatrix']);
    expect($lifecycle->classify($matrix)['capability'])->toBe(FieldLifecycle::MATRIX_ANCHOR)
        ->and($lifecycle->canSerialize($matrix))->toBeTrue()
        ->and($lifecycle->permitsNewPlacement($matrix))->toBeFalse();
});

it('converts V3 matrixAnchorUid, hydrates Matrix from anchor, and serializes without Matrix blobs', function() {
    $suffix = StringHelper::randomString(6);

    $plain = new PlainText([
        'name' => 'Row Label',
        'handle' => 'rowLabel' . $suffix,
    ]);
    expect(Craft::$app->getFields()->saveField($plain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$plain->handle] = true;

    $rowType = new EntryType([
        'name' => "Matrix Row {$suffix}",
        'handle' => 'matrixRow' . $suffix,
    ]);
    $rowLayout = new FieldLayout(['type' => Entry::class]);
    $rowTab = new FieldLayoutTab(['name' => 'Content', 'layout' => $rowLayout]);
    $rowPlacement = new CustomField($plain);
    $rowPlacement->uid = StringHelper::UUID();
    $rowTab->setElements([$rowPlacement]);
    $rowLayout->setTabs([$rowTab]);
    $rowType->setFieldLayout($rowLayout);
    expect(Craft::$app->getEntries()->saveEntryType($rowType))->toBeTrue();

    $matrix = new Matrix([
        'name' => 'Rows',
        'handle' => 'rows' . $suffix,
    ]);
    $matrix->setEntryTypes([$rowType]);
    expect(Craft::$app->getFields()->saveField($matrix))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$matrix->handle] = true;

    $blockType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'With Matrix',
        'handle' => 'withMatrix' . $suffix,
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $matrixPlacement = new CustomField($matrix);
    $matrixPlacement->uid = StringHelper::UUID();
    $tab->setElements([$matrixPlacement]);
    $layout->setTabs([$tab]);
    $blockType->setFieldLayout($layout);

    // Simulate a Vizy 3 → 4 site that already had Matrix on the Block Type:
    // write Project Config directly so the placement is a known baseline.
    Craft::$app->getProjectConfig()->set(
        \verbb\vizy\services\BlockTypes::PROJECT_CONFIG_PATH . '.' . $blockType->uid,
        \craft\helpers\ProjectConfig::packAssociativeArrays($blockType->toConfig()),
    );
    expect(Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($blockType->uid))->not->toBeNull()
        // Re-save with the same Matrix placement must succeed (layout grandfather).
        ->and(Vizy::$plugin->getBlockTypes()->saveBlockType($blockType))->toBeTrue();

    $vizyField = new VizyField([
        'name' => 'Body',
        'handle' => 'bodyMatrixGf' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$blockType->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($vizyField))->toBeTrue();

    $owner = VizyFixtureFactory::entry("Matrix grandfather {$suffix}");
    $blockUid = StringHelper::UUID();

    $anchor = Vizy::$plugin->getAnchors()->ensureAnchor(
        $owner,
        $vizyField,
        $blockUid,
        $layout,
        null,
    );
    expect($anchor)->toBeInstanceOf(MatrixAnchor::class);

    $nested = new Entry([
        'siteId' => $owner->siteId,
        'typeId' => $rowType->id,
        'fieldId' => $matrix->id,
        'title' => 'Nested row',
    ]);
    $nested->setOwner($anchor);
    $nested->setFieldValue($plain->handle, 'Hello Matrix');
    expect(Craft::$app->getElements()->saveElement($nested))->toBeTrue();

    $schemaMap = [
        'type-matrix' => [
            'blockTypeUid' => $blockType->uid,
            'placementUids' => [
                $matrixPlacement->uid => $matrixPlacement->uid,
                $matrix->handle => $matrixPlacement->uid,
            ],
        ],
    ];
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => $blockUid,
            'enabled' => true,
            'values' => [
                'type' => 'type-matrix',
                'matrixAnchorUid' => $anchor->uid,
                'content' => [
                    'fields' => [
                        // Stale Matrix blob must not survive serialize once an anchor exists.
                        $matrixPlacement->uid => ['entries' => [], 'sortOrder' => []],
                    ],
                ],
            ],
        ],
    ]];

    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, $schemaMap);
    expect($canonical['content'][0]['attrs']['matrixAnchorUid'])->toBe($anchor->uid);

    $document = Vizy::$plugin->getDocuments()->normalizeValue($canonical, $owner, $vizyField);
    expect($document->findBlock($blockUid)?->matrixAnchorUid())->toBe($anchor->uid);

    $block = $document->findBlock($blockUid);
    expect($block?->matrixAnchorUid())->toBe($anchor->uid);

    $blockElement = $document->blockElement($block);
    expect($blockElement->getMatrixAnchor()?->uid)->toBe($anchor->uid)
        ->and($blockElement->id)->toBe($anchor->id);

    $matrixValue = $blockElement->getFieldValue($matrix->handle);
    $labels = array_map(
        static fn(Entry $entry) => (string)$entry->getFieldValue($plain->handle),
        $matrixValue->all(),
    );
    expect($labels)->toContain('Hello Matrix');

    // Legacy site variants may omit the reference while the ownership row
    // already exists. Pure projection must resolve it without saving rows.
    $missingReference = $canonical;
    unset($missingReference['content'][0]['attrs']['matrixAnchorUid']);
    $withoutReference = Vizy::$plugin->getDocuments()->normalizeValue($missingReference, $owner, $vizyField);
    $projected = json_decode($vizyField->serializeValue($withoutReference, $owner), true);
    expect($projected['content'][0]['attrs']['matrixAnchorUid'])->toBe($anchor->uid)
        ->and(Craft::$app->getElements()->getElementById($nested->id, Entry::class, $owner->siteId)->getFieldValue($plain->handle))->toBe('Hello Matrix');

    $forms = Vizy::$plugin->getFieldLayoutForms();
    $adapterId = (new ReflectionMethod($forms, '_adapterId'));
    $adapterId->setAccessible(true);
    expect($adapterId->invoke($forms, $matrix))->toBe('craft.matrix');
    // The real CP browser suite covers Matrix inputHtml and widget capture.
    // This test isolates anchor hydration and persistence from that UI boundary.

    // Simulate client flush of Matrix portal shape into fieldSlots, then serialize.
    $withFlush = $document->toArray();
    $withFlush['content'][0]['attrs']['fieldSlots'][$matrixPlacement->uid] = [
        'entries' => [
            'uid:' . $nested->uid => [
                'type' => $rowType->handle,
                'fields' => [$plain->handle => 'Hello Matrix edited'],
            ],
        ],
        'sortOrder' => [$nested->uid],
    ];
    $flushed = Vizy::$plugin->getDocuments()->normalizeValue($withFlush, $owner, $vizyField);
    // Craft also serializes values for copying and change tracking. Those reads
    // must not apply the pending Matrix edit.
    $vizyField->serializeValue($flushed, $owner);
    $unchanged = Craft::$app->getElements()->getElementById($nested->id, Entry::class, $owner->siteId);
    expect($unchanged->getFieldValue($plain->handle))->toBe('Hello Matrix');

    $serialized = json_decode($vizyField->serializeValueForDb($flushed, $owner), true);

    expect($serialized['content'][0]['attrs']['matrixAnchorUid'])->toBe($anchor->uid)
        ->and($serialized['content'][0]['attrs']['fieldSlots'])->not->toHaveKey($matrixPlacement->uid);

    $reloaded = Craft::$app->getElements()->getElementById($nested->id, Entry::class, $owner->siteId);
    expect($reloaded->getFieldValue($plain->handle))->toBe('Hello Matrix edited');

    $disabledRow = new Entry([
        'siteId' => $owner->siteId, 'typeId' => $rowType->id,
        'fieldId' => $matrix->id, 'title' => 'Disabled row', 'enabled' => false,
    ]);
    $disabledRow->setOwner($anchor);
    $disabledRow->setFieldValue($plain->handle, 'Keep disabled');
    expect(Craft::$app->getElements()->saveElement($disabledRow))->toBeTrue();

    // Exercise Craft's real draft and publish lifecycle with a persisted field.
    CustomFieldBehavior::$fieldHandles[$vizyField->handle] = true;
    $ownerType = $owner->getType();
    $ownerLayout = $ownerType->getFieldLayout();
    $ownerTab = $ownerLayout->getTabs()[0];
    $ownerPlacement = new CustomField($vizyField);
    $ownerPlacement->uid = StringHelper::UUID();
    $ownerTab->setElements([...$ownerTab->getElements(), $ownerPlacement]);
    $ownerType->setFieldLayout($ownerLayout);
    expect(Craft::$app->getEntries()->saveEntryType($ownerType))->toBeTrue();
    $owner = Craft::$app->getElements()->getElementById($owner->id, Entry::class, $owner->siteId);
    $owner->setFieldValue($vizyField->handle, $serialized);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue();
    $draft = Craft::$app->getDrafts()->createDraft($owner);
    $draftDoc = $draft->getFieldValue($vizyField->handle);
    $draftAnchor = Vizy::$plugin->getAnchors()->getAnchor($draft, $vizyField, $blockUid);
    expect($draftAnchor)->not->toBeNull()
        ->and($draftAnchor->id)->not->toBe($anchor->id)
        ->and($draftDoc->findBlock($blockUid)->matrixAnchorUid())->toBe($draftAnchor->uid);
    $draftAnchor->setFieldLayout($layout);
    $draftRows = \verbb\vizy\helpers\Matrix::nestedEntryQuery($matrix, $draftAnchor)->all();
    expect($draftRows)->toHaveCount(2)
        ->and(array_map(static fn(Entry $row) => $row->getFieldValue($plain->handle), $draftRows))->toContain('Keep disabled');
    $draftRow = $draftAnchor->getFieldValue($matrix->handle)->one();
    expect($draftRow)->not->toBeNull()
        ->and($draftRow->id)->not->toBe($nested->id)
        ->and($draftRow->getFieldValue($plain->handle))->toBe('Hello Matrix edited');
    $draftRaw = $draftDoc->toArray();
    $draftRaw['content'][0]['attrs']['fieldSlots'][$matrixPlacement->uid] = [
        'entries' => ['uid:' . $draftRow->uid => [
            'type' => $rowType->handle, 'fields' => [$plain->handle => 'Draft only'],
        ]],
        'sortOrder' => [$draftRow->uid],
    ];
    $draft->setFieldValue($vizyField->handle, $draftRaw);
    expect(Craft::$app->getElements()->saveElement($draft))->toBeTrue();
    $liveRow = Craft::$app->getElements()->getElementById($nested->id, Entry::class, $owner->siteId);
    expect($liveRow->getFieldValue($plain->handle))->toBe('Hello Matrix edited');
    // Reload so publish consumes the persisted anchor snapshot, not a POST blob.
    $draft = Entry::find()->id($draft->id)->drafts(true)->status(null)->one();
    $published = Craft::$app->getElements()->updateCanonicalElement($draft);
    $publishedAnchor = Vizy::$plugin->getAnchors()->getAnchor($published, $vizyField, $blockUid);
    $publishedAnchor->setFieldLayout($layout);
    expect($publishedAnchor->getFieldValue($matrix->handle)->one()->getFieldValue($plain->handle))->toBe('Draft only');

    $publishedRow = $publishedAnchor->getFieldValue($matrix->handle)->one();
    $failedRaw = $published->getFieldValue($vizyField->handle)->toArray();
    $failedRaw['content'][0]['attrs']['fieldSlots'][$matrixPlacement->uid] = [
        'entries' => ['uid:' . $publishedRow->uid => [
            'type' => $rowType->handle, 'fields' => [$plain->handle => 'Must roll back'],
        ]],
        'sortOrder' => [$publishedRow->uid],
    ];
    $published->setFieldValue($vizyField->handle, $failedRaw);
    $published->on(Entry::EVENT_AFTER_SAVE, static function(): void {
        throw new \RuntimeException('Injected owner failure after Matrix persistence');
    });
    expect(fn() => Craft::$app->getElements()->saveElement($published))
        ->toThrow(\RuntimeException::class, 'Injected owner failure');
    $afterFailure = Craft::$app->getElements()->getElementById($publishedRow->id, Entry::class, $owner->siteId);
    expect($afterFailure->getFieldValue($plain->handle))->toBe('Draft only');


});

it('rejects newly added Matrix placements on Block Types while keeping designer forbid', function() {
    $suffix = StringHelper::randomString(6);
    $matrix = new Matrix(['name' => 'New Matrix', 'handle' => 'newMatrix' . $suffix]);
    $entryType = new EntryType(['name' => "T {$suffix}", 'handle' => 't' . $suffix]);
    expect(Craft::$app->getEntries()->saveEntryType($entryType))->toBeTrue();
    $matrix->setEntryTypes([$entryType]);
    expect(Craft::$app->getFields()->saveField($matrix))->toBeTrue();

    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'New Matrix Block',
        'handle' => 'newMatrixBlock' . $suffix,
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $placement = new CustomField($matrix);
    $placement->uid = StringHelper::UUID();
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $type->setFieldLayout($layout);

    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeFalse()
        ->and($type->getErrors('fieldLayout'))->not->toBeEmpty();
});
