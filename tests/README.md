# Testing

Install [DDEV](https://docs.ddev.com/en/stable/users/install/ddev-installation/)
and a supported Docker provider (OrbStack works on macOS). From this plugin's
checkout, run:

```sh
ddev test
ddev test --filter='a test name'
ddev test --suite=all
ddev test --suite=performance
```

The command starts the dedicated test project, installs dependencies inside DDEV,
creates a clean Craft application, installs this checkout as a Composer path
dependency, seeds plugin fixtures and runs Pest. No separate Craft site, host PHP,
host Composer, database setup or `.env.testing` file is required. The root Composer
`test` aliases call this same command if you already have Composer on your host.

Tests run against real Craft. The PHPUnit XML discovers PHP tests; the suite
manifest in `tests/runtime/suite.json` defines intentional group exclusions.
The default excludes slow, performance, large-performance and migration-plugin
groups. Some plugins have additional suites listed in that manifest. Test files
named `Unit` may still rely on the Craft application.

Each invocation rebuilds database, project configuration and storage under
`.cache/verbb-tests/app`. Dependencies are cached between runs. The generated app
loads the plugin from this checkout; developer `.env` files and paired sites are
not used. Tests must not be pointed at an external database. Run serially; parallel
workers are rejected until they have independent state.

The DDEV project name is stable. Re-running tests does not allocate another
project. Use `ddev stop` when finished; use `ddev delete` from this checkout to
remove this dedicated project's containers and database volume. The next test run
recreates its baseline. Keep reports before deleting generated files.

Results and combined setup/test output are written to `.cache/verbb-tests/result.json`
and `.cache/verbb-tests/latest.log`; Craft logs remain in the generated app's
storage. A failed setup exits nonzero and does not run tests against partial state.

The runtime scaffold is committed with the plugin, so no private Verbb tooling or
sibling checkout is needed. Plugin-specific test fixtures belong in this repository.
Do not add database/schema repair to the PHPUnit bootstrap: fresh installation must
work through the normal Craft/plugin installation path first.

The initial runtime is PHP 8.3 and MySQL 8.0. This environment is not a claim of
complete coverage for every supported Craft/PHP/database version. Compatibility
matrix expansion must validate the actual runtime and fixture behavior.

The test application's dependency baseline is versioned in `tests/runtime/composer.lock`.
Use `ddev test --update-lock` when intentionally updating that baseline, and review
the lock diff alongside the test results. This does not update the plugin's root lock.
JUnit results are available in `.cache/verbb-tests/junit.xml`. Tests exceeding 60 seconds
are reported as failures; annotate genuinely long-running tests with PHPUnit size metadata.

Existing performance-report and baseline-maintenance aliases also provision through
this runner, using the named `--task=` entries in `suite.json`. These explicitly
requested maintenance tasks report `completed-task`, not a passing Pest suite.

Frontend contracts and browser tests use the checked-in Node dependency lock:

```sh
npm ci
npm run typecheck
npm test
npm run build
npx playwright install chromium firefox webkit
npm run test:browser -- --workers=4
npm run test:cp
```

The browser harness exercises compiled editor assets in Chromium, Firefox and
WebKit. `test:cp` additionally builds assets, provisions the disposable Craft app,
logs in through Craft, and exercises real field widgets and HTTP middleware in
Chromium. It checks canonical content after save/reopen and failed validation,
asset metadata privacy, and dedicated relation, Matrix and draft journeys. It holds the runtime's exclusive lock until the browser finishes;
do not run the PHP suite concurrently against that same DDEV project. The seeded
accounts and public web entry point are only for this owned test application.

The harness runs tests tagged `@performance` in separate browser projects after the functional tests, with one engine at a time. This keeps other test workers from distorting wall-clock budgets while retaining parallel functional coverage. To repeat a timing check in isolation, use `npm run test:browser -- --project=firefox-performance --no-deps --repeat-each=3`; avoid running other test workloads alongside it.

CI runs the complete ordinary PHP suite (including slow and performance groups),
frontend contracts, all three harness browsers, and the real Craft browser lane.
The explicit `perf-large` and `migrate-plugins` groups remain separate workloads;
a green default CI run does not certify those or additional runtime versions.

Contract fixtures are reviewed expected outputs, not snapshots to refresh blindly.
`block-hashes.json` is consumed by both PHP and TypeScript and includes independent
canonical JSON and SHA-256 expectations. The manifest fixture must match the real
PHP producer and must be consumable by the browser schema and toolbar commands.
For regression tests, assert the protected result as well as the absence of an
error; query budgets must also prove content was rendered or persisted correctly.
