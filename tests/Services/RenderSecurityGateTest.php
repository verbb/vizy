<?php

declare(strict_types=1);

use craft\elements\Entry;
use verbb\vizy\base\RenderContext;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\SafeHtml;
use verbb\vizy\marks\Link;
use verbb\vizy\Vizy;

it('rejects javascript and data URIs via HTMLPurifier AttrDef', function() {
    expect(SafeHtml::sanitizeUri('javascript:alert(1)'))->toBeNull()
        ->and(SafeHtml::sanitizeUri('data:text/html,<script>'))->toBeNull()
        ->and(SafeHtml::sanitizeUri('https://example.com/ok'))->toBe('https://example.com/ok')
        ->and(SafeHtml::sanitizeUri('mailto:hi@example.com'))->toBe('mailto:hi@example.com');
});

it('purifies hostile mediaEmbed stored HTML instead of emitting it raw', function() {
    Vizy::$plugin->getExtensions()->reset();

    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'mediaEmbed',
            'attrs' => [
                // Unknown provider so rebuild skips; stored HTML is the payload under test.
                'url' => 'https://example.com/unknown-provider',
                'data' => [
                    'html' => '<script>alert(1)</script>'
                        . '<iframe src="https://evil.example/embed"></iframe>'
                        . '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>',
                ],
            ],
        ]],
    ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

    $html = (string)$document->render();

    expect($html)->not->toContain('<script')
        ->and($html)->not->toContain('evil.example')
        ->and($html)->toContain('youtube.com/embed/dQw4w9WgXcQ');
});

it('does not emit javascript: link href from semantic url values', function() {
    Vizy::$plugin->getExtensions()->reset();

    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'content' => [[
                'type' => 'text',
                'text' => 'Click',
                'marks' => [[
                    'type' => 'link',
                    'attrs' => [
                        'type' => 'url',
                        'value' => 'javascript:alert(1)',
                        'siteMode' => 'current',
                        'newWindow' => false,
                    ],
                ]],
            ]],
        ]],
    ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

    $html = (string)$document->render();

    expect($html)->toContain('Click')
        ->and($html)->not->toContain('javascript:')
        ->and($html)->not->toMatch('/<a\b/i');
});

it('omits iframe when src fails URI sanitize', function() {
    $attrs = \verbb\vizy\nodes\Iframe::resolveAttrs([
        'url' => 'javascript:alert(1)',
        'frameborder' => 0,
    ], RenderContext::empty());

    expect($attrs)->not->toHaveKey('src')
        ->and(\verbb\vizy\nodes\Iframe::tagForAttrs($attrs))->toBeNull();
});

it('resolves safe semantic https links for href', function() {
    $href = Link::resolveHref([
        'type' => 'url',
        'value' => 'https://example.com/path',
        'siteMode' => 'current',
    ]);

    expect($href)->toBe('https://example.com/path');
});

it('rejects unsafe image src and strips event-handler attrs on emit', function() {
    Vizy::$plugin->getExtensions()->reset();

    // Image forbids persisted src — exercise Image::renderOccurrenceHtml +
    // paragraph default-tag filterEmitAttrs directly.
    $img = \verbb\vizy\nodes\Image::renderOccurrenceHtml('', [
        'src' => 'javascript:alert(1)',
        'alt' => 'x',
        'onerror' => 'alert(1)',
    ], \verbb\vizy\base\RenderContext::empty());

    expect($img)->not->toContain('javascript:')
        ->and($img)->not->toContain('onerror');

    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'attrs' => [
                'onclick' => 'alert(1)',
                'class' => 'keep-me',
            ],
            'content' => [
                ['type' => 'text', 'text' => 'Safe'],
            ],
        ]],
    ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

    $html = (string)$document->render();

    expect($html)->not->toContain('onclick')
        ->and($html)->toContain('keep-me')
        ->and($html)->toContain('Safe');
});

it('filters emit attrs via SafeHtml before tag paint', function() {
    expect(SafeHtml::filterEmitAttrs([
        'class' => 'ok',
        'onclick' => 'alert(1)',
        'srcdoc' => '<script>',
        'nested' => ['no' => 'arrays'],
        'width' => 10,
        'enabled' => true,
    ]))->toBe([
        'class' => 'ok',
        'width' => 10,
        'enabled' => true,
    ]);
});

it('rejects malformed attribute names that break out of HTML attribute syntax', function() {
    // Yii encodes values, not names — a key with quotes/spaces/`=` must never reach emit.
    $malformed = '" onmouseover="alert(1)';
    expect(SafeHtml::isSafeEmitAttrName($malformed))->toBeFalse()
        ->and(SafeHtml::isSafeEmitAttrName(' onclick'))->toBeFalse()
        ->and(SafeHtml::isSafeEmitAttrName('ONCLICK'))->toBeFalse()
        ->and(SafeHtml::isSafeEmitAttrName('data-foo'))->toBeTrue()
        ->and(SafeHtml::isSafeEmitAttrName('class'))->toBeTrue();

    Vizy::$plugin->getExtensions()->reset();

    $document = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'attrs' => [
                $malformed => 'x',
                'class' => 'keep-me',
            ],
            'content' => [
                ['type' => 'text', 'text' => 'Safe'],
            ],
        ]],
    ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

    $html = (string)$document->render();

    expect($html)->not->toContain('onmouseover')
        ->and($html)->not->toContain('alert(1)')
        ->and($html)->toContain('keep-me')
        ->and($html)->toContain('Safe');
});
