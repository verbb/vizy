<?php

declare(strict_types=1);

use craft\elements\Entry;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;

it('normalizes and serializes the canonical VizyDocument field value', function() {
    $field = VizyFixtureFactory::vizyField();
    $entry = new Entry(['title' => 'Normalize test']);
    $document = $field->normalizeValue(VizyFixtureFactory::paragraphDocument('Round trip'), $entry);

    expect($document)->toBeInstanceOf(VizyDocument::class)
        ->and($document->owner())->toBe($entry)
        ->and($document->field())->toBe($field)
        ->and(VizyField::phpType())->toBe(VizyDocument::class);

    $serialized = $field->serializeValue($document, $entry);
    $decoded = json_decode($serialized, true);
    expect($decoded['type'])->toBe('doc')
        ->and($decoded['attrs']['schemaVersion'])->toBe(VizyDocument::CURRENT_SCHEMA_VERSION)
        ->and($decoded['content'][0]['content'][0]['text'])->toBe('Round trip');
});

it('preserves same-context identity and creates fresh context-bound graphs', function() {
    $field = VizyFixtureFactory::vizyField();
    $ownerA = new Entry(['title' => 'A']);
    $ownerB = new Entry(['title' => 'B']);
    $document = $field->normalizeValue(VizyFixtureFactory::paragraphDocument('Context'), $ownerA);

    expect($field->normalizeValue($document, $ownerA))->toBe($document);
    $rebound = $field->normalizeValue($document, $ownerB);
    expect($rebound)->not->toBe($document)
        ->and($rebound->owner())->toBe($ownerB)
        ->and($rebound->toArray())->toBe($document->toArray());
});

it('renders static canonical prose and extracts canonical search text', function() {
    $field = VizyFixtureFactory::vizyField();
    $entry = new Entry(['title' => 'Projection owner']);
    $document = $field->normalizeValue(VizyFixtureFactory::paragraphDocument('Canonical projection'), $entry);

    $method = new ReflectionMethod($field, 'searchKeywords');
    $keywords = $method->invoke($field, $document, $entry);

    expect($field->getStaticHtml($document, $entry))->toContain('<p>Canonical projection</p>')
        ->and($keywords)->toContain('Canonical projection');
});

it('indexes Image alt and Link mark values in search keywords', function() {
    $field = VizyFixtureFactory::vizyField();
    $entry = new Entry([
        'title' => 'Search enrich',
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
    ]);
    $assetUid = craft\helpers\StringHelper::UUID();
    $document = $field->normalizeValue([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            [
                'type' => 'paragraph',
                'content' => [[
                    'type' => 'text',
                    'text' => 'See ',
                    'marks' => [[
                        'type' => 'link',
                        'attrs' => [
                            'type' => 'url',
                            'value' => 'https://search-link.example/path',
                            'siteMode' => 'current',
                            'newWindow' => false,
                        ],
                    ]],
                ]],
            ],
            [
                'type' => 'image',
                'attrs' => [
                    'assetUid' => $assetUid,
                    'alt' => 'Hero alt keyword',
                ],
            ],
        ],
    ], $entry);

    $method = new ReflectionMethod($field, 'searchKeywords');
    $keywords = $method->invoke($field, $document, $entry);

    expect($keywords)->toContain('https://search-link.example/path')
        ->and($keywords)->toContain('Hero alt keyword');
});

it('indexes Hosted nested Vizy prose through searchable Block fields', function() {
    $suffix = craft\helpers\StringHelper::randomString(6);
    $nestedField = new VizyField([
        'name' => 'Nested Search',
        'handle' => 'nestedSearch' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'searchable' => true,
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $blockType = new verbb\vizy\models\BlockType([
        'uid' => craft\helpers\StringHelper::UUID(),
        'name' => 'Search Card',
        'handle' => 'searchCard' . $suffix,
    ]);
    $layout = new craft\models\FieldLayout([
        'uid' => craft\helpers\StringHelper::UUID(),
        'type' => verbb\vizy\elements\Block::class,
    ]);
    $tab = new craft\models\FieldLayoutTab([
        'uid' => craft\helpers\StringHelper::UUID(),
        'name' => 'Content',
        'layout' => $layout,
    ]);
    $nestedPlacement = new craft\fieldlayoutelements\CustomField($nestedField);
    $nestedPlacement->uid = craft\helpers\StringHelper::UUID();
    $tab->setElements([$nestedPlacement]);
    $layout->setTabs([$tab]);
    $blockType->setFieldLayout($layout);
    expect(verbb\vizy\Vizy::$plugin->getBlockTypes()->saveBlockType($blockType))->toBeTrue();

    $rootField = new VizyField([
        'name' => 'Root Search',
        'handle' => 'rootSearch' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$blockType->uid]],
        ],
        'searchable' => true,
    ]);
    expect(Craft::$app->getFields()->saveField($rootField))->toBeTrue();

    $entry = new Entry([
        'title' => 'Hosted search owner',
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
    ]);
    $nestedDoc = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'paragraph',
            'content' => [['type' => 'text', 'text' => 'HostedUniqueKeyword42']],
        ]],
    ];
    $document = $rootField->normalizeValue([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => craft\helpers\StringHelper::UUID(),
                'blockTypeUid' => $blockType->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $nestedPlacement->uid => $nestedDoc,
                ],
            ],
            'content' => [],
        ]],
    ], $entry);

    $method = new ReflectionMethod($rootField, 'searchKeywords');
    $keywords = $method->invoke($rootField, $document, $entry);

    expect($keywords)->toContain('HostedUniqueKeyword42');
});

