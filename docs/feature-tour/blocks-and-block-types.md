# Blocks and Block Types

Vizy blocks let editors add structured content alongside their text. For example, an article can contain paragraphs followed by a callout with a heading, an image, and a link. You define the fields that belong in that callout once, then editors can add it wherever the field allows it.

## Defining a Block Type

A **Block Type** describes the fields and settings available when an editor creates a block. Give it a name, handle, and icon, then arrange its Craft fields and any headings or instructions in its field layout. You can also provide a preview image to help editors recognise it and a Twig template to control its output.

Open **Settings → Vizy → Block Types** to manage types, or create and edit them from the Vizy field’s Block Configuration. Block Types are shared: editing one changes its definition in every field that uses it. Create a separate type when only one field needs a different set of fields. Use each Vizy field’s Block Configuration to choose the types it offers. **Groups** organise the types in the picker, so you might keep callouts and quotes together while placing image and video types in a separate group. See [Field Settings](docs:feature-tour/field-settings) for the setup.

## Adding and Editing Blocks

Editors can insert a block from the toolbar’s **Add Block** control, the `+` beside the content, or by typing `/` in an empty paragraph. They choose an available Block Type and fill in its fields. Each block has its own values, even when several blocks share the same type.

Blocks can be collapsed, reordered, disabled, or deleted. Disable a block when you want to keep its content without including it in the usual frontend output. Enable **Confirm Block Deletion** on the Vizy field if editors should confirm before removing a block.

For a block that needs its own rich text or further blocks, add a Vizy field to its layout. [Nested Vizy](docs:feature-tour/nested-vizy) explains that arrangement.

## Displaying Blocks

Assign a Twig template to a Block Type when you want Vizy to include it in automatic rendering. Your template reads the block’s fields and supplies the HTML for that piece of content. You can also loop through blocks in your page template for more control. See [Block Type Templates](docs:template-guides/block-type-templates) for a worked example and [Rendering Content](docs:template-guides/rendering-content) for displaying the whole field.
