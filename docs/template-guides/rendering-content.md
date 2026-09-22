# Rendering Content

Reading a Vizy field in Twig returns a `VizyDocument`. Call `render()` where the complete field should appear in the entry template, replacing `articleBody` with your field handle:

```twig
{% if not entry.articleBody.isEmpty() %}
    <div class="article-body">
        {{ entry.articleBody.render() }}
    </div>
{% endif %}
```

Vizy renders the nodes in their authored order. Paragraphs, headings, lists, links, images, tables and layouts use Vizy’s renderer. Each Vizy Block uses the template assigned to its Block Type.

For example, a paragraph containing a link renders as:

```html
<p>Read our <a href="https://example.com/guide">studio guide</a>.</p>
```

Your site’s styles control the appearance of that HTML. See [Styling Layouts](docs:template-guides/styling-layouts) for the structural HTML and CSS used by Layout and Column nodes.

## Choose a Rendering Approach

Start with `render()` unless the page needs a more specialised result:

- Assign a [Block Type Template](docs:template-guides/block-type-templates) when a structured Vizy Block needs its own markup.
- Use [Querying Nodes](docs:template-guides/querying-nodes) when you need selected root content separately, such as a list of callouts or headings.
- Use [Events](docs:developers/events#customising-rendered-html) when a module or plugin needs to change the HTML generated for a built-in node or mark.
- Use [GraphQL](docs:developers/graphql) when another application will render the document.

Avoid manually recreating Vizy’s complete renderer from raw node arrays. Doing so means handling nested nodes, marks, asset resolution, sanitisation, layouts and custom extensions yourself.

## Rendering Blocks

An enabled Vizy Block contributes HTML only when its Block Type has a template. If a block is missing from the output, check that:

- the block is enabled;
- its Block Type still exists;
- the Block Type has a valid site template path; and
- the template can render the Block Type’s current field layout.

Disabled blocks are omitted from `render()`. Nested Vizy fields are separate documents and must be rendered from their Block Type template. See [Block Type Templates](docs:template-guides/block-type-templates#render-a-nested-vizy-field).

## Rendering Selected Content

A node query is useful when content also needs to appear outside the main document. This example displays root callout blocks in an aside while the complete Vizy field retains its normal rendering:

```twig
{% set callouts = entry.articleBody.query()
    .where({ type: 'vizyBlock', handle: 'callout' })
    .all() %}

{% if callouts %}
    <aside class="article-callouts">
        {% for block in callouts %}
            <p>{{ block.text }}</p>
        {% endfor %}
    </aside>
{% endif %}

{{ entry.articleBody.render() }}
```

This does not remove the callouts from the complete document. It creates an additional presentation of the selected data. See [Querying Nodes](docs:template-guides/querying-nodes) for filtering, ordering and enabled-state controls.

## Inspecting Stored Content

Use the document APIs when debugging a template or integration:

```twig
{# The complete canonical document #}
{{ dump(entry.articleBody.toArray()) }}

{# Root node arrays only #}
{{ dump(entry.articleBody.content().nodes()) }}
```

`content().nodes()` exposes raw TipTap-shaped data. `traverse()` walks the outer node tree, including content inside layouts, but does not enter Vizy fields stored inside blocks. `blocks()` returns enabled Vizy Blocks from the outer tree in document order. These APIs are generally unnecessary for ordinary full-document rendering.
