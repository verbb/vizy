<?php
namespace verbb\vizy\services;

use verbb\vizy\deprecations\VizyToolbarTokenDeprecations;
use verbb\vizy\fields\VizyField;
use verbb\vizy\helpers\EditorConfigPresentation;

use Craft;
use craft\base\Component;
use craft\events\ConfigEvent;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\helpers\StringHelper;

use RuntimeException;
use Throwable;

/**
 * Named editor configs: what an editor may contain, and the controls offered for putting it there.
 *
 * Two sources, one ID namespace. Project Config holds the ones authored in the CP. JSON files under
 * `config/vizy/` hold the ones authored on disk, Vizy 3-style. Both are selectable on a field;
 * only Project Config is writable from the CP. A file never shadows a Project Config entry of the
 * same ID — deployable YAML you already saved wins — and a Project Config save refuses an ID a
 * file already owns, so the two cannot silently overwrite each other either way.
 */
final class EditorConfigs extends Component
{
    // Constants
    // =========================================================================

    public const PROJECT_CONFIG_PATH = 'plugins.vizy.editorConfigs';
    public const DEFAULT_ID = 'standard';
    public const SOURCE_PROJECT_CONFIG = 'projectConfig';
    public const SOURCE_FILE = 'file';
    public const FILE_CONFIG_DIR = 'vizy';


    // Properties
    // =========================================================================

    private ?array $configs = null;
    private ?array $fileNames = null;
    private ?array $fileConfigs = null;
    private bool $externalPreflightComplete = false;


    // Public Methods
    // =========================================================================

    public function getAllConfigs(): array
    {
        if ($this->configs !== null) {
            return $this->configs;
        }
        $raw = Craft::$app->getProjectConfig()->get(self::PROJECT_CONFIG_PATH) ?? [];
        if (!is_array($raw)) {
            $raw = [];
        }
        // Fresh installs persist this seed. The fallback keeps update requests
        // usable until the idempotent update migration has applied PC.
        $raw[self::DEFAULT_ID] ??= $this->_standardConfig();

        $this->configs = [];
        $this->fileNames = [];
        foreach ($raw as $id => $config) {
            if (is_string($id) && is_array($config)) {
                $normalized = $this->_normalize($id, $config, $config);
                $normalized['source'] = self::SOURCE_PROJECT_CONFIG;
                $this->configs[$id] = $normalized;
            }
        }

        // Files fill gaps only. Same ID in both is a developer mistake, not a merge — Project
        // Config keeps the seat and the file is left on the shelf with a warning, rather than
        // the CP silently losing an edit the next time the file is read.
        foreach ($this->_readFileConfigs() as $id => $file) {
            if (isset($this->configs[$id])) {
                Craft::warning(
                    "Vizy Editor Config file `{$file['filename']}` is ignored because Project Config already owns “{$id}”.",
                    __METHOD__,
                );
                continue;
            }
            try {
                $normalized = $this->_normalize($id, $file['config'], null);
            } catch (Throwable $exception) {
                // Vizy 3 files used buttons/formatting. Convert in-memory so upgrades keep
                // working without rewriting every project’s config/vizy/*.json on day one.
                try {
                    $authorable = (new \verbb\vizy\legacy\ManualEditorConfigMigrator())
                        ->toAuthorablePayload($file['config'], "file:{$id}");
                    $normalized = $this->_normalize($id, $authorable, null);
                } catch (Throwable $conversionException) {
                    Craft::warning(
                        "Vizy Editor Config file `{$file['filename']}` could not be loaded: {$exception->getMessage()} (V3 convert: {$conversionException->getMessage()})",
                        __METHOD__,
                    );
                    continue;
                }
            }
            $normalized['source'] = self::SOURCE_FILE;
            $normalized['filename'] = $file['filename'];
            $this->configs[$id] = $normalized;
            $this->fileNames[$id] = $file['filename'];
        }

        ksort($this->configs);
        return $this->configs;
    }

    public function getConfig(?string $id): ?array
    {
        if (!$id) {
            return null;
        }
        return $this->getAllConfigs()[$id] ?? null;
    }

