# Block Based Editor
A big part of what makes Vizy special is how content is stored. Unlike many WYSIWYG fields, which store the raw HTML in the database, Vizy instead stores your content as JSON. This provides amazing flexibility and control when it comes to outputting the content of a Vizy field in your templates. 

For example, consider the following paragraph of content:

```
“The name [gin](https://en.wikipedia.org/wiki/Gin) is a shortened form of the older English word genever.”
```

Let's compare how [Redactor](https://plugins.craftcms.com/redactor) and Vizy store this content to illustrate the differences and what they mean for developers.

## Redactor
Redactor stores this content in raw HTML, converting the link to HTML and including the paragraph tag.

```html
<p>The name <a href="https://en.wikipedia.org/wiki/Gin" target="_blank" rel="noreferrer noopener">gin</a> is a shortened form of the older English word genever.</p>
```

Whilst this is not inherently bad or incorrect, if we wanted to add custom classes to the `<p>` or `<a>` tags, it would be difficult to do. This is a particularly common scenario when using utility-first CSS frameworks like [Tailwind](https://tailwindcss.com/).

## Vizy
Vizy on the other hand stores the resulting content as a JSON structure.

```json
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
                            "href": "https://en.wikipedia.org/wiki/Gin",
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

Whilst this is a **lot** more content compared to the simple HTML Redactor generates, it stores the same content in a much more structured fashion. From this, we can iterate over the properties to have complete control over how to render this content.

Vizy also provides many shortcuts to help with rendering your content. You can even provide templates for how Nodes and Marks are rendered to save you time from project to project.

Continue reading the [Rendering Content](docs:template-guides/rendering-content) guide.
