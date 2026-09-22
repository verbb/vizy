<?php

// Run against a populated local Craft fixture; all database changes are rolled back.
// php MatrixAnchorRecovery.php /path/to/craft SOURCE_ANCHOR_ID
require $argv[1] . '/bootstrap.php';
$app = require CRAFT_VENDOR_PATH . '/craftcms/cms/bootstrap/console.php';

use craft\elements\Entry;
use craft\fields\Matrix;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\Vizy;

function check(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
    echo "PASS: $message\n";
}

function rows(MatrixAnchor $anchor, Matrix $field): array
{
    return Entry::find()->ownerId($anchor->id)->fieldId($field->id)
        ->siteId($anchor->siteId)->status(null)->all();
}

function historicalReference(Entry $target, Entry $source): void
{
    // Reproduce pre-fix stored JSON without invoking today's save/repair hooks.
    $content = (new craft\db\Query())->select('content')->from('{{%elements_sites}}')
        ->where(['elementId' => $source->id, 'siteId' => $source->siteId])->scalar();
    Craft::$app->getDb()->createCommand()->update('{{%elements_sites}}', ['content' => new yii\db\JsonExpression(craft\helpers\Json::decodeIfJson($content))],
        ['elementId' => $target->id, 'siteId' => $target->siteId])->execute();
}

