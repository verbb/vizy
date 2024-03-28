<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\helpers\Fields;

use Craft;
use craft\base\Element;
use craft\elements\Entry;
use craft\helpers\ElementHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\web\Controller;

use yii\web\Response;

class FieldController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionLayoutDesigner(): Response
    {
        $view = Craft::$app->getView();

        $fieldLayoutUid = $this->request->getParam('layoutUid');
        $blockTypeId = $this->request->getParam('blockTypeId');
        $fieldIds = $this->request->getParam('fieldIds');
        $layoutConfig = $this->request->getParam('layout', []);

        $fieldLayout = new FieldLayout();

        if ($fieldLayoutUid) {
            $fieldLayout = Craft::$app->getFields()->getLayoutByUid($fieldLayoutUid);
        }

        // Prep the field layout from post - we could be editing an unsaved field layout
        if ($layoutConfig) {
            $fieldLayout = FieldLayout::createFromConfig(Json::decode($layoutConfig));
        }

        if (!$fieldLayout) {
            $fieldLayout = new FieldLayout();
        }

        // Render the HTML for the FLD to send back to Vue
        $html = Fields::fieldLayoutDesignerHtml($fieldLayout, [
            // Ensure to namespace the FLD so it's unique. Important when used in Matrix blocks
            // as under normal Vizy field circumstances, you edit one FLD at a time.
            'id' => str_replace('type-', '', $blockTypeId) . 'fld' . mt_rand(),
        ]);

        $headHtml = $view->getHeadHtml();
        $footHtml = $view->getBodyHtml();

        return $this->asJson([
            'html' => $html,
            'headHtml' => $headHtml,
            'footHtml' => $footHtml,
        ]);
    }

    public function actionCreateMatrixEntry()
    {
        // Override `MatrixController::actionCreateEntry` to handle non-saved-element owners.
        $fieldId = $this->request->getRequiredBodyParam('fieldId');
        $entryTypeId = $this->request->getRequiredBodyParam('entryTypeId');
        $siteId = $this->request->getRequiredBodyParam('siteId');
        $namespace = $this->request->getRequiredBodyParam('namespace');

        $field = Craft::$app->getFields()->getFieldById($fieldId);
        $entryType = Craft::$app->getEntries()->getEntryTypeById($entryTypeId);
        $site = Craft::$app->getSites()->getSiteById($siteId, true);

        $entry = Craft::createObject([
            'class' => Entry::class,
            'siteId' => $siteId,
            'uid' => StringHelper::UUID(),
            'typeId' => $entryType->id,
            'fieldId' => $fieldId,
            'slug' => ElementHelper::tempSlug(),
        ]);

        $entry->setScenario(Element::SCENARIO_ESSENTIALS);

        $view = $this->getView();
        $entries = [];

        $html = $view->namespaceInputs(fn() => $view->renderTemplate('_components/fieldtypes/Matrix/block.twig', [
            'name' => $field->handle,
            'entryTypes' => $field->getEntryTypesForField($entries, null),
            'entry' => $entry,
            'isFresh' => true,
        ]), $namespace);

        return $this->asJson([
            'blockHtml' => $html,
            'headHtml' => $view->getHeadHtml(),
            'bodyHtml' => $view->getBodyHtml(),
        ]);
    }
}
