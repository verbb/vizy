# Node

A **node** represents a piece of content, such as a paragraph, image, or Vizy block. Nodes can contain other nodes. A list contains list items, for example, and each item can contain text. A node’s PHP class defines how Vizy renders that content as HTML.

Register a custom node class through `Extensions::EVENT_REGISTER_EXTENSIONS` using `$event->nodes[] = MyNode::class`. See [Custom Extensions](docs:developers/custom-extensions) for the registration process.

## Static Methods

These static methods describe the node type. Vizy calls them to list the node in Editor Configs and to render it, and a custom node class overrides the ones it needs. [Custom Extensions](docs:developers/custom-extensions) shows how to create and register a class, the [rendering events](docs:developers/events#rendering-events) change the HTML of an existing type, and [Node and Mark Templates](docs:template-guides/node-and-mark-templates) replace a type's markup in Twig.

::: reference
### `id()`

**Returns:** `string`

Returns this node type's name as it's stored in the document, such as `paragraph` or `heading`. It comes from the class's `$type` property, and is also the ID used for this node in Editor Configs.
:::

::: reference
### `moduleId()`

**Returns:** `string`

Returns the ID of the JavaScript module that adds this node to the editor, such as `vizy/core/node/paragraph`. A custom node must return its own ID, matching the one its script passes to `Craft.Vizy.registerModule()`.
:::

::: reference
### `label()`

**Returns:** `string`

Returns the name shown for this node in Editor Configs and on its toolbar button. Defaults to the type name with an uppercase first letter.
:::

::: reference
### `icon()`

**Returns:** `string|null`

Returns the SVG markup for this node's toolbar button, or `null` when it has no icon of its own.
:::

::: reference
### `surfaces()`

**Returns:** `array`

Returns where this node can appear as a button, using the `EditorSurface::Toolbar` and `EditorSurface::Bubble` constants. Defaults to `[EditorSurface::Toolbar]`. An empty array means the node has no button.
:::

::: reference
### `group()`

**Returns:** `string|null`

Returns the group this node is listed under in Editor Configs, as an `EditorGroup` constant such as `EditorGroup::Text` or `EditorGroup::Media`. Returns `null` by default.
:::

::: reference
### `tag()`

**Returns:** `string|array|null`

Returns the HTML tag this node renders, such as `'p'` for a paragraph, or a list of nested tags such as `['pre', 'code']` for a code block. Returns `null` when the node renders no tag of its own.
:::

::: reference
### `tagForAttrs()`

**Returns:** `string|array|null`

**Arguments:** `array $attrs`, the attributes of the occurrence

Returns the HTML tag for one occurrence of this node, based on its attributes. It returns `tag()` unless a node needs a different tag for different attributes, such as a heading choosing `h1` to `h6` from its level.
:::

::: reference
### `isSelfClosing()`

**Returns:** `bool`

Returns whether this node's tag has no closing tag, such as `<img>` or `<hr>`.
:::

::: reference
### `normalizeAttrs()`

**Returns:** `array`

**Arguments:** `array $attrs`, the stored attributes, and `RenderContext $ctx`, the field, owner and site being read

Returns this node's attributes in the form Vizy stores, such as with values trimmed or limited to the allowed choices. Vizy calls it when it reads a stored document.
:::

::: reference
### `resolveAttrs()`

**Returns:** `array`

**Arguments:** `array $attrs`, the stored attributes, and `RenderContext $ctx`, the field, owner and site being rendered

Returns the attributes used to render one occurrence of this node, such as a resolved URL in place of a stored element reference. Vizy calls it while rendering, so the result is never stored.
:::

::: reference
### `renderOccurrenceHtml()`

**Returns:** `string|null`

**Arguments:** `string $children`, the rendered inner HTML, `array $resolvedAttrs`, the result of `resolveAttrs()`, and `RenderContext $ctx`

Returns the complete HTML for one occurrence of this node, for output that a single wrapping tag can't produce. Returns `null` to render `tagForAttrs()` around the content instead. When it returns HTML, the `modifyTag` event doesn't run, but `modifyRenderedNode` still does.
:::

::: reference
### `dependencies()`

**Returns:** `array`

Returns the other types this node can't work without, as keys such as `node:listItem`. Enabling this node in an Editor Config also enables them. A bulleted list depends on `node:listItem`, for example.
:::

::: reference
### `implies()`

**Returns:** `array`

Returns other types to enable alongside this node, as keys such as `node:listItem`. Vizy enables them in the same way as `dependencies()`.
:::

::: reference
### `alwaysEnabled()`

**Returns:** `bool`

Returns whether this node is enabled in every Editor Config, even when the config doesn't list it. Paragraphs and text are always enabled, for example.
:::

::: reference
### `isInternal()`

**Returns:** `bool`

Returns whether this node is only used inside another type and can't be selected in Editor Configs on its own, such as a layout's columns.
:::


## Reading Content in Twig

Read the Vizy field from an entry to render its document or query individual pieces of content. In this example, replace `myVizyField` with your field’s handle:

```twig
{{ entry.myVizyField.render() }}
{% for node in entry.myVizyField.query().all() %}
  {# VizyContentNode / VizyBlock projections #}
{% endfor %}
```

See [Rendering Content](docs:template-guides/rendering-content) and [Querying Nodes](docs:template-guides/querying-nodes). GraphQL returns the same node shape, as described in [GraphQL Queries](docs:graphql/queries).

## Built-In Types

Core classes live under `verbb\vizy\nodes\`. Block HTML uses Block Type Twig templates, not `tag()`.

### Prose

| Type | HTML | Notable attrs |
| --- | --- | --- |
| `doc` | *(root — not emitted)* | `schemaVersion` (`2`) on the document |
| `paragraph` | `<p>` | `textAlign` → `class` (`text-left`, …); default align omitted |
| `heading` | `<h1>`…`<h6>` | Storage `level` (1–6); `textAlign` → `class`; `level` never emitted as an HTML attr |
| `blockquote` | `<blockquote>` | — |
| `codeBlock` | `<pre><code>` | Optional `language` is rendered as a `language-*` class; the editor highlights supported languages and auto-detects when it is absent |
| `bulletList` / `orderedList` | `<ul>` / `<ol>` | — |
| `listItem` | `<li>` | — |
| `taskList` | `<ul data-type="taskList">` | Pulls in the internal `taskItem` type |
| `taskItem` | `<li data-type="taskItem">` | Internal; boolean `checked` state renders a disabled checkbox |
| `details` | `<details>` | Pulls in the internal `detailsSummary` and `detailsContent` types; open state is not persisted |
| `detailsSummary` | `<summary>` | Internal |
| `detailsContent` | `<div data-type="detailsContent">` | Internal |
| `hardBreak` | `<br>` | — |
| `horizontalRule` | `<hr>` | — |
| `emoji` | `<span data-type="emoji" data-name="…">` | Stores the official emoji name and resolved Unicode character for editor and PHP rendering |
| `text` | *(text node)* | Marks wrap text; text is HTML-encoded on render |

### Layout

| Type | HTML | Notable attrs |
| --- | --- | --- |
| `layout` | `<div class="vizy-layout">` | Storage `layoutUid`, `stack` (`never` / `small` / …) → `data-stack`; CSS `--vizy-cols:12` |
| `column` | `<div class="vizy-column">` | Storage `columnUid`, `span` (1–12) → `data-span` + `--vizy-col`; **internal** (pulled in by Layout) |

See [Layouts](docs:feature-tour/editor-capabilities#layouts) for authoring and [Styling Layouts](docs:template-guides/styling-layouts) for frontend CSS.

### Media

| Type | HTML | Notable attrs |
| --- | --- | --- |
| `image` | `<img>` (optional link wrap) | **Persist `assetUid` only** — never store `src`. Render resolves Asset URL; emit allowlists `src` / `alt` / dimensions / `class` / … and sanitises `src` (http/https). Link fields (`url`, `target`, …) wrap via the Link mark path |
| `iframe` | `<iframe>` | Authoring `url` → sanitised `src` (http/https); attr allowlist (`width`, `height`, `title`, `loading`, `allow`, …). Omitted when URI rejected |
| `mediaEmbed` | Custom (YouTube/Vimeo player, purified stored embed HTML, or safe link) | `url` + optional `data.html`. YouTube and Vimeo rebuild trusted iframe markup from the source URL. Other providers use stored HTML when content remains after purification, or an encoded link otherwise; only YouTube and Vimeo iframe hosts are permitted |

### Tables

| Type | HTML | Notable attrs |
| --- | --- | --- |
| `table` | `<table><tbody>` | — |
| `tableRow` | `<tr>` | — |
| `tableCell` / `tableHeader` | `<td>` / `<th>` | `colspan`, `rowspan`, `colwidth` (as emitted by TipTap) |

### Blocks

| Type | HTML | Notable attrs |
| --- | --- | --- |
| `vizyBlock` | Block Type Twig template (or empty) | `blockTypeUid`, instance `blockUid`, `enabled`, `fieldSlots` (placement UID → values). Nested Vizy slots contain document objects. Matrix slots refer to their owning anchor through `matrixAnchorUid` |

The default renderer removes event-handler attributes such as `onclick`, and removes `srcdoc`, before producing HTML.
