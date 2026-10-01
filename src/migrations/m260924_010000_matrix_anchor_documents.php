<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;

/**
 * Adds the owning Vizy placement path to Matrix anchor identity.
 */
class m260924_010000_matrix_anchor_documents extends Migration
{
    public function safeUp(): bool
    {
        if (!$this->db->tableExists(Table::MATRIX_ANCHORS)) {
            return true;
        }

        $schema = $this->db->getTableSchema(Table::MATRIX_ANCHORS, true);

        if (!isset($schema->columns['documentKey'])) {
            $this->addColumn(
                Table::MATRIX_ANCHORS,
                'documentKey',
                $this->string(64)->notNull()->defaultValue(''),
            );
            $schema = $this->db->getTableSchema(Table::MATRIX_ANCHORS, true);
        }

        $oldColumns = ['parentOwnerId', 'vizyFieldId', 'blockInstanceId'];
        $newColumns = ['parentOwnerId', 'vizyFieldId', 'documentKey', 'blockInstanceId'];
        $indexes = $this->db->getSchema()->findUniqueIndexes($schema);

        // MySQL can use the legacy composite index to enforce the
        // parentOwnerId foreign key. Create its replacement first so the
        // foreign key remains backed while the old unique key is removed.
        $hasNewIndex = false;

        foreach ($indexes as $columns) {
            if (array_values($columns) === $newColumns) {
                $hasNewIndex = true;
                break;
            }
        }

        if (!$hasNewIndex) {
            $this->createIndex(null, Table::MATRIX_ANCHORS, $newColumns, true);
            $schema = $this->db->getTableSchema(Table::MATRIX_ANCHORS, true);
            $indexes = $this->db->getSchema()->findUniqueIndexes($schema);
        }

        foreach ($indexes as $name => $columns) {
            if (array_values($columns) === $oldColumns) {
                $this->dropIndex($name, Table::MATRIX_ANCHORS);
            }
        }

        return true;
    }

    public function safeDown(): bool
    {
        echo "m260924_010000_matrix_anchor_documents cannot be reverted.\n";

        return false;
    }
}
