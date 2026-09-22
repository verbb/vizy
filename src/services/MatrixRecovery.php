<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\elements\Block;
use verbb\vizy\elements\MatrixAnchor;
use verbb\vizy\fields\VizyField;
use verbb\vizy\nodes\VizyBlock;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\db\Query;
use craft\elements\Entry;
use craft\fields\Matrix;
use craft\helpers\Json;
use craft\helpers\StringHelper;

use RuntimeException;

class MatrixRecovery extends Component
{
    // Properties
    // =========================================================================

    private array $_exporting = [];
    private array $_restoredEntryUids = [];
    private array $_activeAnchors = [];


    // Public Methods
    // =========================================================================

    public function beginAnchorWrite(MatrixAnchor $anchor): void
    {
        $this->_activeAnchors[$anchor->id] = ($this->_activeAnchors[$anchor->id] ?? 0) + 1;
    }

    public function endAnchorWrite(MatrixAnchor $anchor): void
    {
        if (--$this->_activeAnchors[$anchor->id] === 0) {
            unset($this->_activeAnchors[$anchor->id]);
        }
    }

    public function captureNestedChange(ElementInterface $element, string $reason = 'before-nested-change'): void
    {
        // Inline Matrix saves and slideouts can save a nested entry directly, without
        // passing through the containing Vizy field's serializer.
        if ($this->_hasActiveAncestor($element)) {
            return;
        }
        $visited = [];
        while ($element instanceof Entry && $element->primaryOwnerId) {
            if (isset($visited[$element->primaryOwnerId])) {
                throw new RuntimeException('Cyclic nested ownership cannot be safely archived.');
            }
            $visited[$element->primaryOwnerId] = true;
            $element = $element->getPrimaryOwner();
            if ($element instanceof MatrixAnchor) {
                $this->captureAnchor($element, $reason);
                return;
            }
        }
    }

    public function captureField(VizyField $field, ElementInterface $owner, string $reason = 'before-save'): void
    {
        // A nested Vizy field's containing document is captured by its persisted owner.
        if (!$owner->id || $owner instanceof Block || !$field->layoutElement?->uid || $this->_hasActiveAncestor($owner)) {
            return;
        }

        $stored = (new Query())->select('content')->from('{{%elements_sites}}')
            ->where(['elementId' => $owner->id, 'siteId' => $owner->siteId])->scalar();
        $stored = Json::decodeIfJson($stored);
        $raw = is_array($stored) ? ($stored[$field->layoutElement->uid] ?? null) : null;

        if ($raw === null) {
            return;
        }
        if (!str_contains(is_string($raw) ? $raw : Json::encode($raw), 'matrixAnchorUid') && !$this->_fieldContainsMatrix($field)) {
            return;
        }

        $values = [];
        $rawSites = [];
        foreach ((new Query())->select(['siteId', 'content'])->from('{{%elements_sites}}')->where(['elementId' => $owner->id])->all() as $siteRow) {
            $siteContent = Json::decodeIfJson($siteRow['content']);
            if (!is_array($siteContent) || !array_key_exists($field->layoutElement->uid, $siteContent)) {
                continue;
            }
            $localized = clone $owner;
            $localized->siteId = (int)$siteRow['siteId'];
            $rawSites[$localized->siteId] = $siteContent[$field->layoutElement->uid];
            $values[$localized->siteId] = $this->_exportVizy($field, $rawSites[$localized->siteId], $localized);
        }
        $this->_store($owner->uid, $owner->siteId, $field->uid, 'field', $reason, [
            'ownerType' => $owner::class,
            'placementUid' => $field->layoutElement->uid,
            'raw' => $raw,
            'values' => $values, 'rawSites' => $rawSites,
        ]);
    }

