<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\elements\User;
use craft\helpers\Html;
use craft\helpers\StringHelper;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\events\ModifyRenderedNodeEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\nodes\MediaEmbed;
use verbb\vizy\nodes\Paragraph;
use verbb\vizy\Vizy;
use yii\base\Event;

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

it('resolves convention and per-render Twig templates for nodes and marks', function() {
    Vizy::$plugin->getExtensions()->reset();

    $view = Craft::$app->getView();
    $settings = Vizy::$plugin->getSettings();
    $previousMode = $view->getTemplateMode();
    $previousPath = $view->getTemplatesPath();
    $previousRenderTemplatesPath = $settings->renderTemplatesPath;
    $templatesPath = sys_get_temp_dir() . '/vizy-type-render-' . StringHelper::randomString(6);

    mkdir($templatesPath . '/_vizy/types/nodes', 0777, true);
    mkdir($templatesPath . '/_vizy/types/marks', 0777, true);
    mkdir($templatesPath . '/_vizy/overrides', 0777, true);
    file_put_contents(
        $templatesPath . '/_vizy/types/nodes/paragraph.twig',
        '<article class="node-{{ type }}" data-field="{{ field.handle }}">{{ content }}</article>',
    );
    file_put_contents(
        $templatesPath . '/_vizy/types/marks/bold.twig',
        '<span class="mark-{{ type }}" data-owner="{{ owner.title }}">{{ content }}</span>',
    );
    file_put_contents(
        $templatesPath . '/_vizy/overrides/paragraph.twig',
        '<div class="override-node">{{ content }}</div>',
    );
    file_put_contents(
        $templatesPath . '/_vizy/overrides/bold.twig',
        '<b class="override-mark">{{ content }}</b>',
    );

    $view->setTemplateMode(\craft\web\View::TEMPLATE_MODE_SITE);
    $view->setTemplatesPath($templatesPath);
    $settings->renderTemplatesPath = '_vizy/types/';

    $listener = function(ModifyRenderedNodeEvent $event): void {
        $event->renderedNode = '<main class="render-event">' . $event->renderedNode . '</main>';
    };
    Event::on(Paragraph::class, Paragraph::EVENT_MODIFY_RENDERED_NODE, $listener);

    try {
        $document = (new DocumentParser())->parse([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'paragraph',
                'content' => [[
                    'type' => 'text',
                    'text' => '<Hello>',
                    'marks' => [['type' => 'bold']],
                ]],
            ]],
        ], new Entry(['title' => 'Template owner']), new VizyField(['name' => 'Body', 'handle' => 'articleBody']));

        $conventionHtml = (string)$document->render();
        $overrideHtml = (string)$document->render([
            'nodeTemplates' => ['paragraph' => '_vizy/overrides/paragraph'],
            'markTemplates' => ['bold' => '_vizy/overrides/bold'],
        ]);

        expect($settings->getRenderTemplatesPath())->toBe('_vizy/types')
            ->and($conventionHtml)->toContain('<main class="render-event"><article class="node-paragraph" data-field="articleBody">')
            ->and($conventionHtml)->toContain('<span class="mark-bold" data-owner="Template owner">&lt;Hello&gt;</span>')
            ->and($overrideHtml)->toContain('<main class="render-event"><div class="override-node">')
            ->and($overrideHtml)->toContain('<b class="override-mark">&lt;Hello&gt;</b>');
    } finally {
        Event::off(Paragraph::class, Paragraph::EVENT_MODIFY_RENDERED_NODE, $listener);
        $settings->renderTemplatesPath = $previousRenderTemplatesPath;
        $view->setTemplatesPath($previousPath);
        $view->setTemplateMode($previousMode);
        @unlink($templatesPath . '/_vizy/types/nodes/paragraph.twig');
        @unlink($templatesPath . '/_vizy/types/marks/bold.twig');
        @unlink($templatesPath . '/_vizy/overrides/paragraph.twig');
        @unlink($templatesPath . '/_vizy/overrides/bold.twig');
        @rmdir($templatesPath . '/_vizy/types/nodes');
        @rmdir($templatesPath . '/_vizy/types/marks');
        @rmdir($templatesPath . '/_vizy/types');
        @rmdir($templatesPath . '/_vizy/overrides');
        @rmdir($templatesPath . '/_vizy');
        @rmdir($templatesPath);
    }
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

