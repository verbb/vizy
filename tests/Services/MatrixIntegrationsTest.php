<?php

declare(strict_types=1);

use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\Vizy;

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

it('acknowledges committed Neo content only when its containing owner is a draft', function(bool $draftOwner, bool $rollback) {
    installMatrixIntegrationPlugins();
    $admin = AssetSpikeFixture::ensureAdminUser();
    Vizy::$plugin->getEditorAcknowledgements()->resetRequestStateForTesting();
    $field = VizyFixtureFactory::vizyField();
    $type = new \benf\neo\models\BlockType(['name' => 'Acknowledged story', 'handle' => 'ackStory']);
    $layout = new \craft\models\FieldLayout(['type' => \benf\neo\elements\Block::class]);
    $layout->setTabs([new \craft\models\FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [new CustomField($field)]])]);
    $type->setFieldLayout($layout);
    $neo = new \benf\neo\Field(['name' => 'Acknowledged Neo', 'handle' => 'ackNeo' . StringHelper::randomString(8)]);
    $neo->setBlockTypes([$type]);
    expect(Craft::$app->getFields()->saveField($neo))->toBeTrue();
    $type->id = \craft\helpers\Db::idByUid('{{%neoblocktypes}}', $type->uid);
    $owner = VizyFixtureFactory::entry('Neo validation acknowledgement');
    $ownerLayout = $owner->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($neo)]);
    expect(Craft::$app->getFields()->saveLayout($ownerLayout))->toBeTrue();
    if ($draftOwner) $owner = Craft::$app->getDrafts()->createDraft($owner, $admin->id, 'Neo recovery');
    $owner->setFieldValue($neo->handle, ['new1' => ['type' => $type->handle, 'enabled' => true, 'level' => 1, 'fields' => [
        $field->handle => VizyFixtureFactory::paragraphDocument('Original Neo story'),
    ]]]);
    expect(Craft::$app->getElements()->saveElement($owner, false))->toBeTrue(json_encode($owner->getErrors()));
    $block = $owner->getFieldValue($neo->handle)->one();
    expect($block->getIsDraft())->toBeFalse();
    $context = Vizy::$plugin->getEditorContexts()->issue($block, $field);
    $oldToken = Vizy::$plugin->getContentVersions()->issue($block, $field);
    $result = WebControllerHarness::withWebRequest([
        'vizyTransport' => WebControllerHarness::transportMetadata('neo-validation-editor', $field->uid, $context['token'], 1, 2, 'save'),
    ], 'elements/apply-draft', function() use ($block, $field, $rollback) {
        $transaction = Craft::$app->getDb()->beginTransaction();
        try {
            $block->setFieldValue($field->handle, VizyFixtureFactory::paragraphDocument('Changed Neo story'));
            expect(Craft::$app->getElements()->saveElement($block, false))->toBeTrue();
            if ($rollback) $transaction->rollBack();
            else $transaction->commit();
            $response = new \craft\web\Response();
            $response->setStatusCode(400);
            $response->data = ['message' => 'Containing entry cannot be published.'];
            Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new \yii\base\Event(['sender' => $response]));
            return $response->data;
        } finally {
            if ($transaction->getIsActive()) $transaction->rollBack();
        }
    });
    if (!$draftOwner || $rollback) {
        expect($result)->not->toHaveKey('vizy');
        return;
    }
    $ack = $result['vizy']['results'][0];
    expect($ack['editorId'])->toBe('neo-validation-editor')
        ->and($ack['canonicalDocument']['content'][0]['content'][0]['text'])->toBe('Changed Neo story')
        ->and($ack['storageToken'])->not->toBe($oldToken);
    $transaction = Craft::$app->getDb()->beginTransaction();
    try {
        Vizy::$plugin->getContentVersions()->check($block, $field, $ack['storageToken']);
    } finally {
        $transaction->rollBack();
    }
})->with(['committed draft' => [true, false], 'rolled-back draft' => [true, true], 'canonical owner' => [false, false]])->group('matrix-integrations');

