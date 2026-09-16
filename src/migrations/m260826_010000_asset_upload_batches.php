<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

final class m260826_010000_asset_upload_batches extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if ($this->db->tableExists(Table::ASSET_UPLOAD_BATCHES)) {
            return true;
        }

        $this->createTable(Table::ASSET_UPLOAD_BATCHES, [
            'id' => $this->primaryKey(),
            'snapshotHash' => $this->char(64)->notNull(),
            'workFingerprint' => $this->char(64)->notNull(),
            'ownerType' => $this->string()->notNull(),
            'ownerId' => $this->integer()->notNull(),
            'siteId' => $this->integer()->notNull(),
            'derivativeKey' => $this->string()->notNull(),
            'fieldUid' => $this->uid()->notNull(),
            'workJson' => $this->mediumText()->notNull(),
            'status' => $this->string(16)->notNull()->defaultValue('pending'),
            'attempts' => $this->integer()->notNull()->defaultValue(0),
            'lastError' => $this->text(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);
        $this->createIndex(null, Table::ASSET_UPLOAD_BATCHES, [
            'snapshotHash', 'workFingerprint', 'ownerType', 'ownerId', 'siteId', 'derivativeKey', 'fieldUid',
        ], true);
        $this->createIndex(null, Table::ASSET_UPLOAD_BATCHES, ['status'], false);
        return true;
    }

    public function safeDown(): bool
    {
        $this->dropTableIfExists(Table::ASSET_UPLOAD_BATCHES);
        return true;
    }
}
