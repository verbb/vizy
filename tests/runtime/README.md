# Runtime qualification

Run `ddev test --suite=all --fail-on-skipped` from the plugin checkout for the retained dependency set. The runner owns an exclusive lock and recreates only this plugin’s disposable Craft installation. Do not run it against a development or customer site.

Two additional CI profiles exercise existing tests at distinct integration boundaries:

- `--profile=minimum` requires actual PHP 8.2, resolves Craft 5.9.0 exactly and runs all ordinary tests. All PHP child processes inherit the selected PHP binary. On an already-running DDEV environment that provides `php8.2`, use `ddev exec php8.2 tests/runtime/run.php --profile=minimum --suite=all --fail-on-skipped`.
- `--profile=feed-me` installs Feed Me 6 and includes the `feed-me` test group. It verifies the registered field mapping path, HTML and canonical JSON parsing, owner saving and readback, and rejection of nodes disabled by the Editor Config. Run `ddev test --profile=feed-me --suite=all --fail-on-skipped`.

Qualification profiles resolve their own dependencies without changing `tests/runtime/composer.lock`. CI retains the resolved lock, JUnit and runtime versions as evidence. The next default run restores the retained dependency set.

Craft 5.9.0 has published security advisories. The minimum profile explicitly permits historical dependencies **only in this disposable compatibility installation** and retains a separate Composer audit in `minimum-advisories.json`. A passing compatibility run is not a security qualification of that historical release. Normal and Feed Me dependency resolution keep Composer’s security blocking enabled.

`npm run test:cp` builds the production assets and provisions a disposable Craft CP. Its runtime lease lasts until Playwright finishes. Browser assertions read saved content and uploaded file bytes through a separate PHP process, then reopen the editor. This suite must run separately from the PHP profiles.

The `hyper` qualification profile tests both current container APIs without changing
this runtime's default lock. Mount a Hyper source checkout read-only into the DDEV
web container, then run `ddev exec env HYPER_SOURCE_PATH=/path/in/container php
tests/runtime/run.php --profile=hyper --filter='raw API|composes both'`. The profile
resolves the mounted Composer path dependency and installs Hyper through Craft in
the integration fixture. Default profiles exclude the `content-api-integration`
group; missing Hyper setup in the explicit profile is a failure.
