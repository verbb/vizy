<?php
namespace verbb\vizy\document;

/**
 * Upgrades self-describing canonical envelopes only.
 *
 * Bare Vizy 3 lists require schema context and are converted before this seam.
 */
final class DocumentUpgrader
{
    // Vizy 1 persisted TipTap's snake-case ListItem name. TipTap 2+ calls the
    // same node listItem and refuses to construct the whole document when the
    // old spelling reaches its schema.
    private const LEGACY_NODE_TYPES = [
        'list_item' => 'listItem',
    ];

    // Public Methods
    // =========================================================================

    public function upgrade(array $data): array
    {
        $version = $this->detectVersion($data);

        if ($version > VizyDocument::CURRENT_SCHEMA_VERSION) {
            throw new UnsupportedDocumentVersionException($version, VizyDocument::CURRENT_SCHEMA_VERSION);
        }

        if ($version !== VizyDocument::CURRENT_SCHEMA_VERSION) {
            throw new InvalidDocumentException("Unsupported canonical Vizy document schema version {$version}.");
        }

        // ProseMirror's Node.toJSON() omits empty `content` arrays. TipTap getJSON()
        // does the same, so clearing a field posts `{type:doc,attrs:…}` with no
        // content key. Canonical envelopes always carry an explicit list.
        if (!array_key_exists('content', $data)) {
            $data['content'] = [];
        }

        // Heal Vizy 3 TipTap quirks that may already be inside a promoted envelope
        // (empty `text` on non-text nodes; listItem with bare inline children).
        if (is_array($data['content']) && array_is_list($data['content'])) {
            $data['content'] = $this->_sanitizeContent($data['content']);
        }

        return $data;
    }

    public function detectVersion(array $data): int
    {
        if (($data['type'] ?? null) !== 'doc') {
            throw new InvalidDocumentException('Expected a self-describing canonical Vizy document envelope.');
        }

        $attrs = $data['attrs'] ?? null;
        $version = is_array($attrs) ? ($attrs['schemaVersion'] ?? null) : null;

        if (!is_int($version) || $version < 1) {
            throw new InvalidDocumentException('Canonical Vizy documents require a positive integer attrs.schemaVersion.');
        }

        return $version;
    }


    // Private Methods
    // =========================================================================

    private function _sanitizeContent(array $nodes, ?string $parentType = null): array
    {
        foreach ($nodes as $index => $node) {
            if (!is_array($node)) {
                continue;
            }

            $type = $node['type'] ?? null;

            if (
                is_string($type)
                && in_array($parentType, ['bulletList', 'orderedList'], true)
                && isset(self::LEGACY_NODE_TYPES[$type])
            ) {
                $node['type'] = self::LEGACY_NODE_TYPES[$type];
            }

            if (($node['type'] ?? null) !== 'text' && array_key_exists('text', $node)) {
                unset($node['text']);
            }

            if (in_array($node['type'] ?? null, ['listItem', 'taskItem', 'footnoteItem'], true)) {
                $content = $node['content'] ?? [];

                if (!is_array($content) || $content === []) {
                    $node['content'] = [['type' => 'paragraph']];
                } else {
                    $firstType = is_array($content[0] ?? null) ? ($content[0]['type'] ?? null) : null;

                    if ($firstType !== 'paragraph') {
                        $node['content'] = [[
                            'type' => 'paragraph',
                            'content' => $content,
                        ]];
                    }
                }
            }

            // DetailsContent uses TipTap's `block+` grammar. Older Vizy 4 beta
            // saves could trim its sole empty paragraph, leaving a canonical
            // node that TipTap could preserve only as unsupported content.
            if (($node['type'] ?? null) === 'detailsContent') {
                $content = $node['content'] ?? [];

                if (!is_array($content) || $content === []) {
                    $node['content'] = [['type' => 'paragraph']];
                }
            }

            // vizyBlock is a TipTap leaf — Hosted nesting lives in fieldSlots only.
            // Strip leftover TipTap children (pre-leaf schema / CA-era payloads) so
            // normalizeValue can open entries instead of hard-failing the CP.
            if (($node['type'] ?? null) === 'vizyBlock') {
                unset($node['content']);
            } elseif (isset($node['content']) && is_array($node['content']) && array_is_list($node['content'])) {
                $childParentType = is_string($node['type'] ?? null) ? $node['type'] : null;
                $node['content'] = $this->_sanitizeContent($node['content'], $childParentType);
            }

            $nodes[$index] = $node;
        }

        return $nodes;
    }
}
