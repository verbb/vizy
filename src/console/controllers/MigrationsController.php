<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\legacy\PromotionOperatorMessages;
use verbb\vizy\legacy\Vizy3PromotionOrchestrator;

use Craft;
use craft\console\Controller;
use craft\helpers\Console;
use craft\helpers\Json;

use yii\console\ExitCode;

/**
 * Operator seam for resumable Vizy 3 → 4 schema promotion and owner-content migration.
 *
 * Human-readable summaries print to stdout/stderr; machine JSON follows for scripting.
 */
final class MigrationsController extends Controller
{
    // Properties
    // =========================================================================

    public bool $apply = false;
    public ?string $runUid = null;
    public ?string $confirm = null;


    // Public Methods
    // =========================================================================

    public function options($actionID): array
    {
        return [...parent::options($actionID), 'apply', 'runUid', 'confirm'];
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
        $field = Craft::$app->getFields()->getFieldByUid($fieldUid);
        if (!$owner || !$field instanceof VizyField) {
            $this->stderr(Craft::t('vizy', 'Exact owner/site or Vizy field was not found.') . PHP_EOL, Console::FG_RED);
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
            if (!$this->_resolveWriteConfirmation()) {
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
        if (!$this->_resolveWriteConfirmation()) {
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
     * Analyze every Vizy 3 field in the complete current Project Config.
     */
    public function actionPromotionAnalyze(?string $targetHandlesFile = null): int
    {
        $handles = $targetHandlesFile ? $this->_readJsonObject($targetHandlesFile) : [];
        $this->stdout(Craft::t('vizy', 'Analyzing Vizy 3 → 4 schema promotion (no writes)…') . PHP_EOL, Console::FG_CYAN);
        $result = Vizy::$plugin->getPromotionOrchestrator()->analyze($handles);
        $result['nextStep'] = PromotionOperatorMessages::nextStepForAnalyze($result);
        $this->_summarizeAnalyze($result);
        $this->_printOperatorLine($result['nextStep'], ($result['status'] ?? '') === 'ready' ? Console::FG_GREEN : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return $result['status'] === 'ready' ? ExitCode::OK : ExitCode::DATAERR;
    }

    public function actionPromotionDryRun(string $planFile, ?string $ownerScopeFile = null): int
    {
        $this->stdout(Craft::t('vizy', 'Dry-run Vizy schema promotion (no writes)…') . PHP_EOL, Console::FG_CYAN);
        $result = Vizy::$plugin->getPromotionOrchestrator()->dryRun(
            $this->_readJsonObject($planFile),
            $ownerScopeFile ? $this->_readJsonObject($ownerScopeFile) : [],
        );
        $result['confirmationPhrase'] = PromotionOperatorMessages::confirmationPhrase();
        $result['nextStep'] = Craft::t(
            'vizy',
            'Dry-run OK. Apply with: php craft vizy/migrations/promotion-apply {plan} {owners} --confirm="{phrase}"',
            [
                'plan' => $planFile,
                'owners' => $ownerScopeFile ?: 'path/to/owners.json',
                'phrase' => PromotionOperatorMessages::confirmationPhrase(),
            ],
        );
        $this->_printOperatorLine($result['nextStep'], Console::FG_GREEN);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return ExitCode::OK;
    }

    public function actionPromotionApply(string $planFile, string $ownerScopeFile): int
    {
        if (!$this->_resolveWriteConfirmation()) {
            return ExitCode::USAGE;
        }

        $this->stdout(Craft::t(
            'vizy',
            'Applying Vizy 3 → 4 schema promotion. This writes Project Config and may convert owner content. Confirmation: {phrase}',
            ['phrase' => PromotionOperatorMessages::confirmationPhrase()],
        ) . PHP_EOL, Console::FG_YELLOW);

        $result = Vizy::$plugin->getPromotionOrchestrator()->apply(
            $this->_readJsonObject($planFile),
            $this->_readJsonObject($ownerScopeFile),
            (string)$this->confirm,
        );
        $this->_summarizePromotionRun($result);
        $this->_printOperatorLine((string)$result['nextStep'], ($result['status'] ?? '') === 'complete' ? Console::FG_GREEN : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return $result['status'] === 'complete' ? ExitCode::OK : ExitCode::UNSPECIFIED_ERROR;
    }

    public function actionPromotionStatus(?string $runUid = null): int
    {
        $rows = Vizy::$plugin->getPromotionOrchestrator()->status($runUid);
        $this->stdout(Craft::t('vizy', 'Schema promotion runs: {count}', ['count' => count($rows)]) . PHP_EOL, Console::FG_CYAN);
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

    public function actionPromotionResume(string $runUid): int
    {
        if (!$this->_resolveWriteConfirmation()) {
            return ExitCode::USAGE;
        }

        $this->stdout(Craft::t('vizy', 'Resuming schema promotion {runUid}…', [
            'runUid' => $runUid,
        ]) . PHP_EOL, Console::FG_CYAN);

        $result = Vizy::$plugin->getPromotionOrchestrator()->resume($runUid, (string)$this->confirm);
        $this->_summarizePromotionRun($result);
        $this->_printOperatorLine((string)$result['nextStep'], ($result['status'] ?? '') === 'complete' ? Console::FG_GREEN : Console::FG_YELLOW);
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT) . PHP_EOL);
        return $result['status'] === 'complete' ? ExitCode::OK : ExitCode::UNSPECIFIED_ERROR;
    }


    // Private Methods
    // =========================================================================

    /**
     * Require --confirm="PROMOTE VIZY 3", or prompt interactively for that exact phrase.
     */
    private function _resolveWriteConfirmation(): bool
    {
        $phrase = PromotionOperatorMessages::confirmationPhrase();

        if (is_string($this->confirm) && $this->confirm !== '') {
            if ($this->confirm !== $phrase) {
                $this->stderr(PromotionOperatorMessages::confirmationMismatchMessage() . PHP_EOL, Console::FG_RED);
                return false;
            }

            return true;
        }

        if ($this->interactive) {
            $this->stdout(PromotionOperatorMessages::confirmationRequiredMessage() . PHP_EOL, Console::FG_YELLOW);
            $typed = $this->prompt(Craft::t('vizy', 'Type the confirmation phrase to continue:'));
            if ($typed !== $phrase) {
                $this->stderr(PromotionOperatorMessages::confirmationMismatchMessage() . PHP_EOL, Console::FG_RED);
                return false;
            }
            $this->confirm = $typed;
            return true;
        }

        $this->stderr(PromotionOperatorMessages::confirmationRequiredMessage() . PHP_EOL, Console::FG_RED);
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
