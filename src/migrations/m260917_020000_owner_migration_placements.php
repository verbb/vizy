<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

final class m260917_020000_owner_migration_placements extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if (!$this->db->columnExists(Table::OWNER_MIGRATIONS, 'ownerPlacementUid')) {
            $this->addColumn(Table::OWNER_MIGRATIONS, 'ownerPlacementUid', $this->uid()->null()->defaultValue(null));
        }
        $columns = ['runUid', 'fieldUid', 'ownerType', 'ownerId', 'siteId', 'derivativeKey'];
        $this->dropIndexIfExists(Table::OWNER_MIGRATIONS, $columns, true);
        $this->createIndexIfMissing(Table::OWNER_MIGRATIONS, [...$columns, 'ownerPlacementUid'], true);
        return true;
    }

    public function safeDown(): bool
    {
        // Distinct placement checkpoints cannot safely be collapsed again.
        return false;
    }
}
