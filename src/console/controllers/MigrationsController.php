<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\legacy\PromotionOperatorMessages;

use Craft;
use craft\console\Controller;
use craft\helpers\Console;
use craft\helpers\Json;

use yii\console\ExitCode;

/**
 * User-facing Vizy 3 upgrade and advanced recovery commands.
 *
 * Human-readable summaries print to stdout/stderr; machine JSON follows for scripting.
 */
final class MigrationsController extends Controller
{
    // Properties
    // =========================================================================

    public bool $apply = false;
    public bool $dryRun = false;
    public bool $force = false;
    public ?string $ownerPlacementUid = null;
    public ?string $runUid = null;


    // Public Methods
    // =========================================================================

    public function options($actionID): array
    {
        $actionOptions = match ($actionID) {
            'owner' => ['apply', 'force', 'ownerPlacementUid', 'runUid'],
            'resume', 'upgrade-apply', 'upgrade-resume' => ['force'],
            'upgrade-from-v3' => ['dryRun', 'force'],
            default => [],
        };

        return [...parent::options($actionID), ...$actionOptions];
    }

    /**
     * Analyze one owner by default; pass --apply=1 for explicit persistence.
     */
    public function actionOwner(
        string $elementType,
        int $elementId,
        int $siteId,
        string $fieldUid,
        string $mappingFile,
    ): int {
        $owner = Craft::$app->getElements()->getElementById($elementId, $elementType, $siteId);
        $field = $owner ? FieldPlacements::field($owner, $fieldUid, $this->ownerPlacementUid) : null;
        if (!$owner || !$field instanceof VizyField) {
            $this->stderr(Craft::t('vizy', 'Exact owner/site or Vizy field placement was not found. For repeated fields, pass --ownerPlacementUid.') . PHP_EOL, Console::FG_RED);
            return ExitCode::DATAERR;
        }

        $path = Craft::getAlias($mappingFile);
        if (!is_file($path) || !is_readable($path)) {
            $this->stderr(Craft::t('vizy', 'Mapping file is not readable: {path}', ['path' => $path]) . PHP_EOL, Console::FG_RED);
            return ExitCode::NOINPUT;
        }
        $mapping = Json::decode((string)file_get_contents($path));
        if (!is_array($mapping)) {
            $this->stderr(Craft::t('vizy', 'Mapping file must contain a JSON object.') . PHP_EOL, Console::FG_RED);
            return ExitCode::DATAERR;
        }

        if ($this->apply) {
            if (!$this->_confirmWrite()) {
                return ExitCode::USAGE;
            }
            $this->stdout(Craft::t('vizy', 'Owner migration: applying writes for element {id} / field {field}.', [
                'id' => $elementId,
                'field' => $field->handle,
            ]) . PHP_EOL, Console::FG_YELLOW);
        } else {
            $this->stdout(Craft::t('vizy', 'Owner migration: analyze only (no writes). Pass --apply=1 to persist.') . PHP_EOL, Console::FG_CYAN);
        }

        $result = Vizy::$plugin->getOwnerContentMigrator()->migrateOwner(
            $owner,
            $field,
            $mapping,
            $this->apply,
            $this->runUid,
        );
        $result['nextStep'] = PromotionOperatorMessages::nextStepForOwner($result, $this->apply);
        $this->_printOperatorLine($result['nextStep'], $result['state'] === 'verified' || $result['state'] === 'ready'
            ? Console::FG_GREEN
            : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return in_array($result['state'], $this->apply ? ['verified'] : ['ready', 'verified', 'analyzed'], true)
            ? ExitCode::OK
            : ExitCode::UNSPECIFIED_ERROR;
    }

    public function actionStatus(?string $runUid = null): int
    {
        $rows = Vizy::$plugin->getOwnerContentMigrator()->status($runUid);
        $this->stdout(Craft::t('vizy', 'Owner migration checkpoints: {count}', ['count' => count($rows)]) . PHP_EOL, Console::FG_CYAN);
        foreach ($rows as &$row) {
            $row['nextStep'] = PromotionOperatorMessages::nextStepForOwner($row, true);
        }
        unset($row);
        $this->stdout(Json::encode($rows, JSON_PRETTY_PRINT) . PHP_EOL);
        return ExitCode::OK;
    }

    public function actionResume(int $checkpointId): int
    {
        if (!$this->_confirmWrite()) {
            return ExitCode::USAGE;
        }

        $this->stdout(Craft::t('vizy', 'Resuming owner migration checkpoint {id}…', [
            'id' => $checkpointId,
        ]) . PHP_EOL, Console::FG_CYAN);
        $result = Vizy::$plugin->getOwnerContentMigrator()->resume($checkpointId);
        $result['nextStep'] = PromotionOperatorMessages::nextStepForOwner($result, true);
        $this->_printOperatorLine($result['nextStep'], $result['state'] === 'verified' ? Console::FG_GREEN : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return $result['state'] === 'verified' ? ExitCode::OK : ExitCode::UNSPECIFIED_ERROR;
    }

    /**
     * Manually inspect, run, or resume the automatic Vizy 3 → 4 upgrade.
     */
    public function actionUpgradeFromV3(): int
    {
        $orchestrator = Vizy::$plugin->getPromotionOrchestrator();
        $incomplete = array_values(array_filter(
            $orchestrator->status(),
            static fn(array $run): bool => ($run['status'] ?? null) !== 'complete',
        ));

        if (count($incomplete) > 1) {
            $this->stderr(Craft::t(
                'vizy',
                'Multiple incomplete Vizy 3 upgrades need attention. Inspect them with: php craft vizy/migrations/upgrade-status',
            ) . PHP_EOL, Console::FG_RED);
            $this->stdout(Json::encode($incomplete, JSON_PRETTY_PRINT) . PHP_EOL);
            return ExitCode::DATAERR;
        }

        if ($incomplete !== []) {
            $run = $incomplete[0];
            $this->stdout(Craft::t('vizy', 'Found an incomplete Vizy 3 upgrade at stage “{stage}” ({label}).', [
                'stage' => (string)($run['stage'] ?? ''),
                'label' => (string)($run['stageLabel'] ?? ''),
            ]) . PHP_EOL, Console::FG_YELLOW);
            if ($this->dryRun) {
                $this->_printOperatorLine((string)$run['nextStep'], Console::FG_YELLOW);
                $this->stdout(Json::encode($run, JSON_PRETTY_PRINT) . PHP_EOL);
                return ExitCode::OK;
            }
            if (!$this->_confirmWrite()) {
                return ExitCode::USAGE;
            }
            $result = $orchestrator->resume((string)$run['runUid']);
            $this->_summarizePromotionRun($result);
            $this->_printOperatorLine((string)$result['nextStep'], ($result['status'] ?? '') === 'complete' ? Console::FG_GREEN : Console::FG_YELLOW);
            $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
            return ($result['status'] ?? '') === 'complete' ? ExitCode::OK : ExitCode::UNSPECIFIED_ERROR;
        }

        $this->stdout(Craft::t('vizy', 'Checking this installation for Vizy 3 fields…') . PHP_EOL, Console::FG_CYAN);
        $plan = $orchestrator->analyze();
        $this->_summarizeAnalyze($plan);

        if (($plan['status'] ?? null) !== 'ready') {
            $plan['nextStep'] = PromotionOperatorMessages::nextStepForAnalyze($plan);
            $this->_printOperatorLine($plan['nextStep'], Console::FG_YELLOW);
            $this->stdout(Json::encode($plan, JSON_PRETTY_PRINT) . PHP_EOL);
            return ExitCode::DATAERR;
        }

        if (($plan['fields'] ?? []) === []) {
            $this->_printOperatorLine(Craft::t('vizy', 'No Vizy 3 fields need upgrading.'), Console::FG_GREEN);
            return ExitCode::OK;
        }

        $fieldCount = count($plan['fields']);
        $readyMessage = $fieldCount === 1
            ? Craft::t('vizy', 'Ready to upgrade one Vizy field. Existing content will remain available and will be saved in the Vizy 4 format when its owner is next saved.')
            : Craft::t('vizy', 'Ready to upgrade {count} Vizy fields. Existing content will remain available and will be saved in the Vizy 4 format when each owner is next saved.', ['count' => $fieldCount]);
        $this->stdout($readyMessage . PHP_EOL, Console::FG_YELLOW);
        if ($this->dryRun) {
            $plan['nextStep'] = Craft::t('vizy', 'Dry run complete. Re-run without --dry-run to apply the Vizy 3 upgrade.');
            $this->_printOperatorLine($plan['nextStep'], Console::FG_GREEN);
            $this->stdout(Json::encode($plan, JSON_PRETTY_PRINT) . PHP_EOL);
            return ExitCode::OK;
        }
        if (!$this->_confirmWrite()) {
            return ExitCode::USAGE;
        }

        $result = $orchestrator->apply($plan, ['complete' => true, 'jobs' => []]);
        $this->_summarizePromotionRun($result);
        $this->_printOperatorLine((string)$result['nextStep'], ($result['status'] ?? '') === 'complete' ? Console::FG_GREEN : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return ($result['status'] ?? '') === 'complete' ? ExitCode::OK : ExitCode::UNSPECIFIED_ERROR;
    }

    /**
     * Analyze every Vizy 3 field in the complete current Project Config.
     */
    public function actionUpgradeAnalyze(?string $targetHandlesFile = null): int
    {
        $handles = $targetHandlesFile ? $this->_readJsonObject($targetHandlesFile) : [];
        $this->stdout(Craft::t('vizy', 'Analyzing the Vizy 3 → 4 upgrade (no writes)…') . PHP_EOL, Console::FG_CYAN);
        $result = Vizy::$plugin->getPromotionOrchestrator()->analyze($handles);
        $result['nextStep'] = PromotionOperatorMessages::nextStepForAnalyze($result);
        $this->_summarizeAnalyze($result);
        $this->_printOperatorLine($result['nextStep'], ($result['status'] ?? '') === 'ready' ? Console::FG_GREEN : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return $result['status'] === 'ready' ? ExitCode::OK : ExitCode::DATAERR;
    }

    public function actionUpgradeDryRun(string $planFile, ?string $ownerScopeFile = null): int
    {
        $this->stdout(Craft::t('vizy', 'Dry-running an advanced Vizy 3 upgrade plan (no writes)…') . PHP_EOL, Console::FG_CYAN);
        $result = Vizy::$plugin->getPromotionOrchestrator()->dryRun(
            $this->_readJsonObject($planFile),
            $ownerScopeFile ? $this->_readJsonObject($ownerScopeFile) : [],
        );
        $result['nextStep'] = Craft::t(
            'vizy',
            'Dry run OK. Apply with: php craft vizy/migrations/upgrade-apply {plan} {owners}',
            [
                'plan' => $planFile,
                'owners' => $ownerScopeFile ?: 'path/to/owners.json',
            ],
        );
        $this->_printOperatorLine($result['nextStep'], Console::FG_GREEN);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return ExitCode::OK;
    }

    public function actionUpgradeApply(string $planFile, string $ownerScopeFile): int
    {
        if (!$this->_confirmWrite()) {
            return ExitCode::USAGE;
        }

        $this->stdout(Craft::t(
            'vizy',
            'Applying an advanced Vizy 3 → 4 upgrade plan. This writes Project Config and may convert owner content.',
        ) . PHP_EOL, Console::FG_YELLOW);

        $result = Vizy::$plugin->getPromotionOrchestrator()->apply(
            $this->_readJsonObject($planFile),
            $this->_readJsonObject($ownerScopeFile),
        );
        $this->_summarizePromotionRun($result);
        $this->_printOperatorLine((string)$result['nextStep'], ($result['status'] ?? '') === 'complete' ? Console::FG_GREEN : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return $result['status'] === 'complete' ? ExitCode::OK : ExitCode::UNSPECIFIED_ERROR;
    }

    public function actionUpgradeStatus(?string $runUid = null): int
    {
        $rows = Vizy::$plugin->getPromotionOrchestrator()->status($runUid);
        $this->stdout(Craft::t('vizy', 'Vizy 3 upgrade runs: {count}', ['count' => count($rows)]) . PHP_EOL, Console::FG_CYAN);
        foreach ($rows as $row) {
            $this->stdout(sprintf(
                "  %s  %s / %s (%s)%s\n",
                $row['runUid'] ?? '',
                $row['status'] ?? '',
                $row['stage'] ?? '',
                $row['stageLabel'] ?? '',
                !empty($row['lastError']) ? ' — ' . $row['lastError'] : '',
            ), ($row['status'] ?? '') === 'complete' ? Console::FG_GREEN : Console::FG_YELLOW);
            if (!empty($row['nextStep'])) {
                $this->stdout('    → ' . $row['nextStep'] . PHP_EOL);
            }
        }
        $this->stdout(Json::encode($rows, JSON_PRETTY_PRINT) . PHP_EOL);
        return ExitCode::OK;
    }

    public function actionUpgradeResume(string $runUid): int
    {
        if (!$this->_confirmWrite()) {
            return ExitCode::USAGE;
        }

        $this->stdout(Craft::t('vizy', 'Resuming Vizy 3 upgrade {runUid}…', [
            'runUid' => $runUid,
        ]) . PHP_EOL, Console::FG_CYAN);

        $result = Vizy::$plugin->getPromotionOrchestrator()->resume($runUid);
        $this->_summarizePromotionRun($result);
        $this->_printOperatorLine((string)$result['nextStep'], ($result['status'] ?? '') === 'complete' ? Console::FG_GREEN : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return $result['status'] === 'complete' ? ExitCode::OK : ExitCode::UNSPECIFIED_ERROR;
    }


    // Private Methods
    // =========================================================================

    /**
     * Interactive runs default to no; automation must explicitly pass --force.
     */
    private function _confirmWrite(): bool
    {
        if ($this->force) {
            return true;
        }

        if ($this->interactive) {
            return $this->confirm(PromotionOperatorMessages::writeConfirmationMessage(), false);
        }

        $this->stderr(PromotionOperatorMessages::forceRequiredMessage() . PHP_EOL, Console::FG_RED);
        return false;
    }

    private function _summarizeAnalyze(array $result): void
    {
        $fields = is_array($result['fields'] ?? null) ? count($result['fields']) : 0;
        $diagnostics = is_array($result['diagnostics'] ?? null) ? $result['diagnostics'] : [];
        $errors = count(array_filter($diagnostics, static fn($d) => ($d['severity'] ?? '') === 'error'));
        $infos = count(array_filter($diagnostics, static fn($d) => ($d['severity'] ?? '') === 'info'));
        $this->stdout(Craft::t('vizy', 'Status: {status} · fields: {fields} · diagnostics: {errors} error(s), {infos} info', [
            'status' => (string)($result['status'] ?? 'unknown'),
            'fields' => $fields,
            'errors' => $errors,
            'infos' => $infos,
        ]) . PHP_EOL);
    }

    private function _summarizePromotionRun(array $result): void
    {
        $this->stdout(Craft::t('vizy', 'Run {runUid}: {status} at stage “{stage}” ({label})', [
            'runUid' => (string)($result['runUid'] ?? ''),
            'status' => (string)($result['status'] ?? ''),
            'stage' => (string)($result['stage'] ?? ''),
            'label' => (string)($result['stageLabel'] ?? PromotionOperatorMessages::stageLabel((string)($result['stage'] ?? ''))),
        ]) . PHP_EOL);
        if (!empty($result['lastError'])) {
            $this->stderr(Craft::t('vizy', 'Last error: {error}', ['error' => $result['lastError']]) . PHP_EOL, Console::FG_RED);
        }
    }

    private function _printOperatorLine(string $message, int $color = Console::FG_CYAN): void
    {
        $this->stdout('→ ' . $message . PHP_EOL, $color);
    }

    private function _readJsonObject(string $file): array
    {
        $path = Craft::getAlias($file);
        if (!is_file($path) || !is_readable($path)) {
            throw new \RuntimeException(Craft::t('vizy', 'JSON file is not readable: {path}', ['path' => $path]));
        }
        $value = Json::decode((string)file_get_contents($path));
        if (!is_array($value)) {
            throw new \RuntimeException(Craft::t('vizy', 'JSON file must contain an object: {path}', ['path' => $path]));
        }
        return $value;
    }
}
