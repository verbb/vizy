# Mark

A **mark** applies formatting to text inside a node. For example, a paragraph can contain a few bold words without making the whole paragraph bold. The mark stores the formatting type and any settings, and Vizy uses its PHP class to produce the surrounding HTML when rendering the document.

Register a custom mark class through `Extensions::EVENT_REGISTER_EXTENSIONS` using `$event->marks[] = MyMark::class`. The [custom mark guide](docs:guides/developers/creating-a-custom-mark-from-scratch) shows how to connect that class to the editor.

## Static Methods

These static methods describe the mark type. Vizy calls them to list the mark in Editor Configs and to render it, and a custom mark class overrides the ones it needs. [Custom Extensions](docs:developers/custom-extensions) shows how to create and register a class, the [rendering events](docs:developers/events#rendering-events) change the HTML of an existing type, and [Node and Mark Templates](docs:template-guides/node-and-mark-templates) replace a type's markup in Twig.

::: reference
### `id()`

**Returns:** `string`

Returns this mark type's name as it's stored in the document, such as `bold` or `link`. It comes from the class's `$type` property, and is also the ID used for this mark in Editor Configs.
:::

::: reference
### `moduleId()`

**Returns:** `string`

Returns the ID of the JavaScript module that adds this mark to the editor, such as `vizy/core/mark/bold`. A custom mark must return its own ID, matching the one its script passes to `Craft.Vizy.registerModule()`.
:::

::: reference
### `label()`

**Returns:** `string`

Returns the name shown for this mark in Editor Configs and on its toolbar button. Defaults to the type name with an uppercase first letter.
:::

::: reference
### `icon()`

**Returns:** `string|null`

Returns the SVG markup for this mark's toolbar button, or `null` when it has no icon of its own.
:::

::: reference
### `surfaces()`

**Returns:** `array`

Returns where this mark can appear as a button, using the `EditorSurface::Toolbar` and `EditorSurface::Bubble` constants. Defaults to `[EditorSurface::Toolbar, EditorSurface::Bubble]`. An empty array means the mark has no button.
:::

::: reference
### `group()`

**Returns:** `string|null`

Returns the group this mark is listed under in Editor Configs, as an `EditorGroup` constant such as `EditorGroup::Text` or `EditorGroup::Media`. Marks are listed under `EditorGroup::Marks` by default.
:::

::: reference
### `tag()`

**Returns:** `string|array|null`

Returns the HTML tag this mark renders, such as `'strong'` for bold text. Returns `null` when the mark renders no tag of its own.
:::

::: reference
### `tagForAttrs()`

**Returns:** `string|array|null`

**Arguments:** `array $attrs`, the attributes of the occurrence

Returns the HTML tag for one occurrence of this mark, based on its attributes. It returns `tag()` unless a mark needs a different tag for different attributes, such as a mark whose tag depends on its settings.
:::

::: reference
### `isSelfClosing()`

**Returns:** `bool`

Returns whether this mark's tag has no closing tag, such as `<img>` or `<hr>`.
:::

::: reference
### `normalizeAttrs()`

**Returns:** `array`

**Arguments:** `array $attrs`, the stored attributes, and `RenderContext $ctx`, the field, owner and site being read

Returns this mark's attributes in the form Vizy stores, such as with values trimmed or limited to the allowed choices. Vizy calls it when it reads a stored document.
:::

::: reference
### `resolveAttrs()`

**Returns:** `array`

**Arguments:** `array $attrs`, the stored attributes, and `RenderContext $ctx`, the field, owner and site being rendered

Returns the attributes used to render one occurrence of this mark, such as a resolved URL in place of a stored element reference. Vizy calls it while rendering, so the result is never stored.
:::

::: reference
### `renderOccurrenceHtml()`

**Returns:** `string|null`

**Arguments:** `string $children`, the rendered inner HTML, `array $resolvedAttrs`, the result of `resolveAttrs()`, and `RenderContext $ctx`

Returns the complete HTML for one occurrence of this mark, for output that a single wrapping tag can't produce. Returns `null` to render `tagForAttrs()` around the content instead. When it returns HTML, the `modifyTag` event doesn't run.
:::

::: reference
### `dependencies()`

**Returns:** `array`

Returns the other types this mark can't work without, as keys such as `mark:bold` or `node:listItem`. Enabling this mark in an Editor Config also enables them.
:::

::: reference
### `implies()`

**Returns:** `array`

Returns other types to enable alongside this mark, as keys such as `node:listItem`. Vizy enables them in the same way as `dependencies()`.
:::

::: reference
### `alwaysEnabled()`

**Returns:** `bool`

Returns whether this mark is enabled in every Editor Config, even when the config doesn't list it.
:::

::: reference
### `isInternal()`

**Returns:** `bool`

Returns whether this mark is only used inside another type and can't be selected in Editor Configs on its own. None of Vizy's built-in marks are internal.
:::


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
| `textStyle` | `<span style="…">` | Safe text/background colours, font family, font size, and line height from Vizy’s fixed authoring choices |
| `rubyText` | `<ruby><rb>…</rb><rt>…</rt></ruby>` | `rt` stores the annotation text |
| `link` | `<a>` | **Semantic storage** (not a bare `href`): `type` (`url` / `email` / `tel` / `sms` / `entry` / `asset` / `category`), `value` or `targetUid`, optional `siteMode` / `siteUid` / `suffix` / `newWindow`. Render resolves `href` via `Link::resolveHref` + HTMLPurifier URI schemes (`http`/`https`/`mailto`/`tel`/`sms`). Rejected URIs omit the `<a>` (inner text kept). `_blank` adds `rel="noopener noreferrer"`. GraphQL also exposes `url` / `element` convenience fields |

Authoring-only keys (`type`, `value`, `targetUid`, …) are stripped before HTML is emitted, so they never become attributes.
