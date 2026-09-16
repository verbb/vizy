<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\enums\CmsEdition;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\AssetFinalizationException;
use verbb\vizy\Vizy;

function assetUploadTestContext(string $label): array
{
    $assetField = AssetSpikeFixture::assetsField('{id}');
    CustomFieldBehavior::$fieldHandles[$assetField->handle] = true;
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Assets',
        'elements' => [[
            'type' => CustomField::class,
            'fieldUid' => $assetField->uid,
        ]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => "Asset {$label}",
        'handle' => 'asset' . $label . StringHelper::randomString(5),
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $field = VizyFixtureFactory::vizyField();
    // Shared fixture field layouts may cache an older Field instance; keep both
    // the service field and any layout-held copies aligned before validation.
    $field->blockTypePickerGroups = [['name' => 'Assets', 'blockTypeUids' => [$type->uid]]];
    expect(Craft::$app->getFields()->saveField($field, false))->toBeTrue();
    Craft::$app->getFields()->refreshFields();
    $field = Craft::$app->getFields()->getFieldByUid($field->uid);
    expect($field)->toBeInstanceOf(\verbb\vizy\fields\VizyField::class);

    $owner = VizyFixtureFactory::entry("Asset {$label} owner");
    syncVizyPickerGroupsOnOwner($owner, $field);

    return [
        'assetField' => $assetField,
        'type' => $type,
        'placementUid' => $type->getFieldLayout()->getCustomFieldElements()[0]->uid,
        'owner' => $owner,
        'field' => $field,
    ];
}

/** Ensure Entry layout-held Vizy field copies see the same allowed Block Types. */
function syncVizyPickerGroupsOnOwner(\craft\elements\Entry $owner, \verbb\vizy\fields\VizyField $field): void
{
    foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
        $layoutField = $placement->getField();
        if ($layoutField instanceof \verbb\vizy\fields\VizyField && $layoutField->uid === $field->uid) {
            $layoutField->blockTypePickerGroups = $field->blockTypePickerGroups;
        }
    }
}

function assetPlacementDocument(array $context, int $assetId, string $blockUid): VizyDocument
{
    return (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $blockUid,
                'blockTypeUid' => $context['type']->uid,
                'enabled' => true,
                'fieldSlots' => [$context['placementUid'] => [$assetId]],
            ],
        ]],
    ], $context['owner'], $context['field']);
}

it('finalizes the exact canonical Assets placement snapshot durably with public Craft APIs', function() {
    $assetField = AssetSpikeFixture::assetsField('{id}');
    CustomFieldBehavior::$fieldHandles[$assetField->handle] = true;
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Assets',
        'elements' => [[
            'type' => CustomField::class,
            'fieldUid' => $assetField->uid,
        ]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Asset Block',
        'handle' => 'assetBlock' . StringHelper::randomString(5),
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $placementUid = $type->getFieldLayout()->getCustomFieldElements()[0]->uid;

    $owner = VizyFixtureFactory::entry('Production Asset owner');
    $temp = AssetSpikeFixture::createTempAsset('production-finalize.txt', 'body');
    $vizyField = VizyFixtureFactory::vizyField();
    $vizyField->blockTypePickerGroups = [[
        'name' => 'Assets',
        'blockTypeUids' => [$type->uid],
    ]];
    expect(Craft::$app->getFields()->saveField($vizyField))->toBeTrue();
    syncVizyPickerGroupsOnOwner($owner, $vizyField);
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'asset-production-block',
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'fieldSlots' => [$placementUid => [$temp->id]],
            ],
        ]],
    ], $owner, $vizyField);

    $owner->setFieldValue($vizyField->handle, $document);
    $saved = Craft::$app->getElements()->saveElement($owner, false);
    expect($saved)->toBeTrue(json_encode($owner->getErrors()));
    $result = Vizy::$plugin->getAssetUploads()->resultForOwner($owner, $vizyField);
    $reloaded = Craft::$app->getAssets()->getAssetById($temp->id);
    $status = Vizy::$plugin->getAssetUploads()->statusForOwner($owner, $vizyField);

    expect($result['status'])->toBe('complete')
        ->and($result['batchId'])->toBeInt()
        ->and($result['attempts'])->toBe(1)
        ->and(AssetSpikeFixture::isTempAsset($reloaded))->toBeFalse()
        ->and($reloaded->getUrl())->toBeNull()
        ->and($reloaded->folderPath)->toContain((string)$owner->id)
        ->and($status[0]['status'])->toBe('complete');

    $retry = Vizy::$plugin->getAssetUploads()->retryBatch($result['batchId']);
    expect($retry['status'])->toBe('complete')
        ->and($retry['attempts'])->toBe(1);

    $repeat = Vizy::$plugin->getAssetUploads()->finalizeDocument(
        $owner->getFieldValue($vizyField->handle)
    );
    expect($repeat['batchId'])->toBe($result['batchId'])
        ->and(Vizy::$plugin->getAssetUploads()->statusForOwner($owner, $vizyField))->toHaveCount(1);
});

