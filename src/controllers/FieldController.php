<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\helpers\Fields;

use Craft;
use craft\helpers\Json;
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
        $request = Craft::$app->getRequest();

        $fieldLayoutUid = $request->getParam('layoutUid');
        $blockTypeId = $request->getParam('blockTypeId');
        $fieldIds = $request->getParam('fieldIds');
        $layoutConfig = $request->getParam('layout', []);

        $fieldLayout = new FieldLayout();

        if ($fieldLayoutUid) {
            $fieldLayout = Vizy::$plugin->getService()->getFieldLayoutByUid($fieldLayoutUid);
        }

        // Prep the field layout from post - we could be editing an unsaved field layout
        if ($layoutConfig) {
            $fieldLayout = FieldLayout::createFromConfig(Json::decode($layoutConfig));
        }

        // Fetch the available custom fields for the layout - we want to add some exceptions
        $availableCustomFields = $fieldLayout->getAvailableCustomFields();

        // Remove _this_ field - things could get hairy
        if ($fieldIds) {
            foreach ($availableCustomFields as $i => $groupFields) {
                foreach ($groupFields as $j => $fields) {
                    if (in_array($fields->getField()->id, $fieldIds)) {
                        unset($availableCustomFields[$i][$j]);
                    }
                }
            }
        }

        // Render the HTML for the FLD to send back to Vue
        $html = Fields::fieldLayoutDesignerHtml($fieldLayout, [
            // Ensure to namespace the FLD so it's unique. Important when used in Matrix blocks
            // as under normal Vizy field circumstances, you edit one FLD at a time.
            'id' => str_replace('type-', '', $blockTypeId) . 'fld' . mt_rand(),
            'availableCustomFields' => $availableCustomFields,
        ]);

        $headHtml = $view->getHeadHtml();
        $footHtml = $view->getBodyHtml();

        return $this->asJson([
            'html' => $html,
            'headHtml' => $headHtml,
            'footHtml' => $footHtml,
        ]);
    }
}
