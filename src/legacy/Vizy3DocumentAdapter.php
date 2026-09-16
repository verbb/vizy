<?php
namespace verbb\vizy\legacy;

use verbb\vizy\document\VizyDocument;

/**
 * Strictly converts Vizy 3 storage only after schema promotion is known.
 */
final class Vizy3DocumentAdapter
{
    // Public Methods
    // =========================================================================

    public function convert(array $legacyNodes, array $schemaMap): array
    {
        if (!array_is_list($legacyNodes)) {
            throw new LegacyDocumentConversionException('Legacy Vizy content must be a bare root node list.');
        }

        $seenBlockUids = [];
        $content = [];
        foreach ($legacyNodes as $index => $node) {
            $content[] = $this->_convertNode($node, $schemaMap, $seenBlockUids, "content.{$index}");
        }

        return [
            'type' => 'doc',
            'attrs' => ['schemaVersion' => VizyDocument::CURRENT_SCHEMA_VERSION],
            'content' => $content,
        ];
    }


    // Private Methods
    // =========================================================================

    private function _convertNode(mixed $node, array $schemaMap, array &$seenBlockUids, string $path): array
    {
        if (!is_array($node) || !is_string($node['type'] ?? null) || $node['type'] === '') {
            throw new LegacyDocumentConversionException("Malformed legacy node at {$path}.");
        }

        if ($node['type'] === 'vizyBlock') {
            return $this->_convertBlock($node, $schemaMap, $seenBlockUids, $path);
        }

        if (isset($node['content'])) {
            if (!is_array($node['content']) || !array_is_list($node['content'])) {
                throw new LegacyDocumentConversionException("Malformed legacy child content at {$path}.");
            }
            foreach ($node['content'] as $index => $child) {
                $node['content'][$index] = $this->_convertNode($child, $schemaMap, $seenBlockUids, "{$path}.content.{$index}");
            }
        }

        if (isset($node['marks'])) {
            if (!is_array($node['marks']) || !array_is_list($node['marks'])) {
                throw new LegacyDocumentConversionException("Malformed legacy marks at {$path}.");
            }
            foreach ($node['marks'] as $index => $mark) {
                if (!is_array($mark)) {
                    throw new LegacyDocumentConversionException("Malformed legacy mark at {$path}.marks.{$index}.");
                }
                $node['marks'][$index] = $this->_convertMark($mark, "{$path}.marks.{$index}");
            }
        }

        if ($node['type'] === 'image') {
            return $this->_convertImage($node, $path);
        }

        return $this->_sanitizeProseNode($node);
    }

    /**
     * Vizy 3 TipTap often stamps empty `text` onto non-text nodes (esp. listItem) and stores
     * list items as bare inline text. Vizy 4 opaque transport + TipTap listItem schema reject both.
     */
    private function _sanitizeProseNode(array $node): array
    {
        if (($node['type'] ?? null) !== 'text' && array_key_exists('text', $node)) {
            unset($node['text']);
        }

        if (($node['type'] ?? null) !== 'listItem') {
            return $node;
        }

        $content = $node['content'] ?? [];
        if (!is_array($content) || $content === []) {
            $node['content'] = [['type' => 'paragraph']];

            return $node;
        }

        $firstType = is_array($content[0] ?? null) ? ($content[0]['type'] ?? null) : null;
        if ($firstType !== 'paragraph') {
            $node['content'] = [[
                'type' => 'paragraph',
                'content' => $content,
            ]];
        }

        return $node;
    }

    /**
     * Vizy 3 TipTap links used href/target; Vizy 4 stores semantic Craft Link attrs.
     */
    private function _convertMark(array $mark, string $path): array
    {
        if (($mark['type'] ?? null) !== 'link') {
            return $mark;
        }

        $attrs = is_array($mark['attrs'] ?? null) ? $mark['attrs'] : [];
        // Already canonical (no href, has type).
        if (isset($attrs['type']) && !array_key_exists('href', $attrs)) {
            return $mark;
        }

        $href = $attrs['href'] ?? $attrs['url'] ?? '';
        if (!is_string($href)) {
            throw new LegacyDocumentConversionException("Legacy link at {$path} has a non-string href.");
        }

        $linkType = 'url';
        $value = $href;
        if (str_starts_with($href, 'mailto:')) {
            $linkType = 'email';
            $value = substr($href, strlen('mailto:'));
        } elseif (str_starts_with($href, 'tel:')) {
            $linkType = 'tel';
            $value = substr($href, strlen('tel:'));
        } elseif (str_starts_with($href, 'sms:')) {
            $linkType = 'sms';
            $value = substr($href, strlen('sms:'));
        }

        $newWindow = ($attrs['target'] ?? null) === '_blank'
            || ($attrs['newWindow'] ?? false) === true;

        $mark['attrs'] = [
            'type' => $linkType,
            'value' => $value,
            'siteMode' => 'current',
            'newWindow' => $newWindow,
        ];

        return $mark;
    }

