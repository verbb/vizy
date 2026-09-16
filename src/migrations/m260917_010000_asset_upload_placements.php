<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

final class m260917_010000_asset_upload_placements extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if (!$this->db->columnExists(Table::ASSET_UPLOAD_BATCHES, 'ownerPlacementUid')) {
            $this->addColumn(Table::ASSET_UPLOAD_BATCHES, 'ownerPlacementUid', $this->uid()->null()->defaultValue(null));
        }
        $columns = ['snapshotHash', 'workFingerprint', 'ownerType', 'ownerId', 'siteId', 'derivativeKey', 'fieldUid'];
        $this->dropIndexIfExists(Table::ASSET_UPLOAD_BATCHES, $columns, true);
        $this->createIndexIfMissing(Table::ASSET_UPLOAD_BATCHES, [...$columns, 'ownerPlacementUid'], true);
        return true;
    }

    public function safeDown(): bool
    {
        // Distinct placement batches cannot safely be collapsed again.
        return false;
    }
}
