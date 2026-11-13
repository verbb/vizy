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

## Override Control Icons

Expand **Icons** at the bottom of the visual settings to select a control used by the config and replace its glyph with an icon from Vizy’s catalogue. Its summary reports how many overrides are active, and the visual grid follows the toolbar, dropdown, and Bubble Menu controls configured above it. An override belongs to the control ID, so Bold uses the same chosen icon in the toolbar, Bubble Menu, and any dropdown that contains it. Dropdown triggers can have their own overrides as well.

The catalogue includes project SVG files from `iconsPath`. Clearing the selected icon restores Vizy’s default or the icon registered by an extension. Icon overrides affect the authoring interface only; they do not change saved content or rendered HTML.

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

Modules can adjust a field's selected config at runtime with `EditorManifests::EVENT_MODIFY_EDITOR_CONFIG`. Vizy normalizes and hashes the effective config without writing those changes back to Project Config or its JSON file. See [Events](docs:developers/events#the-modifyeditorconfig-event).

## Store a Config in a JSON File

You can define an Editor Config in `config/vizy/{id}.json` when its source should live in the project repository, using the same keys as the Advanced JSON tab. For example, `config/vizy/article.json` provides the ID `article`. File configs appear in the control panel for inspection and selection, but their contents must be edited in the file. Both approaches can be used in the same project.

Use lowercase letters, numbers, dashes and underscores, starting with a letter, for predictable IDs (`minimal.json` → `minimal`). Filenames with uppercase letters, spaces, dots or an initial number are also supported, and Vizy assigns them a stable ID and shows their readable name in the config selector. `standard.json` receives its own ID so it remains separate from the built-in Standard config.

Control-panel configs are stored in Craft’s Project Config. File configs and control-panel configs share the same ID namespace. When both define the same ID, the Project Config version takes precedence and the file is ignored with a warning. Creating a control-panel config under a file’s ID is refused until you rename or remove the file.

:::tip
Ensure file configs are valid JSON, with no trailing commas and double quotes around property names.
:::

### File Example

Create `config/vizy/minimal.json`:

```json
{
    "label": "Minimal",
    "capabilities": {
        "nodes": ["heading", "blockquote"],
        "marks": ["bold", "italic", "link"]
    },
    "headings": {
        "levels": [2, 3]
    },
    "toolbar": [
        "dropdown:formatting",
        "separator",
        "bold",
        "italic",
        "link"
    ],
    "dropdowns": {
        "formatting": ["heading2", "heading3", "paragraph"]
    },
    "bubble": {
        "enabled": true,
        "items": ["bold", "italic", "link"]
    },
    "icons": {
        "bold": "star-solid",
        "dropdown:formatting": "custom-formatting"
    }
}
```

`label` may be omitted, in which case it is derived from the filename. Omit `dropdowns` (or leave it empty) to keep each dropdown's registered roster.

### Available Keys

| Key | Description |
| --- | --- |
| `label` | Display name in the CP and field select. |
| `capabilities` | Allowed content: `nodes` and `marks` lists. |
| `headings` | `{ "levels": [2, 3, 4] }`, the heading levels the schema allows. |
| `toolbar` | Flat list of control IDs (`bold`, `dropdown:formatting`, `separator`, …). |
| `dropdowns` | Optional map of dropdown name → member IDs, trimming/reordering a registered roster. |
| `bubble` | `{ "enabled": true, "items": ["bold", "italic", "link"] }`. |
| `icons` | Optional map of control ID → icon name. The same override follows a control across the toolbar, dropdowns, and Bubble Menu. |
| `gutterInsert` | `true` (default) shows the `+` control beside the content. Independent of toolbar `addBlock`. |
| `slashInsert` | `true` (default) lets `/` on a blank line open the Add Block list. |

Toolbar and dropdown IDs use the Editor Config vocabulary (`heading2`, `bulletList`, `alignLeft`, `dropdown:formatting`, …). The full control catalogue is what the Editor Configs screen offers under Available items, and [Editor Capabilities](docs:feature-tour/editor-capabilities) lists the built-in control IDs. Your own controls are registered in PHP (see [Extensibility](docs:developers/extending-vizy)), not declared as free-form objects inside the JSON.

Icon values come from Vizy’s icon catalogue, including SVG files under the configured [`iconsPath`](docs:get-started/configuration#iconspath). Use the visual Editor Config screen to search that catalogue and preview the result. Inline SVG markup and arbitrary filesystem paths are not accepted in an Editor Config.

After changing a file config, reload an entry using it and verify the effective toolbar, menus, capabilities, and insertion controls.
