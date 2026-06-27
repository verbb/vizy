# Creating a custom Mark from scratch

Vizy already supports plenty of marks to model your content, but you can already create your own!

We'll cover creating a new mark to change the font color for text content.

:::warning
Heads up! This guide requires that you're familiar with [Tiptap](https://tiptap.dev) and creating custom extensions. We'll cover all the details for Vizy, but not cover the specifics of Tiptap or [ProseMirror](https://prosemirror.net/docs/guide/) work.

This guide will give you an excellent starting point to continue developing your own.
:::

### Understanding Vizy Plugin anatomy
Before we dive in, let's discuss the anatomy of a Vizy Plugin, which ties into a little bit about how [Tiptap](https://tiptap.dev) works. There's a few concepts to grasp, but we'll try and cover them as required, step-by-step.

In our case, we want to register a new button that when pressed, toggles a color on some text. That requires three parts:

- A  [Tiptap](https://tiptap.dev) extension to add the new mark definition to the editor
- A button, that when pressed performs the actual action
- A PHP class that handles the color saved in ProseMirror schema to output on the front-end

In order to construct a document model, Tiptap (and ProseMirror) needs to know all the pieces you're trying to add to it. This is called a "schema". For example, you might have a button that bolds text when clicked, but Tiptap needs to know _how_ to do that to the text. 

As such, we'll be creating a Tiptap extension in the form of a custom mark that generates a DOM element in the editor to show our color. Once added to the Vizy field, Tiptap will be able to understand what a font color mark is, what it looks like, how to create one, and more.

The second part is more on the Vizy end (as Tiptap is renderless), where we need to register a button in the toolbar. If the extension is adding the instructions to the editor on what to do, a button is the action to actually _do it_.

The third part is in PHP, once the color has been saved as JSON to the database. Like in the editor itself, we use a schema when rendering the content of the field on the front-end, which is largely structured according to ProseMirror. But the schema won't know how to handle our custom color mark, so we'll need to give it instructions on how we want to render that mark.

### Create your module
First, you'll need to get familiar with [creating a module](/blog/everything-you-need-to-know-about-modules), as we'll be registering our custom files through a module.

When creating your module, set the namespace to `modules\vizymodule` and the module ID to `vizy-module`.

Create the following directory and file structure:

```treeview
my-project/
├── config/
│    └── vizy/
│            └── Custom.json
├── modules/
│    └── vizymodule/
│        └── src/
│            └── assets/
│                └── js/
│                    └── font-color.js
│                └── FontColorAsset.php
│            └── marks/
│                └── FontColor.php
│            └── VizyModule.php
└── ...
```

```php
// modules/vizymodule/src/VizyModule.php

<?php
namespace modules\vizymodule;

use Craft;
use modules\vizymodule\assets\FontColorAsset;
use modules\vizymodule\marks\FontColor;
use verbb\vizy\base\Plugin as VizyPlugin;
use verbb\vizy\events\RegisterMarksEvent;
use verbb\vizy\events\RegisterPluginEvent;
use verbb\vizy\fields\VizyField;
use verbb\vizy\services\Nodes;
use yii\base\Event;
use yii\base\Module;

class VizyModule extends Module
{
    // Public Methods
    // =========================================================================

    public function init()
    {
        // Call the `Module::init()` method, which will do its own initializations
        parent::init();

        // Define a custom alias named after the namespace
        Craft::setAlias('@vizy-module', __DIR__);

        // Register our custom plugin
        Event::on(VizyField::class, VizyField::EVENT_REGISTER_PLUGINS, function(RegisterPluginEvent $event) {
            $event->plugins[] = new VizyPlugin([
                'handle' => 'font-color',
                'assetBundle' => FontColorAsset::class,
            ]);
        });

        // Register our custom mark
        Event::on(Nodes::class, Nodes::EVENT_REGISTER_MARKS, function(RegisterNodesEvent $event) {
            $event->marks[] = FontColor::class;
        });
    }
}
```

Here our main module file is pretty simple. We tell Vizy we want to register a new `VizyPlugin` with the handle `font-color`, and provide it the asset bundle `FontColorAsset`.

:::tip
You can name the handle whatever you like, so long as it's unique for any other Vizy Plugin registered. It'll be this value that we'll use in our editor config to enable the plugin.
:::

Lastly, we register a `FontColor` class for our custom mark. This will be for us to define what to do with an color mark when rendering the content of the Vizy field on the front-end.

#### Asset Bundle class
```php
// modules/vizymodule/src/assets/FontColorAsset.php

<?php
namespace modules\vizymodule\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use verbb\vizy\web\assets\field\VizyAsset;

class FontColorAsset extends AssetBundle
{
    // Public Methods
    // =========================================================================

    public function init(): void
    {
        $this->sourcePath = '@vizy-module/assets';

        $this->depends = [
            CpAsset::class,
            VizyAsset::class,
        ];

        $this->js = [
            'js/font-color.js',
        ];

        parent::init();
    }
}
```

For our asset bundle, we register any CSS or JS that we'll need for our plugin. These can be named whatever you like. We also ensure that this asset bundle is dependant on `CpAsset` and `VizyAsset` to ensure things are loaded correctly.

#### Editor Config
Before we dive into the JS code, let's add this newly-registered plugin to our [editor config](/vizy/docs/get-started/configuration#editor-configuration). This allows us to actually load the plugin on a Vizy field that uses this editor config.

```
// config/vizy/Custom.json

{
    "buttons": ["italic", "bold", "font-color"],
    "plugins": ["font-color"]
}
```
We ensure that our plugin handle exists in the `plugins` array, and because we're going to register a new button, we'll add a `font-color` to the `buttons` array. Note that despite being named the same, these are two different things and don't have to be named the same.

Once you've created this file, ensure that the Vizy field you'll be testing with is using this config, by editing the settings of the Vizy field.

#### Font Color JS
Next, we need to create our JavaScript file that will be run when Vizy is initialized. It'll be this code that registers our [Tiptap](https://tiptap.dev/api/marks) mark.

```js
// modules/vizymodule/src/assets/js/font-color.js

document.addEventListener('onVizyConfigReady', (e) => {
    const { Mark, mergeAttributes } = Craft.Vizy.Config.tiptap.core;

    const FontColor = Mark.create({
        name: 'fontColor',

        addAttributes() {
            return {
                color: {
                    default: null,
                    parseHTML: element => element.getAttribute('data-color') || element.style.color,
                    renderHTML: attributes => {
                        if (!attributes.color) {
                            return {};
                        }

                        return {
                            'data-color': attributes.color,
                            style: `color: ${attributes.color};`,
                        }
                    },
                },
            }
        },

        parseHTML() {
            return [
                { tag: 'span[data-color]' },
            ]
        },

        renderHTML({ HTMLAttributes }) {
            return ['span', HTMLAttributes, 0];
        },

        addCommands() {
            return {
                setColor: color => ({ commands }) => {
                    return commands.setMark(this.name, { color })
                },

                toggleColor: color => ({ commands }) => {
                    return commands.toggleMark(this.name, { color })
                },

                unsetColor: () => ({ commands }) => {
                    return commands.unsetMark(this.name)
                },
            }
        },
    });

    Craft.Vizy.Config.registerExtensions((extensions) => {
        return [
            FontColor,
        ];
    });

    Craft.Vizy.Config.registerButtons((buttons) => {
        return [{
            name: 'font-color',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg>',
            title: Craft.t('vizy', 'Font Color'),
            action: (editor) => { return editor.chain().focus().toggleColor('#958DF1').run(); },
            isActive: (editor) => { return editor.isActive('fontColor', { color: '#958DF1' }); },
        }];
    });
});
```

Let's cover this code a step at a time.

Calling `document.addEventListener('onVizyConfigReady')` will ensure that our code is only run when Vizy is ready to load our plugin code.

We can then access the Tiptap API without having to run `npm install @tiptap/core`. This is where we get our `Mark` class definition to create a new one.

Next, we define our Mark class. We won't cover all the details here, but this follows the structure of a Tiptap [Mark](https://tiptap.dev/api/marks).

We then register this new mark with `Craft.Vizy.Config.registerExtensions()` to let Vizy load up this mark definition in the editor.

Finally, we need a button to be able to trigger our new extension! We can add a new button with `Craft.Vizy.Config.registerButtons()` which has an `action` to run the `toggleColor()` command defined in our mark class. We're also using the `name` we've added to our `buttons` array in our editor config.

:::tip
Be sure to check out the [Extending Vizy](/craft-plugins/vizy/docs/template-guides/extending-vizy) docs for more detail on the available options.
:::

With all those pieces in place, let's load up the Vizy field in an entry. You should see your new button in the toolbar, ready to get pressed. Go ahead, press it!

![Get ready to add some outrageous bling to your page](https://assets.verbb.io/blog/creating-a-custom-mark-from-scratch/vizy-custom-mark.png)

*Get ready to add some outrageous bling to your page*

That's looking good, just please don't make your page look like a Geocities '98 page.

Inspecting the code in the editor, you'll see the following:

```html
<p>So you want some <span data-color="#958DF1" style="color: #958DF1;">special</span> text, huh?</p>
```

It's created a `<span>` element with the color as a `data-color` and `style` attribute. More on that later.

However, saving your entry and viewing it on the front-end, you'll notice that your shiny new color is missing 🙁 That's because Vizy doesn't know how to handle that content in the ProseMirror schema — that's the JSON content saved to your database.

So — we need to tell Vizy how to handle this new node with a custom PHP class.

#### Node class
```php
// modules/vizymodule/src/marks/FontColor.php

<?php
namespace modules\vizymodule\marks;

use verbb\vizy\base\Mark;

use craft\helpers\ArrayHelper;

class FontColor extends Mark
{
    // Properties
    // =========================================================================

    public static ?string $type = 'fontColor';
    public mixed $tagName = 'span';


    // Public Methods
    // =========================================================================

    public function getTag(): array
    {
        $color = ArrayHelper::remove($this->attrs, 'color');

        $this->attrs['data-color'] = $color;
        $this->attrs['style'] = 'color: ' . $color;

        return parent::getTag();
    }
}
```

We ensure the `type` property matches the `name` we've given the node in our JS class, along with `tagName`. We also use `getTag()` to control how exactly we want to render the text color.

Remember how the `<span>` element also had a `data-color` attribute in the Vizy field? That's because we can control the output of the mark with the `attrs` properties. The `color` is stored in `attrs`.

So if we omitted the `getTag()` function above, we'd get:

```html
<p>So you want some <span color="#958DF1">special</span> text, huh?</p>
```

Which is _sort of_ okay, but it's not exactly valid HTML. Instead, our `getTag()` removes the `color` from `$this->attrs` and adds a `data-color` and `style`attributes, rendering:

```html
<p>So you want some <span data-color="#958DF1" style="color: #958DF1;">special</span> text, huh?</p>
```

Which is more like it. Totally your call whether to use the `data-color` or just use the inline style, or something else entirely — up to you!
