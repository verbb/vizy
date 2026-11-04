<?php

use craft\helpers\Json;
use craft\helpers\StringHelper;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\fields\VizyField;
use verbb\vizy\legacy\ManualEditorConfigMigrator;
use verbb\vizy\migrations\m261105_000000_legacy_text_style_configs;
use verbb\vizy\records\SchemaPromotion;
use verbb\vizy\services\EditorConfigs;
use verbb\vizy\Vizy;

function textStyleRepairPromotion(array $fields, string $status = 'complete'): SchemaPromotion
{
    $plan = ['status' => 'ready', 'fields' => $fields];
    $plan['planHash'] = hash('sha256', Json::encode($plan));
    $record = new SchemaPromotion([
        'runUid' => StringHelper::UUID(),
        'planHash' => $plan['planHash'],
        'planJson' => Json::encode($plan),
        'ownerScopeJson' => Json::encode(['complete' => true, 'jobs' => []]),
        'stage' => $status === 'complete' ? 'verified' : 'planned',
        'status' => $status,
    ]);
    expect($record->save(false))->toBeTrue();
    return $record;
}

function textStyleRepairLegacyConfig(): array
{
    $payload = (new ManualEditorConfigMigrator())->toAuthorablePayload(['buttons' => ['italic']], 'repair-fixture');
    // Reconstruct the config persisted by the released converter before the fix.
    $payload['capabilities']['marks'] = ['italic'];
    return $payload;
}

it('repairs unchanged imported and deduplicated configs and restores styled content editing', function(bool $minted) {
    $configs = Vizy::$plugin->getEditorConfigs();
    $pc = Craft::$app->getProjectConfig();
    $id = 'repair-' . strtolower(StringHelper::randomString(8));
    $payload = textStyleRepairLegacyConfig();
    $configs->saveConfig($id, $payload);
    $fieldPlan = [
        'canonicalFieldSettings' => ['editorConfig' => $id],
        'editorConfigFingerprint' => $configs->fingerprintAuthorable($payload),
    ];
    if ($minted) $fieldPlan['editorConfigMint'] = ['id' => $id, 'config' => $payload];
    $record = textStyleRepairPromotion([StringHelper::UUID() => $fieldPlan, StringHelper::UUID() => $fieldPlan]);
    $originalPlan = $record->planJson;
    $originalHash = $record->planHash;
    $before = $pc->get(EditorConfigs::PROJECT_CONFIG_PATH . '.' . $id);
    $field = new VizyField(['uid' => StringHelper::UUID(), 'editorConfig' => $id]);
    $document = (new DocumentParser())->parse([
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
        'content' => [['type' => 'paragraph', 'content' => [[
            'type' => 'text', 'text' => 'Preserved text',
            'marks' => [['type' => 'textStyle', 'attrs' => ['color' => '#123456']]],
        ]]]],
    ]);
    $canonical = $document->toArray();
    $manifests = Vizy::$plugin->getEditorManifests();

    try {
        expect($manifests->validateCapabilities($document, $field, null)[0]['code'])->toBe('disallowedMark');
        $allowAdminChanges = Craft::$app->getConfig()->getGeneral()->allowAdminChanges;
        Craft::$app->getConfig()->getGeneral()->allowAdminChanges = false;
        try {
            expect((new m261105_000000_legacy_text_style_configs())->up(true))->toBeTrue();
        } finally {
            Craft::$app->getConfig()->getGeneral()->allowAdminChanges = $allowAdminChanges;
        }

        $expected = $before;
        $expected['capabilities']['marks'][] = 'textStyle';
        $after = $pc->get(EditorConfigs::PROJECT_CONFIG_PATH . '.' . $id);
        expect($after)->toBe($expected)
            ->and($manifests->build($field)['enabledMarks'])->toContain('textStyle')
            ->and($manifests->validateCapabilities($document, $field, null))->toBe([])
            ->and($document->toArray())->toBe($canonical);
        $record->refresh();
        expect($record->planJson)->toBe($originalPlan)->and($record->planHash)->toBe($originalHash);
        expect((new m261105_000000_legacy_text_style_configs())->up(true))->toBeTrue()
            ->and($pc->get(EditorConfigs::PROJECT_CONFIG_PATH . '.' . $id))->toBe($after);
    } finally {
        $record->delete();
        $configs->removeConfig($id);
    }
})->with(['minted' => [true], 'deduplicated' => [false]]);

