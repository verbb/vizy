# Upgrading from v3


This guide covers upgrading from Vizy 3 to Vizy 4. Review the breaking changes before updating a site, then follow the preparation and content-conversion steps below. Test the upgrade on a staging copy before applying it to your live site.

## Breaking Changes

Vizy 4 changes the field value returned to Twig, the GraphQL schema, and the editor extension APIs. Custom templates, headless queries, and modules using those APIs need to be reviewed. Existing field layouts and content also need **schema promotion**, which records how Vizy 3’s block definitions map to Vizy 4’s shared Block Types.

Do not open and save every entry before promotion and any required content-conversion jobs finish. A field without the required mapping cannot load its old content through the new field API. The sections below explain the affected code, followed by the upgrade procedure.

### Content API

Update migrations and modules that call `Content::modifyFieldContent()` to use the [Content API](docs:developers/managing-embedded-content).

| Vizy 3 | Vizy 4 |
| --- | --- |
| `Content::modifyFieldContent()` | `captureFieldLocations()` followed by `modifyFieldValues()` |
| Field handle matching | Captured field and layout placement UIDs |
| Truthy callback result replaces a value | Explicit `Change::replace()`, `Change::remove()` or `Change::unchanged()` result |

This is not a method rename. Capture source identities before removing or replacing field configuration, update the callback to return an explicit operation, and run writes inside the caller's transaction. Follow the linked example to preview and apply a conversion.

### Extensibility APIs

| Vizy 3 | Vizy 4 |
| --- | --- |
| `Craft.Vizy.Config.registerExtensions` | `Craft.Vizy.registerModule` |
| `Craft.Vizy.Config.registerButtons` | Editor Config toolbar + optional `registerControl` |
| `Craft.Vizy.Config.registerCommands` | Use toolbar controls for custom rich-text actions; Add Block, `/`, and `+` list Vizy blocks |
| `plugins: ["handle"]` in JSON | Editor Config **capabilities** |
| `onVizyConfigReady` | `vizy:register` (or call APIs if `Craft.Vizy` already exists) |
| `EVENT_REGISTER_MARKS` / `NODES` for the editor schema | `EVENT_REGISTER_EXTENSIONS` (`$marks[]` / `$nodes[]` / `$extensions[]` class lists) |
| `EVENT_DEFINE_VIZY_CONFIG` | Never fires — named Editor Configs only |

### Twig Templates

The field value is a **`VizyDocument`**, not a Node Collection.

| Vizy 3 | Vizy 4 |
| --- | --- |
| `{{ entry.vizyField }}` (string cast / HTML) | `{{ entry.vizyField.render() }}` |
| `entry.vizyField.renderHtml({ paragraph: { attrs: … } })` | Attribute-map rendering configuration is unsupported |
| `entry.vizyField.query().where(…)` | Same consumer API — still works on `VizyDocument` |
| Eager TipTap node objects in Twig | Query rows are `VizyBlock` / thin content projections; prefer `render()`, `query()`, or `content().nodes()` |

For example, update automatic output in an entry template by calling `render()` explicitly. Replace `vizyField` with your field’s handle:

::: code-group
```twig [Vizy 3]
<div class="article-body">
    {{ entry.vizyField }}
</div>
```

```twig [Vizy 4]
<div class="article-body">
    {{ entry.vizyField.render() }}
</div>
```
:::

Block Type templates receive the current block as `block`. If a template used a field directly, read it through the block instead. For a Plain Text field named `text`, the change is:

::: code-group
```twig [Vizy 3]
<div class="callout">
    {{ text }}
</div>
```

```twig [Vizy 4]
<div class="callout">
    {{ block.text }}
</div>
```
:::

Render an entry containing each affected Block Type and check that its field values appear. See [Querying Nodes](docs:template-guides/querying-nodes) and [Rendering Content](docs:template-guides/rendering-content).

### Enabled Content in Queries