    public function captureAnchor(MatrixAnchor $anchor, string $reason): int
    {
        $field = Craft::$app->getFields()->getFieldById($anchor->vizyFieldId);
        $parent = $anchor->getParentOwner();
        $layout = $anchor->getFieldLayout();
        // A nested Entry's elements row exists before Craft has saved its entries
        // row. During that first save/propagation it cannot yet be hydrated.
        $parentIdentity = $parent ? ['uid' => $parent->uid, 'type' => $parent::class]
            : (new Query())->select(['uid', 'type'])->from('{{%elements}}')->where(['id' => $anchor->parentOwnerId])->one();

        if (!$field || !$parentIdentity || !$layout) {
            throw new RuntimeException('Cannot preserve Matrix content without its owner, field and layout.');
        }

        $sites = [];
        foreach ((new Query())->select('siteId')->from('{{%elements_sites}}')->where(['elementId' => $anchor->id])->column() as $siteId) {
            $localized = clone $anchor;
            $localized->siteId = (int)$siteId;
            $fields = [];
            foreach ($layout->getCustomFields() as $matrix) {
                if ($matrix instanceof Matrix) {
                    $fields[$matrix->uid] = $this->_exportMatrix($matrix, $localized);
                }
            }
            $sites[$siteId] = $fields;
        }

        return $this->_store($anchor->uid, $anchor->siteId, $field->uid, 'anchor', $reason, [
            'parentUid' => $parentIdentity['uid'],
            'parentType' => $parentIdentity['type'],
            'blockInstanceId' => $anchor->blockInstanceId,
            'layoutId' => $layout->id,
            'sites' => $sites,
        ]);
    }

    public function getSnapshot(int $id): array
    {
        $snapshot = (new Query())->from('{{%vizy_matrix_recovery}}')->where(['id' => $id])->one();
        if (!$snapshot || !hash_equals($snapshot['contentHash'], hash('sha256', $snapshot['payload']))) {
            throw new RuntimeException('Recovery snapshot is missing or failed its integrity check.');
        }
        $snapshot['payload'] = Json::decode($snapshot['payload']);
        if (($snapshot['payload']['version'] ?? null) !== 1) {
            throw new RuntimeException('Unsupported recovery snapshot version.');
        }
        return $snapshot;
    }

