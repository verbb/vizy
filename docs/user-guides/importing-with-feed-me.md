# Importing with Feed Me

Feed Me can import an external article body into a Vizy field as HTML, plain text, or canonical Vizy JSON. This guide maps a feed’s `body` value into a Vizy field named **Article Body**, explains how the destination Editor Config affects the result, and shows how to identify content that could not be represented exactly.

You need Feed Me installed and a feed that creates or updates Craft elements containing a Vizy field. The example assumes the feed exposes a value named `body` and the Vizy field uses the `articleBody` handle.

## Choose the Source Format

Use HTML when the source contains ordinary rich text. Vizy converts the markup into its canonical document structure rather than storing the HTML directly. Plain text follows the same path and becomes paragraph content.

Use canonical JSON when the source already produces a complete Vizy document. You can also create Vizy Blocks from HTML with an explicit mapping, as described below. A complete document has a `doc` root and the current schema version:

```json
{
    "type": "doc",
    "attrs": {
        "schemaVersion": 2
    },
    "content": [
        {
            "type": "paragraph",
            "content": [
                {
                    "type": "text",
                    "text": "Imported article text"
                }
            ]
        }
    ]
}
```

Feed Me also accepts a JSON list containing the document’s root nodes. Vizy wraps the list in the current document envelope before validating it.

Canonical JSON is installation-specific when it contains Block Type, field-placement, Entry, or Asset UIDs. Use identities from the destination project and do not copy structured documents between unrelated Craft installations without an explicit mapping step. Feed Me’s HTML-to-Block controls store the destination identities for you.

## Map the Vizy Field

Open the Feed Me feed’s field-mapping step, find **Article Body**, and choose the feed node containing `body`. Save the mapping, then use Feed Me’s feed preview to confirm that the selected value contains the expected HTML or JSON.

Leave **Require lossless HTML** off for an initial import. Vizy keeps readable content where possible and records a diagnostic whenever markup cannot be represented. This lets you inspect real source data before deciding whether the feed should reject any imperfect row.

The setting applies to HTML and plain text. Canonical JSON follows the direct document path and must already contain valid Vizy structure.

## Understand the Editor Config

HTML conversion uses the destination Vizy field’s effective Editor Config. If the source contains an `<h1>` but the field only enables heading levels 2–4, Vizy keeps the heading text as a paragraph and reports `disallowedHeading`. A disabled underline mark is removed while its text remains.

The importer handles the core prose structures that Vizy can represent, including:

- Paragraphs and enabled heading levels.
- Bold, italic, underline, strike, code, highlight, subscript, and superscript marks when enabled.
- Links with safe destinations and the options enabled on the field.
- Ordered and unordered lists.
- Blockquotes, preformatted code, horizontal rules, and hard breaks.
- Tables and their rows, headers, cells, row spans, and column spans.

Unsupported elements, attributes, link targets, and formatting produce diagnostics. Semantic containers such as `<section>` are flattened, while readable descendant content is retained. Table captions are moved before the table because Vizy’s table schema does not contain a caption node.

Custom Vizy extensions can participate in Feed Me imports through the shared importer. The extension’s module must register a corresponding HTML import rule and enable its node or mark in the destination Editor Config. See [Register Custom Import Rules](docs:developers/importing-html#register-custom-import-rules) for the event and attribute-mapping example.

HTML conversion never infers a Vizy Block from its display name or handle. Configure an explicit HTML-to-Block mapping when a source element should become a Block, or use canonical JSON with the destination project’s Block Type and placement identities.

## Map HTML Elements to Vizy Blocks

Each Block Type enabled for the destination Vizy field appears under **HTML to Vizy Block mappings** in Feed Me. Turn on **Create this Block from matching HTML**, then enter the source HTML tag. For example, use `img` to turn source images into an Image Block.

You can narrow the match with an attribute and an optional exact value. A match attribute of `class` with a match value of `feature` accepts `<img class="feature">` but not a different class value. Leave the value empty to accept any element containing that attribute.

For every custom field placement in the Block Type, choose one value source:

- **HTML attribute** reads an attribute from the matched element. Use `src` for an image URL or `alt` for alternative text.
- **Text content** reads the element’s plain text.
- **Inner HTML** reads the markup inside the element.
- **Fixed value** supplies the same configured value for every matched element.
- **Do not populate** leaves that placement absent from the imported Block.

Vizy passes each extracted value through that field type’s Feed Me adapter. For an Assets field, choose whether the value is a filename or Asset ID. Turn on **Create Asset from URL** when the mapped HTML attribute contains a remote URL, then choose how Feed Me should handle an existing Asset.

The saved mapping is keyed by the Block Type UID and each field-placement UID, not mutable handles. Vizy rejects stale, unknown, disabled, or unavailable identities instead of choosing a similarly named Block Type. It also rejects selectors for the same tag when one source element could match more than one Block Type. Each matching source element becomes a new Block with its own identity, including an image placed directly between text in a paragraph.

## Review Diagnostics

Run a small feed batch and open its Feed Me logs. Each lossy HTML decision includes a diagnostic code, source path, and explanation. For example:

```text
Vizy HTML import for articleBody reported disallowedHeading at /h1[1]: Heading level 1 is not enabled for the destination field; its text was kept as a paragraph.
```

Review the codes against the source and resulting entry. You can then adjust the source HTML, enable the corresponding capability in the Editor Config, or accept the documented fallback.

Turn on **Require lossless HTML** after the source converts without diagnostics. A row containing unsupported HTML then fails instead of saving the converted fallback. Existing content remains unchanged when the element save does not complete.

## Handle Images

Vizy’s built-in image nodes reference Craft Assets by UID. Without an HTML-to-Block mapping, Feed Me does not download an `<img>` source or infer which Asset it represents. An unresolved image produces an `unresolvedImage` diagnostic and retains its alternative text when available.

To represent source images with a custom Block Type, map `img` to that Block and map its `src` attribute to the Block’s Assets field. Feed Me can match an existing Asset or create one from an absolute URL. To create built-in Vizy image nodes instead, import or match the Asset separately and supply canonical JSON containing its UID. A module that owns the Asset workflow can also use the [programmatic HTML importer](docs:developers/importing-html#resolve-images) with an Asset resolver.

Do not rely on `data-asset-uid` in source HTML. The importer treats source attributes as untrusted and only the programmatic resolver can establish an Asset identity during HTML conversion.

## Test the Import

Use a representative source value before processing the complete feed:

```html
<h2>Quarterly update</h2>
<p>Read the <strong>full report</strong>.</p>
<ul>
    <li>Revenue increased</li>
    <li>Two products launched</li>
</ul>
```

Run one feed item, open the resulting entry, and check that the heading, bold text, and list appear in **Article Body**. Save and reopen the entry to confirm that the imported document remains valid. Finally, inspect the Feed Me logs; a lossless result produces no Vizy HTML diagnostics.

If strict mode rejects the row, turn it off temporarily and rerun that one item. The diagnostic log identifies the exact source path and fallback, which is usually more useful than changing the field configuration without seeing the conversion result.
