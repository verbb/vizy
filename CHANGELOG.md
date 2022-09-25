# Changelog

## 2.0.7 - 2022-09-25

### Added
- Add support for entries conditions for Vizy fields.

### Changed
- Switch deprecated `ueberdosis/html-to-prosemirror` package to `ueberdosis/tiptap-php`.

### Fixed
- Fix Vizy blocks not being site-aware.
- Fix “Open link in new tab” not saving correctly for link nodes.
- Fix asset fields within Matrix/Super Table fields not moving from the temporary upload directory.
- Fix an error when propagating element fields’s content for un-translated Vizy/SuperTable/Inner fields.
- Fix an error when propagating Super Table rows for un-translated Vizy/SuperTable/Inner fields.
- Fix an error when propagating Matrix blocks for un-translated Vizy/Matrix/Inner fields.
- Fix importing nodes via Feed Me not working for some node types.

## 2.0.6 - 2022-08-11

### Fixed
- Fix Vizy node content being reset when inserting other nodes directly before it.
- Fix a field alignment issue in nested Vizy fields.
- Fix Vizy fields not initializing when switching entry types.
- Fix fields not working correctly in element slideouts, in some instances.

## 2.0.5 - 2022-08-09

### Fixed
- Fix GraphQL queries throwing an error when fields aren’t initialized fully.
- Fix blocktype picker not appearing in Live Preview.
- Fix potential error for blocktypes.
- Update Vizy loading for input to handle proper loading using Vite.

## 2.0.4 - 2022-07-06

### Fixed
- Fix an error when making GraphQL queries.

## 2.0.3 - 2022-07-02

### Added
- Add `vite-plugin-compression` to generate gzipped JS/CSS assets.
- Add better handling for JS scripts on-load, to prevent against missing JS execution in some cases. (thanks @khalwat).

### Changed
- Update CP template `content` block.

### Fixed
- Fix a GQL deprecation notice.
- Fix HMR not working when making changes to `vizy.js`.
- Fix updating Block Type template not working correctly.
- Fix en error when trying to limit “Available Volumes” or “Available Transforms”.
- Fix an error when rendering an entry revision for nested Vizy fields.

## 2.0.2 - 2022-06-04

### Fixed
- Fix an error with JS translations.
- Fix return types for `node.renderHtml()`.

## 2.0.1 - 2022-05-28

### Added
- Add changes/improvements from `1.0.14`.

### Fixed
- Fix `renderHtml()` not rendering HTML correctly.
- Fix JS initialization for input and settings.
- Fix field settings not initializing in some cases.

## 2.0.0 - 2022-05-05

### Added
- Add checks for registering events for performance.

### Changed
- Now requires PHP `8.0.2+`.
- Now requires Craft `4.0.0+`.
- Merge updates with version 1.0.13.
- Migrate to Vite and Vue 3 for performance.
- Rename base plugin methods.
- Replace deprecated `Craft.postActionRequest()` for JS.
- Improve field performance when editing in the control panel.

### Fixed
- Fix Craft `4.0.0` compatibilities.
- Fix link sources having duplicate sources.
- Fix a type error when trying to render empty HTML.
- Fix Vizy field settings not picking up field layout changes when edited.

### Removed
- Remove `cleanDeltas()`, which is no longer needed in Craft 4.

## 1.0.20 - 2022-09-25

### Fixed
- Fix an issue where nested Vizy fields in Matrix/Super Table/etc fields weren’t having their content serialized correctly.

## 1.0.19 - 2022-09-23

### Fixed
- Fix display issues with Vizy fields in Live Preview.
- Fix an overflow issue for small screens for the block picker.
- Fix a legacy error where in some cases blocks were missing their block type.
- Fix toggling field tabs not working correctly for nested Vizy fields.
- Fix legacy handling of `HtmlToProseMirror` package when importing content via Feed Me.

## 1.0.18 - 2022-08-11

### Changed
- Update all tiptap dependancies to latest beta versions.

### Fixed
- Fix Vizy node content being reset when inserting other nodes directly before it.

## 1.0.17 - 2022-08-09

### Fixed
- Fix blocktype picker not appearing in Live Preview.

## 1.0.16 - 2022-07-02

### Added
- Add `isRoot` for Vue component top-level fields.

### Changed
- Update all tiptap dependancies to latest beta versions.
- Exclude any falsey attributes for a node when rendering.
- Lower debounce time for watched Vizy Block field changes.
- Only clicking on the header of Vizy Blocks selects a block.

### Fixed
- Fix link nodes always including `target` and `rel` attributes.
- Fix newly created Vizy blocks not having the correct namespace in some instances.
- Fix JS not initializing correctly for complex Vizy fields and in combination with Neo/SuperTable/Matrix.
- Fix an error where delta values for other fields was being stripped out when including a Vizy field.
- Fix an error when saving nested Vizy fields with validation errors and blocks losing their content.
- Fix unload warning when no content has been changed.
- Fix Vizy Block field alignment of fields.
- Fix selected state issues on nested Vizy fields and Vizy blocks, and add support for “Escape” key to remove selected Vizy Block.
- Fix being unable to click properly between Vizy blocks to add a new node, and fix gap cursor alignment.
- Fix an overlay issue for nested Vizy fields when picking Vizy blocks.
- Fix multiple Redactor fields in a single Vizy block not working correctly.

