<?php

use craft\helpers\Json;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\InvalidDocumentException;
use verbb\vizy\legacy\LegacyDocumentConversionException;
use verbb\vizy\legacy\Vizy3DocumentAdapter;
use verbb\vizy\Vizy;

it('restores an editable paragraph in empty legacy table cells and headers', function(string $type, array $contentAttrs) {
    $cell = ['type' => $type, 'attrs' => ['colspan' => 1, 'rowspan' => 1], ...$contentAttrs];
    $legacy = [['type' => 'table', 'content' => [['type' => 'tableRow', 'content' => [$cell]]]]];
    $original = $legacy;
    $expected = $legacy;
    $expected[0]['content'][0]['content'][0]['content'] = [['type' => 'paragraph']];
    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, []);

    expect($canonical['content'])->toBe($expected)
        ->and($legacy)->toBe($original);

    // Exercise the field's persisted JSON read and save path, not only the adapter.
    $documents = Vizy::$plugin->getDocuments();
    $document = $documents->normalizeDetached(Json::encode($legacy), []);
    $saved = $documents->serializeValue($document);
    expect($document->toArray()['content'][0]['content'][0]['content'][0]['content'])->toBe([['type' => 'paragraph']])
        ->and($documents->serializeValue($documents->normalizeDetached($saved)))->toBe($saved);
})->with(['table cell' => ['tableCell'], 'table header' => ['tableHeader']])->with([
    'null child' => [['content' => [null]]],
    'multiple null children' => [['content' => [null, null]]],
    'empty list' => [['content' => []]],
    'null content' => [['content' => null]],
    'omitted content' => [[]],
]);

it('removes only null child nodes while retaining table structure and formatted text', function() {
    $paragraph = ['type' => 'paragraph', 'content' => [
        ['type' => 'text', 'text' => 'Retained text', 'marks' => [['type' => 'bold']]],
    ]];
    $cell = ['type' => 'tableCell', 'attrs' => ['colspan' => 2, 'rowspan' => 1, 'colwidth' => [120, 180]], 'content' => [$paragraph]];
    $legacy = array_fill(0, 4, ['type' => 'paragraph']);
    $legacy[] = ['type' => 'table', 'content' => array_fill(0, 7, [
        'type' => 'tableRow', 'content' => [$cell],
    ])];
    // Match the failing content.4.content.6.content.0.content.0 path from the report.
    $legacy[4]['content'][6]['content'][0]['content'] = [null];
    $expected = $legacy;
    $expected[4]['content'][6]['content'][0]['content'] = [['type' => 'paragraph']];
    expect((new Vizy3DocumentAdapter())->convert($legacy, [])['content'])->toBe($expected);

    $legacy[4]['content'][0]['content'][0]['content'] = [null, $paragraph, null];
    $legacy[4]['content'][0]['content'][0]['content'][1]['content'] = [null, ...$paragraph['content'], null];
    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, []);

    expect($canonical['content'])->toBe($expected);
    (new DocumentParser())->parse($canonical);
});

it('does not relax canonical content or root node validation', function() {
    expect(fn() => (new Vizy3DocumentAdapter())->convert([null], []))
        ->toThrow(LegacyDocumentConversionException::class, 'Malformed legacy node at content.0.')
        ->and(fn() => (new DocumentParser())->parse([
            'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
            'content' => [['type' => 'paragraph', 'content' => [null]]],
        ]))->toThrow(InvalidDocumentException::class);
});
