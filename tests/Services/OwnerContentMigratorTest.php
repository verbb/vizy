<?php

declare(strict_types=1);

use craft\db\Query;
use craft\elements\Entry;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\db\Table;
use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;

it('installs durable owner migration checkpoints', function() {
    expect(Craft::$app->getDb()->tableExists(Table::OWNER_MIGRATIONS))->toBeTrue();
});

it('requires an actual canonical write before verifying a resumed migration', function(string $state) {
    $field = VizyFixtureFactory::vizyField();
    $owner = VizyFixtureFactory::entry('Resume storage ' . StringHelper::randomString(8));
    Vizy::$plugin->getLegacySchemaMaps()->saveProvenance($field->uid, [
        'fieldUid' => $field->uid,
        'sourceFingerprint' => 'resume-storage-fixture',
        'schemaMap' => [],
        'canonicalFieldSettings' => ['rootContentType' => 'rich'],
    ]);
    $placementUid = $owner->getFieldLayout()->getCustomFieldElements()[0]->uid;
    $legacy = Json::encode([['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Legacy content']]]]);
    $condition = ['elementId' => $owner->id, 'siteId' => $owner->siteId];
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', ['content' => [$placementUid => $legacy]], $condition)->execute();
    $read = static function() use ($condition, $placementUid) {
        $content = (new Query())->select('content')->from('{{%elements_sites}}')->where($condition)->scalar();
        $content = is_string($content) ? Json::decode($content) : $content;
        return $content[$placementUid];
    };
    $owner = Entry::find()->id($owner->id)->siteId($owner->siteId)->status(null)->one();
    $mapping = ['revision' => 'resume-storage', 'schemaMap' => []];
    $migrator = Vizy::$plugin->getOwnerContentMigrator();
    $analysis = $migrator->analyzeOwner($owner, $field, $mapping, StringHelper::UUID());
    expect($analysis['state'])->toBe('ready');
    $checkpoint = \verbb\vizy\records\OwnerMigration::findOne($analysis['id']);
    if ($state === 'legacy-ready') {
        $checkpoint->ownerPlacementUid = null;
        expect($checkpoint->save())->toBeTrue();
    } elseif ($state !== 'ready') {
        // Simulate interrupted bookkeeping before a write, or a bad persisted marker.
        $checkpoint->state = $state;
        expect($checkpoint->save())->toBeTrue();
    }
    if (in_array($state, ['ready', 'legacy-ready'], true)) {
        expect(fn() => $migrator->resume((int)$checkpoint->id))->toThrow(RuntimeException::class, 'original approved mapping');
        expect($read())->toBe($legacy)
            ->and(\verbb\vizy\records\OwnerMigration::findOne($checkpoint->id)->state)->toBe('ready');
        $result = $migrator->migrateOwner($owner, $field, $mapping, true, $analysis['runUid']);
    } else {
        $result = $migrator->resume((int)$checkpoint->id);
    }
    if ($state === 'persisted') {
        expect($result['state'])->toBe('failed')
            ->and($result['errors'][0]['code'])->toBe('verificationFailed')
            ->and($read())->toBe($legacy);
    } else {
        $stored = $read();
        $stored = is_string($stored) ? Json::decode($stored) : $stored;
        expect($result['state'])->toBe('verified', Json::encode($result))
            ->and($result['id'])->toBe($analysis['id'])
            ->and($result['attempts'])->toBe(1)
            ->and($stored['type'])->toBe('doc')
            ->and($stored['attrs']['schemaVersion'])->toBe(2)
            ->and($stored['content'][0]['content'][0]['text'])->toBe('Legacy content');
    }
})->with(['ready', 'persisting', 'persisted', 'legacy-ready']);

it('fails Nested Vizy → Content Area owner migrations as retired', function() {
    $field = VizyFixtureFactory::vizyField();
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $owner = VizyFixtureFactory::entry('Retired nested owner migrator');

    $result = Vizy::$plugin->getOwnerContentMigrator()->migrateOwner(
        $owner,
        $field,
        [
            'revision' => 'retired-nested',
            'nested' => ['schemaMap' => []],
            'matrices' => [],
        ],
        false,
        StringHelper::UUID(),
    );

    expect($result['state'])->toBe('failed')
        ->and(implode(' ', array_column($result['errors'], 'message')))
        ->toContain('Nested Vizy → Content Area migration is retired');
});

