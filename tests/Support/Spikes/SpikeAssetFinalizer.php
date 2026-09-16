<?php

declare(strict_types=1);

namespace Tests\Support\Spikes;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\fields\Assets as AssetsField;
use craft\models\VolumeFolder;
use ReflectionClass;
use Throwable;
use verbb\vizy\elements\Block as VizyBlockElement;

/**
 * Spike-only proof of explicit post-owner-save Asset finalization.
 *
 * Production lifecycle ownership is deliberately deferred pending a
 * server-owned Asset finalization policy.
 */
class SpikeAssetFinalizer
{
    /**
     * @return list<int>
     */
    public static function finalizeBlockAssets(
        VizyBlockElement $block,
        ElementInterface $owner,
        AssetsField $field,
    ): array {
        if ($block->id !== null) {
            throw new \InvalidArgumentException('Vizy Block Element id must remain null during Asset finalization.');
        }

        if (!$owner->id) {
            throw new \InvalidArgumentException('Owner must be persisted before Asset finalization.');
        }

        /** @var Asset[] $assets */
        $assets = $block->getFieldValue($field->handle)->all();
        if ($assets === []) {
            return [];
        }

        $assetsService = Craft::$app->getAssets();
        $tempIds = array_map(static fn(Asset $asset) => $asset->id, $assets);
        $tempIdMap = array_fill_keys(
            array_map(
                static fn(Asset $asset) => $asset->id,
                $assetsService->createTempAssetQuery()->id($tempIds)->all(),
            ),
            true,
        );

        if ($tempIdMap === []) {
            return [];
        }

        $folder = self::uploadFolderForOwner($field, $owner);
        $moved = [];

        foreach ($assets as $asset) {
            if (!isset($tempIdMap[$asset->id])) {
                continue;
            }

            $asset->avoidFilenameConflicts = true;

            try {
                $assetsService->moveAsset($asset, $folder);
                $moved[] = $asset->id;
            } catch (Throwable $e) {
                Craft::warning('Asset finalization spike move failed: ' . $e->getMessage(), __METHOD__);
                throw $e;
            }
        }

        return $moved;
    }

    public static function uploadFolderForOwner(AssetsField $field, ElementInterface $owner): VolumeFolder
    {
        // The spike intentionally probes Craft's private behavior; production
        // code must not adopt this contract until Asset finalization policy lands.
        $method = (new ReflectionClass($field))->getMethod('_uploadFolder');
        $method->setAccessible(true);

        /** @var VolumeFolder $folder */
        $folder = $method->invoke($field, $owner, true);

        return $folder;
    }
}
