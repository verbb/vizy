<?php

declare(strict_types=1);

use craft\elements\Entry;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\marks\Bold;
use verbb\vizy\nodes\Paragraph;
use verbb\vizy\Vizy;
use yii\base\Event;

function modifyTagStructureRender(): string
{
    return (string)(new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'content' => [
                ['type' => 'text', 'text' => 'That was the day I invented '],
                ['type' => 'text', 'text' => 'time travel', 'marks' => [['type' => 'bold']]],
                ['type' => 'text', 'text' => '.'],
            ],
        ]],
    ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']))->render();
}

it('closes wrapper rows added by modifyTag in reverse order', function() {
    Vizy::$plugin->getExtensions()->reset();

    // The documented wrapper example makes the same change for opening and closing tags.
    $paragraphHandler = function(ModifyNodeTagEvent $event): void {
        $paragraph = $event->tag[0];
        $event->tag = [['tag' => 'div', 'attrs' => ['class' => 'rich-text']], $paragraph];
    };
    $boldHandler = function(ModifyMarkTagEvent $event): void {
        $event->tag = [['tag' => 'span', 'attrs' => ['class' => 'wrap']], $event->tag[0]];
    };

    Event::on(Paragraph::class, Paragraph::EVENT_MODIFY_TAG, $paragraphHandler);
    Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, $boldHandler);

    try {
        expect(modifyTagStructureRender())->toBe('<div class="rich-text"><p>That was the day I invented <span class="wrap"><strong>time travel</strong></span>.</p></div>');
    } finally {
        Event::off(Paragraph::class, Paragraph::EVENT_MODIFY_TAG, $paragraphHandler);
        Event::off(Bold::class, Bold::EVENT_MODIFY_TAG, $boldHandler);
    }
});

it('still closes a single row with several tag names innermost first', function() {
    Vizy::$plugin->getExtensions()->reset();

    $paragraphHandler = function(ModifyNodeTagEvent $event): void {
        $event->tag = [['tag' => ['div', 'p'], 'attrs' => []]];
    };

    Event::on(Paragraph::class, Paragraph::EVENT_MODIFY_TAG, $paragraphHandler);

    try {
        expect(modifyTagStructureRender())->toBe('<div><p>That was the day I invented <strong>time travel</strong>.</p></div>');
    } finally {
        Event::off(Paragraph::class, Paragraph::EVENT_MODIFY_TAG, $paragraphHandler);
    }
});
