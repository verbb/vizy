# Events

Vizy provides a collection of events for extending its functionality. Modules and plugins can register event listeners, typically in their `init()` methods, to modify Vizy’s behaviour.

## The `modifyEditorConfig` Event

Use this event to adjust a named Editor Config for a particular Vizy field at runtime. The event receives the field, the selected Config ID, and a mutable config containing the same authorable keys used by Project Config and `config/vizy/*.json` files.

Vizy normalizes the result, resolves capability dependencies, and includes the effective config in the editor manifest's revision and cache identity. The same manifest is used for server-side content validation. Runtime changes do not write to Project Config or the source JSON file.

```php
use verbb\vizy\events\ModifyEditorConfigEvent;
use verbb\vizy\services\EditorManifests;
use yii\base\Event;

Event::on(EditorManifests::class, EditorManifests::EVENT_MODIFY_EDITOR_CONFIG, function(ModifyEditorConfigEvent $event) {
    if ($event->field?->handle !== 'summary') {
        return;
    }

    $event->config['capabilities']['marks'] = ['bold', 'italic'];
    $event->config['toolbar'] = ['bold', 'italic'];
    $event->config['bubble'] = [
        'enabled' => true,
        'items' => ['bold', 'italic'],
    ];
});
```

This event is field-scoped. It does not receive an element owner, site, or current user; use separate named Editor Configs when those contexts need different schemas.

## The `registerExtensions` Event
Use this event to tell Vizy about a custom mark, node, or behaviour extension. Register each PHP class in the matching list: `$event->marks`, `$event->nodes`, or `$event->extensions`. The example below assumes you have created the `Abbr` class from the [Abbreviation mark guide](docs:guides/developers/creating-a-custom-mark-from-scratch). Put the imports at the top of your module file and the event listener in its `init()` method.

The editor also needs the corresponding JavaScript module, registered with `Craft.Vizy.registerModule()`. [Extending Vizy](docs:developers/extending-vizy) explains how the PHP and JavaScript parts work together.

```php
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;
use acme\vizy\marks\Abbr;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, function(RegisterExtensionsEvent $event) {
    $event->marks[] = Abbr::class;
});
```

## The `registerToolbarDropdowns` Event
Use this event to register a named group of toolbar controls. For example, the following adds a menu containing Bold and Italic. Register the listener in your module’s `init()` method, then add `dropdown:myMenu` to the field’s Editor Config.

Editor Configs can choose and reorder members of a registered dropdown. Register the dropdown here first so its name and available controls are known to Vizy.

```php
use verbb\vizy\events\RegisterToolbarDropdownsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS, function(RegisterToolbarDropdownsEvent $event) {
    $event->dropdowns[] = [
        'name' => 'myMenu',
        'label' => 'My menu',
        'icon' => 'ellipsis',
        'members' => ['bold', 'italic'],
    ];
});
```

## Customising Rendered HTML

Vizy’s rendering events change the HTML produced by existing nodes and marks without rebuilding the document in Twig. Continue using `{{ entry.vizyField.render() }}` and Block Type templates for ordinary frontend output; register these listeners in a module or plugin when the generated HTML itself needs to change.

`VizyDocument::render()` asks each node and mark class for its tag structure and resolved attributes. The modify events fire on those classes for every HTML-emitting occurrence, including layout wrappers, images and simple tags.

Listen on a concrete class such as `Bold::class` when the change applies to one type. Listen on the base `Mark::class` or `Node::class` for a cross-cutting change. On the default render path, `$event->node` and `$event->mark` are null. Use `$event->typeId`, `$event->attrs` and `$event->context` instead; the context contains the field, owner and site.

### The `modifyMarkTag` Event

Use `EVENT_MODIFY_TAG` on a mark class to change its opening and closing tags or attributes. This example adds a class to Bold text:

```php
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\marks\Bold;
use yii\base\Event;

Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    $event->tag[0]['attrs']['class'] = 'text-orange-500';
});
```

Limit the change to one Vizy field when required:

```php
Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    if ($event->context?->field?->handle === 'articleBody') {
        $event->tag[0]['attrs']['class'] = 'text-orange-500';
    }
});
```

Listen on the base class when the same logic applies to every mark:

```php
use verbb\vizy\base\Mark;

Event::on(Mark::class, Mark::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    // Runs after listeners registered on the concrete mark class.
});
```

### The `modifyNodeTag` Event

Use `EVENT_MODIFY_TAG` on a node class to change its tag structure. `tag` is a list because some nodes emit more than one HTML tag; Code Block, for example, uses both `<pre>` and `<code>`.

This example wraps every paragraph:

```php
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\nodes\Paragraph;
use yii\base\Event;

Event::on(Paragraph::class, Paragraph::EVENT_MODIFY_TAG, function(ModifyNodeTagEvent $event) {
    $paragraph = $event->tag[0];

    $event->tag = [
        [
            'tag' => 'div',
            'attrs' => [
                'class' => 'rich-text',
            ],
        ],
        $paragraph,
    ];
});
```

The resulting HTML is:

```html
<div class="rich-text">
    <p>That was the day I invented time travel. I remember it vividly.</p>
</div>
```

### The `modifyRenderedNode` Event

Use `EVENT_MODIFY_RENDERED_NODE` after a node’s complete HTML has been generated. This is useful for self-closing or fully custom nodes where changing the tag structure is not enough.

The following wraps an Image and appends copyright text:

```php
use craft\helpers\Html;
use verbb\vizy\events\ModifyRenderedNodeEvent;
use verbb\vizy\nodes\Image;
use yii\base\Event;

Event::on(Image::class, Image::EVENT_MODIFY_RENDERED_NODE, function(ModifyRenderedNodeEvent $event) {
    $copyrightText = Html::tag('span', '© This is my copyright text');
    $copyright = Html::tag('div', $copyrightText, ['class' => 'copyright']);

    $event->renderedNode = Html::tag(
        'div',
        $event->renderedNode . $copyright,
        ['class' => 'vizy__image'],
    );
});
```

## The `registerLinkOptions` Event
The event that is triggered when registering the link options for the field.

```php
use verbb\vizy\events\RegisterLinkOptionsEvent;
use verbb\vizy\fields\VizyField;
use yii\base\Event;

Event::on(VizyField::class, VizyField::EVENT_REGISTER_LINK_OPTIONS, function(RegisterLinkOptionsEvent $event) {
    $linkOptions = $event->linkOptions;
    // ...
});
```