    public function restore(int $id): void
    {
        $snapshot = $this->getSnapshot($id);
        $payload = $snapshot['payload'];
        $this->_restoredEntryUids = [];
        $elements = Craft::$app->getElements();
        $transaction = Craft::$app->getDb()->beginTransaction();

        try {
            if ($snapshot['kind'] === 'field') {
                $owner = $elements->getElementByUid($snapshot['ownerUid'], $payload['ownerType'], $snapshot['siteId']);
                $field = $owner?->getFieldLayout()?->getElementByUid($payload['placementUid'])?->getField();
                if (!$owner || !$field instanceof VizyField || $field->uid !== $snapshot['fieldUid']) {
                    throw new RuntimeException('The original owner and Vizy field placement must exist before restoring.');
                }
                $this->captureField($field, $owner);
                foreach ($payload['values'] as $siteId => $value) {
                    $localized = $elements->getElementByUid($snapshot['ownerUid'], $payload['ownerType'], (int)$siteId);
                    if (!$localized) {
                        throw new RuntimeException('An archived owner site is no longer available.');
                    }
                    $localized->setFieldValue($field->handle, $this->_restoreValue($value));
                    $localized->setDirtyFields([$field->handle]);
                    if (!$elements->saveElement($localized, false, false, false)) {
                        throw new RuntimeException('Unable to restore Vizy content: ' . implode(', ', $localized->getErrorSummary(true)));
                    }
                }
                foreach ($payload['values'] as $siteId => $expected) {
                    $stored = (new Query())->select('content')->from('{{%elements_sites}}')
                        ->where(['elementId' => $owner->id, 'siteId' => $siteId])->scalar();
                    $stored = Json::decodeIfJson($stored);
                    $localized = clone $owner;
                    $localized->siteId = (int)$siteId;
                    $actual = $this->_exportVizy($field, $stored[$payload['placementUid']] ?? null, $localized);
                    if ($this->_contentFingerprint($actual) != $this->_contentFingerprint($expected)) {
                        throw new RuntimeException('Restored Vizy content does not match the archive; recovery was rolled back.');
                    }
                }
            } elseif ($snapshot['kind'] === 'anchor') {
                $anchor = MatrixAnchor::find()->uid($snapshot['ownerUid'])->site('*')->trashed(null)->one();
                $parent = $elements->getElementByUid($payload['parentUid'], $payload['parentType'], $snapshot['siteId']);
                $field = Craft::$app->getFields()->getFieldByUid($snapshot['fieldUid']);
                $layout = Craft::$app->getFields()->getLayoutById($payload['layoutId']);
                if (!$parent || !$field instanceof VizyField || !$layout) {
                    throw new RuntimeException('The original parent, Vizy field and block layout must exist before restoring.');
                }
                if (!$anchor) {
                    // Preserve the archived UID so surviving document references resolve again.
                    $anchor = new MatrixAnchor([
                        'uid' => $snapshot['ownerUid'], 'parentOwnerId' => $parent->id,
                        'vizyFieldId' => $field->id, 'blockInstanceId' => $payload['blockInstanceId'],
                        'siteId' => (int)$snapshot['siteId'],
                    ]);
                    $anchor->setParentOwner($parent);
                    $anchor->setFieldLayout($layout);
                    if (!$elements->saveElement($anchor, false, false, false)) {
                        throw new RuntimeException('Unable to recreate the archived anchor.');
                    }
                } elseif ($anchor->parentOwnerId !== $parent->id || $anchor->vizyFieldId !== $field->id || $anchor->blockInstanceId !== $payload['blockInstanceId']) {
                    throw new RuntimeException('The current anchor no longer matches the archived ownership.');
                }
                $anchor->setFieldLayout($layout);
                if ($anchor->trashed && !$elements->restoreElement($anchor)) {
                    throw new RuntimeException('Unable to restore the trashed anchor.');
                }
                $this->captureAnchor($anchor, 'before-restore');
                foreach ($payload['sites'] as $siteId => $fields) {
                    $localized = MatrixAnchor::find()->id($anchor->id)->siteId((int)$siteId)->one();
                    if (!$localized) {
                        $localized = $elements->propagateElement($anchor, (int)$siteId);
                    }
                    $localized->setFieldLayout($layout);
                    foreach ($fields as $uid => $value) {
                        $matrix = null;
                        foreach ($layout->getCustomFields() as $candidate) {
                            if ($candidate instanceof Matrix && $candidate->uid === $uid) {
                                $matrix = $candidate;
                                break;
                            }
                        }
                        if (!$matrix) {
                            throw new RuntimeException('An archived Matrix field is no longer present on this block layout.');
                        }
                        $normalized = $matrix->normalizeValueFromRequest($this->_restoreValue($value), $localized);
                        Vizy::$plugin->getAnchors()->saveMatrixField($matrix, $localized, $normalized, false, true);
                    }
                }
                $verifiedId = $this->captureAnchor($anchor, 'after-restore');
                $verified = $this->getSnapshot($verifiedId)['payload']['sites'];
                if ($this->_contentFingerprint($verified) != $this->_contentFingerprint($payload['sites'])) {
                    throw new RuntimeException('Restored Matrix content does not match the archive; recovery was rolled back.');
                }
                $elements->invalidateCachesForElement($parent);
            } else {
                throw new RuntimeException('Unknown recovery snapshot format.');
            }
            $transaction->commit();
        } catch (\Throwable $e) {
            $transaction->rollBack();
            throw $e;
        }
    }


    // Private Methods
    // =========================================================================

    private function _fieldContainsMatrix(VizyField $field, array $seen = []): bool
    {
        if (isset($seen[$field->uid])) {
            return false;
        }
        $seen[$field->uid] = true;
        foreach ($field->getBlockTypes() as $blockType) {
            foreach ($blockType->getFieldLayout()?->getCustomFields() ?? [] as $inner) {
                if ($inner instanceof Matrix || ($inner instanceof VizyField && $this->_fieldContainsMatrix($inner, $seen))) {
                    return true;
                }
            }
        }
        return false;
    }

