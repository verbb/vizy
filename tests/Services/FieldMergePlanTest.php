<?php

use craft\db\Query;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Lightswitch;
use craft\fields\PlainText;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

function fieldMergePlanFixture(): array
{
    $suffix = StringHelper::randomString(8);
    $outgoing = new PlainText(['name' => 'Outgoing', 'handle' => 'outgoing' . $suffix]);
    $persisting = new PlainText(['name' => 'Persisting', 'handle' => 'persisting' . $suffix]);
    expect(Craft::$app->fields->saveField($outgoing))->toBeTrue();
    expect(Craft::$app->fields->saveField($persisting))->toBeTrue();

    $blockLayout = new FieldLayout(['type' => verbb\vizy\elements\Block::class]);
    $embeddedPlacement = new CustomField($outgoing, ['uid' => StringHelper::UUID()]);
    $blockLayout->setTabs([new FieldLayoutTab([
        'name' => 'Content',
        'layout' => $blockLayout,
        'elements' => [$embeddedPlacement],
    ])]);
    $blockType = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Merge block', 'handle' => 'mergeBlock' . $suffix]);
    $blockType->setFieldLayout($blockLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($blockType))->toBeTrue();

    $root = new VizyField(['name' => 'Merge root', 'handle' => 'mergeRoot' . $suffix]);
    expect(Craft::$app->fields->saveField($root))->toBeTrue();
    $owner = VizyFixtureFactory::entry('Field merge analysis');
    $ownerLayout = $owner->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $rootPlacement = new CustomField($root, ['uid' => StringHelper::UUID()]);
    $tab->setElements([...$tab->getElements(), $rootPlacement]);
    expect(Craft::$app->fields->saveLayout($ownerLayout))->toBeTrue();

    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => $blockType->uid,
                'enabled' => true,
                'fieldSlots' => [$embeddedPlacement->uid => 'Preserve this value'],
            ],
        ]],
    ];
    $where = ['elementId' => $owner->id, 'siteId' => $owner->siteId];
    $content = (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();
    $content = is_string($content) ? Json::decode($content) : $content;
    $content[$rootPlacement->uid] = Json::encode($document);
    Craft::$app->db->createCommand()->update('{{%elements_sites}}', ['content' => new yii\db\JsonExpression($content)], $where)->execute();
    $read = fn() => (new Query())->select('content')->from('{{%elements_sites}}')->where($where)->scalar();

    return compact('outgoing', 'persisting', 'embeddedPlacement', 'blockType', 'root', 'rootPlacement', 'owner', 'read');
}

it('builds a stable read-only inventory for fields embedded in Vizy content', function() {
    $fixture = fieldMergePlanFixture();
    $before = ($fixture['read'])();

    $plan = Vizy::$plugin->getFieldMerges()->analyze($fixture['outgoing']->handle, $fixture['persisting']->uid, 1);

    expect($plan['status'])->toBe('ready')
        ->and($plan['safeToApply'])->toBeFalse()
        ->and($plan['mapping']['fieldUids'])->toBe([$fixture['outgoing']->uid => $fixture['persisting']->uid])
        ->and($plan['mapping']['placements'][0]['placementUid'])->toBe($fixture['embeddedPlacement']->uid)
        ->and($plan['content']['occurrences'])->toBe(1)
        ->and($plan['content']['rows'])->toBe(1)
        ->and($plan['content']['elements'])->toBe(1)
        ->and($plan['content']['siteIds'])->toBe([$fixture['owner']->siteId])
        ->and($plan['content']['samples'][0]['rootPlacementUid'])->toBe($fixture['rootPlacement']->uid)
        ->and($plan['content']['locationGroups'][0]['path'][1]['placementUid'])->toBe($fixture['embeddedPlacement']->uid)
        ->and($plan['planHash'])->toHaveLength(64)
        ->and(($fixture['read'])())->toBe($before);

    $repeat = Vizy::$plugin->getFieldMerges()->analyze($fixture['outgoing']->uid, $fixture['persisting']->handle, 1);
    expect($repeat['planHash'])->toBe($plan['planHash']);
});

it('rejects invalid field merge selectors before scanning content', function() {
    $fixture = fieldMergePlanFixture();
    expect(fn() => Vizy::$plugin->getFieldMerges()->analyze('missing-field', $fixture['persisting']->uid))
        ->toThrow(InvalidArgumentException::class, "outgoing field 'missing-field' was not found");
    expect(fn() => Vizy::$plugin->getFieldMerges()->analyze($fixture['outgoing']->uid, $fixture['outgoing']->uid))
        ->toThrow(InvalidArgumentException::class, 'must be different');
    expect(fn() => Vizy::$plugin->getFieldMerges()->analyze($fixture['outgoing']->uid, $fixture['persisting']->uid, 1001))
        ->toThrow(InvalidArgumentException::class, 'sampleLimit');
});

it('blocks a plan when Craft considers the field types incompatible', function() {
    $fixture = fieldMergePlanFixture();
    $incompatible = new Lightswitch(['name' => 'Incompatible', 'handle' => 'incompatible' . StringHelper::randomString(8)]);
    expect(Craft::$app->fields->saveField($incompatible))->toBeTrue();

    $plan = Vizy::$plugin->getFieldMerges()->analyze($fixture['outgoing']->uid, $incompatible->uid, 0);

    expect($plan['status'])->toBe('blocked')
        ->and($plan['safeToApply'])->toBeFalse()
        ->and(array_intersect(array_column($plan['diagnostics'], 'code'), ['cannotMergeInto', 'cannotMergeFrom']))->not->toBeEmpty()
        ->and($plan['content']['samples'])->toBe([])
        ->and($plan['content']['samplesTruncated'])->toBeTrue();
});
