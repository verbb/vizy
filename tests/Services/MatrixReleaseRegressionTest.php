<?php

declare(strict_types=1);

use craft\db\Query;
use craft\db\Table;
use craft\elements\Entry;
use craft\enums\PropagationMethod;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\Fixtures\AssetSpikeFixture;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\helpers\Matrix as MatrixHelper;
use verbb\vizy\Vizy;
use yii\base\Event;

// Behavioural regressions derived from released Vizy 3 fixes. Exercise Vizy 4's
// current ownership model rather than requiring the historical implementation.
it('normalizes repeated Matrix row identities once and retains their first position', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['First', 'Second']))]);
    [$first, $second] = $f->rows($uid);
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->field, $uid);
    $payload = ['entries' => [
        $first->id => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => 'First edited']],
        $second->id => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => 'Second']],
    ], 'sortOrder' => [$second->id, (string)$second->id, $first->id, $first->id]];
    $value = MatrixHelper::normalizeContent($f->matrix, $payload, $anchor);
    expect(array_column($value->all(), 'id'))->toBe([$second->id, $first->id]);
    $f->save([$f->block($uid, $payload)], $owner);
    expect(array_column($f->rows($uid), 'id'))->toBe([$second->id, $first->id]);
});

it('migrates legacy Matrix identities idempotently without creating duplicate entries', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $payload = ['new1' => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => 'Legacy row']]];
    $owner = $f->save([$f->block($uid, $payload)]);
    $original = $f->rows($uid)[0];
    $payload['new1']['fields'][$f->text->handle] = 'Legacy row updated';
    expect($original->uid)->toMatch('/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/');
    $f->save([$f->block($uid, $payload)], $owner);
    $rows = $f->rows($uid);
    expect($rows)->toHaveCount(1)
        ->and($rows[0]->id)->toBe($original->id)
        ->and($rows[0]->getFieldValue($f->text->handle))->toBe('Legacy row updated');
});

it('scopes legacy temporary Matrix identities to their anchor and preserves valid UIDs', function() {
    $f = new MatrixSupportFixture();
    $firstUid = StringHelper::UUID();
    $secondUid = StringHelper::UUID();
    $existingUid = StringHelper::UUID();
    $temporary = ['new1' => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => 'Temporary']]];
    $existing = [$existingUid => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => 'Existing UUID']]];
    $owner = $f->save([$f->block($firstUid, $temporary + $existing), $f->block($secondUid, $temporary)]);
    [$first, $preserved] = $f->rows($firstUid);
    $second = $f->rows($secondUid)[0];
    expect($first->uid)->not->toBe($second->uid)
        ->and($preserved->uid)->toBe($existingUid);
    $f->save([$f->block($firstUid, $temporary + $existing), $f->block($secondUid, $temporary)], $owner);
    expect(array_column($f->rows($firstUid), 'id'))->toBe([$first->id, $preserved->id])
        ->and(array_column($f->rows($secondUid), 'id'))->toBe([$second->id]);
});

it('projects and heals duplicate stored Matrix UIDs without changing another anchor', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $otherUid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Old', 'Newest'])), $f->block($otherUid, $f->payload(['Neighbour']))]);
    [$old, $new] = $f->rows($uid);
    $neighbour = $f->rows($otherUid)[0];
    // Reproduce the historical database state, which predates the V3 fix.
    Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS, ['uid' => $old->uid], ['id' => [$new->id, $neighbour->id]])->execute();
    $rows = $f->rows($uid);
    expect($rows)->toHaveCount(1)
        ->and($rows[0]->id)->toBe($new->id)
        ->and($rows[0]->getFieldValue($f->text->handle))->toBe('Newest');
    $f->save([$f->block($uid), $f->block($otherUid)], $owner);
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->field, $uid);
    expect((int)Entry::find()->ownerId($anchor->id)->fieldId($f->matrix->id)->status(null)->count())->toBe(1)
        ->and($f->rows($otherUid)[0]->id)->toBe($neighbour->id);
});

