<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\db\Table as VizyTable;
use verbb\vizy\document\DocumentWalk;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\AnchorDocuments;
use verbb\vizy\helpers\FieldPlacements;
use verbb\vizy\helpers\Matrix as MatrixHelper;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\db\Query;
use craft\db\Table;
use craft\helpers\Json;
use craft\fields\Matrix;

use RuntimeException;
use Throwable;

/**
 * Immutable storage snapshots. Nested values, relations and ownership are copied
 * into the journal, never represented solely by a pointer to live elements.
 */
final class ContentRecovery extends Component
{
    public const AUTOMATIC_RETENTION = 10;

    // Properties
    // =========================================================================

    private bool $_restoring = false;


    // Public Methods
    // =========================================================================

    public function capture(ElementInterface $owner, VizyField $field, string $reason = 'owner-save'): ?int
    {
        if ($this->_restoring || !$owner->id || $owner instanceof \verbb\vizy\elements\Block) {
            return null;
        }
        $snapshot = $this->snapshot($owner, $field);
        if ($snapshot['sites'] === []) {
            return null;
        }
        $hash = $this->hash($snapshot);
        $existing = (new Query())->select(['id', 'reason'])->from(VizyTable::CONTENT_RECOVERY)
            ->where(['ownerId' => $owner->id, 'fieldUid' => $field->uid, 'snapshotHash' => $hash])->one();
        if ($existing) {
            // An explicit operation checkpoint must not remain classified as
            // automatic merely because the same state was captured earlier.
            // Automatic retention is allowed to delete only owner-save rows.
            if ($reason !== 'owner-save' && $existing['reason'] === 'owner-save') {
                Craft::$app->getDb()->createCommand()->update(VizyTable::CONTENT_RECOVERY, [
                    'reason' => $reason,
                ], ['id' => $existing['id']])->execute();
            }
            if ($reason === 'owner-save') {
                $this->pruneAutomatic(self::AUTOMATIC_RETENTION, (int)$owner->id);
            }
            return (int)$existing['id'];
        }
        Craft::$app->getDb()->createCommand()->upsert(VizyTable::CONTENT_RECOVERY, [
            'ownerId' => $owner->id,
            'fieldUid' => $field->uid,
            'placementUid' => $snapshot['placementUid'],
            'snapshotHash' => $hash,
            'snapshotJson' => Json::encode($snapshot),
            'reason' => $reason,
            'dateCreated' => gmdate('Y-m-d H:i:s'),
        ], false)->execute();
        $id = (int)(new Query())->select('id')->from(VizyTable::CONTENT_RECOVERY)
            ->where(['ownerId' => $owner->id, 'fieldUid' => $field->uid, 'snapshotHash' => $hash])->scalar();
        if ($reason === 'owner-save') {
            $this->pruneAutomatic(self::AUTOMATIC_RETENTION, (int)$owner->id);
        }
        return $id;
    }

    public function captureUpgrade(array $fieldUids): void
    {
        $seen = [];
        foreach (Craft::$app->getElements()->getAllElementTypes() as $type) {
            foreach ($type::find()->site('*')->unique(false)->status(null)->drafts(null)
                ->provisionalDrafts(null)->revisions(null)->trashed(null)->each(100) as $owner) {
                foreach ($owner->getFieldLayout()?->getCustomFields() ?? [] as $field) {
                    if (!$field instanceof VizyField || !in_array($field->uid, $fieldUids, true)) {
                        continue;
                    }
                    $key = $owner->id . ':' . FieldPlacements::uid($owner, $field);
                    if (!isset($seen[$key])) {
                        $this->capture($owner, $field, 'before-schema-upgrade');
                        $seen[$key] = true;
                    }
                }
            }
        }
    }

