<?php
namespace verbb\vizy\services;

use verbb\vizy\base\EditorGroup;
use verbb\vizy\base\EditorSurface;
use verbb\vizy\base\ExtensionInterface;
use verbb\vizy\base\MarkInterface;
use verbb\vizy\base\NodeInterface;
use verbb\vizy\events\RegisterExtensionsEvent;
use verbb\vizy\events\RegisterToolbarDropdownsEvent;
use verbb\vizy\marks;
use verbb\vizy\nodes as allnodes;

use craft\base\Component;

use RuntimeException;

/**
 * PHP-authoritative registry for TipTap node, mark, and behaviour-only capabilities.
 *
 * Public registration is class lists on {@see RegisterExtensionsEvent}. Internally
 * classes compile to a definition map keyed `mark:bold`, `node:paragraph`, etc.
 * Render strategy strings are private compiler/Renderer details — not partner API.
 */
final class Extensions extends Component
{
    // Constants
    // =========================================================================

    public const EVENT_REGISTER_EXTENSIONS = 'registerExtensions';
    public const EVENT_REGISTER_TOOLBAR_DROPDOWNS = 'registerToolbarDropdowns';

    public const RESERVED_TYPES = ['unsupportedNode', 'unsupportedInlineNode', 'unsupportedMark'];

    /**
     * Module IDs with factories compiled into the production Vite entry.
     * Third-party modules use other IDs and register at runtime via Craft.Vizy.registerModule.
     */
    public const PRODUCTION_MODULE_IDS = [
        'vizy/core/node/doc', 'vizy/core/node/text', 'vizy/core/node/vizyBlock',
        'vizy/core/node/paragraph', 'vizy/core/node/heading', 'vizy/core/node/blockquote',
        'vizy/core/node/codeBlock', 'vizy/core/node/horizontalRule', 'vizy/core/node/hardBreak',
        'vizy/core/node/bulletList', 'vizy/core/node/orderedList', 'vizy/core/node/listItem',
        'vizy/core/node/image', 'vizy/core/node/iframe', 'vizy/core/node/mediaEmbed',
        'vizy/core/node/table', 'vizy/core/node/tableRow',
        'vizy/core/node/tableCell', 'vizy/core/node/tableHeader',
        'vizy/core/node/layout', 'vizy/core/node/column',
        'vizy/core/mark/bold', 'vizy/core/mark/code', 'vizy/core/mark/highlight',
        'vizy/core/mark/italic', 'vizy/core/mark/link', 'vizy/core/mark/strike',
        'vizy/core/mark/subscript', 'vizy/core/mark/superscript',
        'vizy/core/mark/textStyle', 'vizy/core/mark/underline',
    ];

    private const NODE_STRATEGIES = ['omit', 'block', 'type'];
    private const MARK_STRATEGIES = ['omit', 'type'];
    private const EXTENSION_STRATEGIES = ['omit'];


    // Properties
    // =========================================================================

    private ?array $definitions = null;
    private ?array $controlsById = null;
    private ?array $dropdowns = null;
    private ?string $revision = null;


    // Public Methods
    // =========================================================================

    public function getDefinitions(): array
    {
        if ($this->definitions !== null) {
            return $this->definitions;
        }

        $event = new RegisterExtensionsEvent([
            'marks' => $this->_coreMarks(),
            'nodes' => $this->_coreNodes(),
            'extensions' => $this->_coreExtensions(),
        ]);
        $this->trigger(self::EVENT_REGISTER_EXTENSIONS, $event);

        $definitions = [];
        foreach ([
            'mark' => $event->marks,
            'node' => $event->nodes,
            'extension' => $event->extensions,
        ] as $kind => $classes) {
            if (!is_array($classes) || !array_is_list($classes)) {
                throw new RuntimeException("RegisterExtensionsEvent::{$kind}s must be a list of class names.");
            }
            foreach ($classes as $index => $class) {
                $normalized = $this->_compileClass($kind, $class, $index);
                $key = $normalized['kind'] . ':' . $normalized['name'];
                if (isset($definitions[$key])) {
                    throw new RuntimeException("Duplicate Vizy extension definition: {$key}.");
                }
                $definitions[$key] = $normalized;
            }
        }
        ksort($definitions);

        foreach ($definitions as $key => $definition) {
            foreach ([...$definition['dependencies'], ...$definition['implies']] as $related) {
                if (!isset($definitions[$related])) {
                    throw new RuntimeException("Vizy extension {$key} references missing capability {$related}.");
                }
            }
        }

        $this->definitions = $definitions;
        $this->controlsById = $this->_indexControls($definitions);

        return $this->definitions;
    }

