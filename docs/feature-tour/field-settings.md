# Field Settings
Create a new Vizy field by going to Settings → Fields → New Field. Provide a name and select "Vizy" as the **Field Tyoe**.

## Editor Config
You can select a configuration file for the editor, which define which buttons and other functionality the field should have. Consult the [Configuration](docs:get-started/configuration) for further information. You can also provide your configuration JSON specifically for this field.

## Block Configuration
Here, we define what block types you wish to have available to pick from when adding content to the field.

### Groups
Block Types are grouped by **Groups** for ease of organisation. You can have a single group, or multiple ones Groups can be renamed, re-ordered or deleted.

### Block Types
Within in group you can create multiple Block Types. Each Block Type must contain a name, handle and icon. 

#### Icons
This helps to visually identify the type of content block a content editor is creating. We provide a full collection of icons from [Font Awesome 5](https://fontawesome.com/), but you can also provide your own custom icons to pick from.

First, ensure you configure the `iconsPath` configuration setting for the plugin. See [Configuration](docs:get-started/configuration). This path must resolve to a folder with a collection of `.svg` files. If configured correctly, you'll be able to select your custom icons from the folder you specify.

#### Templates
You can also provide the path to a template, which is used to automatically render this Block Type. This can be particularly useful in creating modular blocks, where template code is re-usable across multiple fields in the form of partials. Continue reading [Block Type Templates](docs:template-guides/block-type-templates).

#### Field Layout
Define the field layout for this Block Type. Each field layout organises fields into Tabs. Existing fields are added to the layout, along with UI Elements such as Headings or Warnings.

Block Types can disabled so that content editors cannot select to create new blocks with this Block Type. Block Types can also be re-ordered within the same Group, or re-arranged to another Group.