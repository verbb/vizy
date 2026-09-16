<?php

declare(strict_types=1);

use craft\elements\Entry;
use verbb\vizy\base\Mark;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\marks\Bold;
use verbb\vizy\Vizy;
use yii\base\Event;

it('renders bold via class statics without Craft::createObject per span', function() {
    Vizy::$plugin->getExtensions()->reset();

    $created = 0;
    Event::on(Bold::class, Mark::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) use (&$created): void {
        // Prove class-level fire: mark instance is null on the default path.
        expect($event->mark)->toBeNull()
            ->and($event->typeId)->toBe('bold');
        $created++;
        $event->tag[0]['attrs']['class'] = 'x-bold';
    });

    try {
        $document = (new DocumentParser())->parse([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'paragraph',
                'content' => [
                    ['type' => 'text', 'text' => 'A', 'marks' => [['type' => 'bold']]],
                    ['type' => 'text', 'text' => 'B', 'marks' => [['type' => 'bold']]],
                    ['type' => 'text', 'text' => 'C', 'marks' => [['type' => 'bold']]],
                ],
            ]],
        ], new Entry(['title' => 'Owner']), new VizyField(['name' => 'Body', 'handle' => 'body']));

        $html = (string)$document->render();

        expect($html)->toContain('class="x-bold"')
            // Opening + closing modify per span → 6 fires, still no Mark instances.
            ->and($created)->toBe(6);
    } finally {
        Event::off(Bold::class, Mark::EVENT_MODIFY_TAG);
    }
});