it('fails Matrix → Content Area owner migrations as retired', function() {
    $field = VizyFixtureFactory::vizyField();
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $owner = VizyFixtureFactory::entry('Retired matrix owner migrator');

    $result = Vizy::$plugin->getOwnerContentMigrator()->migrateOwner(
        $owner,
        $field,
        [
            'revision' => 'retired-matrix',
            'matrices' => [['placementUid' => StringHelper::UUID()]],
        ],
        false,
        StringHelper::UUID(),
    );

    expect($result['state'])->toBe('failed')
        ->and(implode(' ', array_column($result['errors'], 'message')))
        ->toContain('Matrix → Content Area migration is retired');
});

it('leaf-promotes a bare Vizy 3 owner list through analyze → apply → verify', function() {
    $fieldUid = StringHelper::UUID();
    $innerFieldUid = StringHelper::UUID();
    $legacyTypeId = 'type-leaf-card';
    $layoutUid = StringHelper::UUID();
    $placementUid = StringHelper::UUID();
    $tabUid = StringHelper::UUID();
    $handle = 'leafCard' . StringHelper::randomString(5);

    $fields = [
        $innerFieldUid => [
            'type' => \craft\fields\PlainText::class,
            'name' => 'Heading',
            'handle' => 'heading',
            'translationMethod' => 'none',
                'translationKeyFormat' => null,
                'instructions' => null,
            'settings' => [],
        ],
        $fieldUid => [
            'type' => VizyField::class,
            'name' => 'Body',
            'handle' => 'body' . StringHelper::randomString(4),
            'translationMethod' => 'none',
                'translationKeyFormat' => null,
                'instructions' => null,
            'settings' => [
                'editorMode' => VizyField::MODE_COMBINED,
                'vizyConfig' => 'standard',
                'fieldData' => [[
                    'name' => 'Content',
                    'blockTypes' => [[
                        'id' => $legacyTypeId,
                        'name' => 'Card',
                        'handle' => $handle,
                        'enabled' => true,
                        'layoutUid' => $layoutUid,
                        'layoutConfig' => [
                            'uid' => $layoutUid,
                            'tabs' => [[
                                'uid' => $tabUid,
                                'name' => 'Content',
                                'elements' => [[
                                    'type' => \craft\fieldlayoutelements\CustomField::class,
                                    'uid' => $placementUid,
                                    'fieldUid' => $innerFieldUid,
                                ]],
                            ]],
                        ],
                    ]],
                ]],
            ],
        ],
    ];

    $projectConfig = Craft::$app->getProjectConfig();
    foreach ($fields as $uid => $config) {
        $projectConfig->set("fields.{$uid}", $config);
    }
    Craft::$app->getFields()->refreshFields();

    $orchestrator = Vizy::$plugin->getPromotionOrchestrator();
    $plan = $orchestrator->analyze();
    expect($plan['status'])->toBe('ready', Json::encode($plan['diagnostics'] ?? []));

    $promoted = $orchestrator->apply(
        $plan,
        ['complete' => true, 'jobs' => []],
    );
    expect($promoted['status'])->toBe('complete', Json::encode($promoted));

    /** @var VizyField $field */
    $field = Craft::$app->getFields()->getFieldByUid($fieldUid);
    expect($field)->toBeInstanceOf(VizyField::class)
        ->and($field->getLegacySchemaMap())->toBeArray();

    $section = VizyFixtureFactory::multisiteSection($field, 1);
    $site = Craft::$app->getSites()->getPrimarySite();

    // Mid-request field creation: register the handle so setFieldValue persists.
    \craft\behaviors\CustomFieldBehavior::$fieldHandles[$field->handle] = true;

    $owner = VizyFixtureFactory::entryOnSite(
        $section,
        $field,
        $site,
        'Leaf owner ' . StringHelper::randomString(4),
        VizyFixtureFactory::paragraphDocument('placeholder before leaf inject'),
    );

    // Placement UIDs must come from the saved entry-type layout (not a stale
    // in-memory element missing Craft-assigned uids).
    $entryType = Craft::$app->getEntries()->getEntryTypeById($owner->typeId);
    $ownerPlacementUid = null;
    foreach ($entryType->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
        if ($placement->getField()->uid === $field->uid) {
            $ownerPlacementUid = $placement->uid;
            break;
        }
    }
    expect($ownerPlacementUid)->toMatch('/^[0-9a-f-]{36}$/i');

    $legacyBareList = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => 'leaf-block-1',
            'enabled' => true,
            'values' => [
                'type' => $legacyTypeId,
                'content' => ['fields' => ['heading' => 'Leaf heading']],
            ],
        ],
    ]];

    // Inject exact Vizy 3 storage under the layout placement (bypass normalize).
    $row = (new Query())
        ->select(['id', 'content'])
        ->from('{{%elements_sites}}')
        ->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])
        ->one();
    expect($row)->toBeArray();
    $siteContent = is_string($row['content'] ?? null)
        ? Json::decode((string)$row['content'])
        : ($row['content'] ?? []);
    if (!is_array($siteContent)) {
        $siteContent = [];
    }
    $siteContent[$ownerPlacementUid] = Json::encode($legacyBareList);
    // Write the content map as an array; the JSON column encoder owns serialization.
    // Pre-encoding here double-wraps and breaks later reads.
    Craft::$app->getDb()->createCommand()
        ->update('{{%elements_sites}}', ['content' => $siteContent], ['id' => (int)$row['id']])
        ->execute();

    $recheckRaw = (new Query())
        ->select(['content'])
        ->from('{{%elements_sites}}')
        ->where(['id' => (int)$row['id']])
        ->scalar();
    $recheck = is_string($recheckRaw) ? Json::decode($recheckRaw) : $recheckRaw;
    if (is_string($recheck)) {
        $recheck = Json::decode($recheck);
    }
    expect($recheck)->toBeArray()
        ->and($recheck)->toHaveKey($ownerPlacementUid);

    $owner = Entry::find()->id($owner->id)->siteId($owner->siteId)->status(null)->one();
    expect($owner)->toBeInstanceOf(Entry::class);
    $schemaMap = Vizy::$plugin->getLegacySchemaMaps()->getSchemaMap($field->uid);
    $mapping = [
        'revision' => 'leaf-b1',
        'schemaMap' => $schemaMap,
    ];

    $analyzed = Vizy::$plugin->getOwnerContentMigrator()->analyzeOwner(
        $owner,
        $field,
        $mapping,
        StringHelper::UUID(),
    );
    expect($analyzed['state'])->toBe('ready', Json::encode($analyzed))
        ->and($analyzed['verification']['transform']['path'] ?? null)->toBe('leaf')
        ->and($analyzed['verification']['transform']['sourceShape'] ?? null)->toBe('bareList');

    $applied = Vizy::$plugin->getOwnerContentMigrator()->migrateOwner(
        Entry::find()->id($owner->id)->siteId($owner->siteId)->status(null)->one(),
        $field,
        $mapping,
        true,
        $analyzed['runUid'],
    );
    expect($applied['state'])->toBe('verified', Json::encode($applied));

    $reloaded = Entry::find()->id($owner->id)->siteId($owner->siteId)->status(null)->one();
    $document = $reloaded->getFieldValue($field->handle);
    $canonicalPlacement = $schemaMap[$legacyTypeId]['placementUids']['heading'];

    expect($document)->toBeInstanceOf(\verbb\vizy\document\VizyDocument::class)
        ->and($document->schemaVersion())->toBe(\verbb\vizy\document\VizyDocument::CURRENT_SCHEMA_VERSION)
        ->and($document->findBlock('leaf-block-1')->rawFieldValue($canonicalPlacement))->toBe('Leaf heading');
});

