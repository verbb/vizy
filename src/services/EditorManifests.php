<?php
namespace verbb\vizy\services;

use verbb\vizy\Vizy;
use verbb\vizy\document\VizyDocument;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\EditorConfigPresentation;
use verbb\vizy\helpers\ToolbarIcons;
use verbb\vizy\models\BlockType;
use verbb\vizy\services\BlockSummaryProjection;

use Craft;
use craft\base\Component;

use RuntimeException;

/**
 * Builds the deterministic PHP-authoritative editor payload for the CP client.
 */
final class EditorManifests extends Component
{
    // Properties
    // =========================================================================

    private array $cache = [];


    // Public Methods
    // =========================================================================

    public function build(VizyField $field): array
    {
        $configId = $field->editorConfig !== '' ? $field->editorConfig : EditorConfigs::DEFAULT_ID;
        $config = \verbb\vizy\Vizy::$plugin->getEditorConfigs()->getConfig($configId);
        $diagnostics = [
            ...\verbb\vizy\Vizy::$plugin->getEditorConfigs()->getFieldDiagnostics($field),
            ...\verbb\vizy\Vizy::$plugin->getBlockTypes()->getSchemaDiagnostics(),
            ...($config['diagnostics'] ?? []),
        ];
        $enabled = $config
            ? [
                // The resolved schema, not the author's selection: the editor needs the
                // dependencies and always-on capabilities that selection implies.
                'nodes' => $config['schema']['nodes'],
                'marks' => $config['schema']['marks'],
                'extensions' => $config['schema']['extensions'] ?? [],
                'internalNodes' => $config['schema']['internalNodes'],
                'modules' => $config['modules'],
            ]
            : \verbb\vizy\Vizy::$plugin->getExtensions()->resolveEnabled([], []);

        $blockTypes = [];
        foreach (\verbb\vizy\Vizy::$plugin->getBlockTypes()->getAllBlockTypes() as $type) {
            $layout = $type->getFieldLayout();
            $layoutConfig = $layout?->getConfig() ?? [];
            $layoutTabLabels = [];
            $fieldSlotKinds = [];
            if ($layout) {
                foreach ($layout->getCustomFieldElements() as $placement) {
                    $slotField = $placement->getField();
                    if ($slotField instanceof VizyField) {
                        $fieldSlotKinds[$placement->uid] = 'hosted';
                    } elseif ($slotField instanceof \craft\fields\Matrix) {
                        $fieldSlotKinds[$placement->uid] = 'matrix';
                    }
                }
                foreach ($layout->getTabs() as $tab) {
                    $layoutTabLabels[] = (string)$tab->name;
                }
            }
            $projection = new BlockSummaryProjection();
            $inference = $projection->inferenceFor($type);
            $blockTypes[(string)$type->uid] = [
                'uid' => (string)$type->uid,
                'name' => $type->name,
                'handle' => $type->handle,
                'fieldLayoutUid' => $layout?->uid,
                'fieldSlotKinds' => $fieldSlotKinds,
                'fieldLayoutHash' => hash('sha256', $this->_stableJson($layoutConfig)),
                'color' => $type->color,
                // Configured icon only — no fallback glyph in Block header (Matrix parity).
                'iconSvg' => Vizy::$plugin->getIcons()->blockTypeIconSvg($type->icon),
                // Portable preview path resolved to a CP action URL (may be null).
                'previewImage' => $type->previewImage,
                'previewImageUrl' => Vizy::$plugin->getBlockPreviewImages()->resolveUrl($type->previewImage),
                'summary' => is_array($type->summary) ? [
                    'titlePlacementUid' => $type->summary['titlePlacementUid'] ?? null,
                    'subtitlePlacementUid' => $type->summary['subtitlePlacementUid'] ?? null,
                    'mediaPlacementUid' => $type->summary['mediaPlacementUid'] ?? null,
                ] : null,
                'summaryInference' => [
                    'titlePlacementUids' => $inference->titleCandidates,
                    'subtitlePlacementUids' => $inference->subtitleCandidates,
                    'mediaPlacementUids' => $inference->mediaCandidates,
                ],
                'layoutTabLabels' => $layoutTabLabels,
            ];
        }
        ksort($blockTypes);

        $insertionItems = $this->_buildInsertionItems($field, $blockTypes, $enabled['nodes'], $enabled['internalNodes']);

        $fieldPolicy = [
            'fieldUid' => (string)($field->uid ?? ''),
            'fieldHandle' => (string)($field->handle ?? ''),
            'rootContentType' => $field->rootContentType,
            'blockTypePickerGroups' => array_values(array_map(static fn(array $group): array => [
                'name' => (string)($group['name'] ?? ''),
                // Group membership stays complete so existing Blocks of a disabled
                // type still resolve their group for structure/Browse All ordering.
                'blockTypeUids' => array_values(array_map('strval', $group['blockTypeUids'] ?? [])),
                'disabledBlockTypeUids' => array_values(array_map('strval', $group['disabledBlockTypeUids'] ?? [])),
            ], $field->blockTypePickerGroups)),
            'allowedBlockTypeUids' => $field->getAllowedBlockTypeUids(),
            'insertableBlockTypeUids' => $field->getInsertableBlockTypeUids(),
            'minBlocks' => $field->minBlocks,
            'maxBlocks' => $field->maxBlocks,
            // Opt-in: Delete is already explicit in the Block menu; prompt is not default.
            'confirmBlockDeletion' => (bool)$field->confirmBlockDeletion,
            // Project default for consecutive same-type nesting.
            'sameBlockTypeMaxDepth' => BlockTypes::SAME_BLOCK_TYPE_MAX_DEPTH,
        ];
        $schemaPayload = ['field' => $fieldPolicy, 'blockTypes' => $blockTypes, 'insertionItems' => $insertionItems];
        $schemaRevision = hash('sha256', $this->_stableJson($schemaPayload));
        $configIdentity = [
            'id' => $configId,
            'revision' => $config['revision'] ?? 'missing',
            'hash' => $config['hash'] ?? null,
        ];
        $cacheKey = hash('sha256', $this->_stableJson([
            'registry' => \verbb\vizy\Vizy::$plugin->getExtensions()->getRevision(),
            'config' => $configIdentity,
            'schema' => $schemaRevision,
        ]));
        if (isset($this->cache[$cacheKey])) {
            return $this->cache[$cacheKey];
        }

        $payload = [
            'manifestVersion' => 1,
            'registryRevision' => \verbb\vizy\Vizy::$plugin->getExtensions()->getRevision(),
            'editorConfig' => $configIdentity,
            'schemaRevision' => $schemaRevision,
            'enabledNodes' => $enabled['nodes'],
            'enabledMarks' => $enabled['marks'],
            'internalNodes' => $enabled['internalNodes'],
            'modules' => $enabled['modules'],
            'headingLevels' => $this->_headingLevels($config, $enabled['nodes']),
            'field' => $fieldPolicy,
            'blockTypes' => $blockTypes,
            'insertionItems' => $insertionItems,
            'toolbar' => $this->_buildToolbar($config),
            'bubble' => $this->_buildBubble($config),
            // Insertion chrome toggles (Editor Config). Missing → enabled.
            'gutterInsert' => (bool)($config['gutterInsert'] ?? true),
            'slashInsert' => (bool)($config['slashInsert'] ?? true),
            'diagnostics' => $diagnostics,
        ];
        // Request UID is an instance correlation token, so it is intentionally
        // excluded from the content hash and deterministic revision.
        $hash = hash('sha256', $this->_stableJson($payload));
        return $this->cache[$cacheKey] = [
            'uid' => \craft\helpers\StringHelper::UUID(),
            'revision' => '1:' . $hash,
            'hash' => $hash,
            ...$payload,
        ];
    }

