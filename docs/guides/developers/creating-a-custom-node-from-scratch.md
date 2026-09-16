# Creating a Custom Node from Scratch

Nodes are the chunks of content in Vizy’s editor — paragraphs, headings, images,
and so on. Marks sit *inside* text (bold, links); nodes *are* the pieces
themselves. This guide adds a small custom node, using an emoji chip as the
example.

The pattern matches
[Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch)
with a PHP node class and a matching JavaScript node definition. For the API
overview, see [Extending Vizy](docs:developers/extending-vizy).

## What You’Re Putting Together

As with marks, you need PHP, JavaScript, and an Editor Config working together.
PHP declares the node and how it renders as HTML. JavaScript registers a TipTap
`Node.create({ name: 'emoji', … })` factory with
`Craft.Vizy.registerModule('acme/node/emoji', () => Emoji)`. The Editor Config
enables the `emoji` capability and puts its control on the toolbar. The control uses the same ID as the TipTap name (`emoji`), and its JavaScript action inserts the emoji at the cursor.

## PHP

This walkthrough assumes you have a Craft module with autoloading and a control-panel AssetBundle, as explained in the [custom mark guide](docs:guides/developers/creating-a-custom-mark-from-scratch). Create `Emoji.php` in the directory mapped to your `acme\vizy\nodes` namespace:

```php
namespace acme\vizy\nodes;

use craft\helpers\Html;
use verbb\vizy\base\Node;
use verbb\vizy\base\RenderContext;

class Emoji extends Node
{
    public static ?string $type = 'emoji';

    public static function moduleId(): string
    {
        return 'acme/node/emoji';
    }

    public static function label(): string
    {
        return 'Emoji';
    }

    public static function renderOccurrenceHtml(string $children, array $resolvedAttrs, RenderContext $ctx): ?string
    {
        $emoji = (string)($resolvedAttrs['emoji'] ?? '😀');

        return Html::tag('span', Html::encode($emoji), ['data-emoji' => $emoji]);
    }
}
```

The type name identifies the node in saved content. The module ID connects it to the JavaScript below. `renderOccurrenceHtml()` returns the frontend HTML, including the saved emoji character.

Put these imports at the top of your module file and the event listener in its `init()` method:

```php
use acme\vizy\nodes\Emoji;
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, function(RegisterExtensionsEvent $event) {
    $event->nodes[] = Emoji::class;
});
```

## JavaScript

Save the following script as `emoji.js` in your AssetBundle’s source folder and list it in the bundle’s `js` property. Make the bundle depend on Vizy’s `VizyAsset`, following the custom mark guide, so the editor API is available before this script runs.

```js
const { Node, mergeAttributes } = Craft.Vizy.tiptap.core;

const Emoji = Node.create({
    name: 'emoji',
    group: 'inline',
    inline: true,
    atom: true,
    addAttributes() {
        return {
            emoji: { default: '😀' },
        };
    },
    parseHTML() {
        return [{
            tag: 'span[data-emoji]',
            getAttrs: (el) => ({ emoji: el.getAttribute('data-emoji') }),
        }];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(HTMLAttributes, { 'data-emoji': HTMLAttributes.emoji }),
            HTMLAttributes.emoji,
        ];
    },
    addCommands() {
        return {
            insertEmoji: (emoji) => ({ commands }) =>
                commands.insertContent({ type: this.name, attrs: { emoji } }),
        };
    },
});

Craft.Vizy.registerModule('acme/node/emoji', () => Emoji);

// Toolbar button that inserts a fixed emoji
Craft.Vizy.registerControl('emoji', {
    run: (editor) => editor.chain().focus().insertEmoji('😀').run(),
    isActive: () => false,
});
```

Wait for the `vizy:register` event if your AssetBundle may load before Vizy’s
field JavaScript.

## Enable the Toolbar Button

Enable **Emoji** under node capabilities on the field’s Editor Config, then add `emoji` to the toolbar. The `/`, `+`, and Add Block controls list structured Vizy blocks; use the toolbar button for this inline node. See [Choosing Insertion Controls](docs:guides/developers/choosing-insertion-controls).

## Test the Finished Node

Save the Editor Config and assign it to a Vizy field. Open an entry using that field and insert Emoji using the toolbar button. Save the entry, then reopen it to check that the emoji remains in the document.

Render the field in its entry template using `{{ entry.myVizyField.render() }}`, replacing the field handle with your own. The inserted character should appear on the page, and its HTML should contain a `span` with a `data-emoji` attribute. If it works in the editor but is missing from the page, check that Craft loads the PHP class as well as the control-panel script.

## If Something Doesn’T Work

`untrustedEditorModule:…` usually means the JS module id doesn’t match the PHP
`moduleId()` value, or the AssetBundle never loaded. If the toolbar button is missing, check that the capability is enabled and its ID is included in the toolbar. Empty
front-end HTML points at a missing `tag()` / `renderOccurrenceHtml()` on the
PHP type class.
