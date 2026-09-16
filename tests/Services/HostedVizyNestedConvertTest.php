<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use ReflectionMethod;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\document\DocumentSerializer;
use verbb\vizy\document\InvalidDocumentException;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\HostedVizy;
use verbb\vizy\Vizy;

/**
 * §3.2 Nested Vizy allow + runtime convert — V3 nested slots become Hosted
 * canonical document objects on hydrate/serialize; depth/auth stay Entry-rooted.
 */

/**
 * @return array{
 *   nestedField: VizyField,
 *   nestedPlacement: CustomField,
 *   blockType: BlockType,
 *   rootField: VizyField,
 *   owner: Entry,
 * }
 */
function nestedHostedFixture(string $suffix): array
{
    $nestedField = new VizyField([
        'name' => 'Nested Body',
        'handle' => 'nestedBody' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    // Rich-text-only nested field: empty schemaMap is valid V3 prose provenance.
    Vizy::$plugin->getLegacySchemaMaps()->saveProvenance($nestedField->uid, [
        'fieldUid' => $nestedField->uid,
        'schemaMap' => [],
        'sourceFingerprint' => 'nested-hosted-' . $suffix,
        'canonicalFieldSettings' => [
            'rootContentType' => VizyField::ROOT_CONTENT_RICH,
            'blockTypePickerGroups' => [],
        ],
        'uidMapping' => [],
    ]);

    $blockType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Card',
        'handle' => 'card' . $suffix,
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $nestedPlacement = new CustomField($nestedField);
    $nestedPlacement->uid = StringHelper::UUID();
    $tab->setElements([$nestedPlacement]);
    $layout->setTabs([$tab]);
    $blockType->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($blockType))->toBeTrue();

    $rootField = new VizyField([
        'name' => 'Body',
        'handle' => 'bodyNested' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$blockType->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($rootField))->toBeTrue();

    $owner = VizyFixtureFactory::entry("Nested Hosted {$suffix}");

    // Place the Entry Vizy on this owner's layout so Hosted auth can resolve it.
    $entryType = $owner->getType();
    $entryLayout = $entryType->getFieldLayout() ?? new FieldLayout(['type' => Entry::class]);
    $entryTabs = $entryLayout->getTabs();
    $entryTab = $entryTabs[0] ?? new FieldLayoutTab(['name' => 'Content', 'layout' => $entryLayout]);
    $elements = $entryTab->getElements();
    $rootPlacement = new CustomField($rootField);
    $rootPlacement->uid = StringHelper::UUID();
    $elements[] = $rootPlacement;
    $entryTab->setElements($elements);
    if ($entryTabs === []) {
        $entryLayout->setTabs([$entryTab]);
    } else {
        $entryTabs[0] = $entryTab;
        $entryLayout->setTabs($entryTabs);
    }
    $entryType->setFieldLayout($entryLayout);
    expect(Craft::$app->getEntries()->saveEntryType($entryType))->toBeTrue();
    $owner = Craft::$app->getElements()->getElementById($owner->id, Entry::class, $owner->siteId);

    return compact('nestedField', 'nestedPlacement', 'blockType', 'rootField', 'owner');
}

it('serializes V3 nested bare lists into Hosted canonical document objects', function(mixed $nestedPayload) {
    $suffix = StringHelper::randomString(6);
    $fixture = nestedHostedFixture($suffix);
    $blockUid = StringHelper::UUID();

    $outer = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $blockUid,
                'blockTypeUid' => $fixture['blockType']->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $fixture['nestedPlacement']->uid => $nestedPayload,
                ],
            ],
            'content' => [],
        ]],
    ];

    $document = Vizy::$plugin->getDocuments()->normalizeValue(
        $outer,
        $fixture['owner'],
        $fixture['rootField'],
    );

    // Outer normalize leaves nested raw until Hosted hydrate (pass-through).
    $rawSlot = $document->findBlock($blockUid)->rawFieldValue($fixture['nestedPlacement']->uid);
    expect($rawSlot)->toEqual($nestedPayload);

    $serialized = (new DocumentSerializer())->serialize($document);
    $slot = $serialized['content'][0]['attrs']['fieldSlots'][$fixture['nestedPlacement']->uid] ?? null;

    expect($slot)->toBeArray()
        ->and($slot['type'] ?? null)->toBe('doc')
        ->and($slot['attrs']['schemaVersion'] ?? null)->toBe(VizyDocument::CURRENT_SCHEMA_VERSION)
        ->and(json_encode($slot))->toContain('Inner V3');
})->with([
    'bare node list' => [[
        ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Inner V3']]],
    ]],
    'JSON-encoded node list' => [json_encode([
        ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Inner V3']]],
    ])],
]);

