<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;

use craft\db\Migration;
use craft\db\Query;
use craft\helpers\Json;

use Throwable;

final class m260924_000000_content_recovery_capacity extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        if ($this->db->tableExists(Table::CONTENT_RECOVERY)) {
            $this->alterColumn(Table::CONTENT_RECOVERY, 'snapshotJson', $this->longText()->notNull());
            $schema = $this->db->getTableSchema(Table::CONTENT_RECOVERY, true);

            if (!$schema?->getColumn('placementUid')) {
                $this->addColumn(Table::CONTENT_RECOVERY, 'placementUid', $this->uid()->null()->defaultValue(null)->after('fieldUid'));
                $this->db->getSchema()->refreshTableSchema(Table::CONTENT_RECOVERY);
            }
            // Beta 1 allowed an unbounded number of MEDIUMTEXT snapshots. Read
            // only one payload at a time so upgrading that backlog cannot hold
            // hundreds of megabytes in PHP memory.
            $afterId = 0;

            while ($row = (new Query())->select(['id', 'snapshotJson'])->from(Table::CONTENT_RECOVERY)
                ->where(['placementUid' => null])
                ->andWhere(['>', 'id', $afterId])
                ->orderBy(['id' => SORT_ASC])
                ->limit(1)
                ->one($this->db)) {
                $afterId = (int)$row['id'];

                try {
                    $snapshot = Json::decode($row['snapshotJson']);
                } catch (Throwable) {
                    continue;
                }
                $placementUid = $snapshot['placementUid'] ?? null;

                if (is_string($placementUid) && $placementUid !== '') {
                    $this->update(Table::CONTENT_RECOVERY, ['placementUid' => $placementUid], ['id' => $row['id']]);
                }
            }
        }
        return true;
    }

    public function safeDown(): bool
    {
        // Existing recovery payloads may exceed MEDIUMTEXT after this upgrade.
        return false;
    }
}
