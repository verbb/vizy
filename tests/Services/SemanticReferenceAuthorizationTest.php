<?php

declare(strict_types=1);

use craft\elements\Entry;
use craft\elements\User;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use Tests\Support\Fixtures\AssetSpikeFixture;
use Tests\Support\Fixtures\VizyFixtureFactory;
use verbb\vizy\document\DocumentParser;
use verbb\vizy\document\InvalidDocumentException;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\fields\VizyField;
use verbb\vizy\models\BlockType;

function semanticReferenceActor(array $permissions = []): User
{
    $actor = new User([
        'username' => 'semanticreference' . StringHelper::randomString(6),
        'email' => StringHelper::randomString(8) . '@example.test',
        'active' => true,
        'pending' => false,
    ]);
    $actor->newPassword = 'Testing1!';
    expect(Craft::$app->getElements()->saveElement($actor))->toBeTrue();

    Craft::$app->getUserPermissions()->reset();
    Craft::$app->getUserPermissions()->saveUserPermissions($actor->id, [
        'accessCp',
        'editSite:' . Craft::$app->getSites()->getPrimarySite()->uid,
        ...$permissions,
    ]);

    return $actor;
}

function semanticReferenceOwner(): Entry
{
    return new class([
        'title' => 'Semantic reference owner',
        'siteId' => Craft::$app->getSites()->getPrimarySite()->id,
    ]) extends Entry {
        public mixed $testFieldValue = null;

        public function getFieldValue(string $fieldHandle): mixed
        {
            return $this->testFieldValue;
        }
    };
}

function semanticReferenceDocument(VizyField $field, Entry $owner, array $content): VizyDocument
{
    return (new DocumentParser())->parse([
        'type' => 'doc',
        'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
        'content' => $content,
    ], $owner, $field);
}

function semanticReferenceAsset(string $filename = 'private-reference.txt'): array
{
    $asset = AssetSpikeFixture::createTempAsset($filename, 'private');
    $volume = AssetSpikeFixture::volume();
    $folder = Craft::$app->getAssets()->getRootFolderByVolumeId($volume->id);
    expect(Craft::$app->getAssets()->moveAsset($asset, $folder))->toBeTrue();

    return [$asset, $volume];
}

function semanticReferenceField(string $volumeUid): VizyField
{
    return new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Authorized references',
        'handle' => 'authorizedReferences' . StringHelper::randomString(6),
        'editorConfig' => 'standard',
        'availableVolumes' => [$volumeUid],
    ]);
}

beforeEach(function() {
    AssetSpikeFixture::ensureAdminUser();
});

afterEach(function() {
    AssetSpikeFixture::ensureAdminUser();
});

it('rejects a new semantic image reference the current author cannot view', function() {
    [$asset, $volume] = semanticReferenceAsset('forged-private-image.txt');
    $field = semanticReferenceField($volume->uid);
    $owner = semanticReferenceOwner();
    $owner->testFieldValue = semanticReferenceDocument($field, $owner, [[
        'type' => 'image',
        'attrs' => ['assetUid' => $asset->uid],
    ]]);

    Craft::$app->getUser()->setIdentity(semanticReferenceActor());
    $field->validateBlocks($owner);

    expect(implode(' ', $owner->getErrors($field->handle)))
        ->toContain('unavailable for this field or user');
});

it('allows an authorized author to add an asset from a configured volume', function() {
    [$asset, $volume] = semanticReferenceAsset('permitted-image.txt');
    $field = semanticReferenceField($volume->uid);
    $owner = semanticReferenceOwner();
    $owner->testFieldValue = semanticReferenceDocument($field, $owner, [[
        'type' => 'image',
        'attrs' => ['assetUid' => $asset->uid],
    ]]);
    $actor = semanticReferenceActor([
        "viewAssets:$volume->uid",
        "viewPeerAssets:$volume->uid",
    ]);

    Craft::$app->getUser()->setIdentity($actor);
    $field->validateBlocks($owner);

    expect($owner->getErrors($field->handle))->toBe([]);
});

