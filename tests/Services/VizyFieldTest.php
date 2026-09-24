<?php

declare(strict_types=1);

use craft\base\PreviewableFieldInterface;
use craft\elements\Asset;
use craft\elements\Entry;
use craft\elements\conditions\TitleConditionRule;
use craft\fieldlayoutelements\CustomField;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\ImageTransform;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\base\RenderContext;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldImageOptions;
use verbb\vizy\helpers\FieldImagePreviews;
use verbb\vizy\nodes\Image;
use verbb\vizy\Vizy;
use yii\base\Event;

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

it('provides cached bounded native card previews without rendering Blocks or images', function() {
    $field = VizyFixtureFactory::vizyField();
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            ['type' => 'paragraph', 'content' => [
                ['type' => 'text', 'text' => 'Preview <script>alert(1)</script> ' . str_repeat('x', 300)],
            ]],
            ['type' => 'image', 'attrs' => [
                'assetUid' => craft\helpers\StringHelper::UUID(),
                'alt' => 'Image text must not appear',
            ]],
            ['type' => 'vizyBlock', 'attrs' => [
                'blockUid' => craft\helpers\StringHelper::UUID(),
                'blockTypeUid' => craft\helpers\StringHelper::UUID(),
                'enabled' => true,
                'fieldSlots' => [],
            ], 'content' => [
                ['type' => 'paragraph', 'content' => [
                    ['type' => 'text', 'text' => 'Nested Block text must not appear'],
                ]],
            ]],
        ],
    ];
    $entry = VizyFixtureFactory::entry('Native card preview');
    $value = $field->normalizeValue($document, $entry);
    $entry->setFieldValue($field->handle, $value);
    Vizy::$plugin->getContentText()->reset();

    $html = $field->getPreviewHtml($value, $entry);
    $text = html_entity_decode($html, ENT_QUOTES | ENT_HTML5);

    expect($field)->toBeInstanceOf(PreviewableFieldInterface::class)
        ->and($html)->toContain('&lt;script&gt;')
        ->and($html)->not->toContain('<script>')
        ->and($text)->toStartWith('Preview <script>alert(1)</script>')
        ->and($text)->not->toContain('Image text')
        ->and($text)->not->toContain('Nested Block text')
        ->and(mb_strlen($text))->toBe(256)
        ->and($text)->toEndWith('…')
        ->and(Vizy::$plugin->getContentText()->projectionCount())->toBe(1);

    expect($field->getPreviewHtml($value, $entry))->toBe($html)
        ->and(Vizy::$plugin->getContentText()->projectionCount())->toBe(1);

    $layout = new FieldLayout(['type' => Entry::class]);
    $placement = new CustomField($field);
    $placement->uid = craft\helpers\StringHelper::UUID();
    $tab = new FieldLayoutTab(['name' => 'Content', 'layout' => $layout]);
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $key = 'layoutElement:' . $placement->uid;
    $layout->setCardView([$key]);

    expect($layout->getCardBodyHtmlForElement($key, $entry))->toBe($html)
        ->and($layout->getCardBodyHtmlForElement($key, null))->toContain('A short preview of your Vizy content');

    $blockOnly = $field->normalizeValue([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => craft\helpers\StringHelper::UUID(),
                'blockTypeUid' => craft\helpers\StringHelper::UUID(),
                'enabled' => true,
                'fieldSlots' => [],
            ],
            'content' => [['type' => 'text', 'text' => 'Hidden']],
        ]],
    ], $entry);

    expect($field->getPreviewHtml($blockOnly, $entry))->toBe('');
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
        ->and($html)->toContain('name="blockPickerDisplay"')
        ->and($html)->toContain('name="defaultBlockPickerView"')
        ->and($html)->toContain('name="showBlockSearch"')
        ->and($html)->not->toContain('name="rootContentType')
        ->and($html)->not->toContain('name="fieldData')
        ->and($html)->not->toContain('name="vizyConfig');
});