it('keeps newly created unpublished Matrix rows out of saved document reads', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Published row']))]);
    $original = $f->rows($uid)[0];
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->field, $uid);
    $anchor->setFieldLayout($f->blockType->getFieldLayout());
    $pending = new Entry(['siteId' => $owner->siteId, 'typeId' => $f->rowType->id, 'fieldId' => $f->matrix->id, 'title' => 'Pending row']);
    $pending->setOwner($anchor);
    expect(Craft::$app->getDrafts()->saveElementAsDraft($pending, AssetSpikeFixture::ensureAdminUser()->id, markAsSaved: false))->toBeTrue();
    expect(array_column($f->rows($uid), 'id'))->toBe([$original->id]);
    $f->save([$f->block($uid, [
        'entries' => [$pending->id => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => 'Now saved']]],
        'sortOrder' => [$original->id, $pending->id],
    ])], $owner);
    expect(array_map(fn($row) => $row->getFieldValue($f->text->handle), $f->rows($uid)))->toBe(['Published row', 'Now saved']);
});

it('keeps Matrix anchors within owner sites and supports newly enabled custom sites', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture();
    $section = Craft::$app->getEntries()->getSectionById($f->owner->sectionId);
    $section->propagationMethod = PropagationMethod::Custom;
    $siteSettings = $section->getSiteSettings();
    $section->setSiteSettings(array_filter($siteSettings, fn($settings) => $settings->siteId === $siteA->id));
    expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();
    $owner = new Entry(['sectionId' => $section->id, 'typeId' => $f->owner->typeId, 'siteId' => $siteA->id, 'title' => 'Custom propagation']);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Custom site content']))], $owner);
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->field, $uid);
    expect(MatrixAnchor::find()->id($anchor->id)->siteId($siteB->id)->exists())->toBeFalse();
    $section->setSiteSettings($siteSettings);
    expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();
    $owner->setEnabledForSite([$siteA->id => true, $siteB->id => true]);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue();
    $ownerB = Entry::find()->id($owner->id)->siteId($siteB->id)->status(null)->one();
    expect($ownerB)->not->toBeNull()
        ->and(Vizy::$plugin->getAnchors()->getAnchor($ownerB, $f->field, $uid)?->id)->toBe($anchor->id)
        ->and($f->rows($uid, $ownerB)[0]->getFieldValue($f->text->handle))->toBe('Custom site content');
});

it('detects Hosted Matrix backfill without inspecting unplaced fields', function() {
    $f = new MatrixSupportFixture();
    $host = $f->hostedBlock(StringHelper::UUID(), [$f->block(StringHelper::UUID(), $f->payload(['Nested legacy']))]);
    $f->owner->setFieldValue($f->field->handle, ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$host]]);
    expect(Vizy::$plugin->getAnchors()->elementNeedsMatrixAnchorBackfill($f->owner, $f->field))->toBeTrue()
        ->and(Vizy::$plugin->getAnchors()->elementNeedsMatrixAnchorBackfill($f->owner, $f->hostedField))->toBeFalse();
});

it('repairs a missing Matrix anchor site without creating another ownership tuple', function() {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture(propagation: PropagationMethod::None);
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Site A']))]);
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->field, $uid);
    Craft::$app->getDb()->createCommand()->delete(Table::ELEMENTS_SITES, ['elementId' => $anchor->id, 'siteId' => $siteB->id])->execute();
    $ownerB = Entry::find()->id($owner->id)->siteId($siteB->id)->status(null)->one();
    $ownerB = $f->save([$f->block($uid, $f->payload(['Site B']))], $ownerB);
    expect(Vizy::$plugin->getAnchors()->getAnchor($ownerB, $f->field, $uid)?->id)->toBe($anchor->id)
        ->and((int)(new Query())->from('{{%vizy_matrix_anchors}}')->where(['parentOwnerId' => $owner->id, 'vizyFieldId' => $f->field->id, 'blockInstanceId' => $uid])->count())->toBe(1)
        ->and($f->rows($uid, $owner)[0]->getFieldValue($f->text->handle))->toBe('Site A')
        ->and($f->rows($uid, $ownerB)[0]->getFieldValue($f->text->handle))->toBe('Site B');
});

it('removes Matrix blocks from a draft without deleting the published content', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Published']))]);
    $row = $f->rows($uid)[0];
    $draft = Craft::$app->getDrafts()->createDraft($owner);
    $draftRow = $f->rows($uid, $draft)[0];
    $f->save([], $draft);
    expect($f->rows($uid, $owner)[0]->id)->toBe($row->id)
        ->and(Entry::find()->id($draftRow->id)->status(null)->exists())->toBeFalse();
});

