# Layout and Columns

Layouts arrange content in columns inside a Vizy document. For example, an editor can place an image beside an explanation, then continue with ordinary paragraphs beneath the layout.

## Adding a Layout

Enable layouts in the field’s [Editor Config](docs:feature-tour/editor-configs). The toolbar’s **Layout** control opens the available column presets. Choose a preset for the content you want to arrange. The `/` and `+` controls are for Vizy blocks; use the Layout toolbar control for columns.

Each column occupies part of a 12-column grid. Two equal columns each span six columns; a narrower column could span four while its neighbour spans eight. The layout stores a stacking value for your frontend stylesheet; layouts use `small` by default.

## Styling the Output

Vizy’s rendered HTML includes a `.vizy-layout` wrapper around `.vizy-column` elements. The wrapper provides `data-stack` and the `--vizy-cols` CSS variable. Each column provides `data-span` and `--vizy-col`, describing its width within the grid.

Add the following to your site’s stylesheet after rendering the field with `{{ entry.vizyField.render() }}`. It uses the stored column spans for widths and stacks a layout with `data-stack="small"` below a breakpoint chosen for this example:

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

The breakpoint and gap are your site’s design choices, not dimensions imposed by Vizy. With two columns of equal span, the content appears side by side on a wide screen and in document order on a narrow one. Add styles for any other stacking values your configuration uses.

Create a two-column layout with an image and a paragraph, save the entry, and check the page above and below the breakpoint. Also check long text and large images for overflow. [Modify Nodes](docs:template-guides/modify-nodes) explains how to customise the generated HTML.
