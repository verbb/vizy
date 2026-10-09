<?php
namespace verbb\vizy\controllers;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\AnchorDocuments;
use verbb\vizy\helpers\Fields;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\FieldLayoutForms;

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

use UnitEnum;

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

        // One source of truth with FieldLifecycle — unsupported nested owners
        // such as Neo/Super Table/Content Block/Addresses stay out of
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

        [$field, $entryType, $anchor] = $this->_matrixContext((int)$fieldId, (int)$entryTypeId, $ownerId, (int)$siteId, (string)$namespace);
        $user = static::currentUser();
        $elementsService = Craft::$app->getElements();

        $attributes = [
            'siteId' => $siteId,
            'uid' => StringHelper::UUID(),
            'typeId' => $entryType->id,
            'fieldId' => $fieldId,
            'primaryOwner' => $anchor,
            'owner' => $anchor,
            'slug' => ElementHelper::tempSlug(),
        ];

        // Match Craft's native Matrix Duplicate contract without persisting a
        // provisional draft during this render-only request. The submitted row
        // is saved atomically with the outer Vizy owner later.
        $sourceId = $this->request->getBodyParam('duplicate');

        if ($sourceId) {
            if (!$anchor->id) {
                throw new BadRequestHttpException('Matrix rows can only be duplicated from persisted content.');
            }

            $source = Entry::find()
                ->id($sourceId)
                ->siteId($siteId)
                ->fieldId($fieldId)
                ->ownerId($anchor->id)
                ->typeId($entryType->id)
                ->drafts(null)
                ->status(null)
                ->one();

            if (!$source) {
                throw new BadRequestHttpException("Invalid source element ID: $sourceId");
            }

            // Check the source while it still has its persisted owner. Replacing
            // the owner first would make Matrix authorize against the target and
            // could disclose a guessed row from another owner or field.
            if (!$elementsService->canView($source, $user)) {
                throw new ForbiddenHttpException('User not authorized to view this element.');
            }

            $source->setOwner($anchor);

            if (!$elementsService->canDuplicateAsDraft($source, $user)) {
                throw new ForbiddenHttpException('User not authorized to duplicate this element.');
            }

            $entry = clone $source;
            $entry->id = null;
            $entry->uid = $attributes['uid'];
            $entry->draftId = null;
            $entry->siteSettingsId = null;
            $entry->root = null;
            $entry->lft = null;
            $entry->rgt = null;
            $entry->level = null;
            $entry->dateCreated = null;
            $entry->dateUpdated = null;
            $entry->dateLastMerged = null;
            $entry->duplicateOf = $source;
            $entry->setCanonicalId(null);
            Craft::configure($entry, $attributes);

            // Avoid a shared query/model instance allowing edits in the new row
            // to mutate the source's normalized field value before submission.
            foreach ($entry->getFieldValues() as $handle => $value) {
                if (is_object($value) && !$value instanceof UnitEnum) {
                    $entry->setFieldValue($handle, clone $value);
                }
            }
        } else {
            $entry = Craft::createObject([
                'class' => Entry::class,
                ...$attributes,
            ]);
        }

        $entry->setScenario(Element::SCENARIO_ESSENTIALS);

        // The UID identifies this pending row in the submitted document. Craft
        // saves it together with its owner; rendering cannot leave draft rows.

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


    public function actionRefreshMatrixEntry(): Response
    {
        $this->requireCpRequest();
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $namespace = (string)$this->request->getHeaders()->get('X-Craft-Namespace');

        if (!preg_match('/^vizyHost\[[A-Za-z0-9_-]{101,}\]/', $namespace)) {
            throw new BadRequestHttpException('A signed Vizy Matrix placement is required.');
        }

        $uid = (string)$this->request->getRequiredBodyParam('elementUid');
        $fieldId = (int)$this->request->getRequiredBodyParam('fieldId');
        $typeId = (int)$this->request->getRequiredBodyParam('typeId');
        $siteId = (int)$this->request->getRequiredBodyParam('siteId');
        [$field, $type, $anchor, $blockUid] = $this->_matrixContext(
            $fieldId,
            $typeId,
            (int)$this->request->getBodyParam('ownerId'),
            $siteId,
            $namespace,
        );

        // Only pending rows directly owned by this signed Vizy placement use
        // this route. Persisted and deeper native Matrix rows retain Craft's path.
        $namespaceSegment = FieldLayoutForms::blockNamespaceSegment($blockUid);
        $suffix = '[' . $namespaceSegment . '][fields][fields][' . $field->handle . '][entries][uid:' . $uid . ']';
        $namespaceMatches = str_ends_with($namespace, $suffix);

        // Let already-open editors finish requests made with the previous safe
        // literal namespace. Unsafe identifiers must use the hashed form.
        if (!$namespaceMatches && preg_match('/^[A-Za-z0-9_-]+$/D', $blockUid)) {
            $legacySuffix = '[' . $blockUid . '][fields][fields][' . $field->handle . '][entries][uid:' . $uid . ']';
            $namespaceMatches = str_ends_with($namespace, $legacySuffix);
        }

        if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iD', $uid) || !$namespaceMatches
            || $this->request->getBodyParam('elementType') !== Entry::class
            || $this->request->getBodyParam('elementId')
            || $this->request->getBodyParam('draftId')
            || $this->request->getBodyParam('revisionId')) {
            throw new BadRequestHttpException('Invalid pending Vizy Matrix row.');
        }

        $entry = new Entry([
            'uid' => $uid, 'siteId' => $siteId, 'typeId' => $type->id,
            'fieldId' => $field->id, 'owner' => $anchor, 'primaryOwner' => $anchor,
            'slug' => ElementHelper::tempSlug(),
        ]);
        // Use Craft's request normalization so widget helper inputs are not
        // mistaken for fields, and non-editable fields remain protected.
        $entry->setFieldValuesFromRequest('fields');
        $entry->sortOrder = (int)$this->request->getBodyParam('sortOrder', 1);
        $entry->enabled = (bool)$this->request->getBodyParam('enabled', true);
        $entry->setScenario(Element::SCENARIO_ESSENTIALS);

        $view = $this->getView();
        $form = $entry->getFieldLayout()->createForm($entry, false, [
            'namespace' => $namespace,
            'registerDeltas' => false,
            'visibleElements' => $this->request->getBodyParam('visibleLayoutElements', []),
            'staticElements' => $this->request->getBodyParam('staticLayoutElements', []),
        ]);
        $missingElements = [];

        foreach ($form->tabs as $tab) {
            if (!$tab->getUid()) {
                continue;
            }
            $elements = [];

            foreach ($tab->elements as [$layoutElement, $conditional, $html, $static]) {
                if ($conditional) {
                    $elements[] = ['uid' => $layoutElement->uid, 'html' => $html, 'static' => $static];
                }
            }
            $missingElements[] = ['uid' => $tab->getUid(), 'id' => $tab->getId(), 'elements' => $elements];
        }
        $tabs = $form->getTabMenu();
        $selected = $this->request->getBodyParam('selectedTab');
        $tabHtml = count($tabs) > 1 ? $view->namespaceInputs(fn() => $view->renderTemplate('_includes/tabs.twig', [
            'tabs' => $tabs, 'selectedTab' => isset($tabs[$selected]) ? $selected : null,
        ]), $namespace) : null;

        return $this->asJson([
            'tabs' => $tabHtml, 'missingElements' => $missingElements,
            'headHtml' => $view->getHeadHtml(), 'bodyHtml' => $view->getBodyHtml(),
            'initialDeltaValues' => $view->getInitialDeltaValues(), 'uiLabel' => $entry->getUiLabel(),
        ]);
    }


    // Private Methods
    // =========================================================================

    private function _matrixContext(int $fieldId, int $entryTypeId, int $ownerId, int $siteId, string $namespace): array
    {
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

        // Matrix row construction is a read-only form operation. A signed
        // namespace binds even a new block to its authorized owner and layout.
        if (preg_match('/vizyHost\[([A-Za-z0-9_-]+)\]/', (string)$namespace, $matches) && strlen($matches[1]) > 100) {
            try {
                $resolver = new FieldLayoutController('field-layout', $this->module);
                $resolved = $resolver->resolveEditorContext($matches[1]);
            } catch (\Throwable $exception) {
                throw new BadRequestHttpException('Invalid Vizy Matrix editor context.', 0, $exception);
            }

            if (!$resolved) {
                throw new BadRequestHttpException('The Vizy Matrix placement has changed. Reload the editor.');
            }
            [$context, $parentOwner, $vizyField] = $resolved;

            if ((int)$context['siteId'] !== (int)$siteId) {
                throw new BadRequestHttpException('Vizy Matrix site does not match its editor.');
            }
            $blockInstanceId = $context['matrixBlockUid'] ?? '';
            $blockType = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($context['matrixBlockTypeUid'] ?? '');

            if (!$blockType || !in_array($blockType->uid, $vizyField->getAllowedBlockTypeUids(), true)) {
                throw new BadRequestHttpException('Vizy Matrix block type is no longer available.');
            }
            $matrixAnchorUid = $context['matrixAnchorUid'] ?? null;
        } else {
            // Older open editors can still resolve an existing anchor, but
            // cannot manufacture a replacement through this render endpoint.
            $resolved = $this->_resolveMatrixAnchorContext($ownerId, (int)$siteId);
            $vizyField = $resolved['vizyField'];
            $blockInstanceId = $resolved['blockInstanceId'];
            $matrixAnchorUid = $resolved['matrixAnchorUid'];
            $parentOwner = $resolved['parentOwner'];

            if (!$parentOwner || !$elementsService->canSave($parentOwner, $user)) {
                throw new ForbiddenHttpException('User not authorized to create this element.');
            }
            $blockType = $this->_resolveBlockType($vizyField, $blockInstanceId, $parentOwner);
        }
        $field = $blockType?->getFieldLayout()?->getFieldById($fieldId);

        if (!$field instanceof Matrix) {
            throw new BadRequestHttpException('Matrix field is not placed in this Vizy block type.');
        }

        if (!in_array((int)$entryType->id, array_map(static fn($type): int => (int)$type->id, $field->getEntryTypes()), true)) {
            throw new BadRequestHttpException('Entry type is not available for this Matrix field.');
        }

        if (isset($context['embeddedPath'])) {
            if ($matrixAnchorUid) {
                throw new BadRequestHttpException('An embedded Matrix field cannot reference another owner’s stored rows.');
            }
            $projection = new \verbb\vizy\elements\Block();
            $projection->setOwner($parentOwner);
            $projection->setField($vizyField);
            $projection->setType($blockType);
            $projection->setBlockUid($blockInstanceId);
            $projection->setFieldLayout($blockType->getFieldLayout());
            return [$field, $entryType, $projection, $blockInstanceId];
        }
        $documentKey = isset($context) && is_array($context)
            ? AnchorDocuments::keyFromEditorContext($context)
            : null;
        $anchor = isset($context['embeddedPath']) ? null : Vizy::$plugin->getAnchors()->getAnchor($parentOwner, $vizyField, $blockInstanceId, $matrixAnchorUid, $documentKey);

        if (!$anchor && $matrixAnchorUid) {
            throw new BadRequestHttpException('Stored Matrix content could not be resolved. Restore it before adding rows.');
        }

        if (!$anchor) {
            $anchor = new \verbb\vizy\elements\MatrixAnchor([
                'parentOwnerId' => $parentOwner->id,
                'vizyFieldId' => $vizyField->id,
                'blockInstanceId' => $blockInstanceId,
                'documentKey' => $documentKey ?? '',
                'siteId' => $siteId,
            ]);
            $anchor->setParentOwner($parentOwner);
        }
        $anchor->setFieldLayout($blockType->getFieldLayout());

        return [$field, $entryType, $anchor, $blockInstanceId];
    }

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
            // Vizy 4 before namespace hardening: vizyHost[nonce][blockUid][fields]…
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
