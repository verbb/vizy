<?php

declare(strict_types=1);

use craft\db\Query;
use craft\db\Table;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\fieldlayoutelements\CustomField;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\WebControllerHarness;
use verbb\vizy\db\Table as VizyTable;
use verbb\vizy\Vizy;

it('opens a new Matrix block without creating anchors or nested entries', function() {
    $f = new MatrixSupportFixture();
    $node = $f->block(StringHelper::UUID(), $f->payload(['Pending content']));
    $before = (new Query())->from(Table::ELEMENTS)->count();
    WebControllerHarness::beginWebRequest();
    try {
        $context = Vizy::$plugin->getEditorContexts()->issue($f->owner, $f->field);
        $result = Vizy::$plugin->getFieldLayoutForms()->renderInitial($context, $f->owner, $f->field, $node, ['kind' => 'root']);
        expect($result['ok'])->toBeTrue(json_encode($result));
        expect($result['data']['html'])->toContain('Pending content')->toContain('matrixblock');
    } finally {
        WebControllerHarness::endWebRequest();
    }
    expect((new Query())->from(Table::ELEMENTS)->count())->toBe($before);
});

it('retains pending Matrix payloads in a pure serialization', function() {
    $f = new MatrixSupportFixture();
    $payload = $f->payload(['Unsaved text']);
    $node = $f->block(StringHelper::UUID(), $payload);
    $document = $f->field->normalizeValue(['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$node]], $f->owner);
    $before = (new Query())->from(Table::ELEMENTS)->count();
    $serialized = json_decode($f->field->serializeValue($document, $f->owner), true);
    expect($serialized['content'][0]['attrs']['fieldSlots'][$f->placementUid])->toBe($payload);
    expect((new Query())->from(Table::ELEMENTS)->count())->toBe($before);
});

it('refuses to replace an unresolved stored anchor and retains submitted content', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Last good content']))]);
    $document = $owner->getFieldValue($f->field->handle)->toArray();
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->field, $uid);
    Craft::$app->getDb()->createCommand()->delete(VizyTable::MATRIX_ANCHORS, ['id' => $anchor->id])->execute();
    $before = (new Query())->from(Table::ELEMENTS_SITES)->where(['elementId' => $owner->id])->all();
    $payload = $f->payload(['Pending edit']);
    $document['content'][0]['attrs']['fieldSlots'][$f->placementUid] = $payload;
    $owner->setFieldValue($f->field->handle, $document);
    expect(fn() => Craft::$app->getElements()->saveElement($owner, false))->toThrow(RuntimeException::class, 'could not be resolved');
    expect((new Query())->from(Table::ELEMENTS_SITES)->where(['elementId' => $owner->id])->all())->toBe($before);
    expect($owner->getFieldValue($f->field->handle)->toArray()['content'][0]['attrs']['fieldSlots'][$f->placementUid])->toBe($payload);
    expect((new Query())->from(VizyTable::MATRIX_ANCHORS)->where(['parentOwnerId' => $owner->id])->exists())->toBeFalse();
});

it('restores actual nested content and original references from a durable journal', function() {
    $f = new MatrixSupportFixture(true);
    $uid = StringHelper::UUID();
    $payload = $f->payload(['First', 'Second']);
    $keys = array_keys($payload['entries']);
    $payload['entries'][$keys[1]]['enabled'] = false;
    $payload['entries'][$keys[0]]['fields'][$f->nestedMatrix->handle] = [
        'newInner' => ['type' => $f->nestedMatrix->getEntryTypes()[0]->handle, 'fields' => [$f->text->handle => 'Nested original']],
    ];
    $owner = $f->save([$f->block($uid, $payload)]);
    $recovery = Vizy::$plugin->getContentRecovery();
    $original = $recovery->snapshot($owner, $f->field);
    $id = $recovery->capture($owner, $f->field, 'test-original');
    $f->save([$f->block($uid, $f->payload(['Replacement']))]);
    $recovery->restore($id);
    $restored = $recovery->snapshot($f->reload(), $f->field);
    expect($restored['sites'])->toBe($original['sites']);
    expect($restored['references'])->toBe($original['references']);
    foreach ($original['tables'] as $table => $rows) {
        foreach ($rows as $row) {
            expect($restored['tables'][$table])->toContain($row);
        }
    }
    $rows = $f->rows($uid);
    expect(array_map(fn($row) => $row->getFieldValue($f->text->handle), $rows))->toBe(['First', 'Second']);
    expect($rows[1]->enabled)->toBeFalse();
    expect($rows[0]->getFieldValue($f->nestedMatrix->handle)->one()->getFieldValue($f->text->handle))->toBe('Nested original');
});

