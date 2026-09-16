<?php

declare(strict_types=1);

/**
 * Astra Wave 2 — deterministic public behavior (A04–A06, A12–A13).
 */

use craft\elements\Entry;
use craft\fields\Link;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use GraphQL\Language\AST\BooleanValueNode;
use GraphQL\Language\AST\IntValueNode;
use GraphQL\Language\AST\ListValueNode;
use GraphQL\Language\AST\NameNode;
use GraphQL\Language\AST\NullValueNode;
use GraphQL\Language\AST\ObjectFieldNode;
use GraphQL\Language\AST\ObjectValueNode;
use GraphQL\Language\AST\StringValueNode;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\events\ModifyRenderedNodeEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\types\ArrayType;
use verbb\vizy\helpers\FieldSlotValues;
use verbb\vizy\marks\Link as LinkMark;
use verbb\vizy\models\BlockType;
use verbb\vizy\nodes\Image;
use verbb\vizy\Vizy;
use yii\base\Event;
use craft\models\FieldLayout;
use verbb\vizy\elements\Block;

it('keeps distinct Blocks in separate layout columns under unique render cache paths', function() {
    Vizy::$plugin->getExtensions()->reset();

    $typeA = StringHelper::UUID();
    $typeB = StringHelper::UUID();
    $uidA = StringHelper::UUID();
    $uidB = StringHelper::UUID();

    foreach ([[$typeA, 'TypeA'], [$typeB, 'TypeB']] as [$uid, $name]) {
        $type = new BlockType([
            'uid' => $uid,
            'name' => $name,
            'handle' => strtolower($name) . StringHelper::randomString(4),
        ]);
        $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
        $layout->setTabs([]);
        $type->setFieldLayout($layout);
        expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    }

    $view = Craft::$app->getView();
    $previousMode = $view->getTemplateMode();
    $previousPath = $view->getTemplatesPath();
    $templatesPath = sys_get_temp_dir() . '/vizy-astra-a04-' . StringHelper::randomString(6);
    mkdir($templatesPath . '/_vizy', 0777, true);
    file_put_contents($templatesPath . '/_vizy/block-uid.twig', '[{{ block.uid() }}]');
    $relative = '_vizy/block-uid';

    $view->setTemplateMode(\craft\web\View::TEMPLATE_MODE_SITE);
    $view->setTemplatesPath($templatesPath);

    try {
        $document = (new DocumentParser())->parse([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'layout',
                'attrs' => [
                    'layoutUid' => StringHelper::UUID(),
                    'stack' => 'small',
                ],
                'content' => [
                    [
                        'type' => 'column',
                        'attrs' => ['columnUid' => StringHelper::UUID(), 'span' => 6],
                        'content' => [[
                            'type' => 'vizyBlock',
                            'attrs' => [
                                'blockUid' => $uidA,
                                'blockTypeUid' => $typeA,
                                'enabled' => true,
                                'fieldSlots' => [],
                            ],
                        ]],
                    ],
                    [
                        'type' => 'column',
                        'attrs' => ['columnUid' => StringHelper::UUID(), 'span' => 6],
                        'content' => [[
                            'type' => 'vizyBlock',
                            'attrs' => [
                                'blockUid' => $uidB,
                                'blockTypeUid' => $typeB,
                                'enabled' => true,
                                'fieldSlots' => [],
                            ],
                        ]],
                    ],
                ],
            ]],
        ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

        $html = (string)$document->render([
            'blockTemplates' => [
                $typeA => $relative,
                $typeB => $relative,
            ],
        ]);
        expect($html)->toContain("[{$uidA}]")
            ->and($html)->toContain("[{$uidB}]");

        $blockNodes = [];
        foreach ($document->content()->nodes() as $layout) {
            foreach ($layout['content'] ?? [] as $column) {
                foreach ($column['content'] ?? [] as $child) {
                    if (($child['type'] ?? null) === 'vizyBlock') {
                        $blockNodes[] = $child;
                    }
                }
            }
        }
        expect($blockNodes)->toHaveCount(2);
        $renderer = Vizy::$plugin->getRenderer();
        $reversed = (string)$renderer->renderNode($document, $blockNodes[1], [
            'blockTemplates' => [$typeA => $relative, $typeB => $relative],
        ]) . (string)$renderer->renderNode($document, $blockNodes[0], [
            'blockTemplates' => [$typeA => $relative, $typeB => $relative],
        ]);
        expect($reversed)->toBe("[{$uidB}][{$uidA}]");
    } finally {
        $view->setTemplatesPath($previousPath);
        $view->setTemplateMode($previousMode);
        @unlink($templatesPath . '/_vizy/block-uid.twig');
        @rmdir($templatesPath . '/_vizy');
        @rmdir($templatesPath);
    }
});