    public function isFileConfig(?string $id): bool
    {
        if (!$id) {
            return false;
        }
        $config = $this->getConfig($id);

        return ($config['source'] ?? null) === self::SOURCE_FILE;
    }

    /**
     * Whether `config/vizy/{id}.json` exists on disk, regardless of whether Project Config also
     * claims the ID. Used to refuse *creating* a Project Config entry that would leave a
     * shadowed file behind; an existing Project Config entry remains editable when a colliding
     * file appears (the file stays ignored, with a warning).
     */
    public function fileOwnsId(string $id): bool
    {
        return isset($this->_readFileConfigs()[$id]);
    }

    /**
     * Raw contents of `config/vizy/{id}.json`, or null when the ID is not file-backed.
     * Returned as stored on disk so the CP inspect screen matches what an author would edit.
     */
    public function fileContents(string $id): ?string
    {
        $file = $this->_readFileConfigs()[$id] ?? null;
        if ($file === null) {
            return null;
        }

        $path = Craft::$app->getPath()->getConfigPath()
            . DIRECTORY_SEPARATOR . self::FILE_CONFIG_DIR
            . DIRECTORY_SEPARATOR . $file['filename'];
        if (!is_file($path)) {
            return null;
        }

        $contents = file_get_contents($path);

        return $contents === false ? null : $contents;
    }

    public function getOptions(): array
    {
        return array_values(array_map(
            static function(string $id, array $config): array {
                $label = (string)$config['label'];
                // Provenance in the select itself, so a field settings screen that never opens
                // the Editor Configs index still tells an author which ones are on disk.
                if (($config['source'] ?? null) === self::SOURCE_FILE) {
                    $label .= ' (' . Craft::t('vizy', 'file') . ')';
                }

                return [
                    'label' => $label,
                    'value' => $id,
                ];
            },
            array_keys($this->getAllConfigs()),
            $this->getAllConfigs(),
        ));
    }

    /**
     * Stable hash of the authorable surface after full normalize (toolbar shims included).
     * Used to dedupe minted manual configs against PC + file configs.
     */
    public function fingerprintAuthorable(array $config): string
    {
        $label = trim((string)($config['label'] ?? ''));
        if ($label === '') {
            $config['label'] = 'Imported manual config';
        }
        $normalized = $this->_normalize('fingerprint', $config, null);
        return hash('sha256', $this->_stableJson($this->authorablePayload($normalized)));
    }

    public function saveConfig(string $id, array $config): bool
    {
        $baseline = Craft::$app->getProjectConfig()->get(self::PROJECT_CONFIG_PATH . '.' . $id);
        // Creating under a file's ID would leave that file permanently shadowed. Updating an
        // existing Project Config entry is fine — the colliding file stays ignored.
        if ($baseline === null && $this->fileOwnsId($id)) {
            throw new RuntimeException(
                "Vizy Editor Config “{$id}” is owned by a file in config/" . self::FILE_CONFIG_DIR . '/. Rename or remove the file before saving it in Project Config.',
            );
        }
        // Persist the authorable surface; getAllConfigs() re-normalizes on read.
        $normalized = $this->_normalize($id, $config, is_array($baseline) ? $baseline : null);
        Craft::$app->getProjectConfig()->set(
            self::PROJECT_CONFIG_PATH . '.' . $id,
            $this->authorablePayload($normalized),
        );
        $this->invalidate();
        return true;
    }

    public function removeConfig(string $id): void
    {
        if ($this->isFileConfig($id)) {
            throw new RuntimeException(
                "Vizy Editor Config “{$id}” lives in a file and cannot be deleted from the control panel.",
            );
        }
        Craft::$app->getProjectConfig()->remove(self::PROJECT_CONFIG_PATH . '.' . $id);
        $this->invalidate();
    }

