# Block-Based Editor

Vizy stores your field’s content as structured JSON. This lets you render the whole field as HTML, select particular pieces, or give your frontend the document data to interpret. For example, you can display an article normally and also read its headings to build a contents list.

## Understanding a Document

A **document** contains a list of **nodes**, such as paragraphs, headings, and images. Nodes can contain other nodes: a paragraph contains text, while a list contains list items. A **mark** adds formatting or a link to part of the text.

Suppose an editor writes “Read our guide” and links “guide” to an external page. Its document has the following shape:

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

The paragraph keeps its text and link together. The link stores its destination as data; Vizy resolves that data into an HTML link when rendering. Saved nodes can also contain attributes for their other settings.

## Using the Structure

In an entry template, call `{{ entry.vizyField.render() }}`, replacing `vizyField` with your field’s handle—the name used to access the field in code. The example above produces a paragraph containing a link:

```html
<p>Read our <a href="https://example.com/guide">guide</a></p>
```

You can use [Querying Nodes](docs:template-guides/querying-nodes) to read particular root nodes, or [Modify Nodes](docs:template-guides/modify-nodes) to change the generated HTML. Structured Vizy blocks use [Block Type Templates](docs:template-guides/block-type-templates) to render their Craft fields.
