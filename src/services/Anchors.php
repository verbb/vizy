<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\document\VizyBlock;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Matrix as MatrixHelper;
use verbb\vizy\records\MatrixAnchor as MatrixAnchorRecord;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\fields\Matrix;
use craft\models\FieldLayout;

use yii\db\IntegrityException;

class Anchors extends Component
{
    // Public Methods
    // =========================================================================

    /**
     * Resolve a MatrixAnchor for the authorized ownership tuple only.
     *
     * Client-supplied `$anchorUid` is never an authorization input. When
     * provided, it must match the ownership-resolved row or this returns null
     * (fail closed). There is no UID-only lookup path.
     */
    public function getAnchor(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?string $anchorUid = null,
    ): ?MatrixAnchor {
        while ($parentOwner instanceof Block) {
            $parentOwner = $parentOwner->getOwner();
        }
        if (!$parentOwner->id) {
            return null;
        }

        $parentOwnerId = (int)$parentOwner->id;
        $siteId = $parentOwner->siteId;

        $record = MatrixAnchorRecord::findOne([
            'parentOwnerId' => $parentOwnerId,
            'vizyFieldId' => $vizyField->id,
            'blockInstanceId' => $blockInstanceId,
        ]);

        if (!$record) {
            return null;
        }

        $anchor = Craft::$app->getElements()->getElementById($record->id, MatrixAnchor::class, $siteId);
        if (!$anchor instanceof MatrixAnchor) {
            return null;
        }

        // Optional UID must agree with the ownership row — never retarget by UID.
        if (is_string($anchorUid) && $anchorUid !== '' && $anchor->uid !== $anchorUid) {
            return null;
        }

        return $anchor;
    }