Vizy 3’s `where()` could replace the default enabled filter. Queries now preserve their enabled scope when you add or replace ordinary conditions. If your template relied on a type-only filter also returning disabled blocks, request both states explicitly:

::: code-group
```twig [Vizy 3]
{% set blocks = entry.vizyField.query().where({ type: 'vizyBlock' }).all() %}
```

```twig [Vizy 4]
{% set blocks = entry.vizyField.query().where({ type: 'vizyBlock', enabled: null }).all() %}
```
:::

For public output, omit `enabled: null` to keep disabled content hidden. Use `enabled: false` when you specifically need disabled blocks. Check a field containing one enabled and one disabled block to confirm the intended output.

### GraphQL Queries

The field type is **`VizyDocument`** (field-scoped name `{handle}_VizyDocument` when the field has a handle), not `NodeCollection`. Existing headless queries must be rewritten — Vizy 3 fragment names are not supported.

#### Root Fields

| Vizy 3 (`NodeCollection`) | Vizy 4 (`VizyDocument`) |
| --- | --- |
| `nodes(where, limit, orderBy)` | Accepts filtering, limits, and ordering; **`where` is a JSON object**, not a JSON-encoded **string** |
| `rawNodes` | Prefer `raw` (full envelope) or `nodes { raw }`; `rawNodes` remains as a deprecated alias of root node arrays |
| `renderHtml` | Prefer `renderedHtml`; `renderHtml` remains as a deprecated alias |
| — | `schemaVersion`, `blocks(where, limit, orderBy)`, `block(uid:)` |

Example `where` migration:

These are selections inside your Vizy field query. The filter changes from an encoded string to an object; the requested node fields remain inside the selection:

::: code-group
```graphql [Vizy 3]
nodes(where: "{\"type\":\"paragraph\"}") {
    type
    html
}
```

```graphql [Vizy 4]
nodes(where: { type: "paragraph" }) {
    type
    html
}
```
:::


Defaults still match Twig `query()`: enabled Blocks + prose. Use
`where: { enabled: null }` to include disabled Blocks.

#### Node and Mark Fragments

| Vizy 3 | Vizy 4 |
| --- | --- |
| `... on VizyNode_Paragraph` | `... on VizyParagraph` |
| `... on VizyNode_Heading` | `... on VizyHeading` |
| `... on VizyNode_Image` | `... on VizyImage` |
| `... on VizyNode_*` (other prose) | `... on Vizy*` (PascalCase TipTap type, e.g. `VizyBulletList`) |
| `... on VizyMark_Bold` | `... on VizyBold` |
| `... on VizyMark_Link` | `... on VizyLink` |
| `... on VizyMark_*` | `... on Vizy*` |

Unknown installed types use `VizyUnknownNode` / `VizyUnknownMark` with `raw`.

#### Block Fragments and Fields

| Vizy 3 | Vizy 4 |
| --- | --- |
| `... on {fieldHandle}_{blockHandle}_BlockType` | `... on {BlockHandle}_{shortUid}_VizyBlock` (UID segment is stable; introspect the schema for the exact name) |
| `blockTypeId` | `blockTypeUid` (canonical) + `blockTypeHandle` (convenience) |
| `collapsed` | Removed from the Block GraphQL type |
| `values` | Prefer generated Craft fields; escape hatch `rawFieldValues` |
| Craft field handles on the fragment | Unchanged pattern — still first-class fields on the Block Type object |

Also on Blocks: `uid` (instance), `enabled`, `resolved`.

#### Per-Node Fields

| Vizy 3 | Vizy 4 |
| --- | --- |
| `html` on every node | Restored on `VizyNodeInterface` (same emit path as `renderedHtml`) |
| `tagName` | Use `type` or your templates to determine the tag |
| `content` (JSON blob) / `contentNodes` | `children` (typed recursive nodes) |
| `rawNode` | `raw` |
| Image `asset` | Still `asset` on `VizyImage` |
| Link mark `element` | Still `element` on `VizyLink`; also `url` convenience from semantic attrs |

