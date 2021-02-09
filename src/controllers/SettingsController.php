<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;

use Craft;
use craft\web\Controller;

class SettingsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex()
    {
        $settings = Vizy::$plugin->getSettings();

        return $this->renderTemplate('vizy/settings', [
            'settings' => $settings,
        ]);
    }
}
