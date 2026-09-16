<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\helpers\StringHelper;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\DocumentUpgrader;
use verbb\vizy\document\InvalidDocumentException;
use verbb\vizy\document\UnsupportedDocumentVersionException;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\legacy\LegacyDocumentConversionException;
use verbb\vizy\legacy\Vizy3DocumentAdapter;

function canonicalDocument(array $content): array
{
    return [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => $content,
    ];
}

/** Leaf vizyBlock — nesting lives in Hosted fieldSlots, not TipTap children. */
function canonicalBlock(string $uid, string $typeUid, array $fields = []): array
{
    return [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => $uid,
            'blockTypeUid' => $typeUid,
            'enabled' => true,
            'fieldSlots' => $fields,
        ],
    ];
}

it('parses immutable leaf blocks and preserves request identities', function() {
    $typeUid = StringHelper::UUID();
    $placementUid = StringHelper::UUID();
    $nestedDoc = canonicalDocument([
        canonicalBlock('nested', $typeUid),
    ]);
    $data = canonicalDocument([
        canonicalBlock('root', $typeUid, [
            $placementUid => $nestedDoc,
        ]),
        canonicalBlock('sibling', $typeUid),
    ]);

    $document = (new DocumentParser())->parse($data);

    // TipTap tree only sees root-level leaf blocks; Hosted nested docs stay in fieldSlots.
    expect(array_map(fn($block) => $block->uid(), $document->blocks()))->toBe(['root', 'sibling'])
        ->and($document->findBlock('root'))->toBe($document->blocks()[0])
        ->and($document->content())->toBe($document->content())
        ->and($document->findBlock('root')->rawFieldValue($placementUid))->toBe($nestedDoc);
});

it('rejects ambiguous duplicate block UID lookup while retaining raw traversal', function() {
    $typeUid = StringHelper::UUID();
    $document = (new DocumentParser())->parse(canonicalDocument([
        canonicalBlock('duplicate', $typeUid),
        canonicalBlock('duplicate', $typeUid),
    ]));

    expect(fn() => $document->findBlock('duplicate'))->toThrow(UnexpectedValueException::class)
        ->and(iterator_to_array($document->traverse()))->toHaveCount(2)
        ->and($document->toArray()['content'])->toHaveCount(2);
});

it('preserves unknown nodes marks and raw placement distinctions', function() {
    $typeUid = StringHelper::UUID();
    $placementUid = StringHelper::UUID();
    $unknown = [
        'type' => 'futureNode',
        'attrs' => ['opaque' => ['x' => 1]],
        'content' => [[
            'type' => 'text',
            'text' => 'future',
            'marks' => [['type' => 'futureMark', 'attrs' => ['x' => true]]],
        ]],
    ];
    $document = (new DocumentParser())->parse(canonicalDocument([
        $unknown,
        canonicalBlock('block', $typeUid, [
            $placementUid => null,
            'empty-string' => '',
            'empty-array' => [],
        ]),
    ]));
    $block = $document->blocks()[0];

    expect((new DocumentSerializer())->serialize($document))->toBe($document->toArray())
        ->and($document->content()->nodes()[0])->toBe($unknown)
        ->and($block->hasRawFieldValue($placementUid))->toBeTrue()
        ->and($block->rawFieldValue($placementUid))->toBeNull()
        ->and($block->hasRawFieldValue('missing'))->toBeFalse()
        ->and(fn() => $block->rawFieldValue('missing'))->toThrow(OutOfBoundsException::class);
});

it('rejects malformed placeholders legacy attrs and future versions', function() {
    $parser = new DocumentParser();
    $typeUid = StringHelper::UUID();

    expect(fn() => $parser->parse(canonicalDocument([['type' => 'unsupportedNode', 'attrs' => []]])))
        ->toThrow(InvalidDocumentException::class)
        ->and(fn() => $parser->parse(canonicalDocument([[
            'type' => 'vizyBlock',
            'attrs' => ['id' => 'legacy', 'values' => ['type' => 'old']],
        ]])))
        ->toThrow(InvalidDocumentException::class)
        ->and(fn() => (new DocumentUpgrader())->upgrade([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => 999],
            'content' => [],
        ]))->toThrow(UnsupportedDocumentVersionException::class)
        ->and(fn() => (new DocumentUpgrader())->upgrade([]))
        ->toThrow(InvalidDocumentException::class);
});

