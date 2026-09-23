<?php

declare(strict_types=1);

use craft\base\Element;
use craft\elements\Entry;
use craft\elements\User;
use craft\enums\PropagationMethod;
use craft\helpers\StringHelper;
use craft\models\EntryType;
use craft\models\FieldLayout;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use craft\services\ElementSources;
use craft\services\ProjectConfig;
use Tests\Support\WebControllerHarness;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldLinkOptions;

function issue226Section(string $name): Section
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
        'type' => Section::TYPE_CHANNEL,
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

it('shows configured custom Entry sources without exposing sources hidden from the current user', function() {
    $allowedSection = issue226Section('Allowed links');
    $restrictedSection = issue226Section('Restricted links');
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
        $owner = new Entry(['siteId' => Craft::$app->getSites()->getPrimarySite()->id]);
        $entryOption = collect(FieldLinkOptions::forField($field, $owner))
            ->firstWhere('elementType', Entry::class);

        expect($entryOption)->not->toBeNull()
            ->and($entryOption['sources'])->toContain('*')
            ->and($entryOption['sources'])->toContain("section:{$allowedSection->uid}")
            ->and($entryOption['sources'])->not->toContain("section:{$restrictedSection->uid}")
            ->and($entryOption['sources'])->toContain($publicCustomSource)
            ->and($entryOption['sources'])->not->toContain($restrictedCustomSource);
    } finally {
        if ($webRequestActive) {
            WebControllerHarness::endWebRequest();
        }
        Craft::$app->set('elementSources', $previousElementSources);
        $nativeSourceCache->setValue(null, $previousNativeSourceCache);
        if ($previousSourceConfig === null) {
            $projectConfig->remove($sourcePath);
        } else {
            $projectConfig->set($sourcePath, $previousSourceConfig);
        }
    }
});
