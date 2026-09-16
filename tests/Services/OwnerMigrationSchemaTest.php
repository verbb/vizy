<?php

declare(strict_types=1);

use craft\db\Query;
use craft\helpers\StringHelper;
use verbb\vizy\db\Table;

it('retains legacy checkpoints while adding independent migration placements', function() {
    $db = Craft::$app->getDb();
    $table = Table::OWNER_MIGRATIONS;
    $backup = '{{%vizy_migration_backup_' . strtolower(StringHelper::randomString(8)) . '}}';
    $migration = new \verbb\vizy\migrations\m260917_020000_owner_migration_placements();
    $migration->renameTable($table, $backup);
    try {
        expect((new \verbb\vizy\migrations\m260826_020000_owner_migrations())->safeUp())->toBeTrue();
        $legacy = [
            'runUid' => StringHelper::UUID(), 'mappingRevision' => 'fixture', 'mappingHash' => str_repeat('a', 64),
            'ownerType' => \craft\elements\Entry::class, 'ownerId' => 123, 'siteId' => 1,
            'derivativeKey' => 'canonical', 'fieldUid' => StringHelper::UUID(),
            'sourceSnapshotHash' => str_repeat('b', 64), 'sourceSnapshotJson' => '{"value":[]}',
            'uidMapJson' => '[]', 'errorsJson' => '[]', 'state' => 'ready', 'attempts' => 0,
            'dateCreated' => '2026-09-01 00:00:00', 'dateUpdated' => '2026-09-01 00:00:00', 'uid' => StringHelper::UUID(),
        ];
        $db->createCommand()->insert($table, $legacy)->execute();
        $before = (new Query())->from($table)->one();
        expect($migration->safeUp())->toBeTrue()->and($migration->safeUp())->toBeTrue();
        $after = (new Query())->from($table)->one();
        expect($after['ownerPlacementUid'])->toBeNull();
        unset($after['ownerPlacementUid']);
        expect($after)->toBe($before);
        foreach ([StringHelper::UUID(), StringHelper::UUID()] as $placement) {
            $db->createCommand()->insert($table, [...$legacy, 'uid' => StringHelper::UUID(), 'ownerPlacementUid' => $placement])->execute();
        }
        expect((int)(new Query())->from($table)->count())->toBe(3);
        expect(fn() => $db->createCommand()->insert($table, [...$legacy, 'uid' => StringHelper::UUID(), 'ownerPlacementUid' => $placement])->execute())
            ->toThrow(\yii\db\IntegrityException::class);
        $migration->dropTable($table);
        expect((new \verbb\vizy\migrations\Install())->safeUp())->toBeTrue()
            ->and($db->getTableSchema($table, true)->columns['ownerPlacementUid']->allowNull)->toBeTrue();
    } finally {
        $migration->dropTableIfExists($table);
        $migration->renameTable($backup, $table);
        $db->getSchema()->refresh();
    }
});
