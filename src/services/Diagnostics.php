<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\fields\VizyField;
use verbb\vizy\records\SchemaPromotion;

use Craft;
use craft\base\Component;
use craft\base\ElementInterface;
use craft\db\Query;
use craft\fields\Matrix;
use craft\helpers\Json;

use RuntimeException;
use Throwable;

/**
 * Read-only support snapshots. Metadata is allowlisted rather than redacting
 * arbitrary content, exception messages or extension options. Content is added
 * as its own section, so unticking it at review removes all of it.
 */
final class Diagnostics extends Component
{
    // Constants
    // =========================================================================

    public const MAX_REPORT_BYTES = 2097152;
    // Longer reports don't fit in a GitHub comment, so download becomes the main action.
    public const MAX_PASTE_CHARACTERS = 60000;
    private const MAX_DOCUMENTS = 100;
    private const MAX_NODES = 20000;
    private const MAX_PREVIEW_PARAGRAPHS = 40;


    // Properties
    // =========================================================================

    private array $_documents = [];
    private array $_visited = [];
    private array $_upgrades = [];
    private bool $_truncated = false;
    private int $_nodes = 0;


    // Public Methods
    // =========================================================================

    public function collectDocuments(ElementInterface $element): array
    {
        $this->_documents = [];
        $this->_visited = [];
        $this->_nodes = 0;
        $this->_collectElement($element, 'entry:' . $element->id, '', '', 0);

        return $this->_documents;
    }

    /** Matches the page's description of the focused editor to a stored document. */
    public function findTarget(array $documents, ?string $trail): ?string
    {
        if ($trail === null) {
            return null;
        }

        foreach ($documents as $key => $document) {
            if ($document['trail'] === $trail) {
                return $key;
            }
        }

        return null;
    }

    public function pageSummary(ElementInterface $element, ?array $target, bool $savedVersionOnly): array
    {
        return [
            'elementType' => $element::class,
            'id' => $element->id,
            'canonicalId' => $element->getCanonicalId(),
            'siteId' => $element->siteId,
            'isDraft' => $element->getIsDraft(),
            'lastFocusedField' => $target ? $target['field']->handle : null,
            'savedVersionOnly' => $savedVersionOnly,
        ];
    }

    /**
     * Metadata covers every Vizy field on the page. Content comes from the field
     * they last worked in, or all of them when that isn't known.
     */
    public function createReport(array $documents, ?string $target = null, bool $includeContent = false, bool $includeEditorConfig = false, ?array $page = null, ?array $browser = null): array
    {
        $report = [
            'format' => 'vizy-support-report',
            'formatVersion' => 2,
            'generatedAt' => gmdate('c'),
            'includesContent' => false,
            'environment' => [
                'craft' => Craft::$app->getVersion(),
                'vizy' => Vizy::$plugin->getVersion(),
                'vizySchema' => Vizy::$plugin->schemaVersion,
                'php' => PHP_VERSION,
            ],
            'page' => $page,
            'fields' => [],
            'fieldsTruncated' => $this->_truncated,
            'browser' => $browser ?? ['captured' => false],
            'errors' => [],
        ];

        foreach ($documents as $key => $document) {
            $includeThis = $includeContent && ($target === null || $target === $key);
            $result = $this->_documentReport($document, $includeThis, $includeEditorConfig);
            $report['fields'][] = $result['field'];
            $report['errors'] = [...$report['errors'], ...$result['errors']];

            if ($result['content'] !== null) {
                $report['includesContent'] = true;
                $report['content'][] = $result['content'];
            }
        }

        // Error messages can quote authored text, so they count as content.
        if (BrowserDiagnostics::hasDetails($browser)) {
            $report['includesContent'] = true;
        }

        return $report;
    }

    public function encodeReport(array $report): string
    {
        $json = Json::encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if (strlen($json) > self::MAX_REPORT_BYTES) {
            throw new RuntimeException('The report is too large.');
        }

        return $json;
    }