echo 'Craft ' . Craft::$app->getVersion() . ', Vizy ' . Vizy::$plugin->getVersion() . ", PHP " . PHP_VERSION . "\n";
$transaction = Craft::$app->getDb()->beginTransaction();
try {
    $source = MatrixAnchor::find()->id((int)$argv[2])->status(null)->one();
    check($source instanceof MatrixAnchor, 'source anchor fixture exists');
    $layout = $source->getFieldLayout();
    $matrix = null;
    foreach ($layout->getCustomFields() as $field) {
        if ($field instanceof Matrix && rows($source, $field)) {
            $matrix = $field;
            break;
        }
    }
    check($matrix instanceof Matrix, 'source fixture has persisted Matrix content');
    $vizy = Craft::$app->getFields()->getFieldById($source->vizyFieldId);
    $owner = $source->getParentOwner();
    $emptyValues = [];
    foreach ($owner->getFieldLayout()->getCustomFields() as $field) {
        if ($field instanceof VizyField) {
            $emptyValues[$field->handle] = [];
        }
    }
    $targetOwner = Craft::$app->getElements()->duplicateElement($owner, ['fieldValues' => $emptyValues]);
    historicalReference($targetOwner, $owner);
    check($targetOwner->duplicateOf === null, 'historical owner has no duplicateOf marker');
    $anchors = Vizy::$plugin->getAnchors();
    check($anchors->getAnchor($targetOwner, $vizy, $source->blockInstanceId, $source->uid) === null, 'foreign anchor is never returned for editing');
    $target = $anchors->ensureAnchor($targetOwner, $vizy, $source->blockInstanceId, $layout, $source->uid);
    $originalRows = rows($source, $matrix);
    $copiedRows = rows($target, $matrix);
    check(count($copiedRows) === count($originalRows), 'historical reference copies all Matrix entries');
    check($target->id !== $source->id && $target->parentOwnerId === $targetOwner->id, 'recovery creates an independently owned anchor');
    check(!array_intersect(array_column($originalRows, 'id'), array_column($copiedRows, 'id')), 'recovery creates independent nested entry IDs');
    check(!array_intersect(array_column($originalRows, 'uid'), array_column($copiedRows, 'uid')), 'recovery creates independent nested entry UIDs');
    $again = $anchors->ensureAnchor($targetOwner, $vizy, $source->blockInstanceId, $layout, $source->uid);
    check(array_column(rows($again, $matrix), 'id') === array_column($copiedRows, 'id'), 'repeating recovery does not duplicate content');
    $copiedRows[0]->title = 'Independent recovery regression';
    check(Craft::$app->getElements()->saveElement($copiedRows[0], false), 'copied content can be edited');
    check(rows($source, $matrix)[0]->title === $originalRows[0]->title, 'editing recovered content preserves the source');

    $originalJson = $owner->getFieldValue($vizy->handle)->getRawNodes();
    $newDuplicate = Craft::$app->getElements()->duplicateElement($owner);
    check($owner->getFieldValue($vizy->handle)->getRawNodes() === $originalJson, 'native duplication preserves source nodes in memory');
    $duplicateAnchor = $anchors->getAnchor($newDuplicate, $vizy, $source->blockInstanceId);
    check($duplicateAnchor && count(rows($duplicateAnchor, $matrix)) === count($originalRows), 'native entry duplication still copies Matrix content');
    check(!array_intersect(array_column(rows($duplicateAnchor, $matrix), 'id'), array_column($originalRows, 'id')), 'native entry duplication has independent nested entries');

    // Simulate an earlier CP visit allocating an empty anchor without updating stored JSON.
    $emptyOwner = Craft::$app->getElements()->duplicateElement($owner, ['fieldValues' => $emptyValues]);
    historicalReference($emptyOwner, $owner);
    $empty = $anchors->ensureAnchor($emptyOwner, $vizy, $source->blockInstanceId, $layout);
    check(rows($empty, $matrix) === [], 'previously allocated target is empty');
    $emptyOwner->setFieldValue($vizy->handle, $owner->getFieldValue($vizy->handle)->getRawNodes());
    $anchorCount = MatrixAnchor::find()->site('*')->status(null)->count();
    check($anchors->elementNeedsMatrixAnchorBackfill($emptyOwner, $vizy), 'backfill detects a stale reference even with an existing target');
    check(MatrixAnchor::find()->site('*')->status(null)->count() === $anchorCount && rows($empty, $matrix) === [], 'backfill inspection does not repair or write content');
    $repaired = $anchors->ensureAnchor($emptyOwner, $vizy, $source->blockInstanceId, $layout, $source->uid);
    check($repaired->id === $empty->id && count(rows($repaired, $matrix)) === count($originalRows), 'recovery populates the existing empty target');

    // The normal save/backfill path must persist the replacement UID, not merely render it.
    check(Craft::$app->getElements()->saveElement($emptyOwner, false, false), 'owner with a historical reference saves successfully');
    $reloaded = Craft::$app->getElements()->getElementById($emptyOwner->id, $emptyOwner::class, $emptyOwner->siteId);
    check(!$anchors->elementNeedsMatrixAnchorBackfill($reloaded, $vizy), 'saved owner no longer needs reference repair');

    // A failed nested save must roll back the anchor as well as its children.
    $failedOwner = Craft::$app->getElements()->duplicateElement($owner, ['fieldValues' => $emptyValues]);
    historicalReference($failedOwner, $owner);
    $handler = static function($event) use ($source): void {
        $element = $event->element;
        if ($element instanceof Entry && $element->duplicateOf && $element->duplicateOf->getOwnerId() === $source->id) {
            throw new RuntimeException('Injected nested-copy failure');
        }
    };
    yii\base\Event::on(craft\services\Elements::class, craft\services\Elements::EVENT_BEFORE_SAVE_ELEMENT, $handler);
    try {
        $anchors->ensureAnchor($failedOwner, $vizy, $source->blockInstanceId, $layout, $source->uid);
        throw new RuntimeException('Expected copy failure was not raised');
    } catch (RuntimeException $e) {
        check($e->getMessage() === 'Injected nested-copy failure', 'nested-copy failure is reported');
    } finally {
        yii\base\Event::off(craft\services\Elements::class, craft\services\Elements::EVENT_BEFORE_SAVE_ELEMENT, $handler);
    }
    check($anchors->getAnchor($failedOwner, $vizy, $source->blockInstanceId) === null, 'failed copy leaves no empty anchor');
    $retried = $anchors->ensureAnchor($failedOwner, $vizy, $source->blockInstanceId, $layout, $source->uid);
    check(count(rows($retried, $matrix)) === count($originalRows), 'failed copy can be retried successfully');

    $unrelatedOwner = Craft::$app->getElements()->duplicateElement($owner, ['fieldValues' => $emptyValues]);
    try {
        $anchors->ensureAnchor($unrelatedOwner, $vizy, $source->blockInstanceId, $layout, $source->uid);
        throw new RuntimeException('Untrusted reference was accepted');
    } catch (RuntimeException $e) {
        check(str_contains($e->getMessage(), 'without a stored source reference'), 'incoming foreign UID alone cannot copy content');
    }
    check($anchors->getAnchor($unrelatedOwner, $vizy, $source->blockInstanceId) === null, 'rejected reference leaves no empty target');

    $draft = Craft::$app->getDrafts()->createDraft($owner, null, 'Matrix preservation regression');
    $draftAnchor = $anchors->getAnchor($draft, $vizy, $source->blockInstanceId);
    check($draftAnchor && $draftAnchor->id !== $source->id, 'draft owns an independent anchor');
    $draftRows = rows($draftAnchor, $matrix);
    check(count($draftRows) === count($originalRows), 'draft starts with all Matrix content');
    $draftRows[0]->title = 'Isolated draft edit';
    check(Craft::$app->getElements()->saveElement($draftRows[0], false), 'draft Matrix edit saves');
    check(rows($source, $matrix)[0]->title === $originalRows[0]->title, 'draft Matrix edit cannot change published content');
    $published = Craft::$app->getDrafts()->applyDraft($draft);
    $publishedAnchor = $anchors->getAnchor($published, $vizy, $source->blockInstanceId);
    check(rows($publishedAnchor, $matrix)[0]->title === 'Isolated draft edit', 'publication promotes the draft Matrix content');

    foreach (Craft::$app->getSites()->getAllSites() as $site) {
        if ($site->id === $owner->siteId) {
            continue;
        }
        $localizedOwner = Craft::$app->getElements()->getElementById($targetOwner->id, $targetOwner::class, $site->id);
        $localizedSource = MatrixAnchor::find()->id($source->id)->siteId($site->id)->status(null)->one();
        if (!$localizedOwner || !$localizedSource) {
            continue;
        }
        historicalReference($localizedOwner, $localizedSource->getParentOwner());
        $localized = $anchors->ensureAnchor($localizedOwner, $vizy, $source->blockInstanceId, $layout, $source->uid);
        check(count(rows($localized, $matrix)) === count(rows($localizedSource, $matrix)), "localized recovery preserves content on site {$site->id}");

        // Retain support for anchors whose owner has just gained a site.
        $siteOwner = Craft::$app->getElements()->getElementById($unrelatedOwner->id, $unrelatedOwner::class, $site->id);
        $siteAnchor = $anchors->ensureAnchor($unrelatedOwner, $vizy, $source->blockInstanceId, $layout);
        Craft::$app->getDb()->createCommand()->delete('{{%elements_sites}}', ['elementId' => $siteAnchor->id, 'siteId' => $site->id])->execute();
        $healed = $anchors->ensureAnchor($siteOwner, $vizy, $source->blockInstanceId, $layout, $siteAnchor->uid);
        check($healed->id === $siteAnchor->id && $healed->siteId === $site->id, 'owned anchor with a missing site is localized rather than replaced');
    }
} finally {
    $transaction->rollBack();
    echo "Database changes rolled back.\n";
}
