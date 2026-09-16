<?php

use craft\helpers\FileHelper;
use craft\helpers\StringHelper;
use verbb\vizy\models\BlockType;
use verbb\vizy\models\Settings;
use verbb\vizy\Vizy;

it('normalizes portable preview image paths on Block Types', function() {
    expect(BlockType::normalizePreviewImage('hero.png'))->toBe('hero.png')
        ->and(BlockType::normalizePreviewImage('marketing/hero.webp'))->toBe('marketing/hero.webp')
        ->and(BlockType::normalizePreviewImage('../escape.png'))->toBeNull()
        ->and(BlockType::normalizePreviewImage(''))->toBeNull()
        ->and(BlockType::normalizePreviewImage(null))->toBeNull();
});

it('round-trips previewImage through Block Type Project Config', function() {
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Hero',
        'handle' => 'hero' . StringHelper::randomString(5),
        'previewImage' => 'marketing/hero.png',
    ]);
    $layout = new craft\models\FieldLayout([
        'uid' => StringHelper::UUID(),
        'type' => verbb\vizy\elements\Block::class,
    ]);
    $type->setFieldLayout($layout);

    $restored = BlockType::fromConfig((string)$type->uid, $type->toConfig());

    expect($restored->previewImage)->toBe('marketing/hero.png')
        ->and($restored->toConfig()['previewImage'])->toBe('marketing/hero.png');
});

it('scans the block preview images folder and resolves urls', function() {
    $dir = Craft::$app->getPath()->getTempPath() . '/vizy-preview-' . StringHelper::UUID();
    FileHelper::createDirectory($dir);
    FileHelper::createDirectory($dir . '/marketing');
    file_put_contents($dir . '/hero.png', base64_decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    ));
    file_put_contents($dir . '/marketing/cta.jpg', base64_decode(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGcP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//Z'
    ));

    /** @var Settings $settings */
    $settings = Vizy::$plugin->getSettings();
    $previous = $settings->blockPreviewImagesPath;
    $settings->blockPreviewImagesPath = $dir;
    Vizy::$plugin->getBlockPreviewImages()->resetCache();

    try {
        $catalog = Vizy::$plugin->getBlockPreviewImages()->getCatalog();
        $values = array_column($catalog, 'value');
        expect($values)->toContain('hero.png', 'marketing/cta.jpg');

        $groups = Vizy::$plugin->getBlockPreviewImages()->getBrowserGroups();
        $flat = array_merge(...array_map(static fn(array $g): array => $g['items'], $groups));
        expect(array_column($flat, 'value'))->toContain('hero.png', 'marketing/cta.jpg')
            ->and($flat[0])->toHaveKeys(['label', 'value', 'preview']);

        $byValue = array_column($flat, null, 'value');
        expect($byValue['hero.png']['label'])->toBe('hero.png')
            ->and($byValue['marketing/cta.jpg']['label'])->toBe('marketing/cta.jpg');

        $url = Vizy::$plugin->getBlockPreviewImages()->resolveUrl('hero.png');
        expect($url)->toBeString()->and($url)->toContain('vizy/block-previews/view');

        expect(Vizy::$plugin->getBlockPreviewImages()->resolveAbsolutePath('hero.png'))
            ->toBe(realpath($dir . '/hero.png'));
        expect(Vizy::$plugin->getBlockPreviewImages()->resolveAbsolutePath('../hero.png'))
            ->toBeNull();
    } finally {
        $settings->blockPreviewImagesPath = $previous;
        Vizy::$plugin->getBlockPreviewImages()->resetCache();
        FileHelper::removeDirectory($dir);
    }
});