it('grandfathers counted historical references but checks copied occurrences', function() {
    [$asset, $volume] = semanticReferenceAsset('historical-image.txt');
    $field = semanticReferenceField(StringHelper::UUID());
    $owner = semanticReferenceOwner();
    $image = [
        'type' => 'image',
        'attrs' => ['assetUid' => $asset->uid],
    ];
    $baseline = semanticReferenceDocument($field, $owner, [$image]);

    Craft::$app->getUser()->setIdentity(semanticReferenceActor());
    $owner->testFieldValue = semanticReferenceDocument($field, $owner, [$image]);
    $field->validateBlocks($owner, $baseline);
    expect($owner->getErrors($field->handle))->toBe([]);

    $owner->testFieldValue = semanticReferenceDocument($field, $owner, [$image, $image]);
    $field->validateBlocks($owner, $baseline);
    expect(implode(' ', $owner->getErrors($field->handle)))
        ->toContain('unavailable for this field or user');
});

it('requires each Asset permission override independently', function() {
    [$asset, $volume] = semanticReferenceAsset('override-image.txt');
    $field = semanticReferenceField($volume->uid);
    $owner = semanticReferenceOwner();
    $owner->testFieldValue = semanticReferenceDocument($field, $owner, [[
        'type' => 'image',
        'attrs' => ['assetUid' => $asset->uid],
    ]]);
    Craft::$app->getUser()->setIdentity(semanticReferenceActor());

    foreach ([[false, false], [true, false], [false, true]] as [$showVolumes, $showFiles]) {
        $owner->clearErrors();
        $field->showUnpermittedVolumes = $showVolumes;
        $field->showUnpermittedFiles = $showFiles;
        $field->validateBlocks($owner);
        expect($owner->getErrors($field->handle))->not->toBe([]);
    }

    $owner->clearErrors();
    $field->showUnpermittedVolumes = true;
    $field->showUnpermittedFiles = true;
    $field->validateBlocks($owner);
    expect($owner->getErrors($field->handle))->toBe([]);

    $owner->clearErrors();
    $field->availableVolumes = [StringHelper::UUID()];
    $field->validateBlocks($owner);
    expect($owner->getErrors($field->handle))->not->toBe([]);
});

it('checks semantic Asset links and legacy image ref tags', function(string $representation) {
    [$asset, $volume] = semanticReferenceAsset("linked-$representation.txt");
    $field = semanticReferenceField($volume->uid);
    $owner = semanticReferenceOwner();
    $baseline = null;

    if ($representation === 'mark') {
        $content = [[
            'type' => 'paragraph',
            'content' => [[
                'type' => 'text',
                'text' => 'Private link',
                'marks' => [[
                    'type' => 'link',
                    'attrs' => ['type' => 'asset', 'targetUid' => $asset->uid],
                ]],
            ]],
        ]];
    } else {
        $image = ['type' => 'image', 'attrs' => ['assetUid' => $asset->uid]];
        $baseline = semanticReferenceDocument($field, $owner, [$image]);
        $content = [$image];

        if ($representation === 'image-link') {
            $content[0]['attrs']['link'] = ['type' => 'asset', 'targetUid' => $asset->uid];
        } elseif ($representation === 'canonical-image-link-ref') {
            $target = VizyFixtureFactory::entry('Private canonical image link');
            $content[0]['attrs']['link'] = ['href' => sprintf('{entry:%s:url}', $target->getRef())];
        } elseif ($representation === 'canonical-class-ref') {
            $content[0]['attrs']['url'] = sprintf('{%s:%s:url}', craft\elements\Asset::class, $asset->id);
        } elseif ($representation === 'canonical-site-ref') {
            $content[0]['attrs']['url'] = sprintf(
                '{asset:%s@%s:url}',
                $asset->id,
                Craft::$app->getSites()->getPrimarySite()->handle,
            );
        } elseif ($representation === 'canonical-ref') {
            $target = VizyFixtureFactory::entry('Private canonical URL');
            $content[0]['attrs']['url'] = sprintf('{entry:%s:url}', $target->getRef());
        } else {
            $content[0]['attrs']['url'] = '#asset:' . $asset->id;
        }
    }

    $owner->testFieldValue = semanticReferenceDocument($field, $owner, $content);
    Craft::$app->getUser()->setIdentity(semanticReferenceActor());
    $field->validateBlocks($owner, $baseline);

    expect(implode(' ', $owner->getErrors($field->handle)))
        ->toContain('unavailable for this field or user');
})->with([
    'mark',
    'image-link',
    'legacy-ref',
    'canonical-ref',
    'canonical-image-link-ref',
    'canonical-class-ref',
    'canonical-site-ref',
]);

