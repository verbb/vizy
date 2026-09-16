<?php
namespace verbb\vizy\content;

use Craft;
use craft\db\Query;

use yii\db\Connection;
use yii\db\Expression;

use InvalidArgumentException;
use RuntimeException;

/**
 * Raw field migration coordinator. Container adapters own their storage grammar.
 * Protocol version 1 uses arrays so independently installed plugins can compose.
 */
final class RawContent
{
    // Properties
    // =========================================================================

    private array $adapters;
    private bool $invalidationScheduled = false;


    // Public Methods
    // =========================================================================

    public function __construct()
    {
        $this->adapters = [];
        foreach (['vizy', 'hyper'] as $handle) {
            $plugin = Craft::$app->getPlugins()->getPlugin($handle);
            $service = $plugin?->getContent();
            if ($service && method_exists($service, 'getRawContentAdapter')) {
                $adapter = $service->getRawContentAdapter();
                $this->registerAdapter($adapter->fieldClass(), $adapter);
            }
        }
    }

    /** Adapters implement fieldClass(), captureSchema($field), and transform($value, $schema, $visit). */
    public function registerAdapter(string $fieldClass, object $adapter): void
    {
        $this->adapters[$fieldClass] = $adapter;
    }

    /** Capture before changing configuration; the returned array is JSON-serialisable. */
    public function captureFieldLocations(string $fieldUid): array
    {
        if ($fieldUid === '') throw new InvalidArgumentException('A source field UID is required.');
        $schemas = [];
        foreach (Craft::$app->getFields()->getAllFields(false) as $field) {
            foreach ($this->adapters as $class => $adapter) {
                if ($field instanceof $class) {
                    $schemas[$field->uid] = ['adapter' => $class, 'schema' => $adapter->captureSchema($field)];
                    break;
                }
            }
        }
        // Limit traversal to containers that can reach this target. A field's
        // own legacy value must not be interpreted while rebuilding its index.
        $reachable = [];
        do {
            $count = count($reachable);
            foreach ($schemas as $uid => $definition) {
                foreach ($definition['schema']['types'] as $placements) {
                    foreach ($placements as $placement) {
                        if ($placement['fieldUid'] === $fieldUid || isset($reachable[$placement['fieldUid']])) {
                            $reachable[$uid] = true;
                        }
                    }
                }
            }
        } while (count($reachable) !== $count);
        $schemas = array_intersect_key($schemas, $reachable);
        $roots = [];
        foreach (Craft::$app->getFields()->getAllLayouts() as $layout) {
            foreach ($layout->getCustomFieldElements() as $placement) {
                $uid = $placement->getFieldUid();
                if (isset($schemas[$uid])) {
                    $roots[$placement->uid] = ['fieldUid' => $uid, 'layoutUid' => $layout->uid];
                }
            }
        }
        return ['version' => 1, 'fieldUid' => $fieldUid, 'roots' => $roots, 'schemas' => $schemas];
    }

    /** Transform an unsaved container value. Context describes its containing owner, never a synthetic element. */
    public function transformValue(mixed $value, string $containerFieldUid, array $map, callable $transform, array $context = []): array
    {
        $this->_validateMap($map);
        $stats = ['matched' => 0, 'changed' => 0];
        $context += ['elementId' => null, 'siteId' => null, 'rowId' => null, 'path' => [], 'hasDurableOwner' => false];
        $value = $this->_transform($value, $containerFieldUid, $map, $transform, $context, $stats, 0);
        RawJson::encode($value);
        return ['value' => $value] + $stats;
    }

