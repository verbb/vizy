# Embedded Content

Vizy blocks store their custom fields inside a document. A block is not an independently persisted Craft element. Use the Content API when a migration or module needs to inspect or replace those embedded values without opening the editor or interpreting them through the current field type.

The API reads raw serialised field values and identifies each occurrence by its placement in a field layout. It can follow Vizy documents inside Hyper links and Hyper links inside Vizy blocks when both plugins expose their content adapters. You can also use it with either plugin on its own.

## Choose the Right Operation

Use normal Craft element saves when you want field normalisation, validation, propagation and save hooks. Use the raw Content API for source-data conversion, inspections and focused repairs, especially when field configuration has already changed. Raw operations do not invoke those editing behaviours or validate your replacement through its destination field. Your code must produce the destination's serialised value.

`modifyFieldValues()` targets custom fields inside containers. It does not edit prose, move blocks, change link destinations directly, or replace a top-level Craft field. The same field can appear several times in a layout; its placement UID identifies each occurrence independently of its handle.

## Capture Source Identity

A location map records where a field appears inside your containers. Capture it before replacing a field type, removing a placement, or changing the surrounding configuration.

The following example updates a contact URL stored in a Plain Text field with the handle `contactUrl`. Add that field to a Vizy block layout and save some content containing `https://old.example.test/contact` before trying the example. The snippets belong in a Craft migration or a module's console action; place the `use` imports at the top of your PHP file and the remaining code inside the migration or action method. Replace `contactUrl` with your source field's handle:

```php
use verbb\vizy\Vizy;
use craft\helpers\Json;

$field = Craft::$app->getFields()->getFieldByHandle('contactUrl');
if (!$field) {
    throw new RuntimeException('The source field was not found.');
}

$content = Vizy::$plugin->getContent();
$locations = $content->captureFieldLocations($field->uid);
$snapshot = Json::encode($locations);
```

Keep `$snapshot` with your migration's source metadata if configuration and content run in separate deployments. Reload it with `Json::decode($snapshot)`. The map records root field placements, container layouts and child field placements. It describes the schema, so it does not load every document or link into memory.

If only settings or a field type changed while all UIDs remained intact, you can still capture the map from the current configuration. Once placements or container definitions have been removed, capture from the original configuration instead. The API cannot infer missing historical identities from a matching handle. Keep source value conversion and source-to-destination field placement relocation as separate migrations; replacing a value does not move its storage key.

## Inspect and Replace Values

Continue in the same migration or action. The following transformation replaces one exact source value and leaves everything else alone:

```php
use verbb\vizy\content\Change;

$transform = static function(mixed $raw, array $location): array {
    if ($raw !== 'https://old.example.test/contact') {
        return Change::unchanged();
    }

    return Change::replace('https://example.test/contact');
};

$preview = $content->modifyFieldValues($locations, $transform, [
    'dryRun' => true,
    'batchSize' => 100,
]);
```

Inspect `$preview['matched']` and `$preview['wouldModify']` before applying the conversion. Dry runs execute your callback and check JSON encoding, but do not save content, create checkpoints, synchronise anchors, or invalidate caches. Keep the callback free of external writes; the API cannot undo work performed by arbitrary callback code.

Return `Change::replace(null)`, `Change::replace('')`, `Change::replace([])`, `Change::replace(false)` or `Change::replace(0)` to store that value explicitly. `Change::remove()` removes the embedded field's key. `Change::unchanged()` preserves it, including an existing empty value. Present null values reach the callback; missing keys do not. An identical replacement causes no write.

JSON objects that would otherwise become PHP lists, including `{}` and objects with consecutive numeric keys, reach the callback as `stdClass` values. This keeps them distinct from JSON arrays: `Change::replace([])` stores an array, while `Change::replace(new \stdClass())` stores an empty object. Other JSON objects use associative arrays.

A selected field's value is opaque to the traversal. If that field is itself a container, your callback receives the whole value; it is not independently transformed again as part of that same selection. Fields on other container paths still recurse through their own adapters. Ordinary custom-field JSON is never searched just because it resembles a document.

## Apply Within a Transaction

Pass the same connection used by your migration. Write mode requires an active transaction and does not commit it:

```php
$db = Craft::$app->getDb();
$result = $db->transaction(static function() use ($content, $locations, $transform, $db): array {
    return $content->modifyFieldValues($locations, $transform, [
        'db' => $db,
        'batchSize' => 100,
    ]);
});
```

