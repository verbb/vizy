# Creating a Custom Mark from Scratch

This guide adds an **Abbreviation** mark (`abbr`) to Vizy — from a Craft module
through to the Control Panel toolbar and front-end HTML. When an author selects
text and clicks **Abbreviation**, Vizy saves that mark with the field and
outputs something like `<abbr>NASA</abbr>` when you call `render()` in Twig.

TipTap is the library Vizy uses under the hood for rich text. You don’t need
prior TipTap experience; each step below shows the piece you need. For a shorter
overview of the same APIs, see [Extending Vizy](docs:developers/extending-vizy).
A ready-to-copy Craft module lives at `examples/vizy-abbr-module/` in the plugin
repo.

Use your own namespace and module ID wherever you see `acme` or `vizymodule`.

## What You’Re Putting Together

A custom mark is three small pieces that share the same name (`abbr`). PHP tells
Vizy the mark exists and how it should become HTML. JavaScript teaches the
Control Panel editor how to toggle it. An Editor Config turns it on for a field
and puts a button on the toolbar. Leave any piece out and you’ll usually get a
missing button, an editor that won’t start, or empty HTML on the front end.

You’ll need a Craft module or plugin for the PHP and a Control Panel script.
The walkthrough assumes you can edit PHP and JavaScript files and have a module that Craft loads. You don’t need Vite in your module; Vizy already shares TipTap
helpers as `Craft.Vizy.tiptap.core`, so avoid installing a second TipTap copy.

## 1. Register the Capability in PHP

Put the imports at the top of your module’s PHP file and the event listener inside its `init()` method:

```php
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;
use acme\vizy\marks\Abbr;

Event::on(
    Extensions::class,
    Extensions::EVENT_REGISTER_EXTENSIONS,
    function(RegisterExtensionsEvent $event) {
        $event->marks[] = Abbr::class;
    }
);
```

Create the following mark class in the directory that your project maps to the `acme\vizy\marks` namespace. Its name and label identify it in the editor, and `tag()` tells Vizy which HTML element to use for the marked text:

```php
namespace acme\vizy\marks;

use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\EditorGroup;
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
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><text x="1" y="12" font-size="10">Ab</text></svg>';
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

That registration adds **Abbreviation** to Vizy’s capabilities list (what Editor
Configs can enable), marks it installed because the module ID sits outside the
reserved `vizy/core/…` prefix, and tells `VizyDocument::render()` to wrap the marked text in the `<abbr>` tag returned by `tag()`.

## 2. Load JavaScript in the Control Panel

Create an AssetBundle that depends on Vizy’s field assets, then register it on
CP requests — the same pattern as any Craft Control Panel script:

```php
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use verbb\vizy\web\assets\field\VizyAsset;

class AbbrAsset extends AssetBundle
{
    public function init(): void
    {
        $this->sourcePath = '@modules/vizymodule/assets';
        $this->depends = [CpAsset::class, VizyAsset::class];
        $this->js = ['abbr.js'];
        parent::init();
    }
}
```

After defining `AbbrAsset`, register it from your module’s `init()` method for control-panel requests. Use the full class name if the AssetBundle is in another namespace:

```php
if (\Craft::$app->getRequest()->getIsCpRequest()) {
    \Craft::$app->getView()->registerAssetBundle(AbbrAsset::class);
}
```

The bundle’s `sourcePath` must resolve to the folder containing `abbr.js`. Its dependency on `VizyAsset` ensures Vizy’s editor APIs load before your script. Reload the control panel after adding the bundle.

## 3. Register the TipTap Factory in JavaScript

In `assets/abbr.js`:

```js
(function () {
    function register() {
        if (!window.Craft || !Craft.Vizy || !Craft.Vizy.registerModule) {
            return;
        }

        const { Mark, mergeAttributes } = Craft.Vizy.tiptap.core;

        const Abbr = Mark.create({
            name: 'abbr',
            parseHTML() {
                return [{ tag: 'abbr' }];
            },
            renderHTML({ HTMLAttributes }) {
                return ['abbr', mergeAttributes(HTMLAttributes), 0];
            },
            addCommands() {
                return {
                    toggleAbbr: () => ({ commands }) => commands.toggleMark(this.name),
                };
            },
        });

        // Same string as PHP `moduleId()`.
        Craft.Vizy.registerModule('acme/mark/abbr', () => Abbr);

        // Optional: only needed for custom dialogs. Standard toggleMark actions
        // work from the Editor Config toolbar without registerControl.
        // Craft.Vizy.registerControl('abbr', {
        //   run: (editor) => editor.chain().focus().toggleMark('abbr').run(),
        //   isActive: (editor) => editor.isActive('abbr'),
        // });
    }

    if (window.Craft?.Vizy?.registerModule) {
        register();
    } else {
        document.addEventListener('vizy:register', register);
    }
})();
```

## 4. Enable It on a Field

Open **Settings → Vizy → Editor Configs** (or edit a `config/vizy/*.json` file).
Under capabilities / marks, enable **Abbreviation**, add it to the toolbar
(and Bubble Menu if you like), then assign that Editor Config to your Vizy
field.

Authors can now toggle the mark. Saved JSON includes `"type": "abbr"` marks, and
`{{ entry.myVizyField.render() }}` outputs `<abbr>…</abbr>`.

## Test the Finished Mark

Open an entry with the configured Vizy field and type `NASA`. Select that text and click **Abbreviation**, then save the entry. Reopen it to check that the formatting was retained. In the entry’s Twig template, render the field with `{{ entry.myVizyField.render() }}`, replacing `myVizyField` with your field’s handle.

Inspect the resulting page’s HTML. The selected text should appear inside `<abbr>NASA</abbr>`. The browser may not style that element differently by default; the HTML confirms the mark is working, and your site’s stylesheet can define its appearance.

## If Something Doesn’T Work

When the capability never appears in Editor Config, the PHP event usually isn’t
registered. An editor error like `untrustedEditorModule:…` almost always means
the JS `registerModule` id doesn’t match the PHP `moduleId()` string, or the
AssetBundle never loaded. A toolbar button that does nothing usually means the
mark isn’t on the Editor Config toolbar, or the TipTap `name` doesn’t match the
capability `name` / type `id()`. Empty front-end HTML points at a missing or
wrong `tag()` (or `renderOccurrenceHtml()` for custom markup) on the PHP type
class.

For the wider API picture, see [Extending Vizy](docs:developers/extending-vizy).
Custom toolbar dialogs use `Craft.Vizy.registerControl`. See [Choosing Insertion Controls](docs:guides/developers/choosing-insertion-controls) when deciding how editors should reach your feature.