    /** Write mode requires the caller's transaction; inspection never writes. */
    public function modifyFieldValues(array $map, callable $transform, array $options = []): array
    {
        $this->_validateMap($map);
        $db = $options['db'] ?? Craft::$app->getDb();
        $dryRun = $options['dryRun'] ?? false;
        if (!$db instanceof Connection || (!$dryRun && !$db->getTransaction()?->getIsActive())) {
            throw new RuntimeException('Raw content writes require an active transaction on the supplied database connection.');
        }
        $batchSize = $options['batchSize'] ?? 100;
        if (!is_int($batchSize) || $batchSize < 1 || $batchSize > 1000) {
            throw new InvalidArgumentException('batchSize must be between 1 and 1000.');
        }
        $result = ['rows' => 0, 'matched' => 0, 'wouldModify' => 0, 'modified' => 0, 'lastRowId' => 0];
        if ($map['roots'] === []) {
            return $result;
        }
        $after = $options['afterRowId'] ?? 0;
        while (true) {
            $query = (new Query())->select(['s.id', 's.elementId', 's.siteId', 's.content', 'e.type', 'e.enabled', 'e.dateDeleted', 'e.draftId', 'e.revisionId'])
                ->from(['s' => '{{%elements_sites}}'])->innerJoin(['e' => '{{%elements}}'], '[[e.id]] = [[s.elementId]]')
                ->where(['>', 's.id', $after])->andWhere(['not', ['s.content' => null]])->orderBy(['s.id' => SORT_ASC])->limit($batchSize);
            foreach (['elementIds' => 's.elementId', 'siteIds' => 's.siteId'] as $option => $column) {
                if (array_key_exists($option, $options) && $options[$option] !== null) {
                    $query->andWhere([$column => $options[$option]]);
                }
            }
            foreach (['includeDrafts' => 'e.draftId', 'includeRevisions' => 'e.revisionId', 'includeTrashed' => 'e.dateDeleted'] as $option => $column) {
                if (($options[$option] ?? true) === false) {
                    $query->andWhere([$column => null]);
                }
            }
            if (($options['includeDisabled'] ?? true) === false) {
                $query->andWhere(['e.enabled' => true, 's.enabled' => true]);
            }
            $rows = $query->all($db);
            if (!$rows) {
                break;
            }
            foreach ($rows as $row) {
                $after = (int)$row['id'];
                $result['lastRowId'] = $after;
                $content = is_string($row['content']) ? RawJson::decode($row['content']) : $row['content'];
                if ($content instanceof \stdClass) {
                    $content = (array)$content;
                }
                if (!is_array($content)) {
                    throw new RuntimeException("Malformed element content at row {$after}.");
                }
                $before = $content;
                foreach ($map['roots'] as $placementUid => $root) {
                    if (!array_key_exists($placementUid, $content)) {
                        continue;
                    }
                    $context = ['rowId' => $after, 'elementId' => (int)$row['elementId'], 'siteId' => (int)$row['siteId'],
                        'elementType' => $row['type'], 'enabled' => (bool)$row['enabled'], 'trashed' => $row['dateDeleted'] !== null,
                        'draftId' => $row['draftId'], 'revisionId' => $row['revisionId'], 'rootFieldUid' => $root['fieldUid'],
                        'rootPlacementUid' => $placementUid, 'rootLayoutUid' => $root['layoutUid'], 'path' => [$placementUid], 'hasDurableOwner' => false];
                    $change = $this->transformValue($content[$placementUid], $root['fieldUid'], $map, $transform, $context);
                    $content[$placementUid] = $change['value'];
                    $result['matched'] += $change['matched'];
                    $result['wouldModify'] += $change['changed'];
                }
                if (RawJson::same($before, $content)) {
                    continue;
                }
                $result['rows']++;
                if ($dryRun) {
                    continue;
                }
                // Lock and compare after transformation, before updating the entire row.
                $current = $db->createCommand('SELECT [[content]] FROM {{%elements_sites}} WHERE [[id]] = :id FOR UPDATE', [':id' => $after])->queryScalar();
                $current = is_string($current) ? RawJson::decode($current) : $current;
                if (!RawJson::same($current, $before)) {
                    throw new RuntimeException("Content changed concurrently at row {$after}.");
                }
                $db->createCommand()->update('{{%elements_sites}}', ['content' => new Expression(':rawContent', [':rawContent' => RawJson::encode(is_string($row['content']) ? RawJson::preserve($row['content'], $content) : $content)])], ['id' => $after])->execute();
                $result['modified']++;
                $this->invalidateAfterCommit($db);
            }
        }
        return $result;
    }


