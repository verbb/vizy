<?php

declare(strict_types=1);

use craft\behaviors\CustomFieldBehavior;
use craft\db\Table;
use craft\elements\Entry;
use craft\enums\PropagationMethod;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Entries;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use craft\models\Site;
use craft\models\SiteGroup;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

function multisiteRelationSites(): array
{
    $sites = Craft::$app->getSites();
    $suffix = StringHelper::randomString(6);
    $siteA = $sites->getPrimarySite();
    $groupB = new SiteGroup(['name' => "Vizy relation group B {$suffix}"]);
    expect($sites->saveGroup($groupB))->toBeTrue();
    $siteB = new Site([
        'name' => "Vizy relation site B {$suffix}",
        'handle' => "vizyRelationB{$suffix}",
        'groupId' => $groupB->id,
        'language' => 'en-US',
        'hasUrls' => true,
        'baseUrl' => "https://vizy-relation-b-{$suffix}.test",
    ]);
    expect($sites->saveSite($siteB))->toBeTrue();

    $sites->refreshSites();
    Craft::$app->getIsMultiSite(true, true);

    return [$siteA, $siteB, $groupB];
}

function multisiteRelationSection(string $name, array $sites, array $fields = []): Section
{
    $suffix = StringHelper::randomString(6);
    $layout = new FieldLayout(['type' => Entry::class]);
    if ($fields !== []) {
        $layout->setTabs([new FieldLayoutTab([
            'layout' => $layout,
            'name' => 'Content',
            'elements' => array_map(static fn($field) => new CustomField($field), $fields),
        ])]);
    }
    $type = new EntryType(['name' => $name, 'handle' => "multisiteRelationType{$suffix}"]);
    $type->setFieldLayout($layout);
    expect(Craft::$app->getEntries()->saveEntryType($type))->toBeTrue();

    $section = new Section([
        'name' => "{$name} {$suffix}",
        'handle' => "multisiteRelation{$suffix}",
        'type' => Section::TYPE_CHANNEL,
        'propagationMethod' => PropagationMethod::All,
        'enableVersioning' => true,
    ]);
    $section->setEntryTypes([$type]);
    $section->setSiteSettings(array_map(static fn(Site $site) => new Section_SiteSettings([
        'siteId' => $site->id,
        'enabledByDefault' => true,
        'hasUrls' => false,
    ]), $sites));
    expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();

    return $section;
}

function multisiteRelationBlockType(string $name, array $fields): array
{
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $placements = [];
    foreach ($fields as $field) {
        $placement = new CustomField($field);
        $placement->uid = StringHelper::UUID();
        $placements[$field->handle] = $placement;
    }
    $layout->setTabs([new FieldLayoutTab([
        'uid' => StringHelper::UUID(),
        'layout' => $layout,
        'name' => 'Content',
        'elements' => array_values($placements),
    ])]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => $name,
        'handle' => 'multisiteRelationBlock' . StringHelper::randomString(6),
    ]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();

    return [$type, array_map(static fn(CustomField $placement) => $placement->uid, $placements)];
}

