# Mark
A mark object represents inline styles that can be applied to certain nodes. Marks cannot be used outside of the context of a [Node](docs:developers/node).

A common example of a Mark would be Bold text within a Paragraph node.

Each Mark shares the following attributes and methods.

## Attributes

Attribute | Description
--- | ---
`type` | Returns the type of mark this is.
`tagName` | Returns name for the HTML tag the mark should use.
`attrs` | Returns an array of mark attributes. This will vary for each mark type.

## Methods

Method | Description
--- | ---
`getTag()` | Returns the HTML tag name and attributes the mark should use for the HTML tag.
`getAttrs()` | Returns an array of mark attributes. This will vary for each mark type.
`getType()` | Returns the type of mark this is.
`renderOpeningTag()` | Renders the opening tag for the mark.
`renderClosingTag()` | Renders the closing tag for the mark.


## Mark Types

### Bold

#### Properties

Property | Value
--- | ---
`type` | `bold`
`tagName` | `strong`


### Code

#### Properties

Property | Value
--- | ---
`type` | `code`
`tagName` | `code`


### Italic

#### Properties

Property | Value
--- | ---
`type` | `italic`
`tagName` | `em`


### Link

#### Properties

Property | Value
--- | ---
`type` | `link`
`tagName` | `a`

#### Attributes
These can be accessed via `attrs`.

Attribute | Description
--- | ---
`href` | The URL for the link.
`target` | The target of the link.
`rel` | The rel value for the link.


### Strike

#### Properties

Property | Value
--- | ---
`type` | `strike`
`tagName` | `strike`


### Subscript

#### Properties

Property | Value
--- | ---
`type` | `subscript`
`tagName` | `sub`


### Superscript

#### Properties

Property | Value
--- | ---
`type` | `superscript`
`tagName` | `sup`


### Underline

#### Properties

Property | Value
--- | ---
`type` | `underline`
`tagName` | `u`

