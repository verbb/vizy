# Modify Nodes
You can modify the output of any node via Twig or PHP, depending on your preference and workflow. This modification allows you to alter things like classes, attributes and more, without having to construct the HTML from scratch. You can also modify any other attributes of a node.

## Using Twig
When outputting the content of a Vizy field, you'll likely use:

```twig
{{ entry.vizyField.renderHtml() }}
```

You can pass in an object to the `renderHtml()` with a configuration map of additional attributes you'd like included. For example, let's say we want to add a `text-lg` class to our Paragraph node.

```twig
{{ entry.vizyField.renderHtml({
    paragraph: {
        attrs: {
            class: 'text-lg',
        },
    },
}) }}

{# Resulting HTML #}
<p class="text-lg">Well it's gonna cost you. How much money you got on you?</p>
```

Or, another example could be modifying a Bold mark. Note that in order to supply config options for Marks, we need to attach them to Node config. 

```twig
{{ entry.vizyField.renderHtml({
    paragraph: {
        marks: {
            bold: {
                attrs: {
                    class: 'text-blue-500',
                },
            },
        },
    },
}) }}

<p>I'm sure that in <strong class="text-blue-500">1985</strong>, plutonium is available at every corner drug store.</p>
```

Of course, you're not limited to using just `class` attributes, and you're also able to change the HTML tag used.

```twig
{{ entry.vizyField.renderHtml({
    paragraph: {
        marks: {
            italic: {
                tagName: 'i',
                attrs: {
                    'data-text': 'italic',
                },
            },
        },
    },
}) }}

<p>My experiment worked. They're all exactly <i data-text="italic">twenty-five minutes</i> slow.</p>
```

So far, all the overrides we've done have completely replaced the attributes on a node. This might be desireable in some cases, but you can also change this behaviour using `merge: true`.

```twig
{{ entry.vizyField.renderHtml({
    paragraph: {
        merge: true,
        attrs: {
            class: 'text-lg',
        },
    },
}) }}
```

Importantly, the Paragraph node actually outputs a `text-left`, `text-right`, etc class depending on the alignment in the editor. Without `merge` set, our custom class would completely replace these clases, losing our alignment functionality.

## Using PHP
Alternatively, you can use the PHP method from a plugin or module to control this behaviour as well.

```php
use verbb\vizy\events\ModifyMarkTagEvent;
use verbb\vizy\marks\Bold;

use yii\base\Event;

Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    $event->tag[0]['attrs']['class'] = 'text-orange-500';
});
```

Here, we're modifying the `tag` attribute on the event, which is used when rendering the open and closing HTML tags for nodes and marks. This will apply the `text-orange-500` class globally, for all Bold marks for all Vizy fields. You might like to filter via the field:

```php
Event::on(Bold::class, Bold::EVENT_MODIFY_TAG, function(ModifyMarkTagEvent $event) {
    if ($event->mark->field->handle == 'myVizyField') {
        $event->tag[0]['attrs']['class'] = 'text-orange-500';
    }
});
```

You'll also notice we're using `tag[0]`. This is because defining a tag can actually support multiple items. For example, a Code Block node actually renders a `<pre>` and `<code>` tag. This can be useful if you require wrapping your nodes in additional HTML tags.


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

Here, we're including two items for the tag. The first item being a `div` with a class `rich-text`, with the second being the original attributes a Paragraph node uses for its tag. This ends up producing the following:

```twig
<div class="rich-text">
    <p>That was the day I invented time travel. I remember it vividly.</p>
</div>
``` 
