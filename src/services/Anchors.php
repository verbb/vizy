<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\db\Table;
use verbb\vizy\elements\Block as BlockElement;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Matrix as MatrixHelper;
use verbb\vizy\nodes\VizyBlock;
use verbb\vizy\records\MatrixAnchor as MatrixAnchorRecord;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\db\Query;
use craft\elements\db\EntryQuery;
use craft\elements\ElementCollection;
use craft\elements\Entry;
use craft\errors\InvalidFieldException;
use craft\fields\Matrix;
use craft\helpers\ElementHelper;
use craft\helpers\Json;
use craft\models\FieldLayout;

use verbb\vizy\models\NodeCollection as VizyNodeCollection;

use yii\db\IntegrityException;

class Anchors extends Component
{
    // Properties
    // =========================================================================

    private array $_copyingAnchorIds = [];


    // Public Methods
    // =========================================================================

    public function getAnchor(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?string $anchorUid = null,
    ): ?MatrixAnchor {
        if (!$this->_tableExists()) {
            return null;
        }

        $parentOwner = $this->resolvePersistableParentOwner($parentOwner);

        $elementsService = Craft::$app->getElements();
        $siteId = $parentOwner->siteId;
        $ownerId = (int)$parentOwner->id;

        if ($anchorUid) {
            $anchor = $elementsService->getElementByUid($anchorUid, MatrixAnchor::class, $siteId);

            // Never return another element's MatrixAnchor — duplicated Vizy JSON keeps the
            // source matrixAnchorUid until we create a new anchor for this owner (#376).
            if (
                $anchor instanceof MatrixAnchor &&
                (int)$anchor->parentOwnerId === $ownerId &&
                (int)$anchor->vizyFieldId === (int)$vizyField->id &&
                $anchor->blockInstanceId === $blockInstanceId
            ) {
                return $anchor;
            }
        }

        if (!$parentOwner->id) {
            return null;
        }

        $record = $this->_findAnchorRecord($parentOwner, $vizyField, $blockInstanceId);

        if (!$record) {
            return null;
        }

        $anchor = $elementsService->getElementById($record->id, MatrixAnchor::class, $siteId);

        return $anchor instanceof MatrixAnchor ? $anchor : null;
    }

    public function ensureAnchor(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?FieldLayout $fieldLayout = null,
        ?string $anchorUid = null,
    ): ?MatrixAnchor {
        $parentOwner = $this->resolvePersistableParentOwner($parentOwner);

        if (!$parentOwner->id || !$this->_tableExists()) {
            return null;
        }

        if (!$this->_parentOwnerExistsInElements($parentOwner)) {
            Vizy::error(sprintf(
                'Refusing to create Vizy matrix anchor for field #%s block `%s`: parent owner #%s is not a persisted element.',
                $vizyField->id,
                $blockInstanceId,
                (int)$parentOwner->id,
            ));

            return null;
        }

        $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

        if ($anchor && (!$anchorUid || $anchor->uid === $anchorUid)) {
            return $this->_applyFieldLayout($anchor, $fieldLayout, $parentOwner);
        }

        $lockName = $this->_mutexLockName($parentOwner, $vizyField, $blockInstanceId);
        $mutex = Craft::$app->getMutex();

        // Keep creation and copying under the same lock. A concurrent editor must never
        // observe a newly created anchor before its nested entries have been copied.
        if (!$mutex->acquire($lockName, 5)) {
            throw new \RuntimeException('Unable to lock Vizy matrix anchor for copying. Please retry.');
        }

        $transaction = null;

        try {
            $transaction = Craft::$app->getDb()->beginTransaction();
            $source = $this->_sourceAnchorForCopy($parentOwner, $vizyField, $blockInstanceId, $anchorUid);
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

            if (!$anchor) {
                // The anchor may exist without a localized elements_sites row.
                $record = $this->_findAnchorRecord($parentOwner, $vizyField, $blockInstanceId);
                $anchor = $record
                    ? $this->_ensureAnchorSite($record, $parentOwner, $fieldLayout)
                    : $this->_createAnchor($parentOwner, $vizyField, $blockInstanceId, $fieldLayout, $anchorUid);
            }

            if ($anchor) {
                $this->_applyFieldLayout($anchor, $fieldLayout, $parentOwner);

                if ($source) {
                    $this->_duplicateAnchorNestedContent($source, $anchor, $fieldLayout, $parentOwner->updatingFromDerivative);
                }
            }

            $transaction->commit();

            return $anchor;
        } catch (\Throwable $e) {
            $transaction?->rollBack();
            throw $e;
        } finally {
            $mutex->release($lockName);
        }
    }

