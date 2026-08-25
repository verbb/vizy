<?php
namespace verbb\vizy\controllers;

use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\helpers\Fields;
use verbb\vizy\models\BlockType;
use verbb\vizy\models\NodeCollection;
use verbb\vizy\nodes\VizyBlock;
use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;

use Craft;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\elements\Entry;
use craft\fields\Matrix;
use craft\helpers\ElementHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\FieldLayout;
use craft\web\Controller;

use yii\web\BadRequestHttpException;
use yii\web\ForbiddenHttpException;
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

        $fieldLayout = new FieldLayout([
            'type' => BlockType::class,
        ]);

        if ($fieldLayoutUid) {
            $fieldLayout = Craft::$app->getFields()->getLayoutByUid($fieldLayoutUid);
        }

        // Prep the field layout from post - we could be editing an unsaved field layout
        if ($layoutConfig) {
            $fieldLayout = FieldLayout::createFromConfig(Json::decode($layoutConfig));
        }

        if (!$fieldLayout) {
            $fieldLayout = new FieldLayout([
                'type' => BlockType::class,
            ]);
        }

        // Filter out Super Table and Neo for now.
        // https://github.com/verbb/vizy/issues/314
        $availableCustomFields = [];

        $excludedFieldTypes = [
            'verbb\\supertable\\fields\\SuperTableField',
            'benf\\neo\\Field',
        ];

        foreach ($fieldLayout->getAvailableCustomFields() as $key => $fieldLayoutElements) {
            foreach ($fieldLayoutElements as $fieldLayoutElement) {
                // Use a string check so we don't have to check for plugin installs
                if (in_array(get_class($fieldLayoutElement->getField()), $excludedFieldTypes)) {
                    continue;
                }

                $availableCustomFields[$key][] = $fieldLayoutElement;
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

    public function actionCreateMatrixEntry()
    {
        $fieldId = $this->request->getRequiredBodyParam('fieldId');
        $entryTypeId = $this->request->getRequiredBodyParam('entryTypeId');
        $this->request->getRequiredBodyParam('ownerId');
        $siteId = $this->request->getRequiredBodyParam('siteId');
        $namespace = $this->request->getRequiredBodyParam('namespace');
        $staticEntries = $this->request->getBodyParam('staticEntries', false);
        $vizyFieldId = (int)$this->request->getRequiredBodyParam('vizyFieldId');
        $blockInstanceId = $this->_resolveBlockInstanceId();
        $matrixAnchorUid = $this->request->getBodyParam('matrixAnchorUid');

        $field = Craft::$app->getFields()->getFieldById($fieldId);

        if (!$field instanceof Matrix) {
            throw new BadRequestHttpException("Invalid Matrix field ID: $fieldId");
        }

        $vizyField = Craft::$app->getFields()->getFieldById($vizyFieldId);

        if (!$vizyField instanceof VizyField) {
            throw new BadRequestHttpException("Invalid Vizy field ID: $vizyFieldId");
        }

        $entryType = Craft::$app->getEntries()->getEntryTypeById($entryTypeId);

        if (!$entryType) {
            throw new BadRequestHttpException("Invalid entry type ID: $entryTypeId");
        }

        $site = Craft::$app->getSites()->getSiteById($siteId, true);

        if (!$site) {
            throw new BadRequestHttpException("Invalid site ID: $siteId");
        }

        $user = static::currentUser();
        $elementsService = Craft::$app->getElements();
        $parentOwner = $this->_resolveParentOwner((int)$siteId);

        if (!$parentOwner || !$elementsService->canSave($parentOwner, $user)) {
            throw new ForbiddenHttpException('User not authorized to create this element.');
        }

        $parentOwner = Vizy::$plugin->getAnchors()->resolvePersistableParentOwner($parentOwner);

        $blockType = $this->_resolveBlockType($vizyField, $blockInstanceId, $parentOwner);

        if (!$blockType && ($blockTypeId = $this->request->getBodyParam('vizyBlockTypeId'))) {
            $blockType = $vizyField->getBlockTypeById($blockTypeId);
        }

        if (!$blockType) {
            throw new BadRequestHttpException('Unable to resolve Vizy block type for Matrix anchor.');
        }

        $anchor = Vizy::$plugin->getAnchors()->ensureAnchor(
            $parentOwner,
            $vizyField,
            $blockInstanceId,
            $blockType->getFieldLayout(),
            $matrixAnchorUid,
        );

        if (!$anchor) {
            return $this->asFailure(StringHelper::upperCaseFirst(Craft::t('vizy', 'Couldn’t create matrix anchor.')));
        }

        $entry = Craft::createObject([
            'class' => Entry::class,
            'siteId' => $siteId,
            'uid' => StringHelper::UUID(),
            'typeId' => $entryType->id,
            'fieldId' => $fieldId,
            'primaryOwner' => $anchor,
            'owner' => $anchor,
            'slug' => ElementHelper::tempSlug(),
        ]);

        $entry->setScenario(Element::SCENARIO_ESSENTIALS);

        if (!Craft::$app->getDrafts()->saveElementAsDraft($entry, $user->id, markAsSaved: false)) {
            return $this->asFailure(StringHelper::upperCaseFirst(Craft::t('app', 'Couldn’t create {type}.', [
                'type' => Entry::lowerDisplayName(),
            ])));
        }

        $view = $this->getView();
        $entries = [];

        $html = $view->namespaceInputs(fn() => $view->renderTemplate('_components/fieldtypes/Matrix/block.twig', [
            'name' => $field->handle,
            'entryTypes' => $field->getEntryTypesForField($entries, $anchor),
            'entry' => $entry,
            'isFresh' => true,
            'static' => false,
            'staticEntries' => $staticEntries,
        ]), $namespace);

        return $this->asJson([
            'blockHtml' => $html,
            'headHtml' => $view->getHeadHtml(),
            'bodyHtml' => $view->getBodyHtml(),
            'matrixAnchorUid' => $anchor->uid,
        ]);
    }

    private function _resolveBlockType(VizyField $vizyField, string $blockInstanceId, ElementInterface $parentOwner): ?BlockType
    {
        $value = $parentOwner->getFieldValue($vizyField->handle);

        if (!$value instanceof NodeCollection) {
            return null;
        }

        foreach ($value->query()->where(['type' => VizyBlock::$type])->all() as $block) {
            if ($block instanceof VizyBlock && $block->getId() === $blockInstanceId) {
                return $block->getBlockType();
            }
        }

        return null;
    }

    private function _resolveParentOwner(int $siteId): ?ElementInterface
    {
        $elementsService = Craft::$app->getElements();

        // Prefer uid/id first — when Vizy lives on a nested owner (Neo/Super Table),
        // parentDraftId often belongs to the root entry and must not win.
        if ($uid = $this->request->getBodyParam('parentOwnerUid')) {
            $uid = trim($uid, '"');
            $element = $elementsService->getElementByUid($uid, null, $siteId);

            if ($element instanceof ElementInterface) {
                return $element;
            }
        }

        if ($id = $this->request->getBodyParam('parentOwnerId')) {
            $element = $elementsService->getElementById((int)$id, null, $siteId);

            if ($element instanceof ElementInterface) {
                return $element;
            }
        }

        if ($draftId = $this->request->getBodyParam('parentDraftId')) {
            $entry = Entry::find()
                ->draftId($draftId)
                ->siteId($siteId)
                ->status(null)
                ->one();

            if ($entry instanceof Entry) {
                return $entry;
            }
        }

        // Fallback: MatrixInput sends the MatrixAnchor id as ownerId once the block has been saved.
        if ($ownerId = $this->request->getBodyParam('ownerId')) {
            $owner = $elementsService->getElementById((int)$ownerId, null, $siteId);

            if ($owner instanceof MatrixAnchor) {
                $parent = $owner->getParentOwner();

                if ($parent instanceof ElementInterface) {
                    return $parent;
                }
            }
        }

        return null;
    }

    private function _resolveBlockInstanceId(): string
    {
        if ($blockInstanceId = $this->request->getBodyParam('blockInstanceId')) {
            return $blockInstanceId;
        }

        if ($namespace = $this->request->getBodyParam('namespace')) {
            if (preg_match('/vizyData\[([^\]]+)\]/', $namespace, $matches)) {
                return $matches[1];
            }
        }

        throw new BadRequestHttpException('Missing blockInstanceId.');
    }
}
