<?php

declare(strict_types=1);

use craft\base\Element;
use craft\base\Field;
use craft\behaviors\CustomFieldBehavior;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\ElementHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentWalk;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

/**
 * Vizy field holding one Block Type with a site-translated Plain Text field,
 * in a section that propagates to two sites.
 *
 * @return array{field:VizyField,type:BlockType,placementUid:string,section:craft\models\Section,sites:array}
 */
function multisitePropagationSchema(
    bool $required = false,
    string $method = Field::TRANSLATION_METHOD_SITE,
    ?string $format = null,
): array
{
    $sites = VizyFixtureFactory::ensureSites(2);
    $suffix = StringHelper::randomString(6);

    $text = new PlainText([
        'name' => 'Localized text',
        'handle' => 'propagationText' . $suffix,
        'translationMethod' => Field::TRANSLATION_METHOD_SITE,
    ]);
    expect(Craft::$app->getFields()->saveField($text))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$text->handle] = true;

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [['type' => CustomField::class, 'fieldUid' => $text->uid]],
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Propagation ' . $suffix,
        'handle' => 'propagation' . $suffix,
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);

    $field = new VizyField([
        'name' => 'Propagation body',
        'handle' => 'propagationBody' . $suffix,
        'translationMethod' => $method,
        'translationKeyFormat' => $format,
        'blockTypePickerGroups' => [['name' => 'Root', 'blockTypeUids' => [$type->uid]]],
    ]);
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $field = Craft::$app->getFields()->getFieldByUid($field->uid);
    CustomFieldBehavior::$fieldHandles[$field->handle] = true;

    $section = VizyFixtureFactory::multisiteSection($field, 2, $sites);

    if ($required) {
        $entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
        $entryLayout = $entryType->getFieldLayout();
        $entryLayout->getCustomFieldElements()[0]->required = true;
        $entryType->setFieldLayout($entryLayout);
        expect(Craft::$app->getEntries()->saveEntryType($entryType))->toBeTrue();
    }

    return [
        'field' => $field,
        'type' => $type,
        'placementUid' => $type->getFieldLayout()->getCustomFieldElements()[0]->uid,
        'section' => $section,
        'sites' => $sites,
    ];
}

function multisitePropagationDocument(array $schema, string $text): string
{
    return Json::encode([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [
            ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => "{$text} paragraph"]]],
            [
                'type' => 'vizyBlock',
                'attrs' => [
                    'blockUid' => 'propagated-block',
                    'blockTypeUid' => $schema['type']->uid,
                    'enabled' => true,
                    'fieldSlots' => [$schema['placementUid'] => "{$text} block"],
                ],
            ],
        ],
    ]);
}

/**
 * Starts a new entry the way the control panel does: an unpublished draft
 * saved to every site before the author adds any content.
 */
function multisitePropagationNewDraft(array $schema): Entry
{
    $entry = new Entry([
        'sectionId' => $schema['section']->id,
        'typeId' => Craft::$app->getEntries()->getEntryTypesBySectionId($schema['section']->id)[0]->id,
        'siteId' => $schema['sites'][0]->id,
        'slug' => ElementHelper::tempSlug(),
    ]);
    $saved = Craft::$app->getDrafts()->saveElementAsDraft($entry, AssetSpikeFixture::ensureAdminUser()->id, markAsSaved: false);
    if (!$saved) {
        throw new RuntimeException('Draft failed: ' . json_encode($entry->getErrors()));
    }

    return Entry::find()->id($entry->id)->drafts()->siteId($schema['sites'][0]->id)->status(null)->one();
}

function multisitePropagationText(array $schema, int $entryId, int $siteId, bool $draft = false): array
{
    $query = Entry::find()->id($entryId)->siteId($siteId)->status(null);

    if ($draft) {
        $query->drafts();
    }

    $document = $query->one()->getFieldValue($schema['field']->handle);

    return [
        $document->toArray()['content'][0]['content'][0]['text'] ?? null,
        $document->findBlock('propagated-block')?->rawFieldValue($schema['placementUid']),
    ];
}