    /**
     * Toolbar / Bubble Menu item id → definition (marks, nodes, and pure extensions
     * that expose a button).
     */
    public function getControlsById(): array
    {
        $this->getDefinitions();

        return $this->controlsById ?? [];
    }

    public function getControl(string $controlId): ?array
    {
        return $this->getControlsById()[$controlId] ?? null;
    }

    public function getDefinition(string $kind, string $name): ?array
    {
        return $this->getDefinitions()[$kind . ':' . $name] ?? null;
    }

    public function getRender(string $kind, string $name): ?array
    {
        $definition = $this->getDefinition($kind, $name);
        if ($definition === null) {
            return null;
        }

        return $definition['render'] ?? null;
    }

    /**
     * Fail closed when any installed node/mark lacks a valid render strategy.
     */
    public function assertRenderCoverage(): void
    {
        foreach ($this->getDefinitions() as $key => $definition) {
            if (!$definition['installed']) {
                continue;
            }
            $render = $definition['render'] ?? null;
            if (!is_array($render) || !isset($render['strategy']) || !is_string($render['strategy'])) {
                throw new RuntimeException("Vizy extension {$key} lacks a valid render strategy.");
            }
            $this->_assertRenderShape($definition['kind'], $definition['name'], $render);
        }
    }

    public function getToolbarDropdowns(): array
    {
        if ($this->dropdowns !== null) {
            return $this->dropdowns;
        }

        $event = new RegisterToolbarDropdownsEvent(['dropdowns' => $this->_coreToolbarDropdowns()]);
        $this->trigger(self::EVENT_REGISTER_TOOLBAR_DROPDOWNS, $event);

        $dropdowns = [];
        foreach ($event->dropdowns as $index => $dropdown) {
            $normalized = $this->_normalizeDropdown($dropdown, $index);
            if (isset($dropdowns[$normalized['name']])) {
                throw new RuntimeException("Duplicate Vizy toolbar dropdown: {$normalized['name']}.");
            }
            $dropdowns[$normalized['name']] = $normalized;
        }

        return $this->dropdowns = $dropdowns;
    }

    public function getToolbarDropdown(string $name): ?array
    {
        return $this->getToolbarDropdowns()[$name] ?? null;
    }

    public function getNodes(): array
    {
        return $this->_definitionsByKind('node');
    }

    public function getMarks(): array
    {
        return $this->_definitionsByKind('mark');
    }

    public function getExtensions(): array
    {
        return $this->_definitionsByKind('extension');
    }

    public function getRevision(): string
    {
        return $this->revision ??= hash('sha256', $this->_stableJson($this->getDefinitions()));
    }

