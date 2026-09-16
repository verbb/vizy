<?php
namespace verbb\vizy\migrations;

use verbb\vizy\db\Table;
use verbb\vizy\services\EditorConfigs;

use craft\db\Migration;

class Install extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        $this->_createSchemaPromotionsTable();
        $this->_createOwnerMigrationsTable();
        $this->_createAssetUploadBatchesTable();
        $this->_createBlockTypesTable();
        $this->_createMatrixAnchorsTable();
        (new EditorConfigs())->ensureStandardConfig();

        return true;
    }

    public function safeDown(): bool
    {
        $this->dropTableIfExists(Table::SCHEMA_PROMOTIONS);
        $this->dropTableIfExists(Table::OWNER_MIGRATIONS);
        $this->dropTableIfExists(Table::ASSET_UPLOAD_BATCHES);
        $this->dropTableIfExists(Table::MATRIX_ANCHORS);
        $this->dropTableIfExists(Table::BLOCK_TYPES);

        return true;
    }


    // Private Methods
    // =========================================================================

    private function _createSchemaPromotionsTable(): void
    {
        if ($this->db->tableExists(Table::SCHEMA_PROMOTIONS)) {
            return;
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
    }

    private function _createOwnerMigrationsTable(): void
    {
        if ($this->db->tableExists(Table::OWNER_MIGRATIONS)) {
            return;
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
    }

    private function _createAssetUploadBatchesTable(): void
    {
        if ($this->db->tableExists(Table::ASSET_UPLOAD_BATCHES)) {
            return;
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
    }

    private function _createBlockTypesTable(): void
    {
        if ($this->db->tableExists(Table::BLOCK_TYPES)) {
            return;
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
        $this->addForeignKey(
            null,
            Table::BLOCK_TYPES,
            'fieldLayoutId',
            '{{%fieldlayouts}}',
            'id',
            'CASCADE',
        );
    }

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