it('deduplicates repeated references to one private-volume Asset', function() {
    $context = assetUploadTestContext('DuplicateRefs');
    $temp = AssetSpikeFixture::createTempAsset('duplicate-refs.txt', 'duplicate');
    $array = assetPlacementDocument($context, (int)$temp->id, 'duplicate-refs-block')->toArray();
    $array['content'][0]['attrs']['fieldSlots'][$context['placementUid']] = [$temp->id, $temp->id];
    $document = (new DocumentParser())->parse($array, $context['owner'], $context['field']);
    $context['field']->blockTypePickerGroups = [[
        'name' => 'Assets',
        'blockTypeUids' => [$context['type']->uid],
    ]];
    syncVizyPickerGroupsOnOwner($context['owner'], $context['field']);
    $context['owner']->setFieldValue($context['field']->handle, $document);

    expect(Craft::$app->getElements()->saveElement($context['owner'], false))->toBeTrue();
    $result = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
    $batch = \verbb\vizy\records\AssetUploadBatch::findOne($result['batchId']);
    $work = json_decode($batch->workJson, true, 512, JSON_THROW_ON_ERROR);

    expect($result['status'])->toBe('complete')
        ->and($work)->toHaveCount(1)
        ->and($work[0]['sources'])->toHaveCount(1)
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeFalse();
});

it('fails conflicting destinations closed without dropping either reference', function() {
    $fieldA = AssetSpikeFixture::assetsField('conflict-a/{id}');
    $fieldB = AssetSpikeFixture::assetsField('conflict-b/{id}');
    foreach ([$fieldA, $fieldB] as $assetField) {
        CustomFieldBehavior::$fieldHandles[$assetField->handle] = true;
    }
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Conflicts',
        'elements' => array_map(static fn($assetField) => [
            'type' => CustomField::class,
            'fieldUid' => $assetField->uid,
        ], [$fieldA, $fieldB]),
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Asset conflict',
        'handle' => 'assetConflict' . StringHelper::randomString(5),
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $placements = $type->getFieldLayout()->getCustomFieldElements();
    $owner = VizyFixtureFactory::entry('Asset conflict owner');
    $vizyField = VizyFixtureFactory::vizyField();
    $vizyField->blockTypePickerGroups = [['name' => 'Assets', 'blockTypeUids' => [$type->uid]]];
    expect(Craft::$app->getFields()->saveField($vizyField, false))->toBeTrue();
    syncVizyPickerGroupsOnOwner($owner, $vizyField);
    $temp = AssetSpikeFixture::createTempAsset('conflict.txt', 'conflict');
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'conflicting-destination-block',
                'blockTypeUid' => $type->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $placements[0]->uid => [$temp->id],
                    $placements[1]->uid => [$temp->id],
                ],
            ],
        ]],
    ], $owner, $vizyField);
    $owner->setFieldValue($vizyField->handle, $document);

    try {
        Craft::$app->getElements()->saveElement($owner, false);
        $thrown = null;
    } catch (AssetFinalizationException $exception) {
        $thrown = $exception;
    }
    $result = Vizy::$plugin->getAssetUploads()->resultForOwner($owner, $vizyField);
    $persisted = Craft::$app->getElements()->getElementById($owner->id, $owner::class, $owner->siteId)
        ->getFieldValue($vizyField->handle)
        ->findBlock('conflicting-destination-block');

    expect($thrown)->toBeInstanceOf(AssetFinalizationException::class)
        ->and($result['status'])->toBe('failed')
        ->and(implode(' ', $result['errors']))->toContain('conflicting destination policies')
        ->and($persisted->rawFieldValue($placements[0]->uid))->toBe([$temp->id])
        ->and($persisted->rawFieldValue($placements[1]->uid))->toBe([$temp->id])
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeTrue();
});

