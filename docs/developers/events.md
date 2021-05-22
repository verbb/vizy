# Events

Vizy provides a collection of events for extending its functionality. Modules and plugins can register event listeners, typically in their `init()` methods, to modify Vizy’s behavior.

### The `registerNodes` event
The event that is triggered for registration of nodes.

```php
use verbb\vizy\events\RegisterNodesEvent;
use verbb\vizy\services\Nodes;
use yii\base\Event;

Event::on(Nodes::class, Nodes::EVENT_REGISTER_NODES, function(RegisterNodesEvent $event) {
    $event->nodes[] = MyNode::class;
    // ...
});
```

### The `registerMarks` event
The event that is triggered for registration of marks.

```php
use verbb\vizy\events\RegisterMarksEvent;
use verbb\vizy\services\Nodes;
use yii\base\Event;

Event::on(Nodes::class, Nodes::EVENT_REGISTER_MARKS, function(RegistermarksEvent $event) {
    $event->marks[] = MyMark::class;
    // ...
});
```

### The `modifyNodeTag` event
The event that is triggered for when a node's HTML tag is rendered.

```php
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\nodes\Paragraph;
use yii\base\Event;

Event::on(Paragraph::class, Paragraph::EVENT_MODIFY_TAG, function(ModifyNodeTagEvent $event) {
    $tag = $event->tag;
    $node = $event->node;
    $opening = $event->opening;
    $closing = $event->closing;
    // ...
});
```

### The `modifyMarkTag` event
The event that is triggered for when a mark's HTML tag is rendered.

```php
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\marks\Bold;
use yii\base\Event;

Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    $tag = $event->tag;
    $mark = $event->mark;
    $opening = $event->opening;
    $closing = $event->closing;
    // ...
});
```

### The `registerLinkOptions` event
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

### The `defineVizyConfig` event
The event that is triggered when loading the editor config.

```php
use verbb\vizy\events\ModifyVizyConfigEvent;
use verbb\vizy\fields\VizyField;
use yii\base\Event;

Event::on(VizyField::class, VizyField::EVENT_DEFINE_VIZY_CONFIG, function(ModifyVizyConfigEvent $event) {
    $config = $event->config;
    $field = $event->field;
    // ...
});
```
