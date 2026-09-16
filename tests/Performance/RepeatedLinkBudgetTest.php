<?php

declare(strict_types=1);

use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\Performance\QueryProfiler;

it('resolves repeated semantic links once per render rather than per span', function() {
    $field = VizyFixtureFactory::vizyField();
    $entry = VizyFixtureFactory::entry('Repeated links');
    $mark = ['type' => 'link', 'attrs' => ['type' => 'entry', 'targetUid' => $entry->uid, 'siteMode' => 'current']];
    $json = json_decode(VizyFixtureFactory::paragraphDocument('Repeated links'), true);
    $json['content'] = array_fill(0, 100, [
        'type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Link', 'marks' => [$mark]]],
    ]);
    $document = $field->normalizeValue($json, $entry);
    $html = '';
    $profile = QueryProfiler::profile(static function() use ($document, &$html): string {
        return $html = (string)$document->render();
    });
    fwrite(STDERR, "\nRepeated link profile: " . json_encode($profile) . "\n");
    expect($profile['queries'])->toBeLessThanOrEqual(5);
    $dom = new DOMDocument();
    @$dom->loadHTML($html);
    $links = $dom->getElementsByTagName('a');
    expect($links->length)->toBe(100);
    foreach ($links as $link) {
        expect($link->getAttribute('href'))->toBe($entry->getUrl())
            ->and($link->textContent)->toBe('Link');
    }
    // A second render must re-resolve; preview placeholders or elements may have changed.
    $nextHtml = '';
    $next = QueryProfiler::profile(static function() use ($document, &$nextHtml): string {
        return $nextHtml = (string)$document->render();
    });
    expect($nextHtml)->toBe($html);
    expect($next['queries'])->toBeGreaterThan(0)->toBeLessThanOrEqual(5);
})->group('perf');
