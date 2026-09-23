# Creating a Custom Mark from Scratch

This guide creates an **Abbreviation** mark called `abbr`. An author will be able to select text in Vizy, apply Abbreviation from the toolbar, save the entry, and render HTML such as `<abbr>NASA</abbr>` on the frontend.

You will build the complete Craft module rather than starting from a module that already works. The finished example includes Composer autoloading, Craft application bootstrap, PHP registration, a Control Panel AssetBundle, the TipTap mark, Editor Config setup, and checks for both the command line and browser editor. A ready-to-copy version is also available in `examples/vizy-abbr-module/` in the Vizy repository.

## What You Need

This walkthrough assumes Vizy is installed and that you can edit the Craft project's `composer.json`, `config/app.php`, and `modules/` directory. Run terminal commands from the Craft project root—the directory containing the `craft` executable and `composer.json`.

The example uses five related identifiers. Keeping their roles separate avoids many registration problems:

| Identifier | Example | Purpose |
| --- | --- | --- |
| PHP namespace | `modules\vizyabbr` | Composer finds the module's PHP classes. |
| Craft module ID | `vizy-abbr` | Craft bootstraps the module from `config/app.php`. |
| Vizy mark type | `abbr` | Saved Vizy JSON and Editor Configs identify the mark. |
| Vizy module ID | `acme/mark/abbr` | Vizy connects the PHP definition to the JavaScript TipTap factory. |
| Toolbar control ID | `abbr` | The Editor Config places the mark's button. |

You can change these names for your project, but every reference to the same identifier must continue to match.

## Create the Module Files

Create the following folders and empty files in your Craft project:

```text
modules/
└── vizyabbr/
    └── src/
        ├── Abbr.php
        ├── Module.php
        ├── assets/
        │   └── AbbrAsset.php
        └── web/
            └── abbr.js
```

The PHP namespace will point at `modules/vizyabbr/src/`. The AssetBundle will publish `src/web/abbr.js` into the Control Panel.

## Add Composer Autoloading

Open the Craft project's `composer.json` and add the module namespace to its existing `autoload.psr-4` object. This is a partial example to merge into the file, not a replacement for the project's complete Composer configuration:

```json
{
    "autoload": {
        "psr-4": {
            "modules\\vizyabbr\\": "modules/vizyabbr/src/"
        }
    }
}
```

Rebuild Composer's autoloader from the Craft project root:

```sh
composer dump-autoload
```

Composer should finish without reporting an invalid namespace or missing directory. If the project already has an `autoload` or `psr-4` object, add the new entry inside it rather than creating a second object with the same key.

## Bootstrap the Craft Module

Add the module to `config/app.php`. A project without other application customisation can use this complete file:

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

If `config/app.php` already returns other settings, merge the `modules` entry and the `vizy-abbr` bootstrap value into the existing array. Do not discard the project's current components or bootstrap modules.

Create `modules/vizyabbr/src/Module.php` with the complete module class:

```php
<?php

namespace modules\vizyabbr;

use Craft;
use modules\vizyabbr\assets\AbbrAsset;
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;
use yii\base\Module as BaseModule;

class Module extends BaseModule
{
    public function init(): void
    {
        $this->setControllerPath(__DIR__ . '/controllers');

        parent::init();

        Event::on(
            Extensions::class,
            Extensions::EVENT_REGISTER_EXTENSIONS,
            static function(RegisterExtensionsEvent $event): void {
                $event->marks[] = Abbr::class;
            }
        );

        if (Craft::$app->getRequest()->getIsCpRequest()) {
            Craft::$app->getView()->registerAssetBundle(AbbrAsset::class);
        }
    }
}
```

The `use Craft;` import is required because this class is inside the `modules\vizyabbr` namespace. The Control Panel request check prevents web-only asset registration from running during console commands.

Yii's console help inspects every bootstrapped module for controllers. Its default lookup converts `modules\vizyabbr\controllers` into an alias, which fails when the project has not defined an `@modules` alias. `setControllerPath()` supplies the physical location directly. The folder may remain absent when your module has no controllers; create `src/controllers/` later if you add them.

This module does not need a global Yii path alias. The AssetBundle below also derives its source path from its PHP file, so both module and asset discovery work in web and console application bootstrap.

Before adding Vizy-specific code, confirm that Craft can load the module:

```sh
php craft help
```

The command should print Craft's command list without a `Class "modules\vizyabbr\Craft" not found` or `Invalid path alias` exception. Resolve Composer and module bootstrap errors here before continuing.

## Declare the Mark in PHP

Create `modules/vizyabbr/src/Abbr.php`:

```php
<?php

namespace modules\vizyabbr;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Mark;

class Abbr extends Mark
{
    public static ?string $type = 'abbr';

    public static function moduleId(): string
    {
        return 'acme/mark/abbr';
    }

    public static function label(): string
    {
        return 'Abbreviation';
    }

    public static function icon(): ?string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"><text x="1" y="12" font-size="10" font-family="system-ui,sans-serif">Ab</text></svg>';
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar, EditorSurface::Bubble];
    }

    public static function group(): ?string
    {
        return EditorGroup::Marks;
    }

    public static function tag(): string|array|null
    {
        return 'abbr';
    }
}
```

`$type` becomes the mark name in saved content. `moduleId()` is the bridge to the JavaScript registration you will add later. The label, icon, surfaces, and group determine how the mark appears in Editor Configs. Returning `abbr` from `tag()` tells Vizy's server-side renderer how to wrap the marked text.

