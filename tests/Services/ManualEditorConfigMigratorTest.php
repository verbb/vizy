<?php

declare(strict_types=1);

use craft\helpers\Json;
use craft\helpers\StringHelper;
use verbb\vizy\legacy\ManualEditorConfigMigrator;
use verbb\vizy\Vizy;

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
