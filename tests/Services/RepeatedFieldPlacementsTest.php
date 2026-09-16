<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\WebControllerHarness;
use verbb\vizy\fields\VizyField;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\models\BlockType;
use verbb\vizy\Vizy;

function repeatedVizyPlacements(): array
{
    AssetSpikeFixture::ensureAdminUser();
    $suffix = StringHelper::randomString(8);
    $field = new VizyField(['name' => 'Repeated Vizy', 'handle' => 'repeatedVizy' . $suffix]);
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    $site = Craft::$app->getSites()->getPrimarySite();
    $section = VizyFixtureFactory::multisiteSection($field, 1, [$site]);
    $type = Craft::$app->getEntries()->getEntryTypesBySectionId($section->id)[0];
    $layout = $type->getFieldLayout();
    $tab = $layout->getTabs()[0];
    $tab->setElements([...$tab->getElements(), new CustomField($field, [
        'uid' => StringHelper::UUID(),
        'handle' => 'secondVizy' . $suffix,
    ])]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();
    $owner = new Entry([
        'sectionId' => $section->id,
        'typeId' => $type->id,
        'siteId' => $site->id,
        'title' => 'Repeated ' . $suffix,
        'slug' => 'repeated-' . strtolower($suffix),
    ]);
    $fields = array_map(static fn($placement) => $placement->getField(), $owner->getFieldLayout()->getCustomFieldElements());
    $documents = [];
    foreach ($fields as $index => $placed) {
        $document = Json::decode(VizyFixtureFactory::paragraphDocument('Placement ' . $index));
        $document['content'][0]['content'][0]['marks'] = [['type' => $index === 0 ? 'bold' : 'italic']];
        $documents[] = $document;
        $owner->setFieldValue($placed->handle, $document);
    }
    expect(Craft::$app->getElements()->saveElement($owner, true, false))->toBeTrue();
    return compact('owner', 'fields', 'documents');
}

afterEach(function() {
    Vizy::$plugin->getContentBaselines()->clear();
    Vizy::$plugin->getAssetUploads()->resetRequestStateForTesting();
    Vizy::$plugin->getEditorAcknowledgements()->resetRequestStateForTesting();
});

it('acknowledges each repeated field placement with its own persisted document', function() {
    ['owner' => $owner, 'fields' => $fields, 'documents' => $documents] = repeatedVizyPlacements();
    $transport = [];
    foreach ($fields as $index => $field) {
        $transport = [...$transport, ...WebControllerHarness::transportMetadata(
            'placement-' . $index,
            $field->uid,
            Vizy::$plugin->getEditorContexts()->issue($owner, $field)['token'],
            1,
            1,
            'save',
        )];
    }
    $results = WebControllerHarness::withWebRequest(['vizyTransport' => $transport], 'elements/save', function() use ($owner) {
        expect(Craft::$app->getElements()->saveElement($owner, true, false))->toBeTrue();
        $response = new craft\web\Response(['data' => ['success' => true]]);
        Vizy::$plugin->getEditorAcknowledgements()->augmentResponse(new yii\base\Event(['sender' => $response]));
        return $response->data['vizy']['results'];
    });
    expect($results)->toHaveCount(2);
    foreach ($results as $result) {
        $index = (int)substr($result['editorId'], -1);
        expect($result['canonicalDocument'])->toBe($documents[$index]);
    }
});

it('signs the actual placement and preserves its own unchanged disabled marks', function() {
    ['owner' => $owner, 'fields' => $fields, 'documents' => $documents] = repeatedVizyPlacements();
    $config = 'repeated-empty-' . StringHelper::randomString(6);
    Vizy::$plugin->getEditorConfigs()->saveConfig($config, [
        'label' => 'No marks', 'capabilities' => ['nodes' => [], 'marks' => []],
        'toolbar' => [], 'bubble' => ['enabled' => false, 'items' => []],
    ]);
    Vizy::$plugin->getContentBaselines()->clear();
    foreach ($fields as $index => $field) {
        $context = Vizy::$plugin->getEditorContexts()->issue($owner, $field);
        expect($context['ownerPlacementUid'])->toBe($field->layoutElement->uid)
            ->and(Vizy::$plugin->getContentBaselines()->document($owner, $field)?->toArray())->toBe($documents[$index]);
        $field->editorConfig = $config;
        $field->validateBlocks($owner);
    }
    expect($owner->getErrors())->toBe([]);
    $changed = $documents[1];
    $changed['content'][0]['content'][0]['text'] = 'New disabled content';
    $owner->setFieldValue($fields[1]->handle, $changed);
    $fields[1]->validateBlocks($owner);
    expect($owner->getErrors())->not->toBe([]);
});

function repeatedPlacementBlockType(array $placements): BlockType
{
    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $layout->setTabs([new FieldLayoutTab(['layout' => $layout, 'name' => 'Content', 'elements' => $placements])]);
    $type = new BlockType(['uid' => StringHelper::UUID(), 'name' => 'Repeated content', 'handle' => 'repeat' . StringHelper::randomString(8)]);
    $type->setFieldLayout($layout);
    expect(Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    return Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);
}

function allowRepeatedPlacementBlockType(array $fields, BlockType $type): void
{
    foreach ($fields as $field) {
        $field->editorMode = VizyField::MODE_COMBINED;
        $field->blockTypePickerGroups = [['name' => 'Content', 'blockTypeUids' => [$type->uid]]];
    }
    $global = Craft::$app->getFields()->getFieldByUid($fields[0]->uid);
    $global->editorMode = VizyField::MODE_COMBINED;
    $global->blockTypePickerGroups = $fields[0]->blockTypePickerGroups;
    expect(Craft::$app->getFields()->saveField($global))->toBeTrue();
}

it('renders and rechecks repeated Hosted placements beneath the second root placement', function() {
    ['owner' => $owner, 'fields' => $fields] = repeatedVizyPlacements();
    $nested = new VizyField(['name' => 'Nested repeat', 'handle' => 'nestedRepeat' . StringHelper::randomString(8)]);
    expect(Craft::$app->getFields()->saveField($nested))->toBeTrue();
    $type = repeatedPlacementBlockType([
        new CustomField($nested, ['uid' => StringHelper::UUID()]),
        new CustomField($nested, ['uid' => StringHelper::UUID(), 'handle' => 'nestedSecond' . StringHelper::randomString(8)]),
    ]);
    allowRepeatedPlacementBlockType($fields, $type);
    $slots = [];
    foreach ($type->getFieldLayout()->getCustomFieldElements() as $index => $placement) {
        $slots[$placement->uid] = Json::decode(VizyFixtureFactory::paragraphDocument('Hosted ' . $index));
    }
    $document = VizyDocument::fromCanonicalData([
        'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
        'content' => [['type' => 'vizyBlock', 'attrs' => [
            'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $type->uid, 'enabled' => true, 'fieldSlots' => $slots,
        ]]],
    ], $owner, $fields[1]);
    WebControllerHarness::withWebRequest([], 'elements/save', function() use ($owner, $fields, $document, $slots) {
        $html = $fields[1]->getInputHtml($document, $owner);
        preg_match('/<template\b[^>]*data-vizy-bootstrap[^>]*>(.*?)<\/template>/s', $html, $rootMatch);
        $root = Json::decode($rootMatch[1]);
        expect($root['initialFieldLayouts'])->toHaveCount(1);
        preg_match_all('/<template\b[^>]*data-vizy-bootstrap[^>]*>(.*?)<\/template>/s', $root['initialFieldLayouts'][0]['html'], $matches);
        expect($matches[1])->toHaveCount(2);
        $controller = new \verbb\vizy\controllers\FieldLayoutController('field-layout', Vizy::$plugin);
        foreach ($matches[1] as $index => $json) {
            $bootstrap = Json::decode($json);
            $context = Vizy::$plugin->getEditorContexts()->verify($bootstrap['editorContextToken']);
            expect($context['ownerPlacementUid'])->toBe($fields[1]->layoutElement->uid)
                ->and($context['hostedPlacementUid'])->toBe(array_keys($slots)[$index])
                ->and($bootstrap['document'])->toBe(array_values($slots)[$index]);
            $resolved = (new ReflectionMethod($controller, '_placedField'))->invoke($controller, $owner, $context);
            expect($resolved->layoutElement->uid)->toBe(array_keys($slots)[$index]);
        }
    });
});

it('keeps failed uploads and retries independent across repeated root placements', function() {
    ['owner' => $owner, 'fields' => $fields] = repeatedVizyPlacements();
    $assetField = AssetSpikeFixture::assetsField('repeated/{id}');
    $type = repeatedPlacementBlockType([new CustomField($assetField, ['uid' => StringHelper::UUID()])]);
    allowRepeatedPlacementBlockType($fields, $type);
    $slot = $type->getFieldLayout()->getCustomFieldElements()[0]->uid;
    $assets = [];
    foreach ($fields as $index => $field) {
        $assets[] = $asset = AssetSpikeFixture::createTempAsset('repeat-' . $index . '.txt', 'Placement ' . $index);
        $owner->setFieldValue($field->handle, [
            'type' => 'doc', 'attrs' => ['schemaVersion' => 2],
            'content' => [['type' => 'vizyBlock', 'attrs' => [
                'blockUid' => StringHelper::UUID(), 'blockTypeUid' => $type->uid, 'enabled' => true, 'fieldSlots' => [$slot => [$asset->id]],
            ]]],
        ]);
    }
    $uploads = Vizy::$plugin->getAssetUploads();
    $uploads->setMoveAssetHandlerForTesting(static fn(): bool => false);
    WebControllerHarness::withWebRequest([], 'elements/save', function() use ($owner) {
        expect(Craft::$app->getElements()->saveElement($owner, true, false))->toBeTrue();
    });
    $before = (new \craft\db\Query())->select(['content', 'dateUpdated'])->from('{{%elements_sites}}')->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])->one();
    $results = array_map(fn($field) => $uploads->resultForOwner($owner, $field), $fields);
    expect($results[0]['status'])->toBe('failed')->and($results[1]['status'])->toBe('failed')
        ->and($results[0]['batchId'])->not->toBe($results[1]['batchId']);
    $uploads->setMoveAssetHandlerForTesting(null);
    foreach ($fields as $index => $field) {
        $document = $owner->getFieldValue($field->handle);
        $initial = Vizy::$plugin->getEditorAcknowledgements()->initialFinalization($document, 'repeat-' . $index);
        expect($initial['finalizationStatus'])->toBe('failed');
        $payload = Vizy::$plugin->getEditorAcknowledgements()->verifyRetryToken($initial['retryToken']);
        expect((int)$payload['batchId'])->toBe($results[$index]['batchId'])
            ->and($payload['ownerPlacementUid'])->toBe($field->layoutElement->uid);
        $response = WebControllerHarness::withWebRequest(['retryToken' => $initial['retryToken']], 'vizy/finalization/retry', function() {
            return (new \verbb\vizy\controllers\FinalizationController('finalization', Vizy::$plugin))->actionRetry();
        });
        expect($response->data['finalizationStatus'])->toBe('complete')
            ->and($response->data['canonicalDocument'])->toBe($document->toArray())
            ->and(AssetSpikeFixture::isTempAsset(Craft::$app->getAssets()->getAssetById($assets[$index]->id)))->toBeFalse();
    }
    expect((new \craft\db\Query())->select(['content', 'dateUpdated'])->from('{{%elements_sites}}')->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])->one())->toBe($before);
});
