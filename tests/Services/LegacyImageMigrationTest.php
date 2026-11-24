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

it('converts encoded and brace image references and retains transform suffixes', function() {
    $asset = migrationPublicAsset();
    foreach ([
        ['%23asset:' . $asset->id . ':url', ''],
        ['{asset:' . $asset->id . ':url}', ''],
        ['#asset:' . $asset->id . ':transform:thumb', 'thumb'],
        ['%23asset:' . $asset->id . ':thumb', 'thumb'],
    ] as [$src, $transform]) {
        $canonical = (new Vizy3DocumentAdapter())->convert([['type' => 'image', 'attrs' => ['src' => $src]]], []);
        expect($canonical['content'][0]['attrs']['assetUid'])->toBe($asset->uid)
            ->and($canonical['content'][0]['attrs']['transform'])->toBe($transform);
    }
});

it('resolves bare Asset URLs pasted into Vizy 3 content and preserves images without a matching Asset', function() {
    $asset = migrationPublicAsset();
    $convert = static fn(string $src) => (new Vizy3DocumentAdapter())->convert([['type' => 'image', 'attrs' => [
        'id' => null, 'src' => $src, 'alt' => 'Pasted image',
    ]]], []);

    // A CDN transform URL on another host, with its own path prefix and query string.
    $canonical = $convert('https://project.transforms.svdcdn.com/staging/' . rawurlencode($asset->filename) . '?w=400&h=151&fit=crop&s=abc');
    expect($canonical['content'][0]['attrs']['assetUid'])->toBe($asset->uid)
        ->and($canonical['content'][0]['attrs']['alt'])->toBe('Pasted image');

    // Images without a matching Asset keep their V3 attrs as unsupported content, which
    // renders nothing but survives parsing, so surrounding content still loads.
    $missing = 'https://example.test/images/missing-' . $asset->filename;
    $nested = (new Vizy3DocumentAdapter())->convert([
        ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Before']]],
        ['type' => 'blockquote', 'content' => [['type' => 'image', 'attrs' => ['src' => $missing, 'alt' => 'Lost']]]],
    ], []);
    expect($nested['content'][1]['content'][0])->toBe([
        'type' => 'vizy3Image', 'attrs' => ['src' => $missing, 'alt' => 'Lost'],
    ]);

    $document = (new DocumentParser())->parse($nested);
    $html = (string)$document->render();
    expect($html)->toContain('Before')->not->toContain('<img')
        ->and((new \verbb\vizy\document\DocumentSerializer())->serialize($document)['content'][1]['content'][0])
        ->toBe(['type' => 'vizy3Image', 'attrs' => ['src' => $missing, 'alt' => 'Lost']]);
});

it('names the field, element and site when an owner’s Vizy 3 image has no matching Asset', function() {
    $entry = \Tests\Support\Fixtures\VizyFixtureFactory::entry('Legacy image warning owner');
    $src = 'https://example.test/images/unmatched-' . uniqid() . '.jpg';
    $bare = [['type' => 'image', 'attrs' => ['src' => $src]]];

    // An upgraded field accepts bare node lists. Use a copy with its own UID so the
    // shared fixture field keeps rejecting Vizy 3 content in other tests.
    $field = clone \Tests\Support\Fixtures\VizyFixtureFactory::vizyField();
    $field->uid = \craft\helpers\StringHelper::UUID();
    $maps = \verbb\vizy\Vizy::$plugin->getLegacySchemaMaps();
    $maps->saveProvenance($field->uid, ['fieldUid' => $field->uid, 'sourceFingerprint' => 'legacy-image-warning', 'schemaMap' => []]);
    $logged = count(Craft::getLogger()->messages);

    try {
        expect(\verbb\vizy\Vizy::$plugin->getDocuments()->normalizeDetached($bare, [])->toArray()['content'][0]['type'])->toBe('vizy3Image')
            // A bare node list set on an element, as a module writing Vizy 3-shaped content would.
            ->and($field->normalizeValue($bare, $entry)->toArray()['content'][0]['type'])->toBe('vizy3Image');
    } finally {
        Craft::$app->getProjectConfig()->remove($maps::PROJECT_CONFIG_PATH . '.' . $field->uid);
    }

    $warnings = array_values(array_filter(
        array_map(static fn(array $message) => (string)$message[0], array_slice(Craft::getLogger()->messages, $logged)),
        static fn(string $message) => str_contains($message, 'Preserved Vizy 3 image'),
    ));

    expect($warnings)->toBe([
        "Preserved Vizy 3 image at content.0 as unsupported content, because no Asset matches its src “{$src}”.",
        "Preserved Vizy 3 image at content.0 in the “{$field->handle}” field of element {$entry->id} on site {$entry->siteId} as unsupported content, because no Asset matches its src “{$src}”.",
    ]);
});