it('discards registered Asset work when the outer transaction rolls back', function() {
    $context = assetUploadTestContext('Rollback');
    $temp = AssetSpikeFixture::createTempAsset('rollback.txt', 'rollback');
    $document = assetPlacementDocument($context, (int)$temp->id, 'rollback-block');
    $before = (int)\verbb\vizy\records\AssetUploadBatch::find()->count();

    $transaction = Craft::$app->getDb()->beginTransaction();
    Vizy::$plugin->getAssetUploads()->defer($context['owner'], $context['field'], $document);
    $transaction->rollBack();

    $reloaded = Craft::$app->getAssets()->getAssetById($temp->id);
    expect(AssetSpikeFixture::isTempAsset($reloaded))->toBeTrue()
        ->and(\verbb\vizy\records\AssetUploadBatch::find()->count())->toBe($before)
        ->and(Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']))->toBeNull();
});

it('moves files only after the real outer owner transaction commits', function() {
    $context = assetUploadTestContext('OuterCommit');
    $temp = AssetSpikeFixture::createTempAsset('outer-commit.txt', 'commit');
    $document = assetPlacementDocument($context, (int)$temp->id, 'outer-commit-block');
    $context['field']->blockTypePickerGroups = [[
        'name' => 'Assets',
        'blockTypeUids' => [$context['type']->uid],
    ]];
    syncVizyPickerGroupsOnOwner($context['owner'], $context['field']);
    $context['owner']->setFieldValue($context['field']->handle, $document);

    $transaction = Craft::$app->getDb()->beginTransaction();
    expect(Craft::$app->getElements()->saveElement($context['owner'], false))->toBeTrue();
    $pending = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
    expect(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeTrue()
        ->and($pending['status'])->toBe('pending')
        ->and($pending['batchId'])->toBeNull()
        ->and($pending['deferredReason'])->toBe('awaitingOwnerTransactionCommit');
    $transaction->commit();

    $result = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
    expect($result['status'])->toBe('complete')
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeFalse();
});

it('performs no move or batch write when real owner validation fails', function() {
    $context = assetUploadTestContext('ValidationFailure');
    $allowed = $context['field']->blockTypePickerGroups;
    // Force a root Block Type policy failure: empty allowed list on the layout
    // field copy used during Entry validation.
    $context['field']->blockTypePickerGroups = [];
    syncVizyPickerGroupsOnOwner($context['owner'], $context['field']);
    $temp = AssetSpikeFixture::createTempAsset('validation-failure.txt', 'invalid');
    $document = assetPlacementDocument($context, (int)$temp->id, 'invalid-block');
    $context['owner']->setFieldValue($context['field']->handle, $document);
    $before = (int)\verbb\vizy\records\AssetUploadBatch::find()->count();

    expect(Craft::$app->getElements()->saveElement($context['owner'], true, false))->toBeFalse()
        ->and($context['owner']->hasErrors($context['field']->handle))->toBeTrue()
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeTrue()
        ->and(\verbb\vizy\records\AssetUploadBatch::find()->count())->toBe($before);

    // Restore shared field/layout copies so later suite tests are not poisoned.
    $context['field']->blockTypePickerGroups = $allowed;
    syncVizyPickerGroupsOnOwner($context['owner'], $context['field']);
})->group('slow');

it('reports draft work as pending and revisions as explicitly non-finalizable', function() {
    $context = assetUploadTestContext('Derivatives');
    $temp = AssetSpikeFixture::createTempAsset('derivative.txt', 'derivative');

    $draft = clone $context['owner'];
    $draft->draftId = 987654;
    $draftContext = [...$context, 'owner' => $draft];
    $draftResult = Vizy::$plugin->getAssetUploads()->finalizeDocument(
        assetPlacementDocument($draftContext, (int)$temp->id, 'draft-block')
    );

    $revision = clone $context['owner'];
    $revision->revisionId = 987655;
    $revisionContext = [...$context, 'owner' => $revision];
    $revisionResult = Vizy::$plugin->getAssetUploads()->finalizeDocument(
        assetPlacementDocument($revisionContext, (int)$temp->id, 'revision-block')
    );

    expect($draftResult['status'])->toBe('pending')
        ->and($draftResult['batchId'])->toBeInt()
        ->and($draftResult['deferredReason'])->toBe('draftDeferredUntilCanonicalPublish')
        ->and($revisionResult['status'])->toBe('nonFinalizable')
        ->and($revisionResult['deferredReason'])->toBe('revisionAssetsNeverFinalize')
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeTrue();
});

it('fails semantic Image finalization closed and ignores malicious JSON destinations', function() {
    $context = assetUploadTestContext('Semantic');
    $temp = AssetSpikeFixture::createTempAsset('semantic.txt', 'semantic');
    $maliciousVolumeUid = StringHelper::UUID();
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'image',
            'attrs' => [
                'assetUid' => $temp->uid,
                'destinationPolicy' => [
                    'volumeUid' => $maliciousVolumeUid,
                    'subpath' => '../../attacker-controlled',
                ],
            ],
        ]],
    ], $context['owner'], $context['field']);
    $context['owner']->setFieldValue($context['field']->handle, $document);

    try {
        Craft::$app->getElements()->saveElement($context['owner'], false);
        $thrown = null;
    } catch (AssetFinalizationException $exception) {
        $thrown = $exception;
    }

    $result = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
    expect($thrown)->toBeInstanceOf(AssetFinalizationException::class)
        ->and($result['status'])->toBe('failed')
        ->and(implode(' ', $result['errors']))->toContain('semanticImagePolicyPending')
        ->and(implode(' ', $result['errors']))->not->toContain($maliciousVolumeUid)
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeTrue();
});

