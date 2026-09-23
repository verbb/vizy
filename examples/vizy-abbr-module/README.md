# Sample Module: Abbreviation Mark

This is a copyable Craft module that registers a Vizy `abbr` mark from PHP through to the Control Panel editor and frontend renderer. The complete explanation is in [Creating a Custom Mark from Scratch](../../docs/guides/developers/creating-a-custom-mark-from-scratch.md), while [Extending Vizy](../../docs/developers/extending-vizy.md) covers the underlying extension APIs.

The module supplies Yii with a physical controller path and uses a filesystem-relative AssetBundle source path. It does not require a global Yii path alias, so bootstrapping it does not introduce an `Invalid path alias` error in Craft console commands.

## Install the Example

Copy this folder to `modules/vizyabbr/` in a Craft project. The resulting PHP classes should be under `modules/vizyabbr/src/`.

Add the namespace to the project's existing `autoload.psr-4` object in `composer.json`:

```json
"modules\\vizyabbr\\": "modules/vizyabbr/src/"
```

Run Composer from the Craft project root:

```sh
composer dump-autoload
```

Register and bootstrap the module in `config/app.php`, merging these values with any existing application configuration:

```php
<?php

use modules\vizyabbr\Module;

return [
    'modules' => [
        'vizy-abbr' => Module::class,
    ],
    'bootstrap' => ['vizy-abbr'],
];
```

Confirm that console bootstrap works before opening the Control Panel:

```sh
php craft help
php craft clear-caches/all
```

Open **Settings → Vizy → Editor Configs**, expand **Content schema**, enable **Abbreviation** under **Inline formatting**, and place it on the toolbar or Bubble Menu. Assign that Editor Config to a Vizy field, apply Abbreviation to selected text, save the entry, and reopen it. Rendering the field with `{{ entry.myVizyField.render() }}` should produce an `<abbr>` element around the selected text.

## How the Files Connect

`src/Module.php` registers `Abbr::class` on `Extensions::EVENT_REGISTER_EXTENSIONS` and loads the Control Panel AssetBundle. `src/Abbr.php` defines the saved mark type, Editor Config presentation, JavaScript module ID, and frontend `<abbr>` tag. `src/assets/AbbrAsset.php` depends on Vizy's field assets and publishes `src/web/abbr.js`. The script registers its TipTap factory through `Craft.Vizy.registerModule('acme/mark/abbr', ...)`.

If you rename the example, update the Composer namespace and PHP namespaces together. If you change `acme/mark/abbr`, update both `Abbr::moduleId()` and the JavaScript `registerModule()` call. If you change the `abbr` content type, update the PHP `$type`, TipTap `name`, and Editor Config control together.
