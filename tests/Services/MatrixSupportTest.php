<?php

declare(strict_types=1);

use craft\db\Query;
use craft\db\Table;
use craft\elements\Entry;
use craft\enums\PropagationMethod;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentWalk;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\Vizy;

it('keeps repeated Matrix blocks independent through reorder delete clear and omitted submissions', function() {
    $f = new MatrixSupportFixture();
    $first = StringHelper::UUID();
    $second = StringHelper::UUID();
    $owner = $f->save([$f->block($first, $f->payload(['One', 'Two'])), $f->block($second, $f->payload(['Neighbour']))]);
    [$one, $two] = $f->rows($first);
    $neighbour = $f->rows($second)[0];
    $payload = ['entries' => [], 'sortOrder' => [$two->id, $one->id]];
    foreach ([$two, $one] as $row) {
        $payload['entries'][$row->id] = ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => $row->getFieldValue($f->text->handle)]];
    }
    $owner = $f->save([$f->block($second), $f->block($first, $payload)], $owner);
    expect(array_column($f->rows($first), 'id'))->toBe([$two->id, $one->id])
        ->and($f->rows($second)[0]->id)->toBe($neighbour->id);
    $payload['sortOrder'] = [$one->id];
    unset($payload['entries'][$two->id]);
    $owner = $f->save([$f->block($first, $payload), $f->block($second)], $owner);
    expect(array_column($f->rows($first), 'id'))->toBe([$one->id]);
    $f->save([$f->block($first, ['entries' => [], 'sortOrder' => []]), $f->block($second)], $owner);
    expect($f->rows($first))->toBeEmpty()
        ->and($f->rows($second)[0]->id)->toBe($neighbour->id)
        ->and($f->rows($second)[0]->getFieldValue($f->text->handle))->toBe('Neighbour');
});

it('copies Matrix descendants when a Vizy owner is duplicated without reparenting the source', function() {
    $f = new MatrixSupportFixture(nested: true);
    $uid = StringHelper::UUID();
    $payload = $f->payload(['Outer']);
    $innerUid = StringHelper::UUID();
    $payload['entries'][array_key_first($payload['entries'])]['fields'][$f->nestedMatrix->handle] = [
        'entries' => [$innerUid => ['type' => $f->nestedMatrix->getEntryTypes()[0]->handle, 'fields' => [$f->text->handle => 'Inner']]],
        'sortOrder' => [$innerUid],
    ];
    $owner = $f->save([$f->block($uid, $payload)]);
    $source = $f->rows($uid)[0];
    $sourceChild = $source->getFieldValue($f->nestedMatrix->handle)->one();
    expect($sourceChild?->getFieldValue($f->text->handle))->toBe('Inner');
    $copy = Craft::$app->getElements()->duplicateElement($owner, ['title' => 'Copied article']);
    $copy = $f->reload($copy);
    $copyUid = $copy->getFieldValue($f->field->handle)->blocks()[0]->uid();
    $copied = $f->rows($copyUid, $copy)[0];
    $copiedChild = $copied->getFieldValue($f->nestedMatrix->handle)->one();
    expect($copyUid)->not->toBe($uid)
        ->and($copied->id)->not->toBe($source->id)
        ->and($copiedChild?->id)->not->toBe($sourceChild->id)
        ->and($copiedChild?->getFieldValue($f->text->handle))->toBe('Inner');
    $copiedChild->setFieldValue($f->text->handle, 'Copy only');
    expect(Craft::$app->getElements()->saveElement($copiedChild))->toBeTrue()
        ->and(Entry::find()->id($sourceChild->id)->status(null)->one()?->getFieldValue($f->text->handle))->toBe('Inner')
        ->and($f->rows($uid)[0]->id)->toBe($source->id);
});

