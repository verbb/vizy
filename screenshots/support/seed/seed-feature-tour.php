/**
 * Seed genuine Vizy 4 project schema and editorial content for screenshots.
 *
 * Echoes JSON with the routes consumed by the screenshot scenarios.
 * Note: no opening PHP tag — @verbb/craft-screenshots injects this into a bootstrap.
 */

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\Json;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use verbb\vizy\elements\Block as VizyBlock;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

const VIZY_SCREENSHOT_CONFIG = 'editorial';
const VIZY_SCREENSHOT_FIELD_HANDLE = 'vizyFeatureContent';
const VIZY_SCREENSHOT_SECTION_HANDLE = 'vizyFeatureStories';
const VIZY_SCREENSHOT_SLUG = 'designing-a-better-city-guide';

function vizyScreenshotPlainTextField(string $handle, string $name, bool $multiline = false): PlainText
{
    $fields = Craft::$app->getFields();
    $field = $fields->getFieldByHandle($handle);

    if (!$field instanceof PlainText) {
        $field = new PlainText(['name' => $name, 'handle' => $handle]);
    }

    $field->name = $name;
    $field->multiline = $multiline;
    $field->initialRows = $multiline ? 3 : 1;

    if (!$fields->saveField($field)) {
        throw new RuntimeException("Unable to save {$name} field: " . Json::encode($field->getErrors()));
    }

    $saved = $fields->getFieldByHandle($handle);
    if (!$saved instanceof PlainText) {
        throw new RuntimeException("{$name} field could not be reloaded.");
    }

    return $saved;
}

function vizyScreenshotEditorConfig(): void
{
    $service = Vizy::$plugin->getEditorConfigs();
    $standard = $service->getConfig('standard');
    if (!$standard) {
        throw new RuntimeException('The standard Vizy Editor Config is unavailable.');
    }

    $config = $service->authorablePayload($standard);
    $config['label'] = 'Editorial';
    $config['capabilities']['marks'] = array_values(array_unique([
        ...$config['capabilities']['marks'],
        'underline',
        'highlight',
    ]));
    $service->saveConfig(VIZY_SCREENSHOT_CONFIG, $config);
}

function vizyScreenshotNestedField(): VizyField
{
    $fields = Craft::$app->getFields();
    $field = $fields->getFieldByHandle('vizyFeatureNestedBody');

    if (!$field instanceof VizyField) {
        $field = new VizyField(['name' => 'Supporting Copy', 'handle' => 'vizyFeatureNestedBody']);
    }

    $field->name = 'Supporting Copy';
    $field->editorConfig = VIZY_SCREENSHOT_CONFIG;
    $field->setEditorMode(VizyField::MODE_RICH_TEXT);
    $field->initialRows = 4;
    $field->blockTypePickerGroups = [];

    if (!$fields->saveField($field)) {
        throw new RuntimeException('Unable to save nested Vizy field: ' . Json::encode($field->getErrors()));
    }

    $saved = $fields->getFieldByHandle('vizyFeatureNestedBody');
    if (!$saved instanceof VizyField) {
        throw new RuntimeException('Nested Vizy field could not be reloaded.');
    }

    return $saved;
}

/** @param array<int, array{field: craft\base\FieldInterface, placementUid: string}> $placements */
function vizyScreenshotBlockType(
    string $uid,
    string $layoutUid,
    string $tabUid,
    string $name,
    string $handle,
    string $icon,
    string $color,
    array $placements,
): BlockType {
    $layout = new FieldLayout(['uid' => $layoutUid, 'type' => VizyBlock::class]);
    $tab = new FieldLayoutTab(['uid' => $tabUid, 'name' => 'Content', 'layout' => $layout]);
    $tab->setElements(array_map(
        static fn(array $placement) => new CustomField($placement['field'], ['uid' => $placement['placementUid']]),
        $placements,
    ));
    $layout->setTabs([$tab]);

    $blockType = new BlockType([
        'uid' => $uid,
        'name' => $name,
        'handle' => $handle,
        'icon' => $icon,
        'color' => $color,
    ]);
    $blockType->setFieldLayout($layout);

    if (!Vizy::$plugin->getBlockTypes()->saveBlockType($blockType)) {
        throw new RuntimeException("Unable to save {$name} Block Type: " . Json::encode($blockType->getErrors()));
    }

    $saved = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid);
    if (!$saved) {
        throw new RuntimeException("{$name} Block Type could not be reloaded.");
    }

    return $saved;
}

