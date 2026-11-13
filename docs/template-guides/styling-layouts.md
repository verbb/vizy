# Styling Layouts

Vizy layouts arrange document content in columns, but your site’s stylesheet controls their gap, width, and responsive behaviour. This keeps the editor’s structure independent of the CSS framework or breakpoints used by the frontend.

The example assumes a Vizy field rendered with `{{ entry.vizyField.render() }}` and a layout created from a two-column preset. Add the CSS to the site’s stylesheet after its general content styles.

## Read the Layout Attributes

Layouts need no Twig of their own. Rendering the field outputs them along with the rest of its content, so this entry template, with `articleBody` as the Vizy field's handle, is all the markup the styles below need:

```twig
{% if not entry.articleBody.isEmpty() %}
    <div class="article-body">
        {{ entry.articleBody.render() }}
    </div>
{% endif %}
```

A two-column layout with equal columns renders like this inside the wrapper:

```html
<div class="vizy-layout" data-stack="small" style="--vizy-cols:12">
    <div class="vizy-column" data-span="6" style="--vizy-col:6">
        <p>Text in the first column.</p>
    </div>
    <div class="vizy-column" data-span="6" style="--vizy-col:6">
        <p>Text in the second column.</p>
    </div>
</div>
```

Rendered layouts use a `.vizy-layout` wrapper around `.vizy-column` elements. The wrapper provides `data-stack` and the `--vizy-cols` CSS variable. Each column provides `data-span` and `--vizy-col`, describing its width within the 12-column grid.

A two-column layout with equal spans therefore provides two columns whose `--vizy-col` value is `6`. The stored stacking value indicates when those columns should return to document order, but it does not impose a CSS breakpoint.

## Add the Grid Styles

The following example displays columns using their stored spans and stacks a layout with `data-stack="small"` below a breakpoint chosen by the site:

```css
.vizy-layout {
    display: grid;
    grid-template-columns: repeat(var(--vizy-cols, 12), minmax(0, 1fr));
    gap: 1.5rem;
}

.vizy-column {
    grid-column: span var(--vizy-col, 12);
    min-width: 0;
}

.vizy-column img {
    max-width: 100%;
    height: auto;
}

@media (max-width: 48rem) {
    .vizy-layout[data-stack="small"] > .vizy-column {
        grid-column: 1 / -1;
    }
}
```

The breakpoint and gap are design choices rather than dimensions imposed by Vizy. Add equivalent rules for any other stacking values used by the project.

Create a layout containing long text and a large image, then check the page above and below the breakpoint. The columns should use their configured proportions on a wide screen, stack in document order on a narrow screen, and avoid horizontal overflow.

To change the generated elements or attributes rather than styling them, use the rendering events described in [Events](docs:developers/events#rendering-events).
