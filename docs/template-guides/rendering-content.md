# Rendering Content

When you read a Vizy field in Twig — for example `entry.vizyField` — you get a
**`VizyDocument`**: the field’s saved content as Vizy understands it. In the entry’s Twig template, replace `vizyField` with your field’s handle and call `render()` where its HTML should appear.

## Automatic Rendering

The simplest approach is to let Vizy render the whole document. Core nodes
(paragraphs, headings, links, and so on) use Vizy’s renderer. Vizy Blocks use
their [Block Type Templates](docs:template-guides/block-type-templates) when
you’ve set one.

```twig
{{ entry.vizyField.render() }}

{# Skip empty fields #}
{% if not entry.vizyField.isEmpty() %}
    {{ entry.vizyField.render() }}
{% endif %}
```

For example, type “Read our guide” in a paragraph, then use the link control to link “guide” to `https://example.com/guide`. Save the entry with **New Window** off. Rendering produces:

```html
<p>Read our <a href="https://example.com/guide">guide</a></p>
```

Blocks appear in automatic HTML when their Block Type has a template. If a block is missing from the output, check that it is enabled and its type has a template assigned. You can also render selected root blocks yourself using [Modular Templates](docs:template-guides/modular-templates).

## Working with Blocks and Nodes

To read enabled blocks at the document’s root:

```twig
{% for block in entry.vizyField.query().where({ type: 'vizyBlock' }).all() %}
    {{ block.handle }}
{% endfor %}
```

Use `entry.vizyField.blocks()` when you also need blocks inside layouts. It returns enabled blocks in document order. Pass `false` for disabled blocks or `null` for both states. Fields nested inside blocks are separate documents; read them through their field handles.

To walk the document’s root content as raw node data (each item has a `type`,
and may have `attrs`, `content`, and `marks`):

```twig
{% for node in entry.vizyField.content().nodes() %}
    {{ node.type }}
{% endfor %}
```

`entry.vizyField.traverse()` follows node children, including layouts, but does not enter fields nested inside blocks. For most sites,
[Block Type Templates](docs:template-guides/block-type-templates) plus
`render()` is enough without hand-rolling every node. Larger custom loops are
covered in [Modular Templates](docs:template-guides/modular-templates).

## Raw Document Data

To inspect what’s stored, dump the canonical document:

```twig
{{ dump(entry.vizyField.toArray()) }}

{# Root nodes only #}
{{ dump(entry.vizyField.content().toArray()) }}
```
