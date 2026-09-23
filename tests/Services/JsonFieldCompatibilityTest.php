<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\db\Query;
use craft\db\Table;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Json as JsonField;
use craft\fields\PlainText;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

/**
 * @return array{
 *   json: JsonField,
 *   plain: PlainText,
 *   field: VizyField,
 *   blockType: BlockType,
 *   jsonPlacement: string,
 *   plainPlacement: string,
 *   owner: Entry,
 *   blockUid: string,
 * }
 */
function jsonFieldCompatibilityFixture(array $jsonValue, string $plainValue): array
{
    $suffix = StringHelper::randomString(8);
    $json = new JsonField(['name' => 'Structured JSON', 'handle' => 'structuredJson' . $suffix]);
    $plain = new PlainText([
        'name' => 'JSON-looking text',
        'handle' => 'jsonText' . $suffix,
        'multiline' => true,
    ]);
    expect(Craft::$app->getFields()->saveField($json))->toBeTrue()
        ->and(Craft::$app->getFields()->saveField($plain))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$json->handle] = true;
    CustomFieldBehavior::$fieldHandles[$plain->handle] = true;

    $jsonPlacement = new CustomField($json);
    $jsonPlacement->uid = StringHelper::UUID();
    $plainPlacement = new CustomField($plain);
    $plainPlacement->uid = StringHelper::UUID();
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab([
        'uid' => StringHelper::UUID(),
        'layout' => $layout,
        'name' => 'Content',
        'elements' => [$jsonPlacement, $plainPlacement],
    ])]);
    $blockType = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'JSON values',
        'handle' => 'jsonValues' . $suffix,
    ]);
    $blockType->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($blockType))->toBeTrue();

    $field = new VizyField([
        'name' => 'JSON article',
        'handle' => 'jsonArticle' . $suffix,
        'editorConfig' => 'standard',
        'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS,
        'blockTypePickerGroups' => [[
            'name' => 'Content',
            'blockTypeUids' => [$blockType->uid],
        ]],
    ]);
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $section = VizyFixtureFactory::multisiteSection($field, 1);
    $blockUid = StringHelper::UUID();
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $blockUid,
                'blockTypeUid' => $blockType->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $jsonPlacement->uid => $jsonValue,
                    $plainPlacement->uid => $plainValue,
                ],
            ],
        ]],
    ];
    $owner = VizyFixtureFactory::entryOnSite(
        $section,
        $field,
        Craft::$app->getSites()->getPrimarySite(),
        'JSON compatibility ' . $suffix,
        Json::encode($document),
    );

    return [
        'json' => $json,
        'plain' => $plain,
        'field' => $field,
        'blockType' => $blockType,
        'jsonPlacement' => $jsonPlacement->uid,
        'plainPlacement' => $plainPlacement->uid,
        'owner' => $owner,
        'blockUid' => $blockUid,
    ];
}

/**
 * @return array{json:mixed,plain:mixed,blockUid:string}
 */
function jsonFieldCompatibilityValues(array $fixture, Entry $owner): array
{
    $owner = Entry::find()
        ->id($owner->id)
        ->siteId($owner->siteId)
        ->status(null)
        ->drafts(null)
        ->provisionalDrafts(null)
        ->one();
    expect($owner)->toBeInstanceOf(Entry::class);
    $document = $owner->getFieldValue($fixture['field']->handle);
    expect($document)->toBeInstanceOf(VizyDocument::class);
    $block = $document->blocks()[0];
    $element = $document->blockElement($block);

    return [
        'json' => $fixture['json']->serializeValue(
            $element->getFieldValue($fixture['json']->handle),
            $element,
        ),
        'plain' => $element->getFieldValue($fixture['plain']->handle),
        'blockUid' => $block->uid(),
    ];
}