it('keeps duplicated Matrix anchors independent across localized owners', function() {
    [, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture(fieldTranslationMethod: \craft\base\Field::TRANSLATION_METHOD_NONE);

    $uid = StringHelper::UUID();
    $sourceA = $f->save([$f->block($uid, $f->payload(['Localized source']))], $f->reload());
    $sourceB = Entry::find()->id($sourceA->id)->siteId($siteB->id)->status(null)->one();
    $duplicateA = Craft::$app->getElements()->duplicateElement($sourceA, ['title' => 'Localized copy']);
    $duplicateA = $f->reload($duplicateA);
    $duplicateB = Entry::find()->id($duplicateA->id)->siteId($siteB->id)->status(null)->one();
    $duplicateUid = $duplicateA->getFieldValue($f->field->handle)->blocks()[0]->uid();

    $sourceAnchorA = Vizy::$plugin->getAnchors()->getAnchor($sourceA, $f->field, $uid);
    $sourceAnchorB = Vizy::$plugin->getAnchors()->getAnchor($sourceB, $f->field, $uid);
    $duplicateAnchorA = Vizy::$plugin->getAnchors()->getAnchor($duplicateA, $f->field, $duplicateUid);
    $duplicateAnchorB = Vizy::$plugin->getAnchors()->getAnchor($duplicateB, $f->field, $duplicateUid);
    expect($duplicateUid)->not->toBe($uid)
        ->and($sourceAnchorA->id)->toBe($sourceAnchorB->id)
        ->and($duplicateAnchorA->id)->toBe($duplicateAnchorB->id)
        ->and($duplicateAnchorA->id)->not->toBe($sourceAnchorA->id);

    $sourceRowB = $f->rows($uid, $sourceB)[0];
    $duplicateRowB = $f->rows($duplicateUid, $duplicateB)[0];
    $duplicateRowB->setFieldValue($f->text->handle, 'Localized copy only');
    expect(Craft::$app->getElements()->saveElement($duplicateRowB))->toBeTrue()
        ->and($f->rows($uid, $sourceB)[0]->id)->toBe($sourceRowB->id)
        ->and($f->rows($uid, $sourceB)[0]->getFieldValue($f->text->handle))->toBe('Localized source');
});

it('repairs a historical duplicate that persisted another owner\'s Matrix anchor reference', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $sourceOwner = $f->save([$f->block($uid, $f->payload(['Surviving shared row']))]);
    $sourceDocument = $sourceOwner->getFieldValue($f->field->handle)->toArray();
    $sourceAnchor = Vizy::$plugin->getAnchors()->getAnchor($sourceOwner, $f->field, $uid);
    $sourceRow = $f->rows($uid, $sourceOwner)[0];

    $historical = new Entry([
        'sectionId' => $sourceOwner->sectionId,
        'typeId' => $sourceOwner->typeId,
        'siteId' => $sourceOwner->siteId,
        'title' => 'Historical duplicate',
    ]);
    expect(Craft::$app->getElements()->saveElement($historical))->toBeTrue();

    // Recreate the Vizy 3 defect after Craft has cleared its transient
    // duplicateOf relationship: both persisted owners name the source anchor.
    $placementUid = FieldPlacements::uid($historical, $f->field);
    $stored = (new Query())
        ->select('content')
        ->from(Table::ELEMENTS_SITES)
        ->where(['elementId' => $historical->id, 'siteId' => $historical->siteId])
        ->scalar();
    $stored = is_string($stored) ? Json::decode($stored) : $stored;
    $stored[$placementUid] = Json::encode([[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => $uid,
            'enabled' => true,
            'values' => [
                'type' => 'historical-matrix-block',
                'matrixAnchorUid' => $sourceAnchor->uid,
                'content' => ['fields' => []],
            ],
        ],
    ]]);
    Craft::$app->getDb()->createCommand()
        ->update(Table::ELEMENTS_SITES, ['content' => $stored], [
            'elementId' => $historical->id,
            'siteId' => $historical->siteId,
        ])
        ->execute();

    $historical = $f->reload($historical);
    expect($historical->duplicateOf)->toBeNull();
    // The migration layer supplies the canonical candidate while the database
    // still contains the Vizy 3 source used to authorize recovery.
    $historical->setFieldValue($f->field->handle, $sourceDocument);

    $reject = static function() {
        throw new RuntimeException('Reject historical anchor repair');
    };
    $historical->on(Entry::EVENT_AFTER_PROPAGATE, $reject);
    expect(fn() => Craft::$app->getElements()->saveElement($historical))
        ->toThrow(RuntimeException::class, 'Reject historical anchor repair');
    $historical->off(Entry::EVENT_AFTER_PROPAGATE, $reject);
    expect(Vizy::$plugin->getAnchors()->getAnchor($historical, $f->field, $uid))->toBeNull()
        ->and($f->rows($uid, $sourceOwner)[0]->id)->toBe($sourceRow->id);

    $historical = $f->reload($historical);
    $historical->setFieldValue($f->field->handle, $sourceDocument);
    expect(Craft::$app->getElements()->saveElement($historical))->toBeTrue();

    $historical = $f->reload($historical);
    $repairedAnchor = Vizy::$plugin->getAnchors()->getAnchor($historical, $f->field, $uid);
    $repairedRow = $f->rows($uid, $historical)[0];
    expect($repairedAnchor)->not->toBeNull()
        ->and($repairedAnchor->uid)->not->toBe($sourceAnchor->uid)
        ->and($repairedAnchor->parentOwnerId)->toBe($historical->id)
        ->and($repairedRow->id)->not->toBe($sourceRow->id)
        ->and($repairedRow->getFieldValue($f->text->handle))->toBe('Surviving shared row');

    $repairedRow->setFieldValue($f->text->handle, 'Historical owner only');
    expect(Craft::$app->getElements()->saveElement($repairedRow))->toBeTrue()
        ->and($f->rows($uid, $sourceOwner)[0]->getFieldValue($f->text->handle))->toBe('Surviving shared row');
});

