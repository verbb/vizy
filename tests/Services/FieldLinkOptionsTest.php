<?php

declare(strict_types=1);

use craft\base\Element;
use craft\elements\Entry;
use craft\elements\User;
use craft\enums\PropagationMethod;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\CategoryGroup;
use craft\models\CategoryGroup_SiteSettings;
use craft\models\FieldLayout;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use craft\services\ElementSources;
use craft\services\ProjectConfig;
use Tests\Support\WebControllerHarness;
use Tests\Support\Fixtures\AssetSpikeFixture;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldLinkOptions;

function issue226Section(string $name, string $type = Section::TYPE_CHANNEL): Section
{
    $suffix = StringHelper::randomString(6);
    $entryType = new EntryType([
        'name' => "$name type $suffix",
        'handle' => "issue226Type$suffix",
    ]);
    $entryType->setFieldLayout(new FieldLayout(['type' => Entry::class]));
    expect(Craft::$app->getEntries()->saveEntryType($entryType))->toBeTrue();

    $section = new Section([
        'name' => "$name $suffix",
        'handle' => "issue226Section$suffix",
        'type' => $type,
        'propagationMethod' => PropagationMethod::All,
        'enableVersioning' => false,
    ]);
    $section->setEntryTypes([$entryType]);
    $section->setSiteSettings(array_map(
        static fn($site): Section_SiteSettings => new Section_SiteSettings([
            'siteId' => $site->id,
            'enabledByDefault' => true,
            'hasUrls' => true,
            'uriFormat' => "issue-226-$suffix/{slug}",
            'template' => '',
        ]),
        Craft::$app->getSites()->getAllSites(),
    ));
    expect(Craft::$app->getEntries()->saveSection($section))->toBeTrue();

    return $section;
}

function issue226CategoryGroup(string $name): CategoryGroup
{
    $suffix = StringHelper::randomString(6);
    $group = new CategoryGroup([
        'name' => "$name $suffix",
        'handle' => "issue226Category$suffix",
    ]);
    $group->setSiteSettings(array_map(
        static fn($site): CategoryGroup_SiteSettings => new CategoryGroup_SiteSettings([
            'siteId' => $site->id,
            'hasUrls' => true,
            'uriFormat' => "issue-226-category-$suffix/{slug}",
            'template' => '',
        ]),
        Craft::$app->getSites()->getAllSites(),
    ));
    expect(Craft::$app->getCategories()->saveGroup($group))->toBeTrue();

    return $group;
}

it('shows configured custom Entry sources without exposing sources hidden from the current user', function() {
    $previousIdentity = Craft::$app->getUser()->getIdentity();
    $allowedSection = issue226Section('Allowed links');
    $restrictedSection = issue226Section('Restricted links');
    $allowedCategoryGroup = issue226CategoryGroup('Allowed categories');
    $restrictedCategoryGroup = issue226CategoryGroup('Restricted categories');
    $allowedVolume = AssetSpikeFixture::volume();
    $actor = new User([
        'username' => 'linkeditor' . StringHelper::randomString(6),
        'email' => StringHelper::randomString(8) . '@example.test',
        'active' => true,
        'pending' => false,
    ]);
    $actor->newPassword = 'Testing1!';
    expect(Craft::$app->getElements()->saveElement($actor))->toBeTrue();
    $permissions = Craft::$app->getUserPermissions();
    // Other integration tests may have populated Craft's permission registry
    // before these fixture sections existed.
    $permissions->reset();
    $permissions->saveUserPermissions($actor->id, [
        'accessCp',
        'editSite:' . Craft::$app->getSites()->getPrimarySite()->uid,
        "viewEntries:{$allowedSection->uid}",
        "viewCategories:{$allowedCategoryGroup->uid}",
        "viewAssets:{$allowedVolume->uid}",
    ]);

    $publicCustomSource = 'custom:' . StringHelper::UUID();
    $restrictedCustomSource = 'custom:' . StringHelper::UUID();
    $projectConfig = Craft::$app->getProjectConfig();
    $sourcePath = ProjectConfig::PATH_ELEMENT_SOURCES . '.' . Entry::class;
    $previousSourceConfig = $projectConfig->get($sourcePath);
    $previousElementSources = Craft::$app->getElementSources();
    $nativeSourceCache = new ReflectionProperty(Element::class, 'sources');
    $previousNativeSourceCache = $nativeSourceCache->getValue();
    $webRequestActive = false;

    try {
        $previousElementSources->saveSources(Entry::class, [
            [
                'type' => ElementSources::TYPE_CUSTOM,
                'key' => $publicCustomSource,
                'label' => 'Public custom source',
                'condition' => Entry::createCondition()->getConfig(),
            ],
            [
                'type' => ElementSources::TYPE_CUSTOM,
                'key' => $restrictedCustomSource,
                'label' => 'Restricted custom source',
                'condition' => Entry::createCondition()->getConfig(),
                'userGroups' => false,
            ],
        ]);

        WebControllerHarness::beginWebRequest([], 'entries/edit', ensureAdmin: false);
        $webRequestActive = true;
        Craft::$app->getUser()->setIdentity($actor);
        Craft::$app->set('elementSources', new ElementSources());
        // Craft memoizes native element sources for the process lifetime, so
        // isolate this fixture from sources populated by earlier tests.
        $currentNativeSourceCache = $previousNativeSourceCache;
        unset($currentNativeSourceCache[Entry::class]);
        $nativeSourceCache->setValue(null, $currentNativeSourceCache);

        $field = new VizyField(['name' => 'Issue 226 links', 'handle' => 'issue226Links']);
        $field->availableVolumes = [$allowedVolume->uid];
        $owner = new Entry(['siteId' => Craft::$app->getSites()->getPrimarySite()->id]);
        $entryOption = collect(FieldLinkOptions::forField($field, $owner))
            ->firstWhere('elementType', Entry::class);
        $categoryOption = collect(FieldLinkOptions::forField($field, $owner))
            ->firstWhere('elementType', \craft\elements\Category::class);
        $assetOption = collect(FieldLinkOptions::forField($field, $owner))
            ->firstWhere('elementType', \craft\elements\Asset::class);

        expect($entryOption)->not->toBeNull()
            ->and($entryOption['sources'])->not->toContain('*')
            ->and($entryOption['sources'])->toContain("section:{$allowedSection->uid}")
            ->and($entryOption['sources'])->not->toContain("section:{$restrictedSection->uid}")
            ->and($entryOption['sources'])->toContain($publicCustomSource)
            ->and($entryOption['sources'])->not->toContain($restrictedCustomSource)
            ->and($entryOption['criteria']['sectionId'])->toContain($allowedSection->id)
            ->and($entryOption['criteria']['sectionId'])->not->toContain($restrictedSection->id)
            ->and($categoryOption)->not->toBeNull()
            ->and($categoryOption['sources'])->toContain("group:{$allowedCategoryGroup->uid}")
            ->and($categoryOption['sources'])->not->toContain("group:{$restrictedCategoryGroup->uid}")
            ->and($categoryOption['criteria']['groupId'])->toContain($allowedCategoryGroup->id)
            ->and($categoryOption['criteria']['groupId'])->not->toContain($restrictedCategoryGroup->id)
            ->and($assetOption['criteria']['volumeId'])->toBe([$allowedVolume->id]);
    } finally {
        if ($webRequestActive) {
            WebControllerHarness::endWebRequest();
        }
        Craft::$app->getUser()->setIdentity($previousIdentity);
        Craft::$app->set('elementSources', $previousElementSources);
        $nativeSourceCache->setValue(null, $previousNativeSourceCache);
        if ($previousSourceConfig === null) {
            $projectConfig->remove($sourcePath);
        } else {
            $projectConfig->set($sourcePath, $previousSourceConfig);
        }
    }
});

