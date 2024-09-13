# Extending Vizy
Vizy is powered by [Tiptap](https://tiptap.dev), which in turn is powered by [ProseMirror](https://prosemirror.net/docs/guide/). Vizy is a layer on top of Tiptap that provides the UI/UX unique to it. We provide an API to extend Vizy's features and functionality through **Vizy Plugins**. This includes adding buttons to the toolbar, command palette and other extensions.

:::tip
If you're looking for some deep-dive examples, we've got that covered in our [User Guides](/craft-plugins/vizy/docs/user-guides).
:::

## Editor Config
If you're looking to just add a few custom buttons to extend existing nodes, such as creating paragraph's or span with certain attributes, then [Editor Config](docs:get-started/configuration#editor-configuration) might be enough to get you started.

If you're looking for more advanced extendability behaviour, keep reading!

## Getting Started
Before diving in to extending Vizy, you'll need to be comfortable using [Tiptap](https://tiptap.dev) to create custom extensions. Bonus points for knowing a little about [ProseMirror](https://prosemirror.net/docs/guide/), which will help with more advanced extensions. You'll also need some basic knowledge of PHP and JavaScript.

Have a read through the below resources:

- [Custom Extensions with Tiptap](https://tiptap.dev/guide/custom-extensions)
- Sample [Nodes](https://tiptap.dev/api/nodes), [Marks](https://tiptap.dev/api/marks) and [Extensions](https://tiptap.dev/api/extensions)
- [ProseMirror Guide](https://prosemirror.net/docs/guide/)
- Check out our [User Guides](/craft-plugins/vizy/docs/user-guides) for specific real-world examples

## Vizy Plugin
The anatomy of a Vizy Plugin consists of some PHP module code, and some JavaScript code to hook into Vizy/Tiptap/ProseMirror. You'll need to create an [`AssetBundle`](https://verbb.io/blog/everything-you-need-to-know-about-modules#asset-bundles) that refers to your JavaScript (and CSS file if required). We'll also need to register any [Node](docs:developers/node) or [Mark](docs:developers/mark) objects that we want to use.

First, you'll need to get familiar with [creating a module](https://verbb.io/blog/everything-you-need-to-know-about-modules). You can register your `AssetBundle`:

```php
use modules\vizymodule\assets\VizyModuleAsset;
use verbb\vizy\base\Plugin as VizyPlugin;
use verbb\vizy\events\RegisterPluginEvent;
use verbb\vizy\fields\VizyField;
use yii\base\Event;

Event::on(VizyField::class, VizyField::EVENT_REGISTER_PLUGINS, function(RegisterPluginEvent $event) {
    $event->plugins[] = new VizyPlugin([
        'handle' => 'custom-vizy',
        'assetBundle' => VizyModuleAsset::class,
    ]);
});
```

The `VizyModuleAsset` defines what JavaScript and CSS file to load. You should also supply a unique handle for your Vizy Plugin.

```php
<?php
namespace modules\vizymodule\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use verbb\vizy\web\assets\field\VizyAsset;

class VizyModuleAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = '@modules/vizymodule/assets';

        $this->depends = [
            CpAsset::class,
            VizyAsset::class,
        ];

        $this->js = [
            'js/custom-vizy.js',
        ];

        $this->css = [
            'css/custom-vizy.css',
        ];

        parent::init();
    }
}
```

Finally, you'll need to add this plugin to your editor config file, using the handle used when registering the plugin. Without this, your Vizy field will not load anything in the plugin.

```json
{
    "buttons": ["bold", "italic"],
    "plugins": ["custom-vizy"]
}
```

Let's hop into our `js/custom-vizy.js` to continue.

:::tip
The following examples don't require a bundler like [Vite](https://vitejs.dev/) or [Webpack](https://webpack.js.org/), but you're welcome to use those. For more advanced behaviour using Vue.js [Custom Node Views](https://tiptap.dev/guide/node-views) you will be required to use a bundler to handle multiple files or modules.
:::

### Extensions
An Extension in the context of a Vizy plugin refers to being able to add a Tiptap [Node](https://tiptap.dev/api/nodes), [Mark](https://tiptap.dev/api/marks) or [Extension](https://tiptap.dev/api/extensions) - you can add any of them the exact same way. An extension refers to adding the actual functionality to the editor, such as _how_ to make text bold when you press the "Bold" button in the toolbar. Be sure to check out some of the examples on the Tiptap site.


```js
document.addEventListener('onVizyConfigReady', (e) => {
    const { Mark, mergeAttributes } = Craft.Vizy.Config.tiptap.core;

    const NewBold = Mark.create({
        name: 'newBold',

        parseHTML() {
            return [{ tag: 'strong' }];
        },

        renderHTML({ HTMLAttributes }) {
            return ['strong', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
        },

        addCommands() {
            return {
                toggleBold: () => ({ commands }) => {
                    return commands.toggleMark(this.name)
                },
            }
        },
    });

    Craft.Vizy.Config.registerExtensions((extensions, vizyInput) => {
        return [{ plugin: 'new-bold', extension: NewBold }];
    });
});
```

Here, we've re-created the **Bold** Mark and added it to the Vizy editor. Some things to note:

- We use `onVizyConfigReady` to be notified when Vizy itself is ready for our custom plugin to be added
- We can access the Tiptap API with `Craft.Vizy.Config.tiptap.core`
- We create a `Mark` with `Mark.create()` as you would with Tiptap, and define our mark. This is the same for `Node` or `Extension`.
- We let Vizy know about this by registering the extension with `Craft.Vizy.Config.registerExtensions()`. Be sure to use the plugin's handle for `plugin`, not the `name` of the Extension. This ensures the extension isn't run unless the plugin is enabled for the field.

Now, this extension won't do anything on it's own without a button or command to allow the user to action to command.

### Buttons
With our extension added, we'll need a way for users to be able to trigger the actions the extension providers - such as being able to set text **bold**.

```js
Craft.Vizy.Config.registerButtons((buttons) => {
    return [{
        name: 'new-bold',
        svg: '<svg ... />',
        title: Craft.t('vizy', 'New Bold'),
        action: (editor) => { return editor.chain().focus().toggleBold().run(); },
        isActive: (editor) => { return editor.isActive('newBold'); },
    }];
});
```

We return either a single object, or an array of objects in `Craft.Vizy.Config.registerButtons()` with the definitions:

Property | Description
--- | ---
`name` | The name for the button (used in the config file).
`svg` | The SVG as a string for the icon.
`title` | The title for the button (used as the tooltip).
`action` | A function that returns the command to run when the button is clicked.
`isActive` | A function that returns whether the button should be active or not.
`options` | An array of nested button definitions to show in a dropdown.

You can also configure your button to use a dropdown menu, if your button requires several potential options to pick from. This is similar to the formatting button/dropdown.

```js
Craft.Vizy.Config.registerButtons((buttons) => {
    return [{
        name: 'formatting',
        svg: '<svg ... />',
        title: Craft.t('vizy', 'Formatting'),
        options: [
            {
                name: 'bold',
                title: Craft.t('vizy', 'Bold'),
                action: (editor) => { return editor.chain().focus().toggleBold().run(); },
                isActive: (editor) => { return editor.isActive('bold'); },
            },
            {
                name: 'italic',
                title: Craft.t('vizy', 'Italic'),
                action: (editor) => { return editor.chain().focus().toggleItalic().run(); },
                isActive: (editor) => { return editor.isActive('italic'); },
            },
        ],
    }];
});
```

Be sure to update your editor config to include these buttons (using their `name`).

```json
{
    "buttons": ["new-bold", "italic"],
    "plugins": ["custom-vizy"]
}
```

### Commands
The Command Palette in Vizy allows you to quickly pick from common nodes, including your Vizy Blocks. It's activated as soon as you type `/`. Registering commands is very similar to buttons.

```js
Craft.Vizy.Config.registerCommands((commands) => {
    return [{
        name: 'bold',
        svg: '<svg ... />',
        title: Craft.t('vizy', 'Bold'),
        commandInfo: { shortcut: 'Mod-b' },
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBold().run();
        },
    }];
});
```

Property | Description
--- | ---
`name` | The name for the command.
`svg` | The SVG as a string for the icon.
`title` | The title for the command.
`command` | A function that returns the command to run when the command is clicked.
`commandInfo` | Supply either `text` or `shortcut` to show as info.

The `commandInfo` property lets you define either a shortcut to show the keyboard shortcut, or arbitrary text. Provide the keyboard shortcut exactly as you'd use it in your extension (e.g. `Mod-Alt-c` would render as `⌘` `⌥` `c` on a Mac).

### TipTap API
You can also access the [Tiptap](https://tiptap.dev) API in your code, without having to require it in your module.

```js
const { Mark, Node, mergeAttributes } = Craft.Vizy.Config.tiptap.core;
```

### ProseMirror Rendering
Once you have implemented your extensions to work in the Vizy editor, you can output them on the front-end of your site. However, you'll find that they won't render as-is. That's because the ProseMirror schema (the JSON structure to represent your content) doesn't recognise your new nodes or marks.

To let Vizy know how to handle your new items, you should register your nodes or marks and provide a class to implement its handling.

```php
use verbb\vizy\events\RegisterMarksEvent;
use verbb\vizy\events\RegisterNodesEvent;
use verbb\vizy\services\Nodes;
use yii\base\Event;

Event::on(Nodes::class, Nodes::EVENT_REGISTER_MARKS, function(RegisterMarksEvent $event) {
    $event->marks[] = ExampleMark::class;
});

Event::on(Nodes::class, Nodes::EVENT_REGISTER_NODES, function(RegisterNodesEvent $event) {
    $event->nodes[] = ExampleNode::class;
});
```

```php
<?php
namespace modules\vizymodule\marks;

use verbb\vizy\base\Mark;

class ExampleMark extends Mark
{
    // Properties
    // =========================================================================

    public static ?string $type = 'exampleMark';
    public mixed $tagName = 'span';


    // Public Methods
    // =========================================================================

    public function getTag(): array
    {
        $this->attrs['data-value'] = 'some-value';

        return parent::getTag();
    }
}
```

```php
<?php
namespace modules\vizymodule\nodes;

use verbb\vizy\base\Node;

class ExampleNode extends Node
{
    // Properties
    // =========================================================================

    public static ?string $type = 'exampleNode';
    public mixed $tagName = 'span';


    // Public Methods
    // =========================================================================

    public function getTag(): array
    {
        $this->attrs['data-value'] = 'some-value';

        return parent::getTag();
    }
}
```

Refer to the [Mark](docs:developers/mark) and [Node](docs:developers/node) documentation for more details.

## User Guides
We've also put together several user guides with full-featured examples. Read through the [User Guides](/craft-plugins/vizy/docs/user-guides) for more.
