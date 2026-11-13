# Events

Vizy provides events for extending its functionality. Modules and plugins can register event listeners, typically in their `init()` methods, to change Vizy’s behaviour.

## Editor Config Events

### The `modifyEditorConfig` Event

The event that is triggered when Vizy builds the editor manifest for a Vizy field, after it has loaded the field's named Editor Config. The event receives the field, the selected Config ID, and a mutable config containing the same authorable keys used by Project Config and `config/vizy/*.json` files.

Vizy normalises the result, resolves capability dependencies, and includes the effective config in the editor manifest's revision and cache identity. The same manifest is used for server-side content validation. Runtime changes do not write to Project Config or the source JSON file.

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

This event is field-scoped. It does not receive an element owner, site, or current user, so use separate named Editor Configs when those contexts need different schemas.

## Extension Events

### The `registerExtensions` Event

The event that is triggered when Vizy collects the custom marks, nodes and behaviour extensions it should know about. Add each class to `$event->marks`, `$event->nodes` or `$event->extensions`. [Custom Extensions](docs:developers/custom-extensions) explains how to create the class and the JavaScript module the editor also needs.

```php
use acme\vizy\marks\Abbr;
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_EXTENSIONS, function(RegisterExtensionsEvent $event) {
    $event->marks[] = Abbr::class;
});
```

### The `registerToolbarDropdowns` Event

The event that is triggered when Vizy collects the named groups of toolbar controls that Editor Configs can place as dropdowns. `$event->dropdowns` already contains Vizy's Formatting, Table and Alignment dropdowns. [Custom Toolbar Dropdowns](docs:developers/custom-toolbar-dropdowns) explains the dropdown format and how to place one.

```php
use verbb\vizy\events\RegisterToolbarDropdownsEvent;
use verbb\vizy\services\Extensions;
use yii\base\Event;

Event::on(Extensions::class, Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS, function(RegisterToolbarDropdownsEvent $event) {
    $event->dropdowns[] = ['name' => 'myMenu', 'label' => 'My menu', 'icon' => 'ellipsis', 'members' => ['bold', 'italic']];
});
```

## Rendering Events

Vizy’s rendering events change the HTML produced by existing nodes and marks without rebuilding the document in Twig. Continue using `{{ entry.vizyField.render() }}` and Block Type templates for ordinary frontend output, and register these listeners in a module or plugin when the generated HTML itself needs to change.

`VizyDocument::render()` asks each node and mark class for its tag structure and resolved attributes. The modify events fire on those classes for every HTML-emitting occurrence, including layout wrappers, images and simple tags. They also apply to GraphQL `renderedHtml` and node `html`.

Listen on a concrete class such as `Bold::class` when the change applies to one type. Listen on the base `Mark::class` or `Node::class` for a cross-cutting change. On the default render path, `$event->node` and `$event->mark` are null. Use `$event->typeId`, `$event->attrs` and `$event->context` instead. The context contains the field, owner and site.

### The `modifyTag` Event

The event that is triggered when Vizy resolves the HTML tags for a node or mark it's rendering. Marks and nodes both declare `EVENT_MODIFY_TAG`, with a `ModifyMarkTagEvent` for marks and a `ModifyNodeTagEvent` for nodes. Change `$event->tag` to change the tags or their attributes. The event fires once for the opening tags and once for the closing tags, so make the same change in both cases unless you check `$event->opening` or `$event->closing`.

Tag events belong to the PHP rendering path. They don't run for a type whose Twig template replaces its tag structure, as described in [Node and Mark Templates](docs:template-guides/node-and-mark-templates).

#### Mark Tags

This example adds a class to Bold text:

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

#### Node Tags

On a node, `tag` is a list because some nodes emit more than one HTML tag. Code Block, for example, uses both `<pre>` and `<code>`.

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

The event that is triggered after a node’s complete HTML has been generated. Change `$event->renderedNode` to replace that HTML. This is useful for self-closing or fully custom nodes where changing the tag structure is not enough. Unlike the tag events, it also runs for nodes rendered by a Twig template.

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

#### Customising Media Embed Output

Media Embed does not look for a Twig template. To adjust its frontend output, listen for the same event on the `MediaEmbed` node. Put these imports at the top of your module file and register the listener in its `init()` method:

```php
use craft\helpers\Html;
use verbb\vizy\events\ModifyRenderedNodeEvent;
use verbb\vizy\nodes\MediaEmbed;
use yii\base\Event;

Event::on(MediaEmbed::class, MediaEmbed::EVENT_MODIFY_RENDERED_NODE, function(ModifyRenderedNodeEvent $event) {
    if ($event->context?->field?->handle !== 'articleBody') {
        return;
    }

    $event->renderedNode = Html::tag(
        'div',
        $event->renderedNode,
        ['class' => 'article-media'],
    );
});
```

