<?php

declare(strict_types=1);

namespace Tests\Support;

use Craft;
use craft\elements\Entry;
use verbb\vizy\elements\MatrixAnchor;

class ResetTestDatabase
{
    public const TEST_SECTION_HANDLE = 'vizyTests';

    public static function resetVizyData(): void
    {
        $db = Craft::$app->getDb();

        if ($db->driverName === 'mysql') {
            $db->createCommand('SET FOREIGN_KEY_CHECKS = 0')->execute();
        } elseif ($db->driverName === 'sqlite') {
            $db->createCommand('PRAGMA foreign_keys = OFF')->execute();
        }

        try {
            foreach (MatrixAnchor::find()->status(null)->site('*')->all() as $anchor) {
                Craft::$app->getElements()->deleteElement($anchor, true);
            }

            foreach (Entry::find()->section(self::TEST_SECTION_HANDLE)->status(null)->site('*')->all() as $entry) {
                Craft::$app->getElements()->deleteElement($entry, true);
            }
        } finally {
            if ($db->driverName === 'mysql') {
                $db->createCommand('SET FOREIGN_KEY_CHECKS = 1')->execute();
            } elseif ($db->driverName === 'sqlite') {
                $db->createCommand('PRAGMA foreign_keys = ON')->execute();
            }
        }
    }
}
