<?php

declare(strict_types=1);

use verbb\vizy\Vizy;
use verbb\vizy\db\Table;
use verbb\vizy\migrations\m260924_010000_matrix_anchor_documents;
use craft\helpers\StringHelper;

it('advertises and applies placement-path Matrix anchor ownership', function() {
    expect(version_compare(Vizy::$plugin->schemaVersion, '1.0.5', '>'))->toBeTrue()
        ->and(is_file(Vizy::$plugin->getBasePath() . '/migrations/m260924_010000_matrix_anchor_documents.php'))->toBeTrue();

    $migration = new m260924_010000_matrix_anchor_documents();
    expect($migration->safeUp())->toBeTrue()->and($migration->safeUp())->toBeTrue();

    $db = Craft::$app->getDb();
    $schema = $db->getTableSchema(Table::MATRIX_ANCHORS, true);
    expect($schema?->getColumn('documentKey'))->not->toBeNull()
        ->and($schema->getColumn('documentKey')->allowNull)->toBeFalse();

    $unique = array_map('array_values', $db->getSchema()->findUniqueIndexes($schema));
    expect($unique)->toContain(['parentOwnerId', 'vizyFieldId', 'documentKey', 'blockInstanceId'])
        ->and($unique)->not->toContain(['parentOwnerId', 'vizyFieldId', 'blockInstanceId']);
});

it('upgrades the beta 1 Matrix anchor key without changing legacy rows', function(bool $partiallyApplied) {
    $migration = new m260924_010000_matrix_anchor_documents();
    $db = Craft::$app->getDb();
    $backup = '{{%vizy_anchor_backup_' . strtolower(StringHelper::randomString(8)) . '}}';
    $parents = '{{%vizy_anchor_parents_' . strtolower(StringHelper::randomString(8)) . '}}';
    $migration->renameTable(Table::MATRIX_ANCHORS, $backup);
    try {
        $migration->createTable($parents, [
            'id' => $migration->integer()->notNull(),
            'PRIMARY KEY([[id]])',
        ]);
        $columns = [
            'id' => $migration->integer()->notNull(),
            'vizyFieldId' => $migration->integer()->notNull(),
            'blockInstanceId' => $migration->string(36)->notNull(),
            'parentOwnerId' => $migration->integer()->notNull(),
        ];
        if ($partiallyApplied) {
            // A failed first attempt has already committed this ALTER TABLE on
            // MySQL before the legacy-index drop throws.
            $columns['documentKey'] = $migration->string(64)->notNull()->defaultValue('');
        }
        $columns[] = 'PRIMARY KEY([[id]])';
        $migration->createTable(Table::MATRIX_ANCHORS, $columns);
        $migration->createIndex(null, Table::MATRIX_ANCHORS, ['parentOwnerId', 'vizyFieldId', 'blockInstanceId'], true);
        // Reproduce the MySQL upgrade shape where the legacy composite index
        // is also the supporting index for the parent-owner foreign key.
        $migration->addForeignKey(
            null,
            Table::MATRIX_ANCHORS,
            'parentOwnerId',
            $parents,
            'id',
            'CASCADE',
        );
        $db->createCommand()->insert($parents, ['id' => 456])->execute();
        $legacy = ['id' => 987654321, 'vizyFieldId' => 123, 'blockInstanceId' => StringHelper::UUID(), 'parentOwnerId' => 456];
        $db->createCommand()->insert(Table::MATRIX_ANCHORS, $legacy)->execute();

        expect($migration->safeUp())->toBeTrue()->and($migration->safeUp())->toBeTrue();
        $row = (new \craft\db\Query())->from(Table::MATRIX_ANCHORS)->one();
        expect($row['documentKey'])->toBe('');
        unset($row['documentKey']);
        expect(array_map('strval', $row))->toBe(array_map('strval', $legacy));

        $schema = $db->getTableSchema(Table::MATRIX_ANCHORS, true);
        $unique = array_map('array_values', $db->getSchema()->findUniqueIndexes($schema));
        expect($unique)->toContain(['parentOwnerId', 'vizyFieldId', 'documentKey', 'blockInstanceId'])
            ->and($unique)->not->toContain(['parentOwnerId', 'vizyFieldId', 'blockInstanceId']);
    } finally {
        $migration->dropTableIfExists(Table::MATRIX_ANCHORS);
        $migration->dropTableIfExists($parents);
        $migration->renameTable($backup, Table::MATRIX_ANCHORS);
        $db->getSchema()->refreshTableSchema(Table::MATRIX_ANCHORS);
    }
})->with([
    'unapplied migration' => false,
    'partially applied migration' => true,
]);
