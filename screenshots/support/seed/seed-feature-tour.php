/**
 * Seed a real Craft 5 Vizy field, block configuration and editorial entry.
 *
 * Echoes JSON: fieldId, fieldHandle, settingsRoute and entryEditRoute.
 * Note: no opening PHP tag — @verbb/craft-screenshots injects this into a bootstrap.
 */

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use verbb\vizy\fields\VizyField;

const VIZY_SCREENSHOT_FIELD_HANDLE = 'vizyFeatureContent';
const VIZY_SCREENSHOT_SECTION_HANDLE = 'vizyFeatureStories';
const VIZY_SCREENSHOT_SLUG = 'designing-a-better-city-guide';

function vizyScreenshotPlainTextField(string $handle, string $name, bool $multiline = false): PlainText
{
    $fields = Craft::$app->getFields();
    $field = $fields->getFieldByHandle($handle);

    if (!$field instanceof PlainText) {
        $field = new PlainText([
            'name' => $name,
            'handle' => $handle,
        ]);
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

function vizyScreenshotBlockLayout(string $tabName, array $fields): FieldLayout
{
    $layout = new FieldLayout([
        'type' => \verbb\vizy\models\BlockType::class,
    ]);
    $tab = new FieldLayoutTab([
        'name' => $tabName,
        'layout' => $layout,
    ]);
    $tab->setElements(array_map(
        static fn($field) => new CustomField($field, ['width' => 100]),
        $fields,
    ));
    $layout->setTabs([$tab]);

    return $layout;
}

function vizyScreenshotNestedField(): VizyField
{
    $fields = Craft::$app->getFields();
    $field = $fields->getFieldByHandle('vizyFeatureNestedBody');

    if (!$field instanceof VizyField) {
        $field = new VizyField([
            'name' => 'Article Body',
            'handle' => 'vizyFeatureNestedBody',
        ]);
    }

    $field->name = 'Article Body';
    $field->editorMode = VizyField::MODE_COMBINED;
    $field->configSelectionMode = 'manual';
    $field->manualConfig = Json::encode([
        'buttons' => ['formatting', 'bold', 'italic', 'link', 'ordered-list', 'unordered-list'],
        'formatting' => ['paragraph', 'h3'],
        'commands' => [],
    ]);
    $field->initialRows = 5;
    $field->fieldData = [];

    if (!$fields->saveField($field)) {
        throw new RuntimeException('Unable to save nested Vizy field: ' . Json::encode($field->getErrors()));
    }

    $saved = $fields->getFieldByHandle('vizyFeatureNestedBody');

    if (!$saved instanceof VizyField) {
        throw new RuntimeException('Nested Vizy field could not be reloaded.');
    }

    return $saved;
}

function vizyScreenshotBlockType(
    string $id,
    string $name,
    string $handle,
    string $iconLabel,
    string $iconValue,
    FieldLayout $layout,
): array {
    return [
        'id' => $id,
        'name' => $name,
        'handle' => $handle,
        'icon' => [
            'label' => $iconLabel,
            'value' => $iconValue,
        ],
        'enabled' => true,
        'layoutUid' => StringHelper::UUID(),
        'layout' => Json::encode($layout->getConfig()),
    ];
}

function vizyScreenshotField(array $blockGroups): VizyField
{
    $fields = Craft::$app->getFields();
    $field = $fields->getFieldByHandle(VIZY_SCREENSHOT_FIELD_HANDLE);

    if (!$field instanceof VizyField) {
        $field = new VizyField([
            'name' => 'Article Content',
            'handle' => VIZY_SCREENSHOT_FIELD_HANDLE,
        ]);
    }

    $field->name = 'Article Content';
    $field->editorMode = VizyField::MODE_COMBINED;
    $field->configSelectionMode = 'manual';
    $field->manualConfig = Json::encode([
        'buttons' => ['formatting', 'bold', 'italic', 'underline', 'blockquote', 'ordered-list', 'unordered-list', 'link', 'table', 'hr', 'undo', 'redo'],
        'formatting' => ['paragraph', 'h2', 'h3', 'blockquote'],
        'commands' => ['h1', 'h2', 'h3', 'ordered-list', 'unordered-list', 'blockquote', 'link', 'code-block', 'hr'],
    ]);
    $field->initialRows = 12;
    $field->blockTypeBehaviour = VizyField::PICKER_BEHAVIOUR_CLICK;
    $field->fieldData = $blockGroups;

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
        $entryType = new EntryType([
            'name' => 'Story',
            'handle' => 'vizyFeatureStory',
            'hasTitleField' => true,
        ]);

        if (!$entries->saveEntryType($entryType)) {
            throw new RuntimeException('Unable to save Vizy screenshot entry type: ' . Json::encode($entryType->getErrors()));
        }

        $section = new Section([
            'name' => 'Stories',
            'handle' => VIZY_SCREENSHOT_SECTION_HANDLE,
            'type' => Section::TYPE_CHANNEL,
        ]);
        $section->setEntryTypes([$entryType]);
        $section->setSiteSettings([
            new Section_SiteSettings([
                'siteId' => $site->id,
                'enabledByDefault' => true,
                'hasUrls' => false,
            ]),
        ]);

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
    $tab = $layout->getTabs()[0] ?? new FieldLayoutTab([
        'name' => Craft::t('app', 'Content'),
        'layout' => $layout,
    ]);
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
    $node = [
        'type' => 'text',
        'text' => $text,
    ];

    if ($marks) {
        $node['marks'] = $marks;
    }

    return $node;
}

function vizyScreenshotParagraph(array $content): array
{
    return [
        'type' => 'paragraph',
        'attrs' => ['textAlign' => 'start'],
        'content' => $content,
    ];
}

function vizyScreenshotBlock(VizyField $field, string $id, string $type, array $values): array
{
    $blockType = $field->getBlockTypeById($type);

    if (!$blockType || !$blockType->getFieldLayout()) {
        throw new RuntimeException("Unable to resolve Vizy block layout for {$type}.");
    }

    $fields = [];

    foreach ($blockType->getFieldLayout()->getCustomFields() as $customField) {
        $layoutElementUid = $customField->layoutElement?->uid;

        if ($layoutElementUid && array_key_exists($customField->handle, $values)) {
            $fields[$layoutElementUid] = $values[$customField->handle];
        }
    }

    return [
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => $id,
            'enabled' => true,
            'collapsed' => false,
            'values' => [
                'id' => $id,
                'type' => $type,
                'typeEnabled' => true,
                'content' => [
                    'fields' => $fields,
                ],
            ],
        ],
    ];
}

$calloutHeading = vizyScreenshotPlainTextField('vizyFeatureCalloutHeading', 'Heading');
$calloutText = vizyScreenshotPlainTextField('vizyFeatureCalloutText', 'Text');
$quoteText = vizyScreenshotPlainTextField('vizyFeatureQuoteText', 'Quote', true);
$quoteCredit = vizyScreenshotPlainTextField('vizyFeatureQuoteCredit', 'Credit');
$nestedBody = vizyScreenshotNestedField();

$editorialBlockTypes = [
    vizyScreenshotBlockType(
        'type-callout',
        'Callout',
        'callout',
        'Bullhorn',
        'bullhorn-solid',
        vizyScreenshotBlockLayout('Content', [$calloutHeading, $calloutText]),
    ),
    vizyScreenshotBlockType(
        'type-quote',
        'Pull Quote',
        'pullQuote',
        'Quote Left',
        'quote-left-solid',
        vizyScreenshotBlockLayout('Content', [$quoteText, $quoteCredit]),
    ),
    vizyScreenshotBlockType(
        'type-image-text',
        'Image & Text',
        'imageText',
        'Image',
        'image-solid',
        vizyScreenshotBlockLayout('Content', [$calloutHeading, $calloutText]),
    ),
    vizyScreenshotBlockType(
        'type-video',
        'Video',
        'video',
        'Video',
        'video-solid',
        vizyScreenshotBlockLayout('Content', [$calloutHeading]),
    ),
    vizyScreenshotBlockType(
        'type-gallery',
        'Gallery',
        'gallery',
        'Images',
        'images-solid',
        vizyScreenshotBlockLayout('Content', [$calloutHeading]),
    ),
];

$layoutBlockTypes = [
    vizyScreenshotBlockType(
        'type-columns',
        'Columns',
        'columns',
        'Columns',
        'table-columns-solid',
        vizyScreenshotBlockLayout('Settings', [$calloutHeading]),
    ),
    vizyScreenshotBlockType(
        'type-spacer',
        'Spacer',
        'spacer',
        'Arrows Up Down',
        'arrows-up-down-solid',
        vizyScreenshotBlockLayout('Settings', [$calloutHeading]),
    ),
    vizyScreenshotBlockType(
        'type-button',
        'Button',
        'button',
        'Link',
        'link-solid',
        vizyScreenshotBlockLayout('Settings', [$calloutHeading, $calloutText]),
    ),
];

$widgetBlockTypes = [
    vizyScreenshotBlockType(
        'type-latest-news',
        'Latest News',
        'latestNews',
        'Newspaper',
        'newspaper-solid',
        vizyScreenshotBlockLayout('Content', [$calloutHeading, $nestedBody]),
    ),
    vizyScreenshotBlockType(
        'type-newsletter',
        'Newsletter',
        'newsletter',
        'Envelope',
        'envelope-solid',
        vizyScreenshotBlockLayout('Content', [$calloutHeading, $calloutText]),
    ),
];

$field = vizyScreenshotField([
    [
        'id' => 'group-editorial',
        'name' => 'Editorial',
        'blockTypes' => $editorialBlockTypes,
    ],
    [
        'id' => 'group-layout',
        'name' => 'Layout',
        'blockTypes' => $layoutBlockTypes,
    ],
    [
        'id' => 'group-widgets',
        'name' => 'Widgets',
        'blockTypes' => $widgetBlockTypes,
    ],
]);
$section = vizyScreenshotSection($field);
$site = Craft::$app->getSites()->getPrimarySite();
$entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
$entry = Entry::find()
    ->sectionId($section->id)
    ->slug(VIZY_SCREENSHOT_SLUG)
    ->siteId($site->id)
    ->status(null)
    ->one();

if (!$entry) {
    $entry = new Entry([
        'sectionId' => $section->id,
        'typeId' => $entryType->id,
        'siteId' => $site->id,
        'slug' => VIZY_SCREENSHOT_SLUG,
        'enabled' => true,
    ]);
}

$entry->title = 'Designing a better city guide';
$entry->setFieldValue(VIZY_SCREENSHOT_FIELD_HANDLE, [
    [
        'type' => 'heading',
        'attrs' => ['textAlign' => 'start', 'level' => 2],
        'content' => [vizyScreenshotText('A guide built around the reader')],
    ],
    vizyScreenshotParagraph([
        vizyScreenshotText('Great editorial content needs room to breathe, but it also needs structure. Vizy keeps both in one focused writing experience.'),
    ]),
    vizyScreenshotBlock($field, 'block-callout', 'type-callout', [
        'vizyFeatureCalloutHeading' => 'Plan the story, not the interface',
        'vizyFeatureCalloutText' => "Add structured content exactly where it belongs, without sending authors to a separate builder.",
    ]),
    vizyScreenshotParagraph([
        vizyScreenshotText('Authors can move from formatted copy to reusable project fields and back again, while developers retain predictable content data.'),
    ]),
    vizyScreenshotBlock($field, 'block-quote', 'type-quote', [
        'vizyFeatureQuoteText' => 'The best editing tools disappear into the work.',
        'vizyFeatureQuoteCredit' => 'Editorial team',
    ]),
    vizyScreenshotParagraph([
        vizyScreenshotText('Every part of the field can be tailored to the content model, including the toolbar, available blocks and authoring limits.'),
    ]),
    [
        'type' => 'heading',
        'attrs' => ['textAlign' => 'start', 'level' => 3],
        'content' => [vizyScreenshotText('Seasonal guide at a glance')],
    ],
    [
        'type' => 'table',
        'content' => [
            [
                'type' => 'tableRow',
                'content' => [
                    ['type' => 'tableHeader', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Season')])]],
                    ['type' => 'tableHeader', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('City highlight')])]],
                ],
            ],
            [
                'type' => 'tableRow',
                'content' => [
                    ['type' => 'tableCell', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Autumn')])]],
                    ['type' => 'tableCell', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Riverside markets')])]],
                ],
            ],
            [
                'type' => 'tableRow',
                'content' => [
                    ['type' => 'tableCell', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Winter')])]],
                    ['type' => 'tableCell', 'content' => [vizyScreenshotParagraph([vizyScreenshotText('Gallery late nights')])]],
                ],
            ],
        ],
    ],
    vizyScreenshotBlock($field, 'block-latest-news', 'type-latest-news', [
        'vizyFeatureCalloutHeading' => 'Latest city stories',
        'vizyFeatureNestedBody' => Json::encode([]),
    ]),
]);

if (!Craft::$app->getElements()->saveElement($entry)) {
    throw new RuntimeException('Unable to save Vizy screenshot entry: ' . Json::encode($entry->getErrors()));
}

$admin = Craft::$app->getConfig()->getGeneral()->cpTrigger ?: 'admin';

echo Json::encode([
    'fieldId' => $field->id,
    'fieldHandle' => $field->handle,
    'settingsRoute' => "/{$admin}/settings/fields/edit/{$field->id}",
    'entryEditRoute' => "/{$admin}/entries/{$section->handle}/{$entry->id}",
]);
