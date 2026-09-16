<?php

declare(strict_types=1);

/**
 * Astra Wave 1 — security & ownership (A02, A03, A09).
 *
 * A01 attribute-name emit coverage lives in RenderSecurityGateTest.
 */

use craft\base\Element;
use craft\behaviors\CustomFieldBehavior;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\PlainText;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\GqlSchema;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\gql\GqlElementAccess;
use verbb\vizy\gql\GqlMark;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

it('resolves Matrix anchors by ownership tuple and rejects foreign UIDs', function() {
    $suffix = StringHelper::randomString(6);

    $ownerA = VizyFixtureFactory::entry("Anchor owner A {$suffix}");
    $ownerB = VizyFixtureFactory::entry("Anchor owner B {$suffix}");

    $vizyA = new VizyField([
        'name' => 'Body A',
        'handle' => 'bodyAnchorA' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
    ]);
    $vizyB = new VizyField([
        'name' => 'Body B',
        'handle' => 'bodyAnchorB' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
    ]);
    expect(Craft::$app->getFields()->saveField($vizyA))->toBeTrue()
        ->and(Craft::$app->getFields()->saveField($vizyB))->toBeTrue();

    $blockUidA = StringHelper::UUID();
    $blockUidB = StringHelper::UUID();
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);

    $anchorA = Vizy::$plugin->getAnchors()->ensureAnchor($ownerA, $vizyA, $blockUidA, $layout, null);
    $anchorB = Vizy::$plugin->getAnchors()->ensureAnchor($ownerB, $vizyB, $blockUidB, $layout, null);
    expect($anchorA)->toBeInstanceOf(MatrixAnchor::class)
        ->and($anchorB)->toBeInstanceOf(MatrixAnchor::class)
        ->and($anchorA->uid)->not->toBe($anchorB->uid);

    $anchors = Vizy::$plugin->getAnchors();

    // Matching ownership + UID.
    expect($anchors->getAnchor($ownerA, $vizyA, $blockUidA, $anchorA->uid)?->id)->toBe($anchorA->id);

    // Ownership without UID still resolves.
    expect($anchors->getAnchor($ownerA, $vizyA, $blockUidA, null)?->id)->toBe($anchorA->id);

    // Foreign UID must not retarget — fail closed even when the UID exists.
    expect($anchors->getAnchor($ownerA, $vizyA, $blockUidA, $anchorB->uid))->toBeNull();

    // UID alone on the wrong owner/field/block never resolves.
    expect($anchors->getAnchor($ownerB, $vizyB, $blockUidB, $anchorA->uid))->toBeNull()
        ->and($anchors->getAnchor($ownerA, $vizyB, $blockUidA, $anchorA->uid))->toBeNull()
        ->and($anchors->getAnchor($ownerA, $vizyA, $blockUidB, $anchorA->uid))->toBeNull();

    // ensureAnchor still finds the ownership row when the client UID is stale/forged.
    $ensured = $anchors->ensureAnchor($ownerA, $vizyA, $blockUidA, $layout, $anchorB->uid);
    expect($ensured?->id)->toBe($anchorA->id);
});

