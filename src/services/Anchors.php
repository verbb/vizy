<?php
namespace verbb\vizy\services;

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
            if ($fieldLayout) {
                $anchor->setFieldLayout($fieldLayout);
            }

            return $anchor;
        }

        $anchor = new MatrixAnchor([
            'vizyFieldId' => $vizyField->id,
            'blockInstanceId' => $blockInstanceId,
            'parentOwnerId' => (int)$parentOwner->getCanonicalId(),
            'siteId' => $parentOwner->siteId,
        ]);

        if ($fieldLayout) {
            $anchor->setFieldLayout($fieldLayout);
        }

        if (!Craft::$app->getElements()->saveElement($anchor)) {
            Craft::error('Unable to save Vizy matrix anchor: ' . implode(', ', $anchor->getErrorSummary(true)), __METHOD__);

            return null;
        }

        return $anchor;
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


    // Private Methods
    // =========================================================================

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
