<?php
namespace verbb\vizy\document;

use verbb\vizy\content\RawJson;

use RuntimeException;

/** Patches captured raw placements without invoking document or field normalisers. */
final class RawDocument
{
    // Public Methods
    // =========================================================================

    public function transform(mixed $value, array $schema, callable $visit): mixed
    {
        if ($value === null || $value === '') {
            return $value;
        }
        $encoded = is_string($value);
        $decoded = $encoded ? RawJson::decode($value) : $value;
        if (!is_array($decoded)) {
            throw new RuntimeException('Malformed raw Vizy container.');
        }
        $before = $decoded;
        $seen = [];
        if (array_is_list($decoded)) {
            if (!is_array($schema['legacy'] ?? null)) {
                throw new RuntimeException('Raw Vizy 3 traversal requires captured promotion provenance.');
            }
            $this->_nodes($decoded, $schema, $visit, true, [], $seen);
        } elseif (($decoded['type'] ?? null) === 'doc' && in_array($decoded['attrs']['schemaVersion'] ?? null, [1, 2], true) && is_array($decoded['content'] ?? null)) {
            $this->_nodes($decoded['content'], $schema, $visit, false, ['content'], $seen);
        } else {
            throw new RuntimeException('Unsupported raw Vizy document version or envelope.');
        }
        if (RawJson::same($before, $decoded)) {
            return $value;
        }
        return $encoded ? RawJson::encode(RawJson::preserve($value, $decoded)) : $decoded;
    }


    // Private Methods
    // =========================================================================

    private function _nodes(array &$nodes, array $schema, callable $visit, bool $legacy, array $path, array &$seen): void
    {
        foreach ($nodes as $index => &$node) {
            if (!is_array($node) || !is_string($node['type'] ?? null)) {
                throw new RuntimeException('Malformed Vizy node during raw traversal.');
            }
            $nodePath = [...$path, $index];
            if ($node['type'] !== 'vizyBlock') {
                if (isset($node['content'])) {
                    $this->_nodes($node['content'], $schema, $visit, $legacy, [...$nodePath, 'content'], $seen);
                }
                continue;
            }
            $attrs = &$node['attrs'];
            $blockUid = $legacy ? ($attrs['id'] ?? null) : ($attrs['blockUid'] ?? null);
            if (!is_string($blockUid) || isset($seen[$blockUid])) {
                throw new RuntimeException('Missing or ambiguous raw Vizy block identity.');
            }
            $seen[$blockUid] = true;
            $mapping = $legacy ? ($schema['legacy'][$attrs['values']['type'] ?? ''] ?? null) : null;
            $typeUid = $legacy ? ($mapping['blockTypeUid'] ?? null) : ($attrs['blockTypeUid'] ?? null);
            if (!is_string($typeUid) || !array_key_exists($typeUid, $schema['types'])) {
                throw new RuntimeException('Missing captured Vizy block type identity.');
            }
            if ($legacy) {
                $slots = &$attrs['values']['content']['fields'];
            } else {
                $slots = &$attrs['fieldSlots'];
            }
            // The structural field map is traversable; its opaque values keep
            // their JSON object/list identity for the replacement callback.
            $objectSlots = $slots instanceof \stdClass;
            if ($objectSlots) {
                $slots = (array)$slots;
            }
            if (!is_array($slots)) {
                throw new RuntimeException('Malformed raw Vizy field map.');
            }
            foreach ($slots as $key => $raw) {
                $placementUid = $legacy ? ($mapping['placementUids'][$key] ?? null) : $key;
                $placement = $schema['types'][$typeUid][$placementUid ?? ''] ?? null;
                // Orphaned slots remain opaque unless the caller captured their identity.
                if (!$placement) {
                    continue;
                }
                $change = $visit($raw, $placement, ['kind' => 'vizy', 'blockUid' => $blockUid, 'blockTypeUid' => $typeUid,
                    'placementUid' => $placementUid, 'storedKey' => $key, 'nodePath' => $nodePath,
                    'enabled' => $attrs['enabled'] ?? $attrs['values']['enabled'] ?? true, 'representation' => $legacy ? 'v3' : 'canonical']);
                if ($change['action'] === 'remove') {
                    unset($slots[$key]);
                } elseif ($change['action'] === 'replace') {
                    $slots[$key] = $change['value'];
                }
            }
            if ($objectSlots) {
                $slots = (object)$slots;
            }
            unset($slots);
        }
    }
}