    /**
     * Validate raw canonical arrays against this field's effective capabilities.
     */
    public function validateCapabilities(VizyDocument $candidate, VizyField $field, ?VizyDocument $baseline): array
    {
        $manifest = $this->build($field);
        $allowedNodes = array_fill_keys([...$manifest['enabledNodes'], ...$manifest['internalNodes']], true);
        $allowedMarks = array_fill_keys($manifest['enabledMarks'], true);
        $allowedLevels = $manifest['headingLevels'];
        $trusted = $baseline
            ? $this->_unsupportedInventory($baseline->toArray(), $allowedNodes, $allowedMarks, $allowedLevels)
            : [];
        $used = [];
        $violations = [];

        $walk = function(array $nodes, string $blockUid = 'root') use (&$walk, &$used, &$violations, $allowedNodes, $allowedMarks, $allowedLevels, $trusted): void {
            foreach ($nodes as $node) {
                if (!is_array($node) || !is_string($node['type'] ?? null)) {
                    continue;
                }
                $nodeBlockUid = ($node['type'] === 'vizyBlock' && is_string($node['attrs']['blockUid'] ?? null))
                    ? $node['attrs']['blockUid']
                    : $blockUid;
                $identity = $this->_stableNodeIdentity($node);
                $nodePath = "block:{$nodeBlockUid}/node:{$identity}";
                $type = $node['type'];
                if (!isset($allowedNodes[$type])) {
                    $key = "node:{$type}:{$nodeBlockUid}:{$identity}";
                    if (($used[$key] ?? 0) >= ($trusted[$key] ?? 0)) {
                        $violations[] = ['code' => 'disallowedNode', 'path' => $nodePath, 'kind' => 'node', 'name' => $type];
                    }
                    $used[$key] = ($used[$key] ?? 0) + 1;
                    continue;
                }
                // A heading at a level this config does not allow, judged exactly as a
                // disallowed node is — including the trusted-baseline allowance, so tightening
                // the levels never invalidates a document that already contained one. It is
                // still a heading, so the walk carries on into its content either way.
                $level = $this->_headingLevel($node);
                if ($level !== null && !in_array($level, $allowedLevels, true)) {
                    $key = "level:{$level}:{$nodeBlockUid}:{$identity}";
                    if (($used[$key] ?? 0) >= ($trusted[$key] ?? 0)) {
                        $violations[] = [
                            'code' => 'disallowedHeadingLevel',
                            'path' => $nodePath,
                            'kind' => 'node',
                            'name' => "heading{$level}",
                        ];
                    }
                    $used[$key] = ($used[$key] ?? 0) + 1;
                }
                foreach ($node['marks'] ?? [] as $mark) {
                    if (!is_array($mark) || !is_string($mark['type'] ?? null) || isset($allowedMarks[$mark['type']])) {
                        continue;
                    }
                    $key = "mark:{$mark['type']}:{$nodeBlockUid}:{$identity}";
                    if (($used[$key] ?? 0) >= ($trusted[$key] ?? 0)) {
                        $violations[] = ['code' => 'disallowedMark', 'path' => $nodePath, 'kind' => 'mark', 'name' => $mark['type']];
                    }
                    $used[$key] = ($used[$key] ?? 0) + 1;
                }
                // vizyBlock is a TipTap leaf — nesting is Hosted fieldSlots.
                if (($node['type'] ?? null) !== 'vizyBlock' && is_array($node['content'] ?? null)) {
                    $walk($node['content'], $nodeBlockUid);
                }
            }
        };
        $walk($candidate->toArray()['content'] ?? []);
        return $violations;
    }

