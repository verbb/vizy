<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;

use Craft;
use craft\models\FieldLayout;
use craft\web\Controller;

class FieldController extends Controller
{
    // Public Methods
    // =========================================================================

    public function actionLayoutDesigner()
    {
        $view = Craft::$app->getView();
        $request = Craft::$app->getRequest();

        $fieldLayoutUid = $request->getParam('layoutUid');
        $fieldIds = explode(',', $request->getParam('fieldIds'));

        if (!is_array($fieldIds)) {
            $fieldIds = [];
        }

        $fieldLayout = null;

        if ($fieldLayoutUid) {
            $fieldLayout = Vizy::$plugin->getService()->getFieldLayoutByUid($fieldLayoutUid);
        }

        if (!$fieldLayout) {
            $fieldLayout = new FieldLayout();
        }

        $availableCustomFields = $fieldLayout->getAvailableCustomFields();

        // Remove _this_ field - things could get hairy
        if ($fieldIds) {
            foreach ($availableCustomFields as $i => $groupFields) {
                foreach ($groupFields as $j => $fields) {
                    if (in_array($fields->field->id, $fieldIds)) {
                        unset($availableCustomFields[$i][$j]);
                    }
                }
            }
        }

        $html = $view->renderTemplate('vizy/field/_includes/fld', [
            'fieldLayout' => $fieldLayout,
            'availableCustomFields' => $availableCustomFields,
        ]);

        return $this->asJson([
            'html' => $html,
            'headHtml' => $view->getHeadHtml(),
            'footHtml' => $view->getBodyHtml(),
        ]);
    }
}