function vizyScreenshotField(array $groups): VizyField
{
    $fields = Craft::$app->getFields();
    $field = $fields->getFieldByHandle(VIZY_SCREENSHOT_FIELD_HANDLE);

    if (!$field instanceof VizyField) {
        $field = new VizyField(['name' => 'Article Content', 'handle' => VIZY_SCREENSHOT_FIELD_HANDLE]);
    }

    $field->name = 'Article Content';
    $field->editorConfig = VIZY_SCREENSHOT_CONFIG;
    $field->setEditorMode(VizyField::MODE_COMBINED);
    $field->initialRows = 14;
    $field->blockTypePickerGroups = $groups;

    if (!$fields->saveField($field)) {
        throw new RuntimeException('Unable to save Vizy field: ' . Json::encode($field->getErrors()));
    }

    $saved = $fields->getFieldByHandle(VIZY_SCREENSHOT_FIELD_HANDLE);
    if (!$saved instanceof VizyField) {
        throw new RuntimeException('Vizy field could not be reloaded.');
    }

    return $saved;
}

function vizyScreenshotSection(VizyField $field): Section
{
    $entries = Craft::$app->getEntries();
    $section = $entries->getSectionByHandle(VIZY_SCREENSHOT_SECTION_HANDLE);
    $site = Craft::$app->getSites()->getPrimarySite();

    if (!$section) {
        $entryType = new EntryType(['name' => 'Story', 'handle' => 'vizyFeatureStory', 'hasTitleField' => true]);
        if (!$entries->saveEntryType($entryType)) {
            throw new RuntimeException('Unable to save Vizy screenshot entry type: ' . Json::encode($entryType->getErrors()));
        }

        $section = new Section([
            'name' => 'Stories',
            'handle' => VIZY_SCREENSHOT_SECTION_HANDLE,
            'type' => Section::TYPE_CHANNEL,
        ]);
        $section->setEntryTypes([$entryType]);
        $section->setSiteSettings([new Section_SiteSettings([
            'siteId' => $site->id,
            'enabledByDefault' => true,
            'hasUrls' => false,
        ])]);

        if (!$entries->saveSection($section)) {
            throw new RuntimeException('Unable to save Vizy screenshot section: ' . Json::encode($section->getErrors()));
        }
        $section = $entries->getSectionByHandle(VIZY_SCREENSHOT_SECTION_HANDLE);
    }

    if (!$section) {
        throw new RuntimeException('Vizy screenshot section could not be reloaded.');
    }

    $entryType = $entries->getEntryTypesBySectionId($section->id)[0] ?? null;
    if (!$entryType) {
        throw new RuntimeException('Vizy screenshot section has no entry type.');
    }

    $layout = $entryType->getFieldLayout() ?? new FieldLayout(['type' => Entry::class]);
    $tab = $layout->getTabs()[0] ?? new FieldLayoutTab(['name' => Craft::t('app', 'Content'), 'layout' => $layout]);
    $elements = array_values(array_filter(
        $tab->getElements(),
        static fn($element) => !($element instanceof CustomField && $element->getField()?->handle === VIZY_SCREENSHOT_FIELD_HANDLE),
    ));
    $elements[] = new CustomField($field);
    $tab->setElements($elements);
    $layout->setTabs([$tab]);
    $entryType->setFieldLayout($layout);

    if (!$entries->saveEntryType($entryType)) {
        throw new RuntimeException('Unable to attach Vizy field: ' . Json::encode($entryType->getErrors()));
    }

    return $section;
}

function vizyScreenshotText(string $text, array $marks = []): array
{
    $node = ['type' => 'text', 'text' => $text];
    if ($marks) {
        $node['marks'] = $marks;
    }
    return $node;
}

function vizyScreenshotParagraph(array $content): array
{
    return ['type' => 'paragraph', 'attrs' => ['textAlign' => 'start'], 'content' => $content];
}

