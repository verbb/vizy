<?php

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;

it('rejects blank paragraphs in required root and Hosted fields without losing saved content', function(array $nodes, bool $trim) {
    $entry = VizyFixtureFactory::entry();
    $type = $entry->getType();
    $originalLayout = $type->getFieldLayout();
    $layout = clone $originalLayout;
    $placement = clone $originalLayout->getCustomFieldElements()[0];
    $field = clone $placement->getField();
    $field->trimEmptyParagraphs = $trim;
    $placement = new CustomField($field, ['uid' => $placement->uid, 'required' => true]);
    $tab = new FieldLayoutTab(['name' => 'Content', 'layout' => $layout]);
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $type->setFieldLayout($layout);

    try {
        $before = $entry->getFieldValue($field->handle)->toArray();
        $entry->setScenario(Entry::SCENARIO_LIVE);
        $entry->setFieldValue($field->handle, [
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => $nodes,
        ]);

        expect(Craft::$app->getElements()->saveElement($entry))->toBeFalse()
            ->and($entry->getErrors($field->handle))->not->toBeEmpty();
        $saved = Entry::find()->id($entry->id)->status(null)->one();
        expect($saved->getFieldValue($field->handle)->toArray())->toBe($before);

        $block = new Block(['siteId' => $entry->siteId]);
        $block->setOwner($entry);
        $block->setFieldLayout($layout);
        $block->setScenario(Entry::SCENARIO_LIVE);
        $block->setFieldValue($field->handle, $entry->getFieldValue($field->handle)->toArray());
        expect($block->validate())->toBeFalse()
            ->and($block->getErrors($field->handle))->not->toBeEmpty();

        $entry->setFieldValue($field->handle, VizyFixtureFactory::paragraphDocument('Recovered content'));
        expect(Craft::$app->getElements()->saveElement($entry))->toBeTrue();
        expect(Entry::find()->id($entry->id)->status(null)->one()->getFieldValue($field->handle)->render()->__toString())
            ->toContain('Recovered content');
    } finally {
        $type->setFieldLayout($originalLayout);
    }
})->with([
    'empty document' => [[]],
    'empty paragraph' => [[['type' => 'paragraph']]],
    'multiple empty paragraphs' => [[['type' => 'paragraph'], ['type' => 'paragraph', 'content' => []]]],
    'whitespace and line break' => [[['type' => 'paragraph', 'content' => [
        ['type' => 'text', 'text' => " \t\u{00a0}"], ['type' => 'hardBreak'],
    ]]]],
])->with([true, false]);

it('keeps authored content and non-text nodes nonempty without changing the document', function(array $node) {
    $data = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [['type' => 'paragraph'], $node],
    ];
    $document = VizyDocument::fromCanonicalData($data, null, new VizyField());
    expect($document->isEmpty())->toBeFalse()
        ->and($document->content()->isEmpty())->toBeFalse()
        ->and($document->toArray())->toBe($data);
})->with([
    'zero' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => '0']]]],
    'unicode' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => '日本語']]]],
    'image' => [['type' => 'image', 'attrs' => ['src' => '/image.jpg']]],
    'unknown inline node' => [['type' => 'paragraph', 'content' => [['type' => 'customInline']]]],
    'horizontal rule' => [['type' => 'horizontalRule']],
]);
