<?php

use Tests\Support\ManifestContractFixture;

it('matches the reviewed manifest consumed by the frontend', function() {
    $expected = json_decode(file_get_contents(__DIR__ . '/../Fixtures/editor-manifest.golden.json'), true, flags: JSON_THROW_ON_ERROR);
    expect(ManifestContractFixture::build())->toBe($expected);
});
