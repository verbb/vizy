# Runtime qualification

Run `ddev test --suite=all --fail-on-skipped` from the plugin checkout for the retained dependency set. The runner owns an exclusive lock and recreates only this plugin’s disposable Craft installation. Do not run it against a development or customer site.

Two additional CI profiles exercise existing tests at distinct integration boundaries:

- `--profile=minimum` requires actual PHP 8.2, resolves Craft 5.9.0 exactly and runs all ordinary tests. All PHP child processes inherit the selected PHP binary. On an already-running DDEV environment that provides `php8.2`, use `ddev exec php8.2 tests/runtime/run.php --profile=minimum --suite=all --fail-on-skipped`.
- `--profile=feed-me` installs Feed Me 6 and includes the `feed-me` test group. It verifies the registered field mapping path, HTML and canonical JSON parsing, owner saving and readback, and rejection of nodes disabled by the Editor Config. Run `ddev test --profile=feed-me --suite=all --fail-on-skipped`.

Qualification profiles resolve their own dependencies without changing `tests/runtime/composer.lock`. CI retains the resolved lock, JUnit and runtime versions as evidence. The next default run restores the retained dependency set.

Craft 5.9.0 has published security advisories. The minimum profile explicitly permits historical dependencies **only in this disposable compatibility installation** and retains a separate Composer audit in `minimum-advisories.json`. A passing compatibility run is not a security qualification of that historical release. Normal and Feed Me dependency resolution keep Composer’s security blocking enabled.

`npm run test:cp` builds the production assets and provisions a disposable Craft CP. Its runtime lease lasts until Playwright finishes. Browser assertions read saved content and uploaded file bytes through a separate PHP process, then reopen the editor. This suite must run separately from the PHP profiles.

Use `ddev test --profile=matrix-integrations --filter=MatrixIntegrations` for Matrix with Neo 5, Hyper 2, Typed Link 3, and Super Table 4. This profile installs those packages in the disposable app and checks nested owners, copies, drafts, removal, backfill, and link values inside Matrix rows and beside Matrix in Vizy blocks. It records the resolved package versions without changing the retained default lock. For real control-panel edits inside Vizy, Neo and Super Table, run `node tests/browser-cp/run.mjs --profile=matrix-integrations matrix-integrations.spec.ts`. The browser checks canonical isolation during autosave, publication and reopen, with Hyper and Typed Link inside Matrix rows and beside Matrix. The Hyper checks edit without a startup delay, inspect the submitted value in the same input event, test clearing and restoring values, and verify retention after failed owner validation. An additional case publishes immediately after editing without waiting for autosave. Released Hyper 2.3.13 fails the immediate-value regression; to qualify the pending Hyper fix, mount its source read-only and set `HYPER_SOURCE_PATH` inside the DDEV web container. The Matrix integration profile then resolves that source as a Composer path dependency.

The ordinary Matrix selection includes separate-process creation and independent-draft saves. The scale test is in the performance group: run `ddev test --suite=all --filter=Matrix`. It reports local timings and query counts for up to 100 blocks / 300 rows. Simultaneous first writes to the same new block can collide on MySQL, including ordinary `saveElement()` calls: Craft opens a transaction before the anchor is created. A database mutex alone does not refresh that transaction’s snapshot. The tests verify a complete retry in a fresh request/transaction, consistent anchor ownership, and no partial elements. Existing-row concurrent saves are tested separately. Vizy does not automatically retry arbitrary owner saves.

The `hyper` qualification profile tests both current container APIs without changing
this runtime's default lock. Mount a Hyper source checkout read-only into the DDEV
web container, then run `ddev exec env HYPER_SOURCE_PATH=/path/in/container php
tests/runtime/run.php --profile=hyper --filter='raw API|composes both'`. The profile
resolves the mounted Composer path dependency and installs Hyper through Craft in
the integration fixture. Default profiles exclude the `content-api-integration`
group; missing Hyper setup in the explicit profile is a failure.

## PostgreSQL

The DDEV project includes a separate `matrix-pgsql` PostgreSQL 16 service. Start the project normally, then run `ddev test --database=pgsql --suite=all --filter=Matrix --fail-on-skipped`. The runner selects fixed project-owned database coordinates and resets only that service’s disposable `db` schema. It does not switch or erase the project’s MySQL database. The next run defaults to MySQL. Both databases share the test app and its exclusive runtime lock, so run profiles serially and retain each result before the next run.

## Browser Submission Timing

`node tests/browser-cp/run.mjs matrix-scale.spec.ts` checks 30 blocks / 90 rows through both awaited autosave and immediate publication. It verifies every saved value using a separate PHP process and then reopens the editor. Craft 5.11.1 and 5.11.3 can reject pending Matrix layout updates during submission, including a secondary undefined rejection from `Craft.Queue`. These content-preservation tests retain browser errors in `browser-errors.json` artifacts rather than failing solely on native Craft diagnostics. A passing result establishes exact saved content and reopen behaviour; it does not claim an error-free native Matrix console.
