# Events
Vizy provides a collection of events for extending its functionality. Modules and plugins can register event listeners, typically in their `init()` methods, to modify Vizy’s behaviour.

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

## The `modifyNodeTag` Event
Fired when a node’s HTML tag structure is built. On the default render path this
is class-level: `$event->node` is null; use `$event->context` / `$event->typeId`.

```php
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\nodes\Paragraph;
use yii\base\Event;

Event::on(Paragraph::class, Paragraph::EVENT_MODIFY_TAG, function(ModifyNodeTagEvent $event) {
    $tag = $event->tag;
    $typeId = $event->typeId;
    $context = $event->context;
    $opening = $event->opening;
    $closing = $event->closing;
    // ...
});
```

## The `modifyMarkTag` Event
Fired when a mark’s HTML tag structure is built. On the default render path this is class-level: `$event->mark` is null; use `$event->context` / `$event->typeId`.

```php
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\marks\Bold;
use yii\base\Event;

Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    $tag = $event->tag;
    $typeId = $event->typeId;
    $context = $event->context;
    $opening = $event->opening;
    $closing = $event->closing;
    // ...
});
```

## The `modifyRenderedNode` Event
The event that is triggered for when a node's HTML has been generated and is rendered.

```php
use verbb\vizy\events\ModifyRenderedNodeEvent;
use verbb\vizy\nodes\Image;
use yii\base\Event;

Event::on(Image::class, Image::EVENT_MODIFY_RENDERED_NODE, function(ModifyRenderedNodeEvent $event) {
    $event->renderedNode = '<div class="wrapper">' . $event->renderedNode . '</div>';
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
