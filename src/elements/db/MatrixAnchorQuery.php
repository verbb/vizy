<?php
namespace verbb\vizy\elements\db;

use verbb\vizy\db\Table;

use craft\elements\db\ElementQuery;
use craft\helpers\ArrayHelper;
use craft\helpers\Db;

class MatrixAnchorQuery extends ElementQuery
{
    // Properties
    // =========================================================================

    public mixed $vizyFieldId = null;
    public mixed $blockInstanceId = null;
    public mixed $parentOwnerId = null;


    // Public Methods
    // =========================================================================

    public function populate($rows): array
    {
        $elements = parent::populate($rows);
        $rowsById = ArrayHelper::index($rows, 'id');

        foreach ($elements as $key => $element) {
            $id = is_array($element) ? ($element['id'] ?? null) : $element->id;
            $row = $id !== null ? ($rowsById[$id] ?? null) : null;

            if (!$row) {
                continue;
            }

            $vizyFieldId = isset($row['vizyFieldId']) ? (int)$row['vizyFieldId'] : null;
            $blockInstanceId = $row['blockInstanceId'] ?? null;
            $parentOwnerId = isset($row['parentOwnerId']) ? (int)$row['parentOwnerId'] : null;

            if (is_array($element)) {
                $elements[$key]['vizyFieldId'] = $vizyFieldId;
                $elements[$key]['blockInstanceId'] = $blockInstanceId;
                $elements[$key]['parentOwnerId'] = $parentOwnerId;
            } else {
                $element->vizyFieldId = $vizyFieldId;
                $element->blockInstanceId = $blockInstanceId;
                $element->parentOwnerId = $parentOwnerId;
            }
        }

        return $elements;
    }


    // Protected Methods
    // =========================================================================

    protected function beforePrepare(): bool
    {
        if (!parent::beforePrepare()) {
            return false;
        }

        $this->joinElementTable(Table::MATRIX_ANCHORS);

        $this->query->addSelect([
            'vizy_matrix_anchors.vizyFieldId',
            'vizy_matrix_anchors.blockInstanceId',
            'vizy_matrix_anchors.parentOwnerId',
        ]);

        if (isset($this->vizyFieldId)) {
            $this->subQuery->andWhere(Db::parseParam('vizy_matrix_anchors.vizyFieldId', $this->vizyFieldId));
        }

        if (isset($this->blockInstanceId)) {
            $this->subQuery->andWhere(Db::parseParam('vizy_matrix_anchors.blockInstanceId', $this->blockInstanceId));
        }

        if (isset($this->parentOwnerId)) {
            $this->subQuery->andWhere(Db::parseParam('vizy_matrix_anchors.parentOwnerId', $this->parentOwnerId));
        }

        return true;
    }
}
