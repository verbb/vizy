# The Vizy Editor

Vizy is a content editor field for Craft CMS. An editor can write and format text, add links and media, arrange content in tables or columns, and insert structured Vizy blocks without leaving the field. Each Vizy field can offer a focused set of tools for the content it needs to collect.

Suppose an Article Body field needs ordinary prose, images, and reusable callouts. The editor writes the article directly in the editing surface, inserts images among the paragraphs, and adds a Callout block wherever structured fields are more appropriate than free-form text. The result remains one ordered piece of content even though its parts use different editing controls.

## Choose an Editing Mode

A field’s **Editor Mode** establishes its broad purpose:

- **Blocks & Rich Text** combines writing with structured Vizy blocks. This suits articles and flexible page content.
- **Rich Text Only** keeps the field focused on prose, links, and other configured editor features. This suits introductions and descriptions.
- **Blocks Only** lets editors assemble content from predefined Vizy blocks. This suits component-led pages and structured collections.

Choose the mode in the field’s [Field Settings](docs:feature-tour/field-settings). The selected [Editor Config](docs:feature-tour/editor-configs) then determines which rich-text and structural features appear, while the Block Configuration determines which Vizy blocks are available.

## Write and Format Content

Click in the field and start typing to create paragraphs. The toolbar can provide headings, quotes, code blocks, lists, alignment, links, media, tables, layouts, and inline formatting such as bold or italic. Select some text to use the Bubble Menu when the field’s Editor Config enables it.

The editor behaves like the content it represents. Applying **Bold** affects the selected words, choosing **Heading 2** changes the current text block, and inserting an image or table adds a distinct item in the document. The field’s tools constrain what can be authored, so a concise summary can offer fewer choices than a long-form article.

Links can point to URLs, email addresses, telephone numbers, SMS numbers, or supported Craft elements. Images use the volumes and transforms allowed by the field. Iframes and media embeds accept a URL and are checked again when Vizy produces frontend HTML.

Tables have contextual controls for rows, columns, cells, and headers. Layouts wrap selected content in columns and let the editor choose a preset. Both features must be enabled by the field’s Editor Config before their controls can appear. [Editor Capabilities](docs:feature-tour/editor-capabilities) lists every built-in feature and its configuration ID.

## Insert Vizy Blocks

A Vizy block is a structured section made from ordinary Craft fields. A Callout block might contain a heading, body, image, and link; a Gallery block might contain an Assets field and display settings. Editors fill in those fields instead of reproducing the structure with formatting each time.

Depending on the Editor Config, blocks can be inserted from the toolbar’s **Add Block** control, the `+` beside the content, or the `/` menu in an empty paragraph. All three controls use the Block Types allowed by the field. [Vizy Blocks](docs:feature-tour/vizy-blocks) explains the editing workflow, while [Block Types and Groups](docs:feature-tour/block-types-and-groups) covers their setup.

## Keep the Editing Experience Focused

An Editor Config is reusable, so fields with the same purpose can share the same tools. For example, an Article config might provide headings, links, images, tables, layouts, and blocks, while a Short Text config offers paragraphs, bold, italic, and links. Changing a shared config updates the editing experience for every field that uses it.

After configuring a field, add it to an entry type and create representative content. Check the toolbar, Bubble Menu, block insertion controls, and any contextual menus. Save and reopen the entry to confirm that the available tools support the intended content without presenting unrelated choices.