it('constrains the aggregate Singles source to sections the current user can view', function() {
    $previousIdentity = Craft::$app->getUser()->getIdentity();
    $allowedSingle = issue226Section('Allowed single', Section::TYPE_SINGLE);
    $restrictedSingle = issue226Section('Restricted single', Section::TYPE_SINGLE);
    $actor = new User([
        'username' => 'singlelinkeditor' . StringHelper::randomString(6),
        'email' => StringHelper::randomString(8) . '@example.test',
        'active' => true,
        'pending' => false,
    ]);
    $actor->newPassword = 'Testing1!';
    expect(Craft::$app->getElements()->saveElement($actor))->toBeTrue();
    $permissions = Craft::$app->getUserPermissions();
    $permissions->reset();
    $permissions->saveUserPermissions($actor->id, [
        'accessCp',
        'editSite:' . Craft::$app->getSites()->getPrimarySite()->uid,
        "viewEntries:{$allowedSingle->uid}",
    ]);

    $webRequestActive = false;
    try {
        WebControllerHarness::beginWebRequest([], 'entries/edit', ensureAdmin: false);
        $webRequestActive = true;
        Craft::$app->getUser()->setIdentity($actor);

        $field = new VizyField(['name' => 'Single links', 'handle' => 'singleLinks']);
        $owner = new Entry(['siteId' => Craft::$app->getSites()->getPrimarySite()->id]);
        $entryOption = collect(FieldLinkOptions::forField($field, $owner))
            ->firstWhere('elementType', Entry::class);

        expect($entryOption)->not->toBeNull()
            ->and($entryOption['sources'])->toContain('singles')
            ->and($entryOption['criteria']['sectionId'])->toContain($allowedSingle->id)
            ->and($entryOption['criteria']['sectionId'])->not->toContain($restrictedSingle->id);
    } finally {
        if ($webRequestActive) {
            WebControllerHarness::endWebRequest();
        }
        Craft::$app->getUser()->setIdentity($previousIdentity);
    }
});

it('keeps the aggregate Entry source when every linkable section is permitted', function() {
    $webRequestActive = false;
    try {
        WebControllerHarness::beginWebRequest([], 'entries/edit');
        $webRequestActive = true;

        $field = new VizyField(['name' => 'Admin links', 'handle' => 'adminLinks']);
        $owner = new Entry(['siteId' => Craft::$app->getSites()->getPrimarySite()->id]);
        $entryOption = collect(FieldLinkOptions::forField($field, $owner))
            ->firstWhere('elementType', Entry::class);

        expect($entryOption)->not->toBeNull()
            ->and($entryOption['sources'])->toContain('*');
    } finally {
        if ($webRequestActive) {
            WebControllerHarness::endWebRequest();
        }
    }
});