## 1.0.15 - 2022-06-04

### Fixed
- Fix incorrectly encoding quotes for Vizy field content.

## 1.0.14 - 2022-05-28

### Added
- Add `VizyImageNodeInterface` and the ability to query `asset` on image nodes.
- Add `Image::getAsset()` for image nodes.
- Add caching for block type definitions for each field, to speed up rendering of large Vizy fields.
- Improve field performance when editing in the control panel.

### Fixed
- Fix being unable to remove the template path for a Vizy blocktype when editing the field settings.
- Remove HTMLPurifier due to performance issues, as we can rely on proper HTML encoding via `StringHelper::htmlEncode`.
- Fix double-encoding of HTML strings.
- Fix volumes not working for selecting images.

## 1.0.13 - 2022-04-13

### Added
- Add support for `limit`, `orderBy` and `where` arguments for GraphQL queries, when querying `nodes`.
- Add descriptions for all attributes for GraphQL.
- Add `vizyBlock.getCollapsed()`.
- Add `vizyBlock.id`.
- Add `Node::isEmpty()`.

### Changed
- Change field layout instruction text for Vizy field settings.
- GraphQL queries using `nodes` now only return enabled nodes.

### Fixed
- Fix `NodeCollection::isEmpty` not working correctly.

## 1.0.12 - 2022-03-17

### Fixed
- Fix nested node content being incorrectly stripped out due to HTML purifier.

## 1.0.11 - 2022-03-13

### Changed
- Improve node collection performance.
- Minor Vizy block performance improvements.

### Fixed
- Fix serializing nested Vizy fields not being arrays.
- Fix a potential XSS vulnerability, where HTML wasn’t correctly encoded.
- Fix an error when serializing nested Vizy fields, when generating search keywords.
- Fix rendering node collections in the control panel automatically when not needed.
- Fix Vizy Block nodes not rendering correctly for GraphQL queries.
- Fix an error when querying `nodes` or `rawNodes` for GraphQL queries.

## 1.0.10 - 2022-02-28

### Added
- Add support for emoji’s in Vizy field content.

### Fixed
- Fix field content not updating when editing raw HTML.
- Fix non-translatable Vizy field with inner translatable fields not having their content propagated correctly.
- Fix Matrix field sanitizing not working correctly for Vizy Blocks containing Matrix fields where their sub-field handles have changed.
- Fix related elements in Vizy block fields not having their appropriate site (inherited from the owner element) applied to the field.
- Fix Matrix field sanitizing not working correctly for Vizy Blocks containing Matrix fields where their sub-field handles have changed.
- Fix a compatibility issue with Redactor, showing extra line breaks incorrectly.
- Fix rendering content not reporting back correctly for `length` Twig filter, and no longer require the use of `raw` Twig filter.
- Fix displaying encoded html characters in some cases (pasting from Word).

## 1.0.9 - 2022-01-17

### Added
- Add support for Feed Me.

### Changed
- Bump axios from 0.21.1 to 0.21.2.

### Fixed
- Fix "Remove Empty Paragraphs" not working correctly when content has been pasted from Word, or contained `&nbsp;` characters.
- Fix Firefox text selection issue, when trying to select text within a Vizy block (input, textarea fields).
- Fix `gapcursor` tiptap utility not working correctly.
- Fix when fields only containing images, the field is considered empty.

## 1.0.8 - 2021-10-23

### Changed
- Update all tiptap dependancies to latest beta versions.

### Fixed
- Fix Redactor fields not working correct in a Vizy block.
- Fix editor losing focus when pressing toolbar buttons.
- Fix z-index overflow issue when showing the block type selector.
- Fix block type selector not allowing scrollable area when a lot of blocks are available.
- Fix Image nodes not having ref tags parsed correctly for transforms.
- Fix ref parsing logic for Link nodes.
- Fix an error thrown during search indexing, when a Vizy block contained an element select field (assets, entries, etc).

## 1.0.7 - 2021-09-09

### Fixed
- Fix content not saving correctly when editing via the element slideout.
- Fix editor toolbar not behaving as fixed when opening the element editor slideout.
- Fix links containing ref tags not being parsed properly.
- Fix including incorrect attributes (`id`, `uid`) when querying Vizy field nodes via GraphQL.

## 1.0.6 - 2021-08-29

### Added
- Add `subscript` and `superscript` buttons.

### Changed
- Update all tiptap dependancies to latest beta versions.

### Fixed
- Ensure each field's content is serialized properly when saving Vizy blocks.
- Fix Vizy blocks using `isolating`, causing issues with backspacing some other nodes (blockquote).
- Fix an error when trying to add a link with only numbers.
- Remove field modification indicator (from Craft) for Vizy block inner fields.
- Fix lack of `enabled` attribute for all nodes.
- Fix disabled Vizy blocks returned in `query()` when using `all()` to query nodes.
- Fix text align buttons not working, due to `@tiptap/core@2.0.0-beta.85` change.
- Fix numerous errors when creating multiple Vizy fields in Matrix and Super Table fields.