it('checks new Entry link targets against the current author', function() {
    $target = VizyFixtureFactory::entry('Private linked entry');
    $field = semanticReferenceField('*');
    $owner = semanticReferenceOwner();
    $owner->testFieldValue = semanticReferenceDocument($field, $owner, [[
        'type' => 'paragraph',
        'content' => [[
            'type' => 'text',
            'text' => 'Private entry',
            'marks' => [[
                'type' => 'link',
                'attrs' => ['type' => 'entry', 'targetUid' => $target->uid],
            ]],
        ]],
    ]]);

    Craft::$app->getUser()->setIdentity(semanticReferenceActor());
    $field->validateBlocks($owner);

    expect(implode(' ', $owner->getErrors($field->handle)))
        ->toContain('unavailable for this field or user');
});

it('checks Hosted references beneath disabled Blocks', function() {
    [$asset, $volume] = semanticReferenceAsset('disabled-hosted-image.txt');
    $nestedField = semanticReferenceField($volume->uid);
    expect(Craft::$app->getFields()->saveField($nestedField))->toBeTrue();

    $layout = new FieldLayout(['uid' => StringHelper::UUID(), 'type' => Block::class]);
    $tab = new FieldLayoutTab(['uid' => StringHelper::UUID(), 'name' => 'Content', 'layout' => $layout]);
    $placement = new CustomField($nestedField);
    $placement->uid = StringHelper::UUID();
    $tab->setElements([$placement]);
    $layout->setTabs([$tab]);
    $type = new BlockType([
        'uid' => StringHelper::UUID(),
        'name' => 'Disabled secure content',
        'handle' => 'disabledSecure' . StringHelper::randomString(6),
    ]);
    $type->setFieldLayout($layout);
    expect(verbb\vizy\Vizy::$plugin->getBlockTypes()->saveBlockType($type))->toBeTrue();
    $type = verbb\vizy\Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($type->uid);

    $rootField = new VizyField([
        'uid' => StringHelper::UUID(),
        'name' => 'Root secure content',
        'handle' => 'rootSecure' . StringHelper::randomString(6),
        'editorConfig' => 'standard',
        'blockTypePickerGroups' => [['name' => 'Content', 'blockTypeUids' => [$type->uid]]],
    ]);
    $owner = semanticReferenceOwner();
    $owner->testFieldValue = semanticReferenceDocument($rootField, $owner, [[
        'type' => 'vizyBlock',
        'attrs' => [
            'blockUid' => StringHelper::UUID(),
            'blockTypeUid' => $type->uid,
            'enabled' => false,
            'fieldSlots' => [$placement->uid => [
                'type' => 'doc',
                'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
                'content' => [[
                    'type' => 'image',
                    'attrs' => ['assetUid' => $asset->uid],
                ]],
            ]],
        ],
    ]]);

    Craft::$app->getUser()->setIdentity(semanticReferenceActor());
    $rootField->validateBlocks($owner);

    expect(implode(' ', $owner->getErrors($rootField->handle)))
        ->toContain('unavailable for this field or user');
});

it('fails closed at database serialization when element validation is skipped', function() {
    [$asset, $volume] = semanticReferenceAsset('validation-disabled-image.txt');
    $field = semanticReferenceField($volume->uid);
    $owner = semanticReferenceOwner();
    $document = semanticReferenceDocument($field, $owner, [[
        'type' => 'image',
        'attrs' => ['assetUid' => $asset->uid],
    ]]);
    Craft::$app->getUser()->setIdentity(semanticReferenceActor());

    expect(fn() => $field->serializeValueForDb($document, $owner))
        ->toThrow(InvalidDocumentException::class, 'unavailable for this field or user');
});

it('preserves trusted console imports while enforcing configured volumes', function() {
    [$asset, $volume] = semanticReferenceAsset('trusted-console-image.txt');
    $field = semanticReferenceField($volume->uid);
    $owner = semanticReferenceOwner();
    $owner->testFieldValue = semanticReferenceDocument($field, $owner, [[
        'type' => 'image',
        'attrs' => ['assetUid' => $asset->uid],
    ]]);
    Craft::$app->getUser()->setIdentity(null);

    $field->validateBlocks($owner);
    expect($owner->getErrors($field->handle))->toBe([]);

    $owner->clearErrors();
    $field->availableVolumes = [StringHelper::UUID()];
    $field->validateBlocks($owner);
    expect($owner->getErrors($field->handle))->not->toBe([]);
});
