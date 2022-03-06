<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;

use craft\web\Controller;

use yii\web\Response;

class SettingsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $settings = Vizy::$plugin->getSettings();

        return $this->renderTemplate('vizy/settings', [
            'settings' => $settings,
        ]);
    }
}
