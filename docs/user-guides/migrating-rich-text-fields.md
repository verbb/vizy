# Migrating CKEditor and Redactor Fields

Vizy can replace an existing CKEditor or Redactor field and convert its HTML into canonical Vizy documents. The console workflow analyses every known placement and site before making changes, generates a Craft content migration for deployment, captures the original values in Vizy recovery records, and verifies every converted occurrence.

Run these commands from the root of the Craft project containing the `craft` executable. Commit the resulting Project Config and content migration together. Test the complete workflow on a current database backup before using it on production content.

## Analyse the Field

Pass the CKEditor or Redactor field handle to the read-only analysis command:

```shell
php craft vizy/convert/analyze articleBody
```

The command prints a JSON plan and does not change Project Config or content. Its `content` section reports the number of occurrences, rows, elements, and sites found, together with grouped placement paths. Populated values are converted in memory against Vizy’s `standard` Editor Config. Any representation loss is grouped under `diagnosticCounts`, with representative source locations and previews under `samples`.

Use a different Vizy Editor Config by passing its ID as the second argument. The optional third argument controls the maximum number of diagnostic samples:

```shell
php craft vizy/convert/analyze articleBody article 50
```

The plan has one of three statuses:

- `ready` means every populated value converted without a lossy diagnostic.
- `requires-review` means Vizy retained readable content but could not represent some source markup exactly.
- `blocked` means at least one value could not be converted and must be resolved before the field can change.

Custom CKEditor or Redactor styles do not automatically become Vizy extensions. Adjust the source, choose an Editor Config with the required capability, or register a custom HTML import rule before proceeding. Run the analysis again after any change and keep its `planHash` with your migration notes.

## Convert Locally

For a `ready` plan, run:

```shell
php craft vizy/convert/field articleBody
```

Vizy runs the analysis again, changes the field type through Project Config, writes a migration to the project’s configured content-migration directory, applies it locally, and verifies the resulting documents. The generated migration contains stable field, layout, Editor Config, and policy identities. It does not contain environment-specific entry content.

The conversion defaults to strict mode. If the plan is `requires-review`, the command refuses to write. After reviewing every diagnostic and accepting the documented fallbacks, opt in explicitly:

```shell
php craft vizy/convert/field articleBody --allowLossy
```

Do not use `--allowLossy` merely to bypass an unfamiliar diagnostic. Confirm the affected source paths and resulting editor content first. Unresolved images, unsupported attributes, disabled marks, and custom elements may preserve text while losing presentation or references.

If any write or verification fails, the content transaction rolls back and the command restores the source field definition. A failed generated migration is removed so it cannot be committed accidentally.

## Check and Commit the Result

After the command succeeds:

1. Open representative entries for every reported site and placement, then save and reopen them.
2. Check the rendered frontend output as well as the control-panel editor.
3. Review the generated migration and Project Config diff. Confirm that both identify the same field UID and Editor Config.
4. Commit the generated content migration and Project Config changes together.

The local migration is recorded in Craft’s content-migration history. Running the command again against the converted field is unnecessary; the generated migration itself is idempotent when it encounters canonical Vizy values.

## Deploy the Conversion

Deploy the code, Project Config, and generated migration together, then run:

```shell
php craft up
```

Craft applies Project Config before content migrations. The field therefore becomes a Vizy field before the generated migration converts that environment’s own HTML values. The migration refuses to run if the field, Editor Config, captured placement map, or conversion policy no longer matches the reviewed plan.

Back up each environment before running `craft up`. Afterward, repeat the entry, site, editor, and rendered-output checks used locally.

## Restore Source Content

Each changed root document receives an immutable recovery record whose reason starts with `rich-text-conversion:` followed by the plan hash. Find the records for an affected owner with:

```shell
php craft vizy/recovery/index {ownerId}
```

Restoring a conversion requires both the original field definition and the captured HTML. In a maintenance environment, first restore the selected recovery record while the field is still Vizy, then restore the CKEditor or Redactor field definition from the same pre-conversion Project Config revision. Do not leave restored HTML active under a Vizy field definition.

Content migrations intentionally do not implement automatic rollback because reverting only the values or only the field type would leave the project inconsistent. See [Content Recovery](docs:developers/content-recovery) for record selection and restore behaviour.
