# GraphQL
Vizy fields support being queried via GraphQL. To give you the utmost flexibility with rendering content, we provide the full, raw node structure for you to handle however you like.

You can use the `rawNodes` to return the entire node structure.

### Query
```json
{
  entries(section:"blog") {
    ... on vizy_blog_Entry {
      vizyField {
        rawNodes
      }
    }
  }
}
```

### Response
```json
{
  "vizyField": {
    "rawNodes": [
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
            "text": " is a "
          },
          {
            "type": "text",
            "marks": [
              {
                "type": "bold"
              }
            ],
            "text": "shortened"
          },
          {
            "type": "text",
            "text": " form of the "
          },
          {
            "type": "text",
            "marks": [
              {
                "type": "italic"
              }
            ],
            "text": "older"
          },
          {
            "type": "text",
            "text": " English word genever."
          }
        ]
      }
    ]
  }
}
```

Or, you can use `renderHtml` to return the generated HTML, as determined by Craft.

### Query
```json
{
  entries(section:"blog") {
    ... on vizy_blog_Entry {
      vizyField {
        renderHtml
      }
    }
  }
}
```

### Response
```json
{
  "vizyField": {
    "renderHtml": "<p class=\"text-left\">The name <a href=\"https://en.wikipedia.org/wiki/Gin\" target=\"_blank\" rel=\"noopener noreferrer nofollow\">gin</a> is a <strong>shortened</strong> form of the <em>older</em> English word genever.</p>"
  }
}
```