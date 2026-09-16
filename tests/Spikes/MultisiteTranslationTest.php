<?php

declare(strict_types=1);

use craft\base\Field;
use craft\behaviors\CustomFieldBehavior;
use craft\db\Query;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Assets;
use craft\fields\Entries;
use craft\fields\PlainText;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Site;
use craft\models\SiteGroup;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;
use yii\base\Event;
use craft\events\ModelEvent;

/**
 * Every test here is slow, and unavoidably so. Each one saves real entries across four sites and
 * lets Craft propagate them, which is the entire point — the translation matrix cannot be proved
 * against anything less than real propagation. That comes to ~150s, about 40% of the whole suite,
 * so the file is grouped out of the default run: `composer test:slow` or `composer test:all`.
 *
 * @see tests/README.md for what belongs in the group and what does not.
 */
uses()->group('slow');

/**
 * Four sites provide crossed group/language partitions: A/B share a group,
 * A/C share a language, and D shares neither.
 *
 * @return array{Site,Site,Site,Site}
 */
function workshop16Sites(): array
{
    $sitesService = Craft::$app->getSites();
    $existingSets = [];
    foreach ($sitesService->getAllSites() as $site) {
        if (preg_match('/^vizyW16([ABCD])([A-Za-z0-9]{6})$/', $site->handle, $match)) {
            $existingSets[$match[2]][$match[1]] = $site;
        }
    }
    foreach ($existingSets as $set) {
        if (isset($set['A'], $set['B'], $set['C'], $set['D'])) {
            return [$set['A'], $set['B'], $set['C'], $set['D']];
        }
    }

    $suffix = StringHelper::randomString(6);
    $groups = [];
    foreach (['One', 'Two'] as $name) {
        $group = new SiteGroup(['name' => "Vizy W16 {$name} {$suffix}"]);
        expect($sitesService->saveGroup($group))->toBeTrue();
        $groups[] = $group;
    }

    $definitions = [
        ['A', $groups[0]->id, 'en-US'],
        ['B', $groups[0]->id, 'fr-FR'],
        ['C', $groups[1]->id, 'en-US'],
        ['D', $groups[1]->id, 'de-DE'],
    ];
    $sites = [];
    foreach ($definitions as [$label, $groupId, $language]) {
        $handle = "vizyW16{$label}{$suffix}";
        $site = new Site([
            'name' => "Vizy W16 {$label} {$suffix}",
            'handle' => $handle,
            'groupId' => $groupId,
            'language' => $language,
            'hasUrls' => true,
            'baseUrl' => "https://{$handle}.test",
        ]);
        expect($sitesService->saveSite($site))->toBeTrue();
        $sites[] = $site;
    }

    return $sites;
}

function workshop16Layout(array $fields): FieldLayout
{
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => array_map(
            static fn(Field $field) => ['type' => CustomField::class, 'fieldUid' => $field->uid],
            $fields,
        ),
    ])]);
    return $layout;
}

/**
 * @return array{
 *   field:VizyField,parent:BlockType,child:BlockType,areaUid:string,
 *   parentSlots:array<string,string>,childSlots:array<string,string>
 * }
 */
function workshop16Schema(
    string $outerMethod,
    ?string $outerFormat = null,
    string $innerMethod = Field::TRANSLATION_METHOD_SITE,
    ?string $innerFormat = null,
): array
{
    $suffix = StringHelper::randomString(6);
    $plain = new PlainText([
        'name' => 'Localized text',
        'handle' => "localizedText{$suffix}",
        'translationMethod' => $innerMethod,
        'translationKeyFormat' => $innerFormat,
    ]);
    $entries = new Entries([
        'name' => 'Localized relation',
        'handle' => "localizedRelation{$suffix}",
        'translationMethod' => $innerMethod,
        'translationKeyFormat' => $innerFormat,
    ]);
    $assets = new Assets([
        'name' => 'Localized assets',
        'handle' => "localizedAssets{$suffix}",
        'translationMethod' => $innerMethod,
        'translationKeyFormat' => $innerFormat,
        'defaultUploadLocationSource' => 'volume:' . AssetSpikeFixture::volume()->uid,
    ]);
    foreach ([$plain, $entries, $assets] as $field) {
        expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
        CustomFieldBehavior::$fieldHandles[$field->handle] = true;
    }

    $child = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => "W16 Child {$suffix}",
        'handle' => "w16Child{$suffix}",
    ]);
    $child->setFieldLayout(workshop16Layout([$plain, $entries, $assets]));
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($child))->toBeTrue();
    $child = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($child->uid);

    $parent = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => "W16 Parent {$suffix}",
        'handle' => "w16Parent{$suffix}",
    ]);
    $parent->setFieldLayout(workshop16Layout([$plain, $entries, $assets]));
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($parent))->toBeTrue();
    $parent = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($parent->uid);

    $field = new VizyField([
        'name' => "W16 {$outerMethod} {$suffix}",
        'handle' => "w16{$suffix}",
        'translationMethod' => $outerMethod,
        'translationKeyFormat' => $outerFormat,
        'blockTypePickerGroups' => [[
            'name' => 'Root',
            'blockTypeUids' => [$parent->uid, $child->uid],
        ]],
    ]);
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $field = Craft::$app->getFields()->getFieldByUid($field->uid);

    $slotMap = static function(BlockType $type): array {
        $map = [];
        foreach ($type->getFieldLayout()->getCustomFieldElements() as $placement) {
            $map[$placement->getField()::class] = $placement->uid;
        }
        return [
            'plain' => $map[PlainText::class],
            'entries' => $map[Entries::class],
            'assets' => $map[Assets::class],
        ];
    };

    return [
        'field' => $field,
        'parent' => $parent,
        'child' => $child,
        'parentSlots' => $slotMap($parent),
        'childSlots' => $slotMap($child),
    ];
}