function vizyScreenshotPlacementUid(BlockType $blockType, string $fieldHandle): string
{
    foreach ($blockType->getFieldLayout()?->getCustomFieldElements() ?? [] as $element) {
        if ($element->getField()?->handle === $fieldHandle && $element->uid) {
            return $element->uid;
        }
    }
    throw new RuntimeException("Unable to resolve {$fieldHandle} on {$blockType->name}.");
}

function vizyScreenshotBlock(BlockType $blockType, string $blockUid, array $values): array
{
    $slots = [];
    foreach ($values as $fieldHandle => $value) {
        $slots[vizyScreenshotPlacementUid($blockType, $fieldHandle)] = $value;
    }

    return [
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => $blockUid,
            'blockTypeUid' => $blockType->uid,
            'enabled' => true,
            'fieldSlots' => $slots,
        ],
    ];
}

vizyScreenshotEditorConfig();

$calloutHeading = vizyScreenshotPlainTextField('vizyFeatureCalloutHeading', 'Heading');
$calloutText = vizyScreenshotPlainTextField('vizyFeatureCalloutText', 'Text', true);
$quoteText = vizyScreenshotPlainTextField('vizyFeatureQuoteText', 'Quote', true);
$quoteCredit = vizyScreenshotPlainTextField('vizyFeatureQuoteCredit', 'Credit');
$nestedBody = vizyScreenshotNestedField();

$callout = vizyScreenshotBlockType('11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111112', '11111111-1111-4111-8111-111111111113', 'Callout', 'callout', 'bullhorn-solid', '#2563eb', [
    ['field' => $calloutHeading, 'placementUid' => '11111111-1111-4111-8111-111111111114'],
    ['field' => $calloutText, 'placementUid' => '11111111-1111-4111-8111-111111111115'],
]);
$pullQuote = vizyScreenshotBlockType('22222222-2222-4222-8222-222222222221', '22222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222223', 'Pull Quote', 'pullQuote', 'quote-left-solid', '#7c3aed', [
    ['field' => $quoteText, 'placementUid' => '22222222-2222-4222-8222-222222222224'],
    ['field' => $quoteCredit, 'placementUid' => '22222222-2222-4222-8222-222222222225'],
]);
$imageText = vizyScreenshotBlockType('33333333-3333-4333-8333-333333333331', '33333333-3333-4333-8333-333333333332', '33333333-3333-4333-8333-333333333333', 'Image & Text', 'imageText', 'image-solid', '#059669', [
    ['field' => $calloutHeading, 'placementUid' => '33333333-3333-4333-8333-333333333334'],
    ['field' => $calloutText, 'placementUid' => '33333333-3333-4333-8333-333333333335'],
]);
$latestNews = vizyScreenshotBlockType('44444444-4444-4444-8444-444444444441', '44444444-4444-4444-8444-444444444442', '44444444-4444-4444-8444-444444444443', 'Latest News', 'latestNews', 'newspaper-solid', '#d97706', [
    ['field' => $calloutHeading, 'placementUid' => '44444444-4444-4444-8444-444444444444'],
    ['field' => $nestedBody, 'placementUid' => '44444444-4444-4444-8444-444444444445'],
]);
$button = vizyScreenshotBlockType('55555555-5555-4555-8555-555555555551', '55555555-5555-4555-8555-555555555552', '55555555-5555-4555-8555-555555555553', 'Button', 'button', 'link-solid', '#db2777', [
    ['field' => $calloutHeading, 'placementUid' => '55555555-5555-4555-8555-555555555554'],
    ['field' => $calloutText, 'placementUid' => '55555555-5555-4555-8555-555555555555'],
]);

$field = vizyScreenshotField([
    ['name' => 'Editorial', 'blockTypeUids' => [$callout->uid, $pullQuote->uid, $imageText->uid], 'disabledBlockTypeUids' => []],
    ['name' => 'Components', 'blockTypeUids' => [$latestNews->uid, $button->uid], 'disabledBlockTypeUids' => []],
]);
$section = vizyScreenshotSection($field);
$site = Craft::$app->getSites()->getPrimarySite();
$entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
$entry = Entry::find()->sectionId($section->id)->slug(VIZY_SCREENSHOT_SLUG)->siteId($site->id)->status(null)->one();

