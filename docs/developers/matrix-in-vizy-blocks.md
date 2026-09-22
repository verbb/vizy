# Matrix in Vizy Blocks

Matrix fields can be placed on Vizy Block Type layouts when their rows need to remain Craft entries. Their content is saved through the containing entry, while Vizy maintains a persisted owner that lets Craft manage those nested entries.

For new content structures, first compare Matrix with a nested Vizy field in [Nested Content](docs:feature-tour/nested-content#choose-between-vizy-and-matrix). This page covers the operational details relevant to migrations, imports, and maintenance code.

## Understand the Save Model

Matrix uses **Inline Blocks** inside a Vizy block, including fields configured to use Cards, a card grid, or an element index elsewhere in Craft. Changes participate in the containing entry’s save and draft workflow rather than opening a separate element editor.

Normal saves retain existing Matrix row identities. Drafts and copies use independent Matrix content so editing them does not change the published source. Publishing a draft can replace row identities, so integrations should use the content’s current UIDs and must not assume that a numeric row ID survives publication.

Removing a Vizy block deactivates its owned Matrix content. Restoring the block restores that content. The stored Vizy document remains the source of the surrounding block identity and field placement.

## Avoid Competing First Saves

Avoid having multiple imports or background jobs create Matrix content in the same new Vizy block at the same time. On MySQL, one first save can fail when another request creates the block’s Matrix owner. Retry the complete containing element save in a fresh request or database transaction; Vizy does not automatically retry it.

Existing Matrix content already has its owner and does not require that first creation step. Serialising writes per containing element also avoids competing changes to the same Vizy document.

## Backfill Existing Content

Use the console command to inspect older Matrix content that still needs to be attached to an owner. Run it from the Craft project root with `--dryRun` first:

```sh
php craft vizy/anchors/backfill --dryRun
```

Review the reported element and site rows, then run the command without `--dryRun` to apply the changes. Use `--site=siteHandle` or `--elementId=123` to narrow the scan. Drafts are excluded by default; add `--drafts` when saved drafts must also be checked.

The command checks sites independently and preserves the containing element’s last-updated date. Its counts refer to element/site rows, so a multisite element can appear more than once. After applying a backfill, open representative entries on each relevant site and confirm that their Matrix rows load, save, and render through the containing Vizy block.
