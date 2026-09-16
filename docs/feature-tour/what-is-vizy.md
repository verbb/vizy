# What Is Vizy

Vizy is a content editor field for Craft CMS. Editors can write paragraphs, add images and links, and place structured blocks between their text. For example, an article can combine a written introduction with a quote, an image gallery, and a callout, all in one field.

## Combining Text and Blocks

Use rich text for content that editors write freely. Use a **Block Type** when a piece of content needs a consistent set of fields, such as a callout with a heading and a body. A Block Type uses your existing Craft fields, and you choose which types each Vizy field offers.

Block Types are shared across fields. Editing a type changes its definition wherever it is used; each block in an entry still has its own content. [Blocks and Block Types](docs:feature-tour/blocks-and-block-types) explains how to set them up.

## Choosing Editing Tools

An **Editor Config** controls the available formatting and toolbar. A short introduction might offer bold, italic, and links, while an article needs headings, tables, and images. Several fields can share a config so their editing tools stay consistent.

The field’s **Editor Mode** determines whether editors can use rich text, blocks, or both. Start with [Field Settings](docs:feature-tour/field-settings), then see [Editor Configs](docs:feature-tour/editor-configs) for configuring the tools.

## Displaying Content

Vizy stores structured content as JSON. Your templates can render the whole field as HTML or read individual pieces when a page needs a more specific output. Give each Block Type a Twig template to control the markup for its fields.

[Rendering Content](docs:template-guides/rendering-content) shows how to display a field. [Block-Based Editor](docs:feature-tour/block-based-editor) explains the stored structure for developers who need to work with individual nodes.

## Nesting Content

A block can contain another Vizy field. For example, a callout can have its own rich-text body with fewer tools than the surrounding article. [Nested Vizy](docs:feature-tour/nested-vizy) explains how to configure this.

Read [Limitations](docs:feature-tour/limitations) when planning relationships, imports, or a headless frontend.
