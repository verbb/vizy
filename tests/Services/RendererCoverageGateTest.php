<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\helpers\StringHelper;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;

it('asserts every installed extension has a valid render strategy', function() {
    $extensions = Vizy::$plugin->getExtensions();
    $extensions->reset();

    expect(fn() => $extensions->assertRenderCoverage())->not->toThrow(Throwable::class)
        ->and($extensions->getRender('node', 'layout')['strategy'] ?? null)->toBe('type')
        ->and($extensions->getRender('node', 'paragraph')['strategy'] ?? null)->toBe('type')
        ->and($extensions->getRender('mark', 'bold')['strategy'] ?? null)->toBe('type')
        ->and($extensions->getRender('mark', 'link')['strategy'] ?? null)->toBe('type')
        ->and($extensions->getRender('node', 'vizyBlock')['strategy'] ?? null)->toBe('block');
});

it('renders prose marks and layout column wrappers from Extensions strategies', function() {
    Vizy::$plugin->getExtensions()->reset();

    $columnA = StringHelper::UUID();
    $columnB = StringHelper::UUID();
    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            [
                'type' => 'paragraph',
                'content' => [[
                    'type' => 'text',
                    'text' => 'Hello',
                    'marks' => [['type' => 'bold']],
                ]],
            ],
            [
                'type' => 'layout',
                'attrs' => [
                    'layoutUid' => StringHelper::UUID(),
                    'stack' => 'small',
                ],
                'content' => [
                    [
                        'type' => 'column',
                        'attrs' => ['columnUid' => $columnA, 'span' => 6],
                        'content' => [[
                            'type' => 'paragraph',
                            'content' => [['type' => 'text', 'text' => 'Left']],
                        ]],
                    ],
                    [
                        'type' => 'column',
                        'attrs' => ['columnUid' => $columnB, 'span' => 6],
                        'content' => [[
                            'type' => 'paragraph',
                            'content' => [['type' => 'text', 'text' => 'Right']],
                        ]],
                    ],
                ],
            ],
        ],
    ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

    $html = (string)$document->render();

    expect($html)->toContain('<strong>Hello</strong>')
        ->and($html)->toContain('vizy-layout')
        ->and($html)->toContain('data-span="6"')
        ->and($html)->toContain('data-stack="small"')
        // Craft Html::cssStyleFromArray normalizes `--vizy-cols:12` → `--vizy-cols: 12;`
        ->and($html)->toContain('--vizy-cols:')
        ->and($html)->toContain('--vizy-col:');
});

it('renders iframe and unknown mediaEmbed via type classes', function() {
    Vizy::$plugin->getExtensions()->reset();

    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            [
                'type' => 'iframe',
                'attrs' => [
                    'url' => 'https://example.com/embed',
                    'frameborder' => 0,
                    'allowfullscreen' => true,
                ],
            ],
            [
                'type' => 'mediaEmbed',
                'attrs' => [
                    'url' => 'https://example.com/unknown-provider',
                ],
            ],
        ],
    ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

    $html = (string)$document->render();

    expect($html)->toContain('<iframe')
        ->and($html)->toContain('https://example.com/embed')
        ->and($html)->toContain('vizy-media-embed-link')
        ->and($html)->toContain('https://example.com/unknown-provider');
});

it('renders Block Type templates when an explicit blockTemplates map is provided', function() {
    Vizy::$plugin->getExtensions()->reset();

    $typeUid = StringHelper::UUID();
    $type = new \verbb\vizy\models\BlockType([
        'uid' => $typeUid,
        'name' => 'Smoke Card',
        'handle' => 'smokeCard' . StringHelper::randomString(5),
    ]);
    $layout = new \craft\models\FieldLayout([
        'uid' => StringHelper::UUID(),
        'type' => \verbb\vizy\elements\Block::class,
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();

    $view = Craft::$app->getView();
    $previousMode = $view->getTemplateMode();
    $previousPath = $view->getTemplatesPath();
    $templatesPath = sys_get_temp_dir() . '/vizy-render-smoke-' . StringHelper::randomString(6);
    $relative = '_vizy/blocks/smoke-card';
    mkdir($templatesPath . '/_vizy/blocks', 0777, true);
    file_put_contents(
        $templatesPath . '/_vizy/blocks/smoke-card.twig',
        '<div class="smoke-block-template">{{ block.blockType.handle }}</div>',
    );

    $view->setTemplateMode(\craft\web\View::TEMPLATE_MODE_SITE);
    $view->setTemplatesPath($templatesPath);

    try {
        expect($view->doesTemplateExist($relative, \craft\web\View::TEMPLATE_MODE_SITE))->toBeTrue();

        $document = (new DocumentParser())->parse([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'vizyBlock',
                'attrs' => [
                    'blockUid' => StringHelper::UUID(),
                    'blockTypeUid' => $typeUid,
                    'enabled' => true,
                    'fieldSlots' => [],
                ],
                'content' => [],
            ]],
        ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

        $html = (string)$document->render([
            'blockTemplates' => [$typeUid => $relative],
        ]);

        expect($html)->toContain('smoke-block-template')
            ->and($html)->toContain($type->handle);
    } finally {
        $view->setTemplatesPath($previousPath);
        $view->setTemplateMode($previousMode);
        @unlink($templatesPath . '/_vizy/blocks/smoke-card.twig');
        @rmdir($templatesPath . '/_vizy/blocks');
        @rmdir($templatesPath . '/_vizy');
        @rmdir($templatesPath);
    }
});
