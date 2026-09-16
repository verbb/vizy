<?php
namespace verbb\vizy\records;

use verbb\vizy\db\Table;

use craft\db\ActiveRecord;

final class AssetUploadBatch extends ActiveRecord
{
    // Static Methods
    // =========================================================================

    public static function tableName(): string
    {
        return Table::ASSET_UPLOAD_BATCHES;
    }
}
