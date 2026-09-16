Vizy is a Craft CMS plugin with a content editor field, combining everything you already know about WYSIWYG editing with the power of Matrix-style blocks into an all-new editor experience.

## What's new in Vizy 4

- **Canonical documents** — TipTap `doc` JSON plus Block Types in Project Config; opaque unknown nodes preserved.
- **Hosted Vizy** — nest Vizy fields inside Block layouts for structured composition. Existing Matrix-in-Block placements stay editable; you cannot add new Matrix fields to Blocks.
- **Named Editor Configs** — shared toolbar, capabilities, and Bubble Menu configs in the control panel or `config/vizy/*.json`.
- **TipTap extensibility** — register custom marks, nodes, and behaviour with PHP type classes and `Craft.Vizy.registerModule` / `registerControl` / `registerInsertion`.
- **Modern field UI** — Plugin Kit overlays, Layout & Columns, media embeds, and a refined Block authoring experience.
- **Document API** — `render()`, `query()` / `all()`, `blocks()`, `content()`, and `isEmpty()` on `VizyDocument`.
- **Class-level HTML overrides** — modify tags and rendered HTML per mark or node type.

## Features

- A fully-featured WYSIWYG field
- All content stored as JSON — no HTML-wrangling required
- Full control over front-end output (`render()`, Block Type templates, or manual loops)
- Create Blocks inline with formatted text — Matrix-style content between prose
- Nest Vizy fields on Block layouts (Hosted Vizy)
- Use your existing Craft fields on Block Types, including Field Layout UI Elements
- Tabs on Block Types to keep authoring UI lean
- Modular Block templates — link a Twig partial to each Block Type
- Performance focused — a single database call to fetch field content (no per-block element N+1)
- Query nodes like Matrix — `query().where(…).all()`
- Named Editor Configs for buttons, capabilities, and Bubble Menu
- GraphQL support via an opaque `VizyDocument` type
- Feed Me support for importing content
- Events and type classes to extend marks, nodes, and editor modules

### Authoring

- Paragraphs, headings, lists, tables, images, iframes, media embeds, and more
- Layout & Columns for multi-column prose
- Vizy Blocks with Field Layouts, collapse, enable/disable, and optional delete confirmation
- Slash / gutter / Browse insertion for Blocks and nodes
- Bubble Menu and toolbar controls driven by Editor Configs

### Templates & front end

- `{{ entry.myField.render() }}` for automatic HTML
- Block Type templates for modular Block markup
- `query()`, `blocks()`, `content().nodes()`, and `traverse()` for custom Twig
- PHP modify-tag / modify-rendered events for global or field-scoped HTML tweaks

### Upgrade from Vizy 3

Install Vizy 4 beside existing content, then run schema promotion before editing older fields. See [Upgrading from v3](https://verbb.io/craft-plugins/vizy/docs/get-started/upgrading-from-v3) for confirmation, owner jobs, Matrix grandfathering, and the API map.

## Documentation

Visit the [Vizy Plugin page](https://verbb.io/craft-plugins/vizy) for all documentation, guides, pricing and developer resources.

## Support

Get in touch with us via the [Vizy Support page](https://verbb.io/craft-plugins/vizy/support) or by [creating a Github issue](https://github.com/verbb/vizy/issues)
