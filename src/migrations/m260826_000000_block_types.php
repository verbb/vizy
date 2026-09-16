<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

final class m260826_000000_block_types extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if ($this->db->tableExists(Table::BLOCK_TYPES)) {
            return true;
        }

        $this->createTable(Table::BLOCK_TYPES, [
            'id' => $this->primaryKey(),
            'fieldLayoutId' => $this->integer()->notNull(),
            'name' => $this->string()->notNull(),
            'handle' => $this->string()->notNull(),
            'icon' => $this->text(),
            'template' => $this->string(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);
        $this->createIndex(null, Table::BLOCK_TYPES, ['uid'], true);
        $this->createIndex(null, Table::BLOCK_TYPES, ['handle'], true);
        $this->addForeignKey(null, Table::BLOCK_TYPES, 'fieldLayoutId', '{{%fieldlayouts}}', 'id', 'CASCADE');

        return true;
    }

    public function safeDown(): bool
    {
        $this->dropTableIfExists(Table::BLOCK_TYPES);
        return true;
    }
}
