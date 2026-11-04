<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\records\SchemaPromotion;

use Craft;
use craft\base\Component;
use craft\db\Query;
use craft\elements\Entry;
use craft\fields\Matrix;
use craft\helpers\Json;

use RuntimeException;
use Throwable;

/**
 * Read-only support snapshots. Default reports allowlist metadata rather than
 * trying to redact arbitrary content, exception messages or extension options.
 */
final class Diagnostics extends Component
{
    // Constants
    // =========================================================================

    public const MAX_REPORT_BYTES = 2097152;
    private const MAX_DOCUMENTS = 100;
    private const MAX_NODES = 20000;


    // Properties
    // =========================================================================

    private array $_documents = [];
    private array $_visited = [];
    private int $_nodes = 0;


    // Public Methods
    // =========================================================================

    public function collectDocuments(Entry $entry): array
    {
        $this->_documents = [];
        $this->_visited = [];
        $this->_nodes = 0;
        $this->_collectEntry($entry, 'entry:' . $entry->id, '', 0);

        return $this->_documents;
    }

    public function createReport(array $selection, bool $includeContent = false): array
    {
        $field = $selection['field'];
        $configId = $field->editorConfig ?: EditorConfigs::DEFAULT_ID;
        $report = [
            'format' => 'vizy-diagnostics',
            'formatVersion' => 1,
            'generatedAt' => gmdate('c'),
            'includesContent' => $includeContent,
            'environment' => [
                'craft' => Craft::$app->getVersion(),
                'vizy' => Vizy::$plugin->getVersion(),
                'vizySchema' => Vizy::$plugin->schemaVersion,
                'php' => PHP_VERSION,
            ],
            'scope' => [
                'entryId' => $selection['entryId'],
                'siteId' => $selection['siteId'],
                'path' => $selection['path'],
                'fieldUid' => $field->uid,
                'fieldHandle' => $field->handle,
                'placementUid' => $selection['placementUid'],
                'savedContentOnly' => true,
            ],
            'browser' => ['captured' => false],
            'errors' => [],
        ];
        $configs = Vizy::$plugin->getEditorConfigs();
        $config = null;
        $manifest = null;

        try {
            $config = $configs->getConfig($configId);
            $report['editorConfig'] = [
                'id' => $configId,
                'source' => $config['source'] ?? 'missing',
                'configured' => $config === null ? null : $this->_configSummary($config),
            ];
        } catch (Throwable $exception) {
            $report['editorConfig'] = ['id' => $configId, 'source' => 'unavailable'];
            $report['errors'][] = $this->_error('editorConfigUnavailable', $exception);
        }

        try {
            // Use the normal compiler, including runtime config events. Never export
            // the whole manifest: it can contain custom HTML, URLs and field values.
            $manifest = Vizy::$plugin->getEditorManifests()->build($field);
            $report['editorConfig']['effective'] = [
                'nodes' => $this->_identifiers($manifest['enabledNodes']),
                'marks' => $this->_identifiers($manifest['enabledMarks']),
                'extensions' => $this->_identifiers($manifest['enabledExtensions']),
                'modules' => $this->_identifiers($manifest['modules']),
                'headingLevels' => $manifest['headingLevels'],
            ];
        } catch (Throwable $exception) {
            $report['errors'][] = $this->_error('editorManifestUnavailable', $exception);
        }

        $raw = $selection['raw'];
        $normalized = null;

        try {
            $report['stored'] = $this->_inventory($this->_decode($raw), $manifest);
        } catch (Throwable $exception) {
            $report['errors'][] = $this->_error('storedDocumentUnreadable', $exception);
        }

        try {
            // Detached normalization avoids an owner save lifecycle, including for
            // Hosted Vizy. Legacy schema maps still permit an in-memory comparison.
            $normalized = Vizy::$plugin->getDocuments()->normalizeDetached($raw, $field->getLegacySchemaMap())->toArray();
            $report['normalized'] = $this->_inventory($normalized, $manifest);
        } catch (Throwable $exception) {
            $report['errors'][] = $this->_error('documentNormalizationFailed', $exception);
        }

        try {
            $report['upgrades'] = $this->_upgrades($field, $configId);
        } catch (Throwable $exception) {
            $report['errors'][] = $this->_error('upgradeHistoryUnavailable', $exception);
        }

        if ($includeContent) {
            // Only the selected value is included, never the entire entry content
            // row. A Vizy value can itself contain embedded fields and nested content.
            $report['content'] = [
                'storedValue' => $raw,
                'normalizedDocument' => $normalized,
                'editorConfig' => $config === null ? null : $configs->authorablePayload($config),
            ];
        }

        return $report;
    }

