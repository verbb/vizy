<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\document\DocumentWalk;
use verbb\vizy\document\VizyBlock;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\elements\Block;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\Matrix as MatrixHelper;
use verbb\vizy\records\MatrixAnchor as MatrixAnchorRecord;

use Craft;
use craft\base\Component;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\db\Query;
use craft\db\Table;
use craft\fields\Matrix;
use craft\helpers\Json;
use craft\models\FieldLayout;

use yii\base\Event;
use yii\db\IntegrityException;
use yii\db\Expression;

use RuntimeException;

class Anchors extends Component
{
    // Public Methods
    // =========================================================================

    /**
     * Resolve a MatrixAnchor for the authorized ownership tuple only.
     *
     * Client-supplied `$anchorUid` is never an authorization input. When
     * provided, it must match the ownership-resolved row or this returns null
     * (fail closed). There is no UID-only lookup path.
     */
    public function getAnchor(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?string $anchorUid = null,
    ): ?MatrixAnchor {
        while ($parentOwner instanceof Block) {
            $parentOwner = $parentOwner->getOwner();
        }
        if (!$parentOwner->id) {
            return null;
        }

        $owners = [$parentOwner];
        if ($anchorUid) {
            if ($parentOwner->duplicateOf) {
                $owners[] = $parentOwner->duplicateOf;
            }
            if ($parentOwner->getIsDerivative()) {
                $owners[] = $parentOwner->getCanonical();
            }
        }
        foreach ($owners as $candidate) {
            if (!$candidate?->id) {
                continue;
            }
            $record = MatrixAnchorRecord::findOne([
                'parentOwnerId' => (int)$candidate->id,
                'vizyFieldId' => $vizyField->id,
                'blockInstanceId' => $blockInstanceId,
            ]);
            if (!$record) {
                continue;
            }
            $anchor = Craft::$app->getElements()->getElementById($record->id, MatrixAnchor::class, $parentOwner->siteId);
            if (!$anchor instanceof MatrixAnchor || ($anchorUid && $anchor->uid !== $anchorUid)) {
                continue;
            }
            // Only Craft's explicit source relationship can authorize a shared
            // historical reference; arbitrary UID lookup is never sufficient.
            $anchor->setParentOwner($candidate);
            return $anchor;
        }
        return null;
    }

