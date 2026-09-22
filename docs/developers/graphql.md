# GraphQL

Use GraphQL to read Vizy content in a frontend that fetches data from Craft. Each Vizy field exposes a document object type named `{fieldHandle}_VizyDocument`, such as `vizyField_VizyDocument`. You can request rendered HTML for display, or query individual nodes and block fields when your frontend needs to build its own output.

The examples below assume your schema permits access to entries in a `blog` section with a Vizy field named `vizyField`. Replace those handles and the entry type fragment with the names in your GraphQL schema.

## Data Access and Permissions

GraphQL’s document `raw`, node and mark `raw` and `attrs`, and block `rawFieldValues` expose stored data without filtering it by individual embedded-field permissions. Access follows the enclosing Vizy field’s schema access. Grant that access only to clients allowed to read the complete document; choosing typed fields in one query does not prevent an authorised client from requesting raw fields in another.

Use typed fields and rendered HTML for normal frontend output. Registered custom nodes have generated types, such as `VizyEmoji` for an `emoji` node, with the common node interface fields. Nodes without an installed extension definition use the unknown-node fallback. Vizy’s GraphQL API reads documents but does not provide mutations.

## Rendered HTML and JSON

Ask for HTML or the full JSON envelope when you do not need fragments:

:::code
```graphql GraphQL
{
  entries(section: "blog") {
    ... on blog_Entry {
      vizyField {
        schemaVersion
        renderedHtml
        raw
      }
    }
  }
}
```
```twig Twig
{# Prefer Twig render() when you control templates #}
{{ entry.vizyField.render() }}
```
:::

## Querying Individual Nodes

Walk ordered root nodes with inline fragments. Defaults match Twig `query()` — enabled Blocks plus prose. Use `where`, `limit`, and `orderBy` as described in [Querying Nodes](docs:template-guides/querying-nodes). Filters preserve the enabled default. Set `enabled: false` to request disabled blocks or `enabled: null` to include both states.

:::code
```graphql GraphQL
{
  entries(section: "blog") {
    ... on blog_Entry {
      vizyField {
        nodes(where: { enabled: true }, limit: 20) {
          type
          text
          html
          ... on VizyParagraph {
            text
          }
          ... on VizyHeading {
            attrs
            text
          }
          ... on VizyImage {
            asset { id url }
          }
          ... on VizyLayout {
            stack
            columns {
              ... on VizyColumn {
                span
                proportion
                children { type text }
              }
            }
          }
          ... on MediaWithImage_a1b2c3d4_VizyBlock {
            uid
            enabled
            blockTypeHandle
            plainText
            media { id url }
          }
          ... on VizyUnknownNode {
            type
            raw
          }
        }
      }
    }
  }
}
```
```twig Twig
{# Same filters in Twig #}
{% set nodes = entry.vizyField.query().andWhere({ enabled: true }).limit(20).all() %}
```
:::

Block Type object names follow `{Handle}_{shortUid}_VizyBlock`. Replace the illustrative `MediaWithImage_a1b2c3d4_VizyBlock` name with the generated type from your schema; its fields must also match your block layout. A Vizy field nested inside a block returns another `VizyDocument` under that field’s handle.

### Include Disabled Blocks

```graphql
nodes(where: { enabled: null }) { type ... on VizyBlockInterface { enabled uid } }
```

### Blocks in Document Order

```graphql
blocks(where: { handle: "textBlock", enabled: true }) {
  uid
  blockTypeHandle
  ... on TextBlock_a1b2c3d4_VizyBlock { plainText }
}
```

`block(uid:)` looks up one Block by canonical instance UID.

## Fields on `VizyDocument`

| Field | Type | Description |
| --- | --- | --- |
| `schemaVersion` | `Int!` | The canonical document schema version (`2`). |
| `nodes(where, limit, orderBy)` | `[VizyNodeInterface!]!` | Ordered root nodes, with enabled blocks and prose included by default. |
| `blocks(where, limit, orderBy)` | `[VizyBlockInterface!]!` | Blocks in the outer node tree, including layouts. Query nested Vizy fields separately. |
| `block(uid: ID!)` | `VizyBlockInterface` | One block by its canonical instance UID, or null when not found. |
| `raw` | `ArrayType!` | The full document as a JSON-encoded string. |
| `renderedHtml` | `String!` | Document HTML produced by the renderer. |

`nodes` and `blocks` accept `where: ArrayType`, `limit: Int`, and `orderBy: String`. `where` accepts inline JSON-shaped object and list literals. A `!` marks a non-null value; square brackets mark a list. `ArrayType` has no nested GraphQL selection. Its output is a JSON-encoded string: decode `raw`, `attrs`, and `rawFieldValues` values in your client before accessing their properties, for example with `JSON.parse()` in JavaScript.

For public image URLs, apply the transform required by the frontend rather than relying on the editor preview transform. [Planning Vizy Content](docs:feature-tour/planning-vizy-content#treat-editor-previews-as-authoring-aids) explains that distinction.

<span id="node-interface"></span>

## The `VizyNodeInterface` Interface

Every prose, layout, block, and unknown node implements this interface. Select these fields directly inside `nodes` or `children`:

| Field | Type | Description |
| --- | --- | --- |
| `type` | `String!` | The TipTap node type name. |
| `attrs` | `ArrayType` | Node attributes as a JSON-encoded string. |
| `marks` | `[VizyMarkInterface!]!` | Formatting marks applied to the node, usually a text node. |
| `children` | `[VizyNodeInterface!]!` | Ordered child nodes. Blocks return an empty list; query their nested Vizy fields separately. |
| `text` | `String` | Text content, or concatenated descendant text for containers. |
| `html` | `String!` | Rendered HTML for this node. |
| `raw` | `ArrayType!` | The node’s canonical TipTap JSON. |
| `isUnknown` | `Boolean!` | Whether the node type has no installed extension definition. |

`html` uses the same rendering rules as document `renderedHtml`. Review [Data Access and Permissions](#data-access-and-permissions) before exposing raw content or rendered HTML.

## The `VizyMarkInterface` Interface

Every formatting mark implements this interface:

| Field | Type | Description |
| --- | --- | --- |
| `type` | `String!` | The TipTap mark type name. |
| `attrs` | `ArrayType` | Mark attributes as a JSON-encoded string. |
| `raw` | `ArrayType!` | The mark’s canonical JSON. |
| `isUnknown` | `Boolean!` | Whether the mark type has no installed extension definition. |

Link marks additionally expose `element: ElementInterface` and `url: String` on their concrete type. Request these through a fragment on `VizyLink`. The linked element can be null when it is unavailable or outside the active schema’s access.

## The `VizyBlockInterface` Interface

Blocks expose all fields from `VizyNodeInterface`, plus these block-specific fields:

| Field | Type | Description |
| --- | --- | --- |
| `uid` | `ID!` | The canonical block instance UID. |
| `blockTypeUid` | `ID!` | The canonical Block Type UID. |
| `blockTypeHandle` | `String` | The current Block Type handle, when resolved. |
| `enabled` | `Boolean!` | Whether the block is enabled. |
| `resolved` | `Boolean!` | Whether the Block Type and field layout can be resolved. |
| `rawFieldValues` | `ArrayType!` | Raw field values keyed by placement UID, including nested Vizy envelopes. |

Use a fragment on the generated `{Handle}_{shortUid}_VizyBlock` type for custom Craft fields, as shown in [Querying Individual Nodes](#querying-individual-nodes). Those fields depend on the block layout and the active schema. [Data Access and Permissions](#data-access-and-permissions) explains the raw-data boundary and unsupported write operations.
