# Upgrading from v3

This guide covers upgrading from Vizy 3 to Vizy 4. Craft’s normal plugin migrations convert Vizy 3 field configuration to Vizy 4’s shared Block Types and record how existing content should be read. Test the complete upgrade on a staging copy before applying it to your live site.

## Breaking Changes

Vizy 4 changes the field value returned to Twig, the GraphQL schema, and the editor extension APIs. Custom templates, headless queries, and modules using those APIs need to be reviewed. Craft’s plugin migrations handle existing field layouts automatically and record how Vizy 3’s block definitions map to Vizy 4’s shared Block Types.

### Twig Templates

The field value is a **`VizyDocument`**, not a Node Collection.

Passing an attribute map to `renderHtml()` or `renderStaticHtml()` is no longer supported. Use node render events or Block Type templates when output needs custom attributes or markup.

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

### Content API

Update migrations and modules that call `Content::modifyFieldContent()` to use the [Content API](docs:developers/embedded-content). This is a different migration workflow, not a method rename.

Vizy 3 discovered matching fields from each Vizy field's block configuration and passed the callback an entire block payload. The callback had to locate and update the nested value itself, and Vizy only saved a truthy return value. In this simplified shape, `updateMatchingValue()` represents the integration's existing block traversal:

```php
$content->modifyFieldContent(
    $field->uid,
    $field->handle,
    static function(string $handle, array $block): array {
        return updateMatchingValue($block, $handle);
    },
    $this->db,
);
```

Vizy 4 separates schema discovery from value conversion. Capture the field's locations before removing or replacing its configuration. The resulting map records field, layout, and placement UIDs, so the later conversion does not depend on a handle or on the destination configuration still resembling the source:

```php
use verbb\vizy\Vizy;

$content = Vizy::$plugin->getContent();
$locations = $content->captureFieldLocations($field->uid);
```

Pass that map to `modifyFieldValues()`. Its callback receives the exact raw field value rather than the whole block and must return an explicit operation, including for empty replacement values:

```php
use verbb\vizy\content\Change;

$transform = static function(mixed $raw, array $location): array {
    if ($raw !== 'https://old.example.test/contact') {
        return Change::unchanged();
    }

    return Change::replace('https://example.test/contact');
};

$result = $content->modifyFieldValues($locations, $transform, [
    'db' => $this->db,
]);
```

Preview the conversion with the `dryRun` option before applying it. Write mode requires the caller's active transaction; a Craft migration's `safeUp()` already provides one. `Change::remove()` deletes the embedded key, while `Change::replace(null)`, `Change::replace('')`, and other empty replacements store those values deliberately. The full [Content API guide](docs:developers/embedded-content) covers batching, scope filters, saved location maps, and verification.

### Editor Configs

Vizy 3 fields either selected a JSON file from `config/vizy/` or stored custom JSON directly on the field. Vizy 4 keeps the file option, but every field now references a named Editor Config.

The upgrade handles the two Vizy 3 sources differently:

- Custom JSON stored on a field is converted into a named Project Config entry and the field is updated to use it. Creating that entry requires `allowAdminChanges` during the upgrade.
- A selected file remains selected. Vizy translates supported Vizy 3 settings when it loads the file, but does not rewrite the file on disk.

You do not have to rewrite a selected file before the upgrade can complete, but the compatibility translation is a bridge rather than a completed file migration. Open **Settings → Vizy → Editor Configs** afterward, confirm that each field still allows the intended content and shows the intended controls, then rewrite the file in the Vizy 4 shape.

When updating a file, do not treat the change as a list of renamed keys. In Vizy 3, `buttons` both enabled editor behaviour and positioned its controls. Vizy 4 separates those decisions: `capabilities` defines what the document may contain, `toolbar` places controls, and `dropdowns` selects members of the Formatting, Alignment, or Table menus.

::: code-group
```json [Vizy 3]
{
    "buttons": ["formatting", "bold", "italic", "unordered-list", "align-left"],
    "formatting": ["paragraph", "h2", "h3"]
}
```

```json [Vizy 4]
{
    "label": "Article",
    "capabilities": {
        "nodes": ["heading", "bulletList"],
        "marks": ["bold", "italic"]
    },
    "headings": {
        "levels": [2, 3]
    },
    "toolbar": ["dropdown:formatting", "bold", "italic", "bulletList", "dropdown:alignment"],
    "dropdowns": {
        "formatting": ["paragraph", "heading2", "heading3"]
    }
}
```
:::

Identifiers such as `h2`, `unordered-list`, and `align-left` are accepted as temporary aliases for `heading2`, `bulletList`, and `alignLeft`. Vizy reports their use through Craft’s Deprecator; replace them with the current IDs when rewriting the file.