it('accepts a cleared editor payload that omitted empty content', function() {
    // ProseMirror Node.toJSON() / TipTap getJSON() leave `content` off when the doc
    // is empty. Authors clearing a Vizy field must still save.
    $payload = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
    ];

    $upgraded = (new DocumentUpgrader())->upgrade($payload);
    $document = (new DocumentParser())->parse($payload);

    expect($upgraded['content'])->toBe([])
        ->and($document->toArray()['content'])->toBe([])
        ->and($document->content()->nodes())->toBe([]);
});

it('sanitizes Vizy 3 listItem quirks on convert and on canonical upgrade', function() {
    $legacy = [[
        'type' => 'bulletList',
        'content' => [[
            'type' => 'listItem',
            'content' => [['type' => 'text', 'text' => 'Bullet item']],
            'text' => '',
        ]],
    ]];

    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, []);
    $item = $canonical['content'][0]['content'][0];

    expect($item)->not->toHaveKey('text')
        ->and($item['content'][0]['type'])->toBe('paragraph')
        ->and($item['content'][0]['content'][0]['text'])->toBe('Bullet item');

    // Already-promoted envelopes with the same quirk heal on upgrade/parse.
    $promoted = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => $legacy,
    ];
    $healed = (new DocumentUpgrader())->upgrade($promoted);
    $healedItem = $healed['content'][0]['content'][0];

    expect($healedItem)->not->toHaveKey('text')
        ->and($healedItem['content'][0]['type'])->toBe('paragraph');

    $document = (new DocumentParser())->parse($promoted);
    expect($document->toArray()['content'][0]['content'][0])->not->toHaveKey('text');
});

it('converts strict Vizy 3 blocks only with complete explicit mappings', function() {
    $typeUid = StringHelper::UUID();
    $oldPlacement = 'heading';
    $newPlacement = StringHelper::UUID();
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => 'legacy-block',
            'enabled' => false,
            'collapsed' => true,
            'values' => [
                'type' => 'type-old',
                'content' => ['fields' => [$oldPlacement => 'Heading']],
            ],
        ],
    ]];
    $map = [
        'type-old' => [
            'blockTypeUid' => $typeUid,
            'placementUids' => [$oldPlacement => $newPlacement],
        ],
    ];

    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, $map);
    $document = (new DocumentParser())->parse($canonical);
    expect($document->blocks())->toBe([]);
    $block = $document->blocks(null)[0];

    expect($block->uid())->toBe('legacy-block')
        ->and($block->blockTypeUid())->toBe($typeUid)
        ->and($block->isEnabled())->toBeFalse()
        ->and($block->rawFieldValue($newPlacement))->toBe('Heading')
        ->and($block->toArray()['attrs'])->not->toHaveKeys(['id', 'values', 'collapsed'])
        ->and(fn() => (new Vizy3DocumentAdapter())->convert($legacy, []))
        ->toThrow(LegacyDocumentConversionException::class);
});

it('accepts every historical MatrixAnchor location into canonical attrs', function(array $anchorAttrs, string $expectedUid) {
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => array_replace_recursive([
            'id' => 'matrix-block',
            'values' => [
                'type' => 'type-old',
                'content' => ['fields' => []],
            ],
        ], $anchorAttrs),
    ]];
    $map = ['type-old' => [
        'blockTypeUid' => StringHelper::UUID(),
        'placementUids' => [],
    ]];

    $canonical = (new Vizy3DocumentAdapter())->convert($legacy, $map);
    expect($canonical['content'][0]['attrs']['matrixAnchorUid'])->toBe($expectedUid)
        ->and($canonical['content'][0]['attrs'])->not->toHaveKey('values');
})->with([
    'live Vizy 3 values location' => [['values' => ['matrixAnchorUid' => 'anchor-live']], 'anchor-live'],
    'historical attrs location' => [['matrixAnchorUid' => 'anchor-attrs'], 'anchor-attrs'],
    'historical values content location' => [['values' => ['content' => ['matrixAnchorUid' => 'anchor-content']]], 'anchor-content'],
]);