    /** Plain-language findings and contents for the customer's review. */
    public function review(array $report, array $documents, bool $pageUnavailable = false, bool $contentTooLarge = false, bool $collectionFailed = false): array
    {
        $labels = [];

        foreach ($documents as $document) {
            $labels[$document['path']] = $document['label'];
        }

        $events = $this->_events($report['browser']['events'] ?? []);

        return [
            'findings' => $this->_findings($report, $labels, $pageUnavailable, $collectionFailed, $events),
            'setup' => array_map(fn(array $field) => [
                'label' => $labels[$field['path']] ?? $field['fieldHandle'],
                'config' => $field['editorConfig']['id'] ?? '',
                'turnedOn' => [...($field['editorConfig']['effective']['nodes'] ?? []), ...($field['editorConfig']['effective']['marks'] ?? [])],
            ], $report['fields']),
            'counts' => array_map(fn(array $field) => [
                'label' => $labels[$field['path']] ?? $field['fieldHandle'],
                'types' => array_map(static fn(array $type) => ['type' => $type['type'], 'count' => $type['count']], $field['stored']['types'] ?? []),
            ], $report['fields']),
            'events' => $events,
            'captured' => $report['browser']['captured'] ?? false,
            'contentLabels' => array_map(static fn(array $content) => $labels[$content['path']] ?? $content['fieldHandle'], $report['content'] ?? []),
            'preview' => array_map(fn(array $content) => [
                'label' => $labels[$content['path']] ?? $content['fieldHandle'],
                'paragraphs' => $this->_previewParagraphs($content['normalizedDocument'] ?? null),
            ], $report['content'] ?? []),
            'messages' => array_values(array_filter(array_map(static fn(array $event) => trim(($event['message'] ?? '') . "\n" . ($event['stack'] ?? '')), $report['browser']['events'] ?? []))),
            'contentTooLarge' => $contentTooLarge,
        ];
    }


    // Private Methods
    // =========================================================================

    private function _documentReport(array $selection, bool $includeContent, bool $includeEditorConfig): array
    {
        $field = $selection['field'];
        $configId = $field->editorConfig ?: EditorConfigs::DEFAULT_ID;
        $errors = [];
        $entry = [
            'path' => $selection['path'],
            'elementId' => $selection['elementId'],
            'siteId' => $selection['siteId'],
            'fieldUid' => $field->uid,
            'fieldHandle' => $field->handle,
            'placementUid' => $selection['placementUid'],
            'savedContentOnly' => true,
        ];
        $fail = static function(string $code, Throwable $exception) use (&$errors, $selection): void {
            $errors[] = ['code' => $code, 'path' => $selection['path'], 'exception' => get_class($exception)];
        };
        $configs = Vizy::$plugin->getEditorConfigs();
        $config = null;
        $manifest = null;

        try {
            $config = $configs->getConfig($configId);
            $entry['editorConfig'] = [
                'id' => $configId,
                'source' => $config['source'] ?? 'missing',
                'configured' => $config === null ? null : $this->_configSummary($config),
            ];
        } catch (Throwable $exception) {
            $entry['editorConfig'] = ['id' => $configId, 'source' => 'unavailable'];
            $fail('editorConfigUnavailable', $exception);
        }

        try {
            // Use the normal compiler, including runtime config events. Never export
            // the whole manifest: it can contain custom HTML, URLs and field values.
            $manifest = Vizy::$plugin->getEditorManifests()->build($field);
            $entry['editorConfig']['effective'] = [
                'nodes' => $this->_identifiers($manifest['enabledNodes']),
                'marks' => $this->_identifiers($manifest['enabledMarks']),
                'extensions' => $this->_identifiers($manifest['enabledExtensions']),
                'modules' => $this->_identifiers($manifest['modules']),
                'headingLevels' => $manifest['headingLevels'],
            ];
        } catch (Throwable $exception) {
            $fail('editorManifestUnavailable', $exception);
        }

        $raw = $selection['raw'];
        $normalized = null;

        try {
            $entry['stored'] = $this->_inventory($this->_decode($raw), $manifest);
        } catch (Throwable $exception) {
            $fail('storedDocumentUnreadable', $exception);
        }

        try {
            // Detached normalization avoids an owner save lifecycle, including for
            // Hosted Vizy. Legacy schema maps still permit an in-memory comparison.
            $normalized = Vizy::$plugin->getDocuments()->normalizeDetached($raw, $field->getLegacySchemaMap())->toArray();
            $entry['normalized'] = $this->_inventory($normalized, $manifest);
        } catch (Throwable $exception) {
            $fail('documentNormalizationFailed', $exception);
        }

        try {
            $entry['upgrades'] = $this->_upgrades($field, $configId);
        } catch (Throwable $exception) {
            $fail('upgradeHistoryUnavailable', $exception);
        }

        $content = null;

        if ($includeContent) {
            // Only the selected value is included, never the entire entry content
            // row. A Vizy value can itself contain embedded fields and nested content.
            $content = [
                'path' => $selection['path'],
                'fieldHandle' => $field->handle,
                'storedValue' => $raw,
                'normalizedDocument' => $normalized,
            ];

            // Editor Config pages are admin-only, so the same limit applies here.
            if ($includeEditorConfig) {
                $content['editorConfig'] = $config === null ? null : $configs->authorablePayload($config);
            }
        }

        return ['field' => $entry, 'content' => $content, 'errors' => $errors];
    }