New structural types: `VizyLayout` (`stack`, `columns`), `VizyColumn` (`span`, `proportion`, `children`). Nested composition is **Hosted Vizy** Craft fields on Blocks (nested `VizyDocument`), not Content Areas.

Full current contract: [GraphQL](docs:developers/graphql).

### Registering Nodes and Marks

Replace listeners for `Nodes::EVENT_REGISTER_NODES` and `Nodes::EVENT_REGISTER_MARKS` with `Extensions::EVENT_REGISTER_EXTENSIONS`. Register PHP classes in `$event->nodes` or `$event->marks`, and register their editor modules in JavaScript as described in [Extending Vizy](docs:developers/extending-vizy).

For an existing custom mark class called `MyMark`, update the event listener in your module’s `init()` method. Put the imports at the top of the PHP file and retain your existing import for `MyMark`:

::: code-group
```php [Vizy 3]
use verbb\vizy\events\RegisterMarksEvent;
use verbb\vizy\services\Nodes;
use yii\base\Event;

Event::on(Nodes::class, Nodes::EVENT_REGISTER_MARKS, function(RegisterMarksEvent $event) {
    $event->marks[] = MyMark::class;
});
```

```php [Vizy 4]
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, function(RegisterExtensionsEvent $event) {
    $event->marks[] = MyMark::class;
});
```
:::

The equivalent node change uses `RegisterNodesEvent` and `EVENT_REGISTER_NODES` on the source side, and the same `RegisterExtensionsEvent` on the destination side. Add the node class to `$event->nodes` rather than `$event->marks`.

The old Nodes service still has deprecated lookup methods that can trigger these old events. That compatibility behaviour does not register a type in the editor’s supported extension system. Update your listener rather than relying on those methods. After updating, reload the control panel, enable the type in the field’s Editor Config, and check both editing and frontend rendering.

### Replacing the Config Event

`VizyField::EVENT_DEFINE_VIZY_CONFIG` does not fire. Remove listeners for it and use a named Editor Config. For example, move a toolbar choice into the config selected by the field:

::: code-group
```php [Vizy 3]
use verbb\vizy\events\ModifyVizyConfigEvent;
use verbb\vizy\fields\VizyField;
use yii\base\Event;

Event::on(VizyField::class, VizyField::EVENT_DEFINE_VIZY_CONFIG, function(ModifyVizyConfigEvent $event) {
    $event->config['buttons'] = ['bold', 'italic'];
});
```

```json [Vizy 4]
{
    "label": "Simple Text",
    "capabilities": {
        "marks": ["bold", "italic"]
    },
    "toolbar": ["bold", "italic"]
}
```
:::

