<?php

use Tests\Support\ManifestContractFixture;

it('transports Enabled Link Settings and invalidates cached field manifests', function() {
    $field = new \verbb\vizy\fields\VizyField(['uid' => \craft\helpers\StringHelper::UUID(), 'handle' => 'linkPolicy']);
    $service = \verbb\vizy\Vizy::$plugin->getEditorManifests();
    $enabled = $service->build($field);
    $field->linkSettings = [];
    $disabled = $service->build($field);
    expect($enabled['field']['linkSettings'])->toBe(['text', 'newWindow', 'site', 'title', 'classes'])
        ->and($disabled['field']['linkSettings'])->toBe([])
        ->and($disabled['hash'])->not->toBe($enabled['hash']);
});

it('transports the plain-text paste policy and invalidates cached manifests when it changes', function() {
    $field = new \verbb\vizy\fields\VizyField(['uid' => \craft\helpers\StringHelper::UUID(), 'handle' => 'pastePolicy']);
    $service = \verbb\vizy\Vizy::$plugin->getEditorManifests();
    $rich = $service->build($field);
    $field->pasteAsPlainText = true;
    $plain = $service->build($field);
    expect($rich['field']['pasteAsPlainText'])->toBeFalse()
        ->and($plain['field']['pasteAsPlainText'])->toBeTrue()
        ->and($plain['hash'])->not->toBe($rich['hash']);
});

it('matches the reviewed manifest consumed by the frontend', function() {
    $expected = json_decode(file_get_contents(__DIR__ . '/../Fixtures/editor-manifest.golden.json'), true, flags: JSON_THROW_ON_ERROR);
    expect(ManifestContractFixture::build())->toBe($expected);
});

it('transports Initial Rows without sharing another field instance height', function() {
    $field = new \verbb\vizy\fields\VizyField(['uid' => \craft\helpers\StringHelper::UUID(), 'handle' => 'rowPolicy']);
    $service = \verbb\vizy\Vizy::$plugin->getEditorManifests();
    $hashes = [];
    foreach ([0, 1, 20] as $rows) {
        $field->initialRows = $rows;
        $manifest = $service->build($field);
        expect($manifest['field']['initialRows'])->toBe($rows);
        $hashes[] = $manifest['hash'];
    }
    expect(array_unique($hashes))->toHaveCount(3);
});