    private function _findings(array $report, array $labels, bool $pageUnavailable, bool $collectionFailed, array $events): array
    {
        $findings = [];

        if ($pageUnavailable) {
            $findings[] = ['level' => 'warning', 'title' => Craft::t('vizy', 'We couldn’t read that page'), 'detail' => Craft::t('vizy', 'It may have been deleted, or you may not have access to it. The report still has your versions and anything noticed in the browser.')];
        }

        if ($collectionFailed) {
            $findings[] = ['level' => 'warning', 'title' => Craft::t('vizy', 'We couldn’t read this page’s Vizy fields'), 'detail' => Craft::t('vizy', 'The report still has your versions and anything noticed in the browser, which will help support.')];
        }

        if ($report['fieldsTruncated']) {
            $findings[] = ['level' => 'info', 'title' => Craft::t('vizy', 'This page is very large, so the report covers part of it'), 'detail' => Craft::t('vizy', 'If the problem is further down the page, tell support which field it’s in.')];
        }

        foreach ($report['fields'] as $field) {
            $label = $labels[$field['path']] ?? $field['fieldHandle'];
            $turnedOff = [];
            $unknown = [];

            foreach ($field['stored']['types'] ?? [] as $type) {
                // Early Vizy 4 builds stored retired Content Areas inside blocks. A block is
                // a leaf, so loading drops them and they can't be causing a problem. They
                // stay in the report's inventory for support.
                if ($type['type'] === 'vizySlot') {
                    continue;
                }

                if ($type['registered'] === false) {
                    $unknown[] = $type;
                } elseif ($type['enabled'] === false) {
                    $turnedOff[] = $type;
                }
            }

            if ($turnedOff) {
                $findings[] = ['level' => 'warning', 'title' => Craft::t('vizy', '{field} uses formatting that’s turned off', ['field' => $label]), 'detail' => Craft::t('vizy', '{types} isn’t turned on in this field’s editor config. This is a common reason for formatting going missing.', ['types' => $this->_typeList($turnedOff)])];
            }

            if ($unknown) {
                $findings[] = ['level' => 'warning', 'title' => Craft::t('vizy', '{field} uses formatting Vizy doesn’t recognize', ['field' => $label]), 'detail' => Craft::t('vizy', '{types} isn’t registered on this site. A plugin or module that provided it may be missing.', ['types' => $this->_typeList($unknown)])];
            }
        }

        if ($report['errors'] !== []) {
            $findings[] = ['level' => 'warning', 'title' => Craft::t('vizy', 'Some checks couldn’t finish'), 'detail' => Craft::t('vizy', 'The report includes which ones, which will help support.')];
        }

        if ($report['page']['savedVersionOnly'] ?? false) {
            $findings[] = ['level' => 'info', 'title' => Craft::t('vizy', 'This shows the last saved version of the field'), 'detail' => Craft::t('vizy', 'The field is in a Matrix field inside a Vizy block, so recent unsaved changes aren’t included.')];
        }

        if (($report['browser']['captured'] ?? false) === true) {
            $problems = array_filter($events, static fn(array $event) => $event['problem']);
            $warnings = array_filter($events, static fn(array $event) => $event['kind'] === 'console-warn');

            if ($problems !== []) {
                $findings[] = ['level' => 'warning', 'title' => Craft::t('vizy', 'Something went wrong in the browser while we checked'), 'detail' => implode(' ', array_slice(array_unique(array_map(static fn(array $event) => $event['text'] . '.', $problems)), 0, 4))];
            }

            if ($warnings !== []) {
                $findings[] = ['level' => 'info', 'title' => Craft::t('vizy', 'The browser logged {count, plural, =1{a warning} other{# warnings}}', ['count' => count($warnings)]), 'detail' => Craft::t('vizy', 'These can come from any plugin and are often unrelated. They’re still in the report.')];
            }

            if ($problems === [] && $warnings === []) {
                $findings[] = ['level' => 'ok', 'title' => Craft::t('vizy', 'No browser errors detected'), 'detail' => ''];
            }
        }

        if ($findings === []) {
            $findings[] = ['level' => 'info', 'title' => Craft::t('vizy', 'Nothing stands out so far'), 'detail' => Craft::t('vizy', 'Support can look further with this report.')];
        }

        return $findings;
    }

