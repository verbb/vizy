<?php

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;

it('preserves required paragraphs before nested lists when trimming', function(string $listType) {
    $field = new VizyField(['trimEmptyParagraphs' => true]);
    $data = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => $listType,
            'content' => [[
                'type' => 'listItem',
                'content' => [
                    ['type' => 'paragraph'],
                    ['type' => $listType, 'content' => [[
                        'type' => 'listItem',
                        'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Nested']]]],
                    ]]],
                ],
            ]],
        ]],
    ];
    $serializer = new DocumentSerializer();
    $serialized = $serializer->serialize(VizyDocument::fromCanonicalData($data, null, $field));
    expect($serialized)->toBe($data);
    expect($serializer->serialize((new DocumentParser())->parse($serialized, null, $field)))->toBe($serialized);
})->with(['bulletList', 'orderedList']);


it('keeps empty structural containers valid while trimming root paragraphs', function(string $type) {
    $field = new VizyField(['trimEmptyParagraphs' => true]);
    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            ['type' => 'paragraph'],
            ['type' => $type, 'content' => [['type' => 'paragraph']]],
        ],
    ], null, $field);
    $data = (new DocumentSerializer())->serialize($document);
    expect($data['content'])->toBe([['type' => $type, 'content' => [['type' => 'paragraph']]]]);
})->with(['blockquote', 'column', 'tableCell', 'tableHeader']);


it('round-trips large documents beyond private clipboard limits', function() {
    $data = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => array_map(static fn(int $index): array => [
            'type' => 'paragraph',
            'content' => [['type' => 'text', 'text' => "Paragraph {$index}: " . str_repeat('Text ', 20)]],
        ], range(0, 3999)),
    ];
    expect(strlen(json_encode($data)))->toBeGreaterThan(256000);
    $field = new VizyField();
    $serializer = new DocumentSerializer();
    $serialized = $serializer->serialize((new DocumentParser())->parse($data, null, $field));
    expect($serialized)->toBe($data);
    expect($serializer->serialize((new DocumentParser())->parse($serialized, null, $field)))->toBe($data);
});
