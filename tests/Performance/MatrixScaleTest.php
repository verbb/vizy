<?php

declare(strict_types=1);

use craft\helpers\StringHelper;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\Performance\QueryProfiler;

it('preserves larger Matrix documents with bounded sibling query growth', function() {
    $f = new MatrixSupportFixture();
    $profiles = [];
    foreach ([5, 25, 100] as $count) {
        $blocks = [];
        for ($index = 0; $index < $count; $index++) {
            $blocks[] = $f->block(StringHelper::UUID(), $f->payload(["$index:A", "$index:B", "$index:C"]));
        }
        $profiles[$count]['create'] = QueryProfiler::profile(fn() => $f->save($blocks, propagate: false));
        $owner = $f->reload();
        $read = function() use ($owner, $f, $count): array {
            $document = $f->reload($owner)->getFieldValue($f->field->handle);
            $rows = [];
            foreach ($document->blocks() as $block) {
                foreach ($document->blockElement($block)->getFieldValue($f->matrix->handle)->all() as $row) {
                    $rows[$row->id] = (string)$row->getFieldValue($f->text->handle);
                }
            }
            expect($rows)->toHaveCount($count * 3);
            expect(array_values($rows))->toBe(array_merge(...array_map(static fn($i) => ["$i:A", "$i:B", "$i:C"], range(0, $count - 1))));
            return $rows;
        };
        $profiles[$count]['read'] = QueryProfiler::profile($read);
        // Each block needs an ownership lookup, anchor and row query; reading
        // custom fields must not reload the same anchor for every Matrix row.
        expect($profiles[$count]['read']['queries'])->toBeLessThanOrEqual($count * 4 + 20);
        $before = $read();
        $document = $owner->getFieldValue($f->field->handle);
        $profiles[$count]['serialize'] = QueryProfiler::profile(fn() => $document->toArray());
        expect($profiles[$count]['serialize']['queries'])->toBe(0);
        $profiles[$count]['resave'] = QueryProfiler::profile(fn() => $f->save($document->toArray()['content'], propagate: false));
        expect($read())->toBe($before);
        // Start the next sample from an empty persisted document, so deletion
        // of the previous sample is not counted as creation of this one.
        $f->save([], propagate: false);
    }
    fwrite(STDERR, "\nMatrix scale profile: " . json_encode($profiles, JSON_PRETTY_PRINT) . "\n");
    foreach (['create', 'read', 'resave'] as $operation) {
        expect($profiles[25][$operation]['queries'])->toBeLessThanOrEqual($profiles[5][$operation]['queries'] * 6);
        expect($profiles[100][$operation]['queries'])->toBeLessThanOrEqual($profiles[25][$operation]['queries'] * 5);
    }
})->group('perf');