it('ignores transient vizyBlockTypes settings payload during construction', function() {
    $field = new VizyField([
        'name' => 'Body',
        'handle' => 'body' . craft\helpers\StringHelper::randomString(5),
        'vizyBlockTypes' => [
            'test-uid' => ['name' => 'Card', 'handle' => 'card'],
        ],
    ]);

    expect($field->name)->toBe('Body');
});

it('starts new fields with an empty block configuration', function() {
    $field = new VizyField([
        'name' => 'Settings',
        'handle' => 'settingsField',
        'editorConfig' => 'standard',
    ]);

    $html = $field->getSettingsHtml();
    expect($html)->toMatch('/data-initial="([^"]+)"/');

    preg_match('/data-initial="([^"]+)"/', $html, $matches);
    $initial = json_decode(html_entity_decode($matches[1], ENT_QUOTES | ENT_HTML5), true);

    expect($initial['groups'])->toBe([]);
});

it('renders only canonical field schema settings', function() {
    $field = new VizyField([
        'name' => 'Settings',
        'handle' => 'settingsField',
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS,
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => [],
        ]],
    ]);

    $html = $field->getSettingsHtml();

    // Editor Mode is the authored control; `rootContentType` stays the stored
    // policy and is derived from it rather than posted directly.
    expect($html)->toContain('name="editorMode"')
        ->and($html)->toContain('editorConfig')
        ->and($html)->toContain('blockTypePickerGroups')
        ->and($html)->not->toContain('name="rootContentType')
        ->and($html)->not->toContain('name="fieldData')
        ->and($html)->not->toContain('name="vizyConfig');
});

it('projects editor mode onto the stored root policy losslessly', function() {
    $field = new VizyField([
        'name' => 'Settings',
        'handle' => 'settingsField',
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => ['11111111-1111-4111-8111-111111111111'],
        ]],
    ]);

    $field->setEditorMode('blocks');
    expect($field->rootContentType)->toBe(VizyField::ROOT_CONTENT_BLOCKS)
        ->and($field->getEditorMode())->toBe('blocks');

    // Rich Text Only suppresses insertion without discarding allowances, so the
    // round trip back to combined restores the same insertable set.
    $field->setEditorMode('richText');
    expect($field->rootContentType)->toBe(VizyField::ROOT_CONTENT_RICH)
        ->and($field->getEditorMode())->toBe('richText')
        ->and($field->getInsertableBlockTypeUids())->toBe([])
        ->and($field->getAllowedBlockTypeUids())->toBe(['11111111-1111-4111-8111-111111111111']);

    $field->setEditorMode('combined');
    expect($field->getEditorMode())->toBe('combined')
        ->and($field->getInsertableBlockTypeUids())->toBe(['11111111-1111-4111-8111-111111111111']);
});

it('separates field-local availability from block type membership', function() {
    $uid = '22222222-2222-4222-8222-222222222222';
    $field = new VizyField([
        'name' => 'Settings',
        'handle' => 'settingsField',
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => [$uid],
            'disabledBlockTypeUids' => [$uid],
        ]],
    ]);

    // Disabling removes it from insertion but must keep it permitted, so Blocks
    // already authored with this type still resolve and validate.
    expect($field->getInsertableBlockTypeUids())->toBe([])
        ->and($field->getAllowedBlockTypeUids())->toBe([$uid])
        ->and($field->allowsBlockTypeUid($uid))->toBeTrue();
});

it('warns in asset settings when volume and transform pickers have no options', function() {
    $view = Craft::$app->getView();
    $field = new VizyField([
        'name' => 'Settings',
        'handle' => 'settingsField',
        'editorConfig' => 'standard',
    ]);

    $html = $view->renderTemplate('vizy/field/settings', [
        'field' => $field,
        'editorMode' => $field->getEditorMode(),
        'editorConfigOptions' => [],
        'pickerGroupsInputName' => 'blockTypePickerGroups',
        'configuratorInitial' => [
            'groups' => [],
            'blockTypes' => [],
            'availableBlockTypes' => [],
        ],
        'volumeOptions' => [],
        'sourceOptions' => [],
        'transformOptions' => [],
        'uploadLocationWarning' => Craft::t('app', 'No volumes exist yet.'),
        'volumeOptionsWarning' => Craft::t('app', 'No volumes exist yet.'),
        'transformOptionsWarning' => Craft::t('app', 'No image transforms exist yet.'),
        'defaultTransformOptions' => [
            ['label' => Craft::t('vizy', 'No transform'), 'value' => null],
        ],
    ]);

    expect($html)->toContain('id="availableVolumes-warning"')
        ->and($html)->toContain('id="availableTransforms-warning"')
        ->and($html)->toContain('id="defaultTransform-warning"')
        ->and($html)->toContain(Craft::t('app', 'No volumes exist yet.'))
        ->and($html)->toContain(Craft::t('app', 'No image transforms exist yet.'));
});