    /**
     * Authorable payload taken from a loaded config, suitable for seeding saves or the Advanced
     * JSON tab. Drops resolved/runtime keys (`source`, `filename`, `schema`, …).
     */
    public function authorablePayload(array $config): array
    {
        $dropdowns = $config['dropdowns'] ?? [];
        // Empty must stay an object shape (`{}`), not a list (`[]`) — normalize refuses a
        // list, and PHP's empty array is ambiguous between the two once it hits JSON.
        if ($dropdowns === [] || !is_array($dropdowns) || array_is_list($dropdowns)) {
            $dropdowns = null;
        }

        $payload = [
            'label' => (string)($config['label'] ?? ''),
            'capabilities' => [
                'nodes' => array_values($config['capabilities']['nodes'] ?? []),
                'marks' => array_values($config['capabilities']['marks'] ?? []),
                'extensions' => array_values($config['capabilities']['extensions'] ?? []),
            ],
            'headings' => [
                'levels' => array_values($config['headings']['levels'] ?? [2, 3, 4]),
            ],
            'toolbar' => array_values($config['toolbar'] ?? []),
            'bubble' => $config['bubble'] ?? EditorConfigPresentation::defaultBubble(),
            // Insertion chrome — independent of toolbar `addBlock` placement.
            'gutterInsert' => (bool)($config['gutterInsert'] ?? true),
            'slashInsert' => (bool)($config['slashInsert'] ?? true),
        ];
        if ($dropdowns !== null) {
            $payload['dropdowns'] = $dropdowns;
        }

        return $payload;
    }

    /**
     * Normalize a runtime event's authorable config through the same contract as a stored config.
     */
    public function normalizeRuntimeConfig(string $id, array $config): array
    {
        return $this->_normalize($id, $config, null);
    }

    public function ensureStandardConfig(): void
    {
        if (Craft::$app->getProjectConfig()->get(self::PROJECT_CONFIG_PATH . '.' . self::DEFAULT_ID) === null) {
            Craft::$app->getProjectConfig()->set(
                self::PROJECT_CONFIG_PATH . '.' . self::DEFAULT_ID,
                $this->_standardConfig(),
            );
        }
        $this->invalidate();
    }

    public function handleChangedConfig(ConfigEvent $event): void
    {
        $this->_ensureExternalPreflight();
        $this->invalidate();
    }

    public function handleDeletedConfig(ConfigEvent $event): void
    {
        $this->_ensureExternalPreflight();
        $this->invalidate();
    }

    public function preflightExternalConfigs(array $incoming): void
    {
        $baseline = Craft::$app->getProjectConfig()->get(self::PROJECT_CONFIG_PATH) ?? [];
        foreach ($incoming as $id => $config) {
            if (!is_string($id) || !is_array($config)) {
                throw new RuntimeException('Incoming Vizy Editor Config schema must be an ID-keyed map.');
            }
            $this->_normalize($id, $config, is_array($baseline[$id] ?? null) ? $baseline[$id] : null);
        }
    }

    public function validateFieldReference(VizyField $field): bool
    {
        $id = $field->editorConfig !== '' ? $field->editorConfig : self::DEFAULT_ID;
        if ($this->getConfig($id)) {
            return true;
        }

        // Only the immutable existing Project Config value may preserve a
        // removed config reference; posted/browser state cannot create trust.
        $baseline = is_string($field->uid) && $field->uid !== ''
            ? Craft::$app->getProjectConfig()->get("fields.{$field->uid}.settings.editorConfig")
            : null;
        if (is_string($baseline) && hash_equals($baseline, $id)) {
            return true;
        }
        $field->addError('editorConfig', "Unknown Vizy Editor Config: {$id}.");
        return false;
    }

    public function getFieldDiagnostics(VizyField $field): array
    {
        $id = $field->editorConfig !== '' ? $field->editorConfig : self::DEFAULT_ID;
        return $this->getConfig($id) ? [] : [['code' => 'missingEditorConfig', 'id' => $id]];
    }

    public function invalidate(): void
    {
        $this->configs = null;
        $this->fileNames = null;
        $this->fileConfigs = null;
        if (\verbb\vizy\Vizy::$plugin?->has('editorManifests')) {
            \verbb\vizy\Vizy::$plugin->getEditorManifests()->invalidate();
        }
    }


