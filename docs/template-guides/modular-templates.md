# Modular Templates
When [manually rendering](docs:template-guides/rendering-content) Vizy field content, you can use `.all()` to loop through nodes. This gives you complete control over the output for each node, but at the same time, can make your templates verbose, messy and difficult to maintain.

For this reason, if you're going down the manual rendering route, we'd recommend a modular approach to your templates. You might already be implementing something similar on your own sites, but this approach aims to make your templates highly maintainable and organised.

To review, let's look at looping through nodes for a field.

```twig
{% for node in entry.vizyField.all() %}
    {% if node.type == 'vizyBlock' %}
        {% if node.handle == 'imageText' %}
            {# ... #}
        {% elseif node.handle == 'video' %}
            {# ... #}
        {% elseif node.handle == 'blog' %}
            {# ... #}
        {% else %}
            {# ... #}
        {% endif %}
    {% elseif node.type == 'blockquote' %}
        {# ... #}
    {% elseif node.type == 'heading' %}
        {# ... #}
    {% elseif node.type == 'image' %}
        {# ... #}
    {% elseif node.type == 'paragraph' %}
        {# ... #}
    {% else %}
        {# ... #}
    {% endif %}
{% endfor %}
```

As you can see, despite not including the actual template code this code is already getting long and there's a lot of conditionals to handle. Instead, let's take a modular approach to each of these templates.

```twig
{% for node in entry.vizyField.all() %}
    {% include ['_vizy/' ~ node.type, '_vizy/default'] %}
{% endfor %}
```

Here, instead of including the template code for each node type in this template, we're including them using `{% include %}`. We're dynamically setting the include, based off the `node.type` attribute, with a fallback to `default` whenever a template is not found.

:::tip
Read more about Twig's [include](https://twig.symfony.com/doc/3.x/tags/include.html) tag for how this works
:::

Your `_vizy` folder might look similar to the below, where we've created an individual template for each type of node.

- `_vizy`
    - `blockquote.html`
    - `heading.html`
    - `image.html`
    - `paragraph.html`
    - `default.html`
    - `vizyBlock.html`

Let's go through the content of some of these templates.

## `paragraph.html`
This file might be quite lengthly, in order to deal with all possible nested [Mark](docs:developers/mark) inside a paragraph node.

```twig
<p class="p-text">
    {% for nodeContent in node.content %}
        {% for mark in nodeContent.marks %}
            {% if mark.type == 'link' %}
                <a class="link" href="{{ mark.attrs.href }}">{{ nodeContent.text }}</a>
            {% elseif mark.type == 'bold' %}
                <strong>{{ nodeContent.text }}</strong>
            {% elseif mark.type == 'italic' %}
                <em>{{ nodeContent.text }}</em>
            {% endif %}
        {% else %}
            {{ nodeContent.text }}
        {% endfor %}
    {% endfor %}
</p>
```

## `default.html` 
This file acts as a fallback for when you templates try to include a template partial that doesn't exist. As such, we can use `renderHtml()` to let Vizy handle the default behaviour. That way, our template partials exist only as overrides.

```twig
{{ node.renderHtml() }}
```

You can also pass it any options you might be use to with [Rendering HTML](docs:template-guides/modify-nodes) at the field level.

```twig
{{ node.renderHtml({
    attrs: {
        class: 'text-lg',
    },
}) }}
```

## `vizyBlock.html`
For this file we'll want to do the same modular technique, but this time on the Block Type, which will have different fields, therefore different templates.

```twig
{% include '_vizy/blocks/' ~ node.handle ignore missing %}
```

This single-line template follows the same approach, this time using the `node.handle` for the Block Type handle, and resolving to `_vizy/blocks`. So if you have a Block Type with a handle `imageText`, it'll look for a template  `_vizy/blocks/imageText.html`, where we'd store our template content.

For example, your `_vizy` folder might look similar to:

- `_vizy`
    - `vizyBlock.html`
    - `...`
    - `blocks`
        - `imageText.html`
        - `video.html`
        - `blog.html`
        - `...`

The content for each Vizy Block field will completely depend on what fields you have included, and the desired output. 

While this scaffolding has some up-front work, once you've built your template partials, they can be easily carried over from project to project. Not to mention, each partial can be used across multiple Vizy fields if you choose to do so.
