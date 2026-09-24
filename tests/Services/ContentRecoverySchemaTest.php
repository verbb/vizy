<?php

declare(strict_types=1);

use craft\db\Query;
use craft\helpers\StringHelper;
use verbb\vizy\Vizy;
use verbb\vizy\db\Table;
use verbb\vizy\migrations\Install;
use verbb\vizy\migrations\m260924_000000_content_recovery_capacity;

it('advertises the recovery capacity migration to beta 1 installations', function() {
    $storedBetaOneSchema = '1.0.4';

    expect(version_compare(Vizy::$plugin->schemaVersion, $storedBetaOneSchema, '>'))->toBeTrue()
        ->and(is_file(Vizy::$plugin->getBasePath() . '/migrations/m260924_000000_content_recovery_capacity.php'))->toBeTrue();
});

it('normalizes a retained beta 1 recovery table during reinstall', function() {
    $migration = new m260924_000000_content_recovery_capacity();
    $backup = '{{%vizy_recovery_backup_' . strtolower(StringHelper::randomString(8)) . '}}';
    $migration->renameTable(Table::CONTENT_RECOVERY, $backup);
    $placementUid = StringHelper::UUID();
    try {
        $migration->createTable(Table::CONTENT_RECOVERY, [
            'id' => $migration->primaryKey(),
            'ownerId' => $migration->integer()->notNull(),
            'fieldUid' => $migration->uid()->notNull(),
            'snapshotHash' => $migration->char(64)->notNull(),
            'snapshotJson' => $migration->mediumText()->notNull(),
            'reason' => $migration->string()->notNull(),
            'dateCreated' => $migration->dateTime()->notNull(),
        ]);
        $snapshot = json_encode(['placementUid' => $placementUid], JSON_THROW_ON_ERROR);
        Craft::$app->getDb()->createCommand()->insert(Table::CONTENT_RECOVERY, [
            'ownerId' => 123,
            'fieldUid' => StringHelper::UUID(),
            'snapshotHash' => hash('sha256', $snapshot),
            'snapshotJson' => $snapshot,
            'reason' => 'owner-save',
            'dateCreated' => gmdate('Y-m-d H:i:s'),
        ])->execute();

        expect((new Install())->safeUp())->toBeTrue();
        $schema = Craft::$app->getDb()->getTableSchema(Table::CONTENT_RECOVERY, true);
        expect($schema?->getColumn('placementUid'))->not->toBeNull()
            ->and((new Query())->select('placementUid')->from(Table::CONTENT_RECOVERY)->scalar())->toBe($placementUid);
    } finally {
        $migration->dropTableIfExists(Table::CONTENT_RECOVERY);
        $migration->renameTable($backup, Table::CONTENT_RECOVERY);
        Craft::$app->getDb()->getSchema()->refreshTableSchema(Table::CONTENT_RECOVERY);
    }
});

it('stores recovery snapshots larger than the former MySQL MEDIUMTEXT ceiling', function() {
    $migration = new m260924_000000_content_recovery_capacity();
    expect($migration->safeUp())->toBeTrue()->and($migration->safeUp())->toBeTrue();

    $ownerId = random_int(1000000, 2000000000);
    $payload = '{"payload":"' . str_repeat('x', 16_777_216) . '"}';
    try {
        Craft::$app->getDb()->createCommand()->insert(Table::CONTENT_RECOVERY, [
            'ownerId' => $ownerId,
            'fieldUid' => StringHelper::UUID(),
            'snapshotHash' => hash('sha256', $payload),
            'snapshotJson' => $payload,
            'reason' => 'capacity-test',
            'dateCreated' => gmdate('Y-m-d H:i:s'),
        ])->execute();
        $stored = (new Query())->select('snapshotJson')->from(Table::CONTENT_RECOVERY)
            ->where(['ownerId' => $ownerId])->scalar();
        expect(strlen((string)$stored))->toBe(strlen($payload));
    } finally {
        Craft::$app->getDb()->createCommand()->delete(Table::CONTENT_RECOVERY, ['ownerId' => $ownerId])->execute();
    }
});