it('copies the field to every site when a fresh entry is created', function(string $method, ?string $format) {
    $schema = multisitePropagationSchema(method: $method, format: $format);
    [$siteA, $siteB] = $schema['sites'];
    $draft = multisitePropagationNewDraft($schema);

    // Each autosave of a fresh entry copies the latest content, so the other
    // site doesn't keep values from an earlier autosave.
    foreach (['First', 'English'] as $text) {
        $draft->title = 'Fresh propagation';
        $draft->setFieldValue($schema['field']->handle, multisitePropagationDocument($schema, $text));
        $draft->setIsFresh();
        $draft->propagateAll = true;
        expect(Craft::$app->getElements()->saveElement($draft, false))->toBeTrue();
        expect(multisitePropagationText($schema, $draft->id, $siteB->id, true))->toBe(["{$text} paragraph", "{$text} block"]);
    }

    $draft->propagateRequired = true;
    $draft->setScenario(Element::SCENARIO_LIVE);
    expect(Craft::$app->getElements()->saveElement($draft, crossSiteValidate: true))->toBeTrue();
    $draft->propagateRequired = false;
    $entry = Craft::$app->getDrafts()->applyDraft($draft);

    expect(multisitePropagationText($schema, $entry->id, $siteA->id))->toBe(['English paragraph', 'English block'])
        ->and(multisitePropagationText($schema, $entry->id, $siteB->id))->toBe(['English paragraph', 'English block']);

    // Once the entry exists, a site in another translation partition keeps its
    // own content, even when Craft propagates every field. A shared partition
    // takes the new structure but keeps its own translated block values.
    $target = Entry::find()->id($entry->id)->siteId($siteB->id)->status(null)->one();
    $target->setFieldValue($schema['field']->handle, multisitePropagationDocument($schema, 'French'));
    expect(Craft::$app->getElements()->saveElement($target, false, false))->toBeTrue();

    $source = Entry::find()->id($entry->id)->siteId($siteA->id)->status(null)->one();
    $source->setFieldValue($schema['field']->handle, multisitePropagationDocument($schema, 'Updated'));
    $source->propagateAll = true;
    $shared = $schema['field']->getTranslationKey($source) === $schema['field']->getTranslationKey($target);
    expect(Craft::$app->getElements()->saveElement($source, false))->toBeTrue()
        ->and(multisitePropagationText($schema, $entry->id, $siteB->id))->toBe([$shared ? 'Updated paragraph' : 'French paragraph', 'French block']);
})->with([
    'site' => [Field::TRANSLATION_METHOD_SITE, null],
    'not translatable' => [Field::TRANSLATION_METHOD_NONE, null],
    'language' => [Field::TRANSLATION_METHOD_LANGUAGE, null],
    'site group' => [Field::TRANSLATION_METHOD_SITE_GROUP, null],
    'custom' => [Field::TRANSLATION_METHOD_CUSTOM, '{site.handle}'],
]);

it('fills an empty required site-translated field on other sites when an entry is created', function() {
    $schema = multisitePropagationSchema(required: true);
    [$siteA, $siteB] = $schema['sites'];
    $draft = multisitePropagationNewDraft($schema);

    // Without `fresh`, Craft only propagates required values that are empty
    // on the other site, and validates every site before creating the entry.
    $draft->title = 'Required propagation';
    $draft->setFieldValue($schema['field']->handle, multisitePropagationDocument($schema, 'English'));
    $draft->propagateRequired = true;
    $draft->setScenario(Element::SCENARIO_LIVE);
    expect(Craft::$app->getElements()->saveElement($draft, crossSiteValidate: true))->toBeTrue();
    $draft->propagateRequired = false;
    $entry = Craft::$app->getDrafts()->applyDraft($draft);

    expect(multisitePropagationText($schema, $entry->id, $siteB->id))->toBe(['English paragraph', 'English block']);
});

it('copies Matrix rows inside blocks to every site when a fresh entry is created', function(bool $hosted) {
    [$siteA, $siteB] = VizyFixtureFactory::ensureSites(2);
    $f = new MatrixSupportFixture();
    $block = $f->block('matrix-block', $f->payload(['English row']));
    $content = $hosted ? [$f->hostedBlock('host-block', [$block])] : [$block];

    $entry = new Entry([
        'sectionId' => $f->owner->sectionId,
        'typeId' => $f->owner->typeId,
        'siteId' => $siteA->id,
        'slug' => ElementHelper::tempSlug(),
    ]);
    expect(Craft::$app->getDrafts()->saveElementAsDraft($entry, AssetSpikeFixture::ensureAdminUser()->id, markAsSaved: false))->toBeTrue();
    $draft = Entry::find()->id($entry->id)->drafts()->siteId($siteA->id)->status(null)->one();
    $draft->title = 'Fresh Matrix propagation';
    $draft->setFieldValue($f->field->handle, ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $content]);
    $draft->setIsFresh();
    $draft->propagateAll = true;
    $draft->propagateRequired = true;
    $draft->setScenario(Element::SCENARIO_LIVE);
    expect(Craft::$app->getElements()->saveElement($draft, crossSiteValidate: true))->toBeTrue();
    $draft->propagateRequired = false;
    $entry = Craft::$app->getDrafts()->applyDraft($draft);

    $rows = static function(int $siteId) use ($f, $entry): array {
        $owner = Entry::find()->id($entry->id)->siteId($siteId)->status(null)->one();
        $blocks = iterator_to_array(DocumentWalk::blocks($owner->getFieldValue($f->field->handle)), false);
        $matches = array_values(array_filter($blocks, static fn($block) => $block->uid() === 'matrix-block'));
        expect($matches)->toHaveCount(1);

        return $matches[0]->document()->blockElement($matches[0])->getFieldValue($f->matrix->handle)->status(null)->all();
    };
    $text = static fn(array $rows) => array_map(static fn(Entry $row) => $row->getFieldValue($f->text->handle), $rows);

    expect($text($rows($siteA->id)))->toBe(['English row'])
        ->and($text($rows($siteB->id)))->toBe(['English row']);

    // The rows' own text is site-translated, so a translation stays on its site.
    $row = $rows($siteB->id)[0];
    $row->setFieldValue($f->text->handle, 'French row');
    expect(Craft::$app->getElements()->saveElement($row))->toBeTrue();

    $source = Entry::find()->id($entry->id)->siteId($siteA->id)->status(null)->one();
    expect(Craft::$app->getElements()->saveElement($source))->toBeTrue()
        ->and($text($rows($siteA->id)))->toBe(['English row'])
        ->and($text($rows($siteB->id)))->toBe(['French row']);
})->with([
    'in a block' => [false],
    'in a nested Vizy field' => [true],
]);
