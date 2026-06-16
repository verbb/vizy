<?php
namespace verbb\vizy\records;

use craft\db\ActiveRecord;
use craft\records\Element;
use verbb\vizy\db\Table;

use yii\db\ActiveQueryInterface;

class MatrixAnchor extends ActiveRecord
{
    // Static Methods
    // =========================================================================

    public static function tableName(): string
    {
        return Table::MATRIX_ANCHORS;
    }


    // Public Methods
    // =========================================================================

    public function getElement(): ActiveQueryInterface
    {
        return $this->hasOne(Element::class, ['id' => 'id']);
    }
}
