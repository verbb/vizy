<?php

declare(strict_types=1);

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\gql\GqlNode;
use verbb\vizy\marks\Link;

it('normalizes historic schemeless www links at every resolved output boundary', function() {
    $attrs = [
        'type' => 'url',
        'value' => 'www.example.com/path',
        'siteMode' => 'current',
        'newWindow' => false,
    ];
    $data = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'content' => [[
                'type' => 'text',
                'text' => 'Example',
                'marks' => [['type' => 'link', 'attrs' => $attrs]],
            ]],
        ]],
    ];
    $document = (new DocumentParser())->parse($data);
    $textNode = GqlNode::fromRaw($document, $data['content'][0], 'content.0')->children()[0];

    expect(Link::resolveHref($attrs))->toBe('https://www.example.com/path')
        ->and((string)$document->render())->toContain('href="https://www.example.com/path"')
        ->and($textNode->marks()[0]->linkUrl())->toBe('https://www.example.com/path');
});

it('renders semantic email links consistently through HTML and GraphQL', function() {
    $attrs = [
        'type' => 'email',
        'value' => 'author@example.com',
        'siteMode' => 'current',
        'newWindow' => false,
    ];
    $data = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'content' => [[
                'type' => 'text',
                'text' => 'Email us',
                'marks' => [['type' => 'link', 'attrs' => $attrs]],
            ]],
        ]],
    ];
    $document = (new DocumentParser())->parse($data);
    $textNode = GqlNode::fromRaw($document, $data['content'][0], 'content.0')->children()[0];

    expect(Link::resolveHref($attrs))->toBe('mailto:author@example.com')
        ->and((string)$document->render())->toContain('href="mailto:author@example.com"')
        ->and($textNode->marks()[0]->linkUrl())->toBe('mailto:author@example.com');
});

it('round-trips and renders linked bold italic text exactly once', function() {
    $data = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'content' => [[
                'type' => 'text',
                'text' => 'Linked once',
                'marks' => [
                    ['type' => 'link', 'attrs' => [
                        'type' => 'url',
                        'value' => 'https://example.com',
                        'siteMode' => 'current',
                        'newWindow' => false,
                    ]],
                    ['type' => 'bold'],
                    ['type' => 'italic'],
                ],
            ]],
        ]],
    ];
    $document = (new DocumentParser())->parse($data);
    $serialized = (new DocumentSerializer())->serialize($document);
    $html = (string)$document->render();
    $textNode = GqlNode::fromRaw($document, $data['content'][0], 'content.0')->children()[0];

    expect($serialized)->toBe($data)
        ->and(substr_count($html, 'Linked once'))->toBe(1)
        ->and(substr_count($html, '<a '))->toBe(1)
        ->and(substr_count($html, '<strong>'))->toBe(1)
        ->and(substr_count($html, '<em>'))->toBe(1)
        ->and($textNode->text())->toBe('Linked once')
        ->and(array_map(static fn($mark): string => $mark->type(), $textNode->marks()))
        ->toBe(['link', 'bold', 'italic']);
});