it('rejects stale retries when the trusted destination policy changes', function() {
    $context = assetUploadTestContext('Stale');
    $temp = AssetSpikeFixture::createTempAsset('stale.txt', 'stale');
    $globalField = Craft::$app->getFields()->getFieldByUid($context['assetField']->uid);
    $layoutField = $context['type']->getFieldLayout()->getCustomFieldElements()[0]->getField();
    $validSource = $globalField->defaultUploadLocationSource;
    $globalField->defaultUploadLocationSource = 'volume:' . StringHelper::UUID();
    $layoutField->defaultUploadLocationSource = $globalField->defaultUploadLocationSource;
    expect(Craft::$app->getFields()->saveField($globalField, false))->toBeTrue();

    $document = assetPlacementDocument($context, (int)$temp->id, 'stale-block');
    $context['owner']->setFieldValue($context['field']->handle, $document);
    try {
        Craft::$app->getElements()->saveElement($context['owner'], false);
    } catch (AssetFinalizationException) {
    }
    $failed = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
    expect($failed['status'])->toBe('failed');

    $globalField->defaultUploadLocationSource = $validSource;
    $layoutField->defaultUploadLocationSource = $validSource;
    expect(Craft::$app->getFields()->saveField($globalField, false))->toBeTrue();
    $retry = Vizy::$plugin->getAssetUploads()->retryBatch($failed['batchId']);

    expect($retry['status'])->toBe('failed')
        ->and(implode(' ', $retry['errors']))->toContain('staleSnapshot')
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeTrue();
});

