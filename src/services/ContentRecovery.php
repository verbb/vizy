<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\db\Table as VizyTable;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
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
        $existing = (new Query())->select('id')->from(VizyTable::CONTENT_RECOVERY)
            ->where(['ownerId' => $owner->id, 'fieldUid' => $field->uid, 'snapshotHash' => $hash])->scalar();
        if ($existing !== false) {
            return (int)$existing;
        }
        Craft::$app->getDb()->createCommand()->upsert(VizyTable::CONTENT_RECOVERY, [
            'ownerId' => $owner->id,
            'fieldUid' => $field->uid,
            'snapshotHash' => $hash,
            'snapshotJson' => Json::encode($snapshot),
            'reason' => $reason,
            'dateCreated' => gmdate('Y-m-d H:i:s'),
        ], false)->execute();
        return (int)(new Query())->select('id')->from(VizyTable::CONTENT_RECOVERY)
            ->where(['ownerId' => $owner->id, 'fieldUid' => $field->uid, 'snapshotHash' => $hash])->scalar();
    }

    /** Reads storage directly, including disabled rows, trash and every locale. */
    public function snapshot(ElementInterface $owner, VizyField $field, bool $lock = false): array
    {
        $placement = FieldPlacements::uid($owner, $field);
        $sites = [];
        $references = [];
        $blockUids = [];
        foreach ($this->_rows(Table::ELEMENTS_SITES, ['elementId' => $owner->id], $lock) as $row) {
            $content = $this->_decode($row['content']);
            if ($placement === null || !array_key_exists($placement, $content)) {
                continue;
            }
            $sites[] = ['siteId' => (int)$row['siteId'], 'value' => $content[$placement]];
            $this->_references($content[$placement], $references, $blockUids);
        }
        $anchors = $references === [] && $blockUids === [] ? [] : (new Query())->from(['a' => VizyTable::MATRIX_ANCHORS])
            ->innerJoin(['e' => Table::ELEMENTS], '[[a.id]] = [[e.id]]')
            ->select('a.id')->where(['or', ['e.uid' => array_keys($references)], [
                'a.parentOwnerId' => $owner->id, 'a.blockInstanceId' => array_keys($blockUids),
            ]])->column();
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
        return [
            'version' => 1, 'ownerId' => (int)$owner->id, 'ownerUid' => $owner->uid,
            'ownerClass' => $owner::class, 'fieldUid' => $field->uid, 'placementUid' => $placement,
            'sites' => $sites, 'references' => array_keys($references), 'tables' => $tables,
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
                            $nested = Vizy::$plugin->getDocuments()->normalizeValue($node['attrs']['fieldSlots'][$placement->uid], $scope->owner(), $field);
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
        return (new Query())->select(['id', 'ownerId', 'fieldUid', 'snapshotHash', 'reason', 'dateCreated'])
            ->from(VizyTable::CONTENT_RECOVERY)->filterWhere(['ownerId' => $ownerId])->orderBy(['id' => SORT_DESC])->all();
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
            // Keep the state being replaced, so restoration itself is reversible.
            $this->capture($owner, $field, 'before-restore');
            $this->_restoring = true;
            $tables = $snapshot['tables'];
            $ids = array_column($tables[Table::ELEMENTS], 'id');
            $this->_assertRestorable($snapshot, $ids);
            foreach ([Table::DRAFTS, Table::REVISIONS, Table::ELEMENTS, Table::ENTRIES, VizyTable::MATRIX_ANCHORS, Table::ELEMENTS_SITES] as $table) {
                foreach ($tables[$table] as $row) {
                    $values = $row;
                    foreach (Craft::$app->getDb()->getTableSchema($table)->columns as $column) {
                        if ($column->type === 'json' && is_string($values[$column->name] ?? null)) {
                            $values[$column->name] = Json::decode($values[$column->name]);
                        }
                    }
                    Craft::$app->getDb()->createCommand()->upsert($table, $values, true, [], false)->execute();
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
                    if ((new Query())->from($table)->where($key)->one() != $row) {
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
            Vizy::$plugin->getContentBaselines()->clear();
            Craft::$app->getElements()->invalidateCachesForElement($owner);
        } catch (Throwable $exception) {
            $transaction->rollBack();
            throw $exception;
        } finally {
            $this->_restoring = false;
        }
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

    private function _references(mixed $value, array &$references, array &$blockUids): void
    {
        if (is_string($value) && str_starts_with(ltrim($value), '[')) {
            $value = Json::decode($value);
        } elseif (is_string($value) && str_starts_with(ltrim($value), '{')) {
            $value = Json::decode($value);
        }
        if (!is_array($value)) {
            return;
        }
        foreach ($value as $key => $child) {
            if ($key === 'matrixAnchorUid' && is_string($child) && $child !== '') {
                $references[$child] = true;
            }
            if (($value['type'] ?? null) === 'vizyBlock') {
                $uid = $value['attrs']['blockUid'] ?? $value['attrs']['id'] ?? null;
                if (is_string($uid)) {
                    $blockUids[$uid] = true;
                }
            }
            if (is_array($child)) {
                $this->_references($child, $references, $blockUids);
            }
        }
    }
}
