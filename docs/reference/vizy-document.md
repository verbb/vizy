# Vizy Document

Reading a Vizy field in Twig returns a **`VizyDocument`**, which represents that field’s saved content. It provides methods for rendering HTML, checking whether content exists, and reading individual nodes or blocks.

## Understanding a Document

Vizy stores a document as structured JSON. Its `content` list contains nodes such as paragraphs, headings, images, layouts, and Vizy blocks. Nodes can contain other nodes: a paragraph contains text, while a list contains list items. Marks add formatting or links to part of a text node.

For example, the text “Read our guide” with a link on the final word has this document shape:

```json
{
    "type": "doc",
    "attrs": { "schemaVersion": 2 },
    "content": [
        {
            "type": "paragraph",
            "content": [
                { "type": "text", "text": "Read our " },
                {
                    "type": "text",
                    "text": "guide",
                    "marks": [
                        {
                            "type": "link",
                            "attrs": {
                                "type": "url",
                                "value": "https://example.com/guide",
                                "newWindow": false
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```

The document retains the paragraph, text, and semantic link destination without storing finished frontend markup. Rendering resolves that structure into HTML, while queries let templates work with selected root nodes.

## Rendering a Field

In an entry template, replace `vizyField` with your Vizy field’s handle:

```twig
{% if not entry.vizyField.isEmpty() %}
    {{ entry.vizyField.render() }}
{% endif %}
```

This renders the document when it contains content. Vizy blocks need a Block Type template to appear in automatic HTML; see [Rendering Content](docs:template-guides/rendering-content).

## Reading Individual Pieces

Use `query()` to select nodes by type or other criteria. For example, the following reads paragraph nodes from the field:

```twig
{% set paragraphs = entry.vizyField.query()
    .where({ type: 'paragraph' })
    .all() %}
```

Use `blocks()` for enabled Vizy blocks, `blocks(false)` for disabled blocks, or `blocks(null)` for both states. These reads include blocks inside layouts. `findBlock(uid)` finds a block by identity regardless of its enabled state. [Querying Nodes](docs:template-guides/querying-nodes) covers filters, ordering, and limits.

For a content fragment, `content().blocks(recursive, enabled)` keeps the recursion choice separate: `content().blocks(false)` reads enabled root blocks, while `content().blocks(false, null)` reads root blocks in either state. The default recursive read includes layout columns but does not enter fields nested inside blocks.

## Inspecting Stored Data

`content().nodes()` reads the root nodes as arrays, while `traverse()` follows node children, including layouts, but does not enter fields nested inside blocks. Use `toArray()` to inspect the complete document in a development template:

```twig
{{ dump(entry.vizyField.toArray()) }}
```

This exposes stored data rather than rendered HTML. For changes to embedded custom fields from a module or migration, see [Embedded Content](docs:developers/embedded-content).

## Saving Content From PHP

To change a Vizy field’s content from a module or migration, read the complete document with `toArray()`, change the nodes you need, and set the whole document back on the element. The following example belongs in a module’s console action or a migration. It replaces “Colour” with “Color” in every text node of a News entry and leaves Vizy blocks unchanged. Replace `vizyField` with your Vizy field’s handle and `123` with an entry ID:

```php
use craft\elements\Entry;

$entry = Entry::find()->id(123)->status(null)->one();

// The complete document, including `type`, `attrs` and every block.
$document = $entry->getFieldValue('vizyField')->toArray();

$updateText = function(array $nodes) use (&$updateText): array {
    foreach ($nodes as &$node) {
        if ($node['type'] === 'text') {
            $node['text'] = str_replace('Colour', 'Color', $node['text']);
        } elseif ($node['type'] !== 'vizyBlock' && isset($node['content'])) {
            // Paragraphs, lists, tables and layouts hold their children in `content`.
            $node['content'] = $updateText($node['content']);
        }
    }

    return $nodes;
};

$document['content'] = $updateText($document['content']);

$entry->setFieldValue('vizyField', $document);
Craft::$app->getElements()->saveElement($entry);
```

The entry saves through Craft as it would from the control panel, so the field is validated and the change propagates to other sites according to the field’s translation method.

Always set the complete `doc`, including its `type` and `attrs`. Vizy reads a bare list of nodes, such as the result of `content().toArray()` or `content().nodes()`, as content saved by Vizy 3. On a field that wasn’t upgraded from Vizy 3, saving one fails. On an upgraded field, Vizy converts it the way the upgrade does, so an image that doesn’t reference an asset becomes unsupported content and Vizy 4 blocks can’t be converted.

Keep `vizyBlock` nodes intact as well. Their `fieldSlots` hold the values of the fields inside each block, which you can change with the [Embedded Content](docs:developers/embedded-content) API. Don’t rebuild a document by rendering it to HTML and parsing the result. HTML doesn’t carry block data, and images come back as URLs that no longer reference their assets. To bring in HTML from another source, see [Importing HTML](docs:developers/importing-html).
