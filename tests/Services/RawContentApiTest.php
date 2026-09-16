<?php

use craft\db\Query;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\content\Change;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

function rawApiFixture(): array
{
    $suffix = StringHelper::randomString(8);
    $target = new PlainText(['name' => 'Source', 'handle' => 'source' . $suffix]);
    Craft::$app->fields->saveField($target);
    $nested = new VizyField(['name' => 'Nested', 'handle' => 'nested' . $suffix]);
    Craft::$app->fields->saveField($nested);
    $layout = new FieldLayout(['type' => verbb\vizy\elements\Block::class]);
    $a = new CustomField($target, ['uid' => StringHelper::UUID()]);
    $b = new CustomField($target, ['uid' => StringHelper::UUID(), 'handle' => 'second' . $suffix]);
    $n = new CustomField($nested, ['uid' => StringHelper::UUID()]);
    $layout->setTabs([new FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [$a, $b, $n]])]);
    $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'API', 'handle' => 'api' . $suffix]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $root = new VizyField(['name' => 'API root', 'handle' => 'root' . $suffix]);
    expect(Craft::$app->fields->saveField($root))->toBeTrue();
    $owner = VizyFixtureFactory::entry('Raw API');
    $ownerLayout = $owner->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $p = new CustomField($root, ['uid' => StringHelper::UUID()]);
    $q = new CustomField($root, ['uid' => StringHelper::UUID(), 'handle' => 'rootSecond' . $suffix]);
    $tab->setElements([...$tab->getElements(), $p, $q]);
    expect(Craft::$app->fields->saveLayout($ownerLayout))->toBeTrue();
    $block = fn(array $slots) => ['type' => 'vizyBlock', 'attrs' => ['blockUid' => StringHelper::UUID(), 'blockTypeUid' => $type->uid, 'enabled' => false, 'fieldSlots' => $slots]];
    $doc = fn(array $slots) => ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$block($slots), ['type' => 'paragraph']]];
    $value = $doc([$a->uid => 'old', $b->uid => null, $n->uid => Json::encode($doc([$a->uid => 'inner'])), 'orphan' => ['fields' => [$a->uid => 'opaque']]]);
    $content = [$p->uid => Json::encode($value), $q->uid => Json::encode($doc([$a->uid => 'other'])), 'unrelated' => ['keep' => true]];
    $where = ['elementId' => $owner->id, 'siteId' => $owner->siteId];
    Craft::$app->db->createCommand()->update('{{%elements_sites}}', ['content' => new yii\db\JsonExpression($content)], $where)->execute();
    $read = fn() => (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();
    $map = Vizy::$plugin->getContent()->captureFieldLocations($target->uid);
    return compact('target', 'nested', 'type', 'root', 'owner', 'a', 'b', 'n', 'p', 'q', 'value', 'content', 'read', 'map');
}

it('raw API captures repeated placements and transforms nested raw data after configuration changes', function() {
    $f = rawApiFixture();
    $map = Json::decode(Json::encode($f['map']));
    // The map survives removal of the source placement layout and field interpreter.
    $f['type']->setFieldLayout(new FieldLayout(['type' => verbb\vizy\elements\Block::class]));
    Vizy::$plugin->getBlockTypes()->saveBlockType($f['type']);
    $contexts = [];
    $out = Vizy::$plugin->getContent()->transformValue($f['value'], $f['root']->uid, $map, function($raw, $context) use (&$contexts) {
        $contexts[] = $context;
        return $raw === 'old' || $raw === 'inner' ? Change::replace('converted') : Change::unchanged();
    });
    expect($out['matched'])->toBe(3)->and($out['changed'])->toBe(2);
    expect($out['value']['content'][0]['attrs']['fieldSlots']['orphan'])->toBe($f['value']['content'][0]['attrs']['fieldSlots']['orphan']);
    expect($contexts[0]['hasDurableOwner'])->toBeFalse();
    expect($out['value']['content'][1])->toBe(['type' => 'paragraph']);
});