Save the destination example as `config/vizy/simple-text.json`, select that config on the Vizy field, and save the field. Reload an entry using it and check the toolbar. See [Configuration](docs:get-started/configuration#editor-configuration) for the other settings available in a named config.

### Purifier and Plugin Hooks

Remove listeners for `VizyField::EVENT_MODIFY_PURIFIER_CONFIG`; the event does not fire. Use [Modify Nodes](docs:template-guides/modify-nodes) for output changes. PHP calls to `VizyField::registerPlugin()` also do not register editor behaviour. Register the extension and its JavaScript through [Extensibility](docs:developers/extending-vizy), then check both the editor and rendered output.

## Deprecated Changes

The following aliases continue to work while you update your code. Use the supported names in new code, and check Craft’s **Utilities → Deprecation Warnings** for reported usage. This is separate from the removed APIs and changed contracts listed above.

| Vizy 3 Usage | Recommended Vizy 4 Usage |
| --- | --- |
| `entry.vizyField.renderHtml()` without an attribute map | `entry.vizyField.render()` |
| `entry.vizyField.renderStaticHtml()` without a configuration argument | `entry.vizyField.render()` |
| `entry.vizyField.getRawNodes()` | `entry.vizyField.content().nodes()` |
| `entry.vizyField.getField()` | `entry.vizyField.field()` |
| GraphQL `renderHtml` | GraphQL `renderedHtml` |
| GraphQL `rawNodes` | `raw` for the full document, or `nodes { raw }` for individual nodes |

The raw GraphQL replacements return different structures, so update the consuming code as well as the selected field name. Older editor toolbar tokens also have compatibility conversions; update the JSON file as described under Editor Config Files. Both `renderHtml()` and `renderStaticHtml()` reject non-empty configuration arguments. Those calls require an update; the no-argument forms continue to work with a deprecation warning.

## Changes at a Glance

| Area | Vizy 3 | Vizy 4 |
| --- | --- | --- |
| Field storage | Bare node list / `fieldData` layouts | Canonical `doc` + global `vizy.blockTypes` |
| Nested composition | Nested Vizy / Matrix on Blocks | **Hosted Vizy** on Block layouts; existing Matrix **grandfathered** (editable, not newly placeable) |
| Editor Config | Files + per-field inline JSON | Named configs (CP or `config/vizy/*.json`); inline configs are saved to Project Config during promotion when admin changes are allowed |
| GraphQL | `VizyNode_*` / per-field Block fragments on `NodeCollection` | Structural `VizyDocument` (`VizyParagraph`, `{Handle}_{uid}_VizyBlock`, …) + `nodes(where/limit/orderBy)` |
| Extensibility | `Craft.Vizy.Config`, `registerPlugin`, define-config events | `EVENT_REGISTER_EXTENSIONS` + `Craft.Vizy.registerModule` / `registerControl` |
| Twig field value | Node Collection (string cast, eager objects) | **`VizyDocument`** — `render()`, `query()` / `all()`, `blocks()`, `content()`, `traverse()`, `isEmpty()` |

See also [Matrix in Blocks](../feature-tour/matrix-in-blocks.md) and [Configuration](configuration.md).

## Before You Start

1. Take a **database + Project Config** backup.
2. Deploy on a staging copy first.
3. Confirm Craft `allowAdminChanges` is on for environments that must save inline Editor Configs into Project Config.
4. Plan downtime or a content freeze while promotion runs.

## Write Confirmation

Any command that **writes** Project Config or owner content requires the exact confirmation phrase:

```text
PROMOTE VIZY 3
```

Pass it as a flag:

```shell
--confirm="PROMOTE VIZY 3"
```

Or omit `--confirm` in an interactive terminal and type the phrase when prompted. Wrong confirmation never writes.

Applies to:

- `vizy/migrations/promotion-apply`
- `vizy/migrations/promotion-resume`
- `vizy/migrations/owner … --apply=1`
- `vizy/migrations/resume` (owner checkpoint)

Analysis, dry-run, and status commands do **not** require confirmation.

## Schema Promotion

All write commands print a short human summary and a `nextStep`, then emit **JSON** for scripting. Machine fields remain authoritative.

### 1. Analyse Without Writing

```shell
php craft vizy/migrations/promotion-analyze
```

Optional: pass a JSON file of target field handles to limit the plan.

- Status **`ready`** — save the printed plan JSON.
- Status **`blocked`** — fix every **error** diagnostic and re-run. **Info** diagnostics (for example Matrix grandfather) do not block.

### 2. Prepare an Owner-Scope File

Owner scope must be a JSON object with `"complete": true` and a `jobs` array (may be empty if you only promote schema):

```json
{
  "complete": true,
  "jobs": []
}
```

Populate `jobs` when the analyze plan (or your own inventory) lists owner conversions to run with apply.

### 3. Preview the Upgrade

```shell
php craft vizy/migrations/promotion-dry-run path/to/plan.json path/to/owners.json
```

### 4. Apply the Upgrade

```shell
php craft vizy/migrations/promotion-apply path/to/plan.json path/to/owners.json --confirm="PROMOTE VIZY 3"
```

Stages (in order): plan → global Block Types → provenance → Editor Configs → canonical field settings → owners → verified.

### 5. Check Status and Resume

```shell
php craft vizy/migrations/promotion-status
php craft vizy/migrations/promotion-status {runUid}

php craft vizy/migrations/promotion-resume {runUid} --confirm="PROMOTE VIZY 3"
```

Resume continues from the last durable stage.

## Converting a Single Entry

Use when you need an explicit analysis and conversion for one owner outside a full promotion owner-scope file:

```shell
php craft vizy/migrations/owner {elementType} {elementId} {siteId} {fieldUid} path/to/mapping.json
php craft vizy/migrations/owner … --apply=1 --confirm="PROMOTE VIZY 3"
php craft vizy/migrations/status
php craft vizy/migrations/resume {checkpointId} --confirm="PROMOTE VIZY 3"
```

Default mapping is map-only: `{ "revision": 1, "schemaMap": { … } }`. If `schemaMap` is omitted, the migrator uses the map saved when that field was upgraded.

## After Promotion

1. Open CP entries that use Vizy and confirm editors load.
2. Spot-check Hosted nested fields and any grandfathered Matrix-in-Block content.
3. Update Twig, GraphQL, and front-end code using the maps below
   ([Rendering Content](docs:template-guides/rendering-content),
   [Querying Nodes](docs:template-guides/querying-nodes),
   [GraphQL](docs:developers/graphql),
   [Extending Vizy](docs:developers/extending-vizy)).
4. Leave older `fieldData` in place — promotion does **not** delete it, and Vizy
   does not ship a retirement command. Treat leftover source as inert after a
   successful upgrade.

## Editor Config Files

Older JSON used keys such as `buttons`, `formatting`, and `table`, plus kebab-case control ids (`h2`, `align-left`). Convert to the current keys (`capabilities`, `toolbar`, `dropdowns`, `bubble`, …) and ids (`heading2`, `alignLeft`, …), or recreate the config in the CP.

On load, some legacy toolbar tokens are rewritten and logged through Craft’s Deprecator — update files so those shims can be removed later. Inline “custom config” on the field no longer exists; every field references a named config. Promotion mints or retargets named configs when admin changes are allowed.

## Nested Content

Older nested Vizy often stored bare node lists (or JSON strings of lists). After the nested field is upgraded, Vizy converts them on load; the next save persists the canonical object shape in `fieldSlots`.

When using the raw Content API on Vizy 3 storage, the captured location map must include the schema mapping recorded during promotion. This also applies to a Vizy 4 document containing a nested Vizy 3 document. A raw field replacement preserves the stored representation; it does not upgrade the whole document. Missing mapping information causes an exception. Integrations that also support installations running Vizy 3 must retain their Vizy 3 integration, because that release does not expose this API.

## Common Diagnostics

| Signal | Meaning |
| --- | --- |
| “has not been upgraded … yet” | Field still has older JSON and the upgrade hasn’t been run for that field — run analyze/apply first |
| Matrix grandfather (info) | Existing Matrix on Block Types stays editable; you still cannot add new Matrix to Blocks |
| Nested Vizy list in a Hosted slot | Converts on nested normalize after the nested field is upgraded; next save persists a canonical nested doc |
| Inline Editor Config blocked | `allowAdminChanges` off — add a file config or promote where admin changes are allowed |
| Confirmation mismatch | Phrase must be exactly `PROMOTE VIZY 3` |
| GraphQL unknown type / missing fragment | Rewrite Vizy 3 `VizyNode_*` / `{field}_{block}_BlockType` names — see GraphQL breaking changes above |

## Known Limitations

Promotion retains the older `fieldData`; leave it in place after verification. Vizy does not provide a command to retire it or a Matrix-to-Vizy content converter.

Nested content can convert when its upgraded field loads and persist on the next save, as described under [Nested Content](#nested-content). Plan that separately from any explicit owner conversion jobs.

Feed Me does not promote Vizy 3 block identities. Promote existing entries before importing document JSON that uses the destination Block Types and field placements.

For limitations that also apply to new installations, including element relationships, GraphQL data access, and image transforms, see [Limitations](docs:feature-tour/limitations).