it('acknowledges consecutive saves of a copied Super Table row using its canonical editor context', function() {
    Craft::$app->getPlugins()->installPlugin('super-table');
    $admin = AssetSpikeFixture::ensureAdminUser();
    $field = VizyFixtureFactory::vizyField();
    $type = new \craft\models\EntryType(['name' => 'Acknowledged row', 'handle' => 'ackRow' . StringHelper::randomString(8)]);
    $layout = new \craft\models\FieldLayout(['type' => \craft\elements\Entry::class]);
    $layout->setTabs([new \craft\models\FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [new CustomField($field)]])]);
    $type->setFieldLayout($layout);
    expect(Craft::$app->getEntries()->saveEntryType($type))->toBeTrue();
    $table = new \verbb\supertable\fields\SuperTableField(['name' => 'Acknowledged rows', 'handle' => 'ackRows' . StringHelper::randomString(8)]);
    $table->setEntryTypes([$type]);
    expect(Craft::$app->getFields()->saveField($table))->toBeTrue();
    $owner = VizyFixtureFactory::entry('Super Table acknowledgements');
    $ownerLayout = $owner->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($table)]);
    expect(Craft::$app->getFields()->saveLayout($ownerLayout))->toBeTrue();
    $owner->setFieldValue($table->handle, ['entries' => ['new1' => ['type' => $type->handle, 'fields' => [
        $field->handle => VizyFixtureFactory::paragraphDocument('Canonical row'),
    ]]], 'sortOrder' => ['new1']]);
    expect(Craft::$app->getElements()->saveElement($owner, false))->toBeTrue();
    $canonical = $owner->getFieldValue($table->handle)->one();
    $context = Vizy::$plugin->getEditorContexts()->issue($canonical, $field);
    $draft = Craft::$app->getDrafts()->createDraft($owner, $admin->id, 'Row edits');
    $row = Craft::$app->getElements()->duplicateElement($canonical, ['canonicalId' => $canonical->id, 'primaryOwnerId' => $draft->id, 'ownerId' => $draft->id]);
    expect($row->getIsDraft())->toBeFalse()
        ->and($row->getOwner()->getIsDraft())->toBeTrue();
    foreach (['First edit', 'Second edit'] as $text) {
        Vizy::$plugin->getEditorAcknowledgements()->resetRequestStateForTesting();
        $result = WebControllerHarness::withWebRequest([
            'vizyTransport' => WebControllerHarness::transportMetadata('copied-row', $field->uid, $context['token'], 1, 2, 'autosave'),
        ], 'elements/save-draft', function() use ($row, $field, $text) {
            $row->setFieldValue($field->handle, VizyFixtureFactory::paragraphDocument($text));
            expect(Craft::$app->getElements()->saveElement($row, false))->toBeTrue();
            $response = new \craft\web\Response();
            $response->data = ['success' => true];
            Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new \yii\base\Event(['sender' => $response]));
            return $response->data;
        });
        expect($result['vizy']['results'][0]['editorId'] ?? null)->toBe('copied-row')
            ->and($result['vizy']['results'][0]['canonicalDocument']['content'][0]['content'][0]['text'])->toBe($text);
    }
})->group('matrix-integrations');

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

it('renders Vizy fields immediately in a fresh Neo block owned by an entry draft', function() {
    installMatrixIntegrationPlugins();
    $admin = AssetSpikeFixture::ensureAdminUser();
    $f = new MatrixSupportFixture();
    $type = new \benf\neo\models\BlockType(['name' => 'Fresh story', 'handle' => 'freshStory']);
    $layout = new \craft\models\FieldLayout(['type' => \benf\neo\elements\Block::class]);
    $layout->setTabs([new \craft\models\FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [new CustomField($f->field)]])]);
    $type->setFieldLayout($layout);
    $neo = new \benf\neo\Field(['name' => 'Fresh Neo', 'handle' => 'freshNeo' . StringHelper::randomString(8)]);
    $neo->setBlockTypes([$type]);
    expect(Craft::$app->getFields()->saveField($neo))->toBeTrue();
    $type->id = \craft\helpers\Db::idByUid('{{%neoblocktypes}}', $type->uid);
    $ownerLayout = $f->owner->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($neo)]);
    expect(Craft::$app->getFields()->saveLayout($ownerLayout))->toBeTrue();
    $draft = Craft::$app->getDrafts()->createDraft($f->owner, $admin->id, 'New Neo block');
    $neoBlock = new \benf\neo\elements\Block(['fieldId' => $neo->id, 'typeId' => $type->id, 'siteId' => $draft->siteId, 'level' => 1]);
    $neoBlock->setOwner($draft);
    expect(Craft::$app->getDrafts()->saveElementAsDraft($neoBlock, $admin->id, markAsSaved: false))->toBeTrue();
    $context = Vizy::$plugin->getEditorContexts()->issue($neoBlock, $f->field);
    $block = $f->block(StringHelper::UUID(), $f->payload(['Immediate row']));
    $response = WebControllerHarness::renderFieldLayout([
        'editorContextToken' => $context['token'], 'requestId' => StringHelper::UUID(),
        'documentRevision' => 1, 'blockHash' => WebControllerHarness::stableBlockHash($block),
        'block' => $block, 'destination' => ['kind' => 'root'],
    ]);
    expect($response->getStatusCode())->toBe(200)
        ->and($response->data['html'])->toContain('Immediate row');
    // Resolving the editor must not apply its standalone draft as a side effect.
    expect(\benf\neo\elements\Block::find()->id($neoBlock->id)->draftId($neoBlock->draftId)->status(null)->exists())->toBeTrue();
})->group('matrix-integrations');

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
