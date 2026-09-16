<?php
namespace verbb\vizy\services;

use verbb\vizy\document\VizyDocument;

use craft\base\Component;

/**
 * Scans persisted canonical documents for Block Type usage.
 */
final class BlockContentUsages extends Component
{
    // Public Methods
    // =========================================================================

    public function countBlockTypesInDocument(VizyDocument $document): array
    {
        $counts = [];
        foreach ($document->blocks(null) as $block) {
            $uid = $block->blockTypeUid();
            if ($uid === '') {
                continue;
            }
            $counts[$uid] = ($counts[$uid] ?? 0) + 1;
        }
        return $counts;
    }

    public function findBlockTypeUids(VizyDocument $document, string $blockTypeUid): array
    {
        $matches = [];
        foreach ($document->blocks(null) as $block) {
            if ($block->blockTypeUid() === $blockTypeUid) {
                $matches[] = $block->uid();
            }
        }
        return $matches;
    }

    public function findBlockTypeUidsInRaw(array $node, string $blockTypeUid): array
    {
        $matches = [];
        $walk = function(array $current) use (&$walk, &$matches, $blockTypeUid): void {
            if (($current['type'] ?? null) === 'vizyBlock') {
                $attrs = $current['attrs'] ?? [];
                if (($attrs['blockTypeUid'] ?? null) === $blockTypeUid && is_string($attrs['blockUid'] ?? null)) {
                    $matches[] = $attrs['blockUid'];
                }
            }
            foreach ($current['content'] ?? [] as $child) {
                if (is_array($child)) {
                    $walk($child);
                }
            }
        };
        $walk($node);
        return $matches;
    }
}
