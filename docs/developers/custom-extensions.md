# Custom Extensions

An extension adds something new to the Vizy editor. It can be a mark that formats text, such as an abbreviation, a node that adds a new kind of content, such as an emoji or a badge, or a behaviour-only extension that changes how the editor works without changing saved content, such as a character count. Make one when Vizy's built-in nodes and marks can't represent the content your editors need to author.

Every extension has three parts. A PHP class tells Vizy the extension exists and how to render it on the front end, a JavaScript module tells the TipTap editor how to edit it, and an Editor Config turns it on for a field. Skip any one of them and you'll usually see a missing button, an editor that refuses to load, or blank HTML on the front end.

The examples assume you have a Craft module or plugin that loads your PHP classes and a control-panel AssetBundle for JavaScript. [Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch) builds an Abbreviation mark from an empty Craft module, including Composer autoloading, the AssetBundle and troubleshooting. [Creating a Custom Node from Scratch](docs:guides/developers/creating-a-custom-node-from-scratch) builds a node with saved attributes and a custom toolbar action. A ready-to-copy mark module is also available under `examples/vizy-abbr-module/` in the Vizy repository.

TipTap's [custom extension documentation](https://tiptap.dev/docs/editor/extensions/custom-extensions) explains how to define editor behaviour, and the [ProseMirror guide](https://prosemirror.net/docs/guide/) explains the document model behind it, for when an extension needs lower-level editing behaviour.

## Create the Extension Class

Extend `verbb\vizy\base\Mark` for a mark, `verbb\vizy\base\Node` for a node, or `verbb\vizy\base\Extension` for a behaviour-only extension. Set the `$type` property to the name stored in saved content, return a `moduleId()` that your JavaScript registers, and describe how the extension appears in Editor Configs. For a mark or node, return the HTML tag Vizy should render from `tag()`.

This mark wraps text in an `<abbr>` tag:

```php
<?php
namespace acme\vizy\marks;

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

The module ID connects the PHP class to its JavaScript. It must match the ID you pass to `Craft.Vizy.registerModule()`, and it can't start with `vizy/core/`, which is reserved for Vizy's bundled modules.

A node that needs more than a single wrapping tag can build its own HTML in `renderOccurrenceHtml()`. Encode any stored values you output:

```php
<?php
namespace acme\vizy\nodes;

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

    public static function surfaces(): array
    {
        return [EditorSurface::Toolbar];
    }

    public static function group(): ?string
    {
        return EditorGroup::Extensions;
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        $label = (string)($resolvedAttrs['label'] ?? 'New');

        return Html::tag('span', Html::encode($label), ['data-badge' => $label]);
    }
}
```

## Register the Extension

Vizy finds extensions through the `registerExtensions` event. Register your class from your module or plugin’s `init()` method, adding it to `$event->marks`, `$event->nodes` or `$event->extensions` to match its base class.

```php
use acme\vizy\marks\Abbr;
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, function(RegisterExtensionsEvent $event) {
    $event->marks[] = Abbr::class;
});
```

Once registered, the extension appears as a capability in Editor Configs, and its module ID is marked as installed. The editor refuses to load an Editor Config that enables the extension if the matching JavaScript module never registers.

## Register the Editor Module

Load a control-panel AssetBundle that depends on Vizy's field assets, then register a factory for the same module ID. Wait for the `vizy:register` event if your script might load before Vizy's.

```js
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
    document.addEventListener('vizy:register', register);
}
```

Use the TipTap packages Vizy already loads, `Craft.Vizy.tiptap.core` and, when you need ProseMirror directly, `tiptap.pm.state`, `tiptap.pm.model` and `tiptap.pm.view`. Don't install `@tiptap/core` into your module for control-panel scripts. The TipTap `name` must match the extension's `$type`.

## Enable the Extension in an Editor Config

Enable the new capability, such as **Abbreviation**, on the field's Editor Config, then place its control on the toolbar or Bubble Menu. Until you do, the extension exists in code but editors never see it. A behaviour-only extension is enabled under **Editor Experience → Additional Behaviours**.

## Add a Behaviour-Only Extension

Some TipTap modules change editing behaviour without adding anything to saved content. Register a class that extends `Extension` on `$event->extensions`. Leave `surfaces()` empty when the extension has no toolbar button, or return its surfaces and register a control with `Craft.Vizy.registerControl()` when editors need one.

Official TipTap packages use the same path. Suppose a module needs TipTap's Focus extension. Install the official package at the same TipTap version Vizy uses, so it shares compatible editor contracts, then add a class so the extension appears in Editor Configs:

```php
<?php
namespace acme\vizy;

use verbb\vizy\base\Extension;

class Focus extends Extension
{
    public static function id(): string
    {
        return 'focus';
    }

    public static function moduleId(): string
    {
        return 'acme/extension/focus';
    }