it('defaults Block pickers to both displays, list first, with one shared search setting', function() {
    $field = new VizyField([
        'name' => 'Picker Defaults',
        'handle' => 'pickerDefaults',
    ]);

    expect($field->blockPickerDisplay)->toBe(VizyField::BLOCK_PICKER_DISPLAY_BOTH)
        ->and($field->defaultBlockPickerView)->toBe(VizyField::BLOCK_PICKER_DISPLAY_LIST)
        ->and($field->showBlockSearch)->toBeTrue();

    $field->blockPickerDisplay = 'cards';
    $field->defaultBlockPickerView = 'cards';
    expect($field->validate())->toBeFalse()
        ->and($field->getErrors('blockPickerDisplay'))->not->toBeEmpty()
        ->and($field->getErrors('defaultBlockPickerView'))->not->toBeEmpty();
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

it('resolves Block Type insertion conditions against the Entry owner', function() {
    $uid = '33333333-3333-4333-8333-333333333333';
    $condition = Entry::createCondition();
    $rule = new TitleConditionRule();
    $rule->value = 'Matching owner';
    $condition->setConditionRules([$rule]);

    $field = new VizyField([
        'name' => 'Conditional blocks',
        'handle' => 'conditionalBlocks',
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => [$uid],
        ]],
        'blockTypeAvailabilityConditions' => [
            $uid => ['elementCondition' => $condition->getConfig()],
        ],
    ]);

    $matching = new Entry(['title' => 'Matching owner']);
    $other = new Entry(['title' => 'Other owner']);

    expect($field->getAllowedBlockTypeUids())->toBe([$uid])
        ->and($field->getInsertableBlockTypeUids($matching))->toBe([$uid])
        ->and($field->getInsertableBlockTypeUids($other))->toBe([]);
});

it('resolves nested Hosted insertion conditions against the durable Entry owner', function() {
    $uid = '35353535-3535-4535-8535-353535353535';
    $condition = Entry::createCondition();
    $rule = new TitleConditionRule();
    $rule->value = 'Matching owner';
    $condition->setConditionRules([$rule]);

    $field = new VizyField([
        'name' => 'Nested conditional blocks',
        'handle' => 'nestedConditionalBlocks',
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => [$uid],
        ]],
        'blockTypeAvailabilityConditions' => [
            $uid => ['elementCondition' => $condition->getConfig()],
        ],
    ]);

    $entry = new Entry(['title' => 'Matching owner']);
    $outer = new Block();
    $outer->setOwner($entry);
    $inner = new Block();
    $inner->setOwner($outer);

    expect($field->blockTypeIsAvailableFor($uid, $inner))->toBeTrue();
    $entry->title = 'Other owner';
    expect($field->blockTypeIsAvailableFor($uid, $inner))->toBeFalse();
});

it('renders native user and Entry condition builders for referenced Block Types', function() {
    $uid = '44444444-4444-4444-8444-444444444444';
    $field = new VizyField([
        'name' => 'Conditional settings',
        'handle' => 'conditionalSettings',
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => [$uid],
        ]],
    ]);

    $html = WebControllerHarness::withWebRequest([], 'fields/edit',
        static fn(): string => (string)$field->getSettingsHtml(),
    );

    expect($html)
        ->toContain("data-vizy-block-availability-panel=\"{$uid}\"")
        ->toContain('Current User Condition')
        ->toContain('Entry Condition');
});

