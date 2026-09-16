# Extending Vizy

Vizy already ships with a solid set of nodes and marks, but you can add your
own — a custom abbreviation mark, an emoji node, brand-coloured text, and so on.
Under the hood that means registering a TipTap extension so the editor
understands the new content, wiring it up in PHP so Vizy knows how to render it
on the front end, and enabling it on an Editor Config so authors can actually
use it.

You don’t need to be a TipTap expert to get started. If you’d rather follow a
full copy-paste example first, jump to
[Creating a Custom Mark from Scratch](docs:guides/developers/creating-a-custom-mark-from-scratch),
which walks through an Abbreviation (`abbr`) mark from a Craft module all the
way to the toolbar and front-end HTML. The matching
[node guide](docs:guides/developers/creating-a-custom-node-from-scratch) covers
the same pattern for something like an emoji, including a toolbar button. There’s
also a ready-to-copy Craft module under `examples/vizy-abbr-module/` in the
plugin repo if you prefer starting from files rather than the docs alone.

This page is the overview: what’s involved, which APIs to call, and where the
common pitfalls are. The snippets below are the shape of each call — not a
complete module.

The examples assume you have a Craft module or plugin that loads your PHP classes and a control-panel AssetBundle for JavaScript. An AssetBundle tells Craft which script to load and which other scripts it depends on. The custom mark guide explains how these pieces connect. Vizy exposes its TipTap helpers through `Craft.Vizy.tiptap.core`, so the examples use those shared helpers.

TipTap’s [custom extension documentation](https://tiptap.dev/docs/editor/extensions/custom-extensions) explains how to define editor behaviour. The [ProseMirror guide](https://prosemirror.net/docs/guide/) provides background on the document model behind it; consult it when your extension needs lower-level editing behaviour.

## The Three Pieces

Every custom mark or node needs three pieces working together. Skip any one of
them and you’ll usually see a missing button, an editor that refuses to boot, or
blank HTML on the front end.

### PHP — Declare the Capability

Register on `Extensions::EVENT_REGISTER_EXTENSIONS` from your module’s
`init()`. The `moduleId()` value is the bridge to JavaScript — it must match what
you pass to `registerModule` later, and it must not use the reserved
`vizy/core/…` prefix (that namespace is for Vizy’s bundled factories).

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
        // $event->nodes[] = Emoji::class;
        // $event->extensions[] = CharacterCount::class;
    }
);
```

Implement a thin `Mark` / `Node` / `Extension` subclass with `id()` (via `$type`),
`moduleId()`, `label()`, optional `icon()` / `surfaces()` / `group()`, and for
HTML types `tag()` (string, nested list like `['pre','code']`, or `null`).
Overrides listen on the class: `Event::on(Abbr::class, Mark::EVENT_MODIFY_TAG, …)`.

Module IDs such as `acme/mark/abbr` become `installed` when registered. The
editor fails closed if the matching JS factory never shows up.

### JavaScript — Register the TipTap Factory

Load a CP AssetBundle that depends on Vizy’s field assets, then register the
factory. Wait for `vizy:register` if your script may load before Vizy’s:

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

Do not `npm install @tiptap/core` into your module for CP scripts — use the
shared packages Vizy already loads (`Craft.Vizy.tiptap.core`, plus
`tiptap.pm.state` / `model` / `view` when you need ProseMirror directly).

### Editor Config — Turn It on for Authors

Enable the capability (for example **Abbreviation**) on the field’s Editor
Config, then place its control on the toolbar or Bubble Menu. Without that step
the mark exists in code but authors never see it.

## Other APIs

### Behaviour-Only TipTap Extensions

Some TipTap modules change editing behaviour without adding a persisted JSON
type (character counts, input rules helpers, and similar). Register a thin
`Extension` subclass on `$event->extensions[]`. Enable them under **Behaviour
extensions** on the Editor Config so their module loads. Leave `surfaces()`
empty if there is no toolbar button; return surfaces (and usually
`Craft.Vizy.registerControl`) when authors need a button.

```php
$event->extensions[] = \acme\vizy\CharacterCount::class;
```

### Replacing or Customising Controls

If you only need to reconfigure a core TipTap extension the field already
loaded, use `Craft.Vizy.replaceModule`. That cannot invent a new persisted
type — it only changes behaviour of something PHP already installed for that
field:

```js
Craft.Vizy.replaceModule('heading', ({ extension }) =>
    extension.configure({
        HTMLAttributes: { class: 'my-heading' },
    })
);
```

For a custom toolbar click (dialogs, multi-step flows, and the like), register a
runner with `Craft.Vizy.registerControl`. Standard toggle-mark / insert-node
actions usually don’t need this:

```js
Craft.Vizy.registerControl('abbr', {
    run: (editor) => editor.chain().focus().toggleMark('abbr').run(),
    isActive: (editor) => editor.isActive('abbr'),
});
```

The Add Block, `/`, and `+` controls list Vizy blocks. Use a toolbar control for custom rich-text nodes and actions. [Choosing Insertion Controls](docs:guides/developers/choosing-insertion-controls) explains which route fits your feature.

## Common Mistakes

If the capability never shows up in Editor Config, the PHP event probably isn’t
registered. An editor boot
error like `untrustedEditorModule:…` almost always means the JS
`registerModule` id doesn’t match the PHP `moduleId()` value, or the AssetBundle
never loaded. A toolbar button that does nothing usually means the mark isn’t
on the Editor Config toolbar, or the TipTap `name` doesn’t match the capability
`name`. Empty front-end HTML points at a missing `tag()` / `renderOccurrenceHtml()`
on the PHP type class.