it('raw API preserves explicit empty replacements and removal', function($replacement) {
    $f = rawApiFixture();
    $out = Vizy::$plugin->getContent()->transformValue($f['value'], $f['root']->uid, $f['map'], fn() => Change::replace($replacement));
    expect($out['value']['content'][0]['attrs']['fieldSlots'][$f['a']->uid])->toBe($replacement);
    $removed = Vizy::$plugin->getContent()->transformValue($f['value'], $f['root']->uid, $f['map'], fn() => Change::remove());
    expect(array_key_exists($f['a']->uid, $removed['value']['content'][0]['attrs']['fieldSlots']))->toBeFalse();
})->with([[null], [''], [[]], [false], [0]]);

it('raw API dry run preserves bytes and caller rollback undoes writes', function() {
    $f = rawApiFixture();
    $api = Vizy::$plugin->getContent();
    $before = ($f['read'])();
    $options = ['elementIds' => [$f['owner']->id], 'batchSize' => 1];
    $contexts = [];
    $convert = function($raw, $context) use (&$contexts) { $contexts[] = $context; return Change::replace('done'); };
    $dry = $api->modifyFieldValues($f['map'], $convert, $options + ['dryRun' => true]);
    expect($dry['wouldModify'])->toBe(4)->and(($f['read'])())->toBe($before);
    expect(fn() => $api->modifyFieldValues($f['map'], $convert, $options))->toThrow(RuntimeException::class);
    $tx = Craft::$app->db->beginTransaction();
    try {
        $result = $api->modifyFieldValues($f['map'], $convert, $options);
        expect($result['modified'])->toBe(1)->and(($f['read'])())->not->toBe($before);
        $repeat = $api->modifyFieldValues($f['map'], $convert, $options);
        expect($repeat['modified'])->toBe(0)->and($repeat['wouldModify'])->toBe(0);
    } finally { $tx->rollBack(); }
    expect(($f['read'])())->toBe($before);
    expect($contexts[0]['elementId'])->toBe($f['owner']->id)->and($contexts[0]['siteId'])->toBe($f['owner']->siteId);
});

it('raw API propagates callback failures and rejects ambiguous block identities', function() {
    $f = rawApiFixture();
    $api = Vizy::$plugin->getContent();
    expect(fn() => $api->transformValue($f['value'], $f['root']->uid, $f['map'], fn() => throw new RuntimeException('consumer failure')))->toThrow(RuntimeException::class, 'consumer failure');
    $value = $f['value'];
    $value['content'][] = $value['content'][0];
    expect(fn() => $api->transformValue($value, $f['root']->uid, $f['map'], fn() => Change::unchanged()))->toThrow(RuntimeException::class, 'ambiguous');
});

it('raw API refreshes persisted validation baselines only after the outer commit', function() {
    $f = rawApiFixture();
    // Baselines are owner/field scoped; use a single root placement.
    $layout = $f['owner']->getFieldLayout();
    $tab = $layout->getTabs()[0];
    $tab->setElements(array_values(array_filter($tab->getElements(), fn($placement) => $placement->uid !== $f['q']->uid)));
    expect(Craft::$app->fields->saveLayout($layout))->toBeTrue();
    $baselines = Vizy::$plugin->getContentBaselines();
    $before = $baselines->document($f['owner'], $f['root']);
    expect($before)->not->toBeNull();
    expect($before->toArray()['content'][0]['attrs']['fieldSlots'][$f['a']->uid])->toBe('old');
    $api = Vizy::$plugin->getContent();
    $options = ['elementIds' => [$f['owner']->id]];

    $tx = Craft::$app->db->beginTransaction();
    try {
        $api->modifyFieldValues($f['map'], fn() => Change::replace('rolled back'), $options);
    } finally {
        $tx->rollBack();
    }
    expect($baselines->document($f['owner'], $f['root']))->toBe($before);

    $tx = Craft::$app->db->beginTransaction();
    try {
        Craft::$app->db->transaction(fn() => $api->modifyFieldValues($f['map'], fn() => Change::replace('committed'), $options));
        expect($baselines->document($f['owner'], $f['root']))->toBe($before);
        $tx->commit();
    } finally {
        if ($tx->getIsActive()) $tx->rollBack();
    }
    $reloaded = Craft::$app->elements->getElementById($f['owner']->id, $f['owner']::class, $f['owner']->siteId);
    $after = $baselines->document($reloaded, $f['root']);
    expect($after->toArray()['content'][0]['attrs']['fieldSlots'][$f['a']->uid])->toBe('committed');
});

