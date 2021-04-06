# Querying Nodes
You can query Nodes within a Vizy field using our query engine. It aims to be similar to Element Queries, and how you would query Matrix blocks. When you query a Vizy field, don't forget you're querying Nodes, which include Paragraph, Images and more - not just Vizy Blocks.

## Examples
Let's look at a few example use-cases.

### Fetch Nodes
Fetch all paragraph nodes in a field:

```twig
{% set paragraphs = entry.vizyField.query().where({ type: 'paragraph' }).all() %}

{# Alternative syntax #}
{% set paragraphs = entry.vizyField.query().where([ '=', 'type', 'paragraph' ]).all() %}
```

Fetch all Vizy Block and paragraph nodes in a field:

```twig
{% set blocks = entry.vizyField.query().where({ type: ['vizyBlock', 'paragraph'] }).all() %}
```

Fetch all Vizy Block nodes for a given handle:

```twig
{% set blocks = entry.vizyField.query().where({ type: 'vizyBlock', handle: 'textBlock' }).all() %}
```

Fetch all nodes that are **not** a paragraph node:

```twig
{% set blocks = entry.vizyField.query().where([ '!=', 'type', 'paragraph' ]).all() %}

{# Alternative syntax #}
{% set blocks = entry.vizyField.query().where([ 'not', { type: 'paragraph' } ]).all() %}
```


### Limit
Return the first 2 nodes.

```twig
{% set nodes = entry.vizyField.query().limit(2).all() %}
```


### Count
Return the total count of nodes in a field:

```twig
{# For all types of nodes #}
{{ entry.vizyField.query().count() }}

{# For all Vizy Block nodes #}
{{ entry.vizyField.query().where({ type: 'vizyBlock' }).count() }}

{# For all image nodes #}
{{ entry.vizyField.query().where({ type: 'image' }).count() }}
```


### Order By
Return all nodes ordered by their type.

```twig
{% set paragraphs = entry.vizyField.query().orderBy('type DESC').all() %}
```

Return all Vizy Block nodes of type `textBlock` ordered by a `plainText` field:

```twig
{% set paragraphs = entry.vizyField.query().where({ type: 'vizyBlock', handle: 'textBlock' }).orderBy('plainText DESC').all() %}
```


### Fields
Return all Vizy Block nodes of type `textBlock` with a `plainText` field with a value equal to `123`:

```twig
{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock', plainText: '123' })
    .all() %}

{# Alternative syntax #}
{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock' })
    .andWhere(['=', 'plainText', '123'])
    .all() %}
```

Return all Vizy Block nodes of type `textBlock` with a `number` field with a value greater than `10`:

```twig
{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock' })
    .andWhere(['>', 'number', 10])
    .all() %}
```

Return all Vizy Block nodes of type `textBlock` with a `date` field with a value between `7 days ago` and `now`:

```twig
{% set blocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', handle: 'textBlock' })
    .andWhere(['between', 'date', now | date_modify('-7 day'), now])
    .all() %}
```

## Available Methods
You can use the below methods on a query to either filter or fetch nodes.

Option | Description
--- | ---
`where()` | Used to filter items based on params.
`andWhere()` | In addition to `where()`, filter using `and` matching conditions.
`orWhere()` | In addition to `where()`, filter using `or` matching conditions.
`filterWhere()` | See `where()`.
`andFilterWhere()` | See `andWhere()`.
`orFilterWhere()` | See `orWhere()`.
`exists()` | Whether any items match the query.
`limit()` | Limit the number of nodes returned.
`orderBy()` | Return nodes ordered by a property.
`count()` | Return the total count for the query.
`one()` | Return the first matching node.
`all()` | Return a collection of all matching nodes.


## Available Params
You can use the following operators in the above methods like `where()`, `andWhere()`, 

Param | Example
--- | ---
`not` | `where(['not', ['username' => 'admin']])`
`and` | `where(['and', { username: 'admin' }, { id: 3}])`
`or` | `where(['or', { username: 'admin' }, { id: 3}])`
`between` | `where(['between', 'id', 1, 2])`
`not between` | `where(['not between', 'id', 1, 2])`
`in` | `where(['in', 'id', [1, 3]])`
`not in` | `where(['not in', 'id', [1, 3]])`
`like` | `where(['like', 'username', 'admin'])`
`not like` | `where(['not like', 'username', 'admin'])`
`or like` | `where(['or like', 'username', 'admin'])`
`or not like` | `where(['or not like', 'username', 'admin'])`
`>` | `where(['>', 'id', 1])`
`<` | `where(['<', 'id', 2])`
`>=` | `where(['>=', 'id', 1])`
`<=` | `where(['<=', 'id', 2])`
`=` | `where(['=', 'id', 1])`
`!=` | `where(['!=', 'id', 1])`
