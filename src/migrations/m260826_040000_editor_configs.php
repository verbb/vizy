<?php
namespace verbb\vizy\migrations;

use verbb\vizy\services\EditorConfigs;

use craft\db\Migration;

final class m260826_040000_editor_configs extends Migration
{
    // Public Methods
    // =========================================================================

    public function safeUp(): bool
    {
        // Named configs need no table; the plugin-owned default is seeded once
        // into the same Project Config path projects use for all named configs.
        (new EditorConfigs())->ensureStandardConfig();
        return true;
    }

    public function safeDown(): bool
    {
        return true;
    }
}