    public function encodeReport(array $report): string
    {
        $json = Json::encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if (strlen($json) > self::MAX_REPORT_BYTES) {
            throw new RuntimeException('The report is too large. Choose a nested field or preview without content.');
        }

        return $json;
    }


    // Private Methods
    // =========================================================================

    private function _collectEntry(Entry $entry, string $path, string $label, int $depth): void
    {
        if ($depth > 8 || count($this->_visited) >= 100) {
            throw new RuntimeException('This entry has too many nested entries. Open diagnostics for a nested entry instead.');
        }

        if (isset($this->_visited[$entry->id])) {
            return;
        }

        $this->_visited[$entry->id] = true;
        $row = (new Query())->select('content')->from('{{%elements_sites}}')
            ->where(['elementId' => $entry->id, 'siteId' => $entry->siteId])->scalar();
        $content = $this->_decode($row ?: null) ?? [];

        if (!is_array($content)) {
            throw new RuntimeException('Entry content is not an object.');
        }

        foreach ($entry->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
            $field = $placement->getField();
            $fieldPath = $path . '/field:' . $placement->uid;
            $fieldLabel = $label . $field->name;

            if ($field instanceof VizyField) {
                $this->_addDocument($field, $content[$placement->uid] ?? null, $entry, $placement->uid, $fieldPath, $fieldLabel, $depth);
            } elseif ($field instanceof Matrix) {
                // Ask Matrix for persisted ownership, rather than scanning unrelated
                // entry rows or interpreting arbitrary embedded field JSON.
                $query = $field->normalizeValue(null, $entry);

                foreach ($query->status(null)->limit(101)->all() as $child) {
                    $this->_collectEntry($child, $fieldPath . '/entry:' . $child->id, $fieldLabel . ' / #' . $child->id . ' / ', $depth + 1);
                }
            }
        }
    }

    private function _addDocument(VizyField $field, mixed $raw, Entry $entry, string $placementUid, string $path, string $label, int $depth): void
    {
        if (count($this->_documents) >= self::MAX_DOCUMENTS || $depth > 64) {
            throw new RuntimeException('This entry has too many Vizy fields. Open diagnostics for a nested entry instead.');
        }

        $key = hash('sha256', $path);
        $this->_documents[$key] = compact('field', 'raw', 'placementUid', 'path', 'label') + ['entryId' => $entry->id, 'siteId' => $entry->siteId];

        try {
            $decoded = $this->_decode($raw);
        } catch (Throwable) {
            // A malformed value must remain selectable so support can inspect it.
            return;
        }

        $this->_collectHosted($decoded, $entry, $path, $label, $depth);
    }

    private function _collectHosted(mixed $node, Entry $entry, string $path, string $label, int $depth, int $position = 1): void
    {
        if (!is_array($node)) {
            return;
        }

        if (++$this->_nodes > self::MAX_NODES || $depth > 64) {
            throw new RuntimeException('This entry is too large to inspect here. Open diagnostics for a nested entry instead.');
        }

        if (($node['type'] ?? null) === 'vizyBlock') {
            $typeUid = $node['attrs']['blockTypeUid'] ?? null;
            $type = is_string($typeUid) ? Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($typeUid) : null;

            foreach ($type?->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
                $field = $placement->getField();

                if ($field instanceof VizyField) {
                    $this->_addDocument(
                        $field,
                        $node['attrs']['fieldSlots'][$placement->uid] ?? null,
                        $entry,
                        $placement->uid,
                        $path . '/field:' . $placement->uid,
                        $label . ' / ' . $type->name . ' #' . $position . ' / ' . $field->name,
                        $depth + 1
                    );
                }
            }
        }

        $children = $node['content'] ?? (array_is_list($node) ? $node : []);

        foreach (is_array($children) ? array_values($children) : [] as $index => $child) {
            $this->_collectHosted($child, $entry, $path . '/content:' . $index, $label, $depth + 1, $index + 1);
        }
    }

