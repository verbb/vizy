<?php

declare(strict_types=1);

namespace Tests\Support\Fixtures;

use Craft;
use craft\base\Field;
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
use craft\models\Site;
use RuntimeException;
use Tests\Support\ResetTestDatabase;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block as VizyBlockElement;
use verbb\vizy\fields\VizyField;

class VizyFixtureFactory
{
    private static int $sequence = 0;

    private static ?VizyField $vizyField = null;

    private static ?Section $section = null;

    public static function vizyField(?string $handle = null): VizyField
    {
        if (self::$vizyField) {
            return self::$vizyField;
        }

        $handle ??= 'vizyBody';
        $existing = Craft::$app->getFields()->getFieldByHandle($handle);

        if ($existing instanceof VizyField) {
            self::$vizyField = $existing;

            return self::$vizyField;
        }

        $field = new VizyField([
            'name' => 'Vizy Body',
            'handle' => $handle,
            'editorMode' => VizyField::MODE_RICH_TEXT,
        ]);

        if (!Craft::$app->getFields()->saveField($field)) {
            throw new RuntimeException('Failed saving Vizy field fixture: ' . json_encode($field->getErrors()));
        }

        self::$vizyField = Craft::$app->getFields()->getFieldByHandle($handle);

        if (!self::$vizyField instanceof VizyField) {
            throw new RuntimeException('Vizy field fixture could not be reloaded.');
        }

        return self::$vizyField;
    }

    public static function section(): Section
    {
        if (self::$section) {
            return self::$section;
        }

        $handle = ResetTestDatabase::TEST_SECTION_HANDLE;
        $entries = Craft::$app->getEntries();
        $existing = $entries->getSectionByHandle($handle);

        if ($existing) {
            self::$section = $existing;

            return self::$section;
        }

        $field = self::vizyField();
        $fieldLayout = new FieldLayout();
        $fieldLayout->setTabs([
            new FieldLayoutTab([
                'layout' => $fieldLayout,
                'name' => 'Content',
                'elements' => [
                    [
                        'type' => CustomField::class,
                        'fieldUid' => $field->uid,
                    ],
                ],
            ]),
        ]);

        $entryType = new EntryType([
            'name' => 'Vizy Test',
            'handle' => 'vizyTest',
            'hasTitleField' => true,
        ]);
        $entryType->setFieldLayout($fieldLayout);

        if (!$entries->saveEntryType($entryType)) {
            throw new RuntimeException('Failed creating Vizy test entry type: ' . json_encode($entryType->getErrors()));
        }

        $section = new Section([
            'name' => 'Vizy Tests',
            'handle' => $handle,
            'type' => Section::TYPE_CHANNEL,
            'enableVersioning' => false,
        ]);
        $section->setEntryTypes([$entryType]);
        $section->setSiteSettings(array_map(
            static fn(Site $site): Section_SiteSettings => new Section_SiteSettings([
                'siteId' => $site->id,
                'enabledByDefault' => true,
                'hasUrls' => true,
                'uriFormat' => 'vizy-tests/{slug}',
                'template' => '',
            ]),
            Craft::$app->getSites()->getAllSites(),
        ));

        if (!$entries->saveSection($section)) {
            throw new RuntimeException('Failed creating Vizy test section: ' . json_encode($section->getErrors()));
        }

        $saved = $entries->getSectionByHandle($handle);

        if (!$saved) {
            throw new RuntimeException('Vizy test section could not be reloaded.');
        }

        self::$section = $saved;

        return self::$section;
    }

    public static function paragraphDocument(string $text = 'Hello Vizy'): string
    {
        return Json::encode([
            'type' => 'doc',
            'attrs' => ['schemaVersion' => \verbb\vizy\document\VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [[
                'type' => 'paragraph',
                'content' => [
                    ['type' => 'text', 'text' => $text],
                ],
            ]],
        ]);
    }

    public static function entry(?string $title = null, ?string $documentJson = null): Entry
    {
        $section = self::section();
        $field = self::vizyField();
        $site = Craft::$app->getSites()->getPrimarySite();
        $entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0] ?? null;

        if (!$entryType) {
            throw new RuntimeException('Vizy test section has no entry types.');
        }

        $title ??= 'Vizy Test ' . ++self::$sequence;
        $documentJson ??= self::paragraphDocument($title);

        $entry = new Entry([
            'sectionId' => $section->id,
            'typeId' => $entryType->id,
            'siteId' => $site->id,
            'title' => $title,
            'slug' => StringHelper::toKebabCase($title),
            'enabled' => true,
        ]);
        $entry->setFieldValue($field->handle, $documentJson);

        if (!Craft::$app->getElements()->saveElement($entry)) {
            throw new RuntimeException('Failed saving Vizy test entry: ' . json_encode($entry->getErrors()));
        }

        return $entry;
    }

