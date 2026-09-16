# Modify Nodes

Sometimes you want to tweak how Vizy turns a node or mark into HTML — add a class, change a tag, wrap an image — without rebuilding the whole document in Twig. Use the PHP events below.

For everyday front-end output, stick with:

```twig
{{ entry.vizyField.render() }}
```

and use [Block Type Templates](docs:template-guides/block-type-templates) for Blocks. Use the events below to change HTML across all Vizy fields or only a selected field.

See also [Extensibility](docs:developers/extending-vizy) and [Events](docs:developers/events).

## How Overrides Work

`VizyDocument::render()` builds HTML from each type’s class (`tag()`, `resolveAttrs()`, optional `renderOccurrenceHtml()`). Modify events fire **on that class** for every HTML-emitting mark and node — including layout wrappers, images, and simple tags.

Register the listener in your module or plugin’s `init()` method, with the imports at the top of the PHP file. Listen on a concrete type such as `Bold::class` when the change should affect only that type. Listen on the base `Mark::class` or `Node::class` when it should apply to every mark or node.

The default renderer provides the type through `$event->typeId`, its attributes through `$event->attrs`, and the field, owner, and site through `$event->context`. It does not construct a node or mark object for this event, so `$event->node` and `$event->mark` are null.

## Using PHP

Change the open and close tags for a mark — here, Bold:

```php
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\marks\Bold;
use yii\base\Event;

Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    $event->tag[0]['attrs']['class'] = 'text-orange-500';
});
```

Limit that to one field when you need to:

```php
Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    $handle = $event->context?->field?->handle ?? null;
    if ($handle === 'myVizyField') {
        $event->tag[0]['attrs']['class'] = 'text-orange-500';
    }
});
```

Cross-cutting listeners can attach to the base type instead:

```php
Event::on(\verbb\vizy\base\Mark::class, \verbb\vizy\base\Mark::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    // Fires for every mark after the concrete type’s handlers.
});
```

`tag` is a list because some nodes emit more than one HTML tag (a Code Block uses both `<pre>` and `<code>`). You can wrap a node by putting another tag in front:

```php
use verbb\vizy\events\ModifyNodeTagEvent;
use verbb\vizy\nodes\Paragraph;
use yii\base\Event;

Event::on(Paragraph::class, Paragraph::EVENT_MODIFY_TAG, function(ModifyNodeTagEvent $event) {
    $tag = $event->tag[0];

    $event->tag = [
        [
            'tag' => 'div',
            'attrs' => [
                'class' => 'rich-text',
            ],
        ],
        $tag,
    ];
});
```

That produces:

```html
<div class="rich-text">
    <p>That was the day I invented time travel. I remember it vividly.</p>
</div>
```

For self-closing or fully custom nodes such as Image, take over the full rendered HTML instead:

```php
use craft\helpers\Html;
use verbb\vizy\events\ModifyRenderedNodeEvent;
use verbb\vizy\nodes\Image;
use yii\base\Event;

Event::on(Image::class, Image::EVENT_MODIFY_RENDERED_NODE, function(ModifyRenderedNodeEvent $event) {
    $image = $event->renderedNode;

    $copyrightText = Html::tag('span', '© This is my copyright text');
    $copyright = Html::tag('div', $copyrightText, ['class' => 'copyright']);
    $wrapper = Html::tag('div', $image . $copyright, ['class' => 'vizy__image']);

    $event->renderedNode = $wrapper;
});
```