    private function _decode(mixed $raw): mixed
    {
        if (!is_string($raw)) {
            return $raw;
        }

        if (strlen($raw) > 8388608) {
            throw new RuntimeException('Stored content exceeds the diagnostics limit.');
        }

        return $raw === '' ? null : Json::decode($raw);
    }

    private function _configSummary(array $config): array
    {
        return [
            'nodes' => $this->_identifiers($config['capabilities']['nodes'] ?? []),
            'marks' => $this->_identifiers($config['capabilities']['marks'] ?? []),
            'extensions' => $this->_identifiers($config['capabilities']['extensions'] ?? []),
            'toolbar' => $this->_identifiers($config['toolbar'] ?? []),
            'headingLevels' => $config['headings']['levels'] ?? [],
            // Values such as placeholder copy and custom URLs are deliberately omitted.
            'extensionOptionNames' => $this->_identifiers(array_keys($config['extensionOptions'] ?? [])),
        ];
    }

    private function _inventory(mixed $document, ?array $manifest): array
    {
        $types = [];
        $count = 0;
        $visit = function(mixed $node, string $path, int $depth) use (&$visit, &$types, &$count, $manifest): void {
            if (!is_array($node)) {
                return;
            }

            if (++$count > self::MAX_NODES || $depth > 64) {
                throw new RuntimeException('Document exceeds the diagnostics limit.');
            }

            foreach (['node' => [$node], 'mark' => is_array($node['marks'] ?? null) ? $node['marks'] : []] as $kind => $items) {
                foreach ($items as $item) {
                    if (!is_array($item) || !is_string($item['type'] ?? null)) {
                        continue;
                    }

                    $name = $this->_identifiers([$item['type']])[0];
                    $key = $kind . ':' . $name;

                    if (!isset($types[$key])) {
                        $types[$key] = [
                            'kind' => $kind, 'type' => $name, 'count' => 0, 'paths' => [],
                            'registered' => Vizy::$plugin->getExtensions()->getDefinition($kind, $name) !== null,
                            'enabled' => $manifest === null ? null : in_array($name, $kind === 'mark'
                                ? $manifest['enabledMarks'] : [...$manifest['enabledNodes'], ...$manifest['internalNodes']], true),
                        ];
                    }

                    $types[$key]['count']++;

                    if (count($types[$key]['paths']) < 5) {
                        $types[$key]['paths'][] = $path;
                    }
                }
            }

            $children = $node['content'] ?? (array_is_list($node) ? $node : []);

            foreach (is_array($children) ? array_values($children) : [] as $index => $child) {
                $visit($child, $path . '.content.' . $index, $depth + 1);
            }
        };
        $visit($document, '$', 0);
        ksort($types);

        return ['types' => array_values($types)];
    }

    private function _upgrades(VizyField $field, string $configId): array
    {
        $runs = [];

        foreach (SchemaPromotion::find()->orderBy(['id' => SORT_DESC])->each() as $promotion) {
            $plan = Json::decode($promotion->planJson);
            $fieldPlan = $plan['fields'][$field->uid] ?? null;

            if (!is_array($fieldPlan)) {
                continue;
            }

            $runs[] = [
                'status' => $this->_identifiers([$promotion->status])[0],
                'stage' => $this->_identifiers([$promotion->stage])[0],
                'selectedConfigMatches' => (($fieldPlan['canonicalFieldSettings']['editorConfig'] ?? '') ?: EditorConfigs::DEFAULT_ID) === $configId,
                'manualConfigImported' => isset($fieldPlan['editorConfigFingerprint']),
            ];

            if (count($runs) >= 5) {
                break;
            }
        }

        return $runs;
    }

    private function _identifiers(array $values): array
    {
        return array_values(array_map(static fn(mixed $value): string => is_string($value)
            && preg_match('/^[a-zA-Z0-9_:\/.-]{1,160}$/D', $value) ? $value : '[invalid identifier]', $values));
    }

    private function _error(string $code, Throwable $exception): array
    {
        return ['code' => $code, 'exception' => get_class($exception)];
    }
}