    /** Reads storage directly, including disabled rows, trash and every locale. */
    public function snapshot(ElementInterface $owner, VizyField $field, bool $lock = false): array
    {
        $placement = FieldPlacements::uid($owner, $field);
        $rootDocumentKey = AnchorDocuments::key($owner, $field);
        $sites = [];
        $references = [];
        $fallbackBlocks = [];
        foreach ($this->_rows(Table::ELEMENTS_SITES, ['elementId' => $owner->id], $lock) as $row) {
            $content = $this->_decode($row['content']);
            if ($placement === null || !array_key_exists($placement, $content)) {
                continue;
            }
            $value = $content[$placement];
            $sites[] = ['siteId' => (int)$row['siteId'], 'value' => $value];
            $this->_references($value, $references);
            if ($field->id) {
                $fieldId = (int)$field->id;
                $documentKey = $rootDocumentKey ?? '';
                $fallbackBlocks[$fieldId][$documentKey] ??= [];
                $this->_rootBlockUids($value, $fallbackBlocks[$fieldId][$documentKey]);
            }
            try {
                $document = Vizy::$plugin->getDocuments()->normalizeValue($value, $owner, $field);
                foreach (DocumentWalk::blocks($document) as $block) {
                    $fieldId = $block->document()->field()?->id;
                    if ($fieldId) {
                        $documentKey = $block->document()->anchorDocumentKey() ?? '';
                        $fallbackBlocks[(int)$fieldId][$documentKey][$block->uid()] = true;
                    }
                }
            } catch (Throwable) {
                // The exact source remains in `sites` and explicit anchor UIDs
                // remain usable. Root Block UIDs above are the safe legacy
                // fallback when the document cannot be fully normalized.
            }
        }
        $anchorConditions = ['or'];
        if ($references !== []) {
            $anchorConditions[] = ['e.uid' => array_keys($references)];
        }
        foreach ($fallbackBlocks as $fieldId => $documents) {
            foreach ($documents as $documentKey => $blockUids) {
                if ($blockUids === []) {
                    continue;
                }
                // Block UIDs are local to one placed Vizy document. Include the
                // unclaimed legacy key only as an upgrade fallback; a claimed
                // anchor must match this exact root/Hosted placement path.
                $anchorConditions[] = ['and',
                    ['a.parentOwnerId' => $owner->id],
                    ['a.vizyFieldId' => $fieldId],
                    ['a.documentKey' => array_values(array_unique([$documentKey, '']))],
                    ['a.blockInstanceId' => array_keys($blockUids)],
                ];
            }
        }
        $anchors = count($anchorConditions) === 1 ? [] : (new Query())->from(['a' => VizyTable::MATRIX_ANCHORS])
            ->innerJoin(['e' => Table::ELEMENTS], '[[a.id]] = [[e.id]]')
            ->select('a.id')->where($anchorConditions)->column();
        $ids = array_map('intval', $anchors);
        // Follow the real ownership graph, including Matrix inside Matrix and
        // Vizy inside nested entries. UID references alone are not the content.
        do {
            $before = $ids;
            if ($ids !== []) {
                $children = (new Query())->select('elementId')->from(Table::ELEMENTS_OWNERS)->where(['ownerId' => $ids])->column();
                $primary = (new Query())->select('id')->from(Table::ENTRIES)->where(['primaryOwnerId' => $ids])->column();
                $nestedAnchors = (new Query())->select('id')->from(VizyTable::MATRIX_ANCHORS)->where(['parentOwnerId' => $ids])->column();
                $ids = array_values(array_unique([...$ids, ...array_map('intval', [...$children, ...$primary, ...$nestedAnchors])]));
                sort($ids);
            }
        } while ($ids !== $before);
        $tables = [];
        foreach ([Table::ELEMENTS => 'id', Table::ELEMENTS_SITES => 'elementId', Table::ENTRIES => 'id', VizyTable::MATRIX_ANCHORS => 'id', Table::RELATIONS => 'sourceId'] as $table => $column) {
            $tables[$table] = $ids === [] ? [] : $this->_rows($table, [$column => $ids], $lock);
        }
        $tables[Table::ELEMENTS_OWNERS] = $ids === [] ? [] : $this->_rows(Table::ELEMENTS_OWNERS, ['or', ['ownerId' => $ids], ['elementId' => $ids]], $lock);
        foreach ([Table::DRAFTS => 'draftId', Table::REVISIONS => 'revisionId'] as $table => $column) {
            $derivativeIds = array_values(array_filter(array_column($tables[Table::ELEMENTS], $column)));
            $tables[$table] = $derivativeIds === [] ? [] : $this->_rows($table, ['id' => $derivativeIds], $lock);
        }
        $schema = [];
        foreach (array_unique(array_column($tables[Table::ENTRIES], 'typeId')) as $typeId) {
            $type = Craft::$app->getEntries()->getEntryTypeById((int)$typeId);
            $schema[$typeId] = $type ? ['uid' => $type->uid, 'layout' => $type->getFieldLayout()?->getConfig()] : null;
        }
        return [
            'version' => 1, 'ownerId' => (int)$owner->id, 'ownerUid' => $owner->uid,
            'ownerClass' => $owner::class, 'fieldUid' => $field->uid, 'placementUid' => $placement,
            'sites' => $sites, 'references' => array_keys($references), 'tables' => $tables, 'schema' => $schema,
        ];
    }

