# Node

A **node** represents a piece of content, such as a paragraph, image, or Vizy block. Nodes can contain other nodes: a list contains list items, for example, and each item can contain text. A node’s PHP class defines how Vizy renders that content as HTML.

Register a custom node class through `Extensions::EVENT_REGISTER_EXTENSIONS` using `$event->nodes[] = MyNode::class`. See [Extending Vizy](docs:developers/extending-vizy) for the registration process.

## Static Methods

::: reference
### `id()`

**Returns:** `string` / `$type`

TipTap JSON type (`paragraph`, `heading`, …).
:::

::: reference
### `moduleId()`

**Returns:** `string`

Editor module id (`vizy/core/node/paragraph`).
:::

::: reference
### `label()`

**Returns:** `string` / `icon()` / `group()` / `surfaces()`

Catalogue metadata.
:::

::: reference
### `tag()`

**Returns:** `array|string|null` / `tagForAttrs($attrs)`

HTML tag(s), or null when omitted / custom.
:::

::: reference
### `isSelfClosing()`

**Returns:** `bool`

Void elements (`img`, …).
:::

::: reference
### `normalizeAttrs()`

**Returns:** `array`

Semantic shaping on parse (storage attrs).
:::

::: reference
### `resolveAttrs()`

**Returns:** `array`

Output-only attrs (refs, URLs) on render.
:::

::: reference
### `renderOccurrenceHtml()`

**Returns:** `string|null`

Optional full HTML override; null = default tag path.
:::

::: reference
### `alwaysEnabled()`

**Returns:** `bool` / `isInternal()` / `dependencies()` / `implies()`

Enablement.
:::


Register and author: [Extending Vizy](docs:developers/extending-vizy).
Override tags and rendered HTML: [Events](docs:developers/events#customising-rendered-html).
Own a node type’s complete site markup in Twig: [Node and Mark Templates](docs:template-guides/node-and-mark-templates).

## Reading Content in Twig

Read the Vizy field from an entry to render its document or query individual pieces of content. In this example, replace `myVizyField` with your field’s handle:

```twig
{{ entry.myVizyField.render() }}
{% for node in entry.myVizyField.query().all() %}
  {# VizyContentNode / VizyBlock projections #}
{% endfor %}
```

See [Rendering Content](docs:template-guides/rendering-content) and
[Querying Nodes](docs:template-guides/querying-nodes). GraphQL mirrors the same
shape — [GraphQL](docs:developers/graphql).

## Built-In Types

Core classes live under `verbb\vizy\nodes\`. Block HTML uses Block Type Twig
templates, not `tag()`.

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
