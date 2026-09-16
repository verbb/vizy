<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\helpers\Json;
use craft\helpers\ProjectConfig as ProjectConfigHelper;
use verbb\vizy\fields\VizyField;
use verbb\vizy\legacy\Vizy3DocumentAdapter;
use verbb\vizy\legacy\Vizy3SchemaPromotion;
use verbb\vizy\Vizy;

/**
 * @return array{fields:array<string,array<string,mixed>>,fieldUid:string,legacyTypeId:string,placementUid:string}
 */
function legacyPromotionFixture(
    string $handle = 'card',
    string $mode = VizyField::MODE_COMBINED,
    string $placedFieldType = PlainText::class,
    ?string $layoutUid = null,
    ?string $placementUid = null,
): array {
    $fieldUid = StringHelper::UUID();
    $innerFieldUid = StringHelper::UUID();
    $legacyTypeId = 'type-card';
    $layoutUid ??= StringHelper::UUID();
    $placementUid ??= StringHelper::UUID();
    $tabUid = StringHelper::UUID();
    return [
        'fieldUid' => $fieldUid,
        'legacyTypeId' => $legacyTypeId,
        'placementUid' => $placementUid,
        'fields' => [
            $innerFieldUid => [
                'type' => $placedFieldType,
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
                'handle' => 'body',
                'translationMethod' => 'none',
                'translationKeyFormat' => null,
                'instructions' => null,
                'settings' => [
                    'editorMode' => $mode,
                    'vizyConfig' => 'standard',
                    'minBlocks' => 1,
                    'maxBlocks' => 5,
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
                                        'type' => CustomField::class,
                                        'uid' => $placementUid,
                                        'fieldUid' => $innerFieldUid,
                                    ]],
                                ]],
                            ],
                        ]],
                    ]],
                ],
            ],
        ],
    ];
}

it('builds stable field-local promotion plans and exact placement maps', function() {
    $fixture = legacyPromotionFixture();
    $promotion = new Vizy3SchemaPromotion();
    $first = $promotion->analyze($fixture['fields']);
    $second = $promotion->analyze($fixture['fields']);
    $fieldPlan = $first['fields'][$fixture['fieldUid']];
    $mapping = $fieldPlan['schemaMap'][$fixture['legacyTypeId']];

    expect($first)->toBe($second)
        ->and($first['status'])->toBe('ready')
        ->and($fieldPlan['canonicalFieldSettings']['rootContentType'])->toBe(VizyField::ROOT_CONTENT_RICH)
        ->and($fieldPlan['canonicalFieldSettings']['blockTypePickerGroups'][0]['name'])->toBe('Content')
        ->and($mapping['blockTypeUid'])->toMatch('/^[0-9a-f-]{36}$/')
        ->and($mapping['placementUids'][$fixture['placementUid']])->toBe($fixture['placementUid'])
        ->and($mapping['placementUids']['heading'])->toBe($fixture['placementUid'])
        ->and($fieldPlan['blockTypes'][$fixture['legacyTypeId']]['config']['fieldLayout']['uid'])
        ->toBe($fixture['fields'][$fixture['fieldUid']]['settings']['fieldData'][0]['blockTypes'][0]['layoutUid']);
});

it('maps explicit root policy and rich-text-only allowances without guessing', function() {
    $blocks = legacyPromotionFixture('blocksCard', VizyField::MODE_BLOCKS);
    $richText = legacyPromotionFixture('richCard', VizyField::MODE_RICH_TEXT);
    $promotion = new Vizy3SchemaPromotion();

    $blocksPlan = $promotion->analyze($blocks['fields'])['fields'][$blocks['fieldUid']];
    $richPlan = $promotion->analyze($richText['fields'])['fields'][$richText['fieldUid']];

    expect($blocksPlan['canonicalFieldSettings']['rootContentType'])->toBe(VizyField::ROOT_CONTENT_BLOCKS)
        ->and($blocksPlan['canonicalFieldSettings']['blockTypePickerGroups'])->toHaveCount(1)
        ->and($richPlan['canonicalFieldSettings']['rootContentType'])->toBe(VizyField::ROOT_CONTENT_RICH)
        ->and($richPlan['canonicalFieldSettings']['blockTypePickerGroups'])->toBe([]);
});

