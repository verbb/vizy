<?php

declare(strict_types=1);

use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\Vizy;
use verbb\vizy\events\RegisterHtmlImportRulesEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\importers\HtmlImportException;
use verbb\vizy\importers\HtmlImportOptions;
use verbb\vizy\importers\HtmlImportRule;
use verbb\vizy\services\HtmlImporter;
use yii\base\Event;

it('converts supported HTML into a canonical document for the destination field', function() {
    $field = VizyFixtureFactory::vizyField();
    $field->linkSettings = ['text', 'newWindow', 'site', 'title', 'classes'];
    $html = <<<'HTML'
        <h2>Welcome <strong>home</strong></h2>
        <p>Read <a href="https://example.com/guide" target="_blank" title="Guide">the guide</a><br>Today</p>
        <blockquote><p>Quoted</p></blockquote>
        <ol start="3"><li>First</li><li><em>Second</em></li></ol>
        <table><thead><tr><th>Heading</th></tr></thead><tbody><tr><td>Value</td></tr></tbody></table>
        HTML;

    $result = Vizy::$plugin->getHtmlImporter()->convert($html, $field);
    $content = $result->document()->content()->nodes();

    expect($result->diagnostics())->toBe([])
        ->and($result->isLossless())->toBeTrue()
        ->and(array_column($content, 'type'))->toBe(['heading', 'paragraph', 'blockquote', 'orderedList', 'table'])
        ->and($content[0])->toMatchArray([
            'type' => 'heading',
            'attrs' => ['level' => 2],
        ])
        ->and($content[0]['content'][1]['marks'])->toBe([['type' => 'bold']])
        ->and($content[1]['content'][1]['marks'][0])->toMatchArray([
            'type' => 'link',
            'attrs' => [
                'type' => 'url',
                'value' => 'https://example.com/guide',
                'siteMode' => 'current',
                'newWindow' => true,
                'title' => 'Guide',
            ],
        ])
        ->and($content[3]['attrs'])->toBe(['start' => 3])
        ->and($content[4]['content'][0]['content'][0]['type'])->toBe('tableHeader');
});

it('reports every lossy boundary and refuses the same conversion in strict mode', function() {
    $field = VizyFixtureFactory::vizyField();
    $html = '<h1 class="hero">Title</h1><p><u>Underlined</u> <a href="javascript:alert(1)">unsafe</a></p><widget data-value="x">Readable</widget>';

    $result = Vizy::$plugin->getHtmlImporter()->convert($html, $field);
    $codes = array_map(static fn($diagnostic): string => $diagnostic->code, $result->diagnostics());

    expect($result->isLossless())->toBeFalse()
        ->and($codes)->toContain('removedAttribute', 'disallowedHeading', 'disallowedMark', 'unsafeLink', 'unsupportedElement')
        ->and(Vizy::$plugin->getContentText()->project($result->document(), 1000))->toContain('Title', 'Underlined', 'unsafe', 'Readable')
        ->and(fn() => Vizy::$plugin->getHtmlImporter()->convert($html, $field, new HtmlImportOptions(strict: true)))
        ->toThrow(HtmlImportException::class, 'Strict HTML import refused');
});

it('maps images only through a caller-owned Craft Asset identity resolver', function() {
    $field = VizyFixtureFactory::vizyField();
    $assetUid = '12345678-1234-4234-8234-123456789012';
    $options = new HtmlImportOptions(assetResolver: static fn(string $src): string => $assetUid);

    $resolved = Vizy::$plugin->getHtmlImporter()->convert('<img src="https://example.com/photo.jpg" alt="Photo">', $field, $options);
    $unresolved = Vizy::$plugin->getHtmlImporter()->convert('<img src="https://example.com/photo.jpg" alt="Photo">', $field);
    $forged = Vizy::$plugin->getHtmlImporter()->convert("<img data-asset-uid=\"{$assetUid}\" alt=\"Forged\">", $field);
    $resolvedImage = $resolved->document()->content()->nodes()[0];

    expect($resolved->isLossless())->toBeTrue()
        ->and($resolvedImage['type'])->toBe('image')
        ->and($resolvedImage['attrs'])->toMatchArray([
            'assetUid' => $assetUid,
            'siteMode' => 'current',
            'altMode' => 'custom',
            'alt' => 'Photo',
            'size' => 'default',
        ])
        ->and($unresolved->isLossless())->toBeFalse()
        ->and($unresolved->diagnostics()[0]->code)->toBe('unresolvedImage')
        ->and(Vizy::$plugin->getContentText()->project($unresolved->document(), 1000))->toBe('Photo')
        ->and(array_map(static fn($diagnostic): string => $diagnostic->code, $forged->diagnostics()))->toBe(['removedAttribute', 'unresolvedImage']);
});