    public function saveMatrixField(
        Matrix $field,
        MatrixAnchor $anchor,
        mixed $fieldValue,
        bool $isNew,
        bool $allowEmpty = false,
    ): void {
        if ($fieldLayout = $anchor->getFieldLayout()) {
            $anchor->setFieldLayout($fieldLayout);
        }

        $field = $this->_matrixFieldForAnchor($field, $anchor);
        $expected = $this->_matrixValueCount($fieldValue);
        $existing = $this->_anchorNestedCount($field, $anchor);

        // Empty payloads are usually portal misses. Only wipe nested entries when the
        // caller explicitly opts in (Matrix UI cleared every entry).
        if ($expected === 0) {
            if ($existing > 0 && !$allowEmpty) {
                throw new \RuntimeException(sprintf(
                    'Vizy matrix field `%s` refused empty save on anchor #%s (%d nested entries present).',
                    $field->handle,
                    $anchor->id,
                    $existing,
                ));
            }

            if ($existing === 0) {
                return;
            }
        }

        $anchor->setFieldValue($field->handle, $fieldValue);
        $anchor->setDirtyFields([$field->handle]);
        $field->afterElementPropagate($anchor, $isNew);

        if ($expected > 0) {
            $this->_assertMatrixFieldPersisted($field, $anchor, $expected);
        }
    }

    public function deleteAnchor(MatrixAnchor $anchor): void
    {
        if ($fieldLayout = $anchor->getFieldLayout()) {
            foreach ($fieldLayout->getCustomFields() as $field) {
                if ($field instanceof Matrix) {
                    $field->beforeElementDelete($anchor);
                }
            }
        }

        Craft::$app->getElements()->deleteElement($anchor);
    }

    public function gcOrphans(ElementInterface $parentOwner, VizyField $vizyField): void
    {
        if (!$parentOwner->id || !$this->_tableExists()) {
            return;
        }

        // Anchors are keyed by canonical owner id. Draft/revision saves can carry a subset of
        // Vizy blocks — GC against those would delete live nested Matrix content.
        if (
            (method_exists($parentOwner, 'getIsDraft') && $parentOwner->getIsDraft()) ||
            (method_exists($parentOwner, 'getIsRevision') && $parentOwner->getIsRevision())
        ) {
            return;
        }

        // Propagated site saves see one site's Vizy value; block IDs differ for translated
        // content. Only GC from the initiating save, using a union across all owner sites.
        if (!empty($parentOwner->propagating)) {
            return;
        }

        $blockInstanceIds = $this->_collectBlockInstanceIdsAcrossSites($parentOwner, $vizyField);

        $records = MatrixAnchorRecord::find()
            ->where([
                'parentOwnerId' => (int)$parentOwner->id,
                'vizyFieldId' => $vizyField->id,
            ])
            ->all();

        foreach ($records as $record) {
            if (!in_array($record->blockInstanceId, $blockInstanceIds, true)) {
                $anchor = $this->_getAnchorElement($record->id, $parentOwner->siteId);

                if ($anchor) {
                    $this->deleteAnchor($anchor);
                }
            }
        }
    }

    public function deleteAnchorsForOwner(ElementInterface $owner): void
    {
        if (!$owner->id || !$this->_tableExists()) {
            return;
        }

        $records = MatrixAnchorRecord::find()
            ->where(['parentOwnerId' => $owner->id])
            ->all();

        foreach ($records as $record) {
            $anchor = $this->_getAnchorElement($record->id, $owner->siteId);

            if ($anchor) {
                $this->deleteAnchor($anchor);
            }
        }
    }

    public function blockHasMatrixFields(?FieldLayout $fieldLayout): bool
    {
        if (!$fieldLayout) {
            return false;
        }

        foreach ($fieldLayout->getCustomFields() as $field) {
            if ($field instanceof Matrix) {
                return true;
            }
        }

        return false;
    }

