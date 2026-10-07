<?php

use verbb\vizy\document\RawDocument;

it('copies a nested field slot without changing its source', function() {
    $sourcePlacement = 'source-placement';
    $destinationPlacement = 'destination-placement';
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'block-one',
                'blockTypeUid' => 'card',
                'enabled' => true,
                'fieldSlots' => [
                    $sourcePlacement => 'Original content',
                ],
            ],
        ]],
    ];
    $schema = [
        'types' => [
            'card' => [
                $sourcePlacement => [
                    'placementUid' => $sourcePlacement,
                    'fieldUid' => 'source-field',
                    'layoutUid' => 'card-layout',
                ],
            ],
        ],
        'legacy' => [],
    ];

    $copied = (new RawDocument())->copy(
        $document,
        $schema,
        static fn(mixed $value, array $placement): array => $placement['placementUid'] === $sourcePlacement
            ? [
                'action' => 'copy',
                'placementUid' => $destinationPlacement,
                'value' => strtoupper($value),
            ]
            : ['action' => 'unchanged'],
    );
    $slots = $copied['content'][0]['attrs']['fieldSlots'];

    expect($slots[$sourcePlacement])->toBe('Original content')
        ->and($slots[$destinationPlacement])->toBe('ORIGINAL CONTENT');
});
