# Changelog

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
