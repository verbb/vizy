<?php

declare(strict_types=1);

/**
 * Spike C — Assets lifecycle against an ephemeral Block Element (id = null).
 *
 * Proves Asset temp→volume finalization can use the real owner Element after save,
 * without fake Block Element IDs and without serialize-time afterElementSave.
 */

use Craft;
use craft\elements\Asset;
use craft\fieldlayoutelements\CustomField;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use Tests\Support\Spikes\SpikeAssetFinalizer;
use verbb\vizy\elements\Block as VizyBlockElement;

it('removes the global Block field-dirty lie from the canonical adapter', function() {
    $source = file_get_contents(dirname(__DIR__, 2) . '/src/elements/Block.php');
    expect($source)->not->toContain('function isFieldDirty');
});

it('shows Craft Assets upload-folder resolution accepts owners without an element id', function() {
    $assetsSource = file_get_contents(
        Craft::$app->getPath()->getVendorPath() . '/craftcms/cms/src/fields/Assets.php'
    );

    expect($assetsSource)->toContain('!$element->id');
    expect($assetsSource)->toContain('getUserTemporaryUploadFolder');
});

it('can construct an Assets field value on an ephemeral Block without a fake id', function() {
    $field = AssetSpikeFixture::assetsField();
    $owner = VizyFixtureFactory::entry('Asset owner normalize');
    $block = new VizyBlockElement();
    $block->id = null;
    $block->setOwner($owner);

    $normalized = $field->normalizeValue([], $block);

    expect($block->id)->toBeNull();
    expect($normalized)->not->toBeNull();
});

it('creates a real temp asset that Craft classifies as temporary', function() {
    $asset = AssetSpikeFixture::createTempAsset('spike-temp.txt', 'temp-body');

    expect(AssetSpikeFixture::isTempAsset($asset))->toBeTrue();
    expect($asset->volumeId)->toBeNull();
});

it('does not finalize dynamic {id} destinations when only the Block is available', function() {
    $field = AssetSpikeFixture::assetsField('{id}');
    $temp = AssetSpikeFixture::createTempAsset('needs-owner.txt', 'needs-owner');
    $owner = VizyFixtureFactory::entry('Asset owner dynamic');

    $layout = new FieldLayout(['type' => VizyBlockElement::class]);
    $layout->setTabs([
        new FieldLayoutTab([
            'layout' => $layout,
            'name' => 'Content',
            'elements' => [
                [
                    'type' => CustomField::class,
                    'fieldUid' => $field->uid,
                ],
            ],
        ]),
    ]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

    $block = new VizyBlockElement();
    $block->id = null;
    $block->setOwner($owner);
    $block->setFieldLayout($layout);
    $block->setFieldValue($field->handle, [$temp->id]);

    // Craft's private _uploadFolder on the null-id Block falls back to the user temp folder
    // for unresolved {id} tokens — so afterElementSave($block) cannot prove finalization.
    $folder = SpikeAssetFinalizer::uploadFolderForOwner($field, $block);
    expect($folder->volumeId)->toBeNull();
    expect($block->id)->toBeNull();
    expect(AssetSpikeFixture::isTempAsset($temp))->toBeTrue();
});

it('finalizes temp assets onto the volume using the persisted owner while Block id stays null', function() {
    $field = AssetSpikeFixture::assetsField('');
    $temp = AssetSpikeFixture::createTempAsset('finalize-me.txt', 'finalize-body');
    $owner = VizyFixtureFactory::entry('Asset owner finalize');

    expect($owner->id)->not->toBeNull();
    expect(AssetSpikeFixture::isTempAsset($temp))->toBeTrue();

    $layout = new FieldLayout(['type' => VizyBlockElement::class]);
    $layout->setTabs([
        new FieldLayoutTab([
            'layout' => $layout,
            'name' => 'Content',
            'elements' => [
                [
                    'type' => CustomField::class,
                    'fieldUid' => $field->uid,
                ],
            ],
        ]),
    ]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

    $block = new VizyBlockElement();
    $block->id = null;
    $block->setOwner($owner);
    $block->setFieldLayout($layout);
    $block->setFieldValue($field->handle, [$temp->id]);

    // Pure serialize analogue: do not call $field->afterElementSave($block) here.
    $moved = SpikeAssetFinalizer::finalizeBlockAssets($block, $owner, $field);

    expect($block->id)->toBeNull();
    expect($moved)->toContain($temp->id);

    /** @var Asset $reloaded */
    $reloaded = Craft::$app->getAssets()->getAssetById($temp->id);
    expect($reloaded)->not->toBeNull();
    expect(AssetSpikeFixture::isTempAsset($reloaded))->toBeFalse();
    expect($reloaded->volumeId)->toBe(AssetSpikeFixture::volume()->id);
});

it('resolves {id} upload subpaths against the persisted owner, not the Block', function() {
    $field = AssetSpikeFixture::assetsField('{id}');
    $temp = AssetSpikeFixture::createTempAsset('owner-token.txt', 'token-body');
    $owner = VizyFixtureFactory::entry('Asset owner token');

    $layout = new FieldLayout(['type' => VizyBlockElement::class]);
    $layout->setTabs([
        new FieldLayoutTab([
            'layout' => $layout,
            'name' => 'Content',
            'elements' => [
                [
                    'type' => CustomField::class,
                    'fieldUid' => $field->uid,
                ],
            ],
        ]),
    ]);
    expect(Craft::$app->getFields()->saveLayout($layout))->toBeTrue();

    $block = new VizyBlockElement();
    $block->id = null;
    $block->setOwner($owner);
    $block->setFieldLayout($layout);
    $block->setFieldValue($field->handle, [$temp->id]);

    $ownerFolder = SpikeAssetFinalizer::uploadFolderForOwner($field, $owner);
    expect($ownerFolder->volumeId)->toBe(AssetSpikeFixture::volume()->id);
    expect($ownerFolder->path)->toContain((string)$owner->id);

    $moved = SpikeAssetFinalizer::finalizeBlockAssets($block, $owner, $field);

    expect($block->id)->toBeNull();
    expect($moved)->toContain($temp->id);

    $reloaded = Craft::$app->getAssets()->getAssetById($temp->id);
    expect(AssetSpikeFixture::isTempAsset($reloaded))->toBeFalse();
    expect($reloaded->folderPath)->toContain((string)$owner->id);
});
