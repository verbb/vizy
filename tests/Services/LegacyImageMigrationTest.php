<?php

use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\legacy\Vizy3DocumentAdapter;

function migrationPublicAsset(): craft\elements\Asset
{
    AssetSpikeFixture::ensureAdminUser();
    $suffix = craft\helpers\StringHelper::randomString(8);
    $root = sys_get_temp_dir() . '/vizy-migration-images/' . $suffix;
    craft\helpers\FileHelper::createDirectory($root);
    $fs = new craft\fs\Local([
        'name' => 'Migration images ' . $suffix, 'handle' => 'migrationImages' . $suffix,
        'path' => $root, 'hasUrls' => true, 'url' => 'https://example.test/images/',
    ]);
    expect(Craft::$app->getFs()->saveFilesystem($fs))->toBeTrue();
    $volume = new craft\models\Volume([
        'name' => 'Migration images ' . $suffix, 'handle' => 'migrationImages' . $suffix,
        'fsHandle' => $fs->handle,
    ]);
    expect(Craft::$app->getVolumes()->saveVolume($volume))->toBeTrue();
    $folder = Craft::$app->getAssets()->getRootFolderByVolumeId($volume->id);
    $temp = Craft::$app->getPath()->getTempPath() . '/' . $suffix . '.txt';
    file_put_contents($temp, 'migration image reference');
    $asset = new craft\elements\Asset([
        'tempFilePath' => $temp, 'filename' => $suffix . '.txt', 'newFolderId' => $folder->id,
        'scenario' => craft\elements\Asset::SCENARIO_CREATE,
    ]);
    expect(Craft::$app->getElements()->saveElement($asset))->toBeTrue();
    return $asset;
}

it('preserves Vizy 3 linked image destinations, window behaviour and classes through conversion and rendering', function() {
    $asset = migrationPublicAsset();
    $legacy = [['type' => 'image', 'attrs' => [
        'src' => 'https://example.com/image.png#asset:' . $asset->id . ':url',
        'alt' => 'Linked source image', 'title' => 'Source image',
        'url' => 'https://example.com/gallery?view=full&lang=en',
        'target' => '_blank', 'linkClass' => 'gallery-link',
    ]]];
    $converted = (new Vizy3DocumentAdapter())->convert($legacy, []);
    expect($converted['content'][0]['attrs']['link'] ?? null)->toBe([
        'type' => 'url', 'value' => 'https://example.com/gallery?view=full&lang=en',
        'siteMode' => 'current', 'newWindow' => true, 'class' => 'gallery-link',
    ]);
    $html = (string)(new DocumentParser())->parse($converted)->render();
    expect($html)->toContain('href="https://example.com/gallery?view=full&amp;lang=en"')
        ->toContain('target="_blank"')->toContain('gallery-link')->toContain('<img');

    $legacy[0]['attrs']['url'] = null;
    $unlinked = (new Vizy3DocumentAdapter())->convert($legacy, []);
    expect($unlinked['content'][0]['attrs'])->not->toHaveKey('link');
});

it('renders migrated linked images when the asset predates the owner site', function() {
    [$primary, $secondary] = VizyFixtureFactory::ensureSites(2);
    $asset = migrationPublicAsset();
    $transaction = Craft::$app->getDb()->beginTransaction();

    try {
        Craft::$app->getDb()->createCommand()->delete('{{%elements_sites}}', [
            'elementId' => $asset->id, 'siteId' => $secondary->id,
        ])->execute();
        $legacy = [['type' => 'image', 'attrs' => [
            'src' => 'https://example.com/legacy.png#asset:' . $asset->id . ':url',
            'url' => 'https://example.com/gallery', 'target' => '_blank',
        ]]];
        $converted = (new Vizy3DocumentAdapter())->convert($legacy, []);
        $owner = new craft\elements\Entry(['siteId' => $secondary->id]);
        $html = (string)(new DocumentParser())->parse($converted, $owner)->render();
        expect($html)->toContain('<img')->toContain('href="https://example.com/gallery"');

        // An explicit fixed site must not silently select a different localization.
        $converted['content'][0]['attrs']['siteMode'] = 'fixed';
        $converted['content'][0]['attrs']['siteUid'] = $secondary->uid;
        expect((string)(new DocumentParser())->parse($converted, $owner)->render())->not->toContain('<img');
    } finally {
        $transaction->rollBack();
    }
});

it('preserves explicit legacy image sites and rejects unknown sites', function() {
    [$primary, $secondary] = VizyFixtureFactory::ensureSites(2);
    $asset = migrationPublicAsset();
    $legacy = [['type' => 'image', 'attrs' => [
        'src' => 'https://example.com/image.png#asset:' . $asset->id . '@' . $primary->id . ':url',
    ]]];
    $converted = (new Vizy3DocumentAdapter())->convert($legacy, []);
    expect($converted['content'][0]['attrs']['siteMode'])->toBe('fixed')
        ->and($converted['content'][0]['attrs']['siteUid'])->toBe($primary->uid);
    $legacy[0]['attrs']['src'] = 'https://example.com/image.png#asset:' . $asset->id . '@2147483647:url';
    expect(fn() => (new Vizy3DocumentAdapter())->convert($legacy, []))
        ->toThrow(\verbb\vizy\legacy\LegacyDocumentConversionException::class, 'unknown site');
});
