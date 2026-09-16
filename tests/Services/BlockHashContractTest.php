<?php

use verbb\vizy\Vizy;

it('hashes the shared browser corpus preserving object and array distinctions', function() {
    $fixtures = json_decode(file_get_contents(__DIR__ . '/../Fixtures/block-hashes.json'), flags: JSON_THROW_ON_ERROR);
    foreach ($fixtures as $fixture) {
        expect(hash('sha256', $fixture->canonicalJson))->toBe($fixture->sha256)
            ->and(Vizy::$plugin->getFieldLayoutForms()->blockHash($fixture->block))->toBe($fixture->sha256, $fixture->name);
    }
});
