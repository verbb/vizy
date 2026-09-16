<?php

declare(strict_types=1);

it('retires NestedVizy→CA and Matrix→CA migrator classes', function() {
    expect(class_exists(\verbb\vizy\legacy\NestedVizyToContentAreaMigrator::class))->toBeFalse()
        ->and(class_exists(\verbb\vizy\legacy\MatrixToContentAreaMigrator::class))->toBeFalse();
});

it('refuses Nested Vizy → Content Area mappings in OwnerContentMigrator', function() {
    $migrator = new \verbb\vizy\legacy\OwnerContentMigrator();
    $method = new ReflectionMethod($migrator, '_buildCandidate');
    $method->setAccessible(true);

    $owner = new craft\elements\Entry(['title' => 'Retired nested']);
    $field = new verbb\vizy\fields\VizyField(['name' => 'Body', 'handle' => 'body']);

    expect(fn() => $method->invoke(
        $migrator,
        $owner,
        $field,
        ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => []],
        ['nested' => ['schemaMap' => []]],
    ))->toThrow(RuntimeException::class, 'Nested Vizy → Content Area migration is retired');
});

it('refuses Matrix → Content Area mappings in OwnerContentMigrator', function() {
    $migrator = new \verbb\vizy\legacy\OwnerContentMigrator();
    $method = new ReflectionMethod($migrator, '_buildCandidate');
    $method->setAccessible(true);

    $owner = new craft\elements\Entry(['title' => 'Retired matrix']);
    $field = new verbb\vizy\fields\VizyField(['name' => 'Body', 'handle' => 'body']);

    expect(fn() => $method->invoke(
        $migrator,
        $owner,
        $field,
        ['type' => 'doc', 'attrs' => ['schemaVersion' => 2], 'content' => []],
        ['matrices' => [['placementUid' => 'x']]],
    ))->toThrow(RuntimeException::class, 'Matrix → Content Area migration is retired');
});
