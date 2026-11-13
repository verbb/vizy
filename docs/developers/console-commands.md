# Console Commands

Vizy includes console commands you can run from your Craft project’s directory.

Options can be written in kebab case, such as `--dry-run`, or camel case, such as `--dryRun`. Commands that print JSON put it after a short human-readable summary, so you can pipe the output into scripts.

## Matrix Anchors

::: reference
### `vizy/anchors/backfill`

Gives Matrix content inside Vizy blocks its own owner where older content still relies on the Matrix data stored in the document. Run it after an upgrade, or when [Content Recovery](docs:developers/content-recovery) reports shared Matrix references. The command checks every element type on every site, resaves only the element and site rows that need a backfill, and preserves their last-updated dates. Its counts refer to element and site rows, so a multisite element can appear more than once.

| Option | Description | Default |
| --- | --- | --- |
| `--dry-run` | Lists the rows that would be saved without saving them. | `false` |
| `--element-id` | Only checks the element with this ID. | All elements |
| `--site` | Only checks this site handle. | All sites |
| `--drafts` | Includes drafts and provisional drafts. | `false` |
| `--revisions` | Includes revisions. | `false` |
| `--trashed` | Includes trashed elements. | `false` |
| `--limit` | Stops after checking this many element and site rows. | No limit |
| `--batch-size` | How many elements to load from the database at a time. | `100` |

```shell
php craft vizy/anchors/backfill --dry-run
php craft vizy/anchors/backfill --site=default --element-id=123
php craft vizy/anchors/backfill --drafts --revisions --trashed
```

