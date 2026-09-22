<?php

declare(strict_types=1);

use craft\db\Query;
use craft\db\Table;
use craft\helpers\StringHelper;
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
