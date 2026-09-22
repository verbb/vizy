<?php
namespace verbb\vizy\helpers;

use verbb\vizy\Vizy;
use verbb\vizy\document\DeterministicUidFactory;
use verbb\vizy\elements\MatrixAnchor;

use craft\base\ElementInterface;
use craft\elements\db\EntryQuery;
use craft\elements\Entry;
use craft\elements\NestedElementManager;
use craft\helpers\Json;
use craft\helpers\StringHelper;

use Closure;

class Matrix
{
    // Static Methods
    // =========================================================================

    public static function bindToLayout(\craft\fields\Matrix $field): void
    {
        // Craft clones global fields for layout placements, but a warmed Matrix
        // manager still points at the global field (which has no layoutElement).
        // Give the placement its own manager so rebinding cannot alter siblings.
        Closure::bind(static function($field): void {
            if (isset($field->_entryManager) && $field->_entryManager->field !== $field) {
                $source = $field->_entryManager->field;
                $field->_entryManager = clone $field->_entryManager;
                $field->_entryManager->field = $field;
                $field->_entryManager->off(NestedElementManager::EVENT_AFTER_SAVE_ELEMENTS, [$source, 'afterSaveEntries']);
                $field->_entryManager->on(NestedElementManager::EVENT_AFTER_SAVE_ELEMENTS, [$field, 'afterSaveEntries']);
            }
        }, null, \craft\fields\Matrix::class)($field);
    }

    public static function normalizeContent(\craft\fields\Matrix $field, mixed $content, ElementInterface $owner): mixed
    {
        if (is_string($content) && Json::isJsonObject($content)) {
            $content = Json::decode($content);
        }

        // Use the same request/serialized distinction for validation, redisplay,
        // and persistence. Omitted placements are handled by the caller; an
        // explicitly submitted empty value must remain an intentional clear.
        $content = self::sanitizeMatrixContent($field, $content, $owner);
        if (self::isCraft5MatrixContent($content)) {
            return $field->normalizeValueFromRequest(self::ensureSortOrder($content), $owner);
        }

        return $field->normalizeValue($content, $owner);
    }

    public static function sanitizeMatrixContent($field, $content, ?ElementInterface $owner = null)
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

        // Craft's UID delta keys make repeat migration of the same legacy
        // identities update existing rows instead of creating replacement rows.
        $blocks = self::_filterContent($content['blocks'] ?? $content, $entryTypes, $blockFields);
        $entries = [];
        $identities = new DeterministicUidFactory('vizy-matrix:' . ($owner?->uid ?? '') . ':' . $field->uid);
        foreach ($blocks as $key => $block) {
            // Historical payloads can use temporary keys such as "new1".
            // PostgreSQL pads those in Craft's char(36) UID column, so they
            // no longer match the next import. Give them a stable, owner-scoped
            // UUID while preserving genuine legacy UUIDs exactly.
            // Craft's isUUID() only recognises v4; migrated deterministic UIDs
            // are v5-shaped and must also remain unchanged on later imports.
            $key = preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', (string)$key)
                ? (string)$key
                : $identities->uid('row:' . $key);
            $block['uid'] = $key;
            $entries['uid:' . $key] = $block;
        }
        return ['entries' => $entries, 'sortOrder' => array_map(static fn(string $key) => substr($key, 4), array_keys($entries))];
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

        $seen = [];
        $unique = [];
        foreach ($sortOrder as $identity) {
            if (!is_string($identity) && !is_int($identity)) {
                continue;
            }
            $key = preg_replace('/^uid:/', '', (string)$identity);
            if (!isset($seen[$key])) {
                $seen[$key] = true;
                $unique[] = $key;
            }
        }

        foreach (array_keys($content['entries']) as $entryKey) {
            $entryKey = (string)$entryKey;
            $uid = str_starts_with($entryKey, 'uid:') ? substr($entryKey, 4) : $entryKey;

            if (!isset($seen[$uid])) {
                $seen[$uid] = true;
                $unique[] = $uid;
            }
        }

        $content['sortOrder'] = $unique;