it('allows modules to register declarative rules without replacing the importer', function() {
    $handler = function(RegisterHtmlImportRulesEvent $event): void {
        $event->rules[] = HtmlImportRule::mark(['bdi'], 'bold');
    };
    Event::on(HtmlImporter::class, HtmlImporter::EVENT_REGISTER_RULES, $handler);

    try {
        $result = Vizy::$plugin->getHtmlImporter()->convert('<p><bdi>Registered</bdi></p>', VizyFixtureFactory::vizyField());
        $text = $result->document()->content()->nodes()[0]['content'][0];

        expect($result->isLossless())->toBeTrue()
            ->and($text['marks'])->toBe([['type' => 'bold']]);
    } finally {
        Event::off(HtmlImporter::class, HtmlImporter::EVENT_REGISTER_RULES, $handler);
    }
});

it('refuses HTML for a Blocks-only destination field without inventing Block mappings', function() {
    $field = new VizyField([
        'name' => 'Blocks only',
        'handle' => 'blocksOnly',
        'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS,
    ]);

    $prose = Vizy::$plugin->getHtmlImporter()->convert('<p>Not a mapped Block</p>', $field);
    $nonText = Vizy::$plugin->getHtmlImporter()->convert('<hr>', $field);

    expect($prose->isLossless())->toBeFalse()
        ->and($prose->diagnostics()[0]->code)->toBe('rootContentDisallowsProse')
        ->and($prose->document()->content()->nodes())->toBe([])
        ->and($nonText->diagnostics()[0]->code)->toBe('rootContentDisallowsProse')
        ->and($nonText->document()->content()->nodes())->toBe([]);
});

it('bounds the complete parsed tree before conversion', function() {
    $field = VizyFixtureFactory::vizyField();

    expect(fn() => Vizy::$plugin->getHtmlImporter()->convert('<p>Two nodes</p>', $field, new HtmlImportOptions(maxNodes: 1)))
        ->toThrow(HtmlImportException::class, '1-node limit')
        ->and(fn() => Vizy::$plugin->getHtmlImporter()->convert('<div><p>Nested</p></div>', $field, new HtmlImportOptions(maxDepth: 1)))
        ->toThrow(HtmlImportException::class, '1-level depth limit');
});

it('reports link options that the destination field cannot represent', function() {
    $field = VizyFixtureFactory::vizyField();
    $previous = $field->linkSettings;
    $field->linkSettings = [];

    try {
        $result = Vizy::$plugin->getHtmlImporter()->convert('<p><a href="https://example.com" target="_blank" title="Title" class="button">Link</a></p>', $field);
        $removed = array_values(array_map(
            static fn($diagnostic): ?string => $diagnostic->details['attribute'] ?? null,
            array_filter($result->diagnostics(), static fn($diagnostic): bool => $diagnostic->code === 'removedAttribute'),
        ));

        expect($result->isLossless())->toBeFalse()
            ->and($removed)->toBe(['target', 'title', 'class']);
    } finally {
        $field->linkSettings = $previous;
    }
});

it('reports and preserves a table caption outside the canonical table', function() {
    $result = Vizy::$plugin->getHtmlImporter()->convert(
        '<table><caption>Quarterly totals</caption><tr><td>42</td></tr></table>',
        VizyFixtureFactory::vizyField(),
    );
    $content = $result->document()->content()->nodes();

    expect($result->diagnostics()[0]->code)->toBe('unsupportedTableCaption')
        ->and(array_column($content, 'type'))->toBe(['paragraph', 'table'])
        ->and(Vizy::$plugin->getContentText()->project($result->document(), 1000))->toContain('Quarterly totals', '42');
});

it('reports attributes discarded from preformatted code', function() {
    $result = Vizy::$plugin->getHtmlImporter()->convert(
        '<pre><code class="language-php">echo true;</code></pre>',
        VizyFixtureFactory::vizyField(),
    );
    $node = $result->document()->content()->nodes()[0];

    expect($result->diagnostics()[0]->code)->toBe('removedAttribute')
        ->and($result->diagnostics()[0]->details['attribute'])->toBe('class')
        ->and($node['type'])->toBe('codeBlock')
        ->and($node['content'][0]['text'])->toBe('echo true;');
});
