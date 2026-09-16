<?php
namespace verbb\vizy\helpers;

use verbb\vizy\fields\VizyField;

use Craft;
use craft\models\Volume;

use Illuminate\Support\Collection;

/**
 * Asset picker config for Image authoring (volumes + transforms).
 *
 * Mirrors Vizy 3 field settings `volumes` / `transforms` for Craft’s
 * element selector + optional transform menu in the asset modal.
 */
final class FieldImageOptions
{
    // Static Methods
    // =========================================================================

    /**

     *   volumes: list<string>,
     *   transforms: list<array{handle: string, name: string}>,
     *   defaultTransform: string,
     *   defaultSource: string|null
     * }
     */
    public static function forField(VizyField $field): array
    {
        return [
            'volumes' => self::volumes($field),
            'transforms' => self::transforms($field),
            'defaultTransform' => (string)($field->defaultTransform ?? ''),
            'defaultSource' => $field->defaultUploadLocationSource,
        ];
    }

    public static function volumes(VizyField $field): array
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

        return $volumes
            ->map(fn(Volume $volume) => "volume:$volume->uid")
            ->values()
            ->all();
    }

    public static function transforms(VizyField $field): array
    {
        if (!$field->availableTransforms) {
            return [];
        }

        $allTransforms = Craft::$app->getImageTransforms()->getAllTransforms();
        $transformList = [];

        foreach ($allTransforms as $transform) {
            if (!is_array($field->availableTransforms) || in_array($transform->uid, $field->availableTransforms, true)) {
                // Handles/names are JSON bootstrap values — do not HTML-encode
                // (Craft’s modal escapes when building the Select transform menu).
                $transformList[] = [
                    'handle' => (string)$transform->handle,
                    'name' => (string)$transform->name,
                ];
            }
        }

        return $transformList;
    }
}
