# Creating Your First Editor

Start with an entry type and a public entry whose Twig template you can edit. You'll add a Vizy field, write a paragraph and display its HTML before introducing custom blocks.

Create a Vizy field called Article Body with the handle `articleBody`. Choose an editor mode and [Editor Config](docs:feature-tour/editor-configs) that permit ordinary rich text, including paragraphs and links. Save the field and add it to the entry type's layout.

Open the entry and write “Read our studio guide.” Link the words “studio guide” to a page on your site, then save. Place this in the entry's Twig template:

```twig
{{ entry.articleBody.render() }}
```

Open the public page and check the paragraph and link. Change the sentence in the editor, save and refresh to confirm the output follows the saved content. The site's CSS supplies its appearance.

When you need structured content alongside paragraphs, add [Vizy Blocks](docs:feature-tour/vizy-blocks) and configure their [Block Types and Groups](docs:feature-tour/block-types-and-groups). Each custom block needs the appropriate template for automatic rendering. [Rendering Content](docs:template-guides/rendering-content) explains that relationship and how to handle empty content.
