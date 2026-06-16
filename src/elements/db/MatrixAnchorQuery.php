<?php
namespace verbb\vizy\elements\db;

use verbb\vizy\db\Table;
use verbb\vizy\elements\MatrixAnchor;

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
        /** @var MatrixAnchor[] $elements */
        $elements = parent::populate($rows);
        $rowsById = ArrayHelper::index($rows, 'id');

        foreach ($elements as $element) {
            $row = $rowsById[$element->id] ?? null;

            if (!$row) {
                continue;
            }

            $element->vizyFieldId = isset($row['vizyFieldId']) ? (int)$row['vizyFieldId'] : null;
            $element->blockInstanceId = $row['blockInstanceId'] ?? null;
            $element->parentOwnerId = isset($row['parentOwnerId']) ? (int)$row['parentOwnerId'] : null;
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