it('renders converted images whose transform handle no longer exists from the original or field default URL', function() {
    AssetSpikeFixture::ensureAdminUser();
    $suffix = craft\helpers\StringHelper::randomString(8);
    $root = sys_get_temp_dir() . '/vizy-migration-images/' . $suffix;
    craft\helpers\FileHelper::createDirectory($root);
    $fs = new craft\fs\Local([
        'name' => 'Migration photos ' . $suffix, 'handle' => 'migrationPhotos' . $suffix,
        'path' => $root, 'hasUrls' => true, 'url' => 'https://example.test/photos/',
    ]);
    expect(Craft::$app->getFs()->saveFilesystem($fs))->toBeTrue();
    $volume = new craft\models\Volume([
        'name' => 'Migration photos ' . $suffix, 'handle' => 'migrationPhotos' . $suffix,
        'fsHandle' => $fs->handle,
    ]);
    expect(Craft::$app->getVolumes()->saveVolume($volume))->toBeTrue();

    // Craft only resolves transform handles for manipulable images, so this needs a real PNG.
    $temp = Craft::$app->getPath()->getTempPath() . '/' . $suffix . '.png';
    file_put_contents($temp, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='));
    $asset = new craft\elements\Asset([
        'tempFilePath' => $temp, 'filename' => $suffix . '.png',
        'newFolderId' => Craft::$app->getAssets()->getRootFolderByVolumeId($volume->id)->id,
        'scenario' => craft\elements\Asset::SCENARIO_CREATE,
    ]);
    expect(Craft::$app->getElements()->saveElement($asset))->toBeTrue();

    $transforms = Craft::$app->getImageTransforms();
    $kept = new craft\models\ImageTransform(['name' => 'Kept ' . $suffix, 'handle' => 'kept' . $suffix, 'width' => 10, 'height' => 10]);
    $fallback = new craft\models\ImageTransform(['name' => 'Fallback ' . $suffix, 'handle' => 'fallback' . $suffix, 'width' => 20, 'height' => 20]);
    expect($transforms->saveTransform($kept))->toBeTrue()
        ->and($transforms->saveTransform($fallback))->toBeTrue();
    $fallback = $transforms->getTransformByHandle($fallback->handle);

    $convert = static fn(string $handle) => (new Vizy3DocumentAdapter())->convert([['type' => 'image', 'attrs' => [
        'src' => '#asset:' . $asset->id . ':transform:' . $handle,
    ]]], []);
    $resolve = static fn(array $converted, ?verbb\vizy\fields\VizyField $field = null) => verbb\vizy\nodes\Image::resolveAttrs(
        $converted['content'][0]['attrs'],
        new verbb\vizy\base\RenderContext(field: $field, siteId: (int)$asset->siteId),
    )['src'];

    // A transform that still exists keeps applying.
    expect($resolve($convert($kept->handle)))->toBe($asset->getUrl($kept->handle))
        ->not->toBe($asset->getUrl());

    // A renamed or deleted transform renders like an image without one: the field
    // default transform when there is one, otherwise the original URL.
    $retired = $convert('retired' . $suffix);
    expect($resolve($retired))->toBe($asset->getUrl())
        ->and($resolve($retired, new verbb\vizy\fields\VizyField(['defaultTransform' => $fallback->uid])))
        ->toBe($asset->getUrl($fallback->handle))
        ->and((string)(new DocumentParser())->parse($retired)->render())->toContain('<img');
});
