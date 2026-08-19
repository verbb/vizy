<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\db\Table;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\nodes\VizyBlock;
use verbb\vizy\records\MatrixAnchor as MatrixAnchorRecord;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\elements\db\EntryQuery;
use craft\elements\ElementCollection;
use craft\elements\Entry;
use craft\errors\InvalidFieldException;
use craft\fields\Matrix;
use craft\models\FieldLayout;

use verbb\vizy\models\NodeCollection as VizyNodeCollection;

use yii\db\IntegrityException;

class Anchors extends Component
{
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

        $elementsService = Craft::$app->getElements();
        $siteId = $parentOwner->siteId;

        if ($anchorUid) {
            $anchor = $elementsService->getElementByUid($anchorUid, MatrixAnchor::class, $siteId);

            if ($anchor instanceof MatrixAnchor) {
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
        if (!$parentOwner->id || !$this->_tableExists()) {
            return null;
        }

        $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

        if ($anchor) {
            return $this->_applyFieldLayout($anchor, $fieldLayout);
        }

        // Record may exist without an elements_sites row for this site (narrower site coverage).
        // Heal that site instead of inserting a duplicate (parentOwnerId, vizyFieldId, blockInstanceId).
        $record = $this->_findAnchorRecord($parentOwner, $vizyField, $blockInstanceId);

        if ($record) {
            $anchor = $this->_ensureAnchorSite($record, $parentOwner, $fieldLayout);

            if ($anchor) {
                return $anchor;
            }
        }

        $lockName = $this->_mutexLockName($parentOwner, $vizyField, $blockInstanceId);
        $mutex = Craft::$app->getMutex();

        if (!$mutex->acquire($lockName, 5)) {
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

            if ($anchor) {
                return $this->_applyFieldLayout($anchor, $fieldLayout);
            }

            $record = $this->_findAnchorRecord($parentOwner, $vizyField, $blockInstanceId);

            return $record
                ? $this->_ensureAnchorSite($record, $parentOwner, $fieldLayout)
                : null;
        }

        try {
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

            if ($anchor) {
                return $this->_applyFieldLayout($anchor, $fieldLayout);
            }

            $record = $this->_findAnchorRecord($parentOwner, $vizyField, $blockInstanceId);

            if ($record) {
                $anchor = $this->_ensureAnchorSite($record, $parentOwner, $fieldLayout);

                if ($anchor) {
                    return $anchor;
                }
            }

            return $this->_createAnchor($parentOwner, $vizyField, $blockInstanceId, $fieldLayout, $anchorUid);
        } finally {
            $mutex->release($lockName);
        }
    }

    public function saveMatrixField(
        Matrix $field,
        MatrixAnchor $anchor,
        mixed $fieldValue,
        bool $isNew,
    ): void {
        if ($fieldLayout = $anchor->getFieldLayout()) {
            $anchor->setFieldLayout($fieldLayout);
        }

        $field = $this->_matrixFieldForAnchor($field, $anchor);

        $anchor->setFieldValue($field->handle, $fieldValue);
        $anchor->setDirtyFields([$field->handle]);
        $field->afterElementPropagate($anchor, $isNew);

        $this->_assertMatrixFieldPersisted($field, $anchor, $fieldValue);
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

        $blockInstanceIds = $this->_collectBlockInstanceIds($parentOwner, $vizyField);

        $records = MatrixAnchorRecord::find()
            ->where([
                'parentOwnerId' => (int)$parentOwner->getCanonicalId(),
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
     *         matrixAnchorUid: string|null
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

            $blocks = [];

            foreach ($value->query()->where(['type' => VizyBlock::$type])->all() as $block) {
                if (!$block instanceof VizyBlock || !$this->blockNeedsMatrixAnchorBackfill($block, $element, $field)) {
                    continue;
                }

                $matrixFields = [];
                $blockLayout = $block->getFieldLayout();

                if ($blockLayout) {
                    foreach ($blockLayout->getCustomFields() as $innerField) {
                        if ($innerField instanceof Matrix) {
                            $matrixFields[] = $innerField->handle;
                        }
                    }
                }

                $blocks[] = [
                    'id' => (string)$block->getId(),
                    'blockType' => $block->getHandle() ?: (string)($block->getBlockType()?->handle ?? ''),
                    'reason' => $this->_blockHasMatrixJsonContent($block) ? 'json-matrix' : 'missing-anchor',
                    'matrixFields' => $matrixFields,
                    'matrixAnchorUid' => $block->getMatrixAnchorUid(),
                ];
            }

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

        return $this->getAnchor(
            $parentOwner,
            $vizyField,
            $blockInstanceId,
            $block->getMatrixAnchorUid(),
        ) === null;
    }


    // Private Methods
    // =========================================================================

    private function _tableExists(): bool
    {
        return Craft::$app->getDb()->tableExists(Table::MATRIX_ANCHORS);
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

    private function _matrixContentFilled(mixed $content): bool
    {
        return $content !== null && $content !== '' && $content !== [];
    }

    private function _applyFieldLayout(MatrixAnchor $anchor, ?FieldLayout $fieldLayout): MatrixAnchor
    {
        if ($fieldLayout) {
            $anchor->setFieldLayout($fieldLayout);
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
            (int)$parentOwner->getCanonicalId(),
            $vizyField->id,
            $blockInstanceId,
        );
    }

    private function _findAnchorRecord(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
    ): ?MatrixAnchorRecord {
        return MatrixAnchorRecord::findOne([
            'parentOwnerId' => (int)$parentOwner->getCanonicalId(),
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
            return $this->_applyFieldLayout($anchor, $fieldLayout);
        }

        $source = $this->_getAnchorElement((int)$record->id);

        if (!$source) {
            return null;
        }

        // Keep ownership in sync so getSupportedSites() follows this parent
        $source->parentOwnerId = (int)$parentOwner->getCanonicalId();

        try {
            $anchor = $elementsService->propagateElement($source, $siteId);
        } catch (\Throwable $e) {
            // Resave so Craft reconciles elements_sites against getSupportedSites() (owner sites).
            if (!$elementsService->saveElement($source)) {
                Vizy::error(
                    'Unable to propagate Vizy matrix anchor to site ' . $siteId . ': ' . $e->getMessage(),
                    __METHOD__,
                );

                return null;
            }

            $anchor = $elementsService->getElementById($record->id, MatrixAnchor::class, $siteId);
        }

        return $anchor instanceof MatrixAnchor
            ? $this->_applyFieldLayout($anchor, $fieldLayout)
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
            'parentOwnerId' => (int)$parentOwner->getCanonicalId(),
            'siteId' => $parentOwner->siteId,
        ]);

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
                return $this->_applyFieldLayout($existing, $fieldLayout);
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
            return $this->_applyFieldLayout($existing, $fieldLayout);
        }

        Vizy::error('Unable to save Vizy matrix anchor: ' . implode(', ', $anchor->getErrorSummary(true)), __METHOD__);

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

        // Drop any NestedElementManager cloned from the Fields-service singleton.
        (function() {
            unset($this->_entryManager);
        })->call($field);

        return $field;
    }

    private function _assertMatrixFieldPersisted(Matrix $field, MatrixAnchor $anchor, mixed $fieldValue): void
    {
        $expected = $this->_matrixValueCount($fieldValue);

        if ($expected === 0) {
            return;
        }

        $actual = Entry::find()
            ->fieldId($field->id)
            ->ownerId($anchor->id)
            ->siteId($anchor->siteId)
            ->drafts(null)
            ->status(null)
            ->limit(null)
            ->count();

        if ((int)$actual < $expected) {
            throw new \RuntimeException(sprintf(
                'Vizy matrix field `%s` failed to persist nested entries on anchor #%s (expected %d, found %d).',
                $field->handle,
                $anchor->id,
                $expected,
                (int)$actual,
            ));
        }
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