    public function invalidate(): void
    {
        $this->cache = [];
    }


    // Private Methods
    // =========================================================================

    /**
     * The heading levels this config allows, and an empty list when it allows no headings.
     *
     * A level is part of the schema rather than a menu preference: "no H1 in body content" is a
     * statement about what a document may contain, and it was being enforced nowhere — the
     * client loaded TipTap's Heading with its stock six levels and validation only ever
     * compared node *names*, so unticking H1 removed the button and let a pasted `<h1>` through.
     *
     * Empty when Heading is not in the resolved schema, so the manifest cannot say a level is
     * allowed while the node carrying it is not.
     */
    private function _headingLevels(?array $config, array $enabledNodes): array
    {
        if (!$config || !in_array('heading', $enabledNodes, true)) {
            return [];
        }

        return array_values(array_map('intval', $config['headings']['levels'] ?? []));
    }

    private function _buildToolbar(?array $config): array
    {
        if (!$config) {
            return ['controls' => []];
        }

        // Resolved, so a Paragraph or list-item button is not dropped for being implied
        // rather than ticked.
        $enabledNodes = $config['schema']['nodes'] ?? [];
        $enabledMarks = $config['schema']['marks'] ?? [];
        $enabledExtensions = $config['schema']['extensions'] ?? [];
        $headingLevels = $config['headings']['levels'] ?? [];
        // Per-config dropdown membership. Absent for a dropdown the config has never edited,
        // which is how `dropdownControl` knows to use the registration's roster instead.
        $dropdownMembers = $config['dropdowns'] ?? [];

        $controls = [];
        foreach ($config['toolbar'] ?? [] as $item) {
            if (!is_string($item)) {
                continue;
            }
            // Presentation rather than a command, so it resolves to nothing actionable. Checked
            // first because `controlFor` would find no capability behind it.
            if (EditorConfigPresentation::isPresentationItem($item)) {
                $controls[] = [
                    'id' => $item,
                    'kind' => 'presentation',
                    'label' => EditorConfigPresentation::toolbarItemLabel($item),
                    'icon' => ToolbarIcons::svgFor($item),
                    'presentation' => $item,
                ];
                continue;
            }
            // Buttons and dropdowns are both plain IDs, with a dropdown's members resolved from
            // its registration on the way through, so the client never has to know which it got.
            $control = EditorConfigPresentation::controlFor(
                $item,
                $enabledMarks,
                $enabledNodes,
                $headingLevels,
                $dropdownMembers,
                $enabledExtensions,
            );
            if ($control !== null) {
                $controls[] = $control;
            }
        }

        return ['controls' => $controls];
    }

