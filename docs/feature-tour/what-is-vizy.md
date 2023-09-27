# What is Vizy?
Vizy is an intuitive and flexible content editor field for Craft CMS. It aims to combine WYSIWYG features (like [Redactor](https://plugins.craftcms.com/redactor)) and Matrix blocks, to create an integrated field type for content editors. It also aims to be developer-friendly, providing full control over outputting of content in an un-opinionated fashion.

## Block-Based Editor
Part of what makes Vizy special is how content is stored. Unlike many WYSIWYG fields, which store the raw HTML in the database, Vizy instead stores your content as JSON. This provides amazing flexibility and control when it comes to outputting the content of a Vizy field in your templates. Instead of trying to parse HTML to add classes, remove attributes, or modify the structure, you'll have full control over how you want to output the content.

Continue reading the [Block-Based Editor](docs:feature-tour/block-based-editor) guide.

## Blocks, Tabs, Fields and more
Whilst Vizy includes WYSIWYG functionality that many people are experienced in using, it adds that ability to include "Vizy Blocks" inline with WYSIWYG content. A Vizy Block is very similar to Matrix blocks with some key differences.

A Vizy field consists of multiple Groups. Each Group contains multiple Block Types. When creating your content in a Vizy field, you'll be able to pick from these Block Types. Each Block Type can have multiple fields, organised into tabs. The key benefit here, is that you pick from your **existing** fields, unlike Matrix, and similar to Neo. We use the Craft Field Layout Designer so you can even include visual UI Elements like Headings, Tips and Warnings, and even organise your fields into columns.

## Nodes & Marks
Vizy uses the terms "Nodes" and "Marks" to represent chunks of content in the editor. For example, a Node typically represents an individual element in the editor. This might be a Paragraph, an Image or a Vizy Block. Marks are related to Nodes in that they exist inside a Node, and are used inline. For example, a Mark might be text in a Paragraph Node, that is Bold, Italic, or even a Link.

These terms aren't required to be understood by content editors, but if you're a developer looking to output Vizy field content in a template, or extend Vizy's functionality, it's important to understand these core concepts.

Continue reading the [Node](docs:developers/node) and [Mark](docs:developers/mark) guides.

## Built for Speed
Vizy stores all its content as JSON, which means in practical terms that it's significantly less overhead in fetching data for your fields, than say Matrix, Super Table or Neo fields. Instead of each block in a Vizy field being an element, with multiple database table joins, it's a single database call to fetch the content and un-serialize it for use in your templates.

## Querying Nodes
Vizy includes a powerful querying engine to filter, sort or search Vizy field content - in much the same way you can query Matrix blocks. For example, you might have multiple Block Types in your Vizy field, but when outputting the content, you only want ones of a particular type, limited to a certain number, or ordered in a particular way.

Continue reading the [Querying Nodes](docs:template-guides/querying-nodes) guide.

## Supporting Open Source
Vizy is built on top of the excellent [tiptap](https://github.com/ueberdosis/tiptap) library, which itself is built on top of [ProseMirror](https://github.com/prosemirror), used for many high-profile companies such as _Atlassian_ and _New York Times_.

For every sale of a Vizy license, we contribute a percentage of funds to these open source libraries to fund development and support.
