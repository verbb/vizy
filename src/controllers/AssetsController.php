<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;

use Craft;
use craft\elements\Asset;
use craft\web\Controller;

use yii\web\BadRequestHttpException;
use yii\web\ForbiddenHttpException;
use yii\web\Response;

use Throwable;

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

        if (!Craft::$app->getElements()->canView($asset) && !$this->_canSelectForField($asset, $siteId)) {
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


    // Private Methods
    // =========================================================================

    private function _canSelectForField(Asset $asset, int $siteId): bool
    {
        // Field settings may deliberately expose peer files. Accept that policy
        // only through a signed placement whose owner is still editable by this user.
        $token = $this->request->getBodyParam('editorContextToken');

        if (!is_string($token) || $token === '') {
            return false;
        }

        try {
            $resolved = (new FieldLayoutController('field-layout', $this->module))->resolveEditorContext($token);

            if (!$resolved || (int)$resolved[0]['siteId'] !== $siteId) {
                return false;
            }

            return Vizy::$plugin->getSemanticReferences()->canSelectAsset($asset, $resolved[2], static::currentUser());
        } catch (Throwable) {
            return false;
        }
    }
}
