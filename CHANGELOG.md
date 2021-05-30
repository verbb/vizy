# Changelog

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