    // Private Methods
    // =========================================================================

    /**
     * JSON files under `config/vizy/`, keyed by a valid config ID derived from the filename.
     *
     * The filename stem is the ID (`minimal.json` → `minimal`). Label may be omitted and is then
     * derived from the stem, so a hand-written file need not invent one. An empty `dropdowns`
     * list is treated as absent: hand-written JSON often writes `[]` for "no trims", and refusing
     * that would make the dual path brittle for no gain.
     */
    private function _readFileConfigs(): array
    {
        if ($this->fileConfigs !== null) {
            return $this->fileConfigs;
        }

        $dir = Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . self::FILE_CONFIG_DIR;
        if (!is_dir($dir)) {
            return $this->fileConfigs = [];
        }

        try {
            $paths = FileHelper::findFiles($dir, [
                'only' => ['*.json'],
                'recursive' => false,
            ]);
        } catch (Throwable) {
            return $this->fileConfigs = [];
        }

        $files = [];
        foreach ($paths as $path) {
            $filename = basename($path);
            $id = pathinfo($filename, PATHINFO_FILENAME);
            if (!preg_match('/^[a-z][a-z0-9_-]*$/', $id)) {
                Craft::warning(
                    "Vizy Editor Config file `{$filename}` is ignored because its name is not a valid Config ID.",
                    __METHOD__,
                );
                continue;
            }

            try {
                $decoded = Json::decode((string)file_get_contents($path));
            } catch (Throwable $exception) {
                Craft::warning(
                    "Vizy Editor Config file `{$filename}` is not valid JSON: {$exception->getMessage()}",
                    __METHOD__,
                );
                continue;
            }
            if (!is_array($decoded) || array_is_list($decoded)) {
                Craft::warning(
                    "Vizy Editor Config file `{$filename}` must contain a JSON object.",
                    __METHOD__,
                );
                continue;
            }

            // `[]` means "no trims" in hand-written JSON; the stored shape is an object.
            if (array_key_exists('dropdowns', $decoded) && is_array($decoded['dropdowns']) && array_is_list($decoded['dropdowns'])) {
                unset($decoded['dropdowns']);
            }

            if (trim((string)($decoded['label'] ?? '')) === '') {
                $decoded['label'] = StringHelper::toTitleCase(str_replace(['-', '_'], ' ', $id));
            }

            $files[$id] = [
                'filename' => $filename,
                'config' => $decoded,
            ];
        }

        return $this->fileConfigs = $files;
    }

