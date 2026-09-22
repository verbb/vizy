<?php
namespace verbb\vizy\db;

abstract class Table
{
    // Constants
    // =========================================================================

    public const MATRIX_ANCHORS = '{{%vizy_matrix_anchors}}';
    public const BLOCK_TYPES = '{{%vizy_blocktypes}}';
    public const ASSET_UPLOAD_BATCHES = '{{%vizy_asset_upload_batches}}';
    public const OWNER_MIGRATIONS = '{{%vizy_owner_migrations}}';
    public const SCHEMA_PROMOTIONS = '{{%vizy_schema_promotions}}';
    public const CONTENT_RECOVERY = '{{%vizy_content_recovery}}';
}
