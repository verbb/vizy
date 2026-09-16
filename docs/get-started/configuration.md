# Configuration

You can customise Vizy’s settings using a PHP configuration file. This is optional: each setting has a default, so you only need to include the values you want to change.

To override a setting, create `vizy.php` in your Craft project’s `/config` directory and return an array of setting names and values. For example, the following will use a custom icon directory:

```php
<?php

return [
    'iconsPath' => '@webroot/custom-icons/',
];
```

All other settings keep their defaults. Add any further settings you want to change to the same array. The options below explain the available settings and their defaults.

## Configuration Options

::: reference
### `iconsPath`

**Type:** `string` · **Default:** `'@webroot/icons/'`

Provide a file system path for a collection of SVG icons. These are available when creating your Block Types for a Vizy field. This also accepts environment variables or aliases.
:::

::: reference
### `blockPreviewImagesPath`

**Type:** `string` · **Default:** `'@webroot/vizy-block-previews/'`

Folder of Block Type preview images (`png`, `jpg`, `jpeg`, `webp`, `gif`). Block Types store a relative path under this folder in Project Config (portable across environments — not Craft assets). Accepts environment variables or aliases.
:::


## Control Panel
You can also manage configuration settings through the Control Panel by visiting Settings → Vizy.

## Editor Configuration
Editor configs are named, reusable definitions of what a Vizy field may contain and which toolbar / Bubble Menu controls it offers. Every Vizy field picks one by ID.

To build a config visually, open **Settings → Vizy → Editor Configs**. You can arrange the toolbar and choose the available content and Bubble Menu controls there. Vizy saves these settings in Project Config.

You can also define a config in `config/vizy/{id}.json`, using the same keys as the Advanced JSON tab. File configs appear in the control panel so you can inspect and select them, but you edit their contents in the file itself. Both approaches can be used in the same project.

The filename stem is the Config ID (`minimal.json` → `minimal`). IDs must be lowercase letters, numbers, dashes and underscores, starting with a letter. Project Config and files share one ID namespace: if both claim the same ID, Project Config wins and the file is ignored with a warning. Creating a Project Config entry under a file's ID is refused until you rename or remove the file.

:::tip
Ensure file configs are valid JSON — no trailing commas, double quotes around properties.
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
    }
}
```

`label` may be omitted; it is derived from the filename. Omit `dropdowns` (or leave it empty) to keep each dropdown's registered roster.

### Available Keys

| Key | Description |
| --- | --- |
| `label` | Display name in the CP and field select. |
| `capabilities` | Allowed content: `nodes` and `marks` lists. |
| `headings` | `{ "levels": [2, 3, 4] }` — which heading levels the schema allows. |
| `toolbar` | Flat list of control IDs (`bold`, `dropdown:formatting`, `separator`, …). |
| `dropdowns` | Optional map of dropdown name → member IDs, trimming/reordering a registered roster. |
| `bubble` | `{ "enabled": true, "items": ["bold", "italic", "link"] }`. |
| `gutterInsert` | `true` (default) — `+` control beside the content. Independent of toolbar `addBlock`. |
| `slashInsert` | `true` (default) — blank-line `/` opens the Add Block list. |

Toolbar and dropdown IDs use the Editor Config vocabulary (`heading2`,
`bulletList`, `alignLeft`, `dropdown:formatting`, …). The full control catalogue
is what the Editor Configs screen offers under Available items. Your own
controls are registered in PHP (see [Extensibility](docs:developers/extending-vizy)),
not declared as free-form objects inside the JSON.


Save the config and open an entry using that field to check that its toolbar and content choices match your settings.