it('records a mid-batch move failure and resumes without duplicate or lost references', function() {
    $context = assetUploadTestContext('MidBatch');
    $first = AssetSpikeFixture::createTempAsset('mid-batch-first.txt', 'first');
    $second = AssetSpikeFixture::createTempAsset('mid-batch-second.txt', 'second');
    $array = assetPlacementDocument($context, (int)$first->id, 'mid-batch-block')->toArray();
    $array['content'][0]['attrs']['fieldSlots'][$context['placementUid']] = [$first->id, $second->id];
    $document = (new DocumentParser())->parse($array, $context['owner'], $context['field']);
    $context['field']->blockTypePickerGroups = [[
        'name' => 'Assets',
        'blockTypeUids' => [$context['type']->uid],
    ]];
    syncVizyPickerGroupsOnOwner($context['owner'], $context['field']);
    $context['owner']->setFieldValue($context['field']->handle, $document);

    $moves = 0;
    Vizy::$plugin->getAssetUploads()->setMoveAssetHandlerForTesting(
        function($asset, $folder) use (&$moves): bool {
            $moves++;
            if ($moves === 2) {
                throw new RuntimeException('injected second Asset move failure');
            }
            return Craft::$app->getAssets()->moveAsset($asset, $folder);
        },
    );
    try {
        Craft::$app->getElements()->saveElement($context['owner'], false);
    } catch (AssetFinalizationException) {
    } finally {
        Vizy::$plugin->getAssetUploads()->setMoveAssetHandlerForTesting(null);
    }
    $failed = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
    $persisted = Craft::$app->getElements()
        ->getElementById($context['owner']->id, $context['owner']::class, $context['owner']->siteId)
        ->getFieldValue($context['field']->handle)
        ->findBlock('mid-batch-block');

    expect($failed['status'])->toBe('failed')
        ->and($failed['attempts'])->toBe(1)
        ->and(implode(' ', $failed['errors']))->toContain('injected second Asset move failure')
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($first->id)))->toBeFalse()
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($second->id)))->toBeTrue()
        ->and($persisted->rawFieldValue($context['placementUid']))->toBe([$first->id, $second->id]);

    $complete = Vizy::$plugin->getAssetUploads()->retryBatch($failed['batchId']);
    expect($complete['status'])->toBe('complete')
        ->and($complete['attempts'])->toBe(2)
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($first->id)))->toBeFalse()
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($second->id)))->toBeFalse();
});

it('converges equivalent registrations on one durable batch', function() {
    $context = assetUploadTestContext('Concurrent');
    $temp = AssetSpikeFixture::createTempAsset('equivalent-registration.txt', 'same');
    $document = assetPlacementDocument($context, (int)$temp->id, 'equivalent-registration-block');
    $before = (int)\verbb\vizy\records\AssetUploadBatch::find()->count();
    $context['field']->blockTypePickerGroups = [[
        'name' => 'Assets',
        'blockTypeUids' => [$context['type']->uid],
    ]];
    syncVizyPickerGroupsOnOwner($context['owner'], $context['field']);
    $context['owner']->setFieldValue($context['field']->handle, $document);

    $transaction = Craft::$app->getDb()->beginTransaction();
    expect(Craft::$app->getElements()->saveElement($context['owner'], false))->toBeTrue();
    Vizy::$plugin->getAssetUploads()->defer($context['owner'], $context['field'], $document);
    $transaction->commit();

    $result = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
    expect($result['status'])->toBe('complete')
        ->and(\verbb\vizy\records\AssetUploadBatch::find()->count())->toBe($before + 1)
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeFalse();
});

