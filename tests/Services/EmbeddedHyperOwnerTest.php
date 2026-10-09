<?php

use craft\db\Query;
use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\MatrixSupportFixture;
use Tests\Support\Fixtures\AssetSpikeFixture;
use verbb\hyper\fields\HyperField;
use verbb\hyper\links\Url;
use verbb\vizy\helpers\EmbeddedOwners;
use verbb\vizy\Vizy;

function embeddedHyperFixture(): array
{
    AssetSpikeFixture::ensureAdminUser();
    if (!Craft::$app->plugins->isPluginInstalled('hyper')) Craft::$app->plugins->installPlugin('hyper');
    $f = new MatrixSupportFixture();
    $url = new Url(['handle' => 'url', 'enabled' => true]);
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Url::class]);
    $layout->setTabs([new FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [new CustomField($f->field)]])]);
    $url->setFieldLayout($layout);
    $hyper = new HyperField(['name' => 'Embedded links', 'handle' => 'embedded' . StringHelper::randomString(8), 'multipleLinks' => true]);
    $hyper->enableCustomLinkTypes();
    $hyper->setLinkTypes([$url->getSettingsConfigForDb()]);
    expect(Craft::$app->fields->saveField($hyper))->toBeTrue();
    $ownerLayout = $f->owner->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($hyper)]);
    expect(Craft::$app->fields->saveLayout($ownerLayout))->toBeTrue();
    $owner = $f->reload();
    $hyper = $owner->getFieldLayout()->getFieldByHandle($hyper->handle);
    $links = [];
    // Identical block UUIDs in different links must still remain independent.
    $blockUid = StringHelper::UUID();
    foreach (['first', 'second'] as $label) {
        $links[] = ['uid' => StringHelper::UUID(), 'linkTypeHandle' => 'url', 'linkValue' => 'https://example.test/' . $label, 'fields' => [
            $f->field->handle => ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [
                $f->block($blockUid, $f->payload([$label . '-one', $label . '-two'])),
            ]],
        ]];
    }
    $owner->setFieldValue($hyper->handle, $links);
    expect(Craft::$app->elements->saveElement($owner))->toBeTrue();
    return [$f, $hyper, $f->reload($owner)];
}

function embeddedHyperLabels($owner, $hyper, $f): array
{
    $values = [];
    foreach ($owner->getFieldValue($hyper->handle)->getLinks() as $link) {
        $document = $link->getFieldValue($f->field->handle);
        $block = $document->content()->blocks(false, null)[0];
        $rows = $document->blockElement($block)->getFieldValue($f->matrix->handle)->all();
        $values[] = array_map(fn($row) => $row->getFieldValue($f->text->handle), $rows);
    }
    return $values;
}

it('embedded Hyper preserves Matrix siblings through save, copy, draft and pure reads without anchors', function() {
    [$f, $hyper, $owner] = embeddedHyperFixture();
    $expected = [['first-one', 'first-two'], ['second-one', 'second-two']];
    expect(embeddedHyperLabels($owner, $hyper, $f))->toBe($expected);
    $count = (new Query())->from('{{%elements}}')->count();
    $hyper->serializeValue($owner->getFieldValue($hyper->handle), $owner);
    expect((new Query())->from('{{%elements}}')->count())->toBe($count);
    expect((int)(new Query())->from(\verbb\vizy\db\Table::MATRIX_ANCHORS)->where(['parentOwnerId' => $owner->id])->count())->toBe(0);
    $copy = Craft::$app->elements->duplicateElement($owner);
    expect(embeddedHyperLabels($f->reload($copy), $hyper, $f))->toBe($expected);
    $links = $copy->getFieldValue($hyper->handle);
    unset($links[0]);
    $copy->setFieldValue($hyper->handle, $links);
    expect(Craft::$app->elements->saveElement($copy))->toBeTrue();
    expect(embeddedHyperLabels($f->reload($copy), $hyper, $f))->toBe([['second-one', 'second-two']]);
    expect(embeddedHyperLabels($f->reload($owner), $hyper, $f))->toBe($expected);
    $draft = Craft::$app->drafts->createDraft($owner, Craft::$app->user->id, 'Embedded draft');
    expect(embeddedHyperLabels($draft, $hyper, $f))->toBe($expected);
})->group('content-api-integration');