[Matrix in Vizy Blocks](docs:developers/matrix-in-vizy-blocks#backfill-existing-content) explains when a backfill is needed and how to check the result.
:::

## Content Repair

::: reference
### `vizy/content/fix-vizy-block-field-uids`

Repairs block content saved in the Vizy 3 block format whose field values are keyed by a field UID instead of a field handle. For each value Vizy can't match to a field in the Block Type's layout, the command shows a preview of the content and asks you to choose the field it belongs to, then remembers that choice for the same UID. Run it interactively, and back up your database first, because it writes directly to the content table.

```shell
php craft vizy/content/fix-vizy-block-field-uids
```
:::

## Rich Text Conversion

These commands are the console equivalents of the guided migrations in **Settings → Vizy → Migrations**. [Migrating Rich Text Fields](docs:user-guides/migrating-rich-text-fields) walks through the complete process, including how to review the plans they print.

::: reference
### `vizy/convert/analyze`

Analyses a CKEditor or Redactor field before converting it to Vizy, and prints the JSON plan. It doesn't change Project Config or content. The command exits with an error code when the plan's status is `blocked`.

| Argument | Description | Default |
| --- | --- | --- |
| `field` | The handle of the CKEditor or Redactor field. | Required |
| `editorConfig` | The ID of the Vizy Editor Config the converted field will use. | `standard` |
| `samples` | The maximum number of diagnostic samples to include. | `25` |

```shell
php craft vizy/convert/analyze articleBody
php craft vizy/convert/analyze articleBody article 50
```
:::

::: reference
### `vizy/convert/field`

Converts a CKEditor or Redactor field to Vizy. It changes the field type through Project Config, writes a content migration to your project's content migration folder, applies it locally and verifies the result. It takes the same arguments as `vizy/convert/analyze`.

| Option | Description | Default |
| --- | --- | --- |
| `--allow-lossy` | Converts a field whose plan is `requires-review`, accepting the listed representation loss. | `false` |

```shell
php craft vizy/convert/field articleBody
php craft vizy/convert/field articleBody --allow-lossy
```
:::

::: reference
### `vizy/convert/analyze-from-vizy`

Analyses copying a Vizy field into an existing Plain Text, CKEditor or Redactor field, and prints the JSON plan without changing anything. The command exits with an error code when the plan's status is `blocked`.

| Argument | Description | Default |
| --- | --- | --- |
| `source` | The handle or UID of the Vizy field. | Required |
| `destination` | The handle or UID of the existing destination field. | Required |
| `samples` | The maximum number of diagnostic samples to include. | `25` |

```shell
php craft vizy/convert/analyze-from-vizy articleBody articleBodyCkeditor
```
:::

::: reference
### `vizy/convert/from-vizy`

Copies a Vizy field's content into an existing Plain Text, CKEditor or Redactor field and writes a content migration for the copy. The Vizy field and both field definitions stay unchanged. It takes the same arguments as `vizy/convert/analyze-from-vizy`.

| Option | Description | Default |
| --- | --- | --- |
| `--allow-lossy` | Copies content the destination field can't fully represent, accepting the listed changes. | `false` |

```shell
php craft vizy/convert/from-vizy articleBody articleBodyCkeditor --allow-lossy
```
:::

## Content Recovery

[Content Recovery](docs:developers/content-recovery) explains what recovery records contain and how to check a restored field.

::: reference
### `vizy/recovery/index`

Lists Vizy's recovery records as JSON, newest first, for every owner or for one owner element ID.

```shell
php craft vizy/recovery/index
php craft vizy/recovery/index 123
```
:::

::: reference
### `vizy/recovery/restore`

Restores one recovery record by its ID. It replaces that Vizy field and its nested content across the record's sites, leaving the owner's other fields unchanged, and captures the content it replaces as a new record.

```shell
php craft vizy/recovery/restore 456
```
:::

::: reference
### `vizy/recovery/prune`

Deletes older records captured automatically when an owner is saved, keeping the newest ones for each owner and Vizy field. Records captured before operations such as upgrades, conversions and ownership repairs are always kept.

| Argument | Description | Default |
| --- | --- | --- |
| `keep` | How many automatic records to keep for each owner and field. | `10` |
| `ownerId` | Only prunes the records for this owner element ID. | All owners |

```shell
php craft vizy/recovery/prune
php craft vizy/recovery/prune 5 123
```
:::

## Vizy 3 Upgrade

Craft's plugin migration upgrades Vizy 3 fields automatically. These commands expose the same upgrade for diagnosis, custom deployments and recovery work. The [upgrade guide](docs:get-started/upgrading-from-v3#advanced-migration) explains when to use them and the format of plan and owner-scope files.

Commands that write ask for confirmation and default to no. In a non-interactive deployment you must pass `--force`, so only do that after reviewing the plan.

::: reference
### `vizy/migrations/upgrade-from-v3`

Checks the installation for Vizy 3 fields and upgrades them. When an earlier upgrade didn't finish, the command resumes it instead. It stops with an error when the analysis isn't ready or when more than one unfinished upgrade exists.

| Option | Description | Default |
| --- | --- | --- |
| `--dry-run` | Prints the analysis, or the unfinished upgrade it would resume, without writing anything. | `false` |
| `--force` | Writes without asking for confirmation. | `false` |

```shell
php craft vizy/migrations/upgrade-from-v3 --dry-run
php craft vizy/migrations/upgrade-from-v3 --force
```
:::

::: reference
### `vizy/migrations/upgrade-analyze`

Analyses every Vizy 3 field in the current Project Config and prints the upgrade plan without writing anything. By default each Vizy 3 block type keeps its handle as a shared Block Type. When a handle isn't valid, or you want a different one, pass a JSON file as the optional argument that maps `{fieldUid}:{blockTypeId}` keys to the Block Type handles to use instead.

```shell
php craft vizy/migrations/upgrade-analyze
php craft vizy/migrations/upgrade-analyze path/to/handles.json
```
:::

::: reference
### `vizy/migrations/upgrade-dry-run`

Checks a saved upgrade plan, and an optional owner-scope file, without writing anything. Both arguments are paths to JSON files and accept Craft aliases.

```shell
php craft vizy/migrations/upgrade-dry-run path/to/plan.json path/to/owners.json
```
:::

::: reference
### `vizy/migrations/upgrade-apply`

Applies a saved upgrade plan and owner-scope file. It writes Project Config and converts the owner content the scope file lists.

| Option | Description | Default |
| --- | --- | --- |
| `--force` | Writes without asking for confirmation. | `false` |

```shell
php craft vizy/migrations/upgrade-apply path/to/plan.json path/to/owners.json
```
:::

::: reference
### `vizy/migrations/upgrade-status`

Lists upgrade runs with their status, stage, last error and next step. Pass a run UID to show one run.

```shell
php craft vizy/migrations/upgrade-status
```
:::

::: reference
### `vizy/migrations/upgrade-resume`

Resumes an unfinished upgrade run from its last completed stage.

| Option | Description | Default |
| --- | --- | --- |
| `--force` | Writes without asking for confirmation. | `false` |

```shell
php craft vizy/migrations/upgrade-resume a1b2c3d4-e5f6-7890-abcd-ef1234567890
```
:::

## Owner Migration

These low-level commands convert the content of one Vizy field on one owner, using a mapping file. [Converting a Single Owner](docs:get-started/upgrading-from-v3#converting-a-single-owner) describes the mapping format.

::: reference
### `vizy/migrations/owner`

Analyses converting one owner's Vizy field, and applies it when you pass `--apply=1`. The arguments are the owner's element type class, element ID and site ID, the Vizy field's UID and the path to the mapping file.

| Option | Description | Default |
| --- | --- | --- |
| `--apply` | Writes the converted content. Without it, the command only analyses. | `false` |
| `--force` | Writes without asking for confirmation. | `false` |
| `--owner-placement-uid` | The field layout element UID, for a field placed more than once in the owner's layout. | None |
| `--run-uid` | Records the conversion against this run UID. | None |

```shell
php craft vizy/migrations/owner "craft\elements\Entry" 123 1 a1b2c3d4-e5f6-7890-abcd-ef1234567890 path/to/mapping.json
php craft vizy/migrations/owner "craft\elements\Entry" 123 1 a1b2c3d4-e5f6-7890-abcd-ef1234567890 path/to/mapping.json --apply=1
```
:::

::: reference
### `vizy/migrations/status`

Lists owner migration checkpoints with their next step. Pass a run UID to show the checkpoints for one run.

```shell
php craft vizy/migrations/status
```
:::

::: reference
### `vizy/migrations/resume`

Resumes an owner migration from a checkpoint ID listed by `vizy/migrations/status`.

| Option | Description | Default |
| --- | --- | --- |
| `--force` | Writes without asking for confirmation. | `false` |

```shell
php craft vizy/migrations/resume 42
```
:::