## Load the Control Panel JavaScript

Create `modules/vizyabbr/src/assets/AbbrAsset.php`:

```php
<?php

namespace modules\vizyabbr\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use verbb\vizy\web\assets\field\VizyAsset;

class AbbrAsset extends AssetBundle
{
    public function init(): void
    {
        $this->sourcePath = dirname(__DIR__) . '/web';
        $this->depends = [
            CpAsset::class,
            VizyAsset::class,
        ];
        $this->js = ['abbr.js'];

        parent::init();
    }
}
```

`dirname(__DIR__)` resolves to `modules/vizyabbr/src`, so the source path resolves to the `src/web` folder you created. This relative filesystem path does not depend on a Craft alias. The `VizyAsset` dependency ensures `Craft.Vizy.registerModule()` and Vizy's shared TipTap packages are available before `abbr.js` executes.

## Register the TipTap Mark

Create `modules/vizyabbr/src/web/abbr.js`:

```js
(function () {
    function register() {
        const { Mark, mergeAttributes } = Craft.Vizy.tiptap.core;

        const Abbr = Mark.create({
            name: 'abbr',
            parseHTML() {
                return [{ tag: 'abbr' }];
            },
            renderHTML({ HTMLAttributes }) {
                return ['abbr', mergeAttributes(HTMLAttributes), 0];
            },
        });

        Craft.Vizy.registerModule('acme/mark/abbr', () => Abbr);
    }

    if (window.Craft?.Vizy?.registerModule) {
        register();
    } else {
        document.addEventListener('vizy:register', register, { once: true });
    }
})();
```

The TipTap `name` must match the PHP `$type`, and the string passed to `registerModule()` must match the PHP `moduleId()`. The script uses the TipTap copy exposed by Vizy; do not bundle another copy of `@tiptap/core` into the module.

An ordinary mark does not need `registerControl()`. Vizy can toggle it from the toolbar using the definition supplied by PHP. Reserve a custom control runner for a mark that needs a dialog or another multi-step action.

## Enable Abbreviation in an Editor Config

Clear Craft's caches and reload the Control Panel after changing the module or its AssetBundle:

```sh
php craft clear-caches/all
```

Open **Settings → Vizy → Editor Configs** and edit the config assigned to your Vizy field. Expand **Content schema** and enable **Abbreviation** under **Inline formatting**. Add **Abbreviation** to the toolbar and, if you want the control near selected text, to the Bubble Menu. Save the Editor Config.

If Abbreviation is absent from the capability list, PHP registration has not completed. If it appears in the config but not on the field, confirm the field uses that Editor Config and then reload the entry edit page so the updated AssetBundle and manifest are used.

## Test the Finished Mark

Open an entry containing the configured Vizy field. Type `NASA`, select it, and choose **Abbreviation**. Save the entry, reopen it, and confirm the formatting is still applied.

In the entry's frontend Twig template, render the Vizy field explicitly. Replace `myVizyField` with the field's handle:

```twig
{{ entry.myVizyField.render() }}
```

Inspect the resulting HTML. The selected text should appear as `<abbr>NASA</abbr>`. A browser may not style `<abbr>` differently by default; the element in the HTML confirms that both the saved mark and PHP renderer are working.

Run another console command after testing the Control Panel:

```sh
php craft help
```

This final check confirms that the module's web assets have not introduced a console-only bootstrap failure.

## Troubleshooting

### Craft Reports `Class "modules\vizyabbr\Craft" not found`

Add `use Craft;` to `Module.php`, or call `\Craft` with a leading backslash. Then run `composer dump-autoload` and retry `php craft help`.

### Craft Reports `Invalid path alias`

If the message names `@modules/vizyabbr/controllers`, confirm that `Module::init()` calls `$this->setControllerPath(__DIR__ . '/controllers');`. If it names the AssetBundle source, use `$this->sourcePath = dirname(__DIR__) . '/web';`. Check that `abbr.js` is located at `src/web/abbr.js` relative to `AbbrAsset.php`.

### Abbreviation Is Missing from Editor Configs

Confirm the module is listed in both `modules` and `bootstrap` in `config/app.php`. Check that the Composer namespace maps to `modules/vizyabbr/src/`, run `composer dump-autoload`, and clear Craft's caches. The event listener must append `Abbr::class` to `$event->marks`.

### The Editor Reports `untrustedEditorModule:acme/mark/abbr`

PHP requested the module, but its JavaScript factory was not registered. Confirm that `AbbrAsset` depends on `VizyAsset`, loads `abbr.js`, and is registered during Control Panel requests. The PHP `moduleId()` and JavaScript `registerModule()` strings must be identical.

### The Button Is Missing or Does Nothing

Confirm that **Abbreviation** is allowed under **Content schema → Inline formatting** and placed on the active Editor Config's toolbar or Bubble Menu. The PHP `$type`, TipTap `name`, and toolbar control ID must all be `abbr`.

### Saved Text Produces No `<abbr>` Element

Confirm that `Abbr::tag()` returns `abbr` and that the frontend template calls `render()` on the Vizy field. If the formatting disappears after reopening the entry, inspect the browser console for a module registration error before changing the renderer.

For the underlying extension contracts and optional APIs, read [Extending Vizy](docs:developers/extending-vizy). If you need an inline object with its own attributes rather than formatting around text, continue with [Creating a Custom Node from Scratch](docs:guides/developers/creating-a-custom-node-from-scratch).
