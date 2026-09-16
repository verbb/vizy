<?php
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\InvalidDocumentException;

it('resolves picker fallback references using the selected or current site', function() {
    [$siteA, $siteB] = \Tests\Support\Fixtures\VizyFixtureFactory::ensureSites(2);
    $field = \Tests\Support\Fixtures\VizyFixtureFactory::vizyField();
    $section = \Tests\Support\Fixtures\VizyFixtureFactory::multisiteSection($field, 1, [$siteA, $siteB]);
    $entryA = \Tests\Support\Fixtures\VizyFixtureFactory::entryOnSite($section, $field, $siteA, 'Link site fixture', \Tests\Support\Fixtures\VizyFixtureFactory::paragraphDocument());
    $entryB = \craft\elements\Entry::find()->id($entryA->id)->siteId($siteB->id)->status(null)->one();
    expect($entryB)->not->toBeNull()->and($entryA->getUrl())->not->toBe($entryB->getUrl());
    $base = ['type' => 'url', 'value' => $entryA->getUrl() . '#entry:' . $entryA->id, 'siteMode' => 'current'];
    expect(\verbb\vizy\marks\Link::resolveHref($base, $siteA->id))->toBe($entryA->getUrl())
        ->and(\verbb\vizy\marks\Link::resolveHref($base, $siteB->id))->toBe($entryB->getUrl())
        ->and(\verbb\vizy\marks\Link::resolveHref([...$base, 'siteMode' => 'fixed', 'siteUid' => $siteA->uid], $siteB->id))->toBe($entryA->getUrl())
        ->and(\verbb\vizy\marks\Link::resolveHref([...$base, 'value' => $base['value'] . '@' . $siteB->id], $siteA->id))->toBe($entryB->getUrl());
});

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