it('restores a pre-document-key Matrix recovery record after the schema upgrade', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Legacy recovery']))]);
    $recovery = Vizy::$plugin->getContentRecovery();
    $id = $recovery->capture($owner, $f->field, 'pre-document-key');
    $record = (new Query())->from(VizyTable::CONTENT_RECOVERY)->where(['id' => $id])->one();
    $snapshot = Json::decode($record['snapshotJson']);
    foreach ($snapshot['tables'][VizyTable::MATRIX_ANCHORS] as &$anchor) {
        unset($anchor['documentKey']);
    }
    unset($anchor);
    Craft::$app->getDb()->createCommand()->update(VizyTable::CONTENT_RECOVERY, [
        'snapshotHash' => $recovery->hash($snapshot),
        'snapshotJson' => Json::encode($snapshot),
    ], ['id' => $id])->execute();

    $f->save([$f->block($uid, $f->payload(['Replacement']))]);
    $recovery->restore($id);

    expect(array_map(
        fn($row) => $row->getFieldValue($f->text->handle),
        $f->rows($uid, $f->reload()),
    ))->toBe(['Legacy recovery']);
});

it('keeps automatic recovery history bounded without pruning operation checkpoints', function() {
    $ownerId = random_int(1000000, 2000000000);
    $fieldUid = StringHelper::UUID();
    $db = Craft::$app->getDb();
    try {
        foreach (range(1, 12) as $index) {
            $db->createCommand()->insert(VizyTable::CONTENT_RECOVERY, [
                'ownerId' => $ownerId,
                'fieldUid' => $fieldUid,
                'snapshotHash' => hash('sha256', "automatic-{$index}"),
                'snapshotJson' => '{}',
                'reason' => 'owner-save',
                'dateCreated' => gmdate('Y-m-d H:i:s'),
            ])->execute();
        }
        foreach (['before-schema-upgrade', 'owner-deletion'] as $reason) {
            $db->createCommand()->insert(VizyTable::CONTENT_RECOVERY, [
                'ownerId' => $ownerId,
                'fieldUid' => $fieldUid,
                'snapshotHash' => hash('sha256', $reason),
                'snapshotJson' => '{}',
                'reason' => $reason,
                'dateCreated' => gmdate('Y-m-d H:i:s'),
            ])->execute();
        }

        expect(Vizy::$plugin->getContentRecovery()->pruneAutomatic(10, $ownerId))->toBe(2)
            ->and((int)(new Query())->from(VizyTable::CONTENT_RECOVERY)->where([
                'ownerId' => $ownerId,
                'reason' => 'owner-save',
            ])->count())->toBe(10)
            ->and((int)(new Query())->from(VizyTable::CONTENT_RECOVERY)->where([
                'ownerId' => $ownerId,
            ])->andWhere(['not', ['reason' => 'owner-save']])->count())->toBe(2);
    } finally {
        $db->createCommand()->delete(VizyTable::CONTENT_RECOVERY, ['ownerId' => $ownerId])->execute();
    }
});

it('keeps ordinary new Matrix anchors inside automatic recovery retention', function() {
    $f = new MatrixSupportFixture();
    $owner = $f->owner;
    foreach (range(1, 12) as $index) {
        $owner = $f->save([
            $f->block(StringHelper::UUID(), $f->payload(["Automatic {$index}"])),
        ], $owner);
    }

    $reasons = (new Query())->select('reason')->from(VizyTable::CONTENT_RECOVERY)->where([
        'ownerId' => $owner->id,
        'fieldUid' => $f->field->uid,
    ])->column();
    expect($reasons)->not->toContain('before-anchor-repair')
        ->and(array_values(array_filter($reasons, static fn(string $reason): bool => $reason === 'owner-save')))->toHaveCount(10);
});