    public function ensureAnchor(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?FieldLayout $fieldLayout = null,
        ?string $anchorUid = null,
    ): ?MatrixAnchor {
        while ($parentOwner instanceof Block) {
            $parentOwner = $parentOwner->getOwner();
        }
        if (!$parentOwner->id) {
            return null;
        }

        $referencedAnchor = $this->assertResolvableReference(
            $parentOwner,
            $vizyField,
            $blockInstanceId,
            $anchorUid,
        );

        // Resolve the validated reference through the exact ownership tuple.
        $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

        if ($anchor) {
            return $this->_applyFieldLayout($anchor, $fieldLayout);
        }

        Vizy::$plugin->getContentRecovery()->capture($parentOwner, $vizyField, 'before-anchor-repair');

        $lockName = $this->_mutexLockName($parentOwner, $vizyField, $blockInstanceId);
        $mutex = Craft::$app->getMutex();

        if (!$mutex->acquire($lockName, 5)) {
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

            return $anchor ? $this->_applyFieldLayout($anchor, $fieldLayout) : null;
        }

        try {
            $anchor = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

            if ($anchor) {
                return $this->_applyFieldLayout($anchor, $fieldLayout);
            }

            $transaction = Craft::$app->getDb()->beginTransaction();
            $creatingAnchor = false;
            try {
                // A saved block can be removed and then restored by undo or a
                // revision. Reuse its ownership record and restore only children
                // that were deleted with it, rather than colliding with its key.
                $record = MatrixAnchorRecord::findOne([
                    'parentOwnerId' => (int)$parentOwner->id,
                    'vizyFieldId' => $vizyField->id,
                    'blockInstanceId' => $blockInstanceId,
                ]);
                if ($record) {
                    // The identity can exist while its requested site row does
                    // not. Repair localization under the same creation lock.
                    $existing = MatrixAnchor::find()->id($record->id)->site('*')->trashed(null)->one();
                    if ($existing) {
                        $existing->setParentOwner($parentOwner);
                        if ($existing->dateDeleted !== null) {
                            if (!Craft::$app->getElements()->restoreElement($existing)) {
                                throw new RuntimeException('Unable to restore the Vizy Matrix anchor.');
                            }
                            $this->_restoreMatrixFields($existing);
                        }
                        if ($existing->siteId !== $parentOwner->siteId) {
                            // Resave the owner so Craft also propagates its
                            // Matrix rows; propagating only the element leaves
                            // a valid but empty anchor on a newly enabled site.
                            $existing->setFieldLayout($fieldLayout);
                            $existing->resaving = true;
                            if (!Craft::$app->getElements()->saveElement($existing, false, true, false)) {
                                throw new RuntimeException('Unable to localize the Vizy Matrix anchor.');
                            }
                            $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId);
                            if (!$existing) {
                                throw new RuntimeException('The Vizy Matrix anchor is missing its requested site.');
                            }
                        }
                        $transaction->commit();
                        return $this->_applyFieldLayout($existing, $fieldLayout);
                    }
                }
                $creatingAnchor = true;
                $anchor = $this->_createAnchor($parentOwner, $vizyField, $blockInstanceId, $fieldLayout, $anchorUid);
                $creatingAnchor = false;
                // New duplicates and derivatives resolve through Craft's owner
                // relationship. Historical duplicates have no remaining
                // duplicateOf link, so the exact persisted foreign reference is
                // the only authority for recovering their surviving content.
                $source = $referencedAnchor;
                if (!$source) {
                    $sourceOwner = $parentOwner->duplicateOf;
                    if (!$sourceOwner && $parentOwner->getIsDerivative()) {
                        $sourceOwner = $parentOwner->getCanonical();
                    }
                    if ($sourceOwner && $sourceOwner->id !== $parentOwner->id) {
                        $source = $this->getAnchor($sourceOwner, $vizyField, $blockInstanceId);
                    }
                }
                if ($anchor && $source && $source->id !== $anchor->id && $fieldLayout) {
                    $source->setFieldLayout($fieldLayout);
                    foreach ($fieldLayout->getCustomFields() as $field) {
                        if ($field instanceof Matrix) {
                            $this->copyMatrixField($field, $source, $anchor);
                        }
                    }
                }
                $transaction->commit();
                return $anchor;
            } catch (\Throwable $e) {
                $transaction->rollBack();
                // A host-local mutex cannot serialize other web servers. The
                // unique ownership key still selects a winner, but MySQL's
                // previous transaction snapshot cannot see it until rollback.
                // Never end or retry a caller's surrounding owner transaction.
                if ($creatingAnchor && $e instanceof IntegrityException && !Craft::$app->getDb()->getTransaction()?->getIsActive()) {
                    $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId);
                    if ($existing) {
                        return $this->_applyFieldLayout($existing, $fieldLayout);
                    }
                }
                throw $e;
            }
        } finally {
            $mutex->release($lockName);
        }
    }

    public function saveMatrixField(
        Matrix $field,
        MatrixAnchor $anchor,
        mixed $fieldValue,
        bool $isNew,
    ): void {
        if ($this->hasExternalReferences($anchor)) {
            // Historical drafts can reference the canonical anchor. A migration
            // may submit its unchanged value; leave those rows entirely alone.
            $stored = $field->serializeValue(MatrixHelper::nestedEntryQuery($field, $anchor, deduplicate: false), $anchor);
            $submitted = $field->serializeValue($fieldValue, $anchor);
            if ($stored === $submitted) {
                return;
            }
            throw new RuntimeException('This Matrix content is still referenced by another owner or historical draft. Run vizy/anchors/backfill --drafts --revisions --trashed to give derivatives independent content before editing it. No content has been replaced.');
        }
        if ($fieldLayout = $anchor->getFieldLayout()) {
            $anchor->setFieldLayout($fieldLayout);
        }

        $anchor->setFieldValue($field->handle, $fieldValue);
        $anchor->setDirtyFields([$field->handle]);
        $field->afterElementPropagate($anchor, $isNew);
    }

    public function copyMatrixField(Matrix $field, MatrixAnchor $source, MatrixAnchor $target): void
    {
        $payload = MatrixHelper::payloadForIndependentCopy(
            $field->serializeValue(MatrixHelper::nestedEntryQuery($field, $source), $source),
        );
        $value = MatrixHelper::normalizeContent($field, $payload, $target);
        $this->saveMatrixField($field, $target, $value, false);
    }

    public function repairDuplicateMatrixEntries(Matrix $field, MatrixAnchor $anchor): void
    {
        $value = MatrixHelper::nestedEntryQuery($field, $anchor, deduplicate: false);
        $rows = $value->all();
        $unique = MatrixHelper::deduplicateEntries($rows);
        if (count($unique) !== count($rows)) {
            // Use Craft's normal removal lifecycle; never delete by UID across
            // unrelated owners or bypass nested-entry cleanup.
            $value->setCachedResult($unique);
            $this->saveMatrixField($field, $anchor, $value, false);
        }
    }

    public function deleteAnchor(MatrixAnchor $anchor, bool $hardDelete = false): void
    {
        if ($this->hasExternalReferences($anchor)) {
            throw new RuntimeException('Cannot delete Matrix content while another owner or historical draft still references it. Run vizy/anchors/backfill --drafts --revisions --trashed first.');
        }
        $anchor->hardDelete = $hardDelete;
        // Loaded anchors have no persisted FieldLayout. Discover the fields from
        // their actual children so cleanup also works after schema removal.
        $fields = $this->_matrixFieldsForAnchor($anchor);
        // Matrix entry queries bind their site from the owner during prepare.
        // Pass every localized owner so site-specific rows are also cleaned up.
        // Use the captured identity: a parent hard-delete may already have
        // cascaded the anchor's ownership row before this callback runs.
        foreach (Craft::$app->getSites()->getAllSiteIds() as $siteId) {
            $localized = clone $anchor;
            $localized->siteId = $siteId;
            $localized->hardDelete = $hardDelete;
            foreach ($fields as $field) {
                if (!$field->beforeElementDelete($localized)) {
                    throw new RuntimeException('Unable to delete the Vizy Matrix field content.');
                }
            }
        }

        if (!Craft::$app->getElements()->deleteElement($anchor, $hardDelete)) {
            throw new RuntimeException('Unable to delete the Vizy Matrix anchor.');
        }
    }

    public function gcOrphans(ElementInterface $parentOwner): void
    {
        if ($parentOwner instanceof Block || $parentOwner instanceof MatrixAnchor) {
            return;
        }
        if (!$parentOwner->id) {
            return;
        }

        $records = MatrixAnchorRecord::find()
            ->where([
                'parentOwnerId' => (int)$parentOwner->id,
            ])
            ->all();

        if ($records === []) {
            return;
        }

        // Anchors are shared across sites but never across drafts/revisions.
        // Inspect every persisted Vizy placement, including Hosted documents,
        // after propagation so a local removal cannot erase another site's rows.
        $owners = $parentOwner::find()->id($parentOwner->id)->site('*')->unique(false)
            ->status(null)->drafts(null)->provisionalDrafts(null)->revisions(null)->all();
        $references = [];
        $rawAnchorUids = [];
        foreach ($owners as $owner) {
            foreach ($owner->getFieldLayout()?->getCustomFields() ?? [] as $field) {
                if (!$field instanceof VizyField) {
                    continue;
                }
                $document = $owner->getFieldValue($field->handle);
                if (!$document instanceof VizyDocument) {
                    continue;
                }
                $rawAnchorUids += $this->_referencedAnchorUids($document->content()->nodes());
                foreach (DocumentWalk::blocks($document) as $block) {
                    $fieldId = $block->document()->field()?->id;
                    $references[$fieldId . ':' . $block->uid()] = true;
                }
            }
        }

        foreach ($records as $record) {
            if (!isset($references[$record->vizyFieldId . ':' . $record->blockInstanceId])) {
                $anchor = Craft::$app->getElements()->getElementById($record->id, MatrixAnchor::class, $parentOwner->siteId);

                if ($anchor instanceof MatrixAnchor && !isset($rawAnchorUids[$anchor->uid]) && !$this->hasExternalReferences($anchor)) {
                    $this->deleteAnchor($anchor);
                }
            }
        }
    }

    public function prepareOwnerDeletion(ElementInterface $owner): void
    {
        if (!$owner->id) {
            return;
        }
        foreach ($owner->getFieldLayout()?->getCustomFields() ?? [] as $field) {
            if ($field instanceof VizyField) {
                Vizy::$plugin->getContentRecovery()->capture($owner, $field, 'owner-deletion');
            }
        }

        // Capture before a hard delete cascades the ownership rows, but wait for
        // the successful deletion event inside Craft's transaction to mutate.
        // A cancelled deletion must leave both anchors and children untouched.
        $query = MatrixAnchor::find();
        $query->parentOwnerId = $owner->id;
        $anchors = $query
            ->site('*')
            ->unique()
            ->status(null)
            ->trashed(null)
            ->all();
        foreach ($anchors as $anchor) {
            if ($this->hasExternalReferences($anchor)) {
                throw new RuntimeException('Cannot delete this owner while its Matrix content is referenced by another owner or historical draft. Run vizy/anchors/backfill --drafts --revisions --trashed first.');
            }
        }
        $handler = [$this, 'handleOwnerDeleted'];
        $owner->off(Element::EVENT_AFTER_DELETE, $handler);
        if ($anchors !== []) {
            $owner->on(Element::EVENT_AFTER_DELETE, $handler, $anchors);
        }
    }

    public function handleOwnerDeleted(Event $event): void
    {
        $owner = $event->sender;
        $owner->off(Element::EVENT_AFTER_DELETE, [$this, __FUNCTION__]);
        foreach ($event->data as $anchor) {
            if (!$owner->hardDelete && $anchor->trashed) {
                continue;
            }
            $anchor->deletedWithOwner = true;
            $this->deleteAnchor($anchor, $owner->hardDelete);
        }
    }

    public function restoreAnchorsForOwner(ElementInterface $owner): void
    {
        $query = MatrixAnchor::find();
        $query->parentOwnerId = $owner->id;
        $anchors = $query
            ->site('*')
            ->unique()
            ->status(null)
            ->trashed(true)
            ->andWhere(['elements.deletedWithOwner' => true])
            ->all();
        foreach ($anchors as $anchor) {
            if (!Craft::$app->getElements()->restoreElement($anchor)) {
                throw new RuntimeException('Unable to restore the Vizy Matrix anchor.');
            }
            $this->_restoreMatrixFields($anchor);
        }
    }

    public function blockHasMatrixFields(?FieldLayout $fieldLayout): bool
    {
        if (!$fieldLayout) {
            return false;
        }

        foreach ($fieldLayout->getCustomFields() as $field) {
            if ($field instanceof Matrix) {
                return true;
            }
        }

        return false;
    }

    /** Raw storage includes trash, derivatives and unresolved historical schemas. */
    public function hasExternalReferences(MatrixAnchor $anchor): bool
    {
        return (new Query())->from(Table::ELEMENTS_SITES)
            ->where(['not', ['elementId' => $anchor->parentOwnerId]])
            ->andWhere(['like', new Expression('CAST([[content]] AS ' . (Craft::$app->getDb()->getIsPgsql() ? 'TEXT' : 'CHAR') . ')'), $anchor->uid])
            ->exists();
    }

    /**
     * Resolve an anchor reference only when ownership or the owner's exact
     * persisted document authorizes it. The stored-reference path repairs Vizy
     * 3 duplicates after Craft has discarded its transient duplicateOf link.
     */
    public function getStoredReferencedAnchor(
        ElementInterface $owner,
        VizyField $field,
        string $blockUid,
        ?string $uid,
    ): ?MatrixAnchor {
        if (!$uid || !$owner->id || !$owner->siteId) {
            return null;
        }

        $owned = $this->getAnchor($owner, $field, $blockUid, $uid);
        if ($owned) {
            return $owned;
        }

        $record = (new Query())
            ->select(['a.id', 'a.parentOwnerId', 'e.dateDeleted'])
            ->from(['a' => MatrixAnchorRecord::tableName()])
            ->innerJoin(['e' => Table::ELEMENTS], '[[e.id]] = [[a.id]]')
            ->where([
                'a.vizyFieldId' => $field->id,
                'a.blockInstanceId' => $blockUid,
                'e.uid' => $uid,
            ])
            ->one();
        if (!$record) {
            return null;
        }

        // A localized owner may gain a new site after its anchor was created.
        // Its existing ownership tuple is sufficient to authorize Craft to
        // propagate that same anchor onto the newly enabled site.
        if ((int)$record['parentOwnerId'] === (int)$owner->id) {
            $anchor = MatrixAnchor::find()
                ->id($record['id'])
                ->site('*')
                ->status(null)
                ->trashed(null)
                ->one();
            if ($anchor instanceof MatrixAnchor) {
                $anchor->setParentOwner($owner);
            }

            return $anchor instanceof MatrixAnchor ? $anchor : null;
        }

        if ($record['dateDeleted'] !== null) {
            return null;
        }

        $anchor = MatrixAnchor::find()
            ->id($record['id'])
            ->siteId($owner->siteId)
            ->status(null)
            ->one();
        if (!$anchor instanceof MatrixAnchor) {
            return null;
        }

        $stored = (new Query())
            ->select('content')
            ->from(Table::ELEMENTS_SITES)
            ->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])
            ->scalar();

        return $this->_containsStoredAnchorReference($stored, $blockUid, $uid)
            ? $anchor
            : null;
    }

    public function assertResolvableReference(
        ElementInterface $owner,
        VizyField $field,
        string $blockUid,
        ?string $uid,
    ): ?MatrixAnchor {
        if (!$uid) {
            return null;
        }
        $anchor = $this->getStoredReferencedAnchor($owner, $field, $blockUid, $uid);
        if ($anchor) {
            return $anchor;
        }
        throw new RuntimeException("Matrix content for block {$blockUid} could not be resolved (anchor {$uid}). The stored reference and submitted content have been retained. Restore the missing content before saving.");
    }

    public function elementNeedsMatrixAnchorBackfill(ElementInterface $element, VizyField $vizyField): bool
    {
        $placementField = $element->getFieldLayout()?->getFieldByHandle($vizyField->handle);
        if (!$placementField instanceof VizyField || $placementField->id !== $vizyField->id) {
            return false;
        }
        $value = $element->getFieldValue($vizyField->handle);

        if (!$value instanceof VizyDocument) {
            return false;
        }

        foreach (DocumentWalk::blocks($value) as $block) {
            if ($this->blockNeedsMatrixAnchorBackfill($block, $element, $block->document()->field())) {
                return true;
            }
        }

        return false;
    }

    public function blockNeedsMatrixAnchorBackfill(
        VizyBlock $block,
        ElementInterface $parentOwner,
        VizyField $vizyField,
    ): bool {
        $layout = $block->blockType()?->getFieldLayout();
        if (!$this->blockHasMatrixFields($layout) || !$parentOwner->id) {
            return false;
        }

        if ($this->_blockHasMatrixJsonContent($block)) {
            return true;
        }

        $anchor = $this->getAnchor(
            $parentOwner,
            $vizyField,
            $block->uid(),
            $block->matrixAnchorUid(),
        );
        if (!$anchor || $anchor->parentOwnerId !== (int)$parentOwner->id) {
            return true;
        }
        foreach ($layout->getCustomFields() as $field) {
            if ($field instanceof Matrix) {
                $rows = MatrixHelper::nestedEntryQuery($field, $anchor, deduplicate: false)->all();
                if (count($rows) !== count(MatrixHelper::deduplicateEntries($rows))) {
                    return true;
                }
            }
        }
        return false;
    }


    // Private Methods
    // =========================================================================

    private function _referencedAnchorUids(array $nodes): array
    {
        // Preserve references inside temporarily unresolved Block Types and
        // Hosted placements. Cleanup must not require a complete current schema.
        $uids = [];
        foreach ($nodes as $node) {
            if (!is_array($node)) {
                continue;
            }
            if (($node['type'] ?? null) === 'vizyBlock') {
                $uid = $node['attrs']['matrixAnchorUid'] ?? null;
                if (is_string($uid) && $uid !== '') {
                    $uids[$uid] = true;
                }
                foreach ($node['attrs']['fieldSlots'] ?? [] as $value) {
                    if (DocumentWalk::isHostedEnvelope($value)) {
                        $uids += $this->_referencedAnchorUids($value['content']);
                    }
                }
            }
            if (is_array($node['content'] ?? null)) {
                $uids += $this->_referencedAnchorUids($node['content']);
            }
        }
        return $uids;
    }

    private function _restoreMatrixFields(MatrixAnchor $anchor): void
    {
        $fields = $this->_matrixFieldsForAnchor($anchor);
        foreach (Craft::$app->getSites()->getAllSiteIds() as $siteId) {
            $localized = clone $anchor;
            $localized->siteId = $siteId;
            foreach ($fields as $field) {
                $field->afterElementRestore($localized);
            }
        }
    }

    private function _matrixFieldsForAnchor(MatrixAnchor $anchor): array
    {
        $fieldIds = (new Query())
            ->select('fieldId')
            ->distinct()
            ->from(Table::ENTRIES)
            ->where(['primaryOwnerId' => $anchor->id])
            ->column();
        $fields = [];
        foreach ($fieldIds as $fieldId) {
            $field = Craft::$app->getFields()->getFieldById($fieldId);
            if ($field instanceof Matrix) {
                $fields[] = $field;
            }
        }
        return $fields;
    }

    private function _blockHasMatrixJsonContent(VizyBlock $block): bool
    {
        // Vizy 4 stores placements in fieldSlots (UID keys); legacy JSON may still
        // use Matrix handles. Check both against the Block Type layout.
        $slots = $block->rawFieldValues();
        $fieldLayout = $block->blockType()?->getFieldLayout();

        if (!$fieldLayout) {
            return false;
        }

        foreach ($fieldLayout->getCustomFields() as $field) {
            if (!$field instanceof Matrix) {
                continue;
            }

            $handle = $field->handle;
            $uid = $field->layoutElement?->uid;

            if (array_key_exists($handle, $slots) && $this->_matrixContentFilled($slots[$handle])) {
                return true;
            }

            if ($uid && array_key_exists($uid, $slots) && $this->_matrixContentFilled($slots[$uid])) {
                return true;
            }
        }

        return false;
    }

    private function _matrixContentFilled(mixed $content): bool
    {
        return $content !== null && $content !== '' && $content !== [];
    }

    private function _applyFieldLayout(MatrixAnchor $anchor, ?FieldLayout $fieldLayout): MatrixAnchor
    {
        if ($fieldLayout) {
            $anchor->setFieldLayout($fieldLayout);
        }

        return $anchor;
    }

    private function _mutexLockName(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
    ): string {
        return sprintf(
            'vizy-matrix-anchor:%d:%d:%s',
            (int)$parentOwner->id,
            $vizyField->id,
            $blockInstanceId,
        );
    }

    private function _containsStoredAnchorReference(
        mixed $value,
        string $blockUid,
        string $anchorUid,
        int $depth = 0,
    ): bool {
        if ($depth > 64) {
            return false;
        }
        if (is_string($value)) {
            try {
                $decoded = Json::decode($value);
            } catch (\Throwable) {
                return false;
            }
            return is_array($decoded)
                && $this->_containsStoredAnchorReference($decoded, $blockUid, $anchorUid, $depth + 1);
        }
        if (!is_array($value)) {
            return false;
        }

        $attrs = is_array($value['attrs'] ?? null) ? $value['attrs'] : [];
        $values = is_array($attrs['values'] ?? null) ? $attrs['values'] : [];
        $content = is_array($values['content'] ?? null) ? $values['content'] : [];
        $storedBlockUid = $attrs['blockUid'] ?? $attrs['id'] ?? null;
        $storedAnchorUid = $attrs['matrixAnchorUid']
            ?? $values['matrixAnchorUid']
            ?? $content['matrixAnchorUid']
            ?? null;
        if (
            ($value['type'] ?? null) === 'vizyBlock'
            && $storedBlockUid === $blockUid
            && $storedAnchorUid === $anchorUid
        ) {
            return true;
        }

        foreach ($value as $child) {
            if ($this->_containsStoredAnchorReference($child, $blockUid, $anchorUid, $depth + 1)) {
                return true;
            }
        }
        return false;
    }

    private function _createAnchor(
        ElementInterface $parentOwner,
        VizyField $vizyField,
        string $blockInstanceId,
        ?FieldLayout $fieldLayout,
        ?string $anchorUid,
    ): ?MatrixAnchor {
        $anchor = new MatrixAnchor([
            'vizyFieldId' => $vizyField->id,
            'blockInstanceId' => $blockInstanceId,
            'parentOwnerId' => (int)$parentOwner->id,
            'siteId' => $parentOwner->siteId,
        ]);
        $anchor->setParentOwner($parentOwner);

        if ($fieldLayout) {
            $anchor->setFieldLayout($fieldLayout);
        }

        try {
            if (Craft::$app->getElements()->saveElement($anchor)) {
                return $anchor;
            }
        } catch (IntegrityException $e) {
            $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

            if ($existing) {
                return $this->_applyFieldLayout($existing, $fieldLayout);
            }

            throw $e;
        }

        $existing = $this->getAnchor($parentOwner, $vizyField, $blockInstanceId, null);

        if ($existing) {
            return $this->_applyFieldLayout($existing, $fieldLayout);
        }

        Vizy::error('Unable to save Vizy matrix anchor: ' . implode(', ', $anchor->getErrorSummary(true)));

        return null;
    }

}