it('retains disabled legacy types for existing content while excluding new insertion', function() {
    $fixture = legacyPromotionFixture();
    $fixture['fields'][$fixture['fieldUid']]['settings']['fieldData'][0]['blockTypes'][0]['enabled'] = false;
    $plan = (new Vizy3SchemaPromotion())->analyze($fixture['fields']);
    $fieldPlan = $plan['fields'][$fixture['fieldUid']];
    $uid = $fieldPlan['schemaMap'][$fixture['legacyTypeId']]['blockTypeUid'];
    $field = new VizyField($fieldPlan['canonicalFieldSettings']);
    expect($plan['status'])->toBe('ready')
        ->and($field->getAllowedBlockTypeUids())->toBe([$uid])
        ->and($field->getDisabledBlockTypeUids())->toBe([$uid])
        ->and($field->getInsertableBlockTypeUids())->toBe([]);
});

it('blocks global handle collisions until explicit unique mappings are supplied', function() {
    $a = legacyPromotionFixture('shared');
    $b = legacyPromotionFixture('shared');
    $fields = $a['fields'] + $b['fields'];
    $promotion = new Vizy3SchemaPromotion();
    $blocked = $promotion->analyze($fields);
    $resolved = $promotion->analyze($fields, [], [
        "{$a['fieldUid']}:{$a['legacyTypeId']}" => 'sharedA',
        "{$b['fieldUid']}:{$b['legacyTypeId']}" => 'sharedB',
    ]);

    expect($blocked['status'])->toBe('blocked')
        ->and(array_column($blocked['diagnostics'], 'code'))->toContain('globalHandleCollision')
        ->and($resolved['status'])->toBe('ready');
});

it('grandfathers Matrix placements during schema promotion (MatrixAnchor runtime)', function() {
    $fixture = legacyPromotionFixture('matrixOk', VizyField::MODE_COMBINED, Matrix::class);
    $report = (new Vizy3SchemaPromotion())->analyze($fixture['fields']);
    $codes = array_column($report['diagnostics'], 'code');

    expect($codes)->toContain('matrixAnchorGrandfathered')
        ->and($codes)->not->toContain('matrixMigrationRequired')
        ->and($report['status'])->not->toBe('blocked');
});

it('reports deterministic identity repair and unsupported field types', function() {
    $fixture = legacyPromotionFixture('specialCard', VizyField::MODE_COMBINED, '', 'invalid-layout', 'heading-key');
    $report = (new Vizy3SchemaPromotion())->analyze($fixture['fields']);
    $codes = array_column($report['diagnostics'], 'code');

    expect($report['status'])->toBe('blocked')
        ->and($codes)->toContain('generatedLayoutUid')
        ->and($codes)->toContain('generatedPlacementUid')
        ->and($codes)->toContain('unsupportedField')
        ->and($report)->toBe((new Vizy3SchemaPromotion())->analyze($fixture['fields']));
});

it('allows nested Vizy placements during schema promotion (Hosted is runtime)', function() {
    $fixture = legacyPromotionFixture('nestedOk', VizyField::MODE_COMBINED, VizyField::class);
    // Nested Vizy is its own Craft field — empty fieldData is a valid rich-only promote.
    foreach ($fixture['fields'] as $uid => &$config) {
        if ($uid !== $fixture['fieldUid'] && ($config['type'] ?? null) === VizyField::class) {
            $config['settings']['fieldData'] = [];
            $config['settings']['editorMode'] = VizyField::MODE_RICH_TEXT;
        }
    }
    unset($config);

    $report = (new Vizy3SchemaPromotion())->analyze($fixture['fields']);
    $codes = array_column($report['diagnostics'], 'code');

    expect($codes)->not->toContain('nestedVizyMigrationRequired')
        ->and($report['status'])->toBe('ready', Json::encode($report['diagnostics']));
});

it('passes nested Vizy bare node lists through for runtime convert', function(mixed $nestedValue) {
    $fixture = legacyPromotionFixture();
    $plan = (new Vizy3SchemaPromotion())->analyze($fixture['fields'])['fields'][$fixture['fieldUid']];
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => 'nested-parent',
            'values' => [
                'type' => $fixture['legacyTypeId'],
                'content' => ['fields' => ['heading' => $nestedValue]],
            ],
        ],
    ]];

    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, $plan['schemaMap']);
    $placement = $plan['schemaMap'][$fixture['legacyTypeId']]['placementUids']['heading'];

    expect($canonical['content'][0]['attrs']['fieldSlots'][$placement])->toEqual($nestedValue);
})->with([
    'JSON node list' => [json_encode([['type' => 'paragraph', 'content' => []]])],
    'array node list' => [[['type' => 'paragraph', 'content' => []]]],
]);

