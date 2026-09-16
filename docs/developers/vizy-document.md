# VizyDocument

Reading a Vizy field in Twig returns a **`VizyDocument`**, which represents that field’s saved content. It provides methods for rendering HTML, checking whether content exists, and reading individual nodes or blocks.

## Rendering a Field

In an entry template, replace `vizyField` with your Vizy field’s handle:

```twig
{% if not entry.vizyField.isEmpty() %}
    {{ entry.vizyField.render() }}
{% endif %}
```

This renders the document when it contains content. Vizy blocks need a Block Type template to appear in automatic HTML; see [Rendering Content](docs:template-guides/rendering-content).

## Reading Individual Pieces

Use `query()` to select nodes by type or other criteria. For example, the following reads paragraph nodes from the field:

```twig
{% set paragraphs = entry.vizyField.query()
    .where({ type: 'paragraph' })
    .all() %}
```

Use `blocks()` for enabled Vizy blocks, `blocks(false)` for disabled blocks, or `blocks(null)` for both states. These reads include blocks inside layouts. `findBlock(uid)` finds a block by identity regardless of its enabled state. [Querying Nodes](docs:template-guides/querying-nodes) covers filters, ordering, and limits.

For a content fragment, `content().blocks(recursive, enabled)` keeps the recursion choice separate: `content().blocks(false)` reads enabled root blocks, while `content().blocks(false, null)` reads root blocks in either state. The default recursive read includes layout columns but does not enter fields nested inside blocks.

## Inspecting Stored Data

`content().nodes()` reads the root nodes as arrays, while `traverse()` follows node children, including layouts, but does not enter fields nested inside blocks. Use `toArray()` to inspect the complete document in a development template:

```twig
{{ dump(entry.vizyField.toArray()) }}
```

This exposes stored data rather than rendered HTML. For changes to embedded custom fields from a module or migration, see [Managing Embedded Content](docs:developers/managing-embedded-content).
