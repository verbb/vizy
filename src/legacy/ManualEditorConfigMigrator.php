<?php
namespace verbb\vizy\legacy;

use verbb\vizy\Vizy;
use verbb\vizy\deprecations\VizyToolbarTokenDeprecations;
use verbb\vizy\helpers\EditorConfigPresentation;

use Craft;
use craft\helpers\Json;
use craft\helpers\StringHelper;

use Throwable;

/**
 * Mints Project Config Editor Configs from Vizy 3 inline “Enter a custom config” JSON.
 *
 * File-backed `config/vizy/*.json` refs are left alone. Dedupes by normalized
 * authorable fingerprint so identical pastes share one config.
 */
final class ManualEditorConfigMigrator
{
    // Public Methods
    // =========================================================================

    /**
     * Plan resolution for one field's settings without writing Project Config.
     *


     *   editorConfig: string,
     *   mint: ?array{id: string, config: array<string,mixed>},
     *   fingerprint: ?string,
     *   diagnostics: list<array{code:string,severity:string,location:string,message:string}>
     * }
     */
    public function plan(array $settings, string $fieldUid): array
    {
        if (($settings['configSelectionMode'] ?? 'choose') !== 'manual') {
            $id = is_string($settings['vizyConfig'] ?? null) ? $settings['vizyConfig'] : '';
            return [
                'editorConfig' => $id,
                'mint' => null,
                'fingerprint' => null,
                'diagnostics' => [],
            ];
        }

        $raw = $settings['manualConfig'] ?? '';
        if (!is_string($raw) || trim($raw) === '') {
            return $this->_fail($fieldUid, 'manualEditorConfigEmpty', 'Inline manual Editor Config is empty; choose a file config or paste valid JSON.');
        }

        try {
            $decoded = Json::decode($raw);
        } catch (Throwable $exception) {
            return $this->_fail($fieldUid, 'manualEditorConfigInvalidJson', 'Inline manual Editor Config is not valid JSON: ' . $exception->getMessage());
        }

        if (!is_array($decoded) || array_is_list($decoded)) {
            return $this->_fail($fieldUid, 'manualEditorConfigInvalidShape', 'Inline manual Editor Config must be a JSON object.');
        }

        try {
            $authorable = $this->toAuthorablePayload($decoded, $fieldUid);
            $fingerprint = Vizy::$plugin->getEditorConfigs()->fingerprintAuthorable($authorable);
            $existingId = $this->_findExistingId($fingerprint);
            if ($existingId !== null) {
                return [
                    'editorConfig' => $existingId,
                    'mint' => null,
                    'fingerprint' => $fingerprint,
                    'diagnostics' => [],
                ];
            }

            if (!Craft::$app->getConfig()->getGeneral()->allowAdminChanges) {
                return $this->_fail(
                    $fieldUid,
                    'manualEditorConfigRequiresAdminChanges',
                    'Inline manual Editor Config needs a new Project Config artifact, but allowAdminChanges is false. Add an equivalent config/vizy/*.json or run the Vizy 3 upgrade where admin changes are allowed.',
                    $fingerprint,
                );
            }

            $id = $this->_mintId($fingerprint);
            return [
                'editorConfig' => $id,
                'mint' => ['id' => $id, 'config' => $authorable],
                'fingerprint' => $fingerprint,
                'diagnostics' => [],
            ];
        } catch (Throwable $exception) {
            return $this->_fail($fieldUid, 'manualEditorConfigConversionFailed', $exception->getMessage());
        }
    }

    /**
     * Persist planned mints (idempotent). Shared fingerprints mint once.
     */
    public function applyMints(array $fieldPlans): void
    {
        $written = [];
        foreach ($fieldPlans as $fieldPlan) {
            $mint = $fieldPlan['editorConfigMint'] ?? null;
            if (!is_array($mint) || !is_string($mint['id'] ?? null) || !is_array($mint['config'] ?? null)) {
                continue;
            }
            $id = $mint['id'];
            if (isset($written[$id])) {
                continue;
            }
            $configs = Vizy::$plugin->getEditorConfigs();
            if ($configs->getConfig($id) !== null) {
                $written[$id] = true;
                continue;
            }
            $configs->saveConfig($id, $mint['config']);
            $written[$id] = true;
        }
    }

