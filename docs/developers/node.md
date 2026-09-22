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
| `codeBlock` | `<pre><code>` | — |
| `bulletList` / `orderedList` | `<ul>` / `<ol>` | — |
| `listItem` | `<li>` | — |
| `hardBreak` | `<br>` | — |
| `horizontalRule` | `<hr>` | — |
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
| `mediaEmbed` | Custom (YouTube/Vimeo shell, purified oEmbed, or safe link) | `url` + optional `data.html`. Known providers rebuild trusted iframes from URL; unknown providers purify stored HTML (SafeIframe); else encoded link |

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