    private function _events(array $events): array
    {
        $described = [];

        foreach ($events as $event) {
            $text = match ($event['kind']) {
                'error', 'rejection' => match ($event['asset'] ?? null) {
                    'vizy' => Craft::t('vizy', 'Vizy hit a {type}', ['type' => $event['errorType'] ?? 'Error']),
                    default => Craft::t('vizy', 'A script hit a {type}', ['type' => $event['errorType'] ?? 'Error']),
                },
                'request-failure' => match ($event['source'] ?? null) {
                    'vizy' => Craft::t('vizy', 'A Vizy request failed ({status})', ['status' => $event['status'] ?? 0]),
                    'craft' => Craft::t('vizy', 'A Craft request failed ({status})', ['status' => $event['status'] ?? 0]),
                    default => Craft::t('vizy', 'A request failed ({status})', ['status' => $event['status'] ?? 0]),
                },
                'resource-error' => Craft::t('vizy', 'A file failed to load'),
                'console-error' => Craft::t('vizy', 'The browser logged an error'),
                'console-warn' => Craft::t('vizy', 'The browser logged a warning'),
                default => null,
            };

            if ($text !== null) {
                $seconds = (int)(($event['elapsedMs'] ?? 0) / 1000);
                $described[] = [
                    'kind' => $event['kind'],
                    'at' => sprintf('%d:%02d', (int)($seconds / 60), $seconds % 60),
                    'text' => $text,
                    'problem' => $event['kind'] !== 'console-warn',
                ];
            }
        }

        return $described;
    }

    private function _typeList(array $types): string
    {
        return implode(', ', array_map(static fn(array $type) => Craft::t('vizy', '{type} (used {count, plural, =1{once} other{# times}})', ['type' => $type['type'], 'count' => $type['count']]), $types));
    }

    /** A simple text view of what's being shared. The exact report remains the record. */
    private function _previewParagraphs(mixed $document): array
    {
        $paragraphs = [];
        $visit = function(mixed $node) use (&$visit, &$paragraphs): void {
            if (!is_array($node) || count($paragraphs) >= self::MAX_PREVIEW_PARAGRAPHS) {
                return;
            }

            $children = is_array($node['content'] ?? null) ? $node['content'] : [];
            $text = '';

            foreach ($children as $child) {
                if (is_array($child) && ($child['type'] ?? null) === 'text' && is_string($child['text'] ?? null)) {
                    $text .= $child['text'];
                }
            }

            if ($text !== '') {
                $paragraphs[] = mb_substr($text, 0, 1000);
            }

            foreach ($children as $child) {
                $visit($child);
            }
        };
        $visit($document);

        return $paragraphs;
    }

