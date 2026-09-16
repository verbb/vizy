<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\helpers\StringHelper;
use Tests\Support\Performance\QueryProfiler;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\marks\Bold;
use verbb\vizy\Vizy;
use yii\di\Container;

/**
 * Perf profile for mark-heavy front-end render (class-static path).
 *
 * Soft budget: 2000 bold spans should render in well under a second on CI-ish
 * hardware; the hard gate is zero Bold createObject hits (see MarkHeavyRenderGateTest).
 */
it('profiles mark-heavy document render without Bold instance allocation', function() {
    Vizy::$plugin->getExtensions()->reset();

    $spanCount = 2000;
    $createObjectHits = 0;
    $container = Craft::$container;
    $container->set(Bold::class, static function(Container $container, array $params, array $config) use (&$createObjectHits): Bold {
        $createObjectHits++;

        return new Bold($config);
    });

    $content = [];
    for ($i = 0; $i < $spanCount; $i++) {
        $content[] = [
            'type' => 'text',
            'text' => 'w',
            'marks' => [['type' => 'bold']],
        ];
    }

    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'content' => $content,
        ]],
    ], new Entry(['title' => 'Mark heavy budget']), new VizyField([
        'name' => 'Body',
        'handle' => 'body' . StringHelper::randomString(4),
    ]));

    try {
        $profile = QueryProfiler::profile(static fn(): string => (string)$document->render());

        expect($createObjectHits)->toBe(0)
            ->and($profile['resultSize'])->toBeGreaterThan($spanCount * strlen('<strong>w</strong>'))
            // Soft ceiling — catches accidental NodeCollection-per-span regressions.
            ->and($profile['durationMs'])->toBeLessThan(1500.0);

        fwrite(STDERR, "\nMark-heavy render profile ({$spanCount} bold spans): " . json_encode([
            'spanCount' => $spanCount,
            'boldCreateObjectHits' => $createObjectHits,
            ...$profile,
        ], JSON_PRETTY_PRINT) . "\n");
    } finally {
        $container->clear(Bold::class);
    }
})->group('perf');
