# Block Type Templates

A Block Type template supplies the HTML for a structured block when you render a Vizy field. For example, an Image & Text block can place an optional image beside a short description. Set up its fields and template together so the values editors enter have a defined place on the page.

## Create the Block Type

Create these Craft fields in **Settings → Fields**: a Plain Text field named **Text** with the handle `text`, and an Assets field named **Image** with the handle `image`. Configure Image to accept images and allow one selection. Leave it optional for this example.

In **Settings → Vizy → Block Types**, create **Image & Text** with the handle `imageText`. Add Text and Image to its field layout. Block Types are shared across Vizy fields, so use a new type for this example rather than changing one already used elsewhere.

Set **Template** to `_vizy/blocks/image-text` and save. Open your Vizy field’s settings, choose a mode that permits blocks, and include Image & Text in its Block Configuration. Save the field and ensure it is on the entry type’s field layout.

## Create the Template

Create `templates/_vizy/blocks/image-text.twig` in your Craft project:

```twig
{% set image = block.image.one() %}

<div class="image-text">
    <div class="image-text__text">
        {{ block.text }}
    </div>

    {% if image %}
        <div class="image-text__image">
            <img src="{{ image.url }}" alt="{{ image.alt ?? '' }}">
        </div>
    {% endif %}
</div>
```

The template receives the current block as `block` and its Block Type as `type`. Access each field through `block` using its handle. The image is resolved once and only rendered when one has been selected. Style the two classes in your site’s stylesheet to suit the design.

## Render and Check the Result

Open an entry, insert Image & Text, enter a description, choose an image with suitable alternative text, and save. In the entry’s Twig template, place the following where the article body should appear, replacing `vizyField` with your Vizy field’s handle:

```twig
{{ entry.vizyField.render() }}
```

Vizy renders the surrounding text and calls the assigned template for each enabled block. A Block Type without a template contributes no automatic HTML. Check an entry with an image and another without one; both should show their text without a broken image. Disable the block and check that automatic rendering omits it.

If a block does not appear, check that it is enabled and its type has the correct Template path. For rendering selected root blocks separately, see [Modular Templates](docs:template-guides/modular-templates).
