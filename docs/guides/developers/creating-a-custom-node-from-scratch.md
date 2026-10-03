# Creating a Custom Node from Scratch

This guide creates an inline **Badge** node. An author will be able to place a labelled chip at the cursor from Vizy's toolbar, save the entry, reopen it, and render the saved label inside `<span data-badge="…">` on the frontend.

A node is a piece of editor content with its own structure and attributes. That differs from a mark, which formats text already in the document. The example is deliberately small, but it uses the complete production path: a bootstrapped Craft module, PHP node registration and rendering, a Control Panel AssetBundle, a TipTap node, a custom toolbar action, and an Editor Config.

## What You Need

This walkthrough assumes Vizy is installed and that you can edit the Craft project's `composer.json`, `config/app.php`, and `modules/` directory. Run terminal commands from the Craft project root—the directory containing the `craft` executable and `composer.json`.

The example uses several identifiers with different responsibilities:

| Identifier | Example | Purpose |
| --- | --- | --- |
| PHP namespace | `modules\vizybadge` | Composer finds the module's PHP classes. |
| Craft module ID | `vizy-badge` | Craft bootstraps the module. |
| Vizy node type | `badge` | Saved Vizy JSON and Editor Configs identify the node. |
| Vizy module ID | `acme/node/badge` | Vizy connects the PHP definition to the JavaScript TipTap factory. |
| Toolbar control ID | `badge` | The Editor Config and custom control identify the button. |

You can use different names in your own project. Keep every reference to a particular identifier consistent across PHP, JavaScript, and the Editor Config.

## Create the Module Files

Create this structure in the Craft project:

```text
modules/
└── vizybadge/
    └── src/
        ├── Badge.php
        ├── Module.php
        ├── assets/
        │   └── BadgeAsset.php
        └── web/
            └── badge.js
```

The PHP classes live under `src/`, while the AssetBundle publishes the script from `src/web/`.

## Add Composer Autoloading

Add the module namespace to the Craft project's existing `autoload.psr-4` object in `composer.json`. Merge this partial example into the file rather than replacing the project's other dependencies and settings:

```json
{
    "autoload": {
        "psr-4": {
            "modules\\vizybadge\\": "modules/vizybadge/src/"
        }
    }
}
```

Rebuild Composer's autoloader:

```sh
composer dump-autoload
```

Composer should complete without reporting a namespace or directory error.

## Bootstrap the Craft Module

Add the module to `config/app.php`. This complete example applies when the file has no other application customisation:

```php
<?php

use modules\vizybadge\Module;

return [
    'modules' => [
        'vizy-badge' => Module::class,
    ],
    'bootstrap' => ['vizy-badge'],
];
```

Merge those entries into the returned array when the project already defines components or other modules.

Create `modules/vizybadge/src/Module.php`:

```php
<?php

namespace modules\vizybadge;

use Craft;
use modules\vizybadge\assets\BadgeAsset;
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
                $event->nodes[] = Badge::class;
            }
        );

        if (Craft::$app->getRequest()->getIsCpRequest()) {
            Craft::$app->getView()->registerAssetBundle(BadgeAsset::class);
        }
    }
}
```

Importing `Craft` prevents PHP from looking for `modules\vizybadge\Craft`. Restricting AssetBundle registration to Control Panel requests keeps console bootstrap focused on PHP registration.

Yii's console help asks every bootstrapped module for its controller path. `setControllerPath()` supplies a physical path instead of allowing Yii to derive an undefined `@modules/vizybadge/controllers` alias. The `src/controllers/` folder does not need to exist unless you later add controllers. The AssetBundle will also calculate the script location from its own file, so no custom Yii alias is required.

Confirm the module boots before continuing:

```sh
php craft help
```

Resolve any Composer class-loading or `config/app.php` error before adding the node. A successful command should print Craft's available console commands.

## Declare and Render the Node in PHP

Create `modules/vizybadge/src/Badge.php`:

```php
<?php

namespace modules\vizybadge;

use craft\helpers\Html;
use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

class Badge extends Node
{
    public static ?string $type = 'badge';

    public static function moduleId(): string
    {
        return 'acme/node/badge';
    }

    public static function label(): string
    {
        return 'Badge';
    }

    public static function icon(): ?string
    {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="currentColor"/><circle cx="5.5" cy="6" r="1" fill="white"/><circle cx="10.5" cy="6" r="1" fill="white"/><path d="M4.5 9.5c1 2 6 2 7 0" fill="none" stroke="white" stroke-width="1.2"/></svg>';
    }

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function group(): ?string
    {
        return EditorGroup::Extensions;
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $context): ?string
    {
        $label = (string)($resolvedAttrs['label'] ?? 'New');

        return Html::tag('span', Html::encode($label), [
            'data-badge' => $label,
        ]);
    }
}
```

The node's `label` attribute will be saved in canonical Vizy JSON. `renderOccurrenceHtml()` owns frontend output, so it encodes both the visible label and the `data-badge` attribute through Craft's HTML helper. This server-side renderer is separate from TipTap's Control Panel rendering and must exist even when the node looks correct in the editor.

## Load the Control Panel JavaScript

Create `modules/vizybadge/src/assets/BadgeAsset.php`:

```php
<?php

namespace modules\vizybadge\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use verbb\vizy\web\assets\field\VizyAsset;

class BadgeAsset extends AssetBundle
{
    public function init(): void
    {
        $this->sourcePath = dirname(__DIR__) . '/web';
        $this->depends = [
            CpAsset::class,
            VizyAsset::class,
        ];
        $this->js = ['badge.js'];

        parent::init();
    }
}
```

