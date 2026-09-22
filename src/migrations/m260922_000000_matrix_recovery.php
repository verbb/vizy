<?php
namespace verbb\vizy\migrations;

use craft\db\Migration;

class m260922_000000_matrix_recovery extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if (!$this->db->tableExists('{{%vizy_matrix_recovery}}')) {
            // Recovery records deliberately outlive deleted owners and anchors.
            $this->createTable('{{%vizy_matrix_recovery}}', [
                'id' => $this->primaryKey(),
                'ownerUid' => $this->uid()->notNull(),
                'siteId' => $this->integer()->notNull(),
                'fieldUid' => $this->uid()->notNull(),
                'kind' => $this->string(16)->notNull(),
                'reason' => $this->string(64)->notNull(),
                'contentHash' => $this->string(64)->notNull(),
                'payload' => $this->longText()->notNull(),
                'dateCreated' => $this->dateTime()->notNull(),
            ]);
            $this->createIndex(null, '{{%vizy_matrix_recovery}}', ['ownerUid', 'siteId', 'fieldUid', 'kind', 'contentHash'], true);
        }

        return true;
    }

    public function safeDown(): bool
    {
        // Rolling back code must not discard the recovery archive.
        return false;
    }
}