    public function ensureAnchor(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?FieldLayout $fieldLayout = null,
        ?string $anchorUid = null,
    ): ?MatrixAnchor {
        while ($parentOwner instanceof Block) {
            $parentOwner = $parentOwner->getOwner();
        }
        if (!$parentOwner->id) {
            return null;
        }

        // Find by ownership only — stale/forged client UIDs must not block sync
        // or create a second row for the same tuple.
        $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

        if ($anchor) {
            return $this->_applyFieldLayout($anchor, $fieldLayout);
        }

        $lockName = $this->_mutexLockName($parentOwner, $vizyField, $blockInstanceId);
        $mutex = Craft::$app->getMutex();

        if (!$mutex->acquire($lockName, 5)) {
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

            return $anchor ? $this->_applyFieldLayout($anchor, $fieldLayout) : null;
        }

        try {
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

            if ($anchor) {
                return $this->_applyFieldLayout($anchor, $fieldLayout);
            }

            $transaction = Craft::$app->getDb()->beginTransaction();
            try {
                $anchor = $this->_createAnchor($parentOwner, $vizyField, $blockInstanceId, $fieldLayout, $anchorUid);
                // Drafts and revisions own independent Matrix snapshots. Resolve
                // the source through Craft's owner relationship, never by a UID alone.
                $sourceOwner = $parentOwner->duplicateOf;
                if (!$sourceOwner && $parentOwner->getIsDerivative()) {
                    $sourceOwner = $parentOwner->getCanonical();
                }
                if ($anchor && $sourceOwner && $sourceOwner->id !== $parentOwner->id && $fieldLayout) {
                    $source = $this->getAnchor($sourceOwner, $vizyField, $blockInstanceId);
                    if ($source) {
                        $source->setFieldLayout($fieldLayout);
                        foreach ($fieldLayout->getCustomFields() as $field) {
                            if ($field instanceof Matrix) {
                                $this->copyMatrixField($field, $source, $anchor);
                            }
                        }
                    }
                }
                $transaction->commit();
                return $anchor;
            } catch (\Throwable $e) {
                $transaction->rollBack();
                throw $e;
            }
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

        $anchor->setFieldValue($field->handle, $fieldValue);
        $anchor->setDirtyFields([$field->handle]);
        $field->afterElementPropagate($anchor, $isNew);
    }

    public function copyMatrixField(Matrix $field, MatrixAnchor $source, MatrixAnchor $target): void
    {
        $payload = MatrixHelper::payloadForIndependentCopy(
            $field->serializeValue(MatrixHelper::nestedEntryQuery($field, $source), $source),
        );
        $value = $field->normalizeValue($payload, $target);
        $this->saveMatrixField($field, $target, $value, false);
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
        while ($parentOwner instanceof Block) {
            $parentOwner = $parentOwner->getOwner();
        }
        if (!$parentOwner->id) {
            return;
        }

        $blockInstanceIds = $this->_collectBlockInstanceIds($parentOwner, $vizyField);

        $records = MatrixAnchorRecord::find()
            ->where([
                'parentOwnerId' => (int)$parentOwner->id,
                'vizyFieldId' => $vizyField->id,
            ])
            ->all();

        foreach ($records as $record) {
            if (!in_array($record->blockInstanceId, $blockInstanceIds, true)) {
                $anchor = Craft::$app->getElements()->getElementById($record->id, MatrixAnchor::class, $parentOwner->siteId);

                if ($anchor instanceof MatrixAnchor) {
                    $this->deleteAnchor($anchor);
                }
            }
        }
    }

    public function deleteAnchorsForOwner(ElementInterface $owner): void
    {
        if (!$owner->id) {
            return;
        }

        $records = MatrixAnchorRecord::find()
            ->where(['parentOwnerId' => $owner->id])
            ->all();

        foreach ($records as $record) {
            $anchor = Craft::$app->getElements()->getElementById($record->id, MatrixAnchor::class, $owner->siteId);

            if ($anchor instanceof MatrixAnchor) {
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
        $value = $element->getFieldValue($vizyField->handle);

        if (!$value instanceof VizyDocument) {
            return false;
        }

        foreach ($value->blocks(null) as $block) {
            if ($this->blockNeedsMatrixAnchorBackfill($block, $element, $vizyField)) {
                return true;
            }
        }

        return false;
    }

    public function blockNeedsMatrixAnchorBackfill(
        VizyBlock $block,
        ElementInterface $parentOwner,
        VizyField $vizyField,
    ): bool {
        $layout = $block->blockType()?->getFieldLayout();
        if (!$this->blockHasMatrixFields($layout) || !$parentOwner->id) {
            return false;
        }

        if ($this->_blockHasMatrixJsonContent($block)) {
            return true;
        }

        return $this->getAnchor(
            $parentOwner,
            $vizyField,
            $block->uid(),
            $block->matrixAnchorUid(),
        ) === null;
    }


    // Private Methods
    // =========================================================================

    private function _blockHasMatrixJsonContent(VizyBlock $block): bool
    {
        // Vizy 4 stores placements in fieldSlots (UID keys); legacy JSON may still
        // use Matrix handles. Check both against the Block Type layout.
        $slots = $block->rawFieldValues();
        $fieldLayout = $block->blockType()?->getFieldLayout();

        if (!$fieldLayout) {
            return false;
        }

        foreach ($fieldLayout->getCustomFields() as $field) {
            if (!$field instanceof Matrix) {
                continue;
            }

            $handle = $field->handle;
            $uid = $field->layoutElement?->uid;

            if (array_key_exists($handle, $slots) && $this->_matrixContentFilled($slots[$handle])) {
                return true;
            }

            if ($uid && array_key_exists($uid, $slots) && $this->_matrixContentFilled($slots[$uid])) {
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
            (int)$parentOwner->id,
            $vizyField->id,
            $blockInstanceId,
        );
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

        if ($fieldLayout) {
            $anchor->setFieldLayout($fieldLayout);
        }

        try {
            if (Craft::$app->getElements()->saveElement($anchor)) {
                return $anchor;
            }
        } catch (IntegrityException $e) {
            $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

            if ($existing) {
                return $this->_applyFieldLayout($existing, $fieldLayout);
            }

            throw $e;
        }

        $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

        if ($existing) {
            return $this->_applyFieldLayout($existing, $fieldLayout);
        }

        Vizy::error('Unable to save Vizy matrix anchor: ' . implode(', ', $anchor->getErrorSummary(true)), __METHOD__);

        return null;
    }

    private function _collectBlockInstanceIds(ElementInterface $parentOwner, VizyField $vizyField): array
    {
        $value = $parentOwner->getFieldValue($vizyField->handle);

        if (!$value instanceof VizyDocument) {
            return [];
        }

        $ids = [];
        foreach ($value->blocks(null) as $block) {
            $ids[] = $block->uid();
        }

        return $ids;
    }
}