it('coerces GraphQL ArrayType object and list literals to PHP values', function() {
    $type = new ArrayType();

    $literal = new ObjectValueNode([
        'fields' => [
            new ObjectFieldNode([
                'name' => new NameNode(['value' => 'type']),
                'value' => new ListValueNode([
                    'values' => [
                        new StringValueNode(['value' => 'paragraph']),
                        new StringValueNode(['value' => 'vizyBlock']),
                    ],
                ]),
            ]),
            new ObjectFieldNode([
                'name' => new NameNode(['value' => 'enabled']),
                'value' => new NullValueNode([]),
            ]),
            new ObjectFieldNode([
                'name' => new NameNode(['value' => 'limit']),
                'value' => new IntValueNode(['value' => '20']),
            ]),
            new ObjectFieldNode([
                'name' => new NameNode(['value' => 'ok']),
                'value' => new BooleanValueNode(['value' => true]),
            ]),
        ],
    ]);

    expect($type->parseLiteral($literal))->toBe([
        'type' => ['paragraph', 'vizyBlock'],
        'enabled' => null,
        'limit' => 20,
        'ok' => true,
    ]);

    $obj = new class {
        public function toArray(): array
        {
            return ['a' => 1];
        }
    };
    expect($type->serialize($obj))->toBe('{"a":1}');
});

it('does not JSON-decode Plain Text that looks like JSON', function() {
    $plain = new PlainText(['handle' => 'heading']);
    $raw = '["red","blue"]';

    expect(FieldSlotValues::forSetFieldValue($plain, $raw))->toBe($raw);

    $link = new Link(['handle' => 'cta']);
    $linkJson = '{"type":"url","value":"https://example.com"}';
    expect(FieldSlotValues::forSetFieldValue($link, $linkJson))->toBe([
        'type' => 'url',
        'value' => 'https://example.com',
    ]);
});

it('fires base Node rendered-HTML handlers exactly once per occurrence', function() {
    Vizy::$plugin->getExtensions()->reset();

    $hits = 0;
    Event::on(Node::class, Node::EVENT_MODIFY_RENDERED_NODE, function(ModifyRenderedNodeEvent $event) use (&$hits): void {
        $hits++;
        $event->renderedNode .= '<!--x-->';
    });

    try {
        $document = (new DocumentParser())->parse([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'paragraph',
                'content' => [['type' => 'text', 'text' => 'Hi']],
            ]],
        ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

        $html = (string)$document->render();
        expect($hits)->toBe(1)
            ->and(substr_count($html, '<!--x-->'))->toBe(1);
    } finally {
        Event::off(Node::class, Node::EVENT_MODIFY_RENDERED_NODE);
    }
});

it('emits semantic image link, size class, and decorative alt', function() {
    Vizy::$plugin->getExtensions()->reset();

    $assetUid = StringHelper::UUID();
    $html = Image::renderOccurrenceHtml('', Image::resolveAttrs([
        'assetUid' => $assetUid,
        'src' => 'https://cdn.example.com/pic.jpg',
        'altMode' => 'decorative',
        'size' => 'large',
        'link' => [
            'type' => 'url',
            'value' => 'https://example.com/more',
            'siteMode' => 'current',
            'newWindow' => true,
        ],
    ], RenderContext::empty()), RenderContext::empty());

    expect($html)->toContain('vizy-image--large')
        ->and($html)->toContain('alt=""')
        ->and($html)->toContain('href="https://example.com/more"')
        ->and($html)->toContain('target="_blank"')
        ->and($html)->toContain('<img');
});

it('honors Image modifyTag handlers on the custom emitter path', function() {
    Vizy::$plugin->getExtensions()->reset();

    Event::on(Image::class, Node::EVENT_MODIFY_TAG, function($event): void {
        $event->tag[0]['attrs']['data-vizy'] = 'img';
    });

    try {
        $html = Image::renderOccurrenceHtml('', [
            'src' => 'https://cdn.example.com/pic.jpg',
            'alt' => 'x',
        ], RenderContext::empty());

        expect($html)->toContain('data-vizy="img"');
    } finally {
        Event::off(Image::class, Node::EVENT_MODIFY_TAG);
    }
});

it('resolves fixed-site link siteUid for href resolution', function() {
    $sites = Craft::$app->getSites()->getAllSites();
    expect($sites)->not->toBeEmpty();
    $site = $sites[0];

    $resolved = LinkMark::resolveSiteId([
        'siteMode' => 'fixed',
        'siteUid' => $site->uid,
    ], 99999);

    expect($resolved)->toBe((int)$site->id);

    expect(LinkMark::resolveHref([
        'type' => 'url',
        'value' => 'https://example.com/path',
        'siteMode' => 'fixed',
        'siteUid' => $site->uid,
    ]))->toBe('https://example.com/path');
});