    private function _buildBubble(?array $config): array
    {
        if (!$config) {
            return ['enabled' => false, 'controls' => []];
        }

        $bubble = $config['bubble'] ?? EditorConfigPresentation::defaultBubble();
        $enabled = (bool)($bubble['enabled'] ?? true);
        $marks = $config['schema']['marks'] ?? [];
        $nodes = $config['schema']['nodes'] ?? [];
        $extensions = $config['schema']['extensions'] ?? [];
        $controls = [];
        foreach ($bubble['items'] ?? [] as $item) {
            if (!is_string($item)) {
                continue;
            }
            // Marks-first by convention, but any control advertised on the bubble surface
            // may resolve when its capability is enabled (partner nodes / extensions).
            $control = EditorConfigPresentation::controlFor($item, $marks, $nodes, [], [], $extensions);
            if ($control === null) {
                continue;
            }
            // Namespaced so the two surfaces cannot collide on a control ID.
            $control['id'] = "bubble:{$item}";
            $controls[] = $control;
        }

        return ['enabled' => $enabled, 'controls' => $controls];
    }

    /**
     * Deterministic insertion manifest consumed by the client insertion registry.
     */
    private function _buildInsertionItems(
        VizyField $field,
        array $blockTypes,
        array $enabledNodes,
        array $internalNodes,
    ): array {
        $surfaces = ['browse', 'empty', 'inline', 'keyboard', 'slash'];
        $internal = array_fill_keys($internalNodes, true);
        $enabled = array_fill_keys($enabledNodes, true);
        $items = [];

        $blockOrder = [];
        $blockGroups = [];
        $order = 0;
        foreach ($field->blockTypePickerGroups as $group) {
            $groupName = (string)($group['name'] ?? 'Blocks');
            foreach ($group['blockTypeUids'] ?? [] as $uid) {
                $uid = (string)$uid;
                if (!isset($blockTypes[$uid]) || isset($blockOrder[$uid])) {
                    continue;
                }
                $blockOrder[$uid] = $order++;
                $blockGroups[$uid] = $groupName !== '' ? $groupName : 'Blocks';
            }
        }
        foreach ($field->getAllowedBlockTypeUids() as $uid) {
            $uid = (string)$uid;
            if (!isset($blockTypes[$uid]) || isset($blockOrder[$uid])) {
                continue;
            }
            $blockOrder[$uid] = $order++;
            $blockGroups[$uid] = 'Blocks';
        }

        foreach ($blockOrder as $uid => $itemOrder) {
            $type = $blockTypes[$uid];
            $label = (string)($type['name'] ?? $type['handle'] ?? $uid);
            $handle = (string)($type['handle'] ?? '');
            $items[] = [
                'id' => "block:{$uid}",
                'kind' => 'block',
                'blockTypeUid' => $uid,
                'label' => $label,
                'description' => null,
                'icon' => $this->_insertionIconForBlockUid((string)$uid),
                'previewImageUrl' => is_string($type['previewImageUrl'] ?? null)
                    ? $type['previewImageUrl']
                    : null,
                'group' => $blockGroups[$uid],
                'keywords' => $handle !== '' && $handle !== $label ? [$handle] : [],
                'aliases' => [],
                'order' => $itemOrder,
                'surfaces' => $surfaces,
                'requiresInput' => false,
            ];
        }

        $nodeLabels = [
            'blockquote' => 'Quote',
            'bulletList' => 'Bullet list',
            'codeBlock' => 'Code block',
            'hardBreak' => 'Line break',
            'heading' => 'Heading',
            'horizontalRule' => 'Divider',
            'image' => 'Image',
            'orderedList' => 'Numbered list',
            'paragraph' => 'Paragraph',
            'table' => 'Table',
        ];
        $nodeGroups = [
            'blockquote' => 'Text',
            'bulletList' => 'Lists',
            'codeBlock' => 'Text',
            'hardBreak' => 'Text',
            'heading' => 'Text',
            'horizontalRule' => 'Text',
            'image' => 'Media',
            'orderedList' => 'Lists',
            'paragraph' => 'Text',
            'table' => 'Layout',
        ];
        $nodeOrder = 0;
        $extensions = Vizy::$plugin->getExtensions();
        foreach ($enabledNodes as $nodeName) {
            if (!is_string($nodeName) || isset($internal[$nodeName]) || !isset($enabled[$nodeName])) {
                continue;
            }

            // Core prose nodes have fixed labels/groups; partner nodes come from
            // Extensions once installed + enabled on the Editor Config.
            $label = $nodeLabels[$nodeName] ?? null;
            $group = $nodeGroups[$nodeName] ?? null;
            if ($label === null) {
                $definition = $extensions->getDefinition('node', $nodeName);
                if ($definition === null || !($definition['installed'] ?? false)) {
                    continue;
                }
                $label = (string)($definition['label'] ?? $nodeName);
                $group = 'Extensions';
            }

            $items[] = [
                'id' => "node:vizy:{$nodeName}",
                'kind' => 'node',
                'nodeName' => $nodeName,
                'label' => $label,
                'description' => null,
                'icon' => $this->_insertionIconForNode($nodeName),
                'group' => $group ?? 'Text',
                'keywords' => [$nodeName],
                'aliases' => [],
                'order' => $nodeOrder++,
                'surfaces' => $surfaces,
                'requiresInput' => false,
            ];
        }

        usort($items, static function(array $a, array $b): int {
            $group = strcmp((string)$a['group'], (string)$b['group']);
            if ($group !== 0) {
                return $group;
            }
            $order = ((int)$a['order']) <=> ((int)$b['order']);
            if ($order !== 0) {
                return $order;
            }
            return strcmp((string)$a['id'], (string)$b['id']);
        });

        return array_values($items);
    }