it('round-trips immutable provenance and production normalization loads it lazily', function() {
    $fixture = legacyPromotionFixture('provenanceCard' . StringHelper::randomString(5));
    $report = (new Vizy3SchemaPromotion())->analyze($fixture['fields']);
    $plan = $report['fields'][$fixture['fieldUid']];
    $maps = Vizy::$plugin->getLegacySchemaMaps();
    $maps->saveProvenance($fixture['fieldUid'], $plan);
    $maps->saveProvenance($fixture['fieldUid'], $plan);

    $loaded = $maps->getProvenance($fixture['fieldUid']);
    $field = new VizyField([
        'uid' => $fixture['fieldUid'],
        'name' => 'Legacy body',
        'handle' => 'legacyBody',
    ]);
    $owner = new Entry(['title' => 'Legacy owner']);
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => 'legacy-block',
            'values' => [
                'type' => $fixture['legacyTypeId'],
                'content' => ['fields' => ['heading' => 'Promoted']],
            ],
        ],
    ]];
    $document = Vizy::$plugin->getDocuments()->normalizeValue($legacy, $owner, $field);
    $canonicalPlacement = $loaded['schemaMap'][$fixture['legacyTypeId']]['placementUids']['heading'];

    expect($field->getLegacySchemaMap())->toBe($loaded['schemaMap'])
        ->and($document->findBlock('legacy-block')->rawFieldValue($canonicalPlacement))->toBe('Promoted')
        ->and($field->getSettings())->not->toHaveKey('fieldData')
        ->and(fn() => $maps->saveProvenance($fixture['fieldUid'], [
            ...$plan,
            'sourceFingerprint' => 'different',
        ]))->toThrow(RuntimeException::class, 'immutable');
});

it('normalizes a prose-only Vizy 3 value through persisted empty provenance', function() {
    $fixture = legacyPromotionFixture('proseOnly');
    $fixture['fields'][$fixture['fieldUid']]['settings']['fieldData'] = [];
    $plan = (new Vizy3SchemaPromotion())->analyze($fixture['fields'])['fields'][$fixture['fieldUid']];
    Vizy::$plugin->getLegacySchemaMaps()->saveProvenance($fixture['fieldUid'], $plan);
    $field = new VizyField([
        'uid' => $fixture['fieldUid'],
        'name' => 'Prose',
        'handle' => 'prose',
    ]);
    $document = Vizy::$plugin->getDocuments()->normalizeValue(
        [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Legacy prose']]]],
        new Entry(['title' => 'Prose owner']),
        $field,
    );

    expect($document->content()->nodes()[0]['content'][0]['text'])->toBe('Legacy prose')
        ->and($field->getLegacySchemaMap())->toBe([]);
});

it('treats Project Config-omitted empty schemaMap as [] when provenance exists', function() {
    $fieldUid = StringHelper::UUID();
    // Craft often drops empty arrays from Project Config — rich-only provenance may lack schemaMap.
    Craft::$app->getProjectConfig()->set(
        \verbb\vizy\legacy\LegacySchemaMaps::PROJECT_CONFIG_PATH . '.' . $fieldUid,
        [
            'version' => 1,
            'sourceFingerprint' => 'pc-omit-schema-map',
            'rootPolicy' => 'rich',
        ],
    );

    $maps = Vizy::$plugin->getLegacySchemaMaps();
    $field = new VizyField(['uid' => $fieldUid, 'name' => 'Prose', 'handle' => 'proseOmit']);

    expect($maps->getSchemaMap($fieldUid))->toBe([])
        ->and($field->getLegacySchemaMap())->toBe([])
        ->and($maps->getProvenance($fieldUid)['schemaMap'])->toBe([]);

    $document = Vizy::$plugin->getDocuments()->normalizeValue(
        [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Still converts']]]],
        new Entry(['title' => 'Omit owner']),
        $field,
    );
    expect($document->content()->nodes()[0]['content'][0]['text'])->toBe('Still converts');
});

it('refuses production legacy reads when field provenance is absent', function() {
    $field = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Unpromoted',
        'handle' => 'unpromoted',
    ]);

    expect(fn() => Vizy::$plugin->getDocuments()->normalizeValue(
        [['type' => 'paragraph', 'content' => []]],
        new Entry(['title' => 'Unpromoted owner']),
        $field,
    ))->toThrow(\verbb\vizy\document\InvalidDocumentException::class, 'has not been upgraded to Vizy 4 yet');
});

