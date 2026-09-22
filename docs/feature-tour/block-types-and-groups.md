# Block Types and Groups

A Block Type defines a reusable piece of structured content that editors can insert into a Vizy field. For example, a Callout type might contain a heading, body, image, and link. Its definition is global, while every block inserted into an entry keeps its own field values.

Use Block Types to give editors a predictable structure for content that should not be recreated with rich-text formatting. Use groups to organise the types available on a particular Vizy field.

## Create a Block Type

Open **Settings → Vizy → Block Types** and create a type. Give it a clear name and handle, then arrange its Craft fields in the field layout. Tabs, headings, and instructions can help editors complete a larger block without changing the stored content.

Block Types are stored in Project Config and can be shared by several Vizy fields. Editing a type changes its definition wherever it is used. Create a separate type when one field needs a different layout rather than changing a shared type for every field.

Set a Twig template when the block should participate in automatic field rendering. The template is part of the site’s frontend implementation, so [Block Type Templates](docs:template-guides/block-type-templates) covers its variables and output separately.

## Help Editors Recognise a Type

Choose a bundled icon or provide an SVG in the folder configured by `iconsPath`. A concise label and distinct icon make similar block choices easier to scan.

A preview image can show the intended frontend result rather than the block’s field inputs. Preview images come from **Block Preview Images Path** (`blockPreviewImagesPath`) and are stored as paths relative to that folder, such as `blocks/image-text.png`. Deploy the folder with the project so every environment can display the same previews.

## Add Types to a Field

Open a Vizy field and use its **Block Configuration** to choose the global Block Types editors may insert. This allowlist belongs to the field: an Article Body can offer Callout, Gallery, and Quote while a Sidebar field offers only Callout.

Groups organise that field’s choices in the block picker. For example, put Callout and Quote in a Text group, and Gallery and Video in a Media group. Groups can be renamed and reordered without changing the global Block Type definitions.

The picker can use a list or grid presentation. Icons work well for a compact list, while preview images make a grid useful when the visual result is an important part of choosing a type.

## Check the Complete Workflow

Save the Block Type and field, then open an entry containing that field. Confirm that the type appears in the intended group, its icon or preview is recognisable, and its fields follow the expected layout. Add two instances to verify that they share a definition but retain independent values.

If the block needs its own rich text, structured children, or Matrix entries, plan that field layout with [Nested Content](docs:feature-tour/nested-content) before it is widely used.
