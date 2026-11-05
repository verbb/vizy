<?php
namespace verbb\vizy\controllers;

use verbb\vizy\services\BrowserDiagnostics;
use verbb\vizy\services\Diagnostics;

use Craft;
use craft\base\ElementInterface;
use craft\web\Controller;
use craft\web\View;

use yii\web\Response;

use Throwable;

/** Support reports, reached through Utilities and kept out of normal editing UI. */
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
        $this->requirePermission(BrowserDiagnostics::PERMISSION);

        $this->response->getHeaders()->set('Cache-Control', 'no-store, private');
        $this->response->getHeaders()->set('X-Content-Type-Options', 'nosniff');
        $this->response->getHeaders()->set('Referrer-Policy', 'same-origin');

        return true;
    }

    /** The direct route, which still works when `disabledUtilities` hides the utility. */
    public function actionIndex(): Response
    {
        return $this->renderTemplate('vizy/diagnostics/index');
    }

    /**
     * Builds the report and its plain-language review. The page copies or saves
     * exactly this text, so nothing about the report is kept on the server.
     */
    public function actionReview(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        // Only a posted value counts, so a link can't change what gets included.
        $includeContent = $this->request->getBodyParam('includeContent') === '1';
        $capture = BrowserDiagnostics::readCapture($this->request->getBodyParam('browserCapture'), $includeContent);

        try {
            $service = new Diagnostics();
            $user = Craft::$app->getUser()->getIdentity();
            $includeConfig = (bool)$user?->admin;
            $context = $capture['context'] ?? null;
            $trail = $context['trail'] ?? null;
            $element = $context ? $this->_element($context['id'], $context['siteId']) : null;
            $contentTooLarge = false;
            $documents = [];
            $target = null;
            $savedOnly = false;
            $collectionFailed = false;

            // One unreadable page must not lose what the customer just captured.
            try {
                $documents = $element ? $service->collectDocuments($element) : [];
                $target = $service->findTarget($documents, $trail);

                // Autosaved Matrix rows inside Vizy blocks aren't reachable from their
                // owner, so fall back to the row's saved version and say so.
                if ($target === null && $trail !== null && preg_match('#^.*/row:(\d+)/(.+)$#D', $trail, $match)) {
                    $row = $this->_element((int)$match[1], $context['siteId']);
                    $rowDocuments = $row ? $service->collectDocuments($row) : [];
                    $rowTarget = $service->findTarget($rowDocuments, $match[2]);

                    if ($rowTarget !== null) {
                        $documents = [...$documents, ...$rowDocuments];
                        $target = $rowTarget;
                        $savedOnly = true;
                    }
                }
            } catch (Throwable) {
                $collectionFailed = true;
            }

            $browser = $capture['report'] ?? null;
            $page = $element ? $service->pageSummary($element, $documents[$target] ?? null, $savedOnly) : null;
            $report = $service->createReport($documents, $target, $includeContent, $includeConfig, $page, $browser);

            try {
                $json = $service->encodeReport($report);
            } catch (Throwable $exception) {
                if (!$includeContent) {
                    throw $exception;
                }

                // Never lose the whole report to one oversized field.
                $includeContent = false;
                $contentTooLarge = true;
                $strippedBrowser = $browser === null ? null : BrowserDiagnostics::withoutDetails($browser);
                $report = $service->createReport($documents, $target, false, $includeConfig, $page, $strippedBrowser);
                $json = $service->encodeReport($report);
            }

            $review = $service->review($report, $documents, $context !== null && !$element, $contentTooLarge, $collectionFailed);
            $html = $this->getView()->renderTemplate('vizy/diagnostics/_review', [
                'report' => $report,
                'review' => $review,
                'reportJson' => $json,
                // Error messages are content too, even when the page had no Vizy fields.
                'canIncludeContent' => $documents !== [] || BrowserDiagnostics::canHaveDetails($browser),
                'includeContent' => $includeContent,
                'tooLongToPaste' => mb_strlen($json) > Diagnostics::MAX_PASTE_CHARACTERS,
            ], View::TEMPLATE_MODE_CP);

            return $this->asJson([
                'html' => $html,
                'headline' => $review['findings'][0]['title'] ?? '',
                'filename' => 'vizy-support-report-' . gmdate('Y-m-d') . '.json',
            ]);
        } catch (Throwable) {
            // Internal exception messages can contain content, credentials or paths.
            return $this->asFailure(Craft::t('vizy', 'The report could not be created. Tell support this happened, along with your Craft and Vizy versions.'));
        }
    }


    // Private Methods
    // =========================================================================

    /**
     * Client-supplied IDs are only hints. Craft's service check adds site access and
     * authorization events, which the element's own canView() doesn't cover.
     */
    private function _element(int $id, int $siteId): ?ElementInterface
    {
        $user = Craft::$app->getUser()->getIdentity();

        if ($id <= 0 || !$user || !in_array($siteId, Craft::$app->getSites()->getEditableSiteIds())) {
            return null;
        }

        $elements = Craft::$app->getElements();
        $element = $elements->getElementById($id, null, $siteId, [
            'status' => null,
            'drafts' => null,
            'provisionalDrafts' => null,
            'revisions' => null,
        ]);

        return $element && $elements->canView($element, $user) ? $element : null;
    }
}
