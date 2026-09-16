<?php

declare(strict_types=1);

use craft\helpers\StringHelper;
use verbb\vizy\document\DeterministicUidFactory;
use verbb\vizy\document\DocumentLocation;
use verbb\vizy\document\DocumentMutationException;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\InternalDocumentBuilder;

function builderDocument(string $parentUid, string $childUid, string $typeUid): array
{
    return [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            builderCanonicalBlock($parentUid, $typeUid),
            builderCanonicalBlock($childUid, $typeUid),
            builderCanonicalBlock('sibling', $typeUid),
        ],
    ];
}

/** Leaf Block — Hosted nesting is fieldSlots, not TipTap slot children. */
function builderCanonicalBlock(string $uid, string $typeUid, array $fields = []): array
{
    return [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => $uid,
            'blockTypeUid' => $typeUid,
            'enabled' => true,
            'fieldSlots' => $fields,
        ],
        'content' => [],
    ];
}

it('mutates a private canonical copy and commits through strict parsing', function() {
    $typeUid = StringHelper::UUID();
    $placementUid = StringHelper::UUID();
    $source = (new DocumentParser())->parse(builderDocument('parent', 'child', $typeUid));
    $original = $source->toArray();
    $validatorCalls = [];
    $builder = new InternalDocumentBuilder(
        $source,
        function($document, string $operation) use (&$validatorCalls, $typeUid): void {
            $validatorCalls[] = $operation;
            foreach ($document->blocks() as $block) {
                if ($block->blockTypeUid() !== $typeUid) {
                    throw new DocumentMutationException('Unresolved Block Type.');
                }
            }
        },
        new DeterministicUidFactory('builder-private-copy'),
    );

    $builder
        ->insert(DocumentLocation::root(0), ['type' => 'paragraph', 'content' => []])
        ->setRawPlacement('parent', $placementUid, null)
        ->moveBlock('child', DocumentLocation::root(1))
        ->removeBlock('sibling');
    $committed = $builder->commit();

    expect($source->toArray())->toBe($original)
        ->and($source->findBlock('child')->uid())->toBe('child')
        ->and($committed)->not->toBe($source)
        ->and(array_map(fn($block) => $block->uid(), $committed->blocks()))->toBe(['child', 'parent'])
        ->and($committed->findBlock('parent')->hasRawFieldValue($placementUid))->toBeTrue()
        ->and($committed->findBlock('parent')->rawFieldValue($placementUid))->toBeNull()
        ->and($validatorCalls)->toContain('commit');
});

it('regenerates copied subtree identities deterministically while moves preserve them', function() {
    $typeUid = StringHelper::UUID();
    $source = (new DocumentParser())->parse(builderDocument('parent', 'child', $typeUid));
    $build = fn() => new InternalDocumentBuilder(
        $source,
        static fn() => true,
        new DeterministicUidFactory('replayable-copy'),
    );

    $first = $build();
    $firstCopyUid = $first->copyBlock('parent', DocumentLocation::root(3));
    $firstDocument = $first->commit();
    $second = $build();
    $secondCopyUid = $second->copyBlock('parent', DocumentLocation::root(3));
    $secondDocument = $second->commit();

    $copied = $firstDocument->findBlock($firstCopyUid);
    expect($firstCopyUid)->toBe($secondCopyUid)
        ->and($firstDocument->toArray())->toBe($secondDocument->toArray())
        ->and($firstCopyUid)->not->toBe('parent')
        ->and($copied->uid())->toBe($firstCopyUid)
        ->and($source->findBlock('child')->uid())->toBe('child');
});

it('rolls back failed operations and rejects policy-invalid root inserts', function() {
    $typeUid = StringHelper::UUID();
    $source = (new DocumentParser())->parse(builderDocument('parent', 'child', $typeUid));
    $builder = new InternalDocumentBuilder(
        $source,
        static function($document, string $operation, ?DocumentLocation $location): bool {
            // Reject inserting non-blocks at root.
            if ($operation === 'insert' && $location) {
                foreach ($document->content()->nodes() as $node) {
                    if (($node['type'] ?? null) === 'paragraph') {
                        return false;
                    }
                }
            }
            return true;
        },
        new DeterministicUidFactory('rollback'),
    );
    $before = $builder->workingArray();

    expect(fn() => $builder->insert(
        DocumentLocation::root(1),
        ['type' => 'paragraph', 'content' => []],
    ))->toThrow(DocumentMutationException::class)
        ->and($builder->workingArray())->toBe($before)
        ->and(fn() => $builder->moveBlock('missing', DocumentLocation::root(0)))
        ->toThrow(DocumentMutationException::class)
        ->and($builder->workingArray())->toBe($before);
});
