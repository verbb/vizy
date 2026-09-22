# Planning Vizy Content

Vizy works best when each piece of content is stored according to how it will be edited, queried, and displayed. Rich text, Vizy blocks, nested fields, and Matrix can appear in the same document, but they do not all behave like independently saved Craft elements.

Review these considerations while designing a field rather than after templates and integrations depend on its structure.

## Plan Relationships and Reverse Queries

Images and element links inside Vizy are stored as part of the document. Vizy resolves them when rendering or reading the content, but it does not populate Craft’s relationship table for those references. A `relatedTo()` query therefore cannot find entries through an image or link embedded directly in Vizy.

If the site needs a reverse lookup—for example, finding every article associated with a particular product—store that relationship in an ordinary relational field on the owning entry. Use Vizy for references that only need to be displayed as part of the document.

Custom fields inside Vizy blocks also do not have an independently persisted block element as their owner. Integrations must not create relationship rows using a synthetic block ID or substitute the surrounding entry’s ID for the embedded field owner. Developers migrating those values can use the [Embedded Content](docs:developers/embedded-content) API.

## Choose a Nesting Model Deliberately

A nested Vizy field keeps content within its parent block, while Matrix creates separate Craft entries. The right choice depends on whether those inner items need element identities and queries. [Nested Content](docs:feature-tour/nested-content) compares the two models and explains their editing behaviour.

Keep the resulting control-panel experience in view. Even when a structure remains below Vizy’s five-level limit, several nested editors can make content harder to understand. Use ordinary entry fields or a separate section when content needs to be managed and reused independently.

## Prepare Imported Content

Feed Me can accept a complete Vizy document with `type: "doc"` and `attrs.schemaVersion`, or wrap a list of nodes as a document. Blocks need the destination project’s Block Type identities and field placement keys. A block’s display name or arbitrary JSON is not enough to establish that structure.

Use a document created by the destination configuration as the basis for an import involving blocks. Test with a copy of representative content, then open the imported entry and check both its fields and frontend output. Existing installations importing older block data should also follow [Upgrading from v3](docs:get-started/upgrading-from-v3#known-limitations).

## Treat Editor Previews as Authoring Aids

Image transforms selected in the Vizy field configure previews in the editor. They are not durable instructions for every public image URL. Apply the transform required by the site’s design when rendering or querying the Asset on the frontend.

Block preview images serve a similar editorial purpose. They help an editor recognise a Block Type but do not render the block or define its frontend presentation.

## Review Headless Access

GraphQL can expose rendered HTML, typed document content, and raw stored values. Raw document, node, mark, and block values follow access to the enclosing Vizy field rather than separate permissions for every embedded value. Grant schema access only to clients allowed to read the complete document. [GraphQL](docs:developers/graphql#data-access-and-permissions) explains the supported fields and access boundary.
