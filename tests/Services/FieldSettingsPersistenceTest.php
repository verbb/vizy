<?php

declare(strict_types=1);

use craft\helpers\StringHelper;
use verbb\vizy\fields\VizyField;

it('preserves default, selected and empty field choices through storage and project config', function(array $settings) {
    $field = new VizyField([
        'name' => 'Persisted choices',
        'handle' => 'persistedChoices' . StringHelper::randomString(8),
        ...$settings,
    ]);
    $expected = [
        'linkSettings' => $field->linkSettings,
        'availableVolumes' => $field->availableVolumes,
        'availableTransforms' => $field->availableTransforms,
    ];
    expect(Craft::$app->getFields()->saveField($field))->toBeTrue();
    Craft::$app->getFields()->refreshFields();
    $loaded = Craft::$app->getFields()->getFieldByUid($field->uid);
    $config = Craft::$app->getProjectConfig()->get('fields.' . $field->uid . '.settings');
    $fromConfig = new VizyField($config);

    foreach ($expected as $name => $value) {
        expect($loaded->$name)->toBe($value, $name . ' database value')
            ->and($fromConfig->$name)->toBe($value, $name . ' project config value');
    }
})->with([
    'defaults' => [[]],
    'none' => [[
        'linkSettings' => [],
        'availableVolumes' => [],
        'availableTransforms' => [],
    ]],
    'selected' => [[
        'linkSettings' => ['title', 'classes'],
        'availableVolumes' => ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'],
        'availableTransforms' => ['bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'],
    ]],
]);
