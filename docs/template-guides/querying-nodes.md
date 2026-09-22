# Querying Nodes

Use a query when you need particular pieces of a Vizy field. For example, you can select an article’s root headings for a contents list or read callout blocks separately from its paragraphs.

The examples belong in an entry’s Twig template. They assume a Vizy field with the handle `vizyField`; replace it with your field’s handle. `query()` selects root nodes, including paragraphs and blocks. It does not search inside layouts or nested Vizy fields.

Use `query().where(...)` to select content. Queries keep their enabled scope when you add or replace ordinary filters. See [Node Query](docs:developers/node-query) for combining conditions.

## Display Callout Text

Create a Block Type with the handle `callout`, add a Plain Text field with the handle `text`, and allow that type in your Vizy field. Add two callouts at the root of an entry’s content and save it. Put this in the entry template:

```twig
<ul class="callouts">
    {% for block in entry.vizyField.query().where({ type: 'vizyBlock', handle: 'callout' }).all() %}
        <li>{{ block.text }}</li>
    {% endfor %}
</ul>
```

Each enabled root callout becomes a list item in document order. Other Block Types and surrounding paragraphs are left out. This reads the Plain Text field directly; it does not use the Block Type’s rendering template.

## Selecting Content

### Fetch Nodes

Fetch all paragraph nodes in a field:

```twig
{% set paragraphs = entry.vizyField.query().where({ type: 'paragraph' }).all() %}

{# Alternative syntax #}
{% set paragraphs = entry.vizyField.query().andWhere([ '=', 'type', 'paragraph' ]).all() %}
```

Fetch all Vizy Block and paragraph nodes:

```twig
{% set nodes = entry.vizyField.query().where({ type: ['vizyBlock', 'paragraph'] }).all() %}
```

Fetch Vizy Blocks for a given Block Type handle:

```twig
{% set blocks = entry.vizyField.query().where({ type: 'vizyBlock', handle: 'textBlock' }).all() %}
```

Fetch all nodes that are **not** a paragraph:

```twig
{% set nodes = entry.vizyField.query().andWhere([ '!=', 'type', 'paragraph' ]).all() %}

{# Alternative syntax #}
{% set nodes = entry.vizyField.query().andWhere([ 'not', { type: 'paragraph' } ]).all() %}
```

### Limit

```twig
{% set nodes = entry.vizyField.query().limit(2).all() %}
```

### Count

```twig
{{ entry.vizyField.query().count() }}

{{ entry.vizyField.query().where({ type: 'vizyBlock' }).count() }}

{{ entry.vizyField.query().where({ type: 'image' }).count() }}
```

### Order By

```twig
{% set nodes = entry.vizyField.query().orderBy('type DESC').all() %}
```

Order Vizy Blocks of type `textBlock` by a Plain Text field:

```twig
{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock' })
    .orderBy('plainText DESC')
    .all() %}
```

### Enabled

By default only **enabled** Vizy Blocks are returned (prose nodes always count as enabled). Control this with `enabled`:

```twig
{% set blocks = entry.vizyField.query().where({ enabled: true }).all() %}

{% set blocks = entry.vizyField.query().where({ enabled: false }).all() %}

{# Both enabled and disabled Blocks (and prose) #}
{% set nodes = entry.vizyField.query().where({ enabled: null }).all() %}
```

### Fields

For the following examples, create a Block Type with the handle `textBlock` and add Plain Text, Number, and Date fields with the handles `plainText`, `number`, and `date`. Read it through the entry’s Vizy field so Craft can resolve those field values:

```twig
{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock', plainText: '123' })
    .all() %}

{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock' })
    .andWhere(['=', 'plainText', '123'])
    .all() %}

{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock' })
    .andWhere(['>', 'number', 10])
    .all() %}

{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock' })
    .andWhere(['between', 'date', now | date_modify('-7 day'), now])
    .all() %}
```

On each Block result, field handles work like Matrix:

```twig
{% for block in entry.vizyField.query().where({ type: 'vizyBlock', handle: 'textBlock' }).all() %}
    {{ block.handle }}
    {{ block.plainText }}
{% endfor %}
```

<a id="available-methods"></a>
<a id="available-params"></a>

See [Node Query](docs:developers/node-query) for the full method and operator reference.

## Reading Content Without a Query

Use `blocks()` for enabled blocks throughout the outer node tree, including layouts. Use `blocks(false)` for disabled blocks or `blocks(null)` for both states. `findBlock(uid)` is an identity lookup and can return a disabled block. To read the root nodes as arrays, use `content().nodes()`; `traverse()` follows node children. These methods do not enter fields nested inside blocks. Read an inner Vizy field through its block field handle, as explained in [Nested Content](docs:feature-tour/nested-content#add-a-vizy-field-to-a-block).

See [Rendering Content](docs:template-guides/rendering-content) for examples of these approaches. GraphQL’s `nodes` and `blocks` fields also support filtering, limits, and ordering; see [GraphQL](docs:developers/graphql).