A Craft migration's `safeUp()` already runs within a transaction; call `modifyFieldValues()` directly with `$this->db` there. Let exceptions propagate so the caller rolls back earlier changes. The API checks that each source row still matches before writing it and throws on a conflicting edit. It writes each changed row once, retaining unrelated content and container identities. Untouched values retain their JSON object shapes; rewritten JSON may have different whitespace.

`matched` counts values visited, `wouldModify` counts selected values changed, `modified` counts persisted rows, and `rows` counts rows that would change, including in preview mode. `lastRowId` reports the last scanned row. Scanning uses ordered batches rather than loading the complete dataset. `afterRowId` can resume a caller-managed scan; retain checkpoints only after the corresponding transaction commits. Batching bounds memory, but does not automatically commit each batch.

After the outer transaction commits, element caches are invalidated. Reload element objects already held by your code before reading their fields again. Search indexes, third-party relations and other derived data are your migration's responsibility. No revisions, cross-site propagation or field save hooks run as a side effect.

To verify the example, rerun the dry run after committing. `wouldModify` should be `0`, because the selected values no longer contain the old contact URL. Load an affected entry again and check that its embedded contact field contains `https://example.test/contact`.

## Understand Location and Scope

The callback's `$location` contains `rowId`, `elementId`, `elementType`, `siteId`, `rootFieldUid`, `rootPlacementUid`, `rootLayoutUid`, `containerFieldUid`, `fieldUid`, `placementUid`, `layoutUid` and `path`. Each path segment identifies its Vizy block or Hyper link and field placement. The initial persisted path item identifies the root field placement. Use the structured path for reporting and narrowing a callback, not as a writable JSON path.

`hasDurableOwner` is false for these embedded custom fields. `elementId` identifies the persisted element containing the document or link collection. It does not turn the selected field into an ordinary field on that element. Never create relation rows for an embedded field using its parent's ID or a synthetic block/link ID. Vizy Matrix anchors do not change this distinction.

Stored scans include all sites, disabled owners and blocks, drafts, revisions and recoverable trash by default. Context includes `enabled`, `trashed`, `draftId` and `revisionId`. Use `elementIds` and `siteIds` to narrow the scan; an empty array selects nothing. Set `includeDisabled`, `includeDrafts`, `includeRevisions` or `includeTrashed` to false to exclude those owners. The disabled option checks both the element and its site row. Deleted rows that no longer exist cannot be inspected.

Owner IDs select exact persisted elements. Matrix child Entries are separate durable owners; include their IDs explicitly when narrowing a scan. The API does not automatically expand a parent ID into its descendants. A Vizy field stored on a Matrix Entry is discovered like any other persisted Vizy field, and its embedded fields still have no independent durable owner.

## Work with an Unsaved Value

A host plugin or module can transform a value and persist it through its own API. In this partial example, supply `$rawContainerValue` as the container's serialised value and `$containerFieldUid` as its field UID from the captured map. Reuse `$locations` and `$transform` from the earlier examples:

```php
$result = $content->transformValue(
    $rawContainerValue,
    $containerFieldUid,
    $locations,
    $transform,
);
$updatedContainerValue = $result['value'];
```

The result also includes `matched` and `changed`. Optional context can provide an owner/site and an existing `path`; without it, owner IDs are null. This operation never writes. The enclosing content system takes the updated value and persists it through its own API.

## Container Adapters

For another container field, obtain `$engine = $content->rawContent()` and register an adapter with `$engine->registerAdapter(MyField::class, $adapter)`. Use that same engine to capture and execute the map. The adapter must expose `fieldClass()`, `captureSchema($field)` and `transform($raw, $schema, $visit)`.

Adapters exchange JSON-serialisable arrays across plugin boundaries. `captureSchema()` returns a `types` map; each container type maps stored placement keys to `fieldUid`, `placementUid` and `layoutUid`. Additional adapter-specific provenance may accompany `types`. `transform()` visits only fields its captured schema identifies, calling `$visit($rawFieldValue, $placement, $pathSegment)`, applies the returned Change operation and returns the updated container value. It must preserve unrelated data and its original container encoding. Registered adapters are required again when executing a saved map; unavailable required adapters cause an exception.

Vizy and Hyper register their available adapters automatically, so you only need to register an adapter when integrating another container field type.
