<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Fields;
use verbb\vizy\models\BlockType;

use Craft;
use craft\base\Element;
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
        $this->requireCpRequest();
        $this->requireAcceptsJson();
        // Field layout designer HTML is an admin settings surface (Block Types).
        $this->requireAdmin();

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

        // One source of truth with FieldLifecycle — Matrix/Neo/Super Table/
        // Content Block/Addresses (and registered nested owners) stay out of
        // “available custom fields” for new Block Type placements.
        $lifecycle = Vizy::$plugin->getFieldLifecycle();
        $availableCustomFields = [];

        foreach ($fieldLayout->getAvailableCustomFields() as $key => $fieldLayoutElements) {
            foreach ($fieldLayoutElements as $fieldLayoutElement) {
                $candidate = $fieldLayoutElement->getField();
                if ($candidate && !$lifecycle->permitsNewPlacement($candidate)) {
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
        $this->requireCpRequest();
        $this->requirePostRequest();

        $fieldId = $this->request->getRequiredBodyParam('fieldId');
        $entryTypeId = $this->request->getRequiredBodyParam('entryTypeId');
        $ownerId = (int)$this->request->getRequiredBodyParam('ownerId');
        $siteId = $this->request->getRequiredBodyParam('siteId');
        $namespace = $this->request->getRequiredBodyParam('namespace');
        $staticEntries = $this->request->getBodyParam('staticEntries', false);

        $field = Craft::$app->getFields()->getFieldById($fieldId);

        if (!$field instanceof Matrix) {
            throw new BadRequestHttpException("Invalid Matrix field ID: $fieldId");
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

        // Prefer explicit Vizy params; else resolve from MatrixAnchor (Block.id = anchor.id).
        $resolved = $this->_resolveMatrixAnchorContext($ownerId, (int)$siteId);
        $vizyField = $resolved['vizyField'];
        $blockInstanceId = $resolved['blockInstanceId'];
        $matrixAnchorUid = $resolved['matrixAnchorUid'];
        $parentOwner = $resolved['parentOwner'] ?? $this->_resolveParentOwner((int)$siteId);

        if (!$parentOwner || !$elementsService->canSave($parentOwner, $user)) {
            throw new ForbiddenHttpException('User not authorized to create this element.');
        }

        $blockType = $this->_resolveBlockType($vizyField, $blockInstanceId, $parentOwner);

        if (!$blockType && ($blockTypeId = $this->request->getBodyParam('vizyBlockTypeId'))) {
            $blockType = $vizyField->getBlockTypeByIdOrHandle($blockTypeId);
        }

        if (!$blockType) {
            throw new BadRequestHttpException('Unable to resolve Vizy block type for Matrix anchor.');
        }

        // Resolve the placement from the authorized Block layout, not the global
        // field registry: a valid field ID alone does not authorize its use here.
        $field = $blockType->getFieldLayout()?->getFieldById($fieldId);
        if (!$field instanceof Matrix) {
            throw new BadRequestHttpException('Matrix field is not placed in this Vizy block type.');
        }
        if (!in_array((int)$entryType->id, array_map(static fn($type): int => (int)$type->id, $field->getEntryTypes()), true)) {
            throw new BadRequestHttpException('Entry type is not available for this Matrix field.');
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

        if (!$elementsService->canSave($entry, $user)) {
            throw new ForbiddenHttpException('User not authorized to create this element.');
        }

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


    // Private Methods
    // =========================================================================

    private function _resolveMatrixAnchorContext(int $ownerId, int $siteId): array
    {
        $vizyFieldId = $this->request->getBodyParam('vizyFieldId');
        $blockInstanceId = $this->request->getBodyParam('blockInstanceId');
        $matrixAnchorUid = $this->request->getBodyParam('matrixAnchorUid');
        $parentOwner = null;

        // Mount sets Block.id = MatrixAnchor.id, so Craft Matrix posts that id.
        $anchor = Craft::$app->getElements()->getElementById(
            $ownerId,
            \verbb\vizy\elements\MatrixAnchor::class,
            $siteId,
        );

        if ($anchor instanceof \verbb\vizy\elements\MatrixAnchor) {
            if (
                ($vizyFieldId && (int)$vizyFieldId !== $anchor->vizyFieldId)
                || ($blockInstanceId && $blockInstanceId !== $anchor->blockInstanceId)
                || ($matrixAnchorUid && $matrixAnchorUid !== $anchor->uid)
            ) {
                throw new BadRequestHttpException('Vizy Matrix context does not match its owner.');
            }
            $vizyFieldId = $vizyFieldId ?: $anchor->vizyFieldId;
            $blockInstanceId = $blockInstanceId ?: $anchor->blockInstanceId;
            $matrixAnchorUid = $matrixAnchorUid ?: $anchor->uid;
            if ($anchor->parentOwnerId) {
                $parent = Craft::$app->getElements()->getElementById(
                    (int)$anchor->parentOwnerId,
                    Entry::class,
                    $siteId,
                );
                if ($parent instanceof Entry) {
                    $parentOwner = $parent;
                }
            }
        }

        if (!$blockInstanceId) {
            $blockInstanceId = $this->_resolveBlockInstanceIdFromNamespace();
        }

        if (!$vizyFieldId || !$blockInstanceId) {
            throw new BadRequestHttpException('Unable to resolve Vizy Matrix anchor context.');
        }

        $vizyField = Craft::$app->getFields()->getFieldById((int)$vizyFieldId);
        if (!$vizyField instanceof VizyField) {
            throw new BadRequestHttpException("Invalid Vizy field ID: $vizyFieldId");
        }

        return [
            'vizyField' => $vizyField,
            'blockInstanceId' => (string)$blockInstanceId,
            'matrixAnchorUid' => is_string($matrixAnchorUid) ? $matrixAnchorUid : null,
            'parentOwner' => $parentOwner,
        ];
    }

    private function _resolveBlockType(VizyField $vizyField, string $blockInstanceId, Entry $parentOwner): ?BlockType
    {
        $value = $parentOwner->getFieldValue($vizyField->handle);

        if ($value instanceof \verbb\vizy\document\VizyDocument) {
            $block = $value->findBlock($blockInstanceId);
            return $block?->blockType();
        }

        return null;
    }

    private function _resolveParentOwner(int $siteId): ?Entry
    {
        $elementsService = Craft::$app->getElements();

        if ($uid = $this->request->getBodyParam('parentOwnerUid')) {
            $uid = trim($uid, '"');
            $entry = $elementsService->getElementByUid($uid, Entry::class, $siteId);

            if ($entry instanceof Entry) {
                return $entry;
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

        if ($id = $this->request->getBodyParam('parentOwnerId')) {
            $entry = $elementsService->getElementById((int)$id, Entry::class, $siteId);

            if ($entry instanceof Entry) {
                return $entry;
            }
        }

        return null;
    }

    private function _resolveBlockInstanceIdFromNamespace(): string
    {
        if ($blockInstanceId = $this->request->getBodyParam('blockInstanceId')) {
            return $blockInstanceId;
        }

        if ($namespace = $this->request->getBodyParam('namespace')) {
            // Vizy 4: vizyHost[nonce][blockUid][fields]…
            if (preg_match('/vizyHost\[[^\]]+\]\[([^\]]+)\]/', $namespace, $matches)) {
                return $matches[1];
            }
            // Vizy 3: vizyData[blockUid]…
            if (preg_match('/vizyData\[([^\]]+)\]/', $namespace, $matches)) {
                return $matches[1];
            }
        }

        throw new BadRequestHttpException('Missing blockInstanceId.');
    }
}
