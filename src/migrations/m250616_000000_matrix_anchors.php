<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

class m250616_000000_matrix_anchors extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if (!$this->db->tableExists(Table::MATRIX_ANCHORS)) {
            $this->createTable(Table::MATRIX_ANCHORS, [
                'id' => $this->integer()->notNull(),
                'vizyFieldId' => $this->integer()->notNull(),
                'blockInstanceId' => $this->string(36)->notNull(),
                'parentOwnerId' => $this->integer()->notNull(),
                'PRIMARY KEY([[id]])',
            ]);

            $this->addForeignKey(
                null,
                Table::MATRIX_ANCHORS,
                'id',
                '{{%elements}}',
                'id',
                'CASCADE',
                null,
            );

            $this->addForeignKey(
                null,
                Table::MATRIX_ANCHORS,
                'parentOwnerId',
                '{{%elements}}',
                'id',
                'CASCADE',
                null,
            );

            $this->createIndex(
                null,
                Table::MATRIX_ANCHORS,
                ['parentOwnerId', 'vizyFieldId', 'blockInstanceId'],
                true,
            );
        }

        return true;
    }

    public function safeDown(): bool
    {
        echo "m250616_000000_matrix_anchors cannot be reverted.\n";

        return false;
    }
}
