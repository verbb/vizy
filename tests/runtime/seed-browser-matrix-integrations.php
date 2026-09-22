<?php

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\Vizy;

function seedBrowserMatrixIntegrations($rootField, array $matrix, array $sourceBlock, $actor, callable $save): array
{
    if (!\Composer\InstalledVersions::isInstalled('spicyweb/craft-neo')) return [];
    foreach (['neo', 'hyper', 'typedlinkfield', 'super-table'] as $handle) {
        if (!Craft::$app->getPlugins()->isPluginInstalled($handle)) Craft::$app->getPlugins()->installPlugin($handle);
    }
    // The validation-recovery journey needs a real required title control.
    // hasTitleField alone does not add it to an explicit Craft field layout.
    $ownerType = VizyFixtureFactory::section()->getEntryTypes()[0];
    $ownerLayout = $ownerType->getFieldLayout();
    $ownerTab = $ownerLayout->getTabs()[0];
    $ownerTab->setElements([new \craft\fieldlayoutelements\entries\EntryTitleField(['required' => true]), ...$ownerTab->getElements()]);
    $save($ownerType, Craft::$app->getEntries()->saveEntryType(...));
    $hyper = new \verbb\hyper\fields\HyperField(['name' => 'Hyper link', 'handle' => 'browserHyper']);
    $url = new \verbb\hyper\links\Url(['handle' => 'url', 'enabled' => true]);
    $hyper->setLinkTypes([$url->getSettingsConfigForDb()]);
    $typed = new \lenz\linkfield\fields\LinkField(['name' => 'Typed link', 'handle' => 'browserTyped']);
    foreach ([$hyper, $typed] as $field) $save($field, Craft::$app->getFields()->saveField(...));
    $blockType = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($sourceBlock['attrs']['blockTypeUid']);
    $matrixPlacement = $blockType->getFieldLayout()->getCustomFieldElements()[0]->uid;
    $rowType = Craft::$app->getEntries()->getEntryTypeById($matrix['entryTypeId']);
    $placements = [];
    foreach (['row' => $rowType->getFieldLayout(), 'block' => $blockType->getFieldLayout()] as $scope => $layout) {
        $tab = $layout->getTabs()[0];
        $extras = [];
        foreach ([$hyper, $typed] as $field) {
            $placement = new CustomField($field, ['uid' => StringHelper::UUID()]);
            $extras[] = $placement;
            $placements[$scope][$field->handle] = $placement->uid;
        }
        $tab->setElements([...$tab->getElements(), ...$extras]);
        $save($layout, Craft::$app->getFields()->saveLayout(...));
    }
    $save($blockType, Vizy::$plugin->getBlockTypes()->saveBlockType(...));
    $makeDocument = static function(string $label) use ($sourceBlock, $matrix, $matrixPlacement, $rowType, $placements): array {
        $block = $sourceBlock;
        unset($block['attrs']['matrixAnchorUid']);
        $block['attrs']['blockUid'] = StringHelper::UUID();
        $links = ['browserHyper' => [['handle' => 'url', 'linkValue' => 'https://example.test/hyper']], 'browserTyped' => ['type' => 'url', 'value' => 'https://example.test/typed']];
        $block['attrs']['fieldSlots'] = [$matrixPlacement => ['entries' => ['new1' => ['type' => $rowType->handle, 'fields' => [$matrix['labelHandle'] => $label, ...$links]]], 'sortOrder' => ['new1']]];
        foreach ($links as $handle => $value) $block['attrs']['fieldSlots'][$placements['block'][$handle]] = $value;
        return ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$block]];
    };
    $makeLayout = static function(string $type) use ($rootField): FieldLayout {
        $layout = new FieldLayout(['type' => $type]);
        $layout->setTabs([new FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [new CustomField($rootField)]])]);
        return $layout;
    };
    $neoType = new \benf\neo\models\BlockType(['name' => 'Vizy content', 'handle' => 'vizyContent']);
    $neoType->setFieldLayout($makeLayout(\benf\neo\elements\Block::class));
    $neo = new \benf\neo\Field(['name' => 'Neo content', 'handle' => 'browserNeo']);
    $neo->setBlockTypes([$neoType]);
    $save($neo, Craft::$app->getFields()->saveField(...));
    $neoType->id = \craft\helpers\Db::idByUid('{{%neoblocktypes}}', $neoType->uid);
    $stType = new EntryType(['name' => 'Vizy row', 'handle' => 'browserVizyRow']);
    $stType->setFieldLayout($makeLayout(Entry::class));
    $save($stType, Craft::$app->getEntries()->saveEntryType(...));
    $st = new \verbb\supertable\fields\SuperTableField(['name' => 'Super Table content', 'handle' => 'browserSuperTable', 'viewMode' => 'blocks']);
    $st->setEntryTypes([$stType]);
    $save($st, Craft::$app->getFields()->saveField(...));
    $result = [];
    foreach (['links' => null, 'neo' => $neo, 'super-table' => $st] as $name => $nested) {
        $owner = VizyFixtureFactory::entry('Matrix integration ' . $name);
        $owner->setAuthorIds([$actor->id]);
        if ($nested) {
            $layout = $owner->getFieldLayout();
            $tab = $layout->getTabs()[0];
            $tab->setElements([...$tab->getElements(), new CustomField($nested)]);
            $save($layout, Craft::$app->getFields()->saveLayout(...));
        }
        $document = $makeDocument('Integration ' . $name);
        if ($name === 'neo') {
            $owner->setFieldValue($neo->handle, ['new1' => ['type' => $neoType->handle, 'enabled' => true, 'level' => 1, 'fields' => [$rootField->handle => $document]]]);
        } elseif ($name === 'super-table') {
            $owner->setFieldValue($st->handle, ['entries' => ['new1' => ['type' => $stType->handle, 'fields' => [$rootField->handle => $document]]], 'sortOrder' => ['new1']]);
        } else {
            $owner->setFieldValue($rootField->handle, $document);
        }
        $save($owner, Craft::$app->getElements()->saveElement(...));
        $result[$name] = ['entryId' => $owner->id, 'editPath' => '/index.php?p=admin/entries/' . $owner->getSection()->handle . '/' . $owner->id, 'nestedHandle' => $nested?->handle,
            'blockUid' => $document['content'][0]['attrs']['blockUid'], 'labelHandle' => $matrix['labelHandle'], 'matrixHandle' => $matrix['fieldHandle']];
    }
    return $result;
}
