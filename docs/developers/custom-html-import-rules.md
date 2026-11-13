# Custom HTML Import Rules

An HTML import rule tells Vizy's HTML importer which custom node or mark an HTML element becomes. Vizy already converts standard elements such as paragraphs, headings, lists, links and tables. Add a rule when the HTML you import contains markup for one of your own [custom extensions](docs:developers/custom-extensions), such as `<abbr>` for an Abbreviation mark. Rules apply everywhere the importer runs, including [Importing HTML](docs:developers/importing-html), Feed Me imports and [rich text field migrations](docs:user-guides/migrating-rich-text-fields).

A rule only describes how HTML becomes document content. It doesn't register the extension in the editor or change how it renders.

## Create the HTML Import Rule

Create a rule with `HtmlImportRule::mark()` or `HtmlImportRule::node()`. The target extension must already be registered and enabled in the destination field’s Editor Config, because the importer won't create content the field can't edit.

This rule imports `<abbr>` as a registered `abbr` mark, and copies its `title` attribute:

```php
use verbb\vizy\importers\HtmlImportRule;

$rule = HtmlImportRule::mark(
    ['abbr'],
    'abbr',
    static fn(\DOMElement $element): array => [
        'title' => $element->getAttribute('title'),
    ],
);
```

`HtmlImportRule::mark()` takes these arguments.

| Argument | Description | Default |
| --- | --- | --- |
| `tags` | The HTML tag names the rule matches. | Required |
| `type` | The mark's type, the same as its `$type`. | Required |
| `attributes` | An array of attributes, or a callable that receives the source `DOMElement` and returns one. | No attributes |
| `priority` | Rules with a higher priority are checked first. | `0` |
| `matcher` | A callable that receives the source `DOMElement` and returns whether the rule applies, for when a tag alone isn't specific enough. | Any matching tag |

`HtmlImportRule::node()` takes the same arguments, with two more after `type`. `placement` is `HtmlImportRule::PLACEMENT_BLOCK` for a node that sits between paragraphs or `HtmlImportRule::PLACEMENT_INLINE` (the default) for one that sits inside text. `content` controls which children are converted, `HtmlImportRule::CONTENT_BLOCK`, `HtmlImportRule::CONTENT_INLINE` (the default) or `HtmlImportRule::CONTENT_NONE`.

This rule imports `<span class="badge">` as the `badge` node from the custom node guide, using a matcher so other `<span>` elements keep their usual handling:

```php
use verbb\vizy\importers\HtmlImportRule;

$rule = HtmlImportRule::node(
    ['span'],
    'badge',
    HtmlImportRule::PLACEMENT_INLINE,
    HtmlImportRule::CONTENT_NONE,
    static fn(\DOMElement $element): array => [
        'label' => trim($element->textContent),
    ],
    matcher: static fn(\DOMElement $element): bool => str_contains(' ' . $element->getAttribute('class') . ' ', ' badge '),
);
```

When more than one rule could match the same element, give each a matcher or a priority so the result is predictable. The first matching rule in priority order wins.

## Register the HTML Import Rule

Vizy finds import rules through the `registerRules` event. Register your rule from your module or plugin’s `init()` method. `$event->field` is the destination Vizy field, if you only want the rule for some fields.

```php
use verbb\vizy\events\RegisterHtmlImportRulesEvent;
use verbb\vizy\importers\HtmlImportRule;
use verbb\vizy\services\HtmlImporter;
use yii\base\Event;

Event::on(HtmlImporter::class, HtmlImporter::EVENT_REGISTER_RULES, function(RegisterHtmlImportRulesEvent $event) {
    $event->rules[] = HtmlImportRule::mark(
        ['abbr'],
        'abbr',
        static fn(\DOMElement $element): array => [
            'title' => $element->getAttribute('title'),
        ],
    );
});
```

To use a rule for one conversion only, pass it in `HtmlImportOptions(rules: [...])` when calling the importer instead of registering a listener. Validate any rule configuration you store before using it.