it('lists and retains automatic recovery independently for repeated field placements', function() {
    $ownerId = random_int(1000000, 2000000000);
    $fieldUid = StringHelper::UUID();
    $placements = [StringHelper::UUID(), StringHelper::UUID()];
    $db = Craft::$app->getDb();
    try {
        foreach ($placements as $placementUid) {
            foreach (range(1, 2) as $index) {
                $snapshot = ['placementUid' => $placementUid, 'index' => $index];
                $db->createCommand()->insert(VizyTable::CONTENT_RECOVERY, [
                    'ownerId' => $ownerId,
                    'fieldUid' => $fieldUid,
                    'placementUid' => $placementUid,
                    'snapshotHash' => hash('sha256', json_encode($snapshot, JSON_THROW_ON_ERROR)),
                    'snapshotJson' => json_encode($snapshot, JSON_THROW_ON_ERROR),
                    'reason' => 'owner-save',
                    'dateCreated' => gmdate('Y-m-d H:i:s'),
                ])->execute();
            }
        }

        $records = Vizy::$plugin->getContentRecovery()->records($ownerId);
        expect(array_values(array_unique(array_column($records, 'placementUid'))))->toHaveCount(2)
            ->and(Vizy::$plugin->getContentRecovery()->pruneAutomatic(1, $ownerId))->toBe(2);
        foreach ($placements as $placementUid) {
            expect((int)(new Query())->from(VizyTable::CONTENT_RECOVERY)->where([
                'ownerId' => $ownerId,
                'fieldUid' => $fieldUid,
                'placementUid' => $placementUid,
                'reason' => 'owner-save',
            ])->count())->toBe(1);
        }
    } finally {
        $db->createCommand()->delete(VizyTable::CONTENT_RECOVERY, ['ownerId' => $ownerId])->execute();
    }
});

it('promotes a matching automatic snapshot to a protected operation checkpoint', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Checkpoint content']))]);
    $recovery = Vizy::$plugin->getContentRecovery();
    $snapshot = $recovery->snapshot($owner, $f->field);
    $hash = $recovery->hash($snapshot);
    Craft::$app->getDb()->createCommand()->upsert(VizyTable::CONTENT_RECOVERY, [
        'ownerId' => $owner->id,
        'fieldUid' => $f->field->uid,
        'snapshotHash' => $hash,
        'snapshotJson' => json_encode($snapshot, JSON_THROW_ON_ERROR),
        'reason' => 'owner-save',
        'dateCreated' => gmdate('Y-m-d H:i:s'),
    ], ['reason' => 'owner-save'])->execute();

    $id = $recovery->capture($owner, $f->field, 'before-schema-upgrade');
    $record = (new Query())->from(VizyTable::CONTENT_RECOVERY)->where(['id' => $id])->one();
    expect($record['reason'])->toBe('before-schema-upgrade');
});

it('does not capture another Vizy field anchor when block UIDs collide on one owner', function() {
    $f = new MatrixSupportFixture();
    $secondField = new \verbb\vizy\fields\VizyField([
        'name' => 'Second Matrix article',
        'handle' => 'secondMatrixArticle' . StringHelper::randomString(8),
        'editorConfig' => 'standard',
        'rootContentType' => \verbb\vizy\fields\VizyField::ROOT_CONTENT_BLOCKS,
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => [$f->blockType->uid],
        ]],
    ]);
    expect(Craft::$app->getFields()->saveField($secondField))->toBeTrue();
    $entryType = $f->owner->getType();
    $layout = $entryType->getFieldLayout();
    $tabs = $layout->getTabs();
    $tabs[0]->setElements([...$tabs[0]->getElements(), new CustomField($secondField)]);
    $layout->setTabs($tabs);
    $entryType->setFieldLayout($layout);
    expect(Craft::$app->getEntries()->saveEntryType($entryType))->toBeTrue();
    Craft::$app->getFields()->refreshFields();

    $owner = $f->reload();
    $blockUid = StringHelper::UUID();
    $owner->setFieldValue($f->field->handle, [
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
        'content' => [$f->block($blockUid, $f->payload(['First field']))],
    ]);
    $owner->setFieldValue($secondField->handle, [
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
        'content' => [$f->block($blockUid, $f->payload(['Second field']))],
    ]);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeTrue();
    $owner = $f->reload($owner);

    $matchingAnchors = (new Query())->from(VizyTable::MATRIX_ANCHORS)->where([
        'parentOwnerId' => $owner->id,
        'blockInstanceId' => $blockUid,
    ])->all();
    expect($matchingAnchors)->toHaveCount(2);
    $snapshot = Vizy::$plugin->getContentRecovery()->snapshot($owner, $f->field);
    expect($snapshot['tables'][VizyTable::MATRIX_ANCHORS])->toHaveCount(1)
        ->and((int)$snapshot['tables'][VizyTable::MATRIX_ANCHORS][0]['vizyFieldId'])->toBe($f->field->id);
});

