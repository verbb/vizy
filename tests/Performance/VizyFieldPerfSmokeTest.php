<?php

use craft\elements\Entry;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\Performance\QueryProfiler;

it('normalizes and exports small and large prose documents without per-node queries', function() {
    $field = VizyFixtureFactory::vizyField();
    $owner = VizyFixtureFactory::entry('Pure document budget');
    $profiles = [];
    foreach ([10, 500] as $count) {
        $data = json_decode(VizyFixtureFactory::paragraphDocument(), true);
        $data['content'] = array_map(static fn(int $i): array => [
            'type' => 'paragraph', 'content' => [['type' => 'text', 'text' => "Paragraph $i"]],
        ], range(1, $count));
        $exported = null;
        $profiles[$count] = QueryProfiler::profile(static function() use ($field, $owner, $data, &$exported): string {
            return $exported = $field->normalizeValue($data, $owner)->toJson();
        });
        expect(json_decode($exported, true))->toBe($data)
            ->and($profiles[$count]['queries'])->toBeLessThanOrEqual(2);
    }
    expect($profiles[500]['queries'])->toBeLessThanOrEqual($profiles[10]['queries']);
})->group('perf');

it('saves changed content and reloads it within bounded database work', function() {
    $field = VizyFixtureFactory::vizyField();
    $entry = VizyFixtureFactory::entry('Save budget', VizyFixtureFactory::paragraphDocument('Before'));
    $entry->setFieldValue($field->handle, VizyFixtureFactory::paragraphDocument('After'));
    $saved = false;
    $save = QueryProfiler::profile(static function() use ($entry, &$saved): bool {
        return $saved = Craft::$app->getElements()->saveElement($entry);
    });
    $reloaded = null;
    $reload = QueryProfiler::profile(static function() use ($entry, &$reloaded): Entry {
        return $reloaded = Entry::find()->id($entry->id)->status(null)->one();
    });
    // Permit normal Craft bookkeeping while rejecting runaway query growth.
    expect($saved)->toBeTrue()
        ->and($save['queries'])->toBeLessThanOrEqual(50)
        ->and($reload['queries'])->toBeGreaterThan(0)->toBeLessThanOrEqual(5)
        ->and($reloaded->getFieldValue($field->handle)->toArray())
        ->toBe(json_decode(VizyFixtureFactory::paragraphDocument('After'), true));
})->group('perf');