    public function hash(array $snapshot): string
    {
        return hash('sha256', Json::encode($snapshot));
    }

    /** Content comparison includes actual nested values, independently of row IDs. */
    public function contentHash(VizyDocument $document): string
    {
        $canonical = Json::decode(Vizy::$plugin->getDocuments()->serializeValue($document));
        $walk = function(array $nodes, VizyDocument $scope, string $path = 'content') use (&$walk): array {
            foreach ($nodes as $index => &$node) {
                if (($node['type'] ?? null) === 'vizyBlock') {
                    $block = $scope->blockFromNode($node, $path . '.' . $index);
                    $layout = $block->blockType()?->getFieldLayout();
                    foreach ($layout?->getCustomFieldElements() ?? [] as $placement) {
                        $field = $placement->getField();
                        if ($field instanceof Matrix) {
                            $element = $scope->blockElement($block);
                            $value = $block->hasRawFieldValue($placement->uid)
                                ? MatrixHelper::normalizeContent($field, $block->rawFieldValue($placement->uid), $element->getMatrixAnchor() ?? $element)
                                : $element->getFieldValue($field->handle);
                            $node['attrs']['fieldSlots'][$placement->uid] = $this->_comparableRows($field->serializeValue($value, $element));
                        } elseif ($field instanceof VizyField && isset($node['attrs']['fieldSlots'][$placement->uid])) {
                            $nested = Vizy::$plugin->getDocuments()->normalizeValue(
                                $node['attrs']['fieldSlots'][$placement->uid],
                                $scope->blockElement($block),
                                $field,
                            );
                            $nestedArray = $nested->toArray();
                            $nestedArray['content'] = $walk($nestedArray['content'], $nested);
                            $node['attrs']['fieldSlots'][$placement->uid] = $nestedArray;
                        }
                    }
                    unset($node['attrs']['matrixAnchorUid']);
                }
                if (isset($node['content']) && is_array($node['content'])) {
                    $node['content'] = $walk($node['content'], $scope, $path . '.' . $index . '.content');
                }
            }
            return $nodes;
        };
        $canonical['content'] = $walk($canonical['content'], $document);
        return hash('sha256', Json::encode($this->_stable($canonical)));
    }

    public function records(?int $ownerId = null): array
    {
        return (new Query())->select(['id', 'ownerId', 'fieldUid', 'placementUid', 'snapshotHash', 'reason', 'dateCreated'])
            ->from(VizyTable::CONTENT_RECOVERY)->filterWhere(['ownerId' => $ownerId])->orderBy(['id' => SORT_DESC])->all();
    }

    /**
     * Keep a bounded edit history per owner and field. Operation checkpoints
     * use distinct reasons and are deliberately never removed here.
     */
    public function pruneAutomatic(int $keep = self::AUTOMATIC_RETENTION, ?int $ownerId = null): int
    {
        if ($keep < 0) {
            throw new \InvalidArgumentException('Recovery retention cannot be negative.');
        }

        $counts = [];
        $deleted = 0;
        $beforeId = null;
        do {
            $query = (new Query())->select(['id', 'ownerId', 'fieldUid', 'placementUid'])
                ->from(VizyTable::CONTENT_RECOVERY)
                ->where(['reason' => 'owner-save'])
                ->andFilterWhere(['ownerId' => $ownerId]);
            if ($beforeId !== null) {
                $query->andWhere(['<', 'id', $beforeId]);
            }
            $rows = $query->orderBy(['id' => SORT_DESC])->limit(500)->all();
            $deleteIds = [];
            foreach ($rows as $row) {
                $beforeId = (int)$row['id'];
                $key = $row['ownerId'] . ':' . $row['fieldUid'] . ':' . ($row['placementUid'] ?? '');
                $counts[$key] = ($counts[$key] ?? 0) + 1;
                if ($counts[$key] > $keep) {
                    $deleteIds[] = (int)$row['id'];
                }
            }
            if ($deleteIds !== []) {
                $deleted += Craft::$app->getDb()->createCommand()
                    ->delete(VizyTable::CONTENT_RECOVERY, ['id' => $deleteIds])
                    ->execute();
            }
        } while (count($rows) === 500);

        return $deleted;
    }

