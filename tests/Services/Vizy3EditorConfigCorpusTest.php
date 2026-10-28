<?php

declare(strict_types=1);

use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use verbb\vizy\legacy\ManualEditorConfigMigrator;
use verbb\vizy\Vizy;

it('preserves source-authenticated Vizy 3 editor config selections', function(array $source) {
    $service = Vizy::$plugin->getEditorConfigs();
    $dir = Craft::$app->getPath()->getConfigPath() . '/vizy';
    FileHelper::createDirectory($dir);
    $path = $source['filename'] ? $dir . '/' . $source['filename'] : null;
    if ($path !== null) file_put_contents($path, $source['contents']);
    $mintedId = null;

    try {
        $service->invalidate();
        $migrator = new ManualEditorConfigMigrator();
        $plan = $migrator->plan($source['settings'], StringHelper::UUID());
        expect($plan['diagnostics'])->toBe([]);
        if ($plan['mint'] !== null) {
            $migrator->applyMints([['editorConfigMint' => $plan['mint']]]);
            $mintedId = $plan['mint']['id'];
        }
        $config = $service->getConfig($plan['editorConfig']);
        expect($config)->not->toBeNull();
        if ($path !== null) {
            expect($config['filename'])->toBe($source['filename'])
                ->and($service->fileContents($plan['editorConfig']))->toBe($source['contents']);
        }

        // Expectations come from the released source's loaded config, not the converter.
        $marks = [];
        foreach ($source['effective']['buttons'] ?? [] as $button) {
            $mark = ['strikethrough' => 'strike'][$button] ?? $button;
            if (in_array($mark, ['bold', 'italic', 'underline', 'strike', 'link'], true)) $marks[] = $mark;
            if (preg_match('/^h([1-6])$/', $button, $match)) {
                expect($config['headings']['levels'])->toContain((int)$match[1]);
            }
        }
        expect($config['capabilities']['marks'])->toBe($marks);
    } finally {
        if ($path !== null) unlink($path);
        $service->invalidate();
        if ($mintedId !== null) $service->removeConfig($mintedId);
    }
})->with(function() {
    $corpus = Json::decode(file_get_contents(dirname(__DIR__) . '/Fixtures/vizy3-editor-configs.json'));
    foreach ($corpus['cases'] as $source) yield $source['handle'] => [$source];
});
