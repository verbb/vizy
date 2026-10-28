<?php

declare(strict_types=1);

use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use verbb\vizy\legacy\ManualEditorConfigMigrator;
use verbb\vizy\services\EditorConfigs;
use verbb\vizy\Vizy;

it('preserves legacy filenames and default file selections without changing their files', function(string $filename, string $selection) {
    $configs = Vizy::$plugin->getEditorConfigs();
    $dir = Craft::$app->getPath()->getConfigPath() . '/vizy';
    FileHelper::createDirectory($dir);
    $path = $dir . '/' . $filename;
    $contents = Json::encode(['buttons' => ['italic', 'h1', 'blockquote'], 'formatting' => ['h1', 'blockquote']]);
    file_put_contents($path, $contents);

    try {
        $configs->invalidate();
        $plan = (new ManualEditorConfigMigrator())->plan(['vizyConfig' => $selection], StringHelper::UUID());
        $id = $plan['editorConfig'];
        $config = $configs->getConfig($id);
        expect($plan['diagnostics'])->toBe([])
            ->and($id)->toMatch('/^[a-z][a-z0-9_-]*$/')
            ->and($config)->not->toBeNull()
            ->and($config['source'])->toBe(EditorConfigs::SOURCE_FILE)
            ->and($config['filename'])->toBe($filename)
            ->and($config['capabilities']['marks'])->toBe(['italic'])
            ->and($config['capabilities']['nodes'])->toContain('heading', 'blockquote')
            ->and($config['headings']['levels'])->toBe([1])
            ->and($configs->fileContents($id))->toBe($contents)
            ->and(file_get_contents($path))->toBe($contents);
        expect(fn() => $configs->saveConfig($id, $configs->authorablePayload($config)))
            ->toThrow(RuntimeException::class, 'owned by a file');
    } finally {
        unlink($path);
        $configs->invalidate();
    }
})->with([
    'ordinary selection' => ['extended.json', 'extended.json'],
    'uppercase' => ['Extended.json', 'Extended.json'],
    'spaces' => ['Extended Editor.json', 'Extended Editor.json'],
    'dots' => ['extended.editor.json', 'extended.editor.json'],
    'numeric' => ['123.json', '123.json'],
    'implicit Default.json' => ['Default.json', ''],
    'explicit Default.json' => ['Default.json', 'Default.json'],
    'built-in ID collision' => ['standard.json', 'standard.json'],
]);

it('blocks ambiguous Project Config collisions without replacing either config', function() {
    $configs = Vizy::$plugin->getEditorConfigs();
    $dir = Craft::$app->getPath()->getConfigPath() . '/vizy';
    FileHelper::createDirectory($dir);
    $id = 'collision-' . strtolower(StringHelper::randomString(6));
    $configs->saveConfig($id, ['label' => 'Existing', 'capabilities' => ['marks' => ['bold']], 'toolbar' => ['bold']]);
    $files = [$id . '.json' => 'italic', ucfirst($id) . ' Editor.json' => 'underline'];

    try {
        foreach ($files as $filename => $mark) {
            file_put_contents($dir . '/' . $filename, Json::encode(['buttons' => [$mark]]));
        }
        $configs->invalidate();
        foreach ($files as $filename => $mark) {
            $plan = (new ManualEditorConfigMigrator())->plan(['vizyConfig' => $filename], StringHelper::UUID());
            if ($filename === $id . '.json') {
                expect($plan['diagnostics'][0]['code'])->toBe('fileEditorConfigUnavailable')
                    ->and($plan['mint'])->toBeNull();
                continue;
            }
            expect($configs->getConfig($plan['editorConfig'])['capabilities']['marks'])->toBe([$mark])
                ->and($configs->getConfig($plan['editorConfig'])['filename'])->toBe($filename);
        }
        expect($configs->getFileConfigId('Extended.json'))->not->toBe($configs->getFileConfigId('extended.json'))
            ->and($configs->getConfig($id)['capabilities']['marks'])->toBe(['bold'])
            ->and($configs->fileOwnsId($id))->toBeTrue();
    } finally {
        foreach ($files as $filename => $mark) {
            unlink($dir . '/' . $filename);
        }
        $configs->invalidate();
        $configs->removeConfig($id);
    }
});

it('blocks malformed manual configs before planning writes', function(string $json, string $code) {
    $before = Craft::$app->getProjectConfig()->get(EditorConfigs::PROJECT_CONFIG_PATH);
    $plan = (new ManualEditorConfigMigrator())->plan([
        'configSelectionMode' => 'manual',
        'manualConfig' => $json,
    ], StringHelper::UUID());
    expect($plan['mint'])->toBeNull()
        ->and($plan['diagnostics'][0]['code'])->toBe($code)
        ->and(Craft::$app->getProjectConfig()->get(EditorConfigs::PROJECT_CONFIG_PATH))->toBe($before);
})->with([
    'empty' => ['', 'manualEditorConfigEmpty'],
    'invalid JSON' => ['{"buttons":', 'manualEditorConfigInvalidJson'],
    'list' => ['["bold"]', 'manualEditorConfigInvalidShape'],
    'scalar' => ['true', 'manualEditorConfigInvalidShape'],
]);

it('requires admin changes only when a manual config needs to be created', function() {
    $general = Craft::$app->getConfig()->getGeneral();
    $before = $general->allowAdminChanges;
    $migrator = new ManualEditorConfigMigrator();
    $settings = ['configSelectionMode' => 'manual', 'manualConfig' => Json::encode([
        'label' => 'Read-only migration ' . StringHelper::randomString(8),
        'buttons' => ['underline', 'h6'],
    ])];
    $id = null;
    try {
        $general->allowAdminChanges = false;
        $blocked = $migrator->plan($settings, StringHelper::UUID());
        expect($blocked['diagnostics'][0]['code'])->toBe('manualEditorConfigRequiresAdminChanges')
            ->and($blocked['mint'])->toBeNull();
        $general->allowAdminChanges = true;
        $planned = $migrator->plan($settings, StringHelper::UUID());
        $migrator->applyMints([['editorConfigMint' => $planned['mint']]]);
        $id = $planned['editorConfig'];
        $general->allowAdminChanges = false;
        $existing = $migrator->plan($settings, StringHelper::UUID());
        expect($existing['diagnostics'])->toBe([])
            ->and($existing['mint'])->toBeNull()
            ->and($existing['editorConfig'])->toBe($id);
    } finally {
        $general->allowAdminChanges = true;
        if ($id !== null) Vizy::$plugin->getEditorConfigs()->removeConfig($id);
        $general->allowAdminChanges = $before;
    }
});
