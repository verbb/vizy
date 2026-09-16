# Creating Your Own Formatting Buttons and Dropdown

The Formatting dropdown keeps headings, paragraphs, and similar choices behind
one toolbar button so the top row stays tidy. You can trim what’s in that menu,
and you can add your own options when a stock control isn’t enough.

Editor Configs name controls by id (`heading2`, `paragraph`, `bold`, and so on).
For custom formatting, define a node or mark and then place its control on the toolbar or inside Formatting. The Editor Config chooses controls; the type’s PHP definition controls its frontend HTML.

## The Stock Formatting Dropdown

Create `config/vizy/article.json` with the following content. This example enables heading levels 1–3 and places them in the Formatting dropdown with Paragraph and Blockquote. If you prefer the control-panel builder, make the same choices in **Settings → Vizy → Editor Configs**:

```json
{
    "label": "Article",
    "capabilities": {
        "nodes": ["heading", "paragraph", "blockquote"],
        "marks": ["bold", "italic", "link"]
    },
    "headings": {
        "levels": [1, 2, 3]
    },
    "toolbar": [
        "dropdown:formatting",
        "bold",
        "italic",
        "link"
    ],
    "dropdowns": {
        "formatting": [
            "heading1",
            "heading2",
            "heading3",
            "paragraph",
            "blockquote"
        ]
    }
}
```

`toolbar` places the Formatting menu beside Bold, Italic, and Link.
`dropdowns.formatting` trims and reorders what that menu contains. Heading
levels must also be allowed under `headings.levels`. See
[Configuration](docs:get-started/configuration).

Select the **Article** config on a Vizy field and save it. Open an entry using that field, then open Formatting to check its options. Apply a heading to a paragraph and save the entry. Reopen it to confirm the choice remains. Keep both `headings.levels` and `dropdowns.formatting` in sync when changing which heading levels the menu offers.

## Adding Your Own Formatting

A custom mark can give selected text a consistent HTML element that your stylesheet styles. Follow [Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch) to register an Abbreviation mark, enable it, and verify its HTML before adapting the example to your own formatting.

Once the mark’s control is available, add its ID to `toolbar` or to a registered dropdown’s members. Keep its capability enabled as well. For changes to the HTML of an existing node or mark, use [Modify Nodes](docs:template-guides/modify-nodes); changing the editor’s appearance alone does not define its frontend rendering.

See [Modifying the Toolbar Buttons](docs:guides/developers/modifying-the-toolbar-buttons) for control placement.
