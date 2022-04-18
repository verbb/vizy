# GraphQL
Vizy fields support being queried via GraphQL. To give you the utmost flexibility with rendering content, we provide the full, raw node structure for you to handle however you like.

Using `nodes` to query your data is the most common scenario.

## Query
```json
{
  entries(section:"blog") {
    ... on vizy_blog_Entry {
      vizyField {
        nodes {
          ... on VizyNode_Paragraph {
            type
            html
          }
          
          ... on vizyField_mediaWithImage_BlockType {
            enabled
            collapsed
            blockTypeId
            blockTypeHandle
            
            plainText
            media {
              id
              title
              url
            }
          }
        }
      }
    }
  }
}
```

## Response
```json
{
  "data": {
    "entries": [
      {
        "vizyField": {
          "nodes": [
            {
              "type": "paragraph",
              "html": "<p>Wait until you get a load of this</p>"
            },
            {
              "enabled": true,
              "collapsed": false,
              "blockTypeId": "type-yHLnqH7UvJ",
              "blockTypeHandle": "mediaWithImage",
              "plainText": "Where summer happens yo.",
              "media": [
                {
                  "id": "251",
                  "title": "Chilling on the beach",
                  "url": "beach-chill.jpg"
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

In the above example, we're using inline fragments to access the different types of nodes available. 

In addition, for a Vizy Block node, we define inline fragments for each block type handle. You'll have access to some attributes of a Vizy Block node, as well as any custom fields. The above example has `plainText` and `media` as a Plain Text field and Assets field respectively.

## The `VizyNodeInterface` interface
This is the interface implemented by all nodes.

| Field | Type | Description
| - | - | -
| `type`| `string` | The type of the node.
| `tagName`| `string` | The HTML tag name of the node.
| `attrs`| `json` | The attributes of the node.
| `marks`| `json` | The marks of the node.
| `content`| `json` | The content of the node as structured node JSON, including nested marks and text content.
| `html`| `string` | The content of the node as rendered HTML.
| `text`| `string` | The inner text of the node, if applicable.
| `rawNode`| `json` | The raw JSON structure for the node, as stored in the database.

Available node type fragments are:

- `VizyNode_Blockquote`
- `VizyNode_BulletList`
- `VizyNode_CodeBlock`
- `VizyNode_HardBreak`
- `VizyNode_Heading`
- `VizyNode_HorizontalRule`
- `VizyNode_Iframe`
- `VizyNode_Image`
- `VizyNode_ListItem`
- `VizyNode_OrderedList`
- `VizyNode_Paragraph`

## The `VizyBlockInterface` interface
This is the interface implemented by all Vizy Block nodes.

| Field | Type | Description
| - | - | -
| `type`| `string` | The type of the node.
| `tagName`| `string` | The HTML tag name of the node.
| `attrs`| `array` | The attributes of the node.
| `marks`| `array` | The marks of the node.
| `content`| `string` | The content of the node.
| `enabled`| `boolean` | Whether the block is enabled.
| `collapsed`| `boolean` | Whether the block is collapsed.
| `blockTypeId`| `string` | The ID of the block type.
| `blockTypeHandle`| `string` | The handle of the block type.

You can use the `rawNodes` to return the entire node structure as a JSON string.

## Query
```json
{
  entries(section:"blog") {
    ... on vizy_blog_Entry {
      vizyField {
        rawNodes
      }
    }
  }
}
```

## Response
```json
{
  "vizyField": {
    "rawNodes": "[{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"left\"},\"content\":[{\"type\":\"text\",\"text\":\"The name \"},{\"type\":\"text\",\"marks\":[{\"type\":\"link\",\"attrs\":{\"href\":\"https://en.wikipedia.org/wiki/Gin\",\"target\":\"_blank\"}}],\"text\":\"gin\"},{\"type\":\"text\",\"text\":\" is a \"},{\"type\":\"text\",\"marks\":[{\"type\":\"bold\"}],\"text\":\"shortened\"},{\"type\":\"text\",\"text\":\" form of the \"},{\"type\":\"text\",\"marks\":[{\"type\":\"italic\"}],\"text\":\"older\"},{\"type\":\"text\",\"text\":\" English word genever.\"}]}]"
  }
}
```

Or, you can use `renderHtml` to return the generated HTML, as determined by Craft.

## Query
```json
{
  entries(section:"blog") {
    ... on vizy_blog_Entry {
      vizyField {
        renderHtml
      }
    }
  }
}
```

## Response
```json
{
  "vizyField": {
    "renderHtml": "<p class=\"text-left\">The name <a href=\"https://en.wikipedia.org/wiki/Gin\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">gin</a> is a <strong>shortened</strong> form of the <em>older</em> English word genever.</p>"
  }
}
```

## The `nodes` query
This query is used to query for nodes, similar to how we would normally [query nodes](docs:template-guides/querying-nodes#querying-nodes).

| Argument | Type | Description
| - | - | -
| `where`| `string` | Used to filter items based on params. This should be a JSON-encoded string.
| `limit`| `int` | Limit the number of nodes returned.
| `orderBy`| `string` | Return nodes ordered by a property.

### Where
Return all paragraph nodes, and no other node types. See [query nodes](docs:template-guides/querying-nodes#querying-nodes) for more examples of how to query. This must be a JSON-encoded string.

```json
nodes(where: "{ \"type\": \"paragraph\" }") {
    
}
```

### Limit
Return the first 2 nodes.

```json
nodes(limit: 2) {
    
}
```

### Order By
Return all nodes ordered by their type.

```json
nodes(orderBy: 'type DESC') {
    
}
```