Vizy 3’s `toolbarFixed` and `commands` settings have no Vizy 4 config equivalent. Remove them. JSON objects that defined custom buttons or Formatting items must be rebuilt with the [Extensions APIs](docs:developers/extending-vizy); they cannot be represented by a Vizy 4 Editor Config alone.

### Extensibility APIs

Vizy 4 replaces Vizy 3's JavaScript-only plugin registry with PHP extension definitions, JavaScript modules, and named Editor Configs. These parts work together; the new APIs are not drop-in renames for the old ones.

#### JavaScript Modules

Vizy 3 registered a TipTap extension and its button through callbacks on `Craft.Vizy.Config`. Vizy 4 registers the TipTap factory by the module ID declared by its PHP class. Standard mark and node controls come from that PHP definition and the field's Editor Config rather than a JavaScript button registration.

::: code-group
```js [Vizy 3]
document.addEventListener('onVizyConfigReady', () => {
    const { Mark, mergeAttributes } = Craft.Vizy.Config.tiptap.core;

    const Abbr = Mark.create({
        name: 'abbr',
        parseHTML: () => [{ tag: 'abbr' }],
        renderHTML: ({ HTMLAttributes }) => ['abbr', mergeAttributes(HTMLAttributes), 0],
    });

    Craft.Vizy.Config.registerExtensions(() => [
        { plugin: 'custom-vizy', extension: Abbr },
    ]);

    Craft.Vizy.Config.registerButtons(() => [{
        name: 'abbr',
        title: 'Abbreviation',
        action: (editor) => editor.chain().focus().toggleMark('abbr').run(),
        isActive: (editor) => editor.isActive('abbr'),
    }]);
});
```

```js [Vizy 4]
function register() {
    const { Mark, mergeAttributes } = Craft.Vizy.tiptap.core;

    const Abbr = Mark.create({
        name: 'abbr',
        parseHTML: () => [{ tag: 'abbr' }],
        renderHTML: ({ HTMLAttributes }) => ['abbr', mergeAttributes(HTMLAttributes), 0],
    });

    Craft.Vizy.registerModule('acme/mark/abbr', () => Abbr);
}

if (window.Craft?.Vizy?.registerModule) {
    register();
} else {
    document.addEventListener('vizy:register', register);
}
```
:::

The `acme/mark/abbr` module ID must match the PHP extension's `moduleId()`. There is deliberately no `registerButtons()` replacement in the Vizy 4 example: the standard abbreviation control is enabled and positioned through the Editor Config below. Use `Craft.Vizy.registerControl()` only when the control needs a custom action such as a dialog or multi-step flow. The PHP registration is covered under [Registering Nodes and Marks](#registering-nodes-and-marks); see [Extending Vizy](docs:developers/extending-vizy) for the complete extension contract.

#### Enabling Extensions in Editor Configs

Vizy 3 enabled an entire JavaScript plugin by handle. Vizy 4 enables each PHP-registered node, mark, or behaviour extension explicitly, while `toolbar` controls where an author can use it.

::: code-group
```json [Vizy 3]
{
    "buttons": ["abbr"],
    "plugins": ["custom-vizy"]
}
```

```json [Vizy 4]
{
    "label": "Article",
    "capabilities": {
        "marks": ["abbr"]
    },
    "toolbar": ["abbr"]
}
```
:::

Save the Vizy 4 example as a named config such as `config/vizy/article.json`, select it on the field, and save the field. Behaviour-only extensions belong under `capabilities.extensions` rather than `capabilities.marks`; the Editor Config screen shows the capabilities registered by PHP.

#### Removing Registered Commands

Vizy 3's `Craft.Vizy.Config.registerCommands()` API has no direct replacement. Vizy 4 does not provide an equivalent general action launcher.

Create a Block Type for structured content. Editors can insert it through the toolbar's **Add Block** control, the gutter `+`, or `/` on an empty line; all three surfaces use the field's configured Block Types. For a custom rich-text action, register a toolbar control with `Craft.Vizy.registerControl()` and add its ID to the field's Editor Config.

#### Registering Nodes and Marks

Replace listeners for `Nodes::EVENT_REGISTER_NODES` and `Nodes::EVENT_REGISTER_MARKS` with `Extensions::EVENT_REGISTER_EXTENSIONS`. The new event collects node, mark, and behaviour-extension classes separately.

For an existing custom mark class called `Abbr`, update the event listener in your module's `init()` method. Put the imports at the top of the PHP file and retain your existing import for `Abbr`:

::: code-group
```php [Vizy 3]
use verbb\vizy\events\RegisterMarksEvent;
use verbb\vizy\services\Nodes;
use yii\base\Event;

Event::on(Nodes::class, Nodes::EVENT_REGISTER_MARKS, function(RegisterMarksEvent $event) {
    $event->marks[] = Abbr::class;
});
```