    public function elementNeedsMatrixAnchorBackfill(ElementInterface $element, VizyField $vizyField): bool
    {
        return $this->describeMatrixAnchorBackfill($element, $vizyField) !== [];
    }

    /**
     * @return string[]
     */
    public function getVizyHandlesNeedingMatrixAnchorBackfill(ElementInterface $element): array
    {
        return array_column($this->describeMatrixAnchorBackfill($element), 'handle');
    }

    /**
     * @return array<int, array{
     *     handle: string,
     *     fieldId: int|null,
     *     fieldName: string,
     *     blocks: array<int, array{
     *         id: string,
     *         blockType: string,
     *         reason: string,
     *         matrixFields: string[],
     *         matrixAnchorUid: string|null,
     *         path?: string,
     *         vizyFieldHandle?: string
     *     }>
     * }>
     */
    public function describeMatrixAnchorBackfill(ElementInterface $element, ?VizyField $vizyField = null): array
    {
        $layout = $element->getFieldLayout();

        if (!$layout) {
            return [];
        }

        $reports = [];

        foreach ($layout->getCustomFields() as $field) {
            if (!$field instanceof VizyField) {
                continue;
            }

            if ($vizyField && (int)$field->id !== (int)$vizyField->id) {
                continue;
            }

            $value = $this->_getElementVizyValue($element, $field);

            if (!$value instanceof VizyNodeCollection) {
                continue;
            }

            // Walk nested Vizy-in-Vizy too — Matrix only on an inner field still requires
            // dirtying/saving the top-level Vizy handle so serializeValue can recurse.
            $blocks = $this->_describeBlocksNeedingBackfill($value, $element, $field);

            if ($blocks) {
                $reports[] = [
                    'handle' => $field->handle,
                    'fieldId' => $field->id,
                    'fieldName' => $field->name,
                    'blocks' => $blocks,
                ];
            }
        }

        return $reports;
    }

    public function blockNeedsMatrixAnchorBackfill(
        VizyBlock $block,
        ElementInterface $parentOwner,
        VizyField $vizyField,
    ): bool {
        if (!$block->hasMatrixFields() || !$parentOwner->id || !($blockInstanceId = $block->getId())) {
            return false;
        }

        if ($this->_blockHasMatrixJsonContent($block)) {
            return true;
        }

        $anchor = $this->getAnchor(
            $parentOwner,
            $vizyField,
            $blockInstanceId,
            $block->getMatrixAnchorUid(),
        );

        if (!$anchor || ($block->getMatrixAnchorUid() && $block->getMatrixAnchorUid() !== $anchor->uid)) {
            // A CP visit may already have allocated an empty owned anchor while the
            // persisted JSON still references the historical shared source.
            return true;
        }

        return $this->_matrixFieldsWithDuplicateEntryUids($block, $anchor) !== [];
    }

    /**
     * Nested Vizy fields normalize against a synthetic Block element (`id = rand()`),
     * which is never stored in `elements`. Matrix anchors must parent to a real owner
     * (entry, Matrix block, etc.) or the FK on `vizy_matrix_anchors.parentOwnerId` fails.
     */
    public function resolvePersistableParentOwner(ElementInterface $parentOwner): ElementInterface
    {
        while ($parentOwner instanceof BlockElement) {
            $owner = $parentOwner->getOwner();

            if (!$owner instanceof ElementInterface) {
                break;
            }

            $parentOwner = $owner;
        }

        return $parentOwner;
    }


    // Private Methods
    // =========================================================================

    private function _tableExists(): bool
    {
        return Craft::$app->getDb()->tableExists(Table::MATRIX_ANCHORS);
    }

