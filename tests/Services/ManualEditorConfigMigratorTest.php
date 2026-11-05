<?php

declare(strict_types=1);

use craft\helpers\Json;
use craft\helpers\StringHelper;
use verbb\vizy\legacy\ManualEditorConfigMigrator;
use verbb\vizy\Vizy;

it('keeps the always-loaded Vizy 3 text style mark without adding toolbar controls', function() {
    $migrator = new ManualEditorConfigMigrator();
    $payload = $migrator->toAuthorablePayload(['buttons' => ['italic']], 'legacy-text-style');
    $config = Vizy::$plugin->getEditorConfigs()->normalizeRuntimeConfig('legacy-text-style', $payload);

    expect($config['schema']['marks'])->toContain('textStyle', 'italic')
        ->and($payload['toolbar'])->toBe(['italic']);

    // Explicit Vizy 4 capability restrictions must remain authoritative.
    $canonical = $migrator->toAuthorablePayload([
        'capabilities' => ['nodes' => ['paragraph'], 'marks' => ['italic']],
        'toolbar' => ['italic'],
    ], 'canonical-text-style');
    expect($canonical['capabilities']['marks'])->toBe(['italic']);
});

it('preserves built-in Vizy 3 nodes and headings without adding their controls', function() {
    $migrator = new ManualEditorConfigMigrator();
    $payload = $migrator->toAuthorablePayload([
        'buttons' => ['italic'], 'formatting' => ['paragraph', 'heading2'],
    ], 'legacy-core-nodes');
    $config = Vizy::$plugin->getEditorConfigs()->normalizeRuntimeConfig('legacy-core-nodes', $payload);
    expect($config['schema']['nodes'])->toContain('image', 'table', 'tableCell', 'blockquote', 'codeBlock', 'iframe', 'mediaEmbed', 'bulletList', 'orderedList')
        ->and($payload['headings']['levels'])->toBe([1, 2, 3, 4, 5, 6])
        ->and($payload['toolbar'])->toBe(['dropdown:formatting', 'italic'])
        ->and($payload['dropdowns']['formatting'])->toBe(['paragraph', 'heading2']);

    $canonical = $migrator->toAuthorablePayload([
        'capabilities' => ['nodes' => ['paragraph'], 'marks' => []],
        'headings' => ['levels' => [2]], 'toolbar' => [],
    ], 'canonical-core-nodes');
    expect($canonical['capabilities']['nodes'])->toBe(['paragraph'])
        ->and($canonical['headings']['levels'])->toBe([2]);
});

it('maps selected Vizy 3 config filenames to editor config IDs', function(string $selected, string $expected) {
    $plan = (new ManualEditorConfigMigrator())->plan([
        'configSelectionMode' => 'choose',
        'vizyConfig' => $selected,
    ], StringHelper::UUID());

    expect($plan['editorConfig'])->toBe($expected)
        ->and($plan['mint'])->toBeNull()
        ->and($plan['diagnostics'])->toBe([]);
})->with([
    'JSON filename' => ['extended.json', 'extended'],
    'canonical ID' => ['extended', 'extended'],
    'default selection' => ['', ''],
    'JSON within an ID' => ['json-editor', 'json-editor'],
]);

it('preserves the Vizy 3 strikethrough button and mark capability when importing an editor config', function() {
    $payload = (new ManualEditorConfigMigrator())->toAuthorablePayload([
        'buttons' => ['bold', 'strikethrough', 'strike', 'italic'],
    ], 'test-strikethrough-import');

    expect($payload['toolbar'])->toBe(['bold', 'strike', 'italic'])
        ->and($payload['capabilities']['marks'])->toContain('strike')
        ->and($payload['toolbar'])->not->toContain('strikethrough');
});

it('converts Vizy 3 buttons JSON into a fingerprintable authorable Editor Config', function() {
    $migrator = new ManualEditorConfigMigrator();
    $payload = $migrator->toAuthorablePayload([
        'buttons' => ['bold', 'italic', 'h2', 'h3', 'bullet-list', 'align-left'],
        'formatting' => ['h2', 'h3', 'p'],
    ], 'test-manual');

    expect($payload['toolbar'])->toContain('bold')
        ->and($payload['toolbar'])->toContain('dropdown:formatting')
        ->and($payload['toolbar'])->toContain('dropdown:alignment')
        ->and($payload['toolbar'])->toContain('bulletList')
        ->and($payload['dropdowns']['formatting'])->toBe(['heading2', 'heading3', 'paragraph'])
        ->and($payload['capabilities']['nodes'])->toContain('heading');
});

it('keeps Vizy 3 quote and code-block buttons as Formatting members and node capabilities', function() {
    // Vizy 3 put blockquote / code-block on the button strip; Vizy 4 owns them only inside
    // Formatting. Dropping them from capabilities left seeded prose as Unsupported content.
    $migrator = new ManualEditorConfigMigrator();
    $payload = $migrator->toAuthorablePayload([
        'buttons' => [
            'bold', 'italic', 'unordered-list', 'ordered-list',
            'blockquote', 'hr', 'code-block', 'h2', 'h3', 'link',
        ],
        'formatting' => ['h2', 'h3', 'paragraph'],
    ], 'test-rich-manual');

    expect($payload['dropdowns']['formatting'])->toContain('blockquote', 'codeBlock')
        ->and($payload['capabilities']['nodes'])->toContain('blockquote', 'codeBlock', 'horizontalRule')
        ->and($payload['toolbar'])->not->toContain('blockquote')
        ->and($payload['toolbar'])->not->toContain('codeBlock')
        ->and($payload['toolbar'])->toContain('horizontalRule');
});

it('plans identical manual configs onto one shared mint id', function() {
    $manual = Json::encode([
        'buttons' => ['bold', 'italic', 'link'],
        'formatting' => ['p', 'h2'],
    ]);
    $migrator = new ManualEditorConfigMigrator();
    $a = $migrator->plan([
        'configSelectionMode' => 'manual',
        'manualConfig' => $manual,
    ], StringHelper::UUID());
    $b = $migrator->plan([
        'configSelectionMode' => 'manual',
        'manualConfig' => $manual,
    ], StringHelper::UUID());

    expect($a['diagnostics'])->toBe([])
        ->and($b['diagnostics'])->toBe([])
        ->and($a['mint'])->not->toBeNull()
        ->and($a['editorConfig'])->toBe($b['editorConfig'])
        ->and($a['fingerprint'])->toBe($b['fingerprint']);

    $migrator->applyMints([
        'a' => ['editorConfigMint' => $a['mint']],
        'b' => ['editorConfigMint' => $b['mint']],
    ]);

    expect(Vizy::$plugin->getEditorConfigs()->getConfig($a['editorConfig']))->toBeArray();
});

it('dedupes a manual config against an already-saved Editor Config', function() {
    $manual = Json::encode(['buttons' => ['bold', 'link']]);
    $migrator = new ManualEditorConfigMigrator();
    $first = $migrator->plan([
        'configSelectionMode' => 'manual',
        'manualConfig' => $manual,
    ], StringHelper::UUID());
    expect($first['mint'])->not->toBeNull();
    $migrator->applyMints(['seed' => ['editorConfigMint' => $first['mint']]]);

    $planned = $migrator->plan([
        'configSelectionMode' => 'manual',
        'manualConfig' => $manual,
    ], StringHelper::UUID());

    expect($planned['mint'])->toBeNull()
        ->and($planned['editorConfig'])->toBe($first['editorConfig']);

    Vizy::$plugin->getEditorConfigs()->removeConfig($first['editorConfig']);
});
