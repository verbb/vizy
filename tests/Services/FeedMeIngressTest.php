<?php

declare(strict_types=1);

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\integrations\feedme\FeedMeDocumentAdapter;
use verbb\vizy\legacy\LegacyDocumentConversionException;

it('wraps Feed Me prose and unknown ordinary nodes in a current canonical envelope', function() {
    $adapter = new FeedMeDocumentAdapter();
    $nodes = [
        ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Imported']]],
        ['type' => 'futureOrdinaryNode', 'attrs' => ['opaque' => ['keep' => true]]],
    ];

    $json = $adapter->canonicalize(json_encode($nodes, JSON_THROW_ON_ERROR));
    $document = (new DocumentParser())->parse(json_decode($json, true, 512, JSON_THROW_ON_ERROR));

    expect($document->schemaVersion())->toBe(VizyDocument::CURRENT_SCHEMA_VERSION)
        ->and($document->content()->nodes())->toBe($nodes);
});

it('rejects legacy Feed Me Blocks without current canonical identities', function() {
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => 'legacy-block',
            'values' => ['type' => 'legacy-type', 'content' => ['fields' => []]],
        ],
    ]];

    expect(fn() => (new FeedMeDocumentAdapter())->canonicalize($legacy))
        ->toThrow(LegacyDocumentConversionException::class, 'current canonical content');
});

it('normalizes Feed Me HTML, plain scalars, and quoted plain text', function() {
    $adapter = new FeedMeDocumentAdapter();

    expect($adapter->html('<p>HTML</p>'))->toBe('<p>HTML</p>')
        ->and($adapter->html(42))->toBe('42')
        ->and($adapter->html('"Quoted text"'))->toBe('Quoted text')
        ->and($adapter->html(['content' => '<p>Nested value</p>']))->toBe('<p>Nested value</p>')
        ->and($adapter->html(['unexpected' => 'shape']))->toBe('');
});
