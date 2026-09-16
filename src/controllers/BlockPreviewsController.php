<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;

use Craft;
use craft\helpers\FileHelper;
use craft\web\Controller;

use yii\web\ForbiddenHttpException;
use yii\web\NotFoundHttpException;
use yii\web\Response;

class BlockPreviewsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionIndex(): Response
    {
        $this->requireCpRequest();
        $this->requirePermission('accessCp');

        return $this->asJson(Vizy::$plugin->getBlockPreviewImages()->getBrowserGroups());
    }

    /**
     * Stream a preview image for CP authoring (folder need not be web-public).
     */
    public function actionView(): Response
    {
        $this->requireCpRequest();
        if (!Craft::$app->getUser()->checkPermission('accessCp')) {
            throw new ForbiddenHttpException('Not permitted.');
        }

        $file = (string)$this->request->getRequiredQueryParam('file');
        $path = Vizy::$plugin->getBlockPreviewImages()->resolveAbsolutePath($file);
        if ($path === null) {
            throw new NotFoundHttpException('Preview image not found.');
        }

        $mime = FileHelper::getMimeType($path) ?: 'application/octet-stream';
        $response = Craft::$app->getResponse();
        $response->headers->set('Content-Type', $mime);
        $response->headers->set('Cache-Control', 'private, max-age=86400');

        return $response->sendFile($path, pathinfo($path, PATHINFO_BASENAME), [
            'inline' => true,
        ]);
    }
}
