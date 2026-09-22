# Content Recovery

Vizy’s recovery records let you restore a saved field and its nested Matrix content without rolling back the rest of your site’s database. Use them when you need to return a field to a captured state after a content change or storage repair.

Recovery is a console operation for the developer or administrator maintaining the site. Run the commands below from your Craft project’s root directory, where the `craft` executable lives. You’ll need the element ID of the entry or other element containing the Vizy field. This containing element is called the field’s **owner**.

## What a Record Contains

Vizy captures records before owner content changes, ownership repair, deletion, and schema conversion. A record contains the original field document across its recorded sites and copies of its nested Craft entry storage. That includes Matrix values, relations, ownership, row order, and enabled states. The nested content is copied into the record, so it does not depend on those live rows remaining unchanged.

Records remain available after owner deletion. Before restoring a field, its owner, field placement, sites, and required schema must exist. If the owner has been deleted, restore it through Craft first.

These records cover Vizy documents and Craft’s nested entry storage. Third-party fields that keep values in separate tables or external services require their own recovery support. A record cannot recover content that was already missing when it was captured.

## Find a Recovery Record

List the records for the affected owner, replacing `{ownerId}` with its element ID:

```shell
php craft vizy/recovery/index {ownerId}
```

For example, if the entry’s element ID is `123`, run:

```shell
php craft vizy/recovery/index 123
```

The command returns JSON ordered from newest to oldest. Each item includes the record’s `id`, `ownerId`, `fieldUid`, `reason`, and `dateCreated`. If the owner contains several Vizy fields, use `fieldUid` to identify the affected field. Choose a record captured before the change you want to undo, and note its `id` for the next command.

The listing contains record metadata rather than a preview of the saved content. If you need to inspect a candidate’s result before applying it to the live site, restore it in a copy of that site first.

## Restore and Check the Field

Replace `{recordId}` with the selected recovery record’s ID:

```shell
php craft vizy/recovery/restore {recordId}
```

This command applies the restoration immediately. It replaces the selected field across all sites included in the record, along with its captured nested content. Other fields on the owner remain unchanged. Vizy also captures the state being replaced, allowing you to return to it using that recovery record.

Vizy restores the captured rows and verifies them before changing the active document, with both steps in one database transaction. If restoration fails, those changes roll back. A successful command prints `Restored Vizy recovery record {recordId}.`

After success, reopen the owner in the control panel for each affected site. Check the field’s text, block order, enabled states, nested Matrix values, and related elements against the content you intended to restore. Check the rendered page too, where the field is displayed by your templates.

## When Restoration Cannot Proceed

Restoration stops if required sites, layouts, or related elements are missing, or if another owner still references the nested content. The error identifies what needs attention before you retry. Restore missing dependencies first; if a field layout has changed, restore the required schema before restoring its content.

Shared Matrix references need ownership repair before their content can be replaced. Inspect the repair candidates with:

```shell
php craft vizy/anchors/backfill --drafts --revisions --trashed --dryRun
```

To apply the repair, run the same command without `--dryRun`. It includes drafts, revisions, and trashed owners so their Matrix content can be held independently. Review any reported failures before retrying the selected recovery record.
