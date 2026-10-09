<?php

use craft\elements\Entry;
use craft\elements\User;
use craft\fieldlayoutelements\CustomField;
use craft\fieldlayoutelements\entries\EntryTitleField;
use craft\fields\Matrix;
use craft\fields\PlainText;
use craft\helpers\FileHelper;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

// Independent owners and sessions for optimistic-save conflict coverage.
return (static function(): array {
    $save = static function($model, $callback) {
        if (!$callback($model)) throw new RuntimeException(json_encode($model->getErrors()));
        return $model;
    };
    $layout = static function(array $elements, string $type): FieldLayout {
        $layout = new FieldLayout(['type' => $type]);
        $layout->setTabs([new FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => $elements])]);
        return $layout;
    };
    $fields = Craft::$app->getFields();
    $entries = Craft::$app->getEntries();
    $text = new PlainText(['name' => 'Row label', 'handle' => 'conflictRowLabel']);
    $save($text, $fields->saveField(...));
    $row = new EntryType(['name' => 'Conflict row', 'handle' => 'conflictRow']);
    $row->setFieldLayout($layout([new CustomField($text)], Entry::class));
    $save($row, $entries->saveEntryType(...));
    $matrix = new Matrix(['name' => 'Conflict rows', 'handle' => 'conflictRows']);
    $matrix->setEntryTypes([$row]);
    $save($matrix, $fields->saveField(...));
    $block = new BlockType([
        'uid' => StringHelper::UUID(), 'name' => 'Conflict feature',
        'handle' => 'conflictFeature', 'template' => '_conflict/feature',
    ]);
    $block->setFieldLayout($layout([new CustomField($matrix)], Block::class));
    $save($block, Vizy::$plugin->getBlockTypes()->saveBlockType(...));
    $body = new VizyField([
        'name' => 'Conflict body', 'handle' => 'conflictBody', 'editorMode' => 'combined',
        'editorConfig' => 'standard',
        'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$block->uid]]],
    ]);
    $save($body, $fields->saveField(...));
    $type = new EntryType(['name' => 'Conflict checks', 'handle' => 'conflictPage']);
    $type->setFieldLayout($layout([new EntryTitleField(['required' => true]), new CustomField($body)], Entry::class));
    $save($type, $entries->saveEntryType(...));
    $section = new Section([
        'name' => 'Conflict checks', 'handle' => 'conflictPages',
        'type' => Section::TYPE_CHANNEL, 'enableVersioning' => true,
    ]);
    $section->setEntryTypes([$type]);
    $site = Craft::$app->getSites()->getPrimarySite();
    $section->setSiteSettings([$site->id => new Section_SiteSettings([
        'siteId' => $site->id, 'enabledByDefault' => true, 'hasUrls' => true,
        'uriFormat' => 'conflict/{slug}', 'template' => '_conflict/entry',
    ])]);
    $save($section, $entries->saveSection(...));
    $user = new User([
        'username' => 'conflictEditor', 'email' => 'conflict-editor@example.test',
        'newPassword' => 'testing-only-password', 'active' => true, 'admin' => true,
    ]);
    $save($user, Craft::$app->getElements()->saveElement(...));
    $pages = [];
    foreach (['Final save conflict', 'Autosave conflict', 'Normal save checks'] as $title) {
        $entry = new Entry(['sectionId' => $section->id, 'typeId' => $type->id, 'siteId' => $site->id, 'title' => $title]);
        $entry->setAuthorIds([1]);
        $entry->setFieldValue('conflictBody', [
            'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
            'content' => [['type' => 'paragraph', 'content' => [['type' => 'text', 'text' => 'Original content.']]]],
        ]);
        $save($entry, Craft::$app->getElements()->saveElement(...));
        $pages[] = ['id' => $entry->id, 'editPath' => '/index.php?p=admin/entries/conflictPages/' . $entry->id, 'url' => $entry->url];
    }
    $templates = Craft::$app->getPath()->getSiteTemplatesPath() . '/_conflict';
    FileHelper::createDirectory($templates);
    file_put_contents($templates . '/entry.twig', '<!doctype html><html lang="en"><title>{{ entry.title }}</title><main>{{ entry.conflictBody.render() }}</main></html>');
    file_put_contents($templates . '/feature.twig', '<section>{% for row in block.conflictRows.all() %}<p>{{ row.conflictRowLabel }}</p>{% endfor %}</section>');
    return $pages;
})();