it('resumes a persisting checkpoint when live content already matches the candidate', function() {
    $fieldUid = StringHelper::UUID();
    $innerFieldUid = StringHelper::UUID();
    $legacyTypeId = 'type-leaf-resume';
    $layoutUid = StringHelper::UUID();
    $placementUid = StringHelper::UUID();
    $tabUid = StringHelper::UUID();
    $handle = 'leafResume' . StringHelper::randomString(5);

    $fields = [
        $innerFieldUid => [
            'type' => \craft\fields\PlainText::class,
            'name' => 'Heading',
            'handle' => 'heading',
            'translationMethod' => 'none',
                'translationKeyFormat' => null,
                'instructions' => null,
            'settings' => [],
        ],
        $fieldUid => [
            'type' => VizyField::class,
            'name' => 'Body',
            'handle' => 'body' . StringHelper::randomString(4),
            'translationMethod' => 'none',
                'translationKeyFormat' => null,
                'instructions' => null,
            'settings' => [
                'editorMode' => VizyField::MODE_COMBINED,
                'vizyConfig' => 'standard',
                'fieldData' => [[
                    'name' => 'Content',
                    'blockTypes' => [[
                        'id' => $legacyTypeId,
                        'name' => 'Card',
                        'handle' => $handle,
                        'enabled' => true,
                        'layoutUid' => $layoutUid,
                        'layoutConfig' => [
                            'uid' => $layoutUid,
                            'tabs' => [[
                                'uid' => $tabUid,
                                'name' => 'Content',
                                'elements' => [[
                                    'type' => \craft\fieldlayoutelements\CustomField::class,
                                    'uid' => $placementUid,
                                    'fieldUid' => $innerFieldUid,
                                ]],
                            ]],
                        ],
                    ]],
                ]],
            ],
        ],
    ];

    $projectConfig = Craft::$app->getProjectConfig();
    foreach ($fields as $uid => $config) {
        $projectConfig->set("fields.{$uid}", $config);
    }
    Craft::$app->getFields()->refreshFields();

    $orchestrator = Vizy::$plugin->getPromotionOrchestrator();
    $plan = $orchestrator->analyze();
    expect($plan['status'])->toBe('ready', Json::encode($plan['diagnostics'] ?? []));
    $promoted = $orchestrator->apply(
        $plan,
        ['complete' => true, 'jobs' => []],
    );
    expect($promoted['status'])->toBe('complete', Json::encode($promoted));

    /** @var VizyField $field */
    $field = Craft::$app->getFields()->getFieldByUid($fieldUid);
    expect($field)->toBeInstanceOf(VizyField::class);

    $section = VizyFixtureFactory::multisiteSection($field, 1);
    $site = Craft::$app->getSites()->getPrimarySite();
    \craft\behaviors\CustomFieldBehavior::$fieldHandles[$field->handle] = true;

    $owner = VizyFixtureFactory::entryOnSite(
        $section,
        $field,
        $site,
        'Resume owner ' . StringHelper::randomString(4),
        VizyFixtureFactory::paragraphDocument('placeholder before leaf inject'),
    );

    $entryType = Craft::$app->getEntries()->getEntryTypeById($owner->typeId);
    $ownerPlacementUid = null;
    foreach ($entryType->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
        if ($placement->getField()->uid === $field->uid) {
            $ownerPlacementUid = $placement->uid;
            break;
        }
    }
    expect($ownerPlacementUid)->toMatch('/^[0-9a-f-]{36}$/i');

    $legacyBareList = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => 'leaf-resume-1',
            'enabled' => true,
            'values' => [
                'type' => $legacyTypeId,
                'content' => ['fields' => ['heading' => 'Resume heading']],
            ],
        ],
    ]];

    $row = (new Query())
        ->select(['id', 'content'])
        ->from('{{%elements_sites}}')
        ->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])
        ->one();
    expect($row)->toBeArray();
    $siteContent = is_string($row['content'] ?? null)
        ? Json::decode((string)$row['content'])
        : ($row['content'] ?? []);
    if (!is_array($siteContent)) {
        $siteContent = [];
    }
    $siteContent[$ownerPlacementUid] = Json::encode($legacyBareList);
    Craft::$app->getDb()->createCommand()
        ->update('{{%elements_sites}}', ['content' => $siteContent], ['id' => (int)$row['id']])
        ->execute();

    $owner = Entry::find()->id($owner->id)->siteId($owner->siteId)->status(null)->one();
    $schemaMap = Vizy::$plugin->getLegacySchemaMaps()->getSchemaMap($field->uid);
    $mapping = [
        'revision' => 'leaf-resume-b1',
        'schemaMap' => $schemaMap,
    ];

    $analyzed = Vizy::$plugin->getOwnerContentMigrator()->analyzeOwner(
        $owner,
        $field,
        $mapping,
        StringHelper::UUID(),
    );
    expect($analyzed['state'])->toBe('ready', Json::encode($analyzed));

    $checkpoint = \verbb\vizy\records\OwnerMigration::findOne($analyzed['id']);
    expect($checkpoint)->not->toBeNull();

    // Simulate “Craft wrote candidate, process died before persisted marker”:
    // apply candidate to the owner, then leave the checkpoint in `persisting`.
    $candidateArray = Json::decode((string)$checkpoint->candidateJson);
    $candidate = (new \verbb\vizy\document\DocumentParser())->parse($candidateArray, $owner, $field);
    Vizy::$plugin->getContentBaselines()->trust($owner, $field, $candidate);
    try {
        $owner->setFieldValue($field->handle, $candidate);
        expect(Craft::$app->getElements()->saveElement($owner, true, false))->toBeTrue();
    } finally {
        Vizy::$plugin->getContentBaselines()->forget($owner, $field);
    }

    $checkpoint->state = 'persisting';
    $checkpoint->persistedAt = null;
    expect($checkpoint->save())->toBeTrue();

    $resumed = Vizy::$plugin->getOwnerContentMigrator()->resume((int)$checkpoint->id);
    expect($resumed['state'])->toBe('verified', Json::encode($resumed));

    $reloaded = Entry::find()->id($owner->id)->siteId($owner->siteId)->status(null)->one();
    $document = $reloaded->getFieldValue($field->handle);
    $canonicalPlacement = $schemaMap[$legacyTypeId]['placementUids']['heading'];
    expect($document)->toBeInstanceOf(\verbb\vizy\document\VizyDocument::class)
        ->and($document->findBlock('leaf-resume-1')->rawFieldValue($canonicalPlacement))->toBe('Resume heading');
});