    private function _collectElement(ElementInterface $element, string $path, string $label, string $trail, int $depth): void
    {
        // Keep what's been gathered, because a partial report beats no report.
        if ($depth > 8 || count($this->_visited) >= 100) {
            $this->_truncated = true;

            return;
        }

        if (isset($this->_visited[$element->id])) {
            return;
        }

        $this->_visited[$element->id] = true;
        $row = (new Query())->select('content')->from('{{%elements_sites}}')
            ->where(['elementId' => $element->id, 'siteId' => $element->siteId])->scalar();
        $content = $this->_decode($row ?: null) ?? [];

        if (!is_array($content)) {
            throw new RuntimeException('Element content is not an object.');
        }

        $user = Craft::$app->getUser()->getIdentity();
        $layout = $element->getFieldLayout();
        // Fields hidden from someone by a condition stay hidden in their report.
        $placements = $user && !$user->admin ? $layout?->getVisibleCustomFieldElements($element) : $layout?->getCustomFieldElements();

        foreach ($placements ?? [] as $placement) {
            $field = $placement->getField();
            $fieldPath = $path . '/field:' . $placement->uid;
            $fieldLabel = $label . $field->name;
            $fieldTrail = ($trail === '' ? '' : $trail . '/') . 'field:' . $placement->uid;

            if ($field instanceof VizyField) {
                $this->_addDocument($field, $content[$placement->uid] ?? null, $element, $placement->uid, $fieldPath, $fieldLabel, $fieldTrail, $depth);
            } elseif ($field instanceof Matrix) {
                // Ask Matrix for persisted ownership, rather than scanning unrelated
                // entry rows or interpreting arbitrary embedded field JSON.
                $query = $field->normalizeValue(null, $element);

                foreach ($query->status(null)->limit(101)->all() as $child) {
                    if ($user && !Craft::$app->getElements()->canView($child, $user)) {
                        continue;
                    }

                    // The page keeps showing the saved row's ID after its owner gets
                    // a draft. That draft's rows point back to it as their canonical.
                    $this->_collectElement($child, $fieldPath . '/entry:' . $child->id, $fieldLabel . ' / #' . $child->id . ' / ', $fieldTrail . '/row:' . $child->getCanonicalId(), $depth + 1);
                }
            }
        }
    }

    private function _addDocument(VizyField $field, mixed $raw, ElementInterface $element, string $placementUid, string $path, string $label, string $trail, int $depth): void
    {
        if (count($this->_documents) >= self::MAX_DOCUMENTS || $depth > 64) {
            $this->_truncated = true;

            return;
        }

        $key = hash('sha256', $path);
        $this->_documents[$key] = compact('field', 'raw', 'placementUid', 'path', 'label', 'trail') + ['elementId' => $element->id, 'siteId' => $element->siteId];

        try {
            $decoded = $this->_decode($raw);
        } catch (Throwable) {
            // A malformed value must remain selectable so support can inspect it.
            return;
        }

        $this->_collectHosted($decoded, $element, $path, $label, $trail, $depth);
    }

    private function _collectHosted(mixed $node, ElementInterface $element, string $path, string $label, string $trail, int $depth, int $position = 1): void
    {
        if (!is_array($node)) {
            return;
        }

        if (++$this->_nodes > self::MAX_NODES || $depth > 64) {
            $this->_truncated = true;

            return;
        }

        if (($node['type'] ?? null) === 'vizyBlock') {
            $typeUid = $node['attrs']['blockTypeUid'] ?? null;
            $blockUid = $node['attrs']['blockUid'] ?? $node['attrs']['id'] ?? null;
            $type = is_string($typeUid) ? Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($typeUid) : null;

            foreach ($type?->getFieldLayout()?->getCustomFieldElements() ?? [] as $placement) {
                $field = $placement->getField();

                if ($field instanceof VizyField) {
                    $this->_addDocument(
                        $field,
                        $node['attrs']['fieldSlots'][$placement->uid] ?? null,
                        $element,
                        $placement->uid,
                        $path . '/field:' . $placement->uid,
                        $label . ' / ' . $type->name . ' #' . $position . ' / ' . $field->name,
                        $trail . '/block:' . (is_string($blockUid) ? $blockUid : '') . '/field:' . $placement->uid,
                        $depth + 1
                    );
                }
            }
        }

        $children = $node['content'] ?? (array_is_list($node) ? $node : []);

        foreach (is_array($children) ? array_values($children) : [] as $index => $child) {
            $this->_collectHosted($child, $element, $path . '/content:' . $index, $label, $trail, $depth + 1, $index + 1);
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
        // Pages can repeat a field many times, and this reads every promotion plan.
        $cacheKey = $field->uid . ':' . $configId;

        if (isset($this->_upgrades[$cacheKey])) {
            return $this->_upgrades[$cacheKey];
        }

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

        return $this->_upgrades[$cacheKey] = $runs;
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