it('finalizes after a new owner gains identity and when a named draft is published', function() {
    $context = assetUploadTestContext('Publish');
    $section = VizyFixtureFactory::section();
    $entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
    $site = Craft::$app->getSites()->getPrimarySite();
    $newOwner = new \craft\elements\Entry([
        'sectionId' => $section->id,
        'typeId' => $entryType->id,
        'siteId' => $site->id,
        'title' => 'New Asset owner',
        'slug' => 'new-asset-owner-' . StringHelper::randomString(6),
        'enabled' => true,
    ]);
    syncVizyPickerGroupsOnOwner($newOwner, $context['field']);
    $newTemp = AssetSpikeFixture::createTempAsset('new-owner.txt', 'new');
    $newContext = [...$context, 'owner' => $newOwner];
    $newOwner->setFieldValue(
        $context['field']->handle,
        assetPlacementDocument($newContext, (int)$newTemp->id, 'new-owner-block'),
    );
    expect(Craft::$app->getElements()->saveElement($newOwner, false))->toBeTrue()
        ->and($newOwner->id)->toBeGreaterThan(0)
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($newTemp->id)))->toBeFalse();
    $newOwner = Craft::$app->getElements()->getElementById($newOwner->id, $newOwner::class, $newOwner->siteId);

    $draftBase = VizyFixtureFactory::entry('Asset draft base');
    syncVizyPickerGroupsOnOwner($draftBase, $context['field']);
    $draftTemp = AssetSpikeFixture::createTempAsset('named-draft.txt', 'draft');
    $draft = Craft::$app->getDrafts()->createDraft(
        $draftBase,
        AssetSpikeFixture::ensureAdminUser()->id,
        'Asset named draft',
    );
    syncVizyPickerGroupsOnOwner($draft, $context['field']);
    $draftContext = [...$context, 'owner' => $draft];
    $draft->setFieldValue(
        $context['field']->handle,
        assetPlacementDocument($draftContext, (int)$draftTemp->id, 'draft-publish-block'),
    );
    expect(Craft::$app->getElements()->saveElement($draft, false, false))->toBeTrue();
    $draftResult = Vizy::$plugin->getAssetUploads()->resultForOwner($draft, $context['field']);
    expect($draftResult['status'])->toBe('pending')
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($draftTemp->id)))->toBeTrue();

    $published = Craft::$app->getDrafts()->applyDraft($draft);
    $publishedResult = Vizy::$plugin->getAssetUploads()->resultForOwner($published, $context['field']);
    expect($publishedResult['status'])->toBe('complete')
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($draftTemp->id)))->toBeFalse();
});

it('fails distinct multisite destination contexts before moving a shared Asset', function() {
    $context = assetUploadTestContext('MultisiteConflict');
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $assetField = Craft::$app->getFields()->getFieldByUid($context['assetField']->uid);
    $assetField->defaultUploadLocationSubpath = '{site.handle}/{id}';
    expect(Craft::$app->getFields()->saveField($assetField, false))->toBeTrue();
    $context['type']->getFieldLayout()->getCustomFieldElements()[0]->getField()
        ->defaultUploadLocationSubpath = '{site.handle}/{id}';

    $ownerA = $context['owner'];
    $ownerA->siteId = $siteA->id;
    $ownerB = clone $ownerA;
    $ownerB->siteId = $siteB->id;
    $temp = AssetSpikeFixture::createTempAsset('multisite-conflict.txt', 'conflict');
    $documentA = assetPlacementDocument([...$context, 'owner' => $ownerA], (int)$temp->id, 'multisite-conflict-block');
    $documentB = assetPlacementDocument([...$context, 'owner' => $ownerB], (int)$temp->id, 'multisite-conflict-block');

    $transaction = Craft::$app->getDb()->beginTransaction();
    Vizy::$plugin->getAssetUploads()->defer($ownerA, $context['field'], $documentA);
    Vizy::$plugin->getAssetUploads()->defer($ownerB, $context['field'], $documentB);
    try {
        $transaction->commit();
    } catch (AssetFinalizationException) {
    }

    $resultA = Vizy::$plugin->getAssetUploads()->resultForOwner($ownerA, $context['field']);
    $resultB = Vizy::$plugin->getAssetUploads()->resultForOwner($ownerB, $context['field']);
    expect($resultA['status'])->toBe('failed')
        ->and($resultB['status'])->toBe('failed')
        ->and(implode(' ', $resultA['errors']))->toContain('conflicting multisite destination contexts')
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeTrue();
});

