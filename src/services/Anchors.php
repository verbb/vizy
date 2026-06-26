<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\nodes\VizyBlock;
use verbb\vizy\records\MatrixAnchor as MatrixAnchorRecord;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
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

        $parentOwnerId = (int)$parentOwner->getCanonicalId();

        $record = MatrixAnchorRecord::findOne([
            'parentOwnerId' => $parentOwnerId,
            'vizyFieldId' => $vizyField->id,
            'blockInstanceId' => $blockInstanceId,
        ]);

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
        if (!$parentOwner->id) {
            return null;
        }

        $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

        if ($anchor) {
            return $this->_applyFieldLayout($anchor, $fieldLayout);
        }

        $lockName = $this->_mutexLockName($parentOwner, $vizyField, $blockInstanceId);
        $mutex = Craft::$app->getMutex();

        if (!$mutex->acquire($lockName, 5)) {
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

            return $anchor ? $this->_applyFieldLayout($anchor, $fieldLayout) : null;
        }

        try {
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

            if ($anchor) {
                return $this->_applyFieldLayout($anchor, $fieldLayout);
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

        $anchor->setFieldValue($field->handle, $fieldValue);
        $anchor->setDirtyFields([$field->handle]);
        $field->afterElementPropagate($anchor, $isNew);
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
        if (!$parentOwner->id) {
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

        if (!$value instanceof VizyNodeCollection) {
            return false;
        }

        foreach ($value->query()->where(['type' => VizyBlock::$type])->all() as $block) {
            if ($block instanceof VizyBlock && $this->blockNeedsMatrixAnchorBackfill($block, $element, $vizyField)) {
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

            throw $e;
        }

        $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, $anchorUid);

        if ($existing) {
            return $this->_applyFieldLayout($existing, $fieldLayout);
        }

        Vizy::error('Unable to save Vizy matrix anchor: ' . implode(', ', $anchor->getErrorSummary(true)), __METHOD__);

        return null;
    }

    private function _collectBlockInstanceIds(ElementInterface $parentOwner, VizyField $vizyField): array
    {
        $value = $parentOwner->getFieldValue($vizyField->handle);

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