it('grandfathers existing conditional Blocks but rejects new identities', function() {
    $typeUid = craft\helpers\StringHelper::UUID();

    $condition = Entry::createCondition();
    $rule = new TitleConditionRule();
    $rule->value = 'Allowed owner';
    $condition->setConditionRules([$rule]);

    $field = new VizyField([
        'name' => 'Conditional content',
        'handle' => 'conditionalContent',
        'editorConfig' => 'standard',
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => [$typeUid],
        ]],
        'blockTypeAvailabilityConditions' => [
            $typeUid => ['elementCondition' => $condition->getConfig()],
        ],
    ]);
    $owner = new class([
        'title' => 'Blocked owner',
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
    ]) extends Entry {
        public mixed $testFieldValue = null;

        public function getFieldValue(string $fieldHandle): mixed
        {
            return $this->testFieldValue;
        }
    };
    $blockUid = craft\helpers\StringHelper::UUID();
    $document = static fn(string $uid): array => [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $uid,
                'blockTypeUid' => $typeUid,
                'enabled' => true,
                'fieldSlots' => [],
            ],
        ]],
    ];

    $baseline = $field->normalizeValue($document($blockUid), $owner);
    $owner->testFieldValue = $baseline;
    $field->validateBlocks($owner, $baseline);
    expect($owner->getErrors($field->handle))->toBe([]);

    $owner->testFieldValue = $field->normalizeValue(
        $document(craft\helpers\StringHelper::UUID()),
        $owner,
    );
    $field->validateBlocks($owner, $baseline);
    expect(implode(' ', $owner->getErrors($field->handle)))
        ->toContain('is not available for this entry or user');
});

it('offers private volumes in image and file picker settings', function() {
    AssetSpikeFixture::ensureAdminUser();
    $volume = AssetSpikeFixture::volume();
    expect($volume->getFs()->hasUrls)->toBeFalse();

    $field = new VizyField([
        'name' => 'Private asset settings',
        'handle' => 'privateAssetSettings',
        'editorConfig' => 'standard',
    ]);

    $html = $field->getSettingsHtml();

    // The source is always present once in Default Upload Location. It must
    // also be present in Available Volumes so authors can browse existing
    // private assets through Craft's permission-aware element selector.
    expect(substr_count($html, (string)$volume->uid))->toBeGreaterThanOrEqual(2)
        ->and(substr_count(
            $html,
            htmlspecialchars($volume->name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'),
        ))->toBeGreaterThanOrEqual(2)
        ->and(FieldImageOptions::volumes(new VizyField([
            'availableVolumes' => [$volume->uid],
        ])))->toBe(['volume:' . $volume->uid]);
});

it('uses UID-backed default transforms for private asset previews and output', function() {
    AssetSpikeFixture::ensureAdminUser();
    $suffix = craft\helpers\StringHelper::randomString(6);
    $transform = new ImageTransform([
        'name' => 'Private preview ' . $suffix,
        'handle' => 'privatePreview' . $suffix,
        'width' => 1,
        'height' => 1,
    ]);
    expect(Craft::$app->getImageTransforms()->saveTransform($transform))->toBeTrue();
    $transform = Craft::$app->getImageTransforms()->getTransformByHandle($transform->handle);

    $field = new VizyField([
        'name' => 'Private image output',
        'handle' => 'privateImageOutput',
        'defaultTransform' => $transform->uid,
    ]);
    $asset = AssetSpikeFixture::createTempAsset(
        'private-preview.png',
        base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', true),
    );
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'image',
            'attrs' => ['assetUid' => $asset->uid],
        ]],
    ];
    $seenTransforms = [];
    $handler = static function($event) use (&$seenTransforms): void {
        $seenTransforms[] = $event->transform;
        $event->url = 'https://transforms.example.test/private-preview.png';
        $event->handled = true;
    };
    Event::on(Asset::class, Asset::EVENT_BEFORE_DEFINE_URL, $handler);

    try {
        $options = FieldImageOptions::forField($field);
        $context = new RenderContext(field: $field, siteId: (int)$asset->siteId);
        $resolved = Image::resolveAttrs(['assetUid' => $asset->uid], $context);
        $previews = FieldImagePreviews::forDocument($document, (int)$asset->siteId, $field);

        expect($options['defaultTransform'])->toBe($transform->handle)
            ->and($resolved['src'])->toBe('https://transforms.example.test/private-preview.png')
            ->and($previews[$asset->uid]['url'])->toBe('https://transforms.example.test/private-preview.png')
            ->and($previews[$asset->uid]['transform'])->toBe($transform->handle)
            ->and($seenTransforms)->toBe([$transform->handle, $transform->handle]);
    } finally {
        Event::off(Asset::class, Asset::EVENT_BEFORE_DEFINE_URL, $handler);
    }
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
