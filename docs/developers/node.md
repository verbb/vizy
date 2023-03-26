# Node
A Node object represents a singular "chunk" of content within the context of a Vizy field. Each node has a type, attributes and different logic on how it should be rendered. Some nodes have block content, whilst others have no content.

Each Node shares the following attributes and methods.

## Attributes

Attribute | Description
--- | ---
`type` | Returns the type of node this is.
`tagName` | Returns name for the HTML tag the node should use.
`attrs` | Returns an array of node attributes. This will vary for each node type.
`content` | Returns an array of nested [Node](docs:developers/node) objects.
`marks` | Returns an array of nested [Mark](docs:developers/mark) objects.
`text` | Returns any body text for this node.

## Methods

Method | Description
--- | ---
`selfClosing()` | Whether this node has a self-closing tag.
`isDeleted()` | Whether this node has been deleted. Only applicable to Vizy Blocks.
`isEmpty()` | Whether the node is considered empty of content.
`getTag()` | Returns the HTML tag name and attributes the node should use for the HTML tag.
`getField()` | Returns the Vizy field model.
`getType()` | Returns the type of node this is.
`getMarks()` | Returns an array of nested [Mark](docs:developers/mark) objects.
`getAttrs()` | Returns any attributes stored against the node.
`getContent()` | Returns an array of nested [Node](docs:developers/node) objects.
`getText()` | Returns any body text for this node.
`renderNode()` | Renders the node using in-built defaults.
`renderHtml()` | Returns the result from `renderNode()` in raw HTML.
`renderOpeningTag()` | Renders the opening tag for the node.
`renderClosingTag()` | Renders the closing tag for the node.

## Node Types

### Blockquote

#### Properties

Property | Value
--- | ---
`type` | `blockquote`
`tagName` | `blockquote`


### Bullet List

#### Properties

Property | Value
--- | ---
`type` | `bulletList`
`tagName` | `ul`


### Code Block

#### Properties

Property | Value
--- | ---
`type` | `codeBlock`
`tagName` | `['pre', 'code']`


### Hard Break

#### Properties

Property | Value
--- | ---
`type` | `hardBreak`
`tagName` | `br`


### Heading

#### Properties

Property | Value
--- | ---
`type` | `heading`

#### Attributes
These can be accessed via `attrs`.

Attribute | Description
--- | ---
`level` | A numeric value for which level heading to use.


### Horizontal Rule

#### Properties

Property | Value
--- | ---
`type` | `horizontal_rule`
`tagName` | `hr`


### Iframe

#### Properties

Property | Value
--- | ---
`type` | `iframe`
`tagName` | `iframe`


### Image

#### Properties

Property | Value
--- | ---
`type` | `image`
`tagName` | `img`

#### Attributes
These can be accessed via `attrs`.

Attribute | Description
--- | ---
`src` | The URL to the path of the image.
`alt` | The alternative text for the image.
`title` | The title text for the image.
`url` | The URL for the optional link surrounding the image.
`target` | The target for the optional link surrounding the image.


### List Item

#### Properties

Property | Value
--- | ---
`type` | `listItem`
`tagName` | `li`


### Media Embed

#### Properties

Property | Value
--- | ---
`type` | `mediaEmbed`


### Ordered List

#### Properties

Property | Value
--- | ---
`type` | `orderedList`
`tagName` | `ol`


### Paragraph

#### Properties

Property | Value
--- | ---
`type` | `paragraph`
`tagName` | `p`


### Table

#### Properties

Property | Value
--- | ---
`type` | `table`
`tagName` | `table`


### Table Row

#### Properties

Property | Value
--- | ---
`type` | `tableRow`
`tagName` | `tr`


### Table Cell

#### Properties

Property | Value
--- | ---
`type` | `tableCell`
`tagName` | `td`


### Table Header

#### Properties

Property | Value
--- | ---
`type` | `tableHeader`
`tagName` | `th`


### Vizy Block
Due to Vizy Blocks being able to support custom fields, you can directly call a custom field's handle on a Vizy Block node object.

For example, you might have a custom field attached to a Vizy Block with the handle `plainText`. You could access this value via:

```twig
{{ node.plainText }}

{# Shortcut for: #}
{{ node.values.content.fields.plainText }}
```

:::warning
It's not recommended to use `node.values.content.fields` to retrieve field content unless you know what you're doing. The direct access method runs field content through `normalizeValue()` in order to convert the raw, plain values stored in the database, to values the corresponding field requires. For instance, a Date field would convert a plain text date into a DateTime object.
:::

#### Properties

Property | Value
--- | ---
`type` | `vizyBlock`
`handle` | `mixed`.

#### Attributes
These can be accessed via `attrs`.

Attribute | Description
--- | ---
`id` | The ID for this block.
`enabled` | Returns whether the block is enabled or not.
`collapsed` | Returns whether the block is collapsed or not.
`blockTypeEnabled` | Returns whether the block type is enabled or not.
`values` | An array of content values. Refer to below.

#### Values
These can be accessed via `attrs.values`.

Value | Description
--- | ---
`id` | The ID for the block.
`type` | The ID for the block type.
`typeEnabled` | Whether the block type is enabled or not.
`content.fields` | An array containing the field data.


### Methods

Method | Description
--- | ---
`getBlockType()` | Return the block type object.
`getFieldLayout()` | Return the field layout object.
`getEnabled()` | Returns whether the block is enabled or not.
`getCollapsed()` | Returns whether the block is collapsed or not.
`getBlockTypeEnabled()` | Returns whether the block type is enabled or not.