        return $content;
    }

    /**
     * Clone a Matrix serialize payload so a copy can land on a new MatrixAnchor
     * without re-parenting the source entries (fresh UIDs, no element ids).
     */
    public static function payloadForIndependentCopy(mixed $content): mixed
    {
        if ($content === null || $content === '' || $content === []) {
            return $content;
        }

        if (is_string($content) && Json::isJsonObject($content)) {
            $content = Json::decode($content);
        }

        if (!is_array($content)) {
            return $content;
        }

        if (self::isCraft5MatrixContent($content)) {
            $entries = is_array($content['entries'] ?? null) ? $content['entries'] : [];
            $nextEntries = [];
            $uidMap = [];
            foreach ($entries as $entryKey => $entry) {
                if (!is_array($entry)) {
                    continue;
                }
                $newUid = StringHelper::UUID();
                $uidMap[(string)$entryKey] = $newUid;
                if (str_starts_with((string)$entryKey, 'uid:')) {
                    $uidMap[substr((string)$entryKey, 4)] = $newUid;
                }
                unset($entry['id'], $entry['ownerId'], $entry['canonicalId']);
                $entry['uid'] = $newUid;
                // Craft request keys prefer bare UIDs; keep values id-less for create.
                $nextEntries[$newUid] = $entry;
            }
            $sortOrder = [];
            foreach (is_array($content['sortOrder'] ?? null) ? $content['sortOrder'] : [] as $item) {
                $key = (string)$item;
                $sortOrder[] = $uidMap[$key] ?? $uidMap['uid:' . $key] ?? StringHelper::UUID();
            }
            if ($sortOrder === [] && $nextEntries !== []) {
                $sortOrder = array_keys($nextEntries);
            }

            return [
                'entries' => $nextEntries,
                'sortOrder' => $sortOrder,
            ];
        }

        $next = [];
        foreach ($content as $blockKey => $block) {
            if (!is_array($block)) {
                continue;
            }
            $newUid = StringHelper::UUID();
            unset($block['id'], $block['ownerId']);
            $block['uid'] = $newUid;
            $next[$newUid] = $block;
        }

        return $next;
    }

    public static function isMatrix($field): bool
    {
        return $field instanceof \craft\fields\Matrix;
    }

    public static function nestedEntryQuery(\craft\fields\Matrix $field, MatrixAnchor $anchor, bool $forSave = false, bool $deduplicate = true): EntryQuery
    {
        $query = Entry::find()
            ->fieldId($field->id)
            // Reuse the trusted owner and its layout instead of reloading it
            // separately for every row's custom field normalization.
            ->owner($anchor)
            ->siteId($anchor->siteId)
            ->drafts(null)
            ->status(null)
            ->limit(null);

        if ($forSave) {
            $query->savedDraftsOnly(false);
        } else {
            // A newly added Matrix row is an unpublished draft with no
            // canonicalId, so canonicalsOnly() alone still exposes it before
            // the containing document has been saved.
            $query->drafts(false)->canonicalsOnly();
        }

        $rows = $query->all();
        $query->setCachedResult($deduplicate ? self::deduplicateEntries($rows) : $rows);

        return $query;
    }

    public static function deduplicateEntries(array $entries): array
    {
        // Older migrations could create multiple element IDs for one UID.
        // Preserve logical order and prefer the newest row, as Craft's UID map
        // does. Callers must scope rows to a single field, owner, and site.
        $result = [];
        $positions = [];
        foreach ($entries as $entry) {
            $uid = (string)$entry->uid;
            if ($uid === '' || !isset($positions[$uid])) {
                if ($uid !== '') {
                    $positions[$uid] = count($result);
                }
                $result[] = $entry;
            } elseif ($entry->id > $result[$positions[$uid]]->id) {
                $result[$positions[$uid]] = $entry;
            }
        }
        return $result;
    }

    public static function migrateJsonToAnchor($field, MatrixAnchor $anchor, mixed $content): void
    {
        if ($content === null || $content === '' || $content === []) {
            return;
        }

        if (is_string($content) && Json::isJsonObject($content)) {
            $content = Json::decode($content);
        }

        $fieldValue = self::normalizeContent($field, $content, $anchor);

        Vizy::$plugin->getAnchors()->saveMatrixField($field, $anchor, $fieldValue, true);
    }

    private static function _filterContent(mixed $content, mixed $entryTypes, mixed $blockFields): mixed
    {
        if (!is_array($content)) {
            return [];
        }
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