    public function resolveEnabled(array $nodes, array $marks, array $extensions = []): array
    {
        $requested = [];
        foreach (['node' => $nodes, 'mark' => $marks, 'extension' => $extensions] as $kind => $names) {
            foreach ($names as $name) {
                if (!is_string($name) || $name === '') {
                    throw new RuntimeException("Invalid {$kind} capability ID.");
                }
                $key = "{$kind}:{$name}";
                $definition = $this->getDefinitions()[$key] ?? null;
                if (!$definition || !$definition['installed']) {
                    throw new RuntimeException("Unknown or unavailable Vizy capability {$key}.");
                }
                if (!$definition['authorSelectable']) {
                    throw new RuntimeException("Internal Vizy capability {$key} cannot be selected.");
                }
                $requested[$key] = true;
            }
        }

        foreach ($this->getDefinitions() as $key => $definition) {
            if ($definition['installed'] && $definition['alwaysEnabled']) {
                $requested[$key] = true;
            }
        }

        $enabled = [];
        $visit = function(string $key) use (&$visit, &$enabled): void {
            if (isset($enabled[$key])) {
                return;
            }
            $definition = $this->getDefinitions()[$key] ?? null;
            if (!$definition || !$definition['installed']) {
                throw new RuntimeException("Required Vizy capability {$key} is unavailable.");
            }
            $enabled[$key] = true;
            foreach ([...$definition['dependencies'], ...$definition['implies']] as $related) {
                $visit($related);
            }
        };
        foreach (array_keys($requested) as $key) {
            $visit($key);
        }

        $resolved = [
            'nodes' => [],
            'marks' => [],
            'extensions' => [],
            'internalNodes' => [],
            'modules' => [],
        ];
        foreach (array_keys($enabled) as $key) {
            $definition = $this->getDefinitions()[$key];
            $bucket = match ($definition['kind']) {
                'node' => 'nodes',
                'mark' => 'marks',
                default => 'extensions',
            };
            $resolved[$bucket][] = $definition['name'];
            if ($definition['kind'] === 'node' && $definition['internal']) {
                $resolved['internalNodes'][] = $definition['name'];
            }
            $resolved['modules'][] = $definition['module'];
        }
        foreach ($resolved as &$values) {
            $values = array_values(array_unique($values));
            sort($values);
        }
        unset($values);

        return $resolved;
    }

    public function reset(): void
    {
        $this->definitions = null;
        $this->controlsById = null;
        $this->dropdowns = null;
        $this->revision = null;
    }

    /**
     * Walk document nodes and call normalizeAttrs on registered types (semantic shaping).
     */
    public function normalizeDocumentAttrs(array $nodes, \verbb\vizy\base\RenderContext $ctx): array
    {
        foreach ($nodes as $index => $node) {
            if (!is_array($node)) {
                continue;
            }
            $type = $node['type'] ?? null;
            if (is_string($type) && $type !== '') {
                $definition = $this->getDefinition('node', $type);
                $class = $definition['render']['class'] ?? null;
                if (is_string($class) && is_a($class, NodeInterface::class, true)) {
                    // Don't invent an attrs key when TipTap omitted it (e.g. text nodes).
                    $hadAttrs = array_key_exists('attrs', $node);
                    $attrs = is_array($node['attrs'] ?? null) ? $node['attrs'] : [];
                    $normalized = $class::normalizeAttrs($attrs, $ctx);
                    if ($hadAttrs || $normalized !== []) {
                        $node['attrs'] = $normalized;
                    }
                }
            }

            if (isset($node['marks']) && is_array($node['marks'])) {
                foreach ($node['marks'] as $markIndex => $mark) {
                    if (!is_array($mark)) {
                        continue;
                    }
                    $markType = $mark['type'] ?? null;
                    if (!is_string($markType) || $markType === '') {
                        continue;
                    }
                    $definition = $this->getDefinition('mark', $markType);
                    $class = $definition['render']['class'] ?? null;
                    if (is_string($class) && is_a($class, MarkInterface::class, true)) {
                        $hadAttrs = array_key_exists('attrs', $mark);
                        $attrs = is_array($mark['attrs'] ?? null) ? $mark['attrs'] : [];
                        $normalized = $class::normalizeAttrs($attrs, $ctx);
                        if ($hadAttrs || $normalized !== []) {
                            $mark['attrs'] = $normalized;
                        }
                        $node['marks'][$markIndex] = $mark;
                    }
                }
            }

            if (isset($node['content']) && is_array($node['content']) && ($node['type'] ?? null) !== 'vizyBlock') {
                $node['content'] = $this->normalizeDocumentAttrs($node['content'], $ctx);
            }

            $nodes[$index] = $node;
        }

        return $nodes;
    }


    // Private Methods
    // =========================================================================

