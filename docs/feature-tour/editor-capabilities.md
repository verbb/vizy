# Editor Capabilities

An Editor Config separates what a Vizy document may contain from where its controls appear. **Capabilities** allow content such as headings, images, tables, and formatting marks. The toolbar and Bubble Menu then place controls for the allowed capabilities. This prevents a hidden toolbar button from becoming the only thing that protects the document schema.

Use the visual builder in **Settings → Vizy → Editor Configs** for normal configuration. The IDs on this page are useful when reviewing that setup or maintaining a JSON config under `config/vizy/`.

## Text Structure

Paragraphs and line breaks are always available in rich-text content. Other text structures must be enabled as capabilities before their controls can be placed.

| Feature | Capability ID | Control ID | Where It Appears |
| --- | --- | --- | --- |
| Paragraph | Always enabled | `paragraph` | Toolbar or Formatting dropdown |
| Heading | `heading` | `heading1`–`heading6` | Toolbar or Formatting dropdown; limited by configured heading levels |
| Quote | `blockquote` | `blockquote` | Toolbar or Formatting dropdown |
| Code block | `codeBlock` | `codeBlock` | Toolbar or Formatting dropdown |
| Bulleted list | `bulletList` | `bulletList` | Toolbar |
| Numbered list | `orderedList` | `orderedList` | Toolbar |
| Horizontal rule | `horizontalRule` | `horizontalRule` | Toolbar |
| Line break | Always enabled | `hardBreak` | Toolbar |

The Formatting dropdown uses `dropdown:formatting`. Its standard roster contains Paragraph, the allowed heading levels, Quote, and Code Block. A config can trim or reorder that roster without changing which capabilities the document permits.

## Inline Formatting and Links

Formatting marks apply to selected text and can appear in the toolbar or Bubble Menu.

| Feature | Capability and Control ID | Result |
| --- | --- | --- |
| Bold | `bold` | Strongly emphasised text |
| Italic | `italic` | Emphasised text |
| Underline | `underline` | Underlined text |
| Strikethrough | `strike` | Struck text |
| Subscript | `subscript` | Subscript text |
| Superscript | `superscript` | Superscript text |
| Inline code | `code` | Inline code text |
| Highlight | `highlight` | Highlighted text |
| Link | `link` | A URL, email, telephone, SMS, Entry, Asset, or Category link |

`textStyle` is a carrier capability for value-based text styling rather than a standalone button. Features that store a font, colour, size, or similar value can use it, but enabling `textStyle` by itself does not add a toolbar control.

The field’s **Enabled Link Settings** determine whether the Link dialog offers Link Text, New Window, Site, Title, and Classes. These field settings apply independently of where the Link control appears.

## Alignment

Alignment is an editor action rather than a separate content capability. Place `alignLeft`, `alignCenter`, `alignRight`, or `alignJustify` directly, or use `dropdown:alignment` for the standard menu. Alignment applies an attribute to the current paragraph or heading.

## Media and Embedded Content

| Feature | Capability and Control ID | Behaviour |
| --- | --- | --- |
| Image | `image` | Selects or uploads an image using the field’s Asset settings |
| Iframe | `iframe` | Inserts an iframe from a URL |
| Media embed | `mediaEmbed` | Inserts supported media from a URL |

Image controls follow the field’s upload location, allowed volumes, and available transforms. The chosen transform controls the editor preview; your frontend still needs to apply the transform required by its design. Iframe and media embed output is sanitised when rendered.

## Tables

Enable the `table` capability and place `dropdown:table` to insert and edit tables. Its standard menu includes inserting or deleting a table, adding or deleting rows and columns, merging or splitting cells, and toggling header rows, columns, or cells. These commands only appear when the Table capability is available, and editing commands become relevant when the cursor is inside a table.

## Layouts

Enable and place `layout` to let editors arrange content in columns. The control opens the configured presets and wraps the selected content in a layout. Each preset uses a 12-column grid and can store when its columns should stack. The default stacking value is `small`; the site’s stylesheet decides which breakpoint that value represents.

Layouts describe content structure rather than frontend styling. Rendered layouts use a `.vizy-layout` wrapper and `.vizy-column` children; [Styling Layouts](docs:template-guides/styling-layouts) provides a complete CSS example.

## Vizy Blocks and Insertion Controls

`addBlock` opens the field’s configured Block Types from the toolbar. It is an editor action rather than a document capability because the Vizy block schema is governed by the field’s Editor Mode and Block Configuration.

The toolbar control is independent of `gutterInsert` and `slashInsert`. A config can provide any combination of the toolbar button, gutter `+`, and `/` menu. All enabled insertion surfaces use the same field-specific Block Type choices.

## History and Cleanup

`undo`, `redo`, and `clearFormatting` are editor actions that do not require capabilities. `separator` adds a visual divider between toolbar controls and can be used more than once.

Vizy does not currently ship a built-in behaviour-only extension. Plugins and modules can register additional nodes, marks, extensions, controls, and dropdowns. [Extending Vizy](docs:developers/extending-vizy) describes that registration contract.
