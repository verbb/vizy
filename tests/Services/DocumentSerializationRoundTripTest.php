<?php

use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;

it('preserves required paragraphs before nested lists', function(string $listType) {
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


it('preserves authored empty paragraphs while keeping structural containers valid', function(string $type) {
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
    expect($data['content'])->toBe([
        ['type' => 'paragraph'],
        ['type' => $type, 'content' => [['type' => 'paragraph']]],
    ]);
})->with(['blockquote', 'column', 'tableCell', 'tableHeader']);


it('repairs empty official structural nodes before they return to the editor', function() {
    $field = new VizyField(['trimEmptyParagraphs' => true]);
    $data = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            [
                'type' => 'taskList',
                'content' => [[
                    'type' => 'taskItem',
                    'attrs' => ['checked' => false],
                    'content' => [],
                ]],
            ],
            [
                'type' => 'details',
                'content' => [
                    ['type' => 'detailsSummary'],
                    ['type' => 'detailsContent', 'content' => []],
                ],
            ],
        ],
    ];
    $expected = $data;
    $expected['content'][0]['content'][0]['content'] = [['type' => 'paragraph']];
    $expected['content'][1]['content'][1]['content'] = [['type' => 'paragraph']];

    $parsed = (new DocumentParser())->parse($data, null, $field);

    expect($parsed->toArray())->toBe($expected)
        ->and((new DocumentSerializer())->serialize($parsed))->toBe($expected);
});


it('applies empty paragraph trimming only to rendered output', function() {
    $data = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            ['type' => 'paragraph'],
            ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Text']]],
            ['type' => 'blockquote', 'content' => [['type' => 'paragraph']]],
        ],
    ];
    $trimmed = VizyDocument::fromCanonicalData($data, null, new VizyField(['trimEmptyParagraphs' => true]));
    $untrimmed = VizyDocument::fromCanonicalData($data, null, new VizyField(['trimEmptyParagraphs' => false]));

    expect((string)$trimmed->render())->toBe('<p>Text</p><blockquote><p></p></blockquote>')
        ->and((string)$untrimmed->render())->toBe('<p></p><p>Text</p><blockquote><p></p></blockquote>');
});


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