it('raw API rolls back an earlier batch when a later consumer callback fails', function() {
    $f = rawApiFixture();
    $second = VizyFixtureFactory::entry('Later raw row');
    Craft::$app->db->createCommand()->update('{{%elements_sites}}', ['content' => new yii\db\JsonExpression($f['content'])], ['elementId' => $second->id])->execute();
    $before = ($f['read'])();
    try {
        Craft::$app->db->transaction(function() use ($f, $second) {
            Vizy::$plugin->getContent()->modifyFieldValues($f['map'], function($raw, $context) use ($second) {
                if ($context['elementId'] === $second->id) throw new RuntimeException('later row failed');
                return Change::replace('first row written');
            }, ['elementIds' => [$f['owner']->id, $second->id], 'batchSize' => 1]);
        });
        throw new LogicException('Expected failure');
    } catch (RuntimeException $e) {
        expect($e->getMessage())->toBe('later row failed');
    }
    expect(($f['read'])())->toBe($before);
});

it('raw API traverses nested legacy content using captured provenance without rewriting its format', function() {
    $f = rawApiFixture();
    $legacy = [['type' => 'vizyBlock', 'attrs' => ['id' => 'legacy-instance', 'values' => ['type' => 'legacy-type', 'content' => ['fields' => ['old-key' => ['original' => 'payload']]]]]]];
    $map = $f['map'];
    $map['schemas'][$f['nested']->uid]['schema']['legacy'] = ['legacy-type' => ['blockTypeUid' => $f['type']->uid, 'placementUids' => ['old-key' => $f['a']->uid]]];
    $value = $f['value'];
    $value['content'][0]['attrs']['fieldSlots'][$f['n']->uid] = Json::encode($legacy);
    $result = Vizy::$plugin->getContent()->transformValue($value, $f['root']->uid, $map, fn($raw) => is_array($raw) ? Change::replace([]) : Change::unchanged());
    $nested = $result['value']['content'][0]['attrs']['fieldSlots'][$f['n']->uid];
    expect($nested)->toBeString();
    expect(Json::decode($nested)[0]['attrs']['values']['content']['fields']['old-key'])->toBe([]);
    expect(Json::decode($nested)[0]['attrs']['id'])->toBe('legacy-instance');
    expect(fn() => Vizy::$plugin->getContent()->transformValue($value, $f['root']->uid, $f['map'], fn() => Change::unchanged()))->toThrow(RuntimeException::class, 'provenance');
});

it('raw API preserves unrelated empty JSON objects and detects concurrent row changes', function() {
    $f = rawApiFixture();
    $value = $f['value'];
    $value['content'][0]['attrs']['matrixAnchorUid'] = StringHelper::UUID();
    $value['content'][0]['attrs']['fieldSlots']['opaque'] = (object)['empty' => new stdClass(), 'numeric' => (object)['0' => 'keep']];
    $encoded = json_encode($value, JSON_THROW_ON_ERROR);
    $result = Vizy::$plugin->getContent()->transformValue($encoded, $f['root']->uid, $f['map'], fn() => Change::replace('new'));
    $decoded = json_decode($result['value']);
    expect($decoded->content[0]->attrs->fieldSlots->opaque->empty)->toBeInstanceOf(stdClass::class);
    expect($decoded->content[0]->attrs->fieldSlots->opaque->numeric)->toBeInstanceOf(stdClass::class);
    $before = ($f['read'])();
    $tx = Craft::$app->db->beginTransaction();
    try {
        expect(fn() => Vizy::$plugin->getContent()->modifyFieldValues($f['map'], function($raw, $context) {
            Craft::$app->db->createCommand()->update('{{%elements_sites}}', ['content' => new yii\db\JsonExpression(['concurrent' => true])], ['id' => $context['rowId']])->execute();
            return Change::replace('new');
        }, ['elementIds' => [$f['owner']->id]]))->toThrow(RuntimeException::class, 'concurrently');
    } finally { $tx->rollBack(); }
    expect(($f['read'])())->toBe($before);
});