it('rejects unauthorized and invalid Blocks inside layout columns like root Blocks', function() {
    $suffix = StringHelper::randomString(6);

    $plain = new PlainText([
        'name' => 'Heading',
        'handle' => 'headingLayout' . $suffix,
    ]);
    expect(Craft::$app->getFields()->saveField($plain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$plain->handle] = true;

    $allowed = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Allowed',
        'handle' => 'allowed' . $suffix,
    ]);
    $allowedLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $allowedLayout]);
    $placement = new CustomField($plain);
    $placement->uid = StringHelper::UUID();
    $placement->required = true;
    $tab->setElements([$placement]);
    $allowedLayout->setTabs([$tab]);
    $allowed->setFieldLayout($allowedLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($allowed))->toBeTrue();

    $forbiddenUid = StringHelper::UUID();
    $forbidden = new BlockType([
        'uid' => $forbiddenUid,
        'name' => 'Forbidden',
        'handle' => 'forbidden' . $suffix,
    ]);
    $forbiddenLayout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $forbiddenLayout->setTabs([]);
    $forbidden->setFieldLayout($forbiddenLayout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($forbidden))->toBeTrue();

    $field = new VizyField([
        'name' => 'Body',
        'handle' => 'bodyLayoutVal' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$allowed->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$field->handle] = true;

    // Attach to the test section Entry Type so getFieldValue can resolve the handle.
    $section = VizyFixtureFactory::section();
    $entryType = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
    $ownerLayout = $entryType->getFieldLayout() ?? new FieldLayout(['type' => Entry::class]);
    $ownerTabs = $ownerLayout->getTabs();
    $ownerTab = $ownerTabs[0] ?? new FieldLayoutTab(['name' => 'Content', 'layout' => $ownerLayout]);
    $ownerElements = $ownerTab->getElements();
    $ownerPlacement = new CustomField($field);
    $ownerPlacement->uid = StringHelper::UUID();
    $ownerElements[] = $ownerPlacement;
    $ownerTab->setElements($ownerElements);
    if ($ownerTabs === []) {
        $ownerLayout->setTabs([$ownerTab]);
    } else {
        $ownerTabs[0] = $ownerTab;
        $ownerLayout->setTabs($ownerTabs);
    }
    $entryType->setFieldLayout($ownerLayout);
    expect(Craft::$app->getEntries()->saveEntryType($entryType))->toBeTrue();

    $owner = VizyFixtureFactory::entry("Layout validate {$suffix}");

    $layoutBlock = static function(string $blockTypeUid, string $blockUid, array $fieldSlots = []): array {
        return [
            'type' => 'layout',
            'attrs' => [
                'layoutUid' => StringHelper::UUID(),
                'stack' => 'small',
            ],
            'content' => [
                [
                    'type' => 'column',
                    'attrs' => [
                        'columnUid' => StringHelper::UUID(),
                        'span' => 6,
                    ],
                    'content' => [[
                        'type' => 'vizyBlock',
                        'attrs' => [
                            'blockUid' => $blockUid,
                            'blockTypeUid' => $blockTypeUid,
                            'enabled' => true,
                            'fieldSlots' => $fieldSlots,
                        ],
                    ]],
                ],
                [
                    'type' => 'column',
                    'attrs' => [
                        'columnUid' => StringHelper::UUID(),
                        'span' => 6,
                    ],
                    'content' => [],
                ],
            ],
        ];
    };

    // Unauthorized Block Type inside a column — same rejection as root would get.
    $badTypeDoc = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [$layoutBlock($forbiddenUid, StringHelper::UUID())],
    ], $owner, $field);
    $owner->setFieldValue($field->handle, $badTypeDoc);
    $owner->setScenario(Element::SCENARIO_LIVE);
    $field->validateBlocks($owner);
    expect($owner->getErrors($field->handle))->not->toBeEmpty()
        ->and(implode(' ', $owner->getErrors($field->handle)))->toContain($forbiddenUid);

    // Missing required Craft field inside a column Block.
    $owner->clearErrors();
    $missingRequired = (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [$layoutBlock($allowed->uid, StringHelper::UUID(), [])],
    ], $owner, $field);
    $owner->setFieldValue($field->handle, $missingRequired);
    $field->validateBlocks($owner);
    $errorKeys = array_keys($owner->getErrors());
    expect($errorKeys)->not->toBeEmpty()
        ->and(implode(' ', $errorKeys))->toContain($field->handle);
})->group('slow');