    /** @internal Called by content writers only after a successful database update. */
    public function invalidateAfterCommit(Connection $db): void
    {
        if (!$db->getTransaction()?->getIsActive()) throw new RuntimeException('Cache invalidation requires the writer transaction.');
        if ($this->invalidationScheduled) {
            return;
        }
        $this->invalidationScheduled = true;
        $commit = $rollback = null;
        $cleanup = function() use ($db, &$commit, &$rollback): void {
            $db->off(Connection::EVENT_COMMIT_TRANSACTION, $commit);
            $db->off(Connection::EVENT_ROLLBACK_TRANSACTION, $rollback);
            $this->invalidationScheduled = false;
        };
        $commit = function() use ($cleanup): void {
            $cleanup();
            Craft::$app->getElements()->invalidateAllCaches();
        };
        $rollback = function() use ($cleanup): void { $cleanup(); };
        $db->on(Connection::EVENT_COMMIT_TRANSACTION, $commit);
        $db->on(Connection::EVENT_ROLLBACK_TRANSACTION, $rollback);
    }


    // Private Methods
    // =========================================================================

    private function _validateMap(array $map): void
    {
        if (($map['version'] ?? null) !== 1 || !is_string($map['fieldUid'] ?? null) || !is_array($map['schemas'] ?? null) || !is_array($map['roots'] ?? null)) {
            throw new InvalidArgumentException('Unsupported or incomplete raw content location map.');
        }
    }

    private function _transform(mixed $value, string $fieldUid, array $map, callable $transform, array $context, array &$stats, int $depth): mixed
    {
        if ($depth > 64) {
            throw new RuntimeException('Embedded content exceeds the migration traversal depth limit.');
        }
        $definition = $map['schemas'][$fieldUid] ?? null;
        if (!$definition) {
            return $value;
        }
        $adapter = $this->adapters[$definition['adapter']] ?? null;
        if (!$adapter) {
            throw new RuntimeException('Required raw content adapter is unavailable: ' . $definition['adapter']);
        }
        return $adapter->transform($value, $definition['schema'], function(mixed $raw, array $placement, array $segment) use ($fieldUid, $map, $transform, $context, &$stats, $depth): array {
            $segment += ['containerFieldUid' => $fieldUid, 'fieldUid' => $placement['fieldUid'], 'layoutUid' => $placement['layoutUid']];
            $childContext = array_replace($context, ['containerFieldUid' => $fieldUid, 'fieldUid' => $placement['fieldUid'],
                'placementUid' => $placement['placementUid'], 'layoutUid' => $placement['layoutUid'],
                'path' => [...$context['path'], $segment], 'hasDurableOwner' => false]);
            $nested = $raw;
            if ($placement['fieldUid'] !== $map['fieldUid']) {
                $nested = $this->_transform($raw, $placement['fieldUid'], $map, $transform, $childContext, $stats, $depth + 1);
                return ['action' => 'replace', 'value' => $nested];
            }
            $stats['matched']++;
            $change = $transform($nested, $childContext);
            if (!is_array($change) || !in_array($change['action'] ?? null, ['unchanged', 'replace', 'remove'], true)
                || ($change['action'] === 'replace' && !array_key_exists('value', $change))) {
                throw new InvalidArgumentException('Return Change::unchanged(), Change::replace($value), or Change::remove().');
            }
            if ($change['action'] === 'unchanged') {
                return ['action' => 'replace', 'value' => $nested];
            }
            if ($change['action'] === 'remove' || !RawJson::same($change['value'], $nested)) {
                $stats['changed']++;
            }
            return $change;
        });
    }
}
