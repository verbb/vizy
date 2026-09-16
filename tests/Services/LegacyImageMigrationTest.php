<?php

use Tests\Support\Fixtures\AssetSpikeFixture;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\legacy\Vizy3DocumentAdapter;

it('preserves Vizy 3 linked image destinations, window behaviour and classes through conversion and rendering', function() {
    $asset = AssetSpikeFixture::createTempAsset();
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