it('fail-closes V3 nested lists when the nested field has no promotion provenance', function() {
    $suffix = StringHelper::randomString(6);
    $nestedField = new VizyField([
        'name' => 'Orphan Nested',
        'handle' => 'orphanNested' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_RICH,
    ]);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();
    // Intentionally no saveProvenance.

    $blockType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Orphan Card',
        'handle' => 'orphanCard' . $suffix,
    ]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $nestedPlacement = new CustomField($nestedField);
    $nestedPlacement->uid = StringHelper::UUID();
    $tab->setElements([$nestedPlacement]);
    $layout->setTabs([$tab]);
    $blockType->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($blockType))->toBeTrue();

    $rootField = new VizyField([
        'name' => 'Body',
        'handle' => 'bodyOrphan' . $suffix,
        'editorConfig' => 'standard',
        'blockTypePickerGroups' => [
            ['name' => 'Content', 'blockTypeUids' => [$blockType->uid]],
        ],
    ]);
    expect(Craft::$app->getFields()->saveField($rootField))->toBeTrue();
    $owner = VizyFixtureFactory::entry("Orphan nested {$suffix}");

    $outer = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => StringHelper::UUID(),
                'blockTypeUid' => $blockType->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $nestedPlacement->uid => [
                        ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Nope']]],
                    ],
                ],
            ],
            'content' => [],
        ]],
    ];

    $document = Vizy::$plugin->getDocuments()->normalizeValue($outer, $owner, $rootField);

    expect(fn() => (new DocumentSerializer())->serialize($document))
        ->toThrow(InvalidDocumentException::class);
});

it('renders Hosted input for a converted nested V3 slot with Entry-rooted depth and auth', function() {
    $suffix = StringHelper::randomString(6);
    $fixture = nestedHostedFixture($suffix);
    $blockUid = StringHelper::UUID();

    $outer = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $blockUid,
                'blockTypeUid' => $fixture['blockType']->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $fixture['nestedPlacement']->uid => [
                        ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Hosted V3']]],
                    ],
                ],
            ],
            'content' => [],
        ]],
    ];

    $document = Vizy::$plugin->getDocuments()->normalizeValue(
        $outer,
        $fixture['owner'],
        $fixture['rootField'],
    );
    $block = $document->findBlock($blockUid);
    $blockElement = $document->blockElement($block);
    $nestedValue = $blockElement->getFieldValue($fixture['nestedField']->handle);
    expect($nestedValue)->toBeInstanceOf(VizyDocument::class)
        ->and($nestedValue->toArray()['content'][0]['content'][0]['text'] ?? null)->toBe('Hosted V3');

    HostedVizy::setRenderingDepth(0);
    HostedVizy::setEntryFieldUid($fixture['rootField']->uid);
    expect(HostedVizy::nextDepth())->toBe(1)
        ->and(HostedVizy::allowsDepth(1))->toBeTrue();

    WebControllerHarness::beginWebRequest();
    try {
        $method = new ReflectionMethod($fixture['nestedField'], '_hostedInputHtml');
        $method->setAccessible(true);
        $html = $method->invoke($fixture['nestedField'], $nestedValue, $blockElement);
    } finally {
        WebControllerHarness::endWebRequest();
        HostedVizy::setRenderingDepth(0);
        HostedVizy::setEntryFieldUid(null);
    }

    expect($html)->toContain('data-vizy-hosted')
        ->and($html)->toContain('data-vizy-document')
        ->and($html)->toContain('Hosted V3')
        ->and($html)->toContain('"depth":1')
        ->and($html)->toContain('"entryFieldUid":"' . $fixture['rootField']->uid . '"')
        ->and($html)->toContain('"nestedFieldUid":"' . $fixture['nestedField']->uid . '"')
        ->and($html)->not->toContain('cannot nest further');
});

it('refuses Hosted render past max nesting depth', function() {
    $suffix = StringHelper::randomString(6);
    $fixture = nestedHostedFixture($suffix);
    $blockUid = StringHelper::UUID();
    $nestedDoc = Vizy::$plugin->getDocuments()->normalizeValue(
        [
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => [
                ['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Deep']]],
            ],
        ],
        $fixture['owner'],
        $fixture['nestedField'],
    );

    $outer = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $blockUid,
                'blockTypeUid' => $fixture['blockType']->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $fixture['nestedPlacement']->uid => $nestedDoc->toArray(),
                ],
            ],
            'content' => [],
        ]],
    ];
    $document = Vizy::$plugin->getDocuments()->normalizeValue(
        $outer,
        $fixture['owner'],
        $fixture['rootField'],
    );
    $blockElement = $document->blockElement($document->findBlock($blockUid));

    HostedVizy::setRenderingDepth(HostedVizy::MAX_DEPTH);
    HostedVizy::setEntryFieldUid($fixture['rootField']->uid);
    expect(HostedVizy::allowsDepth(HostedVizy::nextDepth()))->toBeFalse();

    WebControllerHarness::beginWebRequest();
    try {
        $method = new ReflectionMethod($fixture['nestedField'], '_hostedInputHtml');
        $method->setAccessible(true);
        $html = $method->invoke(
            $fixture['nestedField'],
            $blockElement->getFieldValue($fixture['nestedField']->handle),
            $blockElement,
        );
    } finally {
        WebControllerHarness::endWebRequest();
        HostedVizy::setRenderingDepth(0);
        HostedVizy::setEntryFieldUid(null);
    }

    expect($html)->toContain('cannot nest further')
        ->and($html)->toContain((string)HostedVizy::MAX_DEPTH)
        ->and($html)->not->toContain('data-vizy-hosted');
});