    /**
     * Vizy 3 images stored src (often `#asset:{id}:…`); Vizy 4 requires assetUid.
     */
    private function _convertImage(array $node, string $path): array
    {
        $attrs = is_array($node['attrs'] ?? null) ? $node['attrs'] : [];
        if (isset($attrs['assetUid']) && !isset($attrs['src'])) {
            return $node;
        }

        $src = is_string($attrs['src'] ?? null) ? $attrs['src'] : '';
        $assetUid = null;
        $assetId = null;
        if (preg_match('/#asset:(\d+)(?::|$)/', $src, $m)) {
            $assetId = (int)$m[1];
        } elseif (isset($attrs['id']) && is_numeric($attrs['id'])) {
            $assetId = (int)$attrs['id'];
        }

        if ($assetId) {
            $uid = \craft\helpers\Db::uidById(\craft\db\Table::ELEMENTS, $assetId);
            if (is_string($uid) && $uid !== '') {
                $assetUid = $uid;
            }
        }

        if ($assetUid === null) {
            // Refuse unresolved images rather than persisting a document with a missing asset.
            throw new LegacyDocumentConversionException(
                "Legacy image at {$path} could not resolve an Asset UID from src “{$src}”."
            );
        }

        $node['attrs'] = [
            'assetUid' => $assetUid,
            'siteMode' => 'current',
            'altMode' => isset($attrs['alt']) && is_string($attrs['alt']) && $attrs['alt'] !== '' ? 'custom' : 'asset',
            'alt' => is_string($attrs['alt'] ?? null) ? $attrs['alt'] : '',
            'title' => is_string($attrs['title'] ?? null) ? $attrs['title'] : '',
            'size' => 'default',
            'transform' => is_string($attrs['transform'] ?? null) ? $attrs['transform'] : '',
        ];

        // V3 stores the image's enclosing link separately from ordinary text marks.
        if (is_string($attrs['url'] ?? null) && $attrs['url'] !== '') {
            $link = $this->_convertMark(['type' => 'link', 'attrs' => [
                'href' => $attrs['url'],
                'target' => $attrs['target'] ?? null,
            ]], $path . '.link')['attrs'];
            if (is_string($attrs['linkClass'] ?? null) && $attrs['linkClass'] !== '') {
                $link['class'] = $attrs['linkClass'];
            }
            $node['attrs']['link'] = $link;
        }

        return $node;
    }

    private function _convertBlock(array $node, array $schemaMap, array &$seenBlockUids, string $path): array
    {
        $attrs = $node['attrs'] ?? [];
        $values = $attrs['values'] ?? [];
        $blockUid = $attrs['id'] ?? null;
        $legacyTypeId = $values['type'] ?? null;

        if (!is_string($blockUid) || $blockUid === '' || isset($seenBlockUids[$blockUid])) {
            throw new LegacyDocumentConversionException("Legacy Block at {$path} has a missing or duplicate instance ID.");
        }
        $seenBlockUids[$blockUid] = true;

        if (!is_string($legacyTypeId) || !isset($schemaMap[$legacyTypeId])) {
            throw new LegacyDocumentConversionException("No explicit Block Type mapping exists for '{$legacyTypeId}' at {$path}.");
        }
        $mapping = $schemaMap[$legacyTypeId];
        if (!is_string($mapping['blockTypeUid'] ?? null) || $mapping['blockTypeUid'] === '') {
            throw new LegacyDocumentConversionException("Block Type mapping '{$legacyTypeId}' is incomplete.");
        }

        // Live Vizy 3 stores the anchor beside `values.type`. Older top-level /
        // values.content forms are accepted into canonical attrs.matrixAnchorUid.
        $matrixAnchorUid = $values['matrixAnchorUid']
            ?? $values['content']['matrixAnchorUid']
            ?? $attrs['matrixAnchorUid']
            ?? null;
        if ($matrixAnchorUid !== null && (!is_string($matrixAnchorUid) || $matrixAnchorUid === '')) {
            throw new LegacyDocumentConversionException("Malformed MatrixAnchor identity at {$path}.");
        }

        $legacyFields = $values['content']['fields'] ?? [];
        if (!is_array($legacyFields)) {
            throw new LegacyDocumentConversionException("Legacy Block fields at {$path} are malformed.");
        }

        $fieldSlots = [];
        foreach ($legacyFields as $legacyPlacement => $value) {
            $canonicalPlacement = $mapping['placementUids'][$legacyPlacement] ?? null;
            if (!is_string($canonicalPlacement) || $canonicalPlacement === '') {
                throw new LegacyDocumentConversionException(
                    "No explicit placement mapping exists for '{$legacyPlacement}' on legacy Block Type '{$legacyTypeId}'."
                );
            }
            if (array_key_exists($canonicalPlacement, $fieldSlots)) {
                throw new LegacyDocumentConversionException(
                    "Multiple legacy placement keys claim canonical placement '{$canonicalPlacement}' on legacy Block Type '{$legacyTypeId}'."
                );
            }
            // Nested Vizy bare lists / JSON strings pass through for runtime convert via the
            // nested field's Documents::normalizeValue + provenance (no bulk entry rewrite).
            // Matrix blobs are omitted from fieldSlots once an anchor exists (Entries live
            // on MatrixAnchor); stale JSON Matrix content may still appear here and is
            // stripped on serialize after saveMatrixField.
            $fieldSlots[$canonicalPlacement] = $value;
        }

        $converted = [
            'type' => 'vizyBlock',
            'attrs' => [
                'blockUid' => $blockUid,
                'blockTypeUid' => $mapping['blockTypeUid'],
                'enabled' => is_bool($attrs['enabled'] ?? null) ? $attrs['enabled'] : true,
                'fieldSlots' => $fieldSlots,
            ],
        ];
        if (is_string($matrixAnchorUid)) {
            $converted['attrs']['matrixAnchorUid'] = $matrixAnchorUid;
        }

        // Vizy 3 Blocks had no nested TipTap children under vizyBlock. Nested
        // payloads live in fieldSlots and convert at runtime via Hosted normalize.
        if (!empty($node['content'])) {
            throw new LegacyDocumentConversionException("Nested legacy Block content at {$path} requires a focused migration mapping.");
        }

        return $converted;
    }
}
