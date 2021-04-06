# Block Type Templates
When rendering the content for a Vizy field, you have two options; rendering automatically, or rendering manually. The benefit of rendering automatically means you don't need to worry about templating individual block and their content, but does lead to a lack of control. The benefit of rendering manually provides full control over output, but means template code can get difficult to manage.

Block Type Templates aims to ease the burden of both these approaches by allowing you to provide a template for an individual Block Type, which can be used when rendering automatically.

## Using a loop
Let's start with an example use-case. Say we have a Block Type called "Image & Text" (with handle `imageText`), which features the following fields:

- Text `text` - A multi-line Plain Text field.
- Image `image` - An assets field.
- Image Alignment `imageAlignment` - A dropdown field with `left` and `right`.

With this field attached to a section, and an entry populated with content, the Twig template for this block might look something like the following:

```twig
{% for node in entry.vizyField.all() %}
    {# If this is a Vizy Block node, handle that #}
    {% if node.type == 'vizyBlock' %}
        {% if node.handle == 'imageText' %}
            <div class="image-{{ node.imageAlignment.value }}">
                <div class="text">
                    {{ node.text }}
                </div>

                <div class="image">
                    <img src="{{ node.image.one().url }}" alt="{{ node.image.one().title }}" />
                </div>
            </div>
        {% endif %}
    {% else %}
        {# Otherwise, this is a regular node, render normally #}
        {{ node.renderHtml() }}
    {% endif %}
{% endfor %}
```

Here, we loop through each node in the editor, and for each Vizy Block node, we add our template code. 

:::tip
In a real-world scenario, we might have multiple Block Types, with different Twig template code - sometimes quite lengthly. Writing all that template code in a single template block as the above might get overwhelming and hard to maintain. Check out the [Modular Templates](docs:template-guides/modular-templates) for our recommended approach.
:::

## Using templates
**But - ** what if we could make this approach even more streamlined? That's where Block Type Templates come in. Instead of looping through the nodes in the Vizy field, we can use the automatic rendering call `{{ entry.vizyField }}` or `{{ entry.vizyField.renderHtml() }}`, but still have it use our templates.

To do this, go to Settings → Fields → Vizy Field to edit your field. Select the "Image & Text" Block Type, and enter the following in the **Template** value: `_vizy/blocks/image-text`. 

Then, create the template file `templates/_vizy/blocks/image-text.html`. Of course, you can organise your template partials as you like. 

Add the following content to the `image-text.html` template partial:

```twig
<div class="image-{{ imageAlignment.value }}">
    <div class="text">
        {{ text }}
    </div>

    <div class="image">
        <img src="{{ image.one().url }}" alt="{{ image.one().title }}" />
    </div>
</div>
```

The content of this template is largely the same as the previous example. Note the only difference is the lack of `node` as you have direct access to the fields within this template.

Now, all you need to do to output the content of the Vizy field is to use `{{ entry.vizyField }}` or `{{ entry.vizyField.renderHtml() }}` in your templates. Vizy will use the template partial you define for the Block Type when rendering the content. 

This gives you the best of both worlds! You now have a modular template partial, related to the Block Type to keep your templates DRY.