it('captures a legacy Hosted Vizy Matrix graph without an embedded anchor UID', function() {
    $f = new MatrixSupportFixture();
    $nestedUid = StringHelper::UUID();
    $host = $f->hostedBlock(StringHelper::UUID(), [
        $f->block($nestedUid, $f->payload(['Hosted legacy recovery'])),
    ]);
    $owner = $f->save([$host]);
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->hostedField, $nestedUid);
    expect($anchor)->not->toBeNull();
    $rowIds = array_map('intval', array_column((new Query())->from(Table::ELEMENTS_OWNERS)
        ->where(['ownerId' => $anchor->id])->all(), 'elementId'));

    $placement = \verbb\vizy\helpers\FieldPlacements::uid($owner, $f->field);
    $stored = (new Query())->select('content')->from(Table::ELEMENTS_SITES)
        ->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])->scalar();
    $content = is_string($stored) ? json_decode($stored, true, 512, JSON_THROW_ON_ERROR) : $stored;
    $document = is_string($content[$placement])
        ? json_decode($content[$placement], true, 512, JSON_THROW_ON_ERROR)
        : $content[$placement];
    $hostedPlacement = $f->hostType->getFieldLayout()->getCustomFieldElements()[0]->uid;
    unset($document['content'][0]['attrs']['fieldSlots'][$hostedPlacement]['content'][0]['attrs']['matrixAnchorUid']);
    $content[$placement] = json_encode($document, JSON_THROW_ON_ERROR);
    Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS_SITES, [
        'content' => $content,
    ], ['elementId' => $owner->id, 'siteId' => $owner->siteId])->execute();

    $snapshot = Vizy::$plugin->getContentRecovery()->snapshot($f->reload($owner), $f->field);
    expect(array_map('intval', array_column($snapshot['tables'][VizyTable::MATRIX_ANCHORS], 'id')))
        ->toContain((int)$anchor->id);
    foreach ($rowIds as $rowId) {
        expect(array_map('intval', array_column($snapshot['tables'][Table::ENTRIES], 'id')))->toContain($rowId);
    }
});

it('recreates hard-deleted nested draft and revision graphs from a durable journal', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Recover derivatives']))]);
    $nested = $f->rows($uid)[0];
    Craft::$app->getDrafts()->createDraft($nested);
    Craft::$app->getRevisions()->createRevision($nested, force: true);

    $recovery = Vizy::$plugin->getContentRecovery();
    $original = $recovery->snapshot($owner, $f->field);
    expect($original['tables'][Table::DRAFTS])->not->toBeEmpty()
        ->and($original['tables'][Table::REVISIONS])->not->toBeEmpty();
    $id = $recovery->capture($owner, $f->field, 'hard-deleted-derivatives');
    $elementIds = array_map('intval', array_column($original['tables'][Table::ELEMENTS], 'id'));
    Craft::$app->getDb()->createCommand()->delete(Table::ELEMENTS, ['id' => $elementIds])->execute();

    foreach ([Table::DRAFTS, Table::REVISIONS] as $table) {
        foreach ($original['tables'][$table] as $row) {
            expect((new Query())->from($table)->where(['id' => $row['id']])->exists())->toBeFalse();
        }
    }

    $recovery->restore($id);
    $restored = $recovery->snapshot($f->reload(), $f->field);
    foreach ($original['tables'] as $table => $rows) {
        foreach ($rows as $row) {
            expect($restored['tables'][$table])->toContain($row);
        }
    }
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Recover derivatives');
});

