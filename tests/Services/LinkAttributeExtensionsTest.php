<?php

declare(strict_types=1);

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\InvalidDocumentException;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\events\RegisterLinkAttributesEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\marks\Link;
use verbb\vizy\services\EditorManifests;

use craft\helpers\StringHelper;

use yii\base\Event;

it('registers schema-safe boolean Link attributes across manifest, storage, and HTML', function() {
    $listener = function(RegisterLinkAttributesEvent $event): void {
        $event->attributes[] = [
            'name' => 'nofollow',
            'label' => 'No follow',
            'htmlAttribute' => 'rel',
            'htmlValue' => 'nofollow',
        ];
        $event->attributes[] = [
            'name' => 'cloaked',
            'label' => 'Cloaked',
            'htmlAttribute' => 'data-cloaked',
            'htmlValue' => '1',
        ];
    };
    Event::on(Link::class, Link::EVENT_REGISTER_ATTRIBUTES, $listener);

    try {
        $field = new VizyField([
            'uid' => StringHelper::UUID(),
            'name' => 'Body',
            'handle' => 'body',
            'editorConfig' => 'standard',
        ]);
        $manifest = (new EditorManifests())->build($field);
        $data = [
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'paragraph',
                'content' => [[
                    'type' => 'text',
                    'text' => 'External',
                    'marks' => [[
                        'type' => 'link',
                        'attrs' => [
                            'type' => 'url',
                            'value' => 'https://example.com',
                            'siteMode' => 'current',
                            'newWindow' => true,
                            'nofollow' => true,
                            'cloaked' => true,
                        ],
                    ]],
                ]],
            ]],
        ];
        $document = (new DocumentParser())->parse($data, null, $field);
        $html = (string)$document->render();

        expect($manifest['field']['linkAttributes'])->toBe([
            [
                'name' => 'nofollow',
                'label' => 'No follow',
                'type' => 'boolean',
                'default' => false,
                'htmlAttribute' => 'rel',
                'htmlValue' => 'nofollow',
            ],
            [
                'name' => 'cloaked',
                'label' => 'Cloaked',
                'type' => 'boolean',
                'default' => false,
                'htmlAttribute' => 'data-cloaked',
                'htmlValue' => '1',
            ],
        ])->and($document->toArray())->toBe($data)
            ->and($html)->toContain('rel="nofollow noopener noreferrer"')
            ->and($html)->toContain('data-cloaked="1"')
            ->and($html)->not->toContain(' nofollow="1"')
            ->and($html)->not->toContain(' cloaked="1"');

        $bad = $data;
        $bad['content'][0]['content'][0]['marks'][0]['attrs']['nofollow'] = 'yes';
        expect(fn() => (new DocumentParser())->parse($bad, null, $field))
            ->toThrow(InvalidDocumentException::class);
    } finally {
        Event::off(Link::class, Link::EVENT_REGISTER_ATTRIBUTES, $listener);
    }
});

it('rejects unsafe Link attribute registrations', function() {
    $listener = function(RegisterLinkAttributesEvent $event): void {
        $event->attributes[] = [
            'name' => 'dangerous',
            'label' => 'Dangerous',
            'htmlAttribute' => 'href',
            'htmlValue' => 'javascript:alert(1)',
        ];
    };
    Event::on(Link::class, Link::EVENT_REGISTER_ATTRIBUTES, $listener);

    try {
        expect(fn() => Link::registeredAttributes())->toThrow(RuntimeException::class);
    } finally {
        Event::off(Link::class, Link::EVENT_REGISTER_ATTRIBUTES, $listener);
    }
});

it('rejects core Link attribute names', function() {
    $listener = function(RegisterLinkAttributesEvent $event): void {
        $event->attributes[] = [
            'name' => 'href',
            'label' => 'Replacement URL',
        ];
    };
    Event::on(Link::class, Link::EVENT_REGISTER_ATTRIBUTES, $listener);

    try {
        expect(fn() => Link::registeredAttributes())->toThrow(RuntimeException::class);
    } finally {
        Event::off(Link::class, Link::EVENT_REGISTER_ATTRIBUTES, $listener);
    }
});
