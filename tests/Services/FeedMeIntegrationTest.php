<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\feedme\models\FeedModel;
use craft\feedme\Plugin as FeedMe;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\events\RegisterHtmlImportRulesEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\importers\HtmlImportException;
use verbb\vizy\importers\HtmlImportRule;
use verbb\vizy\integrations\feedme\fields\Vizy as FeedMeVizy;
use verbb\vizy\services\HtmlImporter;
use yii\base\Event;

it('imports mapped Feed Me content through the registered field and saves canonical content', function(string $input, array $expected) {
    // This group runs only in the installed Feed Me profile; missing integration is a failure.
    expect(Craft::$app->getPlugins()->isPluginInstalled('feed-me'))->toBeTrue();
    $field = VizyFixtureFactory::vizyField();
    $owner = VizyFixtureFactory::entry();
    $fields = FeedMe::$plugin->fields;
    expect($fields->getRegisteredField(VizyField::class))->toBeInstanceOf(FeedMeVizy::class);
    $value = $fields->parseField(new FeedModel(['setEmptyValues' => true]), $owner,
        ['article/body' => $input], $field->handle,
        ['field' => VizyField::class, 'node' => 'article/body']);
    $owner->setFieldValue($field->handle, $value);
    if (!Craft::$app->getElements()->saveElement($owner)) {
        throw new RuntimeException(json_encode($owner->getErrors()));
    }
    $saved = Entry::find()->id($owner->id)->status(null)->one();
    expect($saved->getFieldValue($field->handle)->toArray())->toBe([
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $expected,
    ]);
})->with([
    'HTML fallback with a meaningful mark' => ['<p>Imported <strong>bold</strong></p>', [
        ['type' => 'paragraph', 'content' => [
            ['type' => 'text', 'text' => 'Imported '],
            ['type' => 'text', 'text' => 'bold', 'marks' => [['type' => 'bold']]],
        ]],
    ]],
    'HTML follows the destination Editor Config' => ['<h1><u>Imported heading</u></h1>', [
        ['type' => 'paragraph', 'content' => [
            ['type' => 'text', 'text' => 'Imported heading'],
        ]],
    ]],
    'canonical JSON uses the mapped document path' => [
        '{"type":"doc","attrs":{"schemaVersion":2},"content":[{"type":"paragraph","content":[{"type":"text","text":"Imported JSON"}]}]}',
        [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Imported JSON']]]],
    ],
    'issue #231 legacy list_item JSON is repaired at ingress' => [
        '[{"type":"bulletList","content":[{"type":"list_item","text":"","content":[{"type":"text","text":"Imported legacy item"}]}]}]',
        [[
            'type' => 'bulletList',
            'content' => [[
                'type' => 'listItem',
                'content' => [[
                    'type' => 'paragraph',
                    'content' => [['type' => 'text', 'text' => 'Imported legacy item']],
                ]],
            ]],
        ]],
    ],
])->group('feed-me');

it('exposes Feed Me lossless HTML mapping and rejects lossy input when enabled', function() {
    $field = VizyFixtureFactory::vizyField();
    $owner = VizyFixtureFactory::entry();
    $registered = FeedMe::$plugin->fields->getRegisteredField(VizyField::class);
    $mappingHtml = Craft::$app->getView()->renderTemplate(
        $registered->getMappingTemplate(),
        [
            'name' => $field->name,
            'handle' => $field->handle,
            'instructions' => '',
            'feed' => new FeedModel([
                'fieldMapping' => [
                    $field->handle => [
                        'node' => 'body',
                        'options' => ['strictHtml' => true],
                    ],
                ],
            ]),
            'feedData' => [['label' => 'Body', 'value' => 'body']],
            'field' => $field,
            'fieldClass' => $registered,
        ],
    );

    expect($registered)->toBeInstanceOf(FeedMeVizy::class)
        ->and($registered->getMappingTemplate())->toBe('vizy/_integrations/feed-me/fields/vizy')
        ->and($mappingHtml)->toContain('Require lossless HTML')
        ->and(fn() => FeedMe::$plugin->fields->parseField(
            new FeedModel(),
            $owner,
            ['body' => '<h1><u>Lossy</u></h1>'],
            $field->handle,
            [
                'field' => VizyField::class,
                'node' => 'body',
                'options' => ['strictHtml' => true],
            ],
        ))->toThrow(HtmlImportException::class, 'Strict HTML import refused');
})->group('feed-me');

it('applies registered HTML import rules to Feed Me values', function() {
    $handler = function(RegisterHtmlImportRulesEvent $event): void {
        $event->rules[] = HtmlImportRule::mark(['bdi'], 'bold');
    };
    Event::on(HtmlImporter::class, HtmlImporter::EVENT_REGISTER_RULES, $handler);

    try {
        $field = VizyFixtureFactory::vizyField();
        $owner = VizyFixtureFactory::entry();
        $value = FeedMe::$plugin->fields->parseField(
            new FeedModel(),
            $owner,
            ['body' => '<p><bdi>Extension content</bdi></p>'],
            $field->handle,
            ['field' => VizyField::class, 'node' => 'body'],
        );
        $document = json_decode($value, true, flags: JSON_THROW_ON_ERROR);

        expect($document['content'][0]['content'][0])->toBe([
            'type' => 'text',
            'text' => 'Extension content',
            'marks' => [['type' => 'bold']],
        ]);
    } finally {
        Event::off(HtmlImporter::class, HtmlImporter::EVENT_REGISTER_RULES, $handler);
    }
})->group('feed-me');

it('rejects Feed Me nodes disabled by the Editor Config without replacing saved content', function() {
    $field = VizyFixtureFactory::vizyField();
    $owner = VizyFixtureFactory::entry();
    $before = $owner->getFieldValue($field->handle)->toArray();
    $value = FeedMe::$plugin->fields->parseField(new FeedModel(), $owner,
        ['body' => '{"type":"doc","attrs":{"schemaVersion":2},"content":[{"type":"futureOrdinaryNode"}]}'],
        $field->handle, ['field' => VizyField::class, 'node' => 'body']);
    $owner->setFieldValue($field->handle, $value);
    expect(Craft::$app->getElements()->saveElement($owner))->toBeFalse()
        ->and(implode(' ', $owner->getErrors($field->handle)))->toContain('futureOrdinaryNode is not enabled');
    $saved = Entry::find()->id($owner->id)->status(null)->one();
    expect($saved->getFieldValue($field->handle)->toArray())->toBe($before);
})->group('feed-me');
