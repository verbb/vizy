# Migrating Rich-Text Fields

Vizy can replace an existing CKEditor or Redactor field, or copy a Vizy field into a separate Plain Text, CKEditor, or Redactor field. Both directions analyse every known placement and site, generate a Craft content migration for deployment, and verify every converted occurrence. Conversions to Vizy retain source checkpoints; copies from Vizy leave the complete source field and its content unchanged until you deliberately cut over.

Run the conversion locally before deploying it to another environment. Commit the resulting Project Config and content migration together, and test the complete workflow on a current database backup before using it on production content.

## Migrate to Vizy

### Analyse the Field

Go to **Settings → Vizy → Migrations → To Vizy**. CKEditor and Redactor are shown separately, with every matching field listed beneath its source editor. Choose the field you want to replace, select the Vizy Editor Config that should govern its content, then select **Analyse**.

The analysis is read-only. It reports the number of occurrences, rows, elements, and sites found, together with representative content that Vizy cannot reproduce exactly. The selected Editor Config matters because it determines which HTML structures and formatting the destination field can preserve.

You can run the same analysis from the root of the Craft project containing the `craft` executable. Pass the CKEditor or Redactor field handle to the console command:

```shell
php craft vizy/convert/analyze articleBody
```

The command prints the complete JSON plan and does not change Project Config or content. Populated values are converted in memory against Vizy’s `standard` Editor Config. Any representation loss is grouped under `diagnosticCounts`, with representative source locations and previews under `samples`.

Use a different Vizy Editor Config by passing its ID as the second argument. The optional third argument controls the maximum number of diagnostic samples:

```shell
php craft vizy/convert/analyze articleBody article 50
```

The plan has one of three statuses:

- `ready` means every populated value converted without a lossy diagnostic.
- `requires-review` means Vizy retained readable content but could not represent some source markup exactly.
- `blocked` means at least one value could not be converted and must be resolved before the field can change.

Custom CKEditor or Redactor styles do not automatically become Vizy extensions. Adjust the source, choose an Editor Config with the required capability, or register a custom HTML import rule before proceeding. Run the analysis again after any change and keep its `planHash` with your migration notes.

If the source field uses the Verbb Footnotes plugin, choose an Editor Config with the **Footnote** capability. Vizy recognises its `<sup class="footnote">` markup and converts each inline note into a stable reference with an editable definition. The analysis reports a loss when Footnote is not available in the selected Editor Config.

### Convert Locally

When the control-panel analysis is `ready`, review its counts and select **Migrate field and content**. Keep **Create a database backup before migrating** enabled unless you already manage backups outside Craft, then confirm that you understand the field definition and stored content will change.

Vizy keeps the field change and content conversion together so the destination field is never deliberately left pointing at unconverted HTML. It runs the analysis again, changes the field type through Project Config, writes a migration to the project’s configured content-migration directory, applies it locally, and verifies the resulting documents.

You can perform the same conversion from the console:

```shell
php craft vizy/convert/field articleBody
```

The generated migration contains stable field, layout, Editor Config, and policy identities. It does not contain environment-specific entry content.

The conversion defaults to strict mode. If the plan is `requires-review`, the control panel asks you to accept the listed representation loss explicitly. From the console, opt in with `--allowLossy` after reviewing every diagnostic and accepting the documented fallbacks:

```shell
php craft vizy/convert/field articleBody --allowLossy
```

Do not use `--allowLossy` merely to bypass an unfamiliar diagnostic. Confirm the affected source paths and resulting editor content first. Unresolved images, unsupported attributes, disabled marks, and custom elements may preserve text while losing presentation or references.

If any write or verification fails, the content transaction rolls back and the command restores the source field definition. A failed generated migration is removed so it cannot be committed accidentally.

### Check and Commit the Result

After the command succeeds:

1. Open representative entries for every reported site and placement, then save and reopen them.
2. Check the rendered frontend output as well as the control-panel editor.
3. Review the generated migration and Project Config diff. Confirm that both identify the same field UID and Editor Config.
4. Commit the generated content migration and Project Config changes together.

The local migration is recorded in Craft’s content-migration history. Running the command again against the converted field is unnecessary; the generated migration itself is idempotent when it encounters canonical Vizy values.

### Deploy the Conversion

Deploy the code, Project Config, and generated migration together, then run:

```shell
php craft up
```

