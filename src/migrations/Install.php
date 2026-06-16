<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

class Install extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        $this->_createMatrixAnchorsTable();

        return true;
    }

    public function safeDown(): bool
    {
        $this->dropTableIfExists(Table::MATRIX_ANCHORS);

        return true;
    }


    // Private Methods
    // =========================================================================

    private function _createMatrixAnchorsTable(): void
    {
        if ($this->db->tableExists(Table::MATRIX_ANCHORS)) {
            return;
        }

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
}
