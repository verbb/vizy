<?php
namespace verbb\vizy\services;

use verbb\vizy\models\BlockSummaryInference;
use verbb\vizy\models\BlockSummaryMedia;
use verbb\vizy\models\BlockSummaryTexts;
use verbb\vizy\models\BlockType;

use craft\fieldlayoutelements\CustomField;
use craft\fields\Assets;
use craft\fields\PlainText;
use craft\models\FieldLayout;

/**
 * Deterministic, cheap extraction from canonical raw field slots.
 *
 * Never mounts FieldLayouts, normalizes Craft fields, or renders frontend Twig.
 */
final class BlockSummaryProjection
{
    // Properties
    // =========================================================================

    private array $inferenceCache = [];


    // Public Methods
    // =========================================================================

    public function inferenceFor(BlockType $type): BlockSummaryInference
    {
        $uid = (string)$type->uid;
        if (isset($this->inferenceCache[$uid])) {
            return $this->inferenceCache[$uid];
        }

        $title = [];
        $subtitle = [];
        $media = [];
        $layout = $type->getFieldLayout();
        if ($layout) {
            foreach ($layout->getCustomFieldElements() as $element) {
                if (!$element instanceof CustomField) {
                    continue;
                }
                $placementUid = (string)$element->uid;
                $field = $element->getField();
                if ($field instanceof PlainText) {
                    $title[] = $placementUid;
                    continue;
                }
                if ($field instanceof Assets) {
                    $settings = $field->settings ?? [];
                    $max = (int)($settings['maxRelations'] ?? $settings['limit'] ?? 1);
                    if ($max <= 0 || $max === 1) {
                        $media[] = $placementUid;
                    }
                }
            }
        }

        // Subtitle candidates are textual placements after the first title candidate.
        if (count($title) > 1) {
            $subtitle = array_slice($title, 1);
            $title = [$title[0]];
        }

        return $this->inferenceCache[$uid] = new BlockSummaryInference(
            titleCandidates: $title,
            subtitleCandidates: $subtitle,
            mediaCandidates: $media,
        );
    }

    public function titleFromSlots(
        BlockType $type,
        array $fieldSlots,
        ?string $explicitPlacementUid,
        BlockSummaryInference $inference,
    ): string {
        $fallback = $type->name !== '' ? $type->name : $type->handle;
        foreach ($this->_candidatePlacements($explicitPlacementUid, $inference->titleCandidates) as $placementUid) {
            $text = $this->_textFromSlot($fieldSlots, $placementUid);
            if ($text !== null && $text !== '') {
                return BlockSummaryTexts::boundTitle($text, $fallback);
            }
        }
        return BlockSummaryTexts::boundTitle(null, $fallback);
    }

    public function subtitleFromSlots(
        array $fieldSlots,
        ?string $explicitPlacementUid,
        BlockSummaryInference $inference,
    ): ?string {
        foreach ($this->_candidatePlacements($explicitPlacementUid, $inference->subtitleCandidates) as $placementUid) {
            $text = $this->_textFromSlot($fieldSlots, $placementUid);
            if ($text !== null && $text !== '') {
                return BlockSummaryTexts::boundSubtitle($text);
            }
        }
        return null;
    }

    public function mediaFromSlots(
        BlockType $type,
        array $fieldSlots,
        ?string $explicitPlacementUid,
        BlockSummaryInference $inference,
        array $assetMetadata,
    ): ?BlockSummaryMedia {
        foreach ($this->_candidatePlacements($explicitPlacementUid, $inference->mediaCandidates) as $placementUid) {
            $reference = $this->_assetReferenceFromSlot($fieldSlots, $placementUid);
            if ($reference === null) {
                continue;
            }
            $meta = $assetMetadata[(string)$reference] ?? null;
            return new BlockSummaryMedia(
                kind: 'asset',
                reference: $reference,
                alt: $meta['alt'] ?? null,
                thumbnailUrl: $meta['thumbnailUrl'] ?? null,
            );
        }
        return null;
    }

    public function placementExists(FieldLayout $layout, ?string $placementUid): bool
    {
        if (!$placementUid) {
            return false;
        }
        foreach ($layout->getCustomFieldElements() as $element) {
            if ((string)$element->uid === $placementUid) {
                return true;
            }
        }
        return false;
    }

    public function reset(): void
    {
        $this->inferenceCache = [];
    }


    // Private Methods
    // =========================================================================

    private function _candidatePlacements(?string $explicit, array $inferred): array
    {
        return array_values(array_unique(array_filter([
            $explicit,
            ...$inferred,
        ])));
    }

    private function _textFromSlot(array $fieldSlots, string $placementUid): ?string
    {
        if (!array_key_exists($placementUid, $fieldSlots)) {
            return null;
        }
        return $this->_plainTextFromRaw($fieldSlots[$placementUid]);
    }

    private function _assetReferenceFromSlot(array $fieldSlots, string $placementUid): int|string|null
    {
        if (!array_key_exists($placementUid, $fieldSlots)) {
            return null;
        }
        $raw = $fieldSlots[$placementUid];
        if (is_int($raw)) {
            return $raw;
        }
        if (is_string($raw) && ctype_digit($raw)) {
            return (int)$raw;
        }
        if (!is_array($raw)) {
            return null;
        }
        $ids = array_values(array_filter($raw, static fn(mixed $item) => is_int($item) || (is_string($item) && ctype_digit($item))));
        if (count($ids) !== 1) {
            return null;
        }
        $id = $ids[0];
        return is_int($id) ? $id : (int)$id;
    }

    private function _plainTextFromRaw(mixed $raw): ?string
    {
        if (is_string($raw) || is_numeric($raw)) {
            return (string)$raw;
        }
        if (!is_array($raw)) {
            return null;
        }
        if (($raw['type'] ?? null) === 'doc' || isset($raw['content'])) {
            return $this->_plainTextFromRichDocument($raw);
        }
        return null;
    }

    private function _plainTextFromRichDocument(array $node, int $depth = 0): ?string
    {
        if ($depth > 8) {
            return null;
        }
        if (($node['type'] ?? null) === 'text' && isset($node['text'])) {
            return (string)$node['text'];
        }
        $parts = [];
        foreach ($node['content'] ?? [] as $child) {
            if (!is_array($child)) {
                continue;
            }
            if (($child['type'] ?? null) === 'vizyBlock') {
                continue;
            }
            $text = $this->_plainTextFromRichDocument($child, $depth + 1);
            if ($text !== null && $text !== '') {
                $parts[] = $text;
            }
        }
        if (!$parts) {
            return null;
        }
        return implode(' ', $parts);
    }
}
