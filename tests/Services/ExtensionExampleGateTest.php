<?php

use modules\vizyabbr\Abbr;
use modules\vizyabbr\assets\AbbrAsset;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\web\assets\field\VizyAsset;

it('keeps the copyable extension module CLI-safe and internally consistent', function() {
    $root = dirname(__DIR__, 2);
    $example = $root . '/examples/vizy-abbr-module';

    require_once $example . '/src/Abbr.php';
    require_once $example . '/src/assets/AbbrAsset.php';

    $asset = new AbbrAsset();
    $moduleSource = file_get_contents($example . '/src/Module.php');
    $javascript = file_get_contents($example . '/src/web/abbr.js');

    expect($moduleSource)->toContain('use Craft;')
        ->and($moduleSource)->toContain("setControllerPath(__DIR__ . '/controllers')")
        ->and($moduleSource)->not->toContain('setAlias(')
        ->and(realpath($asset->sourcePath))->toBe(realpath($example . '/src/web'))
        ->and($asset->depends)->toContain(VizyAsset::class)
        ->and($asset->js)->toBe(['abbr.js'])
        ->and(is_file($asset->sourcePath . '/abbr.js'))->toBeTrue()
        ->and(Abbr::id())->toBe('abbr')
        ->and(Abbr::moduleId())->toBe('acme/mark/abbr')
        ->and(Abbr::tag())->toBe('abbr')
        ->and(Abbr::surfaces())->toContain(EditorSurface::Toolbar, EditorSurface::Bubble)
        ->and($javascript)->toContain("name: 'abbr'")
        ->and($javascript)->toContain("registerModule('acme/mark/abbr'");
});
