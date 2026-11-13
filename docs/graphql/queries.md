# Queries

Vizy is a field type, so it doesn't add GraphQL queries of its own. You request a Vizy field's content through Craft's own queries, such as `entries`, by selecting the field on the element type that holds it. Each Vizy field returns a document object named `{fieldHandle}_VizyDocument`, such as `vizyField_VizyDocument`, which can give you rendered HTML, the document's root nodes, its blocks or the raw stored JSON.

The examples on this page assume a `blog` section whose `blog` entry type has a Vizy field with the handle `vizyField`. Replace those handles, and the `blog_Entry` fragment, with the names from your own schema.

## Schema Access

Vizy has no schema component or permission of its own. A schema that can query an element can read the Vizy fields in that element's field layout. To read the example field, edit the schema in **GraphQL → Schemas** and enable the **Blog** section under **Entries**. Follow [Craft's GraphQL setup](https://craftcms.com/docs/5.x/development/graphql.html) to create an endpoint and choose a public schema or a token for a private schema.

Elements referenced inside a document follow the schema's own access. An image node's `asset` is only returned when the schema can query that asset's volume, and a link mark's `element` and `url` are only returned when the schema can query the linked entry's section, asset's volume or category's group, for the linked element's site. Disabled, unpublished and trashed elements resolve to `null`. Test in GraphiQL with the schema your frontend uses, because the full administrator schema can hide a missing grant.

## Data Access and Permissions

The document `raw` field, the node and mark `raw` and `attrs` fields, and the block `rawFieldValues` field return stored data without checking the permissions of individual fields embedded in a block. Access follows the enclosing Vizy field. Grant that access only to clients allowed to read the complete document. Choosing typed fields in one query doesn't stop an authorised client from requesting raw fields in another.

Use typed fields and rendered HTML for normal frontend output. Vizy's GraphQL support reads documents and has no mutations.

## Querying a Vizy Field

### Rendered HTML

Request `renderedHtml` when the frontend displays the document as it is. It uses the same renderer as `{{ entry.vizyField.render() }}` in Twig, so the [rendering events](docs:developers/events#rendering-events) and node templates apply to it as well.

```graphql
{
  entries(section: "blog", limit: 1) {
    title
    ... on blog_Entry {
      vizyField {
        schemaVersion
        renderedHtml
      }
    }
  }
}
```

```json
{
  "data": {
    "entries": [
      {
        "title": "Planting a Winter Garden",
        "vizyField": {
          "schemaVersion": 2,
          "renderedHtml": "<p>Read our <a href=\"https://example.com/guide\">guide</a></p>"
        }
      }
    ]
  }
}
```

### Raw Document JSON

`raw` returns the complete document as a JSON-encoded string. Decode it in your client, for example with `JSON.parse()` in JavaScript, before reading its properties.

```graphql
{
  entries(section: "blog", limit: 1) {
    ... on blog_Entry {
      vizyField {
        raw
      }
    }
  }
}
```

```json
{
  "data": {
    "entries": [
      {
        "vizyField": {
          "raw": "{\"type\":\"doc\",\"attrs\":{\"schemaVersion\":2},\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Read our guide\"}]}]}"
        }
      }
    ]
  }
}
```

### Root Nodes

`nodes` returns the document's root nodes in order, matching Twig's `entry.vizyField.query()`. By default it includes prose and enabled blocks. Use inline fragments to request fields that only some node types have. Built-in node types are named `Vizy` followed by the node type in Pascal case, such as `VizyParagraph`, `VizyHeading`, `VizyImage` and `VizyLayout`. Blocks use their generated Block Type name, described in [Interfaces and Types](docs:graphql/interfaces-types#block-types).

| Argument | Type | Description |
| --- | --- | --- |
| `where` | `ArrayType` | Conditions in the same shape as Twig `query().where()`. `{ enabled: false }` selects disabled blocks and `{ enabled: null }` selects both states. |
| `limit` | `Int` | The maximum number of nodes to return. |
| `orderBy` | `String` | A node property or block field handle, optionally followed by `ASC` or `DESC`, such as `"type DESC"`. |

[Querying Nodes](docs:template-guides/querying-nodes) explains the condition shapes, which are the same in Twig and GraphQL. Conditions are written as inline object and list literals, or passed as a variable.

```graphql
{
  entries(section: "blog", limit: 1) {
    ... on blog_Entry {
      vizyField {
        nodes(limit: 20) {
          type
          text
          ... on VizyHeading {
            attrs
          }
          ... on VizyImage {
            asset {
              id
              url
            }
          }
          ... on VizyLayout {
            stack
            columns {
              ... on VizyColumn {
                span
                proportion
                children {
                  type
                  html
                }
              }
            }
          }
          ... on VizyBlockInterface {
            uid
            blockTypeHandle
            enabled
          }
          ... on VizyUnknownNode {
            raw
          }
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "entries": [
      {
        "vizyField": {
          "nodes": [
            {
              "type": "heading",
              "text": "Before You Start",
              "attrs": "{\"level\":2}"
            },
            {
              "type": "paragraph",
              "text": "Choose a sunny spot with good drainage."
            },
            {
              "type": "image",
              "text": null,
              "asset": {
                "id": "42",
                "url": "https://example.com/uploads/garden-bed.jpg"
              }
            },
            {
              "type": "vizyBlock",
              "text": null,
              "uid": "4f0f7e2a-8c1d-4c55-9a4e-0b6f2d1c9e11",
              "blockTypeHandle": "callout",
              "enabled": true
            }
          ]
        }
      }
    ]
  }
}
```

A Vizy field nested inside a block returns its own document under that field's handle, with the same fields. The `children` of a block are always empty, so request nested content through the nested field.

### Filtering Nodes

Pass a `where` condition to narrow the root nodes. This query returns only callout blocks, including disabled ones:

```graphql
{
  entries(section: "blog", limit: 1) {
    ... on blog_Entry {
      vizyField {
        nodes(where: { type: "vizyBlock", handle: "callout", enabled: null }) {
          ... on VizyBlockInterface {
            uid
            enabled
          }
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "entries": [
      {
        "vizyField": {
          "nodes": [
            {
              "uid": "4f0f7e2a-8c1d-4c55-9a4e-0b6f2d1c9e11",
              "enabled": true
            },
            {
              "uid": "b1c2d3e4-5f60-4a7b-8c9d-0e1f2a3b4c5d",
              "enabled": false
            }
          ]
        }
      }
    ]
  }
}
```

You can pass the condition as a variable instead. Declare it with the `ArrayType` scalar:

```graphql
query BlogBlocks($where: ArrayType) {
  entries(section: "blog", limit: 1) {
    ... on blog_Entry {
      vizyField {
        nodes(where: $where) {
          type
        }
      }
    }
  }
}
```

```json
{
  "where": { "type": "vizyBlock", "handle": "callout" }
}
```

### Blocks

`blocks` returns every block in document order, including blocks inside layout columns. It doesn't include blocks from Vizy fields nested in a block, which you query through that nested field. It accepts the same `where`, `limit` and `orderBy` arguments as `nodes`, and returns objects implementing [`VizyBlockInterface`](docs:graphql/interfaces-types#the-vizyblockinterface-interface).

Request a block's custom fields with a fragment on its generated type. Replace `Callout_a1b2c3d4_VizyBlock` with the name from your schema, and `heading` with a field in the Block Type's layout.

```graphql
{
  entries(section: "blog", limit: 1) {
    ... on blog_Entry {
      vizyField {
        blocks(where: { handle: "callout" }) {
          uid
          blockTypeHandle
          ... on Callout_a1b2c3d4_VizyBlock {
            heading
          }
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "entries": [
      {
        "vizyField": {
          "blocks": [
            {
              "uid": "4f0f7e2a-8c1d-4c55-9a4e-0b6f2d1c9e11",
              "blockTypeHandle": "callout",
              "heading": "Check Your Frost Dates"
            }
          ]
        }
      }
    ]
  }
}
```

### A Single Block

`block` returns one block by its instance UID, or `null` when the document has no block with that UID. Its `uid` argument is required.

```graphql
{
  entries(section: "blog", limit: 1) {
    ... on blog_Entry {
      vizyField {
        block(uid: "4f0f7e2a-8c1d-4c55-9a4e-0b6f2d1c9e11") {
          blockTypeHandle
          enabled
          html
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "entries": [
      {
        "vizyField": {
          "block": {
            "blockTypeHandle": "callout",
            "enabled": true,
            "html": "<div class=\"callout\"><h3>Check Your Frost Dates</h3></div>"
          }
        }
      }
    ]
  }
}
```

### Links and Footnotes

Text nodes carry their formatting as `marks`. A link mark's concrete type, `VizyLink`, resolves its destination, which saves the frontend from looking up linked elements itself.

```graphql
{
  entries(section: "blog", limit: 1) {
    ... on blog_Entry {
      vizyField {
        nodes(where: { type: "paragraph" }) {
          children {
            text
            marks {
              type
              ... on VizyLink {
                url
                element {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "entries": [
      {
        "vizyField": {
          "nodes": [
            {
              "children": [
                {
                  "text": "Read our ",
                  "marks": []
                },
                {
                  "text": "guide",
                  "marks": [
                    {
                      "type": "link",
                      "url": "https://example.com/guides/winter-gardens",
                      "element": {
                        "id": "17",
                        "title": "Winter Gardens"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

Footnote references and definitions expose their `footnoteUid` and a `number` derived from the order of references, so moving a reference renumbers both the HTML and the GraphQL output. A reference also returns its paired `definition`.

```graphql
{
  entries(section: "blog", limit: 1) {
    ... on blog_Entry {
      vizyField {
        nodes(where: { type: "paragraph" }) {
          children {
            ... on VizyFootnoteReference {
              number
              definition {
                text
              }
            }
          }
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "entries": [
      {
        "vizyField": {
          "nodes": [
            {
              "children": [
                {},
                {
                  "number": 1,
                  "definition": {
                    "text": "Based on the Bureau of Meteorology's frost data."
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

For public image URLs, apply the transform the frontend needs instead of relying on the editor's preview transform. [Planning Vizy Content](docs:feature-tour/planning-vizy-content#treat-editor-previews-as-authoring-aids) explains the difference.