    /**
     * @return array<int, array{
     *     id: string,
     *     blockType: string,
     *     reason: string,
     *     matrixFields: string[],
     *     matrixAnchorUid: string|null,
     *     path?: string,
     *     vizyFieldHandle?: string
     * }>
     */
    private function _describeBlocksNeedingBackfill(
        VizyNodeCollection $value,
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $path = '',
    ): array {
        $blocks = [];

        foreach ($value->query()->where(['type' => VizyBlock::$type])->all() as $block) {
            if (!$block instanceof VizyBlock) {
                continue;
            }

            $blockType = $block->getHandle() ?: (string)($block->getBlockType()?->handle ?? '');
            $blockPath = $path !== '' ? "$path > $blockType" : $blockType;

            if ($this->blockNeedsMatrixAnchorBackfill($block, $parentOwner, $vizyField)) {
                $matrixFields = [];
                $blockLayout = $block->getFieldLayout();

                if ($blockLayout) {
                    foreach ($blockLayout->getCustomFields() as $innerField) {
                        if ($innerField instanceof Matrix) {
                            $matrixFields[] = $innerField->handle;
                        }
                    }
                }

                $duplicateSortOrderFields = $this->_matrixFieldsWithDuplicateSortOrder($block);
                $anchor = $this->getAnchor(
                    $parentOwner,
                    $vizyField,
                    (string)$block->getId(),
                    $block->getMatrixAnchorUid(),
                );
                $duplicateEntryUidFields = $anchor
                    ? $this->_matrixFieldsWithDuplicateEntryUids($block, $anchor)
                    : [];

                $unresolvedReference = $block->getMatrixAnchorUid() &&
                    (!$anchor || $block->getMatrixAnchorUid() !== $anchor->uid);

                $blocks[] = [
                    'id' => (string)$block->getId(),
                    'blockType' => $blockType,
                    'reason' => $unresolvedReference ? 'unresolved-anchor-reference' : ($duplicateEntryUidFields
                        ? 'duplicate-entry-uid'
                        : ($duplicateSortOrderFields
                            ? 'duplicate-sort-order'
                            : ($this->_blockHasMatrixJsonContent($block) ? 'json-matrix' : 'missing-anchor'))),
                    'matrixFields' => $matrixFields,
                    'matrixAnchorUid' => $block->getMatrixAnchorUid(),
                    'path' => $blockPath,
                    'vizyFieldHandle' => $vizyField->handle,
                ];
            }

            $nestedBlocks = $this->_describeNestedVizyBackfill($block, $parentOwner, $blockPath);

            if ($nestedBlocks) {
                array_push($blocks, ...$nestedBlocks);
            }
        }

        return $blocks;
    }

    /**
     * @return array<int, array{
     *     id: string,
     *     blockType: string,
     *     reason: string,
     *     matrixFields: string[],
     *     matrixAnchorUid: string|null,
     *     path?: string,
     *     vizyFieldHandle?: string
     * }>
     */
    private function _describeNestedVizyBackfill(
        VizyBlock $block,
        ElementInterface $parentOwner,
        string $path,
    ): array {
        $blockLayout = $block->getFieldLayout();

        if (!$blockLayout) {
            return [];
        }

        $fieldsContent = $block->attrs['values']['content']['fields'] ?? [];
        $blocks = [];

        foreach ($blockLayout->getCustomFields() as $innerField) {
            if (!$innerField instanceof VizyField) {
                continue;
            }

            $nestedRaw = $fieldsContent[$innerField->handle] ?? null;
            $uid = $innerField->layoutElement?->uid;

            if (($nestedRaw === null || $nestedRaw === '' || $nestedRaw === []) && $uid) {
                $nestedRaw = $fieldsContent[$uid] ?? null;
            }

            if ($nestedRaw === null || $nestedRaw === '' || $nestedRaw === []) {
                continue;
            }

            if (is_string($nestedRaw)) {
                $nestedRaw = Json::decodeIfJson($nestedRaw);
            }

            if (!is_array($nestedRaw)) {
                continue;
            }

            $nestedValue = $innerField->normalizeValue($nestedRaw, $parentOwner);

            if (!$nestedValue instanceof VizyNodeCollection) {
                continue;
            }

            $nestedPath = "$path.`{$innerField->handle}`";
            $nestedBlocks = $this->_describeBlocksNeedingBackfill(
                $nestedValue,
                $parentOwner,
                $innerField,
                $nestedPath,
            );

            if ($nestedBlocks) {
                array_push($blocks, ...$nestedBlocks);
            }
        }

        return $blocks;
    }

