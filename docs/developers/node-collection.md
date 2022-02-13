# Node Collection
A Node Collection is the object you deal with in your templates, when handling a Vizy Field. You can also call the field directly to render as HTML.

```twig
{{ entry.vizyField }}
```

## Methods

Method | Description
--- | ---
`getField()` | Returns the Vizy field model.
`getNodes()` | Returns a collection of [Node](docs:developers/node) objects.
`renderHtml()` | Return a string of pre-rendered HTML. This will use defaults for nodes, and any [Block Type Templates](docs:feature-tour/field-settings) for Vizy Blocks.
`all()` | An alias for `getNodes()`.
`query()` | Returns the an [Array Query](https://github.com/yii2mod/yii2-array-query) object for querying the collection of nodes.
`getRawNodes()` | Returns the raw node data, exactly as it's stored in the database's content table.
