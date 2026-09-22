# Choosing Insertion Controls

Vizy provides different controls for inserting structured blocks and editing rich text. Choose the control that matches what you are adding: a callout made from Craft fields belongs in **Add Block**, while an inline emoji or abbreviation belongs on the toolbar.

## Adding a Structured Block

Create a Block Type and include it in the Vizy field’s Block Configuration. Editors can choose it from **Add Block**, the `+` beside the content, or `/` in an empty paragraph. These controls list Vizy Block Types, including their groups and preview images.

Follow [Blocks and Block Types](docs:feature-tour/blocks-and-block-types) to configure the type. Open an entry using the field, insert the block, fill in its fields, and save. Reopen the entry to check its content, then check its [Block Type template](docs:template-guides/block-type-templates) on the frontend.

## Adding a Rich-Text Control

For an inline feature, register a node or mark and place its control on the field’s Editor Config toolbar. [Creating a Custom Node from Scratch](docs:guides/developers/creating-a-custom-node-from-scratch) walks through an emoji button, and [Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch) adds abbreviation formatting.

The toolbar's **Add Block** control, the gutter `+`, and `/` insertion are restricted to Block Types; they are not general action launchers. Register a rich-text node or action on the toolbar instead. Use `Craft.Vizy.registerControl()` when its toolbar button needs custom behaviour, as shown in the node guide.

After enabling the control, test it from the toolbar, save the entry, and inspect the rendered HTML. A working editor button needs both its JavaScript action and its PHP rendering definition.
