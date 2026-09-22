<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

final class m260920_000000_content_recovery extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if (!$this->db->tableExists(Table::CONTENT_RECOVERY)) {
            // No owner FK: recovery must survive trash and permanent deletion.
            $this->createTable(Table::CONTENT_RECOVERY, [
                'id' => $this->primaryKey(),
                'ownerId' => $this->integer()->notNull(),
                'fieldUid' => $this->uid()->notNull(),
                'snapshotHash' => $this->char(64)->notNull(),
                'snapshotJson' => $this->mediumText()->notNull(),
                'reason' => $this->string()->notNull(),
                'dateCreated' => $this->dateTime()->notNull(),
            ]);
            $this->createIndex(null, Table::CONTENT_RECOVERY, ['ownerId', 'fieldUid', 'snapshotHash'], true);
        }
        return true;
    }

    public function safeDown(): bool
    {
        // Downgrading must not discard the only retained copy of content.
        return false;
    }
}