Craft applies Project Config before content migrations. The field therefore becomes a Vizy field before the generated migration converts that environment’s own HTML values. The migration refuses to run if the field, Editor Config, captured placement map, or conversion policy no longer matches the reviewed plan.

Back up each environment before running `craft up`. Afterward, repeat the entry, site, editor, and rendered-output checks used locally.

## Migrate from Vizy

Create the destination field before starting the migration. It can be a multiline Plain Text field, a CKEditor field, or a Redactor field when that plugin is installed and enabled. Configure it for the result you want, then add it to each entry type or other field layout whose Vizy content you want to copy.

Go to **Settings → Vizy → Migrations → From Vizy** and select the existing source and destination fields. The wizard includes only field layouts containing both fields. A layout containing the source but not the destination is skipped, so the tool never invents a placement or guesses where converted content belongs. If the same field occurs more than once in a layout, resolve that ambiguity before copying.

The destination type determines the result:

- **Plain Text** retains readable text and line breaks, and removes formatting, media, rich-text structure, and Vizy Blocks.
- **CKEditor** exports compatible rich text as portable HTML using the selected field's configuration.
- **Redactor** exports compatible rich text as portable HTML using the selected field's configuration.

The review uses three outcomes. **Ready to copy** means the destination can represent the analysed content. **Ready with destination changes** means the copy can proceed, but the destination will flatten or omit something. **Cannot copy** is reserved for values that could not be read or converted. Representation changes do not block a copy because the source remains intact.

Rendered before-and-after examples show the actual portable HTML or Plain Text result. Vizy Blocks are grouped by Block Type and are not rendered into destination content, but their complete data remains in the source Vizy field. Unsupported nodes and marks are also explained in the review rather than silently omitted.

Continue to the confirmation step only after reviewing the included and skipped layouts. Vizy copies converted content between the paired placements and verifies the result. It does not modify either field definition or any field layout. Existing destination content is never overwritten, and any write or verification failure rolls the transaction back.

The console equivalents are:

```shell
php craft vizy/convert/analyze-from-vizy articleBody articleBodyCkeditor
php craft vizy/convert/from-vizy articleBody articleBodyCkeditor --allowLossy
```

Both arguments accept a field handle or UID. The generated content migration contains the source and destination field UIDs, their paired placement identities, and the conversion policy, but no environment-specific entry content.

### Deploy and Verify the Copy

Treat copying, cutover, and removal as separate releases. For the copy release:

1. Inspect the original and destination fields on representative local entries.
2. Commit the destination field, its field-layout placements, and generated content migration together.
3. Deploy with Vizy still installed and run `php craft up` on each environment.
4. Verify representative entries, sites, and frontend output on every environment.

The source Vizy field retains its original UID, handle, placements, settings, and content throughout this stage. If the destination is wrong, clear or recreate it; the source remains authoritative.

### Cut Over Separately

After every environment has applied and verified the copy, prepare a separate Project Config change:

1. Rename the Vizy field’s handle to a temporary backup handle such as `articleBodyVizyBackup`.
2. Give the destination field the original `articleBody` handle.
3. Remove the Vizy placements from active field layouts and move the destination placements into their positions.
4. Test editor screens and templates again, then deploy this cutover independently of the copy migration.

Keep the unassigned Vizy field for at least one further deployment cycle. Rolling back the cutover only requires restoring the previous handles and placements because the source data was never rewritten.

Delete the backup Vizy field and uninstall Vizy only after the cutover is verified everywhere and no pending Vizy-generated migration remains. The generated copy migration uses Vizy’s conversion services, so Vizy must still be installed when `php craft up` runs it.

## Restore Source Content

Each field converted to Vizy receives immutable recovery records whose reason starts with `rich-text-conversion:` followed by the plan hash. Find the records for an affected owner with:

```shell
php craft vizy/recovery/index {ownerId}
```

Restoring an inbound conversion requires both the original field definition and the captured value. First restore the selected HTML recovery record while the field is still Vizy, then restore the CKEditor or Redactor field definition from the same pre-conversion Project Config revision. Never leave a value active under the wrong field type.

The From Vizy workflow does not need recovery records because its Vizy source field is not modified. Before cutover, remove or recreate the destination. After cutover, restore the previous field handles and placements to make Vizy authoritative again.

Content migrations intentionally do not implement automatic rollback because reverting only the values or only the field type would leave the project inconsistent. See [Content Recovery](docs:developers/content-recovery) for record selection and restore behaviour.