it('preserves an independent Matrix revision snapshot and restores it after live removal', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Revision content']))]);
    $user = AssetSpikeFixture::ensureAdminUser();
    $section = Craft::$app->getEntries()->getSectionById($owner->sectionId);
    $section->enableVersioning = true;
    expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();
    $revisionId = Craft::$app->getRevisions()->createRevision($owner, $user->id, force: true);
    $revision = Entry::find()->id($revisionId)->siteId($owner->siteId)->revisions()->status(null)->one();
    $revisionAnchor = Vizy::$plugin->getAnchors()->getAnchor($revision, $f->field, $uid);
    $liveAnchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->field, $uid);
    expect($revisionAnchor?->id)->not->toBe($liveAnchor->id);
    $f->save([], $owner);
    expect(MatrixAnchor::find()->id($revisionAnchor->id)->exists())->toBeTrue();
    $restored = Craft::$app->getRevisions()->revertToRevision($revision, $user->id);
    expect($f->rows($uid, $restored)[0]->getFieldValue($f->text->handle))->toBe('Revision content');
});

it('retains pending Matrix JSON and rolls back partial writes when a nested row save throws', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Original']))]);
    $original = $f->rows($uid)[0];
    $payload = $f->payload(['Written before failure', 'Fail this row']);
    $raw = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$f->block($uid, $payload)]];
    $owner->setFieldValue($f->field->handle, $raw);
    $fail = static function(Event $event) use ($f) {
        $row = $event->sender;
        if ($row->fieldId === $f->matrix->id && $row->getFieldValue($f->text->handle) === 'Fail this row') {
            throw new RuntimeException('Historical nested Matrix failure');
        }
    };
    Event::on(Entry::class, Entry::EVENT_BEFORE_SAVE, $fail);
    try {
        expect(fn() => Craft::$app->getElements()->saveElement($owner))->toThrow(RuntimeException::class, 'Historical nested Matrix failure');
    } finally {
        Event::off(Entry::class, Entry::EVENT_BEFORE_SAVE, $fail);
    }
    expect($f->rows($uid)[0]->id)->toBe($original->id)
        ->and($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Original')
        ->and($owner->getFieldValue($f->field->handle)->toArray()['content'][0]['attrs']['fieldSlots'][$f->placementUid])->toBe($payload);
});

it('saves Matrix through a layout cloned from a warmed global field manager', function() {
    $f = new MatrixSupportFixture();
    $global = Craft::$app->getFields()->getFieldById($f->matrix->id);
    $global->getIsTranslatable($f->owner);
    $layout = new \craft\models\FieldLayout(['type' => \verbb\vizy\elements\Block::class]);
    $placement = new \craft\fieldlayoutelements\CustomField($global, ['uid' => $f->placementUid]);
    $layout->setTabs([new \craft\models\FieldLayoutTab(['layout' => $layout, 'name' => 'Content', 'elements' => [$placement]])]);
    $f->blockType->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($f->blockType))->toBeTrue();
    $uid = StringHelper::UUID();
    $f->save([$f->block($uid, $f->payload(['Cloned field']))]);
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Cloned field');
});

it('ignores malformed legacy Matrix row values while preserving valid row data', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $f->save([$f->block($uid, ['blocks' => [
        'broken' => 'not a row',
        'new1' => ['type' => $f->rowType->handle, 'fields' => [$f->text->handle => 'Valid legacy row']],
    ]])]);
    expect($f->rows($uid))->toHaveCount(1)
        ->and($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Valid legacy row');
});

it('reports a rejected Matrix anchor save without masking it with a logging type error', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $reject = static function(\yii\base\ModelEvent $event) { $event->isValid = false; };
    Event::on(MatrixAnchor::class, MatrixAnchor::EVENT_BEFORE_SAVE, $reject);
    try {
        expect(fn() => $f->save([$f->block($uid, $f->payload(['Keep pending']))]))
            ->toThrow(RuntimeException::class, 'Unable to persist the Vizy Matrix anchor.');
    } finally {
        Event::off(MatrixAnchor::class, MatrixAnchor::EVENT_BEFORE_SAVE, $reject);
    }
    expect(Vizy::$plugin->getAnchors()->getAnchor($f->owner, $f->field, $uid))->toBeNull();
});