it('rejects bare Vizy 3 Blocks when the explicit schema map is empty', function() {
    $documents = new \verbb\vizy\services\Documents();
    $documents->init();
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => 'unmapped-block',
            'values' => ['type' => 'type-old', 'content' => ['fields' => []]],
        ],
    ]];

    expect(fn() => $documents->normalizeDetached($legacy, []))
        ->toThrow(LegacyDocumentConversionException::class, 'No explicit Block Type mapping');
});

it('rejects retired vizySlot Content Areas', function(array $content) {
    expect(fn() => (new DocumentParser())->parse(canonicalDocument($content)))
        ->toThrow(InvalidDocumentException::class);
})->with([
    'slot at root' => [[[
        'type' => 'vizySlot',
        'attrs' => ['contentAreaUid' => 'area'],
        'content' => [],
    ]]],
    'slot below ordinary node' => [[[
        'type' => 'paragraph',
        'content' => [[
            'type' => 'vizySlot',
            'attrs' => ['contentAreaUid' => 'area'],
            'content' => [],
        ]],
    ]]],
]);

it('strips leftover TipTap children from vizyBlock on upgrade', function() {
    $typeUid = StringHelper::UUID();
    $cases = [
        array_replace(canonicalBlock('block-prose', $typeUid), [
            'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'orphan']]]],
        ]),
        array_replace(canonicalBlock('block-slot', $typeUid), [
            'content' => [
                ['type' => 'vizySlot', 'attrs' => ['contentAreaUid' => 'area'], 'content' => []],
            ],
        ]),
        array_replace(canonicalBlock('block-empty', $typeUid), [
            'content' => [],
        ]),
    ];

    foreach ($cases as $block) {
        $payload = canonicalDocument([$block]);
        $healed = (new DocumentUpgrader())->upgrade($payload);
        expect($healed['content'][0])->not->toHaveKey('content');

        // Normalize must open the entry — not hard-fail on pre-leaf leftovers.
        $document = (new DocumentParser())->parse($payload);
        expect($document->toArray()['content'][0])->not->toHaveKey('content')
            ->and($document->blocks()[0]->uid())->toBe($block['attrs']['blockUid']);
    }
});

it('preserves unknown ordinary subtrees without imposing ordinary child grammar', function() {
    $unknown = [
        'type' => 'futureContainer',
        'content' => [[
            'type' => 'futureLeaf',
            'attrs' => ['opaque' => true],
        ]],
    ];
    $document = (new DocumentParser())->parse(canonicalDocument([$unknown]));

    expect($document->content()->nodes())->toBe([$unknown]);
});

it('requires explicit maps for detached bare lists and recontextualizes immutably', function() {
    $documents = new \verbb\vizy\services\Documents();
    $documents->init();
    $bare = [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'legacy']]]];

    expect(fn() => $documents->normalizeDetached($bare))->toThrow(InvalidDocumentException::class);

    $detached = $documents->normalizeDetached($bare, []);
    $owner = new Entry(['title' => 'Owner']);
    $field = new VizyField(['name' => 'Body', 'handle' => 'body']);
    $bound = $detached->recontextualize($owner, $field);

    expect($detached->owner())->toBeNull()
        ->and($bound->owner())->toBe($owner)
        ->and($bound->field())->toBe($field)
        ->and($bound->toArray())->toBe($detached->toArray());
});