function workshop16Values(array $slots, string $text, int $entryId, int $assetId): array
{
    return [
        $slots['plain'] => $text,
        $slots['entries'] => [$entryId],
        $slots['assets'] => [$assetId],
    ];
}

function workshop16Document(
    array $schema,
    string $prefix,
    int $entryId,
    int $assetId,
    bool $changed = false,
): string {
    $child = static fn(string $uid, string $text, bool $enabled = true) => [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => $uid,
            'blockTypeUid' => $schema['child']->uid,
            'enabled' => $enabled,
            'fieldSlots' => workshop16Values($schema['childSlots'], $text, $entryId, $assetId),
        ],
        'content' => [],
    ];
    $children = $changed
        ? [$child('child-2', "{$prefix} child 2"), $child('child-3', "{$prefix} child 3", false)]
        : [$child('child-1', "{$prefix} child 1"), $child('child-2', "{$prefix} child 2")];

    // Root siblings — Content Area nesting retired; Hosted fieldSlots are the nesting model.
    return Json::encode([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => array_merge([[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'parent-1',
                'blockTypeUid' => $schema['parent']->uid,
                'enabled' => !$changed,
                'fieldSlots' => workshop16Values($schema['parentSlots'], "{$prefix} parent", $entryId, $assetId),
            ],
            'content' => [],
        ]], $children),
    ]);
}

function workshop16RawSiteContent(int $elementId, int $siteId): string
{
    return (string)(new Query())
        ->select(['content'])
        ->from('{{%elements_sites}}')
        ->where(['elementId' => $elementId, 'siteId' => $siteId])
        ->scalar();
}

function workshop16LocalizedEntry(int $id, int $siteId): Entry
{
    return Entry::find()->id($id)->siteId($siteId)->status(null)->one()
        ?? throw new RuntimeException("Missing Entry {$id} on site {$siteId}.");
}

