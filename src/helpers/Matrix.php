<?php
namespace verbb\vizy\helpers;

use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\Vizy;

use craft\elements\Entry;
use craft\elements\db\EntryQuery;
use craft\helpers\Json;

class Matrix
{
    // Static Methods
    // =========================================================================

    public static function sanitizeMatrixContent($field, $content)
    {
        $entryTypes = array_map(function($block) {
            return $block->handle;
        }, $field->entryTypes);

        $entryTypeFields = [];

        foreach ($field->entryTypes as $entryType) {
            $entryTypeFields[] = $entryType->getCustomFields();
        }

        $blockFields = array_map(function($block) {
            return $block->handle;
        }, array_merge(...$entryTypeFields));

        if (!is_array($content)) {
            $content = [];
        }

        // Craft 5 Matrix fields post `{ entries: ..., sortOrder: ... }`.
        if (self::isCraft5MatrixContent($content)) {
            return $content;
        }

        // Handle legacy blocks, which are structured differently
        if (isset($content['blocks'])) {
            $content['blocks'] = self::filterContent($content['blocks'], $entryTypes, $blockFields);
        } else {
            $content = self::filterContent($content, $entryTypes, $blockFields);
        }

        return $content;
    }

    public static function isCraft5MatrixContent(mixed $content): bool
    {
        return is_array($content) && isset($content['entries']);
    }

    public static function ensureSortOrder(array $content): array
    {
        if (!self::isCraft5MatrixContent($content)) {
            return $content;
        }

        $sortOrder = $content['sortOrder'] ?? [];

        if (!is_array($sortOrder)) {
            $sortOrder = [];
        }

        foreach (array_keys($content['entries']) as $entryKey) {
            $uid = str_starts_with($entryKey, 'uid:') ? substr($entryKey, 4) : $entryKey;

            if (!in_array($uid, $sortOrder, true) && !in_array($entryKey, $sortOrder, true)) {
                $sortOrder[] = $uid;
            }
        }

        $content['sortOrder'] = $sortOrder;

        return $content;
    }

    public static function isMatrix($field): bool
    {
        return $field instanceof \craft\fields\Matrix;
    }

    public static function nestedEntryQuery(\craft\fields\Matrix $field, MatrixAnchor $anchor, bool $forSave = false): EntryQuery
    {
        $query = Entry::find()
            ->fieldId($field->id)
            ->ownerId($anchor->id)
            ->siteId($anchor->siteId)
            ->drafts(null)
            ->status(null)
            ->limit(null);

        if ($forSave) {
            $query->savedDraftsOnly(false);
        } else {
            $query->canonicalsOnly();
        }

        $query->setCachedResult($query->all());

        return $query;
    }

    public static function migrateJsonToAnchor($field, MatrixAnchor $anchor, mixed $content): void
    {
        if ($content === null || $content === '' || $content === []) {
            return;
        }

        if (is_string($content) && Json::isJsonObject($content)) {
            $content = Json::decode($content);
        }

        if (self::isCraft5MatrixContent($content)) {
            $fieldValue = $field->normalizeValueFromRequest($content, $anchor);
        } else {
            $content = self::sanitizeMatrixContent($field, $content);
            $fieldValue = $field->normalizeValue($content, $anchor);
        }

        Vizy::$plugin->getAnchors()->saveMatrixField($field, $anchor, $fieldValue, true);
    }

    private static function filterContent($content, $entryTypes, $blockFields)
    {
        foreach ($content as $blockKey => $block) {
            if (!is_array($block)) {
                unset($content[$blockKey]);

                continue;
            }

            $type = $block['type'] ?? '';
            $fields = $block['fields'] ?? [];

            // We save the UID of the "entry" as the key, so use that as the identifier
            $content[$blockKey]['uid'] = $blockKey;

            // Filter block types against those available
            if ($type && !in_array($type, $entryTypes)) {
                unset($content[$blockKey]);
            }

            // Filter fields within valid blocks against those available
            foreach ($fields as $fieldKey => $field) {
                if (!in_array($fieldKey, $blockFields)) {
                    unset($content[$blockKey]['fields'][$fieldKey]);
                }
            }
        }

        return $content;
    }
}