    public static function document(?string $documentJson = null, ?Entry $element = null): VizyDocument
    {
        $field = self::vizyField();
        $documentJson ??= self::paragraphDocument();
        $element ??= new Entry(['title' => 'Vizy Test']);

        return $field->normalizeValue($documentJson, $element);
    }

    /**
     * @return Site[]
     */
    public static function ensureSites(int $count = 2): array
    {
        Craft::$app->getSites()->refreshSites();
        Craft::$app->getIsMultiSite(true, true);
        $sites = Craft::$app->getSites()->getAllSites();

        if (count($sites) >= $count) {
            return array_slice($sites, 0, $count);
        }

        $group = Craft::$app->getSites()->getAllGroups()[0] ?? null;

        if (!$group) {
            throw new RuntimeException('No site group available for multisite fixtures.');
        }

        while (count($sites) < $count) {
            $index = count($sites) + 1;
            $handle = 'vizyTestSite' . $index . StringHelper::randomString(4);

            $site = new Site([
                'name' => 'Vizy Test Site ' . $index,
                'handle' => $handle,
                'groupId' => $group->id,
                'language' => 'en-US',
                'hasUrls' => true,
                'baseUrl' => "https://{$handle}.test",
            ]);

            if (!Craft::$app->getSites()->saveSite($site)) {
                throw new RuntimeException('Failed creating site: ' . json_encode($site->getErrors()));
            }

            Craft::$app->getSites()->refreshSites();
            Craft::$app->getIsMultiSite(true, true);
        $sites = Craft::$app->getSites()->getAllSites();
        }

        return array_slice($sites, 0, $count);
    }

    /**
     * Vizy field with one block type containing a Plain Text (optionally site-translated).
     *
     * @return array{field: VizyField, plainText: PlainText, blockTypeId: string, layoutUid: string, layoutElementUid: string}
     */
    public static function vizyFieldWithPlainTextBlock(
        string $translationMethod = Field::TRANSLATION_METHOD_NONE,
        string $innerTranslationMethod = Field::TRANSLATION_METHOD_SITE,
    ): array {
        $suffix = StringHelper::randomString(6);

        $plainText = new PlainText([
            'name' => 'Block Heading',
            'handle' => 'blockHeading' . $suffix,
            'translationMethod' => $innerTranslationMethod,
        ]);

        if (!Craft::$app->getFields()->saveField($plainText)) {
            throw new RuntimeException('Failed saving block Plain Text: ' . json_encode($plainText->getErrors()));
        }

        // Mid-request field creation: CustomFieldBehavior class is already loaded without this handle.
        // Register it so Element::setFieldValue works on ephemeral Block elements.
        \craft\behaviors\CustomFieldBehavior::$fieldHandles[$plainText->handle] = true;

        $layout = new FieldLayout(['type' => VizyBlockElement::class]);
        $layout->setTabs([
            new FieldLayoutTab([
                'layout' => $layout,
                'name' => 'Content',
                'elements' => [
                    [
                        'type' => CustomField::class,
                        'fieldUid' => $plainText->uid,
                    ],
                ],
            ]),
        ]);

        if (!Craft::$app->getFields()->saveLayout($layout)) {
            throw new RuntimeException('Failed saving block layout: ' . json_encode($layout->getErrors()));
        }

        $layout = Craft::$app->getFields()->getLayoutById($layout->id);
        $layoutElementUid = $layout->getCustomFieldElements()[0]->uid;
        $blockTypeId = 'type-' . $suffix;

        $field = new VizyField([
            'name' => 'Vizy Blocks ' . $suffix,
            'handle' => 'vizyBlocks' . $suffix,
            'editorMode' => VizyField::MODE_COMBINED,
            'translationMethod' => $translationMethod,
            'fieldData' => [
                [
                    'name' => 'Content',
                    'blockTypes' => [
                        [
                            'id' => $blockTypeId,
                            'name' => 'Card',
                            'handle' => 'card' . $suffix,
                            'enabled' => true,
                            'icon' => [
                                'label' => 'Square',
                                'value' => 'spike-square',
                                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"/></svg>',
                            ],
                            'layoutUid' => $layout->uid,
                            'layoutConfig' => $layout->getConfig(),
                        ],
                    ],
                ],
            ],
        ]);

        if (!Craft::$app->getFields()->saveField($field)) {
            throw new RuntimeException('Failed saving Vizy block field: ' . json_encode($field->getErrors()));
        }

        /** @var VizyField $saved */
        $saved = Craft::$app->getFields()->getFieldByHandle($field->handle);

        return [
            'field' => $saved,
            'plainText' => $plainText,
            'blockTypeId' => $blockTypeId,
            'layoutUid' => $layout->uid,
            'layoutElementUid' => $layoutElementUid,
        ];
    }