it('raw API replaces JSON objects with arrays without restoring the old value shape', function($source, $replacement) {
    $f = rawApiFixture();
    $value = $f['value'];
    $value['content'][0]['attrs']['fieldSlots'][$f['a']->uid] = json_decode($source);
    $encoded = json_encode($value, JSON_THROW_ON_ERROR);
    $change = fn($raw, $context) => $context['placementUid'] === $f['a']->uid
        ? Change::replace($replacement)
        : Change::unchanged();
    $result = Vizy::$plugin->getContent()->transformValue($encoded, $f['root']->uid, $f['map'], $change);
    $actual = json_decode($result['value'])->content[0]->attrs->fieldSlots->{$f['a']->uid};
    expect($actual)->toBe($replacement);
    $repeat = Vizy::$plugin->getContent()->transformValue($result['value'], $f['root']->uid, $f['map'], $change);
    expect($repeat['changed'])->toBe(0)->and($repeat['value'])->toBe($result['value']);
})->with(['empty object' => ['{}', []], 'numeric object' => ['{"0":"old"}', ['new']]]);

it('raw API preserves object replacements and detects an equivalent replacement as unchanged', function() {
    $f = rawApiFixture();
    // Store the Vizy envelope directly in the content row to exercise both JSON boundaries.
    $value = $f['value'];
    $value['content'][0]['attrs']['fieldSlots'][$f['a']->uid] = new stdClass();
    $content = [$f['p']->uid => $value, 'unrelated' => new stdClass()];
    Craft::$app->db->createCommand()->update('{{%elements_sites}}', [
        'content' => new yii\db\Expression(':json', [':json' => json_encode($content, JSON_THROW_ON_ERROR)]),
    ], ['elementId' => $f['owner']->id, 'siteId' => $f['owner']->siteId])->execute();
    $options = ['elementIds' => [$f['owner']->id]];
    $api = Vizy::$plugin->getContent();
    $tx = Craft::$app->db->beginTransaction();
    try {
        $result = $api->modifyFieldValues($f['map'], fn() => Change::replace([]), $options);
        expect($result['modified'])->toBe(1);
        $actual = json_decode(($f['read'])());
        expect($actual->{$f['p']->uid}->content[0]->attrs->fieldSlots->{$f['a']->uid})->toBe([])
            ->and($actual->unrelated)->toBeInstanceOf(stdClass::class);
        $api->modifyFieldValues($f['map'], fn() => Change::replace(new stdClass()), $options);
        $before = ($f['read'])();
        $repeat = $api->modifyFieldValues($f['map'], fn() => Change::replace(new stdClass()), $options);
        expect($repeat['modified'])->toBe(0)->and($repeat['wouldModify'])->toBe(0)
            ->and(($f['read'])())->toBe($before);
    } finally {
        $tx->rollBack();
    }
});

