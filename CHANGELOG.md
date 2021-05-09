# Changelog

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
