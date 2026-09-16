<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\models\Settings;

use craft\web\Controller;

use yii\web\Response;

class SettingsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $this->requireAdmin();

        /* @var Settings $settings */
        $settings = Vizy::$plugin->getSettings();

        return $this->renderTemplate('vizy/settings/index', [
            'settings' => $settings,
        ]);
    }
}