it('enforces real actor volume permission before resolving or moving the trusted path', function() {
    $context = assetUploadTestContext('RestrictedActor');
    $temp = AssetSpikeFixture::createTempAsset('restricted-actor.txt', 'restricted');
    $admin = AssetSpikeFixture::ensureAdminUser();
    $actor = assetUploadTestActor(AssetSpikeFixture::volume(), false);
    // Isolate destination permission: this user is allowed to access the source upload.
    $temp->uploaderId = $actor->id;
    expect(Craft::$app->getElements()->saveElement($temp))->toBeTrue();
    Craft::$app->getUser()->setIdentity($actor);

    $context['field']->blockTypePickerGroups = [[
        'name' => 'Assets',
        'blockTypeUids' => [$context['type']->uid],
    ]];
    syncVizyPickerGroupsOnOwner($context['owner'], $context['field']);
    $context['owner']->setFieldValue(
        $context['field']->handle,
        assetPlacementDocument($context, (int)$temp->id, 'restricted-actor-block'),
    );
    try {
        Craft::$app->getElements()->saveElement($context['owner'], false);
    } catch (AssetFinalizationException) {
    } finally {
        Craft::$app->getUser()->setIdentity($admin);
    }

    $result = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
    expect($actor->can('saveAssets:' . AssetSpikeFixture::volume()->uid))->toBeFalse()
        ->and($result['status'])->toBe('failed')
        ->and(implode(' ', $result['errors']))->toContain('cannot save Assets')
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($temp->id)))->toBeTrue();
})->group('slow');

it('does not require upload permission to retain an existing Asset in an allowed location', function(bool $restricted) {
    $context = assetUploadTestContext('ReadOnlyReference');
    $asset = AssetSpikeFixture::createTempAsset('existing-reference.txt', 'existing reference');
    $admin = AssetSpikeFixture::ensureAdminUser();
    $volume = AssetSpikeFixture::volume();
    $folder = Craft::$app->getAssets()->getRootFolderByVolumeId($volume->id);
    if ($restricted) {
        $field = $context['type']->getFieldLayout()->getCustomFieldElements()[0]->getField();
        $field->restrictLocation = true;
        $field->restrictedLocationSource = 'volume:' . $volume->uid;
        $field->restrictedLocationSubpath = 'retained/{id}';
        expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
        $folder = Craft::$app->getAssets()->getFolderById($field->resolveDynamicPathToFolderId($context['owner']));
    }
    expect(Craft::$app->getAssets()->moveAsset($asset, $folder))->toBeTrue();
    $actor = assetUploadTestActor($volume, false);
    Craft::$app->getUser()->setIdentity($actor);

    try {
        expect(Craft::$app->getElements()->canView($asset, $actor))->toBeTrue()
            ->and($actor->can("saveAssets:$volume->uid"))->toBeFalse();
        $context['owner']->setFieldValue($context['field']->handle, assetPlacementDocument($context, (int)$asset->id, 'existing-reference'));
        expect(Craft::$app->getElements()->saveElement($context['owner'], false))->toBeTrue();
        $result = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
        expect($result['status'])->toBe('complete')
            ->and(Craft::$app->getAssets()->getAssetById($asset->id)->folderId)->toBe($folder->id);
    } finally {
        Craft::$app->getUser()->setIdentity($admin);
    }
})->with(['unrestricted' => [false], 'restricted' => [true]]);

it('checks temporary Asset ownership as well as destination upload permission', function(bool $ownUpload) {
    $context = assetUploadTestContext('PeerTemporary');
    $asset = AssetSpikeFixture::createTempAsset('peer-temporary.txt', 'private upload');
    $admin = AssetSpikeFixture::ensureAdminUser();
    $asset->uploaderId = $admin->id;
    expect(Craft::$app->getElements()->saveElement($asset))->toBeTrue();
    $originalFolderId = $asset->folderId;
    $volume = AssetSpikeFixture::volume();
    $actor = assetUploadTestActor($volume, true);
    if ($ownUpload) {
        $asset->uploaderId = $actor->id;
        expect(Craft::$app->getElements()->saveElement($asset))->toBeTrue();
    }
    Craft::$app->getUser()->setIdentity($actor);

    try {
        expect(Craft::$app->getElements()->canView($asset, $actor))->toBe($ownUpload)
            ->and($actor->can("saveAssets:$volume->uid"))->toBeTrue();
        $context['owner']->setFieldValue($context['field']->handle, assetPlacementDocument($context, (int)$asset->id, 'peer-temporary'));
        try {
            Craft::$app->getElements()->saveElement($context['owner'], false);
        } catch (AssetFinalizationException) {
        }
        $result = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
        $reloaded = Craft::$app->getAssets()->getAssetById($asset->id);
        expect($result['status'])->toBe($ownUpload ? 'complete' : 'failed')
            ->and(AssetSpikeFixture::isTempAsset($reloaded))->toBe(!$ownUpload);
        if (!$ownUpload) {
            expect($reloaded->folderId)->toBe($originalFolderId);
        } else {
            expect($reloaded->getFs()->read($reloaded->getPath()))->toBe('private upload');
        }
    } finally {
        Craft::$app->getUser()->setIdentity($admin);
    }
})->with(['own upload' => [true], 'another users upload' => [false]]);

