# Importing HTML

Use Vizy’s HTML importer when a module, migration, or integration needs to convert external HTML into a canonical `VizyDocument`. The conversion is read-only: it returns a document for your code to inspect and persist explicitly.

The importer evaluates the destination field’s effective Editor Config. It keeps supported structure and formatting, reports anything it cannot represent, and never treats rendered Vizy HTML as a guaranteed round-trip format. Use `VizyDocument::toJson()` when you need to preserve an existing complete Vizy document.

## Convert HTML

Pass the source HTML and destination Vizy field to the importer:

```php
use verbb\vizy\Vizy;

$field = Craft::$app->getFields()->getFieldByHandle('articleBody');

if (!$field instanceof \verbb\vizy\fields\VizyField) {
    throw new RuntimeException('The destination Vizy field was not found.');
}

$result = Vizy::$plugin->getHtmlImporter()->convert($html, $field);
$document = $result->document();
```

The document is canonical and validated against the destination field before it is returned. The importer currently handles paragraphs, headings, blockquotes, preformatted text, ordered and unordered lists, horizontal rules, tables, hard breaks, links, images, and the core inline marks enabled by the field.

Default conversion does not create Vizy Blocks or infer mappings for their custom fields. A Blocks-only destination returns an empty document with a diagnostic unless the caller supplies an explicit rule that creates canonical `vizyBlock` nodes. Feed Me’s HTML-to-Block mapping builds those request-local rules from destination UIDs.

## Inspect Conversion Loss

Call `isLossless()` before persisting the result. `diagnostics()` returns every detected lossy boundary, including the source path and structured details:

```php
if (!$result->isLossless()) {
    foreach ($result->diagnostics() as $diagnostic) {
        Craft::warning([
            'code' => $diagnostic->code,
            'message' => $diagnostic->message,
            'path' => $diagnostic->path,
            'details' => $diagnostic->details,
        ], 'html-import');
    }
}
```

Readable text is retained where possible when an element or mark is unsupported. Attributes, unsafe links, unresolved images, disabled nodes and disabled marks are reported instead of being silently discarded.

Use strict mode when any loss must stop the operation:

```php
use verbb\vizy\importers\HtmlImportException;
use verbb\vizy\importers\HtmlImportOptions;

try {
    $result = Vizy::$plugin->getHtmlImporter()->convert(
        $html,
        $field,
        new HtmlImportOptions(strict: true),
    );
} catch (HtmlImportException $exception) {
    $result = $exception->result();
    // Report $result->diagnostics() and leave the existing value unchanged.
}
```

Strict mode still performs the complete conversion so the exception can expose the full diagnostic result.

## Resolve Images

Vizy image nodes store a Craft Asset UID, not a remote source URL. Supply an asset resolver when the source contains images. The resolver receives the source URL, its `DOMElement`, and the destination field, and returns an existing Craft Asset UID or `null`:

```php
use verbb\vizy\importers\HtmlImportOptions;

$options = new HtmlImportOptions(
    assetResolver: static function(string $src, \DOMElement $element, \verbb\vizy\fields\VizyField $field): ?string {
        $asset = findImportedAsset($src);
        return $asset?->uid;
    },
);

$result = Vizy::$plugin->getHtmlImporter()->convert($html, $field, $options);
```

The caller owns downloads, Asset creation, deduplication and permission decisions. If an image cannot be resolved, the importer reports it and retains its alternative text where possible. It never persists the source URL as an image identity.

## Register Custom Import Rules

The importer converts standard HTML elements on its own. To import markup for one of your own nodes or marks, such as `<abbr>` for an Abbreviation mark, register an HTML import rule. [Custom HTML Import Rules](docs:developers/custom-html-import-rules) explains how to create and register one.

## Bound Untrusted Input

The default conversion limits are 1 MB of HTML, 10,000 parsed nodes, and 64 levels of nesting. Override them per call when a trusted import needs different bounds:

```php
$options = new HtmlImportOptions(
    maxHtmlBytes: 2_000_000,
    maxNodes: 20_000,
    maxDepth: 80,
);
```

Exceeding a bound throws an exception before a document is returned. Keep these limits finite for feeds and other externally supplied content.

Feed Me uses this same importer for mapped HTML and exposes strict conversion and explicit Vizy Block mappings in its field mapping. [Importing with Feed Me](docs:user-guides/importing-with-feed-me) covers source formats, diagnostics, images, Blocks, and testing a feed. The recoverable Redactor or CKEditor field-migration workflow remains a separate integration. The base API does not save elements, change Project Config, or migrate existing content.
