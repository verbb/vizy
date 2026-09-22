# Limitations

Some Vizy features work differently from independently saved Craft elements. Review these boundaries when planning relationships, imports, or a frontend that reads document data.

## Element Relationships

Vizy does not populate Craft’s relationship table for images and element links stored inside the document. A `relatedTo()` query therefore cannot find entries through those embedded references. Storing an Asset or Entry reference in a document is different from saving an ordinary relational field on a Craft element.

If your site needs reverse lookups—for example, finding every article that links to a particular entry—use a relational field on the owning entry for that relationship. To display a reference already inside Vizy, use automatic rendering or GraphQL’s image `asset` and link `element` fields. See [Rendering Content](docs:template-guides/rendering-content) and [GraphQL](docs:developers/graphql).

Custom fields inside Vizy blocks do not have an independently persisted block element as their owner. Integrations must not create relationship rows using a synthetic block ID or substitute the surrounding entry’s ID for an embedded field owner.

## GraphQL Data Access

GraphQL’s document `raw`, node and mark `raw` and `attrs`, and block `rawFieldValues` expose stored data without filtering it by individual embedded-field permissions. Access follows the enclosing Vizy field’s schema access. Only grant that access to clients allowed to read the complete document; choosing typed fields in one query does not prevent an authorised client from requesting raw fields in another.

Use typed fields and rendered HTML when building your frontend’s output. Registered custom nodes have generated types, such as `VizyEmoji` for an `emoji` node, with the common node interface fields. Nodes without an installed extension definition use the unknown-node fallback. GraphQL does not provide mutations. The [GraphQL guide](docs:developers/graphql) shows the supported queries.

## Image Transforms

The image transform controls configure editor previews. Do not rely on the preview choice as a durable transform setting for public image URLs. Apply your frontend’s required transform when rendering the Asset in your own template or querying it through GraphQL.

## Feed Me Imports

Feed Me can accept a Vizy document with `type: "doc"` and `attrs.schemaVersion`, or wrap a list of nodes as a document. Block content needs the destination’s Block Type identities and field placement keys; arbitrary JSON or a block’s display name is not enough to establish that structure.

Use a document from the destination configuration as the basis for block imports, and test the import on a copy of your content. Open the imported entry and check its fields and frontend output. For imports involving older Vizy block data, follow [Upgrading from v3](docs:get-started/upgrading-from-v3#known-limitations).

## Nested Fields

We recommend a Vizy field when a block needs nested rich text or blocks. The editor limits nesting depth; see [Nested Vizy](docs:feature-tour/nested-vizy). Matrix fields are also supported on Block Type layouts, but add storage and processing overhead, particularly with drafts, multiple sites, and deep nesting. [Matrix in Blocks](docs:feature-tour/matrix-in-blocks) explains these tradeoffs and when to use it.