it('applies global schema provenance and canonical field references through resumable verified stages', function() {
    $fixture = legacyPromotionFixture('orderedApply' . StringHelper::randomString(5));
    // A real template path exercises slash encoding in analyze/apply fingerprints.
    $fixture['fields'][$fixture['fieldUid']]['settings']['fieldData'][0]['blockTypes'][0]['template'] = '_blocks/cards/feature';
    $projectConfig = Craft::$app->getProjectConfig();
    foreach ($fixture['fields'] as $uid => $config) {
        $projectConfig->set("fields.{$uid}", $config);
    }
    Craft::$app->getFields()->refreshFields();

    $orchestrator = Vizy::$plugin->getPromotionOrchestrator();
    $plan = $orchestrator->analyze();
    expect($plan['status'])->toBe('ready', json_encode($plan['diagnostics']));
    $targetUid = $plan['fields'][$fixture['fieldUid']]['schemaMap'][$fixture['legacyTypeId']]['blockTypeUid'];

    $interrupted = false;
    $orchestrator->setStageProbeForTesting(function(string $stage) use (&$interrupted): void {
        if ($stage === 'canonicalFields' && !$interrupted) {
            $interrupted = true;
            throw new RuntimeException('injected promotion interruption');
        }
    });
    $failed = $orchestrator->apply(
        $plan,
        ['complete' => true, 'jobs' => []],
        \verbb\vizy\legacy\Vizy3PromotionOrchestrator::CONFIRMATION,
    );
    $orchestrator->setStageProbeForTesting(null);

    expect($failed['status'])->toBe('failed')
        ->and($failed['stage'])->toBe('editorConfigs', json_encode($failed))
        ->and($failed['lastError'])->toContain('injected promotion interruption')
        ->and(Craft::$app->getProjectConfig()->get("plugins.vizy.blockTypes.{$targetUid}"))->toBeArray()
        ->and(\verbb\vizy\records\BlockType::findOne(['uid' => $targetUid])->fieldLayoutId)->toBeGreaterThan(0);

    $complete = $orchestrator->resume(
        $failed['runUid'],
        \verbb\vizy\legacy\Vizy3PromotionOrchestrator::CONFIRMATION,
    );
    $fieldConfig = ProjectConfigHelper::unpackAssociativeArrays(
        Craft::$app->getProjectConfig()->get("fields.{$fixture['fieldUid']}")
    );
    expect($complete['status'])->toBe('complete', json_encode($complete))
        ->and($complete['stage'])->toBe('verified')
        ->and($complete['sourceDeletionAuthorized'])->toBeFalse()
        ->and($fieldConfig['settings']['blockTypePickerGroups'])->not->toBeEmpty()
        ->and($fieldConfig['settings']['fieldData'])->not->toBeEmpty()
        ->and(Vizy::$plugin->getLegacySchemaMaps()->getProvenance($fixture['fieldUid'])['sourceFingerprint'])
        ->toBe($plan['fields'][$fixture['fieldUid']]['sourceFingerprint']);
});

it('rejects stale promotion plans before any new stage is recorded', function() {
    $fixture = legacyPromotionFixture('staleApply' . StringHelper::randomString(5));
    $projectConfig = Craft::$app->getProjectConfig();
    foreach ($fixture['fields'] as $uid => $config) {
        $projectConfig->set("fields.{$uid}", $config);
    }
    $plan = Vizy::$plugin->getPromotionOrchestrator()->analyze();
    $config = $fixture['fields'][$fixture['fieldUid']];
    $config['settings']['fieldData'][0]['name'] = 'Externally changed';
    $projectConfig->set(
        "fields.{$fixture['fieldUid']}",
        $config,
    );

    expect(fn() => Vizy::$plugin->getPromotionOrchestrator()->apply(
        $plan,
        ['complete' => true, 'jobs' => []],
        \verbb\vizy\legacy\Vizy3PromotionOrchestrator::CONFIRMATION,
    ))->toThrow(RuntimeException::class, 'changed after analysis');
});

it('rejects old dual keys that would overwrite one canonical placement', function() {
    $fixture = legacyPromotionFixture();
    $plan = (new Vizy3SchemaPromotion())->analyze($fixture['fields'])['fields'][$fixture['fieldUid']];
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => 'dual-key-block',
            'values' => [
                'type' => $fixture['legacyTypeId'],
                'content' => ['fields' => [
                    $fixture['placementUid'] => 'UID value',
                    'heading' => 'Handle value',
                ]],
            ],
        ],
    ]];

    expect(fn() => (new Vizy3DocumentAdapter())->convert($legacy, $plan['schemaMap']))
        ->toThrow(\verbb\vizy\legacy\LegacyDocumentConversionException::class, 'Multiple legacy placement keys');
});