    private function _hasActiveAncestor(ElementInterface $element): bool
    {
        $seen = [];
        while ($element instanceof Entry || $element instanceof MatrixAnchor) {
            if ($element instanceof MatrixAnchor) {
                if (isset($this->_activeAnchors[$element->id])) {
                    return true;
                }
                $element = $element->getParentOwner();
            } elseif ($element->primaryOwnerId) {
                if (isset($this->_activeAnchors[$element->primaryOwnerId])) {
                    return true;
                }
                if (isset($seen[$element->primaryOwnerId])) {
                    throw new RuntimeException('Cyclic nested ownership cannot be safely archived.');
                }
                $seen[$element->primaryOwnerId] = true;
                $element = $element->getPrimaryOwner();
            } else {
                break;
            }
        }
        return false;
    }

    private function _store(string $ownerUid, int $siteId, string $fieldUid, string $kind, string $reason, array $payload): int
    {
        if (!Craft::$app->getDb()->tableExists('{{%vizy_matrix_recovery}}')) {
            throw new RuntimeException('Run Craft migrations before saving Matrix content: the Vizy recovery archive is missing.');
        }
        $json = Json::encode(['version' => 1] + $payload);
        Craft::$app->getDb()->createCommand()->upsert('{{%vizy_matrix_recovery}}', [
            'ownerUid' => $ownerUid, 'siteId' => $siteId, 'fieldUid' => $fieldUid,
            'kind' => $kind, 'reason' => $reason, 'contentHash' => hash('sha256', $json),
            'payload' => $json, 'dateCreated' => gmdate('Y-m-d H:i:s'),
        ], false)->execute();
        return (int)(new Query())->select('id')->from('{{%vizy_matrix_recovery}}')->where([
            'ownerUid' => $ownerUid, 'siteId' => $siteId, 'fieldUid' => $fieldUid,
            'kind' => $kind, 'contentHash' => hash('sha256', $json),
        ])->scalar();
    }

    private function _exportMatrix(Matrix $field, ElementInterface $owner): array
    {
        $key = "$owner->id:$owner->siteId:$field->id";
        if (isset($this->_exporting[$key])) {
            throw new RuntimeException('Cyclic Matrix content cannot be safely archived.');
        }
        $this->_exporting[$key] = true;
        try {
            $rows = Entry::find()->ownerId($owner->id)->fieldId($field->id)->siteId($owner->siteId)
                ->drafts(null)->canonicalsOnly()->savedDraftsOnly()->status(null)->all();
            $result = [];
            foreach ($rows as $row) {
                $values = [];
                $fieldDefinitions = [];
                foreach ($row->getFieldLayout()->getCustomFields() as $inner) {
                    $fieldDefinitions[$inner->handle] = ['uid' => $inner->uid, 'class' => $inner::class];
                    $value = $row->getFieldValue($inner->handle);
                    $values[$inner->handle] = $inner instanceof Matrix
                        ? $this->_exportMatrix($inner, $row)
                        : ($inner instanceof VizyField
                            ? $this->_exportVizy($inner, $inner->serializeValue($value, $row), $row)
                            : $inner->serializeValue($value, $row));
                }
                $result[] = [
                    'sourceId' => $row->id, 'sourceUid' => $row->uid,
                    'typeId' => $row->typeId, 'typeUid' => $row->getType()->uid,
                    'title' => $row->title, 'slug' => $row->slug, 'enabled' => $row->enabled,
                    'collapsed' => $row->collapsed, 'fields' => $values, 'fieldDefinitions' => $fieldDefinitions,
                ];
            }
            return ['_vizyRecoveryMatrix' => $result];
        } finally {
            unset($this->_exporting[$key]);
        }
    }