it('allows Media Embed output to be customised through its rendered-node event', function() {
    Vizy::$plugin->getExtensions()->reset();

    $listener = function(ModifyRenderedNodeEvent $event): void {
        if ($event->context?->field?->handle !== 'articleBody') {
            return;
        }

        $event->renderedNode = Html::tag('div', $event->renderedNode, ['class' => 'article-media']);
    };
    Event::on(MediaEmbed::class, MediaEmbed::EVENT_MODIFY_RENDERED_NODE, $listener);

    try {
        $document = (new DocumentParser())->parse([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'mediaEmbed',
                'attrs' => ['url' => 'https://vimeo.com/123456789'],
            ]],
        ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Article body', 'handle' => 'articleBody']));

        $html = (string)$document->render();

        expect($html)->toContain('<div class="article-media">')
            ->and($html)->toContain('https://player.vimeo.com/video/123456789');
    } finally {
        Event::off(MediaEmbed::class, MediaEmbed::EVENT_MODIFY_RENDERED_NODE, $listener);
    }
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
        <<<'TWIG'
{% set owner = block.owner %}
{% if owner is instance of('craft\\elements\\Entry') %}
    <div class="smoke-block-template">{{ block.blockType.handle }}:{{ owner.title }}</div>
{% endif %}
TWIG,
    );

    $view->setTemplateMode(\craft\web\View::TEMPLATE_MODE_SITE);
    $view->setTemplatesPath($templatesPath);

    try {
        expect($view->doesTemplateExist($relative, \craft\web\View::TEMPLATE_MODE_SITE))->toBeTrue();

        $owner = new Entry(['title' => 'Template owner']);
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
        ], $owner, new VizyField(['name' => 'Body', 'handle' => 'body']));

        $html = (string)$document->render([
            'blockTemplates' => [$typeUid => $relative],
        ]);

        expect($html)->toContain('smoke-block-template')
            ->and($html)->toContain($type->handle)
            ->and($html)->toContain('Template owner')
            ->and($document->blocks()[0]->owner())->toBe($owner)
            ->and($document->blocks()[0]->getOwner())->toBe($owner)
            ->and($document->blocks()[0]->owner)->toBe($owner);
    } finally {
        $view->setTemplatesPath($previousPath);
        $view->setTemplateMode($previousMode);
        @unlink($templatesPath . '/_vizy/blocks/smoke-card.twig');
        @rmdir($templatesPath . '/_vizy/blocks');
        @rmdir($templatesPath . '/_vizy');
        @rmdir($templatesPath);
    }
});

it('unwraps Hosted Vizy Block projections to the durable template owner', function() {
    $owner = new Entry(['title' => 'Durable owner']);
    $outerHost = new \verbb\vizy\elements\Block();
    $outerHost->setOwner($owner);
    $innerHost = new \verbb\vizy\elements\Block();
    $innerHost->setOwner($outerHost);
    $node = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => StringHelper::UUID(),
                'enabled' => true,
                'fieldSlots' => [],
            ],
            'content' => [],
        ]],
    ];

    $hosted = (new DocumentParser())->parse($node, $innerHost, new VizyField(['name' => 'Nested body', 'handle' => 'nestedBody']));
    $user = new User(['username' => 'non-entry-owner']);
    $userOwned = (new DocumentParser())->parse($node, $user, new VizyField(['name' => 'User body', 'handle' => 'userBody']));
    $detached = (new DocumentParser())->parse($node);

    expect($hosted->blocks()[0]->owner())->toBe($owner)
        ->and($userOwned->blocks()[0]->owner())->toBe($user)
        ->and($detached->blocks()[0]->owner())->toBeNull();
});