it('leaves edited, deleted, native and incomplete-upgrade configs unchanged', function(string $case) {
    $configs = Vizy::$plugin->getEditorConfigs();
    $pc = Craft::$app->getProjectConfig();
    $id = 'imported-' . strtolower(StringHelper::randomString(8));
    $payload = textStyleRepairLegacyConfig();
    $configs->saveConfig($id, $payload);
    $record = $case === 'native' ? null : textStyleRepairPromotion([
        StringHelper::UUID() => [
            'canonicalFieldSettings' => ['editorConfig' => $id],
            'editorConfigFingerprint' => $configs->fingerprintAuthorable($payload),
        ],
    ], $case === 'incomplete' ? 'pending' : 'complete');

    if ($case === 'edited') {
        $payload['capabilities']['marks'] = ['bold'];
        $configs->saveConfig($id, $payload);
    } elseif ($case === 'deleted') {
        $configs->removeConfig($id);
    } elseif ($case === 'already supported') {
        $payload['capabilities']['marks'][] = 'textStyle';
        $configs->saveConfig($id, $payload);
    }
    $before = $pc->get(EditorConfigs::PROJECT_CONFIG_PATH . '.' . $id);

    try {
        expect((new m261105_000000_legacy_text_style_configs())->up(true))->toBeTrue()
            ->and($pc->get(EditorConfigs::PROJECT_CONFIG_PATH . '.' . $id))->toBe($before);
    } finally {
        $record?->delete();
        if ($case !== 'deleted') $configs->removeConfig($id);
    }
})->with(['edited', 'deleted', 'native', 'incomplete', 'already supported']);

it('repairs Standard only for recorded default upgrades with unchanged settings', function(bool $upgraded, bool $edited) {
    // Other upgrade tests retain their completed runs. Isolate this case's
    // provenance so the fresh-install assertion does not borrow their history.
    $previousRuns = SchemaPromotion::find()->select('id')->where(['status' => 'complete'])->column();
    SchemaPromotion::updateAll(['status' => 'pending'], ['id' => $previousRuns]);
    $configs = Vizy::$plugin->getEditorConfigs();
    $pc = Craft::$app->getProjectConfig();
    $path = EditorConfigs::PROJECT_CONFIG_PATH . '.' . EditorConfigs::DEFAULT_ID;
    $original = $pc->get($path);
    $configs->removeConfig(EditorConfigs::DEFAULT_ID);
    $configs->ensureStandardConfig();
    if ($edited) $pc->set($path . '.capabilities.marks', ['italic']);
    $before = $pc->get($path);
    $record = $upgraded ? textStyleRepairPromotion([
        StringHelper::UUID() => ['canonicalFieldSettings' => ['editorConfig' => '']],
    ]) : null;

    try {
        expect((new m261105_000000_legacy_text_style_configs())->up(true))->toBeTrue();
        $expected = $before;
        if ($upgraded && !$edited) $expected['capabilities']['marks'][] = 'textStyle';
        expect($pc->get($path))->toBe($expected);
    } finally {
        $record?->delete();
        $pc->set($path, $original);
        $configs->invalidate();
        SchemaPromotion::updateAll(['status' => 'complete'], ['id' => $previousRuns]);
    }
})->with([
    'upgraded' => [true, false],
    'customized' => [true, true],
    'fresh install' => [false, false],
]);