    private function _exportVizy(VizyField $field, mixed $raw, ElementInterface $owner): array
    {
        $nodes = is_string($raw) ? Json::decodeIfJson($raw) : $raw;
        if (!is_array($nodes)) {
            throw new RuntimeException('Malformed Vizy content cannot be safely archived.');
        }
        foreach ($nodes as &$node) {
            if (($node['type'] ?? null) === VizyBlock::$type) {
                $layout = $field->getBlockTypeByIdOrHandle($node['attrs']['values']['type'] ?? '')?->getFieldLayout();
                if (!$layout) {
                    throw new RuntimeException('A Vizy block layout is missing; its content has been preserved without saving.');
                }
                $uid = $node['attrs']['values']['matrixAnchorUid'] ?? null;
                $anchor = $uid ? Craft::$app->getElements()->getElementByUid($uid, MatrixAnchor::class, $owner->siteId) : null;
                foreach ($layout->getCustomFields() as $inner) {
                    $values = &$node['attrs']['values']['content']['fields'];
                    $key = array_key_exists($inner->handle, $values ?? []) ? $inner->handle : $inner->layoutElement?->uid;
                    if ($inner instanceof Matrix && $uid) {
                        if (!$anchor) {
                            throw new RuntimeException('Referenced Matrix content is unavailable; refusing to replace it.');
                        }
                        $values[$inner->handle] = $this->_exportMatrix($inner, $anchor);
                        if ($key !== $inner->handle) {
                            unset($values[$key]);
                        }
                    } elseif ($inner instanceof VizyField && isset($values[$key])) {
                        $values[$key] = $this->_exportVizy($inner, $values[$key], $owner);
                    }
                    unset($values);
                }
                unset($node['attrs']['values']['matrixAnchorUid']);
            }
            if (isset($node['content'])) {
                $node['content'] = $this->_exportVizy($field, $node['content'], $owner);
            }
        }
        return $nodes;
    }

    private function _contentFingerprint(mixed $value): mixed
    {
        if (!is_array($value)) {
            return $value;
        }
        if (isset($value['_vizyRecoveryMatrix'])) {
            foreach ($value['_vizyRecoveryMatrix'] as &$row) {
                unset($row['sourceId'], $row['sourceUid']);
            }
            unset($row);
        }
        foreach ($value as &$child) {
            $child = $this->_contentFingerprint($child);
        }
        return $value;
    }

    private function _restoreValue(mixed $value): mixed
    {
        if (!is_array($value)) {
            return $value;
        }
        if (array_key_exists('_vizyRecoveryMatrix', $value)) {
            $entries = [];
            $sortOrder = [];
            foreach ($value['_vizyRecoveryMatrix'] as $row) {
                $type = Craft::$app->getEntries()->getEntryTypeById($row['typeId']);
                if (!$type || $type->uid !== $row['typeUid']) {
                    throw new RuntimeException('An archived Matrix entry type is no longer available.');
                }
                foreach ($row['fieldDefinitions'] as $handle => $definition) {
                    $field = $type->getFieldLayout()->getFieldByHandle($handle);
                    if (!$field || $field->uid !== $definition['uid'] || $field::class !== $definition['class']) {
                        throw new RuntimeException('An archived Matrix field has changed or is missing; restore its schema before recovering content.');
                    }
                }
                $uid = $this->_restoredEntryUids[$row['sourceId']] ??= StringHelper::UUID();
                $entries['uid:' . $uid] = [
                    'type' => $type->handle, 'title' => $row['title'], 'slug' => $row['slug'],
                    'enabled' => $row['enabled'], 'collapsed' => $row['collapsed'],
                    'fields' => $this->_restoreValue($row['fields']),
                ];
                $sortOrder[] = $uid;
            }
            return ['entries' => $entries, 'sortOrder' => $sortOrder];
        }
        foreach ($value as &$item) {
            $item = $this->_restoreValue($item);
        }
        return $value;
    }
}