    private function _normalize(string $id, array $config, ?array $baseline): array
    {
        if (!preg_match('/^[a-z][a-z0-9_-]*$/', $id)) {
            throw new RuntimeException("Invalid Vizy Editor Config ID: {$id}.");
        }
        $unknownKeys = array_diff(array_keys($config), ['label', 'capabilities', 'headings', 'toolbar', 'dropdowns', 'bubble', 'gutterInsert', 'slashInsert', 'dateModified']);
        if ($unknownKeys !== []) {
            throw new RuntimeException("Unknown Vizy Editor Config keys for {$id}: " . implode(', ', $unknownKeys) . '.');
        }
        $label = trim((string)($config['label'] ?? ''));
        if ($label === '') {
            throw new RuntimeException("Vizy Editor Config {$id} requires a label.");
        }
        $capabilities = $config['capabilities'] ?? [];
        if (!is_array($capabilities)) {
            throw new RuntimeException("Vizy Editor Config {$id} capabilities must be an object.");
        }
        if ($keys = array_diff(array_keys($capabilities), ['nodes', 'marks', 'extensions'])) {
            throw new RuntimeException("Unknown Vizy Editor Config capability keys for {$id}: " . implode(', ', $keys) . '.');
        }
        $nodes = $this->_normalizeIds($capabilities['nodes'] ?? [], "{$id} node");
        $marks = $this->_normalizeIds($capabilities['marks'] ?? [], "{$id} mark");
        $capabilityExtensions = $this->_normalizeIds($capabilities['extensions'] ?? [], "{$id} extension");
        $baselineCapabilities = is_array($baseline['capabilities'] ?? null) ? $baseline['capabilities'] : [];
        $baselineNodes = is_array($baselineCapabilities['nodes'] ?? null) ? $baselineCapabilities['nodes'] : [];
        $baselineMarks = is_array($baselineCapabilities['marks'] ?? null) ? $baselineCapabilities['marks'] : [];
        $baselineExtensions = is_array($baselineCapabilities['extensions'] ?? null) ? $baselineCapabilities['extensions'] : [];

        $activeNodes = [];
        $activeMarks = [];
        $activeExtensions = [];
        $diagnostics = [];
        foreach ([
            'node' => [$nodes, $baselineNodes, &$activeNodes],
            'mark' => [$marks, $baselineMarks, &$activeMarks],
            'extension' => [$capabilityExtensions, $baselineExtensions, &$activeExtensions],
        ] as $kind => $values) {
            [$requested, $existing, &$active] = $values;
            foreach ($requested as $name) {
                $definition = \verbb\vizy\Vizy::$plugin->getExtensions()->getDefinition($kind, $name);
                if ($definition && $definition['installed'] && $definition['authorSelectable']) {
                    $active[] = $name;
                } elseif (in_array($name, $existing, true)) {
                    $diagnostics[] = ['code' => 'missingExtension', 'kind' => $kind, 'name' => $name];
                } else {
                    throw new RuntimeException("Unknown or non-selectable Vizy capability {$kind}:{$name} in {$id}.");
                }
            }
        }

        $headings = $config['headings'] ?? [];
        if (!is_array($headings)) {
            throw new RuntimeException("Vizy Editor Config {$id} headings must be an object.");
        }
        // `defaultLevel` is accepted and discarded rather than rejected. It was the level a bare
        // Heading button applied, and both are gone: a heading button names its level. Stored
        // configs still carrying it are cleaned on the way through, as retired toolbar tokens
        // are, because refusing to load would brick an install over a value nothing reads.
        if ($keys = array_diff(array_keys($headings), ['levels', 'defaultLevel'])) {
            throw new RuntimeException("Unknown Vizy Editor Config heading keys for {$id}: " . implode(', ', $keys) . '.');
        }
        $levels = array_values(array_unique(array_map('intval', $headings['levels'] ?? [2, 3, 4])));
        sort($levels);
        foreach ($levels as $level) {
            if ($level < 1 || $level > 6) {
                throw new RuntimeException("Vizy Editor Config {$id} heading levels must be 1–6.");
            }
        }

        // The levels are the heading setting, so allowing none allows no headings — which the
        // edit screen has always claimed and nothing enforced. Resolved from the selection
        // rather than folded into it: `capabilities` is what the author ticked and must survive
        // a round trip, so Heading stays ticked and it is the *schema* that comes out without
        // it. Anything else and opening a config with no levels would quietly untick Heading.
        $schemaNodes = $levels === []
            ? array_values(array_filter($activeNodes, static fn(string $name): bool => $name !== 'heading'))
            : $activeNodes;

        $resolved = \verbb\vizy\Vizy::$plugin->getExtensions()->resolveEnabled($schemaNodes, $activeMarks, $activeExtensions);

        $toolbar = $this->_normalizeToolbar($id, $config['toolbar'] ?? null);
        $dropdowns = $this->_normalizeDropdowns($id, $config['dropdowns'] ?? null, $toolbar);
        $bubble = $this->_normalizeBubble($id, $config['bubble'] ?? null);

        // Two different lists, and conflating them was a round-trip bug: `capabilities` is
        // the author's selection — exactly what the edit screen's checkboxes stand for and
        // what a save posts back — while `schema` is what that selection resolves to once
        // dependencies, implications and always-on capabilities are pulled in. Handing the
        // resolved list back to the form made it post internal nodes (`doc`, `text`) that
        // validation then rejected as non-selectable.
        $payload = [
            'id' => $id,
            'label' => $label,
            'capabilities' => [
                'nodes' => $activeNodes,
                'marks' => $activeMarks,
                'extensions' => $activeExtensions,
            ],
            'schema' => [
                'nodes' => $resolved['nodes'],
                'marks' => $resolved['marks'],
                'extensions' => $resolved['extensions'],
                'internalNodes' => $resolved['internalNodes'],
            ],
            'headings' => ['levels' => $levels],
            'toolbar' => $toolbar,
            'dropdowns' => $dropdowns,
            'bubble' => $bubble,
            // Default on — missing keys (older PC / file configs) stay enabled.
            'gutterInsert' => (bool)($config['gutterInsert'] ?? true),
            'slashInsert' => (bool)($config['slashInsert'] ?? true),
            'modules' => $resolved['modules'],
            'diagnostics' => $diagnostics,
        ];
        $hashPayload = $payload;
        unset($hashPayload['diagnostics']);
        $payload['hash'] = hash('sha256', $this->_stableJson($hashPayload));
        $payload['revision'] = '1:' . $payload['hash'];
        return $payload;
    }

