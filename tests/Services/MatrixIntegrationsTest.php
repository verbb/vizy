<?php

declare(strict_types=1);

use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\MatrixSupportFixture;

function installMatrixIntegrationPlugins(): void
{
    foreach (['spicyweb/craft-neo', 'verbb/hyper', 'sebastianlenz/linkfield'] as $package) {
        $path = \Composer\InstalledVersions::getInstallPath($package);
        expect($path)->not->toBeNull('Use the matrix-integrations qualification profile.');
        $config = json_decode(file_get_contents($path . '/composer.json'), true);
        $handle = $config['extra']['handle'];
        if (!Craft::$app->getPlugins()->isPluginInstalled($handle)) Craft::$app->getPlugins()->installPlugin($handle);
    }
}

it('retains Hyper and Typed Link values with Matrix through owner copies and drafts', function(bool $beside) {
    installMatrixIntegrationPlugins();
    $f = new MatrixSupportFixture();
    $suffix = StringHelper::randomString(8);
    $hyper = new \verbb\hyper\fields\HyperField(['name' => 'Hyper link', 'handle' => 'hyperLink' . $suffix]);
    $url = new \verbb\hyper\links\Url(['handle' => 'url', 'enabled' => true]);
    $hyper->setLinkTypes([$url->getSettingsConfigForDb()]);
    $typed = new \lenz\linkfield\fields\LinkField(['name' => 'Typed link', 'handle' => 'typedLink' . $suffix]);
    foreach ([$hyper, $typed] as $field) {
        expect(Craft::$app->getFields()->saveField($field))->toBeTrue(json_encode($field->getErrors()));
    }
    $layout = $beside ? $f->blockType->getFieldLayout() : $f->rowType->getFieldLayout();
    $tab = $layout->getTabs()[0];
    $hyperPlacement = new CustomField($hyper);
    $typedPlacement = new CustomField($typed);
    $tab->setElements([...$tab->getElements(), $hyperPlacement, $typedPlacement]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();
    $uid = StringHelper::UUID();
    $payload = $f->payload(['Links row']);
    foreach ($payload['entries'] as &$row) {
        $row['fields'][$hyper->handle] = [['type' => \verbb\hyper\links\Url::class, 'linkValue' => 'https://example.test/hyper']];
        $row['fields'][$typed->handle] = ['type' => 'url', 'value' => 'https://example.test/typed'];
    }
    unset($row);
    $blockPayload = $f->block($uid, $payload);
    if ($beside) {
        expect(\verbb\vizy\Vizy::$plugin->getBlockTypes()->saveBlockType($f->blockType))->toBeTrue();
        $blockPayload['attrs']['fieldSlots'][$hyperPlacement->uid] = [['handle' => 'url', 'linkValue' => 'https://example.test/hyper']];
        $blockPayload['attrs']['fieldSlots'][$typedPlacement->uid] = ['type' => 'url', 'value' => 'https://example.test/typed'];
    }
    $owner = $f->save([$blockPayload]);
    $copies = [$owner, Craft::$app->getElements()->duplicateElement($owner), Craft::$app->getDrafts()->createDraft($owner)];
    $ids = [];
    foreach ($copies as $copy) {
        $document = $f->reload($copy)->getFieldValue($f->field->handle);
        $block = iterator_to_array($document->blocks(), false)[0];
        $row = $document->blockElement($block)->getFieldValue($f->matrix->handle)->one();
        $ids[] = $row->id;
        $linkOwner = $beside ? $document->blockElement($block) : $row;
        expect($linkOwner->getFieldValue($hyper->handle)->getLinkUrl())->toBe('https://example.test/hyper');
        expect($linkOwner->getFieldValue($typed->handle)->getUrl())->toBe('https://example.test/typed');
    }
    expect(array_unique($ids))->toHaveCount(3);
})->with(['inside Matrix rows' => [false], 'beside Matrix in a Vizy block' => [true]])->group('matrix-integrations');

it('preserves Matrix inside Vizy on a real Neo owner through copies drafts removal and backfill', function() {
    installMatrixIntegrationPlugins();
    $f = new MatrixSupportFixture();
    $suffix = StringHelper::randomString(8);
    $type = new \benf\neo\models\BlockType(['name' => 'Vizy content', 'handle' => 'vizyContent']);
    $layout = new \craft\models\FieldLayout(['type' => \benf\neo\elements\Block::class]);
    $layout->setTabs([new \craft\models\FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [new CustomField($f->field)]])]);
    $type->setFieldLayout($layout);
    $neo = new \benf\neo\Field(['name' => 'Neo content', 'handle' => 'neoContent' . $suffix]);
    $neo->setBlockTypes([$type]);
    expect(Craft::$app->getFields()->saveField($neo))->toBeTrue(json_encode($neo->getErrors()));
    // Neo's Project Config save does not populate the supplied type model ID.
    $type->id = \craft\helpers\Db::idByUid('{{%neoblocktypes}}', $type->uid);
    expect($type->id)->not->toBeNull();
    $ownerLayout = $f->owner->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($neo)]);
    expect(Craft::$app->getFields()->saveLayout($ownerLayout))->toBeTrue();
    $uid = StringHelper::UUID();
    $document = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$f->block($uid, $f->payload(['Neo Matrix']))]];
    $f->owner->setFieldValue($neo->handle, ['new1' => ['type' => $type->handle, 'enabled' => true, 'level' => 1, 'fields' => [$f->field->handle => $document]]]);
    expect(Craft::$app->getElements()->saveElement($f->owner))->toBeTrue(json_encode($f->owner->getErrors()));
    $owner = $f->reload();
    $copies = [$owner, Craft::$app->getElements()->duplicateElement($owner), Craft::$app->getDrafts()->createDraft($owner)];
    $ids = [];
    foreach ($copies as $copy) {
        $neoBlock = $f->reload($copy)->getFieldValue($neo->handle)->one();
        expect($neoBlock)->not->toBeNull();
        $value = $neoBlock->getFieldValue($f->field->handle);
        $block = iterator_to_array($value->blocks(), false)[0];
        $anchor = \verbb\vizy\Vizy::$plugin->getAnchors()->getAnchor($neoBlock, $f->field, $block->uid());
        expect($anchor->parentOwnerId)->toBe($neoBlock->id);
        $row = $value->blockElement($block)->getFieldValue($f->matrix->handle)->one();
        expect($row->getFieldValue($f->text->handle))->toBe('Neo Matrix');
        $ids[] = $row->id;
    }
    expect($ids[1])->not->toBe($ids[0]);
    // Neo shares unchanged blocks with its draft until the parent form posts
    // a modification. Exercise that real copy-on-write path, not a direct save
    // of the still-canonical Neo block returned by an unchanged draft query.
    $draft = $f->reload($copies[2]);
    $draftNeo = $draft->getFieldValue($neo->handle)->one();
    $placedNeo = $draft->getFieldLayout()->getFieldById($neo->id);
    $changed = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$f->block($uid, $f->payload(['Draft Neo Matrix']))]];
    $saveDraft = static function(array $content) use ($draft, $draftNeo, $placedNeo, $f): void {
        $payload = ['blocks' => [(string)$draftNeo->id => ['type' => $draftNeo->getType()->handle, 'enabled' => true, 'level' => 1, 'fields' => [$f->field->handle => $content]]], 'sortOrder' => [(string)$draftNeo->id]];
        \Tests\Support\WebControllerHarness::beginWebRequest();
        try {
            $draft->setFieldValue($placedNeo->handle, $placedNeo->normalizeValueFromRequest($payload, $draft));
            expect(Craft::$app->getElements()->saveElement($draft))->toBeTrue(json_encode($draft->getErrors()));
        } finally {
            \Tests\Support\WebControllerHarness::endWebRequest();
        }
    };
    $saveDraft($changed);
    $draftValue = $f->reload($draft)->getFieldValue($neo->handle)->one()->getFieldValue($f->field->handle);
    $draftRow = $draftValue->blockElement($draftValue->findBlock($uid))->getFieldValue($f->matrix->handle)->one();
    expect($draftRow->id)->not->toBe($ids[0]);
    expect($draftRow->getFieldValue($f->text->handle))->toBe('Draft Neo Matrix');
    expect(\craft\elements\Entry::find()->id($ids[0])->status(null)->one()->getFieldValue($f->text->handle))->toBe('Neo Matrix');
    $saveDraft(['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => []]);
    expect(\craft\elements\Entry::find()->id($draftRow->id)->status(null)->exists())->toBeFalse();
    expect(\craft\elements\Entry::find()->id($ids[0])->status(null)->exists())->toBeTrue();

    $sourceNeo = $f->reload($owner)->getFieldValue($neo->handle)->one();
    $backfillUid = StringHelper::UUID();
    $legacy = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [$f->block($backfillUid, $f->payload(['Neo backfill']))]];
    $placement = $sourceNeo->getFieldLayout()->getCustomFieldElements()[0];
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', [
        'content' => new \yii\db\JsonExpression([$placement->uid => json_encode($legacy)]),
    ], ['elementId' => $sourceNeo->id, 'siteId' => $sourceNeo->siteId])->execute();
    $command = new \verbb\vizy\console\controllers\AnchorsController('anchors', \verbb\vizy\Vizy::$plugin);
    $command->elementId = $sourceNeo->id;
    expect($command->actionBackfill())->toBe(0);
    $backfilled = \benf\neo\elements\Block::find()->id($sourceNeo->id)->siteId($sourceNeo->siteId)->status(null)->one()->getFieldValue($f->field->handle);
    expect($backfilled->blockElement($backfilled->findBlock($backfillUid))->getFieldValue($f->matrix->handle)->one()->getFieldValue($f->text->handle))->toBe('Neo backfill');
    expect(\craft\elements\Entry::find()->id($ids[1])->status(null)->exists())->toBeTrue();
})->group('matrix-integrations');
