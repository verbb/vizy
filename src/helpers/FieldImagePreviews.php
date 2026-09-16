<?php
namespace verbb\vizy\helpers;

use Craft;
use craft\elements\Asset;
use craft\helpers\StringHelper;

/**
 * Session preview URLs for Image nodes — canonical JSON never stores `src`.
 *
 * Bootstrap ships a uid → {assetId, url, label} map so NodeViews can paint
 * thumbnails after save/reload without a second round-trip.
 */
final class FieldImagePreviews
{
    // Static Methods
    // =========================================================================

    public static function forDocument(array $document, int $siteId): array
    {
        $uids = [];
        self::_collectAssetUids($document, $uids);
        if ($uids === []) {
            return [];
        }

        $assets = Asset::find()
            ->uid(array_keys($uids))
            ->siteId($siteId)
            ->status(null)
            ->all();

        $previews = [];
        $elements = Craft::$app->getElements();

        foreach ($assets as $asset) {
            if (!$elements->canView($asset)) {
                continue;
            }

            $uid = (string)$asset->uid;
            $url = (string)($asset->getUrl() ?: '');

            $previews[$uid] = [
                'assetId' => (int)$asset->id,
                'url' => $url,
                'label' => (string)($asset->title ?: $asset->filename ?: 'Image'),
                'transform' => '',
            ];
        }

        return $previews;
    }

    private static function _collectAssetUids(mixed $value, array &$uids): void
    {
        if (!is_array($value)) {
            return;
        }

        if (($value['type'] ?? null) === 'image') {
            $assetUid = $value['attrs']['assetUid'] ?? null;
            if (is_string($assetUid) && StringHelper::isUUID($assetUid)) {
                $uids[$assetUid] = true;
            }
        }

        foreach ($value as $child) {
            self::_collectAssetUids($child, $uids);
        }
    }
}
