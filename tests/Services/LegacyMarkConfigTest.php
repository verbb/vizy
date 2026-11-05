<?php

use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\fields\VizyField;
use verbb\vizy\legacy\ManualEditorConfigMigrator;
use verbb\vizy\Vizy;

it('preserves legacy formatting independently of toolbar buttons in file and manual configs', function(bool $file, bool $addedButtons) {
    // The supplied support config, with a second variant removing the added mark controls.
    $legacy = [
        'buttons' => ['html', 'link', 'formatting', 'bold', 'italic', 'underline', 'strike', 'undo', 'redo', 'table', 'bulletList', 'orderedList', 'iframe'],
        'formatting' => ['paragraph', 'heading2', 'heading3', 'heading4'],
        'toolbarFixed' => true,
    ];
    if (!$addedButtons) {
        $legacy['buttons'] = array_values(array_diff($legacy['buttons'], ['bold', 'underline', 'strike']));
    }
    $configs = Vizy::$plugin->getEditorConfigs();
    $id = 'legacy-marks-' . strtolower(StringHelper::randomString(8));
    $contents = Json::encode($legacy);
    $path = Craft::$app->getPath()->getConfigPath() . '/vizy/' . $id . '.json';
    $migrator = new ManualEditorConfigMigrator();
    $document = (new DocumentParser())->parse([
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
        'content' => [['type' => 'bulletList', 'content' => array_map(static fn($mark) => [
            'type' => 'listItem', 'content' => [[
                'type' => 'paragraph', 'content' => [
                    ['type' => 'text', 'text' => 'Formatted label', 'marks' => [['type' => 'textStyle'], ['type' => $mark]]],
                    ['type' => 'text', 'text' => ' Plain description'],
                ],
            ]],
        ], ['bold', 'underline', 'strike'])]],
    ]);
    $original = $document->toArray();

    try {
        if ($file) {
            FileHelper::createDirectory(dirname($path));
            file_put_contents($path, $contents);
            $configs->invalidate();
        } else {
            $plan = $migrator->plan(['configSelectionMode' => 'manual', 'manualConfig' => $contents], StringHelper::UUID());
            expect($plan['diagnostics'])->toBe([]);
            $id = $plan['editorConfig'];
            $migrator->applyMints([['editorConfigMint' => $plan['mint']]]);
        }
        $config = $configs->getConfig($id);
        $field = new VizyField(['uid' => StringHelper::UUID(), 'editorConfig' => $id]);
        $manifests = Vizy::$plugin->getEditorManifests();
        expect($config['capabilities']['marks'])->toEqualCanonicalizing([
            'bold', 'code', 'highlight', 'italic', 'strike', 'subscript', 'superscript', 'underline', 'link', 'textStyle',
        ])
            ->and($manifests->validateCapabilities($document, $field, null))->toBe([])
            ->and($manifests->build($field)['enabledMarks'])->toContain('bold', 'underline', 'strike', 'textStyle')
            ->and($document->toArray())->toBe($original)
            ->and($config['headings']['levels'])->toBe([1, 2, 3, 4, 5, 6]);
        if ($addedButtons) {
            expect($config['toolbar'])->toContain('bold', 'underline', 'strike');
        } else {
            expect($config['toolbar'])->not->toContain('bold', 'underline', 'strike');
        }
        if ($file) {
            expect(file_get_contents($path))->toBe($contents);
            // Existing upgraded sites use this same conversion again on the next request.
            $configs->invalidate();
            expect($configs->getConfig($id)['capabilities'])->toBe($config['capabilities']);
        }
    } finally {
        if ($file) {
            if (is_file($path)) unlink($path);
        } else {
            $configs->removeConfig($id);
        }
        $configs->invalidate();
    }
})->with([
    'file without added controls' => [true, false],
    'supplied file with added controls' => [true, true],
    'manual without added controls' => [false, false],
    'manual with added controls' => [false, true],
]);
