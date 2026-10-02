# Importing with Feed Me

Feed Me can import an external article body into a Vizy field as HTML, plain text, or canonical Vizy JSON. This guide maps a feed’s `body` value into a Vizy field named **Article Body**, explains how the destination Editor Config affects the result, and shows how to identify content that could not be represented exactly.

You need Feed Me installed and a feed that creates or updates Craft elements containing a Vizy field. The example assumes the feed exposes a value named `body` and the Vizy field uses the `articleBody` handle.

## Choose the Source Format

Use HTML when the source contains ordinary rich text. Vizy converts the markup into its canonical document structure rather than storing the HTML directly. Plain text follows the same path and becomes paragraph content.

Use canonical JSON when the source already produces a complete Vizy document or needs Vizy Blocks. A complete document has a `doc` root and the current schema version:

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

Canonical JSON is installation-specific when it contains Block Type, field-placement, Entry, or Asset UIDs. Use identities from the destination project and do not copy structured documents between unrelated Craft installations without an explicit mapping step.

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

HTML conversion does not infer Vizy Blocks or populate the Craft fields inside them. Use canonical JSON with the destination project’s Block Type and placement identities when a feed intentionally supplies Blocks.

## Review Diagnostics

Run a small feed batch and open its Feed Me logs. Each lossy HTML decision includes a diagnostic code, source path, and explanation. For example:

```text
Vizy HTML import for articleBody reported disallowedHeading at /h1[1]: Heading level 1 is not enabled for the destination field; its text was kept as a paragraph.
```

Review the codes against the source and resulting entry. You can then adjust the source HTML, enable the corresponding capability in the Editor Config, or accept the documented fallback.

Turn on **Require lossless HTML** after the source converts without diagnostics. A row containing unsupported HTML then fails instead of saving the converted fallback. Existing content remains unchanged when the element save does not complete.

## Handle Images

Vizy image nodes reference Craft Assets by UID. Feed Me’s Vizy HTML mapping does not download an `<img>` source or infer which Asset it represents. An unresolved image produces an `unresolvedImage` diagnostic and retains its alternative text when available.

For an external image feed, import or match the Asset separately before building the Vizy value. You can then supply canonical JSON containing that Asset’s UID. A module that owns the Asset workflow can instead use the [programmatic HTML importer](docs:developers/importing-html#resolve-images) with an Asset resolver.

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
