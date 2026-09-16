<?php

declare(strict_types=1);

it('keeps collapsed state outside canonical Block attrs after the Vue cutover', function() {
    $root = dirname(__DIR__, 2);
    $extension = file_get_contents($root . '/src/web/assets/field/src/ts/extensions.ts');
    $registry = file_get_contents($root . '/src/web/assets/field/src/ts/registries.ts');

    expect($extension)->not->toContain('collapsed: { default')
        ->and($registry)->toContain('collapsed: boolean')
        ->and(file_exists($root . '/src/web/assets/field/src/js/vizy.js'))->toBeFalse()
        ->and(file_exists($root . '/src/web/assets/field/src/js/components/VizyInput.vue'))->toBeFalse();
});

it('removes unreachable eager PHP input helpers and Vue package authority', function() {
    $root = dirname(__DIR__, 2);
    $field = file_get_contents($root . '/src/fields/VizyField.php');
    $package = json_decode(file_get_contents($root . '/package.json'), true, 512, JSON_THROW_ON_ERROR);
    $deps = array_merge($package['dependencies'] ?? [], $package['devDependencies'] ?? []);

    expect($field)->not->toContain('_getLegacyVizy3BlocksForInput')
        ->and($field)->not->toContain('_registerMatrixOwnerContextJs')
        ->and($field)->not->toContain('_composeDeferredFootHtml')
        ->and(is_dir($root . '/src/web/assets/field/src/ts'))->toBeTrue()
        ->and(is_dir($root . '/src/web/assets/field/src/js'))->toBeFalse()
        ->and(glob($root . '/src/web/assets/field/src/**/*.vue') ?: [])->toBe([]);
    foreach (array_keys($deps) as $name) {
        expect($name)->not->toStartWith('vue')
            ->and($name)->not->toBe('@vitejs/plugin-vue');
    }
});