    private function _blockHasMatrixJsonContent(VizyBlock $block): bool
    {
        $fields = $block->attrs['values']['content']['fields'] ?? [];
        $fieldLayout = $block->getFieldLayout();

        if (!$fieldLayout) {
            return false;
        }

        foreach ($fieldLayout->getCustomFields() as $field) {
            if (!$field instanceof Matrix) {
                continue;
            }

            $handle = $field->handle;
            $uid = $field->layoutElement?->uid;

            if (array_key_exists($handle, $fields) && $this->_matrixContentFilled($fields[$handle])) {
                return true;
            }

            if ($uid && array_key_exists($uid, $fields) && $this->_matrixContentFilled($fields[$uid])) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return string[]
     */
    private function _matrixFieldsWithDuplicateSortOrder(VizyBlock $block): array
    {
        $duplicates = array_fill_keys($block->getDuplicateMatrixSortOrderFields(), true);
        $fields = $block->attrs['values']['content']['fields'] ?? [];
        $fieldLayout = $block->getFieldLayout();

        if (!$fieldLayout) {
            return array_keys($duplicates);
        }

        foreach ($fieldLayout->getCustomFields() as $field) {
            if (!$field instanceof Matrix) {
                continue;
            }

            $uid = $field->layoutElement?->uid;
            $content = $fields[$field->handle] ?? ($uid ? ($fields[$uid] ?? null) : null);

            if (MatrixHelper::duplicateSortOrderIds($content)) {
                $duplicates[$field->handle] = true;
            }
        }

        return array_keys($duplicates);
    }

    /**
     * @return string[]
     */
    private function _matrixFieldsWithDuplicateEntryUids(VizyBlock $block, MatrixAnchor $anchor): array
    {
        $fieldLayout = $block->getFieldLayout();

        if (!$fieldLayout) {
            return [];
        }

        $duplicates = [];

        foreach ($fieldLayout->getCustomFields() as $field) {
            if (
                $field instanceof Matrix &&
                MatrixHelper::duplicateNestedEntryUids($field, $anchor)
            ) {
                $duplicates[] = $field->handle;
            }
        }

        return $duplicates;
    }

    private function _matrixContentFilled(mixed $content): bool
    {
        return $content !== null && $content !== '' && $content !== [];
    }

    private function _parentOwnerExistsInElements(ElementInterface $parentOwner): bool
    {
        $id = (int)$parentOwner->id;

        if (!$id) {
            return false;
        }

        return (new Query())
            ->from(['{{%elements}}'])
            ->where(['id' => $id])
            ->exists();
    }

    private function _applyFieldLayout(MatrixAnchor $anchor, ?FieldLayout $fieldLayout, ?ElementInterface $parentOwner = null): MatrixAnchor
    {
        if ($fieldLayout) {
            $anchor->setFieldLayout($fieldLayout);
        }

        if ($parentOwner) {
            $anchor->setParentOwner($parentOwner);
        }

        return $anchor;
    }

    private function _mutexLockName(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
    ): string {
        return sprintf(
            'vizy-matrix-anchor:%d:%d:%s',
            (int)$parentOwner->id,
            $vizyField->id,
            $blockInstanceId,
        );
    }

    /**
     * Old duplicates retain a foreign UID long after Craft clears duplicateOf. Copy
     * that reference on save/backfill too, without making it a writable owner alias.
     */
    private function _sourceAnchorForCopy(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?string $anchorUid,
    ): ?MatrixAnchor {
        if (!$anchorUid) {
            return null;
        }

        $anchor = Craft::$app->getElements()->getElementByUid(
            $anchorUid,
            MatrixAnchor::class,
            $parentOwner->siteId,
        );

        if (!$anchor instanceof MatrixAnchor) {
            $anchor = MatrixAnchor::find()->uid($anchorUid)->site('*')->status(null)->one();

            // An owned anchor may simply need localization for a newly enabled site.
            // Foreign content, however, must be copied from the requested site only.
            if ($anchor instanceof MatrixAnchor && (int)$anchor->parentOwnerId !== (int)$parentOwner->id) {
                $anchor = null;
            }
        }

        if (!$anchor instanceof MatrixAnchor) {
            // Do not replace a broken reference with an empty anchor. Its content may
            // still exist on another site or in a backup and needs explicit recovery.
            throw new \RuntimeException('Unable to resolve the referenced Vizy matrix anchor for this site.');
        }

        if (
            (int)$anchor->vizyFieldId !== (int)$vizyField->id ||
            $anchor->blockInstanceId !== $blockInstanceId
        ) {
            throw new \RuntimeException('The referenced Vizy matrix anchor does not match this field and block.');
        }

        if ((int)$anchor->parentOwnerId === (int)$parentOwner->id) {
            return null;
        }

        $sourceOwner = $parentOwner->duplicateOf;

        if (!$sourceOwner && $parentOwner->getIsDerivative()) {
            $sourceOwner = $parentOwner->getCanonical();
        }

        if ($sourceOwner instanceof ElementInterface && (int)$sourceOwner->id === (int)$anchor->parentOwnerId) {
            return $anchor;
        }

        // Recovery must follow an already stored reference, not an arbitrary UID in
        // incoming form data. A new duplicate can also inherit a historical reference.
        $referenceOwner = $sourceOwner instanceof ElementInterface ? $sourceOwner : $parentOwner;
        $storedContent = (new Query())
            ->select('content')
            ->from('{{%elements_sites}}')
            ->where(['elementId' => $referenceOwner->id, 'siteId' => $parentOwner->siteId])
            ->scalar();

        if (!$this->_containsAnchorReference($storedContent, $blockInstanceId, $anchorUid)) {
            throw new \RuntimeException('Refusing to copy a Vizy matrix anchor without a stored source reference.');
        }

        return $anchor;
    }

    private function _containsAnchorReference(mixed $content, string $blockInstanceId, string $anchorUid): bool
    {
        if (is_string($content)) {
            $content = Json::decodeIfJson($content);
        }

        if (!is_array($content)) {
            return false;
        }

        if (
            ($content['type'] ?? null) === VizyBlock::$type &&
            ($content['attrs']['id'] ?? null) === $blockInstanceId &&
            ($content['attrs']['values']['matrixAnchorUid'] ?? null) === $anchorUid
        ) {
            return true;
        }

        // Includes Vizy nested within another Vizy block's inline field content.
        foreach ($content as $value) {
            if ($this->_containsAnchorReference($value, $blockInstanceId, $anchorUid)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Copies missing Matrix fields from a source anchor onto an independently owned one,
     * using Craft's NestedElementManager duplicate path (via Matrix::afterElementPropagate).
     */
    private function _duplicateAnchorNestedContent(
        MatrixAnchor $source,
        MatrixAnchor $target,
        ?FieldLayout $fieldLayout,
        bool $replace = false,
    ): void {
        if (!$source->id || !$target->id) {
            return;
        }

        $fieldLayout ??= $source->getFieldLayout() ?? $target->getFieldLayout();

        if (!$fieldLayout || !$this->blockHasMatrixFields($fieldLayout)) {
            throw new \RuntimeException('Unable to resolve the Matrix field layout for Vizy anchor copying.');
        }

        // Nested Matrix entries may themselves contain Vizy/Matrix. Allow those copies,
        // but fail on a cyclic source reference rather than silently losing its content.
        if (isset($this->_copyingAnchorIds[$source->id])) {
            throw new \RuntimeException('Cyclic Vizy matrix anchor reference detected.');
        }

        $this->_copyingAnchorIds[$source->id] = true;
        $previousDuplicateOf = $target->duplicateOf;

        try {
            $source->setFieldLayout($fieldLayout);
            $target->setFieldLayout($fieldLayout);
            $target->duplicateOf = $source;

            foreach ($fieldLayout->getCustomFields() as $field) {
                if (!$field instanceof Matrix) {
                    continue;
                }

                try {
                    // A previous CP visit could have created an empty target. Repair
                    // missing fields individually; never overwrite existing target edits.
                    if (!$replace && $this->_anchorNestedCount($field, $target) > 0) {
                        continue;
                    }

                    $sourceValue = MatrixHelper::nestedEntryQuery($field, $source);
                    $expected = count($sourceValue->getCachedResult());
                    $field = $this->_matrixFieldForAnchor($field, $target);
                    $source->setFieldValue($field->handle, $sourceValue);
                    $field->afterElementPropagate($target, !$replace);
                    $this->_assertMatrixFieldPersisted($field, $target, $expected);
                } catch (\Throwable $e) {
                    Vizy::error(sprintf(
                        'Failed to duplicate Vizy matrix field `%s` from anchor #%s to #%s: %s',
                        $field->handle,
                        $source->id,
                        $target->id,
                        $e->getMessage(),
                    ));

                    throw $e;
                }
            }
        } finally {
            $target->duplicateOf = $previousDuplicateOf;
            unset($this->_copyingAnchorIds[$source->id]);
        }
    }

    private function _findAnchorRecord(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
    ): ?MatrixAnchorRecord {
        return MatrixAnchorRecord::findOne([
            'parentOwnerId' => (int)$parentOwner->id,
            'vizyFieldId' => $vizyField->id,
            'blockInstanceId' => $blockInstanceId,
        ]);
    }

    private function _getAnchorElement(int $id, ?int $siteId = null): ?MatrixAnchor
    {
        if ($siteId) {
            $anchor = Craft::$app->getElements()->getElementById($id, MatrixAnchor::class, $siteId);

            if ($anchor instanceof MatrixAnchor) {
                return $anchor;
            }
        }

        $anchor = MatrixAnchor::find()
            ->id($id)
            ->site('*')
            ->status(null)
            ->one();

        return $anchor instanceof MatrixAnchor ? $anchor : null;
    }

    private function _ensureAnchorSite(
        MatrixAnchorRecord $record,
        ElementInterface $parentOwner,
        ?FieldLayout $fieldLayout,
    ): ?MatrixAnchor {
        $elementsService = Craft::$app->getElements();
        $siteId = $parentOwner->siteId;

        $anchor = $elementsService->getElementById($record->id, MatrixAnchor::class, $siteId);

        if ($anchor instanceof MatrixAnchor) {
            return $this->_applyFieldLayout($anchor, $fieldLayout, $parentOwner);
        }

        $source = $this->_getAnchorElement((int)$record->id);

        if (!$source) {
            return null;
        }

        // Keep ownership in sync so getSupportedSites() follows this parent
        $source->parentOwnerId = (int)$parentOwner->id;
        $source->setParentOwner($parentOwner);

        try {
            $anchor = $elementsService->propagateElement($source, $siteId);
        } catch (\Throwable $e) {
            // Resave so Craft reconciles elements_sites against getSupportedSites() (owner sites).
            if (!$elementsService->saveElement($source)) {
                Vizy::error(
                    'Unable to propagate Vizy matrix anchor to site ' . $siteId . ': ' . $e->getMessage(),
                );

                return null;
            }

            $anchor = $elementsService->getElementById($record->id, MatrixAnchor::class, $siteId);
        }

        return $anchor instanceof MatrixAnchor
            ? $this->_applyFieldLayout($anchor, $fieldLayout, $parentOwner)
            : null;
    }

    private function _createAnchor(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?FieldLayout $fieldLayout,
        ?string $anchorUid,
    ): ?MatrixAnchor {
        $anchor = new MatrixAnchor([
            'vizyFieldId' => $vizyField->id,
            'blockInstanceId' => $blockInstanceId,
            'parentOwnerId' => (int)$parentOwner->id,
            'siteId' => $parentOwner->siteId,
        ]);

        $anchor->setParentOwner($parentOwner);

        if ($fieldLayout) {
            $anchor->setFieldLayout($fieldLayout);
        }

        try {
            if (Craft::$app->getElements()->saveElement($anchor)) {
                return $anchor;
            }
        } catch (IntegrityException $e) {
            $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

            if ($existing) {
                return $this->_applyFieldLayout($existing, $fieldLayout, $parentOwner);
            }

            $record = $this->_findAnchorRecord($parentOwner, $vizyField, $blockInstanceId);

            if ($record) {
                $existing = $this->_ensureAnchorSite($record, $parentOwner, $fieldLayout);

                if ($existing) {
                    return $existing;
                }
            }

            throw $e;
        }

        $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

        if ($existing) {
            return $this->_applyFieldLayout($existing, $fieldLayout, $parentOwner);
        }

        Vizy::error('Unable to save Vizy matrix anchor: ' . implode(', ', $anchor->getErrorSummary(true)));

        return null;
    }

    private function _getElementVizyValue(ElementInterface $element, VizyField $vizyField): mixed
    {
        try {
            return $element->getFieldValue($vizyField->handle);
        } catch (InvalidFieldException) {
            // Field exists globally but isn’t on this element’s layout (common during backfill).
            return null;
        }
    }

    /**
     * Returns a Matrix field instance suitable for NestedElementManager.
     *
     * Matrix is not multi-instance, so NestedElementManager::propagateRequired() reads
     * `$this->field->layoutElement` directly. FieldLayout clones can carry a cached
     * NestedElementManager that still points at the Fields-service singleton (no layoutElement),
     * which fatals mid-save and rolls back nested entries.
     */
    private function _matrixFieldForAnchor(Matrix $field, MatrixAnchor $anchor): Matrix
    {
        $fieldLayout = $anchor->getFieldLayout();

        if ($fieldLayout) {
            foreach ($fieldLayout->getCustomFields() as $layoutField) {
                if ($layoutField instanceof Matrix && (int)$layoutField->id === (int)$field->id) {
                    $field = $layoutField;
                    break;
                }
            }
        }

        if (!$field->layoutElement) {
            throw new \RuntimeException(sprintf(
                'Vizy matrix field `%s` is missing layoutElement; refusing to migrate JSON onto anchor #%s.',
                $field->handle,
                $anchor->id,
            ));
        }

        // NestedElementManager may still point at the Fields-service singleton (no layoutElement).
        // Rebind to this layout instance — do not unset `_entryManager` (Yii Component::__set).
        (function() {
            if (isset($this->_entryManager)) {
                $this->_entryManager->field = $this;
            }
        })->call($field);

        return $field;
    }

    private function _assertMatrixFieldPersisted(Matrix $field, MatrixAnchor $anchor, int $expected): void
    {
        if ($expected <= 0) {
            return;
        }

        $actual = $this->_anchorNestedCount($field, $anchor);

        if ($actual < $expected) {
            throw new \RuntimeException(sprintf(
                'Vizy matrix field `%s` failed to persist nested entries on anchor #%s (expected %d, found %d).',
                $field->handle,
                $anchor->id,
                $expected,
                $actual,
            ));
        }
    }

    private function _anchorNestedCount(Matrix $field, MatrixAnchor $anchor): int
    {
        if (!$anchor->id) {
            return 0;
        }

        return (int)Entry::find()
            ->fieldId($field->id)
            ->ownerId($anchor->id)
            ->siteId($anchor->siteId)
            ->drafts(null)
            ->status(null)
            ->limit(null)
            ->count();
    }

    private function _matrixValueCount(mixed $fieldValue): int
    {
        if ($fieldValue instanceof ElementCollection) {
            return $fieldValue->count();
        }

        if ($fieldValue instanceof EntryQuery) {
            $cached = $fieldValue->getCachedResult();

            if ($cached !== null) {
                return count($cached);
            }

            return (int)$fieldValue->count();
        }

        if (is_array($fieldValue) || $fieldValue instanceof \Countable) {
            return count($fieldValue);
        }

        return 0;
    }

    private function _collectBlockInstanceIdsAcrossSites(ElementInterface $parentOwner, VizyField $vizyField): array
    {
        $ids = [];

        foreach ($this->_collectBlockInstanceIds($parentOwner, $vizyField) as $id) {
            $ids[$id] = true;
        }

        $elementsService = Craft::$app->getElements();
        $elementId = (int)$parentOwner->id;

        foreach (ElementHelper::supportedSitesForElement($parentOwner) as $siteInfo) {
            $siteId = (int)$siteInfo['siteId'];

            if ($siteId === (int)$parentOwner->siteId) {
                continue;
            }

            $siteElement = $elementsService->getElementById($elementId, $parentOwner::class, $siteId);

            if (!$siteElement) {
                continue;
            }

            foreach ($this->_collectBlockInstanceIds($siteElement, $vizyField) as $id) {
                $ids[$id] = true;
            }
        }

        return array_keys($ids);
    }

    private function _collectBlockInstanceIds(ElementInterface $parentOwner, VizyField $vizyField): array
    {
        $value = $this->_getElementVizyValue($parentOwner, $vizyField);

        if (!$value instanceof VizyNodeCollection) {
            return [];
        }

        $ids = [];

        foreach ($value->query()->where(['type' => VizyBlock::$type])->all() as $block) {
            if ($block instanceof VizyBlock && ($id = $block->getId())) {
                $ids[] = $id;
            }
        }

        return $ids;
    }
}
