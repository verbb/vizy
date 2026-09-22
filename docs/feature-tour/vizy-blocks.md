# Vizy Blocks

Vizy blocks place structured content among an editor’s text. Use a block when a piece of content needs a repeatable set of fields rather than free-form formatting. For example, a Callout block can always ask for a heading, body, image, and link while still appearing between ordinary article paragraphs.

Each block is created from a **Block Type**. The type defines its fields and presentation in the editor; each block added to an entry stores its own values. Block Types are shared definitions, so two fields can offer the same Callout type without duplicating its field layout.

## Add a Block

Open an entry containing a Vizy field in **Blocks & Rich Text** or **Blocks Only** mode. An editor can insert an allowed block from any insertion control enabled for that field:

- **Add Block** in the toolbar opens the block picker.
- The gutter `+` inserts a block beside the current content position.
- Typing `/` in an empty paragraph opens the same choices from the keyboard.

The picker can display Block Types as a list or a grid with icons and preview images. Groups keep a larger set organised into recognisable choices such as Text, Media, or Calls to Action.

Choose a type and complete its fields. The block stays in the same content order as surrounding paragraphs, images, tables, and layouts.

## Manage Blocks in an Entry

Blocks can be collapsed to make a long document easier to scan, reordered with the surrounding content, disabled, or deleted. Disabling a block keeps its content but excludes it from ordinary rendered and queried output. This is useful when an editor wants to retain a seasonal callout without publishing it.

A field can require a minimum number of blocks, set a maximum, or ask for confirmation before deletion. Configure those rules in [Field Settings](docs:feature-tour/field-settings#block-limits-and-deletion), then test the field with content at either limit.

## Add Content inside a Block

A Block Type can use the same Craft fields available elsewhere in an entry layout. It can also contain another Vizy field when the block needs its own rich text or structured children. Matrix remains available when the nested items must be Craft entries. [Nested Content](docs:feature-tour/nested-content) explains how to choose between those approaches.

Site builders define the available types, fields, groups, icons, and previews in [Block Types and Groups](docs:feature-tour/block-types-and-groups). Frontend templates for blocks are covered separately in [Block Type Templates](docs:template-guides/block-type-templates).
