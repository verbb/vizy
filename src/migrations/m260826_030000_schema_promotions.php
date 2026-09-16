<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

final class m260826_030000_schema_promotions extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if ($this->db->tableExists(Table::SCHEMA_PROMOTIONS)) {
            return true;
        }

        $this->createTable(Table::SCHEMA_PROMOTIONS, [
            'id' => $this->primaryKey(),
            'runUid' => $this->uid()->notNull(),
            'planHash' => $this->char(64)->notNull(),
            'planJson' => $this->mediumText()->notNull(),
            'ownerScopeJson' => $this->mediumText()->notNull(),
            'stage' => $this->string(32)->notNull()->defaultValue('planned'),
            'status' => $this->string(16)->notNull()->defaultValue('pending'),
            'lastError' => $this->text(),
            'dateCreated' => $this->dateTime()->notNull(),
            'dateUpdated' => $this->dateTime()->notNull(),
            'uid' => $this->uid(),
        ]);
        $this->createIndex(null, Table::SCHEMA_PROMOTIONS, ['runUid'], true);
        $this->createIndex(null, Table::SCHEMA_PROMOTIONS, ['planHash'], false);
        $this->createIndex(null, Table::SCHEMA_PROMOTIONS, ['status'], false);
        return true;
    }

    public function safeDown(): bool
    {
        $this->dropTableIfExists(Table::SCHEMA_PROMOTIONS);
        return true;
    }
}
