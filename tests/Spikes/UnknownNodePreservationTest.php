<?php

declare(strict_types=1);

use craft\elements\Entry;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\VizyDocument;

it('preserves unknown nodes through the canonical field normalization path', function() {
    $field = VizyFixtureFactory::vizyField();
    $document = $field->normalizeValue(json_encode([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            ['type' => 'futureCustomNode', 'attrs' => ['payload' => 'must-survive']],
        ],
    ]), new Entry(['title' => 'Unknown owner']));

    expect($document)->toBeInstanceOf(VizyDocument::class)
        ->and($document->content()->nodes()[0]['type'])->toBe('futureCustomNode')
        ->and($document->toJson())->toContain('must-survive');
});

it('does not ship the Vizy 3 NodeCollection drop path', function() {
    $modelPath = dirname(__DIR__, 2) . '/src/models/NodeCollection.php';
    $canonical = file_get_contents(dirname(__DIR__, 2) . '/src/document/DocumentParser.php');

    expect(file_exists($modelPath))->toBeFalse()
        ->and($canonical)->not->toContain('getNodes()')
        ->and($canonical)->not->toContain('NodeCollection')
        ->and($canonical)->not->toContain('If an un-registered node, drop it');
});
