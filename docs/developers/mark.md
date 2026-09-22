# Mark

A **mark** applies formatting to text inside a node. For example, a paragraph can contain a few bold words without making the whole paragraph bold. The mark stores the formatting type and any settings; Vizy uses its PHP class to produce the surrounding HTML when rendering the document.

Register a custom mark class through `Extensions::EVENT_REGISTER_EXTENSIONS` using `$event->marks[] = MyMark::class`. The [custom mark guide](docs:guides/developers/creating-a-custom-mark-from-scratch) shows how to connect that class to the editor.

## Static Methods

::: reference
### `id()`

**Returns:** `string` / `$type`

TipTap JSON type (`bold`, `link`, …).
:::

::: reference
### `moduleId()`

**Returns:** `string`

Editor module id (`vizy/core/mark/bold`).
:::

::: reference
### `label()`

**Returns:** `string` / `icon()` / `group()` / `surfaces()`

Catalogue metadata.
:::

::: reference
### `tag()`

**Returns:** `array|string|null` / `tagForAttrs($attrs)`

HTML tag(s).
:::

::: reference
### `normalizeAttrs()`

**Returns:** `array`

Semantic shaping on parse.
:::

::: reference
### `resolveAttrs()`

**Returns:** `array`

Output-only attrs (e.g. Link refs, `rel` for `_blank`).
:::

::: reference
### `alwaysEnabled()`

**Returns:** `bool` / `isInternal()` / `dependencies()` / `implies()`

Enablement.
:::


Walkthrough: [Creating a custom mark](docs:guides/developers/creating-a-custom-mark-from-scratch).
Sample: `examples/vizy-abbr-module/`.
Override tags and rendered HTML: [Events](docs:developers/events#customising-rendered-html).

## Built-In Types

Core classes live under `verbb\vizy\marks\`.

| Type | HTML | Notable attrs |
| --- | --- | --- |
| `bold` | `<strong>` | — |
| `italic` | `<em>` | — |
| `underline` | `<u>` | — |
| `strike` | `<s>` | — |
| `code` | `<code>` | — |
| `subscript` | `<sub>` | — |
| `superscript` | `<sup>` | — |
| `highlight` | `<mark>` | — |
| `textStyle` | *(no default tag)* | TipTap text-style carrier; pair with a rendering event or custom output if you need CSS variables |
| `link` | `<a>` | **Semantic storage** (not a bare `href`): `type` (`url` / `email` / `tel` / `sms` / `entry` / `asset` / `category`), `value` or `targetUid`, optional `siteMode` / `siteUid` / `suffix` / `newWindow`. Render resolves `href` via `Link::resolveHref` + HTMLPurifier URI schemes (`http`/`https`/`mailto`/`tel`/`sms`). Rejected URIs omit the `<a>` (inner text kept). `_blank` adds `rel="noopener noreferrer"`. GraphQL also exposes `url` / `element` convenience fields |

Authoring-only keys (`type`, `value`, `targetUid`, …) are stripped before HTML
emit so they never become attributes.
