<?php
namespace verbb\vizy\helpers;

use verbb\vizy\events\RegisterLinkOptionsEvent;
use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\models\CategoryGroup;
use craft\models\Section;
use craft\models\Section_SiteSettings;
use craft\models\Volume;
use craft\services\ElementSources;

use Illuminate\Support\Collection;

/**
 * Craft element link picker options for the live editor (entry / asset / category).
 *
 * Same shape as Vizy 3 field settings `linkOptions`, consumed by Plugin Kit
 * `openCraftElementLinkSelector` helpers on the client.
 */
final class FieldLinkOptions
{
    // Static Methods
    // =========================================================================

    /**

     *   optionTitle: string,
     *   elementType: class-string,
     *   refHandle: string,
     *   sources?: list<string>,
     *   criteria?: array<string, mixed>
     * }>
     */
    public static function forField(VizyField $field, ?ElementInterface $element = null): array
    {
        $linkOptions = [];

        $entrySectionIds = [];
        $entrySources = self::_entrySources($element, $entrySectionIds);
        $assetVolumeIds = [];
        $categoryGroupIds = [];
        $assetSources = self::_assetSources($field, $assetVolumeIds);
        $categorySources = self::_categorySources($element, $categoryGroupIds);

        if ($entrySources !== []) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to an entry'),
                'elementType' => Entry::class,
                'refHandle' => Entry::refHandle(),
                'sources' => $entrySources,
                // Craft's aggregate `singles` and custom sources can include
                // entries from sections the current user cannot view. Keep the
                // modal query inside the same section permission boundary as
                // the native sources exposed below.
                'criteria' => [
                    'uri' => ':notempty:',
                    'sectionId' => $entrySectionIds,
                ],
            ];
        }

        if ($assetSources !== []) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to an asset'),
                'elementType' => Asset::class,
                'refHandle' => Asset::refHandle(),
                'sources' => $assetSources,
                'criteria' => ['volumeId' => $assetVolumeIds],
            ];
        }

        if ($categorySources !== []) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to a category'),
                'elementType' => Category::class,
                'refHandle' => Category::refHandle(),
                'sources' => $categorySources,
                'criteria' => ['groupId' => $categoryGroupIds],
            ];
        }

        $event = new RegisterLinkOptionsEvent([
            'linkOptions' => $linkOptions,
        ]);
        $field->trigger(VizyField::EVENT_REGISTER_LINK_OPTIONS, $event);
        $linkOptions = $event->linkOptions;

        foreach ($linkOptions as &$linkOption) {
            if (!isset($linkOption['refHandle'])) {
                $class = $linkOption['elementType'];
                $linkOption['refHandle'] = $class::refHandle() ?? $class;
            }
        }
        unset($linkOption);

        return array_values($linkOptions);
    }

    private static function _entrySources(?ElementInterface $element, array &$sectionIds): array
    {
        $sources = [];
        $sectionIds = [];
        $showSingles = false;
        $canViewEveryLinkableSection = $element !== null;
        $sections = Craft::$app->getEntries()->getAllSections();
        $sites = Craft::$app->getSites()->getAllSites();
        $user = Craft::$app->getUser();

        foreach ($sections as $section) {
            $sectionSiteSettings = $section->getSiteSettings();
            $hasUrls = Collection::make($sectionSiteSettings)
                ->contains(fn(Section_SiteSettings $settings) => $settings->hasUrls);
            if (!$hasUrls) {
                continue;
            }
            if (!$element || !$user->checkPermission("viewEntries:$section->uid")) {
                $canViewEveryLinkableSection = false;
                continue;
            }
            $sectionIds[] = $section->id;
            if ($section->type === Section::TYPE_SINGLE) {
                $showSingles = true;
                continue;
            }
            foreach ($sites as $site) {
                if (isset($sectionSiteSettings[$site->id]) && $sectionSiteSettings[$site->id]->hasUrls) {
                    $sources[] = 'section:' . $section->uid;
                }
            }
        }

        $sources = array_values(array_unique($sources));
        $sectionIds = array_values(array_unique($sectionIds));

        if ($showSingles) {
            array_unshift($sources, 'singles');
        }
        if ($canViewEveryLinkableSection && $sectionIds !== []) {
            array_unshift($sources, '*');
        }

        // Custom sources are filtered by Craft's user/group policy. Native
        // section sources are filtered explicitly above because Craft 5.9 and
        // later differ in which context applies that permission. The aggregate
        // source is safe only when every linkable section is permitted.
        return array_values(array_unique(array_merge($sources, self::_customSources(Entry::class))));
    }

    private static function _categorySources(?ElementInterface $element, array &$groupIds): array
    {
        $groupIds = [];
        if (!$element) {
            return [];
        }

        $groups = Collection::make(Craft::$app->getCategories()->getAllGroups())
            ->filter(fn(CategoryGroup $group) =>
                Craft::$app->getUser()->checkPermission("viewCategories:$group->uid") &&
                ($group->getSiteSettings()[$element->siteId]?->hasUrls ?? false)
            );
        $groupIds = $groups->map(fn(CategoryGroup $group) => (int)$group->id)->values()->all();
        $sources = $groups
            ->map(fn(CategoryGroup $group) => "group:$group->uid")
            ->values()
            ->all();

        $customSources = self::_customSources(Category::class);

        return $customSources !== [] ? array_merge($sources, $customSources) : $sources;
    }

    private static function _assetSources(VizyField $field, array &$volumeIds): array
    {
        $volumeIds = [];
        if (!$field->availableVolumes) {
            return [];
        }

        $volumes = Collection::make(Craft::$app->getVolumes()->getAllVolumes());

        if (is_array($field->availableVolumes)) {
            $volumes = $volumes->filter(
                fn(Volume $volume) => in_array($volume->uid, $field->availableVolumes, true),
            );
        }

        if (!$field->showUnpermittedVolumes) {
            $userService = Craft::$app->getUser();
            $volumes = $volumes->filter(
                fn(Volume $volume) => $userService->checkPermission("viewAssets:$volume->uid"),
            );
        }

        $volumeIds = $volumes->map(fn(Volume $volume) => (int)$volume->id)->values()->all();
        $sources = $volumes
            ->map(fn(Volume $volume) => "volume:$volume->uid")
            ->values()
            ->all();

        $customSources = self::_customSources(Asset::class);

        return $customSources !== [] ? array_merge($sources, $customSources) : $sources;
    }

    private static function _customSources(string $elementType): array
    {
        $customSources = [];
        // Craft deliberately applies custom-source user-group restrictions in
        // index context only; modal context returns the raw configuration.
        $elementSources = Craft::$app->getElementSources()->getSources($elementType);

        foreach ($elementSources as $elementSource) {
            if (($elementSource['type'] ?? null) === ElementSources::TYPE_CUSTOM && isset($elementSource['key'])) {
                $customSources[] = $elementSource['key'];
            }
        }

        return $customSources;
    }
}
