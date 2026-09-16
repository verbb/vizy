<?php
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\InvalidDocumentException;

it('accepts semantic link marks without href', function() {
    $parser = new DocumentParser();
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'paragraph',
            'content' => [[
                'type' => 'text',
                'text' => 'Example',
                'marks' => [[
                    'type' => 'link',
                    'attrs' => [
                        'type' => 'entry',
                        'targetUid' => '11111111-1111-4111-8111-111111111111',
                        'siteMode' => 'current',
                        'siteUid' => null,
                        'value' => null,
                        'suffix' => null,
                        'newWindow' => false,
                    ],
                ]],
            ]],
        ]],
    ];
    expect(fn() => $parser->parse($document))->not->toThrow(InvalidDocumentException::class);
});

it('rejects link marks that persist href', function() {
    $parser = new DocumentParser();
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'paragraph',
            'content' => [[
                'type' => 'text',
                'text' => 'Bad',
                'marks' => [['type' => 'link', 'attrs' => ['type' => 'url', 'href' => 'https://example.com']]],
            ]],
        ]],
    ];
    expect(fn() => $parser->parse($document))->toThrow(InvalidDocumentException::class);
});

it('accepts semantic image attrs and rejects src', function() {
    $parser = new DocumentParser();
    $good = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'image',
            'attrs' => [
                'assetUid' => '22222222-2222-4222-8222-222222222222',
                'siteMode' => 'current',
                'altMode' => 'asset',
                'size' => 'default',
            ],
        ]],
    ];
    expect(fn() => $parser->parse($good))->not->toThrow(InvalidDocumentException::class);

    $bad = $good;
    $bad['content'][0]['attrs']['src'] = 'https://example.com/image.jpg';
    unset($bad['content'][0]['attrs']['assetUid']);
    expect(fn() => $parser->parse($bad))->toThrow(InvalidDocumentException::class);
});

it('validates table column weight totals', function() {
    $parser = new DocumentParser();
    $good = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'table',
            'attrs' => ['columnWidths' => [600, 400]],
            'content' => [],
        ]],
    ];
    expect(fn() => $parser->parse($good))->not->toThrow(InvalidDocumentException::class);

    $bad = $good;
    $bad['content'][0]['attrs']['columnWidths'] = [500, 400];
    expect(fn() => $parser->parse($bad))->toThrow(InvalidDocumentException::class);
});
