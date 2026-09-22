# Matrix in Blocks

Matrix fields can be added to Block Type layouts and edited within Vizy blocks. Existing Matrix content remains editable, and you can create new Matrix fields and placements when your content needs them.

For most nested content, we recommend a [nested Vizy field](docs:feature-tour/nested-vizy). Choose **Blocks Only** on the inner Vizy field for structured lists such as FAQs, cards, or slides. Matrix is useful when those items need to remain actual Craft entries, for example when existing templates or integrations query them as entries.

## Choosing Between Matrix and Nested Vizy

Matrix stores its rows as separate Craft entries. Within Vizy, those entries also require a persisted owner for each containing block. Saving, copying, creating drafts, and publishing can therefore involve more database records and processing than keeping the same structure in nested Vizy. The cost grows with the number of rows, nesting levels, and sites; test representative content on your own project before building large or deeply nested structures.

Matrix is supported despite these tradeoffs. You do not need to convert an existing field to keep using it. If you choose to move to nested Vizy, account for templates and integrations that rely on Matrix entry identities or queries: a Vizy block is not a Craft entry.

## Adding a Matrix Field

Open the Block Type in **Vizy → Block Types** and add your Matrix field to its layout. Configure the Matrix field’s allowed Entry Types as you would elsewhere in Craft, then save the Block Type. The Matrix input appears when an editor opens that block’s fields.

## Editing Matrix Content

Open an entry containing the block and edit its Matrix content within the block’s field layout. You can add, reorder, and remove rows using the Matrix input. Save the containing entry, then reopen it to check the result.

Matrix uses **Inline Blocks** inside Vizy, including fields configured to use Cards, a card grid, or an element index. Inline editing keeps Matrix changes within the containing entry’s save and draft workflow. Craft’s separate card and index editors are not supported within Vizy blocks. The field keeps its configured view mode when used elsewhere in Craft.

Normal saves retain existing row identities. Drafts and copies use independent Matrix content so editing them does not change the published source. Publishing a draft can replace Matrix row identities; avoid relying on a row’s numeric ID remaining the same through publication.

## Concurrent Saves

Avoid having multiple imports or background jobs create Matrix content in the same new Vizy block simultaneously. On MySQL, one first save can fail when another request creates that block’s Matrix owner. A failed save must be retried as a complete save in a fresh request or database transaction; Vizy does not automatically retry the containing element save. Existing rows do not require that first owner-creation step.

## Backfilling Existing Content

To inspect older Matrix content that still needs to be saved onto an anchor, run:

```sh
php craft vizy/anchors/backfill --dryRun
```

Run the same command without `--dryRun` to apply the changes. It checks all sites independently and preserves the containing element’s last-updated date. Use `--site=siteHandle` or `--elementId=123` to narrow the scope. Drafts are excluded by default; add `--drafts` to include saved drafts. The reported counts refer to element/site rows, so a multisite element can be counted more than once.