    private function _coreMarks(): array
    {
        return [
            marks\Bold::class,
            marks\Code::class,
            marks\Highlight::class,
            marks\Italic::class,
            marks\Link::class,
            marks\Strike::class,
            marks\Subscript::class,
            marks\Superscript::class,
            marks\TextStyle::class,
            marks\Underline::class,
        ];
    }

    private function _coreNodes(): array
    {
        return [
            allnodes\Doc::class,
            allnodes\Text::class,
            allnodes\VizyBlock::class,
            allnodes\Paragraph::class,
            allnodes\HardBreak::class,
            allnodes\Heading::class,
            allnodes\Blockquote::class,
            allnodes\CodeBlock::class,
            allnodes\HorizontalRule::class,
            allnodes\BulletList::class,
            allnodes\OrderedList::class,
            allnodes\ListItem::class,
            allnodes\Image::class,
            allnodes\Iframe::class,
            allnodes\MediaEmbed::class,
            allnodes\Table::class,
            allnodes\TableRow::class,
            allnodes\TableCell::class,
            allnodes\TableHeader::class,
            allnodes\Layout::class,
            allnodes\Column::class,
        ];
    }

    private function _coreExtensions(): array
    {
        return [];
    }

    private function _compileClass(string $kind, mixed $class, int $index): array
    {
        if (!is_string($class) || $class === '') {
            throw new RuntimeException("Vizy {$kind} registration at index {$index} must be a class-string.");
        }
        if (!class_exists($class)) {
            throw new RuntimeException("Vizy {$kind} class {$class} does not exist.");
        }

        $interface = match ($kind) {
            'mark' => MarkInterface::class,
            'node' => NodeInterface::class,
            default => ExtensionInterface::class,
        };
        if (!is_a($class, $interface, true)) {
            throw new RuntimeException("Vizy {$kind} class {$class} must implement {$interface}.");
        }

        $name = $class::id();
        if (!is_string($name) || !preg_match('/^[A-Za-z][A-Za-z0-9]*$/', $name)) {
            throw new RuntimeException("Invalid Vizy type id() from {$class}.");
        }
        if (in_array($name, self::RESERVED_TYPES, true)) {
            throw new RuntimeException("Reserved Vizy transport type {$name} cannot be registered.");
        }

        $module = $class::moduleId();
        if (!is_string($module) || !preg_match('#^[A-Za-z0-9@][A-Za-z0-9@/_\-.]*$#', $module)) {
            throw new RuntimeException("Invalid moduleId() from {$class}.");
        }
        if ($module === $name) {
            throw new RuntimeException("Vizy {$kind}:{$name} moduleId() must not equal id().");
        }

        $installed = $this->_moduleIsInstallable($module);
        $internal = $kind === 'extension' ? false : (bool)$class::isInternal();
        $alwaysEnabled = $kind === 'extension' ? false : (bool)$class::alwaysEnabled();
        $label = trim((string)$class::label());

        $surfaces = $class::surfaces();
        if (!is_array($surfaces) || !array_is_list($surfaces)) {
            throw new RuntimeException("Vizy {$kind}:{$name} surfaces() must return a list.");
        }
        $surfaces = array_values(array_unique(array_map('strval', $surfaces)));
        foreach ($surfaces as $surface) {
            if (!in_array($surface, [EditorSurface::Toolbar, EditorSurface::Bubble], true)) {
                throw new RuntimeException("Vizy {$kind}:{$name} has unknown surface {$surface}.");
            }
        }
        sort($surfaces);

        // Catalogue token = type id() when any surface is declared.
        $controlId = $surfaces === [] ? null : $name;

        $icon = $class::icon();
        if ($icon !== null && (!is_string($icon) || trim($icon) === '')) {
            throw new RuntimeException("Vizy {$kind}:{$name} icon() must be a non-empty string when set.");
        }
        $icon = is_string($icon) ? trim($icon) : null;

        $group = $class::group();
        if ($group !== null && (!is_string($group) || trim($group) === '')) {
            throw new RuntimeException("Vizy {$kind}:{$name} group() must be a non-empty string when set.");
        }
        $group = is_string($group) ? trim($group) : $this->_defaultGroup($kind);

        $dependencies = $kind === 'extension' ? [] : $this->_normalizeRelated($class::dependencies(), 'dependencies', $kind, $name);
        $implies = $kind === 'extension' ? [] : $this->_normalizeRelated($class::implies(), 'implies', $kind, $name);

        return [
            'kind' => $kind,
            'name' => $name,
            'label' => $label !== '' ? $label : ucfirst($name),
            'module' => $module,
            'installed' => $installed,
            'internal' => $internal,
            'authorSelectable' => !$internal,
            'authorConfigurable' => !$internal && !$alwaysEnabled,
            'alwaysEnabled' => $alwaysEnabled,
            'dependencies' => $dependencies,
            'implies' => $implies,
            'render' => $this->_compileRender($kind, $class, $name),
            'icon' => $icon,
            'group' => $group,
            'surfaces' => $surfaces,
            // Internal map key kept as controlId for EditorConfigPresentation.
            'controlId' => $controlId,
            'class' => $class,
        ];
    }