    private function _insertionIconForBlockUid(string $uid): array
    {
        $type = Vizy::$plugin->getBlockTypes()->getBlockTypeByUid($uid);

        return Vizy::$plugin->getIcons()->blockTypeInsertionIcon($type?->icon, $type?->color);
    }

    /**
     * Toolbar/FA glyph for a prose insertion node.
     */
    private function _insertionIconForNode(string $nodeName): ?array
    {
        $svg = ToolbarIcons::svgFor($nodeName);
        if ($svg === null) {
            return null;
        }

        return [
            'name' => $nodeName,
            'svg' => $svg,
        ];
    }

    /**
     * A heading's level, or null for anything that is not a heading.
     *
     * Read as an int because the attribute has arrived as a numeric string from ingress paths
     * more than once, and `'2' !== 2` would have quietly made every such heading a violation.
     */
    private function _headingLevel(array $node): ?int
    {
        if (($node['type'] ?? null) !== 'heading') {
            return null;
        }

        $level = $node['attrs']['level'] ?? null;

        return is_numeric($level) ? (int)$level : null;
    }

    private function _unsupportedInventory(array $document, array $allowedNodes, array $allowedMarks, array $allowedLevels = []): array
    {
        $inventory = [];
        $walk = function(array $nodes, string $blockUid = 'root') use (&$walk, &$inventory, $allowedNodes, $allowedMarks, $allowedLevels): void {
            foreach ($nodes as $node) {
                if (!is_array($node) || !is_string($node['type'] ?? null)) {
                    continue;
                }
                $nodeBlockUid = ($node['type'] === 'vizyBlock' && is_string($node['attrs']['blockUid'] ?? null))
                    ? $node['attrs']['blockUid']
                    : $blockUid;
                $identity = $this->_stableNodeIdentity($node);
                if (!isset($allowedNodes[$node['type']])) {
                    $key = "node:{$node['type']}:{$nodeBlockUid}:{$identity}";
                    $inventory[$key] = ($inventory[$key] ?? 0) + 1;
                    continue;
                }
                // Counted on the same key the validating walk looks up, so a heading already in
                // the trusted baseline is spent against itself rather than reported.
                $level = $this->_headingLevel($node);
                if ($level !== null && !in_array($level, $allowedLevels, true)) {
                    $key = "level:{$level}:{$nodeBlockUid}:{$identity}";
                    $inventory[$key] = ($inventory[$key] ?? 0) + 1;
                }
                foreach ($node['marks'] ?? [] as $mark) {
                    if (is_array($mark) && is_string($mark['type'] ?? null) && !isset($allowedMarks[$mark['type']])) {
                        $key = "mark:{$mark['type']}:{$nodeBlockUid}:{$identity}";
                        $inventory[$key] = ($inventory[$key] ?? 0) + 1;
                    }
                }
                if (($node['type'] ?? null) !== 'vizyBlock' && is_array($node['content'] ?? null)) {
                    $walk($node['content'], $nodeBlockUid);
                }
            }
        };
        $walk($document['content'] ?? []);
        return $inventory;
    }

    private function _stableNodeIdentity(array $node): string
    {
        foreach (['blockUid', 'layoutUid', 'columnUid', 'nodeUid'] as $key) {
            if (is_string($node['attrs'][$key] ?? null) && $node['attrs'][$key] !== '') {
                return "{$key}:{$node['attrs'][$key]}";
            }
        }
        return 'shape:' . hash('sha256', $this->_stableJson($node));
    }

    private function _stableJson(array $value): string
    {
        $normalize = function(array $item) use (&$normalize): array {
            if (array_is_list($item)) {
                return array_map(static fn(mixed $value) => is_array($value) ? $normalize($value) : $value, $item);
            }
            ksort($item);
            foreach ($item as &$value) {
                if (is_array($value)) {
                    $value = $normalize($value);
                }
            }
            unset($value);
            return $item;
        };
        return json_encode($normalize($value), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
