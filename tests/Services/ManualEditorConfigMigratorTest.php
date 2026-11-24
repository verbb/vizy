<?php

declare(strict_types=1);

use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\services\Deprecator;
use verbb\vizy\deprecations\VizyToolbarTokenDeprecations;
use verbb\vizy\helpers\EditorConfigPresentation;
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

it('translates Vizy 3 line break, clear format and table menu IDs with deprecation warnings', function() {
    $original = Craft::$app->getDeprecator();
    $warned = new ReflectionProperty(VizyToolbarTokenDeprecations::class, 'warned');
    $previousWarned = $warned->getValue();
    $warned->setValue(null, []);
    $deprecator = new class(['logTarget' => false]) extends Deprecator {
        public array $keys = [];

        public function log(string $key, string $message, ?string $file = null, ?int $line = null): void
        {
            $this->keys[] = $key;
        }
    };
    Craft::$app->set('deprecator', $deprecator);

    try {
        // Button and option IDs from Vizy 3's Buttons.js.
        $migrator = new ManualEditorConfigMigrator();
        $configs = Vizy::$plugin->getEditorConfigs();
        $payload = $migrator->toAuthorablePayload([
            'buttons' => ['bold', 'clear-format', 'line-break', 'table', 'undo'],
            'table' => ['insert-table', 'add-row-after', 'delete-row'],
        ], 'legacy-table-buttons');
        $config = $configs->normalizeRuntimeConfig('legacy-table-buttons', $payload);

        expect($config['toolbar'])->toBe(['bold', 'clearFormatting', 'hardBreak', 'undo', 'dropdown:table'])
            ->and($config['dropdowns']['table'])->toBe(['table', 'tableAddRowAfter', 'tableDeleteRow']);

        // Without `insert-table` the menu keeps the configured subset instead of every operation.
        $tableOnly = $configs->normalizeRuntimeConfig('legacy-table-only', $migrator->toAuthorablePayload([
            'buttons' => ['table'],
            'table' => ['add-row-after', 'delete-row', 'merge-cells'],
        ], 'legacy-table-only'));

        expect($tableOnly['dropdowns']['table'])->toBe(['tableAddRowAfter', 'tableDeleteRow', 'tableMergeCells']);

        foreach (['clear-format', 'line-break', 'add-row-after', 'delete-row', 'merge-cells'] as $legacyId) {
            expect($deprecator->keys)->toContain("verbb\\vizy\\toolbar\\{$legacyId}");
        }
    } finally {
        Craft::$app->set('deprecator', $original);
        $warned->setValue(null, $previousWarned);
    }
});

it('translates every Vizy 3 table menu ID to a Vizy 4 table control', function(string $legacyId, string $expected) {
    $controls = array_column(EditorConfigPresentation::toolbarCatalog(), 'id');

    expect(VizyToolbarTokenDeprecations::canonicalize($legacyId))->toBe($expected)
        ->and($controls)->toContain($expected)
        ->and(EditorConfigPresentation::dropdownRoster('table'))->toContain($expected);
})->with([
    ['insert-table', 'table'],
    ['delete-table', 'tableDelete'],
    ['add-col-before', 'tableAddColumnBefore'],
    ['add-col-after', 'tableAddColumnAfter'],
    ['delete-col', 'tableDeleteColumn'],
    ['add-row-before', 'tableAddRowBefore'],
    ['add-row-after', 'tableAddRowAfter'],
    ['delete-row', 'tableDeleteRow'],
    ['merge-cells', 'tableMergeCells'],
    ['split-cells', 'tableSplitCell'],
    ['toggle-header-column', 'tableToggleHeaderColumn'],
    ['toggle-header-row', 'tableToggleHeaderRow'],
    ['toggle-header-cell', 'tableToggleHeaderCell'],
]);

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