it('preserves JSON fields and JSON-looking Plain Text through saves copies and drafts', function() {
    $jsonValue = [
        'enabled' => true,
        'count' => 2,
        'nested' => ['colors' => ['red', 'blue'], 'literal' => '{"kept":"string"}'],
        'empty' => null,
    ];
    $plainValue = '{"nested":{"count":2},"list":["red","blue"],"enabled":true}';
    $fixture = jsonFieldCompatibilityFixture($jsonValue, $plainValue);

    $saved = jsonFieldCompatibilityValues($fixture, $fixture['owner']);
    expect($saved['json'])->toBe($jsonValue)
        ->and($saved['plain'])->toBe($plainValue)
        ->and($saved['blockUid'])->toBe($fixture['blockUid']);

    $copy = Craft::$app->getElements()->duplicateElement($fixture['owner'], ['title' => 'JSON compatibility copy']);
    $copied = jsonFieldCompatibilityValues($fixture, $copy);
    expect($copied['json'])->toBe($jsonValue)
        ->and($copied['plain'])->toBe($plainValue)
        ->and($copied['blockUid'])->not->toBe($fixture['blockUid']);

    $draft = Craft::$app->getDrafts()->createDraft($fixture['owner']);
    $document = $draft->getFieldValue($fixture['field']->handle);
    $draftJson = ['draft' => true, 'items' => [['id' => 1], ['id' => 2]]];
    $draftPlain = '[{"draft":true},{"still":"text"}]';
    $draftRaw = $document->toArray();
    $draftRaw['content'][0]['attrs']['fieldSlots'][$fixture['jsonPlacement']] = $draftJson;
    $draftRaw['content'][0]['attrs']['fieldSlots'][$fixture['plainPlacement']] = $draftPlain;
    $draft->setFieldValue($fixture['field']->handle, $draftRaw);
    expect(Craft::$app->getElements()->saveElement($draft))->toBeTrue(Json::encode($draft->getErrors()));

    $draft = Entry::find()->id($draft->id)->siteId($draft->siteId)->drafts(true)->status(null)->one();
    $draftValues = jsonFieldCompatibilityValues($fixture, $draft);
    $canonicalValues = jsonFieldCompatibilityValues($fixture, $fixture['owner']);
    expect($draftValues['json'])->toBe($draftJson)
        ->and($draftValues['plain'])->toBe($draftPlain)
        ->and($canonicalValues['json'])->toBe($jsonValue)
        ->and($canonicalValues['plain'])->toBe($plainValue);
});

it('migrates Vizy 3 JSON fields without decoding JSON-looking Plain Text', function() {
    $placeholderJson = ['placeholder' => true];
    $fixture = jsonFieldCompatibilityFixture($placeholderJson, 'placeholder');
    $jsonValue = [
        'source' => 'Vizy 3',
        'settings' => ['limit' => 10, 'flags' => [true, false]],
    ];
    $plainValue = '{"source":"plain text","settings":{"limit":10}}';
    $legacyTypeId = 'legacy-json-values';
    $legacy = [[
        'type' => 'vizyBlock',
        'attrs' => [
            'id' => $fixture['blockUid'],
            'enabled' => true,
            'values' => [
                'type' => $legacyTypeId,
                'content' => ['fields' => [
                    'jsonPayload' => Json::encode($jsonValue),
                    'jsonText' => $plainValue,
                ]],
            ],
        ],
    ]];

    $ownerPlacement = FieldPlacements::uid($fixture['owner'], $fixture['field']);
    expect($ownerPlacement)->toBeString();
    $stored = (new Query())
        ->select('content')
        ->from(Table::ELEMENTS_SITES)
        ->where(['elementId' => $fixture['owner']->id, 'siteId' => $fixture['owner']->siteId])
        ->scalar();
    $stored = is_string($stored) ? Json::decode($stored) : $stored;
    $stored[$ownerPlacement] = Json::encode($legacy);
    Craft::$app->getDb()->createCommand()
        ->update(Table::ELEMENTS_SITES, ['content' => $stored], [
            'elementId' => $fixture['owner']->id,
            'siteId' => $fixture['owner']->siteId,
        ])
        ->execute();

    $owner = Entry::find()->id($fixture['owner']->id)->siteId($fixture['owner']->siteId)->status(null)->one();
    $mapping = [
        'revision' => 'json-field-compatibility',
        'schemaMap' => [
            $legacyTypeId => [
                'blockTypeUid' => $fixture['blockType']->uid,
                'placementUids' => [
                    'jsonPayload' => $fixture['jsonPlacement'],
                    'jsonText' => $fixture['plainPlacement'],
                ],
            ],
        ],
    ];
    $runUid = StringHelper::UUID();
    $analysis = Vizy::$plugin->getOwnerContentMigrator()->analyzeOwner(
        $owner,
        $fixture['field'],
        $mapping,
        $runUid,
    );
    expect($analysis['state'])->toBe('ready', Json::encode($analysis));
    $result = Vizy::$plugin->getOwnerContentMigrator()->migrateOwner(
        $owner,
        $fixture['field'],
        $mapping,
        true,
        $runUid,
    );
    $migrated = jsonFieldCompatibilityValues($fixture, $owner);

    expect($result['state'])->toBe('verified', Json::encode($result))
        ->and($migrated['json'])->toBe($jsonValue)
        ->and($migrated['plain'])->toBe($plainValue);
});