    private function _normalizeIds(mixed $values, string $label): array
    {
        if (!is_array($values) || !array_is_list($values)) {
            throw new RuntimeException("Vizy Editor Config {$label} IDs must be a list.");
        }
        $normalized = array_map('strval', $values);
        if (count($normalized) !== count(array_unique($normalized))) {
            throw new RuntimeException("Duplicate Vizy Editor Config {$label} ID.");
        }
        return $normalized;
    }

    /**
     * A toolbar is a flat list of IDs, some of which are dropdowns.
     *
     * A dropdown used to be an object here — `{dropdown, items}`, and before that a label, a
     * glyph and a member list an author had built. Both collapsed to a `dropdown:` prefixed ID,
     * and it stays one now that membership is editable again: what a dropdown holds lives in
     * `dropdowns`, keyed by name, so this list is order and presence and nothing else. See
     * `normalizeDropdowns`.
     *
     * A button naming a capability the config does not allow is *not* an error here, and
     * used to be. The toolbar and the capabilities are two independent lists an author
     * edits at different moments: untick Quote and the Quote button simply stops being
     * rendered — see `controlFor`, which drops what it cannot resolve. Refusing to save
     * instead meant the two sections had to be kept in step by hand, or by pruning one from
     * behind the author's back, and neither is worth the strictness for a toolbar that can
     * only ever render less than it names.
     */
    private function _normalizeToolbar(string $id, mixed $toolbar): array
    {
        if ($toolbar === null) {
            return EditorConfigPresentation::defaultToolbar();
        }
        if (!is_array($toolbar) || !array_is_list($toolbar)) {
            throw new RuntimeException("Vizy Editor Config {$id} toolbar must be a list.");
        }

        $normalized = [];
        foreach ($toolbar as $item) {
            // Every dropdown shape from before the contents were frozen lands here, and is
            // dropped rather than rejected: there is no honest way to turn a member list back
            // into an identity, and an unopenable settings screen is a worse answer than a
            // toolbar missing a dropdown an author can put back in one drag.
            if (is_array($item)) {
                continue;
            }
            if (!is_string($item) || $item === '') {
                throw new RuntimeException("Vizy Editor Config {$id} toolbar items must be strings.");
            }
            // Vizy 3 spellings (`h2`, `align-left`, …) → canonical before retired /
            // member-only checks so shims are not silently discarded as unknown.
            $item = VizyToolbarTokenDeprecations::canonicalize($item, "Editor Config {$id} toolbar");
            // Retired tokens are dropped, not rejected — see RETIRED_TOOLBAR_IDS.
            if (in_array($item, EditorConfigPresentation::RETIRED_TOOLBAR_IDS, true)) {
                continue;
            }
            // So is a control a dropdown owns. Same treatment for the same reason: a Vizy 3
            // toolbar naming `h2` or `align-left` is a config that should open with those
            // buttons missing, not one that refuses to load. See MEMBER_ONLY_IDS — this is the
            // only place a toolbar's vocabulary is narrower than the catalog's.
            if (EditorConfigPresentation::isMemberOnlyToolbarId($item)) {
                continue;
            }
            // As is a dropdown whose registration has gone away, along with the plugin that
            // registered it. Kept out here rather than left to render as nothing, so a toolbar
            // does not carry a token nothing can explain.
            $prefix = EditorConfigPresentation::DROPDOWN_PREFIX;
            if (str_starts_with($item, $prefix)) {
                // Renames are followed rather than treated as a disappearance, which from here
                // they are indistinguishable from. See `DROPDOWN_ALIASES`.
                $name = EditorConfigPresentation::dropdownAlias(substr($item, strlen($prefix)));
                if (EditorConfigPresentation::dropdownRoster($name) === null) {
                    continue;
                }
                $item = $prefix . $name;
                // A rename can collide with the new name already being present, and a toolbar
                // holds one of each dropdown.
                if (in_array($item, $normalized, true)) {
                    continue;
                }
            }
            $normalized[] = $item;
        }

        return $normalized;
    }

