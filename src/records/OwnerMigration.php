<?php
namespace verbb\vizy\records;

use verbb\vizy\db\Table;

use craft\db\ActiveRecord;

/**
 * Durable per-owner checkpoint for destructive-safe Vizy 3 promotion.
 */
final class OwnerMigration extends ActiveRecord
{
    // Static Methods
    // =========================================================================

    public static function tableName(): string
    {
        return Table::OWNER_MIGRATIONS;
    }
}
