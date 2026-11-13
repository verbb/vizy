# Interfaces & Types

A Vizy field's GraphQL value is a document object, which gives access to the document's nodes. Each node implements `VizyNodeInterface`, each block also implements `VizyBlockInterface`, and the formatting on text implements `VizyMarkInterface`. [Queries](docs:graphql/queries) shows how to request them through Craft's element queries.

In the types below, a `!` marks a value that is never null and square brackets mark a list.

## Document Types

### The `VizyDocument` Type

Each Vizy field returns its own document type, named after the field's handle, such as `vizyField_VizyDocument`. The type is generated per field so that its blocks only include the Block Types that field allows. Every document type has these fields.

::: reference
#### `schemaVersion`

**Type:** `Int!`

The version of the stored document format, currently `2`.
:::

::: reference
#### `nodes`

**Type:** `[VizyNodeInterface!]!`

The document's root nodes in order. Prose and enabled blocks are included by default. Accepts `where: ArrayType`, `limit: Int` and `orderBy: String`, described in [Root Nodes](docs:graphql/queries#root-nodes).

```graphql
vizyField {
  nodes(where: { enabled: null }, limit: 10) {
    type
    html
  }
}
```
:::

::: reference
#### `blocks`

**Type:** `[VizyBlockInterface!]!`

The document's blocks in order, including blocks inside layout columns. Blocks inside a nested Vizy field are queried through that field. Accepts the same `where`, `limit` and `orderBy` arguments as `nodes`.

```graphql
vizyField {
  blocks(where: { handle: "callout" }) {
    uid
    blockTypeHandle
  }
}
```
:::

::: reference
#### `block`

**Type:** `VizyBlockInterface`

The block with the instance UID passed as the required `uid: ID!` argument, or `null` when the document has no block with that UID.

```graphql
vizyField {
  block(uid: "4f0f7e2a-8c1d-4c55-9a4e-0b6f2d1c9e11") {
    blockTypeHandle
  }
}
```
:::

::: reference
#### `raw`

**Type:** `ArrayType!`