it('requires source Asset permission before enforcing a restricted destination', function() {
    $context = assetUploadTestContext('PeerRestricted');
    $asset = AssetSpikeFixture::createTempAsset('peer-restricted.txt', 'peer content');
    $admin = AssetSpikeFixture::ensureAdminUser();
    $volume = AssetSpikeFixture::volume();
    $folder = Craft::$app->getAssets()->getRootFolderByVolumeId($volume->id);
    $asset->uploaderId = $admin->id;
    expect(Craft::$app->getAssets()->moveAsset($asset, $folder))->toBeTrue();
    $field = $context['type']->getFieldLayout()->getCustomFieldElements()[0]->getField();
    $field->restrictLocation = true;
    $field->restrictedLocationSource = 'volume:' . $volume->uid;
    $field->restrictedLocationSubpath = 'restricted/{id}';
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $actor = assetUploadTestActor($volume, true);
    Craft::$app->getUser()->setIdentity($actor);

    try {
        expect(Craft::$app->getElements()->canView($asset, $actor))->toBeTrue()
            ->and(Craft::$app->getElements()->canSave($asset, $actor))->toBeFalse();
        $context['owner']->setFieldValue($context['field']->handle, assetPlacementDocument($context, (int)$asset->id, 'peer-restricted'));
        try {
            Craft::$app->getElements()->saveElement($context['owner'], false);
        } catch (AssetFinalizationException) {
        }
        $result = Vizy::$plugin->getAssetUploads()->resultForOwner($context['owner'], $context['field']);
        expect($result['status'])->toBe('failed')
            ->and(implode(' ', $result['errors']))->toContain('source volume')
            ->and(Craft::$app->getAssets()->getAssetById($asset->id)->folderId)->toBe($folder->id);

        // A permission change permits retry of the same snapshot, preserving the file.
        Craft::$app->getUser()->setIdentity($admin);
        $retry = Vizy::$plugin->getAssetUploads()->retryBatch($result['batchId']);
        $reloaded = Craft::$app->getAssets()->getAssetById($asset->id);
        expect($retry['status'])->toBe('complete')
            ->and($reloaded->folderPath)->toBe('restricted/' . $context['owner']->id . '/')
            ->and($reloaded->getFs()->read($reloaded->getPath()))->toBe('peer content');
    } finally {
        Craft::$app->getUser()->setIdentity($admin);
    }
});

function assetUploadTestActor(\craft\models\Volume $volume, bool $canUpload): \craft\elements\User
{
    Craft::$app->setEdition(CmsEdition::Pro);
    $suffix = StringHelper::randomString(8);
    $actor = new \craft\elements\User([
        'username' => 'assetAudit' . $suffix,
        'email' => 'assetAudit' . $suffix . '@example.test',
        'admin' => false,
        'active' => true,
        'pending' => false,
    ]);
    $actor->newPassword = 'Password1!';
    expect(Craft::$app->getElements()->saveElement($actor))->toBeTrue();
    $permissions = ['accessCp', "viewAssets:$volume->uid", "viewPeerAssets:$volume->uid"];
    foreach (Craft::$app->getSites()->getAllSites() as $site) {
        $permissions[] = "editSite:$site->uid";
    }
    if ($canUpload) {
        $permissions[] = "saveAssets:$volume->uid";
    }
    Craft::$app->getUserPermissions()->saveUserPermissions($actor->id, $permissions);
    return $actor;
}
