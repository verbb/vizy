# Configuration

You can customise Vizy’s settings using a PHP configuration file. This is optional: each setting has a default, so you only need to include the values you want to change.

To override a setting, create `vizy.php` in your Craft project’s `/config` directory and return an array of setting names and values. For example, the following will use a custom icon directory:

```php
<?php

return [
    'iconsPath' => '@webroot/custom-icons/',
];
```

All other settings keep their defaults. Add any further settings you want to change to the same array. The options below explain the available settings and their defaults. You can also manage these settings in the control panel under **Settings → Vizy**.

## Configuration Options

::: reference
### `iconsPath`

**Type:** `string` · **Default:** `'@webroot/icons/'`

Provide a file system path for a collection of SVG icons. These are available for Block Types and Editor Config control-icon overrides. This also accepts environment variables or aliases.
:::

::: reference
### `blockPreviewImagesPath`

**Type:** `string` · **Default:** `'@webroot/vizy-block-previews/'`

Folder of Block Type preview images (`png`, `jpg`, `jpeg`, `webp`, `gif`). Block Types store a relative path under this folder in Project Config (portable across environments — not Craft assets). Accepts environment variables or aliases.
:::

::: reference
### `renderTemplatesPath`

**Type:** `string` · **Default:** `''`

Optional path relative to the Craft `templates/` directory. When set, Vizy looks for node templates at `<path>/nodes/<type>.twig` and mark templates at `<path>/marks/<type>.twig`. Missing templates fall back to Vizy’s PHP renderer. See [Node and Mark Templates](docs:template-guides/node-and-mark-templates).
:::
