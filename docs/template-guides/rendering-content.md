# Rendering Content
There are a number of different methods for rendering a Vizy field in your templates.

When calling a Vizy field when attached to an element such as `{{ entry.vizyField }}` you're actually dealing with a [Node Collection](docs:developers/node-collection). Be sure to read up on the documentation for a Node Collection to see what options you have available to you.

## Automatic Rendering
The simplest and most common method will be to automatically render the HTML for your content. All nodes such as Paragraph, Image, etc will use the in-built rendering methods to render content.

```twig
{{ entry.vizyField | raw }}

{# Is the same as... #}
{{ entry.vizyField.renderHtml() }}
```

For example you might have the following content in your field:

```
“The name [gin](https://en.wikipedia.org/wiki/Gin) is a shortened form of the older English word genever.”
```

Which calling `renderHtml()` would produce the HTML:

```twig
<p>The name <a href="https://en.wikipedia.org/wiki/Gin" target="_blank" rel="noreferrer noopener">gin</a> is a shortened form of the older English word genever.</p>
```

For Vizy Block nodes these will only be output if you have [Block Type Templates](docs:feature-tour/field-settings) setup for the field. If no template is specified for a Block Type, they will not appear. Instead, you'll need to manually render the nodes.

## Manual Render
Using the manual render method is far more involved, but gives you complete control over the output of nodes. In this scenario, you loop through individual [Node](docs:developers/node) objects, controlling how to render each node.

```twig
{% for node in entry.vizyField.all() %}
    {# If this is a Vizy Block node, handle that differently #}
    {% if node.type == 'vizyBlock' %}
        {# Render the `imageText` block type #}
        {% if node.handle == 'imageText' %}
            <div class="image-{{ node.imageAlignment.value }}">
                <div class="text">
                    {{ node.text }}
                </div>

                <div class="image">
                    <img src="{{ node.image.one().url }}" alt="{{ node.image.one().title }}" />
                </div>
            </div>
        {% else %}
            {# Render other block types #}
        {% endif %}
    {% elseif node.type == 'paragraph' %}
        {# Handle rendering paragraphs #}
        {% for nodeContent in node.content %}
            <p class="p-text">{{ nodeContent.text }}</p>
        {% endfor %}
    {% else %}
        {# Otherwise, render using the default #}
        {{ node.renderHtml() }}
    {% endif %}
{% endfor %}
```

For the above example, we call `all()` on the Vizy field to allow us to loop through all [Node](docs:developers/node) objects for the field. Our conditional checks on what type of node each item is. We have a Vizy Block Type with a handle `imageText` with a few fields, but also check to render paragraph nodes differently. For all other cases, we fall back to use `renderHtml()` for the node to let Vizy generate the HTML for us.

Whilst this approach is fine, for larger fields, this can be difficult to maintain. We recommend a modular approach to handle your nodes. Continue reading [Modular Templates](docs:template-guides/modular-templates).

## Querying Nodes
You can use our query engine to filter, limit or search nodes for a field.

```twig
{% set paragraphs = entry.vizyField.query().where({ type: 'paragraph' }).all() %}
```

For further examples, see [Querying Nodes](docs:template-guides/querying-nodes).

## Raw Node Data
You can also get the raw JSON block data, exactly as it's stored in the database. Vizy will unserialize the JSON into an array for use in your templates.

```twig
{{ dump(entry.vizyField.getRawNodes()) }}

{# Returns the following array #}
[
    {
        "type": "paragraph",
        "attrs": {
            "textAlign": "left"
        },
        "content": [
            {
                "type": "text",
                "text": "The name "
            },
            {
                "type": "text",
                "marks": [
                    {
                        "type": "link",
                        "attrs": {
                            "href": "https:\/\/en.wikipedia.org\/wiki\/Gin",
                            "target": "_blank"
                        }
                    }
                ],
                "text": "gin"
            },
            {
                "type": "text",
                "text": " is a shortened form of the older English word genever."
            }
        ]
    }
]
```
