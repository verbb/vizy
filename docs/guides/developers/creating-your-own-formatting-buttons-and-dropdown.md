# Creating your own Formatting options with Editor Config

The core "Formatting" button features a dropdown where you can pick headings and more. It makes sense to combine certain text-based actions together and keep the top-level toolbar neat and tidy.

But you might also require a bit more control over the options available, what each button does, and more. For example, being able to add a "lead" styled paragraph which is typically slightly larger text than body text, but not a heading. Or maybe even creating some coloured text that's on-brand with your site colours.

With that in mind, let's use the following requirements as a goal for our guide. We want to have:

- A top-level button for a **Heading 1** with the class `h1`
- A top-level button for **Bold** with the class `font-bold` and `data-bold` attribute
- A formatting dropdown button that contains...
    - A "Lead" item that creates a slightly larger text compared to the paragraph, with the classes `font-lg text-slate-500`
    - A "Primary" item that creates text in the primary site colour (purple) with the class `text-primary-500`

## Editor Config
Fortunately, with the editor configuration (a JSON file to define what buttons and features the editor has), this is an easy task. Not only can you include or exclude the buttons Vizy provides, but you can define your own. These custom buttons are a quick way to extend existing nodes and marks with your own attributes.

:::tip
If you're looking for something more involved than this quick approach, have a look at the [Creating a custom Node from scratch](/guides/developers/creating-a-custom-node-from-scratch) guide on creating your own Vizy Plugin with custom buttons, Tiptap extensions and more. They're a lot more powerful than this method.
:::

You can define your [editor config](/get-started/configuration#editor-configuration) by either providing a JSON file to your Vizy field, or adding the JSON inline in the Vizy field settings. Whatever method you use, let's start with the following:

```json
{
    "buttons": [
        "italic",
        {
            "svg": "h1", 
            "title": "Featured Heading 1", 
            "type": "heading", 
            "attrs": {"level": "1", "class": "h1"}
        },
        {
            "svg": "bold", 
            "title": "Better Bold", 
            "type": "bold", 
            "attrs": {"class": "font-bold", "data-bold": true}
        }
    ],
    "formatting": [
        "paragraph",
        {
            "title": "Lead", 
            "type": "paragraph", 
            "attrs": {"class": "font-lg text-slate-500"}
        },
        {
            "title": "Primary", 
            "type": "textStyle", 
            "attrs": {"class": "text-primary-500"}
        }
    ]
}
```

You can see here that we're combining string values like `paragraph` and `italic` with objects that define our custom buttons. We can add buttons at the top-level, or within the formatting dropdown, so that part is up to you!

While `svg` and `title` are self-explanatory, and define the visuals of the button, the `type` and `attrs` is where the magic happens. First, you'll need to pick an existing [Node](/developers/node) or [Mark](/developers/mark) to extend from. Note that these are different from the other buttons (e.g. `h1` is the name of the button, but `heading` is the Node which you want to use). Then `attrs` is where you can define any attributes you want to save against the content. These will be output as HTML attributes when outputting it on the front-end.

Add the above to your editor config, and you should see a few new buttons in your editor. Go ahead and press these buttons on some text, and ... you probably won't see any change. But that's okay — if you look at the HTML source of the element, you'll see that the attributes _are_ getting applied, they just don't look any different to the regular content. For example, we might press the **Primary** button to apply our primary colour on the text.

```html
<p>Testing some <span class="text-primary-500">primary</span> text</p>
```

The class is there, which is great — but there's no associated CSS for the `text-primary-500` class (and other classes for nodes).

#### Editor styles
Now, we could certainly use the [Control Panel CSS](https://plugins.craftcms.com/cp-css) plugin to add these styles to the control panel, but there's an easier way with Vizy!

Modify your editor config to include `editorStyle`:

```json
{
    "buttons": [
        "italic",
        {
            "svg": "h1", 
            "title": "Featured Heading 1", 
            "type": "heading", 
            "attrs": {"level": "1", "class": "h1"},
            "editorStyle": ".h1 { color: red; }"
        },
        {
            "svg": "bold", 
            "title": "Better Bold", 
            "type": "bold", 
            "attrs": {"class": "font-bold", "data-bold": true},
            "editorStyle": ".font-bold { color: red; }"
        }
    ],
    "formatting": [
        "paragraph",
        {
            "title": "Lead", 
            "type": "paragraph", 
            "attrs": {"class": "font-lg text-slate-500"},
            "editorStyle": ".font-lg { font-size: 18px; } .text-slate-500 { color: #64748b; }"
        },
        {
            "title": "Primary", 
            "type": "textStyle", 
            "attrs": {"class": "text-primary-500"},
            "editorStyle": ".text-primary-500 { color: #8b5cf6; }"
        }
    ]
}
```

The `editorStyle` can contain CSS selectors that are applied just in the control panel. Rules are prefixed with `.vui-editor` so that they're scoped to Vizy, and don't mess around with anything else in the control panel.

Now you should be able to visually recognise your custom content in the control panel for your editors. We'll leave you to style that however you like on your front-end! Anything defined in your `attrs` property will be applied as HTML attributes, but you can of course customise how nodes are [rendered](/template-guides/rendering-content) as well.

### Review & Considerations
This is a super-easy way to setup custom behaviour with just the editor config file. You don't need to know PHP or JS to make a Vizy Plugin, custom nodes, etc. However, we do recommend careful consideration when it comes to storing HTML attributes like classes against nodes for maintainability.

Picture the following scenario — you populate 20 entries with **Primary** text, which applies the `text-primary-500` class as an `attr` against your node. But, you decide you don't _quite_ like the `text-primary-500` variant, and would prefer `text-primary-600`. You would have to update your editor config to use this new class for that custom button, and then go back through all your 20 entries to re-apply this change (by toggling the button). That could be a _lot_ of work depending on your content.

Instead, we might recommend using `data` attributes, or at least a `class` that isn't tied to a framework like Tailwind. Or there's another alternative...

### Custom nodes
Let's also not forget that Vizy stores structured content unlike other editors that store HTML. You don't _need_ to store the specific class you may require at edit-time in the control panel, just so it's available on the front-end when it comes to rendering. 

Instead of storing content that's tightly coupled to your specific front-end CSS, another approach is to store your custom items in a more structured way. So rather than instructing Vizy to store a `paragraph` node with a `text-primary-500` class, what about instructing Vizy to store a `primary` node — a custom node altogether?

This approach is where [creating a custom Node](/guides/developers/creating-a-custom-node-from-scratch) can help you out. You can define a particular chunk of content as "primary", and how you present it is entirely up to you, for your specific site or front-end framework as that may evolve over time. This provides _structure_ to your content, without tying it to presentation.

it's a little more work to setup a custom node, but our [user guide](/guides/developers/creating-a-custom-node-from-scratch) can walk you through things! We think the benefits do outweigh the time involved in creating it, and provides a more structured and maintainable content model in the long-run.