```php [Vizy 4]
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, function(RegisterExtensionsEvent $event) {
    $event->marks[] = Abbr::class;
});
```
:::

The equivalent node change adds the class to `$event->nodes`; behaviour-only TipTap extensions use `$event->extensions`. A Vizy 4 class also declares the type ID and the JavaScript module ID. The old Nodes service still has deprecated lookup methods that can trigger the old events, but that compatibility behaviour does not register a type with the editor. After updating, reload the control panel, enable the type in the field's Editor Config, and check both editing and frontend rendering.

#### Replacing the Config Event

`VizyField::EVENT_DEFINE_VIZY_CONFIG` does not fire because its mutable Vizy 3 config shape no longer describes the Vizy 4 editor. If the config can be static, move it into the named Editor Config selected by the field. If a module needs to adjust that config for a particular field at runtime, listen for `EditorManifests::EVENT_MODIFY_EDITOR_CONFIG`:

::: code-group
```php [Vizy 3]
use verbb\vizy\events\ModifyVizyConfigEvent;
use verbb\vizy\fields\VizyField;
use yii\base\Event;

Event::on(VizyField::class, VizyField::EVENT_DEFINE_VIZY_CONFIG, function(ModifyVizyConfigEvent $event) {
    $event->config['buttons'] = ['bold', 'italic'];
});
```

```php [Vizy 4]
use verbb\vizy\events\ModifyEditorConfigEvent;
use verbb\vizy\services\EditorManifests;
use yii\base\Event;

Event::on(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, function(ModifyEditorConfigEvent $event) {
    if ($event->field?->handle !== 'summary') {
        return;
    }

    $event->config['capabilities']['marks'] = ['bold', 'italic'];
    $event->config['toolbar'] = ['bold', 'italic'];
});
```
:::

The event starts with the selected named config's authorable values. Vizy normalizes the result, resolves its dependencies, and uses the effective config for manifest caching and server-side validation. It does not write the runtime changes to Project Config or the source JSON file. See [Events](docs:developers/events#the-modifyeditorconfig-event) for the complete contract and [Configuration](docs:get-started/configuration#editor-configuration) for the available settings.

#### Removed Hooks

Remove listeners for `VizyField::EVENT_MODIFY_PURIFIER_CONFIG`; the event does not fire. Use [Modify Nodes](docs:template-guides/modify-nodes) for output changes. PHP calls to `VizyField::registerPlugin()` also do not register editor behaviour. Register the extension through the PHP event and JavaScript module described above, then check both the editor and rendered output.

### GraphQL Queries

The field type is **`VizyDocument`** (field-scoped name `{handle}_VizyDocument` when the field has a handle), not `NodeCollection`. Existing headless queries must be rewritten — Vizy 3 fragment names are not supported.

#### Root Fields

The `nodes(where, limit, orderBy)` field remains available, but `where` now accepts a GraphQL input object instead of a JSON-encoded string. Use `renderedHtml` for the rendered document. The new `raw` field returns the full document envelope; use `nodes { raw }` for individual nodes. This is not a direct replacement for Vizy 3's `rawNodes`, so update the consuming code for the structure you select. The old `rawNodes` and `renderHtml` names remain as deprecated aliases.

Vizy 4 also adds `schemaVersion`, `blocks(where, limit, orderBy)`, and `block(uid:)` to the document type.

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

Defaults still match Twig `query()`: enabled Blocks + prose. Use `where: { enabled: null }` to include disabled Blocks.

#### Node and Mark Fragments

| Vizy 3 | Vizy 4 |
| --- | --- |
| `... on VizyNode_Paragraph` | `... on VizyParagraph` |
| `... on VizyNode_Heading` | `... on VizyHeading` |
| `... on VizyNode_Image` | `... on VizyImage` |
| `... on VizyNode_*` | `... on Vizy*` |
| `... on VizyMark_Bold` | `... on VizyBold` |
| `... on VizyMark_Link` | `... on VizyLink` |
| `... on VizyMark_*` | `... on Vizy*` |

Other node and mark names follow the same PascalCase pattern, such as `VizyBulletList`. Unknown installed types use `VizyUnknownNode` or `VizyUnknownMark` with `raw`.

#### Block Fragments and Fields

Generated Block Type fragment names change from `{fieldHandle}_{blockHandle}_BlockType` to `{BlockHandle}_{shortUid}_VizyBlock`. The UID segment is stable; introspect the schema for the exact name.

The numeric `blockTypeId` field is replaced by the stable `blockTypeUid`; `blockTypeHandle` is also available as a convenience. The old `collapsed` field has been removed because editor presentation state is not part of the Block GraphQL contract.

Vizy 3's `values` field is not renamed directly. Craft field handles remain first-class fields on the Block Type object and should be selected normally. Use `rawFieldValues` only as an escape hatch when the generated fields are not suitable.

