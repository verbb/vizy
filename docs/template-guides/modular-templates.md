# Modular Templates

When you need more control than
`{{ entry.vizyField.render() }}` with
[Block Type Templates](docs:template-guides/block-type-templates), keep custom
Twig organised by Block Type or node type rather than one giant template.

## Start with Block Type Templates

For Vizy Blocks, assign a template on the Block Type and call `render()`. That’s
the modular path Vizy is built around, and it’s usually enough.

## Manual Loops

To render selected blocks at the document’s root individually, create a Twig file for each Block Type in `templates/_vizy/blocks/`. For a type with the handle `callout`, use `callout.twig`. Each included file can read the current `block` and its field values. Place this loop in the entry template, replacing `vizyField` with your field’s handle:

```twig
{% for block in entry.vizyField.query().where({ type: 'vizyBlock' }).all() %}
    {% include '_vizy/blocks/' ~ block.handle ignore missing %}
{% endfor %}
```

The query returns enabled blocks; filtering by type preserves that default. It selects root blocks; it does not flatten layouts or nested Vizy fields. Use automatic rendering when you need to preserve that surrounding structure.

You can use the same approach for root nodes such as paragraphs. Create a file for each type in `templates/_vizy/nodes/`, plus `default.twig` for types without their own template. The following loop chooses the matching file, falling back to `default.twig`:

```twig
{% for node in entry.vizyField.content().nodes() %}
    {% include [
        '_vizy/nodes/' ~ node.type,
        '_vizy/nodes/default'
    ] %}
{% endfor %}
```

Keep each partial small and focused. Share common markup with further
`{% include %}` tags or macros.
