<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\web\assets\migrations\MigrationsAsset;

use Craft;
use craft\helpers\App;
use craft\web\Controller;

use yii\web\Response;

use RuntimeException;
use Throwable;

/**
 * Provides the control-panel workflows for conversions to and from Vizy.
 */
final class RichTextConversionsController extends Controller
{
    // Constants
    // =========================================================================

    private const SAMPLE_LIMIT = 25;


    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $this->requireAdmin(false);

        return $this->redirect('vizy/settings/migrations/to-vizy');
    }

    public function actionToVizy(): Response
    {
        $this->requireAdmin(false);

        return $this->_renderToVizy();
    }

    public function actionFromVizy(): Response
    {
        $this->requireAdmin(false);

        return $this->_renderFromVizy();
    }

    public function actionAnalyze(): Response
    {
        $this->requirePostRequest();
        $this->requireAdmin(false);

        $field = trim((string)$this->request->getRequiredBodyParam('field'));
        $editorConfig = trim((string)$this->request->getBodyParam('editorConfig', 'standard'));

        try {
            $analysis = Vizy::$plugin->getRichTextConversions()->analyze(
                $field,
                $editorConfig,
                self::SAMPLE_LIMIT,
            );
        } catch (Throwable $exception) {
            return $this->_renderToVizy(
                error: $exception->getMessage(),
                selectedField: $field,
                selectedEditorConfig: $editorConfig,
            );
        }

        return $this->_renderToVizy(
            analysis: $analysis,
            selectedField: $field,
            selectedEditorConfig: $editorConfig,
        );
    }

    public function actionRun(): Response
    {
        $this->requirePostRequest();
        $this->requireAdmin();

        $field = trim((string)$this->request->getRequiredBodyParam('field'));
        $editorConfig = trim((string)$this->request->getBodyParam('editorConfig', 'standard'));
        $createBackup = (bool)$this->request->getBodyParam('createBackup', true);
        $allowLossy = (bool)$this->request->getBodyParam('allowLossy', false);
        $confirmed = (bool)$this->request->getBodyParam('confirm', false);
        $analysis = null;

        try {
            $analysis = Vizy::$plugin->getRichTextConversions()->analyze(
                $field,
                $editorConfig,
                self::SAMPLE_LIMIT,
            );

            if (!$confirmed) {
                throw new RuntimeException(Craft::t('vizy', 'Confirm that you understand this migration changes the field and its stored content.'));
            }

            App::maxPowerCaptain();

            if ($createBackup) {
                Craft::$app->getDb()->backup();
            }

            $result = Vizy::$plugin->getRichTextConversions()->convert(
                $field,
                $editorConfig,
                self::SAMPLE_LIMIT,
                $allowLossy,
            );
        } catch (Throwable $exception) {
            return $this->_renderToVizy(
                analysis: $analysis,
                error: $exception->getMessage(),
                selectedField: $field,
                selectedEditorConfig: $editorConfig,
            );
        }

        return $this->_renderToVizy(
            analysis: $result['analysis'],
            result: $result,
            selectedField: $field,
            selectedEditorConfig: $editorConfig,
        );
    }

    public function actionAnalyzeFromVizy(): Response
    {
        $this->requirePostRequest();
        $this->requireAdmin(false);

        $field = trim((string)$this->request->getRequiredBodyParam('field'));
        $destination = trim((string)$this->request->getRequiredBodyParam('destination'));

        try {
            $analysis = Vizy::$plugin->getRichTextConversions()->analyzeFromVizy(
                $field,
                $destination,
                self::SAMPLE_LIMIT,
            );
        } catch (Throwable $exception) {
            return $this->_renderFromVizy(
                error: $exception->getMessage(),
                selectedField: $field,
                selectedDestination: $destination,
                wizardStep: 1,
                openWizard: true,
            );
        }

        return $this->_renderFromVizy(
            analysis: $analysis,
            selectedField: $field,
            selectedDestination: $destination,
            wizardStep: 2,
            openWizard: true,
        );
    }

    public function actionRunFromVizy(): Response
    {
        $this->requirePostRequest();
        $this->requireAdmin();

        $field = trim((string)$this->request->getRequiredBodyParam('field'));
        $destination = trim((string)$this->request->getRequiredBodyParam('destination'));
        $createBackup = (bool)$this->request->getBodyParam('createBackup', true);
        $allowLossy = (bool)$this->request->getBodyParam('allowLossy', false);
        $confirmed = (bool)$this->request->getBodyParam('confirm', false);
        $analysis = null;

        try {
            $analysis = Vizy::$plugin->getRichTextConversions()->analyzeFromVizy(
                $field,
                $destination,
                self::SAMPLE_LIMIT,
            );

            if (!$confirmed) {
                throw new RuntimeException(Craft::t('vizy', 'Confirm that you understand this populates the selected destination field.'));
            }

            App::maxPowerCaptain();

            if ($createBackup) {
                Craft::$app->getDb()->backup();
            }

            $result = Vizy::$plugin->getRichTextConversions()->convertFromVizy(
                $field,
                $destination,
                self::SAMPLE_LIMIT,
                $allowLossy,
            );
        } catch (Throwable $exception) {
            return $this->_renderFromVizy(
                analysis: $analysis,
                error: $exception->getMessage(),
                selectedField: $field,
                selectedDestination: $destination,
                wizardStep: $analysis ? 3 : 1,
                openWizard: true,
            );
        }

        return $this->_renderFromVizy(
            analysis: $result['analysis'],
            result: $result,
            selectedField: $field,
            selectedDestination: $destination,
            wizardStep: 4,
            openWizard: true,
        );
    }


    // Private Methods
    // =========================================================================

    private function _renderToVizy(
        ?array $analysis = null,
        ?array $result = null,
        ?string $error = null,
        ?string $selectedField = null,
        string $selectedEditorConfig = 'standard',
    ): Response {
        return $this->renderTemplate('vizy/settings/migrations/to-vizy', [
            'sources' => Vizy::$plugin->getRichTextConversions()->getSources(),
            'editorConfigOptions' => Vizy::$plugin->getEditorConfigs()->getOptions(),
            'analysis' => $analysis,
            'result' => $result,
            'error' => $error,
            'selectedField' => $selectedField,
            'selectedEditorConfig' => $selectedEditorConfig,
            'allowAdminChanges' => Craft::$app->getConfig()->getGeneral()->allowAdminChanges,
        ]);
    }

    private function _renderFromVizy(
        ?array $analysis = null,
        ?array $result = null,
        ?string $error = null,
        ?string $selectedField = null,
        ?string $selectedDestination = null,
        int $wizardStep = 1,
        bool $openWizard = false,
    ): Response {
        $conversions = Vizy::$plugin->getRichTextConversions();
        Craft::$app->getView()->registerAssetBundle(MigrationsAsset::class);

        return $this->renderTemplate('vizy/settings/migrations/from-vizy', [
            'source' => $conversions->getVizySources(),
            'destination' => $conversions->getOutboundDestinations(),
            'analysis' => $analysis,
            'result' => $result,
            'error' => $error,
            'selectedField' => $selectedField,
            'selectedDestination' => $selectedDestination,
            'wizardStep' => $wizardStep,
            'openWizard' => $openWizard,
            'allowAdminChanges' => Craft::$app->getConfig()->getGeneral()->allowAdminChanges,
        ]);
    }
}
