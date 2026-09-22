<?php

declare(strict_types=1);

// Repository-owned scaffold: no private workspace dependency is needed to run it.
$root = dirname(__DIR__, 2);
chdir($root);
$package = json_decode(file_get_contents($root . '/composer.json'), true, 512, JSON_THROW_ON_ERROR);
$config = json_decode(file_get_contents(__DIR__ . '/suite.json'), true, 512, JSON_THROW_ON_ERROR);
$project = getenv('DDEV_SITENAME');
if (getenv('IS_DDEV_PROJECT') !== 'true' || $project !== $config['project']) {
    throw new RuntimeException('Refusing to reset outside this plugin’s dedicated DDEV test project.');
}
$runtime = $root . '/.cache/verbb-tests';
foreach (['.cache', '.cache/verbb-tests', '.cache/verbb-tests/app', 'tests/runtime/web/cpresources'] as $relative) {
    $path = $root . '/' . $relative;
    if (is_link($path)) {
        throw new RuntimeException('Refusing symlinked runtime path: ' . $relative);
    }
    if (!is_dir($path) && !mkdir($path, 0775, true) && !is_dir($path)) {
        throw new RuntimeException('Cannot create runtime directory.');
    }
}
$lock = fopen($runtime . '/run.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
    throw new RuntimeException('Another test run owns this environment.');
}
$owner = ['project' => $project, 'source' => realpath($root)];
$ownerFile = $runtime . '/owner.json';
if (is_file($ownerFile) && json_decode(file_get_contents($ownerFile), true) !== $owner) {
    throw new RuntimeException('Runtime ownership mismatch.');
}
file_put_contents($ownerFile, json_encode($owner, JSON_PRETTY_PRINT));
file_put_contents($runtime . '/result.json', json_encode(['status' => 'running', 'startedAt' => gmdate(DATE_ATOM)]));
@unlink($runtime . '/junit.xml');
try {
    $args = array_slice($argv, 1);
    $suite = 'default';
    $updateLock = false;
    $task = null;
    $profile = 'default';
    $database = 'mysql';
    foreach ($args as $i => $arg) {
        if (str_starts_with($arg, '--database=')) {
            $database = substr($arg, 11);
            unset($args[$i]);
        }
        if (str_starts_with($arg, '--profile=')) {
            $profile = substr($arg, 10);
            unset($args[$i]);
        }
        if (str_starts_with($arg, '--task=')) {
            $task = substr($arg, 7);
            unset($args[$i]);
        }
        if ($arg === '--update-lock') {
            $updateLock = true;
            unset($args[$i]);
        }
        if (str_starts_with($arg, '--suite=')) {
            $suite = substr($arg, 8);
            unset($args[$i]);
        }
        if ($arg === '--parallel' || str_starts_with($arg, '--processes')) {
            throw new RuntimeException('Parallel workers require independent runtime state and are not enabled.');
        }
    }
    if ($task !== null && !isset($config['tasks'][$task])) {
        throw new RuntimeException('Unknown maintenance task: ' . $task);
    }
    if (!in_array($database, ['mysql', 'pgsql'], true)) throw new RuntimeException('Unknown test database.');
    // Both choices name fixed services owned by this dedicated test project.
    // Never accept an arbitrary database DSN or credentials from the environment.
    $databaseConfig = ['driver' => $database, 'server' => $database === 'pgsql' ? 'matrix-pgsql' : 'db', 'port' => $database === 'pgsql' ? '5432' : '3306', 'database' => 'db', 'user' => 'db', 'password' => 'db'];
    file_put_contents($runtime . '/database.json', json_encode($databaseConfig));
    if (!isset($config['suites'][$suite])) {
        throw new RuntimeException('Unknown suite: ' . $suite);
    }
    if (!in_array($profile, ['default', 'minimum', 'feed-me', 'hyper', 'matrix-integrations'], true)) {
        throw new RuntimeException('Unknown runtime profile: ' . $profile);
    }
    if ($profile === 'minimum' && PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION !== '8.2') {
        throw new RuntimeException('Minimum qualification must actually execute PHP 8.2.');
    }
    if ($profile !== 'default' && $updateLock) {
        throw new RuntimeException('Qualification profiles must not overwrite the default runtime lock.');
    }
    $log = fopen($runtime . '/latest.log', 'w');
    $run = static function(array $command, ?string $cwd = null) use ($root, $log): void {
        if ($command[0] === 'php') $command[0] = PHP_BINARY;
        $process = proc_open($command, [0 => STDIN, 1 => ['pipe', 'w'], 2 => ['redirect', 1]], $pipes, $cwd ?? $root);
        if (!is_resource($process)) {
            throw new RuntimeException('Unable to start ' . $command[0]);
        }
        while (!feof($pipes[1])) {
            $chunk = fread($pipes[1], 8192);
            echo $chunk;
            fwrite($log, $chunk);
        }
        fclose($pipes[1]);
        $code = proc_close($process);
        if ($code !== 0) {
            throw new RuntimeException($command[0] . ' failed with exit code ' . $code);
        }
    };
    // Only generated app files are reset. Symlinks are removed, never followed.
    $remove = static function(string $path) use (&$remove): void {
        if (is_link($path) || is_file($path)) {
            unlink($path);
        } elseif (is_dir($path)) {
            foreach (new FilesystemIterator($path) as $item) {
                $remove($item->getPathname());
            }
            rmdir($path);
        }
    };
    $app = $runtime . '/app';
    $dev = $package['require-dev'] ?? [];
    $requirements = array_merge($dev, [$package['name'] => '*']);
    if ($profile === 'minimum') $requirements['craftcms/cms'] = '5.9.0';
    if ($profile === 'feed-me') $requirements['craftcms/feed-me'] = '^6.0';
    if ($profile === 'matrix-integrations') {
        $requirements['spicyweb/craft-neo'] = '^5.0';
        $requirements['verbb/hyper'] = '^2.0';
        $requirements['sebastianlenz/linkfield'] = '^3.0';
        $requirements['verbb/super-table'] = '^4.0';
    }
    $manifest = [
        'name' => 'verbb/plugin-test-app', 'type' => 'project',
        'require' => $requirements,
        'repositories' => [['type' => 'path', 'url' => '../../..', 'options' => ['symlink' => true, 'reference' => 'config']]],
        'minimum-stability' => 'dev', 'prefer-stable' => true,
        'autoload-dev' => ['psr-4' => ['Tests\\' => '../../../tests/']],
        'config' => ['allow-plugins' => ['craftcms/plugin-installer' => true, 'pestphp/pest-plugin' => true, 'yiisoft/yii2-composer' => true]],
    ];
    if ($profile === 'hyper' || ($profile === 'matrix-integrations' && getenv('HYPER_SOURCE_PATH'))) {
        $source = getenv('HYPER_SOURCE_PATH');
        if (!$source || !is_file($source . '/composer.json')) throw new RuntimeException('Hyper profile requires HYPER_SOURCE_PATH inside DDEV.');
        $manifest['require']['verbb/hyper'] = '*';
        $manifest['repositories'][] = ['type' => 'path', 'url' => $source, 'options' => ['symlink' => true]];
    }
    if ($profile === 'minimum') $manifest['config']['platform']['php'] = '8.2.0';
    file_put_contents($app . '/composer.json', json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");
    // Qualification profiles resolve independently without changing the retained default lock.
    if ($profile !== 'default') @unlink($app . '/composer.lock');
    if ($profile === 'default' && is_file(__DIR__ . '/composer.lock')) {
        copy(__DIR__ . '/composer.lock', $app . '/composer.lock');
    }
    // The exact historical floor has known Craft advisories. Only this disposable
    // compatibility profile permits its installation; record the audit separately.
    $run(['composer', ($updateLock || $profile !== 'default') ? 'update' : 'install', '--no-interaction', '--prefer-dist', '--no-progress', ...($profile === 'minimum' ? ['--no-security-blocking'] : [])], $app);
    if ($profile === 'minimum') {
        $audit = proc_open(['composer', 'audit', '--format=json', '--no-interaction'],
            [0 => STDIN, 1 => ['file', $runtime . '/minimum-advisories.json', 'w'], 2 => STDERR], $auditPipes, $app);
        $auditStatus = is_resource($audit) ? proc_close($audit) : -1;
        if ($auditStatus < 0 || $auditStatus > 3 || !is_array(json_decode((string)file_get_contents($runtime . '/minimum-advisories.json'), true))) {
            throw new RuntimeException('Unable to record minimum-runtime dependency advisories.');
        }
    }
    if ($updateLock) {
        copy($app . '/composer.lock', __DIR__ . '/composer.lock');
    }
    foreach (['config', 'storage', 'web'] as $name) {
        $remove($app . '/' . $name);
        mkdir($app . '/' . $name, 0775, true);
    }
    foreach (glob($root . '/tests/_craft/config/*.php') as $source) {
        if (basename($source) !== 'db.php') {
            copy($source, $app . '/config/' . basename($source));
        }
    }
    $originalAppConfig = is_file($app . '/config/app.php') ? file_get_contents($app . '/config/app.php') : "<?php return [];";
    file_put_contents($app . '/config/plugin-tests.php', $originalAppConfig);
    // Avoid remote license-info lookups in a synthetic installation and use real DB locking.
    file_put_contents($app . '/config/app.php', <<<'PHP'
<?php
$config = require __DIR__ . '/plugin-tests.php';
unset($config['components']['mutex']);
$config['baseApiUrl'] = 'http://127.0.0.1:9/';
// Craft 5.9 only wires this component in web requests; our console fixtures
// render real CP fields and need that same Craft asset manager.
$config['components']['assetManager'] = static fn() => Craft::createObject(\craft\helpers\App::assetManagerConfig());
return $config;
PHP
    );
    file_put_contents($app . '/config/db.php', "<?php\nreturn " . var_export($databaseConfig, true) . ";\n");
    // Use the same published-resource directory in console and browser fixtures.
    file_put_contents($app . '/config/general.php', "<?php\nreturn \\craft\\config\\GeneralConfig::create()->devMode(true)->allowAdminChanges(true)->timezone('UTC')->resourceBasePath(CRAFT_WEB_ROOT . '/cpresources')->resourceBaseUrl('/cpresources');\n");
    // DDEV's DB container is unique to the validated project; credentials never come from .env.
    $db = new PDO($database . ':host=' . $databaseConfig['server'] . ';port=' . $databaseConfig['port'] . ';dbname=db', 'db', 'db', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    if ($database === 'pgsql') {
        $db->exec('DROP SCHEMA public CASCADE');
        $db->exec('CREATE SCHEMA public');
    } else {
        $db->exec('SET FOREIGN_KEY_CHECKS=0');
        foreach ($db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN) as $table) {
            $db->exec('DROP TABLE `' . str_replace('`', '``', $table) . '`');
        }
        $db->exec('SET FOREIGN_KEY_CHECKS=1');
    }
    $run(['php', 'tests/runtime/craft.php', 'install/craft', '--interactive=0', '--username=admin', '--email=admin@example.test', '--password=testing-only-password', '--siteName=Plugin Tests', '--siteUrl=https://' . $project . '.ddev.site', '--language=en-US']);
    $run(['php', 'tests/runtime/craft.php', 'plugin/install', $package['extra']['handle'], '--interactive=0']);
    if ($profile === 'feed-me') {
        $run(['php', 'tests/runtime/craft.php', 'plugin/install', 'feed-me', '--interactive=0']);
    }
    $run(['php', 'tests/runtime/verify.php']);
    if ($suite === 'migration' && is_file($root . '/tests/bin/test-setup-migrate-plugins.php')) {
        $run(['php', 'tests/bin/test-setup-migrate-plugins.php']);
    }
    if (is_file(__DIR__ . '/seed.php')) {
        $run(['php', 'tests/runtime/seed.php']);
    }
    if ($task !== null) {
        $run(['php', $config['tasks'][$task], ...array_values($args)]);
        file_put_contents($runtime . '/result.json', json_encode(['status' => 'completed-task', 'task' => $task, 'finishedAt' => gmdate(DATE_ATOM)]));
        exit(0);
    }
    $suiteArgs = $config['suites'][$suite];
    $excluded = $profile === 'feed-me' ? [] : ['feed-me'];
    foreach ($suiteArgs as $i => $argument) {
        if (str_starts_with($argument, '--exclude-group=')) {
            $excluded[] = substr($argument, 16);
            unset($suiteArgs[$i]);
        }
    }
    if ($excluded !== []) $suiteArgs[] = '--exclude-group=' . implode(',', $excluded);
    @unlink($runtime . '/junit.xml');
    if ($profile !== 'hyper') $suiteArgs[] = '--exclude-group=content-api-integration';
    if ($profile !== 'matrix-integrations') $suiteArgs[] = '--exclude-group=matrix-integrations';
    $run(['php', '-d', 'memory_limit=1G', 'tests/runtime/pest.php', '--fail-on-empty-test-suite', '--fail-on-risky', '--enforce-time-limit', ...(array_filter($args, static fn($arg) => str_starts_with($arg, '--default-time-limit')) ? [] : ['--default-time-limit=60']), '--configuration', 'phpunit.craft.xml', '--log-junit', $runtime . '/junit.xml', ...array_values($suiteArgs), ...array_values($args)]);
    // An application exit(0) inside a test must not masquerade as a completed suite.
    $report = is_file($runtime . '/junit.xml') ? simplexml_load_file($runtime . '/junit.xml') : false;
    if (!$report || (int)$report->testsuite['tests'] < 1) {
        throw new RuntimeException('Pest exited without a completed, non-empty JUnit report.');
    }
    echo 'Completed ' . (int)$report->testsuite['tests'] . ' tests; ' . (int)$report->testsuite['assertions'] . " assertions.\n";
    $counts = [];
    foreach (['tests', 'assertions', 'errors', 'failures', 'skipped'] as $key) {
        $counts[$key] = (int)$report->testsuite[$key];
    }
    $versions = ['php' => PHP_VERSION, 'database' => $database, 'databaseVersion' => $db->getAttribute(PDO::ATTR_SERVER_VERSION)];
    foreach (json_decode(file_get_contents($app . '/composer.lock'), true)['packages'] as $dependency) {
        if (in_array($dependency['name'], ['craftcms/cms', 'craftcms/feed-me', 'pestphp/pest', 'phpunit/phpunit', 'spicyweb/craft-neo', 'verbb/hyper', 'verbb/super-table', 'sebastianlenz/linkfield'], true)) {
            $versions[$dependency['name']] = $dependency['version'];
        }
    }
    file_put_contents($runtime . '/result.json', json_encode(['counts' => $counts, 'versions' => $versions, 'status' => 'passed', 'arguments' => array_values($args), 'suite' => $suite, 'profile' => $profile, 'finishedAt' => gmdate(DATE_ATOM)], JSON_PRETTY_PRINT));
} catch (Throwable $error) {
    $counts = [];
    $report = is_file($runtime . '/junit.xml') ? @simplexml_load_file($runtime . '/junit.xml') : false;
    if ($report) {
        foreach (['tests', 'assertions', 'errors', 'failures', 'skipped'] as $key) {
            $counts[$key] = (int)$report->testsuite[$key];
        }
    }
    file_put_contents($runtime . '/result.json', json_encode(['status' => 'failed', 'counts' => $counts, 'arguments' => array_values($args), 'suite' => $suite, 'message' => $error->getMessage(), 'finishedAt' => gmdate(DATE_ATOM)], JSON_PRETTY_PRINT));
    fwrite(STDERR, $error->getMessage() . "\nSee .cache/verbb-tests/latest.log\n");
    exit(1);
}