    /**
     * What each placed dropdown holds, keyed by dropdown name.
     *
     * Vizy 3's `formatting` and `table` options, generalised: any registered dropdown may be
     * trimmed, and this is where the result lives. Separate from `toolbar` rather than nested
     * into it because the two are different decisions — where a dropdown sits, and what is in it
     * — and keeping the toolbar a flat list of IDs means the drag that reorders the strip never
     * has to touch membership.
     *
     * Absent is not empty. A dropdown with no entry here holds whatever it ships with, so a
     * hand-written `{"toolbar": ["dropdown:formatting"]}` gets the full menu, and a config that
     * has never opened a dropdown keeps following its registration. An explicitly empty list is
     * a config that has emptied it, which the builder does not allow and nothing has ever
     * stored — so it is refused here rather than silently rendering a dropdown that opens onto
     * nothing, which is what "remove the dropdown" is for.
     *
     * Two things are dropped rather than refused, both for the same reason as elsewhere: a
     * dropdown whose registration has gone away with its plugin, and membership for a dropdown
     * this toolbar does not place. Neither is worth failing a load over, and pruning the second
     * means removing a dropdown and dragging it back in starts from the registration again.
     *
     * Members *are* checked against the registered roster, which is the reversal that makes the
     * rest of this coherent. A membership was briefly a list an author could compose from any
     * button, and the question that killed it was Alignment: nobody wants to add a fifth item to
     * a menu of four alignments, and a great many people want to take Justify out of it. What a
     * dropdown may hold is a design decision belonging to whoever registered it; which of those
     * a config offers is the author's. So this can only ever subtract, and an ID outside the
     * roster is dropped. The registry's `headingLevels` shorthand is expanded in place rather
     * than dropped, since a hand-written config may well have copied it from a registration and
     * one build stored it.
     */
    private function _normalizeDropdowns(string $id, mixed $dropdowns, array $toolbar): array
    {
        if ($dropdowns === null) {
            return [];
        }
        if (!is_array($dropdowns) || array_is_list($dropdowns)) {
            throw new RuntimeException("Vizy Editor Config {$id} dropdowns must be an object keyed by dropdown name.");
        }

        $placed = array_fill_keys(array_map(
            static fn(string $item): string => str_starts_with($item, EditorConfigPresentation::DROPDOWN_PREFIX)
                ? substr($item, strlen(EditorConfigPresentation::DROPDOWN_PREFIX))
                : $item,
            $toolbar,
        ), true);

        $normalized = [];
        foreach ($dropdowns as $name => $members) {
            // The toolbar has already been aliased by the time it gets here, so a stored `align`
            // membership has to follow its dropdown's new name or it would look unplaced.
            $name = EditorConfigPresentation::dropdownAlias((string)$name);
            $roster = EditorConfigPresentation::dropdownRoster($name);
            if (!isset($placed[$name]) || $roster === null) {
                continue;
            }
            $members = $this->_normalizeIds($members, "{$id} dropdown {$name} member");
            if ($members === []) {
                throw new RuntimeException("Vizy Editor Config {$id} dropdown {$name} must hold at least one member.");
            }

            $allowed = array_fill_keys($roster, true);
            $kept = [];
            foreach ($members as $member) {
                if ($member === '') {
                    throw new RuntimeException("Vizy Editor Config {$id} dropdown {$name} members must be non-empty strings.");
                }
                // The registry's shorthand, which a hand-written config may reasonably copy from
                // a registration and which one build did store. Expanded in place, so the levels
                // land where the author had them.
                $ids = $member === EditorConfigPresentation::HEADING_LEVELS_TOKEN
                    ? EditorConfigPresentation::HEADING_LEVEL_IDS
                    : [VizyToolbarTokenDeprecations::canonicalize($member, "Editor Config {$id} dropdown {$name}")];

                foreach ($ids as $candidate) {
                    if (!isset($allowed[$candidate]) || in_array($candidate, $kept, true)) {
                        continue;
                    }
                    $kept[] = $candidate;
                }
            }

            // Everything it named was outside the roster, which is not the same as a config
            // that emptied a dropdown on purpose — there is nothing here to honour, so the
            // dropdown falls back to its registration rather than being refused.
            if ($kept !== []) {
                $normalized[$name] = $kept;
            }
        }
        // Sorted so the config hash does not depend on the order the keys were posted in, which
        // the toolbar's own order already carries anyway.
        ksort($normalized);

        return $normalized;
    }