it('embedded Hyper binds contexts to the real owner and rejects stale layouts and stale saves', function() {
    [$f, $hyper, $owner] = embeddedHyperFixture();
    $link = $owner->getFieldValue($hyper->handle)->getLinks()[0];
    $field = $link->getFieldLayout()->getFieldByHandle($f->field->handle);
    $context = Vizy::$plugin->getEditorContexts()->issue($link, $field);
    expect($context['ownerId'])->toBe($owner->id)->and($context['ownerClass'])->toBe(Entry::class);
    $resolved = EmbeddedOwners::resolve($owner, $context['embeddedPath']);
    expect($resolved->getOwner()->id)->toBe($owner->id);
    $stale = $context['embeddedPath'];
    $stale[0]['layoutUid'] = StringHelper::UUID();
    expect(fn() => EmbeddedOwners::resolve($owner, $stale))->toThrow(RuntimeException::class, 'staleEmbeddedLayout');
    $token = Vizy::$plugin->getContentVersions()->issue($link, $field);
    $newer = $f->reload($owner);
    $links = $hyper->serializeValue($newer->getFieldValue($hyper->handle), $newer);
    $links[1]['linkValue'] = 'https://example.test/newer';
    $newer->setFieldValue($hyper->handle, $links);
    expect(Craft::$app->elements->saveElement($newer))->toBeTrue();
    $transaction = Craft::$app->db->beginTransaction();
    try {
        expect(fn() => Vizy::$plugin->getContentVersions()->check($link, $field, $token))->toThrow(RuntimeException::class, 'changed after it was opened');
    } finally {
        $transaction->rollBack();
    }
    expect($f->reload($owner)->getFieldValue($hyper->handle)->getLinks()[1]->linkValue)->toBe('https://example.test/newer');
})->group('content-api-integration');

it('embedded Hyper reauthorizes the real owner after editor permissions are revoked', function() {
    [$f, $hyper, $owner] = embeddedHyperFixture();
    $admin = Craft::$app->user->getIdentity();
    $actor = new craft\elements\User(['username' => 'embedded' . StringHelper::randomString(8), 'email' => StringHelper::randomString(12) . '@example.test', 'active' => true, 'pending' => false]);
    $actor->newPassword = 'Testing1!';
    expect(Craft::$app->elements->saveElement($actor))->toBeTrue();
    $owner->setAuthorIds([$actor->id]);
    expect(Craft::$app->elements->saveElement($owner))->toBeTrue();
    $section = $owner->getSection();
    $permissions = ['accessCp', 'editSite:' . $owner->getSite()->uid, 'viewEntries:' . $section->uid, 'saveEntries:' . $section->uid];
    Craft::$app->userPermissions->saveUserPermissions($actor->id, $permissions);
    Craft::$app->user->setIdentity($actor);
    $link = $owner->getFieldValue($hyper->handle)->getLinks()[0];
    $field = $link->getFieldLayout()->getFieldByHandle($f->field->handle);
    $token = Vizy::$plugin->getEditorContexts()->issue($link, $field)['token'];
    Tests\Support\WebControllerHarness::beginWebRequest([], 'vizy/field-layout/render', false);
    try {
        $controller = new verbb\vizy\controllers\FieldLayoutController('field-layout', Vizy::$plugin);
        expect($controller->resolveEditorContext($token)[1]->getOwner()->id)->toBe($owner->id);
        Craft::$app->userPermissions->saveUserPermissions($actor->id, array_slice($permissions, 0, 3));
        expect(fn() => $controller->resolveEditorContext($token))->toThrow(yii\web\ForbiddenHttpException::class);
    } finally {
        Tests\Support\WebControllerHarness::endWebRequest();
        Craft::$app->user->setIdentity($admin);
    }
})->group('content-api-integration');

