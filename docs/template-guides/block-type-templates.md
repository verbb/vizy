# Block Type Templates

A Block Type template defines the frontend HTML for a structured Vizy Block. When `render()` reaches an enabled block, Vizy renders the site template assigned to that Block Type.

## Create a Block Type

Create these Craft fields in **Settings → Fields**:

- a Plain Text field named **Text** with the handle `text`; and
- an Assets field named **Image** with the handle `image`, restricted to images and one selection.

In **Settings → Vizy → Block Types**, create **Image & Text** with the handle `imageText`. Add Text and Image to its field layout, then set **Template** to `_vizy/blocks/image-text`.

Block Types are global and can be used by multiple Vizy fields. Open the relevant Vizy field, choose a mode that permits blocks, then add Image & Text to its Block Configuration.

## Create the Template

Create `templates/_vizy/blocks/image-text.twig` in the Craft project:

```twig
{% set image = block.image.one() %}

<section class="image-text">
    <div class="image-text__content">
        {{ block.text }}
    </div>

    {% if image %}
        <div class="image-text__image">
            <img src="{{ image.url }}" alt="{{ image.alt ?? '' }}">
        </div>
    {% endif %}
</section>
```

Render the Vizy field from the entry template:

```twig
{{ entry.articleBody.render() }}
```

Vizy renders the surrounding rich text and calls the assigned template whenever it reaches an enabled Image & Text block.

## Available Variables

Every Block Type template receives:

| Variable | Value |
| --- | --- |
| `block` | The current Vizy Block. Read custom fields from it by handle, such as `block.text` or `block.image`. |
| `type` | The block’s Block Type model, including properties such as `type.name`, `type.handle` and `type.uid`. |

Useful block properties include:

| Property | Value |
| --- | --- |
| `block.uid` | The persistent ID for this block instance. |
| `block.handle` | The Block Type handle. |
| `block.enabled` | Whether this block is enabled. Disabled blocks are not passed to the template during automatic rendering. |
| `block.<fieldHandle>` | The normalised value of a custom field in the Block Type’s field layout. |

Custom field values use the same Twig APIs as fields on entries. For example, use `block.image.one()` for an Assets field and `block.relatedEntries.all()` for an Entries field.

## Render a Nested Vizy Field

When the Block Type contains another Vizy field, read it through `block` and render it as its own document. For a nested field with the handle `body`:

```twig
{% if not block.body.isEmpty() %}
    <div class="image-text__body">
        {{ block.body.render() }}
    </div>
{% endif %}
```

The nested field uses its own Editor Config and Block Configuration. [Nested Content](docs:feature-tour/nested-content) covers the content-modelling considerations.

## Pass Variables to Block Templates

Pass shared values through `blockVariables` when every Block Type template in one render needs additional context:

```twig
{{ entry.articleBody.render({
    blockVariables: {
        theme: 'dark',
        showEyebrows: true,
    },
}) }}
```

The assigned template can then use `theme` and `showEyebrows` directly. Vizy always supplies the authoritative `block` and `type` variables; values with those names in `blockVariables` are replaced.

## Override a Template for One Render

Use `blockTemplates` when one presentation of a document needs a different template without changing the global Block Type setting. The map is keyed by Block Type UID:

```twig
{{ entry.articleBody.render({
    blockTemplates: {
        'c1f436f5-7633-4ce0-b2ca-9a71e874aab4': '_vizy/blocks/image-text-compact',
    },
}) }}
```

Only the listed Block Type is overridden. Other blocks continue using their assigned templates. Because UIDs differ between independently configured projects, keep this value in project-aware configuration rather than duplicating the example UID.

## Troubleshooting

A Block Type without a template contributes no automatic HTML. If a block does not appear:

- confirm the block is enabled;
- check that the Block Type is allowed by the Vizy field;
- confirm the Template setting is relative to the Craft `templates/` directory;
- check that the Block Type and its field layout still exist in Project Config; and
- test the template with and without optional relations such as images.

Use [Querying Nodes](docs:template-guides/querying-nodes) when the goal is to read selected blocks separately rather than change their normal templates.