    public function toAuthorablePayload(array $legacy, string $context): array
    {
        if (isset($legacy['toolbar']) || isset($legacy['capabilities'])) {
            $payload = [
                'label' => trim((string)($legacy['label'] ?? '')) ?: 'Imported manual config',
                'capabilities' => [
                    'nodes' => array_values($legacy['capabilities']['nodes'] ?? ['paragraph']),
                    'marks' => array_values($legacy['capabilities']['marks'] ?? ['bold', 'italic', 'link']),
                ],
                'headings' => [
                    'levels' => array_values($legacy['headings']['levels'] ?? [2, 3, 4]),
                ],
                'toolbar' => array_values($legacy['toolbar'] ?? EditorConfigPresentation::defaultToolbar()),
                'bubble' => $legacy['bubble'] ?? EditorConfigPresentation::defaultBubble(),
            ];
            if (isset($legacy['dropdowns']) && is_array($legacy['dropdowns']) && !array_is_list($legacy['dropdowns'])) {
                $payload['dropdowns'] = $legacy['dropdowns'];
            }
            return $payload;
        }

        $buttons = is_array($legacy['buttons'] ?? null) ? $legacy['buttons'] : [];
        $formatting = is_array($legacy['formatting'] ?? null) ? $legacy['formatting'] : null;
        $table = is_array($legacy['table'] ?? null) ? $legacy['table'] : null;

        $toolbar = [];
        $needsFormatting = $formatting !== null;
        $needsAlignment = false;
        $needsTable = $table !== null;
        $headingLevels = [];
        // Vizy 3 listed quote/code as loose buttons; Vizy 4 owns them only inside Formatting.
        // Collect them here so we do not drop the capability when MEMBER_ONLY strips the button.
        $formattingMembersFromButtons = [];

        foreach ($buttons as $button) {
            if (!is_string($button) || $button === '') {
                continue;
            }
            $id = VizyToolbarTokenDeprecations::canonicalize($button, "manual Editor Config {$context}");
            if (in_array($id, EditorConfigPresentation::RETIRED_TOOLBAR_IDS, true)) {
                continue;
            }
            if (preg_match('/^heading([1-6])$/', $id, $m)) {
                $needsFormatting = true;
                $headingLevels[] = (int)$m[1];
                continue;
            }
            if ($id === 'paragraph') {
                $needsFormatting = true;
                continue;
            }
            // Same ownership as headings: keep the node, fold into the Formatting roster.
            if (in_array($id, ['blockquote', 'codeBlock'], true)) {
                $needsFormatting = true;
                if (!in_array($id, $formattingMembersFromButtons, true)) {
                    $formattingMembersFromButtons[] = $id;
                }
                continue;
            }
            if (in_array($id, ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'], true)) {
                $needsAlignment = true;
                continue;
            }
            if ($id === 'table' || str_starts_with($id, 'table')) {
                $needsTable = true;
                continue;
            }
            if (EditorConfigPresentation::isMemberOnlyToolbarId($id)) {
                continue;
            }
            if (!in_array($id, $toolbar, true)) {
                $toolbar[] = $id;
            }
        }

        $dropdowns = [];
        if ($needsFormatting) {
            if (!in_array('dropdown:formatting', $toolbar, true)) {
                array_unshift($toolbar, 'dropdown:formatting');
            }
            $members = $formatting !== null
                ? VizyToolbarTokenDeprecations::canonicalizeList(
                    array_values(array_filter($formatting, 'is_string')),
                    "manual Editor Config {$context} formatting",
                )
                : array_values(array_unique([
                    'paragraph',
                    ...array_map(static fn(int $level) => 'heading' . $level, $headingLevels ?: [2, 3, 4]),
                ]));
            // Append button-derived quote/code even when `formatting` was an explicit heading list.
            foreach ($formattingMembersFromButtons as $member) {
                if (!in_array($member, $members, true)) {
                    $members[] = $member;
                }
            }
            if ($members !== []) {
                $dropdowns['formatting'] = $members;
            }
        }
        if ($needsAlignment && !in_array('dropdown:alignment', $toolbar, true)) {
            $toolbar[] = 'dropdown:alignment';
        }
        if ($needsTable) {
            if (!in_array('dropdown:table', $toolbar, true)) {
                $toolbar[] = 'dropdown:table';
            }
            if ($table !== null) {
                $members = VizyToolbarTokenDeprecations::canonicalizeList(
                    array_values(array_filter($table, 'is_string')),
                    "manual Editor Config {$context} table",
                );
                if ($members !== []) {
                    $dropdowns['table'] = $members;
                }
            }
        }

        if ($headingLevels === [] && $formatting !== null) {
            foreach (VizyToolbarTokenDeprecations::canonicalizeList(
                array_values(array_filter($formatting, 'is_string')),
                "manual Editor Config {$context} formatting",
            ) as $member) {
                if (preg_match('/^heading([1-6])$/', $member, $m)) {
                    $headingLevels[] = (int)$m[1];
                }
            }
        }
        $headingLevels = array_values(array_unique($headingLevels ?: [2, 3, 4]));
        sort($headingLevels);

        $payload = [
            'label' => trim((string)($legacy['label'] ?? '')) ?: 'Imported manual config',
            'capabilities' => [
                'nodes' => $this->_inferNodes($toolbar, $dropdowns, $headingLevels),
                'marks' => $this->_inferMarks($toolbar),
            ],
            'headings' => ['levels' => $headingLevels],
            'toolbar' => $toolbar !== [] ? $toolbar : EditorConfigPresentation::defaultToolbar(),
            'bubble' => EditorConfigPresentation::defaultBubble(),
        ];
        if ($dropdowns !== []) {
            $payload['dropdowns'] = $dropdowns;
        }

        // Validate early so analyze fails closed before apply.
        Vizy::$plugin->getEditorConfigs()->fingerprintAuthorable($payload);

        return $payload;
    }


    // Private Methods
    // =========================================================================

    /**

     *   editorConfig: string,
     *   mint: null,
     *   fingerprint: ?string,
     *   diagnostics: list<array{code:string,severity:string,location:string,message:string}>
     * }
     */
    private function _fail(string $fieldUid, string $code, string $message, ?string $fingerprint = null): array
    {
        return [
            'editorConfig' => '',
            'mint' => null,
            'fingerprint' => $fingerprint,
            'diagnostics' => [[
                'code' => $code,
                'severity' => 'error',
                'location' => $fieldUid,
                'message' => $message,
            ]],
        ];
    }

    private function _findExistingId(string $fingerprint): ?string
    {
        $configs = Vizy::$plugin->getEditorConfigs();
        foreach ($configs->getAllConfigs() as $id => $config) {
            if (hash_equals($fingerprint, $configs->fingerprintAuthorable($configs->authorablePayload($config)))) {
                return $id;
            }
        }
        return null;
    }

    private function _mintId(string $fingerprint): string
    {
        $id = 'imported-' . substr($fingerprint, 0, 12);
        if (Vizy::$plugin->getEditorConfigs()->getConfig($id) !== null) {
            $id = 'imported-' . substr($fingerprint, 0, 8) . '-' . strtolower(StringHelper::randomString(4));
        }
        return $id;
    }

    private function _inferNodes(array $toolbar, array $dropdowns, array $headingLevels): array
    {
        $nodes = ['paragraph'];
        $add = static function(string $node) use (&$nodes): void {
            if (!in_array($node, $nodes, true)) {
                $nodes[] = $node;
            }
        };
        if ($headingLevels !== [] || isset($dropdowns['formatting']) || in_array('dropdown:formatting', $toolbar, true)) {
            $add('heading');
        }
        $formattingMembers = $dropdowns['formatting'] ?? [];
        foreach (['bulletList', 'orderedList', 'blockquote', 'codeBlock', 'horizontalRule', 'image', 'table', 'iframe', 'mediaEmbed', 'layout'] as $node) {
            // Quote/code live in Formatting, not the flat toolbar — still enable the node.
            if (in_array($node, $toolbar, true) || in_array($node, $formattingMembers, true)) {
                $add($node);
            }
        }
        if (in_array('dropdown:table', $toolbar, true)) {
            $add('table');
        }
        return $nodes;
    }

    private function _inferMarks(array $toolbar): array
    {
        $marks = [];
        foreach (['bold', 'italic', 'underline', 'strike', 'code', 'link', 'subscript', 'superscript', 'highlight'] as $mark) {
            if (in_array($mark, $toolbar, true)) {
                $marks[] = $mark;
            }
        }
        return $marks !== [] ? $marks : ['bold', 'italic', 'link'];
    }
}