it('raw API scopes disabled owners trash drafts revisions and sites without synthetic ownership', function() {
    $f = rawApiFixture();
    $owner = Craft::$app->elements->getElementById($f['owner']->id, null, $f['owner']->siteId);
    $draft = Craft::$app->drafts->createDraft($owner);
    $section = Craft::$app->entries->getSectionById($owner->sectionId);
    $section->enableVersioning = true;
    Craft::$app->entries->saveSection($section);
    $revisionId = Craft::$app->revisions->createRevision($owner, force: true);
    $revision = craft\elements\Entry::find()->id($revisionId)->revisions()->status(null)->one();
    expect($draft)->not->toBeNull()->and($revision)->not->toBeNull();
    $ids = [$owner->id, $draft->id, $revision->id];
    Craft::$app->db->createCommand()->update('{{%elements_sites}}', ['content' => new yii\db\JsonExpression($f['content'])], ['elementId' => $ids])->execute();
    Craft::$app->db->createCommand()->update('{{%elements}}', ['enabled' => false, 'dateDeleted' => gmdate('Y-m-d H:i:s')], ['id' => $owner->id])->execute();
    $api = Vizy::$plugin->getContent();
    [$primarySite, $otherSite] = VizyFixtureFactory::ensureSites(2);
    $siteRow = (new Query())->from('{{%elements_sites}}')->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])->one();
    unset($siteRow['id']);
    $siteRow['siteId'] = $otherSite->id;
    $siteRow['uid'] = StringHelper::UUID();
    $siteRow['content'] = new yii\db\JsonExpression(Json::decode($siteRow['content']));
    Craft::$app->db->createCommand()->insert('{{%elements_sites}}', $siteRow)->execute();
    $options = ['elementIds' => $ids, 'dryRun' => true];
    $seen = [];
    $api->modifyFieldValues($f['map'], function($raw, $context) use (&$seen) { $seen[$context['elementId']] = $context; return Change::unchanged(); }, $options);
    expect(array_keys($seen))->toEqualCanonicalizing($ids);
    $other = $api->modifyFieldValues($f['map'], fn() => Change::unchanged(), $options + ['siteIds' => [$otherSite->id]]);
    expect($other['matched'])->toBe(4);
    expect($seen[$owner->id]['trashed'])->toBeTrue()->and($seen[$draft->id]['draftId'])->not->toBeNull();
    $result = $api->modifyFieldValues($f['map'], fn() => Change::replace('new'), $options + ['includeDrafts' => false, 'includeRevisions' => false, 'includeTrashed' => false]);
    expect($result['matched'])->toBe(0);
    expect($api->modifyFieldValues($f['map'], fn() => Change::unchanged(), $options + ['siteIds' => []])['matched'])->toBe(0);
});

it('raw API finds Vizy on a real Matrix Entry and retains embedded ownership', function() {
    $f = rawApiFixture();
    $suffix = StringHelper::randomString(8);
    $type = new craft\models\EntryType(['name' => 'Nested API', 'handle' => 'nestedApi' . $suffix]);
    $layout = new FieldLayout(['type' => craft\elements\Entry::class]);
    $placement = new CustomField($f['root'], ['uid' => StringHelper::UUID()]);
    $layout->setTabs([new FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [$placement]])]);
    $type->setFieldLayout($layout);
    expect(Craft::$app->entries->saveEntryType($type))->toBeTrue();
    $matrix = new craft\fields\Matrix(['name' => 'Matrix API', 'handle' => 'matrixApi' . $suffix]);
    $matrix->setEntryTypes([$type]);
    expect(Craft::$app->fields->saveField($matrix))->toBeTrue();
    $ownerLayout = $f['owner']->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($matrix, ['uid' => StringHelper::UUID()])]);
    Craft::$app->fields->saveLayout($ownerLayout);
    $child = new craft\elements\Entry(['siteId' => $f['owner']->siteId, 'typeId' => $type->id, 'fieldId' => $matrix->id, 'title' => 'Matrix child']);
    $child->setOwner($f['owner']);
    expect(Craft::$app->elements->saveElement($child))->toBeTrue();
    Craft::$app->db->createCommand()->update('{{%elements_sites}}', ['content' => new yii\db\JsonExpression([$placement->uid => Json::encode($f['value'])])], ['elementId' => $child->id])->execute();
    $map = Vizy::$plugin->getContent()->captureFieldLocations($f['target']->uid);
    $contexts = [];
    $result = Vizy::$plugin->getContent()->modifyFieldValues($map, function($raw, $context) use (&$contexts) { $contexts[] = $context; return Change::replace('matrix migrated'); }, ['dryRun' => true, 'elementIds' => [$child->id]]);
    expect($result['matched'])->toBe(3)->and($contexts[0]['elementId'])->toBe($child->id)->and($contexts[0]['hasDurableOwner'])->toBeFalse();
});
