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
use verbb\vizy\nodes\Table;
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

function modifyTagStructureTable(array $attrs = []): string
{
    $table = [
        'type' => 'table',
        'content' => [[
            'type' => 'tableRow',
            'content' => [[
                'type' => 'tableCell',
                'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Cell']]]],
            ]],
        ]],
    ];

    if ($attrs) {
        $table['attrs'] = $attrs;
    }

    return (string)(new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [$table],
    ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']))->render();
}

it('keeps table attributes added by modifyTag off the tbody wrapper', function() {
    Vizy::$plugin->getExtensions()->reset();

    $seen = [];
    $tableHandler = function(ModifyNodeTagEvent $event) use (&$seen): void {
        $seen[] = $event->tag;
        $event->tag[0]['attrs']['class'] = 'table';
    };

    Event::on(Table::class, Table::EVENT_MODIFY_TAG, $tableHandler);

    try {
        $html = modifyTagStructureTable();

        expect($html)->toStartWith('<table class="table"><tbody><tr>')
            ->and($html)->toEndWith('</tr></tbody></table>')
            // Listeners still receive the table and its tbody as one row.
            ->and($seen)->toBe([
                [['tag' => ['table', 'tbody'], 'attrs' => []]],
                [['tag' => ['table', 'tbody'], 'attrs' => []]],
            ]);
    } finally {
        Event::off(Table::class, Table::EVENT_MODIFY_TAG, $tableHandler);
    }
});

it('keeps stored table attributes off the tbody wrapper', function() {
    Vizy::$plugin->getExtensions()->reset();

    $html = modifyTagStructureTable(['id' => 'prices', 'class' => 'striped']);

    expect($html)->toStartWith('<table id="prices" class="striped"><tbody><tr>')
        ->and($html)->toEndWith('</tr></tbody></table>');
});

it('splits the table row inside wrapper rows a listener adds', function() {
    Vizy::$plugin->getExtensions()->reset();

    $tableHandler = function(ModifyNodeTagEvent $event): void {
        $event->tag = [['tag' => 'div', 'attrs' => ['class' => 'scroll']], ['tag' => ['table', 'tbody'], 'attrs' => ['class' => 'table']]];
    };

    Event::on(Table::class, Table::EVENT_MODIFY_TAG, $tableHandler);

    try {
        // A wrapper row stays as given, and the table row still splits.
        expect(modifyTagStructureTable())->toStartWith('<div class="scroll"><table class="table"><tbody><tr>')
            ->toEndWith('</tr></tbody></table></div>');
    } finally {
        Event::off(Table::class, Table::EVENT_MODIFY_TAG, $tableHandler);
    }
});

it('leaves separate table and tbody rows from a listener as they are', function() {
    Vizy::$plugin->getExtensions()->reset();

    // Returning two rows is how a listener adds attributes to the tbody.
    $tableHandler = function(ModifyNodeTagEvent $event): void {
        $event->tag = [['tag' => 'table', 'attrs' => ['class' => 'table']], ['tag' => 'tbody', 'attrs' => ['class' => 'rows']]];
    };

    Event::on(Table::class, Table::EVENT_MODIFY_TAG, $tableHandler);

    try {
        expect(modifyTagStructureTable())->toStartWith('<table class="table"><tbody class="rows"><tr>')
            ->toEndWith('</tr></tbody></table>');
    } finally {
        Event::off(Table::class, Table::EVENT_MODIFY_TAG, $tableHandler);
    }
});
