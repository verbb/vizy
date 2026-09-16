# Field Settings

Create a Vizy field in **Settings → Fields → New Field**. Give it a name and choose **Vizy** as the Field Type. Its handle is the name you use to access the field in a template, such as `articleBody` in `entry.articleBody`.

## Editor Mode

Choose **Blocks & Rich Text** for an article that combines paragraphs with structured content. **Rich Text Only** suits an introduction or description, while **Blocks Only** suits a page assembled entirely from predefined components.

The mode determines which kinds of content editors can add. Use the Editor Config to choose the formatting tools within that mode, and Block Configuration to choose the available Block Types.

## Block Configuration

Block Types define reusable sets of Craft fields. They are global: editing a type changes its definition for every Vizy field using it. This field’s Block Configuration chooses which of those types editors can insert and how they appear in the picker.

Create or edit types through **Settings → Vizy → Block Types**, or from the field’s Block Configuration. Use a separate type when a field needs a different layout without changing other fields. [Blocks and Block Types](docs:feature-tour/blocks-and-block-types) explains the setup.

### Groups

Groups organise the choices within this field. For example, place Callout and Quote in a Text group, and Image and Video in a Media group. Rename, reorder, or remove groups to suit the editing workflow.

### Block Type Fields and Templates

Give each type a name and handle, choose an icon, and arrange its Craft fields into tabs. You can include field layout elements such as headings and instructions. A nested Vizy field gives the block its own rich text or structured content; see [Nested Vizy](docs:feature-tour/nested-vizy).

Set **Template** to the path of the Twig template that renders the block. [Block Type Templates](docs:template-guides/block-type-templates) walks through creating the fields and template together.

### Icons and Preview Images

An icon helps editors identify a type in the picker. Choose a bundled icon or provide SVG files in the folder configured by `iconsPath`. See [Configuration](docs:get-started/configuration).

Choose a preview image to show what a completed block looks like. The image comes from **Block Preview Images Path** (`blockPreviewImagesPath`). Its path is stored relative to that folder, such as `blocks/image-text.png`, so deploy the image folder with your project. Vizy uses it in the Add Block grid and hover preview.

## Editor Config

Choose a named **Editor Config** to set the available content, toolbar, and Bubble Menu. You can reuse a config across fields with the same editing needs or create a separate one for a field that needs fewer tools.

Manage configs in **Settings → Vizy → Editor Configs** or define a JSON file under `config/vizy/`. [Editor Configs](docs:feature-tour/editor-configs) explains how to create and apply one.

## Editor Appearance and Pasting

**Initial Rows** controls the field’s starting height before content is added. **Plain Text Paste** removes rich formatting from pasted content when you want editors to apply the field’s own styles. **Remove Empty Paragraphs** trims empty paragraphs from the field’s output.

## Block Limits and Deletion

Use **Min Blocks** and **Max Blocks** to constrain the number of blocks. For example, a field for a row of promotional cards could require at least one block and allow at most three. Check an entry with too few and too many cards to confirm the limits suit the layout.

Enable **Confirm Block Deletion** when editors should confirm before deleting a block from its menu. Confirmation is off by default.

## Asset Settings

Set **Default Upload Location** to the location where files uploaded directly through this field should be stored. Choose **Available Volumes** to limit the asset sources offered by image and file controls. For example, an article field can offer an Editorial Images volume without showing unrelated product photography.

**Show unpermitted volumes** and **Show unpermitted files** control whether the picker shows sources and files the editor would otherwise lack permission to view. Review those choices using an editor account with the permissions intended for the site.

**Available Transforms** controls the image transforms offered when inserting images, and **Default Transform** selects the initial choice. See [Image Transforms](docs:feature-tour/limitations#image-transforms) for the distinction between editor previews and frontend output.

## Link Settings

Under **Enabled Link Settings**, choose whether the link dialog offers **Link Text**, **New Window**, **Site**, **Title**, and **Classes**. For example, keep Classes hidden when your templates supply the site’s link styling. Enable Site when editors need to choose which site an element link targets.

Save the field, add it to an entry type’s field layout, and open an entry using that type. Check the editing tools, insert a block if the mode allows it, and save the entry. [Rendering Content](docs:template-guides/rendering-content) shows how to display the result.
