<?php

require __DIR__ . '/verify.php';

use craft\elements\Entry;
use verbb\vizy\Vizy;

$job = json_decode(file_get_contents($argv[1]), true, flags: JSON_THROW_ON_ERROR);
try {
    if ($job['localMutex'] ?? false) {
        $mutexPath = dirname($job['result']) . '/mutex-' . basename($job['result']);
        mkdir($mutexPath);
        Craft::$app->set('mutex', new \yii\mutex\FileMutex(['mutexPath' => $mutexPath]));
    }
    $owner = Entry::find()->id($job['ownerId'])->siteId($job['siteId'])->drafts(null)->provisionalDrafts(null)->status(null)->one();
    $field = Craft::$app->getFields()->getFieldById($job['fieldId']);
    $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($job['typeUid']);
    $anchors = Vizy::$plugin->getAnchors();
    $creationAttempts = 0;
    if ($job['localMutex'] ?? false) {
        \yii\base\Event::on(\verbb\vizy\elements\MatrixAnchor::class, \verbb\vizy\elements\MatrixAnchor::EVENT_BEFORE_SAVE, static function() use (&$creationAttempts) {
            $creationAttempts++;
            // Force the insert windows to overlap even on fast local databases.
            usleep(150_000);
        });
    }
    $transaction = ($job['outerTransaction'] ?? false) ? Craft::$app->getDb()->beginTransaction() : null;
    // Establish the same absent-identity observation in separate DB connections.
    $anchors->getAnchor($owner, $field, $job['blockUid']);
    touch($job['ready']);
    $deadline = microtime(true) + 15;
    while (!is_file($job['go'])) {
        if (microtime(true) > $deadline) throw new RuntimeException('Concurrent worker barrier timed out.');
        usleep(10_000);
    }
    if (isset($job['document'])) {
        $owner->setFieldValue($field->handle, $job['document']);
        if (!Craft::$app->getElements()->saveElement($owner)) throw new RuntimeException(json_encode($owner->getErrors()));
    }
    $anchor = $anchors->ensureAnchor($owner, $field, $job['blockUid'], $type->getFieldLayout());
    if (!$anchor) throw new RuntimeException('Concurrent ensure returned no anchor.');
    $transaction?->commit();
    $result = ['id' => $anchor->id, 'uid' => $anchor->uid, 'mutex' => Craft::$app->getMutex()::class, 'creationAttempts' => $creationAttempts];
} catch (Throwable $error) {
    if (isset($transaction) && $transaction->getIsActive()) $transaction->rollBack();
    $result = ['error' => $error::class . ': ' . $error->getMessage()];
}
file_put_contents($job['result'], json_encode($result, JSON_THROW_ON_ERROR));
