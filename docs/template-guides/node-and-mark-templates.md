# Node and Mark Templates

Node and mark templates let a Craft project replace Vizy’s generated frontend markup with Twig partials. The resolver runs at every nesting depth, so a mark template works inside paragraphs, list items, table cells and custom nodes without repeating traversal logic.

Use these templates for site-specific presentation. Vizy Blocks continue using their assigned [Block Type Templates](docs:template-guides/block-type-templates), while plain text remains HTML-encoded by Vizy before mark templates receive it.

## Configure a Template Folder

Set `renderTemplatesPath` in `config/vizy.php` to a path relative to the Craft `templates/` directory:

```php
<?php

return [
    'renderTemplatesPath' => '_vizy',
];
```

Vizy then looks for these paths:

```text
templates/
└── _vizy/
    ├── nodes/
    │   ├── paragraph.twig
    │   └── image.twig
    └── marks/
        ├── bold.twig
        └── customMark.twig
```

The filename stem is the registered node or mark type. Vizy uses its normal PHP renderer when the matching template does not exist, so projects only need to create the partials they want to replace.

## Render a Node

For `templates/_vizy/nodes/paragraph.twig`:

```twig
<p class="prose-paragraph">{{ content }}</p>
```

`content` is trusted HTML already rendered from the node’s descendants. Output it normally; Vizy passes it to Twig as safe markup. A node template receives:

| Variable | Value |
| --- | --- |
| `node` | The current raw node array. |
| `type` | The registered node type ID, such as `paragraph`. |
| `attrs` | Attributes resolved by the node’s PHP class for the current document context. |
| `content` | Rendered child HTML. |
| `context` | The complete `RenderContext`. |
| `document` | The current `VizyDocument`. |
| `field` | The current Vizy field, or `null` for a detached document. |
| `owner` | The element containing the Vizy field, or `null`. |
| `siteId` | The current site ID, when available. |

The node class’s `modifyRenderedNode` event still runs after the template, allowing cross-cutting module logic to wrap or replace the completed HTML.

## Render a Mark

For `templates/_vizy/marks/customMark.twig`:

```twig
<span class="annotation annotation--{{ attrs.style ?? 'default' }}">
    {{ content }}
</span>
```

A mark template receives the same context variables as a node template, with `mark` instead of `node`. Its `content` is the encoded text or markup produced by marks applied earlier in the stored mark order.

This contract also applies to marks registered by a module or plugin. The PHP class still defines the type, editor capability and resolved attributes; the Twig partial owns the final site markup.

## Override Templates for One Render

Pass `nodeTemplates` or `markTemplates` to `render()` when one presentation needs different partials. Each map is keyed by registered type ID:

```twig
{{ entry.articleBody.render({
    nodeTemplates: {
        paragraph: '_vizy/compact/paragraph',
    },
    markTemplates: {
        link: '_vizy/compact/link',
    },
}) }}
```

Per-render maps take precedence over `renderTemplatesPath`. Types not listed in a map continue through the configured convention or Vizy’s PHP renderer.

## Choose Templates or Events

Use a template when the project owns the complete markup for a particular type. Use [rendering events](docs:developers/events#customising-rendered-html) when a module needs to make a focused change while retaining Vizy’s generated structure. Templates and the `modifyRenderedNode` event compose for nodes; tag events belong to the PHP fallback path and do not run when a Twig template replaces that type’s tag structure.
