<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;

use Craft;
use craft\web\Controller;

class IconsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex()
    {
        $request = Craft::$app->getRequest();

        $icons = Vizy::$plugin->getIcons()->getAvailableIconSets();

        return $this->asJson($icons);
    }

}
