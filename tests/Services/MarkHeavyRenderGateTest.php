<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\helpers\StringHelper;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\marks\Bold;
use verbb\vizy\Vizy;
use yii\base\Event;
use yii\di\Container;

/**
 * Mark-heavy render must stay on the class-static path: N bold spans must not
 * allocate N Bold instances (decision: Extensions type system).
 */
it('renders hundreds of bold spans without constructing Bold instances', function() {
    Vizy::$plugin->getExtensions()->reset();

    $spanCount = 500;
    $createObjectHits = 0;
    $modifyFires = 0;
    $instanceOnEvent = 0;

    $container = Craft::$container;
    // Intercept Craft::createObject(Bold) — the old markAdapter / NodeCollection path.
    $container->set(Bold::class, static function(Container $container, array $params, array $config) use (&$createObjectHits): Bold {
        $createObjectHits++;

        return new Bold($config);
    });

    $modifyHandler = static function(ModifyMarkTagEvent $event) use (&$modifyFires, &$instanceOnEvent): void {
        $modifyFires++;
        if ($event->mark !== null) {
            $instanceOnEvent++;
        }
    };
    Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, $modifyHandler);

    try {
        $content = [];
        for ($i = 0; $i < $spanCount; $i++) {
            $content[] = [
                'type' => 'text',
                'text' => 'x',
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
        ], new Entry(['title' => 'Mark heavy']), new VizyField([
            'name' => 'Body',
            'handle' => 'body' . StringHelper::randomString(4),
        ]));

        $html = (string)$document->render();

        expect($createObjectHits)->toBe(0)
            ->and($instanceOnEvent)->toBe(0)
            // Opening + closing modify per span.
            ->and($modifyFires)->toBe($spanCount * 2)
            ->and(substr_count($html, '<strong>'))->toBe($spanCount)
            ->and(substr_count($html, '</strong>'))->toBe($spanCount);
    } finally {
        Event::off(Bold::class, Bold::EVENT_MODIFY_TAG, $modifyHandler);
        $container->clear(Bold::class);
    }
});