it('passes the Craft C6/C7 matrix for every supported outer translation partition', function(
    string $method,
    ?string $format,
    array $sharedTargets,
    array $independentTargets,
) {
    $sites = workshop16Sites();
    $schema = workshop16Schema($method, $format);
    $section = VizyFixtureFactory::multisiteSection($schema['field'], 4, $sites);
    $relationA = VizyFixtureFactory::entry('W16 relation A');
    $relationB = VizyFixtureFactory::entry('W16 relation B');
    $assetA = AssetSpikeFixture::createTempAsset('w16-a.txt', 'A');
    $assetB = AssetSpikeFixture::createTempAsset('w16-b.txt', 'B');

    $source = VizyFixtureFactory::entryOnSite(
        $section,
        $schema['field'],
        $sites[0],
        'W16 source',
        workshop16Document($schema, 'source', $relationA->id, $assetA->id),
    );

    // Establish distinct raw target overlays without propagation.
    foreach (array_unique([...$sharedTargets, ...$independentTargets]) as $index) {
        $target = workshop16LocalizedEntry($source->id, $sites[$index]->id);
        $target->setFieldValue(
            $schema['field']->handle,
            workshop16Document($schema, "target{$index}", $relationB->id, $assetB->id),
        );
        expect(Craft::$app->getElements()->saveElement($target, false, false))->toBeTrue();
    }
    $before = [];
    foreach ($independentTargets as $index) {
        $before[$index] = workshop16RawSiteContent($source->id, $sites[$index]->id);
    }

    // propagateAll clones the source over each target before Vizy reloads and
    // overlays target-local raw values. This is the destructive C6/C7 branch.
    $source = workshop16LocalizedEntry($source->id, $sites[0]->id);
    $source->setFieldValue(
        $schema['field']->handle,
        workshop16Document($schema, 'changed source', $relationA->id, $assetA->id, true),
    );
    $source->propagateAll = true;
    expect(Craft::$app->getElements()->saveElement($source, false, true))->toBeTrue();

    foreach ($sharedTargets as $index) {
        $target = workshop16LocalizedEntry($source->id, $sites[$index]->id);
        $document = $target->getFieldValue($schema['field']->handle);
        expect(array_map(static fn($block) => $block->uid(), $document->blocks(null)))->toBe([
            'parent-1',
            'child-2',
            'child-3',
        ])->and($document->findBlock('parent-1')->isEnabled())->toBeFalse()
            ->and($document->findBlock('child-2')->rawFieldValue($schema['childSlots']['plain']))->toBe("target{$index} child 2")
            ->and($document->findBlock('child-2')->rawFieldValue($schema['childSlots']['entries']))->toBe([$relationB->id])
            ->and($document->findBlock('child-2')->rawFieldValue($schema['childSlots']['assets']))->toBe([$assetB->id])
            ->and($document->findBlock('child-3')->rawFieldValue($schema['childSlots']['plain']))->toBe('changed source child 3')
            ->and($document->findBlock('child-1'))->toBeNull();
    }
    foreach ($independentTargets as $index) {
        expect(workshop16RawSiteContent($source->id, $sites[$index]->id))->toBe($before[$index]);
    }
})->with([
    'NONE shares every site and preserves SITE-local inner overlays' => [
        Field::TRANSLATION_METHOD_NONE, null, [1, 2, 3], [],
    ],
    'SITE isolates every other site byte-for-byte' => [
        Field::TRANSLATION_METHOD_SITE, null, [], [1, 2, 3],
    ],
    'SITE_GROUP shares only the matching group' => [
        Field::TRANSLATION_METHOD_SITE_GROUP, null, [1], [2, 3],
    ],
    'LANGUAGE shares only the matching language' => [
        Field::TRANSLATION_METHOD_LANGUAGE, null, [2], [1, 3],
    ],
    'CUSTOM site-group format is compatible on real owners' => [
        Field::TRANSLATION_METHOD_CUSTOM, '{site.groupId}', [1], [2, 3],
    ],
]);

it('overlays Plain Text Entries and Assets for every compatible inner translation partition', function(
    string $method,
    ?string $format,
    int $targetSiteIndex,
    bool $expectSource,
) {
    $sites = workshop16Sites();
    $schema = workshop16Schema(Field::TRANSLATION_METHOD_NONE, null, $method, $format);
    $relationA = VizyFixtureFactory::entry('W16 inner source relation');
    $relationB = VizyFixtureFactory::entry('W16 inner target relation');
    $assetA = AssetSpikeFixture::createTempAsset('w16-inner-source.txt', 'source');
    $assetB = AssetSpikeFixture::createTempAsset('w16-inner-target.txt', 'target');
    $sourceOwner = new Entry(['siteId' => $sites[0]->id]);
    $targetOwner = new Entry(['siteId' => $sites[$targetSiteIndex]->id]);
    $source = $schema['field']->normalizeValue(
        workshop16Document($schema, 'inner source', $relationA->id, $assetA->id),
        $sourceOwner,
    );
    $target = $schema['field']->normalizeValue(
        workshop16Document($schema, 'inner target', $relationB->id, $assetB->id),
        $targetOwner,
    );

    $merged = Vizy::$plugin->getMultisiteDocuments()->mergeForPropagation($source, $target);
    $child = $merged->findBlock('child-2');
    expect($child->rawFieldValue($schema['childSlots']['plain']))
        ->toBe(($expectSource ? 'inner source' : 'inner target') . ' child 2')
        ->and($child->rawFieldValue($schema['childSlots']['entries']))
        ->toBe([$expectSource ? $relationA->id : $relationB->id])
        ->and($child->rawFieldValue($schema['childSlots']['assets']))
        ->toBe([$expectSource ? $assetA->id : $assetB->id]);
})->with([
    'NONE shares across sites' => [Field::TRANSLATION_METHOD_NONE, null, 1, true],
    'SITE preserves target site' => [Field::TRANSLATION_METHOD_SITE, null, 1, false],
    'SITE_GROUP shares within group' => [Field::TRANSLATION_METHOD_SITE_GROUP, null, 1, true],
    'SITE_GROUP preserves another group' => [Field::TRANSLATION_METHOD_SITE_GROUP, null, 2, false],
    'LANGUAGE shares matching language' => [Field::TRANSLATION_METHOD_LANGUAGE, null, 2, true],
    'LANGUAGE preserves another language' => [Field::TRANSLATION_METHOD_LANGUAGE, null, 1, false],
    'CUSTOM group key shares compatible context' => [Field::TRANSLATION_METHOD_CUSTOM, '{site.groupId}', 1, true],
    'CUSTOM group key preserves other context' => [Field::TRANSLATION_METHOD_CUSTOM, '{site.groupId}', 2, false],
]);

