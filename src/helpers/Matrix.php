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
            return self::ensureSortOrder($content);
        }

        // Legacy Vizy Matrix data is keyed by temporary identities such as `new1`.
        // Craft only treats those keys as persistent UIDs when they use its delta format;
        // otherwise every normalization pass creates another nested Entry with the same UID.
        $blocks = isset($content['blocks']) ? $content['blocks'] : $content;
        $blocks = self::filterContent($blocks, $entryTypes, $blockFields);
        $entries = [];
        $sortOrder = [];

        foreach ($blocks as $blockKey => $block) {
            $uid = (string)($block['uid'] ?? $blockKey);
            $entries["uid:$uid"] = $block;
            $sortOrder[] = $uid;
        }

        return [
            'entries' => $entries,
            'sortOrder' => $sortOrder,
        ];
    }

    public static function isCraft5MatrixContent(mixed $content): bool
    {
        return is_array($content) && isset($content['entries']);
    }

    /**
     * Whether Matrix content is empty / a no-op payload (portal miss, cleared field, etc.).
     */
    public static function isEmptyMatrixContent(mixed $content): bool
    {
        if ($content === null || $content === '' || $content === []) {
            return true;
        }

        if (!is_array($content)) {
            return false;
        }

        if (self::isCraft5MatrixContent($content)) {
            $entries = $content['entries'] ?? [];
            $sortOrder = $content['sortOrder'] ?? [];

            return (!is_array($entries) || $entries === []) && (!is_array($sortOrder) || $sortOrder === []);
        }

        // Legacy block map with no usable blocks
        foreach ($content as $key => $block) {
            if ($key === 'blocks' && is_array($block)) {
                return $block === [];
            }

            if (is_array($block) && (($block['type'] ?? '') !== '' || ($block['fields'] ?? []) !== [])) {
                return false;
            }
        }

        return true;
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

        // A repeated entry ID makes Craft normalize the same nested entry more than once,
        // while persistence can still produce only one row for that ID. Preserve the first
        // position so malformed stored JSON heals without guessing from entry content.
        $deduplicated = [];
        $seen = [];

        foreach ($sortOrder as $entryId) {
            if (!is_string($entryId) && !is_int($entryId)) {
                $deduplicated[] = $entryId;

                continue;
            }

            $identity = (string)$entryId;

            if (str_starts_with($identity, 'uid:')) {
                $identity = substr($identity, 4);
            }

            if (isset($seen[$identity])) {
                continue;
            }

            $seen[$identity] = true;
            $deduplicated[] = $entryId;
        }

        foreach (array_keys($content['entries']) as $entryKey) {
            $entryKey = (string)$entryKey;
            $uid = str_starts_with($entryKey, 'uid:') ? substr($entryKey, 4) : $entryKey;

            if (!isset($seen[$uid])) {
                $seen[$uid] = true;
                $deduplicated[] = $uid;
            }
        }

        $content['sortOrder'] = $deduplicated;

        return $content;
    }

    /**
     * @return string[]
     */
    public static function duplicateSortOrderIds(mixed $content): array
    {
        if (is_string($content) && Json::isJsonObject($content)) {
            $content = Json::decode($content);
        }

        if (!self::isCraft5MatrixContent($content) || !is_array($content['sortOrder'] ?? null)) {
            return [];
        }

        $seen = [];
        $duplicates = [];

        foreach ($content['sortOrder'] as $entryId) {
            if (!is_string($entryId) && !is_int($entryId)) {
                continue;
            }

            $identity = (string)$entryId;

            if (str_starts_with($identity, 'uid:')) {
                $identity = substr($identity, 4);
            }

            if (isset($seen[$identity])) {
                $duplicates[$identity] = $identity;
            } else {
                $seen[$identity] = true;
            }
        }

        return array_values($duplicates);
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

        $query->setCachedResult(self::deduplicateEntriesByUid($query->all()));

        return $query;
    }

    /**
     * Collapse legacy migration duplicates while preserving their first logical position.
     * The newest element row wins, matching Craft's own `indexBy('uid')` normalization.
     *
     * @template T of object
     * @param T[] $entries
     * @return T[]
     */
    public static function deduplicateEntriesByUid(array $entries): array
    {
        $deduplicated = [];
        $positions = [];

        foreach ($entries as $entry) {
            $uid = (string)($entry->uid ?? '');

            if ($uid === '' || !isset($positions[$uid])) {
                if ($uid !== '') {
                    $positions[$uid] = count($deduplicated);
                }

                $deduplicated[] = $entry;

                continue;
            }

            $position = $positions[$uid];
            $current = $deduplicated[$position];

            if ((int)($entry->id ?? 0) > (int)($current->id ?? 0)) {
                $deduplicated[$position] = $entry;
            }
        }

        return $deduplicated;
    }

    /**
     * @return string[]
     */
    public static function duplicateNestedEntryUids(\craft\fields\Matrix $field, MatrixAnchor $anchor): array
    {
        $entries = Entry::find()
            ->fieldId($field->id)
            ->ownerId($anchor->id)
            ->siteId($anchor->siteId)
            ->drafts(null)
            ->canonicalsOnly()
            ->status(null)
            ->limit(null)
            ->all();
        $seen = [];
        $duplicates = [];

        foreach ($entries as $entry) {
            $uid = (string)$entry->uid;

            if ($uid === '') {
                continue;
            }

            if (isset($seen[$uid])) {
                $duplicates[$uid] = $uid;
            } else {
                $seen[$uid] = true;
            }
        }

        return array_values($duplicates);
    }

    public static function migrateJsonToAnchor($field, MatrixAnchor $anchor, mixed $content): void
    {
        if (self::isEmptyMatrixContent($content)) {
            return;
        }

        if (is_string($content) && Json::isJsonObject($content)) {
            $content = Json::decode($content);
        }

        if (self::isEmptyMatrixContent($content)) {
            return;
        }

        if (self::isCraft5MatrixContent($content)) {
            $content = self::ensureSortOrder($content);
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
