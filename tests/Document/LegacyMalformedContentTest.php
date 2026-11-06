<?php

use craft\helpers\Json;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\legacy\LegacyDocumentConversionException;
use verbb\vizy\legacy\Vizy3DocumentAdapter;
use verbb\vizy\Vizy;
use yii\log\Logger;

function legacyMalformedWarnings(int $from): array
{
    $warnings = [];

    foreach (array_slice(Craft::getLogger()->messages, $from) as $message) {
        if ($message[1] === Logger::LEVEL_WARNING && str_contains((string)$message[0], 'Skipped malformed Vizy 3 node')) {
            $warnings[] = (string)$message[0];
        }
    }

    return $warnings;
}

it('skips malformed legacy children at the reported path and logs each one', function(mixed $invalid, string $shape) {
    $paragraph = ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Kept', 'marks' => [['type' => 'bold']]]]];
    $legacy = array_fill(0, 3, ['type' => 'paragraph']);
    $legacy[] = ['type' => 'bulletList', 'content' => array_fill(0, 5, ['type' => 'listItem', 'content' => [$paragraph]])];
    // Match the failing content.3.content.4.content.1 path from the report.
    $legacy[3]['content'][4]['content'] = [$paragraph, $invalid, $paragraph];
    $expected = $legacy;
    $expected[3]['content'][4]['content'] = [$paragraph, $paragraph];
    $logged = count(Craft::getLogger()->messages);
    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, []);

    expect($canonical['content'])->toBe($expected)
        ->and(legacyMalformedWarnings($logged))->toBe([
            "Skipped malformed Vizy 3 node at content.3.content.4.content.1 ({$shape}) while converting legacy content.",
        ]);
    (new DocumentParser())->parse($canonical);
})->with([
    'false' => [false, 'bool'],
    'zero' => [0, 'int'],
    'empty string' => ['', 'string'],
    'empty object' => [[], 'keys: none'],
    'missing type' => [['text' => 'Never rendered by Vizy 3'], 'keys: text'],
    'empty type' => [['type' => '', 'text' => 'x'], 'keys: type, text'],
    'non-string type' => [['type' => 5], 'keys: type'],
    'typeless wrapper with children' => [['content' => [['type' => 'text', 'text' => 'Dropped with parent']]], 'keys: content'],
]);

it('does not log skipped null or empty text children', function() {
    $logged = count(Craft::getLogger()->messages);
    (new Vizy3DocumentAdapter())->convert([['type' => 'paragraph', 'content' => [null, ['type' => 'text', 'text' => '']]]], []);

    expect(legacyMalformedWarnings($logged))->toBe([]);
});

it('restores required content in lists and blockquotes emptied by skipped children', function(string $type, array $restored) {
    $legacy = [['type' => $type, 'content' => [['text' => 'stray'], null]]];
    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, []);

    expect($canonical['content'])->toBe([['type' => $type, 'content' => $restored]]);

    // Exercise the field's persisted JSON read and save path, not only the adapter.
    $documents = Vizy::$plugin->getDocuments();
    $saved = $documents->serializeValue($documents->normalizeDetached(Json::encode($legacy), []));
    expect($documents->serializeValue($documents->normalizeDetached($saved)))->toBe($saved);
})->with([
    'bullet list' => ['bulletList', [['type' => 'listItem', 'content' => [['type' => 'paragraph']]]]],
    'ordered list' => ['orderedList', [['type' => 'listItem', 'content' => [['type' => 'paragraph']]]]],
    'blockquote' => ['blockquote', [['type' => 'paragraph']]],
]);

it('keeps malformed root nodes and marks strict', function() {
    expect(fn() => (new Vizy3DocumentAdapter())->convert([['text' => 'root']], []))
        ->toThrow(LegacyDocumentConversionException::class, 'Malformed legacy node at content.0.')
        ->and(fn() => (new Vizy3DocumentAdapter())->convert([
            ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'A', 'marks' => ['bold']]]],
        ], []))->toThrow(LegacyDocumentConversionException::class, 'Malformed legacy mark at content.0.content.0.marks.0.');
});