it('rejects duplicate UIDs and reports a missing target instead of replacing content', function() {
    [$siteA, $siteB] = workshop16Sites();
    $schema = workshop16Schema(Field::TRANSLATION_METHOD_NONE);
    $field = $schema['field'];
    $duplicate = Json::decode(workshop16Document($schema, 'duplicate', 1, 1));
    $duplicate['content'][] = $duplicate['content'][0];

    $source = $field->normalizeValue($duplicate, new Entry(['siteId' => $siteA->id]));
    $target = $field->normalizeValue(
        workshop16Document($schema, 'target', 1, 1),
        new Entry(['siteId' => $siteB->id]),
    );
    expect(fn() => Vizy::$plugin->getMultisiteDocuments()->mergeForPropagation($source, $target))
        ->toThrow(RuntimeException::class, 'Duplicate Vizy Block UID');

    $source = $field->normalizeValue(
        workshop16Document($schema, 'source', 1, 1),
        new Entry(['siteId' => $siteA->id]),
    );
    expect(fn() => Vizy::$plugin->getMultisiteDocuments()->mergeForPropagation(
        $source,
        $target->recontextualize(null, $field),
    ))->toThrow(RuntimeException::class, 'exact owner context');
});

it('regenerates every nested UID once for a true Craft owner duplicate across localized copies', function() {
    $sites = workshop16Sites();
    $schema = workshop16Schema(Field::TRANSLATION_METHOD_NONE);
    $section = VizyFixtureFactory::multisiteSection($schema['field'], 4, $sites);
    $relation = VizyFixtureFactory::entry('W16 duplicate relation');
    $asset = AssetSpikeFixture::createTempAsset('w16-duplicate.txt', 'duplicate');
    $source = VizyFixtureFactory::entryOnSite(
        $section,
        $schema['field'],
        $sites[0],
        'W16 duplicate source',
        workshop16Document($schema, 'source', $relation->id, $asset->id),
    );

    $duplicate = Craft::$app->getElements()->duplicateElement($source, [
        'title' => 'W16 duplicated owner',
        'slug' => 'w16-duplicated-owner-' . StringHelper::randomString(5),
    ]);
    $sourceUids = array_map(
        static fn($block) => $block->uid(),
        workshop16LocalizedEntry($source->id, $sites[0]->id)->getFieldValue($schema['field']->handle)->blocks(),
    );
    $localizedUidSets = [];
    foreach ($sites as $site) {
        $copy = workshop16LocalizedEntry($duplicate->id, $site->id);
        $localizedUidSets[] = array_map(
            static fn($block) => $block->uid(),
            $copy->getFieldValue($schema['field']->handle)->blocks(),
        );
    }

    expect($localizedUidSets[0])->not->toBe($sourceUids)
        ->and($localizedUidSets[0])->toHaveCount(count($sourceUids))
        ->and(array_unique($localizedUidSets[0]))->toHaveCount(count($sourceUids));
    foreach ($localizedUidSets as $uids) {
        expect($uids)->toBe($localizedUidSets[0]);
    }
});

