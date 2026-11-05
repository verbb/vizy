<?php

use craft\helpers\Json;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\legacy\LegacyDocumentConversionException;
use verbb\vizy\legacy\Vizy3DocumentAdapter;
use verbb\vizy\marks\Link;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\Vizy;

it('normalizes the Vizy 3 content corpus before editor transport', function(array $case) {
    $documents = Vizy::$plugin->getDocuments();
    $source = Json::encode($case['legacy']);
    $document = $documents->normalizeDetached($source, []);
    $expected = (new DocumentParser())->parse([
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $case['expected'],
    ]);
    expect($document->toArray())->toBe($expected->toArray())
        ->and(Json::encode($case['legacy']))->toBe($source);
    $saved = $documents->serializeValue($document);
    expect($documents->serializeValue($documents->normalizeDetached($saved)))->toBe($saved);
})->with(function() {
    foreach (Json::decode(file_get_contents(dirname(__DIR__) . '/Fixtures/vizy3-normalization.json')) as $case) {
        yield $case['name'] => [$case];
    }
});

it('does not treat associative child objects as sparse node lists', function() {
    expect(fn() => (new Vizy3DocumentAdapter())->convert([
        ['type' => 'paragraph', 'content' => ['named' => ['type' => 'text', 'text' => 'Keep me']]],
    ], []))->toThrow(LegacyDocumentConversionException::class, 'Malformed legacy child content');
});

it('resolves legacy Craft references after semantic link conversion', function() {
    $entry = VizyFixtureFactory::entry('Legacy reference target');
    $references = [
        'https://old.example.test/#entry:' . $entry->id,
        'https://old.example.test/#entry:' . $entry->id . ':url',
        'https://old.example.test/%23entry:' . $entry->id . '@' . $entry->siteId . ':url',
        '{entry:' . $entry->id . ':url||https://old.example.test/}',
    ];
    foreach ($references as $href) {
        $canonical = (new Vizy3DocumentAdapter())->convert([[
            'type' => 'paragraph', 'content' => [[
                'type' => 'text', 'text' => 'Target', 'marks' => [['type' => 'link', 'attrs' => ['href' => $href]]],
            ]],
        ]], []);
        $attrs = $canonical['content'][0]['content'][0]['marks'][0]['attrs'];
        expect(Link::resolveHref($attrs, $entry->siteId))->toBe($entry->getUrl());
    }
});
