# Node Query

Call `query()` on a Vizy field value to obtain a query over its root nodes. It returns block projections for Vizy blocks and content-node projections for prose. Nodes inside layouts and fields nested inside blocks are outside this root query.

In an entry template, replace `vizyField` with your field’s handle and `callout` with a configured Block Type handle:

```twig
{% set callouts = entry.vizyField.query()
    .andWhere({ type: 'vizyBlock', handle: 'callout' })
    .all() %}
```

Queries return enabled content by default. `where()` replaces the ordinary conditions, while `andWhere()` and `orWhere()` combine them. These operations preserve the enabled scope, including across repeated calls.

Use `enabled(false)` for disabled blocks or `enabled(null)` for both states. A top-level `enabled` key in a condition is shorthand for the same scope selection:

```twig
{% set disabled = entry.vizyField.query().enabled(false).all() %}
{% set allBlocks = entry.vizyField.query()
    .where({ type: 'vizyBlock', enabled: null })
    .all() %}
```

The selected scope remains in effect until you change it, including when replacing the other conditions with `where()`. Prose nodes count as enabled. For complex Boolean expressions, an explicit `enabled` predicate within the expression controls its own filtering instead of adding an implicit enabled condition. A nested `{ enabled: null }` matches either state. Boolean combinations preserve document order and treat each node occurrence separately, even when several nodes share a type.

## Available Methods

| Option | Description |
| --- | --- |
| `enabled(true/false/null)` | Select enabled content, disabled blocks, or both states. |
| `where()` | Replace ordinary conditions, preserving the enabled scope unless explicitly changed. |
| `andWhere()` | Extra AND conditions. |
| `orWhere()` | Extra OR conditions. |
| `filterWhere()` | Like `where()`, empty ordinary values dropped; an explicit `enabled: null` still selects both states. |
| `andFilterWhere()` | See `andWhere()`. |
| `orFilterWhere()` | See `orWhere()`. |
| `exists()` | Whether any items match. |
| `limit()` | Limit how many nodes are returned. |
| `orderBy()` | Order by a property / field handle. |
| `count()` | Total matching nodes. |
| `one()` | First match, or `false`. |
| `all()` | All matches. |

Shortcut: `entry.vizyField.all()` is `query().all()` (default enabled filter).

## Available Params

Operators for `where()` / `andWhere()` / …:

| Param | Example |
| --- | --- |
| `not` | `where(['not', { handle: 'callout' }])` |
| `and` | `where(['and', { handle: 'callout' }, { enabled: true }])` |
| `or` | `where(['or', { handle: 'callout' }, { enabled: true }])` |
| `between` | `where(['between', 'number', 1, 2])` |
| `not between` | `where(['not between', 'number', 1, 2])` |
| `in` | `where(['in', 'number', [1, 3]])` |
| `not in` | `where(['not in', 'number', [1, 3]])` |
| `like` | `where(['like', 'handle', 'callout'])` |
| `not like` | `where(['not like', 'handle', 'callout'])` |
| `or like` | `where(['or like', 'handle', 'callout'])` |
| `or not like` | `where(['or not like', 'handle', 'callout'])` |
| `>` / `<` / `>=` / `<=` / `=` / `!=` | `where(['>', 'number', 1])` |


The numeric operator examples assume a Number field with the handle `number` on the selected Block Type. Filter to that type before comparing its field values. [Querying Nodes](docs:template-guides/querying-nodes) develops the query through practical examples.
