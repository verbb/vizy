<?php

declare(strict_types=1);

use craft\helpers\Json;
use craft\helpers\StringHelper;
use verbb\vizy\console\controllers\MigrationsController;
use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;
use yii\console\ExitCode;

/**
 * Collects console output written to STDOUT, which Yii writes to directly.
 */
final class Vizy3UpgradeCommandsStdout extends php_user_filter
{
    public static string $buffer = '';

    public function filter($in, $out, &$consumed, bool $closing): int
    {
        while ($bucket = stream_bucket_make_writeable($in)) {
            self::$buffer .= $bucket->data;
            $consumed += $bucket->datalen;
        }

        return PSFS_PASS_ON;
    }
}

function vizy3UpgradeCommandOutput(callable $command): array
{
    if (!in_array('vizy3-upgrade-commands-stdout', stream_get_filters(), true)) {
        stream_filter_register('vizy3-upgrade-commands-stdout', Vizy3UpgradeCommandsStdout::class);
    }

    Vizy3UpgradeCommandsStdout::$buffer = '';
    $filter = stream_filter_append(STDOUT, 'vizy3-upgrade-commands-stdout', STREAM_FILTER_WRITE);

    try {
        $exitCode = $command();
    } finally {
        stream_filter_remove($filter);
    }

    return [$exitCode, Vizy3UpgradeCommandsStdout::$buffer];
}

it('prints a plan that upgrade-dry-run accepts as saved', function(string $command) {
    $fieldUid = StringHelper::UUID();
    $projectConfig = Craft::$app->getProjectConfig();
    $planFile = tempnam(Craft::$app->getPath()->getTempPath(), 'vizy-plan-');
    $ownersFile = tempnam(Craft::$app->getPath()->getTempPath(), 'vizy-owners-');

    try {
        $projectConfig->set("fields.{$fieldUid}", [
            'type' => VizyField::class,
            'name' => 'Legacy body',
            'handle' => 'savedPlanBody' . StringHelper::randomString(5),
            'translationMethod' => 'none',
            'translationKeyFormat' => null,
            'instructions' => null,
            'settings' => ['editorMode' => VizyField::MODE_COMBINED, 'vizyConfig' => ''],
        ]);
        Craft::$app->getFields()->refreshFields();

        $controller = new MigrationsController('migrations', Vizy::$plugin, ['interactive' => false, 'color' => false]);
        $controller->dryRun = true;
        [$exitCode, $output] = vizy3UpgradeCommandOutput(fn() => match ($command) {
            'upgrade-analyze' => $controller->actionUpgradeAnalyze(),
            'upgrade-from-v3 --dry-run' => $controller->actionUpgradeFromV3(),
        });

        // Save the JSON exactly as printed after the human summary.
        expect($exitCode)->toBe(ExitCode::OK, $output)
            ->and(preg_match('/^\{.*\}\s*\z/ms', $output, $match))->toBe(1, $output);
        $plan = Json::decode($match[0]);
        expect($plan['fields'])->toHaveKey($fieldUid);
        file_put_contents($planFile, $match[0]);
        file_put_contents($ownersFile, Json::encode(['complete' => true, 'jobs' => []]));

        [$exitCode, $output] = vizy3UpgradeCommandOutput(fn() => $controller->actionUpgradeDryRun($planFile, $ownersFile));

        expect($exitCode)->toBe(ExitCode::OK, $output)
            ->and($output)->toContain($plan['planHash']);
    } finally {
        $projectConfig->remove("fields.{$fieldUid}");
        Craft::$app->getFields()->refreshFields();
        unlink($planFile);
        unlink($ownersFile);
    }
})->with(['upgrade-analyze', 'upgrade-from-v3 --dry-run']);