it('keeps isEmpty as a first-class alias and honest NodeCollection deprecation shims', function() {
    $field = new VizyField(['name' => 'Body', 'handle' => 'bodyShim']);
    $document = (new DocumentParser())->parse(canonicalDocument([[
        'type' => 'paragraph',
        'content' => [['type' => 'text', 'text' => 'Shim']],
    ]]), new Entry(['title' => 'Owner']), $field);

    expect($document->isEmpty())->toBeFalse()
        ->and($document->isEmpty())->toBe($document->content()->isEmpty())
        ->and($document->getField())->toBe($field)
        ->and($document->getRawNodes())->toBe($document->content()->toArray())
        ->and((string)$document->renderHtml())->toBe('<p>Shim</p>')
        ->and((string)$document->renderStaticHtml())->toBe('<p>Shim</p>')
        ->and(fn() => $document->renderHtml(['blockTemplates' => ['unsafe' => '_private']]))
        ->toThrow(InvalidArgumentException::class, 'cannot translate legacy render configuration')
        ->and(method_exists($document, '__toString'))->toBeFalse()
        ->and(method_exists($document, 'count'))->toBeFalse()
        ->and(method_exists($document, 'getNodes'))->toBeFalse()
        ->and(method_exists($document, 'query'))->toBeTrue()
        ->and(method_exists($document, 'all'))->toBeTrue()
        ->and(method_exists($document, 'serializeValues'))->toBeFalse();
});

it('queries root nodes with the Vizy 3 ArrayQuery consumer API', function() {
    $typeUid = StringHelper::UUID();
    $document = (new DocumentParser())->parse(canonicalDocument([
        [
            'type' => 'paragraph',
            'content' => [['type' => 'text', 'text' => 'One']],
        ],
        canonicalBlock('block-a', $typeUid),
        [
            'type' => 'paragraph',
            'content' => [['type' => 'text', 'text' => 'Two']],
        ],
        [
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => 'block-disabled',
                'blockTypeUid' => $typeUid,
                'enabled' => false,
                'fieldSlots' => [],
            ],
            'content' => [],
        ],
        [
            'type' => 'futureCustomNode',
            'attrs' => ['x' => 1],
        ],
    ]));

    $paragraphs = $document->query()->where(['type' => 'paragraph'])->all();
    expect($paragraphs)->toHaveCount(2)
        ->and($paragraphs[0])->toBeInstanceOf(\verbb\vizy\document\VizyContentNode::class)
        ->and($paragraphs[0]->type)->toBe('paragraph');

    $default = $document->all();
    // Default enabled=true: two paragraphs + one enabled block + unknown node (not disabled block).
    expect($default)->toHaveCount(4)
        ->and(array_map(fn($n) => $n->type, $default))->toBe([
            'paragraph',
            'vizyBlock',
            'paragraph',
            'futureCustomNode',
        ]);

    $withDisabled = $document->query()->where(['enabled' => null])->all();
    expect($withDisabled)->toHaveCount(5);

    $onlyDisabled = $document->query()->where(['type' => 'vizyBlock', 'enabled' => false])->all();
    expect($onlyDisabled)->toHaveCount(1)
        ->and($onlyDisabled[0])->toBeInstanceOf(\verbb\vizy\document\VizyBlock::class)
        ->and($onlyDisabled[0]->uid)->toBe('block-disabled');

    expect($document->query()->where(['type' => 'paragraph'])->count())->toBe(2)
        ->and($document->query()->where(['type' => 'paragraph'])->one()->type)->toBe('paragraph')
        ->and($document->query()->where(['type' => 'missing'])->exists())->toBeFalse()
        ->and($document->query()->limit(1)->all())->toHaveCount(1);
});

it('traverses 100 and 500 blocks with zero Block Element projections', function(int $count) {
    $typeUid = StringHelper::UUID();
    $nodes = [];
    for ($i = 0; $i < $count; $i++) {
        $nodes[] = canonicalBlock("block-{$i}", $typeUid);
    }

    $document = (new DocumentParser())->parse(canonicalDocument($nodes));
    expect($document->blocks())->toHaveCount($count)
        ->and(iterator_to_array($document->traverse()))->toHaveCount($count)
        ->and($document->blockElementCreationCount())->toBe(0);
})->with([100, 500]);
