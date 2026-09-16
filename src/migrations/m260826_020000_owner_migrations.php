<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

final class m260826_020000_owner_migrations extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if ($this->db->tableExists(Table::OWNER_MIGRATIONS)) {
            return true;
        }

        $this->createTable(Table::OWNER_MIGRATIONS, [
            'id' => $this->primaryKey(),
            'runUid' => $this->uid()->notNull(),
            'mappingRevision' => $this->string()->notNull(),
            'mappingHash' => $this->char(64)->notNull(),
            'fieldUid' => $this->uid()->notNull(),
            'ownerType' => $this->string()->notNull(),
            'ownerId' => $this->integer()->notNull(),
            'siteId' => $this->integer()->notNull(),
            'derivativeKey' => $this->string()->notNull(),
            'sourceSnapshotHash' => $this->char(64)->notNull(),
            'sourceSnapshotJson' => $this->mediumText()->notNull(),
            'candidateHash' => $this->char(64),
            'candidateJson' => $this->mediumText(),
            'uidMapJson' => $this->mediumText()->notNull(),
            'verificationJson' => $this->mediumText(),
            'state' => $this->string(16)->notNull()->defaultValue('analyzed'),
            'attempts' => $this->integer()->notNull()->defaultValue(0),
            'errorsJson' => $this->mediumText()->notNull(),
            'analyzedAt' => $this->dateTime(),
            'readyAt' => $this->dateTime(),
            'persistedAt' => $this->dateTime(),
            'verifiedAt' => $this->dateTime(),
            'failedAt' => $this->dateTime(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);
        $this->createIndex(null, Table::OWNER_MIGRATIONS, [
            'runUid', 'fieldUid', 'ownerType', 'ownerId', 'siteId', 'derivativeKey',
        ], true);
        $this->createIndex(null, Table::OWNER_MIGRATIONS, ['state'], false);
        $this->createIndex(null, Table::OWNER_MIGRATIONS, ['fieldUid', 'mappingHash'], false);

        return true;
    }

    public function safeDown(): bool
    {
        $this->dropTableIfExists(Table::OWNER_MIGRATIONS);
        return true;
    }
}
