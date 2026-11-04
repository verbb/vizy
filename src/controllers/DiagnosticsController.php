<?php
namespace verbb\vizy\controllers;

use verbb\vizy\services\BrowserDiagnostics;
use verbb\vizy\services\Diagnostics;

use Craft;
use craft\elements\Entry;
use craft\helpers\Json;
use craft\helpers\UrlHelper;
use craft\web\Controller;

use yii\web\BadRequestHttpException;
use yii\web\NotFoundHttpException;
use yii\web\Response;

use Throwable;

/** Admin-only support page, deliberately absent from normal CP navigation. */
final class DiagnosticsController extends Controller
{
    // Public Methods
    // =========================================================================

    public function beforeAction($action): bool
    {
        if (!parent::beforeAction($action)) {
            return false;
        }

        $this->requireCpRequest();
        $this->requireAdmin(false);

        $this->response->getHeaders()->set('Cache-Control', 'no-store, private');
        $this->response->getHeaders()->set('X-Content-Type-Options', 'nosniff');
        $this->response->getHeaders()->set('Referrer-Policy', 'same-origin');

        return true;
    }

    public function actionIndex(): Response
    {
        return $this->_page(false);
    }

    public function actionPreview(): Response
    {
        $this->requirePostRequest();

        return $this->_page(true);
    }

    public function actionDownload(): Response
    {
        $this->requirePostRequest();

        $signed = $this->request->getBodyParam('report');

        if (!is_string($signed) || strlen($signed) > Diagnostics::MAX_REPORT_BYTES * 3) {
            throw new BadRequestHttpException('Invalid diagnostics preview.');
        }

        $decoded = base64_decode($signed, true);
        $validated = $decoded === false ? false : Craft::$app->getSecurity()->validateData($decoded);

        if ($validated === false) {
            throw new BadRequestHttpException('Invalid diagnostics preview.');
        }

        $snapshot = Json::decode($validated);

        if (($snapshot['userId'] ?? null) !== Craft::$app->getUser()->getId()
            || ($snapshot['expires'] ?? 0) < time()
            || !is_string($snapshot['json'] ?? null)
        ) {
            throw new BadRequestHttpException('This preview has expired. Generate a new preview.');
        }

        // Download the exact reviewed snapshot, even if the entry has changed.
        // The signed form is bound to this administrator and expires in 15 minutes;
        // this feature does not persist the report on the server.
        return $this->response->sendContentAsFile($snapshot['json'], 'vizy-diagnostics.json', [
            'mimeType' => 'application/json; charset=UTF-8',
            'inline' => false,
        ]);
    }


    // Private Methods
    // =========================================================================

    private function _page(bool $preview): Response
    {
        $siteId = (int)$this->request->getParam('siteId', Craft::$app->getSites()->getPrimarySite()->id);

        if (!Craft::$app->getSites()->getSiteById($siteId)) {
            throw new NotFoundHttpException('Site not found.');
        }

        $ids = $this->request->getParam('entryIds', []);
        $entryId = (int)(is_array($ids) && $ids !== [] ? reset($ids) : $this->request->getParam('entryId', 0));
        $entry = $entryId ? Entry::find()->id($entryId)->siteId($siteId)->status(null)
            ->drafts(null)->provisionalDrafts(null)->revisions(null)->one() : null;

        if ($entryId && !$entry) {
            throw new NotFoundHttpException('Entry not found in this site.');
        }

        $service = new Diagnostics();
        $documents = [];
        $error = null;
        $json = null;
        $signed = null;
        $report = null;
        $selection = (string)$this->request->getBodyParam('field', '');
        // A query string can preselect an entry, never opt a user into content export.
        $includeContent = $preview && $this->request->getBodyParam('includeContent') === '1';

        try {
            if ($entry) {
                $documents = $service->collectDocuments($entry);
            }

            if ($preview) {
                $browser = BrowserDiagnostics::readReport($this->request->getBodyParam('browserCapture'), $includeContent);

                if (!isset($documents[$selection]) && ($selection !== '' || $browser === null)) {
                    throw new BadRequestHttpException('Choose a Vizy field from this entry.');
                }

                $report = $service->createReport($documents[$selection] ?? null, $includeContent);

                if ($browser !== null) {
                    $report['browser'] = $browser;
                }

                $json = $service->encodeReport($report);
                $signed = base64_encode(Craft::$app->getSecurity()->hashData(Json::encode([
                    'userId' => Craft::$app->getUser()->getId(),
                    'expires' => time() + 900,
                    'json' => $json,
                ])));
            }
        } catch (BadRequestHttpException $exception) {
            throw $exception;
        } catch (Throwable) {
            // Internal exception messages can contain content, credentials or paths.
            $error = Craft::t('vizy', 'The report could not be generated. Try a nested entry or turn off Include content. If this continues, send support this message and your Craft and Vizy versions.');
        }

        return $this->renderTemplate('vizy/diagnostics/index', [
            'entry' => $entry,
            'entryType' => Entry::class,
            'siteId' => $siteId,
            'sites' => array_map(static fn($site) => ['label' => $site->name, 'value' => $site->id], Craft::$app->getSites()->getAllSites()),
            // Never put raw document values into the page just to populate a selector.
            'fields' => array_map(static fn($key, $document) => ['value' => $key, 'label' => $document['label']], array_keys($documents), array_values($documents)),
            'selection' => $selection,
            'includeContent' => $includeContent,
            'report' => $report,
            'reportJson' => $json,
            'signedReport' => $signed,
            'error' => $error,
            'diagnosticsUrl' => UrlHelper::cpUrl('vizy/diagnostics', array_filter(['entryId' => $entry?->id, 'siteId' => $siteId])),
        ]);
    }
}