The complete stored document as a JSON-encoded string. Review [Data Access and Permissions](docs:graphql/queries#data-access-and-permissions) before exposing it.
:::

::: reference
#### `renderedHtml`

**Type:** `String!`

The document rendered as HTML, the same output as `{{ entry.vizyField.render() }}` in Twig.
:::

### The `ArrayType` Scalar

Vizy uses the `ArrayType` scalar for JSON-shaped values. As an argument, such as `where`, it accepts inline object and list literals, `null`, or a variable. As a returned value, such as `raw`, `attrs` or `rawFieldValues`, it's a JSON-encoded string with no nested selection, so decode it in your client before reading its properties.

## Node Types

### The `VizyNodeInterface` Interface

Every node implements this interface, including prose, layouts, blocks and nodes from extensions that aren't installed. Select these fields directly inside `nodes` or `children`.

::: reference
#### `type`

**Type:** `String!`

The node type, such as `paragraph`, `heading`, `image` or `vizyBlock`.
:::

::: reference
#### `attrs`

**Type:** `ArrayType`

The node's attributes as a JSON-encoded string, such as `{"level":2}` for a level 2 heading.
:::

::: reference
#### `marks`

**Type:** `[VizyMarkInterface!]!`

The formatting marks applied to the node. Marks are usually found on text nodes, the `children` of a paragraph or heading.
:::

::: reference
#### `children`

**Type:** `[VizyNodeInterface!]!`

The node's child nodes in order. Blocks always return an empty list, so query the content of a block's nested Vizy field through that field.

```graphql
nodes(where: { type: "bulletList" }) {
  children {
    text
  }
}
```
:::

::: reference
#### `text`

**Type:** `String`

The text of a text node, or the joined text of every descendant for a container such as a paragraph. Returns `null` when the node has no text, such as an image or a block.
:::

::: reference
#### `html`

**Type:** `String!`

The node rendered as HTML, using the same rules as the document's `renderedHtml`.
:::

::: reference
#### `raw`

**Type:** `ArrayType!`

The node's stored JSON as a JSON-encoded string.
:::

::: reference
#### `isUnknown`

**Type:** `Boolean!`

Whether the node's type has no installed extension, such as a node added by a plugin that has since been removed. These nodes use the `VizyUnknownNode` type.
:::

### Generated Node Types

Each node type registered with Vizy, including [custom nodes](docs:developers/custom-extensions), gets an object type named `Vizy` followed by its type in Pascal case. A `paragraph` node is `VizyParagraph`, a `bulletList` is `VizyBulletList` and a custom `emoji` node is `VizyEmoji`. Most node types have only the interface fields. The following types add their own.

### The `VizyImage` Type

::: reference
#### `asset`

**Type:** `AssetInterface`

The image's asset. Returns `null` when the asset doesn't exist or the schema can't query its volume.

```graphql
... on VizyImage {
  asset {
    url @transform(width: 1200)
    alt
  }
}
```
:::

### The `VizyLayout` Type

::: reference
#### `uid`

**Type:** `ID!`

The layout's UID.
:::

::: reference
#### `stack`

**Type:** `String!`

The setting for when the layout's columns should stack, `small` by default. Vizy outputs it as a `data-stack` attribute, and your stylesheet decides which breakpoint each value represents.
:::

::: reference
#### `columns`

**Type:** `[VizyNodeInterface!]!`

The layout's columns, each a `VizyColumn`.

```graphql
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
```
:::

### The `VizyColumn` Type

::: reference
#### `uid`

**Type:** `ID!`

The column's UID.
:::

::: reference
#### `span`

**Type:** `Int!`

The number of the layout's 12 grid columns this column spans.
:::

::: reference
#### `proportion`

**Type:** `String!`

The column's span divided by 12, as a decimal string such as `0.5` or `0.3333`. It's calculated from `span` rather than stored.
:::

### The `VizyFootnoteReference` and `VizyFootnoteItem` Types

::: reference
#### `footnoteUid`

**Type:** `ID!`

The UID that pairs a footnote reference with its definition.
:::

::: reference
#### `number`

**Type:** `Int`

The footnote's number, starting at 1 and calculated from the order of references in the document.
:::

::: reference
#### `definition`

**Type:** `VizyNodeInterface`

The paired footnote definition, a `VizyFootnoteItem`. Only `VizyFootnoteReference` has this field.
:::

## Block Types

### The `VizyBlockInterface` Interface

Every block implements this interface, which includes all the `VizyNodeInterface` fields as well as these.

::: reference
#### `uid`

**Type:** `ID!`

The block's instance UID, which you can pass to the document's `block` field.
:::

::: reference
#### `blockTypeUid`

**Type:** `ID!`

The UID of the block's Block Type.
:::

::: reference
#### `blockTypeHandle`

**Type:** `String`

The handle of the block's Block Type. Returns `null` when the Block Type can't be found.
:::

::: reference
#### `enabled`

**Type:** `Boolean!`

Whether the block is enabled.
:::

::: reference
#### `resolved`

**Type:** `Boolean!`

Whether the block's Block Type and its field layout can be found. An unresolved block uses the `VizyUnresolvedBlock` type, which has only the interface fields.
:::

::: reference
#### `rawFieldValues`

**Type:** `ArrayType!`

The block's stored field values as a JSON-encoded string, keyed by field placement UID, including the documents of nested Vizy fields. Review [Data Access and Permissions](docs:graphql/queries#data-access-and-permissions) before exposing it.
:::

### Generated Block Types

Each Block Type has its own object type, which adds the custom fields from the Block Type's field layout. The name is the Block Type's handle in Pascal case, followed by the first eight characters of its UID and `_VizyBlock`, such as `Callout_a1b2c3d4_VizyBlock`. Find the exact name in GraphiQL's schema explorer.

Custom fields return the same GraphQL types they do on an entry, so a relation field accepts the usual arguments and a nested Vizy field returns another document.

```graphql
blocks {
  ... on Callout_a1b2c3d4_VizyBlock {
    heading
    image {
      url
    }
    body {
      renderedHtml
    }
  }
}
```

## Mark Types

### The `VizyMarkInterface` Interface

Every formatting mark on a text node implements this interface.

::: reference
#### `type`

**Type:** `String!`

The mark type, such as `bold`, `italic` or `link`.
:::

::: reference
#### `attrs`

**Type:** `ArrayType`

The mark's attributes as a JSON-encoded string.
:::

::: reference
#### `raw`

**Type:** `ArrayType!`

The mark's stored JSON as a JSON-encoded string.
:::

::: reference
#### `isUnknown`

**Type:** `Boolean!`

Whether the mark's type has no installed extension. These marks use the `VizyUnknownMark` type.
:::

### Generated Mark Types

Each mark type gets an object type named `Vizy` followed by its type in Pascal case, such as `VizyBold` or `VizyTextStyle`. Only `VizyLink` adds its own fields.

### The `VizyLink` Type

::: reference
#### `element`

**Type:** `ElementInterface`

The linked entry, asset or category. Returns `null` for other link types, and when the element is unavailable or the schema can't query it.
:::

::: reference
#### `url`

**Type:** `String`

The link's URL. For an element link, this is the element's URL with any suffix added, and it's `null` when `element` would be `null`. For a URL, email, phone or SMS link, it's the same `href` Vizy renders in Twig.

```graphql
marks {
  ... on VizyLink {
    url
    element {
      title
    }
  }
}
```
:::
