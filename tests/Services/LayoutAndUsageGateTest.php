<?php
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\InvalidDocumentException;

it('validates layout column spans total twelve', function() {
    $parser = new DocumentParser();
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'layout',
            'attrs' => ['layoutUid' => '11111111-1111-4111-8111-111111111111', 'stack' => 'small'],
            'content' => [
                [
                    'type' => 'column',
                    'attrs' => ['columnUid' => '22222222-2222-4222-8222-222222222222', 'span' => 6],
                    'content' => [],
                ],
                [
                    'type' => 'column',
                    'attrs' => ['columnUid' => '33333333-3333-4333-8333-333333333333', 'span' => 6],
                    'content' => [],
                ],
            ],
        ]],
    ];
    expect(fn() => $parser->parse($document))->not->toThrow(InvalidDocumentException::class);
});

it('rejects layouts whose spans do not total twelve', function() {
    $parser = new DocumentParser();
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'layout',
            'attrs' => ['layoutUid' => '11111111-1111-4111-8111-111111111111', 'stack' => 'small'],
            'content' => [
                [
                    'type' => 'column',
                    'attrs' => ['columnUid' => '22222222-2222-4222-8222-222222222222', 'span' => 5],
                    'content' => [],
                ],
                [
                    'type' => 'column',
                    'attrs' => ['columnUid' => '33333333-3333-4333-8333-333333333333', 'span' => 5],
                    'content' => [],
                ],
            ],
        ]],
    ];
    expect(fn() => $parser->parse($document))->toThrow(InvalidDocumentException::class);
});

it('counts block type usage in canonical documents', function() {
    $document = verbb\vizy\Vizy::$plugin->getDocuments()->normalizeDetached([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            [
                'type' => 'vizyBlock',
                'attrs' => [
                    'blockUid' => 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
                    'blockTypeUid' => 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
                    'enabled' => true,
                    'fieldSlots' => [],
                ],
                'content' => [],
            ],
        ],
    ]);
    $counts = verbb\vizy\Vizy::$plugin->getBlockContentUsages()->countBlockTypesInDocument($document);
    expect($counts['bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'] ?? 0)->toBe(1);
});
