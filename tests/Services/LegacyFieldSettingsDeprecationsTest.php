<?php

use craft\services\Deprecator;
use verbb\vizy\fields\VizyField;

it('loads stored Vizy 3 settings quietly but still warns on direct legacy API use', function(string $name, mixed $value, mixed $expected) {
    $original = Craft::$app->getDeprecator();
    $warnings = new ReflectionProperty(VizyField::class, '_legacySettingWarned');
    $previousWarnings = $warnings->getValue();
    $warnings->setValue(null, []);
    $deprecator = new class(['logTarget' => false]) extends Deprecator {
        public array $keys = [];

        public function log(string $key, string $message, ?string $file = null, ?int $line = null): void
        {
            $this->keys[] = $key;
        }
    };
    Craft::$app->set('deprecator', $deprecator);

    try {
        $field = new VizyField([$name => $value]);
        expect($deprecator->keys)->toBe([])
            ->and($field->getSettings())->not->toHaveKey($name);

        $field->{'set' . ucfirst($name)}($value);
        expect($deprecator->keys)->toBe([VizyField::class . '::set' . ucfirst($name)])
            ->and($field->{'get' . ucfirst($name)}())->toBe($expected)
            ->and($deprecator->keys)->toHaveCount(2);
    } finally {
        Craft::$app->set('deprecator', $original);
        $warnings->setValue(null, $previousWarnings);
    }
})->with([
    'selected file' => ['vizyConfig', 'extended.json', 'extended.json'],
    'selection mode' => ['configSelectionMode', 'manual', 'manual'],
    'inline config' => ['manualConfig', '{"buttons":["bold"]}', '{"buttons":["bold"]}'],
    'block definitions' => ['fieldData', '[{"name":"Content"}]', [['name' => 'Content']]],
]);
