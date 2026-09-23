# Developer Guides

These guides take you from a Craft project to working Vizy extensions, including module bootstrap, Editor Config setup, authoring, persistence, rendering, and troubleshooting.

Start with [Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch) when you want a complete first extension. It creates an Abbreviation mark from an empty `modules/` folder and includes Composer autoloading, `config/app.php`, a CLI-safe AssetBundle, JavaScript registration, and end-to-end testing. A matching copyable module is available at `examples/vizy-abbr-module/` in the Vizy repository.

[Extending Vizy](docs:developers/extending-vizy) is the shorter API overview to use once you understand the complete module structure.

## [Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch)

Build an Abbreviation (`abbr`) mark from an empty Craft module through TipTap JavaScript, Editor Config, saved content, and frontend HTML.

## [Creating a Custom Node from Scratch](docs:guides/developers/creating-a-custom-node-from-scratch)

Build an inline emoji node from an empty Craft module, including its attribute schema, custom toolbar action, save/reopen checks, and PHP renderer.

## [Modifying the Toolbar Buttons](docs:guides/developers/modifying-the-toolbar-buttons)

Choose Editor Config placement and use `registerControl`, module replacement, and dropdowns when ordinary mark or node controls are not enough.

## [Choosing Insertion Controls](docs:guides/developers/choosing-insertion-controls)

Choose between structured Vizy Blocks and toolbar controls for rich-text extensions.

## [Creating Your Own Formatting Buttons and Dropdown](docs:guides/developers/creating-your-own-formatting-buttons-and-dropdown)

Combine formatting controls and your own capabilities into a named dropdown.
