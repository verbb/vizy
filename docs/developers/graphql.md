# GraphQL
Vizy fields support being queried via GraphQL. To give you the utmost flexibility with rendering content, we provide the full, raw node structure for you to handle however you like.

Using `nodes` to query your data is the most common scenario.

## Nodes

### Example

:::code
```graphql GraphQL
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

```json JSON Response
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
:::

In the above example, we're using inline fragments to access the different types of nodes available. 

In addition, for a Vizy Block node, we define inline fragments for each block type handle. You'll have access to some attributes of a Vizy Block node, as well as any custom fields. The above example has `plainText` and `media` as a Plain Text field and Assets field respectively.

## The `VizyNodeInterface` interface
This is the interface implemented by all nodes.

| Field | Type | Description
| - | - | -
| `type`| `string` | The type of the node.
| `tagName`| `string` | The HTML tag name of the node.
| `attrs`| `json` | The attributes of the node.
| `marks`| `[VizyMarkInterface]` | The marks of the node.
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

## The `VizyImageNodeInterface` interface
This is the interface implemented by all image nodes.

| Field | Type | Description
| - | - | -
| `asset`| `AssetInterface` | Returns the asset element used for this image.

## The `VizyMarkInterface` interface
This is the interface implemented by all marks.

| Field | Type | Description
| - | - | -
| `type`| `string` | The type of the mark.
| `tagName`| `string` | The HTML tag name of the mark.
| `attrs`| `json` | The attributes of the mark.

Available mark type fragments are:

- `VizyMark_Bold`
- `VizyMark_Code`
- `VizyMark_Highlight`
- `VizyMark_Italic`
- `VizyMark_Link`
- `VizyMark_Strike`
- `VizyMark_Subscript`
- `VizyMark_Superscript`
- `VizyMark_Underline`

## The `VizyLinkMarkInterface` interface
This is the interface implemented by all link marks.

| Field | Type | Description
| - | - | -
| `element`| `ElementInterface` | Returns the element used for this link (if any).


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

:::code
```graphql GraphQL
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

```json JSON Response
{
  "vizyField": {
    "rawNodes": "[{\"type\":\"paragraph\",\"attrs\":{\"textAlign\":\"left\"},\"content\":[{\"type\":\"text\",\"text\":\"The name \"},{\"type\":\"text\",\"marks\":[{\"type\":\"link\",\"attrs\":{\"href\":\"https://en.wikipedia.org/wiki/Gin\",\"target\":\"_blank\"}}],\"text\":\"gin\"},{\"type\":\"text\",\"text\":\" is a \"},{\"type\":\"text\",\"marks\":[{\"type\":\"bold\"}],\"text\":\"shortened\"},{\"type\":\"text\",\"text\":\" form of the \"},{\"type\":\"text\",\"marks\":[{\"type\":\"italic\"}],\"text\":\"older\"},{\"type\":\"text\",\"text\":\" English word genever.\"}]}]"
  }
}
```
:::

Or, you can use `renderHtml` to return the generated HTML, as determined by Craft.

:::code
```graphql GraphQL
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

```json JSON Response
{
  "vizyField": {
    "renderHtml": "<p class=\"text-left\">The name <a href=\"https://en.wikipedia.org/wiki/Gin\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">gin</a> is a <strong>shortened</strong> form of the <em>older</em> English word genever.</p>"
  }
}
```
:::

## The `nodes` query
This query is used to query for nodes, similar to how we would normally [query nodes](docs:template-guides/querying-nodes#querying-nodes).

| Argument | Type | Description
| - | - | -
| `where`| `string` | Used to filter items based on params. This should be a JSON-encoded string.
| `limit`| `int` | Limit the number of nodes returned.
| `orderBy`| `string` | Return nodes ordered by a property.

### Where
Return all paragraph nodes, and no other node types. See [query nodes](docs:template-guides/querying-nodes#querying-nodes) for more examples of how to query. This must be a JSON-encoded string.

```graphql
nodes(where: "{ \"type\": \"paragraph\" }") {
    
}
```

### Limit
Return the first 2 nodes.

```graphql
nodes(limit: 2) {
    
}
```

### Order By
Return all nodes ordered by their type.

```graphql
nodes(orderBy: 'type DESC') {
    
}
```