it('embedded Hyper keeps translated Matrix values independent across sites', function() {
    $sites = Craft::$app->sites;
    $primary = $sites->getPrimarySite();
    $site = new craft\models\Site(['name' => 'Embedded locale ' . StringHelper::randomString(8), 'handle' => 'embeddedLocale' . StringHelper::randomString(8), 'groupId' => $primary->groupId, 'language' => 'fr', 'hasUrls' => false]);
    expect($sites->saveSite($site))->toBeTrue();
    $sites->refreshSites();
    Craft::$app->getIsMultiSite(true, true);
    [$f, $hyper, $owner] = embeddedHyperFixture();
    $hyper->translationMethod = craft\base\Field::TRANSLATION_METHOD_SITE;
    expect(Craft::$app->fields->saveField($hyper))->toBeTrue();
    $target = Entry::find()->id($owner->id)->siteId($site->id)->status(null)->one();
    expect($target)->not->toBeNull();
    $localField = $target->getFieldLayout()->getFieldByHandle($hyper->handle);
    $localField->translationMethod = craft\base\Field::TRANSLATION_METHOD_SITE;
    $links = $localField->serializeValue($target->getFieldValue($hyper->handle), $target);
    $slot = $target->getFieldValue($hyper->handle)->getLinks()[0]->getFieldLayout()->getFieldByHandle($f->field->handle)->layoutElement->uid;
    $doc = Json::decode($links[0]['fields'][$slot]);
    $doc['content'][0]['attrs']['fieldSlots'][$f->placementUid] = $f->payload(['French one', 'French two']);
    $links[0]['fields'][$slot] = $doc;
    $target->setFieldValue($hyper->handle, $links);
    expect(Craft::$app->elements->saveElement($target))->toBeTrue();
    expect(embeddedHyperLabels($f->reload($target), $hyper, $f)[0])->toBe(['French one', 'French two']);
    expect(embeddedHyperLabels($f->reload($owner), $hyper, $f)[0])->toBe(['first-one', 'first-two']);
})->group('content-api-integration');

