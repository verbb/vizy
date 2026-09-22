<?php

use craft\db\Query;
use craft\console\controllers\FieldsController;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Lightswitch;
use craft\fields\PlainText;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\BlockTypes;
use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;
use yii\console\ExitCode;

final class DeterministicFieldMergeController extends FieldsController
{
    public string $persistingHandle = '';

    public function select($prompt, $options = [], $default = null)
    {
        return $this->persistingHandle;
    }
}

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

    $root = new VizyField([
        'name' => 'Merge root',
        'handle' => 'mergeRoot' . $suffix,
        'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$blockType->uid]]],
    ]);
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

it('preserves canonical Vizy content through Crafts actual field merge lifecycle', function() {
    $fixture = fieldMergePlanFixture();
    $before = ($fixture['read'])();
    $migrator = Craft::$app->getContentMigrator();
    $originalMigrationPath = $migrator->migrationPath;
    $migrationPath = Craft::$app->getPath()->getTempPath() . DIRECTORY_SEPARATOR . 'vizy-field-merge-' . StringHelper::randomString(12);
    FileHelper::createDirectory($migrationPath);
    $migrator->migrationPath = $migrationPath;

    try {
        $controller = new DeterministicFieldMergeController('fields', Craft::$app, [
            'persistingHandle' => $fixture['persisting']->handle,
        ]);
        $controller->interactive = true;
        $result = $controller->actionMerge($fixture['outgoing']->handle, $fixture['persisting']->handle);
    } finally {
        $migrator->migrationPath = $originalMigrationPath;
        FileHelper::removeDirectory($migrationPath);
    }

    $config = Craft::$app->getProjectConfig()->get(BlockTypes::PROJECT_CONFIG_PATH . '.' . $fixture['blockType']->uid);
    $reloadedBlockType = BlockType::fromConfig($fixture['blockType']->uid, ProjectConfigHelper::unpackAssociativeArrays($config));
    $placements = $reloadedBlockType->getFieldLayout()?->getElementsByType(CustomField::class) ?? [];
    $placement = $placements[0] ?? null;
    $afterMerge = ($fixture['read'])();

    expect($result)->toBe(ExitCode::OK)
        ->and(Craft::$app->getFields()->getFieldByUid($fixture['outgoing']->uid))->toBeNull()
        ->and(Json::encode($config))->not->toContain($fixture['outgoing']->uid)
        ->and(Json::encode($config))->toContain($fixture['persisting']->uid)
        ->and($placement)->toBeInstanceOf(CustomField::class)
        ->and($placement->uid)->toBe($fixture['embeddedPlacement']->uid)
        ->and($placement->getFieldUid())->toBe($fixture['persisting']->uid)
        ->and($afterMerge)->toBe($before);

    $content = is_string($afterMerge) ? Json::decode($afterMerge) : $afterMerge;
    $document = Json::decodeIfJson($content[$fixture['rootPlacement']->uid]);
    $owner = Entry::find()->id($fixture['owner']->id)->siteId($fixture['owner']->siteId)->status(null)->one();
    $owner->setFieldValue($fixture['root']->handle, $document);
    $saved = Craft::$app->getElements()->saveElement($owner);
    expect($saved)->toBeTrue(Json::encode($owner->getErrors()));

    $persisted = ($fixture['read'])();
    $persisted = is_string($persisted) ? Json::decode($persisted) : $persisted;
    $persistedDocument = Json::decodeIfJson($persisted[$fixture['rootPlacement']->uid]);
    expect($persistedDocument['content'][0]['attrs']['fieldSlots'][$fixture['embeddedPlacement']->uid])
        ->toBe('Preserve this value');
});
