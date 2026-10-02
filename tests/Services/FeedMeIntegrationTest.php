<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\base\FieldInterface;
use craft\behaviors\CustomFieldBehavior;
use craft\feedme\models\FeedModel;
use craft\feedme\Plugin as FeedMe;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\elements\Block;
use verbb\vizy\events\RegisterHtmlImportRulesEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\importers\HtmlImportException;
use verbb\vizy\importers\HtmlImportRule;
use verbb\vizy\integrations\feedme\fields\Vizy as FeedMeVizy;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\HtmlImporter;
use verbb\vizy\Vizy;
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

it('maps matched inline HTML to an explicit Vizy Block and placement', function() {
    $fixture = feedMeBlockMappingFixture(new \craft\fields\PlainText([
        'name' => 'Image source',
        'handle' => 'imageSource' . StringHelper::randomString(6),
    ]));
    $value = FeedMe::$plugin->fields->parseField(
        new FeedModel(['setEmptyValues' => true]),
        $fixture['owner'],
        ['body' => '<p>Before <img class="feature" src="https://example.test/photo.jpg"> after</p>'],
        $fixture['field']->handle,
        [
            'field' => VizyField::class,
            'node' => 'body',
            'options' => [
                'blockMappings' => [
                    $fixture['type']->uid => [
                        'enabled' => true,
                        'tag' => 'img',
                        'attribute' => 'class',
                        'value' => 'feature',
                        'fields' => [
                            $fixture['placementUid'] => [
                                'source' => 'attribute',
                                'attribute' => 'src',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    );
    $document = json_decode($value, true, flags: JSON_THROW_ON_ERROR);

    expect(array_column($document['content'], 'type'))->toBe(['paragraph', 'vizyBlock', 'paragraph'])
        ->and($document['content'][0]['content'][0]['text'])->toBe('Before')
        ->and($document['content'][1]['attrs']['blockTypeUid'])->toBe($fixture['type']->uid)
        ->and($document['content'][1]['attrs']['blockUid'])->toMatch('/^[0-9a-f-]{36}$/')
        ->and($document['content'][1]['attrs']['fieldSlots'])->toBe([
            $fixture['placementUid'] => 'https://example.test/photo.jpg',
        ])
        ->and($document['content'][2]['content'][0]['text'])->toBe('after');
})->group('feed-me');

it('passes mapped image attributes through the Feed Me Assets adapter', function() {
    $asset = AssetSpikeFixture::createTempAsset('feed-me-block.txt', 'Feed Me Block');
    $fixture = feedMeBlockMappingFixture(AssetSpikeFixture::assetsField());
    $rootContentType = $fixture['field']->rootContentType;
    $fixture['field']->rootContentType = VizyField::ROOT_CONTENT_BLOCKS;
    try {
        $value = FeedMe::$plugin->fields->parseField(
            new FeedModel(['setEmptyValues' => true]),
            $fixture['owner'],
            ['body' => '<img data-asset-id="' . $asset->id . '" alt="Mapped Asset">'],
            $fixture['field']->handle,
            [
                'field' => VizyField::class,
                'node' => 'body',
                'options' => [
                    'blockMappings' => [
                        $fixture['type']->uid => [
                            'enabled' => true,
                            'tag' => 'img',
                            'fields' => [
                                $fixture['placementUid'] => [
                                    'source' => 'attribute',
                                    'attribute' => 'data-asset-id',
                                    'options' => ['match' => 'id'],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        );
    } finally {
        $fixture['field']->rootContentType = $rootContentType;
    }
    $document = json_decode($value, true, flags: JSON_THROW_ON_ERROR);

    expect($document['content'])->toHaveCount(1)
        ->and($document['content'][0]['type'])->toBe('vizyBlock')
        ->and($document['content'][0]['attrs']['fieldSlots'][$fixture['placementUid']])->toBe([$asset->id]);
})->group('feed-me');

it('renders UID-addressed Vizy Block mapping controls and rejects handle inference', function() {
    $fixture = feedMeBlockMappingFixture(new \craft\fields\PlainText([
        'name' => 'Caption',
        'handle' => 'caption' . StringHelper::randomString(6),
    ]));
    $registered = FeedMe::$plugin->fields->getRegisteredField(VizyField::class);
    $mappingHtml = Craft::$app->getView()->renderTemplate(
        $registered->getMappingTemplate(),
        [
            'name' => $fixture['field']->name,
            'handle' => $fixture['field']->handle,
            'instructions' => '',
            'feed' => new FeedModel(['fieldMapping' => []]),
            'feedData' => [['label' => 'Body', 'value' => 'body']],
            'field' => $fixture['field'],
            'fieldClass' => $registered,
        ],
    );

    expect($mappingHtml)->toContain('HTML to Vizy Block mappings')
        ->and($mappingHtml)->toContain($fixture['type']->uid)
        ->and($mappingHtml)->toContain($fixture['placementUid'])
        ->and(fn() => FeedMe::$plugin->fields->parseField(
            new FeedModel(),
            $fixture['owner'],
            ['body' => '<img src="photo.jpg">'],
            $fixture['field']->handle,
            [
                'field' => VizyField::class,
                'node' => 'body',
                'options' => [
                    'blockMappings' => [
                        $fixture['type']->handle => [
                            'enabled' => true,
                            'tag' => 'img',
                        ],
                    ],
                ],
            ],
        ))->toThrow(InvalidArgumentException::class, 'Block Type UID');
})->group('feed-me');

/**
 * @return array{field: VizyField, owner: Entry, type: BlockType, placementUid: string}
 */
function feedMeBlockMappingFixture(FieldInterface $blockField): array
{
    if (!$blockField->id && !Craft::$app->getFields()->saveField($blockField)) {
        throw new RuntimeException('Failed saving Feed Me Block field: ' . json_encode($blockField->getErrors()));
    }
    CustomFieldBehavior::$fieldHandles[$blockField->handle] = true;
    $placement = new CustomField($blockField, ['uid' => StringHelper::UUID()]);
    $layout = new FieldLayout(['type' => Block::class, 'uid' => StringHelper::UUID()]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [$placement],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Imported Image',
        'handle' => 'importedImage' . StringHelper::randomString(6),
    ]);
    $type->setFieldLayout($layout);

    if (!Vizy::$plugin->getBlockTypes()->saveBlockType($type)) {
        throw new RuntimeException('Failed saving Feed Me Block Type: ' . json_encode($type->getErrors()));
    }
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
    $field = VizyFixtureFactory::vizyField();
    $field->richTextOnly = false;
    $field->blockTypePickerGroups = [['name' => 'Imported', 'blockTypeUids' => [$type->uid]]];

    if (!Craft::$app->getFields()->saveField($field, false)) {
        throw new RuntimeException('Failed enabling the Feed Me Block Type: ' . json_encode($field->getErrors()));
    }
    $owner = VizyFixtureFactory::entry('Feed Me Block owner');

    foreach ($owner->getFieldLayout()?->getCustomFieldElements() ?? [] as $ownerPlacement) {
        $ownerField = $ownerPlacement->getField();

        if ($ownerField instanceof VizyField && $ownerField->uid === $field->uid) {
            $ownerField->richTextOnly = false;
            $ownerField->blockTypePickerGroups = $field->blockTypePickerGroups;
            $field = $ownerField;
        }
    }

    return [
        'field' => $field,
        'owner' => $owner,
        'type' => $type,
        'placementUid' => $type->getFieldLayout()->getCustomFieldElements()[0]->uid,
    ];
}