Because `BadgeAsset.php` is in `src/assets/`, `dirname(__DIR__) . '/web'` resolves to `src/web/`. The Vizy asset dependency establishes the correct script order without a custom alias.

## Register the TipTap Node and Toolbar Action

Create `modules/vizybadge/src/web/badge.js`:

```js
(function () {
    function register() {
        const { Node, mergeAttributes } = Craft.Vizy.tiptap.core;

        const Badge = Node.create({
            name: 'badge',
            group: 'inline',
            inline: true,
            atom: true,
            addAttributes() {
                return {
                    label: { default: 'New' },
                };
            },
            parseHTML() {
                return [{
                    tag: 'span[data-badge]',
                    getAttrs: (element) => ({
                        label: element.getAttribute('data-badge') || 'New',
                    }),
                }];
            },
            renderHTML({ HTMLAttributes }) {
                const { label = 'New', ...attributes } = HTMLAttributes;

                return [
                    'span',
                    mergeAttributes(attributes, { 'data-badge': label }),
                    label,
                ];
            },
            addCommands() {
                return {
                    insertBadge: (label = 'New') => ({ commands }) => commands.insertContent({
                        type: this.name,
                        attrs: { label },
                    }),
                };
            },
        });

        Craft.Vizy.registerModule('acme/node/badge', () => Badge);
        Craft.Vizy.registerControl('badge', {
            run: (editor) => editor.chain().focus().insertBadge('New').run(),
            isActive: () => false,
        });
    }

    if (window.Craft?.Vizy?.registerModule) {
        register();
    } else {
        document.addEventListener('vizy:register', register, { once: true });
    }
})();
```

The PHP `$type`, TipTap `name`, and registered control ID all use `badge`. The PHP `moduleId()` and JavaScript `registerModule()` call both use `acme/node/badge`.

`atom: true` tells TipTap to treat the badge as one selectable editor object. `registerControl()` overrides the ordinary node insertion action so the toolbar calls `insertBadge()` with the chosen label. A project-specific picker could replace that fixed value later while retaining the same node schema.

Use the TipTap packages exposed at `Craft.Vizy.tiptap`; installing another `@tiptap/core` copy in the module can create incompatible editor objects.

## Enable Badge in an Editor Config

Clear Craft's caches after changing the module or its assets:

```sh
php craft clear-caches/all
```

Open **Settings → Vizy → Editor Configs** and edit the config assigned to your field. Expand **Content schema**, enable **Badge** under **Blocks and objects**, add **Badge** to the toolbar, and save the config.

This inline node belongs on the toolbar. Vizy's **Add Block** button, gutter `+`, and `/` menu insert structured Vizy Block Types rather than arbitrary TipTap nodes. [Choosing Insertion Controls](docs:guides/developers/choosing-insertion-controls) explains that distinction in more detail.

## Test the Finished Node

Open an entry containing the configured Vizy field and place the caret inside a paragraph. Choose **Badge** from the toolbar. A `New` chip should appear at the caret. Save the entry, reopen it, and confirm the badge remains in the same position.

Render the Vizy field in the entry's frontend Twig template, replacing `myVizyField` with the field's handle:

```twig
{{ entry.myVizyField.render() }}
```

Inspect the HTML. The badge should render as:

```html
<span data-badge="New">New</span>
```

Run `php craft help` again after testing the Control Panel. A successful result confirms that the module remains safe when Craft boots as a console application.

## Troubleshooting

### Craft Reports a Missing `Craft` Class

Import the global class with `use Craft;` in `Module.php`, or prefix the class with a backslash. Run `composer dump-autoload` and retry `php craft help`.

### Craft Reports `Invalid path alias`

If the alias ends in `/controllers`, confirm `Module::init()` calls `$this->setControllerPath(__DIR__ . '/controllers');`. For an AssetBundle alias, use `$this->sourcePath = dirname(__DIR__) . '/web';` in `BadgeAsset.php`. Confirm `badge.js` is in `src/web/`.

### Badge Is Missing from Editor Configs

Confirm that `config/app.php` bootstraps `vizy-badge`, Composer maps `modules\vizybadge` to `modules/vizybadge/src/`, and the module appends `Badge::class` to `$event->nodes`. Rebuild the autoloader and clear Craft's caches.

### The Editor Reports `untrustedEditorModule:acme/node/badge`

Vizy received the PHP node definition but not its JavaScript factory. Check the AssetBundle registration, its `VizyAsset` dependency, the `badge.js` path, and the matching `acme/node/badge` strings.

### The Button Appears but Does Nothing

Open the browser console and check for an error from `registerControl()` or `insertBadge()`. Confirm that the TipTap extension defines `insertBadge`, that the control ID is `badge`, and that the node capability is enabled in the active Editor Config.

### The Badge Disappears After Saving or Renders Empty

Confirm the JavaScript node uses the `label` attribute and that `Badge::renderOccurrenceHtml()` reads the same key. Reopen the entry to distinguish a persistence problem from a frontend template problem, and confirm the template calls the field's `render()` method.

For custom formatting around existing text, follow [Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch). The broader [Extending Vizy](docs:developers/extending-vizy) page documents behaviour-only extensions, module replacement, and custom toolbar controls.