    private function _compileRender(string $kind, string $class, string $name): array
    {
        if ($kind === 'extension') {
            return ['strategy' => 'omit', 'class' => $class];
        }

        if ($kind === 'node' && $name === 'vizyBlock') {
            return ['strategy' => 'block', 'class' => $class];
        }

        if ($kind === 'node' && in_array($name, ['doc', 'text'], true)) {
            return ['strategy' => 'omit', 'class' => $class];
        }

        if ($kind === 'mark') {
            $tag = $class::tag();
            if ($tag === null || $tag === '') {
                return ['strategy' => 'omit', 'class' => $class];
            }

            return ['strategy' => 'type', 'class' => $class, 'tag' => $tag];
        }

        // Nodes: type path (static tag / renderOccurrenceHtml / layout attrs).
        return [
            'strategy' => 'type',
            'class' => $class,
            'tag' => $class::tag(),
        ];
    }

    private function _defaultGroup(string $kind): string
    {
        return match ($kind) {
            'mark' => EditorGroup::Marks,
            'node' => EditorGroup::Extensions,
            default => EditorGroup::Extensions,
        };
    }

    private function _normalizeRelated(mixed $values, string $attribute, string $kind, string $name): array
    {
        if (!is_array($values) || !array_is_list($values)) {
            throw new RuntimeException("Vizy extension {$kind}:{$name} {$attribute} must be a list.");
        }
        $values = array_values(array_unique(array_map('strval', $values)));
        foreach ($values as $value) {
            if (!preg_match('/^(node|mark|extension):[A-Za-z][A-Za-z0-9]*$/', $value)) {
                throw new RuntimeException("Invalid related capability {$value} on {$kind}:{$name}.");
            }
        }
        sort($values);

        return $values;
    }

    private function _coreToolbarDropdowns(): array
    {
        return [
            [
                'name' => 'formatting',
                'label' => 'Formatting',
                'icon' => 'paragraph',
                'members' => ['paragraph', 'headingLevels', 'blockquote', 'codeBlock'],
            ],
            [
                'name' => 'table',
                'label' => 'Table',
                'icon' => 'table',
                'members' => [
                    'table',
                    'tableDelete',
                    'tableAddColumnBefore', 'tableAddColumnAfter', 'tableDeleteColumn',
                    'tableAddRowBefore', 'tableAddRowAfter', 'tableDeleteRow',
                    'tableMergeCells', 'tableSplitCell',
                    'tableToggleHeaderColumn', 'tableToggleHeaderRow', 'tableToggleHeaderCell',
                ],
            ],
            [
                'name' => 'alignment',
                'label' => 'Alignment',
                'icon' => 'align-left',
                'members' => ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
            ],
        ];
    }

