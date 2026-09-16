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

        $entrySources = self::_entrySources($element);
        $assetSources = self::_assetSources($field);
        $categorySources = self::_categorySources($element);

        if ($entrySources !== []) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to an entry'),
                'elementType' => Entry::class,
                'refHandle' => Entry::refHandle(),
                'sources' => $entrySources,
                'criteria' => ['uri' => ':notempty:'],
            ];
        }

        if ($assetSources !== []) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to an asset'),
                'elementType' => Asset::class,
                'refHandle' => Asset::refHandle(),
                'sources' => $assetSources,
            ];
        }

        if ($categorySources !== []) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('vizy', 'Link to a category'),
                'elementType' => Category::class,
                'refHandle' => Category::refHandle(),
                'sources' => $categorySources,
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

    private static function _entrySources(?ElementInterface $element, bool $showSingles = false): array
    {
        $sources = [];
        $sections = Craft::$app->getEntries()->getAllSections();
        $sites = Craft::$app->getSites()->getAllSites();

        foreach ($sections as $section) {
            if ($section->type === Section::TYPE_SINGLE) {
                $showSingles = true;
                continue;
            }
            if (!$element) {
                continue;
            }
            $sectionSiteSettings = $section->getSiteSettings();
            foreach ($sites as $site) {
                if (isset($sectionSiteSettings[$site->id]) && $sectionSiteSettings[$site->id]->hasUrls) {
                    $sources[] = 'section:' . $section->uid;
                }
            }
        }

        $sources = array_values(array_unique($sources));

        if ($showSingles) {
            array_unshift($sources, 'singles');
        }

        if ($sources !== []) {
            array_unshift($sources, '*');
        }

        $sources = array_values(array_unique($sources));
        $customSources = self::_customSources(Entry::class);

        return $customSources !== [] ? array_merge($sources, $customSources) : $sources;
    }

    private static function _categorySources(?ElementInterface $element): array
    {
        if (!$element) {
            return [];
        }

        $sources = Collection::make(Craft::$app->getCategories()->getAllGroups())
            ->filter(fn(CategoryGroup $group) => $group->getSiteSettings()[$element->siteId]?->hasUrls ?? false)
            ->map(fn(CategoryGroup $group) => "group:$group->uid")
            ->values()
            ->all();

        $customSources = self::_customSources(Category::class);

        return $customSources !== [] ? array_merge($sources, $customSources) : $sources;
    }

    private static function _assetSources(VizyField $field): array
    {
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
        $elementSources = Craft::$app->getElementSources()->getSources($elementType, 'modal');

        foreach ($elementSources as $elementSource) {
            if (($elementSource['type'] ?? null) === ElementSources::TYPE_CUSTOM && isset($elementSource['key'])) {
                $customSources[] = $elementSource['key'];
            }
        }

        return $customSources;
    }
}
