<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\feedme\models\FeedModel;
use craft\feedme\Plugin as FeedMe;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\fields\VizyField;
use verbb\vizy\integrations\feedme\fields\Vizy as FeedMeVizy;

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
    'canonical JSON uses the mapped document path' => [
        '{"type":"doc","attrs":{"schemaVersion":2},"content":[{"type":"paragraph","content":[{"type":"text","text":"Imported JSON"}]}]}',
        [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Imported JSON']]]],
    ],
])->group('feed-me');


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
