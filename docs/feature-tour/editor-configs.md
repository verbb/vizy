# Editor Configs

An **Editor Config** defines which content a Vizy field may contain and which editing controls it offers. For example, a short introduction might allow paragraphs, bold, italic, and links, while an article also needs headings, images, tables, layouts, and Vizy blocks.

Configs are named and reusable. Several fields can share one config when they need the same editing experience, and changes to that config apply everywhere it is selected. Create a separate config when a field has a different purpose rather than filling every toolbar with every available control.

## Create a Config

Open **Settings → Vizy → Editor Configs** and create a config. Give it a descriptive name such as Article or Short Text, then work through its available content, toolbar, dropdowns, Bubble Menu, and insertion settings.

Start with the content editors must be able to create. Capabilities permit headings, lists, media, layouts, tables, formatting marks, and registered extensions. Paragraphs and line breaks form part of the editor’s basic schema and do not need separate capability switches.

Arrange the toolbar after choosing the capabilities. A control that depends on disallowed content is not included in the effective editor, even if its ID remains in a hand-written config. This keeps the saved document and its visible editing controls consistent.

## Arrange the Toolbar and Menus

Drag controls into the toolbar in the order editors should encounter them. Use separators when they make a long toolbar easier to scan, and prefer a registered dropdown when several related choices belong together.

Vizy provides Formatting, Alignment, and Table dropdowns. Placing a dropdown controls its position; its roster determines which registered members it contains. You can trim or reorder that roster without enabling content that the config otherwise disallows.

The Bubble Menu appears when an editor selects text. It is a flat row of supported formatting controls rather than a second full toolbar. Keep it focused on actions that are useful for a selection, such as bold, italic, and links.

[Editor Capabilities](docs:feature-tour/editor-capabilities) lists the built-in capabilities, control IDs, dropdowns, and supported editing surfaces.

## Configure Block Insertion

The toolbar’s **Add Block** control, the gutter `+`, and the `/` menu are independent. A config can enable any combination of them:

- Place **Add Block** in the toolbar when block insertion should remain visible.
- Enable the gutter control to offer `+` beside the current content position.
- Enable slash insertion so `/` in an empty paragraph opens the block choices.

All three surfaces use the Block Types allowed by the Vizy field. The Editor Config controls where insertion begins; the field’s Block Configuration controls what can be inserted.

## Apply the Config to a Field

Open the Vizy field’s settings and select the config under **Editor Config**. The field’s Editor Mode still determines whether rich text, blocks, or both are permitted. A **Rich Text Only** field does not gain Vizy blocks merely because its config contains **Add Block**.

Save the field and open an entry that uses it. Check the toolbar, select text to inspect the Bubble Menu, and try each enabled insertion control. Create representative content, save it, and reopen the entry to confirm that the schema and controls support the intended workflow.

A Vizy field nested inside a block selects its own Editor Config. This lets a Callout Body offer a smaller set of tools than the surrounding Article Body without changing the parent field.

## Store a Config in a JSON File

You can define an Editor Config in `config/vizy/{id}.json` when its source should live in the project repository. For example, `config/vizy/article.json` provides the ID `article`. File configs appear in the control panel for inspection and selection, but their contents must be edited in the file.

Control-panel configs are stored in Craft’s Project Config. File configs and control-panel configs share the same ID namespace; when both define the same ID, the Project Config version takes precedence. Use distinct IDs when both should remain available.

[Configuration](docs:get-started/configuration#editor-configuration) provides the JSON structure and supported keys. After changing a file config, reload an entry using it and verify the effective toolbar, menus, capabilities, and insertion controls.
