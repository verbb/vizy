# Custom Link Attributes

A link attribute adds a checkbox to Vizy's Link dialog, such as **No follow** or **Sponsored link**. Editors switch it on for individual links, and Vizy saves the choice with the link. Register one when editors need an extra choice about a link and Vizy's URL, element picker, site, title and class settings don't cover it. Your attribute sits alongside those built-in settings, so you don't need to replace the Link dialog.

## Create the Link Attribute

A link attribute is an array with these keys.

| Key | Description | Default |
| --- | --- | --- |
| `name` | The name the choice is saved under in the link's attributes. It must start with a letter, contain only letters and numbers, and not clash with one of the Link mark's own attributes such as `title`, `rel` or `class`. | Required |
| `label` | The checkbox label shown in the Link dialog. | Required |
| `type` | The kind of control. Only `boolean` is supported. | `boolean` |
| `default` | Whether the checkbox starts switched on. | `false` |
| `htmlAttribute` | The HTML attribute to add to the rendered link when the checkbox is on, either `rel`, `class` or a `data-*` attribute. | None |
| `htmlValue` | The value to add to `htmlAttribute`. Required when `htmlAttribute` is set. | None |

This attribute adds a **No follow** checkbox, saves `nofollow: true` on the link, and adds `nofollow` to the rendered `rel` attribute:

```php
use Craft;

$attribute = [
    'name' => 'nofollow',
    'label' => Craft::t('site', 'No follow'),
    'default' => false,
    'htmlAttribute' => 'rel',
    'htmlValue' => 'nofollow',
];
```

A `rel` or `class` value is added to the tokens the link already has, so a link that opens in a new window keeps its own `rel` values too. A `data-*` attribute gives your frontend a stable hook, such as `data-cloaked="1"` for a cloaked link:

```php
$attribute = [
    'name' => 'cloaked',
    'label' => Craft::t('site', 'Cloaked'),
    'htmlAttribute' => 'data-cloaked',
    'htmlValue' => '1',
];
```

Leave out `htmlAttribute` and `htmlValue` when a mark template or GraphQL consumer handles the choice instead. The saved value is always available in the link mark's `attrs`. Registered attributes can't replace the link's `href` or add event-handler attributes, so URL rewriting stays in your own code. Vizy throws an exception when an attribute has an invalid or duplicate name, no label, a type other than `boolean`, a non-boolean default or an unsupported HTML mapping.

## Register the Link Attribute

Vizy finds link attributes through the `registerAttributes` event on the Link mark. Register your attribute from your module or plugin’s `init()` method.

```php
use Craft;
use verbb\vizy\events\RegisterLinkAttributesEvent;
use verbb\vizy\marks\Link;
use yii\base\Event;

Event::on(Link::class, Link::EVENT_REGISTER_ATTRIBUTES, function(RegisterLinkAttributesEvent $event) {
    $event->attributes[] = [
        'name' => 'nofollow',
        'label' => Craft::t('site', 'No follow'),
        'default' => false,
        'htmlAttribute' => 'rel',
        'htmlValue' => 'nofollow',
    ];
});
```

The checkbox appears in the Link dialog of every Vizy field. When an editor switches it on, a link renders as `<a href="…" rel="nofollow">`.