it('preserves a canonical anchor still referenced by a historical shared draft', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Shared original']))]);
    $document = $owner->getFieldValue($f->field->handle)->toArray();
    $draft = Craft::$app->getDrafts()->createDraft($owner);
    $placement = \verbb\vizy\helpers\FieldPlacements::uid($draft, $f->field);
    $raw = (new Query())->select('content')->from(Table::ELEMENTS_SITES)->where(['elementId' => $draft->id, 'siteId' => $draft->siteId])->scalar();
    $content = is_string($raw) ? json_decode($raw, true) : $raw;
    $content[$placement] = json_encode($document);
    Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS_SITES, ['content' => $content], ['elementId' => $draft->id, 'siteId' => $draft->siteId])->execute();
    $anchor = Vizy::$plugin->getAnchors()->getAnchor($owner, $f->field, $uid);
    expect(Vizy::$plugin->getAnchors()->hasExternalReferences($anchor))->toBeTrue();
    $anchor->setFieldLayout($f->blockType->getFieldLayout());
    $matrix = $f->blockType->getFieldLayout()->getCustomFieldElements()[0]->getField();
    $query = \verbb\vizy\helpers\Matrix::nestedEntryQuery($matrix, $anchor);
    Vizy::$plugin->getAnchors()->saveMatrixField($matrix, $anchor, $query, false);
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Shared original');
    expect(fn() => $f->save([$f->block($uid, $f->payload(['Unsafe replacement']))]))->toThrow(RuntimeException::class, 'still referenced');
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Shared original');
    $f->save([]);
    expect((new Query())->from(Table::ELEMENTS)->where(['id' => $anchor->id, 'dateDeleted' => null])->exists())->toBeTrue();
});

it('rejects a stale content version without overwriting the newer Matrix values', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Original']))]);
    $token = Vizy::$plugin->getContentVersions()->issue($owner, $f->field);
    $stale = $owner->getFieldValue($f->field->handle)->toArray();
    $stale['attrs']['_storageToken'] = $token;
    $stale['content'][0]['attrs']['fieldSlots'][$f->placementUid] = $f->payload(['Stale edit']);
    $f->save([$f->block($uid, $f->payload(['Newer edit']))]);
    $owner = $f->reload();
    $owner->setFieldValue($f->field->handle, $stale);
    expect(fn() => Craft::$app->getElements()->saveElement($owner))->toThrow(RuntimeException::class, 'changed after it was opened');
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Newer edit');
    expect($owner->getFieldValue($f->field->handle)->toArray())->toBe($stale);
});

it('rolls back a restoration interrupted after nested rows were written', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $owner = $f->save([$f->block($uid, $f->payload(['Original']))]);
    $recovery = Vizy::$plugin->getContentRecovery();
    $id = $recovery->capture($owner, $f->field, 'interruption-test');
    $f->save([$f->block($uid, $f->payload(['Current']))]);
    $before = $recovery->snapshot($f->reload(), $f->field);
    $db = Craft::$app->getDb();
    $originalCommand = $db->commandClass;
    $db->commandClass = InterruptedRecoveryCommand::class;
    InterruptedRecoveryCommand::$interrupted = false;
    try {
        expect(fn() => $recovery->restore($id))->toThrow(RuntimeException::class, 'Injected restore interruption');
    } finally {
        $db->commandClass = $originalCommand;
    }
    expect(InterruptedRecoveryCommand::$interrupted)->toBeTrue();
    expect($recovery->snapshot($f->reload(), $f->field))->toBe($before);
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Current');
    $recovery->restore($id);
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Original');
});

