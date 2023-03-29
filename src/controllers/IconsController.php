<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;

use craft\web\Controller;

use yii\web\Response;

class IconsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $icons = Vizy::$plugin->getIcons()->getAvailableIconSets();

        return $this->asJson($icons);
    }

}