    /** Restore only this field and its captured nested graph, in one transaction. */
    public function restore(int $id): void
    {
        $record = (new Query())->from(VizyTable::CONTENT_RECOVERY)->where(['id' => $id])->one();
        if (!$record) {
            throw new RuntimeException("Unknown Vizy recovery record {$id}.");
        }
        $snapshot = Json::decode($record['snapshotJson']);
        if (($snapshot['version'] ?? null) !== 1 || !hash_equals($record['snapshotHash'], $this->hash($snapshot))) {
            throw new RuntimeException('The recovery record is corrupt or uses an unsupported format.');
        }
        $owner = Craft::$app->getElements()->getElementById($snapshot['ownerId'], $snapshot['ownerClass'], $snapshot['sites'][0]['siteId']);
        $field = $owner ? FieldPlacements::field($owner, $snapshot['fieldUid'], $snapshot['placementUid']) : null;
        if (!$owner || $owner->uid !== $snapshot['ownerUid'] || !$field instanceof VizyField) {
            throw new RuntimeException('Restore the original owner and Vizy field placement before restoring its content.');
        }
        $transaction = Craft::$app->getDb()->beginTransaction();
        try {
            $this->_rows(Table::ELEMENTS, ['id' => $owner->id], true);
            $this->snapshot($owner, $field, true);
            // Keep the state being replaced, so restoration itself is reversible.
            $this->capture($owner, $field, 'before-restore');
            $this->_restoring = true;
            $tables = $snapshot['tables'];
            $ids = array_column($tables[Table::ELEMENTS], 'id');
            $this->_assertRestorable($snapshot, $ids);
            // Elements and their draft/revision metadata reference each other.
            // Recreate every element identity first with those links detached,
            // then restore the metadata and reconnect the captured graph.
            $elementLinks = [];
            foreach ($tables[Table::ELEMENTS] as $row) {
                $elementLinks[$row['id']] = array_intersect_key($row, array_flip([
                    'canonicalId',
                    'draftId',
                    'revisionId',
                    // MySQL may refresh this column on the reconnect update;
                    // restoration must retain the captured timestamp exactly.
                    'dateUpdated',
                ]));
                foreach (['canonicalId', 'draftId', 'revisionId'] as $column) {
                    if (array_key_exists($column, $row)) {
                        $row[$column] = null;
                    }
                }
                $this->_restoreRow(Table::ELEMENTS, $row);
            }
            foreach ([Table::DRAFTS, Table::REVISIONS] as $table) {
                foreach ($tables[$table] as $row) {
                    $this->_restoreRow($table, $row);
                }
            }
            foreach ($elementLinks as $elementId => $links) {
                Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS, $links, ['id' => $elementId])->execute();
            }
            foreach ([Table::ENTRIES, VizyTable::MATRIX_ANCHORS, Table::ELEMENTS_SITES] as $table) {
                foreach ($tables[$table] as $row) {
                    $this->_restoreRow($table, $row);
                }
            }
            // Replace only edges belonging to the captured graph. Newer rows
            // remain available in the before-restore journal, never globally purged.
            Craft::$app->getDb()->createCommand()->delete(Table::RELATIONS, ['sourceId' => $ids])->execute();
            Craft::$app->getDb()->createCommand()->delete(Table::ELEMENTS_OWNERS, ['or', ['ownerId' => $ids], ['elementId' => $ids]])->execute();
            foreach ([Table::ELEMENTS_OWNERS, Table::RELATIONS] as $table) {
                foreach ($tables[$table] as $row) {
                    Craft::$app->getDb()->createCommand()->insert($table, $row)->execute();
                }
            }
            // Read back every captured row before changing the active document.
            foreach ($tables as $table => $rows) {
                foreach ($rows as $row) {
                    $key = isset($row['id']) ? ['id' => $row['id']] : ['elementId' => $row['elementId'], 'ownerId' => $row['ownerId']];
                    // Recovery records are durable across additive schema
                    // migrations. Verify every captured value without making a
                    // historical snapshot invent columns that did not exist.
                    if ((new Query())->select(array_keys($row))->from($table)->where($key)->one() != $row) {
                        throw new RuntimeException("Recovery verification failed for {$table}.");
                    }
                }
            }
            foreach ($snapshot['sites'] as $site) {
                $where = ['elementId' => $owner->id, 'siteId' => $site['siteId']];
                $raw = (new Query())->select('content')->from(Table::ELEMENTS_SITES)->where($where)->scalar();
                if ($raw === false) {
                    throw new RuntimeException('A recovery site is missing. Restore the owner locale first.');
                }
                $content = $this->_decode($raw);
                $content[$snapshot['placementUid']] = $site['value'];
                Craft::$app->getDb()->createCommand()->update(Table::ELEMENTS_SITES, ['content' => $content], $where)->execute();
                $stored = $this->_decode((new Query())->select('content')->from(Table::ELEMENTS_SITES)->where($where)->scalar());
                if ($stored[$snapshot['placementUid']] !== $site['value']) {
                    throw new RuntimeException('The restored document did not match its recovery record.');
                }
            }
            $transaction->commit();
        } catch (Throwable $exception) {
            $transaction->rollBack();
            throw $exception;
        } finally {
            $this->_restoring = false;
        }
        Vizy::$plugin->getContentBaselines()->clear();
        Craft::$app->getElements()->invalidateCachesForElement($owner);
    }


    // Private Methods
    // =========================================================================

    private function _stable(mixed $value): mixed
    {
        if (!is_array($value)) {
            return $value;
        }
        if (!array_is_list($value)) {
            ksort($value);
        }
        return array_map($this->_stable(...), $value);
    }

    private function _restoreRow(string $table, array $values): void
    {
        foreach (Craft::$app->getDb()->getTableSchema($table)->columns as $column) {
            if ($column->type === 'json' && is_string($values[$column->name] ?? null)) {
                $values[$column->name] = Json::decode($values[$column->name]);
            }
        }
        $rowId = $values['id'] ?? null;
        if ($rowId === null) {
            throw new RuntimeException("Recovery row for {$table} has no primary identity.");
        }

        // Yii infers PostgreSQL UPSERT targets by combining every unique key.
        // On elements_sites that produces the invalid (id, elementId, siteId)
        // conflict target, so restore by captured primary identity explicitly.
        if ((new Query())->from($table)->where(['id' => $rowId])->exists()) {
            $updates = $values;
            unset($updates['id']);
            Craft::$app->getDb()->createCommand()->update($table, $updates, ['id' => $rowId])->execute();
        } else {
            Craft::$app->getDb()->createCommand()->insert($table, $values)->execute();
        }
    }

    private function _comparableRows(mixed $value): mixed
    {
        if (!is_array($value)) {
            return $value;
        }
        $rows = $value !== [];
        foreach ($value as $item) {
            if (!is_array($item) || !isset($item['type'], $item['fields'])) {
                $rows = false;
                break;
            }
        }
        return array_map($this->_comparableRows(...), $rows ? array_values($value) : $value);
    }

    private function _assertRestorable(array $snapshot, array $ids): void
    {
        foreach ($snapshot['schema'] ?? [] as $typeId => $expected) {
            $type = Craft::$app->getEntries()->getEntryTypeById((int)$typeId);
            $actual = $type ? ['uid' => $type->uid, 'layout' => $type->getFieldLayout()?->getConfig()] : null;
            if (!$actual || $actual !== $expected) {
                throw new RuntimeException('A nested entry type or field layout has changed. Restore its schema before restoring this content.');
            }
        }
        foreach ($snapshot['references'] as $uid) {
            if (!in_array($uid, array_column($snapshot['tables'][Table::ELEMENTS], 'uid'), true)) {
                throw new RuntimeException("Recovery record does not contain the referenced Matrix content {$uid}. Choose an earlier complete record.");
            }
        }
        foreach ($snapshot['tables'][Table::ELEMENTS] as $row) {
            $current = (new Query())->from(Table::ELEMENTS)->where(['id' => $row['id']])->one();
            if ($current && $current['uid'] !== $row['uid']) {
                throw new RuntimeException('An element identity has been reused; recovery refused to overwrite it.');
            }
        }
        $outside = (new Query())->from(Table::ELEMENTS_OWNERS)
            ->where(['elementId' => $ids])->andWhere(['not', ['ownerId' => $ids]])->exists();
        if ($outside) {
            throw new RuntimeException('Nested content is shared with another owner; resolve its ownership before restoring.');
        }
        foreach ($snapshot['tables'][VizyTable::MATRIX_ANCHORS] as $row) {
            $element = array_values(array_filter($snapshot['tables'][Table::ELEMENTS], static fn(array $e): bool => $e['id'] == $row['id']))[0];
            $anchor = new \verbb\vizy\elements\MatrixAnchor(['id' => $row['id'], 'uid' => $element['uid'], 'parentOwnerId' => $row['parentOwnerId']]);
            if (Vizy::$plugin->getAnchors()->hasExternalReferences($anchor)) {
                throw new RuntimeException('An anchor is referenced by another owner; resolve its ownership before restoring.');
            }
        }
        // A removed field, site, type or relation target must cause an atomic
        // failure, not a partial restoration that silently drops those values.
        foreach ($snapshot['tables'][Table::RELATIONS] as $row) {
            if (!in_array($row['targetId'], $ids) && !(new Query())->from(Table::ELEMENTS)->where(['id' => $row['targetId']])->exists()) {
                throw new RuntimeException('A related element is missing. Restore that element before restoring this content.');
            }
        }
    }

    private function _rows(string $table, array $where, bool $lock = false): array
    {
        $schema = Craft::$app->getDb()->getTableSchema($table);
        $query = (new Query())->from($table)->where($where)->orderBy(array_fill_keys($schema->primaryKey, SORT_ASC));
        $command = $query->createCommand();
        return $lock ? Craft::$app->getDb()->createCommand($command->getRawSql() . ' FOR UPDATE')->queryAll() : $command->queryAll();
    }

    private function _decode(mixed $value): array
    {
        if ($value === null || $value === '') {
            return [];
        }
        $decoded = is_string($value) ? Json::decode($value) : $value;
        if (!is_array($decoded)) {
            throw new RuntimeException('Stored owner content could not be decoded. No content has been replaced.');
        }
        return $decoded;
    }

    private function _references(mixed $value, array &$references): void
    {
        if (is_string($value) && (str_starts_with(ltrim($value), '[') || str_starts_with(ltrim($value), '{'))) {
            try {
                $value = Json::decode($value);
            } catch (\yii\base\InvalidArgumentException) {
                // Keep the exact malformed source in sites. The migration
                // parser reports the error; capturing it must still succeed.
                return;
            }
        }
        if (!is_array($value)) {
            return;
        }
        foreach ($value as $key => $child) {
            if ($key === 'matrixAnchorUid' && is_string($child) && $child !== '') {
                $references[$child] = true;
            }
            if (is_array($child)) {
                $this->_references($child, $references);
            }
        }
    }

    /** Root TipTap Blocks only; Hosted fieldSlots require schema-aware traversal. */
    private function _rootBlockUids(mixed $value, array &$blockUids): void
    {
        if (is_string($value) && (str_starts_with(ltrim($value), '[') || str_starts_with(ltrim($value), '{'))) {
            try {
                $value = Json::decode($value);
            } catch (\yii\base\InvalidArgumentException) {
                return;
            }
        }
        if (!is_array($value)) {
            return;
        }
        if (($value['type'] ?? null) === 'vizyBlock') {
            $uid = $value['attrs']['blockUid'] ?? $value['attrs']['id'] ?? null;
            if (is_string($uid) && $uid !== '') {
                $blockUids[$uid] = true;
            }
            return;
        }
        foreach ($value['content'] ?? $value as $child) {
            if (is_array($child)) {
                $this->_rootBlockUids($child, $blockUids);
            }
        }
    }
}