it('embedded Hyper uses a checked containing Vizy version without accepting stale enclosing saves', function() {
    [$f, $hyper, $owner] = embeddedHyperFixture();
    $placement = new CustomField($hyper);
    $placement->uid = StringHelper::UUID();
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => verbb\vizy\elements\Block::class]);
    $layout->setTabs([new FieldLayoutTab(['name' => 'Content', 'layout' => $layout, 'elements' => [$placement]])]);
    $type = new verbb\vizy\models\BlockType(['uid' => StringHelper::UUID(), 'name' => 'Links', 'handle' => 'links' . StringHelper::randomString(8)]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $outer = new verbb\vizy\fields\VizyField(['name' => 'Outer', 'handle' => 'outer' . StringHelper::randomString(8), 'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$type->uid]]]]);
    expect(Craft::$app->fields->saveField($outer))->toBeTrue();
    $ownerLayout = $owner->getFieldLayout();
    $tab = $ownerLayout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($outer)]);
    expect(Craft::$app->fields->saveLayout($ownerLayout))->toBeTrue();
    $owner = $f->reload($owner);
    $outer = $owner->getFieldLayout()->getFieldByHandle($outer->handle);
    $tree = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => [['type' => 'vizyBlock', 'attrs' => [
        'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $type->uid, 'enabled' => true,
        'fieldSlots' => [$placement->uid => $hyper->serializeValue($owner->getFieldValue($hyper->handle), $owner)],
    ]]]];
    $owner->setFieldValue($outer->handle, $tree);
    expect(Craft::$app->elements->saveElement($owner))->toBeTrue();
    $owner = $f->reload($owner);
    $doc = $owner->getFieldValue($outer->handle);
    $link = $doc->blockElement($doc->content()->blocks(false, null)[0])->getFieldValue($hyper->handle)->getLinks()[0];
    $inner = $link->getFieldLayout()->getFieldByHandle($f->field->handle);
    $versions = Vizy::$plugin->getContentVersions();
    $innerToken = $versions->issue($link, $inner);
    $oldOuterToken = $versions->issue($owner, $outer);
    $tree['content'][0]['attrs']['fieldSlots'][$placement->uid][1]['linkValue'] = 'https://example.test/changed-sibling';
    $owner->setFieldValue($outer->handle, $tree);
    expect(Craft::$app->elements->saveElement($owner))->toBeTrue();
    $owner = $f->reload($owner);
    $doc = $owner->getFieldValue($outer->handle);
    $link = $doc->blockElement($doc->content()->blocks(false, null)[0])->getFieldValue($hyper->handle)->getLinks()[0];
    $newOuterToken = $versions->issue($owner, $outer);
    $transaction = Craft::$app->db->beginTransaction();
    try {
        expect(fn() => $versions->check($link, $inner, $innerToken))->toThrow(RuntimeException::class, 'changed after it was opened');
        expect(fn() => $versions->check($owner, $outer, $oldOuterToken))->toThrow(RuntimeException::class, 'changed after it was opened');
        $versions->check($owner, $outer, $newOuterToken);
        $versions->check($link, $inner, $innerToken);
        expect(true)->toBeTrue();
    } finally {
        $transaction->rollBack();
    }
    $transaction = Craft::$app->db->beginTransaction();
    try {
        expect(fn() => $versions->check($link, $inner, $innerToken))->toThrow(RuntimeException::class, 'changed after it was opened');
    } finally {
        $transaction->rollBack();
    }
})->group('content-api-integration');

it('embedded Hyper drops editor metadata before draft publication creates a revision', function() {
    [$f, $hyper, $owner] = embeddedHyperFixture();
    $section = $owner->getSection();
    $section->enableVersioning = true;
    expect(Craft::$app->entries->saveSection($section))->toBeTrue();
    $draft = Craft::$app->drafts->createDraft($owner, Craft::$app->user->id, 'Versioned embedded draft');
    $link = $draft->getFieldValue($hyper->handle)->getLinks()[0];
    $field = $link->getFieldLayout()->getFieldByHandle($f->field->handle);
    $tree = $link->getFieldValue($field->handle)->toArray();
    $tree['attrs']['_storageToken'] = Vizy::$plugin->getContentVersions()->issue($link, $field);
    $tree['attrs']['_editorId'] = 'embedded-draft-editor';
    $tree['content'][0]['attrs']['fieldSlots'][$f->placementUid] = $f->payload(['edited-one', 'first-two']);
    $link->setFieldValue($field->handle, $tree);
    $draft->setFieldValue($hyper->handle, $draft->getFieldValue($hyper->handle));
    expect(Craft::$app->elements->saveElement($draft))->toBeTrue();
    $persistedLink = $draft->getFieldValue($hyper->handle)->getLinks()[0];
    expect($persistedLink->getFieldValue($field->handle)->toArray()['attrs'])->not->toHaveKey('_storageToken')->not->toHaveKey('_editorId');
    $canonical = Craft::$app->drafts->applyDraft($draft);
    expect(embeddedHyperLabels($f->reload($canonical), $hyper, $f))->toBe([['edited-one', 'first-two'], ['second-one', 'second-two']]);
    expect((int)(new Query())->from('{{%revisions}}')->where(['canonicalId' => $canonical->id])->count())->toBeGreaterThan(0);
})->group('content-api-integration');