    public static function label(): string
    {
        return 'Focus';
    }
}
```

Register it on `$event->extensions`:

```php
use acme\vizy\Focus;
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, function(RegisterExtensionsEvent $event) {
    $event->extensions[] = Focus::class;
});
```

In the AssetBundle's JavaScript entry, import the official factory and register it under the same module ID:

```js
import Focus from '@tiptap/extension-focus';

function register() {
    Craft.Vizy.registerModule('acme/extension/focus', () => Focus.configure({
        className: 'has-focus',
        mode: 'deepest',
    }));
}

if (window.Craft?.Vizy?.registerModule) {
    register();
} else {
    document.addEventListener('vizy:register', register);
}
```

After loading the AssetBundle, enable **Focus** under **Editor Experience → Additional Behaviours** on the relevant Editor Config and open an entry using that config. Focused nodes receive the configured class in the editor. The extension doesn't change saved Vizy content or frontend HTML.

## Replace or Customise Controls

To reconfigure a core TipTap extension the field already loads, use `Craft.Vizy.replaceModule()`. It changes the behaviour of something Vizy already installed for that field, and can't add a new type to saved content.

```js
Craft.Vizy.replaceModule('heading', ({ extension }) =>
    extension.configure({
        HTMLAttributes: { class: 'my-heading' },
    })
);
```

For a custom toolbar action, such as opening a dialog, register a runner with `Craft.Vizy.registerControl()`. Standard actions that toggle a mark or insert a node usually don't need one.

```js
Craft.Vizy.registerControl('abbr', {
    run: (editor) => editor.chain().focus().toggleMark('abbr').run(),
    isActive: (editor) => editor.isActive('abbr'),
});
```

The toolbar's **Add Block** control, the gutter `+` and `/` insertion list Vizy Block Types. Use a toolbar control for custom rich-text nodes and actions. [Choosing Insertion Controls](docs:guides/developers/choosing-insertion-controls) explains which route fits your feature. To group several controls into one toolbar menu, see [Custom Toolbar Dropdowns](docs:developers/custom-toolbar-dropdowns).

## Common Mistakes

If the capability never appears in Editor Configs, the PHP event probably isn't registered. An editor error such as `untrustedEditorModule:…` almost always means the module ID passed to `registerModule()` doesn't match the PHP `moduleId()`, or the AssetBundle never loaded. A toolbar button that does nothing usually means the extension isn't placed on the Editor Config's toolbar, or the TipTap `name` doesn't match the `$type`. Empty frontend HTML points to a missing `tag()` or `renderOccurrenceHtml()` on the PHP class.

## Methods

These are the static methods a mark, node or extension class can implement or override. [Node](docs:reference/node) and [Mark](docs:reference/mark) describe the same methods in more detail.

::: reference
### `id()`

**Returns:** `string`

Returns the type name stored in saved content, such as `abbr`. Marks and nodes return their `$type` property, so set that instead of overriding this method. A class extending `Extension` must implement it.
:::

::: reference
### `moduleId()`

**Returns:** `string`

Returns the ID of the JavaScript module that registers this extension in the editor, such as `acme/mark/abbr`. Marks and nodes default to `vizy/core/mark/{type}` and `vizy/core/node/{type}`, which are reserved for Vizy's own modules, so a custom class must override it.
:::

::: reference
### `label()`

**Returns:** `string`

Returns the name shown for this extension in Editor Configs. Marks and nodes default to their type name with an uppercase first letter.
:::

::: reference
### `icon()`

**Returns:** `string|null`

Returns the SVG markup used for this extension's toolbar button, or `null` for no icon.
:::

::: reference
### `surfaces()`

**Returns:** `array`

Returns where this extension can appear as a button, using the `EditorSurface::Toolbar` and `EditorSurface::Bubble` constants. Return an empty array when it has no button.
:::

::: reference
### `group()`

**Returns:** `string|null`

Returns the group this extension is listed under in Editor Configs, using an `EditorGroup` constant such as `EditorGroup::Marks` or `EditorGroup::Extensions`.
:::

::: reference
### `tag()`

**Returns:** `string|array|null`

Returns the HTML tag a mark or node renders, such as `'abbr'`, or a list of nested tags such as `['pre', 'code']`. Returns `null` when the type renders no wrapping tag.
:::

::: reference
### `renderOccurrenceHtml()`

**Returns:** `string|null`

**Arguments:** `string $children`, `array $resolvedAttrs`, `RenderContext $ctx`

Returns the complete HTML for one occurrence of a mark or node, for output that a single tag can't produce. Returns `null` to use `tag()` instead.
:::

::: reference
### `dependencies()`

**Returns:** `array`

Returns the other capabilities a mark or node needs, such as `['node:listItem']` for a list. Vizy enables them whenever this extension is enabled.
:::
