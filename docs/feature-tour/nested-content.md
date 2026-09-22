# Nested Content

A Vizy block can contain another field for content that has its own structure. For example, a Callout block might have a short heading and a Vizy field for its body, while a Gallery block might use Matrix because each image item must remain a Craft entry.

Choose the nested field type according to how the content will be edited and used. A nested Vizy field is the usual choice for rich text and blocks that belong to their containing block. Matrix is useful when its rows need the identity and behaviour of Craft entries.

## Add a Vizy Field to a Block

Create the inner Vizy field in **Settings → Fields** and choose an Editor Mode and Editor Config suited to its job. A Callout Body might use **Rich Text Only** with paragraphs, bold, italic, and links. A collection of cards might use **Blocks Only** with a small set of Block Types.

Add that field to the parent Block Type’s field layout. When an editor inserts the parent block, the inner Vizy field appears with its own editing tools and block choices. Its content belongs to the surrounding block and is saved with the containing entry.

Vizy fields can nest five levels deep, with the entry’s top-level Vizy field counted as depth `0`. The editor refuses deeper nesting. Treat that as a safety limit rather than a target: several levels of collapsed blocks can make content difficult to find and maintain.

## Choose between Vizy and Matrix

Both fields can represent repeated or structured content, but they have different ownership and querying behaviour.

| Consideration | Nested Vizy | Matrix |
| --- | --- | --- |
| Stored items | Content inside the Vizy document | Separate Craft entries |
| Best suited to | Rich text, embedded blocks, cards, FAQs, and content owned by the parent block | Content that relies on Matrix entry identities, element queries, or existing Matrix integrations |
| Editing | Uses its own Editor Config and Vizy Block Types | Uses Matrix Entry Types inside the block |
| Storage cost | Remains within the document | Requires additional element and content records |
| Frontend access | Read through the nested Vizy field | Read as Matrix entries through the block field |

Use a nested Vizy field when the inner content only makes sense as part of the surrounding block. Choose **Blocks Only** when editors should create a structured list without free-form prose. This keeps the editing model close to the parent Vizy content and avoids creating entries that the site does not otherwise need to address.

Use Matrix when those rows genuinely need to remain Craft entries. Existing templates or integrations might query them as elements, depend on their UIDs, or use Matrix-specific behaviour. Matrix remains supported on both existing and new Block Type layouts.

## Use Matrix inside a Block

Add a Matrix field to the Block Type’s field layout and configure its allowed Entry Types as you would elsewhere in Craft. The Matrix input appears inside each instance of that Vizy block.

Matrix uses **Inline Blocks** inside Vizy. Editors can add, reorder, and remove rows within the containing entry’s editing and draft workflow. A Matrix field configured as Cards, a card grid, or an element index keeps that appearance elsewhere in Craft but uses inline editing inside Vizy.

Matrix creates more persisted records than nested Vizy, and the cost grows with the number of rows, sites, drafts, and nesting levels. Test representative content before adopting a large or deeply nested structure. Normal saves retain existing row identities, while publishing a draft can replace them; avoid treating a numeric Matrix entry ID as permanent across publication.

Developers maintaining existing Matrix content can review [Matrix in Vizy Blocks](docs:developers/matrix-in-vizy-blocks) for its save model, concurrent creation caveat, and backfill command.

## Keep the Editor Understandable

Open a representative entry after configuring the block. Add several parent blocks, fill in their nested fields, collapse and reorder them, then save and reopen the entry. Check that an editor can find the nested content and understand which controls belong to each level. If the structure is difficult to scan, use fewer levels or split the content into ordinary fields on the owning entry.