it('keeps site-specific Matrix rows separate on the same logical Vizy block', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture(propagation: PropagationMethod::None);
    $uid = StringHelper::UUID();
    $ownerA = $f->save([$f->block($uid, $f->payload(['Site A']))]);
    $ownerB = Entry::find()->id($ownerA->id)->siteId($siteB->id)->status(null)->one();
    expect($ownerB)->not->toBeNull();
    $ownerB = $f->save([$f->block($uid, $f->payload(['Site B']))], $ownerB);
    expect(array_map(fn($row) => $row->getFieldValue($f->text->handle), $f->rows($uid, $ownerA)))->toBe(['Site A'])
        ->and(array_map(fn($row) => $row->getFieldValue($f->text->handle), $f->rows($uid, $ownerB)))->toBe(['Site B']);
    $f->save([], $ownerA);
    expect($f->rows($uid, $ownerB)[0]->getFieldValue($f->text->handle))->toBe('Site B');
});

it('cleans removed Matrix blocks only after their last localized document reference is gone', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture(propagation: PropagationMethod::None);
    $uid = StringHelper::UUID();
    $ownerA = $f->save([$f->block($uid, $f->payload(['A']))]);
    $ownerB = Entry::find()->id($ownerA->id)->siteId($siteB->id)->status(null)->one();
    $ownerB = $f->save([$f->block($uid, $f->payload(['B']))], $ownerB);
    $rows = [...$f->rows($uid, $ownerA), ...$f->rows($uid, $ownerB)];
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($ownerA, $f->field, $uid);
    $f->save([], $ownerA);
    expect(MatrixAnchor::find()->id($anchor->id)->siteId($siteB->id)->exists())->toBeTrue();
    $f->save([], $ownerB);
    expect(MatrixAnchor::find()->id($anchor->id)->site('*')->exists())->toBeFalse()
        ->and(Entry::find()->id(array_column($rows, 'id'))->site('*')->status(null)->exists())->toBeFalse();
    // Undo after a saved deletion reuses the original anchor and row identities.
    $f->save([$f->block($uid)], $f->reload($ownerA));
    expect(Vizy::$plugin->getAnchors()->getAnchor($ownerA, $f->field, $uid)?->id)->toBe($anchor->id)
        ->and($f->rows($uid, $ownerA)[0]->id)->toBe($rows[0]->id)
        ->and($f->rows($uid, $ownerA)[0]->getFieldValue($f->text->handle))->toBe('A');
});

it('rolls back Matrix cleanup when the containing save fails after propagation', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Keep me']))]);
    $row = $f->rows($uid)[0];
    $owner->on(Entry::EVENT_AFTER_PROPAGATE, static function() {
        throw new RuntimeException('Fail after Matrix cleanup');
    });
    expect(fn() => $f->save([], $owner))->toThrow(RuntimeException::class, 'Fail after Matrix cleanup');
    expect($f->rows($uid)[0]->id)->toBe($row->id)
        ->and($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Keep me');
});

