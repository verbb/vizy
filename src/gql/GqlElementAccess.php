<?php
namespace verbb\vizy\gql;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\helpers\Gql as GqlHelper;

use yii\base\InvalidConfigException;

/**
 * Schema-aware element projection for GraphQL convenience fields.
 *
 * Distinct from trusted Twig resolution ({@see \verbb\vizy\marks\Link::resolveHref}):
 * GraphQL must not return elements or URLs the active schema cannot query.
 * Fail closed (null) when there is no active schema or the entity is out of scope.
 */
final class GqlElementAccess
{
    // Static Methods
    // =========================================================================

    public static function elementByUid(string $uid, string $elementType, ?int $siteId = null): ?ElementInterface
    {
        if ($uid === '' || !self::hasActiveSchema() || !in_array($elementType, [Asset::class, Entry::class, Category::class], true)) {
            return null;
        }

        // Use public-query defaults; the Elements service explicitly includes
        // disabled elements, drafts, and revisions in its UID lookup.
        $element = $elementType::find()->uid($uid)->siteId($siteId)->one();
        if (!$element instanceof $elementType) {
            return null;
        }

        return self::allowsElement($element) ? $element : null;
    }

    public static function assetByUid(string $uid, ?int $siteId = null): ?Asset
    {
        $element = self::elementByUid($uid, Asset::class, $siteId);

        return $element instanceof Asset ? $element : null;
    }

    public static function allowsElement(ElementInterface $element): bool
    {
        if (!self::hasActiveSchema()) {
            return false;
        }

        if (!$element->enabled || !$element->getEnabledForSite() || $element->getIsDerivative() || $element->trashed) {
            return false;
        }
        if ($element instanceof Entry && $element->getStatus() !== Entry::STATUS_LIVE) {
            return false;
        }

        try {
            $site = Craft::$app->getSites()->getSiteById($element->siteId);
            if (!$site || !GqlHelper::isSchemaAwareOf('sites.' . $site->uid)) {
                return false;
            }

            if ($element instanceof Asset) {
                if (!GqlHelper::canQueryAssets()) {
                    return false;
                }
                $volume = $element->getVolume();

                return GqlHelper::isSchemaAwareOf('volumes.' . $volume->uid);
            }

            if ($element instanceof Entry) {
                if (!GqlHelper::canQueryEntries()) {
                    return false;
                }

                // Section-owned entries: section scope. Nested entries: field scope.
                if ($element->sectionId) {
                    $section = $element->getSection();
                    if ($section === null) {
                        return false;
                    }

                    return GqlHelper::isSchemaAwareOf('sections.' . $section->uid);
                }

                if ($element->fieldId) {
                    $field = Craft::$app->getFields()->getFieldById($element->fieldId);
                    if ($field === null) {
                        return false;
                    }

                    return GqlHelper::isSchemaAwareOf('nestedentryfields.' . $field->uid);
                }

                return false;
            }

            if ($element instanceof Category) {
                if (!GqlHelper::canQueryCategories()) {
                    return false;
                }
                $group = $element->getGroup();

                return GqlHelper::isSchemaAwareOf('categorygroups.' . $group->uid);
            }
        } catch (InvalidConfigException) {
            return false;
        }

        // Unknown element types are not projected through Vizy GQL convenience.
        return false;
    }

    public static function hasActiveSchema(): bool
    {
        try {
            Craft::$app->getGql()->getActiveSchema();

            return true;
        } catch (\Throwable) {
            return false;
        }
    }
}