    /**
     * The Bubble Menu, which is a flat list of marks and nothing else.
     *
     * Like the toolbar, a mark the capabilities disallow is kept rather than refused: it
     * simply does not render. See `normalizeToolbar`.
     */
    private function _normalizeBubble(string $id, mixed $bubble): array
    {
        if ($bubble === null) {
            return EditorConfigPresentation::defaultBubble();
        }
        if (!is_array($bubble)) {
            throw new RuntimeException("Vizy Editor Config {$id} bubble must be an object.");
        }
        if ($keys = array_diff(array_keys($bubble), ['enabled', 'items'])) {
            throw new RuntimeException('Unknown Vizy Editor Config bubble keys for ' . $id . ': ' . implode(', ', $keys) . '.');
        }

        $enabled = (bool)($bubble['enabled'] ?? true);
        $items = $bubble['items'] ?? [];
        if (!is_array($items) || !array_is_list($items)) {
            throw new RuntimeException("Vizy Editor Config {$id} bubble items must be a list.");
        }

        $normalized = [];
        foreach ($items as $item) {
            if (!is_string($item) || $item === '') {
                throw new RuntimeException("Vizy Editor Config {$id} bubble items must be strings.");
            }
            $normalized[] = $item;
        }

        return ['enabled' => $enabled, 'items' => $normalized];
    }

    private function _standardConfig(): array
    {
        return [
            'label' => 'Standard',
            'capabilities' => [
                // Paragraph and Hard break are always-on registry capabilities, so
                // they are resolved in rather than listed here.
                'nodes' => [
                    'heading', 'bulletList', 'orderedList', 'blockquote',
                    'codeBlock', 'horizontalRule', 'image', 'table',
                ],
                'marks' => ['bold', 'italic', 'link'],
            ],
            'headings' => ['levels' => [2, 3, 4]],
            'toolbar' => EditorConfigPresentation::defaultToolbar(),
            'bubble' => EditorConfigPresentation::defaultBubble(),
            'gutterInsert' => true,
            'slashInsert' => true,
        ];
    }

    private function _ensureExternalPreflight(): void
    {
        $projectConfig = Craft::$app->getProjectConfig();
        if ($this->externalPreflightComplete || !$projectConfig->getIsApplyingExternalChanges()) {
            return;
        }
        $incoming = $projectConfig->get(self::PROJECT_CONFIG_PATH, true) ?? [];
        $this->preflightExternalConfigs(is_array($incoming) ? $incoming : []);
        $this->externalPreflightComplete = true;
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
