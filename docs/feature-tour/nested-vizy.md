# Nested Vizy

Add a Vizy field to a Block Type’s field layout when that block needs its own rich text or structured blocks. For example, a callout can contain a short heading field and a separate Vizy field for its body. Editors can then add paragraphs and links inside the callout without mixing them with the surrounding article.

## Setting Up the Nested Field

Configure the inner Vizy field and choose its Editor Config, then place the field on the parent Block Type’s layout. The inner field appears inside the block when an editor adds that type. It uses its own editing tools, so a callout body can offer fewer choices than the main article field.

This arrangement is called **Hosted Vizy**. Its content belongs to the parent block. Saving the entry saves both the surrounding Vizy document and the nested content.

## Nesting Limits

Hosted fields can nest five levels deep, with the entry’s Vizy field counted as depth `0`. Vizy refuses deeper nesting. Keep the structure understandable for editors; several levels of blocks can make content harder to find even before reaching that limit.

## Displaying the Nested Field

Render the inner field from the parent Block Type’s Twig template. For an inner Vizy field with the handle `body`, put this where the callout’s text should appear:

```twig
{{ block.body.render() }}
```

Save an entry with text inside the callout and check the page. The inner field renders its own content, including any nested Block Type templates. See [Block Type Templates](docs:template-guides/block-type-templates) for the surrounding template setup.