    public static function blockDocument(
        string $blockTypeId,
        string $layoutElementUid,
        string $heading,
        string $blockUid = 'block-uid-1',
    ): string {
        return Json::encode([
            [
                'type' => 'vizyBlock',
                'attrs' => [
                    'id' => $blockUid,
                    'enabled' => true,
                    'values' => [
                        'type' => $blockTypeId,
                        'content' => [
                            'fields' => [
                                $layoutElementUid => $heading,
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * Section with a Vizy field enabled on all sites.
     */
    public static function multisiteSection(VizyField $field, int $siteCount = 2, ?array $sites = null): Section
    {
        $sites ??= self::ensureSites($siteCount);
        $handle = 'vizyMulti' . StringHelper::randomString(5);

        $fieldLayout = new FieldLayout();
        $fieldLayout->setTabs([
            new FieldLayoutTab([
                'layout' => $fieldLayout,
                'name' => 'Content',
                'elements' => [
                    [
                        'type' => CustomField::class,
                        'fieldUid' => $field->uid,
                    ],
                ],
            ]),
        ]);

        $entryType = new EntryType([
            'name' => 'Vizy Multi',
            'handle' => 'vizyMulti' . StringHelper::randomString(4),
            'hasTitleField' => true,
        ]);
        $entryType->setFieldLayout($fieldLayout);

        if (!Craft::$app->getEntries()->saveEntryType($entryType)) {
            throw new RuntimeException('Failed creating multisite entry type: ' . json_encode($entryType->getErrors()));
        }

        $section = new Section([
            'name' => 'Vizy Multisite ' . $handle,
            'handle' => $handle,
            'type' => Section::TYPE_CHANNEL,
            'propagationMethod' => Section::PROPAGATION_METHOD_ALL,
            'enableVersioning' => false,
        ]);
        $section->setEntryTypes([$entryType]);
        $section->setSiteSettings(array_map(
            static fn(Site $site): Section_SiteSettings => new Section_SiteSettings([
                'siteId' => $site->id,
                'enabledByDefault' => true,
                'hasUrls' => true,
                'uriFormat' => $handle . '/{slug}',
                'template' => '',
            ]),
            $sites,
        ));

        if (!Craft::$app->getEntries()->saveSection($section)) {
            throw new RuntimeException('Failed creating multisite section: ' . json_encode($section->getErrors()));
        }

        $saved = Craft::$app->getEntries()->getSectionByHandle($handle);

        if (!$saved) {
            throw new RuntimeException('Multisite section could not be reloaded.');
        }

        return $saved;
    }

    public static function entryOnSite(
        Section $section,
        VizyField $field,
        Site $site,
        string $title,
        string $documentJson,
    ): Entry {
        $entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0] ?? null;

        if (!$entryType) {
            throw new RuntimeException('Section has no entry types.');
        }

        $entry = new Entry([
            'sectionId' => $section->id,
            'typeId' => $entryType->id,
            'siteId' => $site->id,
            'title' => $title,
            'slug' => StringHelper::toKebabCase($title) . '-' . StringHelper::randomString(4),
            'enabled' => true,
        ]);

        $value = $field->normalizeValue($documentJson, $entry);
        $entry->setFieldValue($field->handle, $value);

        if (!Craft::$app->getElements()->saveElement($entry)) {
            throw new RuntimeException('Failed saving multisite entry: ' . json_encode($entry->getErrors()));
        }

        return $entry;
    }

}