it('embedded Hyper keeps the raw Matrix payload free of editor tokens when copying a saved link', function() {
    [$f, $hyper, $owner] = embeddedHyperFixture();
    $rowLayout = $f->rowType->getFieldLayout();
    $tab = $rowLayout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($f->field)]);
    expect(Craft::$app->fields->saveLayout($rowLayout))->toBeTrue();
    $url = $hyper->getLinkTypeByHandle('url');
    $layout = $url->getFieldLayout();
    $layout->getTabs()[0]->setElements([new CustomField($f->matrix)]);
    $url->setFieldLayout($layout);
    $hyper->setLinkTypes([$url->getSettingsConfigForDb()]);
    expect(Craft::$app->fields->saveField($hyper))->toBeTrue();
    Craft::$app->fields->refreshFields();
    $owner = $f->reload($owner);
    $hyper = $owner->getFieldLayout()->getFieldByHandle($hyper->handle);
    $payload = $f->payload(['Container row']);
    $rowKey = array_key_first($payload['entries']);
    $payload['entries'][$rowKey]['fields'][$f->field->handle] = ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => []];
    $owner->setFieldValue($hyper->handle, [['linkTypeHandle' => 'url', 'linkValue' => '/before', 'fields' => [$f->matrix->handle => $payload]]]);
    expect(Craft::$app->elements->saveElement($owner))->toBeTrue();
    $owner = $f->reload($owner);
    $link = $owner->getFieldValue($hyper->handle)->getLinks()[0];
    $row = $link->getFieldValue($f->matrix->handle)->one();
    $field = $row->getFieldLayout()->getFieldByHandle($f->field->handle);
    $document = $row->getFieldValue($field->handle)->toArray();
    $document['attrs']['_storageToken'] = Vizy::$plugin->getContentVersions()->issue($row, $field);
    $document['attrs']['_editorId'] = 'matrix-contained-editor';
    // Mirror browser submission: the link retains the raw row payload as well
    // as the lazily normalized Matrix query used during database serialization.
    $payload['entries'][$rowKey]['fields'][$field->handle] = $document;
    $link->setFieldValue($f->matrix->handle, $payload);
    $link->linkValue = '/after';
    $owner->setFieldValue($hyper->handle, $owner->getFieldValue($hyper->handle));
    expect(Craft::$app->elements->saveElement($owner))->toBeTrue();
    expect($f->reload($owner)->getFieldValue($hyper->handle)->getLinks()[0]->linkValue)->toBe('/after');
    $link = $owner->getFieldValue($hyper->handle)->getLinks()[0];
    expect(Json::encode($link->fields))->not->toContain('_storageToken')->not->toContain('_editorId');
    $copy = Craft::$app->elements->duplicateElement($owner);
    $copied = $f->reload($copy)->getFieldValue($hyper->handle)->getLinks()[0];
    expect($copied->getFieldValue($f->matrix->handle)->one()->getFieldValue($f->text->handle))->toBe('Container row');
})->group('content-api-integration');

it('embedded Hyper preserves raw Matrix content while a Vizy block schema is unavailable', function() {
    [$f, $hyper, $owner] = embeddedHyperFixture();
    $link = $owner->getFieldValue($hyper->handle)->getLinks()[0];
    $raw = $link->getFieldValue($f->field->handle)->toArray();
    $raw['content'][0]['attrs']['blockTypeUid'] = StringHelper::UUID();
    $link->setFieldValue($f->field->handle, $raw);
    $owner->setFieldValue($hyper->handle, $owner->getFieldValue($hyper->handle));
    // Imported content may temporarily lack its schema; preserve its opaque slots.
    expect(Craft::$app->elements->saveElement($owner, false))->toBeTrue();
    $saved = $f->reload($owner)->getFieldValue($hyper->handle)->getLinks()[0]->getFieldValue($f->field->handle)->toArray();
    expect($saved['content'][0]['attrs']['fieldSlots'])->toBe($raw['content'][0]['attrs']['fieldSlots']);
})->group('content-api-integration');