it('uses the Vizy owner site for root and Hosted Entry relations across site groups', function() {
    [$siteA, $siteB, $groupB] = multisiteRelationSites();
    expect($siteA->groupId)->not->toBe($siteB->groupId);

    $targetSection = multisiteRelationSection('Relation targets', [$siteA, $siteB]);
    $targetType = Craft::$app->getEntries()->getEntryTypesBySectionId($targetSection->id)[0];
    $targetA = new Entry([
        'sectionId' => $targetSection->id,
        'typeId' => $targetType->id,
        'siteId' => $siteA->id,
        'title' => 'Target on site A',
        'enabled' => true,
        'postDate' => new DateTime('-1 day'),
    ]);
    $targetA->setEnabledForSite(true);
    expect(Craft::$app->getElements()->saveElement($targetA, true, false))->toBeTrue();
    $targetB = new Entry([
        'sectionId' => $targetSection->id,
        'typeId' => $targetType->id,
        'siteId' => $siteB->id,
        'title' => 'Target on site B',
        'enabled' => true,
        'postDate' => new DateTime('-1 day'),
    ]);
    $targetB->setEnabledForSite(true);
    expect(Craft::$app->getElements()->saveElement($targetB, true, false))->toBeTrue();
    $suffix = StringHelper::randomString(6);
    $current = new Entries([
        'name' => 'Current-site relation',
        'handle' => "currentRelation{$suffix}",
        'sources' => ["section:{$targetSection->uid}"],
    ]);
    $fixed = new Entries([
        'name' => 'Fixed-site relation',
        'handle' => "fixedRelation{$suffix}",
        'sources' => ["section:{$targetSection->uid}"],
        'targetSiteId' => $siteA->uid,
    ]);
    foreach ([$current, $fixed] as $field) {
        expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
        CustomFieldBehavior::$fieldHandles[$field->handle] = true;
    }

    [$innerType, $innerSlots] = multisiteRelationBlockType('Hosted relation', [$current, $fixed]);
    $hostedField = new VizyField([
        'name' => 'Hosted relations',
        'handle' => "hostedRelations{$suffix}",
        'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS,
        'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$innerType->uid]]],
    ]);
    expect(Craft::$app->getFields()->saveField($hostedField))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$hostedField->handle] = true;

    [$outerType, $outerSlots] = multisiteRelationBlockType('Root relation', [$current, $fixed, $hostedField]);
    $root = new VizyField([
        'name' => 'Multisite relations',
        'handle' => "multisiteRelations{$suffix}",
        'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS,
        'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$outerType->uid]]],
    ]);
    expect(Craft::$app->getFields()->saveField($root))->toBeTrue();
    CustomFieldBehavior::$fieldHandles[$root->handle] = true;
    Craft::$app->getFields()->refreshFields();

    $innerUid = StringHelper::UUID();
    $outerUid = StringHelper::UUID();
    $innerDocument = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $innerUid,
                'blockTypeUid' => $innerType->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $innerSlots[$current->handle] => [$targetB->id],
                    $innerSlots[$fixed->handle] => [$targetA->id],
                ],
            ],
        ]],
    ];
    $document = [
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => [[
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $outerUid,
                'blockTypeUid' => $outerType->uid,
                'enabled' => true,
                'fieldSlots' => [
                    $outerSlots[$current->handle] => [$targetB->id],
                    $outerSlots[$fixed->handle] => [$targetA->id],
                    $outerSlots[$hostedField->handle] => $innerDocument,
                ],
            ],
        ]],
    ];

    $ownerSection = multisiteRelationSection('Relation owners', [$siteA, $siteB], [$root]);
    $ownerType = Craft::$app->getEntries()->getEntryTypesBySectionId($ownerSection->id)[0];
    $ownerA = new Entry([
        'sectionId' => $ownerSection->id,
        'typeId' => $ownerType->id,
        'siteId' => $siteA->id,
        'title' => 'Relation owner',
    ]);
    $ownerA->setFieldValue($root->handle, $document);
    expect(Craft::$app->getElements()->saveElement($ownerA))->toBeTrue();

    $ownerB = Entry::find()->id($ownerA->id)->siteId($siteB->id)->status(null)->one();
    expect($ownerB)->not->toBeNull();
    $originalCurrentSite = Craft::$app->getSites()->getCurrentSite();
    Craft::$app->getSites()->setCurrentSite($siteB);

    $assertRelations = static function(Entry $owner) use ($root, $outerUid, $innerUid, $current, $fixed, $hostedField, $targetA, $targetB, $siteA, $siteB): void {
        $document = $owner->getFieldValue($root->handle);
        $outer = $document->blockElement($document->findBlock($outerUid));
        $hostedDocument = $outer->getFieldValue($hostedField->handle);
        $inner = $hostedDocument->blockElement($hostedDocument->findBlock($innerUid));

        expect($owner->siteId)->toBe($siteB->id)
            ->and($outer->siteId)->toBe($siteB->id)
            ->and($inner->siteId)->toBe($siteB->id);

        foreach (['root' => $outer, 'hosted' => $inner] as $location => $block) {
            $currentQuery = $block->getFieldValue($current->handle);
            $fixedQuery = $block->getFieldValue($fixed->handle);
            expect($currentQuery->siteId)->toBe($siteB->id)
                ->and($fixedQuery->siteId)->toBe($siteA->id)
                ->and($currentQuery->status(null)->ids())->toBe([$targetB->id], "{$location} current-site relation")
                ->and($fixedQuery->status(null)->ids())->toBe([$targetA->id], "{$location} fixed-site relation");
        }
    };

    try {
        $assertRelations($ownerB);
        $draft = Craft::$app->getDrafts()->createDraft($ownerB);
        $assertRelations($draft);
    } finally {
        Craft::$app->getSites()->setCurrentSite($originalCurrentSite);
        expect(Craft::$app->getSites()->deleteSite($siteB))->toBeTrue();
        expect(Craft::$app->getSites()->deleteGroup($groupB))->toBeTrue();
        // Craft soft-deletes sites, but this shared suite must return to its single-site baseline.
        Craft::$app->getDb()->createCommand()->delete(Table::SITEGROUPS, ['id' => $groupB->id])->execute();
        Craft::$app->getSites()->refreshSites();
        Craft::$app->getIsMultiSite(true, true);
    }
});