it('withholds GraphQL element and URL convenience outside the active schema scope', function() {
    $suffix = StringHelper::randomString(6);
    $entry = VizyFixtureFactory::entry("Gql scope {$suffix}");
    $section = $entry->getSection();
    expect($section)->not->toBeNull();

    $mark = GqlMark::fromRaw([
        'type' => 'link',
        'attrs' => [
            'type' => 'entry',
            'targetUid' => $entry->uid,
            'siteMode' => 'current',
        ],
    ]);

    // No active schema — fail closed for GQL convenience.
    Craft::$app->getGql()->setActiveSchema(null);
    expect(GqlElementAccess::hasActiveSchema())->toBeFalse()
        ->and($mark->linkElement($entry->siteId))->toBeNull()
        ->and($mark->linkUrl($entry->siteId))->toBeNull();

    // Schema that can read the entry's section.
    $allowed = new GqlSchema([
        'name' => 'Vizy Astra Allowed ' . $suffix,
        'scope' => [
            'sections.' . $section->uid . ':read',
            'sites.' . Craft::$app->getSites()->getSiteById($entry->siteId)->uid . ':read',
        ],
    ]);
    Craft::$app->getGql()->setActiveSchema($allowed);
    expect(GqlElementAccess::allowsElement($entry))->toBeTrue()
        ->and($mark->linkElement($entry->siteId)?->id)->toBe($entry->id)
        ->and($mark->linkUrl($entry->siteId))->not->toBeNull();

    // Schema with a different section UID — no disclosure.
    $denied = new GqlSchema([
        'name' => 'Vizy Astra Denied ' . $suffix,
        'scope' => [
            'sections.' . StringHelper::UUID() . ':read',
        ],
    ]);
    Craft::$app->getGql()->setActiveSchema($denied);
    expect(GqlElementAccess::allowsElement($entry))->toBeFalse()
        ->and($mark->linkElement($entry->siteId))->toBeNull()
        ->and($mark->linkUrl($entry->siteId))->toBeNull();

    // Scalar URL links still resolve (no element disclosure).
    $urlMark = GqlMark::fromRaw([
        'type' => 'link',
        'attrs' => [
            'type' => 'url',
            'value' => 'https://example.com/ok',
            'siteMode' => 'current',
        ],
    ]);
    expect($urlMark->linkUrl())->toBe('https://example.com/ok');

    Craft::$app->getGql()->setActiveSchema(null);
});


it('withholds unpublished GraphQL targets even within an allowed section', function() {
    $entry = VizyFixtureFactory::entry('GraphQL publication gate');
    Craft::$app->getGql()->setActiveSchema(new GqlSchema([
        'name' => 'Publication gate',
        'scope' => [
            'sections.' . $entry->getSection()->uid . ':read',
            'sites.' . Craft::$app->getSites()->getSiteById($entry->siteId)->uid . ':read',
        ],
    ]));
    try {
        $mark = GqlMark::fromRaw(['type' => 'link', 'attrs' => [
            'type' => 'entry', 'targetUid' => $entry->uid, 'siteMode' => 'current',
        ]]);
        $query = new \GraphQL\Type\Definition\ObjectType([
            'name' => 'AstraPublicationQuery',
            'fields' => ['mark' => [
                'type' => \verbb\vizy\gql\types\generators\VizyMarkGenerator::generateType('link'),
                'resolve' => static fn() => $mark,
            ]],
        ]);
        $schema = new \GraphQL\Type\Schema(['query' => $query]);
        $execute = static fn() => \GraphQL\GraphQL::executeQuery(
            $schema, '{ mark { url } }', null, ['siteId' => $entry->siteId],
        )->toArray();
        expect($mark->linkElement($entry->siteId)?->id)->toBe($entry->id)
            ->and($execute())->toBe(['data' => ['mark' => ['url' => $entry->getUrl()]]]);

        // A section grant without the target site is insufficient.
        $allowedSchema = Craft::$app->getGql()->getActiveSchema();
        Craft::$app->getGql()->setActiveSchema(new GqlSchema([
            'name' => 'Wrong site', 'scope' => ['sections.' . $entry->getSection()->uid . ':read'],
        ]));
        expect($execute())->toBe(['data' => ['mark' => ['url' => null]]]);
        Craft::$app->getGql()->setActiveSchema($allowedSchema);

        $draft = Craft::$app->getDrafts()->createDraft($entry);
        expect(GqlElementAccess::elementByUid($draft->uid, Entry::class, $entry->siteId))->toBeNull();
        $entry->enabled = false;
        expect(Craft::$app->getElements()->saveElement($entry))->toBeTrue();
        expect($mark->linkElement($entry->siteId))->toBeNull()
            ->and($mark->linkUrl($entry->siteId))->toBeNull()
            ->and(GqlElementAccess::allowsElement($entry))->toBeFalse()
            ->and($execute())->toBe(['data' => ['mark' => ['url' => null]]]);

        $entry->enabled = true;
        $entry->postDate = new \DateTime('+1 day');
        expect(Craft::$app->getElements()->saveElement($entry))->toBeTrue();
        expect($execute())->toBe(['data' => ['mark' => ['url' => null]]]);
        $entry->postDate = new \DateTime('-2 days');
        $entry->expiryDate = new \DateTime('-1 day');
        expect(Craft::$app->getElements()->saveElement($entry))->toBeTrue();
        expect($execute())->toBe(['data' => ['mark' => ['url' => null]]]);
    } finally {
        Craft::$app->getGql()->setActiveSchema(null);
    }
});