if (!$entry) {
    $entry = new Entry([
        'sectionId' => $section->id,
        'typeId' => $entryType->id,
        'siteId' => $site->id,
        'slug' => VIZY_SCREENSHOT_SLUG,
        'enabled' => true,
    ]);
}

$nestedDocument = [
    'type' => 'doc',
    'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
    'content' => [vizyScreenshotParagraph([
        vizyScreenshotText('A nested editor keeps supporting copy structured without sending authors elsewhere.'),
    ])],
];

$entry->title = 'Designing a better city guide';
$entry->setFieldValue(VIZY_SCREENSHOT_FIELD_HANDLE, [
    'type' => 'doc',
    'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
    'content' => [
        ['type' => 'heading', 'attrs' => ['textAlign' => 'start', 'level' => 2], 'content' => [vizyScreenshotText('A guide built around the reader')]],
        vizyScreenshotParagraph([vizyScreenshotText('Great editorial content needs room to breathe, but it also needs structure. Vizy keeps both in one focused writing experience.')]),
        vizyScreenshotBlock($callout, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', [
            'vizyFeatureCalloutHeading' => 'Plan the story, not the interface',
            'vizyFeatureCalloutText' => 'Add structured content exactly where it belongs, without sending authors to a separate builder.',
        ]),
        vizyScreenshotParagraph([vizyScreenshotText('Authors can move from formatted copy to reusable project fields and back again, while developers retain predictable content data.')]),
        vizyScreenshotBlock($pullQuote, 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', [
            'vizyFeatureQuoteText' => 'The best editing tools disappear into the work.',
            'vizyFeatureQuoteCredit' => 'Editorial team',
        ]),
        vizyScreenshotParagraph([vizyScreenshotText('Every part of the field can be tailored to the content model, including the toolbar, available blocks and authoring limits.')]),
        ['type' => 'heading', 'attrs' => ['textAlign' => 'start', 'level' => 3], 'content' => [vizyScreenshotText('Seasonal guide at a glance')]],
        ['type' => 'table', 'content' => [
            ['type' => 'tableRow', 'content' => [
                ['type' => 'tableHeader', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Season')])]],
                ['type' => 'tableHeader', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('City highlight')])]],
            ]],
            ['type' => 'tableRow', 'content' => [
                ['type' => 'tableCell', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Autumn')])]],
                ['type' => 'tableCell', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Riverside markets')])]],
            ]],
            ['type' => 'tableRow', 'content' => [
                ['type' => 'tableCell', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Winter')])]],
                ['type' => 'tableCell', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Gallery late nights')])]],
            ]],
        ]],
        vizyScreenshotBlock($latestNews, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', [
            'vizyFeatureCalloutHeading' => 'Latest city stories',
            'vizyFeatureNestedBody' => $nestedDocument,
        ]),
    ],
]);

// Console fixture scripts do not emit Craft's normal end-of-request event. Flush
// queued Project Config changes so the following browser request can resolve the
// named Editor Config and global Block Types rather than seeing database records
// without their canonical schema definitions.
$projectConfig = Craft::$app->getProjectConfig();
$projectConfig->saveModifiedConfigData();
$projectConfig->writeYamlFiles();

if (!Craft::$app->getElements()->saveElement($entry)) {
    throw new RuntimeException('Unable to save Vizy screenshot entry: ' . Json::encode($entry->getErrors()));
}

$admin = Craft::$app->getConfig()->getGeneral()->cpTrigger ?: 'admin';
echo Json::encode([
    'fieldId' => $field->id,
    'fieldHandle' => $field->handle,
    'settingsRoute' => "/{$admin}/settings/fields/edit/{$field->id}",
    'editorConfigRoute' => "/{$admin}/vizy/settings/editor-configs/" . VIZY_SCREENSHOT_CONFIG,
    'blockTypesRoute' => "/{$admin}/vizy/settings/block-types",
    'entryEditRoute' => "/{$admin}/entries/{$section->handle}/{$entry->id}",
]);
