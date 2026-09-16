# Rich Text

Vizy lets editors combine paragraphs, headings, lists, links, and media in the same field. The field’s [Editor Config](docs:feature-tour/editor-configs) determines which tools are available, so a short introduction can have a simpler toolbar than a full article.

## Nodes and Marks

Vizy calls the pieces of a document **nodes**. A paragraph, heading, image, or table is a node. Formatting applied within text is called a **mark**: for example, a paragraph can contain a bold phrase and a linked word without applying either style to the rest of the paragraph.

These terms are useful when configuring or extending the editor. Editors can work with the visible tools without knowing the underlying names. Developers can read more in [Node](docs:developers/node) and [Mark](docs:developers/mark).

## Editing Content

Use the formatting and alignment controls to arrange text, and the link control to link to a URL or an available Craft element. Image and file choices depend on the field’s volume and transform settings.

When tables are enabled, placing the cursor inside a table exposes its contextual menu. Embeds and iframes use a URL dialog; Vizy checks their URLs and HTML when producing frontend output.

Choose the tools your editors need in the Editor Config. If the content needs columns as well as rich text, see [Layout and Columns](docs:feature-tour/layout-and-columns).
