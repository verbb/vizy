<?php

declare(strict_types=1);

namespace Tests\Support\Fixtures;

use Craft;
use craft\base\Field;
use craft\elements\Entry;
use craft\enums\PropagationMethod;
use craft\fieldlayoutelements\CustomField;
use craft\fields\Matrix;
use craft\fields\PlainText;
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

final class MatrixSupportFixture
{
    public PlainText $text;
    public Matrix $matrix;
    public ?Matrix $nestedMatrix = null;
    public EntryType $rowType;
    public VizyField $field;
    public BlockType $blockType;
    public string $placementUid;
    public Entry $owner;
    public ?VizyField $hostedField = null;
    public ?BlockType $hostType = null;

    public function __construct(bool $nested = false, PropagationMethod $propagation = PropagationMethod::All)
    {
        $suffix = StringHelper::randomString(8);
        $this->text = new PlainText([
            'name' => 'Matrix text', 'handle' => 'matrixText' . $suffix,
            'translationMethod' => Field::TRANSLATION_METHOD_SITE,
        ]);
        expect(Craft::$app->getFields()->saveField($this->text))->toBeTrue();
        $placements = [new CustomField($this->text)];
        if ($nested) {
            $nestedType = new EntryType(['name' => 'Inner row', 'handle' => 'innerRow' . $suffix]);
            $nestedType->setFieldLayout($this->layout(Entry::class, [new CustomField($this->text)]));
            expect(Craft::$app->getEntries()->saveEntryType($nestedType))->toBeTrue();
            $this->nestedMatrix = new Matrix(['name' => 'Inner rows', 'handle' => 'innerRows' . $suffix]);
            $this->nestedMatrix->setEntryTypes([$nestedType]);
            expect(Craft::$app->getFields()->saveField($this->nestedMatrix))->toBeTrue();
            $placements[] = new CustomField($this->nestedMatrix);
        }
        $this->rowType = new EntryType(['name' => 'Matrix row', 'handle' => 'matrixRow' . $suffix]);
        $this->rowType->setFieldLayout($this->layout(Entry::class, $placements));
        expect(Craft::$app->getEntries()->saveEntryType($this->rowType))->toBeTrue();
        $this->matrix = new Matrix([
            'name' => 'Matrix rows', 'handle' => 'matrixRows' . $suffix,
            'propagationMethod' => $propagation,
        ]);
        $this->matrix->setEntryTypes([$this->rowType]);
        expect(Craft::$app->getFields()->saveField($this->matrix))->toBeTrue();
        $placement = new CustomField($this->matrix);
        $placement->uid = $this->placementUid = StringHelper::UUID();
        $this->blockType = new BlockType([
            'uid' => StringHelper::UUID(), 'name' => 'Matrix block', 'handle' => 'matrixBlock' . $suffix,
        ]);
        $this->blockType->setFieldLayout($this->layout(Block::class, [$placement]));
        expect(Vizy::$plugin->getBlockTypes()->saveBlockType($this->blockType))->toBeTrue();
        $this->field = new VizyField([
            'name' => 'Matrix article', 'handle' => 'matrixArticle' . $suffix,
            'editorConfig' => 'standard', 'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS,
            'translationMethod' => Field::TRANSLATION_METHOD_SITE,
            'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$this->blockType->uid]]],
        ]);
        expect(Craft::$app->getFields()->saveField($this->field))->toBeTrue();
        $ownerType = new EntryType(['name' => 'Matrix article', 'handle' => 'matrixArticleType' . $suffix]);
        $ownerType->setFieldLayout($this->layout(Entry::class, [new CustomField($this->field)]));
        expect(Craft::$app->getEntries()->saveEntryType($ownerType))->toBeTrue();
        $section = new Section([
            'name' => 'Matrix articles ' . $suffix, 'handle' => 'matrixArticles' . $suffix,
            'type' => Section::TYPE_CHANNEL, 'enableVersioning' => false,
        ]);
        $section->setEntryTypes([$ownerType]);
        $section->setSiteSettings(array_map(static fn($site) => new Section_SiteSettings([
            'siteId' => $site->id, 'enabledByDefault' => true, 'hasUrls' => false,
        ]), Craft::$app->getSites()->getAllSites()));
        expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();
        Craft::$app->getFields()->refreshFields();
        $this->owner = new Entry([
            'sectionId' => $section->id, 'typeId' => $ownerType->id,
            'siteId' => Craft::$app->getSites()->getPrimarySite()->id, 'title' => 'Matrix article',
        ]);
        expect(Craft::$app->getElements()->saveElement($this->owner))->toBeTrue();
    }