it('rejects an incomplete Matrix submission without treating it as clearing', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $f->save([$f->block($uid, $f->payload(['Keep me']))]);
    expect(fn() => $f->save([$f->block($uid, ['entries' => []])]))->toThrow(RuntimeException::class, 'complete ordering');
    $node = $f->block($uid);
    $node['attrs']['fieldSlots'][$f->placementUid] = null;
    expect(fn() => $f->save([$node]))->toThrow(RuntimeException::class, 'incomplete or malformed');
    expect($f->rows($uid)[0]->getFieldValue($f->text->handle))->toBe('Keep me');
});

it('preserves conflicting historical rows that share a UID', function() {
    $f = new MatrixSupportFixture();
    $uid = StringHelper::UUID();
    $f->save([$f->block($uid, $f->payload(['First content', 'Different content']))]);
    [$first, $second] = $f->rows($uid);
    Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS, ['uid' => $first->uid], ['id' => $second->id])->execute();
    $recovery = Vizy::$plugin->getContentRecovery();
    $before = $recovery->snapshot($f->reload(), $f->field);
    expect(fn() => $f->rows($uid))->toThrow(RuntimeException::class, 'different content');
    expect(fn() => $f->save([$f->block($uid)]))->toThrow(RuntimeException::class, 'different content');
    expect($recovery->snapshot($f->reload(), $f->field))->toBe($before);
});

it('restores site-specific Matrix relations in a new process without changing unrelated owner content', function() {
    $sites = \Tests\Support\Fixtures\VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture(propagation: \craft\enums\PropagationMethod::None);
    $related = new \craft\fields\Entries(['name' => 'Recovery relation', 'handle' => 'recoveryRelation' . StringHelper::randomString(6)]);
    expect(Craft::$app->getFields()->saveField($related))->toBeTrue();
    $layout = $f->rowType->getFieldLayout();
    $tab = $layout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new \craft\fieldlayoutelements\CustomField($related)]);
    $layout->setTabs([$tab]);
    $f->rowType->setFieldLayout($layout);
    expect(Craft::$app->getEntries()->saveEntryType($f->rowType))->toBeTrue();
    Craft::$app->getFields()->refreshFields();
    $uid = StringHelper::UUID();
    foreach ($sites as $index => $site) {
        $owner = \craft\elements\Entry::find()->id($f->owner->id)->siteId($site->id)->status(null)->one();
        $payload = $f->payload(['Locale ' . $index]);
        $key = array_key_first($payload['entries']);
        $payload['entries'][$key]['fields'][$related->handle] = [$f->owner->id];
        $f->save([$f->block($uid, $payload)], $owner, false);
    }
    $recovery = Vizy::$plugin->getContentRecovery();
    $original = $recovery->snapshot($f->reload(), $f->field);
    $id = $recovery->capture($f->reload(), $f->field, 'multisite-process-test');
    expect($original['tables'][Table::RELATIONS])->not->toBeEmpty();
    $f->save([$f->block($uid, $f->payload(['Replacement']))], propagate: false);
    Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS_SITES, ['title' => 'Keep this newer title'], ['elementId' => $f->owner->id])->execute();
    Craft::$app->getProjectConfig()->flush();
    $process = proc_open([PHP_BINARY, dirname(__DIR__) . '/runtime/content-recovery-worker.php', (string)$id], [0 => ['file', '/dev/null', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    $output = stream_get_contents($pipes[1]) . stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    expect(proc_close($process))->toBe(0, $output);
    foreach ($sites as $index => $site) {
        $owner = \craft\elements\Entry::find()->id($f->owner->id)->siteId($site->id)->status(null)->one();
        $row = $f->rows($uid, $owner)[0];
        expect($owner->title)->toBe('Keep this newer title');
        expect($row->getFieldValue($f->text->handle))->toBe('Locale ' . $index);
        expect($row->getFieldValue($related->handle)->ids())->toBe([$f->owner->id]);
    }
});

class InterruptedRecoveryCommand extends \craft\db\Command
{
    public static bool $interrupted = false;

    public function execute()
    {
        $sql = $this->getRawSql();
        if (str_starts_with($sql, 'DELETE FROM') && str_contains($sql, 'relations')) {
            self::$interrupted = true;
            throw new RuntimeException('Injected restore interruption');
        }
        return parent::execute();
    }
}
