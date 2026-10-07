<?php
namespace verbb\vizy\console\controllers;

use verbb\vizy\Vizy;

use craft\console\Controller;
use craft\helpers\Json;

use yii\console\ExitCode;

/**
 * Plans explicit migrations from other rich-text fields to Vizy.
 */
final class ConvertController extends Controller
{
    // Properties
    // =========================================================================

    public bool $allowLossy = false;


    // Public Methods
    // =========================================================================

    public function options($actionID): array
    {
        $options = parent::options($actionID);

        if (in_array($actionID, ['field', 'from-vizy'], true)) {
            $options[] = 'allowLossy';
        }
        return $options;
    }

    /**
     * Analyses a CKEditor or Redactor field without changing content or Project Config.
     */
    public function actionAnalyze(string $field, string $editorConfig = 'standard', int $samples = 25): int
    {
        $plan = Vizy::$plugin->getRichTextConversions()->analyze($field, $editorConfig, $samples);
        $this->stdout(Json::encode($plan, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");

        return $plan['status'] === 'blocked' ? ExitCode::DATAERR : ExitCode::OK;
    }

    /**
     * Converts a CKEditor or Redactor field and generates its deployable content migration.
     */
    public function actionField(string $field, string $editorConfig = 'standard', int $samples = 25): int
    {
        $result = Vizy::$plugin->getRichTextConversions()->convert(
            $field,
            $editorConfig,
            $samples,
            $this->allowLossy,
        );
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");

        return ExitCode::OK;
    }

    /**
     * Analyses a Vizy field before converting it to a portable field type.
     */
    public function actionAnalyzeFromVizy(
        string $source,
        string $destination,
        int $samples = 25,
    ): int {
        $plan = Vizy::$plugin->getRichTextConversions()->analyzeFromVizy(
            $source,
            $destination,
            $samples,
        );
        $this->stdout(Json::encode($plan, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");

        return $plan['status'] === 'blocked' ? ExitCode::DATAERR : ExitCode::OK;
    }

    /**
     * Copies a Vizy field to an existing Plain Text, CKEditor, or Redactor field.
     */
    public function actionFromVizy(
        string $source,
        string $destination,
        int $samples = 25,
    ): int {
        $result = Vizy::$plugin->getRichTextConversions()->convertFromVizy(
            $source,
            $destination,
            $samples,
            $this->allowLossy,
        );
        $this->stdout(Json::encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");

        return ExitCode::OK;
    }
}
