<?php
namespace verbb\vizy\records;

use verbb\vizy\db\Table;

use craft\db\ActiveRecord;

/**
 * Durable stage pointer for a non-atomic Project Config promotion.
 */
final class SchemaPromotion extends ActiveRecord
{
    // Static Methods
    // =========================================================================

    public static function tableName(): string
    {
        return Table::SCHEMA_PROMOTIONS;
    }
}