it('preserves nested identities through provisional and named drafts revisions and restore', function() {
    $sites = workshop16Sites();
    $schema = workshop16Schema(Field::TRANSLATION_METHOD_NONE);
    $section = VizyFixtureFactory::multisiteSection($schema['field'], 4, $sites);
    $section->enableVersioning = true;
    expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();
    $user = AssetSpikeFixture::ensureAdminUser();
    $relation = VizyFixtureFactory::entry('W16 derivative relation');
    $asset = AssetSpikeFixture::createTempAsset('w16-derivative.txt', 'derivative');
    $source = VizyFixtureFactory::entryOnSite(
        $section,
        $schema['field'],
        $sites[0],
        'W16 derivatives',
        workshop16Document($schema, 'original', $relation->id, $asset->id),
    );
    $uids = array_map(
        static fn($block) => $block->uid(),
        $source->getFieldValue($schema['field']->handle)->blocks(),
    );

    $provisional = Craft::$app->getDrafts()->createDraft(
        $source,
        $user->id,
        provisional: true,
    );
    $named = Craft::$app->getDrafts()->createDraft(
        $source,
        $user->id,
        'W16 named draft',
    );
    $revisionId = Craft::$app->getRevisions()->createRevision($source, $user->id, force: true);
    $revision = Entry::find()
        ->id($revisionId)
        ->siteId($sites[0]->id)
        ->revisions()
        ->status(null)
        ->one();

    foreach ([$provisional, $named, $revision] as $derivative) {
        expect($derivative)->toBeInstanceOf(Entry::class)
            ->and(array_map(
                static fn($block) => $block->uid(),
                $derivative->getFieldValue($schema['field']->handle)->blocks(),
            ))->toBe($uids);
    }

    $source = workshop16LocalizedEntry($source->id, $sites[0]->id);
    $source->setFieldValue(
        $schema['field']->handle,
        workshop16Document($schema, 'new canonical', $relation->id, $asset->id, true),
    );
    expect(Craft::$app->getElements()->saveElement($source, false, false))->toBeTrue();
    $restored = Craft::$app->getRevisions()->revertToRevision($revision, $user->id);

    expect(array_map(
        static fn($block) => $block->uid(),
        $restored->getFieldValue($schema['field']->handle)->blocks(),
    ))->toBe($uids);
});

it('rolls back source and sibling targets when a real propagation target save fails then retries', function() {
    $sites = workshop16Sites();
    $schema = workshop16Schema(Field::TRANSLATION_METHOD_NONE);
    $section = VizyFixtureFactory::multisiteSection($schema['field'], 4, $sites);
    $relation = VizyFixtureFactory::entry('W16 rollback relation');
    $initialAsset = AssetSpikeFixture::createTempAsset('w16-rollback-initial.txt', 'initial');
    $source = VizyFixtureFactory::entryOnSite(
        $section,
        $schema['field'],
        $sites[0],
        'W16 rollback source',
        workshop16Document($schema, 'before failure', $relation->id, $initialAsset->id),
    );
    $before = [];
    foreach ($sites as $site) {
        $before[$site->id] = workshop16RawSiteContent($source->id, $site->id);
    }

    $retryAsset = AssetSpikeFixture::createTempAsset('w16-rollback-retry.txt', 'retry');
    $source = workshop16LocalizedEntry($source->id, $sites[0]->id);
    $source->setFieldValue(
        $schema['field']->handle,
        workshop16Document($schema, 'after retry', $relation->id, $retryAsset->id, true),
    );
    $source->propagateAll = true;
    $batchesBefore = (int)\verbb\vizy\records\AssetUploadBatch::find()->count();
    $targetSiteId = $sites[1]->id;
    $injected = 0;
    $handler = static function(ModelEvent $event) use ($source, $targetSiteId, &$injected): void {
        $entry = $event->sender;
        if ($entry instanceof Entry && $entry->id === $source->id && $entry->siteId === $targetSiteId) {
            $injected++;
            $entry->addError('title', 'Injected target propagation failure.');
            $event->isValid = false;
        }
    };
    Event::on(Entry::class, Entry::EVENT_BEFORE_SAVE, $handler);
    try {
        try {
            $saved = Craft::$app->getElements()->saveElement($source, false, true);
        } catch (Throwable) {
            $saved = false;
        }
    } finally {
        Event::off(Entry::class, Entry::EVENT_BEFORE_SAVE, $handler);
    }

    expect($injected)->toBe(1)
        ->and($saved)->toBeFalse();
    foreach ($sites as $site) {
        expect(workshop16RawSiteContent($source->id, $site->id))->toBe($before[$site->id]);
    }
    expect(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($retryAsset->id)))->toBeTrue()
        ->and(\verbb\vizy\records\AssetUploadBatch::find()->count())->toBe($batchesBefore);

    $retry = workshop16LocalizedEntry($source->id, $sites[0]->id);
    $retry->setFieldValue(
        $schema['field']->handle,
        workshop16Document($schema, 'after retry', $relation->id, $retryAsset->id, true),
    );
    $retry->propagateAll = true;
    expect(Craft::$app->getElements()->saveElement($retry, false, true))->toBeTrue()
        ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($retryAsset->id)))->toBeFalse();
    foreach (array_slice($sites, 1) as $site) {
        $target = workshop16LocalizedEntry($retry->id, $site->id);
        expect(array_map(static fn($block) => $block->uid(), $target->getFieldValue($schema['field']->handle)->blocks(null)))
            ->toBe(['parent-1', 'child-2', 'child-3']);
    }
});