## 1.0.5 - 2021-08-02

### Changed
- Update all tiptap dependancies to latest beta versions.

### Fixed
- Fix nested Vizy fields not rendering when used inside a Matrix block (also inside a Vizy field).
- Fix focus styling when selecting a Vizy Block.
- Fix Vizy Block inner field validation (including Matrix).
- Fix brand-new static Super Table blocks in a Vizy block having their rows duplicated when moving the block.
- Fix when moving a Vizy block containing a Redactor field, it Redactor would be initialized multiple times.
- Fix field layout changed in a Super Table-nested Vizy field not applying when running `project-config/apply`.
- Fix field layout changed in a Matrix-nested Vizy field not applying when running `project-config/apply`.
- Fix multiple Vizy fields in Matrix/Super Table parent fields not saving correctly.

## 1.0.4 - 2021-07-21

### Added
- Add `text` and `rawNode` to NodeInterface for GraphQL.

### Fixed
- Fix an error when saving Vizy blocks containing Matrix fields with no blocks defined.
- Fix Vizy fields failing to validate Vizy blocks, when only Vizy blocks are present in the field.
- Fix `content`, `attrs`, `marks` and `text` GraphQL node properties not having the correct values.
- Fix image node, and other self-closing nodes not displaying correctly.
- Fix required Vizy fields not validating when no content is set for the field.

## 1.0.3 - 2021-06-22

### Added
- Add `defaultTransform` field setting.
- Add `defaultTransform` field setting.
- Add `availableTransforms` field setting.
- Add `availableVolumes` field setting.
- Add `showUnpermittedFiles` field setting.
- Add `showUnpermittedVolumes` field setting.
- Add `trimEmptyParagraphs` field setting to automatically trim any empty paragraphs in content.
- Add `serializeValue()` to all nodes, to control the values saved to the database.

### Changed
- Update all tiptap dependancies to latest beta versions.
- Update Vizy Node GraphQL interface name.

### Fixed
- Fix multiple nested marks (bold + underline, etc) rendering text twice.
- Fix Matrix blocks throwing an error if a block type field was deleted. (thanks @dyerc).
- Fix Vizy block type fields not saving when nested in a Super Table/Matrix field.
- Fix nested Vizy fields’ image nodes not working correctly.
- Fix GQL Vizy Block field aliases not working.
- Fix fixed toolbar buttons overlapping for nested Vizy fields.
- Fix nested list elements `ul`, `ol` not appearing correctly in the control panel editor.
- Fix Vizy Block fields not validating when saving an element.
- Fix `getMarkAttributes` tiptap deprecation.
- Fix asset fields in Vizy blocks not resolving to the correct volume/paths.
- Fix incorrectly parsing Twig template code in block fields.
- Fix Vizy fields not showing as empty for empty content.

## 1.0.2 - 2021-05-30

### Added
- Allow marks to use `merge` when using template-based config.
- Add `getOwner()` to Vizy Block element, to allow use of `owner` for block field settings.

### Changed
- Update all tiptap dependancies to latest beta versions.
- Remove duplicate Vue dependancy, causing some conflicts with other plugins using Vue.

### Fixed
- Fix incompatibility issues with [Inventory](https://github.com/doublesecretagency/craft-inventory) plugin.
- Fix an error when a block type’s tab contained only numbers.
- Fix orphaned layouts for deleted block types, or deleted Vizy fields.
- Fix field layout setting updates not being stored to project config (adding or removing field).
- Ensure general block type errors are show when saving a field fails.
- Fix multiple field layouts being created if a block type fails validation when saving the field settings.
- Fix unload warnings when no content has changed, when a field has nested Vizy fields.
- Fix nested Vizy fields and their toolbars not sticking when using `toolbarFixed`.
- Fix “add block” button not always appearing on a new line, depending on formatted text.
- Fix incomplete field data being saved when a Matrix (or similar) field contained a nested Matrix, when the owner element has unchanged block content.

## 1.0.1 - 2021-05-09

### Changed
- Allow Icons Path setting to use auto-suggest field.
- Refactor block inner field change detection to use `MutationObserver`. Should prove more reliable for variety of edge-cases.

### Fixed
- Fix search indexing not factoring in Vizy block inner fields, and nested Vizy fields.
- Fix documentation link for editor config in field settings.
- Fix an error when trying to populate block content for a block field that has been changed or removed.
- Fix Vizy block elements not having inner field normalisation occur with owner element.
- Fix an error when adding new block types to the field.
- Fix WYSIWYG styles being applied to nested block elements.
- Fix changes from Redactor not serializing when saving Vizy field content.
- Fix changes from Position and Colour Swatches plugins not serializing when saving Vizy field content.
- Fix a potential error when a field that was included in a block type was deleted.
- Fix changes from Tag fields not serializing when saving Vizy field content.
- Fix extensions not always getting initialized properly, when being contained in the formatting menu.

## 1.0.0 - 2021-04-30

- Initial release.