    private function _normalizeDropdown(mixed $dropdown, int $index): array
    {
        if (!is_array($dropdown)) {
            throw new RuntimeException("Vizy toolbar dropdown {$index} must be an array.");
        }
        $name = $dropdown['name'] ?? null;
        if (!is_string($name) || !preg_match('/^[A-Za-z][A-Za-z0-9]*$/', $name)) {
            throw new RuntimeException("Invalid Vizy toolbar dropdown identity at index {$index}.");
        }
        $label = trim((string)($dropdown['label'] ?? ''));
        if ($label === '') {
            throw new RuntimeException("Vizy toolbar dropdown {$name} must have a label.");
        }
        $members = $dropdown['members'] ?? [];
        if (!is_array($members) || !array_is_list($members) || $members === []) {
            throw new RuntimeException("Vizy toolbar dropdown {$name} must have at least one member.");
        }
        foreach ($members as $member) {
            if (!is_string($member) || $member === '') {
                throw new RuntimeException("Vizy toolbar dropdown {$name} members must be strings.");
            }
        }

        $icon = $dropdown['icon'] ?? null;

        return [
            'name' => $name,
            'label' => $label,
            'icon' => is_string($icon) && $icon !== '' ? $icon : null,
            'members' => array_values(array_unique(array_map('strval', $members))),
        ];
    }

    private function _indexControls(array $definitions): array
    {
        $reserved = $this->_reservedControlIds();
        $controls = [];
        foreach ($definitions as $key => $definition) {
            $controlId = $definition['controlId'] ?? null;
            if (!is_string($controlId) || $controlId === '') {
                continue;
            }
            if (isset($reserved[$controlId])) {
                throw new RuntimeException("Vizy control id {$controlId} on {$key} collides with a built-in toolbar token.");
            }
            if (isset($controls[$controlId])) {
                $other = $controls[$controlId]['kind'] . ':' . $controls[$controlId]['name'];
                throw new RuntimeException("Duplicate Vizy control id {$controlId} ({$other} and {$key}).");
            }
            $controls[$controlId] = $definition;
        }

        ksort($controls);

        return $controls;
    }

    private function _reservedControlIds(): array
    {
        $ids = [
            'separator',
            'undo', 'redo', 'clearFormatting', 'addBlock',
            'alignLeft', 'alignCenter', 'alignRight', 'alignJustify',
            'tableAddColumnBefore', 'tableAddColumnAfter', 'tableDeleteColumn',
            'tableAddRowBefore', 'tableAddRowAfter', 'tableDeleteRow',
            'tableMergeCells', 'tableSplitCell',
            'tableToggleHeaderRow', 'tableToggleHeaderColumn', 'tableToggleHeaderCell',
            'tableDelete',
        ];
        for ($level = 1; $level <= 6; $level++) {
            $ids[] = 'heading' . $level;
        }

        return array_fill_keys($ids, true);
    }

    private function _moduleIsInstallable(string $module): bool
    {
        if (in_array($module, self::PRODUCTION_MODULE_IDS, true)) {
            return true;
        }

        if (str_starts_with($module, 'vizy/core/')) {
            return false;
        }

        return true;
    }

    private function _assertRenderShape(string $kind, string $name, array $render): void
    {
        $strategy = $render['strategy'] ?? null;
        if (!is_string($strategy)) {
            throw new RuntimeException("Vizy extension {$kind}:{$name} requires a render strategy.");
        }

        $allowed = match ($kind) {
            'mark' => self::MARK_STRATEGIES,
            'extension' => self::EXTENSION_STRATEGIES,
            default => self::NODE_STRATEGIES,
        };
        if (!in_array($strategy, $allowed, true)) {
            throw new RuntimeException("Vizy extension {$kind}:{$name} has invalid render strategy {$strategy}.");
        }

        if ($strategy === 'type' || $strategy === 'block') {
            $class = $render['class'] ?? null;
            if (!is_string($class) || $class === '' || !class_exists($class)) {
                throw new RuntimeException("Vizy extension {$kind}:{$name} requires an existing class.");
            }
        }
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

    private function _definitionsByKind(string $kind): array
    {
        $definitions = [];
        foreach ($this->getDefinitions() as $definition) {
            if ($definition['kind'] === $kind) {
                $definitions[$definition['name']] = $definition;
            }
        }
        ksort($definitions);
        return $definitions;
    }
}
