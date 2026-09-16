# Sample module: Abbreviation mark

A copy-paste Craft module that registers a TipTap `abbr` mark end to end. Pair
it with
[Creating A Custom Mark From Scratch](../../docs/guides/developers/creating-a-custom-mark-from-scratch.md)
and the shorter overview
[Extending Vizy](../../docs/template-guides/extending-vizy.md).

This folder is not auto-loaded by Vizy — wire it into your Craft project.

## Install into a Craft project

Copy this folder to `modules/vizyabbr/` (or another path you prefer). Add PSR-4
autoload in the project `composer.json`:

```json
"autoload": {
    "psr-4": {
        "modules\\vizyabbr\\": "modules/vizyabbr/src/"
    }
}
```

Run `composer dump-autoload`, then bootstrap the module in `config/app.php`:

```php
use modules\vizyabbr\Module;

return [
    'modules' => [
        'vizy-abbr' => Module::class,
    ],
    'bootstrap' => ['vizy-abbr'],
];
```

Clear caches and reload the Control Panel so the AssetBundle loads. Create or
edit an Editor Config: enable **Abbreviation**, add `abbr` to the toolbar, and
assign that config to a Vizy field.

## What’s in the folder

`src/Module.php` registers `Abbr::class` on `$event->marks` and the Control Panel
AssetBundle. `src/Abbr.php` is the mark type. `src/assets/AbbrAsset.php` depends
on Vizy’s field assets. `src/web/abbr.js` calls
`Craft.Vizy.registerModule('acme/mark/abbr', …)`.

Rename the `acme/mark/abbr` module id everywhere if you prefer your own vendor
prefix — the PHP `module` value and the JS `registerModule` call must match.