it('copies and cleans Matrix inside Hosted Vizy without touching the source document', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $hostUid = StringHelper::UUID();
    $owner = $f->save([$f->hostedBlock($hostUid, [$f->block($uid, $f->payload(['Hosted row']))])]);
    $document = $owner->getFieldValue($f->field->handle);
    $block = array_values(array_filter(iterator_to_array(DocumentWalk::blocks($document), false), fn($block) => $block->uid() === $uid))[0] ?? null;
    expect($block)->not->toBeNull();
    $sourceRow = $block->document()->blockElement($block)->getFieldValue($f->matrix->handle)->one();
    expect($sourceRow?->getFieldValue($f->text->handle))->toBe('Hosted row');
    $copy = Craft::$app->getElements()->duplicateElement($owner, ['title' => 'Hosted copy']);
    $copy = $f->reload($copy);
    $copiedBlocks = iterator_to_array(DocumentWalk::blocks($copy->getFieldValue($f->field->handle)), false);
    $copiedBlock = array_values(array_filter($copiedBlocks, fn($block) => $block->blockType()?->uid === $f->blockType->uid))[0];
    $copiedRow = $copiedBlock->document()->blockElement($copiedBlock)->getFieldValue($f->matrix->handle)->one();
    expect($copiedRow?->getFieldValue($f->text->handle))->toBe('Hosted row')
        ->and($copiedRow?->id)->not->toBe($sourceRow->id);
    $f->save([], $copy);
    expect(Entry::find()->id($copiedRow->id)->status(null)->exists())->toBeFalse()
        ->and(Entry::find()->id($sourceRow->id)->status(null)->exists())->toBeTrue();
});

it('rejects invalid Matrix row fields without overwriting persisted content', function() {
    $f = new MatrixSupportFixture();
    $layout = $f->rowType->getFieldLayout();
    $layout->getCustomFieldElements()[0]->required = true;
    $f->rowType->setFieldLayout($layout);
    expect(Craft::$app->getEntries()->saveEntryType($f->rowType))->toBeTrue();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Required value']))]);
    $owner->setScenario(Entry::SCENARIO_LIVE);
    $row = $f->rows($uid)[0];
    $owner->setFieldValue($f->field->handle, [
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$f->block($uid, [
            'entries' => [$row->id => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => '']]],
            'sortOrder' => [$row->id],
        ])],
    ]);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeFalse()
        ->and($owner->getErrors())->not->toBeEmpty()
        ->and($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Required value');
});

it('preserves Matrix references inside a temporarily unresolved Hosted block schema', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->hostedBlock(StringHelper::UUID(), [$f->block($uid, $f->payload(['Keep unresolved content']))])]);
    $document = $owner->getFieldValue($f->field->handle);
    $blocks = iterator_to_array(DocumentWalk::blocks($document), false);
    $block = array_values(array_filter($blocks, fn($block) => $block->uid() === $uid))[0];
    $row = $block->document()->blockElement($block)->getFieldValue($f->matrix->handle)->one();
    $raw = $document->toArray();
    $raw['content'][0]['attrs']['blockTypeUid'] = StringHelper::UUID();
    $owner->setFieldValue($f->field->handle, $raw);
    // Simulate an imported document whose outer schema is not currently loaded.
    expect(Craft::$app->getElements()->saveElement($owner, false))->toBeTrue()
        ->and(Entry::find()->id($row->id)->status(null)->exists())->toBeTrue();
    $f->save([], $f->reload($owner));
    expect(Entry::find()->id($row->id)->status(null)->exists())->toBeFalse();
});

it('trashes and restores site-specific Matrix rows with their owner', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture(propagation: PropagationMethod::None);
    $uid = StringHelper::UUID();
    $ownerA = $f->save([$f->block($uid, $f->payload(['A']))]);
    $ownerB = Entry::find()->id($ownerA->id)->siteId($siteB->id)->status(null)->one();
    $ownerB = $f->save([$f->block($uid, $f->payload(['B']))], $ownerB);
    $rows = [...$f->rows($uid, $ownerA), ...$f->rows($uid, $ownerB)];
    expect(Craft::$app->getElements()->deleteElement($ownerA))->toBeTrue()
        ->and(Entry::find()->id(array_column($rows, 'id'))->site('*')->status(null)->exists())->toBeFalse();
    expect(Craft::$app->getElements()->restoreElement($ownerA))->toBeTrue()
        ->and($f->rows($uid, $ownerA)[0]->id)->toBe($rows[0]->id)
        ->and($f->rows($uid, $ownerB)[0]->id)->toBe($rows[1]->id);
});
