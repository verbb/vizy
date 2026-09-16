<?php

use verbb\vizy\document\VizyDocument;
use verbb\vizy\document\VizyNodeQuery;
use verbb\vizy\gql\GqlHelpers;
use verbb\vizy\services\BlockContentUsages;

function enabledContentFixture(): VizyDocument
{
    $block = static fn(string $uid, bool $enabled): array => [
        'type' => 'vizyBlock',
        'attrs' => ['blockUid' => $uid, 'blockTypeUid' => 'callout-type', 'enabled' => $enabled, 'fieldSlots' => []],
    ];
    return VizyDocument::fromCanonicalData([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => 2],
        'content' => [
            $block('visible', true),
            $block('hidden', false),
            ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Prose']]],
            ['type' => 'layout', 'content' => [
                ['type' => 'column', 'content' => [$block('column-visible', true), $block('column-hidden', false)]],
            ]],
        ],
    ]);
}

it('filters public block reads while retaining disabled identities and raw storage', function() {
    $document = enabledContentFixture();
    $uids = static fn(array $blocks): array => array_map(static fn($block) => $block->uid(), $blocks);
    expect($uids($document->blocks()))->toBe(['visible', 'column-visible'])
        ->and($uids($document->blocks(false)))->toBe(['hidden', 'column-hidden'])
        ->and($uids($document->blocks(null)))->toBe(['visible', 'hidden', 'column-visible', 'column-hidden'])
        ->and($uids($document->content()->blocks(false)))->toBe(['visible'])
        ->and($uids($document->content()->blocks(false, null)))->toBe(['visible', 'hidden'])
        ->and($document->findBlock('hidden')->isEnabled())->toBeFalse()
        ->and($document->toArray()['content'][1]['attrs']['enabled'])->toBeFalse()
        ->and((new BlockContentUsages())->countBlockTypesInDocument($document))->toBe(['callout-type' => 4]);
});

it('keeps the enabled scope across query operations', function(string $method, array $condition) {
    $query = enabledContentFixture()->query()->$method($condition);
    expect(array_map(static fn($block) => $block->uid(), $query->all()))->toBe(['visible']);
})->with([
    ['where', ['type' => 'vizyBlock']],
    ['andWhere', ['type' => 'vizyBlock']],
    ['orWhere', ['type' => 'vizyBlock']],
    ['filterWhere', ['type' => 'vizyBlock', 'ignored' => null]],
    ['andFilterWhere', ['type' => 'vizyBlock', 'ignored' => null]],
    ['orFilterWhere', ['type' => 'vizyBlock', 'ignored' => null]],
    ['where', ['or', ['type' => 'vizyBlock'], ['type' => 'missing']]],
]);

it('honours explicit enabled choices through ordinary and filter methods', function(string $method, ?bool $enabled, int $count) {
    $query = enabledContentFixture()->query()->$method(['type' => 'vizyBlock', 'enabled' => $enabled]);
    expect($query->count())->toBe($count)
        ->and($query->exists())->toBeTrue();
    if ($enabled === false) {
        expect($query->one()->uid())->toBe('hidden');
    }
})->with(['where', 'andWhere', 'orWhere', 'filterWhere', 'andFilterWhere', 'orFilterWhere'])
    ->with([[true, 1], [false, 1], [null, 2]]);

it('preserves scope when replacing filters and does not mutate reusable queries', function() {
    $query = enabledContentFixture()->query()->enabled(null)->where(['type' => 'vizyBlock']);
    expect($query->count())->toBe(2)->and($query->where)->toBe(['type' => 'vizyBlock']);
    $copy = clone $query;
    expect($copy->enabled(false)->one()->uid())->toBe('hidden')
        ->and($query->count())->toBe(2)
        ->and($query->enabled(true)->where(['type' => 'vizyBlock'])->count())->toBe(1)
        ->and($query->where([])->count())->toBe(3);
});

it('keeps OR inside the enabled scope but honours explicit enabled expressions', function() {
    $document = enabledContentFixture();
    expect($document->query()->where(['type' => 'missing'])->orWhere(['type' => 'vizyBlock'])->count())->toBe(1)
        ->and($document->query()->where(['=', 'enabled', false])->one()->uid())->toBe('hidden')
        ->and($document->query()->where(['and', ['type' => 'vizyBlock'], ['enabled' => false]])->count())->toBe(1)
        ->and($document->query()->where(['and', ['type' => 'vizyBlock'], ['enabled' => null]])->count())->toBe(2);
});

it('applies filtering before ordering and pagination for every terminal method', function() {
    $query = (new VizyNodeQuery())->from([
        ['type' => 'vizyBlock', 'enabled' => false, 'position' => 0],
        ['type' => 'vizyBlock', 'enabled' => true, 'position' => 2],
        ['type' => 'vizyBlock', 'enabled' => true, 'position' => 1],
    ])->where(['type' => 'vizyBlock'])->orderBy('position ASC')->limit(1);
    expect($query->one()['position'])->toBe(1)->and($query->all()[0]['position'])->toBe(1)
        ->and($query->count())->toBe(1)->and($query->exists())->toBeTrue();
});

it('uses the same enabled choices for GraphQL root and recursive block queries', function(?bool $enabled, int $rootCount, int $blockCount) {
    $document = enabledContentFixture();
    $args = ['where' => ['type' => 'vizyBlock', 'enabled' => $enabled]];
    expect(GqlHelpers::queryRootNodes($document, $args))->toHaveCount($rootCount)
        ->and(GqlHelpers::queryBlocks($document, $args))->toHaveCount($blockCount)
        ->and(GqlHelpers::queryRootNodes($document, ['where' => ['type' => 'vizyBlock']]))->toHaveCount(1)
        ->and(GqlHelpers::queryBlocks($document))->toHaveCount(2);
})->with([[true, 1, 2], [false, 1, 2], [null, 2, 4]]);

it('detects duplicate identities even when one copy is disabled', function() {
    $data = enabledContentFixture()->toArray();
    $data['content'][1]['attrs']['blockUid'] = 'visible';
    $document = VizyDocument::fromCanonicalData($data);
    expect(fn() => $document->findBlock('visible'))->toThrow(UnexpectedValueException::class);
});

it('preserves distinct occurrences and document order in OR and NOT queries', function() {
    $query = (new VizyNodeQuery())->from([
        ['type' => 'vizyBlock', 'enabled' => true, 'label' => 'first'],
        ['type' => 'vizyBlock', 'enabled' => true, 'label' => 'second'],
        ['type' => 'vizyBlock', 'enabled' => false, 'label' => 'hidden'],
        ['type' => 'vizyBlock', 'enabled' => true, 'label' => 'third'],
    ]);
    $labels = static fn($q) => array_column($q->all(), 'label');
    expect($labels((clone $query)->where(['or', ['label' => 'third'], ['type' => 'vizyBlock']])))
        ->toBe(['first', 'second', 'third'])
        ->and($labels((clone $query)->where(['not', ['label' => 'second']])))
        ->toBe(['first', 'third'])
        ->and($labels((clone $query)->where(['or', ['enabled' => false], ['label' => 'second']])))
        ->toBe(['second', 'hidden']);
});