This wraps each Media Embed rendered from the `articleBody` field in `<div class="article-media">`. The listener affects frontend rendering and GraphQL `renderedHtml`. It does not change which providers receive a player in the control-panel editor. [Editor Capabilities](docs:feature-tour/editor-capabilities#media-embeds) describes the supported providers and fallback behaviour.

## Link Events

### The `registerLinkOptions` Event

The event that is triggered when Vizy builds the element types an editor can link to from a Vizy field. `$event->linkOptions` contains Vizy's entry, asset and category options, each an array with an `optionTitle`, an `elementType`, a `refHandle`, and the `sources` and `criteria` used by the element selector. The options are built for the element being edited, based on the field's settings.

A listener can remove or reorder these options, rename them through `optionTitle`, or narrow the elements an editor can choose by changing `sources` or `criteria`. Links can only target entries, assets and categories, so an option for another element type doesn't produce a link. The listener receives events for every Vizy field, so read the field from `$event->sender` to limit a change to one field.

```php
use craft\elements\Entry;
use verbb\vizy\events\RegisterLinkOptionsEvent;
use verbb\vizy\fields\VizyField;
use yii\base\Event;

Event::on(VizyField::class, VizyField::EVENT_REGISTER_LINK_OPTIONS, function(RegisterLinkOptionsEvent $event) {
    if ($event->sender->handle !== 'articleBody') {
        return;
    }

    // Only allow links to entries
    $event->linkOptions = array_values(array_filter(
        $event->linkOptions,
        fn(array $option) => $option['elementType'] === Entry::class,
    ));
});
```

### The `registerAttributes` Event

The event that is triggered when Vizy collects the extra options shown in the Link dialog. Each attribute you add to `$event->attributes` becomes a checkbox editors can switch on for a link. [Custom Link Attributes](docs:developers/custom-link-attributes) explains the attribute format and how it affects the rendered link.

```php
use verbb\vizy\events\RegisterLinkAttributesEvent;
use verbb\vizy\marks\Link;
use yii\base\Event;

Event::on(Link::class, Link::EVENT_REGISTER_ATTRIBUTES, function(RegisterLinkAttributesEvent $event) {
    $event->attributes[] = ['name' => 'sponsored', 'label' => 'Sponsored link', 'htmlAttribute' => 'rel', 'htmlValue' => 'sponsored'];
});
```

## Block Summary Events

### The `registerBlockSummaryProviders` Event

The event that is triggered when Vizy's block summaries service collects the providers that can build a block's summary title, subtitle and media. Add a provider to `$event->providers`, keyed by its handle, with a `callable` entry. A Block Type uses the provider when the `summary` settings in its project config set `provider` to that handle.

The callable receives a list of `VizyBlock` objects and a `BlockSummaryContext`, and returns an array keyed by block UID. Each value can set a `title`, a `subtitle`, and `media` with a `kind`, `reference`, `alt` and `thumbnailUrl`. Vizy keeps its own summary for any block the provider doesn't return, and ignores the provider entirely when it throws an exception. Providers apply to summaries returned by `Vizy::$plugin->getBlockSummaries()->getSummary()` and `getSummaries()`. The block headers in the editor build their summaries in the browser and don't use them.

```php
use verbb\vizy\events\RegisterBlockSummaryProvidersEvent;
use verbb\vizy\models\BlockSummaryContext;
use verbb\vizy\services\BlockSummaries;
use yii\base\Event;

Event::on(BlockSummaries::class, BlockSummaries::EVENT_REGISTER_PROVIDERS, function(RegisterBlockSummaryProvidersEvent $event) {
    $event->providers['eventDates'] = [
        'callable' => static function(array $blocks, BlockSummaryContext $context): array {
            $summaries = [];

            foreach ($blocks as $block) {
                $summaries[$block->uid()] = [
                    'subtitle' => 'Runs every Saturday',
                ];
            }

            return $summaries;
        },
    ];
});
```

## HTML Import Events

### The `registerRules` Event

The event that is triggered when the HTML importer starts converting HTML for a Vizy field. Add `HtmlImportRule` objects to `$event->rules` to map source HTML elements to your own nodes or marks. `$event->field` is the destination field. [Custom HTML Import Rules](docs:developers/custom-html-import-rules) explains how to create a rule.

```php
use verbb\vizy\events\RegisterHtmlImportRulesEvent;
use verbb\vizy\importers\HtmlImportRule;
use verbb\vizy\services\HtmlImporter;
use yii\base\Event;

Event::on(HtmlImporter::class, HtmlImporter::EVENT_REGISTER_RULES, function(RegisterHtmlImportRulesEvent $event) {
    $event->rules[] = HtmlImportRule::mark(['abbr'], 'abbr');
});
```

## Field Classification Events

### The `classifyField` Event

The event that is triggered after Vizy decides how a Craft field placed in a Block Type's layout stores its value. Most fields, including third-party fields, store their value in the Vizy document. Fields that own nested elements, such as Super Table or Neo, can't be stored that way and are marked as migration only, so they can't be added to new Block Types.

Set `$event->capability` and `$event->reason` to override the decision for a field class. The capability is one of the `FieldLifecycle` constants, `PURE` for a value stored in the document, `ASSETS`, `HOSTED_VIZY`, `MATRIX_ANCHOR`, `MIGRATION_ONLY` or `UNSUPPORTED`. Use this for a custom field that owns nested elements in a way Vizy doesn't detect, rather than to enable an ordinary value field.

```php
use acme\fields\SlideDeck;
use verbb\vizy\events\ClassifyFieldEvent;
use verbb\vizy\services\FieldLifecycle;
use yii\base\Event;

Event::on(FieldLifecycle::class, FieldLifecycle::EVENT_CLASSIFY_FIELD, function(ClassifyFieldEvent $event) {
    if ($event->field instanceof SlideDeck) {
        $event->capability = FieldLifecycle::MIGRATION_ONLY;
        $event->reason = 'persistedNestedOwner';
    }
});
```
