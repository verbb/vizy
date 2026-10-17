<?php

$vendor = getenv('VERBB_TEST_VENDOR') ?: dirname(__DIR__, 2) . '/vendor';
require $vendor . '/autoload.php';
require_once $vendor . '/yiisoft/yii2/Yii.php';
require_once $vendor . '/craftcms/cms/src/Craft.php';
$checks = 0;
$check = static function(bool $value, string $message) use (&$checks): void {
    if (!$value) {
        throw new RuntimeException($message);
    }
    $checks++;
};

$key = 'vizy-craft5';
$namespace = str_starts_with($key, 'hyper-') ? 'hyper' : 'vizy';
$a = new \craft\fields\PlainText(['handle' => 'body', 'uid' => '00000000-0000-4000-8000-000000000001']);
$b = new \craft\fields\PlainText(['handle' => 'body', 'uid' => '00000000-0000-4000-8000-000000000002']);
$element = static fn($field) => new class($field) extends \craft\fieldlayoutelements\CustomField {
    public function isMultiInstance(): bool { return false; }
};
$first = $element($a);
$second = $element($b);
$layout = new \craft\models\FieldLayout();
$tab = new \craft\models\FieldLayoutTab();
$tab->setLayout($layout);
// Provide an already-hydrated layout without querying an installed site.
(new ReflectionProperty($tab, '_elements'))->setValue($tab, [$first]);
(new ReflectionProperty($layout, '_tabs'))->setValue($layout, [$tab]);
$method = new ReflectionMethod('verbb\\'.$namespace.'\\helpers\\Fields', '_showFldFieldSelector');
$method->setAccessible(true);
$check(!$method->invoke(null, $layout, $first), 'A single-instance custom field already in the layout must be hidden.');
$check($method->invoke(null, $layout, $second), 'A different field with the same handle must remain selectable by UID.');

echo "Passed $checks behavioral regression checks on PHP " . PHP_VERSION . ".\n";
