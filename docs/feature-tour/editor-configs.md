# Editor Configs

An **Editor Config** defines which content and editing tools a Vizy field offers. For example, a short introduction might only need bold text, italic text, and links, while an article field also needs headings, images, and tables. Giving each field an appropriate config keeps its tools focused on the content editors need to create.

A config has a name and an ID. You select it on the Vizy field’s settings screen, and several fields can share the same config.

## Creating a Config

Open **Settings → Vizy → Editor Configs** to manage configs in the control panel. Choose the available content and arrange the toolbar and Bubble Menu, which appears when editing a selection. These settings are stored in Craft’s Project Config.

You can also define a config in `config/vizy/{id}.json`. For example, `minimal.json` provides the ID `minimal`. File configs appear in the control panel for inspection and selection, but you edit them in the file itself. See [Configuration](docs:get-started/configuration#editor-configuration) for a complete JSON example and the available keys.

File configs and control-panel configs share their IDs. If both define the same ID, the Project Config version takes precedence. Use distinct IDs when the configs should remain separate choices.

## Applying a Config to a Field

Open the Vizy field’s settings and choose its Editor Config. Save the field, then open an entry using it to check the available tools. When several fields use the same config, changes to that config affect each of them. Create a separate config when one field needs different tools.

The `+` insertion control beside the content and the `/` menu on an empty line are enabled by default. Their config settings are independent of whether **Add Block** appears on the toolbar. A nested Vizy field uses its own Editor Config, so its insertion tools can differ from those of the surrounding field.