Blocks also expose `uid`, `enabled`, and `resolved`.

#### Per-Node Fields

Vizy 3's `content` field returned a JSON blob and `contentNodes` returned child nodes. Vizy 4 replaces both with `children`, which returns typed nodes recursively. Rename `rawNode` to `raw` when you need the stored node data.

The `tagName` field has been removed; use `type` or your templates when the element name matters. The `html` field remains available on every node, `asset` remains on `VizyImage`, and `element` remains on `VizyLink`. Link marks also expose a `url` convenience field.

New structural types: `VizyLayout` (`stack`, `columns`), `VizyColumn` (`span`, `proportion`, `children`). Nested composition uses Vizy fields on Blocks (nested `VizyDocument`), not Content Areas.

Full current contract: [GraphQL](docs:developers/graphql).

## Deprecated Changes

The following aliases continue to work while you update your code. Use the supported names in new code, and check Craft’s **Utilities → Deprecation Warnings** for reported usage. This is separate from the removed APIs and changed contracts listed above.

| Vizy 3 Usage | Recommended Vizy 4 Usage |
| --- | --- |
| `entry.vizyField.renderHtml()` | `entry.vizyField.render()` |
| `entry.vizyField.renderStaticHtml()` | `entry.vizyField.render()` |
| `entry.vizyField.getRawNodes()` | `entry.vizyField.content().toArray()` |
| `entry.vizyField.getField()` | `entry.vizyField.field()` |
| GraphQL `renderHtml` | GraphQL `renderedHtml` |

GraphQL `rawNodes` is also deprecated, but its alternatives return different structures and are covered under [Root Fields](#root-fields) rather than presented as a direct replacement. Older editor toolbar tokens have compatibility conversions; update the JSON file as described under Editor Config Files. Both `renderHtml()` and `renderStaticHtml()` reject non-empty configuration arguments. Those calls require an update; the no-argument forms continue to work with a deprecation warning.

## Changes at a Glance

- Vizy fields now store a versioned `doc` and return a `VizyDocument` in Twig instead of a bare Node Collection.
- Block definitions are shared Block Types rather than field-owned `fieldData`.
- Nested Vizy fields are recommended for nested composition. Matrix remains supported through Inline Blocks inside Vizy.
- Fields now select named Editor Configs instead of carrying file or per-field JSON configuration.
- GraphQL exposes a `VizyDocument` instead of a `NodeCollection`.
- Editor integrations use the `Craft.Vizy` Extensions API instead of `Craft.Vizy.Config`.

See also [Matrix in Vizy Blocks](../developers/matrix-in-vizy-blocks.md) and [Configuration](configuration.md).

## Advanced Migration and Recovery

Craft’s plugin migration is the supported path for normal upgrades. The following commands expose its underlying plans and checkpoints for diagnosis, custom deployments, eager bulk conversion, or recovery work:

```shell
php craft vizy/migrations/upgrade-from-v3 --dry-run
php craft vizy/migrations/upgrade-from-v3 --force
php craft vizy/migrations/upgrade-analyze
php craft vizy/migrations/upgrade-dry-run path/to/plan.json path/to/owners.json
php craft vizy/migrations/upgrade-apply path/to/plan.json path/to/owners.json
php craft vizy/migrations/upgrade-status
php craft vizy/migrations/upgrade-resume {runUid}
```

These advanced commands emit machine-readable details after their human summary. Write commands ask for confirmation and default to no; pass `--force` only in a reviewed non-interactive deployment. Upgrade runs are resumable because Project Config handlers and owner saves cannot be wrapped in one database transaction.

An owner-scope file is only needed when you deliberately want to convert selected content during the upgrade. It must contain `"complete": true` and a `jobs` array. Each job identifies an exact element, site, Vizy field, and approved mapping. When the same Vizy field appears more than once in an owner’s layout, include the Custom Field layout element’s `ownerPlacementUid` and create one job per placement.

### Converting a Single Owner

Use these low-level commands when you need to analyse and convert one owner explicitly:

```shell
php craft vizy/migrations/owner {elementType} {elementId} {siteId} {fieldUid} path/to/mapping.json
php craft vizy/migrations/owner … --apply=1
php craft vizy/migrations/status
php craft vizy/migrations/resume {checkpointId}
```

Default mapping is map-only: `{ "revision": "1", "schemaMap": { … } }`. The revision must be a non-empty string. If `schemaMap` is omitted, the migrator uses the map saved when that field was upgraded.

For a repeated field, pass `--ownerPlacementUid={fieldLayoutElementUid}` to both analysis and apply. In PHP, pass the field instance returned by the selected Custom Field layout element to `analyzeOwner()` or `migrateOwner()`.
