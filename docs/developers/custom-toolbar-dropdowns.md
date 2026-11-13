# Custom Toolbar Dropdowns

A toolbar dropdown is a single toolbar button that opens a menu of other controls. Vizy provides Formatting, Table and Alignment dropdowns. Register your own when several related controls, such as a set of custom marks, belong together and would crowd the toolbar as separate buttons.

Editors who manage Editor Configs can place a registered dropdown and choose or reorder its members, but they can't create a new dropdown, name one or pick its icon. Registering a dropdown makes it available to every Editor Config.

## Create the Toolbar Dropdown

A dropdown is an array with these keys.

| Key | Description |
| --- | --- |
| `name` | The dropdown's identifier, made of letters and numbers and starting with a letter. Editor Configs place it as `dropdown:{name}`. |
| `label` | The name shown for the dropdown in the editor and in Editor Configs. |
| `icon` | The name of an icon from Vizy's icon catalogue, such as `ellipsis`. |
| `members` | The control IDs the dropdown contains by default, such as `bold` or `heading2`. |

```php
$dropdown = [
    'name' => 'textEffects',
    'label' => 'Text effects',
    'icon' => 'ellipsis',
    'members' => ['strike', 'subscript', 'superscript', 'highlight'],
];
```

Members use the same control IDs as the toolbar. [Editor Capabilities](docs:feature-tour/editor-capabilities) lists the built-in IDs, and a [custom extension](docs:developers/custom-extensions) uses its own control ID. A member only appears when its capability is enabled on the Editor Config, so a dropdown can't turn on content the config doesn't allow.

Vizy throws an exception when a dropdown has an invalid name, no label, no members or the same name as another dropdown.

## Register the Toolbar Dropdown

Vizy finds toolbar dropdowns through the `registerToolbarDropdowns` event. Register your dropdown from your module or plugin’s `init()` method.

```php
use verbb\vizy\events\RegisterToolbarDropdownsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS, function(RegisterToolbarDropdownsEvent $event) {
    $event->dropdowns[] = [
        'name' => 'textEffects',
        'label' => 'Text effects',
        'icon' => 'ellipsis',
        'members' => ['strike', 'subscript', 'superscript', 'highlight'],
    ];
});
```

`$event->dropdowns` already contains Vizy's own dropdowns, so a listener can also change their default members.

## Place the Toolbar Dropdown

Open the Editor Config in **Settings → Vizy → Editor Configs** and add the dropdown to the toolbar, or add `dropdown:textEffects` to the `toolbar` list of a config stored in a JSON file. [Editor Configs](docs:feature-tour/editor-configs) explains how to trim or reorder a dropdown's members for one config.
