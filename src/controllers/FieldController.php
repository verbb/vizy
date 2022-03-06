<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;

use Craft;
use craft\fieldlayoutelements\CustomField;
use craft\helpers\Json;
use craft\models\FieldLayout;
use craft\models\FieldLayoutTab;
use craft\web\Controller;

use yii\base\InvalidArgumentException;
use yii\web\BadRequestHttpException;
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
        $elementPlacements = $request->getParam('elementPlacements', []);
        $elementConfigs = $request->getParam('elementConfigs', []);

        $fieldLayout = null;

        if ($fieldLayoutUid) {
            $fieldLayout = Vizy::$plugin->getService()->getFieldLayoutByUid($fieldLayoutUid);
        }

        if (!$fieldLayout) {
            $fieldLayout = new FieldLayout();
        }

        // Prep the field layout from post - we could be editing an unsaved field layout
        if ($elementPlacements && $elementConfigs) {
            $tabs = [];
            $fields = [];
            $tabSortOrder = 0;

            foreach ($elementPlacements as $tabName => $elementKeys) {
                $tab = $tabs[] = new FieldLayoutTab();
                $tab->name = urldecode($tabName);
                $tab->sortOrder = ++$tabSortOrder;
                $tab->elements = [];

                if (!is_array($elementKeys)) {
                    continue;
                }

                foreach ($elementKeys as $i => $elementKey) {
                    $elementConfig = Json::decode($elementConfigs[$elementKey]);

                    try {
                        $element = Craft::$app->getFields()->createLayoutElement($elementConfig);
                    } catch (InvalidArgumentException $e) {
                        throw new BadRequestHttpException($e->getMessage(), 0, $e);
                    }

                    $tab->elements[] = $element;

                    if ($element instanceof CustomField) {
                        $fieldUid = $element->getFieldUid();
                        $field = Craft::$app->getFields()->getFieldByUid($fieldUid);

                        if (!$field) {
                            throw new BadRequestHttpException("Invalid field UUID: $fieldUid");
                        }

                        $field->required = (bool)($elementConfig['required'] ?? false);
                        $field->sortOrder = ($i + 1);
                        $fields[] = $field;
                    }
                }
            }

            $fieldLayout->setTabs($tabs);
            $fieldLayout->setFields($fields);
        }

        // Fetch the available custom fields for the layout - we want to add some exceptions
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

        // Ensure to namespace the FLD so it's unique. Important when used in Matrix blocks
        // as under normal Vizy field circumstances, you edit a one FLD at a time.
        $originalNamespace = $view->getNamespace();
        $namespace = $view->namespaceInputName(str_replace('type-', '', $blockTypeId), $originalNamespace);
        $view->setNamespace($namespace);

        // Render the HTML for the FLD to send back to Vue
        $html = $view->renderTemplate('vizy/field/_includes/fld', [
            'fieldLayout' => $fieldLayout,
            'availableCustomFields' => $availableCustomFields,
        ]);

        $headHtml = $view->getHeadHtml();
        $footHtml = $view->getBodyHtml();

        $view->setNamespace($originalNamespace);

        return $this->asJson([
            'html' => $html,
            'headHtml' => $headHtml,
            'footHtml' => $footHtml,
        ]);
    }
}
