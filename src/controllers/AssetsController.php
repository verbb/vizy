<?php
namespace verbb\vizy\controllers;

use Craft;
use craft\elements\Asset;
use craft\web\Controller;

use yii\web\BadRequestHttpException;
use yii\web\ForbiddenHttpException;
use yii\web\Response;

/**
 * Asset metadata for Image authoring (UID + preview URL).
 *
 * Craft’s element selector only returns id/label/url/$element — not uid —
 * so the client resolves `assetUid` here after Select.
 */
class AssetsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function beforeAction($action): bool
    {
        if (!parent::beforeAction($action)) {
            return false;
        }
        $this->requireCpRequest();
        $this->requireAcceptsJson();
        // Body-only params — require POST so Craft CSRF applies.
        $this->requirePostRequest();
        return true;
    }

    public function actionInfo(): Response
    {
        $assetId = (int)$this->request->getRequiredBodyParam('assetId');
        $siteId = (int)($this->request->getBodyParam('siteId') ?: Craft::$app->getSites()->getCurrentSite()->id);

        $asset = Asset::find()
            ->id($assetId)
            ->siteId($siteId)
            ->status(null)
            ->one();

        if (!$asset) {
            throw new BadRequestHttpException('Asset not found.');
        }

        if (!Craft::$app->getElements()->canView($asset)) {
            throw new ForbiddenHttpException('User cannot view this asset.');
        }

        return $this->asJson([
            'id' => (int)$asset->id,
            'uid' => (string)$asset->uid,
            'siteId' => (int)$asset->siteId,
            'title' => (string)$asset->title,
            'alt' => (string)($asset->alt ?? ''),
            'url' => $asset->getUrl() ?: null,
            'filename' => (string)$asset->filename,
        ]);
    }
}
