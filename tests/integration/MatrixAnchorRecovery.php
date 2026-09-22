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

function contentFingerprint(mixed $value): mixed
{
    if (!is_array($value)) {
        return $value;
    }
    unset($value['sourceId'], $value['sourceUid']);
    foreach ($value as &$child) {
        $child = contentFingerprint($child);
    }
    return $value;
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

    $recovery = Vizy::$plugin->getMatrixRecovery();
    $snapshotId = $recovery->captureAnchor($target, 'regression-restore');
    check((bool)$snapshotId, 'durable recovery snapshot is stored');
    check($recovery->captureAnchor($target, 'repeat-capture') === $snapshotId, 'identical content is deduplicated in the archive');
    $snapshotJson = (new craft\db\Query())->select('payload')->from('{{%vizy_matrix_recovery}}')->where(['id' => $snapshotId])->scalar();
    Craft::$app->getDb()->createCommand()->update('{{%vizy_matrix_recovery}}', ['payload' => $snapshotJson . ' '], ['id' => $snapshotId])->execute();
    try {
        $recovery->restore($snapshotId);
        throw new RuntimeException('Corrupt snapshot was accepted');
    } catch (RuntimeException $e) {
        check(str_contains($e->getMessage(), 'integrity check'), 'corrupt snapshots are refused before recovery writes');
    } finally {
        Craft::$app->getDb()->createCommand()->update('{{%vizy_matrix_recovery}}', ['payload' => $snapshotJson], ['id' => $snapshotId])->execute();
    }
    $beforeRestore = rows($target, $matrix)[0]->title;
    $emptyValue = $matrix->normalizeValueFromRequest(['entries' => [], 'sortOrder' => []], $target);
    $anchors->saveMatrixField($matrix, $target, $emptyValue, false, true);
    check(rows($target, $matrix) === [], 'intentional clearing is allowed after preserving a snapshot');
    $recovery->restore((int)$snapshotId);
    check(rows($target, $matrix)[0]->title === $beforeRestore, 'targeted recovery restores cleared content without a database restore');

    $pureOwner = Craft::$app->getElements()->duplicateElement($owner, ['fieldValues' => $emptyValues]);
    historicalReference($pureOwner, $owner);
    $pureOwner->setFieldValue($vizy->handle, $owner->getFieldValue($vizy->handle)->getRawNodes());
    $beforeAnchors = MatrixAnchor::find()->site('*')->trashed(null)->count();
    $beforeSnapshots = (new craft\db\Query())->from('{{%vizy_matrix_recovery}}')->count();
    $pureValue = $pureOwner->getFieldValue($vizy->handle);
    $beforeJson = $pureValue->getRawNodes();
    $vizy->serializeValue($pureValue, $pureOwner);
    foreach ($pureValue->getNodes() as $node) {
        if ($node instanceof verbb\vizy\nodes\VizyBlock) {
            $node->getBlockElement($pureOwner);
        }
    }
    check(MatrixAnchor::find()->site('*')->trashed(null)->count() === $beforeAnchors, 'opening and serializing a historical block creates no anchors');
    check((new craft\db\Query())->from('{{%vizy_matrix_recovery}}')->count() === $beforeSnapshots, 'read-only access creates no recovery records');
    check($pureValue->getRawNodes() === $beforeJson, 'read-only access preserves stored references');

    // Preserve a complete document before it is removed, then restore it through Craft.
    $rootField = $emptyOwner->getFieldLayout()->getFieldByHandle($vizy->handle);
    $savedDocument = $emptyOwner->getFieldValue($vizy->handle)->getRawNodes();
    $recovery->captureField($rootField, $emptyOwner);
    $fieldSnapshotId = (new craft\db\Query())->select('id')->from('{{%vizy_matrix_recovery}}')
        ->where(['kind' => 'field', 'ownerUid' => $emptyOwner->uid, 'siteId' => $emptyOwner->siteId])
        ->orderBy(['id' => SORT_DESC])->scalar();
    $emptyOwner->setFieldValue($vizy->handle, []);
    check(Craft::$app->getElements()->saveElement($emptyOwner, false, false), 'intentional block removal saves');
    check($anchors->getAnchor($emptyOwner, $vizy, $source->blockInstanceId) !== null, 'block removal retains its detached anchor for recovery');
    $recovery->restore((int)$fieldSnapshotId);
    $restoredOwner = Craft::$app->getElements()->getElementById($emptyOwner->id, $emptyOwner::class, $emptyOwner->siteId);
    check(count($restoredOwner->getFieldValue($vizy->handle)->getRawNodes()) === count($savedDocument), 'document recovery restores the removed block');
    check(count(rows($anchors->getAnchor($restoredOwner, $vizy, $source->blockInstanceId), $matrix)) === count($originalRows), 'document recovery restores nested Matrix content');

    $cancel = static function($event): void { $event->isValid = false; };
    $restoredOwner->on(craft\base\Element::EVENT_BEFORE_DELETE, $cancel);
    check(!Craft::$app->getElements()->deleteElement($restoredOwner), 'owner deletion can be canceled');
    check($anchors->getAnchor($restoredOwner, $vizy, $source->blockInstanceId) !== null, 'canceled deletion preserves anchors');
    $restoredOwner->off(craft\base\Element::EVENT_BEFORE_DELETE, $cancel);
    check(Craft::$app->getElements()->deleteElement($restoredOwner), 'owner can be trashed');
    check((new craft\db\Query())->from('{{%vizy_matrix_anchors}}')->where(['parentOwnerId' => $restoredOwner->id])->exists(), 'trash preserves anchor ownership metadata');
    check(Craft::$app->getElements()->restoreElement($restoredOwner), 'owner can be restored from trash');
    $afterTrash = $anchors->getAnchor($restoredOwner, $vizy, $source->blockInstanceId);
    check($afterTrash && count(rows($afterTrash, $matrix)) === count($originalRows), 'restoring the owner restores its Matrix content');

    $hardDeleteSnapshot = $recovery->captureAnchor($afterTrash, 'before-hard-delete-test');
    $archivedUid = $afterTrash->uid;
    $archivedTitle = rows($afterTrash, $matrix)[0]->title;
    $anchors->deleteAnchor($afterTrash, true);
    check(!MatrixAnchor::find()->uid($archivedUid)->trashed(null)->exists(), 'test anchor is permanently deleted');
    $recovery->restore($hardDeleteSnapshot);
    $recreated = MatrixAnchor::find()->uid($archivedUid)->siteId($afterTrash->siteId)->one();
    check($recreated && rows($recreated, $matrix)[0]->title === $archivedTitle, 'journal restores permanently deleted anchor content and its UID');

    $archiveFailure = new class extends verbb\vizy\services\MatrixRecovery {
        public function captureAnchor(MatrixAnchor $anchor, string $reason): int
        {
            throw new RuntimeException('Injected archive write failure');
        }
    };
    Vizy::$plugin->set('matrixRecovery', $archiveFailure);
    try {
        $emptyValue = $matrix->normalizeValueFromRequest(['entries' => [], 'sortOrder' => []], $recreated);
        $anchors->saveMatrixField($matrix, $recreated, $emptyValue, false, true);
        throw new RuntimeException('Archive failure was ignored');
    } catch (RuntimeException $e) {
        check($e->getMessage() === 'Injected archive write failure', 'archive failure blocks a destructive save');
    } finally {
        Vizy::$plugin->set('matrixRecovery', $recovery);
    }
    check(rows($recreated, $matrix)[0]->title === $archivedTitle, 'archive failure leaves the original content intact');

    check(Craft::$app->getElements()->deleteElement($restoredOwner, true), 'owner can be permanently deleted');
    check((new craft\db\Query())->from('{{%vizy_matrix_recovery}}')->where(['ownerUid' => $archivedUid])->exists(), 'recovery archive survives permanent owner deletion');

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
    $qualifiedOwner = Craft::$app->getElements()->duplicateElement(
        Craft::$app->getElements()->getElementById($owner->id, $owner::class, $owner->siteId),
    );
    $qualified = $anchors->getAnchor($qualifiedOwner, $vizy, $source->blockInstanceId);
    $extra = Craft::$app->getElements()->duplicateElement(rows($qualified, $matrix)[0], [
        'enabled' => false, 'title' => 'Disabled recovery row',
        'primaryOwner' => $qualified, 'owner' => $qualified, 'sortOrder' => 2,
    ]);
    foreach (MatrixAnchor::find()->id($qualified->id)->site('*')->unique(false)->all() as $locale) {
        $row = rows($locale, $matrix)[0];
        $row->title = "Site {$locale->siteId}: <rich> & Unicode — preserved";
        check(Craft::$app->getElements()->saveElement($row, false, false, false), "localized fixture saves on site {$locale->siteId}");
    }
    $completeSnapshot = $recovery->captureAnchor($qualified, 'complete-content-test');
    $before = contentFingerprint($recovery->getSnapshot($completeSnapshot)['payload']['sites']);
    $anchors->deleteAnchor($qualified, true);
    $recovery->restore($completeSnapshot);
    $qualified = MatrixAnchor::find()->uid($qualified->uid)->siteId($qualified->siteId)->one();
    $afterSnapshot = $recovery->captureAnchor($qualified, 'complete-content-result');
    $after = contentFingerprint($recovery->getSnapshot($afterSnapshot)['payload']['sites']);
    check($before === $after, 'recovery preserves all serialized field values, order, disabled rows and distinct site content');
    require __DIR__ . '/MatrixPreservationNested.php';
} finally {
    $transaction->rollBack();
    echo "Database changes rolled back.\n";
}