    private function layout(string $type, array $elements): FieldLayout
    {
        $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => $type]);
        $layout->setTabs([new FieldLayoutTab([
            'uid' => StringHelper::UUID(), 'layout' => $layout, 'name' => 'Content', 'elements' => $elements,
        ])]);
        return $layout;
    }

    public function payload(array $labels): array
    {
        $entries = [];
        foreach ($labels as $label) {
            $entries[StringHelper::UUID()] = ['type' => $this->rowType->handle, 'fields' => [$this->text->handle => $label]];
        }
        return ['entries' => $entries, 'sortOrder' => array_keys($entries)];
    }

    public function block(string $uid, ?array $payload = null): array
    {
        return ['type' => 'vizyBlock', 'attrs' => [
            'blockUid' => $uid, 'blockTypeUid' => $this->blockType->uid, 'enabled' => true,
            'fieldSlots' => $payload === null ? [] : [$this->placementUid => $payload],
        ]];
    }

    public function hostedBlock(string $uid, array $blocks): array
    {
        if (!$this->hostedField) {
            $suffix = StringHelper::randomString(8);
            $this->hostedField = new VizyField([
                'name' => 'Hosted Matrix', 'handle' => 'hostedMatrix' . $suffix,
                'editorConfig' => 'standard', 'rootContentType' => VizyField::ROOT_CONTENT_BLOCKS,
                'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$this->blockType->uid]]],
            ]);
            expect(Craft::$app->getFields()->saveField($this->hostedField))->toBeTrue();
            $this->hostType = new BlockType([
                'uid' => StringHelper::UUID(), 'name' => 'Host', 'handle' => 'matrixHost' . $suffix,
            ]);
            $this->hostType->setFieldLayout($this->layout(Block::class, [new CustomField($this->hostedField)]));
            expect(Vizy::$plugin->getBlockTypes()->saveBlockType($this->hostType))->toBeTrue();
            $this->field->blockTypePickerGroups[0]['blockTypeUids'][] = $this->hostType->uid;
            expect(Craft::$app->getFields()->saveField($this->field))->toBeTrue();
            Craft::$app->getFields()->refreshFields();
            $this->owner = $this->reload();
            foreach ($this->owner->getFieldLayout()->getCustomFields() as $field) {
                if ($field->uid === $this->field->uid) {
                    $field->blockTypePickerGroups = $this->field->blockTypePickerGroups;
                }
            }
        }
        $placementUid = $this->hostType->getFieldLayout()->getCustomFieldElements()[0]->uid;
        return ['type' => 'vizyBlock', 'attrs' => [
            'blockUid' => $uid, 'blockTypeUid' => $this->hostType->uid, 'enabled' => true,
            'fieldSlots' => [$placementUid => ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $blocks]],
        ]];
    }

    public function save(array $blocks, ?Entry $owner = null, bool $propagate = true): Entry
    {
        $owner ??= $this->owner;
        $owner->setFieldValue($this->field->handle, [
            'type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => $blocks,
        ]);
        if (!Craft::$app->getElements()->saveElement($owner, true, $propagate)) {
            throw new \RuntimeException('Matrix fixture save failed: ' . json_encode($owner->getErrors()));
        }
        return $this->reload($owner);
    }

    public function reload(?Entry $owner = null): Entry
    {
        $owner ??= $this->owner;
        return Entry::find()->id($owner->id)->siteId($owner->siteId)->status(null)->drafts(null)->provisionalDrafts(null)->one();
    }

    public function rows(string $blockUid, ?Entry $owner = null): array
    {
        $owner = $this->reload($owner);
        $document = $owner->getFieldValue($this->field->handle);
        $block = $document->findBlock($blockUid);
        expect($block)->not->toBeNull();
        return $document->blockElement($block)->getFieldValue($this->matrix->handle)->all();
    }
}
